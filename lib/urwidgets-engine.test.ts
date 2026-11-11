import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_THEME_PRESETS,
  INITIAL_WIDGET_INSTANCES,
  INITIAL_QUICK_ACTIONS,
  ACCENT_COLORS,
  GRADIENT_PRESETS,
  SYSTEM_FONT_OPTIONS,
  ELEVATION_LEVELS,
  DEVELOPER_ATTRIBUTION,
  computeElevationShadow,
  computeMacOsWidgetSurface,
  resolveIndependentWidgetSurface,
  INITIAL_WIDGET_BACKGROUNDS,
  convertTemp,
  formatTemp,
  computeCalendarGrid,
  transitionPomodoro,
  formatPomodoroSeconds,
  updateAgendaItemInList,
  hexToRgba,
  INITIAL_ALARMS,
  formatAlarmRepeat,
  toggleAlarmInList,
  upsertAlarmInList,
  deleteAlarmFromList,
  computeNextAlarmSummary,
  computeNextAlarmWakeupSecs,
  triggerDueAlarms,
  snoozeAlarm,
  stopActiveAlarm,
  validateAudioFormat,
  INITIAL_NOTES,
  upsertNoteInList,
  deleteNoteFromList,
  togglePinNoteInList,
  filterNotesByQuery,
  INITIAL_TODOS,
  computeTodoProgress,
  computeTodoDeadlineStatus,
  filterTodosByQuery,
  addTodoItem,
  toggleTodoItem,
  reorderTodoItems,
  clearCompletedTodos,
  validateWidgetBackgroundFormat,
  validateAlarmTimeParts,
  parseAlarmTimeParts,
  formatAlarmTimeParts,
  clampPhotoCrop,
  computePhotoCropTransform,
  SLIDESHOW_INTERVAL_PRESETS,
  INITIAL_MUSIC_PLAYER_STATE,
  LOCAL_MUSIC_FOLDERS,
  validateMusicAudioFormat,
  validateDirectAudioStreamUrl,
  formatAudioDuration,
  transitionMusicPlayer,
  PomodoroState,
  AgendaEvent,
} from './urwidgets-engine';

test('all 6 required theme presets exist with valid colors and radius, starting with WidgetWall Light (warm-minimal)', () => {
  const ids = INITIAL_THEME_PRESETS.map((t) => t.id);
  assert.deepEqual(ids, [
    'warm-minimal',
    'liquid-glass',
    'pastel-editorial',
    'aurora-gradient',
    'midnight',
    'monochrome',
  ]);
  for (const theme of INITIAL_THEME_PRESETS) {
    assert.ok(theme.appearance.opacity > 0 && theme.appearance.opacity <= 1);
    assert.ok(theme.appearance.radius >= 14);
  }
});

test('macOS appearance system provides 9 accent colors, 8 gradient presets, 4 3D elevation levels, and developer attribution', () => {
  assert.equal(ACCENT_COLORS.length, 9);
  assert.equal(GRADIENT_PRESETS.length, 8);
  assert.ok(SYSTEM_FONT_OPTIONS.length >= 5);
  assert.equal(ELEVATION_LEVELS.length, 4);
  assert.equal(computeElevationShadow(0, false), 'none');
  assert.ok(computeElevationShadow(1, false).includes('inset'));
  assert.ok(computeElevationShadow(2, false).includes('rgba'));
  assert.ok(computeElevationShadow(3, true).includes('inset'));
  assert.equal(DEVELOPER_ATTRIBUTION.author, 'Haris Gitama');
  assert.equal(DEVELOPER_ATTRIBUTION.githubUrl, 'https://github.com/Harisgitama');
  assert.equal(DEVELOPER_ATTRIBUTION.portfolioUrl, 'https://rissaxie.com');
  assert.equal(DEVELOPER_ATTRIBUTION.portfolioLabel, 'rissaxie.com');
  assert.equal(DEVELOPER_ATTRIBUTION.instagramUrl, 'https://www.instagram.com/hrisgtaa_/');
  assert.equal(DEVELOPER_ATTRIBUTION.instagramLabel, '@hrisgtaa_');

  const baseTheme = INITIAL_THEME_PRESETS[0];
  const lightDefault = computeMacOsWidgetSurface(
    baseTheme,
    'light',
    'default',
    'pink',
    2
  );
  assert.equal(lightDefault.isDarkSurface, false);
  assert.equal(lightDefault.accentHex, '#E84A7F');

  const darkSurface = computeMacOsWidgetSurface(
    baseTheme,
    'dark',
    'dark',
    'blue',
    2
  );
  assert.equal(darkSurface.isDarkSurface, true);
  assert.equal(darkSurface.accentHex, '#007AFF');

  const tintedSurface = computeMacOsWidgetSurface(
    baseTheme,
    'light',
    'tinted',
    'purple',
    1
  );
  assert.equal(tintedSurface.accentHex, '#9B51E0');
  assert.ok(tintedSurface.background.includes('linear-gradient'));
});

test('10 active modular widgets are registered with independent widget.<id> config IDs and unified global theme consistency', () => {
  assert.equal(INITIAL_WIDGET_INSTANCES.length, 10);
  const widgetIds = INITIAL_WIDGET_INSTANCES.map((w) => w.id);
  assert.ok(widgetIds.includes('clock'));
  assert.ok(widgetIds.includes('calendar'));
  assert.ok(widgetIds.includes('pomodoro'));
  assert.ok(widgetIds.includes('photos'));
  assert.ok(widgetIds.includes('notes'));
  assert.ok(widgetIds.includes('music_player'));
  assert.equal(widgetIds.includes('todo' as never), false);
  assert.equal('todo' in INITIAL_WIDGET_BACKGROUNDS, false);
  assert.equal(INITIAL_QUICK_ACTIONS.length, 6);

  // Verify all widgets follow the unified global theme while respecting per-widget elevation overrides:
  const clockInst = {
    ...INITIAL_WIDGET_INSTANCES.find((w) => w.id === 'clock')!,
    elevationOverride: 1 as const,
  };
  const calInst = {
    ...INITIAL_WIDGET_INSTANCES.find((w) => w.id === 'calendar')!,
    elevationOverride: 3 as const,
  };

  const clockSurf = resolveIndependentWidgetSurface(
    clockInst,
    INITIAL_THEME_PRESETS,
    'warm-minimal',
    'dark',
    'clear',
    'blue',
    2
  );
  const calSurf = resolveIndependentWidgetSurface(
    calInst,
    INITIAL_THEME_PRESETS,
    'warm-minimal',
    'dark',
    'clear',
    'blue',
    2
  );

  assert.equal(clockSurf.isDarkSurface, true);
  assert.equal(clockSurf.accentHex, '#007AFF');
  assert.equal(clockSurf.effectiveStyle, 'clear');

  assert.equal(calSurf.isDarkSurface, true);
  assert.equal(calSurf.accentHex, '#007AFF');
  assert.equal(calSurf.effectiveStyle, 'clear');
});

test('weather temperature conversion handles Celsius and Fahrenheit accurately', () => {
  assert.equal(convertTemp(25, true), 25);
  assert.equal(convertTemp(25, false), 77);
  assert.equal(formatTemp(0, false), '32°F');
  assert.equal(formatTemp(24, true), '24°C');
});

test('calendar grid supports English and Indonesian locales and configurable first day of week', () => {
  const novEnMon = computeCalendarGrid(2026, 10, 'en-US', 1); // Nov 2026 starts on Sunday
  assert.equal(novEnMon.monthLabel, 'November');
  assert.equal(novEnMon.weekdayHeaders[0], 'Mon');
  assert.equal(novEnMon.leadingEmptyCells, 6);
  assert.equal(novEnMon.daysInMonth, 30);

  const augIdSun = computeCalendarGrid(2026, 7, 'id-ID', 0); // August in Indonesian
  assert.equal(augIdSun.monthLabel, 'Agustus');
  assert.equal(augIdSun.weekdayHeaders[0], 'Min');
  assert.equal(augIdSun.daysInMonth, 31);
});

test('pomodoro state machine transitions start, tick, pause, custom durations, completion, and reset accurately', () => {
  const initial: PomodoroState = {
    phase: 'Study',
    status: 'Idle',
    remainingSecs: 1500,
    totalSecs: 1500,
    completedSessions: 2,
    studyMins: 25,
    shortBreakMins: 5,
    longBreakMins: 15,
    notifyOnComplete: true,
  };

  const started = transitionPomodoro(initial, { type: 'START' });
  assert.equal(started.status, 'Running');

  const ticked = transitionPomodoro(started, { type: 'TICK', elapsedSecs: 300 });
  assert.equal(ticked.remainingSecs, 1200);
  assert.equal(formatPomodoroSeconds(ticked.remainingSecs), '20:00');

  const finished = transitionPomodoro(ticked, {
    type: 'TICK',
    elapsedSecs: 1200,
  });
  assert.equal(finished.status, 'Idle');
  assert.equal(finished.remainingSecs, 0);
  assert.equal(finished.completedSessions, 3);

  const customDur = transitionPomodoro(finished, {
    type: 'UPDATE_DURATIONS',
    studyMins: 40,
    shortBreakMins: 10,
    longBreakMins: 20,
  });
  assert.equal(customDur.studyMins, 40);
  assert.equal(customDur.remainingSecs, 2400);
});

test('updateAgendaItemInList edits agenda event fields immutably', () => {
  const sample: AgendaEvent[] = [
    {
      id: 'evt-1',
      title: 'Initial Title',
      dateIso: '2026-11-08',
      startTime: '09:00',
      endTime: '10:00',
      category: 'Engineering',
      completed: false,
    },
  ];
  const updated = updateAgendaItemInList(sample, 'evt-1', {
    title: 'Edited Title',
    startTime: '10:30',
  });
  assert.equal(updated[0].title, 'Edited Title');
  assert.equal(updated[0].startTime, '10:30');
});

test('Clock Alarm Manager handles time picker validation, multiple alarms, weekday formatting, due queue, snooze, stop, and audio format validation', () => {
  assert.equal(INITIAL_ALARMS.length, 3);
  const validTime = validateAlarmTimeParts(7, 30);
  assert.equal(validTime.valid, true);
  assert.equal(validTime.formatted, '07:30');
  const invalidTime = validateAlarmTimeParts(26, 75);
  assert.equal(invalidTime.valid, false);
  assert.equal(invalidTime.formatted, '23:59');
  assert.deepEqual(parseAlarmTimeParts('14:05'), { hour: 14, minute: 5 });
  assert.equal(formatAlarmTimeParts(6, 5), '06:05');

  assert.equal(
    formatAlarmRepeat(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']),
    'Weekdays'
  );
  assert.equal(
    formatAlarmRepeat(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']),
    'Every day'
  );
  assert.equal(formatAlarmRepeat([]), 'One-time');

  const summary = computeNextAlarmSummary(INITIAL_ALARMS);
  assert.equal(summary.enabledCount, 2);
  assert.equal(summary.nextAlarm?.time, '07:00');

  const wakeupSecs = computeNextAlarmWakeupSecs(
    INITIAL_ALARMS,
    new Date('2026-11-09T06:50:00')
  );
  assert.equal(wakeupSecs, 600); // 10 minutes = 600s

  // Trigger due alarm at 07:00
  const triggered = triggerDueAlarms(
    INITIAL_ALARMS,
    [],
    '07:00',
    '2026-11-09T07:00:00Z'
  );
  assert.equal(triggered.updatedQueue.length, 1);
  assert.equal(triggered.updatedQueue[0].label, 'Wake Up');

  // Snooze alarm by 10 minutes -> 07:10
  const snoozed = snoozeAlarm(
    triggered.updatedAlarms,
    triggered.updatedQueue,
    'alm-wake',
    '07:00',
    10
  );
  assert.equal(snoozed.updatedQueue.length, 0);
  const wakeAlarm = snoozed.updatedAlarms.find((a) => a.id === 'alm-wake');
  assert.equal(wakeAlarm?.snoozedUntilTime, '07:10');

  // Stop alarm
  const stopped = stopActiveAlarm(
    snoozed.updatedAlarms,
    snoozed.updatedQueue,
    'alm-wake'
  );
  assert.equal(
    stopped.updatedAlarms.find((a) => a.id === 'alm-wake')?.snoozedUntilTime,
    null
  );

  // Upsert, toggle, delete
  const toggled = toggleAlarmInList(INITIAL_ALARMS, 'alm-lunch');
  assert.equal(toggled.find((a) => a.id === 'alm-lunch')?.enabled, true);

  const upserted = upsertAlarmInList(INITIAL_ALARMS, {
    id: 'alm-evening',
    time: '21:15',
    label: 'Evening Reading',
    enabled: true,
    repeatDays: ['Sun'],
    ringtoneId: 'soft-pulse',
    snoozeMinutes: 15,
  });
  assert.equal(upserted.length, 4);
  const deleted = deleteAlarmFromList(upserted, 'alm-evening');
  assert.equal(deleted.length, 3);

  // Audio format validation
  assert.equal(validateAudioFormat('chime.ogg').valid, true);
  assert.equal(validateAudioFormat('alarm.mp3').valid, true);
  assert.equal(validateAudioFormat('script.exe').valid, false);
});

test('Notes widget logic supports pin sorting, upsert, delete, and search filtering', () => {
  assert.equal(INITIAL_NOTES.length, 3);
  assert.equal(INITIAL_NOTES[0].pinned, true);

  const pinned = togglePinNoteInList(INITIAL_NOTES, 'note-2');
  assert.equal(pinned.find((n) => n.id === 'note-2')?.pinned, true);

  const added = upsertNoteInList(INITIAL_NOTES, {
    id: 'note-4',
    title: 'Quick Grocery Note',
    body: 'Matcha, oat milk, espresso beans',
    pinned: false,
    tags: ['Personal'],
    updatedAtIso: '2026-11-09T09:00:00Z',
    updatedAtLabel: 'Just now',
  });
  assert.equal(added.length, 4);

  const filtered = filterNotesByQuery(added, 'espresso');
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].id, 'note-4');

  const afterDel = deleteNoteFromList(added, 'note-4');
  assert.equal(afterDel.length, 3);
});

test('Todo List widget logic computes completion summary, deadline statuses (overdue, due_today, upcoming, completed, none), search filter, and task mutations', () => {
  const progress = computeTodoProgress(INITIAL_TODOS);
  assert.equal(progress.total, 5);
  assert.equal(progress.completed, 3);
  assert.equal(progress.summaryText, '3 of 5 completed');

  const overdueStatus = computeTodoDeadlineStatus(
    { completed: false, dueDateIso: '2026-11-07', dueTime: '17:00' },
    '2026-11-09',
    '09:00'
  );
  assert.equal(overdueStatus.status, 'overdue');
  assert.equal(overdueStatus.badgeLabel, 'Overdue');

  const dueTodayStatus = computeTodoDeadlineStatus(
    { completed: false, dueDateIso: '2026-11-09', dueTime: '16:30' },
    '2026-11-09',
    '09:00'
  );
  assert.equal(dueTodayStatus.status, 'due_today');
  assert.equal(dueTodayStatus.badgeLabel, 'Due today');

  const upcomingStatus = computeTodoDeadlineStatus(
    { completed: false, dueDateIso: '2026-11-12', dueTime: '18:00' },
    '2026-11-09',
    '09:00'
  );
  assert.equal(upcomingStatus.status, 'upcoming');
  assert.equal(upcomingStatus.badgeLabel, 'Upcoming');

  const noDeadlineStatus = computeTodoDeadlineStatus(
    { completed: false, dueDateIso: '', dueTime: '' },
    '2026-11-09',
    '09:00'
  );
  assert.equal(noDeadlineStatus.status, 'none');

  const searched = filterTodosByQuery(INITIAL_TODOS, 'shader', false);
  assert.equal(searched.length, 1);
  assert.equal(searched[0].id, 'todo-4');

  const withAdded = addTodoItem(INITIAL_TODOS, {
    id: 'todo-6',
    title: 'Test D-Bus signal broadcast',
    completed: false,
    priority: 'high',
    category: 'Engineering',
    dueDate: 'Today',
    dueDateIso: '2026-11-09',
    dueTime: '19:00',
  });
  assert.equal(withAdded.length, 6);

  const toggled = toggleTodoItem(withAdded, 'todo-6');
  assert.equal(toggled.find((t) => t.id === 'todo-6')?.completed, true);

  const reordered = reorderTodoItems(INITIAL_TODOS, 'todo-2', 'up');
  assert.equal(reordered[0].id, 'todo-2');

  const cleared = clearCompletedTodos(INITIAL_TODOS);
  assert.equal(cleared.length, 2);
});

test('Photo Frame crop editor clamps zoom/offsets non-destructively and provides slideshow interval presets', () => {
  assert.deepEqual(SLIDESHOW_INTERVAL_PRESETS, [5, 10, 15, 30, 60]);
  const clamped = clampPhotoCrop({
    zoom: 3.8,
    offsetX: -85,
    offsetY: 20,
    fitMode: 'cover',
  });
  assert.equal(clamped.zoom, 2.5);
  assert.equal(clamped.offsetX, -50);
  assert.equal(clamped.offsetY, 20);

  const transform = computePhotoCropTransform(clamped);
  assert.equal(transform.objectFit, 'cover');
  assert.ok(transform.transformCss.includes('scale(2.5)'));
});

test('URWidgets Music Player validates local audio formats, direct online stream URLs, and playback state transitions', () => {
  assert.equal(validateMusicAudioFormat('track.flac').valid, true);
  assert.equal(validateMusicAudioFormat('track.mp3').valid, true);
  assert.equal(validateMusicAudioFormat('track.m4a').valid, true);
  assert.equal(validateMusicAudioFormat('malware.sh').valid, false);

  const validStream = validateDirectAudioStreamUrl(
    'https://ice2.somafm.com/groovesalad-128-mp3'
  );
  assert.equal(validStream.valid, true);

  const invalidWebpage = validateDirectAudioStreamUrl(
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  );
  assert.equal(invalidWebpage.valid, false);
  assert.ok(invalidWebpage.error?.includes('Unsupported webpage'));

  assert.equal(formatAudioDuration(214), '3:34');

  const playing = transitionMusicPlayer(INITIAL_MUSIC_PLAYER_STATE, {
    type: 'PLAY',
  });
  assert.equal(playing.isPlaying, true);

  const sought = transitionMusicPlayer(playing, {
    type: 'SEEK',
    positionSecs: 120,
  });
  assert.equal(sought.positionSecs, 120);

  const nextTrack = transitionMusicPlayer(sought, { type: 'NEXT' });
  assert.equal(nextTrack.currentIndex, 1);
  assert.equal(nextTrack.positionSecs, 0);

  const switchedFolder = transitionMusicPlayer(nextTrack, {
    type: 'SELECT_FOLDER',
    folderPath: LOCAL_MUSIC_FOLDERS[1].path,
    tracks: LOCAL_MUSIC_FOLDERS[1].tracks,
  });
  assert.equal(switchedFolder.queue.length, 2);
  assert.equal(switchedFolder.currentIndex, 0);
});

test('Global WidgetBackground validates SVG, JPG, JPEG, PNG, and WebP formats accurately', () => {
  assert.equal(validateWidgetBackgroundFormat('/images/bg.svg').valid, true);
  assert.equal(validateWidgetBackgroundFormat('/images/bg.jpg').valid, true);
  assert.equal(validateWidgetBackgroundFormat('/images/bg.jpeg').valid, true);
  assert.equal(validateWidgetBackgroundFormat('/images/bg.png').valid, true);
  assert.equal(validateWidgetBackgroundFormat('/images/bg.webp').valid, true);
  assert.equal(validateWidgetBackgroundFormat('archive.zip').valid, false);
  assert.equal(validateWidgetBackgroundFormat('document.pdf').valid, false);
});

test('hexToRgba formats translucent colors properly', () => {
  assert.equal(hexToRgba('#1E293B', 0.75), 'rgba(30, 41, 59, 0.75)');
});


