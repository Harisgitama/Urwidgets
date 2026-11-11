# URWidgets Technical Architecture (WidgetWall v3.0.1 Final Release)

## 1. Centralized QML Design System & Independent Per-Widget Preferences
- `WidgetTheme.qml` & `ThemeEngine.qml`: Centralizes Appearance modes (`Auto`, `Light`, `Dark`), Surface styles (`Default`, `Dark`, `Clear`, `Tinted`, `Solid`), 9 macOS Accent Colors, Elevation levels (`0–3`), per-widget independent overrides (`widget.clock` through `widget.music_player`), and dynamic installed OS font resolution (`Qt.fontFamilies()`).
- `WidgetBackground.qml`: Shared image background layer supporting `SVG`, `JPG`, `JPEG`, `PNG`, and `WebP` with `Cover`, `Contain`, `Stretch`, and `Center` fit modes, `Center/Top/Bottom/Left/Right` position alignment, and readability contrast overlays across all 10 widgets.
- `WidgetSurface.qml`: Soft 3D ambient floating drop shadow and 1px translucent specular highlight border without expensive fullscreen blur or hover layout shifts.
- `ClockWidget.qml`: 2-slide manual Clock & Alarm Manager (`Slide 1: Main Clock`, `Slide 2: Alarm Manager` with Hour/Minute picker, Clear/Confirm/Cancel, Snooze `5/10/15/20/30/45m`, ringtone preview/stop, and due-alarm banner).
- `PhotoWidget.qml`: Guaranteed non-blank display with bundled photography + embedded SVG fallback, Single/Slideshow mode, and interactive drag-to-pan + zoom non-destructive crop editor.
- `MusicPlayerWidget.qml`: Floating macOS-inspired Music Player wired to `QtMultimedia.Audio` with Local Folder picker, Direct Online Stream validation, and Queue drawer.
- `NotesWidget.qml`: Backed by SQLite WAL (`notes`) with 400ms debounced autosave (`todo_items` table preserved non-destructively in SQLite).
