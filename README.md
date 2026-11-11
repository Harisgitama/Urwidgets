# URWidgets

<p align="center">
  <strong>Your Desktop. Your Widgets. Your Way.</strong>
  <br />
  A macOS-inspired desktop widget ecosystem for Linux and KDE Plasma 5.
</p>

<p align="center">
  <a href="https://github.com/Harisgitama/Urwidgets/releases/tag/3.0.2">
    <img src="https://img.shields.io/badge/Download-v3.0.2-8B5CF6?style=for-the-badge&logo=github&logoColor=white" alt="Download URWidgets v3.0.2" />
  </a>
  <a href="https://harisgitama.github.io/Urwidgets/">
    <img src="https://img.shields.io/badge/Website-URWidgets-64748B?style=for-the-badge&logo=googlechrome&logoColor=white" alt="URWidgets Website" />
  </a>
  <a href="https://github.com/Harisgitama/Urwidgets">
    <img src="https://img.shields.io/badge/Source-Code-181717?style=for-the-badge&logo=github&logoColor=white" alt="Source Code" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Linux-FCC624?style=flat-square&logo=linux&logoColor=black" alt="Linux" />
  <img src="https://img.shields.io/badge/Desktop-KDE%20Plasma%205-1D99F3?style=flat-square&logo=kde&logoColor=white" alt="KDE Plasma 5" />
  <img src="https://img.shields.io/badge/Core-Rust-DEA584?style=flat-square&logo=rust&logoColor=black" alt="Rust" />
  <img src="https://img.shields.io/badge/UI-QML%20%2F%20Qt-41CD52?style=flat-square&logo=qt&logoColor=white" alt="Qt QML" />
</p>

---

## Overview

**URWidgets** is a customizable, macOS-inspired desktop widget ecosystem built for Linux with KDE Plasma 5.

Designed to bring productivity, media controls, system information, and visual personalization into one cohesive desktop experience, URWidgets transforms your workspace into a more functional and personalized environment.

Powered by a shared Rust background daemon, native QML widgets, SQLite persistence, and D-Bus communication, URWidgets combines desktop-native integration with a consistent visual design system.

The project is primarily developed and targeted for **Linux Mint with KDE Plasma 5**, using Qt 5.15, KDE Frameworks 5, and QML.

### Why URWidgets?

- **A unified desktop experience** — Bring everyday utilities together through a cohesive WidgetWall.
- **Native desktop integration** — Designed around KDE Plasma 5 and QML.
- **Consistent appearance** — Synchronize themes, styles, and accent colors across widgets.
- **Shared Rust core** — Centralize application services and background operations.
- **Personalized workspace** — Customize widget surfaces, backgrounds, geometry, and visual appearance.

---

## Download

<p align="center">
  <a href="https://github.com/Harisgitama/Urwidgets/releases/tag/3.0.2">
    <img src="https://img.shields.io/badge/⬇%20DOWNLOAD%20URWIDGETS-v3.0.2-8B5CF6?style=for-the-badge" alt="Download URWidgets" />
  </a>
</p>

**Latest published release:** `v3.0.2`

Download the available installation packages and project assets from the official GitHub Release.

**[View URWidgets v3.0.2 Releases →](https://github.com/Harisgitama/Urwidgets/releases/tag/3.0.2)**

For source code and development files:

**[Explore the GitHub Repository →](https://github.com/Harisgitama/Urwidgets)**

> Download the Debian package (`.deb`) from the release assets. Available package formats and filenames are listed on the release page.

---

## Features

URWidgets includes a collection of 10 desktop widgets designed to work together as one desktop ecosystem.

### 1. Clock & Alarms

A desktop clock combined with an integrated alarm manager.

- Main clock display.
- Multi-alarm management.
- Hour and minute selection.
- One-time or weekday-based repeat scheduling.
- Local custom ringtone selection.
- Audio preview.
- Configurable snooze duration.
- Alarm indicators and management controls.

### 2. Monthly Calendar

A clean and customizable monthly calendar.

- 42-cell calendar grid.
- Month navigation.
- English (`en-US`) and Indonesian (`id-ID`) localization.
- Global theme synchronization.
- Accent-colored current-date indicator.

### 3. Pomodoro Focus

A compact focus timer designed for productivity and study sessions.

- Circular Canvas progress indicator.
- Countdown timer.
- Play and pause controls.
- Session indicator dots.
- Theme and accent color synchronization.

### 4. Weather

A lightweight desktop weather widget.

- Location heading.
- Temperature display.
- Weather condition description.
- High and low temperature information.
- SQLite-based offline data cache.

### 5. Notes

A macOS Notes-inspired quick-capture widget.

- Create and manage notes.
- Note switching.
- Pinning support.
- Search.
- Expanded view.
- Debounced SQLite autosave.

### 6. To-Do List

A task management widget for organizing everyday activities.

- Create and manage tasks.
- Deadline date and time.
- Priority levels: High, Medium, and Low.
- Automatic deadline indicators.
- Overdue, Due Today, and Upcoming labels.
- Completion controls.
- Inline editing.
- Individual task deletion.
- Clear Completed tasks.

### 7. Photo Frame

A customizable photo display for your desktop.

- Single Photo mode.
- Slideshow mode.
- Local image selection.
- Configurable slideshow intervals.
- Custom interval support.
- Interactive mouse-based crop and zoom editor.
- Image presentation customization.

### 8. Music Player

A floating desktop music player with real audio playback.

- Local music folder support.
- Direct online audio stream URLs.
- Album artwork.
- Seekable playback progress.
- Playback controls.
- Stop control.
- Interactive playback queue.
- Shuffle.
- Repeat modes: Off, All, and One.
- Saved stream library.
- Supported local formats include MP3, FLAC, OGG, WAV, and M4A.

### 9. Quick Actions

A compact shortcut widget for convenient desktop actions.

- Icon-based action grid.
- Quick access to configured utilities.
- Detached XDG command execution.
- Compact and overflow-safe layout.

### 10. System Monitor

An understated system monitoring widget.

- CPU usage.
- Memory usage.
- Battery information.
- Progress indicators.
- Direct Linux `/proc` and `/sys` system sampling.

---

## Visual Design System

URWidgets uses a shared appearance system to provide a consistent visual experience across its widgets.

### Global Appearance

**Appearance Modes**
- Auto
- Light
- Dark

**Surface Styles**
- Default
- Dark
- Clear
- Tinted
- Solid

**Accent Colors**
- Preset macOS-inspired accent colors.
- Custom hexadecimal accent input (`#RRGGBB`).
- Automatic light and dark tinted surface derivation.

**Atmosphere Presets**
- Warm Minimal
- Liquid Glass
- Pastel Editorial
- Aurora Gradient
- Midnight Dark
- Monochrome Studio

### Widget Customization

- Custom local image backgrounds.
- Cover, Contain, Stretch, and Center image fit modes.
- Readability overlays.
- Widget background customization.
- Geometry and layout configuration.
- Multi-level 3D floating card elevation.
- Consistent appearance synchronization.

### System Font Resolution

URWidgets dynamically resolves installed system fonts using Qt font families.

Font priority:

1. SF Pro Display / SF Pro Text
2. Helvetica Neue
3. Avenir Next
4. Inter
5. Noto Sans Display
6. Liberation Sans

Fonts are resolved from the installed system rather than bundled with the application.

---

## Architecture & Technology

URWidgets combines native Linux desktop integration with a shared Rust backend.

| Technology | Role |
|---|---|
| Rust | Shared core, background services, and application logic |
| Tauri 2 | Control Center and preference management |
| QML | Native KDE Plasma widget interfaces |
| Qt 5.15 | Widget rendering and desktop integration |
| KDE Frameworks 5 | KDE Plasma 5 integration |
| SQLite | Persistent configuration and application data |
| D-Bus | Communication between application components |

### Shared Rust Core

URWidgets uses a shared Rust daemon (`urwidgets-daemon`) exposed as both a library and executable.

Its architecture supports integration between the Tauri Control Center and native Plasma components.

### Data Persistence

Application data uses SQLite with:

- Write-Ahead Logging (WAL).
- Versioned schema migrations.
- Database version tracking through `PRAGMA user_version`.

### Desktop Integration

The QML widgets integrate with KDE Plasma 5.

The project provides:
- Unified WidgetWall Desktop Containment.
- Independent widgets available through KDE Plasma's Add Widgets explorer.
- Shared appearance configuration.
- Rust-backed background services.

---

## System Requirements

| Component | Requirement |
|---|---|
| Operating System | Linux |
| Desktop Environment | KDE Plasma 5 |
| Qt | Qt 5.15 |
| KDE Frameworks | KF5 |
| Widget Interface | QML |
| Recommended RAM | 8 GB or more |
| Architecture | AMD64 / x86_64 package where provided |

URWidgets is primarily developed and tested in a Linux Mint KDE Plasma 5 environment.

Other Linux distributions running KDE Plasma 5 may be compatible when the required dependencies are available. Distribution-specific compatibility should be verified.

### Compatibility Status

| Environment | Status |
|---|---|
| Linux Mint + KDE Plasma 5 | Primary development target |
| Other Linux distributions + KDE Plasma 5 | Potentially compatible; requires testing |
| KDE Plasma 6 | Not supported yet |
| GNOME | Not supported |
| Cinnamon | Not supported |
| XFCE | Not supported |

Native widget integration currently targets KDE Plasma 5. Other desktop environments require dedicated integrations.

---

## Installation Guide

### Method 1 — Download from GitHub Releases

1. Open the official [URWidgets v3.0.2 Release](https://github.com/Harisgitama/Urwidgets/releases/tag/3.0.2).
2. Find the available Debian installation package (`.deb`) in the release assets.
3. Download the package to your Downloads folder.
4. Continue with the terminal installation below.

### Method 2 — Install via Linux Terminal

Open a terminal and navigate to your Downloads directory:

```bash
cd ~/Downloads
```

Install the downloaded Debian package:

```bash
sudo apt install ./PACKAGE_NAME.deb
```

**Important:** Replace `PACKAGE_NAME.deb` with the exact filename of the package you downloaded.

For example, if your downloaded file is named `urwidgets-bundle.deb`:

```bash
sudo apt install ./urwidgets-bundle.deb
```

APT will handle the package installation and dependency resolution.

### Method 3 — Install Using the Desktop Interface

You can also install the downloaded `.deb` package using a Debian-compatible graphical package installer, if available on your distribution.

---

## After Installation

Once installation is complete:

1. Open your KDE Plasma desktop.
2. Open the desktop context menu.
3. Select **Add Widgets...**
4. Search for URWidgets.
5. Add the available widgets to your desktop.

The WidgetWall Desktop Containment and individual widgets provide different ways to organize your workspace.

---

## Screenshots & Preview

Explore URWidgets through the project website.

<p align="center">
  <a href="https://harisgitama.github.io/Urwidgets/">
    <img src="https://img.shields.io/badge/Explore-URWidgets%20Website-8B5CF6?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Explore URWidgets Website" />
  </a>
</p>

**[Open the Interactive Website Preview →](https://harisgitama.github.io/Urwidgets/)**

---

## Project Status

URWidgets is actively focused on improving its KDE Plasma 5 desktop widget ecosystem.

Current development priorities include:

- Codebase maintainability.
- Shared Rust core optimization.
- Native Plasma widget stability.
- Appearance consistency.
- Application performance.
- Installation and distribution improvements.
- Better documentation.

Compatibility with additional desktop environments is not currently included in the supported release.

---

## Contributing

Contributions, suggestions, bug reports, and feedback are welcome.

You can help by:

- Reporting issues.
- Suggesting improvements.
- Testing the application.
- Improving documentation.
- Contributing code through pull requests.

Before submitting a change, please review the current project structure and existing implementation.

**[Open GitHub Issues →](https://github.com/Harisgitama/Urwidgets/issues)**

**[Explore the Source Code →](https://github.com/Harisgitama/Urwidgets)**

---

## Developer

**Haris Gitama**

Creator and developer of URWidgets.

<p>
  <a href="https://github.com/Harisgitama">
    <img src="https://img.shields.io/badge/GitHub-Harisgitama-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
  <a href="https://rissaxie.com">
    <img src="https://img.shields.io/badge/Portfolio-rissaxie.com-6366F1?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Portfolio" />
  </a>
  <a href="https://www.instagram.com/hrisgtaa_/">
    <img src="https://img.shields.io/badge/Instagram-@hrisgtaa_-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram" />
  </a>
</p>

---

<p align="center">
  <strong>URWidgets — Your Desktop. Your Widgets. Your Way.</strong>
  <br />
  Built for Linux. Designed for KDE Plasma 5.
  <br /><br />
  © 2026 Haris Gitama
</p>
