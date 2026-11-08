# Now playing notes

`nowplaying.component.js` (`<now-playing>`, in the status bar before the clock) + the local helper in `tools/nowplaying/`.

- A page can't see Music.app, so `tools/nowplaying/nowplaying.py` (stdlib Python, runs on macOS's `/usr/bin/python3`) asks it via `osascript` and serves `http://127.0.0.1:47615`: `GET /now`, `GET /artwork?id=`, `POST /control` with a text body `playpause|next|previous`
- `install.sh` sets it up as a LaunchAgent (`com.startpage.nowplaying`, log in `~/Library/Logs/startpage-nowplaying.log`); `uninstall.sh` removes it. First run triggers the macOS "python3 wants to control Music" prompt
- The helper never launches Music (`Application("Music").running()` / `application "Music" is running`); when Music is closed it reports `stopped`
- Music's `playpause` command is a silent no-op on this macOS, so the helper checks `player state` and sends `pause` or `play`
- Security: binds to 127.0.0.1 only, checks the Host header (DNS rebinding), sends CORS headers only for `ALLOWED_ORIGINS` (the github.io site and the :8765 dev server; add more with `NOWPLAYING_ORIGINS`), and refuses `/control` from any other Origin. `file://` pages (Origin `null`) may read but not control
- Artwork: exported from Music.app into `~/Library/Caches/startpage-nowplaying` (newest 20 kept); falls back to the iTunes Search API for tracks without local art
- The widget polls every `advanced_config.nowPlaying.pollSeconds` (default 3) while visible, every 30s while the helper is unreachable, and not at all in background tabs. The progress bar extrapolates from the helper's `at` timestamp between polls
- Hidden (no `active` attribute) when the helper is down or nothing plays. The hide rule lives in the status bar's CSS, because its `+` layout class outranks the component's `:host` rule
- `sw.js` skips caching for 127.0.0.1/localhost on other ports, so `/now` is never served stale
- `m` toggles the popup (see the status bar shortcuts)
