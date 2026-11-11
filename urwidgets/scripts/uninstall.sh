#!/usr/bin/env bash
set -euo pipefail

echo "=== Uninstalling URWidgets Ecosystem ==="

if command -v systemctl >/dev/null 2>&1; then
    systemctl --user disable --now urwidgets-daemon.service 2>/dev/null || true
fi
rm -f "$HOME/.config/systemd/user/urwidgets-daemon.service"
rm -f "$HOME/.local/bin/urwidgets-daemon"
rm -rf "$HOME/.local/share/plasma/plasmoids/org.urwidgets."*

if [[ "${1:-}" == "--purge-data" ]]; then
    rm -rf "$HOME/.local/share/urwidgets"
    rm -rf "$HOME/.config/urwidgets"
    echo "[OK] Purged local SQLite database and configuration."
else
    echo "[INFO] Preserved user SQLite database in ~/.local/share/urwidgets (pass --purge-data to remove)."
fi

echo "=== Uninstallation Complete ==="
