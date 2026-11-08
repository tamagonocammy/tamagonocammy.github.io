#!/bin/sh
# Stops the now-playing helper and removes its login item.
LABEL="com.startpage.nowplaying"
launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
rm -f "$HOME/Library/LaunchAgents/$LABEL.plist"
rm -rf "$HOME/Library/Caches/startpage-nowplaying"
echo "Now-playing helper removed."
