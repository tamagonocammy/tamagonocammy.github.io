#!/bin/sh
# Installs the now-playing helper as a login item (LaunchAgent) for this user.
# It starts now, at every login, and restarts if it ever stops.
# Undo with ./uninstall.sh
set -e

LABEL="com.startpage.nowplaying"
HERE="$(cd "$(dirname "$0")" && pwd)"
SCRIPT="$HERE/nowplaying.py"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
LOG="$HOME/Library/Logs/startpage-nowplaying.log"
# The Python that ships with macOS: its path doesn't change when Homebrew upgrades
PYTHON="/usr/bin/python3"

mkdir -p "$HOME/Library/LaunchAgents" "$HOME/Library/Logs"

cat > "$PLIST" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>$LABEL</string>
  <key>ProgramArguments</key>
  <array>
    <string>$PYTHON</string>
    <string>$SCRIPT</string>
  </array>
  <key>RunAtLoad</key><true/>
  <key>KeepAlive</key><true/>
  <key>ProcessType</key><string>Background</string>
  <key>StandardOutPath</key><string>$LOG</string>
  <key>StandardErrorPath</key><string>$LOG</string>
</dict>
</plist>
PLIST

# Replace a previous install, if any
launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
launchctl bootstrap "gui/$(id -u)" "$PLIST"

echo "Installed. Helper running on http://127.0.0.1:47615 (log: $LOG)"
echo "The first time it reads Music.app, macOS asks to let python3 control Music: click Allow."
