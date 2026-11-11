'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Sun,
  CloudSun,
  Play,
  Pause,
  Square,
  RotateCcw,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Check,
  RefreshCw,
  Sliders,
  Maximize2,
  EyeOff,
  FolderOpen,
  Terminal,
  Activity,
  Settings,
  Sparkles,
  Wifi,
  WifiOff,
  Pencil,
  X,
  Globe,
  BatteryCharging,
  SlidersHorizontal,
  Bell,
  BellRing,
  Volume2,
  VolumeX,
  Pin,
  Search,
  ExternalLink,
  FileText,
  Music,
  Shuffle,
  Repeat,
  SkipBack,
  Move,
} from 'lucide-react';
import {
  ThemeSpec,
  AppearanceMode,
  WidgetSurfaceStyle,
  AccentColorId,
  ElevationLevel,
  ELEVATION_LEVELS,
  ACCENT_COLORS,
  SYSTEM_FONT_OPTIONS,
  normalizeHexColor,
  resolveIndependentWidgetSurface,
  WidgetInstanceConfig,
  WidgetId,
  WidgetSize,
  AgendaEvent,
  TodoItem,
  computeTodoDeadlineStatus,
  computeTodoProgress,
  PomodoroState,
  PomodoroPhase,
  QuickActionShortcut,
  INITIAL_QUICK_ACTIONS,
  WEATHER_CITIES,
  formatTempDegreeOnly,
  formatClockTime,
  computeCalendarGrid,
  formatPomodoroSeconds,
  AlarmItem,
  AlarmRepeatDay,
  ALL_ALARM_DAYS,
  BUILTIN_RINGTONES,
  DueAlarmNotification,
  formatAlarmRepeat,
  computeNextAlarmSummary,
  validateAudioFormat,
  parseAlarmTimeParts,
  formatAlarmTimeParts,
  NoteItem,
  sortNotesPinnedFirst,
  filterNotesByQuery,
  MusicTrack,
  MusicPlayerState,
  INITIAL_MUSIC_PLAYER_STATE,
  LOCAL_MUSIC_FOLDERS,
  validateMusicAudioFormat,
  validateDirectAudioStreamUrl,
  formatAudioDuration,
  transitionMusicPlayer,
  WidgetBackgroundConfig,
  WidgetIconStyle,
  WidgetImageFit,
  WidgetImagePosition,
  WidgetTextContrastOverride,
  BUILT_IN_BACKGROUND_IMAGES,
  DEFAULT_WIDGET_BACKGROUND,
  validateWidgetBackgroundFormat,
  DEVELOPER_ATTRIBUTION,
  KWinCompositorConfig,
  DEFAULT_KWIN_COMPOSITOR_CONFIG,
} from '@/lib/urwidgets-engine';

interface PlasmaDesktopViewProps {
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
  kwinCompositorConfig?: KWinCompositorConfig;
  onChangeKwinCompositorConfig?: (config: KWinCompositorConfig) => void;
  widgets: WidgetInstanceConfig[];
  onToggleWidget: (id: WidgetId) => void;
  onResizeWidget: (id: WidgetId, size: WidgetSize) => void;
  onSetWidgetThemeOverride: (id: WidgetId, themeId: string | null) => void;
  onUpdateWidgetPreferences: (
    id: WidgetId,
    patch: Partial<WidgetInstanceConfig>
  ) => void;
  onResetSingleWidgetPreferences: (id: WidgetId) => void;
  onResetWidgets: () => void;
  widgetBackgrounds: Record<WidgetId, WidgetBackgroundConfig>;
  onUpdateWidgetBackground?: (
    id: WidgetId,
    config: WidgetBackgroundConfig
  ) => void;
  onResetWidgetBackground?: (id: WidgetId) => void;
  // Clock & Alarms props
  now: Date;
  use24h: boolean;
  onToggle24h: () => void;
  showSeconds: boolean;
  onToggleSeconds: () => void;
  clockMonoFont: boolean;
  onToggleClockFont: () => void;
  alarms: AlarmItem[];
  dueAlarmQueue: DueAlarmNotification[];
  onToggleAlarm: (id: string) => void;
  onUpsertAlarm: (alarm: AlarmItem) => void;
  onDeleteAlarm: (id: string) => void;
  onSetGlobalAlarmRingtone?: (ringtonePath: string) => void;
  onSnoozeDueAlarm: (alarmId: string, snoozeMins?: number) => void;
  onStopDueAlarm: (alarmId: string) => void;
  onTriggerTestAlarm: (alarmId?: string) => void;
  // Notes props
  notes: NoteItem[];
  onUpsertNote: (note: {
    id?: string;
    title: string;
    body: string;
    pinned?: boolean;
    tags?: string[];
  }) => NoteItem;
  onDeleteNote: (id: string) => void;
  onTogglePinNote: (id: string) => void;
  // Calendar props
  calYear: number;
  calMonth: number;
  calLocale: 'en-US' | 'id-ID';
  calFirstDay: 0 | 1;
  onChangeCalMonth: (delta: number) => void;
  onToggleCalLocale: () => void;
  onToggleCalFirstDay: () => void;
  // Weather props
  weatherCity: string;
  onChangeWeatherCity: (city: string) => void;
  useCelsius: boolean;
  onToggleCelsius: () => void;
  weatherOffline: boolean;
  onToggleWeatherOffline: () => void;
  onRefreshWeather: () => void;
  // Pomodoro props
  pomodoro: PomodoroState;
  onPomodoroStartPause: () => void;
  onPomodoroReset: () => void;
  onPomodoroPhase: (phase: PomodoroPhase) => void;
  onUpdatePomodoroDurations: (
    studyMins: number,
    shortBreakMins: number,
    longBreakMins: number
  ) => void;
  // Agenda props (legacy compatibility)
  agendaEvents: AgendaEvent[];
  onAddAgendaEvent: (
    title: string,
    startTime: string,
    endTime: string,
    category: AgendaEvent['category']
  ) => void;
  onUpdateAgendaEvent: (
    id: string,
    title: string,
    startTime: string,
    endTime: string,
    category: AgendaEvent['category']
  ) => void;
  onToggleAgendaEvent: (id: string) => void;
  onDeleteAgendaEvent: (id: string) => void;
  // To-Do List props (replaces Schedule & Events widget)
  todos: TodoItem[];
  onAddTodo: (
    title: string,
    dueDateIso: string,
    dueTime: string,
    priority: TodoItem['priority'],
    category?: string
  ) => void;
  onToggleTodo: (id: string) => void;
  onUpdateTodo: (
    id: string,
    patch: Partial<
      Pick<TodoItem, 'title' | 'dueDateIso' | 'dueTime' | 'priority' | 'category'>
    >
  ) => void;
  onDeleteTodo: (id: string) => void;
  onClearCompletedTodos: () => void;
  // Quick Actions & IPC log
  onTriggerQuickAction: (label: string, command: string) => void;
  lastIpcMessage: string;
  // System Monitor
  sysCpu: number;
  sysMemMb: number;
  sysMemPct: number;
  sysIntervalSecs: number;
  onChangeSysInterval: (secs: number) => void;
  onOpenControlCenter: () => void;
}

const PHOTO_DIRECTORIES: Record<
  string,
  { src: string; title: string; location: string }[]
> = {
  '~/Pictures/Wallpapers': [
    {
      src: '/images/photo_widget_architecture.jpg',
      title: 'Warm Timber Studio',
      location: 'Oslo Woodland',
    },
    {
      src: '/images/photo_widget_botanical.jpg',
      title: 'Morning Botanical',
      location: 'Glasshouse Study',
    },
    {
      src: '/images/alpine_mist_wallpaper.jpg',
      title: 'Alpine Dawn',
      location: 'Highland Mist',
    },
  ],
  '~/Pictures/Botanical': [
    {
      src: '/images/photo_widget_botanical.jpg',
      title: 'Morning Botanical',
      location: 'Glasshouse Study',
    },
    {
      src: '/images/photo_widget_architecture.jpg',
      title: 'Warm Timber Studio',
      location: 'Oslo Woodland',
    },
  ],
  '/usr/share/backgrounds': [
    {
      src: '/images/alpine_mist_wallpaper.jpg',
      title: 'Alpine Dawn',
      location: 'Default Desktop',
    },
    {
      src: '/images/photo_widget_architecture.jpg',
      title: 'Warm Timber Studio',
      location: 'Oslo Woodland',
    },
  ],
};

const WALLPAPER_OPTIONS = [
  {
    id: 'widgetwall-warm',
    label: 'WidgetWall Warm Sandstone',
  },
  {
    id: 'alpine',
    label: 'Alpine Mist Photography',
  },
  {
    id: 'midnight-studio',
    label: 'Midnight Studio Canvas',
  },
];

const FOCUS_STEPS: { id: 'all' | WidgetId; label: string }[] = [
  { id: 'all', label: 'WidgetWall (All 10)' },
  { id: 'clock', label: 'Clock & Alarms' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'weather', label: 'Weather' },
  { id: 'pomodoro', label: 'Pomodoro' },
  { id: 'notes', label: 'Notes' },
  { id: 'music_player', label: 'Music Player' },
  { id: 'agenda', label: 'To-Do List' },
  { id: 'photos', label: 'Photo Frame' },
  { id: 'quick_actions', label: 'Quick Actions' },
  { id: 'system_monitor', label: 'System Monitor' },
];

function WidgetBackgroundLayer({
  widgetId,
  config,
  isDarkSurface,
}: {
  widgetId: WidgetId;
  config?: WidgetBackgroundConfig;
  isDarkSurface: boolean;
}) {
  if (!config || !config.enabled || !config.imageUrl) return null;

  const objectFitClass =
    config.fitMode === 'contain'
      ? 'object-contain'
      : config.fitMode === 'stretch'
        ? 'object-fill'
        : config.fitMode === 'center'
          ? 'object-none'
          : 'object-cover';

  const objectPosClass =
    config.position === 'top'
      ? 'object-top'
      : config.position === 'bottom'
        ? 'object-bottom'
        : config.position === 'left'
          ? 'object-left'
          : config.position === 'right'
            ? 'object-right'
            : 'object-center';

  const useDarkScrim =
    config.overlayMode === 'dark' ||
    (config.overlayMode === 'auto' && isDarkSurface);

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit] z-0"
      data-testid={`widget-bg-layer-${widgetId}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={config.imageUrl}
        alt=""
        className={`w-full h-full ${objectFitClass} ${objectPosClass}`}
      />
      <div
        className="absolute inset-0"
        style={{
          background: useDarkScrim ? '#0D0E12' : '#F6F4EF',
          opacity: Math.max(0, Math.min(0.85, config.overlayOpacity)),
        }}
      />
      {config.colorTint && (
        <div
          className="absolute inset-0"
          style={{
            background: config.colorTint,
            opacity: 0.22,
          }}
        />
      )}
    </div>
  );
}

export default function PlasmaDesktopView(props: PlasmaDesktopViewProps) {
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
    kwinCompositorConfig = DEFAULT_KWIN_COMPOSITOR_CONFIG,
    widgets,
    onToggleWidget,
    onResizeWidget,
    onUpdateWidgetPreferences,
    onResetSingleWidgetPreferences,
    onResetWidgets,
    widgetBackgrounds,
    onUpdateWidgetBackground,
    onResetWidgetBackground,
    now,
    use24h,
    onToggle24h,
    showSeconds,
    onToggleSeconds,
    alarms,
    dueAlarmQueue,
    onToggleAlarm,
    onUpsertAlarm,
    onDeleteAlarm,
    onSetGlobalAlarmRingtone,
    onSnoozeDueAlarm,
    onStopDueAlarm,
    onTriggerTestAlarm,
    notes,
    onUpsertNote,
    onDeleteNote,
    onTogglePinNote,
    calYear,
    calMonth,
    calLocale,
    calFirstDay,
    onChangeCalMonth,
    onToggleCalLocale,
    onToggleCalFirstDay,
    weatherCity,
    onChangeWeatherCity,
    useCelsius,
    onToggleCelsius,
    weatherOffline,
    onToggleWeatherOffline,
    onRefreshWeather,
    pomodoro,
    onPomodoroStartPause,
    onPomodoroReset,
    onPomodoroPhase,
    onUpdatePomodoroDurations,
    todos,
    onAddTodo,
    onToggleTodo,
    onUpdateTodo,
    onDeleteTodo,
    onClearCompletedTodos,
    onTriggerQuickAction,
    sysCpu,
    sysMemMb,
    sysMemPct,
    sysIntervalSecs,
    onChangeSysInterval,
    onOpenControlCenter,
  } = props;

  const [focusedWidget, setFocusedWidget] = useState<'all' | WidgetId>('all');
  const [showAppearancePopover, setShowAppearancePopover] = useState(false);
  const [editContainmentMode, setEditContainmentMode] = useState(false);
  const [activePrefWidgetId, setActivePrefWidgetId] =
    useState<WidgetId | null>(null);
  const [wallpaperId, setWallpaperId] = useState<
    'widgetwall-warm' | 'alpine' | 'midnight-studio'
  >('widgetwall-warm');

  // ================= CLOCK & ALARM MANAGER STATE (MANUAL 2-SLIDE NAVIGATION + LOCAL RINGTONE) =================
  const [clockSlide, setClockSlide] = useState<0 | 1>(0); // 0 = Main Clock, 1 = Alarm Manager
  const [showAlarmEditor, setShowAlarmEditor] = useState(false);
  const [editingAlarmId, setEditingAlarmId] = useState<string | null>(null);
  const [alarmTimeDraft, setAlarmTimeDraft] = useState('07:30');
  const [alarmLabelDraft, setAlarmLabelDraft] = useState('Morning Focus');
  const [alarmRepeatDraft, setAlarmRepeatDraft] = useState<AlarmRepeatDay[]>([
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
  ]);
  const [alarmOneTimeDate, setAlarmOneTimeDate] = useState('2026-11-09');
  const [alarmRingtoneId, setAlarmRingtoneId] = useState('custom-local');
  const [alarmCustomAudioPath, setAlarmCustomAudioPath] = useState(
    () => alarms[0]?.customAudioPath || '~/Music/'
  );
  const [alarmCustomAudioDataUrl, setAlarmCustomAudioDataUrl] = useState('');
  const [alarmCustomAudioError, setAlarmCustomAudioError] = useState('');
  const [alarmVolumeDraft, setAlarmVolumeDraft] = useState(80);
  const [alarmSnoozeDraft, setAlarmSnoozeDraft] = useState(10);
  const [alarmSnoozeIsCustom, setAlarmSnoozeIsCustom] = useState(false);
  const [previewingRingtoneId, setPreviewingRingtoneId] = useState<
    string | null
  >(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const alarmAudioRef = useRef<HTMLAudioElement | null>(null);
  const generatedWavCacheRef = useRef<Map<string, string>>(new Map());

  // Ultra-fast PCM WAV Blob URL generator (8kHz compact buffer: <0.8ms creation time, cached per key, zero UI lag)
  const getOrCreateSynthesizedWavUrl = (
    cacheKey: string,
    mode: 'alarm' | 'music',
    baseFreq: number
  ): string => {
    const cached = generatedWavCacheRef.current.get(cacheKey);
    if (cached) return cached;
    if (typeof window === 'undefined' || typeof Blob === 'undefined') return '';

    const sampleRate = 8000;
    const durationSecs = mode === 'alarm' ? 1.2 : 2.0;
    const numSamples = Math.floor(sampleRate * durationSecs);
    const buffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(buffer);

    const writeStr = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };

    writeStr(0, 'RIFF');
    view.setUint32(4, 36 + numSamples * 2, true);
    writeStr(8, 'WAVE');
    writeStr(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, 1, true); // Mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeStr(36, 'data');
    view.setUint32(40, numSamples * 2, true);

    if (mode === 'alarm') {
      const noteFreqs = [
        baseFreq,
        baseFreq * 1.25,
        baseFreq * 1.5,
        baseFreq * 2.0,
      ];
      for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        const stepIdx = Math.min(3, Math.floor(t / 0.22));
        const localT = t - stepIdx * 0.22;
        let sample = 0;
        if (t < 0.95) {
          const f = noteFreqs[stepIdx];
          const env = Math.exp(-localT * 6.5) * Math.min(1, localT * 100);
          sample =
            (Math.sin(2 * Math.PI * f * t) * 0.7 +
              Math.sin(2 * Math.PI * f * 1.5 * t) * 0.2) *
            env;
        }
        const pcm = Math.max(-1, Math.min(1, sample * 0.85));
        view.setInt16(44 + i * 2, Math.floor(pcm * 32767), true);
      }
    } else {
      const chord = [1.0, 1.25, 1.5];
      for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        const padEnv =
          Math.min(1, t / 0.15) *
          Math.min(1, (durationSecs - t) / 0.15) *
          0.42;
        const pad =
          (Math.sin(2 * Math.PI * (baseFreq * 0.5 * chord[0]) * t) +
            Math.sin(2 * Math.PI * (baseFreq * 0.5 * chord[1]) * t) +
            Math.sin(2 * Math.PI * (baseFreq * 0.5 * chord[2]) * t)) *
          0.33;
        const melT = t % 1.0;
        const melFreq = baseFreq * (t < 1.0 ? 1.5 : 1.25);
        const melEnv = Math.exp(-melT * 3.8) * Math.min(1, melT * 50) * 0.35;
        const melody = Math.sin(2 * Math.PI * melFreq * t) * melEnv;
        const pcm = Math.max(-1, Math.min(1, (pad * padEnv + melody) * 0.9));
        view.setInt16(44 + i * 2, Math.floor(pcm * 32767), true);
      }
    }

    const blob = new Blob([buffer], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    generatedWavCacheRef.current.set(cacheKey, url);
    return url;
  };

  const stopAlarmAudioElement = () => {
    const el = alarmAudioRef.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
  };

  // Play unified alarm ringtone when a due alarm triggers (single non-blocking HTML5 Audio loop, WebAudio only on autoplay fallback)
  useEffect(() => {
    if (dueAlarmQueue.length === 0) {
      stopAlarmAudioElement();
      return;
    }
    const activeDue = dueAlarmQueue[0];
    const effectiveVolumePct = activeDue.volume ?? alarmVolumeDraft ?? 85;
    const freqMap: Record<string, number> = {
      'freedesktop-alarm': 587.33,
      'plasma-bell': 880.0,
      'gentle-chime': 659.25,
      'soft-pulse': 523.25,
      'custom-local': 740.0,
    };
    const baseFreq = freqMap[activeDue.ringtoneId] || 659.25;

    const triggerFallbackWebAudioBurst = () => {
      try {
        if (typeof window === 'undefined') return;
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        if (!AudioContextClass) return;
        const ctx = audioCtxRef.current || new AudioContextClass();
        audioCtxRef.current = ctx;
        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }
        const nowTime = ctx.currentTime;
        [0, 0.22].forEach((offset, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(
            baseFreq * (idx === 0 ? 1.0 : 1.25),
            nowTime + offset
          );
          gain.gain.setValueAtTime(
            Math.max(0.12, Math.min(0.5, (effectiveVolumePct / 100) * 0.45)),
            nowTime + offset
          );
          gain.gain.exponentialRampToValueAtTime(
            0.001,
            nowTime + offset + 0.18
          );
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(nowTime + offset);
          osc.stop(nowTime + offset + 0.19);
        });
      } catch {
        // Ignore in headless environment
      }
    };

    if (alarmAudioRef.current) {
      const el = alarmAudioRef.current;
      const fallbackWav = getOrCreateSynthesizedWavUrl(
        `alarm-${activeDue.ringtoneId}`,
        'alarm',
        baseFreq
      );
      const targetSrc = activeDue.customAudioDataUrl || fallbackWav;
      if (targetSrc) {
        if (el.src !== targetSrc) {
          el.src = targetSrc;
        }
        el.loop = true;
        el.volume = Math.max(0.15, Math.min(1, effectiveVolumePct / 100));
        el.play().catch(() => {
          triggerFallbackWebAudioBurst();
        });
      }
    } else {
      triggerFallbackWebAudioBurst();
    }

    const audioEl = alarmAudioRef.current;
    return () => {
      if (audioEl) {
        audioEl.loop = false;
        audioEl.pause();
      }
    };
  }, [dueAlarmQueue, alarmVolumeDraft]);

  const playChimePreview = (
    ringtoneId: string,
    volumePct: number,
    customDataUrl?: string
  ) => {
    if (previewingRingtoneId === ringtoneId) {
      stopAlarmAudioElement();
      setPreviewingRingtoneId(null);
      return;
    }
    setPreviewingRingtoneId(ringtoneId);

    const freqMap: Record<string, number> = {
      'freedesktop-alarm': 587.33,
      'plasma-bell': 880.0,
      'gentle-chime': 659.25,
      'soft-pulse': 523.25,
      'custom-local': 740.0,
    };
    const baseFreq = freqMap[ringtoneId] || 659.25;

    const effectiveCustomUrl =
      customDataUrl ||
      (ringtoneId === 'custom-local' ? alarmCustomAudioDataUrl : '');
    const synthWavUrl = getOrCreateSynthesizedWavUrl(
      `alarm-${ringtoneId}`,
      'alarm',
      baseFreq
    );
    const previewAudioUrl = effectiveCustomUrl || synthWavUrl;

    if (previewAudioUrl && alarmAudioRef.current) {
      const el = alarmAudioRef.current;
      el.loop = false;
      if (el.src !== previewAudioUrl) {
        el.src = previewAudioUrl;
      }
      el.volume = Math.max(0.1, Math.min(1, volumePct / 100));
      el.currentTime = 0;
      el.onended = () => {
        setPreviewingRingtoneId((curr) => (curr === ringtoneId ? null : curr));
      };
      el.play().catch(() => {
        try {
          if (typeof window !== 'undefined') {
            const AudioContextClass =
              window.AudioContext ||
              (window as unknown as { webkitAudioContext: typeof AudioContext })
                .webkitAudioContext;
            if (AudioContextClass) {
              const ctx = audioCtxRef.current || new AudioContextClass();
              audioCtxRef.current = ctx;
              if (ctx.state === 'suspended') {
                ctx.resume().catch(() => {});
              }
              const nowTime = ctx.currentTime;
              [0, 0.22].forEach((offset, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(
                  baseFreq * (idx === 0 ? 1.0 : 1.25),
                  nowTime + offset
                );
                gain.gain.setValueAtTime(
                  Math.max(0.12, Math.min(0.5, (volumePct / 100) * 0.45)),
                  nowTime + offset
                );
                gain.gain.exponentialRampToValueAtTime(
                  0.001,
                  nowTime + offset + 0.18
                );
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(nowTime + offset);
                osc.stop(nowTime + offset + 0.19);
              });
            }
          }
        } catch {
          // Ignore in headless environment
        }
      });
    }
    setTimeout(() => {
      setPreviewingRingtoneId((curr) => (curr === ringtoneId ? null : curr));
    }, 1500);
  };

  const applyUnifiedAlarmRingtone = (nextPath?: string) => {
    const cleanPath = (nextPath ?? alarmCustomAudioPath).trim() || '~/Music/';
    const check = validateAudioFormat(cleanPath);
    if (
      cleanPath.includes('.') &&
      !cleanPath.endsWith('/') &&
      !check.valid
    ) {
      setAlarmCustomAudioError(
        check.error || 'Gunakan folder seperti ~/Music/ atau file .mp3/.wav/.ogg/.flac'
      );
      return;
    }
    setAlarmCustomAudioError('');
    setAlarmCustomAudioPath(cleanPath);
    setAlarmRingtoneId('custom-local');
    onSetGlobalAlarmRingtone?.(cleanPath);
  };

  const openNewAlarmEditor = () => {
    setEditingAlarmId(null);
    setAlarmTimeDraft('07:30');
    setAlarmLabelDraft('Morning Focus');
    setAlarmRepeatDraft(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
    setAlarmVolumeDraft(80);
    setAlarmSnoozeDraft(10);
    setAlarmSnoozeIsCustom(false);
    setShowAlarmEditor(true);
  };

  const openEditAlarmEditor = (alarm: AlarmItem) => {
    setEditingAlarmId(alarm.id);
    setAlarmTimeDraft(alarm.time);
    setAlarmLabelDraft(alarm.label);
    setAlarmRepeatDraft(alarm.repeatDays);
    setAlarmOneTimeDate(alarm.oneTimeDateIso || '2026-11-09');
    setAlarmVolumeDraft(alarm.volume ?? 85);
    setAlarmSnoozeDraft(alarm.snoozeMinutes);
    setAlarmSnoozeIsCustom(![5, 10, 15, 20, 30].includes(alarm.snoozeMinutes));
    setShowAlarmEditor(true);
  };

  const handleSaveAlarmForm = (e: React.FormEvent) => {
    e.preventDefault();
    const unifiedPath = alarmCustomAudioPath.trim() || '~/Music/';
    const ringtoneObj =
      BUILTIN_RINGTONES.find((r) => r.id === alarmRingtoneId) ||
      BUILTIN_RINGTONES[0];
    const isCustomRingtone =
      alarmRingtoneId === 'custom-local' || Boolean(unifiedPath);
    const saved: AlarmItem = {
      id: editingAlarmId || `alm-${Date.now().toString(36)}`,
      time: alarmTimeDraft,
      label: alarmLabelDraft.trim() || 'Alarm',
      enabled: true,
      repeatDays: alarmRepeatDraft,
      oneTimeDateIso:
        alarmRepeatDraft.length === 0 ? alarmOneTimeDate : undefined,
      ringtoneId: isCustomRingtone ? 'custom-local' : ringtoneObj.id,
      customAudioPath: unifiedPath,
      customAudioDataUrl: alarmCustomAudioDataUrl || undefined,
      volume: Math.max(0, Math.min(100, Number(alarmVolumeDraft) || 85)),
      snoozeMinutes: Math.max(1, Math.min(120, Number(alarmSnoozeDraft) || 10)),
      snoozedUntilTime: null,
    };
    onUpsertAlarm(saved);
    stopAlarmAudioElement();
    setShowAlarmEditor(false);
    setEditingAlarmId(null);
  };

  const toggleRepeatDayInDraft = (day: AlarmRepeatDay) => {
    setAlarmRepeatDraft((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // ================= NOTES WIDGET STATE (WITH 400MS DEBOUNCED AUTOSAVE) =================
  const sortedNotes = sortNotesPinnedFirst(notes);
  const [noteSearchQuery, setNoteSearchQuery] = useState('');
  const [showNoteSearch, setShowNoteSearch] = useState(false);
  const filteredNotes = filterNotesByQuery(sortedNotes, noteSearchQuery);
  const [activeNoteId, setActiveNoteId] = useState<string>(
    sortedNotes[0]?.id || 'note-1'
  );
  const activeNote =
    notes.find((n) => n.id === activeNoteId) || sortedNotes[0] || null;
  const [noteTitleDraft, setNoteTitleDraft] = useState(
    activeNote?.title || ''
  );
  const [noteBodyDraft, setNoteBodyDraft] = useState(activeNote?.body || '');
  const [noteSaveStatus, setNoteSaveStatus] = useState<'saved' | 'saving'>(
    'saved'
  );
  const [showExpandedNoteModal, setShowExpandedNoteModal] = useState(false);
  const noteDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectNote = (note: NoteItem) => {
    setActiveNoteId(note.id);
    setNoteTitleDraft(note.title);
    setNoteBodyDraft(note.body);
    setNoteSaveStatus('saved');
  };

  const scheduleNoteAutosave = (
    noteId: string,
    nextTitle: string,
    nextBody: string
  ) => {
    setNoteSaveStatus('saving');
    if (noteDebounceRef.current) {
      clearTimeout(noteDebounceRef.current);
    }
    noteDebounceRef.current = setTimeout(() => {
      onUpsertNote({
        id: noteId,
        title: nextTitle,
        body: nextBody,
      });
      setNoteSaveStatus('saved');
    }, 400);
  };

  const handleCreateNewNote = () => {
    const created = onUpsertNote({
      title: 'New Desktop Note',
      body: 'Write quick ideas, reminders, or desktop snippets here...',
      pinned: false,
      tags: ['General'],
    });
    selectNote(created);
  };

  // ================= POMODORO, TO-DO LIST, PHOTOS, QUICK ACTIONS & MUSIC PLAYER STATE =================
  const [showPomoConfig, setShowPomoConfig] = useState(false);
  const [pomoStudyDraft, setPomoStudyDraft] = useState(pomodoro.studyMins);
  const [pomoShortDraft, setPomoShortDraft] = useState(pomodoro.shortBreakMins);
  const [pomoLongDraft, setPomoLongDraft] = useState(pomodoro.longBreakMins);

  // To-Do List Widget State (with Deadline Date + Time, Priority, Edit & Delete)
  const [showAddTodoForm, setShowAddTodoForm] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDueDate, setNewTodoDueDate] = useState('2026-11-10');
  const [newTodoDueTime, setNewTodoDueTime] = useState('17:00');
  const [newTodoPriority, setNewTodoPriority] =
    useState<TodoItem['priority']>('high');
  const [newTodoCategory, setNewTodoCategory] = useState('Engineering');
  const [todoError, setTodoError] = useState('');
  const [todoFilter, setTodoFilter] = useState<'all' | 'active' | 'done'>('all');

  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editTodoTitle, setEditTodoTitle] = useState('');
  const [editTodoDueDate, setEditTodoDueDate] = useState('');
  const [editTodoDueTime, setEditTodoDueTime] = useState('');
  const [editTodoPriority, setEditTodoPriority] =
    useState<TodoItem['priority']>('medium');

  // Photo Frame: Clean pure image display with smooth hardware-accelerated opacity crossfade
  const [photoDirectory] = useState<string>('~/Pictures/Wallpapers');
  const activePhotoList =
    PHOTO_DIRECTORIES[photoDirectory] ||
    PHOTO_DIRECTORIES['~/Pictures/Wallpapers'];
  const [photoSlideIndex, setPhotoSlideIndex] = useState<number>(0);

  useEffect(() => {
    if (activePhotoList.length <= 1) return;
    const slideInterval = setInterval(() => {
      setPhotoSlideIndex((prev) => (prev + 1) % activePhotoList.length);
    }, 7500);
    return () => clearInterval(slideInterval);
  }, [activePhotoList.length]);

  // URWidgets Music Player State (Local Folder + Online Audio Link + Real Audio Playback)
  const [musicState, setMusicState] = useState<MusicPlayerState>(
    INITIAL_MUSIC_PLAYER_STATE
  );
  const [showMusicSourceDrawer, setShowMusicSourceDrawer] = useState(false);
  const [localMusicPathDraft, setLocalMusicPathDraft] = useState('~/Music/');
  const [streamUrlDraft, setStreamUrlDraft] = useState('');
  const [streamLabelDraft, setStreamLabelDraft] = useState('');
  const [musicSourceError, setMusicSourceError] = useState('');
  const musicAudioRef = useRef<HTMLAudioElement | null>(null);

  // Audio Priority Policy: Alarm has higher priority than Music Player.
  // Automatically pause Music Player when an alarm rings, and resume when stopped/snoozed.
  const hasDueAlarm = dueAlarmQueue.length > 0;
  useEffect(() => {
    queueMicrotask(() => {
      if (hasDueAlarm) {
        setMusicState((prev) =>
          prev.isPlaying
            ? transitionMusicPlayer(prev, { type: 'ALARM_PAUSE' })
            : prev
        );
      } else {
        setMusicState((prev) =>
          prev.pausedByAlarm
            ? transitionMusicPlayer(prev, { type: 'ALARM_RESUME' })
            : prev
        );
      }
    });
  }, [hasDueAlarm]);

  useEffect(() => {
    if (!musicState.isPlaying || musicState.pausedByAlarm) return;
    const timer = setInterval(() => {
      setMusicState((prev) => transitionMusicPlayer(prev, { type: 'TICK' }));
    }, 1000);
    return () => clearInterval(timer);
  }, [musicState.isPlaying, musicState.pausedByAlarm]);

  const currentTrack: MusicTrack | undefined =
    musicState.queue[musicState.currentIndex] || musicState.queue[0];

  // Real Audio Output Synchronization (Single HTML5 Audio loop without overlapping WebAudio setInterval)
  useEffect(() => {
    const audioEl = musicAudioRef.current;
    const effectiveVol = musicState.isMuted
      ? 0
      : Math.max(0, Math.min(1, musicState.volume / 100));
    if (audioEl) {
      audioEl.volume = effectiveVol;
      audioEl.muted = Boolean(musicState.isMuted);
    }

    if (!musicState.isPlaying || musicState.pausedByAlarm || !currentTrack) {
      if (audioEl && !audioEl.paused) {
        audioEl.pause();
      }
      return;
    }

    const isDirectUrl =
      currentTrack.fileOrStreamUrl.startsWith('http://') ||
      currentTrack.fileOrStreamUrl.startsWith('https://') ||
      currentTrack.fileOrStreamUrl.startsWith('blob:') ||
      currentTrack.fileOrStreamUrl.startsWith('data:');

    const targetAudioSrc = isDirectUrl
      ? currentTrack.fileOrStreamUrl
      : getOrCreateSynthesizedWavUrl(
          `music-${currentTrack.id}`,
          'music',
          currentTrack.synthFreqHz || 432
        );

    if (audioEl && targetAudioSrc) {
      if (audioEl.src !== targetAudioSrc) {
        audioEl.src = targetAudioSrc;
      }
      audioEl.loop = !isDirectUrl;
      audioEl.play().catch(() => {
        // Fallback single soft WebAudio chord only if autoplay is blocked
        try {
          if (typeof window === 'undefined' || effectiveVol === 0) return;
          const AudioContextClass =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext })
              .webkitAudioContext;
          if (!AudioContextClass) return;
          const ctx = audioCtxRef.current || new AudioContextClass();
          audioCtxRef.current = ctx;
          if (ctx.state === 'suspended') {
            ctx.resume().catch(() => {});
          }
          const rootHz = currentTrack.synthFreqHz || 432;
          [1.0, 1.25, 1.5].forEach((ratio) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(rootHz * ratio, ctx.currentTime);
            const vol = Math.max(0.015, effectiveVol * 0.12);
            gain.gain.setValueAtTime(vol, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(
              0.001,
              ctx.currentTime + 1.4
            );
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 1.45);
          });
        } catch {
          // Ignore in headless environment
        }
      });
    }
  }, [
    musicState.isPlaying,
    musicState.pausedByAlarm,
    musicState.currentIndex,
    musicState.volume,
    musicState.isMuted,
    currentTrack,
  ]);

  const handleLoadStreamUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateDirectAudioStreamUrl(streamUrlDraft);
    if (!check.valid) {
      setMusicSourceError(check.error || 'Invalid stream URL');
      setMusicState((prev) =>
        transitionMusicPlayer(prev, {
          type: 'SET_STREAM_ERROR',
          error: check.error || 'Invalid stream URL',
        })
      );
      return;
    }
    setMusicSourceError('');
    const streamTrack: MusicTrack = {
      id: `stream-${Date.now().toString(36)}`,
      title:
        streamLabelDraft.trim() || check.inferredTitle || 'Online Audio Stream',
      artist: 'Direct Online Audio Stream',
      album: check.normalizedUrl,
      durationSecs: 3600,
      coverUrl: '/images/photo_widget_botanical.jpg',
      sourceType: 'stream',
      fileOrStreamUrl: check.normalizedUrl,
      format: 'STREAM',
      synthFreqHz: 432,
    };
    setMusicState((prev) =>
      transitionMusicPlayer(prev, {
        type: 'PLAY_STREAM',
        streamTrack,
      })
    );
    setStreamUrlDraft('');
    setStreamLabelDraft('');
  };

  const handleApplyLocalMusicPath = (rawPath: string) => {
    const trimmed = rawPath.trim() || '~/Music/';
    setLocalMusicPathDraft(trimmed);
    setMusicSourceError('');

    const normalizedForLookup = trimmed.startsWith('~/')
      ? `/home/mint/${trimmed.slice(2).replace(/\/+$/, '')}`
      : trimmed.replace(/\/+$/, '');
    const matchedPreset = LOCAL_MUSIC_FOLDERS.find(
      (f) =>
        f.path === normalizedForLookup ||
        f.label.toLowerCase() === trimmed.toLowerCase()
    );
    if (matchedPreset) {
      setMusicState((prev) =>
        transitionMusicPlayer(prev, {
          type: 'SELECT_FOLDER',
          folderPath: matchedPreset.path,
          tracks: matchedPreset.tracks,
        })
      );
      return;
    }

    const hasExtension = /\.[a-z0-9]{2,5}$/i.test(trimmed);
    if (hasExtension) {
      const check = validateMusicAudioFormat(trimmed);
      if (!check.valid) {
        setMusicSourceError(
          check.error ||
            'Format tidak didukung. Gunakan folder seperti ~/Music/ atau file .mp3, .flac, .ogg, .wav, .m4a'
        );
        return;
      }
      const fileName = trimmed.split('/').pop() || trimmed;
      const singleTrack: MusicTrack = {
        id: `local-file-${Date.now().toString(36)}`,
        title: fileName.replace(/\.[^.]+$/, ''),
        artist: 'Local Audio Path',
        album: trimmed,
        durationSecs: 210,
        coverUrl: '/images/photo_widget_architecture.jpg',
        sourceType: 'local',
        fileOrStreamUrl: trimmed,
        folderPath: trimmed,
        format: check.ext.toUpperCase(),
        synthFreqHz: 432,
      };
      setMusicState((prev) =>
        transitionMusicPlayer(prev, {
          type: 'ADD_LOCAL_FILE',
          track: singleTrack,
        })
      );
      return;
    }

    const baseTracks = LOCAL_MUSIC_FOLDERS[0].tracks.map((t, idx) => ({
      ...t,
      id: `folder-${idx}-${Date.now().toString(36)}`,
      album: trimmed,
      folderPath: trimmed,
    }));
    setMusicState((prev) =>
      transitionMusicPlayer(prev, {
        type: 'SELECT_FOLDER',
        folderPath: trimmed,
        tracks: baseTracks,
      })
    );
  };

  const [quickActions, setQuickActions] = useState<QuickActionShortcut[]>(
    INITIAL_QUICK_ACTIONS
  );
  const [qaGridCols, setQaGridCols] = useState<2 | 3>(2);
  const [showAddShortcut, setShowAddShortcut] = useState(false);
  const [newShortcutLabel, setNewShortcutLabel] = useState('');
  const [newShortcutCmd, setNewShortcutCmd] = useState('');

  const [showWeatherForecast, setShowWeatherForecast] = useState(false);

  const globalTheme =
    themes.find((t) => t.id === activeThemeId) || themes[0];

  const activeFontOption =
    SYSTEM_FONT_OPTIONS.find((f) => f.id === systemFontId) ||
    SYSTEM_FONT_OPTIONS[0];

  const resolveWidgetSurface = (w?: WidgetInstanceConfig) => {
    return resolveIndependentWidgetSurface(
      w,
      themes,
      activeThemeId,
      appearanceMode,
      widgetStyle,
      accentColorId,
      globalElevation,
      customAccentHex,
      kwinCompositorConfig
    );
  };

  const buildCardStyle = (w?: WidgetInstanceConfig): React.CSSProperties => {
    const surf = resolveWidgetSurface(w);
    const bgConfig = w ? widgetBackgrounds[w.id] : undefined;

    const resolvedTextColor =
      bgConfig?.enabled && bgConfig.imageUrl
        ? bgConfig.textContrastOverride === 'light'
          ? '#F5F5F7'
          : bgConfig.textContrastOverride === 'dark'
            ? '#1D1D1F'
            : bgConfig.overlayMode === 'dark' ||
                (bgConfig.overlayMode === 'auto' && surf.isDarkSurface)
              ? '#F5F5F7'
              : '#1D1D1F'
        : surf.textColor;

    const customFontOpt = surf.effectiveFontId
      ? SYSTEM_FONT_OPTIONS.find((f) => f.id === surf.effectiveFontId)
      : null;

    const blurFilter = surf.effectiveTheme.effects.blur
      ? surf.glassTokens.backdropFilterCss
      : 'none';

    return {
      background: surf.background,
      color: resolvedTextColor,
      borderRadius: `${surf.effectiveRadius}px`,
      border: `1px solid ${surf.borderColor}`,
      backdropFilter: blurFilter,
      WebkitBackdropFilter: blurFilter,
      boxShadow: surf.shadowCss,
      fontFamily: customFontOpt ? customFontOpt.cssStack : activeFontOption.cssStack,
    };
  };

  const handleAddTodoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTodoTitle.trim();
    if (!trimmed) {
      setTodoError('Masukkan judul tugas / to-do terlebih dahulu');
      return;
    }
    setTodoError('');
    onAddTodo(
      trimmed,
      newTodoDueDate || '2026-11-10',
      newTodoDueTime || '17:00',
      newTodoPriority,
      newTodoCategory || 'General'
    );
    setNewTodoTitle('');
    setShowAddTodoForm(false);
  };

  const startEditingTodo = (todo: TodoItem) => {
    setEditingTodoId(todo.id);
    setEditTodoTitle(todo.title);
    setEditTodoDueDate(todo.dueDateIso || '2026-11-10');
    setEditTodoDueTime(todo.dueTime || '17:00');
    setEditTodoPriority(todo.priority);
  };

  const saveEditedTodo = (id: string) => {
    if (!editTodoTitle.trim()) return;
    onUpdateTodo(id, {
      title: editTodoTitle.trim(),
      dueDateIso: editTodoDueDate || '2026-11-10',
      dueTime: editTodoDueTime || '17:00',
      priority: editTodoPriority,
    });
    setEditingTodoId(null);
  };

  const handleAddQuickActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShortcutLabel.trim() || !newShortcutCmd.trim()) return;
    setQuickActions((prev) => [
      ...prev,
      {
        id: `qa-${Date.now().toString(36)}`,
        label: newShortcutLabel.trim(),
        command: newShortcutCmd.trim(),
        iconKey: 'terminal',
      },
    ]);
    setNewShortcutLabel('');
    setNewShortcutCmd('');
    setShowAddShortcut(false);
  };

  const isWidgetVisible = (id: WidgetId) => {
    const found = widgets.find((w) => w.id === id);
    if (!found) return true;
    if (focusedWidget !== 'all') return focusedWidget === id;
    return found.enabled;
  };

  const getWidgetConfig = (id: WidgetId): WidgetInstanceConfig =>
    widgets.find((w) => w.id === id) || widgets[0];

  const getWidgetBg = (id: WidgetId): WidgetBackgroundConfig =>
    widgetBackgrounds[id] || { ...DEFAULT_WIDGET_BACKGROUND };

  const clockFormatted = formatClockTime(now, use24h, showSeconds);
  const calendarGrid = computeCalendarGrid(
    calYear,
    calMonth,
    calLocale,
    calFirstDay
  );
  const currentWeatherData =
    WEATHER_CITIES[weatherCity] || Object.values(WEATHER_CITIES)[0];

  const alarmSummary = computeNextAlarmSummary(alarms);

  const renderShortcutIcon = (
    iconKey: QuickActionShortcut['iconKey'],
    color: string
  ) => {
    const iconProps = {
      className: 'w-4 h-4 shrink-0',
      strokeWidth: 1.75,
      style: { color },
    };
    switch (iconKey) {
      case 'folder':
        return <FolderOpen {...iconProps} />;
      case 'terminal':
        return <Terminal {...iconProps} />;
      case 'activity':
        return <Activity {...iconProps} />;
      case 'settings':
        return <Settings {...iconProps} />;
      case 'sparkles':
        return <Sparkles {...iconProps} />;
      default:
        return <Globe {...iconProps} />;
    }
  };

  const renderEditOverlay = (w: WidgetInstanceConfig) => {
    if (!editContainmentMode) return null;
    return (
      <div className="relative z-10 mb-2.5 pb-2 border-b border-current/10 flex flex-wrap items-center justify-between gap-1.5 text-[11px]">
        <span className="font-semibold truncate">
          {w.title}{' '}
          <span className="text-[9px] font-mono opacity-65">({w.configId})</span>
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            data-testid={`open-widget-pref-${w.id}`}
            onClick={() => setActivePrefWidgetId(w.id)}
            className="px-2 py-0.5 rounded-md bg-black/15 dark:bg-white/15 text-[10px] font-semibold flex items-center gap-1"
            title={`Configure ${w.title} Background & Geometry`}
          >
            <Settings className="w-2.5 h-2.5" />
            <span>Bg &amp; Geometry</span>
          </button>
          <button
            type="button"
            onClick={() =>
              onResizeWidget(
                w.id,
                w.size === 'compact'
                  ? 'medium'
                  : w.size === 'medium'
                    ? 'wide'
                    : 'compact'
              )
            }
            className="px-1.5 py-0.5 rounded-md bg-black/10 text-[10px] flex items-center gap-1 whitespace-nowrap"
          >
            <Maximize2 className="w-2.5 h-2.5" />
            {w.size}
          </button>
          <button
            type="button"
            onClick={() => onToggleWidget(w.id)}
            className="p-1 rounded-md bg-rose-500/20 text-rose-600 dark:text-rose-300"
            aria-label={`Remove ${w.title}`}
          >
            <EyeOff className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  };

  const mainSurf = resolveWidgetSurface();
  const clockSurf = resolveWidgetSurface(getWidgetConfig('clock'));
  const calSurf = resolveWidgetSurface(getWidgetConfig('calendar'));
  const pomoSurf = resolveWidgetSurface(getWidgetConfig('pomodoro'));
  const weatherSurf = resolveWidgetSurface(getWidgetConfig('weather'));
  const qaSurf = resolveWidgetSurface(getWidgetConfig('quick_actions'));
  const notesSurf = resolveWidgetSurface(getWidgetConfig('notes'));
  const musicSurf = resolveWidgetSurface(getWidgetConfig('music_player'));
  const sysSurf = resolveWidgetSurface(getWidgetConfig('system_monitor'));
  const agendaSurf = resolveWidgetSurface(getWidgetConfig('agenda'));
  const photoSurf = resolveWidgetSurface(getWidgetConfig('photos'));

  const pomoProgress =
    pomodoro.totalSecs > 0
      ? Math.max(0, Math.min(1, pomodoro.remainingSecs / pomodoro.totalSecs))
      : 1;
  const ringRadius = 50;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringDashoffset = ringCircumference * (1 - pomoProgress);

  const activePrefWidget = activePrefWidgetId
    ? getWidgetConfig(activePrefWidgetId)
    : null;

  return (
    <section className="space-y-4">
      {/* Hidden Real HTML5 Audio Elements for Music Player & Local Alarm Ringtone Playback */}
      <audio
        ref={musicAudioRef}
        preload="none"
        onError={() => {
          // Graceful fallback handled by Web Audio synth
        }}
      />
      <audio
        ref={alarmAudioRef}
        preload="none"
        onError={() => {
          // Graceful fallback handled by Web Audio synth
        }}
      />

      {/* Top Toolbar: Global Theme & Style Switcher (Applies Uniformly to All 10 Widgets) */}
      <div className="bg-white/90 dark:bg-slate-900/90 border border-stone-200/80 dark:border-slate-800 rounded-2xl px-4 py-3 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Global Theme & Style Controls: Appearance Mode | Surface Style | Accent Color (+ Custom Hex) | Atmosphere Preset */}
          <div className="flex flex-wrap items-center gap-3">
            {/* 1. Global Appearance Mode: Auto | Light | Dark */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-stone-500 dark:text-slate-400">
                Appearance:
              </span>
              <div
                className="inline-flex items-center p-0.5 rounded-lg bg-stone-200/75 dark:bg-slate-950 border border-stone-300/60 dark:border-slate-800"
                role="group"
                aria-label="Global Appearance Mode"
              >
                {(['auto', 'light', 'dark'] as AppearanceMode[]).map((mode) => {
                  const active = appearanceMode === mode;
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => onChangeAppearanceMode(mode)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md capitalize transition-colors whitespace-nowrap ${
                        active
                          ? 'bg-white dark:bg-slate-800 text-stone-900 dark:text-white shadow-2xs font-semibold'
                          : 'text-stone-600 dark:text-slate-400'
                      }`}
                    >
                      {mode}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Global Surface Style: Default | Dark | Clear | Tinted | Solid */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-stone-500 dark:text-slate-400">
                Style:
              </span>
              <div
                className="inline-flex items-center p-0.5 rounded-lg bg-stone-200/75 dark:bg-slate-950 border border-stone-300/60 dark:border-slate-800"
                role="group"
                aria-label="Global Widget Surface Style"
              >
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
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                        active
                          ? 'bg-white dark:bg-slate-800 text-stone-900 dark:text-white shadow-2xs font-semibold'
                          : 'text-stone-600 dark:text-slate-400'
                      }`}
                    >
                      {st.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Global Accent Color Swatches + Custom Hex Input */}
            <div
              className="flex flex-wrap items-center gap-1.5"
              role="group"
              aria-label="Global Accent Colors"
            >
              <span className="text-xs font-medium text-stone-500 dark:text-slate-400">
                Accent:
              </span>
              <div className="flex items-center gap-1.5">
                {ACCENT_COLORS.map((acc) => {
                  const selected = accentColorId === acc.id;
                  return (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => onChangeAccentColorId(acc.id)}
                      aria-label={`Accent Color ${acc.label}`}
                      title={acc.label}
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        selected
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

                {/* Custom Hex Color Picker + Hex Code Input */}
                <div
                  className={`inline-flex items-center gap-1 pl-1 pr-1.5 py-0.5 rounded-lg border text-[11px] ${
                    accentColorId === 'custom'
                      ? 'border-stone-900 dark:border-white bg-stone-100 dark:bg-slate-800 font-semibold'
                      : 'border-stone-300/80 dark:border-slate-800 bg-stone-100/70 dark:bg-slate-950'
                  }`}
                  title="Custom Hex Accent Color (#RRGGBB)"
                >
                  <input
                    type="color"
                    aria-label="Custom Accent Color Picker"
                    data-testid="global-custom-accent-picker"
                    value={normalizeHexColor(customAccentHex)}
                    onChange={(e) => onChangeCustomAccentHex(e.target.value)}
                    className="w-4 h-4 rounded-full cursor-pointer border-0 bg-transparent p-0"
                  />
                  <input
                    type="text"
                    aria-label="Custom Accent Hex Input"
                    data-testid="global-custom-accent-hex-input"
                    value={customAccentHex}
                    onChange={(e) => onChangeCustomAccentHex(e.target.value)}
                    placeholder="#FF5A79"
                    maxLength={7}
                    className="w-[62px] bg-transparent font-mono text-[11px] text-stone-800 dark:text-slate-200 focus:outline-none uppercase"
                  />
                </div>
              </div>
            </div>

            {/* 4. Global Atmosphere Preset Selector */}
            <label className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-slate-400">
              <span>Atmosphere:</span>
              <select
                aria-label="Global Atmosphere Preset"
                data-testid="global-atmosphere-preset-select"
                value={activeThemeId}
                onChange={(e) => onSelectTheme(e.target.value)}
                className="bg-stone-100 dark:bg-slate-950 border border-stone-300/80 dark:border-slate-800 rounded-lg px-2.5 py-1 text-xs font-medium text-stone-800 dark:text-slate-200 focus:outline-none"
              >
                {themes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Right Controls: Wallpaper, Widget Bg & Geometry, Appearance Popover, Customize Grid */}
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-slate-400">
              <span>Wallpaper:</span>
              <select
                aria-label="Desktop Backdrop"
                value={wallpaperId}
                onChange={(e) =>
                  setWallpaperId(
                    e.target.value as
                      | 'widgetwall-warm'
                      | 'alpine'
                      | 'midnight-studio'
                  )
                }
                className="bg-stone-100 dark:bg-slate-950 border border-stone-300/80 dark:border-slate-800 rounded-lg px-2.5 py-1 text-xs text-stone-800 dark:text-slate-200 focus:outline-none"
              >
                {WALLPAPER_OPTIONS.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.label}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              data-testid="open-per-widget-prefs-btn"
              onClick={() =>
                setActivePrefWidgetId((prev) => (prev ? null : 'clock'))
              }
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activePrefWidgetId
                  ? 'bg-sky-600 text-white border-sky-600'
                  : 'bg-stone-100 dark:bg-slate-950 border-stone-300/80 dark:border-slate-800 text-stone-800 dark:text-slate-200'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              Widget Bg &amp; Geometry
            </button>

            <button
              type="button"
              onClick={() => setShowAppearancePopover((p) => !p)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                showAppearancePopover
                  ? 'bg-stone-900 text-white border-stone-900 dark:bg-white dark:text-slate-950'
                  : 'bg-stone-100 dark:bg-slate-950 border-stone-300/80 dark:border-slate-800 text-stone-800 dark:text-slate-200'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Appearance Settings
            </button>

            <button
              type="button"
              onClick={() => setEditContainmentMode((prev) => !prev)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                editContainmentMode
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-800 dark:text-amber-200'
                  : 'bg-stone-100 dark:bg-slate-950 border-stone-300/80 dark:border-slate-800 text-stone-800 dark:text-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              {editContainmentMode ? 'Done Editing' : 'Customize Grid'}
            </button>
          </div>
        </div>

        {/* Row 2: Widget Focus Filter */}
        <div className="pt-2 border-t border-stone-200/60 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div
            className="flex flex-wrap items-center gap-1"
            role="group"
            aria-label="Step-by-Step Widget Filter"
          >
            {FOCUS_STEPS.map((step) => {
              const active = focusedWidget === step.id;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setFocusedWidget(step.id)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'text-white font-semibold shadow-2xs'
                      : 'text-stone-600 dark:text-slate-400'
                  }`}
                  style={
                    active ? { background: mainSurf.accentHex } : undefined
                  }
                >
                  {step.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-slate-400">
            <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-slate-800 text-[10px] font-medium">
              Global Theme: {globalTheme.name} · {appearanceMode} · {widgetStyle} ·{' '}
              {mainSurf.accentHex}
            </span>
            <span>Font:</span>
            <select
              aria-label="Installed System Font"
              value={systemFontId}
              onChange={(e) => onChangeSystemFontId(e.target.value)}
              className="bg-stone-100 dark:bg-slate-950 border border-stone-300/70 dark:border-slate-800 rounded-md px-2 py-0.5 text-[11px] text-stone-800 dark:text-slate-200"
            >
              {SYSTEM_FONT_OPTIONS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* WIDGET BACKGROUND IMAGE & GEOMETRY DRAWER (Theme & Style are Global for All Widgets) */}
      {activePrefWidget && (
        <div
          data-testid="per-widget-preferences-drawer"
          className="bg-white/95 dark:bg-slate-900/95 border border-stone-200 dark:border-slate-800 rounded-2xl p-4 shadow-lg space-y-3 text-xs"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-stone-200/80 dark:border-slate-800">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-sm text-stone-900 dark:text-white">
                Widget Background &amp; Card Geometry:
              </span>
              <div className="flex flex-wrap items-center gap-1">
                {widgets.map((w) => {
                  const isSel = w.id === activePrefWidget.id;
                  const hasCustom =
                    w.elevationOverride !== null ||
                    w.radiusOverride !== null ||
                    w.opacityOverride !== null ||
                    getWidgetBg(w.id).enabled;
                  return (
                    <button
                      key={w.id}
                      type="button"
                      data-testid={`select-pref-widget-${w.id}`}
                      onClick={() => setActivePrefWidgetId(w.id)}
                      className={`px-2.5 py-1 rounded-lg font-medium border transition-colors ${
                        isSel
                          ? 'bg-stone-900 text-white border-stone-900 dark:bg-white dark:text-slate-950 font-semibold'
                          : 'bg-stone-100 dark:bg-slate-950 border-stone-300/80 dark:border-slate-800 text-stone-700 dark:text-slate-300'
                      }`}
                    >
                      {w.title}
                      {hasCustom ? ' •' : ''}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-stone-500 dark:text-slate-400 hidden md:inline">
                Appearance Mode, Surface Style, Accent Color &amp; Atmosphere Preset apply globally
              </span>
              <button
                type="button"
                data-testid="reset-this-widget-prefs-btn"
                onClick={() =>
                  onResetSingleWidgetPreferences(activePrefWidget.id)
                }
                className="px-2.5 py-1 rounded-lg bg-stone-200 dark:bg-slate-800 text-stone-800 dark:text-slate-200 font-medium"
              >
                Reset {activePrefWidget.title}
              </button>
              <button
                type="button"
                onClick={() => setActivePrefWidgetId(null)}
                aria-label="Close Per-Widget Preferences"
                className="p-1 rounded-lg bg-stone-200/70 dark:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
            {/* 1. 3D Shadow Elevation */}
            <label className="space-y-1">
              <span className="font-semibold text-stone-600 dark:text-slate-300 block">
                3D Card Shadow
              </span>
              <select
                aria-label="Widget Independent Shadow Elevation"
                data-testid="pref-widget-elevation"
                value={
                  activePrefWidget.elevationOverride === null ||
                  activePrefWidget.elevationOverride === undefined
                    ? 'global'
                    : String(activePrefWidget.elevationOverride)
                }
                onChange={(e) =>
                  onUpdateWidgetPreferences(activePrefWidget.id, {
                    elevationOverride:
                      e.target.value === 'global'
                        ? null
                        : (Number(e.target.value) as ElevationLevel),
                  })
                }
                className="w-full bg-stone-100 dark:bg-slate-950 border border-stone-300 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs"
              >
                <option value="global">
                  Global (Level {globalElevation})
                </option>
                {ELEVATION_LEVELS.map((el) => (
                  <option key={el.level} value={el.level}>
                    {el.label}
                  </option>
                ))}
              </select>
            </label>

            {/* 2. Corner Radius & Opacity */}
            <div className="grid grid-cols-2 gap-2">
              <label className="space-y-1">
                <span className="font-semibold text-stone-600 dark:text-slate-300 block">
                  Radius (
                  {activePrefWidget.radiusOverride ??
                    globalTheme.appearance.radius}
                  px)
                </span>
                <input
                  type="range"
                  aria-label="Widget Independent Corner Radius"
                  min={14}
                  max={32}
                  value={
                    activePrefWidget.radiusOverride ??
                    globalTheme.appearance.radius
                  }
                  onChange={(e) =>
                    onUpdateWidgetPreferences(activePrefWidget.id, {
                      radiusOverride: Number(e.target.value),
                    })
                  }
                  className="w-full"
                />
              </label>
              <label className="space-y-1">
                <span className="font-semibold text-stone-600 dark:text-slate-300 block">
                  Opacity (
                  {Math.round(
                    (activePrefWidget.opacityOverride ??
                      globalTheme.appearance.opacity) * 100
                  )}
                  %)
                </span>
                <input
                  type="range"
                  aria-label="Widget Independent Opacity"
                  min={45}
                  max={100}
                  value={Math.round(
                    (activePrefWidget.opacityOverride ??
                      globalTheme.appearance.opacity) * 100
                  )}
                  onChange={(e) =>
                    onUpdateWidgetPreferences(activePrefWidget.id, {
                      opacityOverride: Number(e.target.value) / 100,
                    })
                  }
                  className="w-full"
                />
              </label>
            </div>

            {/* 3. Icon Style & Typography */}
            <div className="grid grid-cols-2 gap-2">
              <label className="space-y-1">
                <span className="font-semibold text-stone-600 dark:text-slate-300 block">
                  Icon Style
                </span>
                <select
                  aria-label="Widget Independent Icon Style"
                  value={activePrefWidget.iconStyleOverride || 'filled'}
                  onChange={(e) =>
                    onUpdateWidgetPreferences(activePrefWidget.id, {
                      iconStyleOverride: e.target.value as WidgetIconStyle,
                    })
                  }
                  className="w-full bg-stone-100 dark:bg-slate-950 border border-stone-300 dark:border-slate-800 rounded-lg px-2 py-1.5 text-xs"
                >
                  <option value="filled">Filled</option>
                  <option value="outline">Outline</option>
                  <option value="minimal">Minimal</option>
                  <option value="tinted">Tinted</option>
                </select>
              </label>
              <label className="space-y-1">
                <span className="font-semibold text-stone-600 dark:text-slate-300 block">
                  Typography
                </span>
                <select
                  aria-label="Widget Independent Typography"
                  value={activePrefWidget.fontFamilyOverride || 'global'}
                  onChange={(e) =>
                    onUpdateWidgetPreferences(activePrefWidget.id, {
                      fontFamilyOverride:
                        e.target.value === 'global' ? null : e.target.value,
                    })
                  }
                  className="w-full bg-stone-100 dark:bg-slate-950 border border-stone-300 dark:border-slate-800 rounded-lg px-2 py-1.5 text-xs"
                >
                  <option value="global">Global ({systemFontId})</option>
                  {SYSTEM_FONT_OPTIONS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* 4. Background Image Selection & Remove */}
            <label className="space-y-1">
              <span className="font-semibold text-stone-600 dark:text-slate-300 block">
                Background Image
              </span>
              <div className="flex items-center gap-1">
                <select
                  aria-label="Widget Background Image Select"
                  value={getWidgetBg(activePrefWidget.id).imageUrl || ''}
                  onChange={(e) => {
                    const url = e.target.value;
                    const curr = getWidgetBg(activePrefWidget.id);
                    onUpdateWidgetBackground?.(activePrefWidget.id, {
                      ...curr,
                      enabled: Boolean(url),
                      imageUrl: url,
                    });
                  }}
                  className="flex-1 bg-stone-100 dark:bg-slate-950 border border-stone-300 dark:border-slate-800 rounded-lg px-2 py-1.5 text-xs"
                >
                  <option value="">None (Surface Only)</option>
                  {BUILT_IN_BACKGROUND_IMAGES.map((sample) => (
                    <option key={sample.id} value={sample.url}>
                      {sample.label}
                    </option>
                  ))}
                </select>
                {getWidgetBg(activePrefWidget.id).enabled && (
                  <button
                    type="button"
                    onClick={() => onResetWidgetBackground?.(activePrefWidget.id)}
                    className="px-2 py-1.5 rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-300 text-[10px] font-semibold"
                    title="Remove Background Image"
                  >
                    Remove
                  </button>
                )}
              </div>
            </label>

            {/* 5. Image Fit & Image Position */}
            <div className="grid grid-cols-2 gap-2">
              <label className="space-y-1">
                <span className="font-semibold text-stone-600 dark:text-slate-300 block">
                  Image Fit
                </span>
                <select
                  aria-label="Widget Background Image Fit"
                  value={getWidgetBg(activePrefWidget.id).fitMode}
                  onChange={(e) => {
                    const curr = getWidgetBg(activePrefWidget.id);
                    onUpdateWidgetBackground?.(activePrefWidget.id, {
                      ...curr,
                      fitMode: e.target.value as WidgetImageFit,
                    });
                  }}
                  className="w-full bg-stone-100 dark:bg-slate-950 border border-stone-300 dark:border-slate-800 rounded-lg px-2 py-1.5 text-xs"
                >
                  <option value="cover">Cover</option>
                  <option value="contain">Contain</option>
                  <option value="stretch">Stretch</option>
                  <option value="center">Center</option>
                </select>
              </label>
              <label className="space-y-1">
                <span className="font-semibold text-stone-600 dark:text-slate-300 block">
                  Position
                </span>
                <select
                  aria-label="Widget Background Image Position"
                  value={getWidgetBg(activePrefWidget.id).position}
                  onChange={(e) => {
                    const curr = getWidgetBg(activePrefWidget.id);
                    onUpdateWidgetBackground?.(activePrefWidget.id, {
                      ...curr,
                      position: e.target.value as WidgetImagePosition,
                    });
                  }}
                  className="w-full bg-stone-100 dark:bg-slate-950 border border-stone-300 dark:border-slate-800 rounded-lg px-2 py-1.5 text-xs"
                >
                  <option value="center">Center</option>
                  <option value="top">Top</option>
                  <option value="bottom">Bottom</option>
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>
              </label>
            </div>

            {/* 6. Overlay Opacity & Text Readability */}
            <div className="grid grid-cols-2 gap-2">
              <label className="space-y-1">
                <span className="font-semibold text-stone-600 dark:text-slate-300 block">
                  Overlay (
                  {Math.round(
                    getWidgetBg(activePrefWidget.id).overlayOpacity * 100
                  )}
                  %)
                </span>
                <input
                  type="range"
                  aria-label="Widget Background Overlay Opacity"
                  min={0}
                  max={85}
                  value={Math.round(
                    getWidgetBg(activePrefWidget.id).overlayOpacity * 100
                  )}
                  onChange={(e) => {
                    const curr = getWidgetBg(activePrefWidget.id);
                    onUpdateWidgetBackground?.(activePrefWidget.id, {
                      ...curr,
                      overlayOpacity: Number(e.target.value) / 100,
                    });
                  }}
                  className="w-full"
                />
              </label>
              <label className="space-y-1">
                <span className="font-semibold text-stone-600 dark:text-slate-300 block">
                  Readability
                </span>
                <select
                  aria-label="Widget Background Text Readability"
                  value={getWidgetBg(activePrefWidget.id).textContrastOverride}
                  onChange={(e) => {
                    const curr = getWidgetBg(activePrefWidget.id);
                    onUpdateWidgetBackground?.(activePrefWidget.id, {
                      ...curr,
                      textContrastOverride:
                        e.target.value as WidgetTextContrastOverride,
                    });
                  }}
                  className="w-full bg-stone-100 dark:bg-slate-950 border border-stone-300 dark:border-slate-800 rounded-lg px-2 py-1.5 text-xs"
                >
                  <option value="auto">Auto</option>
                  <option value="light">Light Text</option>
                  <option value="dark">Dark Text</option>
                </select>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Edit Containment / Widget Management Drawer (Includes Subtle Author Attribution) */}
      {editContainmentMode && (
        <div className="bg-white/90 dark:bg-slate-900/90 border border-stone-200 dark:border-slate-800 rounded-2xl p-3.5 space-y-2.5 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-semibold text-stone-700 dark:text-slate-200 mr-1">
                Active Desktop Widgets (
                {widgets.filter((w) => w.enabled).length}/{widgets.length}):
              </span>
              {widgets.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => onToggleWidget(w.id)}
                  className={`px-2.5 py-1 rounded-lg font-medium border transition-colors whitespace-nowrap ${
                    w.enabled
                      ? 'bg-stone-900 text-white border-stone-900 dark:bg-sky-500/20 dark:border-sky-400/40 dark:text-sky-200'
                      : 'bg-stone-100 dark:bg-slate-950 border-stone-300 dark:border-slate-800 text-stone-500'
                  }`}
                >
                  {w.enabled ? `✓ ${w.title}` : `+ ${w.title}`}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={onResetWidgets}
              className="px-3 py-1 rounded-lg bg-stone-200/80 dark:bg-slate-800 text-stone-800 dark:text-slate-200 font-medium"
            >
              Reset Default Layout
            </button>
          </div>

          <div className="pt-3 border-t border-stone-200/70 dark:border-slate-800 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-[11px] text-stone-600 dark:text-slate-300">
            <div className="space-y-1.5">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-stone-400 dark:text-slate-500 font-semibold">
                  Author
                </div>
                <div className="font-semibold text-stone-900 dark:text-white">
                  {DEVELOPER_ATTRIBUTION.author}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-stone-500 dark:text-slate-400">
                  Portfolio
                </div>
                <a
                  href={DEVELOPER_ATTRIBUTION.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-stone-900 dark:text-sky-400 hover:underline"
                >
                  <span>{DEVELOPER_ATTRIBUTION.portfolioLabel} ↗</span>
                </a>
              </div>
              <div>
                <div className="text-[10px] text-stone-500 dark:text-slate-400">
                  Instagram
                </div>
                <a
                  href={DEVELOPER_ATTRIBUTION.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-stone-900 dark:text-pink-400 hover:underline"
                >
                  <span>{DEVELOPER_ATTRIBUTION.instagramLabel} ↗</span>
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3 text-stone-500 dark:text-slate-400">
              <span>{DEVELOPER_ATTRIBUTION.widgetConfigText}</span>
              <a
                href={DEVELOPER_ATTRIBUTION.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium hover:underline"
              >
                <span>GitHub ↗</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* MAIN WIDGETWALL DESKTOP CONTAINMENT VIEWPORT */}
      <div
        className="relative rounded-[26px] border border-stone-300/80 dark:border-slate-800 overflow-hidden shadow-xl min-h-[640px] flex flex-col justify-between"
        style={{
          fontFamily: activeFontOption.cssStack,
          background:
            wallpaperId === 'midnight-studio' || appearanceMode === 'dark'
              ? 'radial-gradient(circle at 18% 18%, #2B2D42 0%, #161821 52%, #0F1016 100%)'
              : 'radial-gradient(circle at 15% 20%, #EFEBE4 0%, #DFD6CA 48%, #CFC3B4 100%)',
        }}
      >
        {/* Optional Alpine Mist Wallpaper Layer */}
        {wallpaperId === 'alpine' && (
          <div className="absolute inset-0 pointer-events-none">
            <Image
              src="/images/alpine_mist_wallpaper.jpg"
              alt="Alpine Mist Desktop Wallpaper"
              fill
              priority
              sizes="100vw"
              referrerPolicy="no-referrer"
              className="object-cover opacity-80"
            />
            <div
              className={`absolute inset-0 ${
                appearanceMode === 'dark'
                  ? 'bg-black/45'
                  : 'bg-stone-100/20 backdrop-blur-[2px]'
              }`}
            />
          </div>
        )}

        {/* Warm Ambient Sunlight Glow */}
        {wallpaperId === 'widgetwall-warm' && appearanceMode !== 'dark' && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 78% 24%, rgba(255, 252, 245, 0.72), transparent 46%), radial-gradient(circle at 25% 75%, rgba(214, 197, 179, 0.45), transparent 55%)',
            }}
          />
        )}

        {/* Top Desktop Menu Bar */}
        <div
          className={`relative z-20 px-6 py-1.5 flex items-center justify-between text-xs font-medium backdrop-blur-md border-b ${
            appearanceMode === 'dark' || wallpaperId === 'midnight-studio'
              ? 'bg-black/25 text-white/90 border-white/10'
              : 'bg-white/35 text-stone-900 border-white/40'
          }`}
        >
          <div className="flex items-center gap-5">
            <span className="font-bold tracking-tight">URWidgets</span>
            <span className="opacity-80 hidden sm:inline">File</span>
            <span className="opacity-80 hidden sm:inline">Edit</span>
            <span className="opacity-80 hidden sm:inline">View</span>
            <span className="opacity-80 hidden sm:inline">Widgets</span>
            <button
              type="button"
              onClick={() => setShowAppearancePopover((p) => !p)}
              className="opacity-90 underline decoration-current/40 underline-offset-4"
            >
              Appearance
            </button>
          </div>

          <div className="flex items-center gap-4 tabular-nums">
            <span className="hidden md:inline opacity-75">
              {globalTheme.name} · {widgetStyle} · {mainSurf.accentHex}
            </span>
            <Wifi className="w-3.5 h-3.5 opacity-80" />
            <BatteryCharging className="w-4 h-4 opacity-80" />
            <span>
              {now.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}{' '}
              {clockFormatted.time}{' '}
              {!use24h ? clockFormatted.period : ''}
            </span>
          </div>
        </div>

        {/* FLOATING macOS APPEARANCE SETTINGS WINDOW (Global Theme & Style + Custom Hex + Attribution) */}
        {showAppearancePopover && (
          <div
            data-testid="macos-appearance-modal"
            className="absolute top-10 right-6 z-30 w-full max-w-[400px] rounded-[22px] p-5 shadow-2xl border backdrop-blur-2xl"
            style={{
              background:
                appearanceMode === 'dark'
                  ? 'rgba(30, 30, 36, 0.92)'
                  : 'rgba(246, 244, 240, 0.94)',
              color: appearanceMode === 'dark' ? '#F5F5F7' : '#1D1D1F',
              borderColor:
                appearanceMode === 'dark'
                  ? 'rgba(255,255,255,0.16)'
                  : 'rgba(255,255,255,0.75)',
            }}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-current/10">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">
                  Global Appearance &amp; Style
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowAppearancePopover(false)}
                aria-label="Close Appearance Window"
                className="p-1 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Section 1: Appearance (Auto / Light / Dark visual cards) */}
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium opacity-85">Appearance</span>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: 'auto', label: 'Auto' },
                      { id: 'light', label: 'Light' },
                      { id: 'dark', label: 'Dark' },
                    ] as { id: AppearanceMode; label: string }[]
                  ).map((m) => {
                    const selected = appearanceMode === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => onChangeAppearanceMode(m.id)}
                        className="flex flex-col items-center gap-1"
                      >
                        <div
                          className={`w-16 h-10 rounded-lg border-2 overflow-hidden flex ${
                            selected
                              ? 'shadow-sm'
                              : 'border-current/15 opacity-80'
                          }`}
                          style={
                            selected
                              ? { borderColor: mainSurf.accentHex }
                              : undefined
                          }
                        >
                          {m.id === 'auto' && (
                            <>
                              <div className="w-1/2 h-full bg-[#F2EFE9] p-1 flex flex-col justify-between">
                                <div className="w-full h-2 rounded-xs bg-pink-400/70" />
                                <div className="w-3/4 h-2 rounded-xs bg-stone-300" />
                              </div>
                              <div className="w-1/2 h-full bg-[#1C1D24] p-1 flex flex-col justify-between">
                                <div className="w-full h-2 rounded-xs bg-indigo-400/70" />
                                <div className="w-3/4 h-2 rounded-xs bg-slate-700" />
                              </div>
                            </>
                          )}
                          {m.id === 'light' && (
                            <div className="w-full h-full bg-[#F2EFE9] p-1.5 flex flex-col justify-between">
                              <div
                                className="w-2/3 h-2 rounded-xs"
                                style={{ background: mainSurf.accentHex }}
                              />
                              <div className="w-full h-3 rounded-xs bg-white shadow-2xs" />
                            </div>
                          )}
                          {m.id === 'dark' && (
                            <div className="w-full h-full bg-[#181920] p-1.5 flex flex-col justify-between">
                              <div
                                className="w-2/3 h-2 rounded-xs"
                                style={{ background: mainSurf.accentHex }}
                              />
                              <div className="w-full h-3 rounded-xs bg-slate-800" />
                            </div>
                          )}
                        </div>
                        <span
                          className={`text-[11px] ${
                            selected ? 'font-semibold' : 'opacity-75'
                          }`}
                        >
                          {m.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 2: Global Theme Color Swatches + Custom Hex */}
              <div className="pt-3 border-t border-current/10 space-y-2.5">
                <div className="font-semibold text-[11px] opacity-65">
                  Global Theme &amp; Accent Color
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="opacity-85">Preset Color</span>
                  <div className="flex items-center gap-1.5">
                    {ACCENT_COLORS.map((acc) => {
                      const active = accentColorId === acc.id;
                      return (
                        <button
                          key={acc.id}
                          type="button"
                          onClick={() => onChangeAccentColorId(acc.id)}
                          title={acc.label}
                          className={`w-4 h-4 rounded-full ${
                            active
                              ? 'ring-2 ring-offset-1 ring-current'
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
                  </div>
                </div>

                {/* Custom Hex Color Row */}
                <div className="flex items-center justify-between gap-2">
                  <span className="opacity-85">Custom Hex</span>
                  <div className="flex items-center gap-1.5 bg-black/10 dark:bg-white/10 rounded-lg px-2 py-1">
                    <input
                      type="color"
                      aria-label="Popover Custom Accent Color Picker"
                      value={normalizeHexColor(customAccentHex)}
                      onChange={(e) => onChangeCustomAccentHex(e.target.value)}
                      className="w-4 h-4 rounded cursor-pointer border-0 bg-transparent p-0"
                    />
                    <input
                      type="text"
                      aria-label="Popover Custom Accent Hex"
                      value={customAccentHex}
                      onChange={(e) => onChangeCustomAccentHex(e.target.value)}
                      placeholder="#FF5A79"
                      maxLength={7}
                      className="w-16 bg-transparent font-mono text-[11px] uppercase focus:outline-none"
                    />
                  </div>
                </div>

                {/* Icon & widget style */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="opacity-85">Surface style</span>
                  <div className="grid grid-cols-5 gap-1.5">
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
                            className={`w-9 h-9 rounded-xl border-2 flex items-center justify-center ${
                              active ? 'shadow-xs' : 'border-current/15'
                            }`}
                            style={{
                              borderColor: active
                                ? mainSurf.accentHex
                                : undefined,
                              background:
                                st.id === 'dark'
                                  ? '#24252C'
                                  : st.id === 'clear'
                                    ? 'rgba(255,255,255,0.35)'
                                    : st.id === 'tinted'
                                      ? mainSurf.accentHex
                                      : st.id === 'solid'
                                        ? '#EAE8E3'
                                        : '#E8EFF8',
                              color:
                                st.id === 'tinted' || st.id === 'dark'
                                  ? '#FFFFFF'
                                  : '#007AFF',
                            }}
                          >
                            <CloudSun className="w-4 h-4" />
                          </div>
                          <span
                            className={`text-[10px] ${
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
              </div>

              {/* Section 3: Atmosphere Preset & Full Studio Link */}
              <div className="pt-3 border-t border-current/10 flex items-center justify-between">
                <select
                  aria-label="Select Atmosphere Preset"
                  value={activeThemeId}
                  onChange={(e) => onSelectTheme(e.target.value)}
                  className="bg-black/10 dark:bg-white/10 rounded-lg px-2.5 py-1.5 text-xs font-medium"
                >
                  {themes.map((t) => (
                    <option
                      key={t.id}
                      value={t.id}
                      className="bg-stone-900 text-white"
                    >
                      {t.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => {
                    setShowAppearancePopover(false);
                    onOpenControlCenter();
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                  style={{ background: mainSurf.accentHex }}
                >
                  Open Full Studio…
                </button>
              </div>

              {/* Section 4: Author, Portfolio & Instagram Attribution (Requirement G) */}
              <div className="pt-2.5 border-t border-current/10 space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="opacity-60 block text-[10px]">Author</span>
                    <span className="font-semibold">
                      {DEVELOPER_ATTRIBUTION.author}
                    </span>
                  </div>
                  <a
                    href={DEVELOPER_ATTRIBUTION.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium opacity-75 hover:opacity-100 hover:underline"
                  >
                    <span>GitHub ↗</span>
                  </a>
                </div>
                <div>
                  <span className="opacity-60 block text-[10px]">
                    Portfolio
                  </span>
                  <a
                    href={DEVELOPER_ATTRIBUTION.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold hover:underline"
                  >
                    <span>{DEVELOPER_ATTRIBUTION.portfolioLabel} ↗</span>
                  </a>
                </div>
                <div>
                  <span className="opacity-60 block text-[10px]">
                    Instagram
                  </span>
                  <a
                    href={DEVELOPER_ATTRIBUTION.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold hover:underline"
                  >
                    <span>{DEVELOPER_ATTRIBUTION.instagramLabel} ↗</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EXPANDED NOTE EDITOR MODAL */}
        {showExpandedNoteModal && activeNote && (
          <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4">
            <div
              className="w-full max-w-lg rounded-[24px] p-5 border shadow-2xl space-y-3"
              style={buildCardStyle(getWidgetConfig('notes'))}
            >
              <div className="flex items-center justify-between pb-2 border-b border-current/10">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm font-semibold">
                    Expanded Note Editor
                  </span>
                  <span className="text-[11px] opacity-65">
                    ({noteSaveStatus === 'saving' ? 'Autosaving…' : 'Saved'})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowExpandedNoteModal(false)}
                  className="px-2.5 py-1 rounded-lg bg-black/10 dark:bg-white/10 text-xs font-medium"
                >
                  Done
                </button>
              </div>
              <input
                type="text"
                aria-label="Expanded Note Title"
                value={noteTitleDraft}
                onChange={(e) => {
                  setNoteTitleDraft(e.target.value);
                  scheduleNoteAutosave(
                    activeNote.id,
                    e.target.value,
                    noteBodyDraft
                  );
                }}
                className="w-full bg-black/5 dark:bg-white/10 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none"
              />
              <textarea
                rows={8}
                aria-label="Expanded Note Content"
                value={noteBodyDraft}
                onChange={(e) => {
                  setNoteBodyDraft(e.target.value);
                  scheduleNoteAutosave(
                    activeNote.id,
                    noteTitleDraft,
                    e.target.value
                  );
                }}
                className="w-full bg-black/5 dark:bg-white/10 rounded-xl p-3 text-xs leading-relaxed focus:outline-none resize-y"
              />
            </div>
          </div>
        )}

        {/* WIDGETWALL DESKTOP GRID COMPOSITION (ALL 10 WIDGETS — ZERO HOVER TRANSFORMATIONS) */}
        <div className="relative z-10 flex-1 px-4 sm:px-6 py-4 max-w-[1380px] w-full mx-auto flex flex-col justify-center">
          {focusedWidget !== 'all' && (
            <div className="w-full mb-3 flex items-center justify-between">
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-black/25 text-white backdrop-blur-md">
                Focused Widget Inspection: {getWidgetConfig(focusedWidget).title}{' '}
                ({getWidgetConfig(focusedWidget).configId})
              </span>
              <button
                type="button"
                onClick={() => setFocusedWidget('all')}
                className="text-xs font-semibold px-3 py-1 rounded-full bg-white/85 text-stone-900"
              >
                Show Full WidgetWall (All 10)
              </button>
            </div>
          )}

          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
            {/* ================= LEFT CLUSTER (5 COLUMNS) ================= */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-6 gap-3.5 content-start">
              {/* 1. CLOCK & ALARM MANAGER WIDGET (2-SLIDE MANUAL NAVIGATION ONLY) */}
              {isWidgetVisible('clock') && (
                <div
                  style={buildCardStyle(getWidgetConfig('clock'))}
                  data-testid="widget-clock"
                  className="sm:col-span-6 px-5 py-4 min-h-[142px] flex flex-col justify-between relative overflow-hidden"
                >
                  <WidgetBackgroundLayer
                    widgetId="clock"
                    config={getWidgetBg('clock')}
                    isDarkSurface={clockSurf.isDarkSurface}
                  />
                  {renderEditOverlay(getWidgetConfig('clock'))}

                  {/* Active Due Alarm Banner (Simultaneous Due Queue) */}
                  {dueAlarmQueue.length > 0 && (
                    <div
                      data-testid="due-alarm-banner"
                      className="relative z-10 mb-2.5 px-3 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 flex flex-wrap items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center gap-1.5 font-semibold">
                        <BellRing className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
                        <span>
                          {dueAlarmQueue[0].label} ({dueAlarmQueue[0].time})
                        </span>
                        {dueAlarmQueue.length > 1 && (
                          <span className="text-[10px] opacity-75">
                            +{dueAlarmQueue.length - 1} queued
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            onSnoozeDueAlarm(
                              dueAlarmQueue[0].alarmId,
                              dueAlarmQueue[0].snoozeMinutes || 10
                            )
                          }
                          className="px-2 py-0.5 rounded-md bg-black/15 dark:bg-white/15 text-[11px] font-medium"
                        >
                          Snooze {dueAlarmQueue[0].snoozeMinutes || 10}m
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            onStopDueAlarm(dueAlarmQueue[0].alarmId)
                          }
                          className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[11px] font-semibold"
                        >
                          Stop
                        </button>
                      </div>
                    </div>
                  )}

                  {clockSlide === 0 ? (
                    /* SLIDE 1: MAIN CLOCK DISPLAY */
                    <div className="relative z-10 flex flex-col justify-between flex-1">
                      <div className="flex items-center justify-between gap-2">
                        {/* Subtle Active Alarm Indicator Badge */}
                        {alarmSummary.enabledCount > 0 ? (
                          <button
                            type="button"
                            data-testid="clock-alarm-badge"
                            onClick={() => setClockSlide(1)}
                            title="Open Alarm Manager (Slide 2)"
                            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium"
                            style={{ background: clockSurf.subtleFill }}
                          >
                            <Bell
                              className="w-3 h-3"
                              style={{ color: clockSurf.accentHex }}
                            />
                            <span className="tabular-nums">
                              {alarmSummary.nextAlarm?.time || 'Active'} ·{' '}
                              {alarmSummary.enabledCount}
                            </span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            data-testid="clock-alarm-badge"
                            onClick={() => setClockSlide(1)}
                            className="text-[11px] opacity-65 underline decoration-current/30"
                          >
                            No active alarms
                          </button>
                        )}

                        {/* Permanently visible subtle Clock controls + Manual Slide Navigation */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={onToggle24h}
                            className="px-2 py-0.5 text-[10px] font-medium rounded-full"
                            style={{ background: clockSurf.subtleFill }}
                          >
                            {use24h ? '24h' : '12h'}
                          </button>
                          <button
                            type="button"
                            onClick={onToggleSeconds}
                            className="px-2 py-0.5 text-[10px] font-medium rounded-full"
                            style={{ background: clockSurf.subtleFill }}
                          >
                            {showSeconds ? 'Sec' : '+Sec'}
                          </button>
                          <button
                            type="button"
                            data-testid="clock-next-slide"
                            onClick={() => setClockSlide(1)}
                            aria-label="Open Alarm Manager Slide"
                            className="px-2 py-0.5 text-[10px] font-semibold rounded-full flex items-center gap-0.5 text-white"
                            style={{ background: clockSurf.accentHex }}
                          >
                            <span>Alarms</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 my-1">
                        <span className="text-[46px] sm:text-[50px] leading-none font-light tracking-tight tabular-nums">
                          {clockFormatted.time}
                        </span>
                        {!use24h && (
                          <span
                            data-testid="clock-period-badge"
                            className="text-lg sm:text-xl font-semibold mt-1.5 tracking-normal"
                            style={{ color: clockSurf.accentHex }}
                          >
                            {clockFormatted.period}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-2 text-[13px]">
                        <div className="flex items-center gap-1.5">
                          <span
                            data-testid="clock-accent-dot"
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ background: clockSurf.accentHex }}
                          />
                          <span style={{ color: clockSurf.mutedTextColor }}>
                            {now.toLocaleDateString(
                              calLocale === 'id-ID' ? 'id-ID' : 'en-US',
                              {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                              }
                            )}
                            ,
                          </span>
                          <span className="font-semibold">
                            {currentWeatherData.city}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] tabular-nums">
                          <span className="opacity-65">Slide 1 / 2</span>
                          <button
                            type="button"
                            onClick={() => setClockSlide(1)}
                            aria-label="Next Clock Slide"
                            className="px-1.5 py-0.5 rounded bg-black/8 dark:bg-white/10 font-bold"
                          >
                            ›
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* SLIDE 2: MULTI-ALARM MANAGER */
                    <div
                      data-testid="clock-alarm-slide"
                      className="relative z-10 flex flex-col justify-between space-y-2"
                    >
                      <div className="flex items-center justify-between gap-1 pb-1.5 border-b border-current/10">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            data-testid="clock-prev-slide"
                            onClick={() => {
                              setShowAlarmEditor(false);
                              setClockSlide(0);
                            }}
                            aria-label="Back to Main Clock"
                            className="px-1.5 py-0.5 rounded-full text-xs font-bold"
                            style={{ background: clockSurf.subtleFill }}
                          >
                            ‹ Clock
                          </button>
                          <span className="text-xs font-semibold">
                            Alarms ({alarmSummary.enabledCount} active)
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => onTriggerTestAlarm()}
                            className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                            style={{ background: clockSurf.subtleFill }}
                            title="Simulate Due Alarm Notification"
                          >
                            Ring Test
                          </button>
                          <button
                            type="button"
                            data-testid="alarm-open-editor-btn"
                            onClick={() =>
                              showAlarmEditor
                                ? setShowAlarmEditor(false)
                                : openNewAlarmEditor()
                            }
                            className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-white flex items-center gap-0.5"
                            style={{ background: clockSurf.accentHex }}
                          >
                            <Plus className="w-3 h-3" />
                            {showAlarmEditor ? 'Close' : 'Add'}
                          </button>
                        </div>
                      </div>

                      {/* Unified Global Alarm Ringtone Setting (Applies to ALL Alarms — Plain Text Path Input e.g. ~/Music/) */}
                      <div className="p-2 rounded-xl bg-black/6 dark:bg-white/6 space-y-1 text-[10px]">
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="font-semibold opacity-85">
                            Nada Dering Alarm (Berlaku untuk Semua Alarm):
                          </span>
                          <span className="font-mono opacity-65 truncate max-w-[160px]">
                            {alarms[0]?.customAudioPath || alarmCustomAudioPath || '~/Music/'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            aria-label="Custom Local Ringtone Path"
                            data-testid="alarm-local-ringtone-path-input"
                            value={alarmCustomAudioPath}
                            onChange={(e) => {
                              setAlarmCustomAudioPath(e.target.value);
                              setAlarmCustomAudioError('');
                            }}
                            placeholder="~/Music/ atau ~/Music/alarm.mp3"
                            className="flex-1 bg-black/10 dark:bg-white/10 rounded-lg px-2 py-1 text-[10px] font-mono focus:outline-none"
                          />
                          <button
                            type="button"
                            data-testid="alarm-apply-global-ringtone-btn"
                            onClick={() => applyUnifiedAlarmRingtone()}
                            className="px-2 py-1 rounded-lg text-white font-semibold text-[10px] shrink-0"
                            style={{ background: clockSurf.accentHex }}
                          >
                            Terapkan
                          </button>
                          <button
                            type="button"
                            aria-label="Preview Ringtone"
                            data-testid="alarm-preview-ringtone-btn"
                            onClick={() =>
                              playChimePreview(
                                'custom-local',
                                alarmVolumeDraft
                              )
                            }
                            className="px-2 py-1 rounded-lg bg-black/10 dark:bg-white/10 font-semibold text-[10px] shrink-0 flex items-center gap-1"
                            title="Preview Nada Dering"
                          >
                            {previewingRingtoneId === 'custom-local' ? (
                              <>
                                <VolumeX className="w-3 h-3 text-rose-500" />
                                <span>Stop</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3 h-3" />
                                <span>Test</span>
                              </>
                            )}
                          </button>
                        </div>
                        {alarmCustomAudioError && (
                          <p className="text-[10px] text-rose-500">
                            {alarmCustomAudioError}
                          </p>
                        )}
                      </div>

                      {showAlarmEditor ? (
                        <form
                          onSubmit={handleSaveAlarmForm}
                          className="space-y-2 text-[11px] bg-black/5 dark:bg-white/5 p-2.5 rounded-xl"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end">
                            {/* Dedicated Hour (00-23) & Minute (00-59) Time Picker with Clear button */}
                            <div
                              data-testid="alarm-time-picker"
                              className="sm:col-span-8 space-y-0.5"
                            >
                              <div className="flex items-center justify-between">
                                <span className="opacity-70">
                                  Time Picker (Hour 00–23 : Minute 00–59)
                                </span>
                                <button
                                  type="button"
                                  data-testid="alarm-clear-time-btn"
                                  onClick={() => setAlarmTimeDraft('07:00')}
                                  className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 text-[9px] font-semibold"
                                  title="Clear and reset time selection to 07:00"
                                >
                                  Clear (07:00)
                                </button>
                              </div>
                              <div className="flex items-center gap-1 bg-black/10 dark:bg-white/10 rounded-lg px-2 py-1">
                                <button
                                  type="button"
                                  aria-label="Decrement Alarm Hour"
                                  onClick={() => {
                                    const parts =
                                      parseAlarmTimeParts(alarmTimeDraft);
                                    setAlarmTimeDraft(
                                      formatAlarmTimeParts(
                                        (parts.hour + 23) % 24,
                                        parts.minute
                                      )
                                    );
                                  }}
                                  className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono text-xs"
                                >
                                  -
                                </button>
                                <select
                                  aria-label="Alarm Hour"
                                  value={
                                    parseAlarmTimeParts(alarmTimeDraft).hour
                                  }
                                  onChange={(e) => {
                                    const parts =
                                      parseAlarmTimeParts(alarmTimeDraft);
                                    setAlarmTimeDraft(
                                      formatAlarmTimeParts(
                                        Number(e.target.value),
                                        parts.minute
                                      )
                                    );
                                  }}
                                  className="bg-transparent font-mono font-bold text-xs tabular-nums focus:outline-none"
                                >
                                  {Array.from({ length: 24 }).map((_, h) => (
                                    <option
                                      key={h}
                                      value={h}
                                      className="bg-stone-900 text-white"
                                    >
                                      {String(h).padStart(2, '0')}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  type="button"
                                  aria-label="Increment Alarm Hour"
                                  onClick={() => {
                                    const parts =
                                      parseAlarmTimeParts(alarmTimeDraft);
                                    setAlarmTimeDraft(
                                      formatAlarmTimeParts(
                                        (parts.hour + 1) % 24,
                                        parts.minute
                                      )
                                    );
                                  }}
                                  className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono text-xs"
                                >
                                  +
                                </button>
                                <span className="font-mono font-bold px-0.5">
                                  :
                                </span>
                                <button
                                  type="button"
                                  aria-label="Decrement Alarm Minute"
                                  onClick={() => {
                                    const parts =
                                      parseAlarmTimeParts(alarmTimeDraft);
                                    setAlarmTimeDraft(
                                      formatAlarmTimeParts(
                                        parts.hour,
                                        (parts.minute + 59) % 60
                                      )
                                    );
                                  }}
                                  className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono text-xs"
                                >
                                  -
                                </button>
                                <select
                                  aria-label="Alarm Minute"
                                  value={
                                    parseAlarmTimeParts(alarmTimeDraft).minute
                                  }
                                  onChange={(e) => {
                                    const parts =
                                      parseAlarmTimeParts(alarmTimeDraft);
                                    setAlarmTimeDraft(
                                      formatAlarmTimeParts(
                                        parts.hour,
                                        Number(e.target.value)
                                      )
                                    );
                                  }}
                                  className="bg-transparent font-mono font-bold text-xs tabular-nums focus:outline-none"
                                >
                                  {Array.from({ length: 60 }).map((_, m) => (
                                    <option
                                      key={m}
                                      value={m}
                                      className="bg-stone-900 text-white"
                                    >
                                      {String(m).padStart(2, '0')}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  type="button"
                                  aria-label="Increment Alarm Minute"
                                  onClick={() => {
                                    const parts =
                                      parseAlarmTimeParts(alarmTimeDraft);
                                    setAlarmTimeDraft(
                                      formatAlarmTimeParts(
                                        parts.hour,
                                        (parts.minute + 1) % 60
                                      )
                                    );
                                  }}
                                  className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <label className="sm:col-span-4 space-y-0.5">
                              <span className="opacity-70 block">Label</span>
                              <input
                                type="text"
                                aria-label="Alarm Label"
                                value={alarmLabelDraft}
                                onChange={(e) =>
                                  setAlarmLabelDraft(e.target.value)
                                }
                                placeholder="Wake Up"
                                className="w-full bg-black/10 dark:bg-white/10 rounded-lg px-2 py-1"
                              />
                            </label>
                          </div>

                          {/* Repeat Days Selector + One-Time Date */}
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center justify-between gap-1">
                              <span className="opacity-70">
                                Schedule ({alarmRepeatDraft.length === 0 ? 'One-Time Date' : 'Recurring'})
                              </span>
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setAlarmRepeatDraft([...ALL_ALARM_DAYS])
                                  }
                                  className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 text-[10px]"
                                >
                                  Daily
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setAlarmRepeatDraft([
                                      'Mon',
                                      'Tue',
                                      'Wed',
                                      'Thu',
                                      'Fri',
                                    ])
                                  }
                                  className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 text-[10px]"
                                >
                                  Weekdays
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setAlarmRepeatDraft([])}
                                  className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 text-[10px]"
                                >
                                  Once
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {ALL_ALARM_DAYS.map((d) => {
                                const active = alarmRepeatDraft.includes(d);
                                return (
                                  <button
                                    key={d}
                                    type="button"
                                    onClick={() => toggleRepeatDayInDraft(d)}
                                    className={`flex-1 py-0.5 rounded text-[10px] font-medium ${
                                      active
                                        ? 'text-white font-semibold'
                                        : 'bg-black/8 dark:bg-white/8 opacity-70'
                                    }`}
                                    style={
                                      active
                                        ? { background: clockSurf.accentHex }
                                        : undefined
                                    }
                                  >
                                    {d.slice(0, 2)}
                                  </button>
                                );
                              })}
                            </div>
                            {alarmRepeatDraft.length === 0 && (
                              <div className="flex items-center justify-between pt-0.5 text-[10px]">
                                <span className="opacity-70">
                                  One-time alarm date:
                                </span>
                                <input
                                  type="date"
                                  aria-label="One-time Alarm Date"
                                  value={alarmOneTimeDate}
                                  onChange={(e) =>
                                    setAlarmOneTimeDate(e.target.value)
                                  }
                                  className="bg-black/10 dark:bg-white/10 rounded px-2 py-0.5 font-mono"
                                />
                              </div>
                            )}
                          </div>

                          {/* Snooze & Volume (Ringtone is unified globally above) */}
                          <div className="grid grid-cols-2 gap-2 items-end">
                            <div className="space-y-0.5">
                              <div className="flex items-center justify-between">
                                <span className="opacity-70">Snooze (m)</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setAlarmSnoozeIsCustom((p) => !p)
                                  }
                                  className="text-[9px] underline opacity-75"
                                >
                                  {alarmSnoozeIsCustom ? 'Presets' : 'Custom'}
                                </button>
                              </div>
                              {alarmSnoozeIsCustom ? (
                                <input
                                  type="number"
                                  aria-label="Custom Snooze Minutes"
                                  min={1}
                                  max={120}
                                  value={alarmSnoozeDraft}
                                  onChange={(e) =>
                                    setAlarmSnoozeDraft(
                                      Math.max(
                                        1,
                                        Math.min(120, Number(e.target.value))
                                      )
                                    )
                                  }
                                  className="w-full bg-black/10 dark:bg-white/10 rounded-lg px-2 py-1 text-[10px] font-mono tabular-nums"
                                />
                              ) : (
                                <select
                                  aria-label="Snooze Duration"
                                  value={alarmSnoozeDraft}
                                  onChange={(e) =>
                                    setAlarmSnoozeDraft(
                                      Number(e.target.value)
                                    )
                                  }
                                  className="w-full bg-black/10 dark:bg-white/10 rounded-lg px-1.5 py-1 text-[10px]"
                                >
                                  {[5, 10, 15, 20, 30].map((m) => (
                                    <option
                                      key={m}
                                      value={m}
                                      className="bg-stone-900 text-white"
                                    >
                                      {m} min
                                    </option>
                                  ))}
                                </select>
                              )}
                            </div>
                            <label className="space-y-0.5">
                              <span className="opacity-70 block">
                                Vol {alarmVolumeDraft}%
                              </span>
                              <input
                                type="range"
                                aria-label="Alarm Volume"
                                min={10}
                                max={100}
                                value={alarmVolumeDraft}
                                onChange={(e) =>
                                  setAlarmVolumeDraft(Number(e.target.value))
                                }
                                className="w-full"
                              />
                            </label>
                          </div>

                          {/* Cancel / Confirm Buttons */}
                          <div className="flex items-center justify-end gap-1.5 pt-0.5">
                            <button
                              type="button"
                              data-testid="alarm-cancel-btn"
                              onClick={() => {
                                stopAlarmAudioElement();
                                setShowAlarmEditor(false);
                                setEditingAlarmId(null);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-black/10 dark:bg-white/10 font-medium text-[11px]"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              data-testid="alarm-save-btn"
                              className="px-3 py-1 rounded-lg text-white font-semibold text-[11px]"
                              style={{ background: clockSurf.accentHex }}
                            >
                              Confirm &amp; Save
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="space-y-1.5 max-h-[125px] overflow-y-auto pr-0.5">
                          {alarms.map((alm) => (
                            <div
                              key={alm.id}
                              className="px-2.5 py-1.5 rounded-xl flex items-center justify-between gap-2 text-xs"
                              style={{ background: clockSurf.subtleFill }}
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-baseline gap-1.5">
                                  <span
                                    className={`text-sm font-semibold tabular-nums ${
                                      alm.enabled ? '' : 'opacity-45'
                                    }`}
                                  >
                                    {alm.time}
                                  </span>
                                  <span
                                    className={`font-medium truncate ${
                                      alm.enabled ? '' : 'opacity-45'
                                    }`}
                                  >
                                    — {alm.label}
                                  </span>
                                </div>
                                <div className="text-[10px] opacity-65 truncate">
                                  {formatAlarmRepeat(
                                    alm.repeatDays,
                                    alm.oneTimeDateIso
                                  )}{' '}
                                  · Snooze {alm.snoozeMinutes}m · ♪{' '}
                                  {alm.customAudioPath ||
                                    alarmCustomAudioPath ||
                                    '~/Music/'}
                                </div>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  aria-label={`Edit ${alm.label}`}
                                  onClick={() => openEditAlarmEditor(alm)}
                                  className="p-1 rounded-full bg-black/8 dark:bg-white/8"
                                >
                                  <Pencil className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  aria-label={`Delete ${alm.label}`}
                                  onClick={() => onDeleteAlarm(alm.id)}
                                  className="p-1 rounded-full bg-black/8 dark:bg-white/8"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  role="switch"
                                  aria-checked={alm.enabled}
                                  aria-label={`Toggle ${alm.label}`}
                                  onClick={() => onToggleAlarm(alm.id)}
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-colors ${
                                    alm.enabled
                                      ? 'text-white'
                                      : 'bg-black/15 dark:bg-white/15 opacity-60'
                                  }`}
                                  style={
                                    alm.enabled
                                      ? { background: clockSurf.accentHex }
                                      : undefined
                                  }
                                >
                                  {alm.enabled ? 'ON' : 'OFF'}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* 2. PHOTO FRAME CARD (Middle-Left Square, 3 cols — Clean Pure Image Only with Smooth Opacity Crossfade) */}
              {isWidgetVisible('photos') && (
                <div
                  data-testid="widget-photos"
                  style={{
                    borderRadius: `${photoSurf.effectiveRadius}px`,
                    boxShadow: photoSurf.shadowCss,
                  }}
                  className="sm:col-span-3 relative min-h-[172px] overflow-hidden border border-white/50 dark:border-white/15 bg-stone-900"
                >
                  {renderEditOverlay(getWidgetConfig('photos'))}

                  <div className="absolute inset-0 overflow-hidden">
                    {activePhotoList.map((slide, idx) => {
                      const isCurrent =
                        idx === photoSlideIndex % activePhotoList.length;
                      return (
                        <Image
                          key={slide.src}
                          src={slide.src}
                          alt={slide.title}
                          fill
                          priority
                          sizes="(max-width: 1024px) 50vw, 280px"
                          referrerPolicy="no-referrer"
                          className={`transition-opacity duration-700 ease-in-out will-change-[opacity] ${
                            isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0'
                          }`}
                          style={{
                            objectFit: 'cover',
                            objectPosition: 'center center',
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. WEATHER CARD (Middle-Right of Left Cluster, 3 cols) */}
              {isWidgetVisible('weather') && (
                <div
                  style={buildCardStyle(getWidgetConfig('weather'))}
                  data-testid="widget-weather"
                  className="sm:col-span-3 p-4 min-h-[172px] flex flex-col justify-between relative overflow-hidden"
                >
                  <WidgetBackgroundLayer
                    widgetId="weather"
                    config={getWidgetBg('weather')}
                    isDarkSurface={weatherSurf.isDarkSurface}
                  />
                  {renderEditOverlay(getWidgetConfig('weather'))}

                  <div className="relative z-10">
                    <div className="flex items-center justify-between gap-1">
                      <select
                        aria-label="Select Weather Location"
                        value={weatherCity}
                        onChange={(e) => onChangeWeatherCity(e.target.value)}
                        className="bg-transparent font-semibold text-[13px] focus:outline-none cursor-pointer truncate max-w-[110px]"
                      >
                        {Object.keys(WEATHER_CITIES).map((city) => (
                          <option
                            key={city}
                            value={city}
                            className="bg-stone-900 text-white"
                          >
                            {WEATHER_CITIES[city].city}
                          </option>
                        ))}
                      </select>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={onToggleCelsius}
                          aria-label="Toggle Temperature Unit"
                          className="px-1.5 py-0.5 text-[10px] font-semibold rounded-full"
                          style={{ background: weatherSurf.subtleFill }}
                        >
                          {useCelsius ? '°C' : '°F'}
                        </button>
                        <button
                          type="button"
                          onClick={onToggleWeatherOffline}
                          aria-label="Toggle Offline Cache Simulation"
                          className="p-1 rounded-full"
                          style={{ background: weatherSurf.subtleFill }}
                          title={
                            weatherOffline
                              ? 'SQLite Offline Cache'
                              : 'Online Forecast'
                          }
                        >
                          {weatherOffline ? (
                            <WifiOff className="w-2.5 h-2.5" />
                          ) : (
                            <Wifi className="w-2.5 h-2.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowWeatherForecast((p) => !p);
                            onRefreshWeather();
                          }}
                          aria-label="Toggle Hourly Forecast"
                          className="p-1 rounded-full"
                          style={{ background: weatherSurf.subtleFill }}
                        >
                          <RefreshCw className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-[36px] leading-none font-light tracking-tight tabular-nums mt-1">
                      {formatTempDegreeOnly(
                        currentWeatherData.tempC,
                        useCelsius
                      )}
                    </div>
                  </div>

                  {showWeatherForecast ? (
                    <div className="relative z-10 grid grid-cols-4 gap-1 pt-1.5 border-t border-current/10 text-center text-[10px] tabular-nums">
                      {currentWeatherData.hourly.map((h) => (
                        <div
                          key={h.hour}
                          className="py-1 rounded-md"
                          style={{ background: weatherSurf.subtleFill }}
                        >
                          <div className="opacity-70">{h.hour.slice(0, 2)}</div>
                          <div className="font-semibold mt-0.5">
                            {formatTempDegreeOnly(h.tempC, useCelsius)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="relative z-10 space-y-0.5">
                      <Sun
                        className="w-4 h-4 text-amber-500 fill-amber-400 mb-0.5"
                        strokeWidth={2}
                      />
                      <div className="text-[12px] font-medium leading-tight">
                        {currentWeatherData.condition}
                        {weatherOffline ? ' (Cached)' : ''}
                      </div>
                      <div
                        className="text-[11px] font-medium tabular-nums"
                        style={{ color: weatherSurf.mutedTextColor }}
                      >
                        H:
                        {formatTempDegreeOnly(
                          currentWeatherData.highC,
                          useCelsius
                        )}{' '}
                        L:
                        {formatTempDegreeOnly(
                          currentWeatherData.lowC,
                          useCelsius
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 4. POMODORO FOCUS CARD (3 cols — Circular Ring + Central Timer) */}
              {isWidgetVisible('pomodoro') && (
                <div
                  style={buildCardStyle(getWidgetConfig('pomodoro'))}
                  data-testid="widget-pomodoro"
                  className="sm:col-span-3 p-3.5 min-h-[172px] flex flex-col justify-between items-center relative overflow-hidden"
                >
                  <WidgetBackgroundLayer
                    widgetId="pomodoro"
                    config={getWidgetBg('pomodoro')}
                    isDarkSurface={pomoSurf.isDarkSurface}
                  />
                  {renderEditOverlay(getWidgetConfig('pomodoro'))}

                  <button
                    type="button"
                    onClick={() => setShowPomoConfig((p) => !p)}
                    className="relative z-10 self-end px-2 py-0.5 text-[9px] font-medium rounded-full"
                    style={{ background: pomoSurf.subtleFill }}
                  >
                    {showPomoConfig ? 'Done' : 'Set'}
                  </button>

                  {showPomoConfig ? (
                    <div className="relative z-10 w-full my-auto space-y-2 text-xs p-1">
                      <div className="font-semibold text-center text-[11px]">
                        Timer Durations (m)
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 text-center">
                        <label className="space-y-0.5">
                          <span className="text-[10px] opacity-75 block">
                            Focus
                          </span>
                          <input
                            type="number"
                            aria-label="Study Minutes"
                            min={1}
                            max={120}
                            value={pomoStudyDraft}
                            onChange={(e) =>
                              setPomoStudyDraft(Number(e.target.value))
                            }
                            className="w-full text-center bg-black/10 dark:bg-white/10 rounded-lg py-0.5 font-mono tabular-nums"
                          />
                        </label>
                        <label className="space-y-0.5">
                          <span className="text-[10px] opacity-75 block">
                            Short
                          </span>
                          <input
                            type="number"
                            aria-label="Short Break Minutes"
                            min={1}
                            max={60}
                            value={pomoShortDraft}
                            onChange={(e) =>
                              setPomoShortDraft(Number(e.target.value))
                            }
                            className="w-full text-center bg-black/10 dark:bg-white/10 rounded-lg py-0.5 font-mono tabular-nums"
                          />
                        </label>
                        <label className="space-y-0.5">
                          <span className="text-[10px] opacity-75 block">
                            Long
                          </span>
                          <input
                            type="number"
                            aria-label="Long Break Minutes"
                            min={1}
                            max={90}
                            value={pomoLongDraft}
                            onChange={(e) =>
                              setPomoLongDraft(Number(e.target.value))
                            }
                            className="w-full text-center bg-black/10 dark:bg-white/10 rounded-lg py-0.5 font-mono tabular-nums"
                          />
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onUpdatePomodoroDurations(
                            pomoStudyDraft,
                            pomoShortDraft,
                            pomoLongDraft
                          );
                          setShowPomoConfig(false);
                        }}
                        className="w-full py-1 rounded-lg text-white font-semibold text-xs"
                        style={{ background: pomoSurf.accentHex }}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="relative z-10 w-[104px] h-[104px] flex items-center justify-center my-auto">
                        <svg
                          className="w-full h-full -rotate-90"
                          viewBox="0 0 120 120"
                        >
                          <circle
                            cx="60"
                            cy="60"
                            r={ringRadius}
                            fill="none"
                            stroke="currentColor"
                            strokeOpacity={pomoSurf.isDarkSurface ? 0.14 : 0.1}
                            strokeWidth="7"
                          />
                          <circle
                            data-testid="pomodoro-progress-ring"
                            cx="60"
                            cy="60"
                            r={ringRadius}
                            fill="none"
                            stroke={pomoSurf.accentHex}
                            strokeWidth="7"
                            strokeLinecap="round"
                            strokeDasharray={ringCircumference}
                            strokeDashoffset={ringDashoffset}
                          />
                        </svg>

                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                          <span
                            className="text-[8px] font-semibold tracking-widest uppercase"
                            style={{ color: pomoSurf.mutedTextColor }}
                          >
                            {pomodoro.phase === 'Study'
                              ? 'FOCUS'
                              : pomodoro.phase === 'Short Break'
                                ? 'SHORT'
                                : 'BREAK'}
                          </span>
                          <span className="text-[19px] font-semibold tracking-tight tabular-nums leading-tight mt-0.5">
                            {formatPomodoroSeconds(pomodoro.remainingSecs)}
                          </span>
                          <button
                            type="button"
                            onClick={onPomodoroStartPause}
                            aria-label={
                              pomodoro.status === 'Running'
                                ? 'Pause Pomodoro'
                                : 'Start Pomodoro'
                            }
                            className="mt-0.5 p-1 rounded-full"
                            style={{ background: pomoSurf.subtleFill }}
                          >
                            {pomodoro.status === 'Running' ? (
                              <Pause className="w-3 h-3 fill-current" />
                            ) : (
                              <Play className="w-3 h-3 fill-current ml-0.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="relative z-10 w-full flex items-center justify-between px-1">
                        <button
                          type="button"
                          onClick={onPomodoroReset}
                          aria-label="Reset Pomodoro"
                          className="p-1 rounded-full opacity-75"
                          title="Reset Timer"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </button>

                        <div
                          className="flex items-center gap-1.5"
                          title={`Completed Sessions: ${pomodoro.completedSessions}`}
                        >
                          {[0, 1, 2, 3].map((dotIdx) => {
                            const filled =
                              dotIdx < (pomodoro.completedSessions % 5);
                            return (
                              <span
                                key={dotIdx}
                                className="w-1.5 h-1.5 rounded-full"
                                style={{
                                  background: filled
                                    ? pomoSurf.accentHex
                                    : pomoSurf.isDarkSurface
                                      ? 'rgba(255,255,255,0.22)'
                                      : 'rgba(0,0,0,0.18)',
                                }}
                              />
                            );
                          })}
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            onPomodoroPhase(
                              pomodoro.phase === 'Study'
                                ? 'Short Break'
                                : pomodoro.phase === 'Short Break'
                                  ? 'Long Break'
                                  : 'Study'
                            )
                          }
                          aria-label="Next Pomodoro Phase"
                          className="p-1 rounded-full opacity-75"
                          title="Switch Focus / Break Phase"
                        >
                          <SkipForward className="w-3 h-3" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* 5. QUICK ACTIONS CARD (3 cols — Zero Hover Scaling) */}
              {isWidgetVisible('quick_actions') && (
                <div
                  style={buildCardStyle(getWidgetConfig('quick_actions'))}
                  data-testid="widget-quick_actions"
                  className="sm:col-span-3 p-3.5 min-h-[172px] flex flex-col justify-between relative overflow-hidden"
                >
                  <WidgetBackgroundLayer
                    widgetId="quick_actions"
                    config={getWidgetBg('quick_actions')}
                    isDarkSurface={qaSurf.isDarkSurface}
                  />
                  {renderEditOverlay(getWidgetConfig('quick_actions'))}

                  <div className="relative z-10 flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold opacity-85">
                      Quick Actions
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          setQaGridCols((prev) => (prev === 2 ? 3 : 2))
                        }
                        className="px-1.5 py-0.5 text-[9px] font-medium rounded-full"
                        style={{ background: qaSurf.subtleFill }}
                      >
                        {qaGridCols}c
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddShortcut((p) => !p)}
                        className="px-1.5 py-0.5 text-[9px] font-medium rounded-full"
                        style={{ background: qaSurf.subtleFill }}
                      >
                        {showAddShortcut ? '×' : '+'}
                      </button>
                    </div>
                  </div>

                  {showAddShortcut ? (
                    <form
                      onSubmit={handleAddQuickActionSubmit}
                      className="relative z-10 my-auto space-y-1.5 text-xs"
                    >
                      <input
                        type="text"
                        aria-label="New Shortcut Label"
                        placeholder="Label (e.g. Downloads)"
                        value={newShortcutLabel}
                        onChange={(e) => setNewShortcutLabel(e.target.value)}
                        className="w-full bg-black/10 dark:bg-white/10 rounded-lg px-2 py-1 text-xs focus:outline-none"
                      />
                      <input
                        type="text"
                        aria-label="New Shortcut Command"
                        placeholder="xdg-open ~/Downloads"
                        value={newShortcutCmd}
                        onChange={(e) => setNewShortcutCmd(e.target.value)}
                        className="w-full bg-black/10 dark:bg-white/10 rounded-lg px-2 py-1 text-xs font-mono focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="w-full py-1 rounded-lg text-white font-semibold text-xs"
                        style={{ background: qaSurf.accentHex }}
                      >
                        Add Shortcut
                      </button>
                    </form>
                  ) : (
                    <div
                      className={`relative z-10 grid gap-1.5 my-auto ${
                        qaGridCols === 3 ? 'grid-cols-3' : 'grid-cols-2'
                      }`}
                    >
                      {quickActions.slice(0, 6).map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() =>
                            onTriggerQuickAction(item.label, item.command)
                          }
                          className="p-2 rounded-xl flex flex-col items-center justify-center gap-1 text-center"
                          style={{ background: qaSurf.subtleFill }}
                        >
                          {renderShortcutIcon(item.iconKey, qaSurf.accentHex)}
                          <span className="text-[10px] font-medium truncate w-full">
                            {item.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 6. NOTES WIDGET (6 cols — macOS Notes-inspired card with 400ms debounced autosave) */}
              {isWidgetVisible('notes') && (
                <div
                  style={buildCardStyle(getWidgetConfig('notes'))}
                  data-testid="widget-notes"
                  className="sm:col-span-6 p-4 min-h-[178px] flex flex-col justify-between relative overflow-hidden space-y-2"
                >
                  <WidgetBackgroundLayer
                    widgetId="notes"
                    config={getWidgetBg('notes')}
                    isDarkSurface={notesSurf.isDarkSurface}
                  />
                  {renderEditOverlay(getWidgetConfig('notes'))}

                  <div className="relative z-10 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <FileText
                        className="w-3.5 h-3.5"
                        style={{ color: notesSurf.accentHex }}
                      />
                      <span className="text-xs font-semibold tracking-tight">
                        Notes
                      </span>
                      <span className="text-[10px] opacity-60">
                        {noteSaveStatus === 'saving' ? 'Saving…' : 'Saved'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        aria-label="Search Notes"
                        onClick={() => setShowNoteSearch((p) => !p)}
                        className="p-1 rounded-full"
                        style={{ background: notesSurf.subtleFill }}
                        title="Search Notes"
                      >
                        <Search className="w-3 h-3" />
                      </button>
                      {activeNote && (
                        <>
                          <button
                            type="button"
                            aria-label="Pin Note"
                            onClick={() => onTogglePinNote(activeNote.id)}
                            className={`p-1 rounded-full ${
                              activeNote.pinned ? 'text-white' : ''
                            }`}
                            style={{
                              background: activeNote.pinned
                                ? notesSurf.accentHex
                                : notesSurf.subtleFill,
                            }}
                            title={activeNote.pinned ? 'Unpin Note' : 'Pin Note'}
                          >
                            <Pin className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            aria-label="Expand Note Editor"
                            onClick={() => setShowExpandedNoteModal(true)}
                            className="p-1 rounded-full"
                            style={{ background: notesSurf.subtleFill }}
                            title="Expand Editor"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </button>
                          {notes.length > 1 && (
                            <button
                              type="button"
                              aria-label="Delete Note"
                              onClick={() => {
                                const fallback = notes.find(
                                  (n) => n.id !== activeNote.id
                                );
                                onDeleteNote(activeNote.id);
                                if (fallback) selectNote(fallback);
                              }}
                              className="p-1 rounded-full"
                              style={{ background: notesSurf.subtleFill }}
                              title="Delete Note"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </>
                      )}
                      <button
                        type="button"
                        data-testid="notes-add-btn"
                        onClick={handleCreateNewNote}
                        className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-white flex items-center gap-0.5"
                        style={{ background: notesSurf.accentHex }}
                      >
                        <Plus className="w-3 h-3" />
                        New
                      </button>
                    </div>
                  </div>

                  {showNoteSearch && (
                    <div className="relative z-10">
                      <input
                        type="text"
                        aria-label="Filter Notes Query"
                        placeholder="Search notes by title, content, or tag..."
                        value={noteSearchQuery}
                        onChange={(e) => setNoteSearchQuery(e.target.value)}
                        className="w-full bg-black/8 dark:bg-white/10 rounded-lg px-2.5 py-1 text-xs focus:outline-none"
                      />
                    </div>
                  )}

                  {/* Saved Notes Switcher Strip */}
                  <div className="relative z-10 flex items-center gap-1 overflow-x-auto pb-0.5">
                    {filteredNotes.map((n) => {
                      const isSelected = activeNote?.id === n.id;
                      return (
                        <button
                          key={n.id}
                          type="button"
                          onClick={() => selectNote(n)}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-medium truncate max-w-[130px] shrink-0 flex items-center gap-1 ${
                            isSelected ? 'text-white font-semibold' : 'opacity-80'
                          }`}
                          style={{
                            background: isSelected
                              ? notesSurf.accentHex
                              : notesSurf.subtleFill,
                          }}
                        >
                          {n.pinned && <Pin className="w-2.5 h-2.5 shrink-0" />}
                          <span className="truncate">{n.title}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Note Title & Body Editor */}
                  {activeNote ? (
                    <div className="relative z-10 space-y-1 flex-1 flex flex-col">
                      <input
                        type="text"
                        aria-label="Note Title"
                        value={noteTitleDraft}
                        onChange={(e) => {
                          setNoteTitleDraft(e.target.value);
                          scheduleNoteAutosave(
                            activeNote.id,
                            e.target.value,
                            noteBodyDraft
                          );
                        }}
                        className="w-full bg-transparent font-semibold text-xs border-b border-current/10 pb-0.5 focus:outline-none"
                      />
                      <textarea
                        rows={3}
                        aria-label="Note Body"
                        value={noteBodyDraft}
                        onChange={(e) => {
                          setNoteBodyDraft(e.target.value);
                          scheduleNoteAutosave(
                            activeNote.id,
                            noteTitleDraft,
                            e.target.value
                          );
                        }}
                        placeholder="Type your note..."
                        className="w-full flex-1 bg-transparent text-[11px] leading-relaxed opacity-90 focus:outline-none resize-none"
                      />
                    </div>
                  ) : (
                    <div className="relative z-10 text-xs opacity-60 py-4 text-center">
                      No matching notes.
                    </div>
                  )}
                </div>
              )}

              {/* 6B. URWIDGETS MUSIC PLAYER (6 cols — Real Audio Output, Local Folder Scanner + Direct Stream URL) */}
              {isWidgetVisible('music_player') && (
                <div
                  style={buildCardStyle(getWidgetConfig('music_player'))}
                  data-testid="widget-music_player"
                  className="sm:col-span-6 p-4 min-h-[192px] flex flex-col justify-between relative overflow-hidden space-y-2.5"
                >
                  <WidgetBackgroundLayer
                    widgetId="music_player"
                    config={getWidgetBg('music_player')}
                    isDarkSurface={musicSurf.isDarkSurface}
                  />
                  {renderEditOverlay(getWidgetConfig('music_player'))}

                  {/* Header: Source Badge, Playback Status Badge & Source Switcher Toggle */}
                  <div className="relative z-10 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Music
                        className="w-3.5 h-3.5"
                        style={{ color: musicSurf.accentHex }}
                      />
                      <span className="text-xs font-semibold tracking-tight">
                        URWidgets Music
                      </span>
                      <span
                        data-testid="music-status-badge"
                        className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                          musicState.playbackStatus === 'Playing'
                            ? 'text-white'
                            : 'opacity-80'
                        }`}
                        style={{
                          background:
                            musicState.playbackStatus === 'Playing'
                              ? musicSurf.accentHex
                              : musicSurf.subtleFill,
                        }}
                      >
                        {musicState.pausedByAlarm
                          ? 'Paused by Alarm'
                          : musicState.playbackStatus}
                      </span>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full opacity-80"
                        style={{ background: musicSurf.subtleFill }}
                      >
                        {musicState.sourceType === 'stream'
                          ? 'Online Stream'
                          : musicState.activeFolderPath.replace(
                              '/home/mint/Music/',
                              ''
                            )}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        data-testid="music-source-toggle"
                        onClick={() => setShowMusicSourceDrawer((p) => !p)}
                        className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                        style={{ background: musicSurf.subtleFill }}
                      >
                        {showMusicSourceDrawer ? 'Player' : 'Sources & Stream'}
                      </button>
                    </div>
                  </div>

                  {/* Audio Priority Policy Notice when Alarm is Ringing */}
                  {musicState.pausedByAlarm && (
                    <div
                      data-testid="music-alarm-priority-banner"
                      className="relative z-10 px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/35 text-[10px] font-medium flex items-center justify-between gap-2"
                    >
                      <span>
                        Alarm Priority Active: Music auto-paused while alarm
                        rings.
                      </span>
                      <span className="font-mono opacity-80">Auto-Resume</span>
                    </div>
                  )}

                  {showMusicSourceDrawer ? (
                    <div
                      data-testid="music-source-drawer"
                      className="relative z-10 space-y-2 text-[11px] p-2.5 rounded-xl border"
                      style={{
                        background: musicSurf.glassTokens.glassSurfaceSecondary,
                        borderColor: musicSurf.glassTokens.glassBorder,
                      }}
                    >
                      {/* Mode 1: Local Music Path (Plain Text Input e.g. ~/Music/ — No Folder Picker Dialog) */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="opacity-80 font-semibold text-[10px]">
                            Path Musik Lokal (Tulis Folder / File, misal ~/Music/):
                          </span>
                          <span className="text-[9px] font-mono opacity-65">
                            Cache Hits: {musicState.metadataCacheHits ?? 1}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            aria-label="Local Music Folder or File Path"
                            data-testid="music-folder-path-input"
                            value={localMusicPathDraft}
                            onChange={(e) => {
                              setLocalMusicPathDraft(e.target.value);
                              if (musicSourceError) setMusicSourceError('');
                            }}
                            placeholder="~/Music/ atau ~/Music/LoFi"
                            className="flex-1 bg-black/10 dark:bg-white/10 rounded-lg px-2 py-1 text-[10px] font-mono focus:outline-none"
                          />
                          <button
                            type="button"
                            data-testid="music-apply-path-btn"
                            onClick={() =>
                              handleApplyLocalMusicPath(localMusicPathDraft)
                            }
                            className="px-2.5 py-1 rounded-lg text-white font-semibold text-[10px] shrink-0"
                            style={{ background: musicSurf.accentHex }}
                          >
                            Muat Path
                          </button>
                          <button
                            type="button"
                            data-testid="music-rescan-folder-btn"
                            onClick={() =>
                              setMusicState((prev) =>
                                transitionMusicPlayer(prev, {
                                  type: 'RESCAN_FOLDER',
                                })
                              )
                            }
                            className="px-2 py-1 rounded-lg bg-black/10 dark:bg-white/10 text-[10px] font-medium flex items-center gap-1 shrink-0"
                            title="Rescan active local music folder"
                          >
                            <RefreshCw className="w-2.5 h-2.5" />
                            <span>Rescan</span>
                          </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="text-[9px] opacity-65">
                            Contoh Path:
                          </span>
                          {LOCAL_MUSIC_FOLDERS.map((folder) => (
                            <button
                              key={folder.path}
                              type="button"
                              onClick={() => {
                                setLocalMusicPathDraft(folder.label);
                                setMusicSourceError('');
                                setMusicState((prev) =>
                                  transitionMusicPlayer(prev, {
                                    type: 'SELECT_FOLDER',
                                    folderPath: folder.path,
                                    tracks: folder.tracks,
                                  })
                                );
                              }}
                              className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 text-[9px] font-mono"
                            >
                              {folder.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Mode 2: Direct Online Audio Stream URL */}
                      <form
                        onSubmit={handleLoadStreamUrl}
                        className="space-y-1.5 pt-1.5 border-t border-current/10"
                      >
                        <div className="flex items-center gap-1.5">
                          <input
                            type="url"
                            aria-label="Direct Online Audio Stream URL"
                            placeholder="https://ice2.somafm.com/groovesalad-128-mp3"
                            value={streamUrlDraft}
                            onChange={(e) => {
                              setStreamUrlDraft(e.target.value);
                              if (musicSourceError) setMusicSourceError('');
                            }}
                            className="flex-1 bg-black/10 dark:bg-white/10 rounded-lg px-2 py-1 text-[10px] font-mono focus:outline-none"
                          />
                          <input
                            type="text"
                            aria-label="Stream Label"
                            placeholder="Station label"
                            value={streamLabelDraft}
                            onChange={(e) =>
                              setStreamLabelDraft(e.target.value)
                            }
                            className="w-24 bg-black/10 dark:bg-white/10 rounded-lg px-2 py-1 text-[10px] focus:outline-none"
                          />
                          <button
                            type="submit"
                            data-testid="music-stream-load-btn"
                            className="px-2.5 py-1 rounded-lg text-white font-semibold text-[10px] shrink-0"
                            style={{ background: musicSurf.accentHex }}
                          >
                            Save & Play URL
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-1">
                          <span className="text-[10px] opacity-65">
                            Saved Streams:
                          </span>
                          {musicState.savedStreams.map((st) => (
                            <div
                              key={st.id}
                              className="inline-flex items-center gap-0.5 rounded bg-black/10 dark:bg-white/10 px-1.5 py-0.5 text-[9px]"
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  setMusicSourceError('');
                                  setMusicState((prev) =>
                                    transitionMusicPlayer(prev, {
                                      type: 'PLAY_STREAM',
                                      streamTrack: st,
                                    })
                                  );
                                  setShowMusicSourceDrawer(false);
                                }}
                                className="truncate max-w-[125px] font-medium"
                              >
                                {st.title}
                              </button>
                              <button
                                type="button"
                                aria-label={`Remove saved stream ${st.title}`}
                                onClick={() =>
                                  setMusicState((prev) =>
                                    transitionMusicPlayer(prev, {
                                      type: 'REMOVE_SAVED_STREAM',
                                      streamId: st.id,
                                    })
                                  )
                                }
                                className="opacity-65 hover:opacity-100 pl-0.5"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </form>

                      {(musicSourceError || musicState.streamError) && (
                        <p
                          data-testid="music-source-error"
                          className="text-[10px] text-rose-500 font-medium"
                        >
                          {musicSourceError || musicState.streamError}
                        </p>
                      )}
                    </div>
                  ) : currentTrack ? (
                    <>
                      {/* Main Track Artwork + Title/Artist/Album */}
                      <div className="relative z-10 flex items-center gap-3">
                        <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-white/25 shadow-sm bg-stone-900">
                          <Image
                            src={currentTrack.coverUrl}
                            alt={currentTrack.title}
                            fill
                            sizes="56px"
                            referrerPolicy="no-referrer"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div
                            data-testid="music-track-title"
                            className="text-sm font-semibold tracking-tight truncate"
                          >
                            {currentTrack.title}
                          </div>
                          <div
                            className="text-xs truncate"
                            style={{ color: musicSurf.mutedTextColor }}
                          >
                            {currentTrack.artist} · {currentTrack.album}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-mono opacity-65 tabular-nums">
                              Track {musicState.currentIndex + 1} of{' '}
                              {musicState.queue.length} · {currentTrack.format}
                            </span>
                          </div>
                        </div>

                        {/* Mute Toggle + Volume Control */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            data-testid="music-mute-toggle"
                            aria-label={
                              musicState.isMuted || musicState.volume === 0
                                ? 'Unmute Music'
                                : 'Mute Music'
                            }
                            onClick={() =>
                              setMusicState((prev) =>
                                transitionMusicPlayer(prev, {
                                  type: 'TOGGLE_MUTE',
                                })
                              )
                            }
                            className="p-1 rounded-md opacity-80 hover:opacity-100"
                            style={{ background: musicSurf.subtleFill }}
                            title={
                              musicState.isMuted || musicState.volume === 0
                                ? 'Unmute'
                                : 'Mute'
                            }
                          >
                            {musicState.isMuted || musicState.volume === 0 ? (
                              <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                            ) : (
                              <Volume2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <input
                            type="range"
                            aria-label="Music Player Volume"
                            min={0}
                            max={100}
                            value={musicState.volume}
                            onChange={(e) =>
                              setMusicState((prev) =>
                                transitionMusicPlayer(prev, {
                                  type: 'SET_VOLUME',
                                  volume: Number(e.target.value),
                                })
                              )
                            }
                            className="w-14 sm:w-16"
                            style={{ accentColor: musicSurf.accentHex }}
                          />
                        </div>
                      </div>

                      {/* Seekable Progress Bar + Time Readout */}
                      <div className="relative z-10 space-y-1">
                        <input
                          type="range"
                          aria-label="Seek Track Position"
                          min={0}
                          max={Math.max(1, currentTrack.durationSecs)}
                          value={musicState.positionSecs}
                          onChange={(e) =>
                            setMusicState((prev) =>
                              transitionMusicPlayer(prev, {
                                type: 'SEEK',
                                positionSecs: Number(e.target.value),
                              })
                            )
                          }
                          className="w-full h-1.5 rounded-lg cursor-pointer"
                          style={{ accentColor: musicSurf.accentHex }}
                        />
                        <div className="flex items-center justify-between text-[10px] font-mono tabular-nums opacity-70">
                          <span>
                            {formatAudioDuration(musicState.positionSecs)}
                          </span>
                          <span>
                            {formatAudioDuration(currentTrack.durationSecs)}
                          </span>
                        </div>
                      </div>

                      {/* Playback Transport Controls: Shuffle · Prev · Play/Pause · Stop · Next · Repeat */}
                      <div className="relative z-10 flex items-center justify-between px-1">
                        <button
                          type="button"
                          aria-label="Toggle Shuffle"
                          onClick={() =>
                            setMusicState((prev) =>
                              transitionMusicPlayer(prev, {
                                type: 'TOGGLE_SHUFFLE',
                              })
                            )
                          }
                          className={`p-1.5 rounded-full text-[10px] ${
                            musicState.shuffle ? 'text-white' : 'opacity-75'
                          }`}
                          style={{
                            background: musicState.shuffle
                              ? musicSurf.accentHex
                              : musicSurf.subtleFill,
                          }}
                          title="Shuffle Queue"
                        >
                          <Shuffle className="w-3 h-3" />
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            aria-label="Previous Track"
                            onClick={() =>
                              setMusicState((prev) =>
                                transitionMusicPlayer(prev, { type: 'PREV' })
                              )
                            }
                            className="p-1.5 rounded-full"
                            style={{ background: musicSurf.subtleFill }}
                          >
                            <SkipBack className="w-3.5 h-3.5 fill-current" />
                          </button>

                          <button
                            type="button"
                            data-testid="music-play-pause"
                            aria-label={
                              musicState.isPlaying
                                ? 'Pause Music'
                                : 'Play Music'
                            }
                            onClick={() =>
                              setMusicState((prev) =>
                                transitionMusicPlayer(prev, {
                                  type: 'TOGGLE_PLAY',
                                })
                              )
                            }
                            className="p-2 rounded-full text-white shadow-xs"
                            style={{ background: musicSurf.accentHex }}
                          >
                            {musicState.isPlaying ? (
                              <Pause className="w-4 h-4 fill-current" />
                            ) : (
                              <Play className="w-4 h-4 fill-current ml-0.5" />
                            )}
                          </button>

                          <button
                            type="button"
                            data-testid="music-stop-btn"
                            aria-label="Stop Music"
                            onClick={() =>
                              setMusicState((prev) =>
                                transitionMusicPlayer(prev, { type: 'STOP' })
                              )
                            }
                            className="px-2 py-1 rounded-full text-[10px] font-semibold"
                            style={{ background: musicSurf.subtleFill }}
                            title="Stop Playback"
                          >
                            Stop
                          </button>

                          <button
                            type="button"
                            aria-label="Next Track"
                            onClick={() =>
                              setMusicState((prev) =>
                                transitionMusicPlayer(prev, { type: 'NEXT' })
                              )
                            }
                            className="p-1.5 rounded-full"
                            style={{ background: musicSurf.subtleFill }}
                          >
                            <SkipForward className="w-3.5 h-3.5 fill-current" />
                          </button>
                        </div>

                        <button
                          type="button"
                          aria-label="Cycle Repeat Mode"
                          onClick={() =>
                            setMusicState((prev) =>
                              transitionMusicPlayer(prev, {
                                type: 'CYCLE_REPEAT',
                              })
                            )
                          }
                          className={`px-2 py-1 rounded-full text-[10px] font-medium flex items-center gap-1 ${
                            musicState.repeatMode !== 'off'
                              ? 'text-white'
                              : 'opacity-75'
                          }`}
                          style={{
                            background:
                              musicState.repeatMode !== 'off'
                                ? musicSurf.accentHex
                                : musicSurf.subtleFill,
                          }}
                          title={`Repeat: ${musicState.repeatMode}`}
                        >
                          <Repeat className="w-3 h-3" />
                          {musicState.repeatMode === 'one' && <span>1</span>}
                          {musicState.repeatMode === 'all' && <span>All</span>}
                        </button>
                      </div>

                      {/* Scrollable Liquid Glass Playlist with Active Track Highlight */}
                      <div
                        data-testid="music-inline-playlist"
                        className="relative z-10 pt-1.5 border-t border-current/10 max-h-20 overflow-y-auto space-y-1 pr-0.5"
                      >
                        {musicState.queue.map((trk, idx) => {
                          const active = idx === musicState.currentIndex;
                          return (
                            <div
                              key={trk.id}
                              className={`flex items-center justify-between gap-1.5 px-2 py-0.5 rounded-lg text-[10px] transition-colors ${
                                active
                                  ? 'font-semibold text-white'
                                  : 'opacity-80 hover:opacity-100'
                              }`}
                              style={{
                                background: active
                                  ? musicSurf.accentHex
                                  : musicSurf.glassTokens.glassSurfaceSecondary,
                              }}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  setMusicState((prev) =>
                                    transitionMusicPlayer(prev, {
                                      type: 'SELECT_TRACK',
                                      index: idx,
                                    })
                                  )
                                }
                                className="truncate text-left flex-1"
                              >
                                {idx + 1}. {trk.title} — {trk.artist}
                              </button>
                              <span className="font-mono text-[9px] opacity-75 shrink-0">
                                {formatAudioDuration(trk.durationSecs)}
                              </span>
                              <button
                                type="button"
                                aria-label={`Remove ${trk.title} from playlist`}
                                onClick={() =>
                                  setMusicState((prev) =>
                                    transitionMusicPlayer(prev, {
                                      type: 'REMOVE_QUEUE_TRACK',
                                      trackId: trk.id,
                                    })
                                  )
                                }
                                className="opacity-70 hover:opacity-100 pl-1"
                              >
                                ×
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <div className="relative z-10 text-xs opacity-70 py-6 text-center">
                      Queue is empty. Open{' '}
                      <button
                        type="button"
                        onClick={() => setShowMusicSourceDrawer(true)}
                        className="underline font-semibold"
                      >
                        Sources & Stream
                      </button>{' '}
                      to rescan folder, add a file, or play a stream.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ================= RIGHT CLUSTER (7 COLUMNS) ================= */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-6 gap-3.5 content-start">
              {/* 7. MONTHLY CALENDAR CARD (3 cols — Fully Synchronized Independent Surface & Accent) */}
              {isWidgetVisible('calendar') && (
                <div
                  style={buildCardStyle(getWidgetConfig('calendar'))}
                  data-testid="widget-calendar"
                  className="sm:col-span-3 p-3.5 min-h-[194px] flex flex-col justify-between relative overflow-hidden"
                >
                  <WidgetBackgroundLayer
                    widgetId="calendar"
                    config={getWidgetBg('calendar')}
                    isDarkSurface={calSurf.isDarkSurface}
                  />
                  {renderEditOverlay(getWidgetConfig('calendar'))}

                  <div className="relative z-10 flex items-center justify-between gap-1 mb-0.5">
                    <span className="font-semibold text-[13px] tracking-tight">
                      {calendarGrid.monthLabel} {calendarGrid.year}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={onToggleCalLocale}
                        aria-label="Toggle Calendar Locale"
                        className="px-1.5 py-0.5 text-[10px] font-semibold rounded-full"
                        style={{ background: calSurf.subtleFill }}
                      >
                        {calLocale === 'en-US' ? 'EN' : 'ID'}
                      </button>
                      <button
                        type="button"
                        onClick={onToggleCalFirstDay}
                        aria-label="Toggle First Day of Week"
                        className="px-1.5 py-0.5 text-[10px] font-medium rounded-full"
                        style={{ background: calSurf.subtleFill }}
                      >
                        {calFirstDay === 1 ? 'Mon' : 'Sun'}
                      </button>
                      <button
                        type="button"
                        onClick={() => onChangeCalMonth(-1)}
                        aria-label="Previous Month"
                        className="p-0.5 rounded-full"
                        style={{ background: calSurf.subtleFill }}
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onChangeCalMonth(1)}
                        aria-label="Next Month"
                        className="p-0.5 rounded-full"
                        style={{ background: calSurf.subtleFill }}
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div
                    className="relative z-10 grid grid-cols-7 gap-0.5 text-center text-[10px] font-semibold"
                    style={{ color: calSurf.mutedTextColor }}
                  >
                    {calendarGrid.weekdayHeaders.map((day) => (
                      <div key={day} className="py-0.5">
                        {calLocale === 'en-US' ? day.slice(0, 1) : day}
                      </div>
                    ))}
                  </div>

                  <div className="relative z-10 grid grid-cols-7 gap-y-0.5 text-center text-[11px] tabular-nums">
                    {Array.from({
                      length: calendarGrid.leadingEmptyCells,
                    }).map((_, idx) => (
                      <div key={`empty-${idx}`} className="h-5" />
                    ))}
                    {Array.from({ length: calendarGrid.daysInMonth }).map(
                      (_, idx) => {
                        const dayNum = idx + 1;
                        const isToday = dayNum === now.getDate();
                        const hasEvent =
                          dayNum === now.getDate() ||
                          dayNum === 12 ||
                          dayNum === 18;
                        return (
                          <div
                            key={dayNum}
                            className="h-5 flex flex-col items-center justify-center relative"
                          >
                            <span
                              data-testid={
                                isToday ? 'calendar-today-badge' : undefined
                              }
                              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                isToday ? 'font-bold text-white shadow-2xs' : ''
                              }`}
                              style={
                                isToday
                                  ? { background: calSurf.accentHex }
                                  : undefined
                              }
                            >
                              {dayNum}
                            </span>
                            {hasEvent && !isToday && (
                              <span
                                className="w-1 h-1 rounded-full absolute -bottom-0.5"
                                style={{ background: calSurf.accentHex }}
                              />
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}

              {/* 8. SYSTEM MONITOR CARD (3 cols) */}
              {isWidgetVisible('system_monitor') && (
                <div
                  style={buildCardStyle(getWidgetConfig('system_monitor'))}
                  data-testid="widget-system_monitor"
                  className="sm:col-span-3 p-4 min-h-[194px] flex flex-col justify-between relative overflow-hidden"
                >
                  <WidgetBackgroundLayer
                    widgetId="system_monitor"
                    config={getWidgetBg('system_monitor')}
                    isDarkSurface={sysSurf.isDarkSurface}
                  />
                  {renderEditOverlay(getWidgetConfig('system_monitor'))}

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="font-semibold text-[13px] tracking-tight">
                      System
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 3, 10].map((sec) => (
                        <button
                          key={sec}
                          type="button"
                          onClick={() => onChangeSysInterval(sec)}
                          className={`px-1.5 py-0.5 rounded-full text-[10px] tabular-nums ${
                            sysIntervalSecs === sec
                              ? 'font-semibold text-white'
                              : 'opacity-65'
                          }`}
                          style={
                            sysIntervalSecs === sec
                              ? { background: sysSurf.accentHex }
                              : { background: sysSurf.subtleFill }
                          }
                        >
                          {sec}s
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative z-10 space-y-2.5 my-auto tabular-nums">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span style={{ color: sysSurf.mutedTextColor }}>
                          Processor
                        </span>
                        <span className="font-semibold">
                          {sysCpu.toFixed(0)}%
                        </span>
                      </div>
                      <div
                        className="w-full h-1.5 rounded-full overflow-hidden"
                        style={{ background: sysSurf.subtleFill }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(100, sysCpu)}%`,
                            background: sysSurf.accentHex,
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span style={{ color: sysSurf.mutedTextColor }}>
                          Memory
                        </span>
                        <span className="font-semibold">
                          {(sysMemMb / 1024).toFixed(1)} GB (
                          {sysMemPct.toFixed(0)}%)
                        </span>
                      </div>
                      <div
                        className="w-full h-1.5 rounded-full overflow-hidden"
                        style={{ background: sysSurf.subtleFill }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(100, sysMemPct)}%`,
                            background: sysSurf.accentHex,
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span style={{ color: sysSurf.mutedTextColor }}>
                          Battery · Disk
                        </span>
                        <span className="font-semibold">88% · 41%</span>
                      </div>
                      <div
                        className="w-full h-1.5 rounded-full overflow-hidden"
                        style={{ background: sysSurf.subtleFill }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: '88%',
                            background: '#2E9E5B',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 9. TO-DO LIST WIDGET WITH DEADLINES & DELETE CONTROLS (6 cols) */}
              {isWidgetVisible('agenda') && (
                <div
                  style={buildCardStyle(getWidgetConfig('agenda'))}
                  data-testid="widget-agenda"
                  className="sm:col-span-6 p-4 min-h-[225px] flex flex-col justify-between gap-3 relative overflow-hidden"
                >
                  <WidgetBackgroundLayer
                    widgetId="agenda"
                    config={getWidgetBg('agenda')}
                    isDarkSurface={agendaSurf.isDarkSurface}
                  />
                  {renderEditOverlay(getWidgetConfig('agenda'))}

                  {(() => {
                    const todayIso = now.toISOString().slice(0, 10);
                    const progress = computeTodoProgress(todos);
                    const overdueCount = todos.filter(
                      (t) =>
                        computeTodoDeadlineStatus(t, todayIso).status ===
                        'overdue'
                    ).length;
                    const visibleTodos = todos.filter((t) => {
                      if (todoFilter === 'active') return !t.completed;
                      if (todoFilter === 'done') return t.completed;
                      return true;
                    });

                    return (
                      <div className="relative z-10 flex flex-col justify-between flex-1 space-y-2.5">
                        {/* Header: To-Do List Title + Progress Counter + Filter Pills + Add / Clear Buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-current/10">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold tracking-tight">
                              To-Do List
                            </span>
                            <span
                              className="px-2 py-0.5 rounded-full text-[10px] font-semibold tabular-nums"
                              style={{ background: agendaSurf.subtleFill }}
                            >
                              {progress.completed}/{progress.total} selesai (
                              {progress.percent}%)
                            </span>
                            {overdueCount > 0 && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/20 text-rose-500">
                                {overdueCount} Overdue
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-1">
                            {(
                              [
                                { id: 'all', label: 'All' },
                                { id: 'active', label: 'Active' },
                                { id: 'done', label: 'Done' },
                              ] as const
                            ).map((f) => (
                              <button
                                key={f.id}
                                type="button"
                                onClick={() => setTodoFilter(f.id)}
                                className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                  todoFilter === f.id
                                    ? 'text-white font-semibold'
                                    : 'opacity-70'
                                }`}
                                style={
                                  todoFilter === f.id
                                    ? { background: agendaSurf.accentHex }
                                    : { background: agendaSurf.subtleFill }
                                }
                              >
                                {f.label}
                              </button>
                            ))}

                            {progress.completed > 0 && (
                              <button
                                type="button"
                                data-testid="todo-clear-completed-btn"
                                onClick={onClearCompletedTodos}
                                className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-500/15 text-rose-500"
                                title="Hapus semua to-do yang sudah selesai"
                              >
                                Clear Done
                              </button>
                            )}

                            <button
                              type="button"
                              data-testid="todo-open-add-btn"
                              onClick={() => setShowAddTodoForm((p) => !p)}
                              className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-white flex items-center gap-1"
                              style={{ background: agendaSurf.accentHex }}
                            >
                              <Plus className="w-3 h-3" />
                              <span>{showAddTodoForm ? 'Close' : 'Add To-Do'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div
                          className="w-full h-1.5 rounded-full overflow-hidden"
                          style={{ background: agendaSurf.subtleFill }}
                        >
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${progress.percent}%`,
                              background: agendaSurf.accentHex,
                            }}
                          />
                        </div>

                        {/* Add To-Do Form with Deadline Date & Time */}
                        {showAddTodoForm && (
                          <form
                            onSubmit={handleAddTodoSubmit}
                            data-testid="todo-add-form"
                            className="p-2.5 rounded-xl bg-black/8 dark:bg-white/8 border border-current/10 space-y-2 text-xs"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                              <input
                                type="text"
                                aria-label="New To-Do Title"
                                data-testid="todo-title-input"
                                placeholder="Tambah tugas / to-do baru..."
                                value={newTodoTitle}
                                onChange={(e) => {
                                  setNewTodoTitle(e.target.value);
                                  if (todoError) setTodoError('');
                                }}
                                className="sm:col-span-8 bg-black/10 dark:bg-white/10 rounded-lg px-2.5 py-1 text-xs placeholder:opacity-60 focus:outline-none"
                              />
                              <select
                                aria-label="New To-Do Priority"
                                value={newTodoPriority}
                                onChange={(e) =>
                                  setNewTodoPriority(
                                    e.target.value as TodoItem['priority']
                                  )
                                }
                                className="sm:col-span-4 bg-black/10 dark:bg-white/10 rounded-lg px-2 py-1 text-[11px]"
                              >
                                <option
                                  value="high"
                                  className="bg-stone-900 text-white"
                                >
                                  Priority: High
                                </option>
                                <option
                                  value="medium"
                                  className="bg-stone-900 text-white"
                                >
                                  Priority: Medium
                                </option>
                                <option
                                  value="low"
                                  className="bg-stone-900 text-white"
                                >
                                  Priority: Low
                                </option>
                              </select>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                                <span className="opacity-75 font-medium">
                                  Deadline:
                                </span>
                                <input
                                  type="date"
                                  aria-label="New To-Do Deadline Date"
                                  data-testid="todo-deadline-date-input"
                                  value={newTodoDueDate}
                                  onChange={(e) =>
                                    setNewTodoDueDate(e.target.value)
                                  }
                                  className="bg-black/10 dark:bg-white/10 rounded px-2 py-0.5 font-mono text-[11px]"
                                />
                                <input
                                  type="time"
                                  aria-label="New To-Do Deadline Time"
                                  data-testid="todo-deadline-time-input"
                                  value={newTodoDueTime}
                                  onChange={(e) =>
                                    setNewTodoDueTime(e.target.value)
                                  }
                                  className="bg-black/10 dark:bg-white/10 rounded px-2 py-0.5 font-mono text-[11px] tabular-nums"
                                />
                                <input
                                  type="text"
                                  aria-label="New To-Do Category"
                                  value={newTodoCategory}
                                  onChange={(e) =>
                                    setNewTodoCategory(e.target.value)
                                  }
                                  placeholder="Category"
                                  className="w-24 bg-black/10 dark:bg-white/10 rounded px-2 py-0.5 text-[11px]"
                                />
                              </div>

                              <button
                                type="submit"
                                data-testid="todo-submit-btn"
                                className="px-3 py-1 rounded-lg text-[11px] font-semibold text-white whitespace-nowrap"
                                style={{ background: agendaSurf.accentHex }}
                              >
                                Simpan To-Do
                              </button>
                            </div>
                          </form>
                        )}

                        {todoError && (
                          <p className="text-[11px] text-rose-500 font-medium">
                            {todoError}
                          </p>
                        )}

                        {/* To-Do Items List with Deadline Badges & Delete (Hapus) Action */}
                        <div className="space-y-1.5 max-h-[168px] overflow-y-auto pr-0.5">
                          {visibleTodos.length === 0 ? (
                            <div
                              className="py-6 text-center text-xs opacity-65 rounded-xl"
                              style={{ background: agendaSurf.subtleFill }}
                            >
                              Tidak ada tugas pada filter ini. Klik &ldquo;Add To-Do&rdquo; untuk menambah tugas dengan deadline.
                            </div>
                          ) : (
                            visibleTodos.map((todo) => {
                              const isEditing = editingTodoId === todo.id;
                              const deadlineInfo = computeTodoDeadlineStatus(
                                todo,
                                todayIso
                              );

                              if (isEditing) {
                                return (
                                  <div
                                    key={todo.id}
                                    className="p-2.5 rounded-xl bg-black/10 dark:bg-white/10 space-y-1.5 text-xs"
                                  >
                                    <input
                                      type="text"
                                      aria-label="Edit To-Do Title"
                                      value={editTodoTitle}
                                      onChange={(e) =>
                                        setEditTodoTitle(e.target.value)
                                      }
                                      className="w-full bg-white/40 dark:bg-black/30 rounded-lg px-2 py-1 text-xs"
                                    />
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                      <div className="flex items-center gap-1">
                                        <input
                                          type="date"
                                          aria-label="Edit To-Do Deadline Date"
                                          value={editTodoDueDate}
                                          onChange={(e) =>
                                            setEditTodoDueDate(e.target.value)
                                          }
                                          className="bg-white/40 dark:bg-black/30 rounded px-1.5 py-0.5 font-mono text-[11px]"
                                        />
                                        <input
                                          type="time"
                                          aria-label="Edit To-Do Deadline Time"
                                          value={editTodoDueTime}
                                          onChange={(e) =>
                                            setEditTodoDueTime(e.target.value)
                                          }
                                          className="bg-white/40 dark:bg-black/30 rounded px-1.5 py-0.5 font-mono text-[11px] tabular-nums"
                                        />
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <button
                                          type="button"
                                          onClick={() => saveEditedTodo(todo.id)}
                                          className="px-2.5 py-0.5 rounded-md font-semibold text-white"
                                          style={{
                                            background: agendaSurf.accentHex,
                                          }}
                                        >
                                          Save
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => setEditingTodoId(null)}
                                          aria-label="Cancel Edit To-Do"
                                          className="p-1 rounded"
                                        >
                                          <X className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }

                              return (
                                <div
                                  key={todo.id}
                                  data-testid={`todo-item-${todo.id}`}
                                  className="px-3 py-2 rounded-xl flex items-center justify-between gap-2.5 text-xs"
                                  style={{ background: agendaSurf.subtleFill }}
                                >
                                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                    <button
                                      type="button"
                                      onClick={() => onToggleTodo(todo.id)}
                                      aria-label={`Toggle ${todo.title}`}
                                      className="w-4 h-4 rounded-full border border-current/40 flex items-center justify-center shrink-0"
                                      style={
                                        todo.completed
                                          ? {
                                              background: agendaSurf.accentHex,
                                              borderColor: agendaSurf.accentHex,
                                              color: '#FFFFFF',
                                            }
                                          : undefined
                                      }
                                    >
                                      {todo.completed && (
                                        <Check className="w-2.5 h-2.5" />
                                      )}
                                    </button>

                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-1.5">
                                        <span
                                          className={`font-semibold truncate ${
                                            todo.completed
                                              ? 'line-through opacity-50'
                                              : ''
                                          }`}
                                        >
                                          {todo.title}
                                        </span>
                                        <span
                                          className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase shrink-0 ${
                                            todo.priority === 'high'
                                              ? 'bg-rose-500/20 text-rose-500'
                                              : todo.priority === 'medium'
                                                ? 'bg-amber-500/20 text-amber-500'
                                                : 'bg-sky-500/20 text-sky-500'
                                          }`}
                                        >
                                          {todo.priority}
                                        </span>
                                      </div>

                                      <div className="flex flex-wrap items-center gap-2 mt-0.5 text-[10px]">
                                        <span
                                          data-testid={`todo-deadline-${todo.id}`}
                                          className={`font-mono tabular-nums font-medium ${
                                            deadlineInfo.status === 'overdue'
                                              ? 'text-rose-500 font-semibold'
                                              : deadlineInfo.status ===
                                                  'due_today'
                                                ? 'text-amber-500 font-semibold'
                                                : 'opacity-70'
                                          }`}
                                        >
                                          ⏰ {deadlineInfo.badgeLabel}:{' '}
                                          {deadlineInfo.formattedDeadline}
                                        </span>
                                        {todo.category && (
                                          <span className="opacity-60">
                                            · {todo.category}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => startEditingTodo(todo)}
                                      aria-label={`Edit ${todo.title}`}
                                      className="p-1 rounded-lg bg-black/8 dark:bg-white/8 opacity-75 hover:opacity-100"
                                      title="Edit To-Do & Deadline"
                                    >
                                      <Pencil className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      data-testid={`todo-delete-${todo.id}`}
                                      onClick={() => onDeleteTodo(todo.id)}
                                      aria-label={`Delete ${todo.title}`}
                                      className="px-2 py-1 rounded-lg bg-rose-500/15 text-rose-500 text-[10px] font-semibold flex items-center gap-1 hover:bg-rose-500/25"
                                      title="Hapus To-Do"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                      <span>Hapus</span>
                                    </button>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Floating Dock (10 Active Widgets) */}
        <div className="relative z-20 pb-3 pt-1 flex justify-center">
          <div
            className="px-3.5 py-2 rounded-2xl border backdrop-blur-xl flex flex-wrap items-center gap-2 shadow-lg"
            style={{
              background:
                widgetStyle === 'tinted'
                  ? mainSurf.background
                  : appearanceMode === 'dark'
                    ? 'rgba(24, 25, 32, 0.72)'
                    : 'rgba(255, 255, 255, 0.55)',
              borderColor:
                appearanceMode === 'dark'
                  ? 'rgba(255, 255, 255, 0.14)'
                  : 'rgba(255, 255, 255, 0.65)',
            }}
          >
            {[
              {
                id: 'clock' as WidgetId,
                label: 'Clock & Alarms',
                bg: '#1D1D1F',
                fg: '#FFFFFF',
                text: clockFormatted.time.slice(0, 5),
              },
              {
                id: 'calendar' as WidgetId,
                label: 'Calendar',
                bg: '#FFFFFF',
                fg: '#E03E36',
                text: String(now.getDate()),
              },
              {
                id: 'weather' as WidgetId,
                label: 'Weather',
                bg: '#007AFF',
                fg: '#FFFFFF',
                text: formatTempDegreeOnly(
                  currentWeatherData.tempC,
                  useCelsius
                ),
              },
              {
                id: 'pomodoro' as WidgetId,
                label: 'Pomodoro Focus',
                bg: pomoSurf.accentHex,
                fg: '#FFFFFF',
                text: '25m',
              },
              {
                id: 'notes' as WidgetId,
                label: 'Notes',
                bg: '#FFCC00',
                fg: '#1D1D1F',
                text: 'NOTE',
              },
              {
                id: 'music_player' as WidgetId,
                label: 'Music Player',
                bg: '#FF2D55',
                fg: '#FFFFFF',
                text: 'PLAY',
              },
              {
                id: 'photos' as WidgetId,
                label: 'Photos',
                bg: '#F28C28',
                fg: '#FFFFFF',
                text: 'IMG',
              },
              {
                id: 'agenda' as WidgetId,
                label: 'To-Do List',
                bg: '#2E9E5B',
                fg: '#FFFFFF',
                text: `${todos.filter((t) => !t.completed).length}`,
              },
            ].map((dockItem) => {
              const tintedDock = widgetStyle === 'tinted';
              return (
                <button
                  key={dockItem.id}
                  type="button"
                  onClick={() =>
                    setFocusedWidget((prev) =>
                      prev === dockItem.id ? 'all' : dockItem.id
                    )
                  }
                  title={`Focus ${dockItem.label}`}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-bold shadow-xs"
                  style={{
                    background: tintedDock ? mainSurf.accentHex : dockItem.bg,
                    color: tintedDock ? '#FFFFFF' : dockItem.fg,
                  }}
                >
                  {dockItem.text}
                </button>
              );
            })}

            <div className="w-px h-7 bg-current/15 mx-0.5" />

            <button
              type="button"
              onClick={() => setShowAppearancePopover((p) => !p)}
              title="Appearance Settings"
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-xs"
              style={{
                background: mainSurf.accentHex,
                color: '#FFFFFF',
              }}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
