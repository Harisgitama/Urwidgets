#!/usr/bin/env bash
set -euo pipefail

echo "=== URWidgets v3.1.0 — WidgetWall Ecosystem Installer (KDE Plasma 5 + Rust Daemon) ==="

if command -v plasmashell >/dev/null 2>&1; then
    echo "[OK] Detected KDE Plasma: $(plasmashell --version)"
else
    echo "[WARN] 'plasmashell' not found in PATH."
fi

mkdir -p "$HOME/.local/bin"

if command -v cargo >/dev/null 2>&1; then
    echo "[BUILD] Compiling urwidgets-daemon in release mode..."
    cargo build --release --manifest-path core/Cargo.toml
    install -m 0755 core/target/release/urwidgets-daemon "$HOME/.local/bin/urwidgets-daemon"
    echo "[OK] Installed urwidgets-daemon -> $HOME/.local/bin/urwidgets-daemon"
fi

cat > "$HOME/.local/bin/urwidgets-ctl" <<'EOF'
#!/usr/bin/env sh
if [ -x "$HOME/.local/bin/urwidgets-daemon" ]; then
    exec "$HOME/.local/bin/urwidgets-daemon" "$@"
fi
if [ -x "/usr/local/bin/urwidgets-daemon" ]; then
    exec "/usr/local/bin/urwidgets-daemon" "$@"
fi
exit 1
EOF
chmod 0755 "$HOME/.local/bin/urwidgets-ctl"

mkdir -p "$HOME/.config/systemd/user"
cat > "$HOME/.config/systemd/user/urwidgets-daemon.service" <<'EOF'
[Unit]
Description=URWidgets Shared Rust Backend Daemon
After=graphical-session.target dbus.socket

[Service]
Type=simple
ExecStart=%h/.local/bin/urwidgets-daemon
Restart=on-failure
RestartSec=3

[Install]
WantedBy=default.target
EOF

mkdir -p "$HOME/.local/share/dbus-1/services"
cat > "$HOME/.local/share/dbus-1/services/org.urwidgets.Daemon.service" <<EOF
[D-BUS Service]
Name=org.urwidgets.Daemon
Exec=$HOME/.local/bin/urwidgets-daemon
EOF

if command -v systemctl >/dev/null 2>&1 && [ -x "$HOME/.local/bin/urwidgets-daemon" ]; then
    systemctl --user daemon-reload 2>/dev/null || true
    systemctl --user enable --now urwidgets-daemon.service 2>/dev/null || true
    echo "[OK] Enabled & started urwidgets-daemon.service"
fi

PLASMOIDS_DIR="$HOME/.local/share/plasma/plasmoids"
mkdir -p "$PLASMOIDS_DIR/org.urwidgets.ecosystem"
cp -r plasma/plasmoid/* "$PLASMOIDS_DIR/org.urwidgets.ecosystem/"
echo "[OK] Installed org.urwidgets.ecosystem"

if [ -d "plasma/widgets" ]; then
    for wdir in plasma/widgets/org.urwidgets.*; do
        if [ -d "$wdir" ]; then
            wname="$(basename "$wdir")"
            mkdir -p "$PLASMOIDS_DIR/$wname"
            cp -r "$wdir/"* "$PLASMOIDS_DIR/$wname/"
            echo "[OK] Installed standalone KDE Plasma 5 widget: $wname"
        fi
    done
fi

echo "=== All 10 URWidgets v3.1.0 Installed (Created by Haris Gitama) ==="
