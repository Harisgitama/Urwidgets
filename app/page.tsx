'use client';

import React, { useState, useEffect } from 'react';
import {
  ThemeSpec,
  WidgetInstanceConfig,
  WidgetId,
  WidgetSize,
  AgendaEvent,
  PomodoroState,
  PomodoroPhase,
  AppearanceMode,
  WidgetSurfaceStyle,
  AccentColorId,
  ElevationLevel,
  INITIAL_THEME_PRESETS,
  INITIAL_WIDGET_INSTANCES,
  SYSTEM_FONT_OPTIONS,
  transitionPomodoro,
  AlarmItem,
  DueAlarmNotification,
  INITIAL_ALARMS,
  toggleAlarmInList,
  upsertAlarmInList,
  deleteAlarmFromList,
  triggerDueAlarms,
  snoozeAlarm,
  stopActiveAlarm,
  NoteItem,
  INITIAL_NOTES,
  upsertNoteInList,
  deleteNoteFromList,
  togglePinNoteInList,
  TodoItem,
  TodoPriority,
  INITIAL_TODOS,
  addTodoItem,
  toggleTodoItem,
  updateTodoItem,
  deleteTodoItem,
  clearCompletedTodos,
  normalizeHexColor,
  WidgetBackgroundConfig,
  DEFAULT_WIDGET_BACKGROUND,
  INITIAL_WIDGET_BACKGROUNDS,
  KWinCompositorConfig,
  DEFAULT_KWIN_COMPOSITOR_CONFIG,
} from '@/lib/urwidgets-engine';
import PlasmaDesktopView from '@/components/PlasmaDesktopView';
import ControlCenterView from '@/components/ControlCenterView';
import SourceAndPackagesView from '@/components/SourceAndPackagesView';
import ArchitectureRoadmapView from '@/components/ArchitectureRoadmapView';
import OfficialLandingWebsite from '@/components/OfficialLandingWebsite';
import { NATIVE_SOURCE_FILES } from '@/lib/native-source-registry';

const DEFAULT_AGENDA_EVENTS: AgendaEvent[] = [
  {
    id: 'evt-1',
    title: 'Math 12 - Unit 4 learning guide',
    dateIso: '2026-11-08',
    startTime: '08:30',
    endTime: '11:00',
    category: 'Personal',
    completed: false,
  },
  {
    id: 'evt-2',
    title: 'Math 12 - Unit 4 Exam',
    dateIso: '2026-11-08',
    startTime: '13:00',
    endTime: '14:15',
    category: 'Architecture',
    completed: false,
  },
  {
    id: 'evt-3',
    title: 'Chem 11 - Unit 3 learning guide',
    dateIso: '2026-11-08',
    startTime: '15:10',
    endTime: '16:10',
    category: 'Personal',
    completed: false,
  },
  {
    id: 'evt-4',
    title: 'KDE Plasma 5 QML WidgetWall Verification',
    dateIso: '2026-11-08',
    startTime: '18:30',
    endTime: '19:30',
    category: 'Engineering',
    completed: true,
  },
];

export default function HomePage() {
  const [activeNav, setActiveNav] = useState<
    'desktop' | 'control-center' | 'source' | 'architecture'
  >('desktop');

  const switchTab = (
    tab: 'desktop' | 'control-center' | 'source' | 'architecture'
  ) => {
    setActiveNav(tab);
  };

  // macOS Appearance & WidgetWall state (Global across all widgets)
  const [appearanceMode, setAppearanceMode] = useState<AppearanceMode>('light');
  const [widgetStyle, setWidgetStyle] = useState<WidgetSurfaceStyle>('default');
  const [accentColorId, setAccentColorId] = useState<AccentColorId>('pink');
  const [customAccentHex, setCustomAccentHex] = useState<string>('#FF5A79');
  const [systemFontId, setSystemFontId] = useState<string>('sf-pro');
  const [globalElevation, setGlobalElevation] = useState<ElevationLevel>(2);
  const [kwinCompositorConfig, setKwinCompositorConfig] =
    useState<KWinCompositorConfig>(DEFAULT_KWIN_COMPOSITOR_CONFIG);

  // Theme state (defaults to 'warm-minimal' / WidgetWall Light)
  const [themes, setThemes] = useState<ThemeSpec[]>(INITIAL_THEME_PRESETS);
  const [activeThemeId, setActiveThemeId] = useState<string>('warm-minimal');

  // Widget instances state (all 10 widgets)
  const [widgets, setWidgets] = useState<WidgetInstanceConfig[]>(
    INITIAL_WIDGET_INSTANCES
  );

  // Per-widget custom background image configs
  const [widgetBackgrounds, setWidgetBackgrounds] = useState<
    Record<WidgetId, WidgetBackgroundConfig>
  >(INITIAL_WIDGET_BACKGROUNDS);

  // Clock & Alarms state
  const [now, setNow] = useState<Date>(() => new Date(2026, 7, 30, 16, 56, 0));
  const [use24h, setUse24h] = useState(false);
  const [showSeconds, setShowSeconds] = useState(false);
  const [clockMonoFont, setClockMonoFont] = useState(false);
  const [alarms, setAlarms] = useState<AlarmItem[]>(INITIAL_ALARMS);
  const [dueAlarmQueue, setDueAlarmQueue] = useState<DueAlarmNotification[]>(
    []
  );

  // Notes state
  const [notes, setNotes] = useState<NoteItem[]>(INITIAL_NOTES);

  // Todo List state
  const [todos, setTodos] = useState<TodoItem[]>(INITIAL_TODOS);

  // Calendar state
  const [calYear, setCalYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(10); // November (0-indexed)
  const [calLocale, setCalLocale] = useState<'en-US' | 'id-ID'>('en-US');
  const [calFirstDay, setCalFirstDay] = useState<0 | 1>(1);

  // Weather state
  const [weatherCity, setWeatherCity] = useState('Vernon, CA');
  const [useCelsius, setUseCelsius] = useState(true);
  const [weatherOffline, setWeatherOffline] = useState(false);

  // Pomodoro state
  const [pomodoro, setPomodoro] = useState<PomodoroState>({
    phase: 'Study',
    status: 'Idle',
    remainingSecs: 25 * 60,
    totalSecs: 25 * 60,
    completedSessions: 1,
    studyMins: 25,
    shortBreakMins: 5,
    longBreakMins: 15,
    notifyOnComplete: true,
  });

  // Agenda state
  const [agendaEvents, setAgendaEvents] = useState<AgendaEvent[]>(
    DEFAULT_AGENDA_EVENTS
  );

  // System Monitor & IPC state
  const [sysCpu, setSysCpu] = useState(11.4);
  const [sysMemMb] = useState(3380);
  const [sysMemPct] = useState(20.6);
  const [sysIntervalSecs, setSysIntervalSecs] = useState(3);
  const [ipcLog, setIpcLog] = useState<string[]>([
    '[16:56:01] org.urwidgets.Daemon1.GetSnapshot() -> 200 OK (10 widgets, SQLite WAL v2)',
    '[16:56:02] WidgetTheme.qml resolved font chain -> SF Pro Display / Noto Sans Display',
    '[16:56:04] PlasmaCore.DataSource connected 10 WidgetWall applets to shared daemon',
  ]);

  const appendIpcLog = (msg: string) => {
    const ts = new Date().toTimeString().slice(0, 8);
    setIpcLog((prev) => [`[${ts}] ${msg}`, ...prev.slice(0, 29)]);
  };

  // Sync dark mode class on root html element when appearanceMode changes
  useEffect(() => {
    const isDark = appearanceMode === 'dark' || widgetStyle === 'dark';
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', isDark);
    }
  }, [appearanceMode, widgetStyle]);

  // Hydrate Global Theme & Style, Alarms (with Custom Local Ringtone), and To-Do List from localStorage
  const [hydratedStorage, setHydratedStorage] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    queueMicrotask(() => {
      try {
        const rawTheme = window.localStorage.getItem('urwidgets_v3_global_theme');
        if (rawTheme) {
          const parsed = JSON.parse(rawTheme);
          if (parsed.appearanceMode) setAppearanceMode(parsed.appearanceMode);
          if (parsed.widgetStyle) setWidgetStyle(parsed.widgetStyle);
          if (parsed.accentColorId) setAccentColorId(parsed.accentColorId);
          if (parsed.customAccentHex) setCustomAccentHex(parsed.customAccentHex);
          if (parsed.activeThemeId) setActiveThemeId(parsed.activeThemeId);
          if (parsed.systemFontId) setSystemFontId(parsed.systemFontId);
          if (typeof parsed.globalElevation === 'number') {
            setGlobalElevation(parsed.globalElevation as ElevationLevel);
          }
          if (parsed.kwinCompositorConfig) {
            setKwinCompositorConfig((prev) => ({
              ...prev,
              ...parsed.kwinCompositorConfig,
            }));
          }
        }
        const rawAlarms = window.localStorage.getItem('urwidgets_v3_alarms');
        if (rawAlarms) {
          const parsedAlarms = JSON.parse(rawAlarms);
          if (Array.isArray(parsedAlarms) && parsedAlarms.length > 0) {
            setAlarms(parsedAlarms);
          }
        }
        const rawTodos = window.localStorage.getItem('urwidgets_v3_todos');
        if (rawTodos) {
          const parsedTodos = JSON.parse(rawTodos);
          if (Array.isArray(parsedTodos)) {
            setTodos(parsedTodos);
          }
        }
      } catch {
        // Ignore storage parse errors
      } finally {
        setHydratedStorage(true);
      }
    });
  }, []);

  useEffect(() => {
    if (!hydratedStorage || typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(
        'urwidgets_v3_global_theme',
        JSON.stringify({
          appearanceMode,
          widgetStyle,
          accentColorId,
          customAccentHex,
          activeThemeId,
          systemFontId,
          globalElevation,
          kwinCompositorConfig,
        })
      );
    } catch {
      // Ignore quota errors
    }
  }, [
    hydratedStorage,
    appearanceMode,
    widgetStyle,
    accentColorId,
    customAccentHex,
    activeThemeId,
    systemFontId,
    globalElevation,
    kwinCompositorConfig,
  ]);

  useEffect(() => {
    if (!hydratedStorage || typeof window === 'undefined') return;
    try {
      window.localStorage.setItem('urwidgets_v3_alarms', JSON.stringify(alarms));
    } catch {
      // Ignore quota errors if data URL is large
    }
  }, [hydratedStorage, alarms]);

  useEffect(() => {
    if (!hydratedStorage || typeof window === 'undefined') return;
    try {
      window.localStorage.setItem('urwidgets_v3_todos', JSON.stringify(todos));
    } catch {
      // Ignore quota errors
    }
  }, [hydratedStorage, todos]);

  // Clock & Pomodoro event-driven timer (ticks at 1s only when showSeconds or Pomodoro is active; 30s otherwise to eliminate UI lag)
  const isPomodoroRunning = pomodoro.status === 'Running';
  useEffect(() => {
    const tickMs = showSeconds || isPomodoroRunning ? 1000 : 30000;
    const stepSecs = Math.max(1, Math.round(tickMs / 1000));
    const interval = setInterval(() => {
      setNow(new Date());
      if (isPomodoroRunning) {
        setPomodoro((prev) =>
          prev.status === 'Running'
            ? transitionPomodoro(prev, { type: 'TICK', elapsedSecs: stepSecs })
            : prev
        );
      }
    }, tickMs);
    return () => clearInterval(interval);
  }, [showSeconds, isPomodoroRunning]);

  // Automatically trigger due alarms when clock HH:MM matches any enabled alarm
  const currentHHMM = `${String(now.getHours()).padStart(2, '0')}:${String(
    now.getMinutes()
  ).padStart(2, '0')}`;
  const [lastTriggeredHHMMKey, setLastTriggeredHHMMKey] = useState<string>('');
  useEffect(() => {
    const matchingAlarm = alarms.find(
      (a) => a.enabled && (a.snoozedUntilTime || a.time) === currentHHMM
    );
    if (!matchingAlarm) return;
    const triggerKey = `${matchingAlarm.id}@${currentHHMM}`;
    if (lastTriggeredHHMMKey === triggerKey) return;
    queueMicrotask(() => {
      setLastTriggeredHHMMKey(triggerKey);
      const res = triggerDueAlarms(
        alarms,
        dueAlarmQueue,
        currentHHMM,
        new Date().toISOString()
      );
      if (res.updatedQueue.length > dueAlarmQueue.length) {
        setAlarms(res.updatedAlarms);
        setDueAlarmQueue(res.updatedQueue);
      }
    });
  }, [currentHHMM, alarms, dueAlarmQueue, lastTriggeredHHMMKey]);

  useEffect(() => {
    const sysTimer = setInterval(() => {
      setSysCpu(() => {
        const delta = Math.sin(Date.now() / 2000) * 2.4;
        return Math.max(4.2, Math.min(38.0, Number((11.5 + delta).toFixed(1))));
      });
    }, sysIntervalSecs * 1000);
    return () => clearInterval(sysTimer);
  }, [sysIntervalSecs]);

  // Handlers
  const handleSelectTheme = (id: string) => {
    setActiveThemeId(id);
    if (id === 'warm-minimal' || id === 'pastel-editorial') {
      setAppearanceMode('light');
      setWidgetStyle(id === 'pastel-editorial' ? 'tinted' : 'default');
    } else if (id === 'liquid-glass') {
      setAppearanceMode('light');
      setWidgetStyle('clear');
    } else if (
      id === 'midnight' ||
      id === 'monochrome' ||
      id === 'aurora-gradient'
    ) {
      setAppearanceMode('dark');
      setWidgetStyle('dark');
    }
    appendIpcLog(
      `org.urwidgets.Daemon1.SetTheme("${id}") -> applied to desktop`
    );
  };

  const handleUpdateActiveTheme = (updated: ThemeSpec) => {
    setThemes((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    );
    appendIpcLog(
      `SQLite UPDATE themes SET payload_json WHERE id="${updated.id}"`
    );
  };

  const handleCreateCustomTheme = (name: string, base: ThemeSpec) => {
    const id = `custom-${Date.now().toString(36)}`;
    const created: ThemeSpec = {
      ...base,
      id,
      name,
      description: 'User custom theme profile stored in SQLite WAL',
      isPreset: false,
    };
    setThemes((prev) => [...prev, created]);
    setActiveThemeId(id);
    appendIpcLog(`SQLite INSERT INTO themes ("${id}", "${name}")`);
  };

  const handleDeleteCustomTheme = (id: string) => {
    setThemes((prev) => prev.filter((t) => t.id !== id));
    if (activeThemeId === id) {
      setActiveThemeId('warm-minimal');
    }
    appendIpcLog(`SQLite DELETE FROM themes WHERE id="${id}"`);
  };

  const handleImportThemeJson = (
    rawJson: string
  ): { ok: boolean; message: string } => {
    try {
      const parsed = JSON.parse(rawJson);
      if (!parsed || typeof parsed !== 'object' || !parsed.name) {
        return {
          ok: false,
          message: 'Invalid theme JSON: missing "name" property.',
        };
      }
      const id = parsed.id || `imported-${Date.now().toString(36)}`;
      const base = INITIAL_THEME_PRESETS[0];
      const imported: ThemeSpec = {
        id,
        name: String(parsed.name),
        description: String(
          parsed.description || 'Imported custom theme configuration'
        ),
        isPreset: false,
        appearance: { ...base.appearance, ...(parsed.appearance || {}) },
        gradient: { ...base.gradient, ...(parsed.gradient || {}) },
        effects: { ...base.effects, ...(parsed.effects || {}) },
      };
      setThemes((prev) => [...prev.filter((t) => t.id !== id), imported]);
      setActiveThemeId(id);
      appendIpcLog(`Imported theme JSON "${imported.name}" (${id})`);
      return {
        ok: true,
        message: `Successfully imported and activated theme "${imported.name}".`,
      };
    } catch {
      return {
        ok: false,
        message: 'Failed to parse JSON. Check syntax and try again.',
      };
    }
  };

  const handleToggleWidget = (id: WidgetId) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w))
    );
    appendIpcLog(`Plasmoid containment toggled widget "${id}"`);
  };

  const handleResizeWidget = (id: WidgetId, size: WidgetSize) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, size } : w))
    );
    appendIpcLog(`Plasmoid resized widget "${id}" -> ${size}`);
  };

  const handleSetWidgetThemeOverride = (
    id: WidgetId,
    themeId: string | null
  ) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, themeOverride: themeId } : w))
    );
    appendIpcLog(
      `Widget "${id}" theme override -> ${themeId || 'Inherit Global'}`
    );
  };

  const handleSetWidgetElevationOverride = (
    id: WidgetId,
    level: ElevationLevel | null
  ) => {
    setWidgets((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, elevationOverride: level } : w
      )
    );
    appendIpcLog(
      `Widget "${id}" elevation override -> ${
        level === null ? 'Global' : `Level ${level}`
      }`
    );
  };

  const handleUpdateWidgetPreferences = (
    id: WidgetId,
    patch: Partial<WidgetInstanceConfig>
  ) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...patch } : w))
    );
    const summary = Object.entries(patch)
      .map(([k, v]) => `${k}=${v === null ? 'global' : v}`)
      .join(', ');
    appendIpcLog(
      `org.urwidgets.Daemon1.SetWidgetPreferences("widget.${id}", { ${summary} })`
    );
  };

  const handleResetSingleWidgetPreferences = (id: WidgetId) => {
    const def = INITIAL_WIDGET_INSTANCES.find((d) => d.id === id);
    setWidgets((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              size: def?.size || w.size,
              themeOverride: null,
              appearanceOverride: null,
              styleOverride: null,
              accentOverride: null,
              elevationOverride: null,
              opacityOverride: null,
              radiusOverride: null,
              borderOpacityOverride: null,
              backgroundColorOverride: null,
              gradientOverride: 'inherit',
              textColorOverride: null,
              iconStyleOverride: null,
              fontFamilyOverride: null,
            }
          : w
      )
    );
    setWidgetBackgrounds((prev) => ({
      ...prev,
      [id]: { ...DEFAULT_WIDGET_BACKGROUND },
    }));
    appendIpcLog(
      `org.urwidgets.Daemon1.ResetWidgetPreferences("widget.${id}") -> Inherit Global`
    );
  };

  const handleUpdateWidgetBackground = (
    id: WidgetId,
    config: WidgetBackgroundConfig
  ) => {
    setWidgetBackgrounds((prev) => ({
      ...prev,
      [id]: config,
    }));
    appendIpcLog(
      `org.urwidgets.Daemon1.SetWidgetBackground("${id}", fit="${config.fitMode}")`
    );
  };

  const handleResetWidgetBackground = (id: WidgetId) => {
    setWidgetBackgrounds((prev) => ({
      ...prev,
      [id]: { ...DEFAULT_WIDGET_BACKGROUND },
    }));
    appendIpcLog(`org.urwidgets.Daemon1.ResetWidgetBackground("${id}")`);
  };

  // Safe Reset: resets appearance & layout while preserving user notes, archived todos, and alarms
  const handleResetAllSettings = () => {
    setThemes(INITIAL_THEME_PRESETS);
    setActiveThemeId('warm-minimal');
    setAppearanceMode('light');
    setWidgetStyle('default');
    setAccentColorId('pink');
    setCustomAccentHex('#FF5A79');
    setSystemFontId('sf-pro');
    setGlobalElevation(2);
    setKwinCompositorConfig(DEFAULT_KWIN_COMPOSITOR_CONFIG);
    setWidgets(INITIAL_WIDGET_INSTANCES);
    setWidgetBackgrounds(INITIAL_WIDGET_BACKGROUNDS);
    setUse24h(false);
    setShowSeconds(false);
    setUseCelsius(true);
    appendIpcLog(
      'Reset layout & appearance defaults (user notes, todos, alarms & SQLite data preserved)'
    );
  };

  const handleChangeCustomAccentHex = (hex: string) => {
    setCustomAccentHex(hex);
    setAccentColorId('custom');
    const clean = normalizeHexColor(hex, '#FF5A79');
    appendIpcLog(
      `org.urwidgets.Daemon1.SetGlobalAccentHex("${clean}") -> applied globally`
    );
  };

  // To-Do List Handlers (with Deadline & Delete)
  const handleAddTodo = (
    title: string,
    dueDateIso: string,
    dueTime: string,
    priority: TodoPriority,
    category = 'Work'
  ) => {
    const newId = `todo-${Date.now().toString(36)}`;
    setTodos((prev) =>
      addTodoItem(prev, {
        id: newId,
        title: title.trim() || 'Untitled Task',
        completed: false,
        priority,
        category: category || 'General',
        dueDate: dueDateIso || 'No deadline',
        dueDateIso,
        dueTime,
      })
    );
    appendIpcLog(
      `org.urwidgets.Daemon1.TodoAction("add", "${newId}", "${title}", deadline="${dueDateIso} ${dueTime}")`
    );
  };

  const handleToggleTodo = (id: string) => {
    setTodos((prev) => toggleTodoItem(prev, id));
    appendIpcLog(`org.urwidgets.Daemon1.TodoAction("toggle", "${id}")`);
  };

  const handleUpdateTodo = (
    id: string,
    updates: {
      title?: string;
      dueDateIso?: string;
      dueTime?: string;
      priority?: TodoPriority;
      category?: string;
    }
  ) => {
    setTodos((prev) => updateTodoItem(prev, id, updates));
    appendIpcLog(`org.urwidgets.Daemon1.TodoAction("update", "${id}")`);
  };

  const handleDeleteTodo = (id: string) => {
    setTodos((prev) => deleteTodoItem(prev, id));
    appendIpcLog(`SQLite DELETE FROM todo_items WHERE id="${id}"`);
  };

  const handleClearCompletedTodos = () => {
    setTodos((prev) => clearCompletedTodos(prev));
    appendIpcLog('SQLite DELETE FROM todo_items WHERE completed = 1');
  };

  // Clock Alarm Handlers
  const handleToggleAlarm = (id: string) => {
    setAlarms((prev) => toggleAlarmInList(prev, id));
    appendIpcLog(`org.urwidgets.Daemon1.ToggleAlarm("${id}")`);
  };

  const handleUpsertAlarm = (alarm: AlarmItem) => {
    setAlarms((prev) => upsertAlarmInList(prev, alarm));
    appendIpcLog(
      `org.urwidgets.Daemon1.UpsertAlarm("${alarm.time}", "${alarm.label}")`
    );
  };

  const handleDeleteAlarm = (id: string) => {
    setAlarms((prev) => deleteAlarmFromList(prev, id));
    appendIpcLog(`org.urwidgets.Daemon1.DeleteAlarm("${id}")`);
  };

  const handleSetGlobalAlarmRingtone = (ringtonePath: string) => {
    const cleanPath = ringtonePath.trim() || '~/Music/';
    setAlarms((prev) =>
      prev.map((a) => ({
        ...a,
        ringtoneId: 'custom-local',
        customAudioPath: cleanPath,
      }))
    );
    appendIpcLog(
      `org.urwidgets.Daemon1.SetGlobalAlarmRingtone("${cleanPath}") -> applied to all alarms`
    );
  };

  const handleSnoozeDueAlarm = (alarmId: string, snoozeMins = 10) => {
    const res = snoozeAlarm(
      alarms,
      dueAlarmQueue,
      alarmId,
      '07:00',
      snoozeMins
    );
    setAlarms(res.updatedAlarms);
    setDueAlarmQueue(res.updatedQueue);
    appendIpcLog(
      `org.urwidgets.Daemon1.SnoozeAlarm("${alarmId}", ${snoozeMins}m)`
    );
  };

  const handleStopDueAlarm = (alarmId: string) => {
    const res = stopActiveAlarm(alarms, dueAlarmQueue, alarmId);
    setAlarms(res.updatedAlarms);
    setDueAlarmQueue(res.updatedQueue);
    appendIpcLog(`org.urwidgets.Daemon1.StopAlarm("${alarmId}")`);
  };

  const handleTriggerTestAlarm = (alarmId?: string) => {
    const target =
      (alarmId ? alarms.find((a) => a.id === alarmId) : undefined) ||
      alarms.find(
        (a) =>
          Boolean(a.customAudioDataUrl) ||
          Boolean(a.customAudioPath) ||
          a.ringtoneId === 'custom'
      ) ||
      alarms.find((a) => a.enabled) ||
      alarms[0];
    if (!target) return;
    const res = triggerDueAlarms(
      alarms.map((a) => (a.id === target.id ? { ...a, enabled: true } : a)),
      dueAlarmQueue,
      target.time,
      new Date().toISOString()
    );
    setAlarms(res.updatedAlarms);
    setDueAlarmQueue(res.updatedQueue);
    appendIpcLog(
      `org.urwidgets.Daemon1.AlarmTriggered("${target.label}", "${target.time}", ringtone="${target.customAudioPath || target.ringtoneId}")`
    );
  };

  // Notes Handlers
  const handleUpsertNote = (input: {
    id?: string;
    title: string;
    body: string;
    pinned?: boolean;
    tags?: string[];
  }): NoteItem => {
    const existing = input.id ? notes.find((n) => n.id === input.id) : null;
    const noteObj: NoteItem = {
      id: existing?.id || input.id || `note-${Date.now().toString(36)}`,
      title: input.title.trim() || 'Untitled Note',
      body: input.body,
      pinned: input.pinned ?? existing?.pinned ?? false,
      tags: input.tags ?? existing?.tags ?? ['Note'],
      updatedAtIso: new Date().toISOString(),
      updatedAtLabel: 'Just now',
    };
    setNotes((prev) => upsertNoteInList(prev, noteObj));
    appendIpcLog(`org.urwidgets.Daemon1.SaveNote("${noteObj.id}") [400ms WAL]`);
    return noteObj;
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => deleteNoteFromList(prev, id));
    appendIpcLog(`org.urwidgets.Daemon1.DeleteNote("${id}")`);
  };

  const handleTogglePinNote = (id: string) => {
    setNotes((prev) => togglePinNoteInList(prev, id));
    appendIpcLog(`org.urwidgets.Daemon1.TogglePinNote("${id}")`);
  };

  const handleChangeCalMonth = (delta: number) => {
    let nextMonth = calMonth + delta;
    let nextYear = calYear;
    if (nextMonth < 0) {
      nextMonth = 11;
      nextYear -= 1;
    } else if (nextMonth > 11) {
      nextMonth = 0;
      nextYear += 1;
    }
    setCalMonth(nextMonth);
    setCalYear(nextYear);
  };

  const handleAddAgendaEvent = (
    title: string,
    startTime: string,
    endTime: string,
    category: AgendaEvent['category']
  ) => {
    const newEvt: AgendaEvent = {
      id: `evt-${Date.now().toString(36)}`,
      title,
      dateIso: '2026-11-08',
      startTime,
      endTime,
      category,
      completed: false,
    };
    setAgendaEvents((prev) => [...prev, newEvt]);
    appendIpcLog(
      `org.urwidgets.Daemon1.AddAgendaEvent("${title}", "${startTime}")`
    );
  };

  const handleToggleAgendaEvent = (id: string) => {
    setAgendaEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, completed: !e.completed } : e))
    );
  };

  const handleDeleteAgendaEvent = (id: string) => {
    setAgendaEvents((prev) => prev.filter((e) => e.id !== id));
    appendIpcLog(`SQLite DELETE FROM agenda_events WHERE id="${id}"`);
  };

  const selectedFontCss =
    SYSTEM_FONT_OPTIONS.find((f) => f.id === systemFontId)?.cssStack ||
    SYSTEM_FONT_OPTIONS[0].cssStack;

  const showcaseStatusSummary = `Style: ${widgetStyle} · Mode: ${appearanceMode} · Profile: ${kwinCompositorConfig.performanceProfile} · Accent: ${
    accentColorId === 'custom' ? customAccentHex : accentColorId
  } · ${NATIVE_SOURCE_FILES.length} Native QML/Rust Files`;

  const showcaseContent = (
    <div style={{ fontFamily: selectedFontCss }}>
      {activeNav === 'desktop' && (
        <PlasmaDesktopView
          themes={themes}
          activeThemeId={activeThemeId}
          onSelectTheme={handleSelectTheme}
          appearanceMode={appearanceMode}
          onChangeAppearanceMode={(mode) => {
            setAppearanceMode(mode);
            appendIpcLog(`Global Appearance mode -> "${mode}"`);
          }}
          widgetStyle={widgetStyle}
          onChangeWidgetStyle={(style) => {
            setWidgetStyle(style);
            appendIpcLog(`Global Widget surface style -> "${style}"`);
          }}
          accentColorId={accentColorId}
          onChangeAccentColorId={(accent) => {
            setAccentColorId(accent);
            appendIpcLog(`Global Accent color -> "${accent}"`);
          }}
          customAccentHex={customAccentHex}
          onChangeCustomAccentHex={handleChangeCustomAccentHex}
          systemFontId={systemFontId}
          onChangeSystemFontId={(fontId) => {
            setSystemFontId(fontId);
            appendIpcLog(`System font family -> "${fontId}"`);
          }}
          globalElevation={globalElevation}
          kwinCompositorConfig={kwinCompositorConfig}
          onChangeKwinCompositorConfig={(nextCfg) => {
            setKwinCompositorConfig(nextCfg);
            appendIpcLog(
              `org.urwidgets.Daemon1.SetLiquidGlassProfile(profile="${nextCfg.performanceProfile}", fallback="${nextCfg.fallbackMode}", blur=${nextCfg.blurRadius}px)`
            );
          }}
          widgets={widgets}
          onToggleWidget={handleToggleWidget}
          onResizeWidget={handleResizeWidget}
          onSetWidgetThemeOverride={handleSetWidgetThemeOverride}
          onUpdateWidgetPreferences={handleUpdateWidgetPreferences}
          onResetSingleWidgetPreferences={handleResetSingleWidgetPreferences}
          onResetWidgets={handleResetAllSettings}
          widgetBackgrounds={widgetBackgrounds}
          onUpdateWidgetBackground={handleUpdateWidgetBackground}
          onResetWidgetBackground={handleResetWidgetBackground}
          now={now}
          use24h={use24h}
          onToggle24h={() => setUse24h((p) => !p)}
          showSeconds={showSeconds}
          onToggleSeconds={() => setShowSeconds((p) => !p)}
          clockMonoFont={clockMonoFont}
          onToggleClockFont={() => setClockMonoFont((p) => !p)}
          alarms={alarms}
          dueAlarmQueue={dueAlarmQueue}
          onToggleAlarm={handleToggleAlarm}
          onUpsertAlarm={handleUpsertAlarm}
          onDeleteAlarm={handleDeleteAlarm}
          onSetGlobalAlarmRingtone={handleSetGlobalAlarmRingtone}
          onSnoozeDueAlarm={handleSnoozeDueAlarm}
          onStopDueAlarm={handleStopDueAlarm}
          onTriggerTestAlarm={handleTriggerTestAlarm}
          notes={notes}
          onUpsertNote={handleUpsertNote}
          onDeleteNote={handleDeleteNote}
          onTogglePinNote={handleTogglePinNote}
          calYear={calYear}
          calMonth={calMonth}
          calLocale={calLocale}
          calFirstDay={calFirstDay}
          onChangeCalMonth={handleChangeCalMonth}
          onToggleCalLocale={() =>
            setCalLocale((p) => (p === 'en-US' ? 'id-ID' : 'en-US'))
          }
          onToggleCalFirstDay={() =>
            setCalFirstDay((p) => (p === 1 ? 0 : 1))
          }
          weatherCity={weatherCity}
          onChangeWeatherCity={(c) => {
            setWeatherCity(c);
            appendIpcLog(`Weather location updated -> "${c}"`);
          }}
          useCelsius={useCelsius}
          onToggleCelsius={() => setUseCelsius((p) => !p)}
          weatherOffline={weatherOffline}
          onToggleWeatherOffline={() => setWeatherOffline((p) => !p)}
          onRefreshWeather={() =>
            appendIpcLog(
              `org.urwidgets.Daemon1.RefreshWeather("${weatherCity}") -> 200 OK`
            )
          }
          pomodoro={pomodoro}
          onPomodoroStartPause={() => {
            setPomodoro((prev) =>
              transitionPomodoro(prev, {
                type: prev.status === 'Running' ? 'PAUSE' : 'START',
              })
            );
            appendIpcLog(
              `org.urwidgets.Daemon1.PomodoroAction("${
                pomodoro.status === 'Running' ? 'pause' : 'start'
              }")`
            );
          }}
          onPomodoroReset={() => {
            setPomodoro((prev) =>
              transitionPomodoro(prev, { type: 'RESET' })
            );
            appendIpcLog('org.urwidgets.Daemon1.PomodoroAction("reset")');
          }}
          onPomodoroPhase={(phase: PomodoroPhase) => {
            setPomodoro((prev) =>
              transitionPomodoro(prev, { type: 'SET_PHASE', phase })
            );
            appendIpcLog(
              `org.urwidgets.Daemon1.PomodoroAction("phase:${phase}")`
            );
          }}
          onUpdatePomodoroDurations={(study, shortB, longB) => {
            setPomodoro((prev) =>
              transitionPomodoro(prev, {
                type: 'UPDATE_DURATIONS',
                studyMins: study,
                shortBreakMins: shortB,
                longBreakMins: longB,
              })
            );
            appendIpcLog(
              `org.urwidgets.Daemon1.PomodoroAction("durations:${study}:${shortB}:${longB}")`
            );
          }}
          todos={todos}
          onAddTodo={handleAddTodo}
          onToggleTodo={handleToggleTodo}
          onUpdateTodo={handleUpdateTodo}
          onDeleteTodo={handleDeleteTodo}
          onClearCompletedTodos={handleClearCompletedTodos}
          agendaEvents={agendaEvents}
          onAddAgendaEvent={handleAddAgendaEvent}
          onUpdateAgendaEvent={(id, title, startTime, endTime, category) => {
            setAgendaEvents((prev) =>
              prev.map((ev) =>
                ev.id === id
                  ? { ...ev, title, startTime, endTime, category }
                  : ev
              )
            );
            appendIpcLog(
              `org.urwidgets.Daemon1.UpdateAgendaEvent("${id}", "${title}")`
            );
          }}
          onToggleAgendaEvent={handleToggleAgendaEvent}
          onDeleteAgendaEvent={handleDeleteAgendaEvent}
          onTriggerQuickAction={(label, cmd) =>
            appendIpcLog(`XDG Safe Exec [${label}] -> "${cmd}"`)
          }
          lastIpcMessage={ipcLog[0] || 'Ready'}
          sysCpu={sysCpu}
          sysMemMb={sysMemMb}
          sysMemPct={sysMemPct}
          sysIntervalSecs={sysIntervalSecs}
          onChangeSysInterval={(secs) => {
            setSysIntervalSecs(secs);
            appendIpcLog(`SystemMonitor poll interval -> ${secs}s`);
          }}
          onOpenControlCenter={() => switchTab('control-center')}
        />
      )}

      {activeNav === 'control-center' && (
        <ControlCenterView
          themes={themes}
          activeThemeId={activeThemeId}
          onSelectTheme={handleSelectTheme}
          onUpdateActiveTheme={handleUpdateActiveTheme}
          onCreateCustomTheme={handleCreateCustomTheme}
          onDeleteCustomTheme={handleDeleteCustomTheme}
          onImportThemeJson={handleImportThemeJson}
          appearanceMode={appearanceMode}
          onChangeAppearanceMode={(mode) => {
            setAppearanceMode(mode);
            appendIpcLog(`Global Appearance mode -> "${mode}"`);
          }}
          widgetStyle={widgetStyle}
          onChangeWidgetStyle={(style) => {
            setWidgetStyle(style);
            appendIpcLog(`Global Widget surface style -> "${style}"`);
          }}
          accentColorId={accentColorId}
          onChangeAccentColorId={(accent) => {
            setAccentColorId(accent);
            appendIpcLog(`Global Accent color -> "${accent}"`);
          }}
          customAccentHex={customAccentHex}
          onChangeCustomAccentHex={handleChangeCustomAccentHex}
          systemFontId={systemFontId}
          onChangeSystemFontId={(fontId) => {
            setSystemFontId(fontId);
            appendIpcLog(`System font family -> "${fontId}"`);
          }}
          globalElevation={globalElevation}
          onChangeGlobalElevation={(level) => {
            setGlobalElevation(level);
            appendIpcLog(`Global elevation level -> L${level}`);
          }}
          kwinCompositorConfig={kwinCompositorConfig}
          onChangeKwinCompositorConfig={(nextCfg) => {
            setKwinCompositorConfig(nextCfg);
            appendIpcLog(
              `org.urwidgets.Daemon1.SetLiquidGlassProfile(profile="${nextCfg.performanceProfile}", fallback="${nextCfg.fallbackMode}", blur=${nextCfg.blurRadius}px)`
            );
          }}
          widgets={widgets}
          onToggleWidget={handleToggleWidget}
          onResizeWidget={handleResizeWidget}
          onSetWidgetThemeOverride={handleSetWidgetThemeOverride}
          onSetWidgetElevationOverride={handleSetWidgetElevationOverride}
          onUpdateWidgetPreferences={handleUpdateWidgetPreferences}
          onResetSingleWidgetPreferences={handleResetSingleWidgetPreferences}
          widgetBackgrounds={widgetBackgrounds}
          onUpdateWidgetBackground={handleUpdateWidgetBackground}
          onResetWidgetBackground={handleResetWidgetBackground}
          onResetAllSettings={handleResetAllSettings}
          agendaEvents={agendaEvents}
          alarms={alarms}
          notes={notes}
          archivedTodosCount={todos.length}
          pomodoro={pomodoro}
          onUpdatePomodoroDurations={(study, shortB, longB) => {
            setPomodoro((prev) =>
              transitionPomodoro(prev, {
                type: 'UPDATE_DURATIONS',
                studyMins: study,
                shortBreakMins: shortB,
                longBreakMins: longB,
              })
            );
            appendIpcLog(
              `Updated Pomodoro durations: ${study}m / ${shortB}m / ${longB}m`
            );
          }}
          ipcLog={ipcLog}
        />
      )}

      {activeNav === 'source' && <SourceAndPackagesView />}

      {activeNav === 'architecture' && <ArchitectureRoadmapView />}
    </div>
  );

  return (
    <OfficialLandingWebsite
      activeShowcaseTab={activeNav}
      onChangeShowcaseTab={switchTab}
      showcaseContent={showcaseContent}
      showcaseStatusSummary={showcaseStatusSummary}
    />
  );
}
