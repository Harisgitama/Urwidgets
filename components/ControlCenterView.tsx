'use client';

import React, { useState } from 'react';
import {
  Palette,
  LayoutGrid,
  Database,
  Plus,
  Copy,
  Trash2,
  Upload,
  RotateCcw,
  Check,
  Terminal,
  CloudSun,
  Type,
  Sliders,
  Image as ImageIcon,
  Layers,
  Globe,
  Instagram,
  User,
} from 'lucide-react';
import {
  ThemeSpec,
  AppearanceMode,
  WidgetSurfaceStyle,
  AccentColorId,
  ElevationLevel,
  ELEVATION_LEVELS,
  ACCENT_COLORS,
  GRADIENT_PRESETS,
  SYSTEM_FONT_OPTIONS,
  computeMacOsWidgetSurface,
  normalizeHexColor,
  WidgetInstanceConfig,
  WidgetIconStyle,
  WidgetId,
  WidgetSize,
  AgendaEvent,
  PomodoroState,
  AlarmItem,
  NoteItem,
  WidgetBackgroundConfig,
  WidgetImageFit,
  WidgetImagePosition,
  WidgetOverlayMode,
  WidgetTextContrastOverride,
  DEFAULT_WIDGET_BACKGROUND,
  BUILT_IN_BACKGROUND_IMAGES,
  validateWidgetBackgroundFormat,
  DEVELOPER_ATTRIBUTION,
  KWinCompositorConfig,
  DEFAULT_KWIN_COMPOSITOR_CONFIG,
  GlassPerformanceProfile,
  GlassFallbackMode,
  KDE_PLASMA5_INTEGRATION_MATRIX,
} from '@/lib/urwidgets-engine';

interface ControlCenterViewProps {
  themes: ThemeSpec[];
  activeThemeId: string;
  onSelectTheme: (id: string) => void;
  appearanceMode: AppearanceMode;
  onChangeAppearanceMode: (mode: AppearanceMode) => void;
  widgetStyle: WidgetSurfaceStyle;
  onChangeWidgetStyle: (style: WidgetSurfaceStyle) => void;
  accentColorId: AccentColorId;
  onChangeAccentColorId: (id: AccentColorId) => void;
  customAccentHex: string;
  onChangeCustomAccentHex: (hex: string) => void;
  systemFontId: string;
  onChangeSystemFontId: (fontId: string) => void;
  globalElevation: ElevationLevel;
  onChangeGlobalElevation: (level: ElevationLevel) => void;
  kwinCompositorConfig?: KWinCompositorConfig;
  onChangeKwinCompositorConfig?: (config: KWinCompositorConfig) => void;
  onUpdateActiveTheme: (updated: ThemeSpec) => void;
  onCreateCustomTheme: (name: string, base: ThemeSpec) => void;
  onDeleteCustomTheme: (id: string) => void;
  onImportThemeJson: (rawJson: string) => { ok: boolean; message: string };
  widgets: WidgetInstanceConfig[];
  onToggleWidget: (id: WidgetId) => void;
  onResizeWidget: (id: WidgetId, size: WidgetSize) => void;
  onSetWidgetThemeOverride: (id: WidgetId, themeId: string | null) => void;
  onSetWidgetElevationOverride: (
    id: WidgetId,
    level: ElevationLevel | null
  ) => void;
  onUpdateWidgetPreferences: (
    id: WidgetId,
    patch: Partial<WidgetInstanceConfig>
  ) => void;
  onResetSingleWidgetPreferences: (id: WidgetId) => void;
  widgetBackgrounds: Record<WidgetId, WidgetBackgroundConfig>;
  onUpdateWidgetBackground: (
    id: WidgetId,
    config: WidgetBackgroundConfig
  ) => void;
  onResetWidgetBackground: (id: WidgetId) => void;
  onResetAllSettings: () => void;
  agendaEvents: AgendaEvent[];
  alarms: AlarmItem[];
  notes: NoteItem[];
  archivedTodosCount: number;
  pomodoro: PomodoroState;
  onUpdatePomodoroDurations: (
    study: number,
    shortB: number,
    longB: number
  ) => void;
  ipcLog: string[];
}

export default function ControlCenterView(props: ControlCenterViewProps) {
  const {
    themes,
    activeThemeId,
    onSelectTheme,
    appearanceMode,
    onChangeAppearanceMode,
    widgetStyle,
    onChangeWidgetStyle,
    accentColorId,
    onChangeAccentColorId,
    customAccentHex,
    onChangeCustomAccentHex,
    systemFontId,
    onChangeSystemFontId,
    globalElevation,
    onChangeGlobalElevation,
    kwinCompositorConfig = DEFAULT_KWIN_COMPOSITOR_CONFIG,
    onChangeKwinCompositorConfig,
    onUpdateActiveTheme,
    onCreateCustomTheme,
    onDeleteCustomTheme,
    onImportThemeJson,
    widgets,
    onToggleWidget,
    onResizeWidget,
    onSetWidgetElevationOverride,
    onUpdateWidgetPreferences,
    onResetSingleWidgetPreferences,
    widgetBackgrounds,
    onUpdateWidgetBackground,
    onResetWidgetBackground,
    onResetAllSettings,
    agendaEvents,
    alarms,
    notes,
    archivedTodosCount,
    pomodoro,
    onUpdatePomodoroDurations,
    ipcLog,
  } = props;

  const [subTab, setSubTab] = useState<'appearance' | 'widgets' | 'sqlite'>(
    'appearance'
  );
  const [highlightColorId, setHighlightColorId] =
    useState<AccentColorId>(accentColorId);
  const [customThemeName, setCustomThemeName] = useState('');
  const [importJsonText, setImportJsonText] = useState('');
  const [importFeedback, setImportFeedback] = useState('');
  const [copiedExport, setCopiedExport] = useState(false);

  const [studyInput, setStudyInput] = useState(pomodoro.studyMins);
  const [shortInput, setShortInput] = useState(pomodoro.shortBreakMins);
  const [longInput, setLongInput] = useState(pomodoro.longBreakMins);

  // Per-Widget Custom Image Background Studio State
  const [selectedBgWidgetId, setSelectedBgWidgetId] =
    useState<WidgetId>('clock');
  const [bgFormatError, setBgFormatError] = useState('');
  const activeBgConfig =
    widgetBackgrounds[selectedBgWidgetId] || DEFAULT_WIDGET_BACKGROUND;

  const activeTheme =
    themes.find((t) => t.id === activeThemeId) || themes[0];
  const computedSurf = computeMacOsWidgetSurface(
    activeTheme,
    appearanceMode,
    widgetStyle,
    accentColorId,
    globalElevation,
    customAccentHex,
    kwinCompositorConfig
  );

  const updateCompositorField = <K extends keyof KWinCompositorConfig>(
    key: K,
    value: KWinCompositorConfig[K]
  ) => {
    onChangeKwinCompositorConfig?.({
      ...kwinCompositorConfig,
      [key]: value,
    });
  };

  const handleFieldChange = (
    section: 'appearance' | 'gradient' | 'effects',
    key: string,
    value: string | number | boolean
  ) => {
    const next: ThemeSpec = {
      ...activeTheme,
      [section]: {
        ...activeTheme[section],
        [key]: value,
      },
    };
    onUpdateActiveTheme(next);
  };

  const handleApplyGradientPreset = (presetId: string) => {
    const preset = GRADIENT_PRESETS.find((g) => g.id === presetId);
    if (!preset) return;
    const next: ThemeSpec = {
      ...activeTheme,
      gradient: {
        ...activeTheme.gradient,
        enabled: true,
        presetId: preset.id,
        start: preset.start,
        end: preset.end,
        third: preset.third,
        angle: preset.angle,
        intensity: preset.intensity,
      },
    };
    onUpdateActiveTheme(next);
  };

  const handleSaveNewTheme = (e: React.FormEvent) => {
    e.preventDefault();
    const name = customThemeName.trim() || `${activeTheme.name} Custom`;
    onCreateCustomTheme(name, activeTheme);
    setCustomThemeName('');
  };

  const handleCopyThemeJson = () => {
    navigator.clipboard?.writeText(JSON.stringify(activeTheme, null, 2));
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 2000);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = onImportThemeJson(importJsonText);
    setImportFeedback(res.message);
    if (res.ok) {
      setImportJsonText('');
    }
  };

  const updateSelectedBgField = <K extends keyof WidgetBackgroundConfig>(
    key: K,
    value: WidgetBackgroundConfig[K]
  ) => {
    setBgFormatError('');
    onUpdateWidgetBackground(selectedBgWidgetId, {
      ...activeBgConfig,
      [key]: value,
    });
  };

  const handleLocalBgFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const check = validateWidgetBackgroundFormat(file.name);
    if (!check.valid) {
      setBgFormatError(
        check.error ||
          'Unsupported format. Allowed: SVG, JPG, JPEG, PNG, WebP.'
      );
      return;
    }
    setBgFormatError('');
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUpdateWidgetBackground(selectedBgWidgetId, {
          ...activeBgConfig,
          enabled: true,
          imageUrl: reader.result,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const selectedAccentObj =
    ACCENT_COLORS.find((a) => a.id === accentColorId) || ACCENT_COLORS[3];

  return (
    <section className="space-y-6">
      {/* macOS System Settings-Inspired Header Bar */}
      <div className="bg-white dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-lg font-semibold text-stone-900 dark:text-white tracking-tight">
            Appearance &amp; WidgetWall Studio
          </h2>
          <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
            macOS System Settings-inspired appearance controller synchronized
            with <code className="font-mono">WidgetTheme.qml</code>,{' '}
            <code className="font-mono">WidgetBackground.qml</code>, and SQLite
            WAL storage.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setSubTab('appearance')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                subTab === 'appearance'
                  ? 'bg-white dark:bg-slate-800 text-stone-900 dark:text-white shadow-2xs font-semibold'
                  : 'text-stone-600 dark:text-slate-400'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              Appearance
            </button>
            <button
              type="button"
              onClick={() => setSubTab('widgets')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                subTab === 'widgets'
                  ? 'bg-white dark:bg-slate-800 text-stone-900 dark:text-white shadow-2xs font-semibold'
                  : 'text-stone-600 dark:text-slate-400'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Layout &amp; Widgets
            </button>
            <button
              type="button"
              onClick={() => setSubTab('sqlite')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                subTab === 'sqlite'
                  ? 'bg-white dark:bg-slate-800 text-stone-900 dark:text-white shadow-2xs font-semibold'
                  : 'text-stone-600 dark:text-slate-400'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              SQLite &amp; D-Bus
            </button>
          </div>

          <button
            type="button"
            onClick={onResetAllSettings}
            className="px-3 py-1.5 text-xs font-medium text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 rounded-xl flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Layout &amp; Appearance
          </button>
        </div>
      </div>

      {/* TAB 1: macOS APPEARANCE SETTINGS */}
      {subTab === 'appearance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: macOS Appearance Settings Form */}
            <div className="lg:col-span-7 bg-[#F5F4F0] dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 rounded-[24px] p-6 space-y-6 shadow-xs text-stone-900 dark:text-slate-100">
              {/* Section 1: Appearance (Auto / Light / Dark) */}
              <div className="bg-white/80 dark:bg-slate-950/70 border border-stone-200/70 dark:border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold">Appearance</div>
                  <div className="text-xs text-stone-500 dark:text-slate-400">
                    Select Auto, Light, or Dark desktop widget appearance
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {(
                    [
                      { id: 'auto', label: 'Auto' },
                      { id: 'light', label: 'Light' },
                      { id: 'dark', label: 'Dark' },
                    ] as { id: AppearanceMode; label: string }[]
                  ).map((mode) => {
                    const selected = appearanceMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => onChangeAppearanceMode(mode.id)}
                        className="flex flex-col items-center gap-1.5"
                      >
                        <div
                          className={`w-20 h-13 rounded-xl border-2 overflow-hidden flex ${
                            selected
                              ? 'shadow-sm'
                              : 'border-stone-300 dark:border-slate-700 opacity-80'
                          }`}
                          style={
                            selected
                              ? { borderColor: computedSurf.accentHex }
                              : undefined
                          }
                        >
                          {mode.id === 'auto' && (
                            <>
                              <div className="w-1/2 h-full bg-[#EFECE6] p-1.5 flex flex-col justify-between">
                                <div className="w-full h-2.5 rounded-xs bg-pink-400/80" />
                                <div className="w-3/4 h-3 rounded-xs bg-white" />
                              </div>
                              <div className="w-1/2 h-full bg-[#181920] p-1.5 flex flex-col justify-between">
                                <div className="w-full h-2.5 rounded-xs bg-indigo-400/80" />
                                <div className="w-3/4 h-3 rounded-xs bg-slate-800" />
                              </div>
                            </>
                          )}
                          {mode.id === 'light' && (
                            <div className="w-full h-full bg-[#EFECE6] p-2 flex flex-col justify-between">
                              <div
                                className="w-2/3 h-2.5 rounded-xs"
                                style={{ background: computedSurf.accentHex }}
                              />
                              <div className="w-full h-4 rounded-xs bg-white shadow-2xs" />
                            </div>
                          )}
                          {mode.id === 'dark' && (
                            <div className="w-full h-full bg-[#181920] p-2 flex flex-col justify-between">
                              <div
                                className="w-2/3 h-2.5 rounded-xs"
                                style={{ background: computedSurf.accentHex }}
                              />
                              <div className="w-full h-4 rounded-xs bg-slate-800" />
                            </div>
                          )}
                        </div>
                        <span
                          className={`text-xs ${
                            selected ? 'font-semibold' : 'opacity-75'
                          }`}
                        >
                          {mode.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 2: Theme (Color, Text Highlight Color, Icon & Widget Style, Elevation) */}
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-slate-400 px-1">
                  Theme &amp; Depth Tokens
                </div>
                <div className="bg-white/80 dark:bg-slate-950/70 border border-stone-200/70 dark:border-slate-800 rounded-2xl divide-y divide-stone-200/70 dark:divide-slate-800">
                  {/* Color Swatches + Custom Hex Input */}
                  <div className="p-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-medium">
                        Global Accent Color
                      </div>
                      <div className="text-[11px] text-stone-500 dark:text-slate-400">
                        Active:{' '}
                        {accentColorId === 'custom'
                          ? `Custom (${normalizeHexColor(customAccentHex)})`
                          : selectedAccentObj.label}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {ACCENT_COLORS.map((acc) => {
                        const active = accentColorId === acc.id;
                        return (
                          <button
                            key={acc.id}
                            type="button"
                            onClick={() => onChangeAccentColorId(acc.id)}
                            aria-label={`Select ${acc.label} Accent`}
                            title={acc.label}
                            className={`w-6 h-6 rounded-full ${
                              active
                                ? 'ring-2 ring-offset-2 ring-stone-900 dark:ring-white'
                                : 'opacity-85'
                            }`}
                            style={{
                              background:
                                acc.id === 'auto'
                                  ? 'conic-gradient(#FF2D55, #FF9500, #FFCC00, #34C759, #007AFF, #AF52DE, #FF2D55)'
                                  : acc.hex,
                            }}
                          />
                        );
                      })}
                      {/* Custom Hex Color Picker & Input */}
                      <div className="flex items-center gap-1.5 pl-2 border-l border-stone-200 dark:border-slate-800">
                        <input
                          type="color"
                          aria-label="Custom Accent Color Picker"
                          value={normalizeHexColor(customAccentHex)}
                          onChange={(e) =>
                            onChangeCustomAccentHex(e.target.value)
                          }
                          className={`w-6 h-6 rounded-md cursor-pointer border-0 bg-transparent p-0 ${
                            accentColorId === 'custom'
                              ? 'ring-2 ring-offset-2 ring-stone-900 dark:ring-white'
                              : ''
                          }`}
                          title="Choose custom accent hex color"
                        />
                        <input
                          type="text"
                          aria-label="Custom Accent Hex Input"
                          value={customAccentHex}
                          onChange={(e) =>
                            onChangeCustomAccentHex(e.target.value)
                          }
                          placeholder="#FF5A79"
                          maxLength={7}
                          className="w-20 bg-stone-100 dark:bg-slate-900 border border-stone-300 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-mono text-stone-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Text Highlight Color */}
                  <div className="p-4 flex items-center justify-between gap-3">
                    <span className="text-xs font-medium">
                      Text highlight color
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full"
                        style={{
                          background:
                            ACCENT_COLORS.find(
                              (a) => a.id === highlightColorId
                            )?.hex || computedSurf.accentHex,
                        }}
                      />
                      <select
                        aria-label="Text Highlight Color"
                        value={highlightColorId}
                        onChange={(e) =>
                          setHighlightColorId(e.target.value as AccentColorId)
                        }
                        className="bg-stone-100 dark:bg-slate-900 border border-stone-300/80 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-medium"
                      >
                        {ACCENT_COLORS.map((acc) => (
                          <option key={acc.id} value={acc.id}>
                            {acc.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Icon & Widget Style */}
                  <div className="p-4 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-medium">
                        Icon &amp; widget style
                      </div>
                      <div className="text-[11px] text-stone-500 dark:text-slate-400">
                        Surface material for all 10 desktop widgets
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      {(
                        [
                          { id: 'default', label: 'Default' },
                          { id: 'dark', label: 'Dark' },
                          { id: 'clear', label: 'Clear' },
                          { id: 'tinted', label: 'Tinted' },
                          { id: 'solid', label: 'Solid' },
                        ] as { id: WidgetSurfaceStyle; label: string }[]
                      ).map((st) => {
                        const active = widgetStyle === st.id;
                        return (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() => onChangeWidgetStyle(st.id)}
                            className="flex flex-col items-center gap-1"
                          >
                            <div
                              className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center ${
                                active
                                  ? 'shadow-sm'
                                  : 'border-stone-300/80 dark:border-slate-700 opacity-85'
                              }`}
                              style={{
                                borderColor: active
                                  ? computedSurf.accentHex
                                  : undefined,
                                background:
                                  st.id === 'dark'
                                    ? '#1F2028'
                                    : st.id === 'clear'
                                      ? 'rgba(255,255,255,0.45)'
                                      : st.id === 'tinted'
                                        ? computedSurf.accentHex
                                        : st.id === 'solid'
                                          ? '#EAE8E3'
                                          : '#E8F0FA',
                                color:
                                  st.id === 'tinted' || st.id === 'dark'
                                    ? '#FFFFFF'
                                    : '#007AFF',
                              }}
                            >
                              <CloudSun className="w-5 h-5" />
                            </div>
                            <span
                              className={`text-[11px] ${
                                active ? 'font-semibold' : 'opacity-75'
                              }`}
                            >
                              {st.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Shared Elevation Tokens (Levels 0 to 3) */}
                  <div className="p-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 opacity-70" />
                      <div>
                        <div className="text-xs font-medium">
                          Card Elevation &amp; Depth Token
                        </div>
                        <div className="text-[11px] text-stone-500 dark:text-slate-400">
                          macOS ambient shadow hierarchy (0 = Flat, 2 = Default)
                        </div>
                      </div>
                    </div>
                    <select
                      aria-label="Global Elevation Level"
                      value={globalElevation}
                      onChange={(e) =>
                        onChangeGlobalElevation(
                          Number(e.target.value) as ElevationLevel
                        )
                      }
                      className="bg-stone-100 dark:bg-slate-900 border border-stone-300/80 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-medium"
                    >
                      {ELEVATION_LEVELS.map((el) => (
                        <option key={el.level} value={el.level}>
                          {el.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Global Per-Widget Custom Image Background Studio */}
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-slate-400 px-1 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>
                    Per-Widget Custom Image Background (WidgetBackground.qml)
                  </span>
                </div>
                <div
                  data-testid="custom-bg-studio"
                  className="bg-white/80 dark:bg-slate-950/70 border border-stone-200/70 dark:border-slate-800 rounded-2xl p-4 space-y-4 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <label className="flex items-center gap-2 font-medium">
                      <span>Target Widget:</span>
                      <select
                        aria-label="Select Widget for Custom Background"
                        value={selectedBgWidgetId}
                        onChange={(e) => {
                          setSelectedBgWidgetId(e.target.value as WidgetId);
                          setBgFormatError('');
                        }}
                        className="bg-stone-100 dark:bg-slate-900 border border-stone-300/80 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-semibold"
                      >
                        {widgets.map((w) => (
                          <option key={w.id} value={w.id}>
                            {w.title}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          aria-label="Enable Custom Widget Background"
                          checked={activeBgConfig.enabled}
                          onChange={(e) =>
                            updateSelectedBgField('enabled', e.target.checked)
                          }
                          className="w-4 h-4 rounded"
                        />
                        <span className="font-medium">Enable Image</span>
                      </label>

                      {activeBgConfig.enabled && (
                        <button
                          type="button"
                          onClick={() =>
                            onResetWidgetBackground(selectedBgWidgetId)
                          }
                          className="px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-300 font-medium text-[11px]"
                        >
                          Remove Image
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Built-in Sample Backgrounds (JPG & SVG) + Local File Upload */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] opacity-75">
                        Select Built-in Sample or Upload Local File (.svg, .jpg,
                        .jpeg, .png, .webp):
                      </span>
                      <label className="px-2.5 py-1 rounded-lg bg-stone-200 dark:bg-slate-800 font-medium text-[11px] cursor-pointer">
                        <span>Choose Image File…</span>
                        <input
                          type="file"
                          accept=".svg,.jpg,.jpeg,.png,.webp"
                          onChange={handleLocalBgFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {BUILT_IN_BACKGROUND_IMAGES.map((sample) => {
                        const isSelected =
                          activeBgConfig.enabled &&
                          activeBgConfig.imageUrl === sample.url;
                        return (
                          <button
                            key={sample.id}
                            type="button"
                            data-testid={`bg-sample-${sample.id}`}
                            onClick={() => {
                              setBgFormatError('');
                              onUpdateWidgetBackground(selectedBgWidgetId, {
                                ...activeBgConfig,
                                enabled: true,
                                imageUrl: sample.url,
                                textContrastOverride: sample.recommendedText,
                              });
                            }}
                            className={`p-2 rounded-xl border text-left transition-colors ${
                              isSelected
                                ? 'border-stone-900 dark:border-sky-400 bg-stone-100 dark:bg-slate-800 font-semibold'
                                : 'border-stone-200 dark:border-slate-800'
                            }`}
                          >
                            <div className="text-[11px] truncate">
                              {sample.label}
                            </div>
                            <div className="text-[10px] opacity-60">
                              Format: {sample.format}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {bgFormatError && (
                      <p
                        data-testid="bg-format-error"
                        className="text-xs text-rose-500 font-medium"
                      >
                        {bgFormatError}
                      </p>
                    )}
                  </div>

                  {/* Fit Mode, Position, Readability Overlay, Opacity, Text Contrast */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                    <label className="space-y-1">
                      <span className="opacity-75 block text-[11px]">
                        Fit Mode
                      </span>
                      <select
                        aria-label="Background Fit Mode"
                        value={activeBgConfig.fitMode}
                        onChange={(e) =>
                          updateSelectedBgField(
                            'fitMode',
                            e.target.value as WidgetImageFit
                          )
                        }
                        className="w-full bg-stone-100 dark:bg-slate-900 border border-stone-300/70 dark:border-slate-800 rounded-lg px-2 py-1 text-xs"
                      >
                        <option value="cover">Cover (Crop)</option>
                        <option value="contain">Contain (Fit)</option>
                        <option value="stretch">Stretch</option>
                        <option value="center">Center</option>
                      </select>
                    </label>

                    <label className="space-y-1">
                      <span className="opacity-75 block text-[11px]">
                        Alignment
                      </span>
                      <select
                        aria-label="Background Position"
                        value={activeBgConfig.position}
                        onChange={(e) =>
                          updateSelectedBgField(
                            'position',
                            e.target.value as WidgetImagePosition
                          )
                        }
                        className="w-full bg-stone-100 dark:bg-slate-900 border border-stone-300/70 dark:border-slate-800 rounded-lg px-2 py-1 text-xs"
                      >
                        <option value="center">Center</option>
                        <option value="top">Top</option>
                        <option value="bottom">Bottom</option>
                        <option value="left">Left</option>
                        <option value="right">Right</option>
                      </select>
                    </label>

                    <label className="space-y-1">
                      <span className="opacity-75 block text-[11px]">
                        Scrim Mode
                      </span>
                      <select
                        aria-label="Readability Scrim Mode"
                        value={activeBgConfig.overlayMode}
                        onChange={(e) =>
                          updateSelectedBgField(
                            'overlayMode',
                            e.target.value as WidgetOverlayMode
                          )
                        }
                        className="w-full bg-stone-100 dark:bg-slate-900 border border-stone-300/70 dark:border-slate-800 rounded-lg px-2 py-1 text-xs"
                      >
                        <option value="auto">Auto</option>
                        <option value="dark">Dark Scrim</option>
                        <option value="light">Light Scrim</option>
                      </select>
                    </label>

                    <label className="space-y-1">
                      <span className="opacity-75 block text-[11px]">
                        Text Contrast
                      </span>
                      <select
                        aria-label="Text Contrast Override"
                        value={activeBgConfig.textContrastOverride}
                        onChange={(e) =>
                          updateSelectedBgField(
                            'textContrastOverride',
                            e.target.value as WidgetTextContrastOverride
                          )
                        }
                        className="w-full bg-stone-100 dark:bg-slate-900 border border-stone-300/70 dark:border-slate-800 rounded-lg px-2 py-1 text-xs"
                      >
                        <option value="auto">Auto</option>
                        <option value="light">Light Text</option>
                        <option value="dark">Dark Text</option>
                      </select>
                    </label>
                  </div>

                  <label className="space-y-1 block">
                    <div className="flex justify-between text-[11px]">
                      <span className="opacity-75">
                        Readability Scrim Opacity
                      </span>
                      <span className="font-mono tabular-nums">
                        {Math.round(activeBgConfig.overlayOpacity * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      aria-label="Readability Scrim Opacity"
                      min={0}
                      max={0.85}
                      step={0.05}
                      value={activeBgConfig.overlayOpacity}
                      onChange={(e) =>
                        updateSelectedBgField(
                          'overlayOpacity',
                          Number(e.target.value)
                        )
                      }
                      className="w-full"
                    />
                  </label>
                </div>
              </div>

              {/* Section 4: Gradient Studio */}
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-slate-400 px-1">
                  Gradient &amp; Atmosphere
                </div>
                <div className="bg-white/80 dark:bg-slate-950/70 border border-stone-200/70 dark:border-slate-800 rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">
                      Enable Subtle Surface Gradient
                    </span>
                    <input
                      type="checkbox"
                      aria-label="Enable Surface Gradient"
                      checked={activeTheme.gradient.enabled}
                      onChange={(e) =>
                        handleFieldChange(
                          'gradient',
                          'enabled',
                          e.target.checked
                        )
                      }
                      className="w-4 h-4 rounded"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {GRADIENT_PRESETS.map((gp) => (
                      <button
                        key={gp.id}
                        type="button"
                        onClick={() => handleApplyGradientPreset(gp.id)}
                        className="p-2 rounded-xl border border-stone-200 dark:border-slate-800 text-left flex items-center gap-2"
                      >
                        <span
                          className="w-5 h-5 rounded-full shrink-0 border border-black/10"
                          style={{
                            background: `linear-gradient(${gp.angle}deg, ${gp.start}, ${gp.end})`,
                          }}
                        />
                        <span className="text-[11px] font-medium truncate">
                          {gp.name}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <label className="space-y-1 block text-xs">
                      <span className="opacity-75">Start Color</span>
                      <div className="flex items-center gap-2 bg-stone-100 dark:bg-slate-900 rounded-xl px-2.5 py-1.5">
                        <input
                          type="color"
                          aria-label="Gradient Start Color"
                          value={activeTheme.gradient.start}
                          onChange={(e) =>
                            handleFieldChange(
                              'gradient',
                              'start',
                              e.target.value
                            )
                          }
                          className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                        />
                        <span className="font-mono text-[11px]">
                          {activeTheme.gradient.start}
                        </span>
                      </div>
                    </label>

                    <label className="space-y-1 block text-xs">
                      <span className="opacity-75">End Color</span>
                      <div className="flex items-center gap-2 bg-stone-100 dark:bg-slate-900 rounded-xl px-2.5 py-1.5">
                        <input
                          type="color"
                          aria-label="Gradient End Color"
                          value={activeTheme.gradient.end}
                          onChange={(e) =>
                            handleFieldChange('gradient', 'end', e.target.value)
                          }
                          className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                        />
                        <span className="font-mono text-[11px]">
                          {activeTheme.gradient.end}
                        </span>
                      </div>
                    </label>

                    <label className="space-y-1 block text-xs">
                      <div className="flex justify-between opacity-75">
                        <span>Direction</span>
                        <span className="font-mono tabular-nums">
                          {activeTheme.gradient.angle}°
                        </span>
                      </div>
                      <input
                        type="range"
                        aria-label="Gradient Direction Angle"
                        min={0}
                        max={360}
                        value={activeTheme.gradient.angle}
                        onChange={(e) =>
                          handleFieldChange(
                            'gradient',
                            'angle',
                            Number(e.target.value)
                          )
                        }
                        className="w-full"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Section 5: Typography & Widget Appearance Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/80 dark:bg-slate-950/70 border border-stone-200/70 dark:border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    <Type className="w-3.5 h-3.5" />
                    <span>Installed System Typography</span>
                  </div>
                  <select
                    aria-label="Select Installed System Font"
                    value={systemFontId}
                    onChange={(e) => onChangeSystemFontId(e.target.value)}
                    className="w-full bg-stone-100 dark:bg-slate-900 border border-stone-300/70 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-medium"
                  >
                    {SYSTEM_FONT_OPTIONS.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-stone-500 dark:text-slate-400 leading-relaxed">
                    Resolved natively via{' '}
                    <code className="font-mono">fc-list</code> and{' '}
                    <code className="font-mono">Qt.fontFamilies()</code> without
                    bundling or downloading external fonts.
                  </p>
                </div>

                <div className="bg-white/80 dark:bg-slate-950/70 border border-stone-200/70 dark:border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Widget Surface Geometry</span>
                  </div>

                  <label className="space-y-1 block text-xs">
                    <div className="flex justify-between">
                      <span>Corner Radius</span>
                      <span className="font-mono tabular-nums">
                        {activeTheme.appearance.radius}px
                      </span>
                    </div>
                    <input
                      type="range"
                      aria-label="Corner Radius"
                      min={16}
                      max={32}
                      step={2}
                      value={activeTheme.appearance.radius}
                      onChange={(e) =>
                        handleFieldChange(
                          'appearance',
                          'radius',
                          Number(e.target.value)
                        )
                      }
                      className="w-full"
                    />
                  </label>

                  <label className="space-y-1 block text-xs">
                    <div className="flex justify-between">
                      <span>Surface Opacity</span>
                      <span className="font-mono tabular-nums">
                        {Math.round(activeTheme.appearance.opacity * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      aria-label="Surface Opacity"
                      min={0.45}
                      max={1.0}
                      step={0.02}
                      value={activeTheme.appearance.opacity}
                      onChange={(e) =>
                        handleFieldChange(
                          'appearance',
                          'opacity',
                          Number(e.target.value)
                        )
                      }
                      className="w-full"
                    />
                  </label>
                </div>
              </div>

              {/* Section 6: Liquid Glass Material System, Performance Profiles & KWin Compositor Studio */}
              <div
                data-testid="liquid-glass-studio"
                className="space-y-3 pt-2 border-t border-stone-200/80 dark:border-slate-800"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-slate-300">
                      Liquid Glass Material System &amp; Performance Profiles
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-slate-400">
                      Centralized 4-layer glass tokens (Primary, Secondary,
                      Floating, Interactive) with KDE Plasma 5 compositor safety
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold">
                    Active Profile: {kwinCompositorConfig.performanceProfile.toUpperCase()}
                  </span>
                </div>

                {/* 3 Performance Profiles (Default = Balanced Mode) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {(
                    [
                      {
                        id: 'performance',
                        title: 'Performance Mode',
                        badge: 'Zero Blur · Lowest CPU',
                        desc: 'Simple translucent surfaces, zero backdrop blur, single-pass flat shadow, zero shader overhead.',
                      },
                      {
                        id: 'balanced',
                        title: 'Balanced Mode',
                        badge: 'Default · Recommended',
                        desc: 'Moderate 18px blur, fine top specular highlight, 17-sample shadow, smooth transitions.',
                      },
                      {
                        id: 'enhanced',
                        title: 'Enhanced Glass',
                        badge: 'Deep Layering',
                        desc: 'Multi-layer glass depth, stronger edge reflection & KWin compositor contrast.',
                      },
                    ] as {
                      id: GlassPerformanceProfile;
                      title: string;
                      badge: string;
                      desc: string;
                    }[]
                  ).map((prof) => {
                    const active =
                      kwinCompositorConfig.performanceProfile === prof.id;
                    return (
                      <button
                        key={prof.id}
                        type="button"
                        data-testid={`glass-profile-${prof.id}`}
                        onClick={() =>
                          updateCompositorField('performanceProfile', prof.id)
                        }
                        className={`p-3 rounded-2xl border text-left transition-colors flex flex-col justify-between gap-1.5 ${
                          active
                            ? 'bg-white dark:bg-slate-800 border-stone-900 dark:border-white shadow-xs'
                            : 'bg-white/60 dark:bg-slate-950/60 border-stone-200/80 dark:border-slate-800 opacity-85 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-semibold">
                            {prof.title}
                          </span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-stone-200/80 dark:bg-slate-700">
                            {prof.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-500 dark:text-slate-400 leading-snug">
                          {prof.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* KWin Compositor Parameters & Graceful Fallback Selector */}
                <div className="bg-white/80 dark:bg-slate-950/70 border border-stone-200/70 dark:border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="space-y-1 block">
                      <span className="opacity-75 text-[11px] font-medium block">
                        Graceful Fallback Surface (when KWin Blur disabled)
                      </span>
                      <select
                        aria-label="Liquid Glass Fallback Mode"
                        value={kwinCompositorConfig.fallbackMode}
                        onChange={(e) =>
                          updateCompositorField(
                            'fallbackMode',
                            e.target.value as GlassFallbackMode
                          )
                        }
                        className="w-full bg-stone-100 dark:bg-slate-900 border border-stone-300/70 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-medium"
                      >
                        <option value="full-glass">
                          Full Glass (KWin Compositor Active)
                        </option>
                        <option value="soft-glass">
                          Soft Glass (No Blur · High-Readability Translucent)
                        </option>
                        <option value="solid-surface">
                          Solid Surface (Compositor Off Fallback)
                        </option>
                      </select>
                    </label>

                    <div className="flex items-center justify-between bg-stone-100/80 dark:bg-slate-900/80 rounded-xl px-3 py-2">
                      <div>
                        <div className="font-semibold text-[11px]">
                          Specular Edge Highlight
                        </div>
                        <div className="text-[10px] text-stone-500 dark:text-slate-400">
                          Fine top inner reflection rim
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        aria-label="Enable Specular Highlight"
                        checked={kwinCompositorConfig.specularHighlight}
                        onChange={(e) =>
                          updateCompositorField(
                            'specularHighlight',
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 rounded"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                    <label className="space-y-1 block">
                      <div className="flex justify-between text-[11px]">
                        <span className="opacity-75">Blur Radius</span>
                        <span className="font-mono">
                          {kwinCompositorConfig.blurRadius}px
                        </span>
                      </div>
                      <input
                        type="range"
                        aria-label="KWin Blur Radius"
                        min={0}
                        max={32}
                        value={kwinCompositorConfig.blurRadius}
                        onChange={(e) =>
                          updateCompositorField(
                            'blurRadius',
                            Number(e.target.value)
                          )
                        }
                        className="w-full"
                      />
                    </label>

                    <label className="space-y-1 block">
                      <div className="flex justify-between text-[11px]">
                        <span className="opacity-75">Contrast</span>
                        <span className="font-mono">
                          {kwinCompositorConfig.backgroundContrast}%
                        </span>
                      </div>
                      <input
                        type="range"
                        aria-label="Background Contrast"
                        min={85}
                        max={125}
                        value={kwinCompositorConfig.backgroundContrast}
                        onChange={(e) =>
                          updateCompositorField(
                            'backgroundContrast',
                            Number(e.target.value)
                          )
                        }
                        className="w-full"
                      />
                    </label>

                    <label className="space-y-1 block">
                      <div className="flex justify-between text-[11px]">
                        <span className="opacity-75">Glass Opacity</span>
                        <span className="font-mono">
                          {Math.round(kwinCompositorConfig.glassOpacity * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        aria-label="Liquid Glass Opacity"
                        min={0.4}
                        max={0.95}
                        step={0.02}
                        value={kwinCompositorConfig.glassOpacity}
                        onChange={(e) =>
                          updateCompositorField(
                            'glassOpacity',
                            Number(e.target.value)
                          )
                        }
                        className="w-full"
                      />
                    </label>

                    <label className="space-y-1 block">
                      <div className="flex justify-between text-[11px]">
                        <span className="opacity-75">Border Rim</span>
                        <span className="font-mono">
                          {Math.round(
                            kwinCompositorConfig.borderIntensity * 100
                          )}
                          %
                        </span>
                      </div>
                      <input
                        type="range"
                        aria-label="Glass Border Intensity"
                        min={0.15}
                        max={0.85}
                        step={0.05}
                        value={kwinCompositorConfig.borderIntensity}
                        onChange={(e) =>
                          updateCompositorField(
                            'borderIntensity',
                            Number(e.target.value)
                          )
                        }
                        className="w-full"
                      />
                    </label>
                  </div>

                  {/* Centralized Design Tokens Live Inspector */}
                  <div className="pt-2 border-t border-stone-200/70 dark:border-slate-800 space-y-1.5">
                    <div className="text-[10px] font-semibold uppercase tracking-wider opacity-70">
                      Centralized Liquid Glass Tokens (Rust + QML + Web Synced)
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 font-mono text-[10px]">
                      <div className="p-1.5 rounded bg-stone-100 dark:bg-slate-900 truncate">
                        <span className="opacity-60 block text-[9px]">
                          glassBlur
                        </span>
                        {computedSurf.glassTokens.glassBlur}px
                      </div>
                      <div className="p-1.5 rounded bg-stone-100 dark:bg-slate-900 truncate">
                        <span className="opacity-60 block text-[9px]">
                          glassOpacity
                        </span>
                        {Math.round(
                          computedSurf.glassTokens.glassOpacity * 100
                        )}
                        %
                      </div>
                      <div className="p-1.5 rounded bg-stone-100 dark:bg-slate-900 truncate">
                        <span className="opacity-60 block text-[9px]">
                          glassTextPrimary
                        </span>
                        {computedSurf.glassTokens.glassTextPrimary}
                      </div>
                      <div className="p-1.5 rounded bg-stone-100 dark:bg-slate-900 truncate">
                        <span className="opacity-60 block text-[9px]">
                          glassAccent
                        </span>
                        {computedSurf.glassTokens.glassAccent}
                      </div>
                    </div>
                  </div>
                </div>

                {/* KDE Plasma 5 Optional Integration Evaluation Matrix */}
                <div className="bg-white/80 dark:bg-slate-950/70 border border-stone-200/70 dark:border-slate-800 rounded-2xl p-4 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[11px]">
                      KDE Plasma 5 Ecosystem Evaluation (Kvantum · Lightly ·
                      Shaders · KWin)
                    </span>
                    <span className="text-[10px] font-mono opacity-65">
                      Zero Mandatory External Dependencies
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {KDE_PLASMA5_INTEGRATION_MATRIX.map((item) => (
                      <div
                        key={item.id}
                        className="p-2 rounded-xl bg-stone-100/80 dark:bg-slate-900/80 flex flex-col gap-0.5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <span className="font-semibold text-[11px]">
                            {item.name}{' '}
                            <code className="font-mono text-[10px] opacity-70">
                              ({item.packageOrRepo})
                            </code>
                          </span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-stone-200 dark:bg-slate-800">
                            {item.plasma5Compatibility} · Overhead:{' '}
                            {item.cpuGpuImpact}
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-600 dark:text-slate-400 leading-snug">
                          {item.evaluationSummary}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Live WidgetWall Surface Preview + Saved Theme Profiles */}
            <div className="lg:col-span-5 space-y-5">
              {/* Live Preview Card */}
              <div className="bg-white dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 rounded-[24px] p-5 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-stone-900 dark:text-white">
                    Live WidgetWall Surface Preview
                  </h3>
                  <button
                    type="button"
                    onClick={handleCopyThemeJson}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-stone-100 dark:bg-slate-800 text-stone-800 dark:text-slate-200 flex items-center gap-1.5"
                  >
                    {copiedExport ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        Copied JSON
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Export JSON
                      </>
                    )}
                  </button>
                </div>

                <div
                  className="p-6 rounded-2xl"
                  style={{
                    background:
                      appearanceMode === 'dark'
                        ? 'radial-gradient(circle at 20% 20%, #2B2D42, #12131A)'
                        : 'radial-gradient(circle at 20% 20%, #EFEBE4, #D6CCC0)',
                  }}
                >
                  <div
                    className="p-6 relative overflow-hidden"
                    style={{
                      background: computedSurf.background,
                      color: computedSurf.textColor,
                      borderRadius: `${activeTheme.appearance.radius}px`,
                      border: `1px solid ${computedSurf.borderColor}`,
                      boxShadow: computedSurf.shadowCss,
                    }}
                  >
                    {activeBgConfig.enabled && activeBgConfig.imageUrl && (
                      <div className="absolute inset-0 pointer-events-none">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={activeBgConfig.imageUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              activeBgConfig.overlayMode === 'dark'
                                ? '#0D0E12'
                                : '#F6F4EF',
                            opacity: activeBgConfig.overlayOpacity,
                          }}
                        />
                      </div>
                    )}
                    <div className="relative z-10">
                      <div className="flex items-start gap-2">
                        <span className="text-5xl font-light tracking-tight tabular-nums">
                          4:56
                        </span>
                        <span className="text-lg font-normal mt-1.5">PM</span>
                      </div>
                      <div className="text-xs mt-2 flex items-center gap-1.5">
                        <span style={{ color: computedSurf.mutedTextColor }}>
                          Sun, Nov 8,
                        </span>
                        <span className="font-semibold">Vernon</span>
                      </div>
                      <div className="mt-4 pt-3 border-t border-current/10 flex items-center justify-between text-[11px]">
                        <span style={{ color: computedSurf.mutedTextColor }}>
                          Style: {widgetStyle} · Depth: L{globalElevation}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded-full text-white font-semibold text-[10px]"
                          style={{ background: computedSurf.accentHex }}
                        >
                          {selectedAccentObj.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Saved Atmosphere Presets */}
              <div className="bg-white dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 rounded-[24px] p-5 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-stone-900 dark:text-white">
                    Atmosphere Presets ({themes.length})
                  </h3>
                  <span className="text-xs text-stone-500">
                    Click to apply preset
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {themes.map((t) => {
                    const selected = t.id === activeThemeId;
                    return (
                      <div
                        key={t.id}
                        className={`p-3 rounded-2xl border flex flex-col justify-between ${
                          selected
                            ? 'bg-stone-100 dark:bg-slate-800 border-stone-900 dark:border-sky-400'
                            : 'bg-stone-50/70 dark:bg-slate-950/60 border-stone-200 dark:border-slate-800'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => onSelectTheme(t.id)}
                          className="text-left w-full"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-stone-900 dark:text-white truncate">
                              {t.name}
                            </span>
                            <div className="flex items-center gap-1 shrink-0">
                              <span
                                className="w-3 h-3 rounded-full border border-black/15"
                                style={{ background: t.appearance.surface }}
                              />
                              <span
                                className="w-3 h-3 rounded-full border border-black/15"
                                style={{ background: t.appearance.accent }}
                              />
                            </div>
                          </div>
                          <p className="text-[11px] text-stone-500 dark:text-slate-400 mt-1 line-clamp-2">
                            {t.description}
                          </p>
                        </button>

                        {!t.isPreset && (
                          <div className="mt-2 pt-2 border-t border-stone-200 dark:border-slate-800 flex justify-end">
                            <button
                              type="button"
                              onClick={() => onDeleteCustomTheme(t.id)}
                              className="text-[11px] text-rose-500 flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <form
                  onSubmit={handleSaveNewTheme}
                  className="pt-3 border-t border-stone-200 dark:border-slate-800 flex items-center gap-2"
                >
                  <input
                    type="text"
                    aria-label="New Custom Theme Name"
                    placeholder="Save current look as new preset..."
                    value={customThemeName}
                    onChange={(e) => setCustomThemeName(e.target.value)}
                    className="flex-1 bg-stone-100 dark:bg-slate-950 border border-stone-300/80 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 whitespace-nowrap shrink-0"
                    style={{ background: computedSurf.accentHex }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Save Preset
                  </button>
                </form>

                <form
                  onSubmit={handleImportSubmit}
                  className="pt-3 border-t border-stone-200 dark:border-slate-800 space-y-2"
                >
                  <div className="flex gap-2">
                    <input
                      type="text"
                      aria-label="Theme Configuration JSON Input"
                      placeholder='Import {"name":"My Theme",...}'
                      value={importJsonText}
                      onChange={(e) => setImportJsonText(e.target.value)}
                      className="flex-1 bg-stone-100 dark:bg-slate-950 border border-stone-300/80 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono text-stone-900 dark:text-slate-200"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-stone-200 dark:bg-slate-800 text-xs font-medium text-stone-900 dark:text-white rounded-xl flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Import
                    </button>
                  </div>
                  {importFeedback && (
                    <p className="text-xs text-sky-600 dark:text-sky-400">
                      {importFeedback}
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>

          {/* Developer & Author Information in Appearance Preferences (Requirement G) */}
          <div
            data-testid="appearance-developer-attribution"
            className="bg-white/85 dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4 text-xs text-stone-600 dark:text-slate-300 shadow-2xs"
          >
            <div className="space-y-2.5">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 dark:text-slate-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>Author</span>
                </div>
                <div className="text-sm font-semibold text-stone-900 dark:text-white mt-0.5">
                  {DEVELOPER_ATTRIBUTION.author}
                </div>
              </div>

              <div>
                <div className="text-[11px] font-medium text-stone-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Portfolio</span>
                </div>
                <a
                  href={DEVELOPER_ATTRIBUTION.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-stone-900 dark:text-sky-400 hover:underline mt-0.5"
                >
                  <span>{DEVELOPER_ATTRIBUTION.portfolioLabel} ↗</span>
                </a>
              </div>

              <div>
                <div className="text-[11px] font-medium text-stone-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Instagram</span>
                </div>
                <a
                  href={DEVELOPER_ATTRIBUTION.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-stone-900 dark:text-pink-400 hover:underline mt-0.5"
                >
                  <span>{DEVELOPER_ATTRIBUTION.instagramLabel} ↗</span>
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:items-end justify-between gap-1 text-[11px] text-stone-500 dark:text-slate-400">
              <span>{DEVELOPER_ATTRIBUTION.appearanceText}</span>
              <a
                href={DEVELOPER_ATTRIBUTION.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-stone-700 dark:text-slate-300 hover:underline"
              >
                <span>GitHub ↗</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WIDGET MANAGER & POMODORO SETTINGS */}
      {subTab === 'widgets' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
            <div className="px-5 py-4 border-b border-stone-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-stone-900 dark:text-white">
                  WidgetWall Grid &amp; Individual KDE Plasma 5 Plasmoids (All
                  10 Widgets)
                </h3>
                <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
                  Configure visibility, widget proportions, and elevation levels.
                  Theme &amp; Style (Appearance Mode, Surface Style, Accent
                  Color, Atmosphere Preset) are synchronized globally across all
                  widgets.
                </p>
              </div>
              <div className="text-[11px] px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-300 font-medium">
                Global Style: {appearanceMode.toUpperCase()} ·{' '}
                {widgetStyle.toUpperCase()} · {activeTheme.name}
              </div>
            </div>

            <div className="divide-y divide-stone-200 dark:divide-slate-800">
              {widgets.map((w) => (
                <div
                  key={w.id}
                  className="px-5 py-3.5 flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="min-w-[210px]">
                    <div className="text-sm font-semibold text-stone-900 dark:text-white flex items-center gap-2">
                      <span>{w.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 dark:bg-slate-800 text-stone-500">
                        {w.configId}
                      </span>
                    </div>
                    <div className="text-xs text-stone-500 dark:text-slate-400">
                      {w.subtitle}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <label className="flex items-center gap-1 text-xs text-stone-600 dark:text-slate-300">
                      <span>Size:</span>
                      <select
                        aria-label={`${w.title} Size`}
                        value={w.size}
                        onChange={(e) =>
                          onResizeWidget(w.id, e.target.value as WidgetSize)
                        }
                        className="bg-stone-100 dark:bg-slate-950 border border-stone-300 dark:border-slate-800 rounded-lg px-2 py-1 text-xs text-stone-900 dark:text-white"
                      >
                        <option value="compact">Small</option>
                        <option value="medium">Medium</option>
                        <option value="wide">Wide</option>
                        <option value="large">Large</option>
                      </select>
                    </label>

                    <label className="flex items-center gap-1 text-xs text-stone-600 dark:text-slate-300">
                      <span>Depth:</span>
                      <select
                        aria-label={`${w.title} Elevation`}
                        value={
                          w.elevationOverride === null ||
                          w.elevationOverride === undefined
                            ? ''
                            : String(w.elevationOverride)
                        }
                        onChange={(e) =>
                          onSetWidgetElevationOverride(
                            w.id,
                            e.target.value === ''
                              ? null
                              : (Number(e.target.value) as ElevationLevel)
                          )
                        }
                        className="bg-stone-100 dark:bg-slate-950 border border-stone-300 dark:border-slate-800 rounded-lg px-2 py-1 text-xs text-stone-900 dark:text-white"
                      >
                        <option value="">Global (L{globalElevation})</option>
                        <option value="0">Level 0 (Flat)</option>
                        <option value="1">Level 1 (Ambient)</option>
                        <option value="2">Level 2 (Floating)</option>
                        <option value="3">Level 3 (Modal)</option>
                      </select>
                    </label>

                    <label className="flex items-center gap-1 text-xs text-stone-600 dark:text-slate-300">
                      <span>Icons:</span>
                      <select
                        aria-label={`${w.title} Icon Style`}
                        value={w.iconStyleOverride || 'filled'}
                        onChange={(e) =>
                          onUpdateWidgetPreferences(w.id, {
                            iconStyleOverride:
                              e.target.value as WidgetIconStyle,
                          })
                        }
                        className="bg-stone-100 dark:bg-slate-950 border border-stone-300 dark:border-slate-800 rounded-lg px-2 py-1 text-xs text-stone-900 dark:text-white"
                      >
                        <option value="filled">Filled</option>
                        <option value="outline">Outline</option>
                        <option value="minimal">Minimal</option>
                        <option value="tinted">Tinted</option>
                      </select>
                    </label>

                    <label className="flex items-center gap-1 text-xs text-stone-600 dark:text-slate-300">
                      <span>Gradient:</span>
                      <select
                        aria-label={`${w.title} Gradient`}
                        value={w.gradientOverride || 'inherit'}
                        onChange={(e) =>
                          onUpdateWidgetPreferences(w.id, {
                            gradientOverride: e.target.value as
                              | 'inherit'
                              | 'on'
                              | 'off',
                          })
                        }
                        className="bg-stone-100 dark:bg-slate-950 border border-stone-300 dark:border-slate-800 rounded-lg px-2 py-1 text-xs text-stone-900 dark:text-white"
                      >
                        <option value="inherit">Inherit</option>
                        <option value="on">On</option>
                        <option value="off">Off</option>
                      </select>
                    </label>

                    <label className="flex items-center gap-1 text-xs text-stone-600 dark:text-slate-300">
                      <span>Font:</span>
                      <select
                        aria-label={`${w.title} Typography`}
                        value={w.fontFamilyOverride || ''}
                        onChange={(e) =>
                          onUpdateWidgetPreferences(w.id, {
                            fontFamilyOverride: e.target.value || null,
                          })
                        }
                        className="bg-stone-100 dark:bg-slate-950 border border-stone-300 dark:border-slate-800 rounded-lg px-2 py-1 text-xs text-stone-900 dark:text-white"
                      >
                        <option value="">Global ({systemFontId})</option>
                        {SYSTEM_FONT_OPTIONS.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <button
                      type="button"
                      onClick={() => onResetSingleWidgetPreferences(w.id)}
                      className="px-2 py-1 rounded-lg text-[11px] font-medium bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-slate-300"
                      title={`Reset ${w.title} to Global Defaults`}
                    >
                      Reset
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleWidget(w.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                        w.enabled
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                          : 'bg-stone-200 dark:bg-slate-800 text-stone-500'
                      }`}
                    >
                      {w.enabled ? 'Visible' : 'Hidden'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pomodoro Custom Duration Settings */}
          <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
            <div>
              <h3 className="text-sm font-semibold text-stone-900 dark:text-white">
                Pomodoro Focus Durations
              </h3>
              <p className="text-xs text-stone-500 dark:text-slate-400">
                Persisted in SQLite <code className="font-mono">pomodoro_state</code>.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <label className="text-xs text-stone-700 dark:text-slate-300 flex items-center gap-1.5">
                <span>Focus (m):</span>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={studyInput}
                  onChange={(e) => setStudyInput(Number(e.target.value))}
                  className="w-16 bg-stone-100 dark:bg-slate-950 border border-stone-300 dark:border-slate-800 rounded-lg px-2 py-1 text-xs font-mono tabular-nums"
                />
              </label>
              <label className="text-xs text-stone-700 dark:text-slate-300 flex items-center gap-1.5">
                <span>Short Break (m):</span>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={shortInput}
                  onChange={(e) => setShortInput(Number(e.target.value))}
                  className="w-16 bg-stone-100 dark:bg-slate-950 border border-stone-300 dark:border-slate-800 rounded-lg px-2 py-1 text-xs font-mono tabular-nums"
                />
              </label>
              <label className="text-xs text-stone-700 dark:text-slate-300 flex items-center gap-1.5">
                <span>Long Break (m):</span>
                <input
                  type="number"
                  min={1}
                  max={90}
                  value={longInput}
                  onChange={(e) => setLongInput(Number(e.target.value))}
                  className="w-16 bg-stone-100 dark:bg-slate-950 border border-stone-300 dark:border-slate-800 rounded-lg px-2 py-1 text-xs font-mono tabular-nums"
                />
              </label>
              <button
                type="button"
                onClick={() =>
                  onUpdatePomodoroDurations(studyInput, shortInput, longInput)
                }
                className="px-3.5 py-1.5 text-white font-semibold text-xs rounded-xl whitespace-nowrap"
                style={{ background: computedSurf.accentHex }}
              >
                Apply Durations
              </button>
            </div>
          </div>

          {/* Author, Portfolio & Instagram Attribution in Widget Preferences (Requirement G) */}
          <div
            data-testid="widget-config-developer-attribution"
            className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4 text-xs text-stone-600 dark:text-slate-300 shadow-2xs"
          >
            <div className="space-y-2.5">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 dark:text-slate-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>Author</span>
                </div>
                <div className="text-sm font-semibold text-stone-900 dark:text-white mt-0.5">
                  {DEVELOPER_ATTRIBUTION.author}
                </div>
              </div>

              <div>
                <div className="text-[11px] font-medium text-stone-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Portfolio</span>
                </div>
                <a
                  href={DEVELOPER_ATTRIBUTION.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-stone-900 dark:text-sky-400 hover:underline mt-0.5"
                >
                  <span>{DEVELOPER_ATTRIBUTION.portfolioLabel} ↗</span>
                </a>
              </div>

              <div>
                <div className="text-[11px] font-medium text-stone-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Instagram</span>
                </div>
                <a
                  href={DEVELOPER_ATTRIBUTION.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-stone-900 dark:text-pink-400 hover:underline mt-0.5"
                >
                  <span>{DEVELOPER_ATTRIBUTION.instagramLabel} ↗</span>
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:items-end justify-between gap-1 text-[11px] text-stone-500 dark:text-slate-400">
              <span>{DEVELOPER_ATTRIBUTION.widgetConfigText}</span>
              <a
                href={DEVELOPER_ATTRIBUTION.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-stone-700 dark:text-slate-300 hover:underline"
              >
                <span>GitHub ↗</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SQLITE WAL & D-BUS IPC INSPECTOR */}
      {subTab === 'sqlite' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs">
            <h3 className="text-sm font-semibold text-stone-900 dark:text-white">
              SQLite 3 Local Persistence (~/.local/share/urwidgets/urwidgets.sqlite3)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 dark:border-slate-800 text-stone-500">
                    <th className="py-2 pr-3 font-medium">Table Name</th>
                    <th className="py-2 px-3 font-medium">Journal Mode</th>
                    <th className="py-2 pl-3 text-right font-medium">
                      Active Records
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200/70 dark:divide-slate-800/70 font-mono tabular-nums">
                  <tr>
                    <td className="py-2 pr-3 font-semibold">themes</td>
                    <td className="py-2 px-3 text-stone-500">WAL · Indexed</td>
                    <td className="py-2 pl-3 text-right">{themes.length}</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-3 font-semibold">
                      widget_instances
                    </td>
                    <td className="py-2 px-3 text-stone-500">WAL · Indexed</td>
                    <td className="py-2 pl-3 text-right">{widgets.length}</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-3 font-semibold">
                      widget_preferences
                    </td>
                    <td className="py-2 px-3 text-stone-500">
                      WAL · PRAGMA v4
                    </td>
                    <td className="py-2 pl-3 text-right">{widgets.length}</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-3 font-semibold">alarms</td>
                    <td className="py-2 px-3 text-stone-500">
                      WAL · PRAGMA v4
                    </td>
                    <td className="py-2 pl-3 text-right">{alarms.length}</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-3 font-semibold">notes</td>
                    <td className="py-2 px-3 text-stone-500">
                      WAL · PRAGMA v4
                    </td>
                    <td className="py-2 pl-3 text-right">{notes.length}</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-3 font-semibold">
                      todo_items (Archived)
                    </td>
                    <td className="py-2 px-3 text-stone-500">
                      WAL · Safe Archive
                    </td>
                    <td className="py-2 pl-3 text-right">
                      {archivedTodosCount}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-3 font-semibold">
                      widget_backgrounds
                    </td>
                    <td className="py-2 px-3 text-stone-500">
                      WAL · PRAGMA v4
                    </td>
                    <td className="py-2 pl-3 text-right">
                      {Object.keys(widgetBackgrounds).length}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-3 font-semibold">agenda_events</td>
                    <td className="py-2 px-3 text-stone-500">
                      WAL · idx_agenda_date
                    </td>
                    <td className="py-2 pl-3 text-right">
                      {agendaEvents.length}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-3 font-semibold">weather_cache</td>
                    <td className="py-2 px-3 text-stone-500">WAL · TTL 30m</td>
                    <td className="py-2 pl-3 text-right">4</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-3 font-semibold">pomodoro_state</td>
                    <td className="py-2 px-3 text-stone-500">
                      WAL · Singleton Row
                    </td>
                    <td className="py-2 pl-3 text-right">1</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-stone-900 dark:text-white flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                D-Bus Session Bus Stream (org.urwidgets.Daemon1)
              </h3>
              <span className="text-xs font-mono text-stone-500">
                zbus 4.3 · Async
              </span>
            </div>
            <div className="bg-stone-950 rounded-xl p-3.5 font-mono text-xs text-stone-300 space-y-1.5 max-h-64 overflow-y-auto">
              {ipcLog.map((entry, i) => (
                <div key={i} className="truncate">
                  {entry}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
