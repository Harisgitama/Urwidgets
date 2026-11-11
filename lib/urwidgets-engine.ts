// Pure, decoupled core logic for URWidgets Design System, macOS Appearance Engine,
// Calendar (EN/ID), Weather Unit Conversion, Pomodoro Timestamp State Machine,
// Agenda CRUD, Quick Actions configuration, and System Telemetry.

export type AppearanceMode = 'auto' | 'light' | 'dark';

export type WidgetSurfaceStyle =
  | 'default'
  | 'dark'
  | 'clear'
  | 'tinted'
  | 'solid';

export type AccentColorId =
  | 'auto'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'graphite'
  | 'custom';

export interface AccentColorOption {
  id: AccentColorId;
  label: string;
  hex: string;
  softTintLight: string;
  softTintDark: string;
}

export const ACCENT_COLORS: AccentColorOption[] = [
  {
    id: 'auto',
    label: 'Automatic',
    hex: '#E85D75',
    softTintLight: '#FBECEF',
    softTintDark: '#3A1D24',
  },
  {
    id: 'blue',
    label: 'Blue',
    hex: '#007AFF',
    softTintLight: '#EBF4FF',
    softTintDark: '#13294B',
  },
  {
    id: 'purple',
    label: 'Purple',
    hex: '#9B51E0',
    softTintLight: '#F3EBFF',
    softTintDark: '#2C1B47',
  },
  {
    id: 'pink',
    label: 'Pink',
    hex: '#E84A7F',
    softTintLight: '#FCEBF1',
    softTintDark: '#3D1928',
  },
  {
    id: 'red',
    label: 'Red',
    hex: '#E03E36',
    softTintLight: '#FDECEB',
    softTintDark: '#3E1A18',
  },
  {
    id: 'orange',
    label: 'Orange',
    hex: '#F28C28',
    softTintLight: '#FEF3E7',
    softTintDark: '#3F2712',
  },
  {
    id: 'yellow',
    label: 'Yellow',
    hex: '#E6B800',
    softTintLight: '#FDF8E4',
    softTintDark: '#3A3010',
  },
  {
    id: 'green',
    label: 'Green',
    hex: '#2E9E5B',
    softTintLight: '#EAF7EF',
    softTintDark: '#143322',
  },
  {
    id: 'graphite',
    label: 'Graphite',
    hex: '#6E6E73',
    softTintLight: '#F0F0F2',
    softTintDark: '#2C2C2E',
  },
];

export type GradientPresetId =
  | 'aurora'
  | 'soft-pink'
  | 'lavender'
  | 'ocean-blue'
  | 'sage'
  | 'peach'
  | 'sunset'
  | 'midnight';

export interface GradientPreset {
  id: GradientPresetId;
  name: string;
  start: string;
  end: string;
  third?: string;
  angle: number;
  intensity: number;
}

export const GRADIENT_PRESETS: GradientPreset[] = [
  {
    id: 'peach',
    name: 'Peach & Oat',
    start: '#F5EFE8',
    end: '#EADFD5',
    third: '#F3E5DC',
    angle: 135,
    intensity: 0.45,
  },
  {
    id: 'soft-pink',
    name: 'Soft Pink',
    start: '#F9EEF2',
    end: '#EFE4EC',
    third: '#F5E1E9',
    angle: 140,
    intensity: 0.5,
  },
  {
    id: 'sage',
    name: 'Sage Editorial',
    start: '#EBF0EC',
    end: '#DFE7E1',
    third: '#E6ECE7',
    angle: 135,
    intensity: 0.5,
  },
  {
    id: 'lavender',
    name: 'Lavender Mist',
    start: '#F0EDF8',
    end: '#E5E0F2',
    third: '#EAE6F6',
    angle: 135,
    intensity: 0.5,
  },
  {
    id: 'ocean-blue',
    name: 'Ocean Air',
    start: '#EBF2F7',
    end: '#DCE8F2',
    third: '#E4EEF6',
    angle: 145,
    intensity: 0.5,
  },
  {
    id: 'sunset',
    name: 'Warm Sunset',
    start: '#F7EDE6',
    end: '#ECDCD3',
    third: '#F3E3D8',
    angle: 125,
    intensity: 0.55,
  },
  {
    id: 'aurora',
    name: 'Aurora Night',
    start: '#1E2238',
    end: '#172A3A',
    third: '#231F3A',
    angle: 145,
    intensity: 0.65,
  },
  {
    id: 'midnight',
    name: 'Midnight Slate',
    start: '#181A20',
    end: '#121318',
    third: '#1C1F26',
    angle: 160,
    intensity: 0.6,
  },
];

export interface SystemFontOption {
  id: string;
  label: string;
  cssStack: string;
  qmlFamily: string;
  note: string;
}

export const SYSTEM_FONT_OPTIONS: SystemFontOption[] = [
  {
    id: 'sf-pro',
    label: 'SF Pro Display / Text',
    cssStack:
      '"SF Pro Display", "SF Pro Text", -apple-system, "Helvetica Neue", "Noto Sans Display", sans-serif',
    qmlFamily: 'SF Pro Display',
    note: 'Primary macOS system font when installed on Linux (~/.local/share/fonts)',
  },
  {
    id: 'helvetica-neue',
    label: 'Helvetica Neue',
    cssStack: '"Helvetica Neue", "Liberation Sans", "Noto Sans", sans-serif',
    qmlFamily: 'Helvetica Neue',
    note: 'Classic neo-grotesque macOS & editorial interface typeface',
  },
  {
    id: 'avenir-next',
    label: 'Avenir Next',
    cssStack: '"Avenir Next", "Plus Jakarta Sans", "Noto Sans Display", sans-serif',
    qmlFamily: 'Avenir Next',
    note: 'Warm geometric human interface font',
  },
  {
    id: 'noto-sans-display',
    label: 'Noto Sans Display',
    cssStack: '"Noto Sans Display", "Noto Sans", "Liberation Sans", sans-serif',
    qmlFamily: 'Noto Sans Display',
    note: 'Pre-installed Linux Mint / KDE Plasma system display font',
  },
  {
    id: 'jetbrains-mono',
    label: 'JetBrains Mono',
    cssStack: '"JetBrains Mono", "DejaVu Sans Mono", monospace',
    qmlFamily: 'JetBrains Mono',
    note: 'Installed tabular monospace font for technical precision',
  },
];

export type ElevationLevel = 0 | 1 | 2 | 3;

export interface ElevationSpec {
  level: ElevationLevel;
  label: string;
  description: string;
  lightShadow: string;
  darkShadow: string;
}

export const ELEVATION_LEVELS: ElevationSpec[] = [
  {
    level: 0,
    label: 'Level 0 — Flat',
    description: 'Zero shadow (flush with desktop containment)',
    lightShadow: 'none',
    darkShadow: 'none',
  },
  {
    level: 1,
    label: 'Level 1 — Subtle 3D Lift',
    description: 'Soft ambient edge definition with subtle top highlight rim',
    lightShadow:
      '0 8px 20px -4px rgba(15, 16, 22, 0.14), 0 3px 8px -2px rgba(15, 16, 22, 0.08), inset 0 1px 0 0 rgba(255, 255, 255, 0.65)',
    darkShadow:
      '0 10px 24px -4px rgba(0, 0, 0, 0.45), 0 4px 10px -2px rgba(0, 0, 0, 0.32), inset 0 1px 0 0 rgba(255, 255, 255, 0.14)',
  },
  {
    level: 2,
    label: 'Level 2 — Floating 3D Card',
    description: 'Default macOS WidgetWall floating 3D card depth',
    lightShadow:
      '0 20px 44px -8px rgba(15, 16, 22, 0.24), 0 8px 18px -4px rgba(15, 16, 22, 0.14), 0 2px 5px 0 rgba(15, 16, 22, 0.08), inset 0 1px 0 0 rgba(255, 255, 255, 0.78)',
    darkShadow:
      '0 24px 52px -8px rgba(0, 0, 0, 0.68), 0 10px 22px -4px rgba(0, 0, 0, 0.48), 0 2px 6px 0 rgba(0, 0, 0, 0.35), inset 0 1px 0 0 rgba(255, 255, 255, 0.18)',
  },
  {
    level: 3,
    label: 'Level 3 — Deep 3D Elevation',
    description: 'High-depth 3D floating card shadow above desktop wallpaper',
    lightShadow:
      '0 32px 68px -10px rgba(15, 16, 22, 0.34), 0 14px 28px -6px rgba(15, 16, 22, 0.20), 0 4px 10px 0 rgba(15, 16, 22, 0.12), inset 0 1px 0 0 rgba(255, 255, 255, 0.88)',
    darkShadow:
      '0 36px 76px -10px rgba(0, 0, 0, 0.82), 0 16px 34px -6px rgba(0, 0, 0, 0.62), 0 4px 12px 0 rgba(0, 0, 0, 0.44), inset 0 1px 0 0 rgba(255, 255, 255, 0.24)',
  },
];

export function computeElevationShadow(
  level: ElevationLevel,
  isDark: boolean
): string {
  const spec =
    ELEVATION_LEVELS.find((e) => e.level === level) || ELEVATION_LEVELS[2];
  return isDark ? spec.darkShadow : spec.lightShadow;
}

export const DEVELOPER_ATTRIBUTION = {
  author: 'Haris Gitama',
  githubUrl: 'https://github.com/Harisgitama',
  portfolioUrl: 'https://rissaxie.com',
  portfolioLabel: 'rissaxie.com',
  instagramUrl: 'https://www.instagram.com/hrisgtaa_/',
  instagramLabel: '@hrisgtaa_',
  appearanceLabel: 'Created by Haris Gitama',
  appearanceText: 'Created by Haris Gitama',
  widgetConfigLabel: 'Developed by Haris Gitama',
  widgetConfigText: 'Developed by Haris Gitama',
  footerSummary: 'URWidgets — Created by Haris Gitama',
} as const;

export type ThemePresetId =
  | 'warm-minimal'
  | 'liquid-glass'
  | 'pastel-editorial'
  | 'aurora-gradient'
  | 'midnight'
  | 'monochrome'
  | string;

export interface ThemeSpec {
  id: ThemePresetId;
  name: string;
  description: string;
  isPreset: boolean;
  appearanceMode?: AppearanceMode;
  widgetStyle?: WidgetSurfaceStyle;
  accentColorId?: AccentColorId;
  highlightColorId?: AccentColorId;
  systemFontId?: string;
  appearance: {
    primary: string;
    secondary: string;
    accent: string;
    surface: string;
    text: string;
    mutedText: string;
    opacity: number;
    borderOpacity: number;
    radius: number;
    spacing: number;
    fontFamily: 'Plus Jakarta Sans' | 'JetBrains Mono' | string;
  };
  gradient: {
    enabled: boolean;
    presetId?: GradientPresetId;
    start: string;
    end: string;
    third?: string;
    angle: number;
    intensity: number;
  };
  effects: {
    blur: boolean;
    shadow: boolean;
    shadowIntensity: number;
    animations: boolean;
  };
}

export type WidgetId =
  | 'clock'
  | 'calendar'
  | 'weather'
  | 'pomodoro'
  | 'agenda'
  | 'photos'
  | 'quick_actions'
  | 'system_monitor'
  | 'notes'
  | 'music_player';

export type WidgetSize = 'small' | 'compact' | 'medium' | 'large' | 'wide';

export type WidgetIconStyle = 'filled' | 'outline' | 'minimal' | 'tinted';

export interface WidgetInstanceConfig {
  id: WidgetId;
  configId: string; // e.g. 'widget.clock', 'widget.calendar', etc.
  title: string;
  subtitle: string;
  enabled: boolean;
  size: WidgetSize;
  themeOverride: string | null; // null inherits global theme
  appearanceOverride?: AppearanceMode | null; // null inherits global appearance
  styleOverride?: WidgetSurfaceStyle | null; // null inherits global widget style
  accentOverride?: AccentColorId | null; // null inherits global accent color
  elevationOverride?: ElevationLevel | null; // null inherits global elevation
  opacityOverride?: number | null; // null inherits theme opacity
  radiusOverride?: number | null; // null inherits theme corner radius
  borderOpacityOverride?: number | null; // null inherits theme border opacity
  backgroundColorOverride?: string | null; // null inherits surface color
  gradientOverride?: 'inherit' | 'on' | 'off'; // inherit | on | off
  textColorOverride?: string | null; // null inherits theme text color
  iconStyleOverride?: WidgetIconStyle | null; // filled | outline | minimal | tinted
  fontFamilyOverride?: string | null; // null inherits global system font
}

export interface AgendaEvent {
  id: string;
  title: string;
  dateIso: string; // YYYY-MM-DD
  dayHeader?: string; // e.g. "MONDAY, NOV 9"
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  category: 'Engineering' | 'Architecture' | 'Release' | 'Personal';
  completed: boolean;
}

export interface QuickActionShortcut {
  id: string;
  label: string;
  command: string;
  iconKey:
    | 'folder'
    | 'terminal'
    | 'activity'
    | 'settings'
    | 'sparkles'
    | 'globe';
}

export type PomodoroPhase = 'Study' | 'Short Break' | 'Long Break';
export type PomodoroStatus = 'Idle' | 'Running' | 'Paused';

export interface PomodoroState {
  phase: PomodoroPhase;
  status: PomodoroStatus;
  remainingSecs: number;
  totalSecs: number;
  completedSessions: number;
  studyMins: number;
  shortBreakMins: number;
  longBreakMins: number;
  notifyOnComplete: boolean;
}

export interface WeatherCityData {
  city: string;
  country: string;
  tempC: number;
  highC: number;
  lowC: number;
  condition: string;
  humidityPct: number;
  windKph: number;
  updatedAt: string;
  hourly: { hour: string; tempC: number; condition: string }[];
  daily: { day: string; minC: number; maxC: number; condition: string }[];
}

export const INITIAL_QUICK_ACTIONS: QuickActionShortcut[] = [
  {
    id: 'qa-dolphin',
    label: 'Files',
    command: 'dolphin ~',
    iconKey: 'folder',
  },
  {
    id: 'qa-konsole',
    label: 'Terminal',
    command: 'konsole',
    iconKey: 'terminal',
  },
  {
    id: 'qa-projects',
    label: 'Projects',
    command: 'xdg-open ~/Projects',
    iconKey: 'folder',
  },
  {
    id: 'qa-settings',
    label: 'Settings',
    command: 'systemsettings5',
    iconKey: 'settings',
  },
  {
    id: 'qa-sysmon',
    label: 'Monitor',
    command: 'plasma-systemmonitor',
    iconKey: 'activity',
  },
  {
    id: 'qa-studio',
    label: 'Appearance',
    command: 'urwidgets-control-center',
    iconKey: 'sparkles',
  },
];

export const INITIAL_THEME_PRESETS: ThemeSpec[] = [
  {
    id: 'warm-minimal',
    name: 'WidgetWall Light',
    description:
      'Soft warm off-white surfaces, gentle ambient elevation, charcoal typography, and calm macOS WidgetWall proportions',
    isPreset: true,
    appearanceMode: 'light',
    widgetStyle: 'default',
    accentColorId: 'pink',
    highlightColorId: 'pink',
    systemFontId: 'sf-pro',
    appearance: {
      primary: '#EAE5DF',
      secondary: '#E2DBD3',
      accent: '#E84A7F',
      surface: '#EFECE7',
      text: '#1D1D1F',
      mutedText: '#6E6C68',
      opacity: 0.86,
      borderOpacity: 0.45,
      radius: 24,
      spacing: 16,
      fontFamily: 'Plus Jakarta Sans',
    },
    gradient: {
      enabled: true,
      presetId: 'peach',
      start: '#F3F0EB',
      end: '#E8E3DC',
      angle: 135,
      intensity: 0.4,
    },
    effects: {
      blur: true,
      shadow: true,
      shadowIntensity: 0.08,
      animations: true,
    },
  },
  {
    id: 'liquid-glass',
    name: 'Liquid Glass',
    description:
      'Translucent frosted glass surfaces with subtle white borders and airy depth',
    isPreset: true,
    appearanceMode: 'light',
    widgetStyle: 'clear',
    accentColorId: 'blue',
    highlightColorId: 'blue',
    systemFontId: 'sf-pro',
    appearance: {
      primary: '#E8EEF5',
      secondary: '#DCE5F0',
      accent: '#007AFF',
      surface: '#F4F6F9',
      text: '#1D1D1F',
      mutedText: '#5C6470',
      opacity: 0.68,
      borderOpacity: 0.55,
      radius: 24,
      spacing: 16,
      fontFamily: 'Plus Jakarta Sans',
    },
    gradient: {
      enabled: true,
      presetId: 'ocean-blue',
      start: '#F7F9FC',
      end: '#E9EFF6',
      angle: 135,
      intensity: 0.45,
    },
    effects: {
      blur: true,
      shadow: true,
      shadowIntensity: 0.09,
      animations: true,
    },
  },
  {
    id: 'pastel-editorial',
    name: 'Pastel Editorial',
    description:
      'Soft rose, sage, and lavender tinted cards inspired by macOS Tinted Widget Style',
    isPreset: true,
    appearanceMode: 'light',
    widgetStyle: 'tinted',
    accentColorId: 'pink',
    highlightColorId: 'pink',
    systemFontId: 'sf-pro',
    appearance: {
      primary: '#F6EBF0',
      secondary: '#EFE2EA',
      accent: '#E84A7F',
      surface: '#F8EEF2',
      text: '#2B1921',
      mutedText: '#7A5866',
      opacity: 0.88,
      borderOpacity: 0.35,
      radius: 24,
      spacing: 16,
      fontFamily: 'Plus Jakarta Sans',
    },
    gradient: {
      enabled: true,
      presetId: 'soft-pink',
      start: '#FBF1F5',
      end: '#F2E2EA',
      angle: 135,
      intensity: 0.55,
    },
    effects: {
      blur: true,
      shadow: true,
      shadowIntensity: 0.08,
      animations: true,
    },
  },
  {
    id: 'aurora-gradient',
    name: 'Aurora Gradient',
    description:
      'Atmospheric soft indigo, lavender, and coastal mist transitions',
    isPreset: true,
    appearanceMode: 'dark',
    widgetStyle: 'default',
    accentColorId: 'purple',
    highlightColorId: 'purple',
    systemFontId: 'sf-pro',
    appearance: {
      primary: '#1E1F35',
      secondary: '#282A48',
      accent: '#9B51E0',
      surface: '#22243B',
      text: '#F5F5F7',
      mutedText: '#A5A8C4',
      opacity: 0.84,
      borderOpacity: 0.2,
      radius: 24,
      spacing: 16,
      fontFamily: 'Plus Jakarta Sans',
    },
    gradient: {
      enabled: true,
      presetId: 'aurora',
      start: '#262945',
      end: '#1A2436',
      angle: 145,
      intensity: 0.65,
    },
    effects: {
      blur: true,
      shadow: true,
      shadowIntensity: 0.22,
      animations: true,
    },
  },
  {
    id: 'midnight',
    name: 'Midnight Dark',
    description:
      'Refined macOS Dark appearance with deep charcoal surfaces and muted contrast',
    isPreset: true,
    appearanceMode: 'dark',
    widgetStyle: 'dark',
    accentColorId: 'blue',
    highlightColorId: 'blue',
    systemFontId: 'sf-pro',
    appearance: {
      primary: '#16171B',
      secondary: '#1F2026',
      accent: '#0A84FF',
      surface: '#1E1F25',
      text: '#F5F5F7',
      mutedText: '#8E8E93',
      opacity: 0.86,
      borderOpacity: 0.16,
      radius: 24,
      spacing: 16,
      fontFamily: 'Plus Jakarta Sans',
    },
    gradient: {
      enabled: true,
      presetId: 'midnight',
      start: '#22232A',
      end: '#18191E',
      angle: 160,
      intensity: 0.5,
    },
    effects: {
      blur: true,
      shadow: true,
      shadowIntensity: 0.25,
      animations: true,
    },
  },
  {
    id: 'monochrome',
    name: 'Monochrome Studio',
    description:
      'Pure architectural grayscale with understated graphite highlights',
    isPreset: true,
    appearanceMode: 'light',
    widgetStyle: 'solid',
    accentColorId: 'graphite',
    highlightColorId: 'graphite',
    systemFontId: 'helvetica-neue',
    appearance: {
      primary: '#F2F2F4',
      secondary: '#E5E5EA',
      accent: '#3A3A3C',
      surface: '#F7F7F9',
      text: '#1C1C1E',
      mutedText: '#6E6E73',
      opacity: 0.95,
      borderOpacity: 0.25,
      radius: 22,
      spacing: 16,
      fontFamily: 'Plus Jakarta Sans',
    },
    gradient: {
      enabled: false,
      presetId: 'sage',
      start: '#F7F7F9',
      end: '#EBEBEF',
      angle: 180,
      intensity: 0,
    },
    effects: {
      blur: false,
      shadow: true,
      shadowIntensity: 0.06,
      animations: true,
    },
  },
];

export const INITIAL_WIDGET_INSTANCES: WidgetInstanceConfig[] = [
  {
    id: 'clock',
    configId: 'widget.clock',
    title: 'Clock & Alarms',
    subtitle: '2-slide manual Clock & Alarm Manager with custom ringtones & snooze',
    enabled: true,
    size: 'wide',
    themeOverride: null,
    appearanceOverride: null,
    styleOverride: null,
    accentOverride: null,
    elevationOverride: null,
    opacityOverride: null,
    radiusOverride: null,
    borderOpacityOverride: null,
  },
  {
    id: 'calendar',
    configId: 'widget.calendar',
    title: 'Calendar',
    subtitle: 'Clean monthly calendar, EN & ID locales, accent date badge',
    enabled: true,
    size: 'medium',
    themeOverride: null,
    appearanceOverride: null,
    styleOverride: null,
    accentOverride: null,
    elevationOverride: null,
    opacityOverride: null,
    radiusOverride: null,
    borderOpacityOverride: null,
  },
  {
    id: 'photos',
    configId: 'widget.photo_frame',
    title: 'Photo Frame',
    subtitle: 'Single & Slideshow photo frame with interactive drag/zoom crop editor',
    enabled: true,
    size: 'compact',
    themeOverride: null,
    appearanceOverride: null,
    styleOverride: null,
    accentOverride: null,
    elevationOverride: null,
    opacityOverride: null,
    radiusOverride: null,
    borderOpacityOverride: null,
  },
  {
    id: 'weather',
    configId: 'widget.weather',
    title: 'Weather',
    subtitle: 'Large temperature, condition icon, H/L & cached forecast',
    enabled: true,
    size: 'compact',
    themeOverride: null,
    appearanceOverride: null,
    styleOverride: null,
    accentOverride: null,
    elevationOverride: null,
    opacityOverride: null,
    radiusOverride: null,
    borderOpacityOverride: null,
  },
  {
    id: 'pomodoro',
    configId: 'widget.pomodoro',
    title: 'Pomodoro Focus',
    subtitle: 'Circular focus ring, central timer, play/pause & session dots',
    enabled: true,
    size: 'compact',
    themeOverride: null,
    appearanceOverride: null,
    styleOverride: null,
    accentOverride: null,
    elevationOverride: null,
    opacityOverride: null,
    radiusOverride: null,
    borderOpacityOverride: null,
  },
  {
    id: 'quick_actions',
    configId: 'widget.quick_actions',
    title: 'Quick Actions',
    subtitle: 'Minimal rounded desktop & folder launcher grid',
    enabled: true,
    size: 'compact',
    themeOverride: null,
    appearanceOverride: null,
    styleOverride: null,
    accentOverride: null,
    elevationOverride: null,
    opacityOverride: null,
    radiusOverride: null,
    borderOpacityOverride: null,
  },
  {
    id: 'notes',
    configId: 'widget.notes',
    title: 'Notes',
    subtitle: 'macOS Notes-inspired quick capture with pin, search & debounced autosave',
    enabled: true,
    size: 'medium',
    themeOverride: null,
    appearanceOverride: null,
    styleOverride: null,
    accentOverride: null,
    elevationOverride: null,
    opacityOverride: null,
    radiusOverride: null,
    borderOpacityOverride: null,
  },
  {
    id: 'agenda',
    configId: 'widget.todo',
    title: 'To-Do List',
    subtitle: 'Task checklist with deadlines, overdue indicators & delete controls',
    enabled: true,
    size: 'large',
    themeOverride: null,
    appearanceOverride: null,
    styleOverride: null,
    accentOverride: null,
    elevationOverride: null,
    opacityOverride: null,
    radiusOverride: null,
    borderOpacityOverride: null,
  },
  {
    id: 'system_monitor',
    configId: 'widget.system_monitor',
    title: 'System Monitor',
    subtitle: 'Understated CPU, Memory, and Battery indicators',
    enabled: true,
    size: 'medium',
    themeOverride: null,
    appearanceOverride: null,
    styleOverride: null,
    accentOverride: null,
    elevationOverride: null,
    opacityOverride: null,
    radiusOverride: null,
    borderOpacityOverride: null,
  },
  {
    id: 'music_player',
    configId: 'widget.music_player',
    title: 'Music Player',
    subtitle: 'Local folder & direct online stream player with artwork, seek bar & queue',
    enabled: true,
    size: 'medium',
    themeOverride: null,
    appearanceOverride: null,
    styleOverride: null,
    accentOverride: null,
    elevationOverride: null,
    opacityOverride: null,
    radiusOverride: null,
    borderOpacityOverride: null,
  },
];

export const WEATHER_CITIES: Record<string, WeatherCityData> = {
  'Bandung, ID': {
    city: 'Bandung',
    country: 'Indonesia',
    tempC: 29,
    highC: 29,
    lowC: 18,
    condition: 'Mostly Clear',
    humidityPct: 64,
    windKph: 11.5,
    updatedAt: '4:56 PM',
    hourly: [
      { hour: '09:00', tempC: 23, condition: 'Sunny' },
      { hour: '12:00', tempC: 29, condition: 'Mostly Clear' },
      { hour: '15:00', tempC: 27, condition: 'Partly Cloudy' },
      { hour: '18:00', tempC: 22, condition: 'Clear' },
    ],
    daily: [
      { day: 'Mon', minC: 18, maxC: 29, condition: 'Mostly Clear' },
      { day: 'Tue', minC: 19, maxC: 27, condition: 'Partly Cloudy' },
      { day: 'Wed', minC: 18, maxC: 28, condition: 'Sunny' },
    ],
  },
  'Jakarta, ID': {
    city: 'Jakarta',
    country: 'Indonesia',
    tempC: 31,
    highC: 33,
    lowC: 25,
    condition: 'Mostly Sunny',
    humidityPct: 72,
    windKph: 14.2,
    updatedAt: '4:56 PM',
    hourly: [
      { hour: '09:00', tempC: 29, condition: 'Sunny' },
      { hour: '12:00', tempC: 32, condition: 'Sunny' },
      { hour: '15:00', tempC: 31, condition: 'Partly Cloudy' },
      { hour: '18:00', tempC: 28, condition: 'Clear' },
    ],
    daily: [
      { day: 'Mon', minC: 25, maxC: 33, condition: 'Mostly Sunny' },
      { day: 'Tue', minC: 25, maxC: 31, condition: 'Showers' },
      { day: 'Wed', minC: 26, maxC: 33, condition: 'Sunny' },
    ],
  },
  'Vernon, CA': {
    city: 'Vernon',
    country: 'Canada',
    tempC: 29,
    highC: 29,
    lowC: 16,
    condition: 'Mostly Clear',
    humidityPct: 48,
    windKph: 9.4,
    updatedAt: '4:56 PM',
    hourly: [
      { hour: '09:00', tempC: 21, condition: 'Clear' },
      { hour: '12:00', tempC: 27, condition: 'Sunny' },
      { hour: '15:00', tempC: 29, condition: 'Mostly Clear' },
      { hour: '18:00', tempC: 24, condition: 'Clear' },
    ],
    daily: [
      { day: 'Mon', minC: 16, maxC: 29, condition: 'Mostly Clear' },
      { day: 'Tue', minC: 15, maxC: 28, condition: 'Sunny' },
      { day: 'Wed', minC: 14, maxC: 26, condition: 'Partly Cloudy' },
    ],
  },
  'Tokyo, JP': {
    city: 'Tokyo',
    country: 'Japan',
    tempC: 19,
    highC: 21,
    lowC: 13,
    condition: 'Crisp & Clear',
    humidityPct: 52,
    windKph: 9.8,
    updatedAt: '4:56 PM',
    hourly: [
      { hour: '09:00', tempC: 16, condition: 'Sunny' },
      { hour: '12:00', tempC: 20, condition: 'Clear' },
      { hour: '15:00', tempC: 19, condition: 'Sunny' },
      { hour: '18:00', tempC: 15, condition: 'Clear' },
    ],
    daily: [
      { day: 'Mon', minC: 13, maxC: 21, condition: 'Clear' },
      { day: 'Tue', minC: 12, maxC: 19, condition: 'Partly Cloudy' },
      { day: 'Wed', minC: 11, maxC: 18, condition: 'Sunny' },
    ],
  },
};

export function convertTemp(tempC: number, useCelsius: boolean): number {
  if (useCelsius) return Math.round(tempC);
  return Math.round((tempC * 9) / 5 + 32);
}

export function formatTemp(tempC: number, useCelsius: boolean): string {
  const val = convertTemp(tempC, useCelsius);
  return `${val}°${useCelsius ? 'C' : 'F'}`;
}

export function formatTempDegreeOnly(
  tempC: number,
  useCelsius: boolean
): string {
  const val = convertTemp(tempC, useCelsius);
  return `${val}°`;
}

export function formatClockTime(
  date: Date,
  use24h: boolean,
  showSeconds: boolean
): { time: string; seconds: string; period: string } {
  const hours24 = date.getHours();
  const mins = String(date.getMinutes()).padStart(2, '0');
  const secs = String(date.getSeconds()).padStart(2, '0');

  if (use24h) {
    const hrs = String(hours24).padStart(2, '0');
    return {
      time: showSeconds ? `${hrs}:${mins}:${secs}` : `${hrs}:${mins}`,
      seconds: secs,
      period: '24H',
    };
  }
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 || 12;
  const hrs = String(hours12);
  return {
    time: showSeconds ? `${hrs}:${mins}:${secs}` : `${hrs}:${mins}`,
    seconds: secs,
    period,
  };
}

const MONTHS_EN = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const MONTHS_ID = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const WEEKDAYS_SUN_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAYS_MON_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const WEEKDAYS_SUN_ID = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const WEEKDAYS_MON_ID = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

export interface CalendarGridData {
  year: number;
  monthIndex: number; // 0-11
  monthLabel: string;
  weekdayHeaders: string[];
  leadingEmptyCells: number;
  daysInMonth: number;
}

export function computeCalendarGrid(
  year: number,
  monthIndex: number,
  locale: 'en-US' | 'id-ID',
  firstDayOfWeek: 0 | 1
): CalendarGridData {
  const isId = locale === 'id-ID';
  const monthLabel = isId ? MONTHS_ID[monthIndex] : MONTHS_EN[monthIndex];
  let weekdayHeaders: string[];
  if (isId) {
    weekdayHeaders = firstDayOfWeek === 1 ? WEEKDAYS_MON_ID : WEEKDAYS_SUN_ID;
  } else {
    weekdayHeaders = firstDayOfWeek === 1 ? WEEKDAYS_MON_EN : WEEKDAYS_SUN_EN;
  }

  const firstDayDate = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const rawDayOfWeek = firstDayDate.getDay(); // 0 = Sun ... 6 = Sat
  const leadingEmptyCells =
    firstDayOfWeek === 1 ? (rawDayOfWeek + 6) % 7 : rawDayOfWeek;

  return {
    year,
    monthIndex,
    monthLabel,
    weekdayHeaders,
    leadingEmptyCells,
    daysInMonth,
  };
}

export function updateAgendaItemInList(
  list: AgendaEvent[],
  id: string,
  updates: Partial<
    Pick<AgendaEvent, 'title' | 'startTime' | 'endTime' | 'category'>
  >
): AgendaEvent[] {
  return list.map((ev) => (ev.id === id ? { ...ev, ...updates } : ev));
}

export function transitionPomodoro(
  state: PomodoroState,
  action:
    | { type: 'START' }
    | { type: 'PAUSE' }
    | { type: 'RESET' }
    | { type: 'SET_PHASE'; phase: PomodoroPhase }
    | { type: 'TICK'; elapsedSecs: number }
    | {
        type: 'UPDATE_DURATIONS';
        studyMins: number;
        shortBreakMins: number;
        longBreakMins: number;
      }
): PomodoroState {
  switch (action.type) {
    case 'START':
      return { ...state, status: 'Running' };
    case 'PAUSE':
      return { ...state, status: 'Paused' };
    case 'RESET':
      return {
        ...state,
        status: 'Idle',
        remainingSecs: state.totalSecs,
      };
    case 'SET_PHASE': {
      const mins =
        action.phase === 'Study'
          ? state.studyMins
          : action.phase === 'Short Break'
            ? state.shortBreakMins
            : state.longBreakMins;
      const total = mins * 60;
      return {
        ...state,
        phase: action.phase,
        status: 'Idle',
        totalSecs: total,
        remainingSecs: total,
      };
    }
    case 'UPDATE_DURATIONS': {
      const studyMins = Math.max(1, Math.min(120, action.studyMins));
      const shortBreakMins = Math.max(1, Math.min(60, action.shortBreakMins));
      const longBreakMins = Math.max(1, Math.min(90, action.longBreakMins));
      const activeMins =
        state.phase === 'Study'
          ? studyMins
          : state.phase === 'Short Break'
            ? shortBreakMins
            : longBreakMins;
      const totalSecs = activeMins * 60;
      return {
        ...state,
        studyMins,
        shortBreakMins,
        longBreakMins,
        status: 'Idle',
        totalSecs,
        remainingSecs: totalSecs,
      };
    }
    case 'TICK': {
      if (state.status !== 'Running') return state;
      const nextRemaining = state.remainingSecs - action.elapsedSecs;
      if (nextRemaining > 0) {
        return { ...state, remainingSecs: nextRemaining };
      }
      const nextSessions =
        state.phase === 'Study'
          ? state.completedSessions + 1
          : state.completedSessions;
      return {
        ...state,
        status: 'Idle',
        remainingSecs: 0,
        completedSessions: nextSessions,
      };
    }
  }
}

export function formatPomodoroSeconds(totalSecs: number): string {
  const clamped = Math.max(0, Math.floor(totalSecs));
  const mins = String(Math.floor(clamped / 60)).padStart(2, '0');
  const secs = String(clamped % 60).padStart(2, '0');
  return `${mins}:${secs}`;
}

export function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '').trim();
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean.padEnd(6, '0');
  const num = parseInt(full.slice(0, 6), 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha)).toFixed(2)})`;
}

export function normalizeHexColor(
  raw: string | undefined | null,
  fallback: string = '#E84A7F'
): string {
  if (!raw) return fallback;
  const trimmed = raw.trim();
  const match = trimmed.match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
  if (!match) return fallback;
  const hex = match[1];
  if (hex.length === 3) {
    return (
      '#' +
      hex
        .split('')
        .map((c) => c + c)
        .join('')
        .toUpperCase()
    );
  }
  return '#' + hex.toUpperCase();
}

export function computeSoftTintFromHex(hex: string, isDark: boolean): string {
  const valid = normalizeHexColor(hex);
  const clean = valid.slice(1);
  const num = parseInt(clean, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  if (isDark) {
    const dr = Math.round(r * 0.22 + 18);
    const dg = Math.round(g * 0.22 + 18);
    const db = Math.round(b * 0.22 + 24);
    return `#${dr.toString(16).padStart(2, '0')}${dg
      .toString(16)
      .padStart(2, '0')}${db.toString(16).padStart(2, '0')}`;
  }
  const lr = Math.round(255 - (255 - r) * 0.14);
  const lg = Math.round(255 - (255 - g) * 0.14);
  const lb = Math.round(255 - (255 - b) * 0.14);
  return `#${lr.toString(16).padStart(2, '0')}${lg
    .toString(16)
    .padStart(2, '0')}${lb.toString(16).padStart(2, '0')}`;
}

export type GlassPerformanceProfile = 'performance' | 'balanced' | 'enhanced';
export type GlassFallbackMode = 'full-glass' | 'soft-glass' | 'solid-surface';

export interface KWinCompositorConfig {
  performanceProfile: GlassPerformanceProfile; // default 'balanced'
  fallbackMode: GlassFallbackMode; // default 'full-glass'
  blurIntensity: number; // 0 to 100
  blurRadius: number; // 0 to 32 px
  backgroundContrast: number; // 80 to 130 %
  noiseStrength: number; // 0 to 15 %
  glassOpacity: number; // 0.35 to 0.96
  borderIntensity: number; // 0.10 to 0.90
  specularHighlight: boolean; // lightweight top reflection rim toggle
}

export const DEFAULT_KWIN_COMPOSITOR_CONFIG: KWinCompositorConfig = {
  performanceProfile: 'balanced',
  fallbackMode: 'full-glass',
  blurIntensity: 68,
  blurRadius: 18,
  backgroundContrast: 106,
  noiseStrength: 2,
  glassOpacity: 0.72,
  borderIntensity: 0.52,
  specularHighlight: true,
};

export interface LiquidGlassTokens {
  glassSurfacePrimary: string;
  glassSurfaceSecondary: string;
  glassSurfaceFloating: string;
  glassOpacity: number;
  glassBlur: number;
  glassBorder: string;
  glassHighlight: string;
  glassShadow: string;
  glassRadius: number;
  glassTextPrimary: string;
  glassTextSecondary: string;
  glassAccent: string;
  glassInteractiveHover: string;
  glassInteractiveActive: string;
  backdropFilterCss: string;
  specularTopRimCss: string;
}

export interface KdeIntegrationEvaluationItem {
  id: string;
  name: string;
  packageOrRepo: string;
  category: 'Qt Style' | 'Plasma Theme' | 'KWin Shader' | 'KWin Script';
  plasma5Compatibility: 'Compatible (Optional)' | 'Caution (High GPU)' | 'Qt-Only Scope';
  cpuGpuImpact: 'Very Low' | 'Low' | 'Moderate–High';
  mandatoryDependency: false;
  evaluationSummary: string;
}

export const KDE_PLASMA5_INTEGRATION_MATRIX: KdeIntegrationEvaluationItem[] = [
  {
    id: 'kvantum',
    name: 'Kvantum Manager',
    packageOrRepo: 'qt5-style-kvantum',
    category: 'Qt Style',
    plasma5Compatibility: 'Qt-Only Scope',
    cpuGpuImpact: 'Low',
    mandatoryDependency: false,
    evaluationSummary:
      'Provides SVG-based translucent surfaces for compatible Qt5 apps (Dolphin, Konsole, System Settings). Does NOT style Tauri WebView or GTK apps; kept strictly optional.',
  },
  {
    id: 'lightly-style',
    name: 'Lightly Application Style',
    packageOrRepo: 'lightly-qt5 (community fork)',
    category: 'Qt Style',
    plasma5Compatibility: 'Compatible (Optional)',
    cpuGpuImpact: 'Low',
    mandatoryDependency: false,
    evaluationSummary:
      'Lightweight translucent widget style for KDE Plasma 5. Upstream maintenance is archival; URWidgets never forces Lightly installation and works natively with Breeze.',
  },
  {
    id: 'plasma-themes',
    name: 'Blur Glassy / Layan / Orchis / WhiteSur',
    packageOrRepo: 'KDE Store Plasma 5 Themes',
    category: 'Plasma Theme',
    plasma5Compatibility: 'Compatible (Optional)',
    cpuGpuImpact: 'Low',
    mandatoryDependency: false,
    evaluationSummary:
      'Compatible with Plasma 5 panels and dialogs. URWidgets uses its own self-contained Liquid Glass tokens so users never need third-party themes installed.',
  },
  {
    id: 'lightly-shaders',
    name: 'LightlyShaders (KWin C++ Effect)',
    packageOrRepo: 'github.com/a-parhom/LightlyShaders (plasma5 branch)',
    category: 'KWin Shader',
    plasma5Compatibility: 'Caution (High GPU)',
    cpuGpuImpact: 'Moderate–High',
    mandatoryDependency: false,
    evaluationSummary:
      'Adds rounded-corner KWin blur shaders on X11/Plasma 5. Can increase GPU/CPU load on integrated Intel HD graphics; URWidgets provides native rounded clipping without requiring LightlyShaders.',
  },
  {
    id: 'kwin-forceblur',
    name: 'KWin ForceBlur Script',
    packageOrRepo: 'kwin-script-forceblur',
    category: 'KWin Script',
    plasma5Compatibility: 'Compatible (Optional)',
    cpuGpuImpact: 'Low',
    mandatoryDependency: false,
    evaluationSummary:
      'Forces KWin blur behind specified window classes (e.g. urwidgets-control-center). Optional enhancement; URWidgets falls back gracefully to Soft Glass or Solid Surface when disabled.',
  },
];

export function computeLiquidGlassTokens(
  isDark: boolean,
  accentHex: string,
  baseOpacity: number,
  radius: number,
  compositor: KWinCompositorConfig = DEFAULT_KWIN_COMPOSITOR_CONFIG
): LiquidGlassTokens {
  const profile = compositor.performanceProfile;
  const fallback = compositor.fallbackMode;

  const effectiveOpacity =
    fallback === 'solid-surface'
      ? 0.98
      : fallback === 'soft-glass'
        ? Math.max(0.84, compositor.glassOpacity)
        : profile === 'performance'
          ? Math.max(0.86, baseOpacity)
          : profile === 'enhanced'
            ? Math.min(0.68, compositor.glassOpacity)
            : Math.min(0.76, (baseOpacity + compositor.glassOpacity) / 2);

  const effectiveBlur =
    fallback !== 'full-glass' || profile === 'performance'
      ? 0
      : profile === 'balanced'
        ? Math.min(18, compositor.blurRadius)
        : Math.min(28, Math.round(compositor.blurRadius * 1.25));

  const primaryBg = isDark
    ? `linear-gradient(145deg, rgba(32, 35, 44, ${effectiveOpacity.toFixed(
        2
      )}), rgba(20, 22, 29, ${Math.min(0.96, effectiveOpacity + 0.06).toFixed(2)}))`
    : `linear-gradient(145deg, rgba(250, 251, 254, ${effectiveOpacity.toFixed(
        2
      )}), rgba(236, 241, 248, ${Math.min(0.96, effectiveOpacity + 0.05).toFixed(2)}))`;

  const secondaryBg = isDark
    ? `rgba(255, 255, 255, ${profile === 'enhanced' ? '0.085' : '0.065'})`
    : `rgba(255, 255, 255, ${profile === 'enhanced' ? '0.58' : '0.46'})`;

  const floatingBg = isDark
    ? `rgba(24, 26, 34, ${Math.min(0.96, effectiveOpacity + 0.16).toFixed(2)})`
    : `rgba(252, 253, 255, ${Math.min(0.96, effectiveOpacity + 0.18).toFixed(2)})`;

  const borderAlpha = isDark
    ? Math.min(0.32, compositor.borderIntensity * 0.42)
    : Math.min(0.78, Math.max(0.38, compositor.borderIntensity));

  const glassBorder = isDark
    ? `rgba(255, 255, 255, ${borderAlpha.toFixed(2)})`
    : `rgba(255, 255, 255, ${borderAlpha.toFixed(2)})`;

  const glassHighlight = compositor.specularHighlight
    ? isDark
      ? profile === 'enhanced'
        ? 'rgba(255, 255, 255, 0.22)'
        : 'rgba(255, 255, 255, 0.14)'
      : profile === 'enhanced'
        ? 'rgba(255, 255, 255, 0.88)'
        : 'rgba(255, 255, 255, 0.72)'
    : 'transparent';

  const glassShadow =
    profile === 'performance'
      ? isDark
        ? '0 4px 12px rgba(0, 0, 0, 0.28)'
        : '0 4px 12px rgba(15, 18, 26, 0.08)'
      : profile === 'balanced'
        ? isDark
          ? `0 16px 36px -6px rgba(0, 0, 0, 0.52), 0 4px 12px -2px rgba(0, 0, 0, 0.34), inset 0 1px 0 0 ${glassHighlight}`
          : `0 16px 36px -6px rgba(15, 20, 32, 0.14), 0 4px 12px -2px rgba(15, 20, 32, 0.07), inset 0 1px 0 0 ${glassHighlight}`
        : isDark
          ? `0 22px 48px -8px rgba(0, 0, 0, 0.64), 0 8px 18px -4px rgba(0, 0, 0, 0.42), inset 0 1px 0 0 ${glassHighlight}, inset 0 0 0 0.5px rgba(255, 255, 255, 0.12)`
          : `0 22px 48px -8px rgba(15, 20, 32, 0.18), 0 8px 18px -4px rgba(15, 20, 32, 0.09), inset 0 1px 0 0 ${glassHighlight}, inset 0 0 0 0.5px rgba(255, 255, 255, 0.55)`;

  const backdropFilterCss =
    effectiveBlur > 0
      ? `blur(${effectiveBlur}px) saturate(${
          profile === 'enhanced' ? 145 : 125
        }%) contrast(${compositor.backgroundContrast}%)`
      : 'none';

  const specularTopRimCss = compositor.specularHighlight
    ? isDark
      ? 'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.03) 100%)'
      : 'linear-gradient(90deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.92) 50%, rgba(255,255,255,0.25) 100%)'
    : 'none';

  return {
    glassSurfacePrimary: primaryBg,
    glassSurfaceSecondary: secondaryBg,
    glassSurfaceFloating: floatingBg,
    glassOpacity: effectiveOpacity,
    glassBlur: effectiveBlur,
    glassBorder,
    glassHighlight,
    glassShadow,
    glassRadius: radius,
    glassTextPrimary: isDark ? '#F5F5F7' : '#1D1D1F',
    glassTextSecondary: isDark
      ? 'rgba(235, 235, 245, 0.66)'
      : 'rgba(29, 29, 31, 0.62)',
    glassAccent: accentHex,
    glassInteractiveHover: isDark
      ? 'rgba(255, 255, 255, 0.12)'
      : 'rgba(29, 29, 31, 0.075)',
    glassInteractiveActive: hexToRgba(accentHex, isDark ? 0.28 : 0.18),
    backdropFilterCss,
    specularTopRimCss,
  };
}

export interface ComputedSurfaceStyle {
  background: string;
  textColor: string;
  mutedTextColor: string;
  subtleFill: string;
  borderColor: string;
  shadowCss: string;
  accentHex: string;
  isDarkSurface: boolean;
  glassTokens: LiquidGlassTokens;
}

export function computeMacOsWidgetSurface(
  theme: ThemeSpec,
  appearanceMode: AppearanceMode,
  widgetStyle: WidgetSurfaceStyle,
  accentId: AccentColorId,
  elevationLevel: ElevationLevel = 2,
  customAccentHex?: string,
  compositor: KWinCompositorConfig = DEFAULT_KWIN_COMPOSITOR_CONFIG
): ComputedSurfaceStyle {
  const accentObj =
    ACCENT_COLORS.find((a) => a.id === accentId) || ACCENT_COLORS[3]; // default pink
  const accentHex =
    accentId === 'custom'
      ? normalizeHexColor(customAccentHex, theme.appearance.accent)
      : accentId === 'auto'
        ? theme.appearance.accent
        : accentObj.hex;

  const isDark =
    widgetStyle === 'dark' ||
    appearanceMode === 'dark' ||
    (appearanceMode === 'auto' &&
      (theme.id === 'midnight' || theme.id === 'aurora-gradient'));

  const baseOpacity = theme.appearance.opacity;
  const glassTokens = computeLiquidGlassTokens(
    isDark,
    accentHex,
    baseOpacity,
    theme.appearance.radius,
    compositor
  );

  const shadowCss = theme.effects.shadow
    ? compositor.performanceProfile === 'performance'
      ? glassTokens.glassShadow
      : computeElevationShadow(elevationLevel, isDark)
    : 'none';

  if (widgetStyle === 'clear' || theme.id === 'liquid-glass') {
    return {
      background: glassTokens.glassSurfacePrimary,
      textColor: glassTokens.glassTextPrimary,
      mutedTextColor: glassTokens.glassTextSecondary,
      subtleFill: glassTokens.glassSurfaceSecondary,
      borderColor: glassTokens.glassBorder,
      shadowCss: glassTokens.glassShadow,
      accentHex,
      isDarkSurface: isDark,
      glassTokens,
    };
  }

  if (widgetStyle === 'tinted') {
    const tintStart =
      accentId === 'custom'
        ? computeSoftTintFromHex(accentHex, isDark)
        : isDark
          ? accentObj.softTintDark
          : accentObj.softTintLight;
    const tintEnd = isDark ? '#18181D' : '#F4F1EC';
    return {
      background: `linear-gradient(140deg, ${hexToRgba(
        tintStart,
        baseOpacity
      )}, ${hexToRgba(tintEnd, baseOpacity)})`,
      textColor: isDark ? '#F5F5F7' : '#1D1D1F',
      mutedTextColor: isDark ? 'rgba(245,245,247,0.68)' : 'rgba(29,29,31,0.6)',
      subtleFill: hexToRgba(accentHex, isDark ? 0.16 : 0.1),
      borderColor: hexToRgba(
        accentHex,
        Math.min(0.45, theme.appearance.borderOpacity)
      ),
      shadowCss,
      accentHex,
      isDarkSurface: isDark,
      glassTokens,
    };
  }

  if (widgetStyle === 'solid') {
    return {
      background: isDark ? '#1C1C1E' : '#F5F3EF',
      textColor: isDark ? '#F5F5F7' : '#1D1D1F',
      mutedTextColor: isDark ? '#98989D' : '#6E6C68',
      subtleFill: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)',
      borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
      shadowCss,
      accentHex,
      isDarkSurface: isDark,
      glassTokens,
    };
  }

  // Default or Dark frosted WidgetWall surface
  if (isDark) {
    const startHex = theme.gradient.enabled ? theme.gradient.start : '#202127';
    const endHex = theme.gradient.enabled ? theme.gradient.end : '#17181D';
    return {
      background: theme.gradient.enabled
        ? `linear-gradient(${theme.gradient.angle}deg, ${hexToRgba(
            startHex,
            baseOpacity
          )}, ${hexToRgba(endHex, baseOpacity)})`
        : hexToRgba('#1E1F25', baseOpacity),
      textColor: '#F5F5F7',
      mutedTextColor: 'rgba(235, 235, 245, 0.62)',
      subtleFill: 'rgba(255, 255, 255, 0.07)',
      borderColor: `rgba(255, 255, 255, ${Math.min(
        0.22,
        theme.appearance.borderOpacity
      ).toFixed(2)})`,
      shadowCss,
      accentHex,
      isDarkSurface: true,
      glassTokens,
    };
  }

  // Light Default (matches Reference Image 2 WidgetWall warm translucent light cards)
  const lightStart = theme.gradient.enabled
    ? theme.gradient.start
    : theme.appearance.surface;
  const lightEnd = theme.gradient.enabled
    ? theme.gradient.end
    : '#E9E5DE';

  return {
    background: theme.gradient.enabled
      ? `linear-gradient(${theme.gradient.angle}deg, ${hexToRgba(
           lightStart,
           baseOpacity
         )}, ${hexToRgba(lightEnd, baseOpacity)})`
      : hexToRgba(theme.appearance.surface, baseOpacity),
    textColor: '#1D1D1F',
    mutedTextColor: '#686662',
    subtleFill: 'rgba(29, 29, 31, 0.055)',
    borderColor: `rgba(255, 255, 255, ${Math.max(
      0.42,
      theme.appearance.borderOpacity
    ).toFixed(2)})`,
    shadowCss,
    accentHex,
    isDarkSurface: false,
    glassTokens,
  };
}

export interface ResolvedWidgetAppearance extends ComputedSurfaceStyle {
  effectiveTheme: ThemeSpec;
  effectiveAppearance: AppearanceMode;
  effectiveStyle: WidgetSurfaceStyle;
  effectiveAccent: AccentColorId;
  effectiveElevation: ElevationLevel;
  effectiveRadius: number;
  effectiveOpacity: number;
  effectiveBorderOpacity: number;
  effectiveIconStyle: WidgetIconStyle;
  effectiveFontId: string | null;
}

export function resolveIndependentWidgetSurface(
  _widget: WidgetInstanceConfig | undefined,
  themes: ThemeSpec[],
  activeThemeId: string,
  globalAppearance: AppearanceMode,
  globalStyle: WidgetSurfaceStyle,
  globalAccent: AccentColorId,
  globalElevation: ElevationLevel = 2,
  customAccentHex?: string,
  compositor: KWinCompositorConfig = DEFAULT_KWIN_COMPOSITOR_CONFIG
): ResolvedWidgetAppearance {
  // Global Theme & Style preferences apply uniformly across all widgets
  const chosenTheme =
    themes.find((t) => t.id === activeThemeId) ||
    themes[0] ||
    INITIAL_THEME_PRESETS[0];

  const effectiveAppearance: AppearanceMode = globalAppearance;
  const effectiveStyle: WidgetSurfaceStyle = globalStyle;
  const effectiveAccent: AccentColorId = globalAccent;
  const effectiveElevation: ElevationLevel = globalElevation ?? 2;
  const effectiveOpacity = chosenTheme.appearance.opacity;
  const effectiveRadius = chosenTheme.appearance.radius;
  const effectiveBorderOpacity = chosenTheme.appearance.borderOpacity;

  const surface = computeMacOsWidgetSurface(
    chosenTheme,
    effectiveAppearance,
    effectiveStyle,
    effectiveAccent,
    effectiveElevation,
    customAccentHex,
    compositor
  );

  return {
    ...surface,
    effectiveTheme: chosenTheme,
    effectiveAppearance,
    effectiveStyle,
    effectiveAccent,
    effectiveElevation,
    effectiveRadius,
    effectiveOpacity,
    effectiveBorderOpacity,
    effectiveIconStyle: 'filled',
    effectiveFontId: null,
  };
}

// ============================================================================
// SECTION 5: ADVANCED ALARM SYSTEM INSIDE CLOCK WIDGET
// ============================================================================

export type AlarmRepeatDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export const ALL_ALARM_DAYS: AlarmRepeatDay[] = [
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun',
];

export interface RingtoneOption {
  id: string;
  label: string;
  systemPath: string;
  chimeFreqHz: number[];
  isCustom?: boolean;
}

export const BUILTIN_RINGTONES: RingtoneOption[] = [
  {
    id: 'freedesktop-alarm',
    label: 'FreeDesktop Alarm Elapsed',
    systemPath: '/usr/share/sounds/freedesktop/stereo/alarm-clock-elapsed.oga',
    chimeFreqHz: [523.25, 659.25, 783.99, 1046.5],
  },
  {
    id: 'plasma-bell',
    label: 'KDE Plasma Crystal Bell',
    systemPath: '/usr/share/sounds/freedesktop/stereo/bell.oga',
    chimeFreqHz: [587.33, 880.0, 1174.66],
  },
  {
    id: 'gentle-chime',
    label: 'Morning Harmonic Chime',
    systemPath: '/usr/share/sounds/freedesktop/stereo/complete.oga',
    chimeFreqHz: [440.0, 554.37, 659.25, 880.0],
  },
  {
    id: 'soft-pulse',
    label: 'Soft Desktop Pulse',
    systemPath: '/usr/share/sounds/freedesktop/stereo/message-new-instant.oga',
    chimeFreqHz: [392.0, 523.25, 659.25],
  },
];

export const SUPPORTED_AUDIO_EXTENSIONS = [
  'ogg',
  'oga',
  'wav',
  'mp3',
  'flac',
  'm4a',
  'aac',
] as const;

export function validateAudioFormat(filenameOrPath: string): {
  valid: boolean;
  ext: string;
  error: string | null;
} {
  const clean = filenameOrPath.trim().toLowerCase();
  const parts = clean.split('.');
  if (parts.length < 2) {
    return {
      valid: false,
      ext: '',
      error:
        'Audio file must have a valid extension (.ogg, .oga, .wav, .mp3, .flac, .m4a, .aac)',
    };
  }
  const ext = parts[parts.length - 1];
  if (
    !(SUPPORTED_AUDIO_EXTENSIONS as readonly string[]).includes(ext)
  ) {
    return {
      valid: false,
      ext,
      error: `Unsupported audio format ".${ext}". Supported formats: .ogg, .oga, .wav, .mp3, .flac, .m4a, .aac`,
    };
  }
  return { valid: true, ext, error: null };
}

export interface AlarmItem {
  id: string;
  time: string; // HH:MM (24-hour canonical format, e.g. "07:00")
  label: string;
  enabled: boolean;
  repeatDays: AlarmRepeatDay[]; // empty = One-time
  oneTimeDateIso?: string; // optional YYYY-MM-DD for one-time alarm
  ringtoneId: string;
  customAudioPath?: string;
  customAudioDataUrl?: string; // Object/Data URL for real local ringtone playback
  volume?: number; // 0 to 100 (default 85)
  snoozeMinutes: number; // 5, 10, 15, 20, 30, or custom
  snoozedUntilTime?: string | null; // HH:MM if currently snoozed
}

export interface DueAlarmNotification {
  alarmId: string;
  label: string;
  time: string;
  ringtoneId: string;
  customAudioPath?: string;
  customAudioDataUrl?: string;
  volume?: number;
  snoozeMinutes: number;
  triggeredAtIso: string;
}

export const INITIAL_ALARMS: AlarmItem[] = [
  {
    id: 'alm-wake',
    time: '07:00',
    label: 'Wake Up',
    enabled: true,
    repeatDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    ringtoneId: 'freedesktop-alarm',
    volume: 90,
    snoozeMinutes: 10,
    snoozedUntilTime: null,
  },
  {
    id: 'alm-study',
    time: '08:00',
    label: 'Morning Study',
    enabled: true,
    repeatDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    ringtoneId: 'gentle-chime',
    volume: 85,
    snoozeMinutes: 5,
    snoozedUntilTime: null,
  },
  {
    id: 'alm-lunch',
    time: '12:30',
    label: 'Lunch Reminder',
    enabled: false,
    repeatDays: ['Mon', 'Wed', 'Fri'],
    ringtoneId: 'plasma-bell',
    volume: 80,
    snoozeMinutes: 15,
    snoozedUntilTime: null,
  },
];

export function validateAlarmTimeParts(
  hour: number,
  minute: number
): {
  valid: boolean;
  clampedHour: number;
  clampedMinute: number;
  formatted: string;
  error: string | null;
} {
  const validHour = Number.isInteger(hour) && hour >= 0 && hour <= 23;
  const validMinute = Number.isInteger(minute) && minute >= 0 && minute <= 59;
  const clampedHour = Math.max(0, Math.min(23, Math.floor(Number(hour) || 0)));
  const clampedMinute = Math.max(
    0,
    Math.min(59, Math.floor(Number(minute) || 0))
  );
  const formatted = `${String(clampedHour).padStart(2, '0')}:${String(
    clampedMinute
  ).padStart(2, '0')}`;
  if (!validHour || !validMinute) {
    return {
      valid: false,
      clampedHour,
      clampedMinute,
      formatted,
      error: 'Hour must be 00–23 and minute must be 00–59',
    };
  }
  return {
    valid: true,
    clampedHour,
    clampedMinute,
    formatted,
    error: null,
  };
}

export function parseAlarmTimeParts(timeStr: string): {
  hour: number;
  minute: number;
} {
  const parts = (timeStr || '07:00').split(':');
  const h = parseInt(parts[0] || '7', 10);
  const m = parseInt(parts[1] || '0', 10);
  return {
    hour: Number.isNaN(h) ? 7 : Math.max(0, Math.min(23, h)),
    minute: Number.isNaN(m) ? 0 : Math.max(0, Math.min(59, m)),
  };
}

export function formatAlarmTimeParts(hour: number, minute: number): string {
  return validateAlarmTimeParts(hour, minute).formatted;
}

export function formatAlarmRepeat(
  repeatDays: AlarmRepeatDay[],
  oneTimeDateIso?: string
): string {
  if (!repeatDays || repeatDays.length === 0) {
    return oneTimeDateIso ? `Once · ${oneTimeDateIso}` : 'One-time';
  }
  if (repeatDays.length === 7) return 'Every day';
  const weekdays: AlarmRepeatDay[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const weekends: AlarmRepeatDay[] = ['Sat', 'Sun'];
  if (
    repeatDays.length === 5 &&
    weekdays.every((d) => repeatDays.includes(d))
  ) {
    return 'Weekdays';
  }
  if (
    repeatDays.length === 2 &&
    weekends.every((d) => repeatDays.includes(d))
  ) {
    return 'Weekends';
  }
  return repeatDays.join(', ');
}

export function toggleAlarmInList(
  alarms: AlarmItem[],
  alarmId: string
): AlarmItem[] {
  return alarms.map((a) =>
    a.id === alarmId
      ? { ...a, enabled: !a.enabled, snoozedUntilTime: null }
      : a
  );
}

export function upsertAlarmInList(
  alarms: AlarmItem[],
  alarm: AlarmItem
): AlarmItem[] {
  const exists = alarms.some((a) => a.id === alarm.id);
  const next = exists
    ? alarms.map((a) => (a.id === alarm.id ? alarm : a))
    : [...alarms, alarm];
  return [...next].sort((a, b) => a.time.localeCompare(b.time));
}

export function deleteAlarmFromList(
  alarms: AlarmItem[],
  alarmId: string
): AlarmItem[] {
  return alarms.filter((a) => a.id !== alarmId);
}

export function computeNextAlarmSummary(alarms: AlarmItem[]): {
  enabledCount: number;
  nextAlarm: AlarmItem | null;
} {
  const enabled = alarms
    .filter((a) => a.enabled)
    .sort((a, b) =>
      (a.snoozedUntilTime || a.time).localeCompare(b.snoozedUntilTime || b.time)
    );
  return {
    enabledCount: enabled.length,
    nextAlarm: enabled.length > 0 ? enabled[0] : null,
  };
}

export function computeNextAlarmWakeupSecs(
  alarms: AlarmItem[],
  now: Date
): number | null {
  const enabled = alarms.filter((a) => a.enabled);
  if (enabled.length === 0) return null;

  const nowSecsOfDay =
    now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  let minDeltaSecs: number | null = null;

  for (const alarm of enabled) {
    const targetStr = alarm.snoozedUntilTime || alarm.time;
    const [hh, mm] = targetStr.split(':').map((n) => parseInt(n, 10) || 0);
    const alarmSecs = hh * 3600 + mm * 60;
    let delta = alarmSecs - nowSecsOfDay;
    if (delta <= 0) {
      delta += 86400; // next day
    }
    if (minDeltaSecs === null || delta < minDeltaSecs) {
      minDeltaSecs = delta;
    }
  }
  return minDeltaSecs;
}

export function triggerDueAlarms(
  alarms: AlarmItem[],
  currentQueue: DueAlarmNotification[],
  targetTimeHHMM: string,
  nowIso: string
): {
  updatedAlarms: AlarmItem[];
  updatedQueue: DueAlarmNotification[];
} {
  const newlyDue: DueAlarmNotification[] = [];
  const updatedAlarms = alarms.map((alarm) => {
    if (!alarm.enabled) return alarm;
    const effectiveTime = alarm.snoozedUntilTime || alarm.time;
    if (effectiveTime !== targetTimeHHMM) return alarm;

    const alreadyQueued = currentQueue.some((q) => q.alarmId === alarm.id);
    if (!alreadyQueued) {
      newlyDue.push({
        alarmId: alarm.id,
        label: alarm.label,
        time: effectiveTime,
        ringtoneId: alarm.ringtoneId,
        customAudioPath: alarm.customAudioPath,
        customAudioDataUrl: alarm.customAudioDataUrl,
        volume: alarm.volume ?? 85,
        snoozeMinutes: alarm.snoozeMinutes,
        triggeredAtIso: nowIso,
      });
    }

    // If one-time alarm (empty repeatDays) and not snoozed, keep enabled until stopped
    return { ...alarm, snoozedUntilTime: null };
  });

  return {
    updatedAlarms,
    updatedQueue: [...currentQueue, ...newlyDue],
  };
}

export function snoozeAlarm(
  alarms: AlarmItem[],
  queue: DueAlarmNotification[],
  alarmId: string,
  baseTimeHHMM: string,
  customSnoozeMins?: number
): {
  updatedAlarms: AlarmItem[];
  updatedQueue: DueAlarmNotification[];
} {
  const targetAlarm = alarms.find((a) => a.id === alarmId);
  const snoozeMins = Math.max(
    1,
    Math.min(120, customSnoozeMins ?? targetAlarm?.snoozeMinutes ?? 10)
  );
  const [hh, mm] = baseTimeHHMM.split(':').map((n) => parseInt(n, 10) || 0);
  const totalMins = (hh * 60 + mm + snoozeMins) % (24 * 60);
  const nextHH = String(Math.floor(totalMins / 60)).padStart(2, '0');
  const nextMM = String(totalMins % 60).padStart(2, '0');
  const snoozedUntil = `${nextHH}:${nextMM}`;

  const updatedAlarms = alarms.map((a) =>
    a.id === alarmId
      ? { ...a, enabled: true, snoozedUntilTime: snoozedUntil }
      : a
  );
  const updatedQueue = queue.filter((q) => q.alarmId !== alarmId);
  return { updatedAlarms, updatedQueue };
}

export function stopActiveAlarm(
  alarms: AlarmItem[],
  queue: DueAlarmNotification[],
  alarmId: string
): {
  updatedAlarms: AlarmItem[];
  updatedQueue: DueAlarmNotification[];
} {
  const updatedAlarms = alarms.map((a) => {
    if (a.id !== alarmId) return a;
    // One-time alarms disable after being stopped; repeating alarms stay enabled
    const isRepeating = a.repeatDays && a.repeatDays.length > 0;
    return {
      ...a,
      enabled: isRepeating ? a.enabled : false,
      snoozedUntilTime: null,
    };
  });
  const updatedQueue = queue.filter((q) => q.alarmId !== alarmId);
  return { updatedAlarms, updatedQueue };
}

// ============================================================================
// SECTION 6: NOTES WIDGET LOGIC
// ============================================================================

export interface NoteItem {
  id: string;
  title: string;
  body: string;
  pinned: boolean;
  tags: string[];
  updatedAtIso: string;
  updatedAtLabel: string;
}

export const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    title: 'Desktop Widget Architecture',
    body: 'Keep all 10 Plasmoids backed by a single urwidgets-daemon process over org.urwidgets.Daemon1 D-Bus.\n\n• SQLite WAL mode for concurrent reads\n• Event-driven timerfd wakeups for alarms & Pomodoro\n• Zero hover layout jitter on widget cards',
    pinned: true,
    tags: ['Architecture', 'Plasma 5'],
    updatedAtIso: '2026-11-09T07:45:00Z',
    updatedAtLabel: 'Today, 7:45 AM',
  },
  {
    id: 'note-2',
    title: 'Reading & Study Notes',
    body: 'Chapter 4 — Designing Calm Interfaces:\n1. Visual hierarchy through weight and proportion\n2. Warm translucent surfaces (#EFECE7)\n3. Avoid noisy hover toolbars on desktop widgets',
    pinned: false,
    tags: ['Design', 'HIG'],
    updatedAtIso: '2026-11-08T19:20:00Z',
    updatedAtLabel: 'Yesterday',
  },
  {
    id: 'note-3',
    title: 'Release Checklist v1.3',
    body: '- Verify Clock 2-slide Alarm Manager\n- Test Notes debounced autosave (400ms)\n- Verify Todo List completion counter\n- Test per-widget SVG/PNG/WebP backgrounds',
    pinned: false,
    tags: ['Release'],
    updatedAtIso: '2026-11-08T14:10:00Z',
    updatedAtLabel: 'Nov 8',
  },
];

export function sortNotesPinnedFirst(notes: NoteItem[]): NoteItem[] {
  return [...notes].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.updatedAtIso.localeCompare(a.updatedAtIso);
  });
}

export function upsertNoteInList(
  notes: NoteItem[],
  updatedNote: NoteItem
): NoteItem[] {
  const exists = notes.some((n) => n.id === updatedNote.id);
  const next = exists
    ? notes.map((n) => (n.id === updatedNote.id ? updatedNote : n))
    : [updatedNote, ...notes];
  return sortNotesPinnedFirst(next);
}

export function deleteNoteFromList(
  notes: NoteItem[],
  noteId: string
): NoteItem[] {
  return notes.filter((n) => n.id !== noteId);
}

export function togglePinNoteInList(
  notes: NoteItem[],
  noteId: string
): NoteItem[] {
  const next = notes.map((n) =>
    n.id === noteId ? { ...n, pinned: !n.pinned } : n
  );
  return sortNotesPinnedFirst(next);
}

export function filterNotesByQuery(
  notes: NoteItem[],
  query: string
): NoteItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return sortNotesPinnedFirst(notes);
  return sortNotesPinnedFirst(
    notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.body.toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q))
    )
  );
}

// ============================================================================
// SECTION 7: TODO LIST WIDGET LOGIC
// ============================================================================

export type TodoPriority = 'low' | 'medium' | 'high';

export interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  priority: TodoPriority;
  category: string;
  dueDate?: string; // display label e.g. "Today", "Tomorrow", "Nov 12", or ""
  dueDateIso?: string; // YYYY-MM-DD or "" for no deadline
  dueTime?: string; // HH:MM or "" for no specific time
  orderIndex: number;
}

export type TodoDeadlineStatus =
  | 'none'
  | 'completed'
  | 'overdue'
  | 'due_today'
  | 'upcoming';

export interface TodoDeadlineEvaluation {
  status: TodoDeadlineStatus;
  badgeLabel: string;
  formattedDeadline: string;
}

export function computeTodoDeadlineStatus(
  todo: Pick<TodoItem, 'completed' | 'dueDateIso' | 'dueTime' | 'dueDate'>,
  referenceDateIso: string = '2026-11-09',
  referenceTimeHHMM: string = '09:00'
): TodoDeadlineEvaluation {
  const iso = (todo.dueDateIso || '').trim();
  const time = (todo.dueTime || '').trim();
  if (!iso) {
    if (todo.dueDate && todo.dueDate.trim()) {
      const legacy = todo.dueDate.trim();
      if (todo.completed) {
        return {
          status: 'completed',
          badgeLabel: 'Completed',
          formattedDeadline: legacy,
        };
      }
      if (legacy.toLowerCase() === 'today') {
        return {
          status: 'due_today',
          badgeLabel: 'Due today',
          formattedDeadline: time ? `Today · ${time}` : 'Today',
        };
      }
      if (legacy.toLowerCase() === 'overdue') {
        return {
          status: 'overdue',
          badgeLabel: 'Overdue',
          formattedDeadline: legacy,
        };
      }
      return {
        status: 'upcoming',
        badgeLabel: 'Upcoming',
        formattedDeadline: time ? `${legacy} · ${time}` : legacy,
      };
    }
    return {
      status: todo.completed ? 'completed' : 'none',
      badgeLabel: todo.completed ? 'Completed' : 'No deadline',
      formattedDeadline: 'No deadline',
    };
  }

  const formattedDeadline = time ? `${iso} · ${time}` : iso;
  if (todo.completed) {
    return {
      status: 'completed',
      badgeLabel: 'Completed',
      formattedDeadline,
    };
  }

  if (iso < referenceDateIso) {
    return {
      status: 'overdue',
      badgeLabel: 'Overdue',
      formattedDeadline,
    };
  }

  if (iso === referenceDateIso) {
    if (time && time < referenceTimeHHMM) {
      return {
        status: 'overdue',
        badgeLabel: 'Overdue',
        formattedDeadline,
      };
    }
    return {
      status: 'due_today',
      badgeLabel: 'Due today',
      formattedDeadline: time ? `Today · ${time}` : 'Today',
    };
  }

  return {
    status: 'upcoming',
    badgeLabel: 'Upcoming',
    formattedDeadline,
  };
}

export function filterTodosByQuery(
  todos: TodoItem[],
  query: string,
  showCompleted: boolean = true
): TodoItem[] {
  const q = query.trim().toLowerCase();
  return [...todos]
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .filter((t) => {
      if (!showCompleted && t.completed) return false;
      if (!q) return true;
      return (
        t.title.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        (t.dueDateIso && t.dueDateIso.toLowerCase().includes(q)) ||
        (t.dueDate && t.dueDate.toLowerCase().includes(q))
      );
    });
}

export const INITIAL_TODOS: TodoItem[] = [
  {
    id: 'todo-1',
    title: 'Math 12 - Unit 4 learning guide',
    completed: true,
    priority: 'high',
    category: 'School',
    dueDate: 'Today',
    dueDateIso: '2026-11-09',
    dueTime: '08:30',
    orderIndex: 0,
  },
  {
    id: 'todo-2',
    title: 'Math 12 - Unit 4 Exam prep',
    completed: true,
    priority: 'high',
    category: 'School',
    dueDate: 'Today',
    dueDateIso: '2026-11-09',
    dueTime: '11:00',
    orderIndex: 1,
  },
  {
    id: 'todo-3',
    title: 'Chem 11 - Unit 3 learning guide',
    completed: true,
    priority: 'medium',
    category: 'School',
    dueDate: 'Today',
    dueDateIso: '2026-11-09',
    dueTime: '14:00',
    orderIndex: 2,
  },
  {
    id: 'todo-4',
    title: 'Review KDE Plasma 5.27 QML shader cache',
    completed: false,
    priority: 'medium',
    category: 'Engineering',
    dueDate: 'Today',
    dueDateIso: '2026-11-09',
    dueTime: '16:30',
    orderIndex: 3,
  },
  {
    id: 'todo-5',
    title: 'Package URWidgets v3.0.0 release tarball',
    completed: false,
    priority: 'high',
    category: 'Release',
    dueDate: 'Upcoming',
    dueDateIso: '2026-11-12',
    dueTime: '18:00',
    orderIndex: 4,
  },
];

export function computeTodoProgress(todos: TodoItem[]): {
  total: number;
  completed: number;
  remaining: number;
  percent: number;
  summaryText: string;
} {
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const remaining = total - completed;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  return {
    total,
    completed,
    remaining,
    percent,
    summaryText: `${completed} of ${total} completed`,
  };
}

export function addTodoItem(
  todos: TodoItem[],
  item: Omit<TodoItem, 'orderIndex'>
): TodoItem[] {
  const maxOrder = todos.reduce((max, t) => Math.max(max, t.orderIndex), -1);
  return [...todos, { ...item, orderIndex: maxOrder + 1 }];
}

export function toggleTodoItem(todos: TodoItem[], id: string): TodoItem[] {
  return todos.map((t) =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
}

export function updateTodoItem(
  todos: TodoItem[],
  id: string,
  updates: Partial<
    Pick<
      TodoItem,
      'title' | 'priority' | 'category' | 'dueDate' | 'dueDateIso' | 'dueTime'
    >
  >
): TodoItem[] {
  return todos.map((t) => (t.id === id ? { ...t, ...updates } : t));
}

export function deleteTodoItem(todos: TodoItem[], id: string): TodoItem[] {
  return todos.filter((t) => t.id !== id);
}

export function reorderTodoItems(
  todos: TodoItem[],
  id: string,
  direction: 'up' | 'down'
): TodoItem[] {
  const sorted = [...todos].sort((a, b) => a.orderIndex - b.orderIndex);
  const idx = sorted.findIndex((t) => t.id === id);
  if (idx === -1) return todos;
  const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= sorted.length) return todos;

  const temp = sorted[idx];
  sorted[idx] = sorted[swapIdx];
  sorted[swapIdx] = temp;

  return sorted.map((t, i) => ({ ...t, orderIndex: i }));
}

export function clearCompletedTodos(todos: TodoItem[]): TodoItem[] {
  return todos
    .filter((t) => !t.completed)
    .map((t, i) => ({ ...t, orderIndex: i }));
}

// ============================================================================
// SECTION 8: GLOBAL CUSTOM IMAGE BACKGROUND FOR EVERY WIDGET
// ============================================================================

export type WidgetImageFit = 'cover' | 'contain' | 'stretch' | 'center';
export type WidgetImagePosition = 'center' | 'top' | 'bottom' | 'left' | 'right';
export type WidgetOverlayMode = 'auto' | 'dark' | 'light';
export type WidgetTextContrastOverride = 'auto' | 'light' | 'dark';

export const SUPPORTED_IMAGE_FORMATS = [
  'svg',
  'jpg',
  'jpeg',
  'png',
  'webp',
] as const;

export interface WidgetBackgroundConfig {
  enabled: boolean;
  imageUrl: string;
  fitMode: WidgetImageFit;
  position: WidgetImagePosition;
  overlayMode: WidgetOverlayMode;
  overlayOpacity: number; // 0.0 to 0.85
  colorTint: string | null; // optional hex tint
  textContrastOverride: WidgetTextContrastOverride;
}

export const DEFAULT_WIDGET_BACKGROUND: WidgetBackgroundConfig = {
  enabled: false,
  imageUrl: '',
  fitMode: 'cover',
  position: 'center',
  overlayMode: 'auto',
  overlayOpacity: 0.35,
  colorTint: null,
  textContrastOverride: 'auto',
};

export interface BuiltInBackgroundSample {
  id: string;
  label: string;
  format: 'JPG' | 'SVG';
  url: string;
  recommendedText: 'light' | 'dark';
}

export const BUILT_IN_BACKGROUND_IMAGES: BuiltInBackgroundSample[] = [
  {
    id: 'bg-arch',
    label: 'Autumn Window Study (JPG)',
    format: 'JPG',
    url: '/images/photo_widget_architecture.jpg',
    recommendedText: 'light',
  },
  {
    id: 'bg-pastry',
    label: 'Warm Morning Artisan (JPG)',
    format: 'JPG',
    url: '/images/photo_widget_botanical.jpg',
    recommendedText: 'light',
  },
  {
    id: 'bg-cozy',
    label: 'Cozy Knit & Coffee (JPG)',
    format: 'JPG',
    url: '/images/alpine_mist_wallpaper.jpg',
    recommendedText: 'light',
  },
  {
    id: 'bg-botanical',
    label: 'Nordic Botanical Mist (JPG)',
    format: 'JPG',
    url: '/images/photo_widget_botanical.jpg',
    recommendedText: 'light',
  },
  {
    id: 'bg-minimal',
    label: 'Warm Linen Studio (JPG)',
    format: 'JPG',
    url: '/images/photo_widget_architecture.jpg',
    recommendedText: 'dark',
  },
  {
    id: 'bg-svg-waves',
    label: 'Editorial Contour Waves (SVG)',
    format: 'SVG',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23283044"/><stop offset="100%" stop-color="%23181B26"/></linearGradient></defs><rect width="400" height="300" fill="url(%23g)"/><path d="M0 190 Q 120 130 240 190 T 400 170 L 400 300 L 0 300 Z" fill="%23E84A7F" fill-opacity="0.22"/><path d="M0 230 Q 150 180 280 230 T 400 215 L 400 300 L 0 300 Z" fill="%239B51E0" fill-opacity="0.25"/></svg>',
    recommendedText: 'light',
  },
];

export function validateWidgetBackgroundFormat(pathOrUrl: string): {
  valid: boolean;
  format: string;
  error: string | null;
} {
  const clean = pathOrUrl.trim();
  if (!clean) {
    return { valid: false, format: '', error: 'Image path is empty' };
  }
  if (clean.startsWith('data:image/svg+xml')) {
    return { valid: true, format: 'svg', error: null };
  }
  const dataMatch = clean.match(/^data:image\/([a-zA-Z0-9+.-]+);/);
  if (dataMatch) {
    const mimeSub = dataMatch[1].toLowerCase().replace('svg+xml', 'svg');
    if ((SUPPORTED_IMAGE_FORMATS as readonly string[]).includes(mimeSub)) {
      return { valid: true, format: mimeSub, error: null };
    }
    return {
      valid: false,
      format: mimeSub,
      error: `Unsupported image format "${mimeSub}". Supported formats: SVG, JPG, JPEG, PNG, WebP`,
    };
  }

  const noQuery = clean.split('?')[0].split('#')[0];
  const parts = noQuery.split('.');
  if (parts.length < 2) {
    return {
      valid: false,
      format: '',
      error: 'File must end with .svg, .jpg, .jpeg, .png, or .webp',
    };
  }
  const ext = parts[parts.length - 1].toLowerCase();
  if (!(SUPPORTED_IMAGE_FORMATS as readonly string[]).includes(ext)) {
    return {
      valid: false,
      format: ext,
      error: `Unsupported image format ".${ext}". Supported formats: SVG, JPG, JPEG, PNG, WebP`,
    };
  }
  return { valid: true, format: ext, error: null };
}

export const INITIAL_WIDGET_BACKGROUNDS: Record<
  WidgetId,
  WidgetBackgroundConfig
> = {
  clock: { ...DEFAULT_WIDGET_BACKGROUND },
  calendar: { ...DEFAULT_WIDGET_BACKGROUND },
  weather: { ...DEFAULT_WIDGET_BACKGROUND },
  pomodoro: { ...DEFAULT_WIDGET_BACKGROUND },
  agenda: { ...DEFAULT_WIDGET_BACKGROUND },
  photos: { ...DEFAULT_WIDGET_BACKGROUND },
  quick_actions: { ...DEFAULT_WIDGET_BACKGROUND },
  system_monitor: { ...DEFAULT_WIDGET_BACKGROUND },
  notes: { ...DEFAULT_WIDGET_BACKGROUND },
  music_player: { ...DEFAULT_WIDGET_BACKGROUND },
};

// ============================================================================
// SECTION 9: PHOTO FRAME DISPLAY MODES & INTERACTIVE CROP EDITOR (v3.0.0)
// ============================================================================

export type PhotoFrameMode = 'single' | 'slideshow';
export type PhotoFitMode = 'cover' | 'contain' | 'center';

export const SLIDESHOW_INTERVAL_PRESETS = [5, 10, 15, 30, 60] as const;

export interface PhotoCropConfig {
  zoom: number; // 1.0 to 2.5
  offsetX: number; // -50 to +50 (%)
  offsetY: number; // -50 to +50 (%)
  fitMode: PhotoFitMode;
}

export const DEFAULT_PHOTO_CROP: PhotoCropConfig = {
  zoom: 1.0,
  offsetX: 0,
  offsetY: 0,
  fitMode: 'cover',
};

export function clampPhotoCrop(crop: Partial<PhotoCropConfig>): PhotoCropConfig {
  const zoom = Math.max(
    1.0,
    Math.min(2.5, Number(crop.zoom ?? DEFAULT_PHOTO_CROP.zoom) || 1.0)
  );
  const offsetX = Math.max(
    -50,
    Math.min(50, Math.round(Number(crop.offsetX ?? DEFAULT_PHOTO_CROP.offsetX) || 0))
  );
  const offsetY = Math.max(
    -50,
    Math.min(50, Math.round(Number(crop.offsetY ?? DEFAULT_PHOTO_CROP.offsetY) || 0))
  );
  const fitMode: PhotoFitMode =
    crop.fitMode === 'contain' || crop.fitMode === 'center'
      ? crop.fitMode
      : 'cover';
  return {
    zoom: Math.round(zoom * 100) / 100,
    offsetX,
    offsetY,
    fitMode,
  };
}

export function computePhotoCropTransform(crop: PhotoCropConfig): {
  transformCss: string;
  objectFit: 'cover' | 'contain' | 'none';
  objectPosition: string;
} {
  const safe = clampPhotoCrop(crop);
  const posX = Math.max(0, Math.min(100, 50 - safe.offsetX));
  const posY = Math.max(0, Math.min(100, 50 - safe.offsetY));
  return {
    transformCss: `translate(${safe.offsetX}%, ${safe.offsetY}%) scale(${safe.zoom})`,
    objectFit:
      safe.fitMode === 'contain'
        ? 'contain'
        : safe.fitMode === 'center'
          ? 'none'
          : 'cover',
    objectPosition: `${posX}% ${posY}%`,
  };
}

// ============================================================================
// SECTION 10: URWIDGETS MUSIC PLAYER ENGINE (v3.0.0)
// ============================================================================

export type MusicSourceType = 'local' | 'stream';
export type RepeatMode = 'off' | 'all' | 'one';

export const SUPPORTED_MUSIC_AUDIO_FORMATS = [
  'mp3',
  'flac',
  'ogg',
  'wav',
  'm4a',
  'aac',
] as const;

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  durationSecs: number;
  coverUrl: string;
  sourceType: MusicSourceType;
  fileOrStreamUrl: string;
  localObjectUrl?: string; // Browser object URL when loaded via local file picker
  folderPath?: string;
  format: string;
  synthFreqHz?: number;
}

export interface LocalMusicFolderPreset {
  id: string;
  label: string;
  path: string;
  tracks: MusicTrack[];
}

export const LOCAL_MUSIC_FOLDERS: LocalMusicFolderPreset[] = [
  {
    id: 'folder-ambient',
    label: '~/Music/Ambient Studio',
    path: '/home/mint/Music/Ambient Studio',
    tracks: [
      {
        id: 'trk-velvet-horizon',
        title: 'Velvet Horizon',
        artist: 'Klangwerk & Sol',
        album: 'Late Night Focus Sessions',
        durationSecs: 214,
        coverUrl: '/images/photo_widget_architecture.jpg',
        sourceType: 'local',
        fileOrStreamUrl: '/home/mint/Music/Ambient Studio/01-velvet-horizon.flac',
        folderPath: '/home/mint/Music/Ambient Studio',
        format: 'FLAC',
        synthFreqHz: 432,
      },
      {
        id: 'trk-linen-rain',
        title: 'Warm Linen Rain',
        artist: 'Harbor Ensemble',
        album: 'Nordic Minimalist Vol. 2',
        durationSecs: 188,
        coverUrl: '/images/photo_widget_botanical.jpg',
        sourceType: 'local',
        fileOrStreamUrl: '/home/mint/Music/Ambient Studio/02-warm-linen-rain.mp3',
        folderPath: '/home/mint/Music/Ambient Studio',
        format: 'MP3',
        synthFreqHz: 528,
      },
      {
        id: 'trk-espresso-sketch',
        title: 'Espresso Sketchbook',
        artist: 'Mori & The Rhodes',
        album: 'Morning Desk Tape',
        durationSecs: 165,
        coverUrl: '/images/alpine_mist_wallpaper.jpg',
        sourceType: 'local',
        fileOrStreamUrl: '/home/mint/Music/Ambient Studio/03-espresso-sketchbook.ogg',
        folderPath: '/home/mint/Music/Ambient Studio',
        format: 'OGG',
        synthFreqHz: 396,
      },
      {
        id: 'trk-autumn-glass',
        title: 'Autumn Glass Reflections',
        artist: 'Sora Takahashi',
        album: 'Kyoto Acoustic Studies',
        durationSecs: 242,
        coverUrl: '/images/photo_widget_architecture.jpg',
        sourceType: 'local',
        fileOrStreamUrl: '/home/mint/Music/Ambient Studio/04-autumn-glass.wav',
        folderPath: '/home/mint/Music/Ambient Studio',
        format: 'WAV',
        synthFreqHz: 440,
      },
    ],
  },
  {
    id: 'folder-lofi',
    label: '~/Music/Lo-Fi Study Beats',
    path: '/home/mint/Music/Lo-Fi Study Beats',
    tracks: [
      {
        id: 'trk-midnight-coding',
        title: 'Midnight Rust Compiler',
        artist: 'Bitshift Collective',
        album: 'Kernel Space Beats',
        durationSecs: 196,
        coverUrl: '/images/photo_widget_botanical.jpg',
        sourceType: 'local',
        fileOrStreamUrl: '/home/mint/Music/Lo-Fi Study Beats/01-midnight-rust.mp3',
        folderPath: '/home/mint/Music/Lo-Fi Study Beats',
        format: 'MP3',
        synthFreqHz: 480,
      },
      {
        id: 'trk-wayland-breeze',
        title: 'Plasma Desktop Breeze',
        artist: 'Cinnamon & Quartz',
        album: 'Linux Mint Sessions',
        durationSecs: 174,
        coverUrl: '/images/photo_widget_architecture.jpg',
        sourceType: 'local',
        fileOrStreamUrl: '/home/mint/Music/Lo-Fi Study Beats/02-plasma-breeze.m4a',
        folderPath: '/home/mint/Music/Lo-Fi Study Beats',
        format: 'M4A',
        synthFreqHz: 360,
      },
    ],
  },
];

export const SAVED_AUDIO_STREAMS: MusicTrack[] = [
  {
    id: 'stream-groove-salad',
    title: 'SomaFM: Groove Salad (Ambient/Downtempo)',
    artist: 'SomaFM Live Stream',
    album: 'Direct Icecast MP3 Stream',
    durationSecs: 3600,
    coverUrl: '/images/photo_widget_botanical.jpg',
    sourceType: 'stream',
    fileOrStreamUrl: 'https://ice2.somafm.com/groovesalad-128-mp3',
    format: 'STREAM',
    synthFreqHz: 432,
  },
  {
    id: 'stream-drone-zone',
    title: 'SomaFM: Drone Zone (Atmospheric)',
    artist: 'SomaFM Live Stream',
    album: 'Direct Icecast MP3 Stream',
    durationSecs: 3600,
    coverUrl: '/images/photo_widget_architecture.jpg',
    sourceType: 'stream',
    fileOrStreamUrl: 'https://ice2.somafm.com/dronezone-128-mp3',
    format: 'STREAM',
    synthFreqHz: 528,
  },
  {
    id: 'stream-lofi-radio',
    title: 'Chillsky Lo-Fi Hip Hop Radio',
    artist: 'Direct Audio Stream (.mp3)',
    album: '24/7 Study Stream',
    durationSecs: 3600,
    coverUrl: '/images/alpine_mist_wallpaper.jpg',
    sourceType: 'stream',
    fileOrStreamUrl: 'https://stream.chillhop.com/mp3',
    format: 'MP3 STREAM',
    synthFreqHz: 396,
  },
];

export type MusicPlaybackStatus =
  | 'Playing'
  | 'Paused'
  | 'Stopped'
  | 'Buffering'
  | 'Error';

export interface MusicPlayerState {
  sourceType: MusicSourceType;
  activeFolderPath: string;
  queue: MusicTrack[];
  currentIndex: number;
  isPlaying: boolean;
  playbackStatus: MusicPlaybackStatus;
  positionSecs: number;
  volume: number; // 0 to 100
  isMuted?: boolean;
  previousVolume?: number;
  pausedByAlarm?: boolean;
  metadataCacheHits?: number;
  shuffle: boolean;
  repeatMode: RepeatMode;
  savedStreams: MusicTrack[];
  streamError: string | null;
}

export const INITIAL_MUSIC_PLAYER_STATE: MusicPlayerState = {
  sourceType: 'local',
  activeFolderPath: LOCAL_MUSIC_FOLDERS[0].path,
  queue: LOCAL_MUSIC_FOLDERS[0].tracks,
  currentIndex: 0,
  isPlaying: false,
  playbackStatus: 'Paused',
  positionSecs: 48,
  volume: 80,
  isMuted: false,
  previousVolume: 80,
  pausedByAlarm: false,
  metadataCacheHits: 1,
  shuffle: false,
  repeatMode: 'all',
  savedStreams: SAVED_AUDIO_STREAMS,
  streamError: null,
};

export function validateMusicAudioFormat(fileNameOrPath: string): {
  valid: boolean;
  ext: string;
  error: string | null;
} {
  const clean = fileNameOrPath.trim().split('?')[0].split('#')[0];
  if (!clean) {
    return { valid: false, ext: '', error: 'Audio file path is empty' };
  }
  const parts = clean.split('.');
  if (parts.length < 2) {
    return {
      valid: false,
      ext: '',
      error: 'Audio file must end with .mp3, .flac, .ogg, .wav, .m4a, or .aac',
    };
  }
  const ext = parts[parts.length - 1].toLowerCase();
  if (!(SUPPORTED_MUSIC_AUDIO_FORMATS as readonly string[]).includes(ext)) {
    return {
      valid: false,
      ext,
      error: `Unsupported audio format ".${ext}". Supported formats: .mp3, .flac, .ogg, .wav, .m4a, .aac`,
    };
  }
  return { valid: true, ext, error: null };
}

export function validateDirectAudioStreamUrl(rawUrl: string): {
  valid: boolean;
  normalizedUrl: string;
  inferredTitle: string;
  error: string | null;
} {
  const clean = rawUrl.trim();
  if (!clean) {
    return {
      valid: false,
      normalizedUrl: '',
      inferredTitle: '',
      error: 'Please enter a direct audio or stream URL (https://...)',
    };
  }
  let parsed: URL;
  try {
    parsed = new URL(clean);
  } catch {
    return {
      valid: false,
      normalizedUrl: clean,
      inferredTitle: '',
      error: 'Invalid URL syntax. Must start with http:// or https://',
    };
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return {
      valid: false,
      normalizedUrl: clean,
      inferredTitle: '',
      error: 'Only HTTP and HTTPS audio stream URLs are supported',
    };
  }

  const host = parsed.hostname.toLowerCase();
  const pathLower = parsed.pathname.toLowerCase();

  // Reject DRM / web-page wrapper links that are not direct audio streams
  if (
    host.includes('youtube.com') ||
    host.includes('youtu.be') ||
    host.includes('open.spotify.com') ||
    host.includes('soundcloud.com') ||
    pathLower.endsWith('.html') ||
    pathLower.endsWith('.htm') ||
    pathLower.endsWith('.php')
  ) {
    return {
      valid: false,
      normalizedUrl: clean,
      inferredTitle: '',
      error:
        'Unsupported webpage or DRM link. Provide a direct audio file (.mp3, .ogg, .flac, .wav, .m4a) or Icecast/Shoutcast stream URL.',
    };
  }

  const hasAudioExt = SUPPORTED_MUSIC_AUDIO_FORMATS.some((ext) =>
    pathLower.endsWith(`.${ext}`)
  );
  const isKnownStreamPath =
    pathLower.includes('stream') ||
    pathLower.includes('icecast') ||
    pathLower.includes('mp3') ||
    pathLower.includes('ogg') ||
    pathLower.includes('aac') ||
    pathLower.includes('radio') ||
    pathLower.includes('live') ||
    host.includes('somafm.com') ||
    host.includes('ice') ||
    host.includes('stream');

  if (!hasAudioExt && !isKnownStreamPath) {
    return {
      valid: false,
      normalizedUrl: clean,
      inferredTitle: '',
      error:
        'URL does not appear to be a direct audio file or stream. Use a direct .mp3/.ogg/.flac/.wav link or Icecast stream.',
    };
  }

  const lastSegment =
    parsed.pathname
      .split('/')
      .filter(Boolean)
      .pop()
      ?.replace(/\.[a-z0-9]+$/i, '')
      .replace(/[-_]+/g, ' ') || parsed.hostname;
  const inferredTitle =
    lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);

  return {
    valid: true,
    normalizedUrl: clean,
    inferredTitle,
    error: null,
  };
}

export function formatAudioDuration(seconds: number): string {
  const safe = Math.max(0, Math.floor(Number(seconds) || 0));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

export type MusicPlayerAction =
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'TOGGLE_PLAY' }
  | { type: 'STOP' }
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'SEEK'; positionSecs: number }
  | { type: 'TICK'; elapsedSecs?: number }
  | { type: 'SET_VOLUME'; volume: number }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'TOGGLE_SHUFFLE' }
  | { type: 'CYCLE_REPEAT' }
  | { type: 'SELECT_TRACK'; index: number }
  | { type: 'SELECT_FOLDER'; folderPath: string; tracks: MusicTrack[] }
  | { type: 'ADD_LOCAL_FILE'; track: MusicTrack }
  | { type: 'RESCAN_FOLDER' }
  | { type: 'PLAY_STREAM'; streamTrack: MusicTrack }
  | { type: 'REMOVE_SAVED_STREAM'; streamId: string }
  | { type: 'REMOVE_QUEUE_TRACK'; trackId: string }
  | { type: 'CLEAR_QUEUE' }
  | { type: 'SET_STREAM_ERROR'; error: string | null }
  | { type: 'ALARM_PAUSE' }
  | { type: 'ALARM_RESUME' };

export function transitionMusicPlayer(
  state: MusicPlayerState,
  action: MusicPlayerAction
): MusicPlayerState {
  const currentTrack = state.queue[state.currentIndex] || state.queue[0];
  const maxDur = currentTrack ? currentTrack.durationSecs : 0;

  switch (action.type) {
    case 'PLAY':
      return {
        ...state,
        isPlaying: state.queue.length > 0,
        pausedByAlarm: false,
        playbackStatus: state.queue.length > 0 ? 'Playing' : 'Stopped',
        streamError: null,
      };
    case 'PAUSE':
      return {
        ...state,
        isPlaying: false,
        pausedByAlarm: false,
        playbackStatus: 'Paused',
      };
    case 'TOGGLE_PLAY': {
      const nextPlaying = state.queue.length > 0 ? !state.isPlaying : false;
      return {
        ...state,
        isPlaying: nextPlaying,
        pausedByAlarm: false,
        playbackStatus: nextPlaying ? 'Playing' : 'Paused',
        streamError: null,
      };
    }
    case 'STOP':
      return {
        ...state,
        isPlaying: false,
        pausedByAlarm: false,
        playbackStatus: 'Stopped',
        positionSecs: 0,
      };
    case 'SEEK': {
      const clamped = Math.max(
        0,
        Math.min(maxDur, Math.floor(action.positionSecs))
      );
      return { ...state, positionSecs: clamped };
    }
    case 'SET_VOLUME': {
      const nextVol = Math.max(0, Math.min(100, Math.round(action.volume)));
      return {
        ...state,
        volume: nextVol,
        isMuted: nextVol === 0,
        previousVolume: nextVol > 0 ? nextVol : state.previousVolume ?? 80,
      };
    }
    case 'TOGGLE_MUTE': {
      const currentlyMuted = Boolean(state.isMuted) || state.volume === 0;
      if (currentlyMuted) {
        const restored =
          state.previousVolume && state.previousVolume > 0
            ? state.previousVolume
            : 80;
        return {
          ...state,
          isMuted: false,
          volume: restored,
        };
      }
      return {
        ...state,
        isMuted: true,
        previousVolume: state.volume > 0 ? state.volume : 80,
        volume: 0,
      };
    }
    case 'TOGGLE_SHUFFLE':
      return { ...state, shuffle: !state.shuffle };
    case 'CYCLE_REPEAT': {
      const nextRepeat: RepeatMode =
        state.repeatMode === 'off'
          ? 'all'
          : state.repeatMode === 'all'
            ? 'one'
            : 'off';
      return { ...state, repeatMode: nextRepeat };
    }
    case 'SELECT_TRACK': {
      if (action.index < 0 || action.index >= state.queue.length) return state;
      return {
        ...state,
        currentIndex: action.index,
        positionSecs: 0,
        isPlaying: true,
        pausedByAlarm: false,
        playbackStatus: 'Playing',
        streamError: null,
      };
    }
    case 'NEXT': {
      if (state.queue.length === 0) return state;
      if (state.repeatMode === 'one') {
        return {
          ...state,
          positionSecs: 0,
          isPlaying: true,
          playbackStatus: 'Playing',
        };
      }
      if (state.shuffle && state.queue.length > 1) {
        const nextIdx = (state.currentIndex + 1) % state.queue.length;
        return {
          ...state,
          currentIndex: nextIdx,
          positionSecs: 0,
          isPlaying: true,
          playbackStatus: 'Playing',
        };
      }
      const isLast = state.currentIndex >= state.queue.length - 1;
      if (isLast && state.repeatMode === 'off') {
        return {
          ...state,
          currentIndex: 0,
          positionSecs: 0,
          isPlaying: false,
          playbackStatus: 'Stopped',
        };
      }
      const nextIdx = (state.currentIndex + 1) % state.queue.length;
      return {
        ...state,
        currentIndex: nextIdx,
        positionSecs: 0,
      };
    }
    case 'PREV': {
      if (state.queue.length === 0) return state;
      if (state.positionSecs > 5) {
        return { ...state, positionSecs: 0 };
      }
      const prevIdx =
        (state.currentIndex - 1 + state.queue.length) % state.queue.length;
      return {
        ...state,
        currentIndex: prevIdx,
        positionSecs: 0,
      };
    }
    case 'TICK': {
      if (!state.isPlaying || state.pausedByAlarm || !currentTrack) return state;
      const step = action.elapsedSecs ?? 1;
      const nextPos = state.positionSecs + step;
      if (nextPos < currentTrack.durationSecs) {
        return { ...state, positionSecs: nextPos };
      }
      return transitionMusicPlayer(state, { type: 'NEXT' });
    }
    case 'SELECT_FOLDER': {
      return {
        ...state,
        sourceType: 'local',
        activeFolderPath: action.folderPath,
        queue: action.tracks,
        currentIndex: 0,
        positionSecs: 0,
        isPlaying: action.tracks.length > 0,
        pausedByAlarm: false,
        metadataCacheHits: (state.metadataCacheHits ?? 1) + 1,
        playbackStatus: action.tracks.length > 0 ? 'Playing' : 'Stopped',
        streamError: null,
      };
    }
    case 'ADD_LOCAL_FILE': {
      const filtered = state.queue.filter(
        (t) => t.fileOrStreamUrl !== action.track.fileOrStreamUrl
      );
      const nextQueue = [action.track, ...filtered];
      return {
        ...state,
        sourceType: 'local',
        queue: nextQueue,
        currentIndex: 0,
        positionSecs: 0,
        isPlaying: true,
        pausedByAlarm: false,
        playbackStatus: 'Playing',
        streamError: null,
      };
    }
    case 'RESCAN_FOLDER': {
      const preset = LOCAL_MUSIC_FOLDERS.find(
        (f) => f.path === state.activeFolderPath
      );
      const tracks = preset ? preset.tracks : state.queue;
      return {
        ...state,
        sourceType: 'local',
        queue: tracks,
        currentIndex: Math.min(state.currentIndex, Math.max(0, tracks.length - 1)),
        streamError: null,
      };
    }
    case 'PLAY_STREAM': {
      const exists = state.savedStreams.some(
        (s) => s.fileOrStreamUrl === action.streamTrack.fileOrStreamUrl
      );
      const updatedStreams = exists
        ? state.savedStreams
        : [action.streamTrack, ...state.savedStreams];
      const idx = updatedStreams.findIndex(
        (s) => s.fileOrStreamUrl === action.streamTrack.fileOrStreamUrl
      );
      return {
        ...state,
        sourceType: 'stream',
        queue: updatedStreams,
        savedStreams: updatedStreams,
        currentIndex: Math.max(0, idx),
        positionSecs: 0,
        isPlaying: true,
        pausedByAlarm: false,
        playbackStatus: 'Playing',
        streamError: null,
      };
    }
    case 'REMOVE_SAVED_STREAM': {
      const filtered = state.savedStreams.filter(
        (s) => s.id !== action.streamId
      );
      const nextQueue =
        state.sourceType === 'stream'
          ? state.queue.filter((s) => s.id !== action.streamId)
          : state.queue;
      const nextIdx = Math.min(
        state.currentIndex,
        Math.max(0, nextQueue.length - 1)
      );
      const stillPlaying = nextQueue.length > 0 ? state.isPlaying : false;
      return {
        ...state,
        savedStreams: filtered,
        queue: nextQueue,
        currentIndex: nextIdx,
        isPlaying: stillPlaying,
        playbackStatus: stillPlaying ? state.playbackStatus : 'Stopped',
      };
    }
    case 'REMOVE_QUEUE_TRACK': {
      const nextQueue = state.queue.filter((t) => t.id !== action.trackId);
      const nextIdx = Math.min(
        state.currentIndex,
        Math.max(0, nextQueue.length - 1)
      );
      const stillPlaying = nextQueue.length > 0 ? state.isPlaying : false;
      return {
        ...state,
        queue: nextQueue,
        currentIndex: nextIdx,
        isPlaying: stillPlaying,
        playbackStatus: stillPlaying ? state.playbackStatus : 'Stopped',
      };
    }
    case 'CLEAR_QUEUE': {
      return {
        ...state,
        queue: [],
        currentIndex: 0,
        positionSecs: 0,
        isPlaying: false,
        playbackStatus: 'Stopped',
      };
    }
    case 'SET_STREAM_ERROR': {
      return {
        ...state,
        isPlaying: action.error ? false : state.isPlaying,
        playbackStatus: action.error ? 'Error' : state.playbackStatus,
        streamError: action.error,
      };
    }
    case 'ALARM_PAUSE': {
      if (!state.isPlaying) return state;
      return {
        ...state,
        isPlaying: false,
        pausedByAlarm: true,
        playbackStatus: 'Paused',
      };
    }
    case 'ALARM_RESUME': {
      if (!state.pausedByAlarm) return state;
      return {
        ...state,
        isPlaying: state.queue.length > 0,
        pausedByAlarm: false,
        playbackStatus: state.queue.length > 0 ? 'Playing' : 'Stopped',
      };
    }
    default:
      return state;
  }
}


