#!/usr/bin/env python3
"""
Now-playing helper for the startpage.

A web page can't see what Music.app is playing, so this tiny local server asks
Music.app (through osascript) and answers the startpage on http://127.0.0.1:47615.

  GET  /now               current track as JSON ({"state": "stopped"} when nothing plays)
  GET  /artwork?id=<id>   album art of the current track (exported from Music.app)
  POST /control           body "playpause" | "next" | "previous"
  GET  /                  the startpage itself, served from this checkout

Serving the page from here too gives browsers that refuse to let an https page
talk to a local http server (Safari) a home page that just works:
http://127.0.0.1:47615/ — page and music data then share one origin.

Only the origins in ALLOWED_ORIGINS may read it or control playback, so other
websites you visit can't see what you listen to or pause your music.
It never launches Music.app by itself: when Music isn't open, it reports "stopped".

Standard library only, so it runs on the Python that ships with macOS.
Install as a login item with install.sh; remove with uninstall.sh.
"""

import json
import mimetypes
import os
import subprocess
import tempfile
import threading
import time
import urllib.parse
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

HOST = "127.0.0.1"  # never reachable from other machines
PORT = int(os.environ.get("NOWPLAYING_PORT", "47615"))

# Pages allowed to read and control. "null" is a page opened from a file (file://),
# which may read but not control (sandboxed frames on any site also send "null").
ALLOWED_ORIGINS = {
    "https://tamagonocammy.github.io",
    "http://127.0.0.1:8765",
    "http://localhost:8765",
    # The copy of the startpage this helper serves itself
    f"http://127.0.0.1:{PORT}",
    f"http://localhost:{PORT}",
}
READ_ONLY_ORIGINS = {"null"}
ALLOWED_ORIGINS |= {o.strip() for o in os.environ.get("NOWPLAYING_ORIGINS", "").split(",") if o.strip()}

# The startpage checkout this file lives in (tools/nowplaying/ -> repo root)
SITE_ROOT = os.path.realpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
# Never served: dotfiles/dot-folders (.git, local config) and the helper's own folder
SITE_BLOCKED_TOP = {"tools"}
mimetypes.add_type("text/javascript", ".js")
mimetypes.add_type("image/webp", ".webp")
mimetypes.add_type("font/woff2", ".woff2")

CACHE_DIR = os.path.join(os.path.expanduser("~/Library/Caches"), "startpage-nowplaying")
STATE_TTL = 1.0  # seconds; several open tabs polling at once share one osascript call

# JXA returns JSON directly. Application("Music").running() does not launch Music.
NOW_SCRIPT = r"""
const music = Application("Music");
function read() {
  if (!music.running()) return { state: "stopped" };
  const state = String(music.playerState());
  if (state === "stopped") return { state };
  const info = { state, position: Number(music.playerPosition()) || 0 };
  try {
    const t = music.currentTrack;
    Object.assign(info, {
      id: t.persistentID(),
      title: t.name(),
      artist: t.artist(),
      album: t.album(),
      duration: Number(t.duration()) || 0,
    });
  } catch (e) {
    // Radio streams and some Apple Music items have no readable track
    try { info.title = music.currentStreamTitle(); } catch (e2) {}
  }
  return info;
}
JSON.stringify(read());
"""

# Writes the current track's first artwork to the path given as argument; prints "ok" or "".
ARTWORK_SCRIPT = r"""
on run argv
  set outPath to item 1 of argv
  if application "Music" is not running then return ""
  tell application "Music"
    if player state is stopped then return ""
    set t to current track
    if (count of artworks of t) is 0 then return ""
    set d to raw data of artwork 1 of t
  end tell
  set f to open for access (POSIX file outPath) with write permission
  try
    set eof f to 0
    write d to f
    close access f
  on error
    close access f
    return ""
  end try
  return "ok"
end run
"""

CONTROL_SCRIPTS = {
    # Music's own "playpause" is a silent no-op on recent macOS, so pick pause or play ourselves
    "playpause": 'tell application "Music"\n'
    '  if player state is playing then\n    pause\n  else\n    play\n  end if\n'
    "end tell",
    "next": 'if application "Music" is running then tell application "Music" to next track',
    "previous": 'if application "Music" is running then tell application "Music" to previous track',
}

_lock = threading.Lock()
_state = {"at": 0.0, "data": {"state": "stopped"}}
_artwork = {}  # track id -> {"path": local file} or {"url": remote url} or {} (none found)


def osascript(args, timeout=5):
    try:
        result = subprocess.run(["osascript", *args], capture_output=True, text=True, timeout=timeout)
        return result.stdout.strip()
    except (subprocess.TimeoutExpired, OSError):
        return ""


def image_type(path):
    with open(path, "rb") as f:
        head = f.read(12)
    if head.startswith(b"\x89PNG"):
        return "image/png"
    if head.startswith(b"\xff\xd8"):
        return "image/jpeg"
    if head[:4] == b"RIFF" and head[8:12] == b"WEBP":
        return "image/webp"
    return "application/octet-stream"


def export_artwork(track_id):
    os.makedirs(CACHE_DIR, exist_ok=True)
    path = os.path.join(CACHE_DIR, f"{track_id}.img")
    if os.path.exists(path) and os.path.getsize(path) > 0:
        return path
    # Keep the cache small: drop everything but the newest few covers
    covers = sorted((os.path.join(CACHE_DIR, n) for n in os.listdir(CACHE_DIR)), key=os.path.getmtime)
    for old in covers[:-20]:
        try:
            os.remove(old)
        except OSError:
            pass
    fd, tmp = tempfile.mkstemp(dir=CACHE_DIR)
    os.close(fd)
    if osascript(["-e", ARTWORK_SCRIPT, tmp]) == "ok" and os.path.getsize(tmp) > 0:
        os.replace(tmp, path)
        return path
    os.remove(tmp)
    return None


def lookup_artwork_online(track):
    """Streaming tracks often have no local artwork; ask the public iTunes Search API instead."""
    term = " ".join(filter(None, [track.get("artist"), track.get("album") or track.get("title")]))
    if not term:
        return None
    url = "https://itunes.apple.com/search?" + urllib.parse.urlencode({"term": term, "entity": "album", "limit": 1})
    try:
        with urllib.request.urlopen(url, timeout=3) as response:
            results = json.load(response).get("results", [])
    except Exception:
        return None
    art = results[0].get("artworkUrl100") if results else None
    return art.replace("100x100bb", "600x600bb") if art else None


def artwork_for(track):
    track_id = track.get("id")
    if not track_id:
        return None
    if track_id not in _artwork:
        path = export_artwork(track_id)
        if path:
            _artwork[track_id] = {"path": path}
        else:
            remote = lookup_artwork_online(track)
            _artwork[track_id] = {"url": remote} if remote else {}
    entry = _artwork[track_id]
    if "path" in entry:
        return f"http://{HOST}:{PORT}/artwork?id={urllib.parse.quote(track_id)}"
    return entry.get("url")


def now_playing():
    with _lock:
        if time.time() - _state["at"] < STATE_TTL:
            return _state["data"]
        try:
            data = json.loads(osascript(["-l", "JavaScript", "-e", NOW_SCRIPT]) or '{"state": "stopped"}')
        except ValueError:
            data = {"state": "stopped"}
        if data.get("state") != "stopped":
            data["artwork"] = artwork_for(data)
        data["at"] = time.time()  # lets the page extrapolate the progress bar
        _state.update(at=time.time(), data=data)
        return data


class Handler(BaseHTTPRequestHandler):
    server_version = "startpage-nowplaying/1"

    def host_ok(self):
        # Refuse requests whose Host isn't us: blocks DNS-rebinding tricks from other sites
        return self.headers.get("Host", "") in {f"{HOST}:{PORT}", f"localhost:{PORT}"}

    def origin(self):
        return self.headers.get("Origin")

    def cors(self, write=False):
        origin = self.origin()
        allowed = ALLOWED_ORIGINS if write else ALLOWED_ORIGINS | READ_ONLY_ORIGINS
        if origin in allowed:
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Vary", "Origin")
            self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type")
            # Chrome asks before a public page may talk to a local server
            self.send_header("Access-Control-Allow-Private-Network", "true")

    def send_json(self, status, payload, write=False):
        body = json.dumps(payload).encode()
        self.send_response(status)
        self.cors(write)
        self.send_header("Content-Type", "application/json")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.cors(write=True)
        self.end_headers()

    def do_GET(self):
        if not self.host_ok():
            self.send_json(403, {"error": True, "message": "Bad host"})
            return
        url = urllib.parse.urlparse(self.path)
        if url.path == "/now":
            # Requests without an Origin (curl, the browser address bar) are fine to answer;
            # a page from another site gets no CORS header and so can't read the reply.
            self.send_json(200, now_playing())
        elif url.path == "/artwork":
            track_id = urllib.parse.parse_qs(url.query).get("id", [""])[0]
            path = _artwork.get(track_id, {}).get("path")
            if not path or not os.path.exists(path):
                self.send_json(404, {"error": True, "message": "No artwork"})
                return
            with open(path, "rb") as f:
                data = f.read()
            self.send_response(200)
            self.send_header("Content-Type", image_type(path))
            self.send_header("Cache-Control", "max-age=86400")
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)
        elif url.path == "/health":
            self.send_json(200, {"ok": True})
        else:
            self.serve_site_file(url.path)

    def serve_site_file(self, path):
        rel = urllib.parse.unquote(path).lstrip("/")
        if rel == "" or rel.endswith("/"):
            rel += "index.html"
        parts = rel.split("/")
        full = os.path.realpath(os.path.join(SITE_ROOT, rel))
        if (
            any(part.startswith(".") or part == "" for part in parts)
            or parts[0] in SITE_BLOCKED_TOP
            or not full.startswith(SITE_ROOT + os.sep)
            or not os.path.isfile(full)
        ):
            self.send_json(404, {"error": True, "message": "Not found"})
            return
        with open(full, "rb") as f:
            data = f.read()
        self.send_response(200)
        self.send_header("Content-Type", mimetypes.guess_type(full)[0] or "application/octet-stream")
        # Always revalidate, so edits to the checkout show up on the next reload
        self.send_header("Cache-Control", "no-cache")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_POST(self):
        if not self.host_ok():
            self.send_json(403, {"error": True, "message": "Bad host"})
            return
        if urllib.parse.urlparse(self.path).path != "/control":
            self.send_json(404, {"error": True, "message": "Not found"})
            return
        # Control is only for the startpage itself, never for arbitrary sites or file:// pages
        if self.origin() not in ALLOWED_ORIGINS:
            self.send_json(403, {"error": True, "message": "Origin not allowed"})
            return
        length = min(int(self.headers.get("Content-Length") or 0), 64)
        action = self.rfile.read(length).decode(errors="ignore").strip()
        script = CONTROL_SCRIPTS.get(action)
        if not script:
            self.send_json(400, {"error": True, "message": "Unknown action"}, write=True)
            return
        osascript(["-e", script])
        with _lock:
            _state["at"] = 0  # next /now reads fresh state
        self.send_json(200, now_playing(), write=True)

    def log_message(self, *args):
        pass  # quiet: this runs in the background all day


if __name__ == "__main__":
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    print(f"Now-playing helper on http://{HOST}:{PORT}", flush=True)
    server.serve_forever()
