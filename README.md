# URWidgets v3.0.2 — Your Desktop, Your Atmosphere
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
