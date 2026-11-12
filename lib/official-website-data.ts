import { withBasePath } from './download-release';
import { URWIDGETS_RELEASE, URWIDGETS_DOWNLOADS } from './releases';

export const OFFICIAL_PRODUCT_IDENTITY = {
  name: 'URWidgets',
  tagline: 'Your Desktop. Your Widgets. Your Way.',
  description:
    'URWidgets is a customizable Linux desktop widget ecosystem designed to bring productivity, media controls, personalization, and everyday utilities into one cohesive KDE Plasma experience.',
  heroDescription:
    'Bring your Linux desktop to life with URWidgets — a customizable collection of desktop widgets combining productivity, media control, visual personalization, and everyday utilities.',
  heroSupportingDescription:
    'Built for KDE Plasma 5, powered by Rust and QML, and designed to make your Linux workspace more useful and personal.',
  technologies: ['Rust', 'Tauri', 'QML', 'Qt', 'KDE Plasma 5'] as const,
  heroMetadataItems: [
    'Linux Desktop Widgets',
    'KDE Plasma 5',
    'Rust + QML',
    'Open Source',
  ] as const,
  repositoryUrl: 'https://github.com/Harisgitama/Urwidgets',
  officialReleaseUrl: URWIDGETS_RELEASE.url,
  allReleasesUrl: 'https://github.com/Harisgitama/Urwidgets/releases',
  installGuideUrl: 'https://github.com/Harisgitama/Urwidgets/blob/main/INSTALL.md',
  officialWebsiteUrl: 'https://harisgitama.github.io/Urwidgets/',
  latestPublishedRelease: `v${URWIDGETS_RELEASE.version}`,
  latestPublishedReleaseLabel: `Latest Published Release: v${URWIDGETS_RELEASE.version}`,
  developmentVersion: 'v3.1.0',
  compatibilityTarget: 'KDE Plasma 5',
  terminalInstallCommand:
    'cd ~/Downloads && sudo apt install ./NAMA_FILE_URWIDGETS.deb',
  author: {
    name: 'Haris Gitama',
    bio: 'Developer and creator of URWidgets, exploring Linux desktop customization, application architecture, and open-source software.',
    githubUrl: 'https://github.com/Harisgitama/Urwidgets',
    githubLabel: 'GitHub Repository',
    portfolioUrl: 'https://rissaxie.com',
    portfolioLabel: 'rissaxie.com',
    instagramUrl: 'https://www.instagram.com/hrisgtaa_/',
    instagramLabel: '@hrisgtaa_',
  },
} as const;

export interface LandingNavItem {
  id: string;
  label: 'Home' | 'Features' | 'Gallery' | 'Compatibility' | 'About';
  href: string;
}

export const LANDING_NAV_ITEMS: LandingNavItem[] = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'features', label: 'Features', href: '#features' },
  { id: 'gallery', label: 'Gallery', href: '#gallery' },
  { id: 'compatibility', label: 'Compatibility', href: '#compatibility' },
  { id: 'about', label: 'About', href: '#about' },
];

export interface ProductHighlightItem {
  id: string;
  title: string;
  description: string;
  detail: string;
}

export const PRODUCT_HIGHLIGHTS: ProductHighlightItem[] = [
  {
    id: 'desktop-productivity',
    title: 'Desktop Productivity',
    description: 'Keep useful tools accessible directly from the desktop.',
    detail:
      'Clock & Alarms, monthly Calendar, Pomodoro focus sessions, quick Notes, and deadline-aware To-Do Lists live directly on your KDE Plasma 5 workspace.',
  },
  {
    id: 'media-control',
    title: 'Media Control',
    description:
      'Manage media playback without constantly switching applications.',
    detail:
      'Scan local music folders or play direct online audio streams, alongside a borderless Photo Frame widget with Single Photo and Slideshow modes.',
  },
  {
    id: 'visual-personalization',
    title: 'Visual Personalization',
    description:
      'Customize widget themes, accent colors, backgrounds, and supported visual effects.',
    detail:
      'Switch between Auto, Light, and Dark modes, 5 surface styles (Default, Dark, Clear, Tinted, Solid), 9 accent colors, custom hex codes, and custom widget backgrounds.',
  },
  {
    id: 'native-linux-integration',
    title: 'Native Linux Integration',
    description: 'Designed around KDE Plasma 5 with QML and Qt integration.',
    detail:
      'Installed both as a unified WidgetWall Desktop Containment and as 10 independent desktop widgets in KDE Plasma 5 using Qt 5.15 and QML.',
  },
  {
    id: 'shared-rust-core',
    title: 'Shared Rust Core',
    description: 'Centralized application logic and background services.',
    detail:
      'A single shared Rust background daemon (urwidgets-daemon) coordinates SQLite WAL persistence, D-Bus IPC, alarm scheduling, and media playback.',
  },
  {
    id: 'lightweight-architecture',
    title: 'Lightweight Architecture',
    description:
      'A modular architecture designed to keep desktop interactions responsive.',
    detail:
      'Configurable polling intervals, debounced SQLite writes, and compositor-aware surface profiles keep desktop interactions smooth on laptops.',
  },
];

export interface WidgetFeatureSpec {
  id:
    | 'clock'
    | 'calendar'
    | 'weather'
    | 'pomodoro'
    | 'notes'
    | 'music_player'
    | 'agenda'
    | 'photos'
    | 'quick_actions'
    | 'system_monitor';
  numberLabel: string;
  title: string;
  category: 'Productivity' | 'Media & Visual' | 'System & Utilities';
  summary: string;
  implementedDetails: string[];
  qmlFile: string;
  rustModule: string;
  previewImage: string;
}

export const WIDGET_FEATURES: WidgetFeatureSpec[] = [
  {
    id: 'clock',
    numberLabel: '01',
    title: 'Clock & Alarms',
    category: 'Productivity',
    summary: 'Desktop clock and alarm management.',
    implementedDetails: [
      '2-slide Clock & Alarm Manager with 12-hour/24-hour time formatting, optional seconds toggle, and active alarm indicator.',
      'Multi-alarm scheduling with Hour (00–23) and Minute (00–59) selector, one-time date or weekday repeat rules, and custom snooze minutes.',
      'Supports local ringtone audio files (.mp3, .wav, .ogg, .oga, .flac, .m4a, .aac) and global ringtone directory configuration with audio preview.',
    ],
    qmlFile: 'ClockWidget.qml',
    rustModule: 'core/src/modules/alarms.rs',
    previewImage: '/images/gallery/clock-alarm-showcase.png',
  },
  {
    id: 'calendar',
    numberLabel: '02',
    title: 'Calendar',
    category: 'Productivity',
    summary:
      'Monthly calendar display, navigation, localization, and desktop appearance.',
    implementedDetails: [
      '42-cell monthly grid with previous/next month navigation and circular accent badge on the current date.',
      'Bilingual weekday and month localization supporting English (en-US) and Indonesian (id-ID).',
      'Configurable first day of the week (Monday or Sunday) synchronized with the global theme and accent color.',
    ],
    qmlFile: 'CalendarWidget.qml',
    rustModule: 'core/src/modules/calendar.rs',
    previewImage: '/images/gallery/calendar-showcase.png',
  },
  {
    id: 'weather',
    numberLabel: '03',
    title: 'Weather',
    category: 'System & Utilities',
    summary: 'Weather display using the existing integration.',
    implementedDetails: [
      'Displays location heading, current temperature, sky condition description, and daily high/low (H / L) range.',
      'Instant unit toggle between Celsius (°C) and Fahrenheit (°F).',
      'Backed by SQLite cache persistence and manual refresh via the daemon weather module.',
    ],
    qmlFile: 'WeatherWidget.qml',
    rustModule: 'core/src/modules/weather.rs',
    previewImage: '/images/gallery/weather-showcase.png',
  },
  {
    id: 'pomodoro',
    numberLabel: '04',
    title: 'Pomodoro',
    category: 'Productivity',
    summary: 'Focus timer for productivity and study sessions.',
    implementedDetails: [
      'Circular Canvas progress ring with central countdown timer and 4 session indicator dots.',
      'Supports Study, Short Break, and Long Break phases with interactive Start, Pause, and Reset controls.',
      'Customizable durations in minutes for Study (default 25m), Short Break (5m), and Long Break (15m).',
    ],
    qmlFile: 'PomodoroWidget.qml',
    rustModule: 'core/src/modules/pomodoro.rs',
    previewImage: '/images/gallery/widgetwall-desktop-showcase.png',
  },
  {
    id: 'notes',
    numberLabel: '05',
    title: 'Notes',
    category: 'Productivity',
    summary: 'Quick note creation, management, and persistence.',
    implementedDetails: [
      'Create, switch, edit, and delete desktop notes with title, body text, and tags.',
      'Pin important notes to the top of the list, filter via instant keyword search, and open expanded view.',
      '400ms debounced autosave to the local SQLite WAL database (~/.local/share/urwidgets/state.db).',
    ],
    qmlFile: 'NotesWidget.qml',
    rustModule: 'core/src/modules/notes.rs',
    previewImage: '/images/gallery/widgetwall-desktop-showcase.png',
  },
  {
    id: 'music_player',
    numberLabel: '06',
    title: 'Music Player',
    category: 'Media & Visual',
    summary:
      'Desktop music playback controls, local sources, stream support, metadata, progress, and queue management.',
    implementedDetails: [
      'Supports local music folders (.mp3, .flac, .ogg, .wav, .m4a with rescan) and direct online audio stream URLs (https://...).',
      'Displays track metadata, album artwork, and seekable playback progress bar.',
      'Play/Pause, Stop, Previous/Next track, interactive Queue, Shuffle, Repeat (Off | All | One), and Volume controls.',
    ],
    qmlFile: 'MusicPlayerWidget.qml',
    rustModule: 'core/src/modules/music.rs',
    previewImage: '/images/photo_widget_botanical.jpg',
  },
  {
    id: 'agenda',
    numberLabel: '07',
    title: 'To-Do List',
    category: 'Productivity',
    summary:
      'Task organization, deadlines, priority, completion, and task management.',
    implementedDetails: [
      'Task creation with deadline date (YYYY-MM-DD) & time (HH:MM) and priority levels (High, Medium, Low).',
      'Automatic deadline status badges (Overdue, Due today, Upcoming) and completion progress bar with All/Active/Done filters.',
      'Completion toggle, inline task editing, per-item Delete (Hapus) button, and one-click Clear Done.',
    ],
    qmlFile: 'AgendaWidget.qml',
    rustModule: 'core/src/modules/agenda.rs',
    previewImage: '/images/gallery/todo-list-showcase.png',
  },
  {
    id: 'photos',
    numberLabel: '08',
    title: 'Photo Frame',
    category: 'Media & Visual',
    summary:
      'Local image display, slideshow, image fitting, and supported visual transitions.',
    implementedDetails: [
      'Full-bleed rounded photography frame supporting Single Photo and Slideshow modes from local folders.',
      'Configurable slideshow interval presets (5s, 10s, 15s, 30s, 60s, or custom seconds) with smooth crossfade transitions.',
      'Supports image fitting modes and non-destructive zoom (1.0x–2.5x) and crop offset configuration.',
    ],
    qmlFile: 'PhotoWidget.qml',
    rustModule: 'core/src/modules/photos.rs',
    previewImage: '/images/photo_widget_architecture.jpg',
  },
  {
    id: 'quick_actions',
    numberLabel: '09',
    title: 'Quick Actions',
    category: 'System & Utilities',
    summary:
      'Shortcuts to supported system utilities and configured actions.',
    implementedDetails: [
      'Compact, overflow-safe icon grid for triggering supported desktop actions.',
      'Shortcuts for Lock Screen (loginctl lock-session), Screenshot (spectacle), Audio Mute (pactl), and Night Color.',
      'Detached command execution handled safely by the Rust quick_actions module.',
    ],
    qmlFile: 'QuickActionsWidget.qml',
    rustModule: 'core/src/modules/quick_actions.rs',
    previewImage: '/images/gallery/widgetwall-desktop-showcase.png',
  },
  {
    id: 'system_monitor',
    numberLabel: '10',
    title: 'System Monitor',
    category: 'System & Utilities',
    summary:
      'System information such as CPU, memory, and battery metrics where supported.',
    implementedDetails: [
      'Displays processor load percentage, memory usage (GB and %), and battery/disk progress indicators.',
      'Backed by direct /proc and /sys sampling in the Rust sysmonitor module.',
      'Configurable polling interval (1s, 3s, or 10s) to keep background CPU usage minimal.',
    ],
    qmlFile: 'SystemMonitorWidget.qml',
    rustModule: 'core/src/modules/sysmonitor.rs',
    previewImage: '/images/gallery/system-monitor-showcase.png',
  },
];

export interface PersonalizationCapability {
  id: string;
  title: string;
  description: string;
  optionsSummary: string;
}

export const PERSONALIZATION_CAPABILITIES: PersonalizationCapability[] = [
  {
    id: 'appearance-modes',
    title: 'Appearance Modes',
    description:
      'Synchronize the widget ecosystem across Auto, crisp Light, or deep Dark appearance modes.',
    optionsSummary: 'Auto · Light · Dark',
  },
  {
    id: 'surface-styles',
    title: 'Surface Styles',
    description:
      'Choose how widget surfaces blend with your desktop wallpaper using controlled translucency and subtle borders.',
    optionsSummary: 'Default · Dark · Clear · Tinted · Solid',
  },
  {
    id: 'accent-colors',
    title: 'Accent Colors & Custom Hex Input',
    description:
      'Select from 9 curated macOS-inspired accent swatches or enter any custom #RRGGBB hex color with automatic surface tinting.',
    optionsSummary: '9 Presets + Custom #RRGGBB',
  },
  {
    id: 'widget-backgrounds',
    title: 'Wallpaper & Widget Backgrounds',
    description:
      'Configure desktop atmosphere wallpapers and apply per-widget local background images (SVG, JPG, JPEG, PNG, WebP) with readability overlays.',
    optionsSummary: 'Cover · Contain · Stretch · Center',
  },
  {
    id: 'geometry-and-effects',
    title: 'Geometry & Supported Visual Effects',
    description:
      'Adjust widget corner radius, padding, 3D floating card elevation shadows (Levels 0–3), and compositor performance profiles.',
    optionsSummary: 'Elevation L0–L3 · Geometry Controls',
  },
  {
    id: 'layout-customization',
    title: 'Widget Layout Customization',
    description:
      'Enable or disable individual widgets, resize cards (1x1, 2x1, 2x2), and configure global or per-widget appearance preferences.',
    optionsSummary: '10 Modular Widgets · Grid Layout',
  },
];

export interface GalleryItemSpec {
  id: string;
  title: string;
  category: 'Desktop' | 'Productivity' | 'Media' | 'Customization';
  caption: string;
  technicalMeta: string;
  imagePath: string;
}

export const GALLERY_ITEMS: GalleryItemSpec[] = [
  {
    id: 'gallery-desktop-full',
    title: 'URWidgets Desktop Preview',
    category: 'Desktop',
    caption:
      'Official high-resolution desktop capture of URWidgets on KDE Plasma 5 with the full WidgetWall layout.',
    technicalMeta: 'docs/images/urwidgets-desktop.png · 1920x1080 KDE Plasma 5',
    imagePath: '/docs/images/urwidgets-desktop.png',
  },
  {
    id: 'gallery-preferences-full',
    title: 'Appearance Studio & Preferences',
    category: 'Customization',
    caption:
      'Native URWidgets Control Center & Appearance Studio for custom themes, surface styles, accents, and widget backgrounds.',
    technicalMeta: 'docs/images/urwidgets-preference.png · 1920x1080 Control Center',
    imagePath: '/docs/images/urwidgets-preference.png',
  },
  {
    id: 'gallery-widgetwall',
    title: 'Complete URWidgets Desktop',
    category: 'Desktop',
    caption:
      'The complete URWidgets KDE Plasma 5 desktop arrangement displaying Clock & Alarms, Calendar, System Monitor, Photo Frame, Weather, and To-Do List in Tinted Pink (#E84A7F).',
    technicalMeta: 'Monochrome Studio · Light · Tinted · KDE Plasma 5',
    imagePath: '/images/gallery/widgetwall-desktop-showcase.png',
  },
  {
    id: 'gallery-appearance-customization',
    title: 'Appearance Toolbar & Styles',
    category: 'Customization',
    caption:
      'Global Appearance configuration bar for switching Auto/Light/Dark modes, Default/Dark/Clear/Tinted/Solid surface styles, 9 accent colors, custom hex, widget backgrounds, and grid layout.',
    technicalMeta: 'WidgetTheme.qml · configGeneral.qml · SQLite WAL',
    imagePath: '/images/gallery/appearance-toolbar-showcase.png',
  },
  {
    id: 'gallery-clock-alarm',
    title: 'Clock & Alarms',
    category: 'Productivity',
    caption:
      'Digital desktop clock with active alarm indicator (07:00), 12h/24h and seconds toggles, and multi-alarm manager with custom ringtone support.',
    technicalMeta: 'ClockWidget.qml · alarms.rs · PID-Isolated Audio',
    imagePath: '/images/gallery/clock-alarm-showcase.png',
  },
  {
    id: 'gallery-calendar',
    title: 'Calendar',
    category: 'Productivity',
    caption:
      '42-cell monthly calendar grid with English (EN) and Indonesian (ID) locale toggle, configurable Monday/Sunday start, and active date badge.',
    technicalMeta: 'CalendarWidget.qml · calendar.rs · Bilingual Grid',
    imagePath: '/images/gallery/calendar-showcase.png',
  },
  {
    id: 'gallery-weather',
    title: 'Weather',
    category: 'Desktop',
    caption:
      'Desktop weather card displaying city selector, current temperature (29°), Celsius/Fahrenheit toggle, sky condition summary, and daily H/L range.',
    technicalMeta: 'WeatherWidget.qml · weather.rs · SQLite Cache',
    imagePath: '/images/gallery/weather-showcase.png',
  },
  {
    id: 'gallery-productivity-todo',
    title: 'To-Do List',
    category: 'Productivity',
    caption:
      'Deadline-tracked To-Do List with priority tags (High, Medium, Low), completion progress bar, status filters (All/Active/Done), inline edit, and delete controls.',
    technicalMeta: 'AgendaWidget.qml · agenda.rs · SQLite Persistence',
    imagePath: '/images/gallery/todo-list-showcase.png',
  },
  {
    id: 'gallery-system-monitor',
    title: 'System Monitor',
    category: 'Desktop',
    caption:
      'Processor, memory (GB & %), and battery/disk progress indicators with configurable 1s, 3s, and 10s polling intervals.',
    technicalMeta: 'SystemMonitorWidget.qml · sysmonitor.rs · /proc & /sys',
    imagePath: '/images/gallery/system-monitor-showcase.png',
  },
  {
    id: 'gallery-photo-frame',
    title: 'Photo Frame',
    category: 'Media',
    caption:
      'Rounded desktop photography presentation supporting Single Photo and Slideshow modes with smooth crossfade transitions and non-destructive crop settings.',
    technicalMeta: 'PhotoWidget.qml · photos.rs · Double-Buffered QML',
    imagePath: '/images/photo_widget_architecture.jpg',
  },
  {
    id: 'gallery-music-player',
    title: 'Music Player',
    category: 'Media',
    caption:
      'Desktop music playback supporting local music folders (.mp3, .flac, .ogg, .wav, .m4a) and direct online audio streams with album artwork and queue controls.',
    technicalMeta: 'MusicPlayerWidget.qml · music.rs · Local & Stream',
    imagePath: '/images/photo_widget_botanical.jpg',
  },
];

export const COMPATIBILITY_DATA = {
  title: 'Built for Linux. Designed for KDE Plasma 5.',
  description:
    'URWidgets is currently developed and targeted for KDE Plasma 5. Compatibility with other Linux distributions depends on their KDE Plasma version and required runtime dependencies.',
  supportedTarget: {
    statusLabel: 'Primary Development Environment',
    badgeText: 'Primary Target · Verified',
    environment: 'KDE Plasma 5',
    primaryDistro: 'Linux Mint with KDE Plasma 5.',
    items: [
      'Linux Mint with KDE Plasma 5 (Primary development & verification environment)',
      'KDE Plasma 5 (plasma-workspace >= 4:5.24, tested on 5.27 LTS)',
      'Qt 5.15 QtQuick / QML Applet containment & kpackagetool5',
    ],
  },
  potentiallyCompatible: {
    statusLabel: 'Potential Compatibility',
    badgeText: 'Potentially Compatible · Not Individually Verified',
    description:
      'Other Linux distributions running KDE Plasma 5 may be compatible if the required Qt, KDE Frameworks, and runtime dependencies are available. These are possible testing targets and are not individually verified unless actual testing has been completed:',
    items: [
      'Kubuntu with KDE Plasma 5 (Potentially compatible — not individually verified)',
      'Fedora KDE with KDE Plasma 5 (Potentially compatible — not individually verified)',
      'Arch Linux with KDE Plasma 5 (Potentially compatible — not individually verified)',
      'Other distributions running KDE Plasma 5',
    ],
  },
  notSupportedYet: {
    statusLabel: 'Not Supported Yet',
    badgeText: 'Unsupported Desktop Environments',
    description:
      'Desktop environments without dedicated KDE Plasma 5 QML Applet integration are not supported yet:',
    items: [
      'KDE Plasma 6',
      'GNOME',
      'Cinnamon',
      'XFCE',
      'Other desktop environments without dedicated integration',
    ],
  },
  minimumRequirements: {
    title: 'Minimum Requirements',
    items: [
      { label: 'Operating System', value: 'Linux' },
      { label: 'Desktop Environment', value: 'KDE Plasma 5' },
      { label: 'Minimum RAM', value: '8 GB' },
      {
        label: 'Runtime Dependencies',
        value:
          'According to the actual installer and documentation (plasma-workspace >= 4:5.24, qml-module-org-kde-kquickcontrolsaddons, qml-module-qtquick-controls2, qml-module-qtquick-layouts, qml-module-qtgraphicaleffects, libsqlite3-0)',
      },
    ],
  },
} as const;

export const TERMINAL_INSTALLATION_STEPS = [
  'Download the .deb package from the official GitHub Release (v3.0.2).',
  'Open a Linux terminal emulator on your KDE Plasma 5 system.',
  'Navigate to the ~/Downloads directory where the package was saved.',
  'Replace the placeholder NAMA_FILE_URWIDGETS.deb with the actual downloaded .deb filename.',
  'Execute the command and allow apt to install URWidgets and its required runtime dependencies.',
] as const;

export function resolveLandingAsset(path: string): string {
  return withBasePath(path);
}
