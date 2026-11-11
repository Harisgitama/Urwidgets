# URWidgets Changelog

**Author:** Haris Gitama (<https://github.com/Harisgitama>)  
**Portfolio:** <https://rissaxie.com> (`rissaxie.com`)  
**Instagram:** <https://www.instagram.com/hrisgtaa_/> (`@hrisgtaa_`)  
**Target:** Linux Mint + KDE Plasma 5.27+

---

## [3.1.0] — 2026-11-11 (Final Codebase Cleanup, Rust/Tauri Optimization, Author Links & Verified .deb Release)

### 1. Complete Codebase Audit & Cleanup
- **Removed Orphaned & Duplicate Modules**:
  - Removed duplicate binary image assets in `/src/assets/images/` (`2.5 MB`), unused `/hooks/use-mobile.ts`, and unused `/lib/utils.ts`.
  - Removed orphaned QML files (`ThemeEngine.qml`, `AppearancePanel.qml`, and duplicate `TodoWidget.qml` merged into `AgendaWidget.qml`).
  - Removed unused Rust modules (`core/src/config/settings.rs` and duplicate `core/src/modules/todo.rs`).
  - Removed 7 unused npm packages (`@google/genai`, `@hookform/resolvers`, `class-variance-authority`, `clsx`, `tailwind-merge`, `@tailwindcss/typography`, `firebase-tools`) and trimmed unused `tokio` features (`net`, `io-util`) in `core/Cargo.toml`.

### 2. Rust & Tauri Shared Core Architecture
- **Shared Library + Daemon Crate (`core/src/lib.rs` & `core/src/main.rs`)**:
  - Exposed `urwidgets_daemon` as both a shared library crate (`[lib]`) for the Tauri Control Center (`control-center/tauri-app/src-tauri`) and a lightweight CLI + D-Bus daemon binary (`[[bin]]`).
  - Configured release Cargo profile (`opt-level = "s"`, `lto = "thin"`, `codegen-units = 1`, `panic = "abort"`, `strip = true`).
  - Added fast-path Rust CLI subcommands (`play-alarm`, `stop-alarm`, `scan-music`, `play-music`, `stop-music`, `scan-photos`) and Tauri commands (`tauri_get_author_info`, `tauri_open_external_url`, `tauri_play_alarm`, `tauri_stop_alarm`, `tauri_scan_music`, `tauri_play_music`, `tauri_stop_music`, `tauri_scan_photos`).

### 3. Preferences — Author, Portfolio & Instagram Links
- Added clickable **Portfolio** (`rissaxie.com ↗` -> `https://rissaxie.com`) and **Instagram** (`@hrisgtaa_ ↗` -> `https://www.instagram.com/hrisgtaa_/`) links directly below Author (`Haris Gitama`) in `ControlCenterView.tsx`, `PlasmaDesktopView.tsx`, and KDE Plasma 5 `configGeneral.qml` (opening via external system browser).

### 4. Binary, Asset & Debian Package (`.deb`) Size Optimization
- Optimized bundled photography (`public/images/*.jpg`) from `2.5 MB` to `439 KB` (`-82.4%`) and deduplicated standalone widget QML/image bundles with `dpkg-deb -Zxz`, reducing `URWidgets_3.1.0_amd64.deb` (`urwidgets-bundle.deb`) from `30 MB` to `< 750 KB` while preserving all 10 KDE Plasma 5 widgets and full source tree.
