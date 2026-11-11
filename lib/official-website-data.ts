export interface ProjectIdentity {
  name: string;
  version: string;
  repoUrl: string;
  author: string;
  githubProfileUrl: string;
  portfolioUrl: string;
  instagramUrl: string;
  platform: string;
  supportedDesktop: string;
  targetCompatibilityNote: string;
}

export const URWIDGETS_PROJECT_IDENTITY: ProjectIdentity = {
  name: 'URWidgets',
  version: '3.1.0',
  repoUrl: 'https://github.com/Harisgitama/Urwidgets',
  author: 'Haris Gitama',
  githubProfileUrl: 'https://github.com/Harisgitama',
  portfolioUrl: 'https://rissaxie.com',
  instagramUrl: 'https://www.instagram.com/hrigtaa_/',
  platform: 'Linux',
  supportedDesktop: 'KDE Plasma 5',
  targetCompatibilityNote:
    'Other Linux distributions running KDE Plasma 5, provided the required runtime and build dependencies are available.',
};

export interface NavItem {
  id: 'home' | 'features' | 'gallery' | 'compatibility' | 'about';
  label: string;
  href: string;
}

export const OFFICIAL_NAV_LINKS: NavItem[] = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'features', label: 'Features', href: '#features' },
  { id: 'gallery', label: 'Gallery', href: '#gallery' },
  { id: 'compatibility', label: 'Compatibility', href: '#compatibility' },
  { id: 'about', label: 'About', href: '#about' },
];

export interface ProductHighlight {
  id: string;
  title: string;
  description: string;
  iconKey: 'widgets' | 'palette' | 'music' | 'plasma' | 'linux';
}

export const PRODUCT_HIGHLIGHTS: ProductHighlight[] = [
  {
    id: 'customizable-widgets',
    title: 'Customizable Desktop Widgets',
    description:
      'Modular desktop applets that blend naturally into your workspace with flexible layout and per-widget configuration.',
    iconKey: 'widgets',
  },
  {
    id: 'personalized-appearance',
    title: 'Personalized Appearance',
    description:
      'Fine-tune surface translucency, Liquid Glass depth, accent colors, and dark or light modes across your desktop.',
    iconKey: 'palette',
  },
  {
    id: 'music-and-productivity',
    title: 'Music and Productivity Tools',
    description:
      'Control local or streaming audio, manage daily alarms with custom ringtones, and check your monthly calendar at a glance.',
    iconKey: 'music',
  },
  {
    id: 'designed-for-kde-plasma-5',
    title: 'Designed for KDE Plasma 5',
    description:
      'Built specifically for KDE Plasma 5 using QML Plasmoid integration, KWin blur awareness, and native desktop conventions.',
    iconKey: 'plasma',
  },
  {
    id: 'linux-desktop-experience',
    title: 'Linux Desktop Experience',
    description:
      'Engineered with a lightweight Rust daemon and Tauri architecture to keep your Linux desktop responsive and lag-free.',
    iconKey: 'linux',
  },
];

export interface FeatureSpec {
  id: 'music-player' | 'alarm' | 'calendar' | 'photo-frame' | 'appearance';
  numberLabel: string;
  title: string;
  subtitle: string;
  description: string;
  capabilities: string[];
  technicalNote?: string;
}

export const OFFICIAL_FEATURES: FeatureSpec[] = [
  {
    id: 'music-player',
    numberLabel: '01',
    title: 'Music Player Widget',
    subtitle: 'Direct desktop media control for local audio and live streams',
    description:
      'Control your music directly from the KDE Plasma 5 desktop without switching windows. Powered by a non-blocking Rust audio scanner and detached playback engine for zero UI stutter.',
    capabilities: [
      'Full playback controls: Play, Pause, Stop, Next track, and Previous track',
      'Interactive progress bar with elapsed/total duration display and seek support',
      'Dedicated volume slider and instant mute toggle',
      'Supports local audio directories (e.g. ~/Music/) and direct online stream URLs',
      'Shuffle and repeat modes (Off, Repeat All, Repeat One) with track queue view',
    ],
  },
  {
    id: 'alarm',
    numberLabel: '02',
    title: 'Alarm Widget',
    subtitle: 'Reliable desktop time reminders with unified custom ringtone support',
    description:
      'Set and manage multiple desktop alarms inside a clean two-slide Clock & Alarm interface, backed by a Rust scheduler and PID-tracked audio runner.',
    capabilities: [
      'Create and configure alarms with 24-hour or 12-hour time selection (HH:MM)',
      'Manage saved alarms: toggle active state, edit schedule, or delete entries',
      'Interactive Snooze and Stop controls when an alarm notification triggers',
      'Unified local alarm ringtone path (e.g. ~/Music/ or a specific audio file) with instant sound test',
    ],
    technicalNote:
      'Note: Alarms require an active Linux desktop session and running URWidgets service; alarms cannot ring when the system is powered off.',
  },
  {
    id: 'calendar',
    numberLabel: '03',
    title: 'Calendar Widget',
    subtitle: 'Clean monthly date navigation right on your desktop wallpaper',
    description:
      'A distraction-free monthly calendar grid that stays synchronized with your global desktop theme and accent color.',
    capabilities: [
      '42-cell monthly grid with highlighted current date and selected date state',
      'Instant Previous Month, Today jump, and Next Month navigation controls',
      'Configurable first day of the week (Monday or Sunday)',
      'Locale switcher supporting English (en-US) and Indonesian (id-ID) month and day names',
    ],
  },
  {
    id: 'photo-frame',
    numberLabel: '04',
    title: 'Photo Frame Widget',
    subtitle: 'Minimal, borderless photography showcase with smooth crossfade transitions',
    description:
      'Display curated personal photography or bundled high-resolution artwork inside a clean rounded glass frame without visual clutter.',
    capabilities: [
      'Displays images from a local directory path (e.g. ~/Pictures) or bundled photography',
      'Configurable folder path and automatic Slideshow mode with adjustable interval seconds',
      'Hardware-friendly double-buffered crossfade transition (550ms) at fixed decode resolution',
      'Clean presentation without intrusive overlay buttons or accidental workspace scroll triggers',
    ],
  },
  {
    id: 'appearance',
    numberLabel: '05',
    title: 'Appearance and Personalization',
    subtitle: 'Centralized Liquid Glass material system and Rust-synced desktop styling',
    description:
      'Customize how every widget looks and feels on your desktop. Changes in Dock & Widget Preferences are synchronized atomically via Rust & Tauri with zero main-thread lag.',
    capabilities: [
      'Theme & Atmosphere presets including Liquid Glass, Warm Minimal, Midnight Dark, and Monochrome',
      'Appearance modes (Dark, Light, Auto) and surface styles (Default, Dark, Clear, Tinted, Solid)',
      '9 preset accent colors plus custom hexadecimal color input (#RRGGBB)',
      'Adjustable corner radius, surface opacity, border opacity, and custom per-widget background images',
      'Multi-level 3D card shadow elevation (Levels 0–3) and optional KWin blur integration',
    ],
  },
];

export type GalleryCategory = 'all' | 'desktop' | 'widgets' | 'appearance';

export interface GalleryItem {
  id: string;
  title: string;
  category: Exclude<GalleryCategory, 'all'>;
  caption: string;
  aspectLabel: string;
  imageSrc: string;
  previewType:
    | 'desktop-overview'
    | 'music-player'
    | 'alarm'
    | 'calendar'
    | 'photo-frame'
    | 'appearance-config';
  highlights: string[];
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-desktop',
    title: 'Desktop Overview with Widgets',
    category: 'desktop',
    caption:
      'KDE Plasma 5 desktop layout running URWidgets with Liquid Glass Dark surfaces, Clock & Alarm, Calendar, Music Player, and Photo Frame.',
    aspectLabel: '16:9 Desktop Layout Concept & Live Preview',
    imageSrc: '/images/alpine_mist_wallpaper.jpg',
    previewType: 'desktop-overview',
    highlights: ['KDE Plasma 5 Containment', 'Liquid Glass Material', 'Rust Shared Daemon'],
  },
  {
    id: 'gal-music',
    title: 'Music Player',
    category: 'widgets',
    caption:
      'Floating desktop Music Player with album artwork, transport controls, seek bar, volume control, and ~/Music/ directory scanner.',
    aspectLabel: 'Widget Preview · org.urwidgets.music',
    imageSrc: '/images/photo_widget_architecture.jpg',
    previewType: 'music-player',
    highlights: ['Play / Pause / Next / Prev', 'Seek & Volume Control', 'Local ~/Music/ & Stream URL'],
  },
  {
    id: 'gal-alarm',
    title: 'Alarm',
    category: 'widgets',
    caption:
      'Two-slide Clock & Alarm widget featuring multiple alarms, hour/minute selector, Snooze/Stop banner, and unified ~/Music/ ringtone setting.',
    aspectLabel: 'Widget Preview · org.urwidgets.clock',
    imageSrc: '/images/alpine_mist_wallpaper.jpg',
    previewType: 'alarm',
    highlights: ['Create & Manage Alarms', 'Snooze & Stop Banner', 'Unified Ringtone Path'],
  },
  {
    id: 'gal-calendar',
    title: 'Calendar',
    category: 'widgets',
    caption:
      'Clean monthly Calendar widget with accent-highlighted current day, month navigation, and Monday/Sunday start configuration.',
    aspectLabel: 'Widget Preview · org.urwidgets.calendar',
    imageSrc: '/images/photo_widget_botanical.jpg',
    previewType: 'calendar',
    highlights: ['Monthly Date Grid', 'Month & Today Navigation', 'EN / ID Localization'],
  },
  {
    id: 'gal-photo',
    title: 'Photo Frame',
    category: 'widgets',
    caption:
      'Pure rounded Photo Frame widget displaying local photography with smooth 550ms crossfade slideshow transitions.',
    aspectLabel: 'Widget Preview · org.urwidgets.photos',
    imageSrc: '/images/photo_widget_botanical.jpg',
    previewType: 'photo-frame',
    highlights: ['Local Folder & Bundled Photos', 'Automatic Slideshow', 'Smooth Crossfade'],
  },
  {
    id: 'gal-appearance',
    title: 'Appearance Configuration',
    category: 'appearance',
    caption:
      'Global Theme, Surface Style, Accent Color (#RRGGBB), and 3D Shadow Elevation settings powered by Rust & Tauri atomic state sync.',
    aspectLabel: 'Configuration Preview · Rust + Tauri Studio',
    imageSrc: '/images/photo_widget_architecture.jpg',
    previewType: 'appearance-config',
    highlights: ['Liquid Glass Light & Dark', 'Custom Hex Accent Color', 'Zero-Lag Rust + Tauri Sync'],
  },
];

export function filterGalleryItems(
  items: GalleryItem[],
  category: GalleryCategory
): GalleryItem[] {
  if (category === 'all') return items;
  return items.filter((item) => item.category === category);
}

export function getNextLightboxIndex(
  currentIndex: number,
  total: number,
  direction: 'next' | 'prev'
): number {
  if (total <= 0) return 0;
  if (direction === 'next') {
    return (currentIndex + 1) % total;
  }
  return (currentIndex - 1 + total) % total;
}

export interface CompatibilityTier {
  id: 'supported' | 'potentially-compatible' | 'not-supported';
  title: string;
  badgeText: string;
  summary: string;
  items: string[];
}

export const COMPATIBILITY_TIERS: CompatibilityTier[] = [
  {
    id: 'supported',
    title: 'Supported',
    badgeText: 'Tested & Verified',
    summary:
      'Linux distributions with KDE Plasma 5 that have been directly tested with URWidgets.',
    items: [
      'Linux distributions running KDE Plasma 5 (5.24 – 5.27 LTS)',
      'Tested on Linux Mint KDE Plasma 5 / Ubuntu- & Debian-based KDE Plasma 5 environments',
      'X11 and Wayland sessions running KWin 5 with standard Qt 5.15 QML modules',
    ],
  },
  {
    id: 'potentially-compatible',
    title: 'Potentially Compatible',
    badgeText: 'Requires Testing',
    summary:
      'Other Linux distributions running KDE Plasma 5 that meet all URWidgets build and runtime dependencies.',
    items: [
      'Other Linux distributions shipping KDE Plasma 5 (such as Fedora KDE Spin 5.x, openSUSE Leap KDE 5.x, Arch KDE 5.x)',
      'Requires matching Qt 5.15, KDE Frameworks 5, SQLite 3, and audio CLI utilities',
      'Compatibility on these distributions still requires testing and verification per environment',
    ],
  },
  {
    id: 'not-supported',
    title: 'Not Supported Yet',
    badgeText: 'Unsupported',
    summary:
      'Desktop environments and versions that do not yet have native URWidgets integration.',
    items: [
      'KDE Plasma 6',
      'GNOME',
      'Cinnamon',
      'XFCE',
      'Other desktop environments without KDE Plasma 5 QML Applet integration',
    ],
  },
];

export interface MinimumRequirement {
  label: string;
  value: string;
}

export const MINIMUM_DEVICE_REQUIREMENTS: MinimumRequirement[] = [
  { label: 'Operating System', value: 'Linux' },
  { label: 'Desktop Environment', value: 'KDE Plasma 5' },
  { label: 'Minimum RAM', value: '8 GB' },
  {
    label: 'Runtime Dependencies',
    value:
      'Follows URWidgets build requirements (plasma-workspace >= 5.24, Qt 5.15 QML modules, libsqlite3-0, Rust/Cargo toolchain, mpv/paplay/aplay)',
  },
];

export const LATEST_CHANGELOG_SUMMARY = {
  version: '3.1.0',
  date: '2026-11-11',
  author: 'Haris Gitama',
  authorWebsite: 'https://rissaxie.com',
  githubRepo: 'https://github.com/Harisgitama/Urwidgets',
  title: 'Rust + Tauri Zero-Lag Dock Preference & Widget Interaction Optimization',
  highlights: [
    'Eliminated Dock & Widget Preference opening lag by removing eager QtQuick.Dialogs KIO main-thread initialization in configGeneral.qml.',
    'Added native Rust CLI (urwidgets-daemon set-theme / get-theme) and Tauri 2 IPC commands (tauri_apply_global_theme) using atomic temp-file rename in <1ms.',
    'Enabled asynchronous QML widget loading (asynchronous: true) and debounced non-blocking D-Bus/shell calls so widget interactions never stall the desktop.',
    'Unified global alarm ringtone path (~/Music/) across all alarms, detached background audio playback, and smooth reactive Photo Frame crossfades.',
  ],
};
