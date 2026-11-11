# Building URWidgets (Rust Daemon + KDE Plasma 5 WidgetWall)

## 1. Environment & Installed System Font Verification on Linux Mint

```bash
plasmashell --version
qmake --version
pkg-config --modversion Qt5Core
fc-list --format='%{family}\n' | sort -u
fc-match "SF Pro Display"
fc-match "Helvetica Neue"
```

## 2. Compile the Shared Rust Backend (`urwidgets-daemon`)

```bash
cd urwidgets
cargo build --release --manifest-path core/Cargo.toml
```

## 3. Package `.plasmoid` and `.deb` Bundles

```bash
chmod +x scripts/package.sh
./scripts/package.sh
```
