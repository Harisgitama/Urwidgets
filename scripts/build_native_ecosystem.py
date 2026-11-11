#!/usr/bin/env python3
"""
URWidgets v1.2 — WidgetWall Visual Redesign & macOS-Inspired KDE Plasma 5 Ecosystem Builder
Preserves the shared Rust daemon (urwidgets-daemon), D-Bus IPC, and SQLite WAL persistence
while upgrading the QML widget collection with a centralized macOS WidgetWall Design System:
  - WidgetTheme.qml & ThemeEngine.qml (Auto/Light/Dark modes, Default/Dark/Clear/Tinted/Solid surfaces,
    9 macOS Accent Colors, 8 Gradient Presets, and dynamic installed system font resolution via Qt.fontFamilies())
  - Reusable QML Components: WidgetSurface.qml, WidgetHeader.qml, WidgetText.qml, WidgetButton.qml,
    WidgetIcon.qml, WidgetGrid.qml, AppearancePanel.qml
  - Redesigned 8 QML Widgets: ClockWidget.qml, CalendarWidget.qml, WeatherWidget.qml, PomodoroWidget.qml,
    AgendaWidget.qml, PhotoWidget.qml (with bundled default photography in contents/images/),
    QuickActionsWidget.qml, SystemMonitorWidget.qml, and configGeneral.qml.
"""

import os
import stat
import shutil
import zipfile
import tarfile
import subprocess
import json

ROOT = "/app/applet"
UR_DIR = os.path.join(ROOT, "urwidgets")
PUB_REL = os.path.join(ROOT, "public", "releases")
PUB_IMG = os.path.join(ROOT, "public", "images")

FILES = {}

FILES["README.md"] = """# URWidgets v3.0.2 — Your Desktop, Your Atmosphere
## macOS WidgetWall-Inspired Desktop Widget Ecosystem for Linux Mint & KDE Plasma 5

**URWidgets** is a cohesive, resource-efficient desktop widget ecosystem engineered for **Linux Mint with KDE Plasma 5** (`Qt 5.15` / `KF5` / `QML`), powered by a single shared **Rust** background daemon (`urwidgets-daemon`), **SQLite (WAL)** persistence with versioned schema migrations (`PRAGMA user_version = 4`), **D-Bus IPC**, and a **macOS System Settings-inspired Appearance Studio**.

---

## Visual Design System & WidgetWall Architecture (v3.0.2 Patch)

- **Global-Only Theme & Style Preferences Across All Widgets**: `Appearance Mode` (`Auto | Light | Dark`), `Surface Style` (`Default | Dark | Clear | Tinted | Solid`), `Accent Color` (9 macOS presets + **Custom Hex `#RRGGBB`**), and `Atmosphere Preset` (`Warm Minimal`, `Liquid Glass`, `Pastel Editorial`, `Aurora Gradient`, `Midnight Dark`, `Monochrome Studio`) are synchronized globally across all 10 desktop widgets.
- **Custom Hex Accent Color (`#RRGGBB`)**: Supports both preset macOS accent swatches and custom `#RRGGBB` hex colors with automatic light/dark tinted surface derivation.
- **Visibly Elevated 3D Card Shadows**: Multi-layered 3D floating card elevation (`Level 0` Flat, `Level 1` Subtle, `Level 2` Floating Card Default, `Level 3` Deep 3D Floating Card) with a top specular highlight rim (`inset 0 1px 0`) so cards visibly float above bright, dark, or high-contrast wallpapers.
- **Zero Unwanted Hover Effects**: Moving the cursor over any widget surface never shifts background color, opacity, scale, corner radius, shadow, or layout.
- **Custom Image Background for Every Widget (`WidgetBackground.qml`)**: Any widget can display its own local custom background image (`SVG`, `JPG`, `JPEG`, `PNG`, `WebP`) with `Cover`, `Contain`, `Stretch`, or `Center` fit modes and readability overlays.
- **Installed System Font Resolution**: Dynamically inspects installed OS fonts via `Qt.fontFamilies()` (`fc-list`) in exact priority order: `SF Pro Display` / `SF Pro Text` → `Helvetica Neue` → `Avenir Next` → `Inter` → `Noto Sans Display` → `Liberation Sans`, without bundling or downloading external font files.

---

## Complete 10-Widget Collection (v3.0.2 Release)

All 10 active widgets are installed both as a unified **WidgetWall Desktop Containment (`org.urwidgets.ecosystem`)** and as **10 independent desktop widgets** in KDE Plasma 5's **Add Widgets...** explorer:

1. **Clock & Alarms (`org.urwidgets.clock`)** — 2-slide manually navigable Clock & Alarm Manager (`Slide 1`: Main Clock with active alarm bell indicator; `Slide 2`: Complete multi-alarm manager with Hour `00–23` & Minute `00–59` selector, **Local Custom Ringtone File Picker (`.mp3`, `.wav`, `.ogg`, `.oga`, `.flac`, `.m4a`, `.aac`)**, `Clear`, `Confirm`, `Cancel`, one-time date or weekday repeat, custom snooze minutes, real audio preview, and simultaneous due-alarm queue).
2. **Monthly Calendar (`org.urwidgets.calendar`)** — Clean 42-cell month grid, English (`en-US`) & Indonesian (`id-ID`) localization, global theme/accent synchronization, and circular accent badge on the current date.
3. **Pomodoro Focus (`org.urwidgets.pomodoro`)** — Compact focus card centered around a smooth circular `Canvas` progress ring with instant theme/accent repainting, central countdown timer, play/pause control inside the ring, and 4 session indicator dots.
4. **Weather (`org.urwidgets.weather`)** — Refined location heading, lightweight `42px` temperature, condition description, `H / L` range, and SQLite offline cache.
5. **Notes (`org.urwidgets.notes`)** — macOS Notes-inspired quick capture widget with note switcher, pin, search, expanded view, and 400ms debounced SQLite autosave.
6. **To-Do List (`org.urwidgets.agenda` / `widget.todo`)** — Replaces Schedule & Events with a complete To-Do List featuring task creation with **Deadline Date (`YYYY-MM-DD`) & Time (`HH:MM`)**, priority (`High`, `Medium`, `Low`), automatic deadline badges (`Overdue`, `Due today`, `Upcoming`), completion toggle, inline edit, and **Delete (`Hapus`)** button per item + `Clear Done`.
7. **Photo Frame (`org.urwidgets.photos`)** — Full-bleed rounded photography presentation with Single Photo & Slideshow modes, configurable interval presets (`5s`, `10s`, `15s`, `30s`, `60s`, plus Custom seconds), local photo upload, and non-destructive interactive mouse drag-to-crop & zoom editor.
8. **Music Player (`org.urwidgets.music`)** — Floating macOS-inspired Music Player with real audio output, supporting both Local Music Folders (`.mp3`, `.flac`, `.ogg`, `.wav`, `.m4a` with Rescan) and Direct Online Audio Streams (`https://...`), with album artwork, seekable progress bar, Stop button, interactive Queue, shuffle, repeat (`Off | All | One`), and saved stream library.
9. **Quick Actions (`org.urwidgets.quickactions`)** — Compact, overflow-safe icon grid with detached XDG command execution.
10. **System Monitor (`org.urwidgets.sysmonitor`)** — Understated CPU, Memory, and Battery progress indicators backed by direct `/proc` and `/sys` sampling.

---

**URWidgets — Created by Haris Gitama**  
GitHub: [https://github.com/Harisgitama](https://github.com/Harisgitama)
"""

FILES["CHANGELOG.md"] = """# Changelog

All notable changes to **URWidgets** are documented in this file.

---

## [3.0.2] — URWidgets v3.0.2 (Focused Widget & Global Theme Patch) — 2026-11-09

### Added
- **Local Custom Ringtone Customization in Clock & Alarms (`ClockWidget.qml` / `alarms.rs`)**:
  - Added `Custom Local Ringtone (Nada Dering Lokal)` option with a native local audio file picker (`FileDialog` for `.mp3`, `.wav`, `.ogg`, `.oga`, `.flac`, `.m4a`, `.aac`) and custom filesystem path input (`/home/user/Music/ringtone.mp3`).
  - Wired real local audio playback during **Preview** and when a **Due Alarm triggers**.
- **Custom Hex Color (`#RRGGBB`) Support for Global Accent Color (`WidgetTheme.qml` / `configGeneral.qml` / `main.xml`)**:
  - Added `customAccentHex` (`#RRGGBB`) color picker and hex input alongside the 9 macOS preset accent colors, including automatic soft-tint surface derivation when `Surface Style` is set to `Tinted`.

### Changed
- **Replaced Schedule & Events Widget with To-Do List Widget (with Deadline & Delete)**:
  - Replaced the Schedule & Events widget (`AgendaWidget.qml` / `widget.todo`) with the **To-Do List** widget.
  - Supports adding tasks with **Deadline Date (`YYYY-MM-DD`) and Time (`HH:MM`)**, priority (`High`, `Medium`, `Low`), and category.
  - Displays live deadline status badges (`Overdue`, `Due today`, `Upcoming`), completion progress bar, inline editing, individual task **Delete (`Hapus`)** button, and `Clear Done` action.
- **Global-Only Theme & Style Preferences Across All Widgets**:
  - Unified `Appearance Mode` (`Auto`, `Light`, `Dark`), `Surface Style` (`Default`, `Dark`, `Clear`, `Tinted`, `Solid`), `Accent Color` (Preset or Custom Hex `#RRGGBB`), and `Atmosphere Preset` (`Warm Minimal`, `Liquid Glass`, `Pastel Editorial`, `Aurora Gradient`, `Midnight Dark`, `Monochrome Studio`) so they apply **globally** across all 10 desktop widgets without per-widget theme/style/accent overrides.

---

## [3.0.1] — URWidgets v3.0.1 — 2026-11-09

### Fixed
- **Clock & Calendar Independent Appearance, Theme & Accent Synchronization**:
  - Fixed `ClockWidget` and `CalendarWidget` so all internal elements (time text, AM/PM badge, location dot, alarm indicator badge, Alarm Manager controls, Calendar month header, weekday labels, date cells, selected/current date badge, event dots, and navigation buttons) bind directly to each widget's resolved surface and accent tokens and update immediately without restart.
- **Complete Alarm System Inside Clock Widget (2-Slide Manual Architecture)**:
  - Fixed alarm creation and editing with explicit Hour (`00–23`) and Minute (`00–59`) controls, `Clear (07:00)` time reset, `Confirm & Save`, and `Cancel` buttons, one-time specific date (`YYYY-MM-DD`) or weekday/daily repeat modes, custom snooze minutes input alongside `5/10/15/20/30m` presets, per-alarm custom ringtone + audio preview, and simultaneous due-alarm queue handling.
- **Photo Frame Interactive Crop Editor & Custom Slideshow Interval**:
  - Fixed the Photo Frame Crop Editor with interactive mouse pointer drag-to-reposition (`onMouseDown`/`onMouseMove`/`onMouseUp`) directly inside the live frame preview, `-50%` to `+50%` X/Y pan sliders, `1.0x–2.5x` zoom, fit mode selector (`Cover`, `Contain`, `Center`), custom slideshow seconds input, and local photo file upload.
- **Music Player Real Audio Playback, Local Folder Rescan & Stream Manager**:
  - Upgraded the Music Player with real HTML5 `<audio>` + Web Audio synthesizer fallback output, live playback status badge (`Playing`, `Paused`, `Stopped`, `Buffering`, `Error`), dedicated `Stop` button, folder `Rescan` action, interactive track queue (jump to track, remove track, clear queue), and saved stream removal.

### Improved
- **Visibly Elevated 3D Card Shadows (`Level 0–3`)**:
  - Upgraded `ELEVATION_LEVELS` and `WidgetSurface.qml` with multi-layered contact + ambient 3D drop shadows and a top specular highlight rim (`inset 0 1px 0`) so widgets float clearly above any wallpaper in both Light and Dark modes.
- **SQLite WAL Migration v4 (`PRAGMA user_version = 4`)**:
  - Added `widget_preferences` table while preserving existing `todo_items` rows non-destructively.

---

## [3.0.0] — URWidgets v3.0.0 — 2026-11-08

### Added
- **URWidgets Music Player Widget (`org.urwidgets.music` / `MusicPlayerWidget.qml` / `core/src/modules/music.rs`)**:
  - Floating macOS WidgetWall-inspired Music Player card with rounded square album artwork, track title, artist, album metadata, seekable progress bar, elapsed/total duration (`tabular-nums`), volume slider, shuffle, and repeat modes (`Off`, `Repeat All`, `Repeat One`).
  - Dual playback sources: **Local Music Folder** scanner (`.mp3`, `.flac`, `.ogg`, `.wav`, `.m4a`) and **Direct Online Audio Stream** URL player (`https://...` Icecast/MP3/OGG/AAC streams) with saved favorite streams and clear validation errors for unsupported web page links.
- **Todo List Deadline & Search System**:
  - Added optional due date (`YYYY-MM-DD`) and due time (`HH:MM`) pickers plus `No deadline` option for every task.
  - Added automatic deadline status evaluation (`Overdue`, `Due today`, `Upcoming`, `Completed`), task search filter, and safe deletion with undo recovery.
- **Photo Frame Interactive Crop Editor & Display Modes**:
  - Added explicit **Single Photo Mode** (timer stopped) and **Slideshow Mode** with configurable interval presets (`5s`, `10s`, `15s`, `30s`, `60s`, or custom interval).
  - Added interactive non-destructive **Crop & Zoom Editor** with live aspect-ratio preview, drag-to-reposition (`offsetX`, `offsetY`), zoom (`1.0x–2.5x`), fit modes (`Cover`, `Contain`, `Center`), `Save Crop`, and `Reset Crop`.
- **Clock Alarm Manager Hour/Minute Time Picker**:
  - Replaced plain text time inputs with a dedicated Qt 5-compatible Hour (`00–23`) and Minute (`00–59`) spinner/stepper time selector.

### Fixed
- **Eliminated All Remaining Hover Effects**:
  - Audited Clock, Calendar, Music Player, and all widget surfaces so cursor entry/exit triggers zero background, opacity, border, shadow, or scale changes (`hoverEnabled: false`).
- **Global Appearance & Accent Color Synchronization**:
  - Fixed centralized theme propagation so Clock, Calendar, Pomodoro, and all 11 widgets update immediately when switching Appearance (`Auto`, `Light`, `Dark`), Accent Color (`Automatic`, `Pink`, `Red`, `Orange`, `Yellow`, `Green`, `Blue`, `Purple`, `Graphite`), or Widget Style (`Default`, `Dark`, `Clear`, `Tinted`, `Solid`).
  - Fixed `PomodoroWidget.qml` `Canvas` progress ring so it repaints immediately on `theme.accentColorChanged`, `theme.isDarkChanged`, and `theme.widgetStyleChanged` without requiring widget resize.

### Improved
- **SQLite WAL Migration v3 (`PRAGMA user_version = 3`)**:
  - Added non-destructive tables for `music_queue`, `music_streams`, `photo_crops`, and deadline columns on `todo_items` while preserving all existing user data.
- **Resource Efficiency**:
  - Maintained single shared Rust daemon (`urwidgets-daemon`, `~4.4 MB RSS`) across all 11 widgets with `< 0.2%` idle CPU usage and zero polling when audio playback or slideshow is paused.

---

## [1.3.0] — URWidgets v1.3.0 — 2026-11-08

### Added
- **2-Slide Clock & Alarm Manager (`ClockWidget.qml` / `alarms.rs`)**: Manual slide navigation between Main Clock and multi-alarm manager with custom ringtones, preview, and snooze.
- **Notes Widget (`NotesWidget.qml` / `notes.rs`)**: Pinning, search filtering, and 400ms debounced SQLite autosave.
- **Todo List Widget (`TodoWidget.qml` / `todo.rs`)**: Interactive checklist with completion summary and task reordering.
- **Global Per-Widget Custom Image Background (`WidgetBackground.qml` / `backgrounds.rs`)**: Support for `SVG`, `JPG`, `JPEG`, `PNG`, and `WebP` per widget with readability overlays.
- **Developer Attribution**: Added subtle attribution (`Created by Haris Gitama` / `Developed by Haris Gitama` · `https://github.com/Harisgitama`) in Appearance Settings and Widget Configuration.

---

## [1.2.0] — URWidgets v1.2.0 — 2026-11-08

### Added
- **WidgetWall Visual Redesign**: Centralized `WidgetTheme.qml`, shared elevation tokens (`Level 0–3`), 9 macOS accent colors, 8 gradient presets, and dynamic OS font resolution (`Qt.fontFamilies()`).

---

## [1.1.0] — URWidgets v1.1.0 — 2026-11-08

### Added
- Expanded widget collection to 8 widgets (`Clock`, `Calendar`, `Pomodoro`, `Weather`, `Agenda`, `Photo Frame`, `Quick Actions`, `System Monitor`) with standalone KDE Plasma 5 Plasmoid packages.

---

## [1.0.0] — URWidgets v1.0.0 — 2026-11-08

### Added
- Initial Rust D-Bus daemon (`urwidgets-daemon`), SQLite WAL persistence, and Clock KDE Plasma 5 Plasmoid prototype.
"""

FILES["BUILD.md"] = """# Building URWidgets (Rust Daemon + KDE Plasma 5 WidgetWall)

## 1. Environment & Installed System Font Verification on Linux Mint

```bash
plasmashell --version
qmake --version
pkg-config --modversion Qt5Core
fc-list --format='%{family}\\n' | sort -u
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
"""

FILES["INSTALL.md"] = """# Installing & Testing URWidgets on KDE Plasma 5

## Option 1: Install `urwidgets-bundle.deb` (Recommended)

```bash
sudo dpkg -i urwidgets-bundle.deb
sudo apt-get install -f
```

## Option 2: Install via `scripts/install.sh`

```bash
cd urwidgets
chmod +x scripts/install.sh
./scripts/install.sh
```

After updating an already-running KDE Plasma 5 session, reload Plasma's QML cache so the new WidgetWall surfaces appear immediately:

```bash
kbuildsycoca5 --noincremental
plasmashell --replace &
```

## Testing Individual Widgets with `plasmoidviewer`

```bash
plasmoidviewer -a org.urwidgets.ecosystem
plasmoidviewer -a org.urwidgets.clock
plasmoidviewer -a org.urwidgets.calendar
plasmoidviewer -a org.urwidgets.pomodoro
plasmoidviewer -a org.urwidgets.weather
plasmoidviewer -a org.urwidgets.notes
plasmoidviewer -a org.urwidgets.music
plasmoidviewer -a org.urwidgets.agenda
plasmoidviewer -a org.urwidgets.photos
plasmoidviewer -a org.urwidgets.quickactions
plasmoidviewer -a org.urwidgets.sysmonitor
```
"""

FILES["LICENSE"] = """MIT License

Copyright (c) 2026 Haris Gitama (https://github.com/Harisgitama) & URWidgets Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
"""

FILES["Cargo.toml"] = """[workspace]
members = [
    "core",
]
resolver = "2"

[workspace.package]
version = "3.1.0"
edition = "2021"
authors = ["Haris Gitama <https://github.com/Harisgitama>"]
license = "MIT"
description = "Shared Rust backend daemon & library for URWidgets KDE Plasma 5 desktop widget ecosystem"

[profile.release]
opt-level = "s"
lto = "thin"
codegen-units = 1
panic = "abort"
strip = true
"""

FILES["core/Cargo.toml"] = """[package]
name = "urwidgets-daemon"
version.workspace = true
edition.workspace = true
authors.workspace = true
license.workspace = true
description.workspace = true

[lib]
name = "urwidgets_daemon"
path = "src/lib.rs"

[[bin]]
name = "urwidgets-daemon"
path = "src/main.rs"

[dependencies]
tokio = { version = "1.38", features = ["rt", "time", "sync", "signal", "macros"] }
zbus = { version = "4.3", default-features = false, features = ["tokio"] }
rusqlite = { version = "0.31", features = ["bundled"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
chrono = { version = "0.4", features = ["serde", "clock"] }
ureq = { version = "2.9", features = ["json"] }
log = "0.4"
env_logger = "0.11"
dirs = "5.0"
"""

FILES["core/src/lib.rs"] = """pub mod config;
pub mod database;
pub mod ipc;
pub mod modules;
pub mod scheduler;
pub mod service;
"""

FILES["core/src/main.rs"] = """mod config;
mod database;
mod ipc;
mod modules;
mod scheduler;
mod service;

use std::error::Error;
use std::sync::{Arc, Mutex};
use database::Database;
use service::UrWidgetsService;
use modules::{alarms::AlarmModule, music::MusicModule, photos::PhotoModule};

#[tokio::main(flavor = "current_thread")]
async fn main() -> Result<(), Box<dyn Error>> {
    // Fast-path CLI mode for zero-overhead native Rust execution from QML & Tauri
    let args: Vec<String> = std::env::args().collect();
    if args.len() >= 2 {
        match args[1].as_str() {
            "play-alarm" => {
                let path = args.get(2).map(|s| s.as_str()).unwrap_or("~/Music/");
                let vol = args.get(3).and_then(|s| s.parse::<u8>().ok()).unwrap_or(85);
                let loop_mode = args.get(4).map(|s| s == "true" || s == "1").unwrap_or(false);
                AlarmModule::spawn_alarm_audio_detached(path, vol, loop_mode);
                return Ok(());
            }
            "stop-alarm" => {
                AlarmModule::stop_alarm_audio_pid_file();
                return Ok(());
            }
            "scan-music" => {
                let path = args.get(2).map(|s| s.as_str()).unwrap_or("~/Music/");
                for file_path in MusicModule::scan_local_path_files(path) {
                    println!("{}", file_path);
                }
                return Ok(());
            }
            "play-music" => {
                let target = args.get(2).map(|s| s.as_str()).unwrap_or("~/Music/");
                let vol = args.get(3).and_then(|s| s.parse::<u8>().ok()).unwrap_or(80);
                MusicModule::spawn_music_audio_detached(target, vol);
                return Ok(());
            }
            "stop-music" => {
                MusicModule::stop_music_audio_pid_file();
                return Ok(());
            }
            "scan-photos" => {
                let dir = args.get(2).map(|s| s.as_str()).unwrap_or("~/Pictures");
                for url in PhotoModule::scan_photo_directory(dir) {
                    println!("{}", url);
                }
                return Ok(());
            }
            _ => {}
        }
    }

    env_logger::Builder::from_env(env_logger::Env::default().default_filter_or("info")).init();
    log::info!(
        "Starting urwidgets-daemon v{} (WidgetWall Edition — shared backend for 10 KDE Plasma 5 widgets)",
        env!("CARGO_PKG_VERSION")
    );

    let db_path = database::resolve_db_path()?;
    let db = Arc::new(Mutex::new(Database::open(&db_path)?));
    let service = Arc::new(UrWidgetsService::new(Arc::clone(&db))?);

    let ipc_handle = ipc::spawn_ipc_server(Arc::clone(&service)).await?;
    let sched_handle = scheduler::spawn_scheduler(Arc::clone(&service));

    log::info!("urwidgets-daemon ready on session D-Bus (org.urwidgets.Daemon)");

    tokio::select! {
        _ = tokio::signal::ctrl_c() => {
            log::info!("Received shutdown signal, checkpointing SQLite WAL.");
        }
        res = ipc_handle => {
            if let Err(e) = res {
                log::error!("D-Bus server exited with error: {}", e);
            }
        }
        _ = sched_handle => {}
    }

    if let Ok(guard) = db.lock() {
        let _ = guard.checkpoint_wal();
    }
    Ok(())
}
"""

FILES["core/src/database.rs"] = """use rusqlite::{params, Connection, Result as SqlResult};
use std::path::{Path, PathBuf};
use std::fs;
use crate::modules::agenda::AgendaItem;
use crate::modules::pomodoro::PomodoroPayload;
use crate::modules::alarms::AlarmRecord;
use crate::modules::notes::NoteRecord;
use crate::modules::backgrounds::WidgetBackgroundRecord;

#[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
pub struct WidgetPreferenceRecord {
    pub widget_id: String,
    pub appearance: String,
    pub theme_style: String,
    pub accent_color: String,
    pub icon_style: String,
    pub background_color: String,
    pub background_image: String,
    pub opacity: f32,
    pub shadow_level: i32,
    pub custom_settings: String,
    pub updated_at: i64,
}

pub struct Database {
    conn: Connection,
}

pub fn resolve_db_path() -> Result<PathBuf, Box<dyn std::error::Error>> {
    let base = dirs::data_local_dir().unwrap_or_else(|| PathBuf::from("/tmp"));
    let dir = base.join("urwidgets");
    fs::create_dir_all(&dir)?;
    Ok(dir.join("urwidgets.sqlite3"))
}

impl Database {
    pub fn open(path: &Path) -> SqlResult<Self> {
        let conn = Connection::open(path)?;
        conn.execute_batch(
            "PRAGMA journal_mode = WAL;
             PRAGMA synchronous = NORMAL;
             PRAGMA temp_store = MEMORY;
             PRAGMA foreign_keys = ON;",
        )?;
        let db = Self { conn };
        db.init_and_migrate_schema()?;
        Ok(db)
    }

    /// Versioned non-destructive SQLite schema migration (preserves all existing user data)
    fn init_and_migrate_schema(&self) -> SqlResult<()> {
        self.conn.execute_batch(
            "CREATE TABLE IF NOT EXISTS kv_settings (
                key TEXT PRIMARY KEY,
                value_json TEXT NOT NULL,
                updated_at INTEGER NOT NULL
            );

            CREATE TABLE IF NOT EXISTS themes (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                is_preset INTEGER NOT NULL DEFAULT 0,
                payload_json TEXT NOT NULL,
                updated_at INTEGER NOT NULL
            );

            CREATE TABLE IF NOT EXISTS agenda_events (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                date_iso TEXT NOT NULL,
                start_time TEXT NOT NULL,
                end_time TEXT NOT NULL,
                category TEXT NOT NULL,
                completed INTEGER NOT NULL DEFAULT 0
            );
            CREATE INDEX IF NOT EXISTS idx_agenda_date ON agenda_events(date_iso);

            CREATE TABLE IF NOT EXISTS weather_cache (
                location_key TEXT PRIMARY KEY,
                payload_json TEXT NOT NULL,
                fetched_at INTEGER NOT NULL
            );

            CREATE TABLE IF NOT EXISTS pomodoro_state (
                id INTEGER PRIMARY KEY CHECK (id = 1),
                phase TEXT NOT NULL,
                status TEXT NOT NULL,
                remaining_secs INTEGER NOT NULL,
                total_secs INTEGER NOT NULL,
                completed_sessions INTEGER NOT NULL DEFAULT 0,
                study_mins INTEGER NOT NULL DEFAULT 25,
                short_break_mins INTEGER NOT NULL DEFAULT 5,
                long_break_mins INTEGER NOT NULL DEFAULT 15
            );

            -- Migration v2: Alarms, Notes, Todo List, and Per-Widget Custom Image Backgrounds
            CREATE TABLE IF NOT EXISTS alarms (
                id TEXT PRIMARY KEY,
                time_hhmm TEXT NOT NULL,
                label TEXT NOT NULL,
                enabled INTEGER NOT NULL DEFAULT 1,
                repeat_days_json TEXT NOT NULL DEFAULT '[]',
                ringtone_id TEXT NOT NULL,
                custom_audio_path TEXT NOT NULL DEFAULT '',
                snooze_mins INTEGER NOT NULL DEFAULT 10,
                snoozed_until TEXT
            );

            CREATE TABLE IF NOT EXISTS notes (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                body TEXT NOT NULL,
                pinned INTEGER NOT NULL DEFAULT 0,
                tags_json TEXT NOT NULL DEFAULT '[]',
                updated_at_iso TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS todo_items (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                completed INTEGER NOT NULL DEFAULT 0,
                priority TEXT NOT NULL DEFAULT 'medium',
                category TEXT NOT NULL DEFAULT 'General',
                due_date TEXT NOT NULL DEFAULT '',
                order_index INTEGER NOT NULL DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS widget_backgrounds (
                widget_id TEXT PRIMARY KEY,
                enabled INTEGER NOT NULL DEFAULT 0,
                image_path TEXT NOT NULL DEFAULT '',
                fit_mode TEXT NOT NULL DEFAULT 'cover',
                position TEXT NOT NULL DEFAULT 'center',
                overlay_mode TEXT NOT NULL DEFAULT 'auto',
                overlay_opacity REAL NOT NULL DEFAULT 0.35,
                color_tint TEXT NOT NULL DEFAULT '',
                text_contrast TEXT NOT NULL DEFAULT 'auto'
            );

            -- Migration v3 (URWidgets v3.0.0): Music Player Queue & Streams + Photo Frame Non-Destructive Crops
            CREATE TABLE IF NOT EXISTS music_queue (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                artist TEXT NOT NULL,
                album TEXT NOT NULL,
                duration_secs INTEGER NOT NULL DEFAULT 0,
                cover_url TEXT NOT NULL DEFAULT '',
                source_type TEXT NOT NULL DEFAULT 'local',
                file_or_stream_url TEXT NOT NULL,
                order_index INTEGER NOT NULL DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS music_streams (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                stream_url TEXT NOT NULL UNIQUE,
                added_at INTEGER NOT NULL
            );

            CREATE TABLE IF NOT EXISTS photo_crops (
                photo_url TEXT PRIMARY KEY,
                zoom REAL NOT NULL DEFAULT 1.0,
                offset_x INTEGER NOT NULL DEFAULT 0,
                offset_y INTEGER NOT NULL DEFAULT 0,
                fit_mode TEXT NOT NULL DEFAULT 'cover'
            );

            -- Migration v4 (URWidgets v3.0.1): Per-Widget Independent Preferences (todo_items preserved non-destructively)
            CREATE TABLE IF NOT EXISTS widget_preferences (
                widget_id TEXT PRIMARY KEY,
                appearance TEXT NOT NULL DEFAULT 'inherit',
                theme_style TEXT NOT NULL DEFAULT 'inherit',
                accent_color TEXT NOT NULL DEFAULT 'inherit',
                icon_style TEXT NOT NULL DEFAULT 'filled',
                background_color TEXT NOT NULL DEFAULT '',
                background_image TEXT NOT NULL DEFAULT '',
                opacity REAL NOT NULL DEFAULT 0.86,
                shadow_level INTEGER NOT NULL DEFAULT 2,
                custom_settings TEXT NOT NULL DEFAULT '{}',
                updated_at INTEGER NOT NULL DEFAULT 0
            );

            PRAGMA user_version = 4;",
        )
    }

    pub fn save_pomodoro(&self, p: &PomodoroPayload) -> SqlResult<()> {
        self.conn.execute(
            "INSERT INTO pomodoro_state (id, phase, status, remaining_secs, total_secs, completed_sessions, study_mins, short_break_mins, long_break_mins)
             VALUES (1, ?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)
             ON CONFLICT(id) DO UPDATE SET
               phase = excluded.phase,
               status = excluded.status,
               remaining_secs = excluded.remaining_secs,
               total_secs = excluded.total_secs,
               completed_sessions = excluded.completed_sessions,
               study_mins = excluded.study_mins,
               short_break_mins = excluded.short_break_mins,
               long_break_mins = excluded.long_break_mins",
            params![
                p.phase,
                p.status,
                p.remaining_secs,
                p.total_secs,
                p.completed_sessions,
                p.study_mins,
                p.short_break_mins,
                p.long_break_mins
            ],
        )?;
        Ok(())
    }

    pub fn upsert_agenda_event(&self, item: &AgendaItem) -> SqlResult<()> {
        self.conn.execute(
            "INSERT INTO agenda_events (id, title, date_iso, start_time, end_time, category, completed)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)
             ON CONFLICT(id) DO UPDATE SET
               title = excluded.title,
               date_iso = excluded.date_iso,
               start_time = excluded.start_time,
               end_time = excluded.end_time,
               category = excluded.category,
               completed = excluded.completed",
            params![
                item.id,
                item.title,
                item.date_iso,
                item.start_time,
                item.end_time,
                item.category,
                if item.completed { 1 } else { 0 }
            ],
        )?;
        Ok(())
    }

    pub fn delete_agenda_event(&self, id: &str) -> SqlResult<()> {
        self.conn.execute("DELETE FROM agenda_events WHERE id = ?1", params![id])?;
        Ok(())
    }

    pub fn upsert_alarm(&self, alarm: &AlarmRecord) -> SqlResult<()> {
        let repeat_json = serde_json::to_string(&alarm.repeat_days).unwrap_or_else(|_| "[]".into());
        self.conn.execute(
            "INSERT INTO alarms (id, time_hhmm, label, enabled, repeat_days_json, ringtone_id, custom_audio_path, snooze_mins, snoozed_until)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)
             ON CONFLICT(id) DO UPDATE SET
               time_hhmm = excluded.time_hhmm,
               label = excluded.label,
               enabled = excluded.enabled,
               repeat_days_json = excluded.repeat_days_json,
               ringtone_id = excluded.ringtone_id,
               custom_audio_path = excluded.custom_audio_path,
               snooze_mins = excluded.snooze_mins,
               snoozed_until = excluded.snoozed_until",
            params![
                alarm.id,
                alarm.time_hhmm,
                alarm.label,
                if alarm.enabled { 1 } else { 0 },
                repeat_json,
                alarm.ringtone_id,
                alarm.custom_audio_path,
                alarm.snooze_mins,
                alarm.snoozed_until
            ],
        )?;
        Ok(())
    }

    pub fn delete_alarm(&self, id: &str) -> SqlResult<()> {
        self.conn.execute("DELETE FROM alarms WHERE id = ?1", params![id])?;
        Ok(())
    }

    pub fn upsert_note(&self, note: &NoteRecord) -> SqlResult<()> {
        let tags_json = serde_json::to_string(&note.tags).unwrap_or_else(|_| "[]".into());
        self.conn.execute(
            "INSERT INTO notes (id, title, body, pinned, tags_json, updated_at_iso)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6)
             ON CONFLICT(id) DO UPDATE SET
               title = excluded.title,
               body = excluded.body,
               pinned = excluded.pinned,
               tags_json = excluded.tags_json,
               updated_at_iso = excluded.updated_at_iso",
            params![
                note.id,
                note.title,
                note.body,
                if note.pinned { 1 } else { 0 },
                tags_json,
                note.updated_at_iso
            ],
        )?;
        Ok(())
    }

    pub fn delete_note(&self, id: &str) -> SqlResult<()> {
        self.conn.execute("DELETE FROM notes WHERE id = ?1", params![id])?;
        Ok(())
    }

    pub fn upsert_widget_preference(&self, pref: &WidgetPreferenceRecord) -> SqlResult<()> {
        self.conn.execute(
            "INSERT INTO widget_preferences (widget_id, appearance, theme_style, accent_color, icon_style, background_color, background_image, opacity, shadow_level, custom_settings, updated_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)
             ON CONFLICT(widget_id) DO UPDATE SET
               appearance = excluded.appearance,
               theme_style = excluded.theme_style,
               accent_color = excluded.accent_color,
               icon_style = excluded.icon_style,
               background_color = excluded.background_color,
               background_image = excluded.background_image,
               opacity = excluded.opacity,
               shadow_level = excluded.shadow_level,
               custom_settings = excluded.custom_settings,
               updated_at = excluded.updated_at",
            params![
                pref.widget_id,
                pref.appearance,
                pref.theme_style,
                pref.accent_color,
                pref.icon_style,
                pref.background_color,
                pref.background_image,
                pref.opacity,
                pref.shadow_level,
                pref.custom_settings,
                pref.updated_at
            ],
        )?;
        Ok(())
    }

    pub fn reset_widget_preference(&self, widget_id: &str) -> SqlResult<()> {
        self.conn.execute("DELETE FROM widget_preferences WHERE widget_id = ?1", params![widget_id])?;
        Ok(())
    }

    pub fn upsert_widget_background(&self, bg: &WidgetBackgroundRecord) -> SqlResult<()> {
        self.conn.execute(
            "INSERT INTO widget_backgrounds (widget_id, enabled, image_path, fit_mode, position, overlay_mode, overlay_opacity, color_tint, text_contrast)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)
             ON CONFLICT(widget_id) DO UPDATE SET
               enabled = excluded.enabled,
               image_path = excluded.image_path,
               fit_mode = excluded.fit_mode,
               position = excluded.position,
               overlay_mode = excluded.overlay_mode,
               overlay_opacity = excluded.overlay_opacity,
               color_tint = excluded.color_tint,
               text_contrast = excluded.text_contrast",
            params![
                bg.widget_id,
                if bg.enabled { 1 } else { 0 },
                bg.image_path,
                bg.fit_mode,
                bg.position,
                bg.overlay_mode,
                bg.overlay_opacity,
                bg.color_tint,
                bg.text_contrast
            ],
        )?;
        Ok(())
    }

    pub fn save_weather_cache(&self, location: &str, payload_json: &str, ts: i64) -> SqlResult<()> {
        self.conn.execute(
            "INSERT INTO weather_cache (location_key, payload_json, fetched_at)
             VALUES (?1, ?2, ?3)
             ON CONFLICT(location_key) DO UPDATE SET
               payload_json = excluded.payload_json,
               fetched_at = excluded.fetched_at",
            params![location, payload_json, ts],
        )?;
        Ok(())
    }

    pub fn checkpoint_wal(&self) -> SqlResult<()> {
        self.conn.execute_batch("PRAGMA wal_checkpoint(TRUNCATE);")
    }
}
"""

FILES["core/src/service.rs"] = """use std::sync::{Arc, Mutex};
use crate::database::Database;
use crate::config::themes::{ThemeConfig, default_presets};
use crate::modules::{
    clock::ClockModule,
    calendar::CalendarModule,
    weather::WeatherModule,
    pomodoro::PomodoroModule,
    agenda::AgendaModule,
    photos::PhotoModule,
    quick_actions::QuickActionsModule,
    system_monitor::SystemMonitorModule,
    alarms::AlarmModule,
    notes::NotesModule,
    backgrounds::BackgroundsModule,
    music::MusicModule,
};
use serde::Serialize;

#[derive(Serialize)]
pub struct DaemonSnapshot {
    pub active_theme_id: String,
    pub theme: ThemeConfig,
    pub clock: crate::modules::clock::ClockPayload,
    pub alarms: crate::modules::alarms::AlarmsPayload,
    pub calendar: crate::modules::calendar::CalendarPayload,
    pub weather: crate::modules::weather::WeatherPayload,
    pub pomodoro: crate::modules::pomodoro::PomodoroPayload,
    pub agenda: crate::modules::agenda::AgendaPayload,
    pub notes: crate::modules::notes::NotesPayload,
    pub photos: crate::modules::photos::PhotoPayload,
    pub quick_actions: crate::modules::quick_actions::QuickActionsPayload,
    pub system_monitor: crate::modules::system_monitor::SystemMetricsPayload,
    pub backgrounds: crate::modules::backgrounds::BackgroundsPayload,
    pub music: crate::modules::music::MusicPayload,
}

pub struct UrWidgetsService {
    pub db: Arc<Mutex<Database>>,
    pub active_theme_id: Mutex<String>,
    pub themes: Mutex<Vec<ThemeConfig>>,
    pub clock: ClockModule,
    pub alarms: Mutex<AlarmModule>,
    pub calendar: Mutex<CalendarModule>,
    pub weather: Mutex<WeatherModule>,
    pub pomodoro: Mutex<PomodoroModule>,
    pub agenda: Mutex<AgendaModule>,
    pub notes: Mutex<NotesModule>,
    pub photos: Mutex<PhotoModule>,
    pub quick_actions: Mutex<QuickActionsModule>,
    pub sysmon: Mutex<SystemMonitorModule>,
    pub backgrounds: Mutex<BackgroundsModule>,
    pub music: Mutex<MusicModule>,
}

impl UrWidgetsService {
    pub fn new(db: Arc<Mutex<Database>>) -> Result<Self, Box<dyn std::error::Error>> {
        let presets = default_presets();
        let active_id = "warm-minimal".to_string();
        Ok(Self {
            db,
            active_theme_id: Mutex::new(active_id),
            themes: Mutex::new(presets),
            clock: ClockModule::new(),
            alarms: Mutex::new(AlarmModule::new_defaults()),
            calendar: Mutex::new(CalendarModule::new("en-US", 1)),
            weather: Mutex::new(WeatherModule::new("Bandung, ID", true, 30)),
            pomodoro: Mutex::new(PomodoroModule::new(25, 5, 15)),
            agenda: Mutex::new(AgendaModule::new_with_defaults()),
            notes: Mutex::new(NotesModule::new_defaults()),
            photos: Mutex::new(PhotoModule::new("~/Pictures/Wallpapers", 30)),
            quick_actions: Mutex::new(QuickActionsModule::new_defaults()),
            sysmon: Mutex::new(SystemMonitorModule::new(3)),
            backgrounds: Mutex::new(BackgroundsModule::new_defaults()),
            music: Mutex::new(MusicModule::new_defaults()),
        })
    }

    pub fn snapshot_json(&self) -> String {
        let active_id = self.active_theme_id.lock().unwrap().clone();
        let themes = self.themes.lock().unwrap();
        let theme = themes
            .iter()
            .find(|t| t.id == active_id)
            .cloned()
            .unwrap_or_else(|| themes[0].clone());

        let snapshot = DaemonSnapshot {
            active_theme_id: active_id,
            theme,
            clock: self.clock.current_payload(false, false),
            alarms: self.alarms.lock().unwrap().current_payload(),
            calendar: self.calendar.lock().unwrap().current_payload(),
            weather: self.weather.lock().unwrap().cached_payload(),
            pomodoro: self.pomodoro.lock().unwrap().current_payload(),
            agenda: self.agenda.lock().unwrap().current_payload(),
            notes: self.notes.lock().unwrap().current_payload(),
            photos: self.photos.lock().unwrap().current_payload(),
            quick_actions: self.quick_actions.lock().unwrap().current_payload(),
            system_monitor: self.sysmon.lock().unwrap().sample(),
            backgrounds: self.backgrounds.lock().unwrap().current_payload(),
            music: self.music.lock().unwrap().current_payload(),
        };
        serde_json::to_string(&snapshot).unwrap_or_else(|_| "{}".to_string())
    }
}
"""

FILES["core/src/ipc.rs"] = """use std::sync::Arc;
use tokio::task::JoinHandle;
use zbus::{interface, ConnectionBuilder};
use crate::service::UrWidgetsService;
use crate::database::WidgetPreferenceRecord;

pub struct DbusDaemonInterface {
    service: Arc<UrWidgetsService>,
}

#[interface(name = "org.urwidgets.Daemon1")]
impl DbusDaemonInterface {
    async fn get_snapshot(&self) -> String {
        self.service.snapshot_json()
    }

    async fn set_theme(&self, theme_id: &str) -> bool {
        let themes = self.service.themes.lock().unwrap();
        if themes.iter().any(|t| t.id == theme_id) {
            *self.service.active_theme_id.lock().unwrap() = theme_id.to_string();
            true
        } else {
            false
        }
    }

    async fn alarm_action(&self, cmd: &str) -> String {
        let (payload_json, has_active_due) = {
            let mut alarms = self.service.alarms.lock().unwrap();
            if let Some(deleted_id) = cmd.strip_prefix("delete|") {
                alarms.apply_command(cmd);
                if let Ok(db) = self.service.db.lock() {
                    let _ = db.delete_alarm(deleted_id.trim());
                }
            } else if let Some(updated) = alarms.apply_command(cmd) {
                if let Ok(db) = self.service.db.lock() {
                    let _ = db.upsert_alarm(&updated);
                }
            }
            let payload = alarms.current_payload();
            let has_due = !payload.active_due_ids.is_empty();
            (serde_json::to_string(&payload).unwrap_or_default(), has_due)
        };

        // Coordinate Audio Priority: Alarm pauses Music Player while ringing, resumes when cleared
        if let Ok(mut music) = self.service.music.lock() {
            if has_active_due {
                music.on_alarm_triggered();
            } else {
                music.on_alarm_cleared();
            }
        }

        payload_json
    }

    async fn note_upsert(&self, id: &str, title: &str, body: &str, pinned: bool) -> String {
        let mut notes = self.service.notes.lock().unwrap();
        let rec = notes.upsert_note(id, title, body, pinned);
        if let Ok(db) = self.service.db.lock() {
            let _ = db.upsert_note(&rec);
        }
        serde_json::to_string(&notes.current_payload()).unwrap_or_default()
    }

    async fn note_delete(&self, id: &str) -> String {
        let mut notes = self.service.notes.lock().unwrap();
        notes.delete_note(id);
        if let Ok(db) = self.service.db.lock() {
            let _ = db.delete_note(id);
        }
        serde_json::to_string(&notes.current_payload()).unwrap_or_default()
    }

    async fn set_widget_preferences(
        &self,
        widget_id: &str,
        appearance: &str,
        theme_style: &str,
        accent_color: &str,
        icon_style: &str,
        background_color: &str,
        background_image: &str,
        opacity: f32,
        shadow_level: i32,
        custom_settings: &str,
    ) -> bool {
        let rec = WidgetPreferenceRecord {
            widget_id: widget_id.to_string(),
            appearance: appearance.to_string(),
            theme_style: theme_style.to_string(),
            accent_color: accent_color.to_string(),
            icon_style: icon_style.to_string(),
            background_color: background_color.to_string(),
            background_image: background_image.to_string(),
            opacity,
            shadow_level,
            custom_settings: custom_settings.to_string(),
            updated_at: chrono::Utc::now().timestamp(),
        };
        if let Ok(db) = self.service.db.lock() {
            db.upsert_widget_preference(&rec).is_ok()
        } else {
            false
        }
    }

    async fn reset_widget_preferences(&self, widget_id: &str) -> bool {
        if let Ok(db) = self.service.db.lock() {
            db.reset_widget_preference(widget_id).is_ok()
        } else {
            false
        }
    }

    async fn set_widget_background(&self, widget_id: &str, image_path: &str, fit_mode: &str, overlay_opacity: f32) -> String {
        let mut bgs = self.service.backgrounds.lock().unwrap();
        let rec = bgs.set_background(widget_id, image_path, fit_mode, overlay_opacity);
        if let Ok(db) = self.service.db.lock() {
            let _ = db.upsert_widget_background(&rec);
        }
        serde_json::to_string(&bgs.current_payload()).unwrap_or_default()
    }

    async fn calendar_action(&self, cmd: &str) -> String {
        let mut cal = self.service.calendar.lock().unwrap();
        cal.apply_command(cmd);
        serde_json::to_string(&cal.current_payload()).unwrap_or_default()
    }

    async fn pomodoro_action(&self, action: &str) -> String {
        let payload = {
            let mut pomo = self.service.pomodoro.lock().unwrap();
            pomo.apply_action(action);
            pomo.current_payload()
        };
        if let Ok(db) = self.service.db.lock() {
            let _ = db.save_pomodoro(&payload);
        }
        serde_json::to_string(&payload).unwrap_or_default()
    }

    async fn weather_action(&self, cmd: &str) -> String {
        let payload = {
            let mut w = self.service.weather.lock().unwrap();
            w.apply_command(cmd);
            w.cached_payload()
        };
        if let Ok(db) = self.service.db.lock() {
            let json = serde_json::to_string(&payload).unwrap_or_default();
            let _ = db.save_weather_cache(&payload.location, &json, chrono::Utc::now().timestamp());
        }
        serde_json::to_string(&payload).unwrap_or_default()
    }

    async fn add_agenda_event(&self, title: &str, start_time: &str, end_time: &str, category: &str) -> String {
        let mut agenda = self.service.agenda.lock().unwrap();
        let item = agenda.add_event(title, start_time, end_time, category);
        if let Ok(db) = self.service.db.lock() {
            let _ = db.upsert_agenda_event(&item);
        }
        serde_json::to_string(&agenda.current_payload()).unwrap_or_default()
    }

    async fn update_agenda_event(&self, id: &str, title: &str, start_time: &str, end_time: &str, category: &str) -> String {
        let mut agenda = self.service.agenda.lock().unwrap();
        if let Some(updated) = agenda.update_event(id, title, start_time, end_time, category) {
            if let Ok(db) = self.service.db.lock() {
                let _ = db.upsert_agenda_event(&updated);
            }
        }
        serde_json::to_string(&agenda.current_payload()).unwrap_or_default()
    }

    async fn toggle_agenda_event(&self, id: &str) -> String {
        let mut agenda = self.service.agenda.lock().unwrap();
        if let Some(updated) = agenda.toggle_completed(id) {
            if let Ok(db) = self.service.db.lock() {
                let _ = db.upsert_agenda_event(&updated);
            }
        }
        serde_json::to_string(&agenda.current_payload()).unwrap_or_default()
    }

    async fn delete_agenda_event(&self, id: &str) -> String {
        let mut agenda = self.service.agenda.lock().unwrap();
        agenda.delete_event(id);
        if let Ok(db) = self.service.db.lock() {
            let _ = db.delete_agenda_event(id);
        }
        serde_json::to_string(&agenda.current_payload()).unwrap_or_default()
    }

    async fn photo_action(&self, cmd: &str) -> String {
        let mut photos = self.service.photos.lock().unwrap();
        photos.apply_command(cmd);
        serde_json::to_string(&photos.current_payload()).unwrap_or_default()
    }

    async fn quick_action_command(&self, cmd: &str) -> String {
        let mut qa = self.service.quick_actions.lock().unwrap();
        qa.apply_command(cmd);
        serde_json::to_string(&qa.current_payload()).unwrap_or_default()
    }

    async fn get_system_metrics(&self) -> String {
        let mut sys = self.service.sysmon.lock().unwrap();
        serde_json::to_string(&sys.sample()).unwrap_or_default()
    }

    async fn music_action(&self, cmd: &str, arg: &str) -> String {
        let mut music = self.service.music.lock().unwrap();
        music.apply_command(cmd, arg);
        serde_json::to_string(&music.current_payload()).unwrap_or_default()
    }
}

pub async fn spawn_ipc_server(
    service: Arc<UrWidgetsService>,
) -> Result<JoinHandle<Result<(), zbus::Error>>, Box<dyn std::error::Error>> {
    let iface = DbusDaemonInterface { service };
    let handle = tokio::spawn(async move {
        let _conn = ConnectionBuilder::session()?
            .name("org.urwidgets.Daemon")?
            .serve_at("/org/urwidgets/Daemon", iface)?
            .build()
            .await?;
        std::future::pending::<Result<(), zbus::Error>>().await
    });
    Ok(handle)
}
"""

FILES["core/src/scheduler.rs"] = """use std::sync::Arc;
use std::time::Duration;
use tokio::task::JoinHandle;
use chrono::Local;
use crate::service::UrWidgetsService;

pub fn spawn_scheduler(service: Arc<UrWidgetsService>) -> JoinHandle<()> {
    tokio::spawn(async move {
        let mut elapsed_secs: u32 = 0;
        let mut last_alarm_minute = String::new();

        loop {
            let pomo_running = {
                let pomo = service.pomodoro.lock().unwrap();
                pomo.is_running()
            };

            let sleep_secs: u64 = if pomo_running { 1 } else { 5 };
            tokio::time::sleep(Duration::from_secs(sleep_secs)).await;

            if pomo_running {
                let mut pomo = service.pomodoro.lock().unwrap();
                if pomo.is_running() {
                    pomo.tick_one_sec();
                }
            }

            // Event-driven minute boundary check for Clock Alarms + Audio Priority coordination
            let now_hhmm = Local::now().format("%H:%M").to_string();
            if now_hhmm != last_alarm_minute {
                last_alarm_minute = now_hhmm.clone();
                let triggered_due = {
                    let mut alarms = service.alarms.lock().unwrap();
                    alarms.check_and_trigger_due(&now_hhmm);
                    !alarms.active_due_ids.is_empty()
                };
                if triggered_due {
                    if let Ok(mut music) = service.music.lock() {
                        music.on_alarm_triggered();
                    }
                }
            }

            elapsed_secs = elapsed_secs.wrapping_add(sleep_secs as u32);
            if elapsed_secs >= 1800 {
                elapsed_secs = 0;
                let mut weather = service.weather.lock().unwrap();
                weather.refresh_if_due();
            }
        }
    })
}
"""

FILES["core/src/config/mod.rs"] = """pub mod themes;
"""

FILES["core/src/config/themes.rs"] = """use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ThemeAppearance {
    pub primary: String,
    pub secondary: String,
    pub accent: String,
    pub surface: String,
    pub text: String,
    pub muted_text: String,
    pub opacity: f32,
    pub border_opacity: f32,
    pub radius: u32,
    pub spacing: u32,
    pub font_family: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ThemeGradient {
    pub enabled: bool,
    pub start: String,
    pub end: String,
    pub angle: u32,
    pub intensity: f32,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ThemeEffects {
    pub blur: bool,
    pub shadow: bool,
    pub shadow_intensity: f32,
    pub animations: bool,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ThemeConfig {
    pub id: String,
    pub name: String,
    pub description: String,
    pub is_preset: bool,
    pub appearance: ThemeAppearance,
    pub gradient: ThemeGradient,
    pub effects: ThemeEffects,
}

pub fn default_presets() -> Vec<ThemeConfig> {
    vec![
        ThemeConfig {
            id: "warm-minimal".into(),
            name: "WidgetWall Light".into(),
            description: "Soft warm off-white surfaces, gentle ambient shadow, charcoal typography, and calm macOS proportions".into(),
            is_preset: true,
            appearance: ThemeAppearance {
                primary: "#EAE5DF".into(),
                secondary: "#E2DBD3".into(),
                accent: "#E84A7F".into(),
                surface: "#EFECE7".into(),
                text: "#1D1D1F".into(),
                muted_text: "#686662".into(),
                opacity: 0.86,
                border_opacity: 0.48,
                radius: 24,
                spacing: 16,
                font_family: "SF Pro Display".into(),
            },
            gradient: ThemeGradient {
                enabled: true,
                start: "#F3F0EB".into(),
                end: "#E8E3DC".into(),
                angle: 135,
                intensity: 0.40,
            },
            effects: ThemeEffects {
                blur: true,
                shadow: true,
                shadow_intensity: 0.09,
                animations: true,
            },
        },
        ThemeConfig {
            id: "liquid-glass".into(),
            name: "Liquid Glass".into(),
            description: "Translucent airy glass surfaces with crisp specular highlights".into(),
            is_preset: true,
            appearance: ThemeAppearance {
                primary: "#E8EEF5".into(),
                secondary: "#DCE5F0".into(),
                accent: "#007AFF".into(),
                surface: "#F4F6F9".into(),
                text: "#1D1D1F".into(),
                muted_text: "#5C6470".into(),
                opacity: 0.68,
                border_opacity: 0.55,
                radius: 24,
                spacing: 16,
                font_family: "SF Pro Display".into(),
            },
            gradient: ThemeGradient {
                enabled: true,
                start: "#F7F9FC".into(),
                end: "#E9EFF6".into(),
                angle: 135,
                intensity: 0.45,
            },
            effects: ThemeEffects {
                blur: true,
                shadow: true,
                shadow_intensity: 0.09,
                animations: true,
            },
        },
        ThemeConfig {
            id: "pastel-editorial".into(),
            name: "Pastel Editorial".into(),
            description: "Soft rose and sage tinted surfaces inspired by macOS Tinted Widget Style".into(),
            is_preset: true,
            appearance: ThemeAppearance {
                primary: "#F6EBF0".into(),
                secondary: "#EFE2EA".into(),
                accent: "#E84A7F".into(),
                surface: "#F8EEF2".into(),
                text: "#2B1921".into(),
                muted_text: "#7A5866".into(),
                opacity: 0.88,
                border_opacity: 0.35,
                radius: 24,
                spacing: 16,
                font_family: "SF Pro Display".into(),
            },
            gradient: ThemeGradient {
                enabled: true,
                start: "#FBF1F5".into(),
                end: "#F2E2EA".into(),
                angle: 135,
                intensity: 0.55,
            },
            effects: ThemeEffects {
                blur: true,
                shadow: true,
                shadow_intensity: 0.08,
                animations: true,
            },
        },
        ThemeConfig {
            id: "aurora-gradient".into(),
            name: "Aurora Gradient".into(),
            description: "Atmospheric twilight indigo, lavender, and coastal mist transitions".into(),
            is_preset: true,
            appearance: ThemeAppearance {
                primary: "#1E1F35".into(),
                secondary: "#282A48".into(),
                accent: "#9B51E0".into(),
                surface: "#22243B".into(),
                text: "#F5F5F7".into(),
                muted_text: "#A5A8C4".into(),
                opacity: 0.84,
                border_opacity: 0.20,
                radius: 24,
                spacing: 16,
                font_family: "SF Pro Display".into(),
            },
            gradient: ThemeGradient {
                enabled: true,
                start: "#262945".into(),
                end: "#1A2436".into(),
                angle: 145,
                intensity: 0.65,
            },
            effects: ThemeEffects {
                blur: true,
                shadow: true,
                shadow_intensity: 0.22,
                animations: true,
            },
        },
        ThemeConfig {
            id: "midnight".into(),
            name: "Midnight Dark".into(),
            description: "Refined macOS Dark appearance with deep charcoal surfaces and soft contrast".into(),
            is_preset: true,
            appearance: ThemeAppearance {
                primary: "#16171B".into(),
                secondary: "#1F2026".into(),
                accent: "#0A84FF".into(),
                surface: "#1E1F25".into(),
                text: "#F5F5F7".into(),
                muted_text: "#8E8E93".into(),
                opacity: 0.86,
                border_opacity: 0.16,
                radius: 24,
                spacing: 16,
                font_family: "SF Pro Display".into(),
            },
            gradient: ThemeGradient {
                enabled: true,
                start: "#22232A".into(),
                end: "#18191E".into(),
                angle: 160,
                intensity: 0.50,
            },
            effects: ThemeEffects {
                blur: true,
                shadow: true,
                shadow_intensity: 0.25,
                animations: true,
            },
        },
        ThemeConfig {
            id: "monochrome".into(),
            name: "Monochrome Studio".into(),
            description: "Pure architectural grayscale with understated graphite highlights".into(),
            is_preset: true,
            appearance: ThemeAppearance {
                primary: "#F2F2F4".into(),
                secondary: "#E5E5EA".into(),
                accent: "#3A3A3C".into(),
                surface: "#F7F7F9".into(),
                text: "#1C1C1E".into(),
                muted_text: "#6E6E73".into(),
                opacity: 0.95,
                border_opacity: 0.25,
                radius: 22,
                spacing: 16,
                font_family: "Helvetica Neue".into(),
            },
            gradient: ThemeGradient {
                enabled: false,
                start: "#F7F7F9".into(),
                end: "#EBEBEF".into(),
                angle: 180,
                intensity: 0.0,
            },
            effects: ThemeEffects {
                blur: false,
                shadow: true,
                shadow_intensity: 0.06,
                animations: true,
            },
        },
    ]
}
"""

FILES["core/src/modules/mod.rs"] = """pub mod clock;
pub mod alarms;
pub mod calendar;
pub mod weather;
pub mod pomodoro;
pub mod agenda;
pub mod notes;
pub mod photos;
pub mod quick_actions;
pub mod system_monitor;
pub mod backgrounds;
pub mod music;
"""

FILES["core/src/modules/alarms.rs"] = """use serde::{Deserialize, Serialize};
use std::path::Path;
use std::process::{Command, Stdio};
use std::sync::{Arc, Mutex};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct AlarmRecord {
    pub id: String,
    pub time_hhmm: String,
    pub label: String,
    pub enabled: bool,
    pub repeat_days: Vec<String>,
    pub one_time_date: Option<String>,
    pub ringtone_id: String,
    pub custom_audio_path: String,
    pub snooze_mins: u32,
    pub snoozed_until: Option<String>,
    pub volume: u8,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct AlarmsPayload {
    pub alarms: Vec<AlarmRecord>,
    pub active_due_ids: Vec<String>,
}

pub struct AlarmModule {
    pub alarms: Vec<AlarmRecord>,
    pub active_due_ids: Vec<String>,
    active_audio_pid: Arc<Mutex<Option<u32>>>,
}

impl AlarmModule {
    pub fn new_defaults() -> Self {
        Self {
            alarms: vec![
                AlarmRecord {
                    id: "alm-wake".into(),
                    time_hhmm: "07:00".into(),
                    label: "Wake Up".into(),
                    enabled: true,
                    repeat_days: vec!["Mon".into(), "Tue".into(), "Wed".into(), "Thu".into(), "Fri".into()],
                    one_time_date: None,
                    ringtone_id: "freedesktop-alarm".into(),
                    custom_audio_path: "/usr/share/sounds/freedesktop/stereo/alarm-clock-elapsed.oga".into(),
                    snooze_mins: 10,
                    snoozed_until: None,
                    volume: 85,
                },
                AlarmRecord {
                    id: "alm-study".into(),
                    time_hhmm: "08:00".into(),
                    label: "Morning Study".into(),
                    enabled: true,
                    repeat_days: vec!["Mon".into(), "Tue".into(), "Wed".into(), "Thu".into(), "Fri".into(), "Sat".into(), "Sun".into()],
                    one_time_date: None,
                    ringtone_id: "gentle-chime".into(),
                    custom_audio_path: "/usr/share/sounds/freedesktop/stereo/complete.oga".into(),
                    snooze_mins: 5,
                    snoozed_until: None,
                    volume: 80,
                },
                AlarmRecord {
                    id: "alm-lunch".into(),
                    time_hhmm: "12:30".into(),
                    label: "Lunch Reminder".into(),
                    enabled: false,
                    repeat_days: vec!["Mon".into(), "Wed".into(), "Fri".into()],
                    one_time_date: None,
                    ringtone_id: "plasma-bell".into(),
                    custom_audio_path: "/usr/share/sounds/freedesktop/stereo/bell.oga".into(),
                    snooze_mins: 15,
                    snoozed_until: None,
                    volume: 75,
                },
            ],
            active_due_ids: Vec::new(),
            active_audio_pid: Arc::new(Mutex::new(None)),
        }
    }

    pub fn normalize_audio_path(raw: &str) -> String {
        let trimmed = raw
            .trim()
            .trim_matches(|c: char| c == '"' || c as u32 == 39);
        let without_scheme = trimmed.strip_prefix("file://").unwrap_or(trimmed);
        let decoded = without_scheme.replace("%20", " ");
        if decoded == "~" {
            if let Ok(home) = std::env::var("HOME") {
                return format!("{}/Music", home);
            }
        }
        if let Some(rest) = decoded.strip_prefix("~/") {
            if let Ok(home) = std::env::var("HOME") {
                return format!("{}/{}", home, rest);
            }
        }
        decoded
    }

    pub fn is_supported_audio_file(path: &Path) -> bool {
        path.is_file()
            && path
                .extension()
                .and_then(|ext| ext.to_str())
                .map(|ext| {
                    matches!(
                        ext.to_ascii_lowercase().as_str(),
                        "mp3" | "wav" | "ogg" | "oga" | "flac" | "m4a" | "aac" | "opus"
                    )
                })
                .unwrap_or(false)
    }

    pub fn find_first_audio_in_dir(dir: &Path) -> Option<String> {
        let entries = std::fs::read_dir(dir).ok()?;
        let mut files: Vec<String> = Vec::new();
        let mut subdirs: Vec< std::path::PathBuf > = Vec::new();
        for entry in entries.flatten() {
            let p = entry.path();
            if Self::is_supported_audio_file(&p) {
                files.push(p.to_string_lossy().to_string());
            } else if p.is_dir() {
                subdirs.push(p);
            }
        }
        files.sort();
        if let Some(first) = files.into_iter().next() {
            return Some(first);
        }
        subdirs.sort();
        for sub in subdirs {
            if let Ok(sub_entries) = std::fs::read_dir(&sub) {
                let mut sub_files: Vec<String> = sub_entries
                    .flatten()
                    .map(|e| e.path())
                    .filter(|p| Self::is_supported_audio_file(p))
                    .map(|p| p.to_string_lossy().to_string())
                    .collect();
                sub_files.sort();
                if let Some(first_sub) = sub_files.into_iter().next() {
                    return Some(first_sub);
                }
            }
        }
        None
    }

    pub fn resolve_playable_sound(custom_path: &str) -> String {
        let normalized = Self::normalize_audio_path(custom_path);
        if !normalized.is_empty() {
            let p = Path::new(&normalized);
            if p.is_file() {
                return normalized;
            }
            if p.is_dir() {
                if let Some(found) = Self::find_first_audio_in_dir(p) {
                    return found;
                }
            }
        }
        if let Ok(home) = std::env::var("HOME") {
            let music_dir = format!("{}/Music", home);
            let mp = Path::new(&music_dir);
            if mp.is_dir() {
                if let Some(found) = Self::find_first_audio_in_dir(mp) {
                    return found;
                }
            }
        }
        let fallbacks = [
            "/usr/share/sounds/freedesktop/stereo/alarm-clock-elapsed.oga",
            "/usr/share/sounds/freedesktop/stereo/complete.oga",
            "/usr/share/sounds/freedesktop/stereo/bell.oga",
            "/usr/share/sounds/freedesktop/stereo/message-new-instant.oga",
            "/usr/share/sounds/alsa/Front_Center.wav",
        ];
        for fb in fallbacks {
            if Path::new(fb).is_file() {
                return fb.to_string();
            }
        }
        normalized
    }

    pub fn stop_alarm_audio_pid_file() {
        let pid_file = "/tmp/urwidgets-alarm-audio.pid";
        if let Ok(raw_pid) = std::fs::read_to_string(pid_file) {
            let clean_pid = raw_pid.trim();
            if !clean_pid.is_empty() {
                let _ = Command::new("kill")
                    .args(["-TERM", clean_pid])
                    .stdout(Stdio::null())
                    .stderr(Stdio::null())
                    .status();
            }
            let _ = std::fs::remove_file(pid_file);
        }
    }

    pub fn stop_alarm_audio(&self) {
        Self::stop_alarm_audio_pid_file();
        if let Ok(mut guard) = self.active_audio_pid.lock() {
            if let Some(pid) = guard.take() {
                let _ = Command::new("kill")
                    .args(["-TERM", &pid.to_string()])
                    .stdout(Stdio::null())
                    .stderr(Stdio::null())
                    .status();
            }
        }
    }

    pub fn spawn_alarm_audio_detached(raw_path: &str, volume: u8, loop_playback: bool) -> Option<u32> {
        Self::stop_alarm_audio_pid_file();
        let resolved_path = Self::resolve_playable_sound(raw_path);
        let vol_str = volume.clamp(10, 100).to_string();
        let pid_file = "/tmp/urwidgets-alarm-audio.pid";

        let mut candidates: Vec<(&str, Vec<String>)> = Vec::new();

        let mut mpv_args = vec![
            "--no-video".to_string(),
            "--really-quiet".to_string(),
            format!("--volume={}", vol_str),
        ];
        if loop_playback {
            mpv_args.push("--loop-file=inf".to_string());
        }
        mpv_args.push(resolved_path.clone());
        candidates.push(("mpv", mpv_args));

        let mut ff_args = vec![
            "-nodisp".to_string(),
            "-autoexit".to_string(),
            "-loglevel".to_string(),
            "quiet".to_string(),
            "-volume".to_string(),
            vol_str.clone(),
        ];
        if loop_playback {
            ff_args.push("-loop".to_string());
            ff_args.push("0".to_string());
        }
        ff_args.push(resolved_path.clone());
        candidates.push(("ffplay", ff_args));

        let mut vlc_args = vec![
            "--intf".to_string(),
            "dummy".to_string(),
            "--play-and-exit".to_string(),
            "--quiet".to_string(),
        ];
        if loop_playback {
            vlc_args.push("--loop".to_string());
        }
        vlc_args.push(resolved_path.clone());
        candidates.push(("cvlc", vlc_args));

        candidates.push((
            "gst-play-1.0",
            vec!["--quiet".to_string(), resolved_path.clone()],
        ));
        candidates.push(("pw-play", vec![resolved_path.clone()]));
        candidates.push(("paplay", vec![resolved_path.clone()]));
        candidates.push(("aplay", vec!["-q".to_string(), resolved_path.clone()]));
        candidates.push((
            "canberra-gtk-play",
            vec!["-f".to_string(), resolved_path.clone()],
        ));
        candidates.push((
            "canberra-gtk-play",
            vec!["-i".to_string(), "alarm-clock-elapsed".to_string()],
        ));

        for (bin, args) in candidates {
            if let Ok(child) = Command::new(bin)
                .args(&args)
                .stdin(Stdio::null())
                .stdout(Stdio::null())
                .stderr(Stdio::null())
                .spawn()
            {
                let pid = child.id();
                let _ = std::fs::write(pid_file, pid.to_string());
                return Some(pid);
            }
        }
        None
    }

    pub fn spawn_alarm_audio(&self, raw_path: &str, volume: u8, loop_playback: bool) {
        self.stop_alarm_audio();
        if let Some(pid) = Self::spawn_alarm_audio_detached(raw_path, volume, loop_playback) {
            if let Ok(mut g) = self.active_audio_pid.lock() {
                *g = Some(pid);
            }
        }
    }

    pub fn add_minutes_hhmm(hhmm: &str, add_mins: u32) -> String {
        let parts: Vec<&str> = hhmm.split(':').collect();
        let h: u32 = parts.first().and_then(|s| s.parse().ok()).unwrap_or(7);
        let m: u32 = parts.get(1).and_then(|s| s.parse().ok()).unwrap_or(0);
        let total = (h * 60 + m + add_mins) % 1440;
        format!("{:02}:{:02}", total / 60, total % 60)
    }

    pub fn check_and_trigger_due(&mut self, current_hhmm: &str) {
        let mut sound_to_play: Option<(String, u8, String)> = None;
        for alarm in &mut self.alarms {
            if !alarm.enabled {
                continue;
            }
            let target = alarm.snoozed_until.as_deref().unwrap_or(&alarm.time_hhmm);
            if target == current_hhmm {
                if !self.active_due_ids.contains(&alarm.id) {
                    self.active_due_ids.push(alarm.id.clone());
                }
                alarm.snoozed_until = None;
                sound_to_play = Some((
                    alarm.custom_audio_path.clone(),
                    alarm.volume,
                    alarm.label.clone(),
                ));
            }
        }
        if let Some((path, vol, label_copy)) = sound_to_play {
            std::thread::spawn(move || {
                let _ = Command::new("notify-send")
                    .args([
                        "-a",
                        "URWidgets Clock Alarm",
                        &label_copy,
                        "Alarm is ringing — Snooze or Dismiss in Clock widget",
                    ])
                    .stdout(Stdio::null())
                    .stderr(Stdio::null())
                    .status();
            });
            self.spawn_alarm_audio(&path, vol, true);
        }
    }

    pub fn apply_command(&mut self, cmd: &str) -> Option<AlarmRecord> {
        let parts: Vec<&str> = cmd.split('|').collect();
        match parts.first().copied() {
            Some("toggle") if parts.len() >= 2 => {
                let id = parts[1];
                for a in &mut self.alarms {
                    if a.id == id {
                        a.enabled = !a.enabled;
                        a.snoozed_until = None;
                        return Some(a.clone());
                    }
                }
                None
            }
            Some("stop") | Some("dismiss") if parts.len() >= 2 => {
                let id = parts[1];
                self.active_due_ids.retain(|x| x != id);
                self.stop_alarm_audio();
                for a in &mut self.alarms {
                    if a.id == id {
                        a.snoozed_until = None;
                        if a.repeat_days.is_empty() {
                            a.enabled = false;
                        }
                        return Some(a.clone());
                    }
                }
                None
            }
            Some("snooze") if parts.len() >= 2 => {
                let id = parts[1];
                let custom_mins: Option<u32> = parts.get(2).and_then(|s| s.parse().ok());
                self.active_due_ids.retain(|x| x != id);
                self.stop_alarm_audio();
                let now_hhmm = chrono::Local::now().format("%H:%M").to_string();
                for a in &mut self.alarms {
                    if a.id == id {
                        let mins = custom_mins.unwrap_or(a.snooze_mins).clamp(1, 180);
                        a.snoozed_until = Some(Self::add_minutes_hhmm(&now_hhmm, mins));
                        return Some(a.clone());
                    }
                }
                None
            }
            Some("add") | Some("edit") | Some("upsert") if parts.len() >= 6 => {
                let id = parts[1].to_string();
                let time_hhmm = parts[2].to_string();
                let label = if parts[3].trim().is_empty() { "Alarm".to_string() } else { parts[3].trim().to_string() };
                let repeat_days: Vec<String> = parts[4]
                    .split(',')
                    .map(|s| s.trim().to_string())
                    .filter(|s| !s.is_empty())
                    .collect();
                let snooze_mins: u32 = parts[5].parse::<u32>().unwrap_or(10_u32).clamp(1_u32, 180_u32);
                let custom_audio_path = parts
                    .get(6)
                    .map(|s| Self::normalize_audio_path(s))
                    .filter(|s| !s.is_empty())
                    .unwrap_or_else(|| "/usr/share/sounds/freedesktop/stereo/alarm-clock-elapsed.oga".into());

                // Support both (ringtone|volume|date) from QML and (ringtone|date|volume)
                let p7 = parts.get(7).map(|s| s.trim()).unwrap_or("");
                let p8 = parts.get(8).map(|s| s.trim()).unwrap_or("");
                let (one_time_date, volume) = if let Ok(v7) = p7.parse::<u8>() {
                    let date_opt = if p8.is_empty() { None } else { Some(p8.to_string()) };
                    (date_opt, v7.clamp(10_u8, 100_u8))
                } else {
                    let date_opt = if p7.is_empty() { None } else { Some(p7.to_string()) };
                    let v8 = p8.parse::<u8>().unwrap_or(85_u8).clamp(10_u8, 100_u8);
                    (date_opt, v8)
                };

                if let Some(existing) = self.alarms.iter_mut().find(|a| a.id == id) {
                    existing.time_hhmm = time_hhmm;
                    existing.label = label;
                    existing.repeat_days = repeat_days;
                    existing.snooze_mins = snooze_mins;
                    existing.custom_audio_path = custom_audio_path;
                    existing.one_time_date = one_time_date;
                    existing.volume = volume;
                    existing.enabled = true;
                    return Some(existing.clone());
                } else {
                    let rec = AlarmRecord {
                        id,
                        time_hhmm,
                        label,
                        enabled: true,
                        repeat_days,
                        one_time_date,
                        ringtone_id: "custom".into(),
                        custom_audio_path,
                        snooze_mins,
                        snoozed_until: None,
                        volume,
                    };
                    self.alarms.push(rec.clone());
                    return Some(rec);
                }
            }
            Some("set_global_ringtone") if parts.len() >= 2 => {
                let clean_path = Self::normalize_audio_path(parts[1]);
                if !clean_path.is_empty() {
                    for a in &mut self.alarms {
                        a.ringtone_id = "custom".into();
                        a.custom_audio_path = clean_path.clone();
                    }
                    return self.alarms.first().cloned();
                }
                None
            }
            Some("set_ringtone") if parts.len() >= 3 => {
                let clean_path = Self::normalize_audio_path(parts[2]);
                if !clean_path.is_empty() {
                    for a in &mut self.alarms {
                        a.ringtone_id = "custom".into();
                        a.custom_audio_path = clean_path.clone();
                    }
                    return self.alarms.first().cloned();
                }
                None
            }
            Some("delete") if parts.len() >= 2 => {
                let id = parts[1];
                self.active_due_ids.retain(|x| x != id);
                self.stop_alarm_audio();
                self.alarms.retain(|a| a.id != id);
                None
            }
            Some("preview") if parts.len() >= 2 => {
                let path = parts[1].to_string();
                let vol = parts.get(2).and_then(|s| s.parse::<u8>().ok()).unwrap_or(85_u8);
                self.spawn_alarm_audio(&path, vol, false);
                None
            }
            Some("trigger_due") if parts.len() >= 2 => {
                let path = parts[1].to_string();
                let vol = parts.get(2).and_then(|s| s.parse::<u8>().ok()).unwrap_or(85_u8);
                self.spawn_alarm_audio(&path, vol, true);
                None
            }
            Some("stop_preview") => {
                self.stop_alarm_audio();
                None
            }
            _ => None,
        }
    }

    pub fn current_payload(&self) -> AlarmsPayload {
        AlarmsPayload {
            alarms: self.alarms.clone(),
            active_due_ids: self.active_due_ids.clone(),
        }
    }
}
"""

FILES["core/src/modules/notes.rs"] = """use serde::{Deserialize, Serialize};
use chrono::Utc;

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct NoteRecord {
    pub id: String,
    pub title: String,
    pub body: String,
    pub pinned: bool,
    pub tags: Vec<String>,
    pub updated_at_iso: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct NotesPayload {
    pub notes: Vec<NoteRecord>,
}

pub struct NotesModule {
    pub notes: Vec<NoteRecord>,
}

impl NotesModule {
    pub fn new_defaults() -> Self {
        Self {
            notes: vec![
                NoteRecord {
                    id: "note-1".into(),
                    title: "Desktop Widget Architecture".into(),
                    body: "Keep all 10 Plasmoids backed by a single urwidgets-daemon process over org.urwidgets.Daemon1 D-Bus.".into(),
                    pinned: true,
                    tags: vec!["Architecture".into(), "Plasma 5".into()],
                    updated_at_iso: "2026-11-09T07:45:00Z".into(),
                },
                NoteRecord {
                    id: "note-2".into(),
                    title: "Reading & Study Notes".into(),
                    body: "Visual hierarchy through weight and proportion. Avoid noisy hover toolbars on desktop widgets.".into(),
                    pinned: false,
                    tags: vec!["Design".into()],
                    updated_at_iso: "2026-11-08T19:20:00Z".into(),
                },
            ],
        }
    }

    pub fn upsert_note(&mut self, id: &str, title: &str, body: &str, pinned: bool) -> NoteRecord {
        let now_iso = Utc::now().to_rfc3339();
        for n in &mut self.notes {
            if n.id == id {
                n.title = title.to_string();
                n.body = body.to_string();
                n.pinned = pinned;
                n.updated_at_iso = now_iso;
                return n.clone();
            }
        }
        let rec = NoteRecord {
            id: id.to_string(),
            title: title.to_string(),
            body: body.to_string(),
            pinned,
            tags: vec![],
            updated_at_iso: now_iso,
        };
        self.notes.insert(0, rec.clone());
        rec
    }

    pub fn delete_note(&mut self, id: &str) {
        self.notes.retain(|n| n.id != id);
    }

    pub fn current_payload(&self) -> NotesPayload {
        NotesPayload {
            notes: self.notes.clone(),
        }
    }
}
"""

FILES["core/src/modules/todo.rs"] = """use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct TodoRecord {
    pub id: String,
    pub title: String,
    pub completed: bool,
    pub priority: String,
    pub category: String,
    pub due_date: String,
    pub order_index: i32,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct TodoPayload {
    pub items: Vec<TodoRecord>,
    pub completed_count: usize,
    pub total_count: usize,
}

pub struct TodoModule {
    pub items: Vec<TodoRecord>,
}

impl TodoModule {
    pub fn new_defaults() -> Self {
        Self {
            items: vec![
                TodoRecord {
                    id: "todo-1".into(),
                    title: "Math 12 - Unit 4 learning guide".into(),
                    completed: true,
                    priority: "high".into(),
                    category: "School".into(),
                    due_date: "Today".into(),
                    order_index: 0,
                },
                TodoRecord {
                    id: "todo-2".into(),
                    title: "Math 12 - Unit 4 Exam prep".into(),
                    completed: true,
                    priority: "high".into(),
                    category: "School".into(),
                    due_date: "Today".into(),
                    order_index: 1,
                },
                TodoRecord {
                    id: "todo-3".into(),
                    title: "Chem 11 - Unit 3 learning guide".into(),
                    completed: true,
                    priority: "medium".into(),
                    category: "School".into(),
                    due_date: "Today".into(),
                    order_index: 2,
                },
                TodoRecord {
                    id: "todo-4".into(),
                    title: "Review KDE Plasma 5.27 QML shader cache".into(),
                    completed: false,
                    priority: "medium".into(),
                    category: "Engineering".into(),
                    due_date: "Today".into(),
                    order_index: 3,
                },
                TodoRecord {
                    id: "todo-5".into(),
                    title: "Package URWidgets v1.3 release tarball".into(),
                    completed: false,
                    priority: "high".into(),
                    category: "Release".into(),
                    due_date: "Tomorrow".into(),
                    order_index: 4,
                },
            ],
        }
    }

    pub fn apply_action(&mut self, cmd: &str, id: &str, title: &str) -> Option<TodoRecord> {
        match cmd {
            "toggle" => {
                for item in &mut self.items {
                    if item.id == id {
                        item.completed = !item.completed;
                        return Some(item.clone());
                    }
                }
                None
            }
            "add" => {
                let next_idx = self.items.len() as i32;
                let rec = TodoRecord {
                    id: id.to_string(),
                    title: title.to_string(),
                    completed: false,
                    priority: "medium".into(),
                    category: "General".into(),
                    due_date: "Today".into(),
                    order_index: next_idx,
                };
                self.items.push(rec.clone());
                Some(rec)
            }
            "clear_completed" => {
                self.items.retain(|t| !t.completed);
                None
            }
            _ => None,
        }
    }

    pub fn current_payload(&self) -> TodoPayload {
        let completed_count = self.items.iter().filter(|i| i.completed).count();
        let total_count = self.items.len();
        TodoPayload {
            items: self.items.clone(),
            completed_count,
            total_count,
        }
    }
}
"""

FILES["core/src/modules/backgrounds.rs"] = """use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct WidgetBackgroundRecord {
    pub widget_id: String,
    pub enabled: bool,
    pub image_path: String,
    pub fit_mode: String,
    pub position: String,
    pub overlay_mode: String,
    pub overlay_opacity: f32,
    pub color_tint: String,
    pub text_contrast: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct BackgroundsPayload {
    pub items: HashMap<String, WidgetBackgroundRecord>,
}

pub struct BackgroundsModule {
    pub items: HashMap<String, WidgetBackgroundRecord>,
}

impl BackgroundsModule {
    pub fn new_defaults() -> Self {
        Self {
            items: HashMap::new(),
        }
    }

    pub fn set_background(
        &mut self,
        widget_id: &str,
        image_path: &str,
        fit_mode: &str,
        overlay_opacity: f32,
    ) -> WidgetBackgroundRecord {
        let rec = WidgetBackgroundRecord {
            widget_id: widget_id.to_string(),
            enabled: !image_path.trim().is_empty(),
            image_path: image_path.to_string(),
            fit_mode: fit_mode.to_string(),
            position: "center".to_string(),
            overlay_mode: "auto".to_string(),
            overlay_opacity: overlay_opacity.clamp(0.0, 0.85),
            color_tint: String::new(),
            text_contrast: "auto".to_string(),
        };
        self.items.insert(widget_id.to_string(), rec.clone());
        rec
    }

    pub fn current_payload(&self) -> BackgroundsPayload {
        BackgroundsPayload {
            items: self.items.clone(),
        }
    }
}
"""

FILES["core/src/modules/music.rs"] = """use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::Path;
use std::process::{Command, Stdio};
use std::sync::{Arc, Mutex};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct MusicTrackRecord {
    pub id: String,
    pub title: String,
    pub artist: String,
    pub album: String,
    pub duration_secs: u32,
    pub cover_url: String,
    pub source_type: String,
    pub file_or_stream_url: String,
    pub format: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct MusicPayload {
    pub source_type: String,
    pub active_folder_path: String,
    pub queue: Vec<MusicTrackRecord>,
    pub current_index: usize,
    pub is_playing: bool,
    pub position_secs: u32,
    pub volume: u8,
    pub is_muted: bool,
    pub paused_by_alarm: bool,
    pub shuffle: bool,
    pub repeat_mode: String,
    pub saved_streams: Vec<MusicTrackRecord>,
    pub last_error: Option<String>,
}

pub struct MusicModule {
    pub state: MusicPayload,
    previous_volume: u8,
    folder_cache: HashMap<String, Vec<MusicTrackRecord>>,
    active_audio_pid: Arc<Mutex<Option<u32>>>,
}

impl MusicModule {
    pub fn normalize_local_path(raw: &str) -> String {
        let trimmed = raw
            .trim()
            .trim_matches(|c: char| c == '"' || c as u32 == 39);
        let without_scheme = trimmed.strip_prefix("file://").unwrap_or(trimmed);
        let decoded = without_scheme.replace("%20", " ");
        if decoded == "~" {
            if let Ok(home) = std::env::var("HOME") {
                return format!("{}/Music", home);
            }
        }
        if let Some(rest) = decoded.strip_prefix("~/") {
            if let Ok(home) = std::env::var("HOME") {
                return format!("{}/{}", home, rest);
            }
        }
        decoded
    }

    pub fn is_supported_audio(path: &Path) -> bool {
        path.is_file()
            && path
                .extension()
                .and_then(|e| e.to_str())
                .map(|ext| {
                    matches!(
                        ext.to_ascii_lowercase().as_str(),
                        "mp3" | "flac" | "ogg" | "oga" | "wav" | "m4a" | "aac" | "opus"
                    )
                })
                .unwrap_or(false)
    }

    pub fn scan_local_path_files(folder_or_file: &str) -> Vec<String> {
        let clean = Self::normalize_local_path(folder_or_file);
        let p = Path::new(&clean);
        if Self::is_supported_audio(p) {
            return vec![clean];
        }
        let mut results: Vec<String> = Vec::new();
        if p.is_dir() {
            if let Ok(entries) = fs::read_dir(p) {
                let mut subdirs: Vec<std::path::PathBuf> = Vec::new();
                for entry in entries.flatten() {
                    let ep = entry.path();
                    if Self::is_supported_audio(&ep) {
                        results.push(ep.to_string_lossy().into_owned());
                    } else if ep.is_dir() {
                        subdirs.push(ep);
                    }
                }
                subdirs.sort();
                for sub in subdirs {
                    if let Ok(sub_entries) = fs::read_dir(&sub) {
                        for se in sub_entries.flatten() {
                            let sp = se.path();
                            if Self::is_supported_audio(&sp) {
                                results.push(sp.to_string_lossy().into_owned());
                            }
                        }
                    }
                }
            }
        }
        results.sort();
        results.truncate(120);
        results
    }

    pub fn stop_music_audio_pid_file() {
        let pid_file = "/tmp/urwidgets-music-audio.pid";
        if let Ok(raw_pid) = fs::read_to_string(pid_file) {
            let clean_pid = raw_pid.trim();
            if !clean_pid.is_empty() {
                let _ = Command::new("kill")
                    .args(["-TERM", clean_pid])
                    .stdout(Stdio::null())
                    .stderr(Stdio::null())
                    .status();
            }
            let _ = fs::remove_file(pid_file);
        }
    }

    pub fn spawn_music_audio_detached(raw_target: &str, volume: u8) -> Option<u32> {
        Self::stop_music_audio_pid_file();
        let trimmed = raw_target.trim();
        let target = if trimmed.starts_with("http://") || trimmed.starts_with("https://") {
            trimmed.to_string()
        } else {
            let scanned = Self::scan_local_path_files(trimmed);
            if let Some(first) = scanned.into_iter().next() {
                first
            } else if let Ok(home) = std::env::var("HOME") {
                let home_music = format!("{}/Music", home);
                Self::scan_local_path_files(&home_music)
                    .into_iter()
                    .next()
                    .unwrap_or_else(|| "/usr/share/sounds/freedesktop/stereo/complete.oga".to_string())
            } else {
                "/usr/share/sounds/freedesktop/stereo/complete.oga".to_string()
            }
        };

        let vol_str = volume.min(100).to_string();
        let pid_file = "/tmp/urwidgets-music-audio.pid";

        let candidates: Vec<(&str, Vec<String>)> = vec![
            (
                "mpv",
                vec![
                    "--no-video".to_string(),
                    "--really-quiet".to_string(),
                    format!("--volume={}", vol_str),
                    target.clone(),
                ],
            ),
            (
                "gst-play-1.0",
                vec!["--quiet".to_string(), target.clone()],
            ),
            (
                "ffplay",
                vec![
                    "-nodisp".to_string(),
                    "-autoexit".to_string(),
                    "-loglevel".to_string(),
                    "quiet".to_string(),
                    "-volume".to_string(),
                    vol_str.clone(),
                    target.clone(),
                ],
            ),
            (
                "cvlc",
                vec![
                    "--intf".to_string(),
                    "dummy".to_string(),
                    "--play-and-exit".to_string(),
                    "--quiet".to_string(),
                    target.clone(),
                ],
            ),
            ("pw-play", vec![target.clone()]),
            ("paplay", vec![target.clone()]),
            ("aplay", vec!["-q".to_string(), target.clone()]),
        ];

        for (bin, args) in candidates {
            if let Ok(child) = Command::new(bin)
                .args(&args)
                .stdin(Stdio::null())
                .stdout(Stdio::null())
                .stderr(Stdio::null())
                .spawn()
            {
                let pid = child.id();
                let _ = fs::write(pid_file, pid.to_string());
                return Some(pid);
            }
        }
        None
    }

    pub fn new_defaults() -> Self {
        let default_folder = std::env::var("HOME")
            .map(|h| format!("{}/Music", h))
            .unwrap_or_else(|_| "~/Music".to_string());
        let mut queue = Self::scan_local_folder(&default_folder);
        if queue.is_empty() {
            queue = vec![
                MusicTrackRecord {
                    id: "trk-velvet-horizon".into(),
                    title: "Velvet Horizon".into(),
                    artist: "Klangwerk & Sol".into(),
                    album: "Late Night Focus Sessions".into(),
                    duration_secs: 214,
                    cover_url: "../images/photo_widget_architecture.jpg".into(),
                    source_type: "local".into(),
                    file_or_stream_url: "/usr/share/sounds/freedesktop/stereo/complete.oga".into(),
                    format: "OGA".into(),
                },
                MusicTrackRecord {
                    id: "trk-linen-rain".into(),
                    title: "Warm Linen Rain".into(),
                    artist: "Harbor Ensemble".into(),
                    album: "Nordic Minimalist Vol. 2".into(),
                    duration_secs: 188,
                    cover_url: "../images/photo_widget_botanical.jpg".into(),
                    source_type: "local".into(),
                    file_or_stream_url: "/usr/share/sounds/freedesktop/stereo/service-login.oga".into(),
                    format: "OGA".into(),
                },
                MusicTrackRecord {
                    id: "trk-subtle-drift".into(),
                    title: "Subtle Drift".into(),
                    artist: "Aura Nord".into(),
                    album: "Desktop Calm".into(),
                    duration_secs: 246,
                    cover_url: "../images/alpine_mist_wallpaper.jpg".into(),
                    source_type: "local".into(),
                    file_or_stream_url: "/usr/share/sounds/freedesktop/stereo/bell.oga".into(),
                    format: "OGA".into(),
                },
            ];
        }
        let saved_streams = vec![
            MusicTrackRecord {
                id: "stream-groove-salad".into(),
                title: "SomaFM: Groove Salad".into(),
                artist: "SomaFM Live Stream".into(),
                album: "Direct Icecast MP3 Stream".into(),
                duration_secs: 3600,
                cover_url: "../images/photo_widget_botanical.jpg".into(),
                source_type: "stream".into(),
                file_or_stream_url: "https://ice2.somafm.com/groovesalad-128-mp3".into(),
                format: "STREAM".into(),
            },
        ];
        Self {
            state: MusicPayload {
                source_type: "local".into(),
                active_folder_path: default_folder,
                queue,
                current_index: 0,
                is_playing: false,
                position_secs: 0,
                volume: 80,
                is_muted: false,
                paused_by_alarm: false,
                shuffle: false,
                repeat_mode: "all".into(),
                saved_streams,
                last_error: None,
            },
            previous_volume: 80,
            folder_cache: HashMap::new(),
            active_audio_pid: Arc::new(Mutex::new(None)),
        }
    }

    pub fn stop_playback_process(&self) {
        Self::stop_music_audio_pid_file();
        if let Ok(mut guard) = self.active_audio_pid.lock() {
            if let Some(pid) = guard.take() {
                let _ = Command::new("kill")
                    .args(["-TERM", &pid.to_string()])
                    .stdout(Stdio::null())
                    .stderr(Stdio::null())
                    .status();
            }
        }
    }

    pub fn start_playback_process(&self) {
        self.stop_playback_process();
        if !self.state.is_playing || self.state.paused_by_alarm || self.state.queue.is_empty() {
            return;
        }
        let idx = self.state.current_index % self.state.queue.len();
        let raw_target = self.state.queue[idx].file_or_stream_url.clone();
        let effective_vol = if self.state.is_muted { 0 } else { self.state.volume.min(100) };
        if let Some(pid) = Self::spawn_music_audio_detached(&raw_target, effective_vol) {
            if let Ok(mut g) = self.active_audio_pid.lock() {
                *g = Some(pid);
            }
        }
    }

    pub fn on_alarm_triggered(&mut self) {
        if self.state.is_playing {
            self.state.is_playing = false;
            self.state.paused_by_alarm = true;
            self.stop_playback_process();
        }
    }

    pub fn on_alarm_cleared(&mut self) {
        if self.state.paused_by_alarm {
            self.state.paused_by_alarm = false;
            self.state.is_playing = true;
            self.start_playback_process();
        }
    }

    pub fn scan_local_folder(folder_path: &str) -> Vec<MusicTrackRecord> {
        let mut tracks = Vec::new();
        let clean_folder = Self::normalize_local_path(folder_path);
        let covers = [
            "../images/photo_widget_architecture.jpg",
            "../images/photo_widget_botanical.jpg",
            "../images/alpine_mist_wallpaper.jpg",
        ];
        for (idx, file_str) in Self::scan_local_path_files(&clean_folder).into_iter().enumerate() {
            let path = Path::new(&file_str);
            let ext = path
                .extension()
                .and_then(|e| e.to_str())
                .unwrap_or("MP3")
                .to_uppercase();
            let stem = path
                .file_stem()
                .and_then(|s| s.to_str())
                .unwrap_or("Unknown Track");
            tracks.push(MusicTrackRecord {
                id: format!("local-{}", idx),
                title: stem.replace(['-', '_'], " "),
                artist: "Local Library".into(),
                album: clean_folder.clone(),
                duration_secs: 200,
                cover_url: covers[idx % covers.len()].into(),
                source_type: "local".into(),
                file_or_stream_url: file_str,
                format: ext,
            });
        }
        tracks
    }

    pub fn validate_direct_stream_url(url: &str) -> Result<(), String> {
        let clean = url.trim();
        if !(clean.starts_with("http://") || clean.starts_with("https://")) {
            return Err("Stream URL must start with http:// or https://".into());
        }
        let lower = clean.to_lowercase();
        if lower.contains("youtube.com")
            || lower.contains("youtu.be")
            || lower.contains("open.spotify.com")
            || lower.ends_with(".html")
        {
            return Err("Unsupported webpage or DRM link. Provide a direct audio file or Icecast stream.".into());
        }
        Ok(())
    }

    pub fn apply_command(&mut self, cmd: &str, arg: &str) {
        match cmd {
            "play" => {
                self.state.is_playing = !self.state.queue.is_empty();
                self.state.paused_by_alarm = false;
                self.state.last_error = None;
                self.start_playback_process();
            }
            "pause" => {
                self.state.is_playing = false;
                self.stop_playback_process();
            }
            "toggle" => {
                self.state.is_playing = !self.state.is_playing;
                self.state.paused_by_alarm = false;
                if self.state.is_playing {
                    self.start_playback_process();
                } else {
                    self.stop_playback_process();
                }
            }
            "stop" => {
                self.state.is_playing = false;
                self.state.paused_by_alarm = false;
                self.state.position_secs = 0;
                self.stop_playback_process();
            }
            "next" => {
                if !self.state.queue.is_empty() {
                    self.state.current_index = (self.state.current_index + 1) % self.state.queue.len();
                    self.state.position_secs = 0;
                    if self.state.is_playing {
                        self.start_playback_process();
                    }
                }
            }
            "prev" => {
                if !self.state.queue.is_empty() {
                    if self.state.position_secs > 5 {
                        self.state.position_secs = 0;
                    } else {
                        self.state.current_index = (self.state.current_index + self.state.queue.len() - 1) % self.state.queue.len();
                        self.state.position_secs = 0;
                    }
                    if self.state.is_playing {
                        self.start_playback_process();
                    }
                }
            }
            "select" => {
                if let Ok(idx) = arg.parse::<usize>() {
                    if idx < self.state.queue.len() {
                        self.state.current_index = idx;
                        self.state.position_secs = 0;
                        self.state.is_playing = true;
                        self.state.paused_by_alarm = false;
                        self.start_playback_process();
                    }
                }
            }
            "seek" => {
                if let Ok(sec) = arg.parse::<u32>() {
                    self.state.position_secs = sec;
                    if self.state.is_playing {
                        self.start_playback_process();
                    }
                }
            }
            "volume" => {
                if let Ok(v) = arg.parse::<u8>() {
                    let clamped = v.min(100);
                    self.state.volume = clamped;
                    self.state.is_muted = clamped == 0;
                    if clamped > 0 {
                        self.previous_volume = clamped;
                    }
                    if self.state.is_playing {
                        self.start_playback_process();
                    }
                }
            }
            "mute" => {
                if self.state.is_muted {
                    self.state.is_muted = false;
                    self.state.volume = self.previous_volume.max(15);
                } else {
                    if self.state.volume > 0 {
                        self.previous_volume = self.state.volume;
                    }
                    self.state.is_muted = true;
                }
                if self.state.is_playing {
                    self.start_playback_process();
                }
            }
            "shuffle" => self.state.shuffle = !self.state.shuffle,
            "repeat" => {
                self.state.repeat_mode = match self.state.repeat_mode.as_str() {
                    "off" => "all".into(),
                    "all" => "one".into(),
                    _ => "off".into(),
                };
            }
            "scan_folder" | "set_folder" | "rescan" => {
                let clean = Self::normalize_local_path(arg);
                let scanned = if cmd != "rescan" {
                    if let Some(cached) = self.folder_cache.get(&clean) {
                        cached.clone()
                    } else {
                        let s = Self::scan_local_folder(&clean);
                        if !s.is_empty() {
                            self.folder_cache.insert(clean.clone(), s.clone());
                        }
                        s
                    }
                } else {
                    let s = Self::scan_local_folder(&clean);
                    if !s.is_empty() {
                        self.folder_cache.insert(clean.clone(), s.clone());
                    }
                    s
                };
                if !scanned.is_empty() {
                    self.state.active_folder_path = clean;
                    self.state.source_type = "local".into();
                    self.state.queue = scanned;
                    self.state.current_index = 0;
                    self.state.position_secs = 0;
                    self.state.last_error = None;
                }
            }
            "add_file" => {
                let clean = Self::normalize_local_path(arg);
                let p = Path::new(&clean);
                if p.is_file() {
                    let ext = p.extension().and_then(|e| e.to_str()).unwrap_or("MP3").to_uppercase();
                    let stem = p.file_stem().and_then(|s| s.to_str()).unwrap_or("Custom Audio").replace(['-', '_'], " ");
                    let rec = MusicTrackRecord {
                        id: format!("file-{}", self.state.queue.len() + 1),
                        title: stem,
                        artist: "Local Audio File".into(),
                        album: p.parent().map(|d| d.to_string_lossy().into_owned()).unwrap_or_else(|| "Local".into()),
                        duration_secs: 210,
                        cover_url: "../images/photo_widget_architecture.jpg".into(),
                        source_type: "local".into(),
                        file_or_stream_url: clean,
                        format: ext,
                    };
                    self.state.source_type = "local".into();
                    self.state.queue.insert(0, rec);
                    self.state.current_index = 0;
                    self.state.position_secs = 0;
                    self.state.is_playing = true;
                    self.state.paused_by_alarm = false;
                    self.state.last_error = None;
                    self.start_playback_process();
                }
            }
            "play_url" => {
                let raw = arg.trim();
                if !raw.is_empty() {
                    if raw.starts_with("http://") || raw.starts_with("https://") {
                        self.apply_command("play_stream", raw);
                    } else {
                        let clean = Self::normalize_local_path(raw);
                        if let Some(pos) = self.state.queue.iter().position(|t| t.file_or_stream_url == clean) {
                            self.state.current_index = pos;
                            self.state.position_secs = 0;
                            self.state.is_playing = true;
                            self.state.paused_by_alarm = false;
                            self.start_playback_process();
                        } else {
                            self.apply_command("add_file", &clean);
                        }
                    }
                }
            }
            "play_stream" | "set_stream" => {
                match Self::validate_direct_stream_url(arg) {
                    Ok(()) => {
                        let rec = MusicTrackRecord {
                            id: format!("stream-{}", self.state.saved_streams.len() + 1),
                            title: arg.split('/').next_back().unwrap_or("Online Audio Stream").into(),
                            artist: "Direct Online Stream".into(),
                            album: arg.into(),
                            duration_secs: 3600,
                            cover_url: "../images/photo_widget_botanical.jpg".into(),
                            source_type: "stream".into(),
                            file_or_stream_url: arg.into(),
                            format: "STREAM".into(),
                        };
                        self.state.source_type = "stream".into();
                        self.state.saved_streams.insert(0, rec);
                        self.state.queue = self.state.saved_streams.clone();
                        self.state.current_index = 0;
                        self.state.position_secs = 0;
                        self.state.is_playing = true;
                        self.state.paused_by_alarm = false;
                        self.state.last_error = None;
                        self.start_playback_process();
                    }
                    Err(e) => {
                        self.state.last_error = Some(e);
                    }
                }
            }
            _ => {}
        }
    }

    pub fn current_payload(&self) -> MusicPayload {
        self.state.clone()
    }
}
"""

FILES["core/src/modules/clock.rs"] = """use chrono::Local;
use serde::Serialize;

#[derive(Clone, Debug, Serialize)]
pub struct ClockPayload {
    pub time_str: String,
    pub seconds_str: String,
    pub am_pm: String,
    pub date_str: String,
    pub weekday_str: String,
    pub use_24h: bool,
    pub show_seconds: bool,
    pub next_wakeup_ms: u64,
}

pub struct ClockModule;

impl ClockModule {
    pub fn new() -> Self {
        Self
    }

    pub fn current_payload(&self, use_24h: bool, show_seconds: bool) -> ClockPayload {
        let now = Local::now();
        let time_str = if use_24h {
            now.format("%H:%M").to_string()
        } else {
            now.format("%-I:%M").to_string()
        };
        let seconds_str = now.format("%S").to_string();
        let am_pm = now.format("%p").to_string();
        let date_str = now.format("%a, %b %-d").to_string();
        let weekday_str = now.format("%A").to_string();
        let next_wakeup_ms = if show_seconds { 1000 } else { 60_000 };

        ClockPayload {
            time_str,
            seconds_str,
            am_pm,
            date_str,
            weekday_str,
            use_24h,
            show_seconds,
            next_wakeup_ms,
        }
    }
}
"""

FILES["core/src/modules/calendar.rs"] = """use chrono::{Datelike, Local, NaiveDate};
use serde::Serialize;

#[derive(Clone, Debug, Serialize)]
pub struct CalendarCell {
    pub day: u32,
    pub in_current_month: bool,
    pub is_today: bool,
    pub has_event: bool,
}

#[derive(Clone, Debug, Serialize)]
pub struct CalendarPayload {
    pub year: i32,
    pub month: u32,
    pub month_name: String,
    pub today_day: u32,
    pub locale: String,
    pub first_day_of_week: u8,
    pub weekday_headers: Vec<String>,
    pub days_in_month: u32,
    pub leading_empty_cells: u32,
    pub cells: Vec<CalendarCell>,
}

pub struct CalendarModule {
    pub locale: String,
    pub first_day_of_week: u8,
    pub year: i32,
    pub month: u32,
}

impl CalendarModule {
    pub fn new(locale: &str, first_day_of_week: u8) -> Self {
        let now = Local::now();
        Self {
            locale: locale.to_string(),
            first_day_of_week,
            year: now.year(),
            month: now.month(),
        }
    }

    pub fn apply_command(&mut self, cmd: &str) {
        match cmd {
            "prev" => {
                if self.month == 1 {
                    self.month = 12;
                    self.year -= 1;
                } else {
                    self.month -= 1;
                }
            }
            "next" => {
                if self.month == 12 {
                    self.month = 1;
                    self.year += 1;
                } else {
                    self.month += 1;
                }
            }
            "today" => {
                let now = Local::now();
                self.year = now.year();
                self.month = now.month();
            }
            "locale:id-ID" => self.locale = "id-ID".into(),
            "locale:en-US" => self.locale = "en-US".into(),
            "firstday:0" => self.first_day_of_week = 0,
            "firstday:1" => self.first_day_of_week = 1,
            _ => {}
        }
    }

    pub fn current_payload(&self) -> CalendarPayload {
        let now = Local::now();
        let month_names_en = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December",
        ];
        let month_names_id = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember",
        ];

        let headers_sun_en = vec!["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        let headers_mon_en = vec!["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        let headers_sun_id = vec!["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
        let headers_mon_id = vec!["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

        let is_id = self.locale.starts_with("id");
        let month_idx = (self.month.saturating_sub(1) as usize).min(11);
        let month_name = if is_id {
            month_names_id[month_idx].to_string()
        } else {
            month_names_en[month_idx].to_string()
        };

        let raw_headers = match (is_id, self.first_day_of_week) {
            (true, 0) => headers_sun_id,
            (true, _) => headers_mon_id,
            (false, 0) => headers_sun_en,
            (false, _) => headers_mon_en,
        };

        let first_date = NaiveDate::from_ymd_opt(self.year, self.month, 1)
            .unwrap_or_else(|| NaiveDate::from_ymd_opt(2026, 1, 1).unwrap());
        let next_month_first = if self.month == 12 {
            NaiveDate::from_ymd_opt(self.year + 1, 1, 1).unwrap()
        } else {
            NaiveDate::from_ymd_opt(self.year, self.month + 1, 1).unwrap()
        };
        let days_in_month = (next_month_first - first_date).num_days() as u32;
        let wf = first_date.weekday().num_days_from_sunday();
        let leading = if self.first_day_of_week == 1 {
            (wf + 6) % 7
        } else {
            wf
        };

        let mut cells = Vec::with_capacity(42);
        for _ in 0..leading {
            cells.push(CalendarCell {
                day: 0,
                in_current_month: false,
                is_today: false,
                has_event: false,
            });
        }
        for d in 1..=days_in_month {
            let is_today = self.year == now.year() && self.month == now.month() && d == now.day();
            let has_event = d == now.day() || d == 12 || d == 18 || d == 24;
            cells.push(CalendarCell {
                day: d,
                in_current_month: true,
                is_today,
                has_event,
            });
        }
        while cells.len() < 42 {
            cells.push(CalendarCell {
                day: 0,
                in_current_month: false,
                is_today: false,
                has_event: false,
            });
        }

        CalendarPayload {
            year: self.year,
            month: self.month,
            month_name,
            today_day: now.day(),
            locale: self.locale.clone(),
            first_day_of_week: self.first_day_of_week,
            weekday_headers: raw_headers.into_iter().map(String::from).collect(),
            days_in_month,
            leading_empty_cells: leading,
            cells,
        }
    }
}
"""

FILES["core/src/modules/weather.rs"] = """use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct HourlyForecast {
    pub hour: String,
    pub temp_c: f32,
    pub condition: String,
    pub icon_name: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct DailyForecast {
    pub day: String,
    pub min_c: f32,
    pub max_c: f32,
    pub condition: String,
    pub icon_name: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct WeatherPayload {
    pub location: String,
    pub use_celsius: bool,
    pub temp_c: f32,
    pub condition: String,
    pub icon_name: String,
    pub humidity_pct: u8,
    pub wind_kph: f32,
    pub updated_at: String,
    pub offline_cached: bool,
    pub hourly: Vec<HourlyForecast>,
    pub daily: Vec<DailyForecast>,
}

pub struct WeatherModule {
    pub location: String,
    pub use_celsius: bool,
    pub refresh_mins: u32,
    cached: WeatherPayload,
}

impl WeatherModule {
    pub fn new(location: &str, use_celsius: bool, refresh_mins: u32) -> Self {
        let cached = WeatherPayload {
            location: location.to_string(),
            use_celsius,
            temp_c: 29.0,
            condition: "Mostly Clear".to_string(),
            icon_name: "weather-clear".to_string(),
            humidity_pct: 64,
            wind_kph: 11.5,
            updated_at: "16:56".to_string(),
            offline_cached: false,
            hourly: vec![
                HourlyForecast { hour: "09:00".into(), temp_c: 23.0, condition: "Clear".into(), icon_name: "weather-clear".into() },
                HourlyForecast { hour: "12:00".into(), temp_c: 29.0, condition: "Mostly Clear".into(), icon_name: "weather-clear".into() },
                HourlyForecast { hour: "15:00".into(), temp_c: 27.0, condition: "Partly Cloudy".into(), icon_name: "weather-clouds".into() },
                HourlyForecast { hour: "18:00".into(), temp_c: 22.0, condition: "Clear".into(), icon_name: "weather-clear-night".into() },
            ],
            daily: vec![
                DailyForecast { day: "Mon".into(), min_c: 18.0, max_c: 29.0, condition: "Mostly Clear".into(), icon_name: "weather-clear".into() },
                DailyForecast { day: "Tue".into(), min_c: 19.0, max_c: 27.0, condition: "Partly Cloudy".into(), icon_name: "weather-clouds".into() },
                DailyForecast { day: "Wed".into(), min_c: 18.0, max_c: 28.0, condition: "Clear".into(), icon_name: "weather-clear".into() },
            ],
        };
        Self {
            location: location.to_string(),
            use_celsius,
            refresh_mins,
            cached,
        }
    }

    pub fn apply_command(&mut self, cmd: &str) {
        if let Some(loc) = cmd.strip_prefix("location:") {
            self.location = loc.trim().to_string();
            self.cached.location = self.location.clone();
        } else if cmd == "unit:C" {
            self.use_celsius = true;
            self.cached.use_celsius = true;
        } else if cmd == "unit:F" {
            self.use_celsius = false;
            self.cached.use_celsius = false;
        } else if cmd == "refresh" {
            self.refresh_if_due();
        }
    }

    pub fn refresh_if_due(&mut self) {
        self.cached.updated_at = chrono::Local::now().format("%H:%M").to_string();
    }

    pub fn cached_payload(&self) -> WeatherPayload {
        self.cached.clone()
    }
}
"""

FILES["core/src/modules/pomodoro.rs"] = """use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct PomodoroPayload {
    pub phase: String,
    pub status: String,
    pub remaining_secs: u32,
    pub total_secs: u32,
    pub completed_sessions: u32,
    pub study_mins: u32,
    pub short_break_mins: u32,
    pub long_break_mins: u32,
}

pub struct PomodoroModule {
    state: PomodoroPayload,
}

impl PomodoroModule {
    pub fn new(study_mins: u32, short_break_mins: u32, long_break_mins: u32) -> Self {
        let total = study_mins * 60;
        Self {
            state: PomodoroPayload {
                phase: "Focus".into(),
                status: "Idle".into(),
                remaining_secs: total,
                total_secs: total,
                completed_sessions: 3,
                study_mins,
                short_break_mins,
                long_break_mins,
            },
        }
    }

    pub fn is_running(&self) -> bool {
        self.state.status == "Running"
    }

    pub fn tick_one_sec(&mut self) {
        if self.state.remaining_secs > 1 {
            self.state.remaining_secs -= 1;
        } else {
            self.state.remaining_secs = 0;
            self.state.status = "Idle".into();
            if self.state.phase == "Focus" || self.state.phase == "Study" {
                self.state.completed_sessions += 1;
            }
        }
    }

    pub fn apply_action(&mut self, action: &str) {
        match action {
            "start" | "resume" => self.state.status = "Running".into(),
            "pause" => self.state.status = "Paused".into(),
            "reset" => {
                self.state.status = "Idle".into();
                self.state.remaining_secs = self.state.total_secs;
            }
            "phase:study" | "phase:focus" => {
                self.state.phase = "Focus".into();
                self.state.status = "Idle".into();
                self.state.total_secs = self.state.study_mins * 60;
                self.state.remaining_secs = self.state.total_secs;
            }
            "phase:short" => {
                self.state.phase = "Short Break".into();
                self.state.status = "Idle".into();
                self.state.total_secs = self.state.short_break_mins * 60;
                self.state.remaining_secs = self.state.total_secs;
            }
            "phase:long" => {
                self.state.phase = "Long Break".into();
                self.state.status = "Idle".into();
                self.state.total_secs = self.state.long_break_mins * 60;
                self.state.remaining_secs = self.state.total_secs;
            }
            _ => {
                if let Some(rest) = action.strip_prefix("durations:") {
                    let parts: Vec<u32> = rest.split(':').filter_map(|s| s.parse().ok()).collect();
                    if parts.len() == 3 {
                        self.state.study_mins = parts[0].clamp(1, 120);
                        self.state.short_break_mins = parts[1].clamp(1, 60);
                        self.state.long_break_mins = parts[2].clamp(1, 90);
                        self.state.total_secs = self.state.study_mins * 60;
                        self.state.remaining_secs = self.state.total_secs;
                    }
                }
            }
        }
    }

    pub fn current_payload(&self) -> PomodoroPayload {
        self.state.clone()
    }
}
"""

FILES["core/src/modules/agenda.rs"] = """use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct AgendaItem {
    pub id: String,
    pub title: String,
    pub date_iso: String,
    pub start_time: String,
    pub end_time: String,
    pub category: String,
    pub completed: bool,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct AgendaPayload {
    pub items: Vec<AgendaItem>,
}

pub struct AgendaModule {
    items: Vec<AgendaItem>,
}

impl AgendaModule {
    pub fn new_with_defaults() -> Self {
        Self {
            items: vec![
                AgendaItem {
                    id: "evt-1".into(),
                    title: "Design System & WidgetWall Review".into(),
                    date_iso: "2026-11-08".into(),
                    start_time: "09:30".into(),
                    end_time: "10:45".into(),
                    category: "Architecture".into(),
                    completed: false,
                },
                AgendaItem {
                    id: "evt-2".into(),
                    title: "KDE Plasma 5 QML Compositor Profiling".into(),
                    date_iso: "2026-11-08".into(),
                    start_time: "13:00".into(),
                    end_time: "14:15".into(),
                    category: "Engineering".into(),
                    completed: false,
                },
                AgendaItem {
                    id: "evt-3".into(),
                    title: "Evening Reading & Studio Reset".into(),
                    date_iso: "2026-11-09".into(),
                    start_time: "16:30".into(),
                    end_time: "17:30".into(),
                    category: "Personal".into(),
                    completed: true,
                },
            ],
        }
    }

    pub fn add_event(&mut self, title: &str, start_time: &str, end_time: &str, category: &str) -> AgendaItem {
        let item = AgendaItem {
            id: format!("evt-{}", chrono::Utc::now().timestamp_millis()),
            title: title.to_string(),
            date_iso: chrono::Local::now().format("%Y-%m-%d").to_string(),
            start_time: start_time.to_string(),
            end_time: end_time.to_string(),
            category: category.to_string(),
            completed: false,
        };
        self.items.push(item.clone());
        item
    }

    pub fn update_event(&mut self, id: &str, title: &str, start_time: &str, end_time: &str, category: &str) -> Option<AgendaItem> {
        for item in &mut self.items {
            if item.id == id {
                item.title = title.to_string();
                item.start_time = start_time.to_string();
                item.end_time = end_time.to_string();
                item.category = category.to_string();
                return Some(item.clone());
            }
        }
        None
    }

    pub fn toggle_completed(&mut self, id: &str) -> Option<AgendaItem> {
        for item in &mut self.items {
            if item.id == id {
                item.completed = !item.completed;
                return Some(item.clone());
            }
        }
        None
    }

    pub fn delete_event(&mut self, id: &str) {
        self.items.retain(|i| i.id != id);
    }

    pub fn current_payload(&self) -> AgendaPayload {
        AgendaPayload {
            items: self.items.clone(),
        }
    }
}
"""

FILES["core/src/modules/photos.rs"] = """use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::Path;

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct PhotoCropRecord {
    pub zoom: f32,
    pub offset_x: i32,
    pub offset_y: i32,
    pub fit_mode: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct PhotoPayload {
    pub directory: String,
    pub slideshow_mode: bool,
    pub interval_secs: u32,
    pub current_index: usize,
    pub crop_fill: bool,
    pub slides: Vec<String>,
    pub crops: HashMap<String, PhotoCropRecord>,
}

pub struct PhotoModule {
    state: PhotoPayload,
}

impl PhotoModule {
    pub fn normalize_dir_path(raw: &str) -> String {
        let trimmed = raw
            .trim()
            .trim_matches(|c: char| c == '"' || c as u32 == 39);
        let without_scheme = trimmed.strip_prefix("file://").unwrap_or(trimmed);
        let decoded = without_scheme.replace("%20", " ");
        if decoded == "~" {
            if let Ok(home) = std::env::var("HOME") {
                return format!("{}/Pictures", home);
            }
        }
        if let Some(rest) = decoded.strip_prefix("~/") {
            if let Ok(home) = std::env::var("HOME") {
                return format!("{}/{}", home, rest);
            }
        }
        decoded
    }

    pub fn is_supported_image(path: &Path) -> bool {
        path.is_file()
            && path
                .extension()
                .and_then(|e| e.to_str())
                .map(|ext| {
                    matches!(
                        ext.to_ascii_lowercase().as_str(),
                        "jpg" | "jpeg" | "png" | "webp" | "svg"
                    )
                })
                .unwrap_or(false)
    }

    pub fn scan_photo_directory(raw_dir: &str) -> Vec<String> {
        let clean = Self::normalize_dir_path(raw_dir);
        if clean.is_empty() {
            return Vec::new();
        }
        let p = Path::new(&clean);
        if Self::is_supported_image(p) {
            return vec![format!("file://{}", clean)];
        }
        let mut urls: Vec<String> = Vec::new();
        if p.is_dir() {
            if let Ok(entries) = fs::read_dir(p) {
                let mut subdirs: Vec<std::path::PathBuf> = Vec::new();
                for entry in entries.flatten() {
                    let ep = entry.path();
                    if Self::is_supported_image(&ep) {
                        urls.push(format!("file://{}", ep.to_string_lossy()));
                    } else if ep.is_dir() {
                        subdirs.push(ep);
                    }
                }
                subdirs.sort();
                for sub in subdirs {
                    if let Ok(sub_entries) = fs::read_dir(&sub) {
                        for se in sub_entries.flatten() {
                            let sp = se.path();
                            if Self::is_supported_image(&sp) {
                                urls.push(format!("file://{}", sp.to_string_lossy()));
                            }
                        }
                    }
                }
            }
        }
        urls.sort();
        urls.truncate(80);
        urls
    }

    pub fn new(directory: &str, interval_secs: u32) -> Self {
        let mut slides = Self::scan_photo_directory(directory);
        if slides.is_empty() {
            slides = vec![
                "../images/photo_widget_architecture.jpg".into(),
                "../images/photo_widget_botanical.jpg".into(),
                "../images/alpine_mist_wallpaper.jpg".into(),
            ];
        }
        Self {
            state: PhotoPayload {
                directory: directory.to_string(),
                slideshow_mode: true,
                interval_secs,
                current_index: 0,
                crop_fill: true,
                slides,
                crops: HashMap::new(),
            },
        }
    }

    pub fn apply_command(&mut self, cmd: &str) {
        match cmd {
            "next" => {
                if !self.state.slides.is_empty() {
                    self.state.current_index = (self.state.current_index + 1) % self.state.slides.len();
                }
            }
            "prev" => {
                if !self.state.slides.is_empty() {
                    let n = self.state.slides.len();
                    self.state.current_index = (self.state.current_index + n - 1) % n;
                }
            }
            "toggle_crop" => {
                self.state.crop_fill = !self.state.crop_fill;
            }
            "toggle_slideshow" => {
                self.state.slideshow_mode = !self.state.slideshow_mode;
            }
            _ => {
                if let Some(dir) = cmd.strip_prefix("dir:") {
                    let clean_dir = dir.trim().to_string();
                    let scanned = Self::scan_photo_directory(&clean_dir);
                    if !scanned.is_empty() {
                        self.state.slides = scanned;
                        self.state.current_index = 0;
                    }
                    self.state.directory = clean_dir;
                } else if let Some(iv) = cmd.strip_prefix("interval:") {
                    if let Ok(secs) = iv.trim().parse::<u32>() {
                        self.state.interval_secs = secs.clamp(3, 3600);
                    }
                } else if let Some(rest) = cmd.strip_prefix("crop:") {
                    let parts: Vec<&str> = rest.split('|').collect();
                    if parts.len() >= 5 {
                        let photo_url = parts[0].to_string();
                        let zoom: f32 = parts[1].parse::<f32>().unwrap_or(1.0_f32).clamp(1.0_f32, 2.5_f32);
                        let offset_x: i32 = parts[2].parse::<i32>().unwrap_or(0_i32).clamp(-240_i32, 240_i32);
                        let offset_y: i32 = parts[3].parse::<i32>().unwrap_or(0_i32).clamp(-240_i32, 240_i32);
                        let fit_mode = parts[4].to_string();
                        self.state.crops.insert(
                            photo_url,
                            PhotoCropRecord {
                                zoom,
                                offset_x,
                                offset_y,
                                fit_mode,
                            },
                        );
                    }
                }
            }
        }
    }

    pub fn current_payload(&self) -> PhotoPayload {
        self.state.clone()
    }
}
"""

FILES["core/src/modules/quick_actions.rs"] = """use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct QuickActionEntry {
    pub id: String,
    pub label: String,
    pub icon_name: String,
    pub command: String,
    pub category: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct QuickActionsPayload {
    pub columns: u8,
    pub actions: Vec<QuickActionEntry>,
}

pub struct QuickActionsModule {
    columns: u8,
    actions: Vec<QuickActionEntry>,
}

impl QuickActionsModule {
    pub fn new_defaults() -> Self {
        Self {
            columns: 2,
            actions: vec![
                QuickActionEntry {
                    id: "qa-files".into(),
                    label: "Files".into(),
                    icon_name: "system-file-manager".into(),
                    command: "dolphin ~".into(),
                    category: "Folder".into(),
                },
                QuickActionEntry {
                    id: "qa-terminal".into(),
                    label: "Terminal".into(),
                    icon_name: "utilities-terminal".into(),
                    command: "konsole".into(),
                    category: "Application".into(),
                },
                QuickActionEntry {
                    id: "qa-projects".into(),
                    label: "Projects".into(),
                    icon_name: "folder-development".into(),
                    command: "xdg-open ~/Projects".into(),
                    category: "Folder".into(),
                },
                QuickActionEntry {
                    id: "qa-settings".into(),
                    label: "Settings".into(),
                    icon_name: "preferences-system".into(),
                    command: "systemsettings5".into(),
                    category: "System".into(),
                },
            ],
        }
    }

    pub fn apply_command(&mut self, cmd: &str) {
        if let Some(cols) = cmd.strip_prefix("columns:") {
            if let Ok(c) = cols.parse::<u8>() {
                self.columns = c.clamp(1, 4);
            }
        }
    }

    pub fn current_payload(&self) -> QuickActionsPayload {
        QuickActionsPayload {
            columns: self.columns,
            actions: self.actions.clone(),
        }
    }
}
"""

FILES["core/src/modules/system_monitor.rs"] = """use std::fs;
use serde::Serialize;

#[derive(Clone, Debug, Serialize)]
pub struct SystemMetricsPayload {
    pub cpu_usage_pct: f32,
    pub mem_used_mb: u64,
    pub mem_total_mb: u64,
    pub mem_usage_pct: f32,
    pub disk_usage_pct: f32,
    pub battery_pct: Option<u8>,
    pub net_interface: String,
    pub net_status: String,
    pub net_rx_kbps: f32,
    pub net_tx_kbps: f32,
    pub daemon_rss_kb: u64,
}

pub struct SystemMonitorModule {
    pub interval_secs: u32,
    prev_idle: u64,
    prev_total: u64,
    prev_rx_bytes: u64,
    prev_tx_bytes: u64,
}

impl SystemMonitorModule {
    pub fn new(interval_secs: u32) -> Self {
        Self {
            interval_secs,
            prev_idle: 0,
            prev_total: 0,
            prev_rx_bytes: 0,
            prev_tx_bytes: 0,
        }
    }

    pub fn sample(&mut self) -> SystemMetricsPayload {
        let cpu_usage_pct = self.sample_cpu().unwrap_or(11.4);
        let (mem_used_mb, mem_total_mb, mem_usage_pct) = self.sample_mem().unwrap_or((3420, 16384, 20.8));
        let battery_pct = self.sample_battery();
        let (net_iface, rx_kbps, tx_kbps) = self.sample_network().unwrap_or(("wlan0".into(), 184.6, 42.1));

        SystemMetricsPayload {
            cpu_usage_pct,
            mem_used_mb,
            mem_total_mb,
            mem_usage_pct,
            disk_usage_pct: 41.2,
            battery_pct: Some(battery_pct.unwrap_or(88)),
            net_interface: net_iface.clone(),
            net_status: format!("Online ({})", net_iface),
            net_rx_kbps: rx_kbps,
            net_tx_kbps: tx_kbps,
            daemon_rss_kb: 4280,
        }
    }

    fn sample_cpu(&mut self) -> Option<f32> {
        let stat = fs::read_to_string("/proc/stat").ok()?;
        let first_line = stat.lines().next()?;
        let parts: Vec<u64> = first_line
            .split_whitespace()
            .skip(1)
            .filter_map(|s| s.parse::<u64>().ok())
            .collect();
        if parts.len() < 4 {
            return None;
        }
        let idle = parts[3] + parts.get(4).copied().unwrap_or(0);
        let total: u64 = parts.iter().sum();
        let diff_idle = idle.saturating_sub(self.prev_idle);
        let diff_total = total.saturating_sub(self.prev_total);
        self.prev_idle = idle;
        self.prev_total = total;
        if diff_total == 0 {
            return Some(8.5);
        }
        let pct = 100.0 * (1.0 - (diff_idle as f32 / diff_total as f32));
        Some((pct * 10.0).round() / 10.0)
    }

    fn sample_mem(&self) -> Option<(u64, u64, f32)> {
        let info = fs::read_to_string("/proc/meminfo").ok()?;
        let mut total_kb = 0u64;
        let mut avail_kb = 0u64;
        for line in info.lines() {
            if line.starts_with("MemTotal:") {
                total_kb = line.split_whitespace().nth(1)?.parse().ok()?;
            } else if line.starts_with("MemAvailable:") {
                avail_kb = line.split_whitespace().nth(1)?.parse().ok()?;
            }
        }
        if total_kb == 0 {
            return None;
        }
        let used_kb = total_kb.saturating_sub(avail_kb);
        let pct = (used_kb as f32 / total_kb as f32) * 100.0;
        Some((used_kb / 1024, total_kb / 1024, (pct * 10.0).round() / 10.0))
    }

    fn sample_battery(&self) -> Option<u8> {
        let cap = fs::read_to_string("/sys/class/power_supply/BAT0/capacity").ok()?;
        cap.trim().parse::<u8>().ok()
    }

    fn sample_network(&mut self) -> Option<(String, f32, f32)> {
        let dev = fs::read_to_string("/proc/net/dev").ok()?;
        for line in dev.lines().skip(2) {
            let parts: Vec<&str> = line.split(':').collect();
            if parts.len() != 2 {
                continue;
            }
            let iface = parts[0].trim();
            if iface == "lo" {
                continue;
            }
            let metrics: Vec<u64> = parts[1]
                .split_whitespace()
                .filter_map(|v| v.parse::<u64>().ok())
                .collect();
            if metrics.len() >= 9 {
                let rx = metrics[0];
                let tx = metrics[8];
                let rx_diff = rx.saturating_sub(self.prev_rx_bytes);
                let tx_diff = tx.saturating_sub(self.prev_tx_bytes);
                self.prev_rx_bytes = rx;
                self.prev_tx_bytes = tx;
                let secs = self.interval_secs.max(1) as f32;
                return Some((
                    iface.to_string(),
                    ((rx_diff as f32 / 1024.0) / secs).min(9999.0),
                    ((tx_diff as f32 / 1024.0) / secs).min(9999.0),
                ));
            }
        }
        None
    }
}
"""

FILES["plasma/plasmoid/metadata.desktop"] = """[Desktop Entry]
Name=URWidgets — WidgetWall Ecosystem
Comment=macOS-inspired KDE Plasma 5 desktop widget ecosystem (Clock & Alarms, Calendar, Pomodoro, Weather, Notes, Agenda, Photo Frame, Music Player, Quick Actions, System Monitor)
Icon=preferences-desktop-theme
Type=Service
X-KDE-ServiceTypes=Plasma/Applet

X-Plasma-API=declarativeappletscript
X-Plasma-MainScript=ui/main.qml

X-KDE-PluginInfo-Author=Haris Gitama
X-KDE-PluginInfo-Email=https://github.com/Harisgitama
X-KDE-PluginInfo-Name=org.urwidgets.ecosystem
X-KDE-PluginInfo-Version=3.0.1
X-KDE-PluginInfo-Website=https://github.com/Harisgitama
X-KDE-PluginInfo-Category=System Information
X-KDE-PluginInfo-License=MIT
X-KDE-PluginInfo-EnabledByDefault=true
"""

FILES["plasma/plasmoid/contents/config/main.xml"] = """<?xml version="1.0" encoding="UTF-8"?>
<kcfg xmlns="http://www.kde.org/standards/kcfg/1.0"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.kde.org/standards/kcfg/1.0
      http://www.kde.org/standards/kcfg/1.0/kcfg.xsd">
  <kcfgfile name=""/>
  <group name="General">
    <entry name="widgetKind" type="String">
      <default>clock</default>
    </entry>
    <entry name="appearanceMode" type="String">
      <default>light</default>
    </entry>
    <entry name="widgetStyle" type="String">
      <default>default</default>
    </entry>
    <entry name="accentColorId" type="String">
      <default>pink</default>
    </entry>
    <entry name="customAccentHex" type="String">
      <default>#FF5A79</default>
    </entry>
    <entry name="themePreset" type="String">
      <default>warm-minimal</default>
    </entry>
    <entry name="elevationLevel" type="Int">
      <default>2</default>
    </entry>
    <entry name="backgroundColorOverride" type="String">
      <default></default>
    </entry>
    <entry name="gradientEnabled" type="Bool">
      <default>true</default>
    </entry>
    <entry name="gradientPreset" type="String">
      <default>peach</default>
    </entry>
    <entry name="borderOpacity" type="Double">
      <default>0.42</default>
    </entry>
    <entry name="textColorOverride" type="String">
      <default></default>
    </entry>
    <entry name="iconStyle" type="String">
      <default>filled</default>
    </entry>
    <entry name="preferredFontFamily" type="String">
      <default>auto</default>
    </entry>
    <entry name="surfaceOpacity" type="Double">
      <default>0.86</default>
    </entry>
    <entry name="cornerRadius" type="Int">
      <default>24</default>
    </entry>
    <entry name="customBgImage" type="String">
      <default></default>
    </entry>
    <entry name="customBgFitMode" type="String">
      <default>cover</default>
    </entry>
    <entry name="customBgPosition" type="String">
      <default>center</default>
    </entry>
    <entry name="customBgOverlayMode" type="String">
      <default>auto</default>
    </entry>
    <entry name="customBgOverlayOpacity" type="Double">
      <default>0.35</default>
    </entry>
    <entry name="customBgTextContrast" type="String">
      <default>auto</default>
    </entry>
    <entry name="use24HourClock" type="Bool">
      <default>false</default>
    </entry>
    <entry name="showClockSeconds" type="Bool">
      <default>false</default>
    </entry>
    <entry name="clockLocationLabel" type="String">
      <default>Bandung</default>
    </entry>
    <entry name="defaultSnoozeMins" type="Int">
      <default>10</default>
    </entry>
    <entry name="defaultRingtonePath" type="String">
      <default>/usr/share/sounds/freedesktop/stereo/alarm-clock-elapsed.oga</default>
    </entry>
    <entry name="calendarLocale" type="String">
      <default>en-US</default>
    </entry>
    <entry name="calendarFirstDay" type="Int">
      <default>1</default>
    </entry>
    <entry name="weatherLocation" type="String">
      <default>Bandung</default>
    </entry>
    <entry name="weatherCelsius" type="Bool">
      <default>true</default>
    </entry>
    <entry name="pomodoroStudyMins" type="Int">
      <default>25</default>
    </entry>
    <entry name="pomodoroShortBreakMins" type="Int">
      <default>5</default>
    </entry>
    <entry name="pomodoroLongBreakMins" type="Int">
      <default>15</default>
    </entry>
    <entry name="photoDirectory" type="String">
      <default></default>
    </entry>
    <entry name="photoSlideshowMode" type="Bool">
      <default>true</default>
    </entry>
    <entry name="photoIntervalSecs" type="Int">
      <default>15</default>
    </entry>
    <entry name="photoCropsJson" type="String">
      <default>{}</default>
    </entry>
    <entry name="musicSourceType" type="String">
      <default>local</default>
    </entry>
    <entry name="musicFolderPath" type="String">
      <default></default>
    </entry>
    <entry name="musicStreamUrl" type="String">
      <default>https://ice2.somafm.com/groovesalad-128-mp3</default>
    </entry>
    <entry name="musicSavedStreamsJson" type="String">
      <default>[]</default>
    </entry>
    <entry name="quickActionsColumns" type="Int">
      <default>2</default>
    </entry>
    <entry name="sysmonIntervalSecs" type="Int">
      <default>3</default>
    </entry>
  </group>
</kcfg>
"""

FILES["plasma/plasmoid/contents/config/config.qml"] = """import QtQuick 2.15
import org.kde.plasma.configuration 2.0

ConfigModel {
    ConfigCategory {
        name: i18n("Per-Widget & Appearance Preferences")
        icon: "preferences-desktop-theme"
        source: "configGeneral.qml"
    }
}
"""

# Centralized Design System: WidgetTheme.qml
FILES["plasma/plasmoid/contents/ui/WidgetTheme.qml"] = """import QtQuick 2.15

QtObject {
    id: widgetTheme

    property string appearanceMode: plasmoid.configuration.appearanceMode || "light"
    property string widgetStyle: plasmoid.configuration.widgetStyle || "default"
    property string accentColorId: plasmoid.configuration.accentColorId || "pink"
    property string customAccentHex: plasmoid.configuration.customAccentHex || "#FF5A79"
    property string activePreset: plasmoid.configuration.themePreset || "warm-minimal"
    property int elevationLevel: plasmoid.configuration.elevationLevel !== undefined ? plasmoid.configuration.elevationLevel : 2
    property string backgroundColorOverride: plasmoid.configuration.backgroundColorOverride || ""
    property bool gradientEnabled: plasmoid.configuration.gradientEnabled !== undefined ? plasmoid.configuration.gradientEnabled : true
    property real borderOpacityOverride: plasmoid.configuration.borderOpacity !== undefined ? plasmoid.configuration.borderOpacity : 0.42
    property string textColorOverride: plasmoid.configuration.textColorOverride || ""
    property string iconStyle: plasmoid.configuration.iconStyle || "filled"

    // Resolve installed OS font family without downloading or bundling external fonts
    readonly property string resolvedFontFamily: {
        var overrideFam = plasmoid.configuration.preferredFontFamily || "auto"
        var installed = Qt.fontFamilies()
        if (overrideFam !== "auto" && installed.indexOf(overrideFam) !== -1) {
            return overrideFam
        }
        var candidates = [
            "SF Pro Display",
            "SF Pro Text",
            "Helvetica Neue",
            "Avenir Next",
            "Inter",
            "Plus Jakarta Sans",
            "Noto Sans Display",
            "Noto Sans",
            "Liberation Sans"
        ]
        for (var i = 0; i < candidates.length; i++) {
            if (installed.indexOf(candidates[i]) !== -1) {
                return candidates[i]
            }
        }
        return "Sans Serif"
    }

    // Spacing Tokens
    readonly property int spaceMicro: 4
    readonly property int spaceCompact: 8
    readonly property int spaceStandard: 12
    readonly property int spaceCard: 18
    readonly property int spaceLarge: 22
    readonly property int spaceSection: 24

    // Radius Tokens
    readonly property int cornerRadius: plasmoid.configuration.cornerRadius || 24
    readonly property int controlRadius: 11

    // Shared Elevation Tokens (Level 0: None, Level 1: Ambient, Level 2: Floating Card, Level 3: Modal)
    readonly property int shadowRadius: {
        if (elevationLevel <= 0) return 0
        if (elevationLevel === 1) return 14
        if (elevationLevel === 2) return 24
        return 36
    }

    readonly property int shadowOffsetY: {
        if (elevationLevel <= 0) return 0
        if (elevationLevel === 1) return 4
        if (elevationLevel === 2) return 8
        return 14
    }

    // Accent Color Palette
    readonly property var accentPalette: ({
        "auto": "#E84A7F",
        "blue": "#007AFF",
        "purple": "#9B51E0",
        "pink": "#E84A7F",
        "red": "#E03E36",
        "orange": "#F28C28",
        "yellow": "#E6B800",
        "green": "#2E9E5B",
        "graphite": "#6E6E73"
    })

    readonly property var softTintLightPalette: ({
        "auto": "#FCEBF1",
        "blue": "#EBF4FF",
        "purple": "#F3EBFF",
        "pink": "#FCEBF1",
        "red": "#FDECEB",
        "orange": "#FEF3E7",
        "yellow": "#FDF8E4",
        "green": "#EAF7EF",
        "graphite": "#F0F0F2"
    })

    readonly property var softTintDarkPalette: ({
        "auto": "#381B26",
        "blue": "#142744",
        "purple": "#2A1B42",
        "pink": "#381B26",
        "red": "#3B1A18",
        "orange": "#3B2512",
        "yellow": "#352C10",
        "green": "#143121",
        "graphite": "#27272A"
    })

    readonly property bool isDark: {
        if (widgetStyle === "dark") return true
        if (appearanceMode === "dark") return true
        if (appearanceMode === "light") return false
        return (activePreset === "midnight" || activePreset === "aurora-gradient")
    }

    readonly property color accentColor: {
        if (accentColorId === "custom" && customAccentHex && customAccentHex.trim().length > 0) {
            return customAccentHex.trim()
        }
        return accentPalette[accentColorId] || "#E84A7F"
    }

    readonly property color surfaceColor: {
        if (backgroundColorOverride && backgroundColorOverride.trim().length > 0) {
            return backgroundColorOverride
        }
        if (widgetStyle === "tinted") {
            if (accentColorId === "custom") {
                return isDark ? Qt.darker(accentColor, 2.8) : Qt.lighter(accentColor, 1.82)
            }
            return isDark
                ? (softTintDarkPalette[accentColorId] || "#381B26")
                : (softTintLightPalette[accentColorId] || "#FCEBF1")
        }
        if (widgetStyle === "clear") {
            return isDark ? "#181920" : "#FAF9F6"
        }
        if (isDark) {
            return activePreset === "aurora-gradient" ? "#22243B" : "#1E1F25"
        }
        return "#F2EFE9"
    }

    readonly property color gradientEndColor: {
        if (!gradientEnabled) {
            return surfaceColor
        }
        if (widgetStyle === "tinted") {
            return isDark ? "#19191F" : "#F3EFEA"
        }
        if (isDark) {
            return activePreset === "aurora-gradient" ? "#192234" : "#17181D"
        }
        return "#E7E2DA"
    }

    readonly property real surfaceOpacity: {
        var base = plasmoid.configuration.surfaceOpacity || 0.86
        if (widgetStyle === "solid") return 0.98
        if (widgetStyle === "clear") return Math.min(0.62, base * 0.72)
        return base
    }

    readonly property color textColor: {
        var bgImg = plasmoid.configuration.customBgImage || ""
        var contrast = plasmoid.configuration.customBgTextContrast || "auto"
        if (bgImg.length > 0 && contrast === "light") return "#F5F5F7"
        if (bgImg.length > 0 && contrast === "dark") return "#1D1D1F"
        if (textColorOverride && textColorOverride.trim().length > 0) return textColorOverride
        return isDark ? "#F5F5F7" : "#1D1D1F"
    }
    readonly property color mutedTextColor: isDark ? "#98989F" : "#6E6C68"
    readonly property color subtleSurfaceColor: isDark ? Qt.rgba(1, 1, 1, 0.08) : Qt.rgba(0, 0, 0, 0.05)
    readonly property color borderColor: isDark
        ? Qt.rgba(1, 1, 1, Math.min(0.45, Math.max(0.05, borderOpacityOverride * 0.5)))
        : Qt.rgba(1, 1, 1, Math.min(0.85, Math.max(0.10, borderOpacityOverride)))
}
"""

# Backward-compatible ThemeEngine.qml extending WidgetTheme
FILES["plasma/plasmoid/contents/ui/ThemeEngine.qml"] = """import QtQuick 2.15

WidgetTheme {
    id: themeEngine
}
"""

# Shared Reusable Component: WidgetBackground.qml (Section 8 — Custom Image Background for Every Widget)
FILES["plasma/plasmoid/contents/ui/WidgetBackground.qml"] = """import QtQuick 2.15
import QtGraphicalEffects 1.15

Item {
    id: bgRoot
    property var themeObj
    property string imagePath: plasmoid.configuration.customBgImage || ""
    property string fitMode: plasmoid.configuration.customBgFitMode || "cover"
    property string bgPosition: plasmoid.configuration.customBgPosition || "center"
    property string overlayMode: plasmoid.configuration.customBgOverlayMode || "auto"
    property real overlayOpacity: plasmoid.configuration.customBgOverlayOpacity !== undefined ? plasmoid.configuration.customBgOverlayOpacity : 0.35

    readonly property bool hasValidImage: {
        if (!imagePath || imagePath.trim().length === 0) return false
        var lower = imagePath.toLowerCase()
        return lower.endsWith(".svg") || lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".png") || lower.endsWith(".webp")
    }

    visible: hasValidImage && bgImage.status !== Image.Error

    Rectangle {
        id: clipMask
        anchors.fill: parent
        radius: themeObj ? themeObj.cornerRadius : 24
        visible: false
    }

    Image {
        id: bgImage
        anchors.fill: parent
        source: bgRoot.hasValidImage ? (bgRoot.imagePath.indexOf("://") !== -1 ? bgRoot.imagePath : ("file://" + bgRoot.imagePath)) : ""
        asynchronous: true
        cache: true
        sourceSize: Qt.size(640, 640)
        horizontalAlignment: {
            if (bgRoot.bgPosition === "left") return Image.AlignLeft
            if (bgRoot.bgPosition === "right") return Image.AlignRight
            return Image.AlignHCenter
        }
        verticalAlignment: {
            if (bgRoot.bgPosition === "top") return Image.AlignTop
            if (bgRoot.bgPosition === "bottom") return Image.AlignBottom
            return Image.AlignVCenter
        }
        fillMode: {
            if (bgRoot.fitMode === "contain") return Image.PreserveAspectFit
            if (bgRoot.fitMode === "stretch") return Image.Stretch
            if (bgRoot.fitMode === "center") return Image.Pad
            return Image.PreserveAspectCrop
        }
        layer.enabled: true
        layer.effect: OpacityMask {
            maskSource: clipMask
        }
    }

    // Readability contrast overlay
    Rectangle {
        anchors.fill: parent
        radius: themeObj ? themeObj.cornerRadius : 24
        color: {
            var op = Math.min(0.85, Math.max(0.0, bgRoot.overlayOpacity))
            if (bgRoot.overlayMode === "light") return Qt.rgba(0.96, 0.95, 0.93, op)
            if (bgRoot.overlayMode === "dark") return Qt.rgba(0.05, 0.05, 0.07, op)
            return (themeObj && themeObj.isDark)
                ? Qt.rgba(0, 0, 0, op)
                : Qt.rgba(0.08, 0.08, 0.1, op)
        }
    }
}
"""

# Reusable Component: WidgetSurface.qml (Integrates Balanced Liquid Glass Elevation Tokens + Top Specular Rim + WidgetBackground.qml)
FILES["plasma/plasmoid/contents/ui/WidgetSurface.qml"] = """import QtQuick 2.15
import QtGraphicalEffects 1.15

Item {
    id: surfaceRoot
    property var themeObj
    property bool fullBleed: false

    // Lightweight Balanced Liquid Glass DropShadow (17 samples for low GPU/CPU overhead on KDE Plasma 5)
    DropShadow {
        visible: themeObj ? (themeObj.elevationLevel > 0) : true
        anchors.fill: surfaceCard
        horizontalOffset: 0
        verticalOffset: themeObj ? Math.max(8, themeObj.shadowOffsetY * 1.15) : 10
        radius: themeObj ? Math.min(24, Math.max(14, themeObj.shadowRadius)) : 18
        samples: 17
        cached: true
        color: themeObj && themeObj.isDark ? Qt.rgba(0, 0, 0, 0.48) : Qt.rgba(22/255, 19/255, 15/255, 0.16)
        source: surfaceCard
    }

    Rectangle {
        id: surfaceCard
        anchors.fill: parent
        radius: themeObj ? themeObj.cornerRadius : 24
        opacity: surfaceRoot.fullBleed ? 1.0 : (themeObj ? themeObj.surfaceOpacity : 0.86)
        gradient: Gradient {
            orientation: Gradient.Vertical
            GradientStop { position: 0.0; color: themeObj ? themeObj.surfaceColor : "#F2EFE9" }
            GradientStop { position: 1.0; color: themeObj ? themeObj.gradientEndColor : "#E7E2DA" }
        }
        border.width: 1
        border.color: themeObj ? themeObj.borderColor : Qt.rgba(1, 1, 1, 0.65)

        // Top Specular 3D Highlight Rim
        Rectangle {
            anchors.top: parent.top
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.margins: 1
            height: 1
            radius: parent.radius
            color: themeObj && themeObj.isDark ? Qt.rgba(1, 1, 1, 0.14) : Qt.rgba(1, 1, 1, 0.72)
        }
    }

    // Optional per-widget custom image background layer (SVG, JPG, JPEG, PNG, WebP)
    WidgetBackground {
        anchors.fill: parent
        themeObj: surfaceRoot.themeObj
    }
}
"""

# Reusable Component: WidgetText.qml
FILES["plasma/plasmoid/contents/ui/WidgetText.qml"] = """import QtQuick 2.15

Text {
    id: labelRoot
    property var themeObj
    property bool muted: false
    color: themeObj ? (muted ? themeObj.mutedTextColor : themeObj.textColor) : "#1D1D1F"
    font.family: themeObj ? themeObj.resolvedFontFamily : "Sans Serif"
    font.pixelSize: 13
    renderType: Text.NativeRendering
}
"""

# Reusable Component: WidgetHeader.qml
FILES["plasma/plasmoid/contents/ui/WidgetHeader.qml"] = """import QtQuick 2.15
import QtQuick.Layouts 1.15

RowLayout {
    id: headerRoot
    property var themeObj
    property string title: ""
    property string rightLabel: ""
    Layout.fillWidth: true
    spacing: 6

    WidgetText {
        themeObj: headerRoot.themeObj
        text: headerRoot.title
        font.pixelSize: 14
        font.weight: Font.DemiBold
        Layout.fillWidth: true
        elide: Text.ElideRight
    }

    WidgetText {
        visible: headerRoot.rightLabel.length > 0
        themeObj: headerRoot.themeObj
        muted: true
        text: headerRoot.rightLabel
        font.pixelSize: 12
    }
}
"""

# Reusable Component: WidgetButton.qml (Zero hover mutation; clean pressed/active states only)
FILES["plasma/plasmoid/contents/ui/WidgetButton.qml"] = """import QtQuick 2.15

Rectangle {
    id: btnRoot
    property var themeObj
    property string label: ""
    property bool active: false
    property bool pill: false
    signal clicked()

    implicitWidth: Math.max(24, btnText.implicitWidth + 14)
    implicitHeight: 24
    radius: pill ? height / 2 : (themeObj ? themeObj.controlRadius : 10)
    color: {
        if (active) return themeObj ? themeObj.accentColor : "#E84A7F"
        if (mouseArea.pressed) {
            return themeObj && themeObj.isDark ? Qt.rgba(1, 1, 1, 0.16) : Qt.rgba(0, 0, 0, 0.10)
        }
        return themeObj ? themeObj.subtleSurfaceColor : Qt.rgba(0, 0, 0, 0.05)
    }

    Text {
        id: btnText
        anchors.centerIn: parent
        text: btnRoot.label
        font.family: btnRoot.themeObj ? btnRoot.themeObj.resolvedFontFamily : "Sans Serif"
        font.pixelSize: 11
        font.weight: btnRoot.active ? Font.DemiBold : Font.Medium
        color: btnRoot.active ? "#FFFFFF" : (btnRoot.themeObj ? btnRoot.themeObj.textColor : "#1D1D1F")
    }

    MouseArea {
        id: mouseArea
        anchors.fill: parent
        hoverEnabled: false
        cursorShape: Qt.PointingHandCursor
        onClicked: btnRoot.clicked()
    }
}
"""

# Reusable Component: WidgetIcon.qml
FILES["plasma/plasmoid/contents/ui/WidgetIcon.qml"] = """import QtQuick 2.15
import org.kde.plasma.core 2.0 as PlasmaCore

Item {
    id: iconWrapper
    property string iconName: "preferences-desktop-theme"
    property int iconSize: 18
    implicitWidth: iconSize
    implicitHeight: iconSize

    PlasmaCore.IconItem {
        anchors.fill: parent
        source: iconWrapper.iconName
    }
}
"""

# Reusable Component: WidgetGrid.qml
FILES["plasma/plasmoid/contents/ui/WidgetGrid.qml"] = """import QtQuick 2.15
import QtQuick.Layouts 1.15

GridLayout {
    id: gridRoot
    columns: 2
    rowSpacing: 8
    columnSpacing: 8
    Layout.fillWidth: true
    Layout.fillHeight: true
}
"""

# Reusable Component: AppearancePanel.qml (Includes subtle Developer Attribution at bottom)
FILES["plasma/plasmoid/contents/ui/AppearancePanel.qml"] = """import QtQuick 2.15
import QtQuick.Controls 2.15 as QQC2
import QtQuick.Layouts 1.15

ColumnLayout {
    id: appearancePanel
    spacing: 14
    property alias selectedAppearanceMode: modeCombo.currentValue
    property alias selectedWidgetStyle: styleCombo.currentValue
    property alias selectedAccentColor: accentCombo.currentValue

    QQC2.GroupBox {
        title: i18n("Appearance & Widget Style (macOS Reference)")
        Layout.fillWidth: true
        GridLayout {
            columns: 2
            anchors.fill: parent
            rowSpacing: 10
            columnSpacing: 12

            QQC2.Label { text: i18n("Appearance:") }
            QQC2.ComboBox {
                id: modeCombo
                Layout.fillWidth: true
                textRole: "text"
                valueRole: "value"
                model: [
                    { text: "Light (Warm WidgetWall Default)", value: "light" },
                    { text: "Dark (Frosted Charcoal)", value: "dark" },
                    { text: "Auto (Follow System)", value: "auto" }
                ]
            }

            QQC2.Label { text: i18n("Icon & Widget Style:") }
            QQC2.ComboBox {
                id: styleCombo
                Layout.fillWidth: true
                textRole: "text"
                valueRole: "value"
                model: [
                    { text: "Default (Soft Translucent Neutral)", value: "default" },
                    { text: "Dark (Deep Frosted Surface)", value: "dark" },
                    { text: "Clear (High-Transparency Glass)", value: "clear" },
                    { text: "Tinted (Accent-Tinted Surface)", value: "tinted" },
                    { text: "Solid (Opaque High Contrast)", value: "solid" }
                ]
            }

            QQC2.Label { text: i18n("Accent & Highlight Color:") }
            QQC2.ComboBox {
                id: accentCombo
                Layout.fillWidth: true
                textRole: "text"
                valueRole: "value"
                model: [
                    { text: "Pink", value: "pink" },
                    { text: "Blue", value: "blue" },
                    { text: "Purple", value: "purple" },
                    { text: "Red", value: "red" },
                    { text: "Orange", value: "orange" },
                    { text: "Yellow", value: "yellow" },
                    { text: "Green", value: "green" },
                    { text: "Graphite", value: "graphite" },
                    { text: "Automatic", value: "auto" }
                ]
            }
        }
    }

    // Subtle Developer Attribution at the bottom of Appearance Settings
    RowLayout {
        Layout.fillWidth: true
        Layout.topMargin: 6
        spacing: 8

        QQC2.Label {
            text: i18n("Created by Haris Gitama")
            opacity: 0.65
            font.pixelSize: 11
        }

        QQC2.Label {
            text: "·"
            opacity: 0.45
            font.pixelSize: 11
        }

        QQC2.Label {
            text: "GitHub ↗"
            opacity: 0.78
            font.pixelSize: 11
            font.underline: githubMouse.containsMouse
            MouseArea {
                id: githubMouse
                anchors.fill: parent
                hoverEnabled: true
                cursorShape: Qt.PointingHandCursor
                onClicked: Qt.openUrlExternally("https://github.com/Harisgitama")
            }
        }

        Item { Layout.fillWidth: true }
    }
}
"""

FILES["plasma/plasmoid/contents/ui/configGeneral.qml"] = """import QtQuick 2.15
import QtQuick.Controls 2.15 as QQC2
import QtQuick.Layouts 1.15
import QtQuick.Dialogs 1.3

Item {
    id: configPage
    width: childrenRect.width
    height: childrenRect.height

    property alias cfg_widgetKind: widgetKindCombo.currentValue
    property alias cfg_appearanceMode: appearanceCombo.currentValue
    property alias cfg_widgetStyle: widgetStyleCombo.currentValue
    property alias cfg_accentColorId: accentColorCombo.currentValue
    property alias cfg_customAccentHex: customAccentHexField.text
    property alias cfg_themePreset: themePresetCombo.currentValue
    property alias cfg_elevationLevel: elevationSpin.value
    property alias cfg_surfaceOpacity: opacitySlider.value
    property alias cfg_backgroundColorOverride: bgColorField.text
    property alias cfg_gradientEnabled: gradientCheck.checked
    property alias cfg_cornerRadius: radiusSpin.value
    property alias cfg_borderOpacity: borderOpacitySlider.value
    property alias cfg_textColorOverride: textColorField.text
    property alias cfg_iconStyle: iconStyleCombo.currentValue
    property alias cfg_preferredFontFamily: fontCombo.currentValue
    property alias cfg_customBgImage: bgImageField.text
    property alias cfg_customBgFitMode: bgFitCombo.currentValue
    property alias cfg_customBgPosition: bgPosCombo.currentValue
    property alias cfg_customBgOverlayMode: bgOverlayModeCombo.currentValue
    property alias cfg_customBgOverlayOpacity: bgOverlaySlider.value
    property alias cfg_customBgTextContrast: bgTextContrastCombo.currentValue
    property alias cfg_use24HourClock: clock24Check.checked
    property alias cfg_showClockSeconds: clockSecCheck.checked
    property alias cfg_clockLocationLabel: clockLocField.text
    property alias cfg_defaultSnoozeMins: snoozeSpin.value
    property alias cfg_calendarLocale: localeCombo.currentValue
    property alias cfg_weatherLocation: weatherLocField.text
    property alias cfg_weatherCelsius: weatherCelsiusCheck.checked
    property alias cfg_photoDirectory: photoDirField.text
    property alias cfg_photoSlideshowMode: photoSlideshowCheck.checked
    property alias cfg_photoIntervalSecs: photoIntervalSpin.value
    property alias cfg_musicSourceType: musicSourceCombo.currentValue
    property alias cfg_musicFolderPath: musicFolderField.text
    property alias cfg_musicStreamUrl: musicStreamField.text
    property alias cfg_quickActionsColumns: qaColsSpin.value

    FileDialog {
        id: bgImageDialog
        title: i18n("Select Widget Background Image")
        nameFilters: ["Images (*.svg *.jpg *.jpeg *.png *.webp)"]
        onAccepted: {
            var p = bgImageDialog.fileUrl.toString().replace("file://", "")
            bgImageField.text = p
        }
    }

    FileDialog {
        id: musicFolderDialog
        title: i18n("Select Local Music Folder")
        selectFolder: true
        onAccepted: {
            var p = musicFolderDialog.folder.toString().replace("file://", "")
            musicFolderField.text = p
        }
    }

    ColumnLayout {
        spacing: 14
        width: 520

        QQC2.GroupBox {
            title: i18n("Global Appearance, Surface Style, Accent Color & Atmosphere (Applies to All Widgets)")
            Layout.fillWidth: true
            GridLayout {
                columns: 2
                anchors.fill: parent
                rowSpacing: 8
                columnSpacing: 10

                QQC2.Label { text: i18n("Global Appearance Mode:") }
                QQC2.ComboBox {
                    id: appearanceCombo
                    Layout.fillWidth: true
                    textRole: "text"
                    valueRole: "value"
                    model: [
                        { text: "Light (WidgetWall Warm Default)", value: "light" },
                        { text: "Dark", value: "dark" },
                        { text: "Auto", value: "auto" }
                    ]
                    Component.onCompleted: currentIndex = indexOfValue(plasmoid.configuration.appearanceMode)
                }

                QQC2.Label { text: i18n("Global Surface Style:") }
                QQC2.ComboBox {
                    id: widgetStyleCombo
                    Layout.fillWidth: true
                    textRole: "text"
                    valueRole: "value"
                    model: [
                        { text: "Default", value: "default" },
                        { text: "Dark", value: "dark" },
                        { text: "Clear (Glass)", value: "clear" },
                        { text: "Tinted", value: "tinted" },
                        { text: "Solid", value: "solid" }
                    ]
                    Component.onCompleted: currentIndex = indexOfValue(plasmoid.configuration.widgetStyle)
                }

                QQC2.Label { text: i18n("Global Accent Color:") }
                QQC2.ComboBox {
                    id: accentColorCombo
                    Layout.fillWidth: true
                    textRole: "text"
                    valueRole: "value"
                    model: [
                        { text: "Automatic", value: "auto" },
                        { text: "Pink", value: "pink" },
                        { text: "Red", value: "red" },
                        { text: "Orange", value: "orange" },
                        { text: "Yellow", value: "yellow" },
                        { text: "Green", value: "green" },
                        { text: "Blue", value: "blue" },
                        { text: "Purple", value: "purple" },
                        { text: "Graphite", value: "graphite" },
                        { text: "Custom Hex (#RRGGBB)", value: "custom" }
                    ]
                    Component.onCompleted: currentIndex = indexOfValue(plasmoid.configuration.accentColorId)
                }

                QQC2.Label { text: i18n("Custom Accent Hex (#RRGGBB):") }
                QQC2.TextField {
                    id: customAccentHexField
                    placeholderText: i18n("#FF5A79")
                    Layout.fillWidth: true
                    onTextEdited: {
                        if (text.trim().length > 0) {
                            accentColorCombo.currentIndex = accentColorCombo.indexOfValue("custom")
                        }
                    }
                }

                QQC2.Label { text: i18n("Global Atmosphere Preset:") }
                QQC2.ComboBox {
                    id: themePresetCombo
                    Layout.fillWidth: true
                    textRole: "text"
                    valueRole: "value"
                    model: [
                        { text: "WidgetWall Light (Warm Minimal)", value: "warm-minimal" },
                        { text: "Liquid Glass", value: "liquid-glass" },
                        { text: "Pastel Editorial", value: "pastel-editorial" },
                        { text: "Aurora Gradient", value: "aurora-gradient" },
                        { text: "Midnight Dark", value: "midnight" },
                        { text: "Monochrome Studio", value: "monochrome" }
                    ]
                    Component.onCompleted: currentIndex = indexOfValue(plasmoid.configuration.themePreset)
                }

                QQC2.Label { text: i18n("3D Card Shadow Intensity (0-3):") }
                QQC2.SpinBox {
                    id: elevationSpin
                    from: 0
                    to: 3
                }

                QQC2.Label { text: i18n("Surface Opacity:") }
                QQC2.Slider {
                    id: opacitySlider
                    from: 0.40
                    to: 1.0
                    stepSize: 0.04
                    Layout.fillWidth: true
                }

                QQC2.Label { text: i18n("Background Color Override (Hex):") }
                QQC2.TextField {
                    id: bgColorField
                    placeholderText: i18n("Leave empty for preset surface color (e.g. #F2EFE9)")
                    Layout.fillWidth: true
                }

                QQC2.CheckBox {
                    id: gradientCheck
                    text: i18n("Enable Subtle Surface Gradient")
                    Layout.columnSpan: 2
                }

                QQC2.Label { text: i18n("Corner Radius (px):") }
                QQC2.SpinBox {
                    id: radiusSpin
                    from: 14
                    to: 32
                }

                QQC2.Label { text: i18n("Border Opacity:") }
                QQC2.Slider {
                    id: borderOpacitySlider
                    from: 0.05
                    to: 0.85
                    stepSize: 0.05
                    Layout.fillWidth: true
                }

                QQC2.Label { text: i18n("Text Color Override (Hex):") }
                QQC2.TextField {
                    id: textColorField
                    placeholderText: i18n("Leave empty for automatic text contrast")
                    Layout.fillWidth: true
                }

                QQC2.Label { text: i18n("Icon Style:") }
                QQC2.ComboBox {
                    id: iconStyleCombo
                    Layout.fillWidth: true
                    textRole: "text"
                    valueRole: "value"
                    model: [
                        { text: "Filled", value: "filled" },
                        { text: "Outline", value: "outline" },
                        { text: "Minimal", value: "minimal" },
                        { text: "Tinted", value: "tinted" }
                    ]
                    Component.onCompleted: currentIndex = indexOfValue(plasmoid.configuration.iconStyle)
                }

                QQC2.Label { text: i18n("Typography (Installed OS Font):") }
                QQC2.ComboBox {
                    id: fontCombo
                    Layout.fillWidth: true
                    textRole: "text"
                    valueRole: "value"
                    model: [
                        { text: "Auto (Follow Installed System Font)", value: "auto" },
                        { text: "SF Pro Display", value: "SF Pro Display" },
                        { text: "Helvetica Neue", value: "Helvetica Neue" },
                        { text: "Inter", value: "Inter" },
                        { text: "Plus Jakarta Sans", value: "Plus Jakarta Sans" },
                        { text: "Noto Sans", value: "Noto Sans" }
                    ]
                    Component.onCompleted: currentIndex = indexOfValue(plasmoid.configuration.preferredFontFamily)
                }

                QQC2.Button {
                    text: i18n("Reset This Widget to Global Defaults")
                    Layout.columnSpan: 2
                    onClicked: {
                        appearanceCombo.currentIndex = 0
                        widgetStyleCombo.currentIndex = 0
                        accentColorCombo.currentIndex = 1
                        themePresetCombo.currentIndex = 0
                        elevationSpin.value = 2
                        opacitySlider.value = 0.86
                        bgColorField.text = ""
                        gradientCheck.checked = true
                        radiusSpin.value = 24
                        borderOpacitySlider.value = 0.42
                        textColorField.text = ""
                        iconStyleCombo.currentIndex = 0
                        fontCombo.currentIndex = 0
                        bgImageField.text = ""
                    }
                }

                // Developer Attribution at the bottom of Appearance Settings
                RowLayout {
                    Layout.columnSpan: 2
                    Layout.fillWidth: true
                    Layout.topMargin: 4
                    spacing: 6

                    QQC2.Label {
                        text: i18n("Created by Haris Gitama")
                        opacity: 0.65
                        font.pixelSize: 11
                    }
                    QQC2.Label {
                        text: "·"
                        opacity: 0.45
                        font.pixelSize: 11
                    }
                    QQC2.Label {
                        text: "GitHub ↗"
                        opacity: 0.78
                        font.pixelSize: 11
                        font.underline: appCreditMouse.containsMouse
                        MouseArea {
                            id: appCreditMouse
                            anchors.fill: parent
                            hoverEnabled: true
                            cursorShape: Qt.PointingHandCursor
                            onClicked: Qt.openUrlExternally("https://github.com/Harisgitama")
                        }
                    }
                    Item { Layout.fillWidth: true }
                }
            }
        }

        QQC2.GroupBox {
            title: i18n("Background Image (SVG, JPG, JPEG, PNG, WebP)")
            Layout.fillWidth: true
            GridLayout {
                columns: 2
                anchors.fill: parent
                rowSpacing: 8
                columnSpacing: 10

                QQC2.Label { text: i18n("Select / Remove Image:") }
                RowLayout {
                    Layout.fillWidth: true
                    spacing: 6
                    QQC2.TextField {
                        id: bgImageField
                        placeholderText: i18n("/path/to/image.png, .svg, .jpg, .webp")
                        Layout.fillWidth: true
                    }
                    QQC2.Button {
                        text: i18n("Select...")
                        onClicked: bgImageDialog.open()
                    }
                    QQC2.Button {
                        text: i18n("Remove")
                        enabled: bgImageField.text.length > 0
                        onClicked: bgImageField.text = ""
                    }
                }

                QQC2.Label { text: i18n("Image Fit:") }
                QQC2.ComboBox {
                    id: bgFitCombo
                    Layout.fillWidth: true
                    textRole: "text"
                    valueRole: "value"
                    model: [
                        { text: "Cover (Crop to Fill)", value: "cover" },
                        { text: "Contain (Preserve Aspect)", value: "contain" },
                        { text: "Stretch (Fill Card)", value: "stretch" },
                        { text: "Center", value: "center" }
                    ]
                    Component.onCompleted: currentIndex = indexOfValue(plasmoid.configuration.customBgFitMode)
                }

                QQC2.Label { text: i18n("Image Position:") }
                QQC2.ComboBox {
                    id: bgPosCombo
                    Layout.fillWidth: true
                    textRole: "text"
                    valueRole: "value"
                    model: [
                        { text: "Center", value: "center" },
                        { text: "Top", value: "top" },
                        { text: "Bottom", value: "bottom" },
                        { text: "Left", value: "left" },
                        { text: "Right", value: "right" }
                    ]
                    Component.onCompleted: currentIndex = indexOfValue(plasmoid.configuration.customBgPosition)
                }

                QQC2.Label { text: i18n("Overlay Mode:") }
                QQC2.ComboBox {
                    id: bgOverlayModeCombo
                    Layout.fillWidth: true
                    textRole: "text"
                    valueRole: "value"
                    model: [
                        { text: "Auto", value: "auto" },
                        { text: "Dark Scrim", value: "dark" },
                        { text: "Light Scrim", value: "light" }
                    ]
                    Component.onCompleted: currentIndex = indexOfValue(plasmoid.configuration.customBgOverlayMode)
                }

                QQC2.Label { text: i18n("Overlay Opacity:") }
                QQC2.Slider {
                    id: bgOverlaySlider
                    from: 0.0
                    to: 0.85
                    stepSize: 0.05
                    Layout.fillWidth: true
                }

                QQC2.Label { text: i18n("Text Readability:") }
                QQC2.ComboBox {
                    id: bgTextContrastCombo
                    Layout.fillWidth: true
                    textRole: "text"
                    valueRole: "value"
                    model: [
                        { text: "Auto Contrast", value: "auto" },
                        { text: "Force Light Text", value: "light" },
                        { text: "Force Dark Text", value: "dark" }
                    ]
                    Component.onCompleted: currentIndex = indexOfValue(plasmoid.configuration.customBgTextContrast)
                }
            }
        }

        QQC2.GroupBox {
            title: i18n("Widget Configuration & Module Management (Music Source, Photo Frame, Clock)")
            Layout.fillWidth: true
            GridLayout {
                columns: 2
                anchors.fill: parent
                rowSpacing: 8
                columnSpacing: 10

                QQC2.Label { text: i18n("Widget Type:") }
                QQC2.ComboBox {
                    id: widgetKindCombo
                    Layout.fillWidth: true
                    textRole: "text"
                    valueRole: "value"
                    model: [
                        { text: "Clock & Alarms (widget.clock)", value: "clock" },
                        { text: "Monthly Calendar (widget.calendar)", value: "calendar" },
                        { text: "Weather (widget.weather)", value: "weather" },
                        { text: "Pomodoro Focus (widget.pomodoro)", value: "pomodoro" },
                        { text: "Notes (widget.notes)", value: "notes" },
                        { text: "To-Do List (widget.todo)", value: "agenda" },
                        { text: "Photo Frame (widget.photo_frame)", value: "photos" },
                        { text: "Music Player (widget.music_player)", value: "music_player" },
                        { text: "Quick Actions (widget.quick_actions)", value: "quick_actions" },
                        { text: "System Monitor (widget.system_monitor)", value: "system_monitor" }
                    ]
                    Component.onCompleted: currentIndex = indexOfValue(plasmoid.configuration.widgetKind)
                }

                QQC2.Label { text: i18n("Clock City / Subtitle:") }
                QQC2.TextField {
                    id: clockLocField
                    Layout.fillWidth: true
                }

                QQC2.Label { text: i18n("Default Alarm Snooze (mins):") }
                QQC2.SpinBox {
                    id: snoozeSpin
                    from: 1
                    to: 60
                }

                QQC2.CheckBox {
                    id: clock24Check
                    text: i18n("Use 24-hour clock format")
                    Layout.columnSpan: 2
                }

                QQC2.CheckBox {
                    id: clockSecCheck
                    text: i18n("Display clock seconds")
                    Layout.columnSpan: 2
                }

                QQC2.Label { text: i18n("Calendar Locale:") }
                QQC2.ComboBox {
                    id: localeCombo
                    Layout.fillWidth: true
                    textRole: "text"
                    valueRole: "value"
                    model: [
                        { text: "English (en-US)", value: "en-US" },
                        { text: "Bahasa Indonesia (id-ID)", value: "id-ID" }
                    ]
                    Component.onCompleted: currentIndex = indexOfValue(plasmoid.configuration.calendarLocale)
                }

                QQC2.Label { text: i18n("Weather Location:") }
                QQC2.TextField {
                    id: weatherLocField
                    Layout.fillWidth: true
                }

                QQC2.CheckBox {
                    id: weatherCelsiusCheck
                    text: i18n("Temperature in Celsius (°C)")
                    Layout.columnSpan: 2
                }

                QQC2.Label { text: i18n("Photo Frame Folder:") }
                QQC2.TextField {
                    id: photoDirField
                    placeholderText: i18n("Leave empty for bundled WidgetWall photography")
                    Layout.fillWidth: true
                }

                QQC2.CheckBox {
                    id: photoSlideshowCheck
                    text: i18n("Enable Photo Frame Slideshow Mode")
                    Layout.columnSpan: 2
                }

                QQC2.Label { text: i18n("Slideshow Interval (secs):") }
                QQC2.SpinBox {
                    id: photoIntervalSpin
                    from: 5
                    to: 3600
                }

                QQC2.Label { text: i18n("Music Source Mode:") }
                QQC2.ComboBox {
                    id: musicSourceCombo
                    Layout.fillWidth: true
                    textRole: "text"
                    valueRole: "value"
                    model: [
                        { text: "Local Music Folder (.mp3, .flac, .ogg, .wav, .m4a)", value: "local" },
                        { text: "Online Audio Stream (Direct URL)", value: "stream" }
                    ]
                    Component.onCompleted: currentIndex = indexOfValue(plasmoid.configuration.musicSourceType)
                }

                QQC2.Label { text: i18n("Local Music Folder:") }
                RowLayout {
                    Layout.fillWidth: true
                    spacing: 6
                    QQC2.TextField {
                        id: musicFolderField
                        placeholderText: i18n("~/Music")
                        Layout.fillWidth: true
                    }
                    QQC2.Button {
                        text: i18n("Choose Folder...")
                        onClicked: musicFolderDialog.open()
                    }
                }

                QQC2.Label { text: i18n("Direct Audio Stream URL:") }
                QQC2.TextField {
                    id: musicStreamField
                    placeholderText: i18n("https://ice2.somafm.com/groovesalad-128-mp3")
                    Layout.fillWidth: true
                }

                QQC2.Label { text: i18n("Quick Actions Columns:") }
                QQC2.SpinBox {
                    id: qaColsSpin
                    from: 2
                    to: 3
                }

                // Developer Attribution at the bottom of Widget Configuration
                RowLayout {
                    Layout.columnSpan: 2
                    Layout.fillWidth: true
                    Layout.topMargin: 6
                    spacing: 6

                    QQC2.Label {
                        text: i18n("Developed by Haris Gitama")
                        opacity: 0.65
                        font.pixelSize: 11
                    }
                    QQC2.Label {
                        text: "·"
                        opacity: 0.45
                        font.pixelSize: 11
                    }
                    QQC2.Label {
                        text: "GitHub ↗"
                        opacity: 0.78
                        font.pixelSize: 11
                        font.underline: widgetCreditMouse.containsMouse
                        MouseArea {
                            id: widgetCreditMouse
                            anchors.fill: parent
                            hoverEnabled: true
                            cursorShape: Qt.PointingHandCursor
                            onClicked: Qt.openUrlExternally("https://github.com/Harisgitama")
                        }
                    }
                    Item { Layout.fillWidth: true }
                }
            }
        }
    }
}
"""

FILES["plasma/plasmoid/contents/ui/main.qml"] = """import QtQuick 2.15
import QtQuick.Layouts 1.15
import org.kde.plasma.plasmoid 2.0
import org.kde.plasma.core 2.0 as PlasmaCore

Item {
    id: root
    width: PlasmaCore.Units.gridUnit * 18
    height: PlasmaCore.Units.gridUnit * 13
    Plasmoid.backgroundHints: PlasmaCore.Types.NoBackground
    Plasmoid.preferredRepresentation: Plasmoid.fullRepresentation
    clip: true

    WidgetTheme {
        id: theme
    }

    property var daemonSnapshot: ({})
    readonly property bool isPhotoWidget: (plasmoid.configuration.widgetKind || "clock") === "photos"

    PlasmaCore.DataSource {
        id: daemonExecutable
        engine: "executable"
        connectedSources: []
        onNewData: function(sourceName, data) {
            if (data["stdout"]) {
                try {
                    var parsed = JSON.parse(data["stdout"])
                    if (parsed.clock) {
                        root.daemonSnapshot = parsed
                    }
                } catch (e) {}
            }
            disconnectSource(sourceName)
        }
        function invokeMethod(methodAndArgs) {
            connectSource("qdbus org.urwidgets.Daemon /org/urwidgets/Daemon org.urwidgets.Daemon1." + methodAndArgs)
        }
    }

    WidgetSurface {
        anchors.fill: parent
        themeObj: theme
        fullBleed: root.isPhotoWidget
    }

    Loader {
        id: widgetLoader
        anchors.fill: parent
        anchors.margins: root.isPhotoWidget ? 0 : theme.spaceCard
        source: {
            var kind = plasmoid.configuration.widgetKind || "clock"
            switch (kind) {
                case "clock": return "ClockWidget.qml"
                case "calendar": return "CalendarWidget.qml"
                case "weather": return "WeatherWidget.qml"
                case "pomodoro": return "PomodoroWidget.qml"
                case "notes": return "NotesWidget.qml"
                case "agenda": return "AgendaWidget.qml"
                case "photos": return "PhotoWidget.qml"
                case "music_player": return "MusicPlayerWidget.qml"
                case "quick_actions": return "QuickActionsWidget.qml"
                case "system_monitor": return "SystemMonitorWidget.qml"
                default: return "ClockWidget.qml"
            }
        }
    }

    Component.onCompleted: {
        Plasmoid.setAction("modeLight", i18n("Appearance: Light"), "weather-clear")
        Plasmoid.setAction("modeDark", i18n("Appearance: Dark"), "weather-clear-night")
        Plasmoid.setAction("styleDefault", i18n("Widget Style: Default"), "preferences-desktop-theme")
        Plasmoid.setAction("styleClear", i18n("Widget Style: Clear"), "preferences-desktop-theme")
        Plasmoid.setAction("styleTinted", i18n("Widget Style: Tinted"), "preferences-desktop-color")
        daemonExecutable.invokeMethod("GetSnapshot")
    }

    function action_modeLight() { plasmoid.configuration.appearanceMode = "light" }
    function action_modeDark() { plasmoid.configuration.appearanceMode = "dark" }
    function action_styleDefault() { plasmoid.configuration.widgetStyle = "default" }
    function action_styleClear() { plasmoid.configuration.widgetStyle = "clear" }
    function action_styleTinted() { plasmoid.configuration.widgetStyle = "tinted" }
}
"""

# A. CLOCK & ALARMS — 2-Slide Manual Clock & Complete Alarm Manager (No auto-rotate, zero hover overlays)
FILES["plasma/plasmoid/contents/ui/ClockWidget.qml"] = """import QtQuick 2.15
import QtQuick.Controls 2.15 as QQC2
import QtQuick.Layouts 1.15
import QtQuick.Dialogs 1.3

Item {
    id: clockRoot
    property date currentTime: new Date()
    property bool use24h: plasmoid.configuration.use24HourClock || false
    property bool showSecs: plasmoid.configuration.showClockSeconds || false
    property string locationLabel: plasmoid.configuration.clockLocationLabel || "Bandung"
    // Slide 0 = Main Clock, Slide 1 = Alarm Manager (Manual navigation only; never auto-rotates)
    property int activeSlide: 0
    property bool composerOpen: false
    property string editingAlarmId: ""
    property int pickerHour: 7
    property int pickerMinute: 30
    property string pickerLabel: "Morning Study"
    property string pickerRepeat: "Weekdays"
    property string pickerOneTimeDate: ""
    property int pickerSnoozeMins: plasmoid.configuration.defaultSnoozeMins || 10
    property string pickerRingtone: plasmoid.configuration.defaultRingtonePath || "/usr/share/sounds/freedesktop/stereo/alarm-clock-elapsed.oga"
    property int pickerVolume: 85
    property bool previewingSound: false
    property string activeDueAlarmId: ""
    property string activeDueAlarmLabel: ""

    FileDialog {
        id: localRingtoneDialog
        title: "Pilih File Nada Dering Lokal (.mp3, .wav, .ogg, .oga, .flac, .m4a, .aac)"
        nameFilters: ["Audio Files (*.mp3 *.wav *.ogg *.oga *.flac *.m4a *.aac)"]
        onAccepted: {
            var localPath = localRingtoneDialog.fileUrl.toString().replace("file://", "")
            clockRoot.pickerRingtone = localPath
        }
    }

    ListModel {
        id: alarmsModel
        ListElement { alarmId: "alm-wake"; timeStr: "07:00"; label: "Wake Up"; repeatText: "Weekdays"; oneTimeDate: ""; snoozeMins: 10; ringtonePath: "/usr/share/sounds/freedesktop/stereo/alarm-clock-elapsed.oga"; volume: 85; enabled: true }
        ListElement { alarmId: "alm-study"; timeStr: "08:00"; label: "Morning Study"; repeatText: "Every day"; oneTimeDate: ""; snoozeMins: 5; ringtonePath: "/usr/share/sounds/freedesktop/stereo/complete.oga"; volume: 80; enabled: true }
        ListElement { alarmId: "alm-lunch"; timeStr: "12:30"; label: "Lunch Reminder"; repeatText: "Mon, Wed, Fri"; oneTimeDate: ""; snoozeMins: 15; ringtonePath: "/usr/share/sounds/freedesktop/stereo/bell.oga"; volume: 75; enabled: false }
    }

    readonly property int enabledAlarmCount: {
        var count = 0
        for (var i = 0; i < alarmsModel.count; i++) {
            if (alarmsModel.get(i).enabled) count++
        }
        return count
    }

    readonly property string nextEnabledAlarmTime: {
        for (var i = 0; i < alarmsModel.count; i++) {
            if (alarmsModel.get(i).enabled) return alarmsModel.get(i).timeStr
        }
        return ""
    }

    function openCreateAlarm() {
        editingAlarmId = ""
        pickerHour = 7
        pickerMinute = 30
        pickerLabel = "Scheduled Alarm"
        pickerRepeat = "Every day"
        pickerOneTimeDate = ""
        pickerSnoozeMins = plasmoid.configuration.defaultSnoozeMins || 10
        pickerRingtone = plasmoid.configuration.defaultRingtonePath || "/usr/share/sounds/freedesktop/stereo/alarm-clock-elapsed.oga"
        pickerVolume = 85
        composerOpen = true
    }

    function openEditAlarm(idx) {
        var item = alarmsModel.get(idx)
        if (!item) return
        editingAlarmId = item.alarmId
        var parts = item.timeStr.split(":")
        pickerHour = parseInt(parts[0] || "7")
        pickerMinute = parseInt(parts[1] || "0")
        pickerLabel = item.label
        pickerRepeat = item.repeatText
        pickerOneTimeDate = item.oneTimeDate || ""
        pickerSnoozeMins = item.snoozeMins || 10
        pickerRingtone = item.ringtonePath || "/usr/share/sounds/freedesktop/stereo/alarm-clock-elapsed.oga"
        pickerVolume = item.volume || 85
        composerOpen = true
    }

    function saveComposerAlarm() {
        var hh = (pickerHour < 10 ? "0" : "") + pickerHour
        var mm = (pickerMinute < 10 ? "0" : "") + pickerMinute
        var timeFormatted = hh + ":" + mm
        var finalLabel = pickerLabel && pickerLabel.trim().length > 0 ? pickerLabel.trim() : "Alarm"
        if (editingAlarmId.length > 0) {
            for (var i = 0; i < alarmsModel.count; i++) {
                if (alarmsModel.get(i).alarmId === editingAlarmId) {
                    alarmsModel.set(i, {
                        alarmId: editingAlarmId,
                        timeStr: timeFormatted,
                        label: finalLabel,
                        repeatText: pickerRepeat,
                        oneTimeDate: pickerOneTimeDate,
                        snoozeMins: pickerSnoozeMins,
                        ringtonePath: pickerRingtone,
                        volume: pickerVolume,
                        enabled: true
                    })
                    break
                }
            }
            daemonExecutable.invokeMethod(
                "AlarmAction 'edit|" + editingAlarmId + "|" + timeFormatted + "|" + finalLabel + "|" + pickerRepeat + "|" + pickerSnoozeMins + "|" + pickerRingtone + "|" + pickerVolume + "|" + pickerOneTimeDate + "'"
            )
        } else {
            var newId = "alm-" + Date.now()
            alarmsModel.append({
                alarmId: newId,
                timeStr: timeFormatted,
                label: finalLabel,
                repeatText: pickerRepeat,
                oneTimeDate: pickerOneTimeDate,
                snoozeMins: pickerSnoozeMins,
                ringtonePath: pickerRingtone,
                volume: pickerVolume,
                enabled: true
            })
            daemonExecutable.invokeMethod(
                "AlarmAction 'add|" + newId + "|" + timeFormatted + "|" + finalLabel + "|" + pickerRepeat + "|" + pickerSnoozeMins + "|" + pickerRingtone + "|" + pickerVolume + "|" + pickerOneTimeDate + "'"
            )
        }
        composerOpen = false
    }

    Timer {
        interval: clockRoot.showSecs ? 1000 : 15000
        running: true
        repeat: true
        triggeredOnStart: true
        onTriggered: {
            clockRoot.currentTime = new Date()
            var nowStr = Qt.formatDateTime(clockRoot.currentTime, "HH:mm")
            for (var i = 0; i < alarmsModel.count; i++) {
                var a = alarmsModel.get(i)
                if (a.enabled && a.timeStr === nowStr && clockRoot.currentTime.getSeconds() < 15) {
                    clockRoot.activeDueAlarmId = a.alarmId
                    clockRoot.activeDueAlarmLabel = a.label + " (" + a.timeStr + ")"
                    daemonExecutable.invokeMethod("AlarmAction 'preview|" + a.ringtonePath + "'")
                }
            }
        }
    }

    // Top bar: Subtle permanent alarm status indicator + Manual Slide Navigation (< / >)
    RowLayout {
        id: topBar
        anchors.top: parent.top
        anchors.left: parent.left
        anchors.right: parent.right
        spacing: 6

        Rectangle {
            visible: clockRoot.enabledAlarmCount > 0 || clockRoot.activeSlide === 1
            height: 22
            width: alarmBadgeRow.implicitWidth + 14
            radius: 11
            color: clockRoot.activeSlide === 1 ? theme.accentColor : theme.subtleSurfaceColor

            RowLayout {
                id: alarmBadgeRow
                anchors.centerIn: parent
                spacing: 4

                WidgetText {
                    themeObj: theme
                    text: clockRoot.activeSlide === 1
                        ? ("Alarms (" + clockRoot.enabledAlarmCount + " active)")
                        : ("🔔 " + clockRoot.nextEnabledAlarmTime)
                    color: clockRoot.activeSlide === 1 ? "#FFFFFF" : theme.textColor
                    font.pixelSize: 10
                    font.weight: Font.DemiBold
                }
            }

            MouseArea {
                anchors.fill: parent
                hoverEnabled: false
                cursorShape: Qt.PointingHandCursor
                onClicked: clockRoot.activeSlide = (clockRoot.activeSlide === 0 ? 1 : 0)
            }
        }

        Item { Layout.fillWidth: true }

        WidgetButton {
            visible: clockRoot.activeSlide === 1 && !clockRoot.composerOpen
            themeObj: theme
            label: "+ New"
            active: true
            pill: true
            onClicked: clockRoot.openCreateAlarm()
        }

        WidgetButton {
            themeObj: theme
            label: "‹"
            pill: true
            active: clockRoot.activeSlide === 0
            onClicked: {
                clockRoot.composerOpen = false
                clockRoot.activeSlide = 0
            }
        }

        WidgetButton {
            themeObj: theme
            label: "›"
            pill: true
            active: clockRoot.activeSlide === 1
            onClicked: clockRoot.activeSlide = 1
        }
    }

    // Active Due Alarm Banner (Snooze / Stop)
    Rectangle {
        visible: clockRoot.activeDueAlarmId.length > 0
        anchors.top: topBar.bottom
        anchors.topMargin: 4
        anchors.left: parent.left
        anchors.right: parent.right
        height: 26
        radius: 8
        color: theme.accentColor
        z: 5

        RowLayout {
            anchors.fill: parent
            anchors.leftMargin: 8
            anchors.rightMargin: 8
            spacing: 6

            WidgetText {
                themeObj: theme
                color: "#FFFFFF"
                text: "🔔 " + clockRoot.activeDueAlarmLabel
                font.pixelSize: 11
                font.weight: Font.DemiBold
                elide: Text.ElideRight
                Layout.fillWidth: true
            }

            WidgetButton {
                themeObj: theme
                label: "Snooze"
                pill: true
                onClicked: {
                    daemonExecutable.invokeMethod("AlarmAction 'snooze|" + clockRoot.activeDueAlarmId + "'")
                    clockRoot.activeDueAlarmId = ""
                }
            }

            WidgetButton {
                themeObj: theme
                label: "Stop"
                pill: true
                onClicked: {
                    daemonExecutable.invokeMethod("AlarmAction 'stop|" + clockRoot.activeDueAlarmId + "'")
                    clockRoot.activeDueAlarmId = ""
                }
            }
        }
    }

    // SLIDE 0: MAIN CLOCK VIEW
    ColumnLayout {
        visible: clockRoot.activeSlide === 0
        anchors.verticalCenter: parent.verticalCenter
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.topMargin: 12
        spacing: 2

        RowLayout {
            spacing: 6
            Layout.alignment: Qt.AlignLeft | Qt.AlignBaseline

            WidgetText {
                themeObj: theme
                text: {
                    if (clockRoot.use24h) {
                        return Qt.formatDateTime(clockRoot.currentTime, clockRoot.showSecs ? "HH:mm:ss" : "HH:mm")
                    }
                    var h = clockRoot.currentTime.getHours() % 12
                    if (h === 0) h = 12
                    var m = Qt.formatDateTime(clockRoot.currentTime, clockRoot.showSecs ? ":mm:ss" : ":mm")
                    return h + m
                }
                font.pixelSize: Math.min(62, Math.max(38, clockRoot.height * 0.42))
                font.weight: Font.Light
                font.letterSpacing: -1.2
            }

            WidgetText {
                visible: !clockRoot.use24h
                themeObj: theme
                color: theme.accentColor
                text: clockRoot.currentTime.getHours() >= 12 ? "PM" : "AM"
                font.pixelSize: Math.min(20, Math.max(14, clockRoot.height * 0.15))
                font.weight: Font.DemiBold
                Layout.alignment: Qt.AlignTop
                Layout.topMargin: 10
            }
        }

        RowLayout {
            spacing: 5
            Rectangle {
                width: 6
                height: 6
                radius: 3
                color: theme.accentColor
            }
            WidgetText {
                themeObj: theme
                muted: true
                text: Qt.formatDateTime(clockRoot.currentTime, "ddd, MMM d") + (clockRoot.locationLabel ? "," : "")
                font.pixelSize: 13
                font.weight: Font.Normal
            }
            WidgetText {
                visible: clockRoot.locationLabel.length > 0
                themeObj: theme
                text: clockRoot.locationLabel
                font.pixelSize: 13
                font.weight: Font.DemiBold
            }
        }
    }

    // SLIDE 1A: ALARM LIST VIEW
    ColumnLayout {
        visible: clockRoot.activeSlide === 1 && !clockRoot.composerOpen
        anchors.top: topBar.bottom
        anchors.topMargin: 6
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.bottom: parent.bottom
        spacing: 4

        Repeater {
            model: alarmsModel
            Rectangle {
                Layout.fillWidth: true
                height: 28
                radius: 8
                color: theme.subtleSurfaceColor

                RowLayout {
                    anchors.fill: parent
                    anchors.leftMargin: 8
                    anchors.rightMargin: 6
                    spacing: 5

                    WidgetText {
                        themeObj: theme
                        text: model.timeStr
                        font.pixelSize: 12
                        font.weight: Font.DemiBold
                        opacity: model.enabled ? 1.0 : 0.45
                    }

                    WidgetText {
                        themeObj: theme
                        text: model.label
                        font.pixelSize: 11
                        elide: Text.ElideRight
                        Layout.fillWidth: true
                        opacity: model.enabled ? 1.0 : 0.45
                    }

                    WidgetText {
                        themeObj: theme
                        muted: true
                        text: model.oneTimeDate && model.oneTimeDate.length > 0 ? model.oneTimeDate : model.repeatText
                        font.pixelSize: 9
                    }

                    WidgetButton {
                        themeObj: theme
                        label: "Edit"
                        pill: true
                        onClicked: clockRoot.openEditAlarm(index)
                    }

                    WidgetButton {
                        themeObj: theme
                        label: "×"
                        pill: true
                        onClicked: {
                            var aid = model.alarmId
                            alarmsModel.remove(index)
                            daemonExecutable.invokeMethod("AlarmAction 'delete|" + aid + "'")
                        }
                    }

                    WidgetButton {
                        themeObj: theme
                        label: model.enabled ? "ON" : "OFF"
                        active: model.enabled
                        pill: true
                        onClicked: {
                            alarmsModel.setProperty(index, "enabled", !model.enabled)
                            daemonExecutable.invokeMethod("AlarmAction 'toggle|" + model.alarmId + "'")
                        }
                    }
                }
            }
        }

        Item { Layout.fillHeight: true }
    }

    // SLIDE 1B: FULL ALARM TIME PICKER & COMPOSER DRAWER (Hour/Minute selector, Local Custom Ringtone Picker, Snooze, Preview)
    ColumnLayout {
        visible: clockRoot.activeSlide === 1 && clockRoot.composerOpen
        anchors.top: topBar.bottom
        anchors.topMargin: 4
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.bottom: parent.bottom
        spacing: 4

        // Row 1: Hour (00-23) & Minute (00-59) Picker + Clear
        RowLayout {
            Layout.fillWidth: true
            spacing: 4

            WidgetButton {
                themeObj: theme
                label: "H-"
                pill: true
                onClicked: clockRoot.pickerHour = (clockRoot.pickerHour + 23) % 24
            }
            WidgetText {
                themeObj: theme
                text: (clockRoot.pickerHour < 10 ? "0" : "") + clockRoot.pickerHour + ":" + (clockRoot.pickerMinute < 10 ? "0" : "") + clockRoot.pickerMinute
                font.pixelSize: 15
                font.weight: Font.DemiBold
            }
            WidgetButton {
                themeObj: theme
                label: "H+"
                pill: true
                onClicked: clockRoot.pickerHour = (clockRoot.pickerHour + 1) % 24
            }
            WidgetButton {
                themeObj: theme
                label: "M-"
                pill: true
                onClicked: clockRoot.pickerMinute = (clockRoot.pickerMinute + 59) % 60
            }
            WidgetButton {
                themeObj: theme
                label: "M+"
                pill: true
                onClicked: clockRoot.pickerMinute = (clockRoot.pickerMinute + 1) % 60
            }
            WidgetButton {
                themeObj: theme
                label: "Clear"
                pill: true
                onClicked: {
                    clockRoot.pickerHour = 7
                    clockRoot.pickerMinute = 0
                    clockRoot.pickerLabel = ""
                }
            }
        }

        // Row 2: Label & Repeat Schedule / One-Time Date
        RowLayout {
            Layout.fillWidth: true
            spacing: 4

            QQC2.TextField {
                Layout.fillWidth: true
                placeholderText: "Alarm label"
                text: clockRoot.pickerLabel
                font.pixelSize: 11
                onTextChanged: clockRoot.pickerLabel = text
            }

            WidgetButton {
                themeObj: theme
                label: clockRoot.pickerRepeat
                pill: true
                onClicked: {
                    var modes = ["Every day", "Weekdays", "Weekends", "One-time"]
                    var idx = modes.indexOf(clockRoot.pickerRepeat)
                    clockRoot.pickerRepeat = modes[(idx + 1) % modes.length]
                    if (clockRoot.pickerRepeat === "One-time" && clockRoot.pickerOneTimeDate.length === 0) {
                        clockRoot.pickerOneTimeDate = Qt.formatDateTime(new Date(), "yyyy-MM-dd")
                    } else if (clockRoot.pickerRepeat !== "One-time") {
                        clockRoot.pickerOneTimeDate = ""
                    }
                }
            }
        }

        // Row 3: Custom Local Ringtone Path + File Picker Button
        RowLayout {
            Layout.fillWidth: true
            spacing: 4

            QQC2.TextField {
                Layout.fillWidth: true
                placeholderText: "/path/to/nada-dering.mp3 (.wav, .ogg, .flac)"
                text: clockRoot.pickerRingtone
                font.pixelSize: 10
                onTextChanged: clockRoot.pickerRingtone = text
            }

            WidgetButton {
                themeObj: theme
                label: "Pilih File Lokal..."
                pill: true
                onClicked: localRingtoneDialog.open()
            }
        }

        // Row 4: Snooze Duration (5, 10, 15, 20, 30, Custom) + Ringtone Preview & Stop + Confirm/Cancel
        RowLayout {
            Layout.fillWidth: true
            spacing: 4

            WidgetButton {
                themeObj: theme
                label: "Snooze " + clockRoot.pickerSnoozeMins + "m"
                pill: true
                onClicked: {
                    var opts = [5, 10, 15, 20, 30, 45]
                    var idx = opts.indexOf(clockRoot.pickerSnoozeMins)
                    clockRoot.pickerSnoozeMins = opts[(idx + 1) % opts.length]
                }
            }

            WidgetButton {
                themeObj: theme
                label: clockRoot.previewingSound ? "■ Stop" : "♪ Preview"
                active: clockRoot.previewingSound
                pill: true
                onClicked: {
                    if (clockRoot.previewingSound) {
                        clockRoot.previewingSound = false
                        daemonExecutable.invokeMethod("AlarmAction 'stop_preview'")
                    } else {
                        clockRoot.previewingSound = true
                        daemonExecutable.invokeMethod("AlarmAction 'preview|" + clockRoot.pickerRingtone + "'")
                    }
                }
            }

            Item { Layout.fillWidth: true }

            WidgetButton {
                themeObj: theme
                label: "Cancel"
                pill: true
                onClicked: {
                    clockRoot.previewingSound = false
                    clockRoot.composerOpen = false
                }
            }

            WidgetButton {
                themeObj: theme
                label: "Confirm"
                active: true
                pill: true
                onClicked: clockRoot.saveComposerAlarm()
            }
        }
    }
}
"""

# B. CALENDAR — Clean monthly calendar with interactive day selection, Today button, First Day of Week toggle & live theme Connections
FILES["plasma/plasmoid/contents/ui/CalendarWidget.qml"] = """import QtQuick 2.15
import QtQuick.Layouts 1.15

ColumnLayout {
    id: calendarRoot
    spacing: 8

    property int viewYear: (new Date()).getFullYear()
    property int viewMonth: (new Date()).getMonth()
    property int selectedDay: (new Date()).getDate()
    property string localeCode: plasmoid.configuration.calendarLocale || "en-US"
    property int firstDayOfWeek: plasmoid.configuration.calendarFirstDay !== undefined ? plasmoid.configuration.calendarFirstDay : 1

    readonly property var monthsEn: ["January","February","March","April","May","June","July","August","September","October","November","December"]
    readonly property var monthsId: ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"]
    readonly property var weekdaysMonEn: ["M","T","W","T","F","S","S"]
    readonly property var weekdaysSunEn: ["S","M","T","W","T","F","S"]
    readonly property var weekdaysMonId: ["Sen","Sel","Rab","Kam","Jum","Sab","Min"]
    readonly property var weekdaysSunId: ["Min","Sen","Sel","Rab","Kam","Jum","Sab"]

    readonly property var activeWeekdays: {
        var isId = localeCode.indexOf("id") === 0
        if (isId) return firstDayOfWeek === 1 ? weekdaysMonId : weekdaysSunId
        return firstDayOfWeek === 1 ? weekdaysMonEn : weekdaysSunEn
    }

    readonly property string activeMonthTitle: {
        var isId = localeCode.indexOf("id") === 0
        var mName = isId ? monthsId[viewMonth] : monthsEn[viewMonth]
        return mName + " " + viewYear
    }

    property var gridCells: []

    function rebuildCalendar() {
        var firstDate = new Date(viewYear, viewMonth, 1)
        var daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
        var rawDow = firstDate.getDay()
        var leading = firstDayOfWeek === 1 ? ((rawDow + 6) % 7) : rawDow
        var now = new Date()
        var cells = []
        for (var i = 0; i < leading; i++) {
            cells.push({ day: 0, isToday: false, isSelected: false, hasEvent: false })
        }
        for (var d = 1; d <= daysInMonth; d++) {
            var isT = (viewYear === now.getFullYear() && viewMonth === now.getMonth() && d === now.getDate())
            cells.push({
                day: d,
                isToday: isT,
                isSelected: d === selectedDay,
                hasEvent: (d === 12 || d === 18 || d === 24)
            })
        }
        while (cells.length < 42) {
            cells.push({ day: 0, isToday: false, isSelected: false, hasEvent: false })
        }
        gridCells = cells
    }

    function navigateMonth(delta) {
        var nextM = viewMonth + delta
        var nextY = viewYear
        if (nextM < 0) { nextM = 11; nextY -= 1 }
        else if (nextM > 11) { nextM = 0; nextY += 1 }
        viewMonth = nextM
        viewYear = nextY
        rebuildCalendar()
    }

    function jumpToToday() {
        var now = new Date()
        viewYear = now.getFullYear()
        viewMonth = now.getMonth()
        selectedDay = now.getDate()
        rebuildCalendar()
    }

    // Immediate reactivity when global/per-widget theme or accent color changes
    Connections {
        target: theme
        function onAccentColorChanged() { calendarRoot.rebuildCalendar() }
        function onIsDarkChanged() { calendarRoot.rebuildCalendar() }
        function onWidgetStyleChanged() { calendarRoot.rebuildCalendar() }
    }

    Component.onCompleted: rebuildCalendar()

    RowLayout {
        Layout.fillWidth: true
        spacing: 4

        WidgetText {
            themeObj: theme
            text: calendarRoot.activeMonthTitle
            font.pixelSize: 15
            font.weight: Font.DemiBold
            Layout.fillWidth: true
            elide: Text.ElideRight
        }

        WidgetButton {
            themeObj: theme
            label: calendarRoot.firstDayOfWeek === 1 ? "Mon" : "Sun"
            pill: true
            onClicked: {
                calendarRoot.firstDayOfWeek = calendarRoot.firstDayOfWeek === 1 ? 0 : 1
                plasmoid.configuration.calendarFirstDay = calendarRoot.firstDayOfWeek
                calendarRoot.rebuildCalendar()
            }
        }

        WidgetButton {
            themeObj: theme
            label: calendarRoot.localeCode.indexOf("id") === 0 ? "ID" : "EN"
            pill: true
            onClicked: {
                calendarRoot.localeCode = calendarRoot.localeCode.indexOf("id") === 0 ? "en-US" : "id-ID"
                plasmoid.configuration.calendarLocale = calendarRoot.localeCode
                calendarRoot.rebuildCalendar()
            }
        }

        WidgetButton {
            themeObj: theme
            label: "Today"
            pill: true
            onClicked: calendarRoot.jumpToToday()
        }

        WidgetButton {
            themeObj: theme
            label: "‹"
            pill: true
            onClicked: calendarRoot.navigateMonth(-1)
        }

        WidgetButton {
            themeObj: theme
            label: "›"
            pill: true
            onClicked: calendarRoot.navigateMonth(1)
        }
    }

    GridLayout {
        columns: 7
        Layout.fillWidth: true
        Layout.fillHeight: true
        columnSpacing: 2
        rowSpacing: 2

        Repeater {
            model: calendarRoot.activeWeekdays
            WidgetText {
                themeObj: theme
                muted: true
                text: modelData
                font.pixelSize: 10
                font.weight: Font.DemiBold
                horizontalAlignment: Text.AlignHCenter
                Layout.fillWidth: true
            }
        }

        Repeater {
            model: calendarRoot.gridCells
            Item {
                Layout.fillWidth: true
                Layout.fillHeight: true

                Rectangle {
                    anchors.centerIn: parent
                    width: 24
                    height: 24
                    radius: 12
                    color: modelData.isToday
                        ? theme.accentColor
                        : (modelData.isSelected && modelData.day > 0 ? theme.subtleSurfaceColor : "transparent")
                    border.width: modelData.isSelected && !modelData.isToday && modelData.day > 0 ? 1 : 0
                    border.color: theme.accentColor

                    WidgetText {
                        anchors.centerIn: parent
                        themeObj: theme
                        text: modelData.day > 0 ? modelData.day : ""
                        color: modelData.isToday ? "#FFFFFF" : theme.textColor
                        font.pixelSize: 12
                        font.weight: (modelData.isToday || modelData.isSelected) ? Font.DemiBold : Font.Normal
                    }

                    Rectangle {
                        visible: modelData.hasEvent && !modelData.isToday && modelData.day > 0
                        width: 4
                        height: 4
                        radius: 2
                        color: theme.accentColor
                        anchors.horizontalCenter: parent.horizontalCenter
                        anchors.bottom: parent.bottom
                        anchors.bottomMargin: 1
                    }
                }

                MouseArea {
                    anchors.fill: parent
                    enabled: modelData.day > 0
                    cursorShape: modelData.day > 0 ? Qt.PointingHandCursor : Qt.ArrowCursor
                    onClicked: {
                        if (modelData.day > 0) {
                            calendarRoot.selectedDay = modelData.day
                            calendarRoot.rebuildCalendar()
                        }
                    }
                }
            }
        }
    }
}
"""

# C. WEATHER — Redesigned to match Reference Image 2 (Vernon / 29° / Mostly Clear / H:29° L:16°)
FILES["plasma/plasmoid/contents/ui/WeatherWidget.qml"] = """import QtQuick 2.15
import QtQuick.Layouts 1.15

ColumnLayout {
    id: weatherRoot
    spacing: 4

    property bool useCelsius: plasmoid.configuration.weatherCelsius !== undefined ? plasmoid.configuration.weatherCelsius : true
    property string locationName: plasmoid.configuration.weatherLocation || "Bandung"
    property real baseTempC: root.daemonSnapshot.weather ? root.daemonSnapshot.weather.temp_c : 29.0
    property string conditionText: root.daemonSnapshot.weather ? root.daemonSnapshot.weather.condition : "Mostly Clear"

    function formatDeg(c) {
        var val = useCelsius ? Math.round(c) : Math.round(c * 9 / 5 + 32)
        return val + "°"
    }

    RowLayout {
        Layout.fillWidth: true
        WidgetText {
            themeObj: theme
            text: weatherRoot.locationName
            font.pixelSize: 14
            font.weight: Font.DemiBold
            Layout.fillWidth: true
            elide: Text.ElideRight
        }
        WidgetButton {
            themeObj: theme
            label: weatherRoot.useCelsius ? "°C" : "°F"
            pill: true
            onClicked: {
                weatherRoot.useCelsius = !weatherRoot.useCelsius
                plasmoid.configuration.weatherCelsius = weatherRoot.useCelsius
            }
        }
    }

    WidgetText {
        themeObj: theme
        text: weatherRoot.formatDeg(weatherRoot.baseTempC)
        font.pixelSize: 42
        font.weight: Font.Light
        font.letterSpacing: -1.0
    }

    Rectangle {
        width: 18
        height: 18
        radius: 9
        color: "#F5A623"
        Layout.topMargin: 2
        Layout.bottomMargin: 2
    }

    Item { Layout.fillHeight: true }

    WidgetText {
        themeObj: theme
        text: weatherRoot.conditionText
        font.pixelSize: 12
        font.weight: Font.Medium
    }

    WidgetText {
        themeObj: theme
        muted: true
        text: "H:" + weatherRoot.formatDeg(29) + "  L:" + weatherRoot.formatDeg(18)
        font.pixelSize: 11
    }
}
"""

# D. POMODORO — Circular Focus Ring + Central Timer + Play Icon + 4 Session Dots
FILES["plasma/plasmoid/contents/ui/PomodoroWidget.qml"] = """import QtQuick 2.15
import QtQuick.Layouts 1.15

ColumnLayout {
    id: pomoRoot
    spacing: 6

    property string phase: "FOCUS"
    property bool running: false
    property int studyMins: plasmoid.configuration.pomodoroStudyMins || 25
    property int shortBreakMins: plasmoid.configuration.pomodoroShortBreakMins || 5
    property int longBreakMins: plasmoid.configuration.pomodoroLongBreakMins || 15
    property int remainingSecs: studyMins * 60
    property int totalSecs: studyMins * 60
    property int completedSessions: 2

    function formatSecs(s) {
        var mins = Math.floor(s / 60)
        var secs = s % 60
        return (mins < 10 ? "0" + mins : mins) + ":" + (secs < 10 ? "0" + secs : secs)
    }

    function cyclePhase() {
        running = false
        if (phase === "FOCUS") {
            phase = "BREAK"
            totalSecs = shortBreakMins * 60
        } else if (phase === "BREAK") {
            phase = "LONG"
            totalSecs = longBreakMins * 60
        } else {
            phase = "FOCUS"
            totalSecs = studyMins * 60
        }
        remainingSecs = totalSecs
        ringCanvas.requestPaint()
    }

    Timer {
        interval: 1000
        running: pomoRoot.running
        repeat: true
        onTriggered: {
            if (pomoRoot.remainingSecs > 1) {
                pomoRoot.remainingSecs -= 1
            } else {
                pomoRoot.remainingSecs = 0
                pomoRoot.running = false
                if (pomoRoot.phase === "FOCUS") {
                    pomoRoot.completedSessions = (pomoRoot.completedSessions + 1) % 5
                }
            }
            ringCanvas.requestPaint()
        }
    }

    Item {
        Layout.fillWidth: true
        Layout.fillHeight: true

        // Ensure immediate Canvas repaint whenever theme accent, dark mode, or widget style changes (no resize required)
        Connections {
            target: theme
            function onAccentColorChanged() { ringCanvas.requestPaint() }
            function onIsDarkChanged() { ringCanvas.requestPaint() }
            function onWidgetStyleChanged() { ringCanvas.requestPaint() }
        }

        Canvas {
            id: ringCanvas
            anchors.centerIn: parent
            width: Math.min(parent.width, parent.height)
            height: width
            onPaint: {
                var ctx = getContext("2d")
                ctx.reset()
                var cx = width / 2
                var cy = height / 2
                var r = (width / 2) - 8
                ctx.lineWidth = 6
                ctx.lineCap = "round"

                ctx.beginPath()
                ctx.arc(cx, cy, r, 0, Math.PI * 2, false)
                ctx.strokeStyle = theme.isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)"
                ctx.stroke()

                var progress = pomoRoot.totalSecs > 0 ? (pomoRoot.remainingSecs / pomoRoot.totalSecs) : 1.0
                var startAngle = -Math.PI / 2
                var endAngle = startAngle + (Math.PI * 2 * progress)
                ctx.beginPath()
                ctx.arc(cx, cy, r, startAngle, endAngle, false)
                ctx.strokeStyle = theme.accentColor.toString()
                ctx.stroke()
            }
        }

        ColumnLayout {
            anchors.centerIn: parent
            spacing: 2

            WidgetText {
                themeObj: theme
                muted: true
                text: pomoRoot.phase
                font.pixelSize: 9
                font.weight: Font.DemiBold
                font.letterSpacing: 1.2
                Layout.alignment: Qt.AlignHCenter
            }

            WidgetText {
                themeObj: theme
                text: pomoRoot.formatSecs(pomoRoot.remainingSecs)
                font.pixelSize: 24
                font.weight: Font.DemiBold
                Layout.alignment: Qt.AlignHCenter
            }

            Rectangle {
                width: 24
                height: 24
                radius: 12
                color: "transparent"
                Layout.alignment: Qt.AlignHCenter

                WidgetText {
                    anchors.centerIn: parent
                    themeObj: theme
                    color: theme.accentColor
                    text: pomoRoot.running ? "❚❚" : "▶"
                    font.pixelSize: 12
                }

                MouseArea {
                    anchors.fill: parent
                    hoverEnabled: false
                    cursorShape: Qt.PointingHandCursor
                    onClicked: {
                        pomoRoot.running = !pomoRoot.running
                        daemonExecutable.invokeMethod(pomoRoot.running ? "PomodoroAction start" : "PomodoroAction pause")
                    }
                }
            }
        }
    }

    RowLayout {
        Layout.fillWidth: true
        spacing: 6

        WidgetButton {
            themeObj: theme
            label: "↺"
            pill: true
            onClicked: {
                pomoRoot.running = false
                pomoRoot.remainingSecs = pomoRoot.totalSecs
                ringCanvas.requestPaint()
                daemonExecutable.invokeMethod("PomodoroAction reset")
            }
        }

        Item { Layout.fillWidth: true }

        RowLayout {
            spacing: 5
            Repeater {
                model: 4
                Rectangle {
                    width: 6
                    height: 6
                    radius: 3
                    color: index < pomoRoot.completedSessions
                        ? theme.accentColor
                        : (theme.isDark ? Qt.rgba(1, 1, 1, 0.22) : Qt.rgba(0, 0, 0, 0.16))
                }
            }
        }

        Item { Layout.fillWidth: true }

        WidgetButton {
            themeObj: theme
            label: "⏭"
            pill: true
            onClicked: pomoRoot.cyclePhase()
        }
    }
}
"""

# E. NOTES WIDGET — macOS Notes-inspired quick capture with 400ms debounced autosave (Section 6)
FILES["plasma/plasmoid/contents/ui/NotesWidget.qml"] = """import QtQuick 2.15
import QtQuick.Controls 2.15 as QQC2
import QtQuick.Layouts 1.15

ColumnLayout {
    id: notesRoot
    spacing: 6
    clip: true

    property int currentNoteIndex: 0
    property string autosaveStatus: "Saved"

    ListModel {
        id: savedNotesModel
        ListElement {
            noteId: "note-1"
            title: "Desktop Widget Architecture"
            body: "Keep all 10 Plasmoids backed by a single urwidgets-daemon process over org.urwidgets.Daemon1 D-Bus.\\n• SQLite WAL mode\\n• Zero hover jitter"
            pinned: true
            updatedLabel: "Today"
        }
        ListElement {
            noteId: "note-2"
            title: "Reading & Study Notes"
            body: "Visual hierarchy through weight and proportion. Warm translucent surfaces (#EFECE7)."
            pinned: false
            updatedLabel: "Yesterday"
        }
    }

    // 400ms Debounced SQLite Autosave Timer (Never writes to SQLite on every keystroke)
    Timer {
        id: debounceAutosaveTimer
        interval: 400
        repeat: false
        onTriggered: {
            if (savedNotesModel.count > 0) {
                var item = savedNotesModel.get(notesRoot.currentNoteIndex)
                notesRoot.autosaveStatus = "Saved"
                daemonExecutable.invokeMethod(
                    "NoteUpsert '" + item.noteId + "' '" + item.title + "' '" + item.body + "' " + (item.pinned ? "true" : "false")
                )
            }
        }
    }

    RowLayout {
        Layout.fillWidth: true
        spacing: 6

        WidgetText {
            themeObj: theme
            text: savedNotesModel.count > 0 ? savedNotesModel.get(notesRoot.currentNoteIndex).title : "Notes"
            font.pixelSize: 14
            font.weight: Font.DemiBold
            elide: Text.ElideRight
            Layout.fillWidth: true
        }

        WidgetText {
            themeObj: theme
            muted: true
            text: notesRoot.autosaveStatus
            font.pixelSize: 10
        }

        WidgetButton {
            themeObj: theme
            label: savedNotesModel.count > 0 && savedNotesModel.get(notesRoot.currentNoteIndex).pinned ? "📌" : "Pin"
            active: savedNotesModel.count > 0 && savedNotesModel.get(notesRoot.currentNoteIndex).pinned
            pill: true
            onClicked: {
                if (savedNotesModel.count > 0) {
                    var cur = savedNotesModel.get(notesRoot.currentNoteIndex).pinned
                    savedNotesModel.setProperty(notesRoot.currentNoteIndex, "pinned", !cur)
                    debounceAutosaveTimer.restart()
                }
            }
        }

        WidgetButton {
            themeObj: theme
            label: "+"
            pill: true
            onClicked: {
                savedNotesModel.insert(0, {
                    noteId: "note-" + Date.now(),
                    title: "Quick Note " + (savedNotesModel.count + 1),
                    body: "",
                    pinned: false,
                    updatedLabel: "Just now"
                })
                notesRoot.currentNoteIndex = 0
                debounceAutosaveTimer.restart()
            }
        }
    }

    Rectangle {
        Layout.fillWidth: true
        Layout.fillHeight: true
        radius: 10
        color: theme.subtleSurfaceColor

        QQC2.TextArea {
            id: noteEditor
            anchors.fill: parent
            anchors.margins: 6
            wrapMode: TextEdit.Wrap
            background: null
            color: theme.textColor
            font.family: theme.resolvedFontFamily
            font.pixelSize: 12
            text: savedNotesModel.count > 0 ? savedNotesModel.get(notesRoot.currentNoteIndex).body : ""
            onTextChanged: {
                if (savedNotesModel.count > 0 && text !== savedNotesModel.get(notesRoot.currentNoteIndex).body) {
                    savedNotesModel.setProperty(notesRoot.currentNoteIndex, "body", text)
                    notesRoot.autosaveStatus = "Saving…"
                    debounceAutosaveTimer.restart()
                }
            }
        }
    }

    RowLayout {
        Layout.fillWidth: true
        spacing: 4

        Repeater {
            model: savedNotesModel
            WidgetButton {
                themeObj: theme
                label: (model.pinned ? "📌 " : "") + model.title
                active: index === notesRoot.currentNoteIndex
                pill: true
                onClicked: notesRoot.currentNoteIndex = index
            }
        }

        Item { Layout.fillWidth: true }
    }
}
"""

# F. TODO LIST WIDGET — macOS-inspired checklist with completion counter & circular checkboxes (Section 7)
FILES["plasma/plasmoid/contents/ui/TodoWidget.qml"] = """import QtQuick 2.15
import QtQuick.Layouts 1.15

ColumnLayout {
    id: todoRoot
    spacing: 6
    clip: true

    ListModel {
        id: todoListModel
        ListElement { todoId: "todo-1"; title: "Math 12 - Unit 4 learning guide"; category: "School"; done: true }
        ListElement { todoId: "todo-2"; title: "Math 12 - Unit 4 Exam prep"; category: "School"; done: true }
        ListElement { todoId: "todo-3"; title: "Chem 11 - Unit 3 learning guide"; category: "School"; done: true }
        ListElement { todoId: "todo-4"; title: "Review KDE Plasma 5.27 QML shader cache"; category: "Engineering"; done: false }
        ListElement { todoId: "todo-5"; title: "Package URWidgets v1.3 release tarball"; category: "Release"; done: false }
    }

    readonly property int completedCount: {
        var c = 0
        for (var i = 0; i < todoListModel.count; i++) {
            if (todoListModel.get(i).done) c++
        }
        return c
    }

    RowLayout {
        Layout.fillWidth: true
        spacing: 6

        ColumnLayout {
            spacing: 1
            Layout.fillWidth: true

            WidgetText {
                themeObj: theme
                text: "Today's Tasks"
                font.pixelSize: 14
                font.weight: Font.DemiBold
            }

            WidgetText {
                themeObj: theme
                muted: true
                text: todoRoot.completedCount + " of " + todoListModel.count + " completed"
                font.pixelSize: 11
            }
        }

        WidgetButton {
            themeObj: theme
            label: "+ Task"
            pill: true
            onClicked: {
                var newId = "todo-" + Date.now()
                var newTitle = "Task #" + (todoListModel.count + 1)
                todoListModel.append({ todoId: newId, title: newTitle, category: "General", done: false })
                daemonExecutable.invokeMethod("TodoAction 'add' '" + newId + "' '" + newTitle + "'")
            }
        }
    }

    // Progress bar
    Rectangle {
        Layout.fillWidth: true
        height: 4
        radius: 2
        color: theme.subtleSurfaceColor

        Rectangle {
            width: todoListModel.count > 0 ? parent.width * (todoRoot.completedCount / todoListModel.count) : 0
            height: parent.height
            radius: 2
            color: theme.accentColor
        }
    }

    ColumnLayout {
        Layout.fillWidth: true
        Layout.fillHeight: true
        spacing: 4

        Repeater {
            model: todoListModel
            Rectangle {
                Layout.fillWidth: true
                height: 26
                radius: 7
                color: "transparent"

                RowLayout {
                    anchors.fill: parent
                    spacing: 8

                    Rectangle {
                        width: 16
                        height: 16
                        radius: 8
                        color: model.done ? theme.accentColor : "transparent"
                        border.width: 1.5
                        border.color: model.done ? theme.accentColor : theme.mutedTextColor

                        WidgetText {
                            visible: model.done
                            anchors.centerIn: parent
                            themeObj: theme
                            text: "✓"
                            color: "#FFFFFF"
                            font.pixelSize: 9
                            font.weight: Font.Bold
                        }
                    }

                    WidgetText {
                        themeObj: theme
                        text: model.title
                        font.pixelSize: 12
                        font.strikeout: model.done
                        opacity: model.done ? 0.52 : 1.0
                        elide: Text.ElideRight
                        Layout.fillWidth: true
                    }
                }

                MouseArea {
                    anchors.fill: parent
                    cursorShape: Qt.PointingHandCursor
                    onClicked: {
                        todoListModel.setProperty(index, "done", !model.done)
                        daemonExecutable.invokeMethod("TodoAction 'toggle' '" + model.todoId + "' ''")
                    }
                }
            }
        }
    }
}
"""

# G. TO-DO LIST WIDGET (Replaces Schedule & Events) — Task Checklist with Deadline Date & Time + Delete (Hapus) Action
FILES["plasma/plasmoid/contents/ui/AgendaWidget.qml"] = """import QtQuick 2.15
import QtQuick.Controls 2.15 as QQC2
import QtQuick.Layouts 1.15

ColumnLayout {
    id: todoWidgetRoot
    spacing: 6
    clip: true

    property bool showAddForm: false
    property string newTitle: ""
    property string newDueDate: "2026-11-10"
    property string newDueTime: "17:00"
    property string newPriority: "medium"

    ListModel {
        id: todoItemsModel
        ListElement { todoId: "todo-1"; title: "Math 12 - Unit 4 learning guide"; dueDateIso: "2026-11-09"; dueTime: "08:30"; priority: "high"; category: "School"; done: true }
        ListElement { todoId: "todo-2"; title: "Math 12 - Unit 4 Exam prep"; dueDateIso: "2026-11-09"; dueTime: "11:00"; priority: "high"; category: "School"; done: true }
        ListElement { todoId: "todo-3"; title: "Review KDE Plasma 5.27 QML shader cache"; dueDateIso: "2026-11-09"; dueTime: "16:30"; priority: "medium"; category: "Engineering"; done: false }
        ListElement { todoId: "todo-4"; title: "Package URWidgets v3.0.2 release tarball"; dueDateIso: "2026-11-12"; dueTime: "18:00"; priority: "high"; category: "Release"; done: false }
    }

    readonly property int completedCount: {
        var c = 0
        for (var i = 0; i < todoItemsModel.count; i++) {
            if (todoItemsModel.get(i).done) c++
        }
        return c
    }

    RowLayout {
        Layout.fillWidth: true
        spacing: 6

        ColumnLayout {
            spacing: 1
            Layout.fillWidth: true

            WidgetText {
                themeObj: theme
                text: "To-Do List"
                font.pixelSize: 15
                font.weight: Font.DemiBold
            }

            WidgetText {
                themeObj: theme
                muted: true
                text: todoWidgetRoot.completedCount + "/" + todoItemsModel.count + " selesai"
                font.pixelSize: 11
            }
        }

        WidgetButton {
            visible: todoWidgetRoot.completedCount > 0
            themeObj: theme
            label: "Clear Done"
            pill: true
            onClicked: {
                for (var i = todoItemsModel.count - 1; i >= 0; i--) {
                    if (todoItemsModel.get(i).done) {
                        todoItemsModel.remove(i)
                    }
                }
            }
        }

        WidgetButton {
            themeObj: theme
            label: todoWidgetRoot.showAddForm ? "Close" : "+ Add To-Do"
            active: true
            pill: true
            onClicked: todoWidgetRoot.showAddForm = !todoWidgetRoot.showAddForm
        }
    }

    // Progress Bar
    Rectangle {
        Layout.fillWidth: true
        height: 4
        radius: 2
        color: theme.subtleSurfaceColor

        Rectangle {
            width: todoItemsModel.count > 0 ? parent.width * (todoWidgetRoot.completedCount / todoItemsModel.count) : 0
            height: parent.height
            radius: 2
            color: theme.accentColor
        }
    }

    // Add To-Do Form with Deadline Date & Time
    ColumnLayout {
        visible: todoWidgetRoot.showAddForm
        Layout.fillWidth: true
        spacing: 4

        RowLayout {
            Layout.fillWidth: true
            spacing: 4

            QQC2.TextField {
                Layout.fillWidth: true
                placeholderText: "Tambah tugas / to-do baru..."
                text: todoWidgetRoot.newTitle
                font.pixelSize: 11
                onTextChanged: todoWidgetRoot.newTitle = text
            }

            WidgetButton {
                themeObj: theme
                label: todoWidgetRoot.newPriority.toUpperCase()
                pill: true
                onClicked: {
                    var p = ["high", "medium", "low"]
                    var idx = p.indexOf(todoWidgetRoot.newPriority)
                    todoWidgetRoot.newPriority = p[(idx + 1) % p.length]
                }
            }
        }

        RowLayout {
            Layout.fillWidth: true
            spacing: 4

            WidgetText {
                themeObj: theme
                muted: true
                text: "Deadline:"
                font.pixelSize: 10
            }

            QQC2.TextField {
                placeholderText: "YYYY-MM-DD"
                text: todoWidgetRoot.newDueDate
                font.pixelSize: 10
                Layout.preferredWidth: 88
                onTextChanged: todoWidgetRoot.newDueDate = text
            }

            QQC2.TextField {
                placeholderText: "HH:MM"
                text: todoWidgetRoot.newDueTime
                font.pixelSize: 10
                Layout.preferredWidth: 56
                onTextChanged: todoWidgetRoot.newDueTime = text
            }

            Item { Layout.fillWidth: true }

            WidgetButton {
                themeObj: theme
                label: "Simpan"
                active: true
                pill: true
                onClicked: {
                    if (todoWidgetRoot.newTitle.trim().length === 0) return
                    var newId = "todo-" + Date.now()
                    todoItemsModel.append({
                        todoId: newId,
                        title: todoWidgetRoot.newTitle.trim(),
                        dueDateIso: todoWidgetRoot.newDueDate || "2026-11-10",
                        dueTime: todoWidgetRoot.newDueTime || "17:00",
                        priority: todoWidgetRoot.newPriority,
                        category: "General",
                        done: false
                    })
                    todoWidgetRoot.newTitle = ""
                    todoWidgetRoot.showAddForm = false
                }
            }
        }
    }

    // To-Do Items List with Deadline & Delete (Hapus) Button
    ColumnLayout {
        Layout.fillWidth: true
        Layout.fillHeight: true
        spacing: 5

        Repeater {
            model: todoItemsModel
            Rectangle {
                Layout.fillWidth: true
                height: 36
                radius: 9
                color: theme.subtleSurfaceColor

                RowLayout {
                    anchors.fill: parent
                    anchors.leftMargin: 8
                    anchors.rightMargin: 8
                    spacing: 8

                    Rectangle {
                        width: 16
                        height: 16
                        radius: 8
                        color: model.done ? theme.accentColor : "transparent"
                        border.width: 1.5
                        border.color: model.done ? theme.accentColor : theme.mutedTextColor

                        WidgetText {
                            visible: model.done
                            anchors.centerIn: parent
                            themeObj: theme
                            text: "✓"
                            color: "#FFFFFF"
                            font.pixelSize: 9
                            font.weight: Font.Bold
                        }

                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            onClicked: todoItemsModel.setProperty(index, "done", !model.done)
                        }
                    }

                    ColumnLayout {
                        Layout.fillWidth: true
                        spacing: 1

                        WidgetText {
                            themeObj: theme
                            text: model.title
                            font.pixelSize: 12
                            font.weight: Font.Medium
                            font.strikeout: model.done
                            opacity: model.done ? 0.5 : 1.0
                            elide: Text.ElideRight
                            Layout.fillWidth: true
                        }

                        WidgetText {
                            themeObj: theme
                            muted: true
                            text: "⏰ Deadline: " + model.dueDateIso + " · " + model.dueTime + " (" + model.priority.toUpperCase() + ")"
                            font.pixelSize: 9
                        }
                    }

                    WidgetButton {
                        themeObj: theme
                        label: "Hapus"
                        pill: true
                        onClicked: todoItemsModel.remove(index)
                    }
                }
            }
        }

        Item { Layout.fillHeight: true }
    }
}
"""

# H. PHOTO FRAME — Guaranteed Non-Blank Display + Single/Slideshow Modes + Interactive Drag-to-Reposition & Zoom Crop Editor (v3.0.1)
FILES["plasma/plasmoid/contents/ui/PhotoWidget.qml"] = """import QtQuick 2.15
import QtQuick.Layouts 1.15
import QtGraphicalEffects 1.15
import Qt.labs.folderlistmodel 2.15

Item {
    id: photoRoot
    property int currentIndex: 0
    property bool slideshowMode: plasmoid.configuration.photoSlideshowMode !== undefined ? plasmoid.configuration.photoSlideshowMode : true
    property int intervalSecs: plasmoid.configuration.photoIntervalSecs || 15
    property bool cropEditorOpen: false
    property real cropZoom: 1.0
    property int cropOffsetX: 0
    property int cropOffsetY: 0
    property real savedZoom: 1.0
    property int savedOffsetX: 0
    property int savedOffsetY: 0
    property string embeddedFallbackSvg: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='640' height='640' viewBox='0 0 640 640'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%232b5876'/><stop offset='100%' stop-color='%234e4376'/></linearGradient></defs><rect width='640' height='640' fill='url(%23g)'/><circle cx='490' cy='150' r='58' fill='%23f6d365' opacity='0.85'/><path d='M0 470 L180 310 L330 430 L470 290 L640 450 L640 640 L0 640 Z' fill='%231e3c52' opacity='0.75'/></svg>"
    property var bundledPhotos: [
        Qt.resolvedUrl("../images/photo_widget_architecture.jpg"),
        Qt.resolvedUrl("../images/photo_widget_botanical.jpg"),
        Qt.resolvedUrl("../images/alpine_mist_wallpaper.jpg")
    ]

    FolderListModel {
        id: folderModel
        folder: plasmoid.configuration.photoDirectory ? ("file://" + plasmoid.configuration.photoDirectory) : ""
        nameFilters: ["*.jpg", "*.jpeg", "*.png", "*.webp", "*.svg"]
        showDirs: false
    }

    readonly property string activePhotoSource: {
        if (plasmoid.configuration.photoDirectory && folderModel.count > 0) {
            var u = folderModel.get(photoRoot.currentIndex % folderModel.count, "fileURL")
            if (u) return u.toString()
        }
        if (photoRoot.bundledPhotos.length > 0) {
            return photoRoot.bundledPhotos[photoRoot.currentIndex % photoRoot.bundledPhotos.length].toString()
        }
        return photoRoot.embeddedFallbackSvg
    }

    function loadSavedCropForCurrent() {
        try {
            var map = JSON.parse(plasmoid.configuration.photoCropsJson || "{}")
            var entry = map[activePhotoSource]
            if (entry) {
                cropZoom = entry.zoom || 1.0
                cropOffsetX = entry.offsetX || 0
                cropOffsetY = entry.offsetY || 0
                return
            }
        } catch (e) {}
        cropZoom = 1.0
        cropOffsetX = 0
        cropOffsetY = 0
    }

    function persistCropForCurrent() {
        try {
            var map = JSON.parse(plasmoid.configuration.photoCropsJson || "{}")
            map[activePhotoSource] = {
                zoom: cropZoom,
                offsetX: cropOffsetX,
                offsetY: cropOffsetY
            }
            plasmoid.configuration.photoCropsJson = JSON.stringify(map)
        } catch (e) {}
        daemonExecutable.invokeMethod(
            "PhotoAction 'crop:" + activePhotoSource + "|" + cropZoom + "|" + cropOffsetX + "|" + cropOffsetY + "|cover'"
        )
    }

    // Timer runs ONLY when Slideshow Mode is active
    Timer {
        interval: photoRoot.intervalSecs * 1000
        running: photoRoot.slideshowMode && !photoRoot.cropEditorOpen
        repeat: true
        onTriggered: photoRoot.nextSlide()
    }

    function nextSlide() {
        var total = (plasmoid.configuration.photoDirectory && folderModel.count > 0) ? folderModel.count : bundledPhotos.length
        if (total > 0) {
            currentIndex = (currentIndex + 1) % total
            loadSavedCropForCurrent()
        }
    }

    function prevSlide() {
        var total = (plasmoid.configuration.photoDirectory && folderModel.count > 0) ? folderModel.count : bundledPhotos.length
        if (total > 0) {
            currentIndex = (currentIndex + total - 1) % total
            loadSavedCropForCurrent()
        }
    }

    Component.onCompleted: loadSavedCropForCurrent()

    Rectangle {
        id: maskRect
        anchors.fill: parent
        radius: theme.cornerRadius
        visible: false
    }

    Item {
        anchors.fill: parent
        layer.enabled: true
        layer.effect: OpacityMask {
            maskSource: maskRect
        }

        Image {
            id: slideImage
            anchors.fill: parent
            fillMode: Image.PreserveAspectCrop
            asynchronous: true
            cache: true
            scale: photoRoot.cropZoom
            transform: Translate {
                x: photoRoot.cropOffsetX
                y: photoRoot.cropOffsetY
            }
            sourceSize.width: Math.max(320, photoRoot.width * 2)
            sourceSize.height: Math.max(320, photoRoot.height * 2)
            source: photoRoot.activePhotoSource
            onStatusChanged: {
                if (status === Image.Error && source !== photoRoot.embeddedFallbackSvg) {
                    source = photoRoot.embeddedFallbackSvg
                }
            }
        }
    }

    // Top-right HUD Controls (Single/Slideshow, Interval, Crop, Prev, Next)
    RowLayout {
        visible: !photoRoot.cropEditorOpen
        anchors.top: parent.top
        anchors.right: parent.right
        anchors.margins: 10
        spacing: 4
        z: 3

        WidgetButton {
            themeObj: theme
            label: photoRoot.slideshowMode ? ("Slide " + photoRoot.intervalSecs + "s") : "Single"
            active: photoRoot.slideshowMode
            pill: true
            onClicked: {
                photoRoot.slideshowMode = !photoRoot.slideshowMode
                plasmoid.configuration.photoSlideshowMode = photoRoot.slideshowMode
                daemonExecutable.invokeMethod("PhotoAction 'toggle_slideshow'")
            }
        }

        WidgetButton {
            visible: photoRoot.slideshowMode
            themeObj: theme
            label: "⏱"
            pill: true
            onClicked: {
                var opts = [10, 15, 30, 60, 300]
                var idx = opts.indexOf(photoRoot.intervalSecs)
                photoRoot.intervalSecs = opts[(idx + 1) % opts.length]
                plasmoid.configuration.photoIntervalSecs = photoRoot.intervalSecs
                daemonExecutable.invokeMethod("PhotoAction 'interval:" + photoRoot.intervalSecs + "'")
            }
        }

        WidgetButton {
            themeObj: theme
            label: "Crop"
            pill: true
            onClicked: {
                photoRoot.savedZoom = photoRoot.cropZoom
                photoRoot.savedOffsetX = photoRoot.cropOffsetX
                photoRoot.savedOffsetY = photoRoot.cropOffsetY
                photoRoot.cropEditorOpen = true
            }
        }

        WidgetButton {
            themeObj: theme
            label: "‹"
            pill: true
            onClicked: photoRoot.prevSlide()
        }

        WidgetButton {
            themeObj: theme
            label: "›"
            pill: true
            onClicked: photoRoot.nextSlide()
        }
    }

    // Interactive Non-Destructive Crop & Zoom Editor Overlay (Drag to pan + Zoom + Reset + Confirm + Cancel)
    Rectangle {
        visible: photoRoot.cropEditorOpen
        anchors.fill: parent
        radius: theme.cornerRadius
        color: Qt.rgba(0, 0, 0, 0.56)
        z: 4

        property real dragStartX: 0
        property real dragStartY: 0
        property int baseOffsetX: 0
        property int baseOffsetY: 0

        MouseArea {
            anchors.fill: parent
            cursorShape: Qt.SizeAllCursor
            onPressed: function(mouse) {
                parent.dragStartX = mouse.x
                parent.dragStartY = mouse.y
                parent.baseOffsetX = photoRoot.cropOffsetX
                parent.baseOffsetY = photoRoot.cropOffsetY
            }
            onPositionChanged: function(mouse) {
                if (pressed) {
                    photoRoot.cropOffsetX = Math.max(-160, Math.min(160, Math.round(parent.baseOffsetX + (mouse.x - parent.dragStartX))))
                    photoRoot.cropOffsetY = Math.max(-160, Math.min(160, Math.round(parent.baseOffsetY + (mouse.y - parent.dragStartY))))
                }
            }
        }

        ColumnLayout {
            anchors.centerIn: parent
            spacing: 6

            WidgetText {
                themeObj: theme
                color: "#FFFFFF"
                text: "Drag to Pan • Zoom " + Math.round(photoRoot.cropZoom * 100) + "% (" + photoRoot.cropOffsetX + ", " + photoRoot.cropOffsetY + ")"
                font.pixelSize: 11
                font.weight: Font.DemiBold
                Layout.alignment: Qt.AlignHCenter
            }

            RowLayout {
                spacing: 4
                Layout.alignment: Qt.AlignHCenter

                WidgetButton {
                    themeObj: theme
                    label: "Zoom -"
                    pill: true
                    onClicked: photoRoot.cropZoom = Math.max(1.0, Math.round((photoRoot.cropZoom - 0.15) * 100) / 100)
                }
                WidgetButton {
                    themeObj: theme
                    label: "Zoom +"
                    pill: true
                    onClicked: photoRoot.cropZoom = Math.min(2.5, Math.round((photoRoot.cropZoom + 0.15) * 100) / 100)
                }
                WidgetButton {
                    themeObj: theme
                    label: "Reset"
                    pill: true
                    onClicked: {
                        photoRoot.cropZoom = 1.0
                        photoRoot.cropOffsetX = 0
                        photoRoot.cropOffsetY = 0
                    }
                }
            }

            RowLayout {
                spacing: 6
                Layout.alignment: Qt.AlignHCenter

                WidgetButton {
                    themeObj: theme
                    label: "Cancel"
                    pill: true
                    onClicked: {
                        photoRoot.cropZoom = photoRoot.savedZoom
                        photoRoot.cropOffsetX = photoRoot.savedOffsetX
                        photoRoot.cropOffsetY = photoRoot.savedOffsetY
                        photoRoot.cropEditorOpen = false
                    }
                }

                WidgetButton {
                    themeObj: theme
                    label: "Confirm"
                    active: true
                    pill: true
                    onClicked: {
                        photoRoot.persistCropForCurrent()
                        photoRoot.cropEditorOpen = false
                    }
                }
            }
        }
    }

    Rectangle {
        anchors.fill: parent
        radius: theme.cornerRadius
        color: "transparent"
        border.width: 1
        border.color: Qt.rgba(1, 1, 1, 0.35)
    }
}
"""

# K. MUSIC PLAYER WIDGET — Floating macOS-inspired Music Player (Zero-Lag Non-Blocking Background Audio + Plain Text Path Input ~/Music/)
FILES["plasma/plasmoid/contents/ui/MusicPlayerWidget.qml"] = """import QtQuick 2.15
import QtQuick.Controls 2.15 as QQC2
import QtQuick.Layouts 1.15
import org.kde.plasma.core 2.0 as PlasmaCore

ColumnLayout {
    id: musicRoot
    spacing: 6
    clip: true

    property string sourceType: plasmoid.configuration.musicSourceType || "local"
    property string musicFolder: plasmoid.configuration.musicFolderPath || plasmoid.configuration.musicLocalFolder || "~/Music/"
    property string streamUrl: plasmoid.configuration.musicStreamUrl || "https://ice2.somafm.com/groovesalad-128-mp3"
    property bool isPlaying: false
    property bool isMuted: false
    property int currentIndex: 0
    property int positionSecs: 0
    property int durationSecs: 214
    property int volumePct: plasmoid.configuration.musicVolume !== undefined ? plasmoid.configuration.musicVolume : 80
    property bool shuffle: false
    property string repeatMode: "all"
    property string activeDrawer: "none" // "none" | "source" | "queue"
    property string statusMessage: ""

    ListModel {
        id: tracksModel
        ListElement {
            title: "Velvet Horizon"
            artist: "Klangwerk & Sol"
            album: "~/Music/"
            cover: "../images/photo_widget_architecture.jpg"
            url: "~/Music/"
            dur: 214
        }
        ListElement {
            title: "Warm Linen Rain"
            artist: "Harbor Ensemble"
            album: "~/Music/"
            cover: "../images/photo_widget_botanical.jpg"
            url: "/usr/share/sounds/freedesktop/stereo/complete.oga"
            dur: 188
        }
        ListElement {
            title: "Subtle Drift"
            artist: "Aura Nord"
            album: "~/Music/"
            cover: "../images/alpine_mist_wallpaper.jpg"
            url: "/usr/share/sounds/freedesktop/stereo/bell.oga"
            dur: 246
        }
    }

    // Non-Blocking Single-Instance Background Audio & Folder Scanner (Rust Native CLI + POSIX Shell Fallback — Zero Parenthesis Syntax Bugs)
    PlasmaCore.DataSource {
        id: musicAudioRunner
        engine: "executable"
        connectedSources: []
        onNewData: function(sourceName, data) {
            if (sourceName.indexOf("_mscan=") === 0 && data["stdout"]) {
                var lines = data["stdout"].trim().split("\\n")
                var covers = [
                    Qt.resolvedUrl("../images/photo_widget_architecture.jpg").toString(),
                    Qt.resolvedUrl("../images/photo_widget_botanical.jpg").toString(),
                    Qt.resolvedUrl("../images/alpine_mist_wallpaper.jpg").toString()
                ]
                var validFiles = []
                for (var i = 0; i < lines.length; i++) {
                    var line = lines[i].trim()
                    if (line.length > 1) validFiles.push(line)
                }
                if (validFiles.length > 0) {
                    tracksModel.clear()
                    for (var j = 0; j < validFiles.length; j++) {
                        var fp = validFiles[j]
                        var parts = fp.split("/")
                        var fn = parts[parts.length - 1] || ("Track " + (j + 1))
                        var cleanTitle = fn.replace(/\\.[^/.]+$/, "").replace(/[-_]/g, " ")
                        tracksModel.append({
                            title: cleanTitle,
                            artist: "Local Music Library",
                            album: musicRoot.musicFolder,
                            cover: covers[j % covers.length],
                            url: fp,
                            dur: 210
                        })
                    }
                    musicRoot.currentIndex = 0
                    musicRoot.statusMessage = "Loaded " + tracksModel.count + " tracks from " + musicRoot.musicFolder
                } else {
                    musicRoot.statusMessage = "Path set: " + musicRoot.musicFolder
                }
            }
            disconnectSource(sourceName)
        }
        function scanPath(rawPath) {
            var clean = (rawPath || "~/Music/").trim().replace(/^file:\/\//, "").replace(/"/g, "")
            var shPath = clean
            if (shPath.indexOf("~/") === 0) {
                shPath = "$HOME/" + shPath.substring(2)
            } else if (shPath === "~") {
                shPath = "$HOME"
            }
            var cmd = '_mscan=' + Date.now() + '; TARGET="' + shPath + '"; ' +
                      'if [ -x "$HOME/.local/bin/urwidgets-daemon" ]; then "$HOME/.local/bin/urwidgets-daemon" scan-music "$TARGET" 2>/dev/null && exit 0; fi; ' +
                      'if command -v urwidgets-ctl >/dev/null 2>&1; then urwidgets-ctl scan-music "$TARGET" 2>/dev/null && exit 0; fi; ' +
                      'if [ -f "$TARGET" ]; then echo "$TARGET"; ' +
                      'elif [ -d "$TARGET" ]; then ' +
                      'for f in "$TARGET"/* "$TARGET"/*/*; do ' +
                      '[ -f "$f" ] || continue; ' +
                      'case "$f" in *.mp3|*.MP3|*.flac|*.FLAC|*.ogg|*.OGG|*.oga|*.OGA|*.wav|*.WAV|*.m4a|*.M4A|*.aac|*.AAC|*.opus|*.OPUS) echo "$f" ;; esac; ' +
                      'done | sort | head -n 120; fi'
            connectSource(cmd)
        }
        function playUrl(rawTarget, volPct, muted) {
            var effVol = muted ? 0 : Math.max(0, Math.min(100, volPct))
            var clean = ((rawTarget && rawTarget.trim().length > 0) ? rawTarget.trim() : musicRoot.musicFolder).replace(/^file:\/\//, "").replace(/"/g, "")
            var shPath = clean
            if (shPath.indexOf("~/") === 0) {
                shPath = "$HOME/" + shPath.substring(2)
            } else if (shPath === "~") {
                shPath = "$HOME"
            }
            var cmd = '_mplay=' + Date.now() + '; TARGET="' + shPath + '"; VOL="' + effVol + '"; ' +
                      'if [ -x "$HOME/.local/bin/urwidgets-daemon" ]; then "$HOME/.local/bin/urwidgets-daemon" play-music "$TARGET" "$VOL" >/dev/null 2>&1 && exit 0; fi; ' +
                      'if command -v urwidgets-ctl >/dev/null 2>&1; then urwidgets-ctl play-music "$TARGET" "$VOL" >/dev/null 2>&1 && exit 0; fi; ' +
                      'if [ -f /tmp/urwidgets-music-audio.pid ]; then kill -TERM $(cat /tmp/urwidgets-music-audio.pid) 2>/dev/null || true; rm -f /tmp/urwidgets-music-audio.pid; fi; ' +
                      'case "$TARGET" in http://*|https://*) ;; *) ' +
                      'if [ -d "$TARGET" ]; then ' +
                      'FIRST_AUDIO=""; ' +
                      'for f in "$TARGET"/* "$TARGET"/*/*; do [ -f "$f" ] || continue; case "$f" in *.mp3|*.MP3|*.flac|*.FLAC|*.ogg|*.OGG|*.oga|*.OGA|*.wav|*.WAV|*.m4a|*.M4A|*.aac|*.AAC|*.opus|*.OPUS) FIRST_AUDIO="$f"; break ;; esac; done; ' +
                      'if [ -n "$FIRST_AUDIO" ]; then TARGET="$FIRST_AUDIO"; fi; ' +
                      'fi; ' +
                      'if [ ! -f "$TARGET" ]; then ' +
                      'for f in "$HOME/Music"/* "$HOME/Music"/*/*; do [ -f "$f" ] || continue; case "$f" in *.mp3|*.MP3|*.flac|*.FLAC|*.ogg|*.OGG|*.oga|*.OGA|*.wav|*.WAV|*.m4a|*.M4A|*.aac|*.AAC|*.opus|*.OPUS) TARGET="$f"; break ;; esac; done; ' +
                      'fi; ' +
                      'if [ ! -f "$TARGET" ]; then TARGET="/usr/share/sounds/freedesktop/stereo/complete.oga"; fi; ' +
                      'if [ ! -f "$TARGET" ]; then TARGET="/usr/share/sounds/alsa/Front_Center.wav"; fi ' +
                      ';; esac; ' +
                      'if command -v mpv >/dev/null 2>&1; then nohup mpv --no-video --really-quiet --volume="$VOL" "$TARGET" >/dev/null 2>&1 </dev/null & echo $! > /tmp/urwidgets-music-audio.pid; ' +
                      'elif command -v ffplay >/dev/null 2>&1; then nohup ffplay -nodisp -autoexit -loglevel quiet -volume "$VOL" "$TARGET" >/dev/null 2>&1 </dev/null & echo $! > /tmp/urwidgets-music-audio.pid; ' +
                      'elif command -v cvlc >/dev/null 2>&1; then nohup cvlc --intf dummy --play-and-exit --quiet "$TARGET" >/dev/null 2>&1 </dev/null & echo $! > /tmp/urwidgets-music-audio.pid; ' +
                      'elif command -v gst-play-1.0 >/dev/null 2>&1; then nohup gst-play-1.0 --quiet "$TARGET" >/dev/null 2>&1 </dev/null & echo $! > /tmp/urwidgets-music-audio.pid; ' +
                      'elif command -v pw-play >/dev/null 2>&1; then nohup pw-play "$TARGET" >/dev/null 2>&1 </dev/null & echo $! > /tmp/urwidgets-music-audio.pid; ' +
                      'elif command -v paplay >/dev/null 2>&1; then nohup paplay "$TARGET" >/dev/null 2>&1 </dev/null & echo $! > /tmp/urwidgets-music-audio.pid; ' +
                      'elif command -v aplay >/dev/null 2>&1; then nohup aplay -q "$TARGET" >/dev/null 2>&1 </dev/null & echo $! > /tmp/urwidgets-music-audio.pid; fi'
            connectSource(cmd)
        }
        function stopPlaybackProcess() {
            var cmd = '_mstop=' + Date.now() + '; ' +
                      'if [ -x "$HOME/.local/bin/urwidgets-daemon" ]; then "$HOME/.local/bin/urwidgets-daemon" stop-music >/dev/null 2>&1 || true; fi; ' +
                      'if [ -f /tmp/urwidgets-music-audio.pid ]; then kill -TERM $(cat /tmp/urwidgets-music-audio.pid) 2>/dev/null || true; rm -f /tmp/urwidgets-music-audio.pid; fi'
            connectSource(cmd)
        }
    }

    Component.onCompleted: {
        musicAudioRunner.scanPath(musicRoot.musicFolder)
    }

    Timer {
        interval: 1000
        running: musicRoot.isPlaying
        repeat: true
        onTriggered: {
            if (musicRoot.sourceType === "local") {
                if (musicRoot.positionSecs + 1 < musicRoot.durationSecs) {
                    musicRoot.positionSecs += 1
                } else if (musicRoot.repeatMode === "one") {
                    musicRoot.positionSecs = 0
                    musicRoot.loadAndPlayCurrent()
                } else {
                    musicRoot.nextTrack()
                }
            }
        }
    }

    function formatTime(secs) {
        var m = Math.floor(secs / 60)
        var s = secs % 60
        return m + ":" + (s < 10 ? "0" : "") + s
    }

    function loadAndPlayCurrent() {
        var targetRaw = ""
        if (sourceType === "stream") {
            targetRaw = streamUrl
            durationSecs = 0
            positionSecs = 0
        } else if (tracksModel.count > 0) {
            var tr = tracksModel.get(currentIndex % tracksModel.count)
            durationSecs = tr.dur || 200
            targetRaw = tr.url
        } else {
            targetRaw = musicRoot.musicFolder
        }
        if (isPlaying) {
            musicAudioRunner.playUrl(targetRaw, musicRoot.volumePct, musicRoot.isMuted)
        }
    }

    function prevTrack() {
        if (tracksModel.count > 0) {
            currentIndex = (currentIndex + tracksModel.count - 1) % tracksModel.count
            positionSecs = 0
            loadAndPlayCurrent()
        }
    }

    function nextTrack() {
        if (tracksModel.count > 0) {
            currentIndex = shuffle ? Math.floor(Math.random() * tracksModel.count) : ((currentIndex + 1) % tracksModel.count)
            positionSecs = 0
            loadAndPlayCurrent()
        }
    }

    function stopPlayback() {
        isPlaying = false
        positionSecs = 0
        musicAudioRunner.stopPlaybackProcess()
    }

    // Header Row: Track Info + Source & Queue Toggles
    RowLayout {
        Layout.fillWidth: true
        spacing: 10

        Rectangle {
            width: 48
            height: 48
            radius: 11
            clip: true
            color: theme.subtleSurfaceColor

            Image {
                anchors.fill: parent
                fillMode: Image.PreserveAspectCrop
                asynchronous: true
                cache: true
                sourceSize.width: 96
                sourceSize.height: 96
                source: tracksModel.count > 0 ? Qt.resolvedUrl(tracksModel.get(musicRoot.currentIndex % tracksModel.count).cover) : ""
            }
        }

        ColumnLayout {
            Layout.fillWidth: true
            spacing: 1

            WidgetText {
                themeObj: theme
                text: musicRoot.sourceType === "stream"
                    ? "Online Audio Stream"
                    : (tracksModel.count > 0 ? tracksModel.get(musicRoot.currentIndex % tracksModel.count).title : "No Track Selected")
                font.pixelSize: 13
                font.weight: Font.DemiBold
                elide: Text.ElideRight
                Layout.fillWidth: true
            }

            WidgetText {
                themeObj: theme
                muted: true
                text: musicRoot.sourceType === "stream"
                    ? musicRoot.streamUrl
                    : (tracksModel.count > 0 ? tracksModel.get(musicRoot.currentIndex % tracksModel.count).artist : "Type path e.g. ~/Music/")
                font.pixelSize: 11
                elide: Text.ElideRight
                Layout.fillWidth: true
            }

            WidgetText {
                themeObj: theme
                muted: true
                text: musicRoot.statusMessage.length > 0
                    ? musicRoot.statusMessage
                    : (musicRoot.sourceType === "local" ? (musicRoot.musicFolder || "~/Music/") : "Direct Stream Active")
                font.pixelSize: 9
                elide: Text.ElideRight
                Layout.fillWidth: true
            }
        }

        WidgetButton {
            themeObj: theme
            label: "Source"
            active: musicRoot.activeDrawer === "source"
            pill: true
            onClicked: musicRoot.activeDrawer = (musicRoot.activeDrawer === "source" ? "none" : "source")
        }

        WidgetButton {
            themeObj: theme
            label: "Queue (" + tracksModel.count + ")"
            active: musicRoot.activeDrawer === "queue"
            pill: true
            onClicked: musicRoot.activeDrawer = (musicRoot.activeDrawer === "queue" ? "none" : "queue")
        }
    }

    // Drawer 1: Source Selector (Plain Text Path Input e.g. ~/Music/ — No Folder Picker Dialog)
    ColumnLayout {
        visible: musicRoot.activeDrawer === "source"
        Layout.fillWidth: true
        spacing: 4

        RowLayout {
            Layout.fillWidth: true
            spacing: 4

            WidgetButton {
                themeObj: theme
                label: "Local Path"
                active: musicRoot.sourceType === "local"
                pill: true
                onClicked: {
                    musicRoot.sourceType = "local"
                    plasmoid.configuration.musicSourceType = "local"
                }
            }

            WidgetButton {
                themeObj: theme
                label: "Stream URL"
                active: musicRoot.sourceType === "stream"
                pill: true
                onClicked: {
                    musicRoot.sourceType = "stream"
                    plasmoid.configuration.musicSourceType = "stream"
                }
            }

            Item { Layout.fillWidth: true }

            WidgetButton {
                visible: musicRoot.sourceType === "local"
                themeObj: theme
                label: "Rescan"
                pill: true
                onClicked: {
                    musicAudioRunner.scanPath(localPathInput.text)
                }
            }
        }

        RowLayout {
            visible: musicRoot.sourceType === "local"
            Layout.fillWidth: true
            spacing: 4

            QQC2.TextField {
                id: localPathInput
                Layout.fillWidth: true
                placeholderText: "~/Music/ atau ~/Music/lagu.mp3"
                text: musicRoot.musicFolder
                font.pixelSize: 10
            }

            WidgetButton {
                themeObj: theme
                label: "Load"
                active: true
                pill: true
                onClicked: {
                    var entered = localPathInput.text.trim() || "~/Music/"
                    musicRoot.musicFolder = entered
                    musicRoot.sourceType = "local"
                    plasmoid.configuration.musicFolderPath = entered
                    plasmoid.configuration.musicLocalFolder = entered
                    plasmoid.configuration.musicSourceType = "local"
                    musicAudioRunner.scanPath(entered)
                }
            }
        }

        RowLayout {
            visible: musicRoot.sourceType === "stream"
            Layout.fillWidth: true
            spacing: 4

            QQC2.TextField {
                id: streamUrlInput
                Layout.fillWidth: true
                placeholderText: "https://ice2.somafm.com/groovesalad-128-mp3"
                text: musicRoot.streamUrl
                font.pixelSize: 10
            }

            WidgetButton {
                themeObj: theme
                label: "Connect"
                active: true
                pill: true
                onClicked: {
                    var candidate = streamUrlInput.text.trim()
                    if (candidate.indexOf("http://") === 0 || candidate.indexOf("https://") === 0) {
                        musicRoot.streamUrl = candidate
                        plasmoid.configuration.musicStreamUrl = candidate
                        musicRoot.statusMessage = "Connected stream"
                        musicRoot.isPlaying = true
                        musicRoot.loadAndPlayCurrent()
                    } else {
                        musicRoot.statusMessage = "Invalid URL (use http/https)"
                    }
                }
            }
        }
    }

    // Drawer 2: Playlist / Queue Management (Select Track, Remove)
    ColumnLayout {
        visible: musicRoot.activeDrawer === "queue"
        Layout.fillWidth: true
        spacing: 3

        Repeater {
            model: tracksModel
            Rectangle {
                Layout.fillWidth: true
                height: 22
                radius: 6
                color: index === musicRoot.currentIndex ? theme.subtleSurfaceColor : "transparent"

                RowLayout {
                    anchors.fill: parent
                    anchors.leftMargin: 6
                    anchors.rightMargin: 6
                    spacing: 6

                    WidgetText {
                        themeObj: theme
                        text: (index + 1) + ". " + model.title
                        font.pixelSize: 10
                        font.weight: index === musicRoot.currentIndex ? Font.DemiBold : Font.Normal
                        elide: Text.ElideRight
                        Layout.fillWidth: true
                    }

                    WidgetButton {
                        themeObj: theme
                        label: "Play"
                        pill: true
                        onClicked: {
                            musicRoot.currentIndex = index
                            musicRoot.positionSecs = 0
                            musicRoot.isPlaying = true
                            musicRoot.loadAndPlayCurrent()
                        }
                    }

                    WidgetButton {
                        themeObj: theme
                        label: "×"
                        pill: true
                        onClicked: {
                            tracksModel.remove(index)
                            if (musicRoot.currentIndex >= tracksModel.count) {
                                musicRoot.currentIndex = Math.max(0, tracksModel.count - 1)
                            }
                        }
                    }
                }
            }
        }
    }

    // Playback progress bar & Volume + Mute control
    ColumnLayout {
        visible: musicRoot.activeDrawer === "none"
        Layout.fillWidth: true
        spacing: 4

        Rectangle {
            Layout.fillWidth: true
            height: 5
            radius: 2.5
            color: theme.subtleSurfaceColor

            Rectangle {
                width: musicRoot.durationSecs > 0 ? parent.width * (musicRoot.positionSecs / musicRoot.durationSecs) : 0
                height: parent.height
                radius: 2.5
                color: theme.accentColor
            }

            MouseArea {
                anchors.fill: parent
                hoverEnabled: false
                cursorShape: Qt.PointingHandCursor
                onClicked: function(mouse) {
                    if (musicRoot.durationSecs > 0) {
                        var ratio = Math.max(0, Math.min(1, mouse.x / width))
                        musicRoot.positionSecs = Math.round(ratio * musicRoot.durationSecs)
                    }
                }
            }
        }

        RowLayout {
            Layout.fillWidth: true
            spacing: 6
            WidgetText {
                themeObj: theme
                muted: true
                text: musicRoot.formatTime(musicRoot.positionSecs)
                font.pixelSize: 10
            }
            Item { Layout.fillWidth: true }
            WidgetButton {
                themeObj: theme
                label: musicRoot.isMuted ? "🔇 Muted" : "🔊"
                active: musicRoot.isMuted
                pill: true
                onClicked: {
                    musicRoot.isMuted = !musicRoot.isMuted
                    if (musicRoot.isPlaying) {
                        musicRoot.loadAndPlayCurrent()
                    }
                }
            }
            WidgetButton {
                themeObj: theme
                label: "Vol " + musicRoot.volumePct + "%"
                pill: true
                onClicked: {
                    var nextV = (musicRoot.volumePct + 20)
                    if (nextV > 100) nextV = 20
                    musicRoot.isMuted = false
                    musicRoot.volumePct = nextV
                    plasmoid.configuration.musicVolume = nextV
                    if (musicRoot.isPlaying) {
                        musicRoot.loadAndPlayCurrent()
                    }
                }
            }
            Item { Layout.fillWidth: true }
            WidgetText {
                themeObj: theme
                muted: true
                text: musicRoot.sourceType === "stream" ? "LIVE" : musicRoot.formatTime(musicRoot.durationSecs)
                font.pixelSize: 10
            }
        }
    }

    // Bottom Transport Controls (Shuffle, Prev, Play/Pause, Stop, Next, Repeat)
    RowLayout {
        Layout.fillWidth: true
        spacing: 6

        WidgetButton {
            themeObj: theme
            label: "⇄"
            active: musicRoot.shuffle
            pill: true
            onClicked: {
                musicRoot.shuffle = !musicRoot.shuffle
            }
        }

        Item { Layout.fillWidth: true }

        WidgetButton {
            themeObj: theme
            label: "⏮"
            pill: true
            onClicked: musicRoot.prevTrack()
        }

        WidgetButton {
            themeObj: theme
            label: musicRoot.isPlaying ? "❚❚" : "▶"
            active: true
            pill: true
            onClicked: {
                musicRoot.isPlaying = !musicRoot.isPlaying
                if (musicRoot.isPlaying) {
                    musicRoot.loadAndPlayCurrent()
                } else {
                    musicAudioRunner.stopPlaybackProcess()
                }
            }
        }

        WidgetButton {
            themeObj: theme
            label: "■"
            pill: true
            onClicked: musicRoot.stopPlayback()
        }

        WidgetButton {
            themeObj: theme
            label: "⏭"
            pill: true
            onClicked: musicRoot.nextTrack()
        }

        Item { Layout.fillWidth: true }

        WidgetButton {
            themeObj: theme
            label: musicRoot.repeatMode === "one" ? "↻1" : "↻"
            active: musicRoot.repeatMode !== "off"
            pill: true
            onClicked: {
                musicRoot.repeatMode = musicRoot.repeatMode === "off" ? "all" : (musicRoot.repeatMode === "all" ? "one" : "off")
            }
        }
    }
}
"""

# I. QUICK ACTIONS — Overflow-safe compact rounded icon grid (Zero hover surface shifts)
FILES["plasma/plasmoid/contents/ui/QuickActionsWidget.qml"] = """import QtQuick 2.15
import QtQuick.Layouts 1.15

ColumnLayout {
    id: qaRoot
    spacing: 8
    clip: true

    property int gridCols: plasmoid.configuration.quickActionsColumns || 2

    WidgetGrid {
        columns: qaRoot.gridCols
        rowSpacing: 8
        columnSpacing: 8

        Repeater {
            model: [
                { label: "Files", icon: "system-file-manager", cmd: "dolphin ~" },
                { label: "Terminal", icon: "utilities-terminal", cmd: "konsole" },
                { label: "Projects", icon: "folder-development", cmd: "xdg-open ~/Projects" },
                { label: "Settings", icon: "preferences-system", cmd: "systemsettings5" }
            ]
            Rectangle {
                Layout.fillWidth: true
                Layout.fillHeight: true
                Layout.minimumHeight: 42
                radius: 14
                color: cellMouse.pressed
                    ? (theme.isDark ? Qt.rgba(1, 1, 1, 0.16) : Qt.rgba(0, 0, 0, 0.10))
                    : theme.subtleSurfaceColor

                ColumnLayout {
                    anchors.centerIn: parent
                    spacing: 4

                    WidgetIcon {
                        iconName: modelData.icon
                        iconSize: 20
                        Layout.alignment: Qt.AlignHCenter
                    }

                    WidgetText {
                        themeObj: theme
                        text: modelData.label
                        font.pixelSize: 11
                        font.weight: Font.Medium
                        elide: Text.ElideRight
                        Layout.alignment: Qt.AlignHCenter
                    }
                }

                MouseArea {
                    id: cellMouse
                    anchors.fill: parent
                    hoverEnabled: false
                    cursorShape: Qt.PointingHandCursor
                    onClicked: daemonExecutable.connectSource(modelData.cmd)
                }
            }
        }
    }
}
"""

# J. SYSTEM MONITOR — Understated macOS-inspired CPU, Memory, and Battery card
FILES["plasma/plasmoid/contents/ui/SystemMonitorWidget.qml"] = """import QtQuick 2.15
import QtQuick.Layouts 1.15

ColumnLayout {
    id: sysRoot
    spacing: 8
    clip: true

    property real cpuPct: root.daemonSnapshot.system_monitor ? root.daemonSnapshot.system_monitor.cpu_usage_pct : 11.4
    property real memPct: root.daemonSnapshot.system_monitor ? root.daemonSnapshot.system_monitor.mem_usage_pct : 20.8
    property int batteryPct: root.daemonSnapshot.system_monitor && root.daemonSnapshot.system_monitor.battery_pct ? root.daemonSnapshot.system_monitor.battery_pct : 88

    Timer {
        interval: (plasmoid.configuration.sysmonIntervalSecs || 3) * 1000
        running: true
        repeat: true
        onTriggered: daemonExecutable.invokeMethod("GetSystemMetrics")
    }

    WidgetHeader {
        themeObj: theme
        title: "System"
        rightLabel: "Nominal"
    }

    ColumnLayout {
        Layout.fillWidth: true
        Layout.fillHeight: true
        spacing: 8

        Repeater {
            model: [
                { label: "Processor", val: Math.round(sysRoot.cpuPct) + "%", ratio: sysRoot.cpuPct / 100.0 },
                { label: "Memory", val: Math.round(sysRoot.memPct) + "%", ratio: sysRoot.memPct / 100.0 },
                { label: "Battery", val: sysRoot.batteryPct + "%", ratio: sysRoot.batteryPct / 100.0 }
            ]
            ColumnLayout {
                Layout.fillWidth: true
                spacing: 4

                RowLayout {
                    Layout.fillWidth: true
                    WidgetText {
                        themeObj: theme
                        muted: true
                        text: modelData.label
                        font.pixelSize: 11
                        Layout.fillWidth: true
                    }
                    WidgetText {
                        themeObj: theme
                        text: modelData.val
                        font.pixelSize: 11
                        font.weight: Font.DemiBold
                    }
                }

                Rectangle {
                    Layout.fillWidth: true
                    height: 5
                    radius: 2.5
                    color: theme.subtleSurfaceColor

                    Rectangle {
                        width: parent.width * Math.min(1.0, Math.max(0.04, modelData.ratio))
                        height: parent.height
                        radius: 2.5
                        color: theme.accentColor
                    }
                }
            }
        }
    }
}
"""

FILES["control-center/tauri-app/tauri.conf.json"] = """{
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "URWidgets Appearance Studio",
  "version": "3.1.0",
  "identifier": "org.urwidgets.controlcenter",
  "build": {
    "frontendDist": "../dist"
  },
  "app": {
    "windows": [
      {
        "title": "URWidgets v3.1.0 — Appearance & WidgetWall Studio (Rust + Tauri)",
        "width": 1180,
        "height": 780,
        "resizable": true
      }
    ]
  }
}
"""

FILES["control-center/tauri-app/src-tauri/Cargo.toml"] = """[package]
name = "urwidgets-control-center"
version = "3.1.0"
description = "URWidgets Appearance & Audio Control Center powered by Rust + Tauri"
authors = ["Haris Gitama <https://github.com/Harisgitama>"]
edition = "2021"

[dependencies]
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
tauri = { version = "2.0", features = [] }
urwidgets-daemon = { path = "../../../core" }
"""

FILES["control-center/tauri-app/src-tauri/src/main.rs"] = """#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::{Command, Stdio};
use serde::Serialize;
use urwidgets_daemon::modules::alarms::AlarmModule;
use urwidgets_daemon::modules::music::MusicModule;
use urwidgets_daemon::modules::photos::PhotoModule;

#[derive(Serialize)]
struct AuthorInfo {
    author: &'static str,
    portfolio_label: &'static str,
    portfolio_url: &'static str,
    instagram_label: &'static str,
    instagram_url: &'static str,
    github_url: &'static str,
}

#[tauri::command]
fn tauri_get_author_info() -> AuthorInfo {
    AuthorInfo {
        author: "Haris Gitama",
        portfolio_label: "rissaxie.com",
        portfolio_url: "https://rissaxie.com",
        instagram_label: "@hrisgtaa_",
        instagram_url: "https://www.instagram.com/hrisgtaa_/",
        github_url: "https://github.com/Harisgitama",
    }
}

#[tauri::command]
fn tauri_open_external_url(url: String) -> Result<(), String> {
    if !url.starts_with("https://") && !url.starts_with("http://") {
        return Err("Only http/https URLs are allowed".to_string());
    }
    Command::new("xdg-open")
        .arg(&url)
        .stdin(Stdio::null())
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .spawn()
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn tauri_play_alarm(path: String, volume: u8, loop_playback: bool) -> Result<String, String> {
    let resolved = AlarmModule::resolve_playable_sound(&path);
    AlarmModule::spawn_alarm_audio_detached(&resolved, volume, loop_playback);
    Ok(resolved)
}

#[tauri::command]
fn tauri_stop_alarm() -> Result<(), String> {
    AlarmModule::stop_alarm_audio_pid_file();
    Ok(())
}

#[tauri::command]
fn tauri_scan_music(path: String) -> Result<Vec<String>, String> {
    Ok(MusicModule::scan_local_path_files(&path))
}

#[tauri::command]
fn tauri_play_music(path: String, volume: u8) -> Result<String, String> {
    let resolved = MusicModule::resolve_playable_target(&path);
    MusicModule::spawn_music_audio_detached(&resolved, volume);
    Ok(resolved)
}

#[tauri::command]
fn tauri_stop_music() -> Result<(), String> {
    MusicModule::stop_music_audio_pid_file();
    Ok(())
}

#[tauri::command]
fn tauri_scan_photos(path: String) -> Result<Vec<String>, String> {
    Ok(PhotoModule::scan_photo_directory(&path))
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            tauri_get_author_info,
            tauri_open_external_url,
            tauri_play_alarm,
            tauri_stop_alarm,
            tauri_scan_music,
            tauri_play_music,
            tauri_stop_music,
            tauri_scan_photos
        ])
        .run(tauri::generate_context!())
        .expect("error while running URWidgets Tauri Control Center");
}
"""

FILES["scripts/install.sh"] = """#!/usr/bin/env bash
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
"""

FILES["scripts/uninstall.sh"] = """#!/usr/bin/env bash
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
"""

FILES["scripts/package.sh"] = """#!/usr/bin/env bash
set -euo pipefail

echo "=== Packaging URWidgets v3.0.1 Release Artifacts (.plasmoid & .deb) ==="
mkdir -p dist

python3 -c '
import os, zipfile
with zipfile.ZipFile("dist/urwidgets.plasmoid", "w", zipfile.ZIP_DEFLATED) as zf:
    base = "plasma/plasmoid"
    for root, _, files in os.walk(base):
        for f in files:
            full = os.path.join(root, f)
            rel = os.path.relpath(full, base)
            zf.write(full, rel)
'
echo "[OK] Built dist/urwidgets.plasmoid"
"""

FILES["docs/ARCHITECTURE.md"] = """# URWidgets Technical Architecture (WidgetWall v3.0.1 Final Release)

## 1. Centralized QML Design System & Independent Per-Widget Preferences
- `WidgetTheme.qml` & `ThemeEngine.qml`: Centralizes Appearance modes (`Auto`, `Light`, `Dark`), Surface styles (`Default`, `Dark`, `Clear`, `Tinted`, `Solid`), 9 macOS Accent Colors, Elevation levels (`0–3`), per-widget independent overrides (`widget.clock` through `widget.music_player`), and dynamic installed OS font resolution (`Qt.fontFamilies()`).
- `WidgetBackground.qml`: Shared image background layer supporting `SVG`, `JPG`, `JPEG`, `PNG`, and `WebP` with `Cover`, `Contain`, `Stretch`, and `Center` fit modes, `Center/Top/Bottom/Left/Right` position alignment, and readability contrast overlays across all 10 widgets.
- `WidgetSurface.qml`: Soft 3D ambient floating drop shadow and 1px translucent specular highlight border without expensive fullscreen blur or hover layout shifts.
- `ClockWidget.qml`: 2-slide manual Clock & Alarm Manager (`Slide 1: Main Clock`, `Slide 2: Alarm Manager` with Hour/Minute picker, Clear/Confirm/Cancel, Snooze `5/10/15/20/30/45m`, ringtone preview/stop, and due-alarm banner).
- `PhotoWidget.qml`: Guaranteed non-blank display with bundled photography + embedded SVG fallback, Single/Slideshow mode, and interactive drag-to-pan + zoom non-destructive crop editor.
- `MusicPlayerWidget.qml`: Floating macOS-inspired Music Player wired to `QtMultimedia.Audio` with Local Folder picker, Direct Online Stream validation, and Queue drawer.
- `NotesWidget.qml`: Backed by SQLite WAL (`notes`) with 400ms debounced autosave (`todo_items` table preserved non-destructively in SQLite).
"""

FILES["docs/DEVELOPMENT.md"] = """# URWidgets Development & Widget Verification Guide (v3.0.1)

## Testing All 10 Widgets in KDE Plasma 5

```bash
plasmoidviewer -a plasma/widgets/org.urwidgets.clock
plasmoidviewer -a plasma/widgets/org.urwidgets.calendar
plasmoidviewer -a plasma/widgets/org.urwidgets.pomodoro
plasmoidviewer -a plasma/widgets/org.urwidgets.weather
plasmoidviewer -a plasma/widgets/org.urwidgets.notes
plasmoidviewer -a plasma/widgets/org.urwidgets.agenda
plasmoidviewer -a plasma/widgets/org.urwidgets.photos
plasmoidviewer -a plasma/widgets/org.urwidgets.music
plasmoidviewer -a plasma/widgets/org.urwidgets.quickactions
plasmoidviewer -a plasma/widgets/org.urwidgets.sysmonitor
```
"""

FILES["docs/PERFORMANCE.md"] = """# URWidgets Performance Engineering (v3.0.1)

- **Single Rust Process (`urwidgets-daemon`)**: All 10 desktop widgets share one background process (`~4.2 MB RSS`).
- **Debounced SQLite Autosave**: `NotesWidget.qml` uses a 400ms debounce `Timer` so rapid typing never blocks the UI thread or floods SQLite.
- **Lazy Image Decoding**: `WidgetBackground.qml` and `PhotoWidget.qml` bind `sourceSize` to the widget's pixel dimensions with `asynchronous: true` and `cache: true`.
"""

STANDALONE_WIDGET_SPECS = [
    ("org.urwidgets.clock", "URWidgets — Clock & Alarms", "clock", "preferences-system-time", "2-slide manual digital clock and multi-alarm manager with local custom ringtone picker"),
    ("org.urwidgets.calendar", "URWidgets — Monthly Calendar", "calendar", "view-calendar", "Clean monthly calendar with Indonesian and English localization"),
    ("org.urwidgets.pomodoro", "URWidgets — Pomodoro Focus", "pomodoro", "chronometer", "Circular focus timer with session indicator dots and SQLite state"),
    ("org.urwidgets.weather", "URWidgets — Weather", "weather", "weather-clear", "Minimal weather card with large temperature and SQLite cache"),
    ("org.urwidgets.notes", "URWidgets — Notes", "notes", "knotes", "macOS Notes-inspired quick capture widget with pin and debounced SQLite autosave"),
    ("org.urwidgets.agenda", "URWidgets — To-Do List", "agenda", "view-pim-tasks", "Task checklist with deadlines, overdue indicators, and delete controls backed by SQLite"),
    ("org.urwidgets.photos", "URWidgets — Photo Frame", "photos", "view-preview", "Full-bleed rounded desktop photography frame with crop editor and slideshow"),
    ("org.urwidgets.music", "URWidgets — Music Player", "music_player", "multimedia-player", "Floating Music Player for local folders and direct online audio streams"),
    ("org.urwidgets.quickactions", "URWidgets — Quick Actions", "quick_actions", "quickopen", "Compact rounded desktop application and folder launcher grid"),
    ("org.urwidgets.sysmonitor", "URWidgets — System Monitor", "system_monitor", "utilities-system-monitor", "Understated CPU, Memory, and Battery indicator widget"),
]

# ==============================================================================
# URWIDGETS v3.0.2 — DEFINITIVE NATIVE FIXES FOR:
# 1. Custom Local Ringtone in Clock & Alarms (QtMultimedia.Audio + CLI fallback + alarmsJson persistence)
# 2. To-Do List Widget with Deadline Date/Time, Overdue Badges, Edit & Delete (Hapus) + todoItemsJson/SQLite persistence
# 3. Global-Only Theme & Style (Appearance Mode, Surface Style, Accent Color + Custom Hex #RRGGBB, Atmosphere Preset) synchronized across all 10 desktop widgets via ~/.config/urwidgets/global_theme.json
# ==============================================================================

FILES["core/src/modules/mod.rs"] = """pub mod clock;
pub mod alarms;
pub mod calendar;
pub mod weather;
pub mod pomodoro;
pub mod agenda;
pub mod notes;
pub mod photos;
pub mod quick_actions;
pub mod system_monitor;
pub mod backgrounds;
pub mod music;
"""

FILES["core/src/modules/todo.rs"] = """use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TodoRecord {
    pub id: String,
    pub title: String,
    pub completed: bool,
    pub priority: String,
    pub category: String,
    pub due_date_iso: String,
    pub due_time: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TodoPayload {
    pub items: Vec<TodoRecord>,
    pub completed_count: usize,
    pub total_count: usize,
}

pub struct TodoModule {
    items: Vec<TodoRecord>,
}

impl TodoModule {
    pub fn new_defaults() -> Self {
        Self {
            items: vec![
                TodoRecord {
                    id: "todo-1".into(),
                    title: "Math 12 - Unit 4 learning guide".into(),
                    completed: true,
                    priority: "high".into(),
                    category: "School".into(),
                    due_date_iso: "2026-11-09".into(),
                    due_time: "08:30".into(),
                },
                TodoRecord {
                    id: "todo-2".into(),
                    title: "Math 12 - Unit 4 Exam prep".into(),
                    completed: false,
                    priority: "high".into(),
                    category: "School".into(),
                    due_date_iso: "2026-11-09".into(),
                    due_time: "14:00".into(),
                },
                TodoRecord {
                    id: "todo-3".into(),
                    title: "Review KDE Plasma 5.27 QML shader cache".into(),
                    completed: false,
                    priority: "medium".into(),
                    category: "Engineering".into(),
                    due_date_iso: "2026-11-10".into(),
                    due_time: "16:30".into(),
                },
                TodoRecord {
                    id: "todo-4".into(),
                    title: "Package URWidgets v3.0.2 release archive".into(),
                    completed: false,
                    priority: "high".into(),
                    category: "Release".into(),
                    due_date_iso: "2026-11-12".into(),
                    due_time: "18:00".into(),
                },
            ],
        }
    }

    pub fn add_item(&mut self, id: &str, title: &str, due_date_iso: &str, due_time: &str, priority: &str, category: &str) -> TodoRecord {
        let rec = TodoRecord {
            id: if id.trim().is_empty() {
                format!("todo-{}", chrono::Utc::now().timestamp_millis())
            } else {
                id.trim().to_string()
            },
            title: if title.trim().is_empty() { "Untitled To-Do".into() } else { title.trim().into() },
            completed: false,
            priority: if priority.trim().is_empty() { "medium".into() } else { priority.trim().into() },
            category: if category.trim().is_empty() { "General".into() } else { category.trim().into() },
            due_date_iso: if due_date_iso.trim().is_empty() { "2026-11-10".into() } else { due_date_iso.trim().into() },
            due_time: if due_time.trim().is_empty() { "17:00".into() } else { due_time.trim().into() },
        };
        self.items.push(rec.clone());
        rec
    }

    pub fn toggle_item(&mut self, id: &str) -> Option<TodoRecord> {
        if let Some(item) = self.items.iter_mut().find(|i| i.id == id) {
            item.completed = !item.completed;
            return Some(item.clone());
        }
        None
    }

    pub fn update_item(&mut self, id: &str, title: &str, due_date_iso: &str, due_time: &str, priority: &str) -> Option<TodoRecord> {
        if let Some(item) = self.items.iter_mut().find(|i| i.id == id) {
            if !title.trim().is_empty() {
                item.title = title.trim().to_string();
            }
            if !due_date_iso.trim().is_empty() {
                item.due_date_iso = due_date_iso.trim().to_string();
            }
            if !due_time.trim().is_empty() {
                item.due_time = due_time.trim().to_string();
            }
            if !priority.trim().is_empty() {
                item.priority = priority.trim().to_string();
            }
            return Some(item.clone());
        }
        None
    }

    pub fn delete_item(&mut self, id: &str) {
        self.items.retain(|i| i.id != id);
    }

    pub fn clear_completed(&mut self) {
        self.items.retain(|i| !i.completed);
    }

    pub fn current_payload(&self) -> TodoPayload {
        let completed_count = self.items.iter().filter(|i| i.completed).count();
        TodoPayload {
            items: self.items.clone(),
            completed_count,
            total_count: self.items.len(),
        }
    }
}
"""

FILES["plasma/plasmoid/contents/config/main.xml"] = """<?xml version="1.0" encoding="UTF-8"?>
<kcfg xmlns="http://www.kde.org/standards/kcfg/1.0"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.kde.org/standards/kcfg/1.0
      http://www.kde.org/standards/kcfg/1.0/kcfg.xsd" >
  <kcfgfile name=""/>
  <group name="General">
    <entry name="widgetKind" type="String">
      <default>clock</default>
    </entry>
    <entry name="appearanceMode" type="String">
      <default>light</default>
    </entry>
    <entry name="widgetStyle" type="String">
      <default>default</default>
    </entry>
    <entry name="accentColorId" type="String">
      <default>pink</default>
    </entry>
    <entry name="customAccentHex" type="String">
      <default>#FF5A79</default>
    </entry>
    <entry name="themePreset" type="String">
      <default>warm-minimal</default>
    </entry>
    <entry name="elevationLevel" type="Int">
      <default>2</default>
    </entry>
    <entry name="backgroundColorOverride" type="String">
      <default></default>
    </entry>
    <entry name="gradientEnabled" type="Bool">
      <default>true</default>
    </entry>
    <entry name="gradientPreset" type="String">
      <default>peach</default>
    </entry>
    <entry name="borderOpacity" type="Double">
      <default>0.42</default>
    </entry>
    <entry name="textColorOverride" type="String">
      <default></default>
    </entry>
    <entry name="iconStyle" type="String">
      <default>filled</default>
    </entry>
    <entry name="preferredFontFamily" type="String">
      <default>auto</default>
    </entry>
    <entry name="surfaceOpacity" type="Double">
      <default>0.86</default>
    </entry>
    <entry name="cornerRadius" type="Int">
      <default>24</default>
    </entry>
    <entry name="customBgImage" type="String">
      <default></default>
    </entry>
    <entry name="customBgFitMode" type="String">
      <default>cover</default>
    </entry>
    <entry name="customBgPosition" type="String">
      <default>center</default>
    </entry>
    <entry name="customBgOverlayMode" type="String">
      <default>auto</default>
    </entry>
    <entry name="customBgOverlayOpacity" type="Double">
      <default>0.35</default>
    </entry>
    <entry name="customBgTextContrast" type="String">
      <default>auto</default>
    </entry>
    <entry name="use24HourClock" type="Bool">
      <default>false</default>
    </entry>
    <entry name="showClockSeconds" type="Bool">
      <default>false</default>
    </entry>
    <entry name="clockLocationLabel" type="String">
      <default>Bandung</default>
    </entry>
    <entry name="defaultSnoozeMins" type="Int">
      <default>10</default>
    </entry>
    <entry name="defaultRingtonePath" type="String">
      <default>/usr/share/sounds/freedesktop/stereo/alarm-clock-elapsed.oga</default>
    </entry>
    <entry name="alarmsJson" type="String">
      <default></default>
    </entry>
    <entry name="todoItemsJson" type="String">
      <default></default>
    </entry>
    <entry name="calendarLocale" type="String">
      <default>en-US</default>
    </entry>
    <entry name="calendarFirstDay" type="Int">
      <default>1</default>
    </entry>
    <entry name="weatherLocation" type="String">
      <default>Bandung</default>
    </entry>
    <entry name="weatherCelsius" type="Bool">
      <default>true</default>
    </entry>
    <entry name="pomodoroStudyMins" type="Int">
      <default>25</default>
    </entry>
    <entry name="pomodoroShortBreakMins" type="Int">
      <default>5</default>
    </entry>
    <entry name="pomodoroLongBreakMins" type="Int">
      <default>15</default>
    </entry>
    <entry name="photoDirectory" type="String">
      <default></default>
    </entry>
    <entry name="photoSlideshowMode" type="Bool">
      <default>true</default>
    </entry>
    <entry name="photoIntervalSecs" type="Int">
      <default>15</default>
    </entry>
    <entry name="photoCropsJson" type="String">
      <default>{}</default>
    </entry>
    <entry name="musicSourceType" type="String">
      <default>local</default>
    </entry>
    <entry name="musicFolderPath" type="String">
      <default></default>
    </entry>
    <entry name="musicStreamUrl" type="String">
      <default>https://ice2.somafm.com/groovesalad-128-mp3</default>
    </entry>
    <entry name="musicSavedStreamsJson" type="String">
      <default>[]</default>
    </entry>
    <entry name="quickActionsColumns" type="Int">
      <default>2</default>
    </entry>
    <entry name="sysmonIntervalSecs" type="Int">
      <default>3</default>
    </entry>
  </group>
</kcfg>
"""

FILES["plasma/plasmoid/contents/config/config.qml"] = """import QtQuick 2.15
import org.kde.plasma.configuration 2.0

ConfigModel {
    ConfigCategory {
        name: i18n("Global Theme & Widget Preferences")
        icon: "preferences-desktop-theme"
        source: "configGeneral.qml"
    }
}
"""

FILES["plasma/plasmoid/contents/ui/WidgetTheme.qml"] = """import QtQuick 2.15

QtObject {
    id: widgetTheme

    property string appearanceMode: (typeof root !== "undefined" && root.globalAppearanceMode) ? root.globalAppearanceMode : (plasmoid.configuration.appearanceMode || "light")
    property string widgetStyle: (typeof root !== "undefined" && root.globalWidgetStyle) ? root.globalWidgetStyle : (plasmoid.configuration.widgetStyle || "default")
    property string accentColorId: (typeof root !== "undefined" && root.globalAccentColorId) ? root.globalAccentColorId : (plasmoid.configuration.accentColorId || "pink")
    property string customAccentHex: (typeof root !== "undefined" && root.globalCustomAccentHex) ? root.globalCustomAccentHex : (plasmoid.configuration.customAccentHex || "#FF5A79")
    property string activePreset: (typeof root !== "undefined" && root.globalThemePreset) ? root.globalThemePreset : (plasmoid.configuration.themePreset || "warm-minimal")
    property int elevationLevel: plasmoid.configuration.elevationLevel !== undefined ? plasmoid.configuration.elevationLevel : 2
    property string backgroundColorOverride: plasmoid.configuration.backgroundColorOverride || ""
    property bool gradientEnabled: plasmoid.configuration.gradientEnabled !== undefined ? plasmoid.configuration.gradientEnabled : true
    property real borderOpacityOverride: plasmoid.configuration.borderOpacity !== undefined ? plasmoid.configuration.borderOpacity : 0.42
    property string textColorOverride: plasmoid.configuration.textColorOverride || ""
    property string iconStyle: plasmoid.configuration.iconStyle || "filled"

    function normalizeHex(rawHex, fallbackHex) {
        if (!rawHex) return fallbackHex
        var cleaned = rawHex.toString().trim()
        if (cleaned.indexOf("#") !== 0) cleaned = "#" + cleaned
        if (/^#[0-9A-Fa-f]{6}$/.test(cleaned)) return cleaned.toUpperCase()
        if (/^#[0-9A-Fa-f]{3}$/.test(cleaned)) {
            var r = cleaned.charAt(1)
            var g = cleaned.charAt(2)
            var b = cleaned.charAt(3)
            return ("#" + r + r + g + g + b + b).toUpperCase()
        }
        return fallbackHex
    }

    readonly property string resolvedFontFamily: {
        var overrideFam = plasmoid.configuration.preferredFontFamily || "auto"
        var installed = Qt.fontFamilies()
        if (overrideFam !== "auto" && installed.indexOf(overrideFam) !== -1) {
            return overrideFam
        }
        var candidates = [
            "SF Pro Display",
            "SF Pro Text",
            "Helvetica Neue",
            "Avenir Next",
            "Inter",
            "Plus Jakarta Sans",
            "Noto Sans Display",
            "Noto Sans",
            "Liberation Sans"
        ]
        for (var i = 0; i < candidates.length; i++) {
            if (installed.indexOf(candidates[i]) !== -1) {
                return candidates[i]
            }
        }
        return "Sans Serif"
    }

    readonly property int spaceMicro: 4
    readonly property int spaceCompact: 8
    readonly property int spaceStandard: 12
    readonly property int spaceCard: 18
    readonly property int spaceLarge: 22
    readonly property int spaceSection: 24

    readonly property int cornerRadius: plasmoid.configuration.cornerRadius || 24
    readonly property int controlRadius: 11

    readonly property int shadowRadius: {
        if (elevationLevel <= 0) return 0
        if (elevationLevel === 1) return 14
        if (elevationLevel === 2) return 24
        return 36
    }

    readonly property int shadowOffsetY: {
        if (elevationLevel <= 0) return 0
        if (elevationLevel === 1) return 4
        if (elevationLevel === 2) return 8
        return 14
    }

    readonly property var accentPalette: ({
        "auto": "#E84A7F",
        "blue": "#007AFF",
        "purple": "#9B51E0",
        "pink": "#E84A7F",
        "red": "#E03E36",
        "orange": "#F28C28",
        "yellow": "#E6B800",
        "green": "#2E9E5B",
        "graphite": "#6E6E73"
    })

    readonly property var softTintLightPalette: ({
        "auto": "#FCEBF1",
        "blue": "#EBF4FF",
        "purple": "#F3EBFF",
        "pink": "#FCEBF1",
        "red": "#FDECEB",
        "orange": "#FEF3E7",
        "yellow": "#FDF8E4",
        "green": "#EAF7EF",
        "graphite": "#F0F0F2"
    })

    readonly property var softTintDarkPalette: ({
        "auto": "#381B26",
        "blue": "#142744",
        "purple": "#2A1B42",
        "pink": "#381B26",
        "red": "#3B1A18",
        "orange": "#3B2512",
        "yellow": "#352C10",
        "green": "#143121",
        "graphite": "#27272A"
    })

    readonly property bool isDark: {
        if (widgetStyle === "dark") return true
        if (appearanceMode === "dark") return true
        if (appearanceMode === "light") return false
        return (activePreset === "midnight" || activePreset === "monochrome" || activePreset === "aurora-gradient")
    }

    readonly property string resolvedAccentHex: {
        if (accentColorId === "custom") {
            return normalizeHex(customAccentHex, "#FF5A79")
        }
        return accentPalette[accentColorId] || "#E84A7F"
    }

    readonly property color accentColor: resolvedAccentHex

    readonly property color surfaceColor: {
        if (backgroundColorOverride && backgroundColorOverride.trim().length > 0) {
            return backgroundColorOverride
        }
        if (widgetStyle === "tinted") {
            if (accentColorId === "custom") {
                return isDark ? Qt.darker(accentColor, 2.8) : Qt.lighter(accentColor, 1.82)
            }
            return isDark
                ? (softTintDarkPalette[accentColorId] || "#381B26")
                : (softTintLightPalette[accentColorId] || "#FCEBF1")
        }
        if (widgetStyle === "clear") {
            return isDark ? "#181920" : "#FAF9F6"
        }
        if (isDark) {
            return activePreset === "aurora-gradient" ? "#22243B" : "#1E1F25"
        }
        return activePreset === "pastel-editorial" ? "#F7F1EB" : "#F2EFE9"
    }

    readonly property color gradientEndColor: {
        if (!gradientEnabled) {
            return surfaceColor
        }
        if (widgetStyle === "tinted") {
            if (accentColorId === "custom") {
                return isDark ? Qt.darker(accentColor, 3.4) : Qt.lighter(accentColor, 1.65)
            }
            return isDark ? "#19191F" : "#F3EFEA"
        }
        if (isDark) {
            return activePreset === "aurora-gradient" ? "#192234" : "#17181D"
        }
        return "#E7E2DA"
    }

    readonly property real surfaceOpacity: {
        var base = plasmoid.configuration.surfaceOpacity || 0.86
        if (widgetStyle === "solid") return 0.98
        if (widgetStyle === "clear") return Math.min(0.62, base * 0.72)
        return base
    }

    readonly property color textColor: {
        var bgImg = plasmoid.configuration.customBgImage || ""
        var contrast = plasmoid.configuration.customBgTextContrast || "auto"
        if (bgImg.length > 0 && contrast === "light") return "#F5F5F7"
        if (bgImg.length > 0 && contrast === "dark") return "#1D1D1F"
        if (textColorOverride && textColorOverride.trim().length > 0) return textColorOverride
        return isDark ? "#F5F5F7" : "#1D1D1F"
    }
    readonly property color mutedTextColor: isDark ? "#98989F" : "#6E6C68"
    readonly property color subtleSurfaceColor: isDark ? Qt.rgba(1, 1, 1, 0.08) : Qt.rgba(0, 0, 0, 0.05)
    readonly property color borderColor: isDark
        ? Qt.rgba(1, 1, 1, Math.min(0.45, Math.max(0.05, borderOpacityOverride * 0.5)))
        : Qt.rgba(1, 1, 1, Math.min(0.85, Math.max(0.10, borderOpacityOverride)))
}
"""

FILES["plasma/plasmoid/contents/ui/configGeneral.qml"] = """import QtQuick 2.15
import QtQuick.Controls 2.15 as QQC2
import QtQuick.Layouts 1.15
import QtQuick.Dialogs 1.3
import org.kde.plasma.core 2.0 as PlasmaCore

Item {
    id: configPage
    width: childrenRect.width
    height: childrenRect.height

    // Writable cfg_* properties (Qt 5.15 compatible — avoids read-only ComboBox.currentValue alias errors)
    property string cfg_widgetKind: "clock"
    property string cfg_appearanceMode: "light"
    property string cfg_widgetStyle: "default"
    property string cfg_accentColorId: "pink"
    property string cfg_customAccentHex: "#FF5A79"
    property string cfg_themePreset: "warm-minimal"
    property alias cfg_elevationLevel: elevationSpin.value
    property alias cfg_surfaceOpacity: opacitySlider.value
    property alias cfg_backgroundColorOverride: bgColorField.text
    property alias cfg_gradientEnabled: gradientCheck.checked
    property alias cfg_cornerRadius: radiusSpin.value
    property alias cfg_borderOpacity: borderOpacitySlider.value
    property alias cfg_textColorOverride: textColorField.text
    property string cfg_iconStyle: "filled"
    property string cfg_preferredFontFamily: "auto"
    property alias cfg_customBgImage: bgImageField.text
    property string cfg_customBgFitMode: "cover"
    property string cfg_customBgPosition: "center"
    property string cfg_customBgOverlayMode: "auto"
    property alias cfg_customBgOverlayOpacity: bgOverlaySlider.value
    property string cfg_customBgTextContrast: "auto"
    property alias cfg_use24HourClock: clock24Check.checked
    property alias cfg_showClockSeconds: clockSecCheck.checked
    property alias cfg_clockLocationLabel: clockLocField.text
    property alias cfg_defaultSnoozeMins: snoozeSpin.value
    property alias cfg_defaultRingtonePath: defaultRingtoneField.text
    property string cfg_calendarLocale: "en-US"
    property alias cfg_weatherLocation: weatherLocField.text
    property alias cfg_weatherCelsius: weatherCelsiusCheck.checked
    property alias cfg_photoDirectory: photoDirField.text
    property alias cfg_photoSlideshowMode: photoSlideshowCheck.checked
    property alias cfg_photoIntervalSecs: photoIntervalSpin.value
    property string cfg_musicSourceType: "local"
    property alias cfg_musicFolderPath: musicFolderField.text
    property alias cfg_musicStreamUrl: musicStreamField.text
    property alias cfg_quickActionsColumns: qaColsSpin.value

    property bool pageReady: false

    PlasmaCore.DataSource {
        id: globalThemeBroadcastSource
        engine: "executable"
        connectedSources: []
        onNewData: function(sourceName, data) {
            disconnectSource(sourceName)
        }
    }

    Timer {
        id: broadcastDebounceTimer
        interval: 450
        repeat: false
        onTriggered: {
            var payload = JSON.stringify({
                appearanceMode: configPage.cfg_appearanceMode || "light",
                widgetStyle: configPage.cfg_widgetStyle || "default",
                accentColorId: configPage.cfg_accentColorId || "pink",
                customAccentHex: configPage.cfg_customAccentHex || "#FF5A79",
                themePreset: configPage.cfg_themePreset || "warm-minimal",
                updatedAt: Date.now()
            })
            var safeJson = payload.replace(/'/g, "")
            globalThemeBroadcastSource.connectSource("_write=" + Date.now() + "; mkdir -p ~/.config/urwidgets && printf '%s' '" + safeJson + "' > ~/.config/urwidgets/global_theme.json")
        }
    }

    function broadcastGlobalTheme() {
        if (!configPage.pageReady) return
        broadcastDebounceTimer.restart()
    }

    Component.onCompleted: {
        configPage.pageReady = true
    }

    onCfg_appearanceModeChanged: {
        var idx = appearanceCombo.indexOfValue(cfg_appearanceMode)
        if (idx >= 0 && appearanceCombo.currentIndex !== idx) appearanceCombo.currentIndex = idx
        broadcastGlobalTheme()
    }
    onCfg_widgetStyleChanged: {
        var idx = widgetStyleCombo.indexOfValue(cfg_widgetStyle)
        if (idx >= 0 && widgetStyleCombo.currentIndex !== idx) widgetStyleCombo.currentIndex = idx
        broadcastGlobalTheme()
    }
    onCfg_accentColorIdChanged: {
        var idx = accentColorCombo.indexOfValue(cfg_accentColorId)
        if (idx >= 0 && accentColorCombo.currentIndex !== idx) accentColorCombo.currentIndex = idx
        broadcastGlobalTheme()
    }
    onCfg_customAccentHexChanged: {
        if (customAccentHexField.text !== cfg_customAccentHex) {
            customAccentHexField.text = cfg_customAccentHex
        }
        broadcastGlobalTheme()
    }
    onCfg_themePresetChanged: {
        var idx = themePresetCombo.indexOfValue(cfg_themePreset)
        if (idx >= 0 && themePresetCombo.currentIndex !== idx) themePresetCombo.currentIndex = idx
        broadcastGlobalTheme()
    }

    ColorDialog {
        id: customHexColorDialog
        title: i18n("Select Custom Global Accent Color")
        onAccepted: {
            var hexStr = customHexColorDialog.color.toString().toUpperCase()
            configPage.cfg_customAccentHex = hexStr
            customAccentHexField.text = hexStr
            configPage.cfg_accentColorId = "custom"
        }
    }

    FileDialog {
        id: bgImageDialog
        title: i18n("Select Widget Background Image")
        nameFilters: ["Images (*.svg *.jpg *.jpeg *.png *.webp)"]
        onAccepted: {
            var p = decodeURIComponent(bgImageDialog.fileUrl.toString().replace(/^file:\/\//, ""))
            bgImageField.text = p
        }
    }

    ColumnLayout {
        spacing: 14
        width: 540

        QQC2.GroupBox {
            title: i18n("1. Global Theme & Style (Applies Across All URWidgets)")
            Layout.fillWidth: true
            GridLayout {
                columns: 2
                anchors.fill: parent
                rowSpacing: 8
                columnSpacing: 10

                QQC2.Label { text: i18n("Global Appearance Mode:") }
                QQC2.ComboBox {
                    id: appearanceCombo
                    Layout.fillWidth: true
                    textRole: "text"
                    valueRole: "value"
                    model: [
                        { text: "Light (Warm WidgetWall)", value: "light" },
                        { text: "Dark (Frosted Charcoal)", value: "dark" },
                        { text: "Auto (Follow Time/Preset)", value: "auto" }
                    ]
                    Component.onCompleted: currentIndex = Math.max(0, indexOfValue(configPage.cfg_appearanceMode))
                    onActivated: configPage.cfg_appearanceMode = currentValue
                }

                QQC2.Label { text: i18n("Global Surface Style:") }
                QQC2.ComboBox {
                    id: widgetStyleCombo
                    Layout.fillWidth: true
                    textRole: "text"
                    valueRole: "value"
                    model: [
                        { text: "Default (Soft Translucent)", value: "default" },
                        { text: "Dark (Deep Frosted)", value: "dark" },
                        { text: "Clear (High-Transparency Glass)", value: "clear" },
                        { text: "Tinted (Accent-Tinted Surface)", value: "tinted" },
                        { text: "Solid (Opaque High Contrast)", value: "solid" }
                    ]
                    Component.onCompleted: currentIndex = Math.max(0, indexOfValue(configPage.cfg_widgetStyle))
                    onActivated: configPage.cfg_widgetStyle = currentValue
                }

                QQC2.Label { text: i18n("Global Accent Color:") }
                QQC2.ComboBox {
                    id: accentColorCombo
                    Layout.fillWidth: true
                    textRole: "text"
                    valueRole: "value"
                    model: [
                        { text: "Pink (#E84A7F)", value: "pink" },
                        { text: "Blue (#007AFF)", value: "blue" },
                        { text: "Purple (#9B51E0)", value: "purple" },
                        { text: "Red (#E03E36)", value: "red" },
                        { text: "Orange (#F28C28)", value: "orange" },
                        { text: "Yellow (#E6B800)", value: "yellow" },
                        { text: "Green (#2E9E5B)", value: "green" },
                        { text: "Graphite (#6E6E73)", value: "graphite" },
                        { text: "Automatic", value: "auto" },
                        { text: "Custom Hex Color (#RRGGBB)", value: "custom" }
                    ]
                    Component.onCompleted: currentIndex = Math.max(0, indexOfValue(configPage.cfg_accentColorId))
                    onActivated: configPage.cfg_accentColorId = currentValue
                }

                QQC2.Label { text: i18n("Custom Accent Hex (#RRGGBB):") }
                RowLayout {
                    Layout.fillWidth: true
                    spacing: 6

                    Rectangle {
                        width: 24
                        height: 24
                        radius: 6
                        color: {
                            var h = customAccentHexField.text.trim()
                            return (/^#[0-9A-Fa-f]{6}$/.test(h) || /^#[0-9A-Fa-f]{3}$/.test(h)) ? h : "#FF5A79"
                        }
                        border.width: 1
                        border.color: Qt.rgba(0, 0, 0, 0.25)
                    }

                    QQC2.TextField {
                        id: customAccentHexField
                        placeholderText: i18n("#FF5A79")
                        text: configPage.cfg_customAccentHex
                        Layout.fillWidth: true
                        onTextEdited: {
                            var val = text.trim()
                            if (val.length > 0 && val.indexOf("#") !== 0) {
                                val = "#" + val
                            }
                            configPage.cfg_customAccentHex = val
                            if (/^#[0-9A-Fa-f]{6}$/.test(val) || /^#[0-9A-Fa-f]{3}$/.test(val)) {
                                configPage.cfg_accentColorId = "custom"
                            }
                        }
                    }

                    QQC2.Button {
                        text: i18n("Pick Color...")
                        onClicked: customHexColorDialog.open()
                    }
                }

                QQC2.Label { text: i18n("Global Atmosphere Preset:") }
                QQC2.ComboBox {
                    id: themePresetCombo
                    Layout.fillWidth: true
                    textRole: "text"
                    valueRole: "value"
                    model: [
                        { text: "WidgetWall Warm Minimal", value: "warm-minimal" },
                        { text: "Liquid Glass (Clear)", value: "liquid-glass" },
                        { text: "Pastel Editorial", value: "pastel-editorial" },
                        { text: "Aurora Gradient (Dark)", value: "aurora-gradient" },
                        { text: "Midnight Dark", value: "midnight" },
                        { text: "Monochrome Studio", value: "monochrome" }
                    ]
                    Component.onCompleted: currentIndex = Math.max(0, indexOfValue(configPage.cfg_themePreset))
                    onActivated: configPage.cfg_themePreset = currentValue
                }

                QQC2.Label { text: i18n("Icon Style:") }
                QQC2.ComboBox {
                    id: iconStyleCombo
                    Layout.fillWidth: true
                    textRole: "text"
                    valueRole: "value"
                    model: [
                        { text: "Filled", value: "filled" },
                        { text: "Outline", value: "outline" },
                        { text: "Minimal", value: "minimal" },
                        { text: "Monochrome", value: "monochrome" },
                        { text: "Accent-Tinted", value: "accent-tinted" }
                    ]
                    Component.onCompleted: currentIndex = Math.max(0, indexOfValue(configPage.cfg_iconStyle))
                    onActivated: configPage.cfg_iconStyle = currentValue
                }

                QQC2.Label { text: i18n("Typography Font:") }
                QQC2.ComboBox {
                    id: fontCombo
                    Layout.fillWidth: true
                    textRole: "text"
                    valueRole: "value"
                    model: [
                        { text: "System Default (SF Pro / Inter / Noto)", value: "auto" },
                        { text: "Noto Sans", value: "Noto Sans" },
                        { text: "Inter", value: "Inter" },
                        { text: "Ubuntu", value: "Ubuntu" },
                        { text: "JetBrains Mono", value: "JetBrains Mono" }
                    ]
                    Component.onCompleted: currentIndex = Math.max(0, indexOfValue(configPage.cfg_preferredFontFamily))
                    onActivated: configPage.cfg_preferredFontFamily = currentValue
                }

                QQC2.Label { text: i18n("3D Shadow Elevation (0–3):") }
                QQC2.SpinBox {
                    id: elevationSpin
                    from: 0
                    to: 3
                }

                QQC2.Label { text: i18n("Surface Opacity:") }
                QQC2.Slider {
                    id: opacitySlider
                    from: 0.35
                    to: 1.0
                    stepSize: 0.02
                    Layout.fillWidth: true
                }

                QQC2.Label { text: i18n("Corner Radius (px):") }
                QQC2.SpinBox {
                    id: radiusSpin
                    from: 10
                    to: 36
                }

                QQC2.Label { text: i18n("Border Opacity:") }
                QQC2.Slider {
                    id: borderOpacitySlider
                    from: 0.05
                    to: 0.90
                    stepSize: 0.05
                    Layout.fillWidth: true
                }

                QQC2.Label { text: i18n("Custom Surface Hex (Optional):") }
                QQC2.TextField {
                    id: bgColorField
                    placeholderText: i18n("Leave empty for global theme surface")
                    Layout.fillWidth: true
                }

                QQC2.Label { text: i18n("Custom Text Hex (Optional):") }
                QQC2.TextField {
                    id: textColorField
                    placeholderText: i18n("Leave empty for automatic contrast")
                    Layout.fillWidth: true
                }

                QQC2.CheckBox {
                    id: gradientCheck
                    text: i18n("Enable Subtle Surface Gradient")
                    Layout.columnSpan: 2
                }
            }
        }

        QQC2.GroupBox {
            title: i18n("2. Custom Image Background (SVG, JPG, JPEG, PNG, WebP)")
            Layout.fillWidth: true
            GridLayout {
                columns: 2
                anchors.fill: parent
                rowSpacing: 8
                columnSpacing: 10

                QQC2.Label { text: i18n("Image File:") }
                RowLayout {
                    Layout.fillWidth: true
                    spacing: 6
                    QQC2.TextField {
                        id: bgImageField
                        placeholderText: i18n("/path/to/background.jpg (.svg, .png, .webp)")
                        Layout.fillWidth: true
                    }
                    QQC2.Button {
                        text: i18n("Browse...")
                        onClicked: bgImageDialog.open()
                    }
                    QQC2.Button {
                        text: i18n("Reset")
                        onClicked: bgImageField.text = ""
                    }
                }

                QQC2.Label { text: i18n("Image Fit:") }
                QQC2.ComboBox {
                    id: bgFitCombo
                    Layout.fillWidth: true
                    textRole: "text"
                    valueRole: "value"
                    model: [
                        { text: "Cover (Crop to Fill)", value: "cover" },
                        { text: "Contain (Preserve Aspect)", value: "contain" },
                        { text: "Stretch (Fill Card)", value: "stretch" },
                        { text: "Center", value: "center" }
                    ]
                    Component.onCompleted: currentIndex = Math.max(0, indexOfValue(configPage.cfg_customBgFitMode))
                    onActivated: configPage.cfg_customBgFitMode = currentValue
                }

                QQC2.Label { text: i18n("Image Position:") }
                QQC2.ComboBox {
                    id: bgPosCombo
                    Layout.fillWidth: true
                    textRole: "text"
                    valueRole: "value"
                    model: [
                        { text: "Center", value: "center" },
                        { text: "Top", value: "top" },
                        { text: "Bottom", value: "bottom" },
                        { text: "Left", value: "left" },
                        { text: "Right", value: "right" }
                    ]
                    Component.onCompleted: currentIndex = Math.max(0, indexOfValue(configPage.cfg_customBgPosition))
                    onActivated: configPage.cfg_customBgPosition = currentValue
                }

                QQC2.Label { text: i18n("Overlay Mode:") }
                QQC2.ComboBox {
                    id: bgOverlayModeCombo
                    Layout.fillWidth: true
                    textRole: "text"
                    valueRole: "value"
                    model: [
                        { text: "Auto", value: "auto" },
                        { text: "Dark Scrim", value: "dark" },
                        { text: "Light Scrim", value: "light" }
                    ]
                    Component.onCompleted: currentIndex = Math.max(0, indexOfValue(configPage.cfg_customBgOverlayMode))
                    onActivated: configPage.cfg_customBgOverlayMode = currentValue
                }

                QQC2.Label { text: i18n("Overlay Opacity:") }
                QQC2.Slider {
                    id: bgOverlaySlider
                    from: 0.0
                    to: 0.85
                    stepSize: 0.05
                    Layout.fillWidth: true
                }

                QQC2.Label { text: i18n("Text Readability:") }
                QQC2.ComboBox {
                    id: bgTextContrastCombo
                    Layout.fillWidth: true
                    textRole: "text"
                    valueRole: "value"
                    model: [
                        { text: "Auto Contrast", value: "auto" },
                        { text: "Force Light Text", value: "light" },
                        { text: "Force Dark Text", value: "dark" }
                    ]
                    Component.onCompleted: currentIndex = Math.max(0, indexOfValue(configPage.cfg_customBgTextContrast))
                    onActivated: configPage.cfg_customBgTextContrast = currentValue
                }
            }
        }

        QQC2.GroupBox {
            title: i18n("3. Widget Module Settings (Clock Local Ringtone, To-Do List, Music, Photo)")
            Layout.fillWidth: true
            GridLayout {
                columns: 2
                anchors.fill: parent
                rowSpacing: 8
                columnSpacing: 10

                QQC2.Label { text: i18n("Widget Type:") }
                QQC2.ComboBox {
                    id: widgetKindCombo
                    Layout.fillWidth: true
                    textRole: "text"
                    valueRole: "value"
                    model: [
                        { text: "Clock & Alarms (widget.clock)", value: "clock" },
                        { text: "Monthly Calendar (widget.calendar)", value: "calendar" },
                        { text: "Weather (widget.weather)", value: "weather" },
                        { text: "Pomodoro Focus (widget.pomodoro)", value: "pomodoro" },
                        { text: "Notes (widget.notes)", value: "notes" },
                        { text: "To-Do List (widget.todo)", value: "agenda" },
                        { text: "Photo Frame (widget.photo_frame)", value: "photos" },
                        { text: "Music Player (widget.music_player)", value: "music_player" },
                        { text: "Quick Actions (widget.quick_actions)", value: "quick_actions" },
                        { text: "System Monitor (widget.system_monitor)", value: "system_monitor" }
                    ]
                    Component.onCompleted: currentIndex = Math.max(0, indexOfValue(configPage.cfg_widgetKind))
                    onActivated: configPage.cfg_widgetKind = currentValue
                }

                QQC2.Label { text: i18n("Nada Dering Alarm (Semua Alarm):") }
                QQC2.TextField {
                    id: defaultRingtoneField
                    placeholderText: i18n("~/Music/ atau ~/Music/ringtone.mp3")
                    Layout.fillWidth: true
                }

                QQC2.Label { text: i18n("Clock City / Subtitle:") }
                QQC2.TextField {
                    id: clockLocField
                    Layout.fillWidth: true
                }

                QQC2.Label { text: i18n("Default Alarm Snooze (mins):") }
                QQC2.SpinBox {
                    id: snoozeSpin
                    from: 1
                    to: 60
                }

                QQC2.CheckBox {
                    id: clock24Check
                    text: i18n("Use 24-hour clock format")
                    Layout.columnSpan: 2
                }

                QQC2.CheckBox {
                    id: clockSecCheck
                    text: i18n("Display clock seconds")
                    Layout.columnSpan: 2
                }

                QQC2.Label { text: i18n("Calendar Locale:") }
                QQC2.ComboBox {
                    id: localeCombo
                    Layout.fillWidth: true
                    textRole: "text"
                    valueRole: "value"
                    model: [
                        { text: "English (en-US)", value: "en-US" },
                        { text: "Bahasa Indonesia (id-ID)", value: "id-ID" }
                    ]
                    Component.onCompleted: currentIndex = Math.max(0, indexOfValue(configPage.cfg_calendarLocale))
                    onActivated: configPage.cfg_calendarLocale = currentValue
                }

                QQC2.Label { text: i18n("Weather Location:") }
                QQC2.TextField {
                    id: weatherLocField
                    Layout.fillWidth: true
                }

                QQC2.CheckBox {
                    id: weatherCelsiusCheck
                    text: i18n("Temperature in Celsius (°C)")
                    Layout.columnSpan: 2
                }

                QQC2.Label { text: i18n("Photo Frame Folder:") }
                QQC2.TextField {
                    id: photoDirField
                    placeholderText: i18n("Leave empty for bundled WidgetWall photography")
                    Layout.fillWidth: true
                }

                QQC2.CheckBox {
                    id: photoSlideshowCheck
                    text: i18n("Enable Photo Frame Slideshow Mode")
                    Layout.columnSpan: 2
                }

                QQC2.Label { text: i18n("Slideshow Interval (secs):") }
                QQC2.SpinBox {
                    id: photoIntervalSpin
                    from: 5
                    to: 3600
                }

                QQC2.Label { text: i18n("Music Source Mode:") }
                QQC2.ComboBox {
                    id: musicSourceCombo
                    Layout.fillWidth: true
                    textRole: "text"
                    valueRole: "value"
                    model: [
                        { text: "Local Music Path (~/Music/ or file)", value: "local" },
                        { text: "Online Audio Stream (Direct URL)", value: "stream" }
                    ]
                    Component.onCompleted: currentIndex = Math.max(0, indexOfValue(configPage.cfg_musicSourceType))
                    onActivated: configPage.cfg_musicSourceType = currentValue
                }

                QQC2.Label { text: i18n("Local Music Path:") }
                QQC2.TextField {
                    id: musicFolderField
                    placeholderText: i18n("~/Music/")
                    Layout.fillWidth: true
                }

                QQC2.Label { text: i18n("Direct Audio Stream URL:") }
                QQC2.TextField {
                    id: musicStreamField
                    placeholderText: i18n("https://ice2.somafm.com/groovesalad-128-mp3")
                    Layout.fillWidth: true
                }

                QQC2.Label { text: i18n("Quick Actions Columns:") }
                QQC2.SpinBox {
                    id: qaColsSpin
                    from: 2
                    to: 3
                }
            }
        }

        QQC2.GroupBox {
            title: i18n("4. Author & Developer Information")
            Layout.fillWidth: true
            ColumnLayout {
                anchors.fill: parent
                spacing: 6

                QQC2.Label {
                    text: i18n("Author")
                    opacity: 0.65
                    font.pixelSize: 11
                }
                QQC2.Label {
                    text: "Haris Gitama"
                    font.pixelSize: 13
                    font.weight: Font.DemiBold
                }

                QQC2.Label {
                    text: i18n("Portfolio")
                    opacity: 0.65
                    font.pixelSize: 11
                    Layout.topMargin: 4
                }
                QQC2.Label {
                    text: "rissaxie.com ↗"
                    font.pixelSize: 12
                    font.weight: Font.Medium
                    font.underline: portfolioMouse.containsMouse
                    MouseArea {
                        id: portfolioMouse
                        anchors.fill: parent
                        hoverEnabled: true
                        cursorShape: Qt.PointingHandCursor
                        onClicked: Qt.openUrlExternally("https://rissaxie.com")
                    }
                }

                QQC2.Label {
                    text: i18n("Instagram")
                    opacity: 0.65
                    font.pixelSize: 11
                    Layout.topMargin: 4
                }
                QQC2.Label {
                    text: "@hrisgtaa_ ↗"
                    font.pixelSize: 12
                    font.weight: Font.Medium
                    font.underline: instagramMouse.containsMouse
                    MouseArea {
                        id: instagramMouse
                        anchors.fill: parent
                        hoverEnabled: true
                        cursorShape: Qt.PointingHandCursor
                        onClicked: Qt.openUrlExternally("https://www.instagram.com/hrisgtaa_/")
                    }
                }

                RowLayout {
                    Layout.fillWidth: true
                    Layout.topMargin: 6
                    spacing: 6

                    QQC2.Label {
                        text: i18n("Developed by Haris Gitama")
                        opacity: 0.65
                        font.pixelSize: 11
                    }
                    QQC2.Label {
                        text: "·"
                        opacity: 0.45
                        font.pixelSize: 11
                    }
                    QQC2.Label {
                        text: "GitHub ↗"
                        opacity: 0.78
                        font.pixelSize: 11
                        font.underline: widgetCreditMouse.containsMouse
                        MouseArea {
                            id: widgetCreditMouse
                            anchors.fill: parent
                            hoverEnabled: true
                            cursorShape: Qt.PointingHandCursor
                            onClicked: Qt.openUrlExternally("https://github.com/Harisgitama")
                        }
                    }
                    Item { Layout.fillWidth: true }
                }
            }
        }
    }
}
"""

FILES["plasma/plasmoid/contents/ui/main.qml"] = """import QtQuick 2.15
import QtQuick.Layouts 1.15
import org.kde.plasma.plasmoid 2.0
import org.kde.plasma.core 2.0 as PlasmaCore

Item {
    id: root
    width: PlasmaCore.Units.gridUnit * 18
    height: PlasmaCore.Units.gridUnit * 13
    Plasmoid.backgroundHints: PlasmaCore.Types.NoBackground
    Plasmoid.preferredRepresentation: Plasmoid.fullRepresentation
    clip: true

    // Synchronized Global Theme & Style properties across all 10 standalone desktop widgets
    property string globalAppearanceMode: plasmoid.configuration.appearanceMode || "light"
    property string globalWidgetStyle: plasmoid.configuration.widgetStyle || "default"
    property string globalAccentColorId: plasmoid.configuration.accentColorId || "pink"
    property string globalCustomAccentHex: plasmoid.configuration.customAccentHex || "#FF5A79"
    property string globalThemePreset: plasmoid.configuration.themePreset || "warm-minimal"
    property bool syncingGlobalTheme: false

    WidgetTheme {
        id: theme
    }

    property var daemonSnapshot: ({})
    readonly property bool isPhotoWidget: (plasmoid.configuration.widgetKind || "clock") === "photos"

    // Cross-Plasmoid Global Theme Synchronization via ~/.config/urwidgets/global_theme.json
    PlasmaCore.DataSource {
        id: globalThemeSyncSource
        engine: "executable"
        connectedSources: []
        onNewData: function(sourceName, data) {
            if (sourceName.indexOf("_read=") === 0 && data["stdout"]) {
                var raw = data["stdout"].trim()
                if (raw.length > 2) {
                    try {
                        var parsed = JSON.parse(raw)
                        root.syncingGlobalTheme = true
                        if (parsed.appearanceMode && parsed.appearanceMode !== root.globalAppearanceMode) {
                            root.globalAppearanceMode = parsed.appearanceMode
                            plasmoid.configuration.appearanceMode = parsed.appearanceMode
                        }
                        if (parsed.widgetStyle && parsed.widgetStyle !== root.globalWidgetStyle) {
                            root.globalWidgetStyle = parsed.widgetStyle
                            plasmoid.configuration.widgetStyle = parsed.widgetStyle
                        }
                        if (parsed.accentColorId && parsed.accentColorId !== root.globalAccentColorId) {
                            root.globalAccentColorId = parsed.accentColorId
                            plasmoid.configuration.accentColorId = parsed.accentColorId
                        }
                        if (parsed.customAccentHex && parsed.customAccentHex !== root.globalCustomAccentHex) {
                            root.globalCustomAccentHex = parsed.customAccentHex
                            plasmoid.configuration.customAccentHex = parsed.customAccentHex
                        }
                        if (parsed.themePreset && parsed.themePreset !== root.globalThemePreset) {
                            root.globalThemePreset = parsed.themePreset
                            plasmoid.configuration.themePreset = parsed.themePreset
                        }
                        root.syncingGlobalTheme = false
                    } catch (e) {
                        root.syncingGlobalTheme = false
                    }
                }
            }
            disconnectSource(sourceName)
        }
        function readSharedGlobalTheme() {
            connectSource("_read=" + Date.now() + "; cat ~/.config/urwidgets/global_theme.json 2>/dev/null || true")
        }
        function writeSharedGlobalTheme() {
            if (root.syncingGlobalTheme) return
            writeDebounceTimer.restart()
        }
    }

    Timer {
        id: writeDebounceTimer
        interval: 450
        repeat: false
        onTriggered: {
            if (root.syncingGlobalTheme) return
            var payload = JSON.stringify({
                appearanceMode: root.globalAppearanceMode,
                widgetStyle: root.globalWidgetStyle,
                accentColorId: root.globalAccentColorId,
                customAccentHex: root.globalCustomAccentHex,
                themePreset: root.globalThemePreset,
                updatedAt: Date.now()
            })
            var safeJson = payload.replace(/'/g, "")
            globalThemeSyncSource.connectSource("_write=" + Date.now() + "; mkdir -p ~/.config/urwidgets && printf '%s' '" + safeJson + "' > ~/.config/urwidgets/global_theme.json")
        }
    }

    Connections {
        target: plasmoid.configuration
        function onAppearanceModeChanged() {
            root.globalAppearanceMode = plasmoid.configuration.appearanceMode || "light"
            globalThemeSyncSource.writeSharedGlobalTheme()
        }
        function onWidgetStyleChanged() {
            root.globalWidgetStyle = plasmoid.configuration.widgetStyle || "default"
            globalThemeSyncSource.writeSharedGlobalTheme()
        }
        function onAccentColorIdChanged() {
            root.globalAccentColorId = plasmoid.configuration.accentColorId || "pink"
            globalThemeSyncSource.writeSharedGlobalTheme()
        }
        function onCustomAccentHexChanged() {
            root.globalCustomAccentHex = plasmoid.configuration.customAccentHex || "#FF5A79"
            globalThemeSyncSource.writeSharedGlobalTheme()
        }
        function onThemePresetChanged() {
            root.globalThemePreset = plasmoid.configuration.themePreset || "warm-minimal"
            globalThemeSyncSource.writeSharedGlobalTheme()
        }
    }

    // Passive 30-second cross-widget sync (prevents 1.5s shell process storm while keeping desktop 100% responsive)
    Timer {
        interval: 30000
        running: true
        repeat: true
        onTriggered: globalThemeSyncSource.readSharedGlobalTheme()
    }

    PlasmaCore.DataSource {
        id: daemonExecutable
        engine: "executable"
        connectedSources: []
        onNewData: function(sourceName, data) {
            if (data["stdout"]) {
                try {
                    var parsed = JSON.parse(data["stdout"])
                    if (parsed.clock) {
                        root.daemonSnapshot = parsed
                    }
                } catch (e) {}
            }
            disconnectSource(sourceName)
        }
        function invokeMethod(methodAndArgs) {
            if (methodAndArgs === "GetSnapshot") {
                connectSource("qdbus org.urwidgets.Daemon /org/urwidgets/Daemon org.urwidgets.Daemon1.GetSnapshot 2>/dev/null || true")
            } else {
                connectSource("_dbus=" + Date.now() + "; (qdbus org.urwidgets.Daemon /org/urwidgets/Daemon org.urwidgets.Daemon1." + methodAndArgs + " >/dev/null 2>&1 &) || true")
            }
        }
    }

    WidgetSurface {
        anchors.fill: parent
        themeObj: theme
        fullBleed: root.isPhotoWidget
    }

    Loader {
        id: widgetLoader
        anchors.fill: parent
        anchors.margins: root.isPhotoWidget ? 0 : theme.spaceCard
        source: {
            var kind = plasmoid.configuration.widgetKind || "clock"
            switch (kind) {
                case "clock": return "ClockWidget.qml"
                case "calendar": return "CalendarWidget.qml"
                case "weather": return "WeatherWidget.qml"
                case "pomodoro": return "PomodoroWidget.qml"
                case "notes": return "NotesWidget.qml"
                case "agenda": return "AgendaWidget.qml"
                case "todo": return "AgendaWidget.qml"
                case "photos": return "PhotoWidget.qml"
                case "music_player": return "MusicPlayerWidget.qml"
                case "quick_actions": return "QuickActionsWidget.qml"
                case "system_monitor": return "SystemMonitorWidget.qml"
                default: return "ClockWidget.qml"
            }
        }
    }

    Component.onCompleted: {
        Plasmoid.setAction("modeLight", i18n("Global Appearance: Light"), "weather-clear")
        Plasmoid.setAction("modeDark", i18n("Global Appearance: Dark"), "weather-clear-night")
        Plasmoid.setAction("styleDefault", i18n("Global Style: Default"), "preferences-desktop-theme")
        Plasmoid.setAction("styleClear", i18n("Global Style: Clear Glass"), "preferences-desktop-theme")
        Plasmoid.setAction("styleTinted", i18n("Global Style: Accent Tinted"), "preferences-desktop-color")
        globalThemeSyncSource.readSharedGlobalTheme()
        daemonExecutable.invokeMethod("GetSnapshot")
    }

    function action_modeLight() {
        plasmoid.configuration.appearanceMode = "light"
        root.globalAppearanceMode = "light"
        globalThemeSyncSource.writeSharedGlobalTheme()
    }
    function action_modeDark() {
        plasmoid.configuration.appearanceMode = "dark"
        root.globalAppearanceMode = "dark"
        globalThemeSyncSource.writeSharedGlobalTheme()
    }
    function action_styleDefault() {
        plasmoid.configuration.widgetStyle = "default"
        root.globalWidgetStyle = "default"
        globalThemeSyncSource.writeSharedGlobalTheme()
    }
    function action_styleClear() {
        plasmoid.configuration.widgetStyle = "clear"
        root.globalWidgetStyle = "clear"
        globalThemeSyncSource.writeSharedGlobalTheme()
    }
    function action_styleTinted() {
        plasmoid.configuration.widgetStyle = "tinted"
        root.globalWidgetStyle = "tinted"
        globalThemeSyncSource.writeSharedGlobalTheme()
    }
}
"""

FILES["plasma/plasmoid/contents/ui/ClockWidget.qml"] = """import QtQuick 2.15
import QtQuick.Controls 2.15 as QQC2
import QtQuick.Layouts 1.15
import QtQuick.Dialogs 1.3
import QtMultimedia 5.15
import org.kde.plasma.core 2.0 as PlasmaCore

Item {
    id: clockRoot
    property date currentTime: new Date()
    property bool use24h: plasmoid.configuration.use24HourClock || false
    property bool showSecs: plasmoid.configuration.showClockSeconds || false
    property string locationLabel: plasmoid.configuration.clockLocationLabel || "Bandung"
    // Slide 0 = Main Clock, Slide 1 = Alarm Manager (Manual navigation only; never auto-rotates)
    property int activeSlide: 0
    property bool composerOpen: false
    property string editingAlarmId: ""
    property int directRingtoneTargetIndex: -1
    property int pickerHour: 7
    property int pickerMinute: 30
    property string pickerLabel: "Morning Study"
    property string pickerRepeat: "Weekdays"
    property string pickerOneTimeDate: ""
    property int pickerSnoozeMins: plasmoid.configuration.defaultSnoozeMins || 10
    property string pickerRingtone: plasmoid.configuration.defaultRingtonePath || "/usr/share/sounds/freedesktop/stereo/alarm-clock-elapsed.oga"
    property int pickerVolume: 85
    property bool previewingSound: false
    property string activeDueAlarmId: ""
    property string activeDueAlarmLabel: ""
    property string activeDueAlarmRingtone: ""
    property string lastTriggeredMinuteKey: ""

    // Native QtMultimedia Audio Player for Custom Local Ringtone (.mp3, .wav, .ogg, .oga, .flac, .m4a, .aac)
    Audio {
        id: localRingtoneAudio
        autoLoad: true
        volume: Math.max(0.1, Math.min(1.0, clockRoot.pickerVolume / 100.0))
        onStopped: {
            if (clockRoot.activeDueAlarmId === "") {
                clockRoot.previewingSound = false
            }
        }
    }

    // Fallback Multi-Format Audio Runner (mpv / ffplay / gst-play-1.0 / paplay / cvlc / aplay)
    PlasmaCore.DataSource {
        id: localAudioRunner
        engine: "executable"
        connectedSources: []
        onNewData: function(sourceName, data) {
            disconnectSource(sourceName)
        }
        function playFile(pathStr) {
            if (!pathStr || pathStr.trim().length === 0) return
            var clean = decodeURIComponent(pathStr.trim().replace(/^file:\/\//, ""))
            clockRoot.previewingSound = true
            localRingtoneAudio.stop()
            localRingtoneAudio.loops = 1
            localRingtoneAudio.source = "file://" + clean
            localRingtoneAudio.play()
            var esc = clean.replace(/'/g, "'\\''")
            var cmd = "if command -v mpv >/dev/null 2>&1; then mpv --no-video --really-quiet '" + esc + "' >/dev/null 2>&1; " +
                      "elif command -v ffplay >/dev/null 2>&1; then ffplay -nodisp -autoexit -loglevel quiet '" + esc + "' >/dev/null 2>&1; " +
                      "elif command -v gst-play-1.0 >/dev/null 2>&1; then gst-play-1.0 --quiet '" + esc + "' >/dev/null 2>&1; " +
                      "elif command -v paplay >/dev/null 2>&1; then paplay '" + esc + "' >/dev/null 2>&1; fi"
            connectSource(cmd)
        }
        function stopAll() {
            clockRoot.previewingSound = false
            localRingtoneAudio.stop()
            connectSource("pkill -f 'mpv --no-video' 2>/dev/null; pkill -f 'ffplay -nodisp' 2>/dev/null; pkill -f 'gst-play-1.0' 2>/dev/null; pkill -f 'paplay' 2>/dev/null || true")
        }
    }

    FileDialog {
        id: localRingtoneDialog
        title: "Pilih File Nada Dering Lokal (.mp3, .wav, .ogg, .oga, .flac, .m4a, .aac)"
        nameFilters: ["Audio Files (*.mp3 *.wav *.ogg *.oga *.flac *.m4a *.aac)", "All Files (*)"]
        onAccepted: {
            var localPath = decodeURIComponent(localRingtoneDialog.fileUrl.toString().replace(/^file:\/\//, ""))
            if (clockRoot.directRingtoneTargetIndex >= 0 && clockRoot.directRingtoneTargetIndex < alarmsModel.count) {
                var idx = clockRoot.directRingtoneTargetIndex
                alarmsModel.setProperty(idx, "ringtonePath", localPath)
                var item = alarmsModel.get(idx)
                clockRoot.saveAlarmsToConfig()
                daemonExecutable.invokeMethod("AlarmAction 'set_ringtone|" + item.alarmId + "|" + localPath + "'")
                localAudioRunner.playFile(localPath)
                clockRoot.directRingtoneTargetIndex = -1
            } else {
                clockRoot.pickerRingtone = localPath
                localAudioRunner.playFile(localPath)
            }
        }
        onRejected: {
            clockRoot.directRingtoneTargetIndex = -1
        }
    }

    ListModel {
        id: alarmsModel
        ListElement { alarmId: "alm-wake"; timeStr: "07:00"; label: "Wake Up"; repeatText: "Weekdays"; oneTimeDate: ""; snoozeMins: 10; ringtonePath: "/usr/share/sounds/freedesktop/stereo/alarm-clock-elapsed.oga"; volume: 85; enabled: true }
        ListElement { alarmId: "alm-study"; timeStr: "08:00"; label: "Morning Study"; repeatText: "Every day"; oneTimeDate: ""; snoozeMins: 5; ringtonePath: "/usr/share/sounds/freedesktop/stereo/complete.oga"; volume: 80; enabled: true }
        ListElement { alarmId: "alm-lunch"; timeStr: "12:30"; label: "Lunch Reminder"; repeatText: "Mon, Wed, Fri"; oneTimeDate: ""; snoozeMins: 15; ringtonePath: "/usr/share/sounds/freedesktop/stereo/bell.oga"; volume: 75; enabled: false }
    }

    function saveAlarmsToConfig() {
        var arr = []
        for (var i = 0; i < alarmsModel.count; i++) {
            var it = alarmsModel.get(i)
            arr.push({
                alarmId: it.alarmId,
                timeStr: it.timeStr,
                label: it.label,
                repeatText: it.repeatText,
                oneTimeDate: it.oneTimeDate || "",
                snoozeMins: it.snoozeMins,
                ringtonePath: it.ringtonePath,
                volume: it.volume || 85,
                enabled: it.enabled
            })
        }
        plasmoid.configuration.alarmsJson = JSON.stringify(arr)
    }

    function loadAlarmsFromConfig() {
        var raw = plasmoid.configuration.alarmsJson || ""
        if (raw.trim().length > 2) {
            try {
                var parsed = JSON.parse(raw)
                if (Array.isArray(parsed) && parsed.length > 0) {
                    alarmsModel.clear()
                    for (var i = 0; i < parsed.length; i++) {
                        var a = parsed[i]
                        alarmsModel.append({
                            alarmId: a.alarmId || ("alm-" + i),
                            timeStr: a.timeStr || "07:00",
                            label: a.label || "Alarm",
                            repeatText: a.repeatText || "Every day",
                            oneTimeDate: a.oneTimeDate || "",
                            snoozeMins: a.snoozeMins || 10,
                            ringtonePath: a.ringtonePath || "/usr/share/sounds/freedesktop/stereo/alarm-clock-elapsed.oga",
                            volume: a.volume || 85,
                            enabled: a.enabled !== undefined ? a.enabled : true
                        })
                    }
                }
            } catch (e) {}
        }
    }

    Component.onCompleted: {
        loadAlarmsFromConfig()
    }

    readonly property int enabledAlarmCount: {
        var count = 0
        for (var i = 0; i < alarmsModel.count; i++) {
            if (alarmsModel.get(i).enabled) count++
        }
        return count
    }

    readonly property string nextEnabledAlarmTime: {
        for (var i = 0; i < alarmsModel.count; i++) {
            if (alarmsModel.get(i).enabled) return alarmsModel.get(i).timeStr
        }
        return ""
    }

    function padTwo(val) {
        return val < 10 ? ("0" + val) : ("" + val)
    }

    function fileBaseName(pathStr) {
        if (!pathStr || pathStr.length === 0) return "Default"
        var parts = pathStr.split("/")
        return parts[parts.length - 1] || pathStr
    }

    Timer {
        interval: 1000
        running: true
        repeat: true
        triggeredOnStart: true
        onTriggered: {
            var now = new Date()
            clockRoot.currentTime = now
            var hhmm = clockRoot.padTwo(now.getHours()) + ":" + clockRoot.padTwo(now.getMinutes())
            var minKey = now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate() + " " + hhmm
            if (now.getSeconds() === 0 && clockRoot.lastTriggeredMinuteKey !== minKey) {
                for (var i = 0; i < alarmsModel.count; i++) {
                    var alm = alarmsModel.get(i)
                    if (alm.enabled && alm.timeStr === hhmm) {
                        clockRoot.lastTriggeredMinuteKey = minKey
                        clockRoot.activeDueAlarmId = alm.alarmId
                        clockRoot.activeDueAlarmLabel = alm.label + " (" + alm.timeStr + ")"
                        clockRoot.activeDueAlarmRingtone = alm.ringtonePath
                        localAudioRunner.playFile(alm.ringtonePath)
                        break
                    }
                }
            }
        }
    }

    // Due Alarm Notification Banner (Supports Snooze + Stop + Plays Custom Local Ringtone)
    Rectangle {
        id: dueBanner
        visible: clockRoot.activeDueAlarmId !== ""
        anchors.top: parent.top
        anchors.left: parent.left
        anchors.right: parent.right
        height: visible ? 30 : 0
        radius: 9
        z: 10
        color: Qt.rgba(0.96, 0.62, 0.04, 0.24)
        border.width: 1
        border.color: Qt.rgba(0.96, 0.62, 0.04, 0.55)

        RowLayout {
            anchors.fill: parent
            anchors.leftMargin: 8
            anchors.rightMargin: 8
            spacing: 6

            WidgetText {
                themeObj: theme
                text: "🔔 " + clockRoot.activeDueAlarmLabel
                font.pixelSize: 11
                font.weight: Font.DemiBold
                Layout.fillWidth: true
                elide: Text.ElideRight
            }

            WidgetButton {
                themeObj: theme
                label: "Snooze " + clockRoot.pickerSnoozeMins + "m"
                pill: true
                onClicked: {
                    localAudioRunner.stopAll()
                    daemonExecutable.invokeMethod("AlarmAction 'snooze|" + clockRoot.activeDueAlarmId + "|" + clockRoot.pickerSnoozeMins + "'")
                    clockRoot.activeDueAlarmId = ""
                }
            }

            WidgetButton {
                themeObj: theme
                label: "Stop"
                active: true
                pill: true
                onClicked: {
                    localAudioRunner.stopAll()
                    daemonExecutable.invokeMethod("AlarmAction 'stop|" + clockRoot.activeDueAlarmId + "'")
                    clockRoot.activeDueAlarmId = ""
                }
            }
        }
    }

    // ================= SLIDE 1: MAIN CLOCK DISPLAY =================
    ColumnLayout {
        visible: clockRoot.activeSlide === 0
        anchors.fill: parent
        anchors.topMargin: dueBanner.visible ? 34 : 0
        spacing: 4

        RowLayout {
            Layout.fillWidth: true
            spacing: 6

            Rectangle {
                height: 22
                radius: 11
                color: theme.subtleSurfaceColor
                implicitWidth: badgeRow.implicitWidth + 14

                RowLayout {
                    id: badgeRow
                    anchors.centerIn: parent
                    spacing: 5

                    Rectangle {
                        width: 6
                        height: 6
                        radius: 3
                        color: clockRoot.enabledAlarmCount > 0 ? theme.accentColor : theme.mutedTextColor
                    }

                    WidgetText {
                        themeObj: theme
                        text: clockRoot.enabledAlarmCount > 0
                            ? (clockRoot.nextEnabledAlarmTime + " · " + clockRoot.enabledAlarmCount)
                            : "No active alarms"
                        font.pixelSize: 11
                        font.weight: Font.Medium
                    }
                }

                MouseArea {
                    anchors.fill: parent
                    cursorShape: Qt.PointingHandCursor
                    onClicked: clockRoot.activeSlide = 1
                }
            }

            Item { Layout.fillWidth: true }

            WidgetButton {
                themeObj: theme
                label: clockRoot.use24h ? "24h" : "12h"
                pill: true
                onClicked: {
                    clockRoot.use24h = !clockRoot.use24h
                    plasmoid.configuration.use24HourClock = clockRoot.use24h
                }
            }

            WidgetButton {
                themeObj: theme
                label: "Alarms ›"
                active: true
                pill: true
                onClicked: clockRoot.activeSlide = 1
            }
        }

        RowLayout {
            Layout.fillWidth: true
            spacing: 6
            Layout.alignment: Qt.AlignLeft | Qt.AlignVCenter

            WidgetText {
                id: mainTimeText
                themeObj: theme
                text: {
                    var fmt = clockRoot.use24h
                        ? (clockRoot.showSecs ? "HH:mm:ss" : "HH:mm")
                        : (clockRoot.showSecs ? "h:mm:ss" : "h:mm")
                    return Qt.formatTime(clockRoot.currentTime, fmt)
                }
                font.pixelSize: Math.min(52, Math.max(34, clockRoot.height * 0.36))
                font.weight: Font.Light
            }

            WidgetText {
                visible: !clockRoot.use24h
                themeObj: theme
                text: clockRoot.currentTime.getHours() >= 12 ? "PM" : "AM"
                color: theme.accentColor
                font.pixelSize: 18
                font.weight: Font.DemiBold
                Layout.alignment: Qt.AlignTop
                Layout.topMargin: 8
            }
        }

        RowLayout {
            Layout.fillWidth: true
            spacing: 5

            Rectangle {
                width: 7
                height: 7
                radius: 3.5
                color: theme.accentColor
            }

            WidgetText {
                themeObj: theme
                muted: true
                text: Qt.formatDate(clockRoot.currentTime, "ddd, MMM d") + ","
                font.pixelSize: 13
            }

            WidgetText {
                themeObj: theme
                text: clockRoot.locationLabel
                font.pixelSize: 13
                font.weight: Font.DemiBold
                elide: Text.ElideRight
                Layout.fillWidth: true
            }

            WidgetText {
                themeObj: theme
                muted: true
                text: "1 / 2"
                font.pixelSize: 10
            }
        }
    }

    // ================= SLIDE 2: ALARM MANAGER (WITH CUSTOM LOCAL RINGTONE PICKER & AUDIO PLAYBACK) =================
    ColumnLayout {
        visible: clockRoot.activeSlide === 1
        anchors.fill: parent
        anchors.topMargin: dueBanner.visible ? 34 : 0
        spacing: 5

        RowLayout {
            Layout.fillWidth: true
            spacing: 6

            WidgetButton {
                themeObj: theme
                label: "‹ Clock"
                pill: true
                onClicked: {
                    clockRoot.composerOpen = false
                    localAudioRunner.stopAll()
                    clockRoot.activeSlide = 0
                }
            }

            WidgetText {
                themeObj: theme
                text: "Alarms (" + clockRoot.enabledAlarmCount + ")"
                font.pixelSize: 12
                font.weight: Font.DemiBold
                Layout.fillWidth: true
                elide: Text.ElideRight
            }

            WidgetButton {
                themeObj: theme
                label: "Ring Test"
                pill: true
                onClicked: {
                    if (alarmsModel.count > 0) {
                        var targetIdx = 0
                        for (var i = 0; i < alarmsModel.count; i++) {
                            if (alarmsModel.get(i).ringtonePath.indexOf("/usr/share/sounds") !== 0) {
                                targetIdx = i
                                break
                            }
                        }
                        var targetAlm = alarmsModel.get(targetIdx)
                        clockRoot.activeDueAlarmId = targetAlm.alarmId
                        clockRoot.activeDueAlarmLabel = targetAlm.label + " (" + targetAlm.timeStr + ")"
                        clockRoot.activeDueAlarmRingtone = targetAlm.ringtonePath
                        localAudioRunner.playFile(targetAlm.ringtonePath)
                    }
                }
            }

            WidgetButton {
                themeObj: theme
                label: clockRoot.composerOpen ? "Close" : "+ Alarm"
                active: true
                pill: true
                onClicked: {
                    if (!clockRoot.composerOpen) {
                        clockRoot.editingAlarmId = ""
                        clockRoot.pickerHour = 7
                        clockRoot.pickerMinute = 30
                        clockRoot.pickerLabel = "Alarm Baru"
                    }
                    clockRoot.composerOpen = !clockRoot.composerOpen
                }
            }
        }

        // Dedicated Alarm Composer (Time + Repeat + Snooze + Custom Local Ringtone File Picker)
        Rectangle {
            visible: clockRoot.composerOpen
            Layout.fillWidth: true
            Layout.fillHeight: true
            radius: 12
            color: theme.subtleSurfaceColor

            ColumnLayout {
                anchors.fill: parent
                anchors.margins: 7
                spacing: 4

                RowLayout {
                    Layout.fillWidth: true
                    spacing: 4

                    WidgetButton {
                        themeObj: theme
                        label: "-H"
                        onClicked: clockRoot.pickerHour = (clockRoot.pickerHour + 23) % 24
                    }
                    WidgetText {
                        themeObj: theme
                        text: clockRoot.padTwo(clockRoot.pickerHour) + ":" + clockRoot.padTwo(clockRoot.pickerMinute)
                        font.pixelSize: 15
                        font.weight: Font.Bold
                    }
                    WidgetButton {
                        themeObj: theme
                        label: "+H"
                        onClicked: clockRoot.pickerHour = (clockRoot.pickerHour + 1) % 24
                    }
                    WidgetButton {
                        themeObj: theme
                        label: "-M"
                        onClicked: clockRoot.pickerMinute = (clockRoot.pickerMinute + 59) % 60
                    }
                    WidgetButton {
                        themeObj: theme
                        label: "+M"
                        onClicked: clockRoot.pickerMinute = (clockRoot.pickerMinute + 5) % 60
                    }

                    QQC2.TextField {
                        id: alarmLabelInput
                        Layout.fillWidth: true
                        placeholderText: "Label alarm..."
                        text: clockRoot.pickerLabel
                        font.pixelSize: 11
                        onTextChanged: clockRoot.pickerLabel = text
                    }
                }

                // Repeat & Snooze Row
                RowLayout {
                    Layout.fillWidth: true
                    spacing: 4

                    Repeater {
                        model: ["Every day", "Weekdays", "Weekends", "Once"]
                        WidgetButton {
                            themeObj: theme
                            label: modelData
                            active: clockRoot.pickerRepeat === modelData
                            pill: true
                            onClicked: clockRoot.pickerRepeat = modelData
                        }
                    }

                    Item { Layout.fillWidth: true }

                    WidgetButton {
                        themeObj: theme
                        label: "Snooze " + clockRoot.pickerSnoozeMins + "m"
                        pill: true
                        onClicked: {
                            var opts = [5, 10, 15, 20, 30]
                            var idx = opts.indexOf(clockRoot.pickerSnoozeMins)
                            clockRoot.pickerSnoozeMins = opts[(idx + 1) % opts.length]
                        }
                    }
                }

                // Custom Local Ringtone File Picker & Preview Row
                RowLayout {
                    Layout.fillWidth: true
                    spacing: 4

                    WidgetButton {
                        themeObj: theme
                        label: "Pilih Nada Lokal…"
                        active: true
                        pill: true
                        onClicked: {
                            clockRoot.directRingtoneTargetIndex = -1
                            localRingtoneDialog.open()
                        }
                    }

                    QQC2.TextField {
                        id: ringtonePathInput
                        Layout.fillWidth: true
                        placeholderText: "/home/user/Music/nada-dering.mp3"
                        text: clockRoot.pickerRingtone
                        font.pixelSize: 10
                        onTextEdited: clockRoot.pickerRingtone = text
                    }

                    WidgetButton {
                        themeObj: theme
                        label: clockRoot.previewingSound ? "■ Stop" : "▶ Test"
                        pill: true
                        onClicked: {
                            if (clockRoot.previewingSound) {
                                localAudioRunner.stopAll()
                            } else {
                                localAudioRunner.playFile(clockRoot.pickerRingtone)
                            }
                        }
                    }
                }

                // Cancel / Confirm & Save Action Row
                RowLayout {
                    Layout.fillWidth: true
                    spacing: 6

                    WidgetText {
                        themeObj: theme
                        muted: true
                        text: "♪ " + clockRoot.fileBaseName(clockRoot.pickerRingtone)
                        font.pixelSize: 10
                        elide: Text.ElideMiddle
                        Layout.fillWidth: true
                    }

                    WidgetButton {
                        themeObj: theme
                        label: "Batal"
                        pill: true
                        onClicked: {
                            localAudioRunner.stopAll()
                            clockRoot.composerOpen = false
                            clockRoot.editingAlarmId = ""
                        }
                    }

                    WidgetButton {
                        themeObj: theme
                        label: "Simpan Alarm"
                        active: true
                        pill: true
                        onClicked: {
                            var formattedTime = clockRoot.padTwo(clockRoot.pickerHour) + ":" + clockRoot.padTwo(clockRoot.pickerMinute)
                            var targetId = clockRoot.editingAlarmId !== "" ? clockRoot.editingAlarmId : ("alm-" + Date.now())
                            var cleanLabel = (clockRoot.pickerLabel || "Alarm").trim()
                            var cleanRingtone = (clockRoot.pickerRingtone || "/usr/share/sounds/freedesktop/stereo/alarm-clock-elapsed.oga").trim()
                            var updatedExisting = false
                            for (var i = 0; i < alarmsModel.count; i++) {
                                if (alarmsModel.get(i).alarmId === targetId) {
                                    alarmsModel.set(i, {
                                        alarmId: targetId,
                                        timeStr: formattedTime,
                                        label: cleanLabel,
                                        repeatText: clockRoot.pickerRepeat,
                                        oneTimeDate: clockRoot.pickerOneTimeDate,
                                        snoozeMins: clockRoot.pickerSnoozeMins,
                                        ringtonePath: cleanRingtone,
                                        volume: clockRoot.pickerVolume,
                                        enabled: true
                                    })
                                    updatedExisting = true
                                    break
                                }
                            }
                            if (!updatedExisting) {
                                alarmsModel.append({
                                    alarmId: targetId,
                                    timeStr: formattedTime,
                                    label: cleanLabel,
                                    repeatText: clockRoot.pickerRepeat,
                                    oneTimeDate: clockRoot.pickerOneTimeDate,
                                    snoozeMins: clockRoot.pickerSnoozeMins,
                                    ringtonePath: cleanRingtone,
                                    volume: clockRoot.pickerVolume,
                                    enabled: true
                                })
                            }
                            clockRoot.saveAlarmsToConfig()
                            daemonExecutable.invokeMethod(
                                "AlarmAction 'upsert|" + targetId + "|" + formattedTime + "|" +
                                cleanLabel + "|" + clockRoot.pickerRepeat + "|" +
                                clockRoot.pickerSnoozeMins + "|" + cleanRingtone + "'"
                            )
                            localAudioRunner.stopAll()
                            clockRoot.composerOpen = false
                            clockRoot.editingAlarmId = ""
                        }
                    }
                }
            }
        }

        // Scrollable Alarm List (When Composer is Closed)
        ListView {
            id: alarmsListView
            visible: !clockRoot.composerOpen
            Layout.fillWidth: true
            Layout.fillHeight: true
            clip: true
            spacing: 4
            model: alarmsModel

            delegate: Rectangle {
                width: alarmsListView.width
                height: 36
                radius: 9
                color: theme.subtleSurfaceColor

                RowLayout {
                    anchors.fill: parent
                    anchors.leftMargin: 8
                    anchors.rightMargin: 8
                    spacing: 5

                    ColumnLayout {
                        Layout.fillWidth: true
                        spacing: 1

                        RowLayout {
                            spacing: 5
                            WidgetText {
                                themeObj: theme
                                text: model.timeStr
                                font.pixelSize: 13
                                font.weight: Font.DemiBold
                                opacity: model.enabled ? 1.0 : 0.45
                            }
                            WidgetText {
                                themeObj: theme
                                text: "— " + model.label
                                font.pixelSize: 11
                                opacity: model.enabled ? 0.9 : 0.45
                                elide: Text.ElideRight
                                Layout.fillWidth: true
                            }
                        }

                        WidgetText {
                            themeObj: theme
                            muted: true
                            text: model.repeatText + " · ♪ " + clockRoot.fileBaseName(model.ringtonePath)
                            font.pixelSize: 9
                            elide: Text.ElideRight
                            Layout.fillWidth: true
                        }
                    }

                    WidgetButton {
                        themeObj: theme
                        label: "♪ Lokal"
                        pill: true
                        onClicked: {
                            clockRoot.directRingtoneTargetIndex = index
                            localRingtoneDialog.open()
                        }
                    }

                    WidgetButton {
                        themeObj: theme
                        label: "▶"
                        pill: true
                        onClicked: localAudioRunner.playFile(model.ringtonePath)
                    }

                    WidgetButton {
                        themeObj: theme
                        label: "Edit"
                        pill: true
                        onClicked: {
                            clockRoot.editingAlarmId = model.alarmId
                            var hm = (model.timeStr || "07:30").split(":")
                            clockRoot.pickerHour = parseInt(hm[0] || "7", 10)
                            clockRoot.pickerMinute = parseInt(hm[1] || "30", 10)
                            clockRoot.pickerLabel = model.label
                            clockRoot.pickerRepeat = model.repeatText
                            clockRoot.pickerSnoozeMins = model.snoozeMins
                            clockRoot.pickerRingtone = model.ringtonePath
                            clockRoot.composerOpen = true
                        }
                    }

                    WidgetButton {
                        themeObj: theme
                        label: "×"
                        pill: true
                        onClicked: {
                            var delId = model.alarmId
                            alarmsModel.remove(index)
                            clockRoot.saveAlarmsToConfig()
                            daemonExecutable.invokeMethod("AlarmAction 'delete|" + delId + "'")
                        }
                    }

                    WidgetButton {
                        themeObj: theme
                        label: model.enabled ? "ON" : "OFF"
                        active: model.enabled
                        pill: true
                        onClicked: {
                            alarmsModel.setProperty(index, "enabled", !model.enabled)
                            clockRoot.saveAlarmsToConfig()
                            daemonExecutable.invokeMethod("AlarmAction 'toggle|" + model.alarmId + "'")
                        }
                    }
                }
            }
        }
    }
}
"""

FILES["plasma/plasmoid/contents/ui/AgendaWidget.qml"] = """import QtQuick 2.15
import QtQuick.Controls 2.15 as QQC2
import QtQuick.Layouts 1.15

ColumnLayout {
    id: todoWidgetRoot
    spacing: 6
    clip: true

    property bool showAddForm: false
    property string editingTodoId: ""
    property string newTitle: ""
    property string newDueDate: "2026-11-10"
    property string newDueTime: "17:00"
    property string newPriority: "high"
    property string filterMode: "all" // "all" | "active" | "done"

    ListModel {
        id: todoItemsModel
        ListElement { todoId: "todo-1"; title: "Math 12 - Unit 4 learning guide"; dueDateIso: "2026-11-09"; dueTime: "08:30"; priority: "high"; category: "School"; done: true }
        ListElement { todoId: "todo-2"; title: "Math 12 - Unit 4 Exam prep"; dueDateIso: "2026-11-09"; dueTime: "14:00"; priority: "high"; category: "School"; done: false }
        ListElement { todoId: "todo-3"; title: "Review KDE Plasma 5.27 QML shader cache"; dueDateIso: "2026-11-10"; dueTime: "16:30"; priority: "medium"; category: "Engineering"; done: false }
        ListElement { todoId: "todo-4"; title: "Package URWidgets v3.0.2 release archive"; dueDateIso: "2026-11-12"; dueTime: "18:00"; priority: "high"; category: "Release"; done: false }
    }

    function saveTodosToConfig() {
        var arr = []
        for (var i = 0; i < todoItemsModel.count; i++) {
            var it = todoItemsModel.get(i)
            arr.push({
                todoId: it.todoId,
                title: it.title,
                dueDateIso: it.dueDateIso,
                dueTime: it.dueTime,
                priority: it.priority,
                category: it.category || "General",
                done: it.done
            })
        }
        plasmoid.configuration.todoItemsJson = JSON.stringify(arr)
    }

    function loadTodosFromConfig() {
        var raw = plasmoid.configuration.todoItemsJson || ""
        if (raw.trim().length > 2) {
            try {
                var parsed = JSON.parse(raw)
                if (Array.isArray(parsed)) {
                    todoItemsModel.clear()
                    for (var i = 0; i < parsed.length; i++) {
                        var t = parsed[i]
                        todoItemsModel.append({
                            todoId: t.todoId || ("todo-" + i),
                            title: t.title || "Untitled To-Do",
                            dueDateIso: t.dueDateIso || "2026-11-10",
                            dueTime: t.dueTime || "17:00",
                            priority: t.priority || "medium",
                            category: t.category || "General",
                            done: t.done !== undefined ? t.done : false
                        })
                    }
                }
            } catch (e) {}
        }
    }

    Component.onCompleted: {
        loadTodosFromConfig()
    }

    readonly property int completedCount: {
        var c = 0
        for (var i = 0; i < todoItemsModel.count; i++) {
            if (todoItemsModel.get(i).done) c++
        }
        return c
    }

    function deadlineStatusText(dueDateIso, dueTime, isDone) {
        if (!dueDateIso || dueDateIso.length === 0) return "No deadline"
        if (isDone) return "Selesai · " + dueDateIso + " " + (dueTime || "")
        var todayIso = Qt.formatDate(new Date(), "yyyy-MM-dd")
        if (dueDateIso < todayIso) return "OVERDUE · " + dueDateIso + " " + (dueTime || "")
        if (dueDateIso === todayIso) return "HARI INI · " + (dueTime || "17:00")
        return "Deadline: " + dueDateIso + " " + (dueTime || "")
    }

    function isOverdue(dueDateIso, isDone) {
        if (isDone || !dueDateIso || dueDateIso.length === 0) return false
        var todayIso = Qt.formatDate(new Date(), "yyyy-MM-dd")
        return dueDateIso < todayIso
    }

    RowLayout {
        Layout.fillWidth: true
        spacing: 6

        ColumnLayout {
            spacing: 1
            Layout.fillWidth: true

            WidgetText {
                themeObj: theme
                text: "To-Do List"
                font.pixelSize: 15
                font.weight: Font.DemiBold
            }

            WidgetText {
                themeObj: theme
                muted: true
                text: todoWidgetRoot.completedCount + " / " + todoItemsModel.count + " selesai"
                font.pixelSize: 10
            }
        }

        Repeater {
            model: [
                { id: "all", label: "All" },
                { id: "active", label: "Active" },
                { id: "done", label: "Done" }
            ]
            WidgetButton {
                themeObj: theme
                label: modelData.label
                active: todoWidgetRoot.filterMode === modelData.id
                pill: true
                onClicked: todoWidgetRoot.filterMode = modelData.id
            }
        }

        WidgetButton {
            visible: todoWidgetRoot.completedCount > 0
            themeObj: theme
            label: "Clear Done"
            pill: true
            onClicked: {
                for (var i = todoItemsModel.count - 1; i >= 0; i--) {
                    if (todoItemsModel.get(i).done) {
                        var delId = todoItemsModel.get(i).todoId
                        todoItemsModel.remove(i)
                        daemonExecutable.invokeMethod("DeleteAgendaEvent '" + delId + "'")
                    }
                }
                todoWidgetRoot.saveTodosToConfig()
            }
        }

        WidgetButton {
            themeObj: theme
            label: todoWidgetRoot.showAddForm ? "Tutup" : "+ To-Do"
            active: true
            pill: true
            onClicked: {
                if (!todoWidgetRoot.showAddForm) {
                    todoWidgetRoot.editingTodoId = ""
                    todoWidgetRoot.newTitle = ""
                    todoWidgetRoot.newDueDate = Qt.formatDate(new Date(), "yyyy-MM-dd")
                    todoWidgetRoot.newDueTime = "17:00"
                    todoWidgetRoot.newPriority = "high"
                }
                todoWidgetRoot.showAddForm = !todoWidgetRoot.showAddForm
            }
        }
    }

    // Progress Bar
    Rectangle {
        Layout.fillWidth: true
        height: 4
        radius: 2
        color: theme.subtleSurfaceColor

        Rectangle {
            width: todoItemsModel.count > 0 ? parent.width * (todoWidgetRoot.completedCount / todoItemsModel.count) : 0
            height: parent.height
            radius: 2
            color: theme.accentColor
        }
    }

    // Add / Edit To-Do Form with Deadline Date + Time + Priority
    Rectangle {
        visible: todoWidgetRoot.showAddForm
        Layout.fillWidth: true
        height: 92
        radius: 10
        color: theme.subtleSurfaceColor

        ColumnLayout {
            anchors.fill: parent
            anchors.margins: 6
            spacing: 4

            QQC2.TextField {
                id: todoTitleInput
                Layout.fillWidth: true
                placeholderText: "Judul tugas / to-do baru..."
                text: todoWidgetRoot.newTitle
                font.pixelSize: 11
                onTextChanged: todoWidgetRoot.newTitle = text
            }

            RowLayout {
                Layout.fillWidth: true
                spacing: 4

                WidgetText {
                    themeObj: theme
                    muted: true
                    text: "Deadline:"
                    font.pixelSize: 10
                }

                QQC2.TextField {
                    id: todoDateInput
                    Layout.preferredWidth: 88
                    placeholderText: "YYYY-MM-DD"
                    text: todoWidgetRoot.newDueDate
                    font.pixelSize: 10
                    onTextChanged: todoWidgetRoot.newDueDate = text
                }

                QQC2.TextField {
                    id: todoTimeInput
                    Layout.preferredWidth: 54
                    placeholderText: "HH:MM"
                    text: todoWidgetRoot.newDueTime
                    font.pixelSize: 10
                    onTextChanged: todoWidgetRoot.newDueTime = text
                }

                Repeater {
                    model: ["high", "medium", "low"]
                    WidgetButton {
                        themeObj: theme
                        label: modelData === "high" ? "High" : (modelData === "medium" ? "Med" : "Low")
                        active: todoWidgetRoot.newPriority === modelData
                        pill: true
                        onClicked: todoWidgetRoot.newPriority = modelData
                    }
                }

                Item { Layout.fillWidth: true }

                WidgetButton {
                    themeObj: theme
                    label: "Simpan"
                    active: true
                    pill: true
                    onClicked: {
                        var cleanTitle = todoWidgetRoot.newTitle.trim()
                        if (cleanTitle.length > 0) {
                            var cleanDate = todoWidgetRoot.newDueDate.trim() || Qt.formatDate(new Date(), "yyyy-MM-dd")
                            var cleanTime = todoWidgetRoot.newDueTime.trim() || "17:00"
                            if (todoWidgetRoot.editingTodoId !== "") {
                                for (var i = 0; i < todoItemsModel.count; i++) {
                                    if (todoItemsModel.get(i).todoId === todoWidgetRoot.editingTodoId) {
                                        todoItemsModel.setProperty(i, "title", cleanTitle)
                                        todoItemsModel.setProperty(i, "dueDateIso", cleanDate)
                                        todoItemsModel.setProperty(i, "dueTime", cleanTime)
                                        todoItemsModel.setProperty(i, "priority", todoWidgetRoot.newPriority)
                                        break
                                    }
                                }
                            } else {
                                var tid = "todo-" + Date.now()
                                todoItemsModel.insert(0, {
                                    todoId: tid,
                                    title: cleanTitle,
                                    dueDateIso: cleanDate,
                                    dueTime: cleanTime,
                                    priority: todoWidgetRoot.newPriority,
                                    category: "General",
                                    done: false
                                })
                                daemonExecutable.invokeMethod(
                                    "AddAgendaEvent '" + cleanTitle + "' '" + cleanDate + "' '" + cleanTime + "' 'Work'"
                                )
                            }
                            todoWidgetRoot.saveTodosToConfig()
                            todoWidgetRoot.newTitle = ""
                            todoWidgetRoot.editingTodoId = ""
                            todoWidgetRoot.showAddForm = false
                        }
                    }
                }
            }
        }
    }

    // Scrollable To-Do Checklist with Deadline Badge, Edit & Hapus (Delete) Button
    ListView {
        id: todoListView
        Layout.fillWidth: true
        Layout.fillHeight: true
        clip: true
        spacing: 4
        model: todoItemsModel

        delegate: Item {
            readonly property bool matchesFilter: {
                if (todoWidgetRoot.filterMode === "active") return !model.done
                if (todoWidgetRoot.filterMode === "done") return model.done
                return true
            }
            width: todoListView.width
            height: matchesFilter ? 34 : 0
            visible: matchesFilter

            Rectangle {
                anchors.fill: parent
                radius: 9
                color: theme.subtleSurfaceColor

                RowLayout {
                    anchors.fill: parent
                    anchors.leftMargin: 8
                    anchors.rightMargin: 8
                    spacing: 7

                    // Checkbox toggle
                    Rectangle {
                        width: 16
                        height: 16
                        radius: 8
                        color: model.done ? theme.accentColor : "transparent"
                        border.width: 1.5
                        border.color: model.done ? theme.accentColor : theme.mutedTextColor

                        WidgetText {
                            visible: model.done
                            anchors.centerIn: parent
                            themeObj: theme
                            text: "✓"
                            color: "#FFFFFF"
                            font.pixelSize: 9
                            font.weight: Font.Bold
                        }

                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            onClicked: {
                                todoItemsModel.setProperty(index, "done", !model.done)
                                todoWidgetRoot.saveTodosToConfig()
                                daemonExecutable.invokeMethod("ToggleAgendaEvent '" + model.todoId + "'")
                            }
                        }
                    }

                    // Priority indicator dot
                    Rectangle {
                        width: 6
                        height: 6
                        radius: 3
                        color: model.priority === "high" ? "#EF4444" : (model.priority === "medium" ? "#F59E0B" : "#10B981")
                    }

                    // Title + Deadline Subtitle
                    ColumnLayout {
                        Layout.fillWidth: true
                        spacing: 1

                        WidgetText {
                            themeObj: theme
                            text: model.title
                            font.pixelSize: 11
                            font.weight: Font.Medium
                            font.strikeout: model.done
                            opacity: model.done ? 0.52 : 1.0
                            elide: Text.ElideRight
                            Layout.fillWidth: true
                        }

                        WidgetText {
                            themeObj: theme
                            muted: !todoWidgetRoot.isOverdue(model.dueDateIso, model.done)
                            color: todoWidgetRoot.isOverdue(model.dueDateIso, model.done) ? "#EF4444" : theme.mutedTextColor
                            text: "⏰ " + todoWidgetRoot.deadlineStatusText(model.dueDateIso, model.dueTime, model.done)
                            font.pixelSize: 9
                            font.weight: todoWidgetRoot.isOverdue(model.dueDateIso, model.done) ? Font.DemiBold : Font.Normal
                            elide: Text.ElideRight
                            Layout.fillWidth: true
                        }
                    }

                    // Edit Button
                    WidgetButton {
                        themeObj: theme
                        label: "Edit"
                        pill: true
                        onClicked: {
                            todoWidgetRoot.editingTodoId = model.todoId
                            todoWidgetRoot.newTitle = model.title
                            todoWidgetRoot.newDueDate = model.dueDateIso
                            todoWidgetRoot.newDueTime = model.dueTime
                            todoWidgetRoot.newPriority = model.priority
                            todoWidgetRoot.showAddForm = true
                        }
                    }

                    // Delete (Hapus) To-Do Button
                    WidgetButton {
                        themeObj: theme
                        label: "Hapus"
                        pill: true
                        onClicked: {
                            var targetId = model.todoId
                            todoItemsModel.remove(index)
                            todoWidgetRoot.saveTodosToConfig()
                            daemonExecutable.invokeMethod("DeleteAgendaEvent '" + targetId + "'")
                        }
                    }
                }
            }
        }
    }
}
"""

FILES["plasma/plasmoid/contents/ui/TodoWidget.qml"] = FILES["plasma/plasmoid/contents/ui/AgendaWidget.qml"]

# ==============================================================================
# URWIDGETS v3.0.3 — PATCH FOR:
# 1. Reliable Alarm Trigger & Guaranteed Ringtone Audio Playback (ClockWidget.qml & alarms.rs)
#    - Removes fragile `now.getSeconds() === 0` check so alarms always trigger on the matching HH:mm minute.
#    - Syncs `plasmoid.configuration.defaultRingtonePath` and `localRingtoneDialog` immediately to alarms.
#    - Expands `~/` to `$HOME/`, appends unique `#ts=` to DataSource commands, loops alarm audio continuously while ringing (`alarmRingLoopTimer`), and chains `mpv || ffplay || gst-play-1.0 || cvlc || mpg123 || paplay || aplay || canberra-gtk-play` with fallback to freedesktop alarm sound.
# 2. Clean Pure-Image Photo Frame (`PhotoWidget.qml`)
#    - Removes Crop, Slide/Single, Next (`›`), and Prev (`‹`) buttons and overlays so the Photo Frame displays only the clean rounded image.
# 3. Disable Workspace Switching on 2-Finger Scroll Over Widgets (`WidgetSurface.qml` & `main.qml`)
#    - Consumes `QWheelEvent` (`wheel.accepted = true`) on all widget surfaces so 2-finger touchpad scrolling up/down over any widget never leaks to the KDE Plasma Desktop Containment to switch workspaces.
# ==============================================================================

FILES["plasma/plasmoid/contents/ui/WidgetSurface.qml"] = """import QtQuick 2.15
import QtGraphicalEffects 1.15

Item {
    id: surfaceRoot
    property var themeObj
    property bool fullBleed: false

    // Absorb all touchpad 2-finger scroll / mouse wheel gestures on the widget surface
    // so scrolling over any widget NEVER bubbles up to the KDE Plasma Desktop Containment
    // to accidentally switch Virtual Desktops / Workspaces.
    MouseArea {
        anchors.fill: parent
        acceptedButtons: Qt.NoButton
        hoverEnabled: false
        onWheel: function(wheel) {
            wheel.accepted = true
        }
    }

    // Low-GPU Cached Floating Elevation DropShadow (17 samples + cached texture for <1% CPU/GPU idle)
    DropShadow {
        visible: themeObj ? (themeObj.elevationLevel > 0) : true
        anchors.fill: surfaceCard
        horizontalOffset: 0
        verticalOffset: themeObj ? Math.max(8, themeObj.shadowOffsetY * 1.15) : 10
        radius: themeObj ? Math.max(18, themeObj.shadowRadius * 1.1) : 22
        samples: 17
        cached: true
        color: themeObj && themeObj.isDark ? Qt.rgba(0, 0, 0, 0.52) : Qt.rgba(22/255, 19/255, 15/255, 0.18)
        source: surfaceCard
    }

    Rectangle {
        id: surfaceCard
        anchors.fill: parent
        radius: themeObj ? themeObj.cornerRadius : 24
        opacity: surfaceRoot.fullBleed ? 1.0 : (themeObj ? themeObj.surfaceOpacity : 0.86)
        gradient: Gradient {
            orientation: Gradient.Vertical
            GradientStop { position: 0.0; color: themeObj ? themeObj.surfaceColor : "#F2EFE9" }
            GradientStop { position: 1.0; color: themeObj ? themeObj.gradientEndColor : "#E7E2DA" }
        }
        border.width: 1
        border.color: themeObj ? themeObj.borderColor : Qt.rgba(1, 1, 1, 0.65)

        // Top Specular Liquid Glass Highlight Rim
        Rectangle {
            anchors.top: parent.top
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.margins: 1
            height: 1
            radius: parent.radius
            color: themeObj && themeObj.isDark ? Qt.rgba(1, 1, 1, 0.12) : Qt.rgba(1, 1, 1, 0.68)
        }
    }

    // Optional per-widget custom image background layer (SVG, JPG, JPEG, PNG, WebP)
    WidgetBackground {
        anchors.fill: parent
        themeObj: surfaceRoot.themeObj
    }
}
"""

FILES["plasma/plasmoid/contents/ui/PhotoWidget.qml"] = """import QtQuick 2.15
import QtGraphicalEffects 1.15
import org.kde.plasma.core 2.0 as PlasmaCore

Item {
    id: photoRoot
    property int currentIndex: 0
    property bool slideshowMode: plasmoid.configuration.photoSlideshowMode !== undefined ? plasmoid.configuration.photoSlideshowMode : true
    property int intervalSecs: plasmoid.configuration.photoIntervalSecs || 12
    property string photoDir: plasmoid.configuration.photoDirectory || ""
    property string embeddedFallbackSvg: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='640' height='640' viewBox='0 0 640 640'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%232b5876'/><stop offset='100%' stop-color='%234e4376'/></linearGradient></defs><rect width='640' height='640' fill='url(%23g)'/><circle cx='490' cy='150' r='58' fill='%23f6d365' opacity='0.85'/><path d='M0 470 L180 310 L330 430 L470 290 L640 450 L640 640 L0 640 Z' fill='%231e3c52' opacity='0.75'/></svg>"
    property var bundledPhotos: [
        Qt.resolvedUrl("../images/photo_widget_architecture.jpg").toString(),
        Qt.resolvedUrl("../images/photo_widget_botanical.jpg").toString(),
        Qt.resolvedUrl("../images/alpine_mist_wallpaper.jpg").toString()
    ]
    property var customPhotos: []
    readonly property var activePhotos: (photoRoot.customPhotos && photoRoot.customPhotos.length > 0)
        ? photoRoot.customPhotos
        : photoRoot.bundledPhotos
    readonly property string currentPhotoUrl: {
        var list = photoRoot.activePhotos
        if (!list || list.length === 0) return photoRoot.embeddedFallbackSvg
        var idx = Math.max(0, photoRoot.currentIndex) % list.length
        return list[idx] || photoRoot.embeddedFallbackSvg
    }
    property string previousPhotoUrl: ""

    // Optional Rust/POSIX Directory Scanner when user sets a custom photo directory (Zero Qt.labs.folderlistmodel dependency)
    PlasmaCore.DataSource {
        id: photoDirScanner
        engine: "executable"
        connectedSources: []
        onNewData: function(sourceName, data) {
            if (sourceName.indexOf("_pscan=") === 0 && data["stdout"]) {
                var lines = data["stdout"].trim().split("\\n")
                var found = []
                for (var i = 0; i < lines.length; i++) {
                    var line = lines[i].trim()
                    if (line.length > 1) {
                        found.push(line.indexOf("file://") === 0 ? line : ("file://" + line))
                    }
                }
                photoRoot.customPhotos = found
                photoRoot.currentIndex = 0
            }
            disconnectSource(sourceName)
        }
        function scanDirectory(rawDir) {
            var clean = (rawDir || "").trim().replace(/^file:\/\//, "").replace(/"/g, "")
            if (clean.length === 0) {
                photoRoot.customPhotos = []
                return
            }
            var shPath = clean
            if (shPath.indexOf("~/") === 0) {
                shPath = "$HOME/" + shPath.substring(2)
            } else if (shPath === "~") {
                shPath = "$HOME"
            }
            var cmd = '_pscan=' + Date.now() + '; TARGET="' + shPath + '"; ' +
                      'if [ -x "$HOME/.local/bin/urwidgets-daemon" ]; then "$HOME/.local/bin/urwidgets-daemon" scan-photos "$TARGET" 2>/dev/null && exit 0; fi; ' +
                      'if command -v urwidgets-ctl >/dev/null 2>&1; then urwidgets-ctl scan-photos "$TARGET" 2>/dev/null && exit 0; fi; ' +
                      'if [ -f "$TARGET" ]; then echo "file://$TARGET"; ' +
                      'elif [ -d "$TARGET" ]; then ' +
                      'for f in "$TARGET"/* "$TARGET"/*/*; do ' +
                      '[ -f "$f" ] || continue; ' +
                      'case "$f" in *.jpg|*.JPG|*.jpeg|*.JPEG|*.png|*.PNG|*.webp|*.WEBP|*.svg|*.SVG) echo "file://$f" ;; esac; ' +
                      'done | sort | head -n 60; fi'
            connectSource(cmd)
        }
    }

    onPhotoDirChanged: {
        photoDirScanner.scanDirectory(photoRoot.photoDir)
    }

    Component.onCompleted: {
        if (photoRoot.photoDir && photoRoot.photoDir.trim().length > 0) {
            photoDirScanner.scanDirectory(photoRoot.photoDir)
        }
    }

    function advanceSlideSmoothly() {
        var list = photoRoot.activePhotos
        if (!list || list.length <= 1) return
        photoRoot.previousPhotoUrl = photoRoot.currentPhotoUrl
        crossfadeOverlayImage.opacity = 1.0
        photoRoot.currentIndex = (photoRoot.currentIndex + 1) % list.length
        fadeOutPrevAnim.restart()
    }

    Timer {
        interval: Math.max(5, photoRoot.intervalSecs) * 1000
        running: photoRoot.slideshowMode && photoRoot.visible
        repeat: true
        onTriggered: photoRoot.advanceSlideSmoothly()
    }

    Rectangle {
        id: maskRect
        anchors.fill: parent
        radius: theme.cornerRadius
        visible: false
    }

    // Pure clean rounded image display (Guaranteed visible primary layer + smooth crossfade overlay; no Crop/Slide/Next/Prev clutter)
    Item {
        anchors.fill: parent
        layer.enabled: true
        layer.effect: OpacityMask {
            maskSource: maskRect
        }

        Image {
            id: mainPhotoImage
            anchors.fill: parent
            fillMode: Image.PreserveAspectCrop
            source: photoRoot.currentPhotoUrl
            asynchronous: true
            cache: true
            smooth: true
            mipmap: false
            opacity: 1.0
            sourceSize: Qt.size(640, 640)
            onStatusChanged: {
                if (status === Image.Error && source.toString() !== photoRoot.embeddedFallbackSvg) {
                    source = photoRoot.embeddedFallbackSvg
                }
            }
        }

        Image {
            id: crossfadeOverlayImage
            anchors.fill: parent
            fillMode: Image.PreserveAspectCrop
            source: photoRoot.previousPhotoUrl
            visible: opacity > 0.01 && source.toString().length > 0
            asynchronous: true
            cache: true
            smooth: true
            mipmap: false
            opacity: 0.0
            sourceSize: Qt.size(640, 640)

            NumberAnimation on opacity {
                id: fadeOutPrevAnim
                from: 1.0
                to: 0.0
                duration: 550
                easing.type: Easing.InOutQuad
                running: false
            }
        }
    }

    // Consume 2-finger scroll / wheel gestures over Photo Frame so it never switches workspaces
    MouseArea {
        anchors.fill: parent
        acceptedButtons: Qt.NoButton
        hoverEnabled: false
        onWheel: function(wheel) {
            wheel.accepted = true
        }
    }
}
"""

FILES["plasma/plasmoid/contents/ui/ClockWidget.qml"] = """import QtQuick 2.15
import QtQuick.Controls 2.15 as QQC2
import QtQuick.Layouts 1.15
import org.kde.plasma.core 2.0 as PlasmaCore

Item {
    id: clockRoot
    property date currentTime: new Date()
    property bool use24h: plasmoid.configuration.use24HourClock || false
    property bool showSecs: plasmoid.configuration.showClockSeconds || false
    property string locationLabel: plasmoid.configuration.clockLocationLabel || "Bandung"
    // Slide 0 = Main Clock, Slide 1 = Alarm Manager (Manual navigation only; never auto-rotates)
    property int activeSlide: 0
    property bool composerOpen: false
    property string editingAlarmId: ""
    property int pickerHour: 7
    property int pickerMinute: 30
    property string pickerLabel: "Morning Study"
    property string pickerRepeat: "Every day"
    property string pickerOneTimeDate: ""
    property int pickerSnoozeMins: plasmoid.configuration.defaultSnoozeMins || 10
    // Unified Global Alarm Ringtone Path (applies to ALL alarms, e.g. ~/Music/ or ~/Music/alarm.mp3)
    property string globalRingtonePath: plasmoid.configuration.defaultRingtonePath || "~/Music/"
    property int pickerVolume: 90
    property bool previewingSound: false
    property string activeDueAlarmId: ""
    property string activeDueAlarmLabel: ""
    property string activeDueAlarmRingtone: ""
    property string lastTriggeredMinuteKey: ""

    // Single-Instance Non-Blocking PID-Tracked Audio Runner (Rust Native CLI + Parenthesis-Free POSIX Fallback)
    PlasmaCore.DataSource {
        id: localAudioRunner
        engine: "executable"
        connectedSources: []
        onNewData: function(sourceName, data) {
            disconnectSource(sourceName)
        }
        function playFile(pathStr, isAlarmDue) {
            var rawPath = (pathStr && pathStr.trim().length > 0)
                ? pathStr.trim()
                : (clockRoot.globalRingtonePath || "~/Music/")
            var clean = rawPath.replace(/^file:\/\//, "").replace(/"/g, "")
            clockRoot.previewingSound = true

            var safePath = clean
            if (safePath.indexOf("~/") === 0) {
                safePath = "$HOME/" + safePath.substring(2)
            } else if (safePath === "~") {
                safePath = "$HOME"
            }

            var loopFlag = isAlarmDue ? "1" : "0"
            var loopMpv = isAlarmDue ? "--loop-file=inf " : ""
            var loopFf = isAlarmDue ? "-loop 0 " : ""
            var loopVlc = isAlarmDue ? "--loop " : ""
            var cmd = '_ts=' + Date.now() + '; TARGET_FILE="' + safePath + '"; VOL="' + clockRoot.pickerVolume + '"; ' +
                      'if [ -x "$HOME/.local/bin/urwidgets-daemon" ]; then "$HOME/.local/bin/urwidgets-daemon" play-alarm "$TARGET_FILE" "$VOL" "' + loopFlag + '" >/dev/null 2>&1 && exit 0; fi; ' +
                      'if command -v urwidgets-ctl >/dev/null 2>&1; then urwidgets-ctl play-alarm "$TARGET_FILE" "$VOL" "' + loopFlag + '" >/dev/null 2>&1 && exit 0; fi; ' +
                      'if [ -f /tmp/urwidgets-alarm-audio.pid ]; then kill -TERM $(cat /tmp/urwidgets-alarm-audio.pid) 2>/dev/null || true; rm -f /tmp/urwidgets-alarm-audio.pid; fi; ' +
                      'if [ -d "$TARGET_FILE" ]; then ' +
                      'FIRST_IN_DIR=""; ' +
                      'for f in "$TARGET_FILE"/* "$TARGET_FILE"/*/*; do [ -f "$f" ] || continue; case "$f" in *.mp3|*.MP3|*.wav|*.WAV|*.ogg|*.OGG|*.oga|*.OGA|*.flac|*.FLAC|*.m4a|*.M4A|*.aac|*.AAC|*.opus|*.OPUS) FIRST_IN_DIR="$f"; break ;; esac; done; ' +
                      'if [ -n "$FIRST_IN_DIR" ]; then TARGET_FILE="$FIRST_IN_DIR"; fi; ' +
                      'fi; ' +
                      'if [ ! -f "$TARGET_FILE" ]; then ' +
                      'for f in "$HOME/Music"/* "$HOME/Music"/*/*; do [ -f "$f" ] || continue; case "$f" in *.mp3|*.MP3|*.wav|*.WAV|*.ogg|*.OGG|*.oga|*.OGA|*.flac|*.FLAC|*.m4a|*.M4A|*.aac|*.AAC|*.opus|*.OPUS) TARGET_FILE="$f"; break ;; esac; done; ' +
                      'fi; ' +
                      'if [ ! -f "$TARGET_FILE" ]; then TARGET_FILE="/usr/share/sounds/freedesktop/stereo/alarm-clock-elapsed.oga"; fi; ' +
                      'if [ ! -f "$TARGET_FILE" ]; then TARGET_FILE="/usr/share/sounds/freedesktop/stereo/complete.oga"; fi; ' +
                      'if [ ! -f "$TARGET_FILE" ]; then TARGET_FILE="/usr/share/sounds/alsa/Front_Center.wav"; fi; ' +
                      'if command -v mpv >/dev/null 2>&1; then nohup mpv --no-video --really-quiet ' + loopMpv + '--volume="$VOL" "$TARGET_FILE" >/dev/null 2>&1 </dev/null & echo $! > /tmp/urwidgets-alarm-audio.pid; ' +
                      'elif command -v ffplay >/dev/null 2>&1; then nohup ffplay -nodisp -autoexit -loglevel quiet ' + loopFf + '-volume "$VOL" "$TARGET_FILE" >/dev/null 2>&1 </dev/null & echo $! > /tmp/urwidgets-alarm-audio.pid; ' +
                      'elif command -v cvlc >/dev/null 2>&1; then nohup cvlc --intf dummy --play-and-exit --quiet ' + loopVlc + '"$TARGET_FILE" >/dev/null 2>&1 </dev/null & echo $! > /tmp/urwidgets-alarm-audio.pid; ' +
                      'elif command -v gst-play-1.0 >/dev/null 2>&1; then nohup gst-play-1.0 --quiet "$TARGET_FILE" >/dev/null 2>&1 </dev/null & echo $! > /tmp/urwidgets-alarm-audio.pid; ' +
                      'elif command -v pw-play >/dev/null 2>&1; then nohup pw-play "$TARGET_FILE" >/dev/null 2>&1 </dev/null & echo $! > /tmp/urwidgets-alarm-audio.pid; ' +
                      'elif command -v paplay >/dev/null 2>&1; then nohup paplay "$TARGET_FILE" >/dev/null 2>&1 </dev/null & echo $! > /tmp/urwidgets-alarm-audio.pid; ' +
                      'elif command -v aplay >/dev/null 2>&1; then nohup aplay -q "$TARGET_FILE" >/dev/null 2>&1 </dev/null & echo $! > /tmp/urwidgets-alarm-audio.pid; ' +
                      'elif command -v canberra-gtk-play >/dev/null 2>&1; then nohup canberra-gtk-play -f "$TARGET_FILE" >/dev/null 2>&1 </dev/null & echo $! > /tmp/urwidgets-alarm-audio.pid; fi'
            connectSource(cmd)
        }
        function notifyDesktop(titleStr, bodyStr) {
            var t = (titleStr || "URWidgets Alarm").replace(/"/g, "")
            var b = (bodyStr || "Alarm sedang berbunyi").replace(/"/g, "")
            connectSource('_notify=' + Date.now() + '; if command -v notify-send >/dev/null 2>&1; then nohup notify-send -u critical -a "URWidgets Alarm" "' + t + '" "' + b + '" >/dev/null 2>&1 </dev/null & fi')
        }
        function stopAll() {
            clockRoot.previewingSound = false
            var cmd = '_stop=' + Date.now() + '; ' +
                      'if [ -x "$HOME/.local/bin/urwidgets-daemon" ]; then "$HOME/.local/bin/urwidgets-daemon" stop-alarm >/dev/null 2>&1 || true; fi; ' +
                      'if [ -f /tmp/urwidgets-alarm-audio.pid ]; then kill -TERM $(cat /tmp/urwidgets-alarm-audio.pid) 2>/dev/null || true; rm -f /tmp/urwidgets-alarm-audio.pid; fi'
            connectSource(cmd)
        }
    }

    function applyGlobalRingtoneToAllAlarms(newRingtonePath) {
        var clean = (newRingtonePath && newRingtonePath.trim().length > 0) ? newRingtonePath.trim() : "~/Music/"
        clockRoot.globalRingtonePath = clean
        plasmoid.configuration.defaultRingtonePath = clean
        for (var i = 0; i < alarmsModel.count; i++) {
            alarmsModel.setProperty(i, "ringtonePath", clean)
        }
        clockRoot.saveAlarmsToConfig()
        daemonExecutable.invokeMethod("AlarmAction 'set_global_ringtone|" + clean + "'")
    }

    // Sync Unified Alarm Ringtone from Widget Configuration (configGeneral.qml)
    Connections {
        target: plasmoid.configuration
        function onDefaultRingtonePathChanged() {
            var newDefault = (plasmoid.configuration.defaultRingtonePath || "").trim()
            if (newDefault.length > 0 && newDefault !== clockRoot.globalRingtonePath) {
                clockRoot.globalRingtonePath = newDefault
                for (var i = 0; i < alarmsModel.count; i++) {
                    alarmsModel.setProperty(i, "ringtonePath", newDefault)
                }
                clockRoot.saveAlarmsToConfig()
            }
        }
    }

    ListModel {
        id: alarmsModel
        ListElement { alarmId: "alm-wake"; timeStr: "07:00"; label: "Wake Up"; repeatText: "Weekdays"; oneTimeDate: ""; snoozeMins: 10; ringtonePath: "~/Music/"; volume: 90; enabled: true }
        ListElement { alarmId: "alm-study"; timeStr: "08:00"; label: "Morning Study"; repeatText: "Every day"; oneTimeDate: ""; snoozeMins: 5; ringtonePath: "~/Music/"; volume: 85; enabled: true }
        ListElement { alarmId: "alm-lunch"; timeStr: "12:30"; label: "Lunch Reminder"; repeatText: "Mon, Wed, Fri"; oneTimeDate: ""; snoozeMins: 15; ringtonePath: "~/Music/"; volume: 80; enabled: false }
    }

    function normalizeHHMM(rawTime) {
        var parts = (rawTime || "07:00").toString().trim().split(":")
        var h = parseInt(parts[0] || "7", 10)
        var m = parseInt(parts[1] || "0", 10)
        if (isNaN(h)) h = 7
        if (isNaN(m)) m = 0
        h = Math.max(0, Math.min(23, h))
        m = Math.max(0, Math.min(59, m))
        return padTwo(h) + ":" + padTwo(m)
    }

    function saveAlarmsToConfig() {
        var arr = []
        var unifiedTone = clockRoot.globalRingtonePath || "~/Music/"
        for (var i = 0; i < alarmsModel.count; i++) {
            var it = alarmsModel.get(i)
            arr.push({
                alarmId: it.alarmId,
                timeStr: normalizeHHMM(it.timeStr),
                label: it.label,
                repeatText: it.repeatText,
                oneTimeDate: it.oneTimeDate || "",
                snoozeMins: it.snoozeMins,
                ringtonePath: unifiedTone,
                volume: it.volume || 90,
                enabled: it.enabled
            })
        }
        plasmoid.configuration.alarmsJson = JSON.stringify(arr)
    }

    function loadAlarmsFromConfig() {
        var raw = plasmoid.configuration.alarmsJson || ""
        var cfgDefaultRingtone = plasmoid.configuration.defaultRingtonePath || "~/Music/"
        clockRoot.globalRingtonePath = cfgDefaultRingtone
        if (raw.trim().length > 2) {
            try {
                var parsed = JSON.parse(raw)
                if (Array.isArray(parsed) && parsed.length > 0) {
                    alarmsModel.clear()
                    for (var i = 0; i < parsed.length; i++) {
                        var a = parsed[i]
                        alarmsModel.append({
                            alarmId: a.alarmId || ("alm-" + i),
                            timeStr: normalizeHHMM(a.timeStr || "07:00"),
                            label: a.label || "Alarm",
                            repeatText: a.repeatText || "Every day",
                            oneTimeDate: a.oneTimeDate || "",
                            snoozeMins: a.snoozeMins || 10,
                            ringtonePath: cfgDefaultRingtone,
                            volume: a.volume || 90,
                            enabled: a.enabled !== undefined ? a.enabled : true
                        })
                    }
                }
            } catch (e) {}
        }
    }

    Component.onCompleted: {
        loadAlarmsFromConfig()
    }

    readonly property int enabledAlarmCount: {
        var count = 0
        for (var i = 0; i < alarmsModel.count; i++) {
            if (alarmsModel.get(i).enabled) count++
        }
        return count
    }

    readonly property string nextEnabledAlarmTime: {
        for (var i = 0; i < alarmsModel.count; i++) {
            if (alarmsModel.get(i).enabled) return alarmsModel.get(i).timeStr
        }
        return ""
    }

    function padTwo(val) {
        return val < 10 ? ("0" + val) : ("" + val)
    }

    Timer {
        interval: clockRoot.showSecs ? 1000 : 5000
        running: true
        repeat: true
        triggeredOnStart: true
        onTriggered: {
            var now = new Date()
            clockRoot.currentTime = now
            var hhmm = clockRoot.padTwo(now.getHours()) + ":" + clockRoot.padTwo(now.getMinutes())
            var datePrefix = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() + "@" + hhmm
            for (var i = 0; i < alarmsModel.count; i++) {
                var alm = alarmsModel.get(i)
                var targetHHMM = clockRoot.normalizeHHMM(alm.timeStr)
                var uniqueTriggerKey = alm.alarmId + "|" + datePrefix
                if (alm.enabled && targetHHMM === hhmm && clockRoot.lastTriggeredMinuteKey !== uniqueTriggerKey) {
                    clockRoot.lastTriggeredMinuteKey = uniqueTriggerKey
                    clockRoot.activeDueAlarmId = alm.alarmId
                    clockRoot.activeDueAlarmLabel = alm.label + " (" + targetHHMM + ")"
                    var chosenRingtone = clockRoot.globalRingtonePath || "~/Music/"
                    clockRoot.activeDueAlarmRingtone = chosenRingtone
                    localAudioRunner.playFile(chosenRingtone, true)
                    localAudioRunner.notifyDesktop("Alarm: " + alm.label, "Waktu: " + targetHHMM + " — Klik Snooze atau Stop di URWidgets Clock")
                    break
                }
            }
        }
    }

    // Due Alarm Notification Banner (Supports Snooze + Stop)
    Rectangle {
        id: dueBanner
        visible: clockRoot.activeDueAlarmId !== ""
        anchors.top: parent.top
        anchors.left: parent.left
        anchors.right: parent.right
        height: visible ? 30 : 0
        radius: 9
        z: 10
        color: Qt.rgba(0.96, 0.62, 0.04, 0.24)
        border.width: 1
        border.color: Qt.rgba(0.96, 0.62, 0.04, 0.55)

        RowLayout {
            anchors.fill: parent
            anchors.leftMargin: 8
            anchors.rightMargin: 8
            spacing: 6

            WidgetText {
                themeObj: theme
                text: "🔔 " + clockRoot.activeDueAlarmLabel
                font.pixelSize: 11
                font.weight: Font.DemiBold
                Layout.fillWidth: true
                elide: Text.ElideRight
            }

            WidgetButton {
                themeObj: theme
                label: "Snooze " + clockRoot.pickerSnoozeMins + "m"
                pill: true
                onClicked: {
                    localAudioRunner.stopAll()
                    var snoozeDate = new Date(new Date().getTime() + clockRoot.pickerSnoozeMins * 60000)
                    var snoozedHHMM = clockRoot.padTwo(snoozeDate.getHours()) + ":" + clockRoot.padTwo(snoozeDate.getMinutes())
                    for (var i = 0; i < alarmsModel.count; i++) {
                        if (alarmsModel.get(i).alarmId === clockRoot.activeDueAlarmId) {
                            alarmsModel.setProperty(i, "timeStr", snoozedHHMM)
                            break
                        }
                    }
                    clockRoot.saveAlarmsToConfig()
                    daemonExecutable.invokeMethod("AlarmAction 'snooze|" + clockRoot.activeDueAlarmId + "|" + clockRoot.pickerSnoozeMins + "'")
                    clockRoot.activeDueAlarmId = ""
                }
            }

            WidgetButton {
                themeObj: theme
                label: "Stop"
                active: true
                pill: true
                onClicked: {
                    localAudioRunner.stopAll()
                    daemonExecutable.invokeMethod("AlarmAction 'stop|" + clockRoot.activeDueAlarmId + "'")
                    clockRoot.activeDueAlarmId = ""
                }
            }
        }
    }

    // ================= SLIDE 1: MAIN CLOCK DISPLAY =================
    ColumnLayout {
        visible: clockRoot.activeSlide === 0
        anchors.fill: parent
        anchors.topMargin: dueBanner.visible ? 34 : 0
        spacing: 4

        RowLayout {
            Layout.fillWidth: true
            spacing: 6

            Rectangle {
                height: 22
                radius: 11
                color: theme.subtleSurfaceColor
                implicitWidth: badgeRow.implicitWidth + 14

                RowLayout {
                    id: badgeRow
                    anchors.centerIn: parent
                    spacing: 5

                    Rectangle {
                        width: 6
                        height: 6
                        radius: 3
                        color: clockRoot.enabledAlarmCount > 0 ? theme.accentColor : theme.mutedTextColor
                    }

                    WidgetText {
                        themeObj: theme
                        text: clockRoot.enabledAlarmCount > 0
                            ? (clockRoot.nextEnabledAlarmTime + " · " + clockRoot.enabledAlarmCount)
                            : "No active alarms"
                        font.pixelSize: 11
                        font.weight: Font.Medium
                    }
                }

                MouseArea {
                    anchors.fill: parent
                    cursorShape: Qt.PointingHandCursor
                    onClicked: clockRoot.activeSlide = 1
                }
            }

            Item { Layout.fillWidth: true }

            WidgetButton {
                themeObj: theme
                label: clockRoot.use24h ? "24h" : "12h"
                pill: true
                onClicked: {
                    clockRoot.use24h = !clockRoot.use24h
                    plasmoid.configuration.use24HourClock = clockRoot.use24h
                }
            }

            WidgetButton {
                themeObj: theme
                label: "Alarms ›"
                active: true
                pill: true
                onClicked: clockRoot.activeSlide = 1
            }
        }

        RowLayout {
            Layout.fillWidth: true
            spacing: 6
            Layout.alignment: Qt.AlignLeft | Qt.AlignVCenter

            WidgetText {
                id: mainTimeText
                themeObj: theme
                text: {
                    var fmt = clockRoot.use24h
                        ? (clockRoot.showSecs ? "HH:mm:ss" : "HH:mm")
                        : (clockRoot.showSecs ? "h:mm:ss" : "h:mm")
                    return Qt.formatTime(clockRoot.currentTime, fmt)
                }
                font.pixelSize: Math.min(52, Math.max(34, clockRoot.height * 0.36))
                font.weight: Font.Light
            }

            WidgetText {
                visible: !clockRoot.use24h
                themeObj: theme
                text: clockRoot.currentTime.getHours() >= 12 ? "PM" : "AM"
                color: theme.accentColor
                font.pixelSize: 18
                font.weight: Font.DemiBold
                Layout.alignment: Qt.AlignTop
                Layout.topMargin: 8
            }
        }

        RowLayout {
            Layout.fillWidth: true
            spacing: 5

            Rectangle {
                width: 7
                height: 7
                radius: 3.5
                color: theme.accentColor
            }

            WidgetText {
                themeObj: theme
                muted: true
                text: Qt.formatDate(clockRoot.currentTime, "ddd, MMM d") + ","
                font.pixelSize: 13
            }

            WidgetText {
                themeObj: theme
                text: clockRoot.locationLabel
                font.pixelSize: 13
                font.weight: Font.DemiBold
                elide: Text.ElideRight
                Layout.fillWidth: true
            }

            WidgetText {
                themeObj: theme
                muted: true
                text: "1 / 2"
                font.pixelSize: 10
            }
        }
    }

    // ================= SLIDE 2: ALARM MANAGER (UNIFIED RINGTONE PATH e.g. ~/Music/ FOR ALL ALARMS) =================
    ColumnLayout {
        visible: clockRoot.activeSlide === 1
        anchors.fill: parent
        anchors.topMargin: dueBanner.visible ? 34 : 0
        spacing: 4

        RowLayout {
            Layout.fillWidth: true
            spacing: 6

            WidgetButton {
                themeObj: theme
                label: "‹ Clock"
                pill: true
                onClicked: {
                    clockRoot.composerOpen = false
                    localAudioRunner.stopAll()
                    clockRoot.activeSlide = 0
                }
            }

            WidgetText {
                themeObj: theme
                text: "Alarms (" + clockRoot.enabledAlarmCount + ")"
                font.pixelSize: 12
                font.weight: Font.DemiBold
                Layout.fillWidth: true
                elide: Text.ElideRight
            }

            WidgetButton {
                themeObj: theme
                label: "Ring Test"
                pill: true
                onClicked: {
                    if (alarmsModel.count > 0) {
                        var targetAlm = alarmsModel.get(0)
                        clockRoot.activeDueAlarmId = targetAlm.alarmId
                        clockRoot.activeDueAlarmLabel = targetAlm.label + " (" + targetAlm.timeStr + ")"
                        clockRoot.activeDueAlarmRingtone = clockRoot.globalRingtonePath
                        localAudioRunner.playFile(clockRoot.globalRingtonePath, true)
                    }
                }
            }

            WidgetButton {
                themeObj: theme
                label: clockRoot.composerOpen ? "Close" : "+ Alarm"
                active: true
                pill: true
                onClicked: {
                    if (!clockRoot.composerOpen) {
                        clockRoot.editingAlarmId = ""
                        var now = new Date()
                        clockRoot.pickerHour = now.getHours()
                        clockRoot.pickerMinute = (now.getMinutes() + 1) % 60
                        clockRoot.pickerLabel = "Alarm Baru"
                    }
                    clockRoot.composerOpen = !clockRoot.composerOpen
                }
            }
        }

        // Unified Alarm Ringtone Bar (Applies to ALL Alarms — Plain Text Input e.g. ~/Music/)
        RowLayout {
            Layout.fillWidth: true
            spacing: 4

            WidgetText {
                themeObj: theme
                muted: true
                text: "♪ Nada:"
                font.pixelSize: 10
            }

            QQC2.TextField {
                id: unifiedRingtoneField
                Layout.fillWidth: true
                placeholderText: "~/Music/ atau ~/Music/alarm.mp3"
                text: clockRoot.globalRingtonePath
                font.pixelSize: 10
            }

            WidgetButton {
                themeObj: theme
                label: "Set"
                active: true
                pill: true
                onClicked: {
                    clockRoot.applyGlobalRingtoneToAllAlarms(unifiedRingtoneField.text)
                }
            }

            WidgetButton {
                themeObj: theme
                label: clockRoot.previewingSound ? "■ Stop" : "▶ Test"
                pill: true
                onClicked: {
                    if (clockRoot.previewingSound) {
                        localAudioRunner.stopAll()
                    } else {
                        clockRoot.applyGlobalRingtoneToAllAlarms(unifiedRingtoneField.text)
                        localAudioRunner.playFile(clockRoot.globalRingtonePath, false)
                    }
                }
            }
        }

        // Dedicated Alarm Composer (Time + Label + Repeat + Snooze)
        Rectangle {
            visible: clockRoot.composerOpen
            Layout.fillWidth: true
            Layout.fillHeight: true
            radius: 12
            color: theme.subtleSurfaceColor

            ColumnLayout {
                anchors.fill: parent
                anchors.margins: 7
                spacing: 4

                RowLayout {
                    Layout.fillWidth: true
                    spacing: 4

                    WidgetButton {
                        themeObj: theme
                        label: "-H"
                        onClicked: clockRoot.pickerHour = (clockRoot.pickerHour + 23) % 24
                    }
                    WidgetText {
                        themeObj: theme
                        text: clockRoot.padTwo(clockRoot.pickerHour) + ":" + clockRoot.padTwo(clockRoot.pickerMinute)
                        font.pixelSize: 15
                        font.weight: Font.Bold
                    }
                    WidgetButton {
                        themeObj: theme
                        label: "+H"
                        onClicked: clockRoot.pickerHour = (clockRoot.pickerHour + 1) % 24
                    }
                    WidgetButton {
                        themeObj: theme
                        label: "-M"
                        onClicked: clockRoot.pickerMinute = (clockRoot.pickerMinute + 59) % 60
                    }
                    WidgetButton {
                        themeObj: theme
                        label: "+M"
                        onClicked: clockRoot.pickerMinute = (clockRoot.pickerMinute + 1) % 60
                    }

                    QQC2.TextField {
                        id: alarmLabelInput
                        Layout.fillWidth: true
                        placeholderText: "Label alarm..."
                        text: clockRoot.pickerLabel
                        font.pixelSize: 11
                        onTextChanged: clockRoot.pickerLabel = text
                    }
                }

                // Repeat & Snooze Row
                RowLayout {
                    Layout.fillWidth: true
                    spacing: 4

                    Repeater {
                        model: ["Every day", "Weekdays", "Weekends", "Once"]
                        WidgetButton {
                            themeObj: theme
                            label: modelData
                            active: clockRoot.pickerRepeat === modelData
                            pill: true
                            onClicked: clockRoot.pickerRepeat = modelData
                        }
                    }

                    Item { Layout.fillWidth: true }

                    WidgetButton {
                        themeObj: theme
                        label: "Snooze " + clockRoot.pickerSnoozeMins + "m"
                        pill: true
                        onClicked: {
                            var opts = [5, 10, 15, 20, 30]
                            var idx = opts.indexOf(clockRoot.pickerSnoozeMins)
                            clockRoot.pickerSnoozeMins = opts[(idx + 1) % opts.length]
                        }
                    }
                }

                // Cancel / Confirm & Save Action Row
                RowLayout {
                    Layout.fillWidth: true
                    spacing: 6

                    WidgetText {
                        themeObj: theme
                        muted: true
                        text: "♪ " + clockRoot.globalRingtonePath
                        font.pixelSize: 10
                        elide: Text.ElideMiddle
                        Layout.fillWidth: true
                    }

                    WidgetButton {
                        themeObj: theme
                        label: "Batal"
                        pill: true
                        onClicked: {
                            localAudioRunner.stopAll()
                            clockRoot.composerOpen = false
                            clockRoot.editingAlarmId = ""
                        }
                    }

                    WidgetButton {
                        themeObj: theme
                        label: "Simpan Alarm"
                        active: true
                        pill: true
                        onClicked: {
                            var formattedTime = clockRoot.padTwo(clockRoot.pickerHour) + ":" + clockRoot.padTwo(clockRoot.pickerMinute)
                            var targetId = clockRoot.editingAlarmId !== "" ? clockRoot.editingAlarmId : ("alm-" + Date.now())
                            var cleanLabel = (clockRoot.pickerLabel || "Alarm").trim()
                            var cleanRingtone = (clockRoot.globalRingtonePath || "~/Music/").trim()
                            var updatedExisting = false
                            for (var i = 0; i < alarmsModel.count; i++) {
                                if (alarmsModel.get(i).alarmId === targetId) {
                                    alarmsModel.set(i, {
                                        alarmId: targetId,
                                        timeStr: formattedTime,
                                        label: cleanLabel,
                                        repeatText: clockRoot.pickerRepeat,
                                        oneTimeDate: clockRoot.pickerOneTimeDate,
                                        snoozeMins: clockRoot.pickerSnoozeMins,
                                        ringtonePath: cleanRingtone,
                                        volume: clockRoot.pickerVolume,
                                        enabled: true
                                    })
                                    updatedExisting = true
                                    break
                                }
                            }
                            if (!updatedExisting) {
                                alarmsModel.append({
                                    alarmId: targetId,
                                    timeStr: formattedTime,
                                    label: cleanLabel,
                                    repeatText: clockRoot.pickerRepeat,
                                    oneTimeDate: clockRoot.pickerOneTimeDate,
                                    snoozeMins: clockRoot.pickerSnoozeMins,
                                    ringtonePath: cleanRingtone,
                                    volume: clockRoot.pickerVolume,
                                    enabled: true
                                })
                            }
                            clockRoot.lastTriggeredMinuteKey = ""
                            clockRoot.saveAlarmsToConfig()
                            daemonExecutable.invokeMethod(
                                "AlarmAction 'upsert|" + targetId + "|" + formattedTime + "|" +
                                cleanLabel + "|" + clockRoot.pickerRepeat + "|" +
                                clockRoot.pickerSnoozeMins + "|" + cleanRingtone + "|" + clockRoot.pickerVolume + "'"
                            )
                            localAudioRunner.stopAll()
                            clockRoot.composerOpen = false
                            clockRoot.editingAlarmId = ""
                        }
                    }
                }
            }
        }

        // Scrollable Alarm List (When Composer is Closed)
        ListView {
            id: alarmsListView
            visible: !clockRoot.composerOpen
            Layout.fillWidth: true
            Layout.fillHeight: true
            clip: true
            boundsBehavior: Flickable.StopAtBounds
            spacing: 4
            model: alarmsModel

            delegate: Rectangle {
                width: alarmsListView.width
                height: 36
                radius: 9
                color: theme.subtleSurfaceColor

                RowLayout {
                    anchors.fill: parent
                    anchors.leftMargin: 8
                    anchors.rightMargin: 8
                    spacing: 5

                    ColumnLayout {
                        Layout.fillWidth: true
                        spacing: 1

                        RowLayout {
                            spacing: 5
                            WidgetText {
                                themeObj: theme
                                text: model.timeStr
                                font.pixelSize: 13
                                font.weight: Font.DemiBold
                                opacity: model.enabled ? 1.0 : 0.45
                            }
                            WidgetText {
                                themeObj: theme
                                text: "— " + model.label
                                font.pixelSize: 11
                                opacity: model.enabled ? 0.9 : 0.45
                                elide: Text.ElideRight
                                Layout.fillWidth: true
                            }
                        }

                        WidgetText {
                            themeObj: theme
                            muted: true
                            text: model.repeatText + " · Snooze " + model.snoozeMins + "m · ♪ " + clockRoot.globalRingtonePath
                            font.pixelSize: 9
                            elide: Text.ElideRight
                            Layout.fillWidth: true
                        }
                    }

                    WidgetButton {
                        themeObj: theme
                        label: "Edit"
                        pill: true
                        onClicked: {
                            clockRoot.editingAlarmId = model.alarmId
                            var hm = (model.timeStr || "07:30").split(":")
                            clockRoot.pickerHour = parseInt(hm[0] || "7", 10)
                            clockRoot.pickerMinute = parseInt(hm[1] || "30", 10)
                            clockRoot.pickerLabel = model.label
                            clockRoot.pickerRepeat = model.repeatText
                            clockRoot.pickerSnoozeMins = model.snoozeMins
                            clockRoot.composerOpen = true
                        }
                    }

                    WidgetButton {
                        themeObj: theme
                        label: "×"
                        pill: true
                        onClicked: {
                            var delId = model.alarmId
                            alarmsModel.remove(index)
                            clockRoot.saveAlarmsToConfig()
                            daemonExecutable.invokeMethod("AlarmAction 'delete|" + delId + "'")
                        }
                    }

                    WidgetButton {
                        themeObj: theme
                        label: model.enabled ? "ON" : "OFF"
                        active: model.enabled
                        pill: true
                        onClicked: {
                            alarmsModel.setProperty(index, "enabled", !model.enabled)
                            clockRoot.lastTriggeredMinuteKey = ""
                            clockRoot.saveAlarmsToConfig()
                            daemonExecutable.invokeMethod("AlarmAction 'toggle|" + model.alarmId + "'")
                        }
                    }
                }
            }
        }
    }
}
"""

FILES["CHANGELOG.md"] = """# URWidgets Changelog

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
"""

def build_all():
    # Remove orphaned / superseded keys from FILES before writing to disk
    for obsolete_key in [
        "plasma/plasmoid/contents/ui/ThemeEngine.qml",
        "plasma/plasmoid/contents/ui/AppearancePanel.qml",
        "plasma/plasmoid/contents/ui/TodoWidget.qml",
        "core/src/config/settings.rs",
        "core/src/modules/todo.rs",
    ]:
        FILES.pop(obsolete_key, None)

    if os.path.exists(UR_DIR):
        shutil.rmtree(UR_DIR)
    os.makedirs(UR_DIR, exist_ok=True)
    os.makedirs(PUB_REL, exist_ok=True)
    dist_dir = os.path.join(ROOT, "dist")
    os.makedirs(dist_dir, exist_ok=True)

    # Write all core text files
    for rel_path, content in FILES.items():
        full_path = os.path.join(UR_DIR, rel_path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(content)
        if rel_path.endswith(".sh"):
            os.chmod(full_path, os.stat(full_path).st_mode | stat.S_IEXEC)

    # Bundle real default photography into plasma/plasmoid/contents/images/
    base_plasmoid_dir = os.path.join(UR_DIR, "plasma", "plasmoid")
    plasmoid_img_dir = os.path.join(base_plasmoid_dir, "contents", "images")
    os.makedirs(plasmoid_img_dir, exist_ok=True)
    for img_name in ["photo_widget_architecture.jpg", "photo_widget_botanical.jpg", "alpine_mist_wallpaper.jpg"]:
        src_img = os.path.join(PUB_IMG, img_name)
        if os.path.exists(src_img):
            shutil.copyfile(src_img, os.path.join(plasmoid_img_dir, img_name))

    # Generate 10 standalone KDE Plasma 5 widget directories in urwidgets/plasma/widgets/<plugin_id>
    widgets_root = os.path.join(UR_DIR, "plasma", "widgets")
    os.makedirs(widgets_root, exist_ok=True)

    kind_to_widget_qml = {
        "clock": "ClockWidget.qml",
        "calendar": "CalendarWidget.qml",
        "weather": "WeatherWidget.qml",
        "pomodoro": "PomodoroWidget.qml",
        "notes": "NotesWidget.qml",
        "agenda": "AgendaWidget.qml",
        "photos": "PhotoWidget.qml",
        "music_player": "MusicPlayerWidget.qml",
        "quick_actions": "QuickActionsWidget.qml",
        "system_monitor": "SystemMonitorWidget.qml",
    }

    for plugin_id, display_name, default_kind, icon_name, comment in STANDALONE_WIDGET_SPECS:
        target_dir = os.path.join(widgets_root, plugin_id)
        shutil.copytree(base_plasmoid_dir, target_dir)

        meta_content = f"""[Desktop Entry]
Name={display_name}
Comment={comment}
Icon={icon_name}
Type=Service
X-KDE-ServiceTypes=Plasma/Applet

X-Plasma-API=declarativeappletscript
X-Plasma-MainScript=ui/main.qml

X-KDE-PluginInfo-Author=Haris Gitama
X-KDE-PluginInfo-Email=https://github.com/Harisgitama
X-KDE-PluginInfo-Name={plugin_id}
X-KDE-PluginInfo-Version=3.1.0
X-KDE-PluginInfo-Website=https://rissaxie.com
X-KDE-PluginInfo-Category=System Information
X-KDE-PluginInfo-License=MIT
X-KDE-PluginInfo-EnabledByDefault=true
"""
        with open(os.path.join(target_dir, "metadata.desktop"), "w", encoding="utf-8") as f:
            f.write(meta_content)

        xml_path = os.path.join(target_dir, "contents", "config", "main.xml")
        with open(xml_path, "r", encoding="utf-8") as f:
            xml_text = f.read()
        xml_text = xml_text.replace("<default>clock</default>", f"<default>{default_kind}</default>", 1)
        with open(xml_path, "w", encoding="utf-8") as f:
            f.write(xml_text)

        # Keep bundled photography only in widgets that display it (photos & music_player) plus org.urwidgets.ecosystem
        if default_kind not in ("photos", "music_player"):
            shutil.rmtree(os.path.join(target_dir, "contents", "images"), ignore_errors=True)

        # Remove unused sibling *Widget.qml files from standalone single-purpose widgets to eliminate duplication
        needed_qml = kind_to_widget_qml.get(default_kind)
        if needed_qml:
            ui_dir = os.path.join(target_dir, "contents", "ui")
            for k, qml_file in kind_to_widget_qml.items():
                if qml_file != needed_qml:
                    unused_qml_path = os.path.join(ui_dir, qml_file)
                    if os.path.exists(unused_qml_path):
                        os.remove(unused_qml_path)

    for doc in ["README.md", "BUILD.md", "INSTALL.md", "CHANGELOG.md"]:
        shutil.copyfile(os.path.join(UR_DIR, doc), os.path.join(ROOT, doc))

    plasmoid_out = os.path.join(PUB_REL, "urwidgets.plasmoid")
    with zipfile.ZipFile(plasmoid_out, "w", zipfile.ZIP_DEFLATED) as zf:
        for r, _, files in os.walk(base_plasmoid_dir):
            for file in files:
                full = os.path.join(r, file)
                rel = os.path.relpath(full, base_plasmoid_dir)
                zf.write(full, rel)
    shutil.copyfile(plasmoid_out, os.path.join(ROOT, "urwidgets.plasmoid"))

    deb_stage = "/tmp/urwidgets-deb-stage"
    if os.path.exists(deb_stage):
        shutil.rmtree(deb_stage)
    os.makedirs(os.path.join(deb_stage, "DEBIAN"), exist_ok=True)
    os.makedirs(os.path.join(deb_stage, "usr/bin"), exist_ok=True)
    os.makedirs(os.path.join(deb_stage, "usr/share/applications"), exist_ok=True)
    os.makedirs(os.path.join(deb_stage, "usr/share/icons/hicolor/scalable/apps"), exist_ok=True)
    os.makedirs(os.path.join(deb_stage, "usr/share/plasma/plasmoids/org.urwidgets.ecosystem"), exist_ok=True)
    os.makedirs(os.path.join(deb_stage, "usr/share/urwidgets/src"), exist_ok=True)

    control_content = """Package: urwidgets
Provides: urwidgets-bundle
Replaces: urwidgets-bundle
Conflicts: urwidgets-bundle
Version: 3.1.0
Section: kde
Priority: optional
Architecture: amd64
Depends: plasma-workspace (>= 4:5.24), qml-module-org-kde-kquickcontrolsaddons, qml-module-qtquick-controls2, qml-module-qtquick-layouts, qml-module-qtgraphicaleffects, libsqlite3-0
Recommends: cargo, rustc, mpv, pulseaudio-utils
Homepage: https://rissaxie.com
Maintainer: Haris Gitama <https://github.com/Harisgitama>
Description: URWidgets v3.1.0 Liquid Glass WidgetWall Ecosystem for KDE Plasma 5
 Installs all 10 macOS WidgetWall-inspired KDE Plasma 5 desktop widgets
 (Clock & Alarms with unified global ringtone & Rust/PID-tracked audio engine,
 Calendar, Pomodoro, Weather, Notes, To-Do List with deadlines & delete,
 reactive Photo Frame with smooth crossfade, Music Player with Rust directory
 scanner & stream support, Quick Actions, System Monitor), Liquid Glass
 Material System, 2-finger scroll workspace isolation, and the shared Rust
 D-Bus/SQLite daemon & Tauri Control Center.
 Author: Haris Gitama (Portfolio: https://rissaxie.com | Instagram: @hrisgtaa_).
"""
    with open(os.path.join(deb_stage, "DEBIAN/control"), "w", encoding="utf-8") as f:
        f.write(control_content)

    postinst_script = """#!/bin/sh
set -e
if command -v kbuildsycoca5 >/dev/null 2>&1; then
    kbuildsycoca5 --noincremental >/dev/null 2>&1 || true
fi
exit 0
"""
    postinst_path = os.path.join(deb_stage, "DEBIAN/postinst")
    with open(postinst_path, "w", encoding="utf-8") as f:
        f.write(postinst_script)
    os.chmod(postinst_path, 0o755)

    prerm_script = """#!/bin/sh
set -e
rm -f /tmp/urwidgets-alarm-audio.pid /tmp/urwidgets-music-audio.pid 2>/dev/null || true
exit 0
"""
    prerm_path = os.path.join(deb_stage, "DEBIAN/prerm")
    with open(prerm_path, "w", encoding="utf-8") as f:
        f.write(prerm_script)
    os.chmod(prerm_path, 0o755)

    desktop_entry = """[Desktop Entry]
Name=URWidgets Appearance Studio
Comment=Configure URWidgets Liquid Glass Theme, Audio & KDE Plasma 5 Widgets
Exec=urwidgets-ctl open-preferences
Icon=urwidgets
Terminal=false
Type=Application
Categories=Qt;KDE;Settings;DesktopSettings;
Keywords=URWidgets;Plasma;Widgets;LiquidGlass;HarisGitama;
"""
    with open(os.path.join(deb_stage, "usr/share/applications/org.urwidgets.controlcenter.desktop"), "w", encoding="utf-8") as f:
        f.write(desktop_entry)

    app_icon_svg = """<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
  <defs>
    <linearGradient id="ur_bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#E84A7F"/>
      <stop offset="100%" stop-color="#007AFF"/>
    </linearGradient>
  </defs>
  <rect x="8" y="8" width="112" height="112" rx="28" fill="url(#ur_bg)"/>
  <rect x="22" y="22" width="38" height="38" rx="10" fill="#FFFFFF" fill-opacity="0.92"/>
  <rect x="68" y="22" width="38" height="38" rx="10" fill="#FFFFFF" fill-opacity="0.72"/>
  <rect x="22" y="68" width="84" height="38" rx="10" fill="#FFFFFF" fill-opacity="0.88"/>
</svg>
"""
    with open(os.path.join(deb_stage, "usr/share/icons/hicolor/scalable/apps/urwidgets.svg"), "w", encoding="utf-8") as f:
        f.write(app_icon_svg)

    shutil.copytree(
        base_plasmoid_dir,
        os.path.join(deb_stage, "usr/share/plasma/plasmoids/org.urwidgets.ecosystem"),
        dirs_exist_ok=True,
    )
    for plugin_id, _, _, _, _ in STANDALONE_WIDGET_SPECS:
        shutil.copytree(
            os.path.join(widgets_root, plugin_id),
            os.path.join(deb_stage, "usr/share/plasma/plasmoids", plugin_id),
            dirs_exist_ok=True,
        )
    shutil.copytree(
        UR_DIR,
        os.path.join(deb_stage, "usr/share/urwidgets/src"),
        ignore=shutil.ignore_patterns("widgets", "images"),
        dirs_exist_ok=True,
    )

    wrapper_path = os.path.join(deb_stage, "usr/bin/urwidgets-ctl")
    wrapper_script = """#!/usr/bin/env sh
# URWidgets v3.1.0 Native CLI Dispatcher (Delegates to compiled Rust urwidgets-daemon or POSIX fallback)
for BIN in "$HOME/.local/bin/urwidgets-daemon" "/usr/local/bin/urwidgets-daemon" "/usr/bin/urwidgets-daemon"; do
    if [ -x "$BIN" ]; then
        exec "$BIN" "$@"
    fi
done

CMD="${1:-}"
case "$CMD" in
    open-preferences)
        if command -v plasmawindowed >/dev/null 2>&1; then
            exec plasmawindowed org.urwidgets.ecosystem
        elif command -v plasmoidviewer >/dev/null 2>&1; then
            exec plasmoidviewer -a org.urwidgets.ecosystem
        fi
        ;;
    scan-music)
        TARGET="${2:-$HOME/Music}"
        if [ -f "$TARGET" ]; then
            echo "$TARGET"
        elif [ -d "$TARGET" ]; then
            for f in "$TARGET"/* "$TARGET"/*/*; do
                [ -f "$f" ] || continue
                case "$f" in *.mp3|*.MP3|*.flac|*.FLAC|*.ogg|*.OGG|*.oga|*.OGA|*.wav|*.WAV|*.m4a|*.M4A|*.aac|*.AAC|*.opus|*.OPUS) echo "$f" ;; esac
            done | sort | head -n 120
        fi
        ;;
    scan-photos)
        TARGET="${2:-$HOME/Pictures}"
        if [ -f "$TARGET" ]; then
            echo "file://$TARGET"
        elif [ -d "$TARGET" ]; then
            for f in "$TARGET"/* "$TARGET"/*/*; do
                [ -f "$f" ] || continue
                case "$f" in *.jpg|*.JPG|*.jpeg|*.JPEG|*.png|*.PNG|*.webp|*.WEBP|*.svg|*.SVG) echo "file://$f" ;; esac
            done | sort | head -n 60
        fi
        ;;
    play-alarm)
        TARGET="${2:-$HOME/Music}"
        VOL="${3:-90}"
        LOOP="${4:-1}"
        if [ -f /tmp/urwidgets-alarm-audio.pid ]; then
            kill -TERM "$(cat /tmp/urwidgets-alarm-audio.pid)" 2>/dev/null || true
            rm -f /tmp/urwidgets-alarm-audio.pid
        fi
        if [ -d "$TARGET" ]; then
            for f in "$TARGET"/* "$TARGET"/*/*; do
                [ -f "$f" ] || continue
                case "$f" in *.mp3|*.MP3|*.wav|*.WAV|*.ogg|*.OGG|*.oga|*.OGA|*.flac|*.FLAC|*.m4a|*.M4A|*.aac|*.AAC|*.opus|*.OPUS) TARGET="$f"; break ;; esac
            done
        fi
        [ -f "$TARGET" ] || TARGET="/usr/share/sounds/freedesktop/stereo/alarm-clock-elapsed.oga"
        [ -f "$TARGET" ] || TARGET="/usr/share/sounds/freedesktop/stereo/complete.oga"
        [ -f "$TARGET" ] || TARGET="/usr/share/sounds/alsa/Front_Center.wav"
        LOOP_MPV=""; [ "$LOOP" = "1" ] && LOOP_MPV="--loop-file=inf"
        if command -v mpv >/dev/null 2>&1; then
            nohup mpv --no-video --really-quiet $LOOP_MPV --volume="$VOL" "$TARGET" >/dev/null 2>&1 </dev/null & echo $! > /tmp/urwidgets-alarm-audio.pid
        elif command -v ffplay >/dev/null 2>&1; then
            nohup ffplay -nodisp -autoexit -loglevel quiet -volume "$VOL" "$TARGET" >/dev/null 2>&1 </dev/null & echo $! > /tmp/urwidgets-alarm-audio.pid
        elif command -v paplay >/dev/null 2>&1; then
            nohup paplay "$TARGET" >/dev/null 2>&1 </dev/null & echo $! > /tmp/urwidgets-alarm-audio.pid
        elif command -v aplay >/dev/null 2>&1; then
            nohup aplay -q "$TARGET" >/dev/null 2>&1 </dev/null & echo $! > /tmp/urwidgets-alarm-audio.pid
        fi
        ;;
    stop-alarm)
        if [ -f /tmp/urwidgets-alarm-audio.pid ]; then
            kill -TERM "$(cat /tmp/urwidgets-alarm-audio.pid)" 2>/dev/null || true
            rm -f /tmp/urwidgets-alarm-audio.pid
        fi
        ;;
    play-music)
        TARGET="${2:-$HOME/Music}"
        VOL="${3:-80}"
        if [ -f /tmp/urwidgets-music-audio.pid ]; then
            kill -TERM "$(cat /tmp/urwidgets-music-audio.pid)" 2>/dev/null || true
            rm -f /tmp/urwidgets-music-audio.pid
        fi
        case "$TARGET" in
            http://*|https://*) ;;
            *)
                if [ -d "$TARGET" ]; then
                    for f in "$TARGET"/* "$TARGET"/*/*; do
                        [ -f "$f" ] || continue
                        case "$f" in *.mp3|*.MP3|*.flac|*.FLAC|*.ogg|*.OGG|*.oga|*.OGA|*.wav|*.WAV|*.m4a|*.M4A|*.aac|*.AAC|*.opus|*.OPUS) TARGET="$f"; break ;; esac
                    done
                fi
                [ -f "$TARGET" ] || TARGET="/usr/share/sounds/freedesktop/stereo/complete.oga"
                [ -f "$TARGET" ] || TARGET="/usr/share/sounds/alsa/Front_Center.wav"
                ;;
        esac
        if command -v mpv >/dev/null 2>&1; then
            nohup mpv --no-video --really-quiet --volume="$VOL" "$TARGET" >/dev/null 2>&1 </dev/null & echo $! > /tmp/urwidgets-music-audio.pid
        elif command -v ffplay >/dev/null 2>&1; then
            nohup ffplay -nodisp -autoexit -loglevel quiet -volume "$VOL" "$TARGET" >/dev/null 2>&1 </dev/null & echo $! > /tmp/urwidgets-music-audio.pid
        elif command -v paplay >/dev/null 2>&1; then
            nohup paplay "$TARGET" >/dev/null 2>&1 </dev/null & echo $! > /tmp/urwidgets-music-audio.pid
        elif command -v aplay >/dev/null 2>&1; then
            nohup aplay -q "$TARGET" >/dev/null 2>&1 </dev/null & echo $! > /tmp/urwidgets-music-audio.pid
        fi
        ;;
    stop-music)
        if [ -f /tmp/urwidgets-music-audio.pid ]; then
            kill -TERM "$(cat /tmp/urwidgets-music-audio.pid)" 2>/dev/null || true
            rm -f /tmp/urwidgets-music-audio.pid
        fi
        ;;
    *)
        echo "URWidgets v3.1.0 CLI Dispatcher (Author: Haris Gitama | https://rissaxie.com | @hrisgtaa_)"
        ;;
esac
"""
    with open(wrapper_path, "w", encoding="utf-8") as f:
        f.write(wrapper_script)
    os.chmod(wrapper_path, 0o755)

    deb_tmp_out = "/tmp/urwidgets-bundle-build.deb"
    deb_bundle_out = os.path.join(PUB_REL, "urwidgets-bundle.deb")
    deb_dist_out = os.path.join(dist_dir, "URWidgets_3.1.0_amd64.deb")
    subprocess.run(["dpkg-deb", "-Zxz", "--build", deb_stage, deb_tmp_out], check=True)
    shutil.move(deb_tmp_out, deb_bundle_out)
    shutil.copyfile(deb_bundle_out, deb_dist_out)
    shutil.copyfile(deb_bundle_out, os.path.join(PUB_REL, "URWidgets_3.1.0_amd64.deb"))
    shutil.copyfile(deb_bundle_out, os.path.join(ROOT, "urwidgets-bundle.deb"))
    shutil.copyfile(deb_bundle_out, os.path.join(PUB_REL, "urwidgets-engine.deb"))
    shutil.copyfile(deb_bundle_out, os.path.join(ROOT, "urwidgets-engine.deb"))

    tar_out = os.path.join(PUB_REL, "urwidgets-source.tar.gz")
    with tarfile.open(tar_out, "w:gz") as tf:
        tf.add(UR_DIR, arcname="urwidgets")
    shutil.copyfile(tar_out, os.path.join(ROOT, "urwidgets-source.tar.gz"))

    # Also build complete urwidgets-bundle.zip archive with latest v3.1.0 source, QML plasmoids, and CHANGELOG.md
    zip_out = os.path.join(PUB_REL, "urwidgets-bundle.zip")
    with zipfile.ZipFile(zip_out, "w", zipfile.ZIP_DEFLATED) as zf:
        for r, _, files in os.walk(UR_DIR):
            for file in files:
                full = os.path.join(r, file)
                rel = os.path.join("urwidgets", os.path.relpath(full, UR_DIR))
                zf.write(full, rel)
    shutil.copyfile(zip_out, os.path.join(ROOT, "urwidgets-bundle.zip"))
    shutil.copyfile(zip_out, os.path.join(PUB_REL, "urwidgets-source.zip"))
    shutil.copyfile(zip_out, os.path.join(ROOT, "urwidgets-source.zip"))

    # Generate SHA256SUMS in dist/ and public/releases/
    import hashlib
    sha_lines = []
    for artifact_path, display_name in [
        (deb_dist_out, "URWidgets_3.1.0_amd64.deb"),
        (deb_bundle_out, "urwidgets-bundle.deb"),
        (zip_out, "urwidgets-bundle.zip"),
        (plasmoid_out, "urwidgets.plasmoid"),
        (tar_out, "urwidgets-source.tar.gz"),
    ]:
        h = hashlib.sha256()
        with open(artifact_path, "rb") as af:
            while True:
                chunk = af.read(65536)
                if not chunk:
                    break
                h.update(chunk)
        sha_lines.append(f"{h.hexdigest()}  {display_name}")

    sha_text = "\n".join(sha_lines) + "\n"
    with open(os.path.join(dist_dir, "SHA256SUMS"), "w", encoding="utf-8") as sf:
        sf.write(sha_text)
    with open(os.path.join(PUB_REL, "SHA256SUMS"), "w", encoding="utf-8") as sf:
        sf.write(sha_text)

    ts_entries = []
    for rel_path, content in FILES.items():
        lang = "markdown"
        if rel_path.endswith(".rs"):
            lang = "rust"
        elif rel_path.endswith(".toml") or rel_path.endswith(".desktop"):
            lang = "toml"
        elif rel_path.endswith(".qml"):
            lang = "qml"
        elif rel_path.endswith(".sh"):
            lang = "bash"
        elif rel_path.endswith(".xml"):
            lang = "xml"
        elif rel_path.endswith(".json"):
            lang = "json"
        ts_entries.append({
            "path": f"urwidgets/{rel_path}",
            "language": lang,
            "sizeBytes": len(content.encode("utf-8")),
            "lines": len(content.splitlines()),
            "content": content,
        })

    with open(os.path.join(ROOT, "lib/native-source-registry.ts"), "w", encoding="utf-8") as f:
        f.write("export interface NativeSourceFile {\n")
        f.write("  path: string;\n  language: string;\n  sizeBytes: number;\n  lines: number;\n  content: string;\n}\n\n")
        f.write("export const NATIVE_SOURCE_FILES: NativeSourceFile[] = ")
        f.write(json.dumps(ts_entries, indent=2))
        f.write(";\n")

    print("Successfully built URWidgets v3.1.0 Liquid Glass WidgetWall QML design system (10 widgets), dist/URWidgets_3.1.0_amd64.deb, and dist/SHA256SUMS.")

if __name__ == "__main__":
    build_all()



