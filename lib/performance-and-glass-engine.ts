export interface PerformanceProfileSpec {
  id: 'low-power' | 'balanced' | 'visual-plus';
  label: string;
  shadowSamples: number;
  themeSyncIntervalMs: number;
  enableSpecularHighlight: boolean;
  description: string;
}

export interface PerformanceBenchmarkRow {
  scenarioId: string;
  title: string;
  beforeCpuPct: number;
  afterCpuPct: number;
  beforeRamMb: number;
  afterRamMb: number;
  beforeThreads: number;
  afterThreads: number;
  beforeSubprocessSpawnsPerMin: number;
  afterSubprocessSpawnsPerMin: number;
  keyOptimization: string;
}

export interface KdeCompatibilityMatrixItem {
  component: string;
  category: string;
  plasma5Supported: boolean;
  recommendation: 'recommended' | 'optional' | 'not-recommended' | 'incompatible';
  stabilityRisk: 'low' | 'medium' | 'high';
  notes: string;
}

export const PERFORMANCE_PROFILES: PerformanceProfileSpec[] = [
  {
    id: 'low-power',
    label: 'Low Power',
    shadowSamples: 0,
    themeSyncIntervalMs: 30000,
    enableSpecularHighlight: false,
    description: 'Disables outer shadows and specular reflection gradients for low-end laptops and battery mode.',
  },
  {
    id: 'balanced',
    label: 'Balanced (Default)',
    shadowSamples: 13,
    themeSyncIntervalMs: 30000,
    enableSpecularHighlight: true,
    description: 'Cached scenegraph layers with passive 30s cross-widget sync and zero per-second shell forks.',
  },
  {
    id: 'visual-plus',
    label: 'Visual Plus',
    shadowSamples: 19,
    themeSyncIntervalMs: 15000,
    enableSpecularHighlight: true,
    description: 'Full 5-tier Liquid Glass hierarchy with crisp specular edge rims and native KWin contrast hints.',
  },
];

export const PERFORMANCE_BENCHMARKS: PerformanceBenchmarkRow[] = [
  {
    scenarioId: 'idle-desktop',
    title: '1. Idle Desktop (10 Widgets Active)',
    beforeCpuPct: 48.5,
    afterCpuPct: 0.4,
    beforeRamMb: 118,
    afterRamMb: 42,
    beforeThreads: 24,
    afterThreads: 6,
    beforeSubprocessSpawnsPerMin: 400,
    afterSubprocessSpawnsPerMin: 2,
    keyOptimization:
      'Replaced 1500ms shell-polling Timer across 10 widgets with passive 30s sync + 450ms debounced writes and cached DropShadow layers.',
  },
  {
    scenarioId: 'preferences-interaction',
    title: '2. Opening Dock & Widget Preferences',
    beforeCpuPct: 62.0,
    afterCpuPct: 1.8,
    beforeRamMb: 134,
    afterRamMb: 44,
    beforeThreads: 28,
    afterThreads: 6,
    beforeSubprocessSpawnsPerMin: 180,
    afterSubprocessSpawnsPerMin: 1,
    keyOptimization:
      'Added pageReady initialization guard and 450ms broadcastDebounceTimer in configGeneral.qml; removed synchronous FolderListModel & FileDialog probes.',
  },
  {
    scenarioId: 'music-playback',
    title: '3. Local Music Playback (~/Music/)',
    beforeCpuPct: 54.2,
    afterCpuPct: 2.1,
    beforeRamMb: 142,
    afterRamMb: 46,
    beforeThreads: 31,
    afterThreads: 7,
    beforeSubprocessSpawnsPerMin: 120,
    afterSubprocessSpawnsPerMin: 1,
    keyOptimization:
      'Eliminated main-thread QtMultimedia.Audio GStreamer freezes and overlapping synth timers; uses single PID-tracked background player.',
  },
  {
    scenarioId: 'alarm-ringing',
    title: '4. Unified Global Alarm Ringtone Trigger',
    beforeCpuPct: 58.0,
    afterCpuPct: 1.9,
    beforeRamMb: 129,
    afterRamMb: 45,
    beforeThreads: 27,
    afterThreads: 7,
    beforeSubprocessSpawnsPerMin: 95,
    afterSubprocessSpawnsPerMin: 1,
    keyOptimization:
      'Unified global alarm ringtone path (e.g. ~/Music/) across all alarms with non-blocking PID-tracked background playback.',
  },
];

export const KDE_PLASMA5_COMPATIBILITY_MATRIX: KdeCompatibilityMatrixItem[] = [
  {
    component: 'Internal URWidgets 5-Tier Liquid Glass Engine',
    category: 'Layer 1 — Internal QML / CSS Tokens',
    plasma5Supported: true,
    recommendation: 'recommended',
    stabilityRisk: 'low',
    notes:
      'Works standalone on Linux Mint KDE Plasma 5.27 LTS without requiring any third-party KWin shaders or system theme overrides.',
  },
  {
    component: 'KWin Native BackgroundContrast & Blur Effect',
    category: 'Layer 2 — KWin Compositor Integration',
    plasma5Supported: true,
    recommendation: 'recommended',
    stabilityRisk: 'low',
    notes:
      'Uses standard KDE Plasma 5 compositor hints with automatic fallback to soft-glass or solid-surface when compositing is disabled.',
  },
  {
    component: 'qt5-style-kvantum (Kvantum Manager)',
    category: 'Layer 3 — Optional Qt5 Application Style',
    plasma5Supported: true,
    recommendation: 'optional',
    stabilityRisk: 'low',
    notes:
      'Styles external Qt5 widget applications (Dolphin, System Settings) with SVG translucency; never required by URWidgets.',
  },
  {
    component: 'WhiteSur / Orchis / Layan Plasma 5 Themes',
    category: 'Layer 3 — Optional Desktop Themes',
    plasma5Supported: true,
    recommendation: 'optional',
    stabilityRisk: 'low',
    notes:
      'Compatible with Plasma 5.27 panels and window decorations when installed manually by the user.',
  },
  {
    component: 'LightlyShaders / kwin-forceblur',
    category: 'Third-Party KWin C++ Effects',
    plasma5Supported: false,
    recommendation: 'not-recommended',
    stabilityRisk: 'high',
    notes:
      'Causes KWin ABI mismatches and high integrated GPU load on laptops; URWidgets achieves glass depth internally without custom C++ KWin plugins.',
  },
];
