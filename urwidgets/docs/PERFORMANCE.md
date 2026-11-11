# URWidgets Performance Engineering (v3.0.1)

- **Single Rust Process (`urwidgets-daemon`)**: All 10 desktop widgets share one background process (`~4.2 MB RSS`).
- **Debounced SQLite Autosave**: `NotesWidget.qml` uses a 400ms debounce `Timer` so rapid typing never blocks the UI thread or floods SQLite.
- **Lazy Image Decoding**: `WidgetBackground.qml` and `PhotoWidget.qml` bind `sourceSize` to the widget's pixel dimensions with `asynchronous: true` and `cache: true`.
