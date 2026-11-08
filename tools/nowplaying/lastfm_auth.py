#!/usr/bin/env python3
"""
One-time Last.fm setup for the now-playing helper (the ♥ button in the mini player).

  /usr/bin/python3 tools/nowplaying/lastfm_auth.py

1. Create an API account at https://www.last.fm/api/account/create
   (any name; callback URL can stay empty) and keep its API key and shared secret.
2. Run this script, paste both when asked (the secret isn't echoed).
3. It opens last.fm in your browser: click "Yes, allow access", come back, press Enter.

It saves the API key, shared secret, session key and your username to
~/.config/startpage-nowplaying/lastfm.json (readable only by you), outside this repo,
so nothing secret ever reaches GitHub. The helper picks the file up by itself; no restart.
To undo: delete that file (and revoke access at https://www.last.fm/settings/applications).
"""

import getpass
import json
import os
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from nowplaying import LASTFM_FILE, lastfm_call, lastfm_sign  # noqa: E402


def signed(params, secret):
    return dict(params, api_sig=lastfm_sign(params, secret))


def main():
    print("Last.fm setup for the startpage ♥ button\n")
    api_key = input("API key: ").strip()
    api_secret = getpass.getpass("Shared secret (hidden): ").strip()
    if not api_key or not api_secret:
        print("Both are needed. Get them at https://www.last.fm/api/account/create")
        return 1

    reply = lastfm_call(signed({"method": "auth.getToken", "api_key": api_key}, api_secret))
    if reply.get("error"):
        print(f"Last.fm said no: {reply['message']} (check the key and secret)")
        return 1
    token = reply["token"]

    url = f"https://www.last.fm/api/auth/?api_key={api_key}&token={token}"
    print(f"\nOpening {url}")
    print('Click "Yes, allow access" there, then come back here.')
    subprocess.run(["open", url], check=False)
    input("Press Enter once you've allowed it… ")

    reply = lastfm_call(signed({"method": "auth.getSession", "api_key": api_key, "token": token}, api_secret))
    if reply.get("error"):
        print(f"Couldn't get a session: {reply['message']} (allow access in the browser first, then run this again)")
        return 1
    session = reply["session"]

    os.makedirs(os.path.dirname(LASTFM_FILE), mode=0o700, exist_ok=True)
    fd = os.open(LASTFM_FILE, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
    with os.fdopen(fd, "w") as f:
        json.dump(
            {"api_key": api_key, "api_secret": api_secret, "session_key": session["key"], "username": session["name"]},
            f,
            indent=2,
        )
    os.chmod(LASTFM_FILE, 0o600)
    print(f"\nDone, {session['name']}! Saved to {LASTFM_FILE}. The ♥ shows up in the mini player within a few seconds.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
