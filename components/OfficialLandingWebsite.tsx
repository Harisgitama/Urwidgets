'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Clock,
  Calendar,
  CloudSun,
  Timer,
  FileText,
  Music,
  CheckSquare,
  Image as ImageIcon,
  Zap,
  Activity,
  Download,
  Terminal,
  Copy,
  Check,
  ExternalLink,
  Code2,
  Globe,
  Camera,
  Sliders,
  Layers,
  Cpu,
  HardDrive,
  Monitor,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Play,
  Pause,
  SkipForward,
  Volume2,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import {
  OFFICIAL_PRODUCT_IDENTITY,
  LANDING_NAV_ITEMS,
  PRODUCT_HIGHLIGHTS,
  WIDGET_FEATURES,
  PERSONALIZATION_CAPABILITIES,
  GALLERY_ITEMS,
  COMPATIBILITY_DATA,
  TERMINAL_INSTALLATION_STEPS,
  WidgetFeatureSpec,
  GalleryItemSpec,
  resolveLandingAsset,
} from '@/lib/official-website-data';

export interface OfficialLandingWebsiteProps {
  activeShowcaseTab: 'desktop' | 'control-center' | 'source' | 'architecture';
  onChangeShowcaseTab: (
    tab: 'desktop' | 'control-center' | 'source' | 'architecture'
  ) => void;
  showcaseContent: React.ReactNode;
  showcaseStatusSummary?: string;
}

function getWidgetIcon(id: WidgetFeatureSpec['id']) {
  switch (id) {
    case 'clock':
      return <Clock className="w-5 h-5 text-[#F472B6]" />;
    case 'calendar':
      return <Calendar className="w-5 h-5 text-[#A78BFA]" />;
    case 'weather':
      return <CloudSun className="w-5 h-5 text-[#60A5FA]" />;
    case 'pomodoro':
      return <Timer className="w-5 h-5 text-[#F472B6]" />;
    case 'notes':
      return <FileText className="w-5 h-5 text-[#C084FC]" />;
    case 'music_player':
      return <Music className="w-5 h-5 text-[#F472B6]" />;
    case 'agenda':
      return <CheckSquare className="w-5 h-5 text-[#A78BFA]" />;
    case 'photos':
      return <ImageIcon className="w-5 h-5 text-[#60A5FA]" />;
    case 'quick_actions':
      return <Zap className="w-5 h-5 text-[#F472B6]" />;
    case 'system_monitor':
      return <Activity className="w-5 h-5 text-[#60A5FA]" />;
  }
}

export default function OfficialLandingWebsite({
  activeShowcaseTab,
  onChangeShowcaseTab,
  showcaseContent,
  showcaseStatusSummary,
}: OfficialLandingWebsiteProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroPreviewStyle, setHeroPreviewStyle] = useState<
    'screenshot' | 'tinted-sandstone' | 'midnight-glass'
  >('screenshot');
  const [featureCategory, setFeatureCategory] = useState<
    'All' | 'Productivity' | 'Media & Visual' | 'System & Utilities'
  >('All');
  const [galleryCategory, setGalleryCategory] = useState<
    'All' | 'Desktop' | 'Productivity' | 'Media' | 'Customization'
  >('All');
  const [lightboxItem, setLightboxItem] = useState<GalleryItemSpec | null>(
    null
  );
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>(
    'idle'
  );
  const [heroMusicPlaying, setHeroMusicPlaying] = useState(false);

  const currentYear = new Date().getFullYear();

  const filteredFeatures =
    featureCategory === 'All'
      ? WIDGET_FEATURES
      : WIDGET_FEATURES.filter((w) => w.category === featureCategory);

  const filteredGallery =
    galleryCategory === 'All'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((g) => g.category === galleryCategory);

  // Lightbox keyboard navigation
  useEffect(() => {
    if (!lightboxItem) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxItem(null);
      } else if (e.key === 'ArrowRight') {
        const idx = GALLERY_ITEMS.findIndex((g) => g.id === lightboxItem.id);
        const nextIdx = (idx + 1) % GALLERY_ITEMS.length;
        setLightboxItem(GALLERY_ITEMS[nextIdx]);
      } else if (e.key === 'ArrowLeft') {
        const idx = GALLERY_ITEMS.findIndex((g) => g.id === lightboxItem.id);
        const prevIdx =
          (idx - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length;
        setLightboxItem(GALLERY_ITEMS[prevIdx]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxItem]);

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    const cleanId = sectionId.replace(/^#/, '');
    const el = document.getElementById(cleanId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCopyTerminalCommand = async () => {
    const cmd = OFFICIAL_PRODUCT_IDENTITY.terminalInstallCommand;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(cmd);
        setCopyStatus('copied');
        window.setTimeout(() => setCopyStatus('idle'), 2500);
        return;
      }
      // Fallback textarea copy
      const textArea = document.createElement('textarea');
      textArea.value = cmd;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (ok) {
        setCopyStatus('copied');
        window.setTimeout(() => setCopyStatus('idle'), 2500);
      } else {
        setCopyStatus('error');
        window.setTimeout(() => setCopyStatus('idle'), 3500);
      }
    } catch {
      setCopyStatus('error');
      window.setTimeout(() => setCopyStatus('idle'), 3500);
    }
  };

  return (
    <div className="min-h-screen bg-[#090B11] text-[#F3F4F8] selection:bg-[#E84A7F]/30 selection:text-white scroll-smooth">
      {/* Subtle ambient background gradients */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden z-0"
        aria-hidden="true"
      >
        <div
          className="absolute -top-48 left-1/4 w-[680px] h-[420px] rounded-full opacity-20 blur-[130px]"
          style={{
            background:
              'radial-gradient(circle, rgba(139,92,246,0.45) 0%, rgba(232,74,127,0.22) 55%, transparent 100%)',
          }}
        />
        <div
          className="absolute top-[38%] -right-32 w-[560px] h-[420px] rounded-full opacity-15 blur-[130px]"
          style={{
            background:
              'radial-gradient(circle, rgba(59,130,246,0.4) 0%, rgba(168,85,247,0.2) 60%, transparent 100%)',
          }}
        />
      </div>

      {/* =====================================================================
          3. STICKY TRANSLUCENT NAVIGATION BAR (Strict 3-Zone Top Bar Contract)
      ====================================================================== */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#090B11]/85 backdrop-blur-xl">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Left — URWidgets logo and wordmark */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('home');
            }}
            className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E84A7F] rounded-md"
          >
            <span
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-sm"
              style={{
                background:
                  'linear-gradient(135deg, #E84A7F 0%, #9B51E0 55%, #3B82F6 100%)',
              }}
              aria-hidden="true"
            >
              UR
            </span>
            <span>URWidgets</span>
          </a>

          {/* Zone 2: Center — Home, Features, Gallery, Compatibility, About */}
          <nav
            className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300"
            aria-label="Primary Navigation"
          >
            {LANDING_NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.id);
                }}
                className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#E84A7F]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Right — Download button + compact mobile menu trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={OFFICIAL_PRODUCT_IDENTITY.officialReleaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-2 shadow-sm hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E84A7F]"
              style={{
                background:
                  'linear-gradient(135deg, #E84A7F 0%, #8B5CF6 100%)',
              }}
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={
                mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
              }
              aria-expanded={mobileMenuOpen}
              className="md:hidden p-2 rounded-lg border border-white/10 text-slate-200 hover:bg-white/5 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Compact Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/[0.08] bg-[#0D1018]/95 backdrop-blur-xl px-5 py-4 space-y-3">
            <nav className="flex flex-col space-y-2" aria-label="Mobile Navigation">
              {LANDING_NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.id);
                  }}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:text-white hover:bg-white/5 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-400 font-mono">
                {OFFICIAL_PRODUCT_IDENTITY.latestPublishedReleaseLabel}
              </span>
              <a
                href={OFFICIAL_PRODUCT_IDENTITY.officialReleaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-xs font-semibold text-white rounded-lg flex items-center gap-1.5"
                style={{
                  background:
                    'linear-gradient(135deg, #E84A7F 0%, #8B5CF6 100%)',
                }}
              >
                <Download className="w-3.5 h-3.5" />
                Download URWidgets
              </a>
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10">
        {/* =====================================================================
            4. HERO SECTION (Asymmetric Two-Column Layout)
        ====================================================================== */}
        <section
          id="home"
          className="max-w-[1360px] mx-auto px-5 sm:px-8 pt-12 pb-20 lg:pt-16 lg:pb-24"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Headline, Description, CTAs, Unboxed Metadata */}
            <div className="lg:col-span-5 space-y-6">
              <div className="text-xs font-mono text-[#F472B6] tracking-wide">
                URWidgets · KDE Plasma 5 Desktop Ecosystem
              </div>

              <h1
                className="text-4xl sm:text-5xl lg:text-[52px] font-bold tracking-tight text-white leading-[1.08]"
                style={{ textWrap: 'balance' }}
              >
                {OFFICIAL_PRODUCT_IDENTITY.tagline}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                {OFFICIAL_PRODUCT_IDENTITY.heroDescription}
              </p>

              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                {OFFICIAL_PRODUCT_IDENTITY.heroSupportingDescription}
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <a
                  href={OFFICIAL_PRODUCT_IDENTITY.officialReleaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 text-sm font-semibold text-white rounded-xl transition-all flex items-center gap-2 shadow-lg hover:opacity-95 whitespace-nowrap shrink-0"
                  style={{
                    background:
                      'linear-gradient(135deg, #E84A7F 0%, #8B5CF6 100%)',
                  }}
                >
                  <Download className="w-4 h-4" />
                  <span>Download URWidgets</span>
                </a>

                <button
                  type="button"
                  onClick={() => scrollToSection('features')}
                  className="px-5 py-3 text-sm font-semibold text-slate-200 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Explore Features
                </button>
              </div>

              {/* Unboxed Product Metadata (Zero-Pill Rule) */}
              <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-mono text-slate-400">
                {OFFICIAL_PRODUCT_IDENTITY.heroMetadataItems.map((meta, idx) => (
                  <React.Fragment key={meta}>
                    <span>{meta}</span>
                    {idx <
                      OFFICIAL_PRODUCT_IDENTITY.heroMetadataItems.length -
                        1 && <span aria-hidden="true">·</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Right Column: Hero Product Visual Showcase */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-white/[0.12] bg-[#0F131D]/90 backdrop-blur-xl shadow-2xl overflow-hidden">
                {/* Showcase Window Header */}
                <div className="px-4 py-3 border-b border-white/[0.08] bg-[#0B0E16] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5" aria-hidden="true">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                    </div>
                    <span className="text-xs font-mono text-slate-300">
                      KDE Plasma 5 Desktop — URWidgets WidgetWall
                    </span>
                  </div>

                  {/* Interactive Preview Mode Switcher */}
                  <div className="flex items-center gap-1 p-1 bg-white/[0.04] border border-white/[0.08] rounded-lg">
                    <button
                      type="button"
                      onClick={() => setHeroPreviewStyle('screenshot')}
                      className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                        heroPreviewStyle === 'screenshot'
                          ? 'bg-[#E84A7F] text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Desktop Capture
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeroPreviewStyle('tinted-sandstone')}
                      className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                        heroPreviewStyle === 'tinted-sandstone'
                          ? 'bg-[#E84A7F] text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Warm Tinted
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeroPreviewStyle('midnight-glass')}
                      className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                        heroPreviewStyle === 'midnight-glass'
                          ? 'bg-[#8B5CF6] text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Midnight Glass
                    </button>
                  </div>
                </div>

                {/* Hero Desktop Visual Content */}
                {heroPreviewStyle === 'screenshot' ? (
                  <div className="p-3 bg-[#141824] space-y-2.5">
                    <div className="relative rounded-xl overflow-hidden border border-black/25 shadow-2xl">
                      <Image
                        src={resolveLandingAsset(
                          '/docs/images/urwidgets-desktop.png'
                        )}
                        alt="URWidgets KDE Plasma 5 Desktop Preview"
                        width={1920}
                        height={1080}
                        referrerPolicy="no-referrer"
                        className="w-full h-auto object-cover rounded-xl"
                        priority
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    className={`p-4 sm:p-5 transition-colors duration-300 ${
                      heroPreviewStyle === 'tinted-sandstone'
                        ? 'bg-[#E3DFD6] text-[#1D1D1F]'
                        : 'bg-[#121521] text-[#F5F5F7]'
                    }`}
                  >
                    {/* Simulated KDE Plasma 5 Top Panel */}
                    <div
                      className={`px-3.5 py-1.5 rounded-lg mb-3.5 flex items-center justify-between text-[11px] font-medium border ${
                        heroPreviewStyle === 'tinted-sandstone'
                          ? 'bg-[#EFECE6]/90 border-black/[0.08] text-[#1D1D1F]'
                          : 'bg-white/[0.05] border-white/[0.08] text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold">URWidgets</span>
                        <span className="opacity-70 hidden sm:inline">
                          File · Edit · View · Widgets · Appearance
                        </span>
                      </div>
                      <div className="font-mono text-[10px] opacity-75 tabular-nums">
                        {heroPreviewStyle === 'tinted-sandstone'
                          ? 'Monochrome Studio · tinted · #E84A7F'
                          : 'Liquid Glass · dark · #8B5CF6'}{' '}
                        · Thu, Nov 12 1:57 AM
                      </div>
                    </div>

                    {/* Harmonious Multi-Widget Linux Desktop Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      {/* Widget 1: Clock & Alarms (5 cols) */}
                      <div
                        className={`sm:col-span-5 rounded-2xl p-3.5 border shadow-sm flex flex-col justify-between ${
                          heroPreviewStyle === 'tinted-sandstone'
                            ? 'bg-[#F8EFF2]/95 border-[#E84A7F]/20'
                            : 'bg-white/[0.06] border-white/10 backdrop-blur-md'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 text-[10px] font-mono tabular-nums">
                          <span
                            className={`px-2 py-0.5 rounded-md font-semibold ${
                              heroPreviewStyle === 'tinted-sandstone'
                                ? 'bg-[#E84A7F]/15 text-[#D6336C]'
                                : 'bg-[#E84A7F]/25 text-pink-200'
                            }`}
                          >
                            07:00 · 2 Alarms
                          </span>
                          <span className="opacity-70">12h · ~/Music/</span>
                        </div>
                        <div className="my-2">
                          <div className="text-3xl sm:text-4xl font-bold tracking-tight tabular-nums flex items-baseline gap-1.5">
                            <span>1:57</span>
                            <span className="text-sm font-bold text-[#E84A7F]">
                              AM
                            </span>
                          </div>
                          <div className="text-[11px] opacity-75 mt-0.5">
                            Thu, Nov 12 · Vernon
                          </div>
                        </div>
                        <div className="text-[10px] font-mono opacity-65 flex items-center justify-between">
                          <span>Ringtone: ~/Music/</span>
                          <span>Slide 1 / 2 ›</span>
                        </div>
                      </div>

                      {/* Widget 2: Calendar (4 cols) */}
                      <div
                        className={`sm:col-span-4 rounded-2xl p-3.5 border shadow-sm ${
                          heroPreviewStyle === 'tinted-sandstone'
                            ? 'bg-[#F8EFF2]/95 border-[#E84A7F]/20'
                            : 'bg-white/[0.06] border-white/10 backdrop-blur-md'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold">
                            November 2026
                          </span>
                          <span className="text-[10px] font-mono opacity-70">
                            EN · Mon
                          </span>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono tabular-nums">
                          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                            <span key={i} className="opacity-50 font-semibold">
                              {d}
                            </span>
                          ))}
                          {[
                            2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
                            17, 18, 19, 20, 21, 22,
                          ].map((day) => (
                            <span
                              key={day}
                              className={`py-0.5 rounded-full ${
                                day === 12
                                  ? 'bg-[#E84A7F] text-white font-bold'
                                  : 'opacity-80'
                              }`}
                            >
                              {day}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Widget 3: System Monitor (3 cols) */}
                      <div
                        className={`sm:col-span-3 rounded-2xl p-3.5 border shadow-sm flex flex-col justify-between ${
                          heroPreviewStyle === 'tinted-sandstone'
                            ? 'bg-[#F8EFF2]/95 border-[#E84A7F]/20'
                            : 'bg-white/[0.06] border-white/10 backdrop-blur-md'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold">System</span>
                          <span className="text-[10px] font-mono text-[#E84A7F] font-semibold">
                            3s poll
                          </span>
                        </div>
                        <div className="space-y-2 my-1.5 text-[10px] font-mono tabular-nums">
                          <div>
                            <div className="flex justify-between mb-0.5">
                              <span className="opacity-70">Processor</span>
                              <span className="font-bold">10%</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                              <div className="h-full w-[10%] bg-[#E84A7F] rounded-full" />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-0.5">
                              <span className="opacity-70">Memory</span>
                              <span className="font-bold">3.3 GB (21%)</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                              <div className="h-full w-[21%] bg-[#8B5CF6] rounded-full" />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-0.5">
                              <span className="opacity-70">Battery</span>
                              <span className="font-bold">88%</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                              <div className="h-full w-[88%] bg-emerald-500 rounded-full" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Row: Photo Frame (3 cols) + Weather (3 cols) + Music Player (3 cols) + To-Do List (3 cols) */}
                      <div className="sm:col-span-3 rounded-2xl overflow-hidden border border-black/10 shadow-sm relative min-h-[118px]">
                        <Image
                          src={resolveLandingAsset(
                            '/images/photo_widget_architecture.jpg'
                          )}
                          alt="URWidgets Photo Frame Widget"
                          width={400}
                          height={280}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Weather Widget */}
                      <div
                        className={`sm:col-span-3 rounded-2xl p-3.5 border shadow-sm flex flex-col justify-between ${
                          heroPreviewStyle === 'tinted-sandstone'
                            ? 'bg-[#F8EFF2]/95 border-[#E84A7F]/20'
                            : 'bg-white/[0.06] border-white/10 backdrop-blur-md'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span>Vernon</span>
                          <span className="text-[10px] font-mono text-[#E84A7F]">
                            °C
                          </span>
                        </div>
                        <div className="text-2xl font-bold tabular-nums my-1">
                          29°
                        </div>
                        <div className="text-[10px] opacity-75">
                          Mostly Clear · H:29° L:16°
                        </div>
                      </div>

                      {/* Music Player Widget */}
                      <div
                        className={`sm:col-span-3 rounded-2xl p-3.5 border shadow-sm flex flex-col justify-between ${
                          heroPreviewStyle === 'tinted-sandstone'
                            ? 'bg-[#F8EFF2]/95 border-[#E84A7F]/20'
                            : 'bg-white/[0.06] border-white/10 backdrop-blur-md'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Image
                            src={resolveLandingAsset(
                              '/images/photo_widget_botanical.jpg'
                            )}
                            alt="Album cover"
                            width={64}
                            height={64}
                            referrerPolicy="no-referrer"
                            className="w-8 h-8 rounded-lg object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="text-[11px] font-bold truncate">
                              Velvet Horizon
                            </div>
                            <div className="text-[10px] opacity-70 truncate">
                              ~/Music/Ambient
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <button
                            type="button"
                            onClick={() => setHeroMusicPlaying((p) => !p)}
                            aria-label={
                              heroMusicPlaying
                                ? 'Pause demo track'
                                : 'Play demo track'
                            }
                            className="px-2.5 py-1 rounded-md bg-[#E84A7F] text-white text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            {heroMusicPlaying ? (
                              <>
                                <Pause className="w-3 h-3" /> Pause
                              </>
                            ) : (
                              <>
                                <Play className="w-3 h-3" /> Play
                              </>
                            )}
                          </button>
                          <span className="text-[10px] font-mono opacity-70 tabular-nums">
                            {heroMusicPlaying ? '01:14 / 03:34' : 'FLAC · Ready'}
                          </span>
                        </div>
                      </div>

                      {/* To-Do List Widget */}
                      <div
                        className={`sm:col-span-3 rounded-2xl p-3.5 border shadow-sm flex flex-col justify-between ${
                          heroPreviewStyle === 'tinted-sandstone'
                            ? 'bg-[#F8EFF2]/95 border-[#E84A7F]/20'
                            : 'bg-white/[0.06] border-white/10 backdrop-blur-md'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold">To-Do List</span>
                          <span className="text-[10px] font-mono text-[#E84A7F] font-semibold">
                            5/5 Done
                          </span>
                        </div>
                        <div className="space-y-1 my-1 text-[10px]">
                          <div className="truncate opacity-85 flex items-center gap-1">
                            <span className="text-[#E84A7F] font-bold">✓</span>
                            <span className="truncate">Math 12 - Unit 4 guide</span>
                          </div>
                          <div className="truncate opacity-85 flex items-center gap-1">
                            <span className="text-[#E84A7F] font-bold">✓</span>
                            <span className="truncate">Plasma 5 QML Audit</span>
                          </div>
                        </div>
                        <div className="h-1.5 rounded-full bg-[#E84A7F]" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Showcase Bottom Bar */}
                <div className="px-4 py-2.5 bg-[#0B0E16] border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                  <span>
                    10 Modular KDE Plasma 5 Widgets · Shared Rust D-Bus & SQLite
                    Daemon
                  </span>
                  <button
                    type="button"
                    onClick={() => scrollToSection('personalization')}
                    className="text-[#F472B6] hover:text-white font-semibold transition-colors cursor-pointer"
                  >
                    Try Interactive Product Showcase ↓
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            5. PRODUCT HIGHLIGHTS ("Everything Your Desktop Needs")
        ====================================================================== */}
        <section className="border-y border-white/[0.07] bg-[#0C0F18]/70 py-16 lg:py-20">
          <div className="max-w-[1360px] mx-auto px-5 sm:px-8 space-y-10">
            <div className="max-w-2xl space-y-2">
              <div className="text-xs font-mono text-[#A78BFA]">
                Core Value Proposition
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Everything Your Desktop Needs
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {PRODUCT_HIGHLIGHTS.map((item, idx) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/[0.08] bg-[#111522]/80 p-6 flex flex-col justify-between space-y-4 hover:border-white/15 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="text-xs font-mono text-[#F472B6] tabular-nums">
                      0{idx + 1}.
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-sm font-medium text-slate-200 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pt-3 border-t border-white/[0.06]">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================================
            6. FEATURES SECTION ("Powerful Widgets. One Cohesive Workspace.")
        ====================================================================== */}
        <section
          id="features"
          className="max-w-[1360px] mx-auto px-5 sm:px-8 py-20 lg:py-24 space-y-12"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="text-xs font-mono text-[#F472B6]">
                10 Native Desktop Widgets
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Powerful Widgets. One Cohesive Workspace.
              </h2>
              <p className="text-base text-slate-300 leading-relaxed">
                Bring everyday tools together in a desktop environment designed
                around your workflow.
              </p>
            </div>

            {/* Interactive Category Filter (Segmented Control) */}
            <div
              className="flex flex-wrap items-center gap-1 p-1 bg-[#111522] border border-white/[0.08] rounded-xl self-start"
              role="group"
              aria-label="Filter widgets by category"
            >
              {(
                [
                  'All',
                  'Productivity',
                  'Media & Visual',
                  'System & Utilities',
                ] as const
              ).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFeatureCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    featureCategory === cat
                      ? 'bg-[#E84A7F] text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 10-Widget Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFeatures.map((widget) => (
              <article
                key={widget.id}
                className="rounded-2xl border border-white/[0.08] bg-[#101420]/90 overflow-hidden flex flex-col justify-between hover:border-white/20 transition-colors"
              >
                <div>
                  {/* Supporting Visual Header */}
                  <div className="h-40 bg-[#0B0E17] border-b border-white/[0.06] relative overflow-hidden">
                    <Image
                      src={resolveLandingAsset(widget.previewImage)}
                      alt={`${widget.title} widget preview`}
                      width={640}
                      height={360}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top opacity-90 hover:scale-[1.02] transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101420] via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono text-slate-300">
                      <span>
                        {widget.numberLabel}. {widget.category}
                      </span>
                      <span className="text-slate-400">{widget.qmlFile}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0">
                        {getWidgetIcon(widget.id)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white tracking-tight">
                          {widget.title}
                        </h3>
                        <p className="text-xs text-slate-400 font-mono">
                          {widget.rustModule}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-slate-200 leading-relaxed">
                      {widget.summary}
                    </p>

                    <ul className="space-y-2 text-xs text-slate-400 leading-relaxed pt-2 border-t border-white/[0.06]">
                      {widget.implementedDetails.map((detail, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[#F472B6] font-bold">·</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="px-6 py-3.5 bg-white/[0.02] border-t border-white/[0.06] flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-400">
                    widget.{widget.id}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onChangeShowcaseTab('desktop');
                      scrollToSection('personalization');
                    }}
                    className="font-semibold text-[#F472B6] hover:text-white transition-colors cursor-pointer"
                  >
                    Interact in Showcase →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* =====================================================================
            7. APPEARANCE & PERSONALIZATION SECTION + INTERACTIVE PRODUCT SHOWCASE
        ====================================================================== */}
        <section
          id="personalization"
          className="border-y border-white/[0.07] bg-[#0C0F18]/80 py-20 lg:py-24"
        >
          <div className="max-w-[1360px] mx-auto px-5 sm:px-8 space-y-12">
            {/* Section Header & Capabilities Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-5 space-y-4">
                <div className="text-xs font-mono text-[#A78BFA]">
                  Appearance & Personalization System
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  Make It Feel Like Your Desktop.
                </h2>
                <p className="text-base text-slate-300 leading-relaxed">
                  Configure global or per-widget appearance modes, translucent
                  surface styles, accent colors, custom widget background
                  imagery, and KWin compositor performance profiles.
                </p>

                <div className="rounded-2xl border border-white/[0.1] bg-[#090B11] p-3 overflow-hidden shadow-lg space-y-2.5">
                  <Image
                    src={resolveLandingAsset(
                      '/docs/images/urwidgets-preference.png'
                    )}
                    alt="URWidgets Appearance Studio & Preferences Preview"
                    width={1920}
                    height={1080}
                    referrerPolicy="no-referrer"
                    className="w-full h-auto rounded-xl border border-white/10"
                  />
                  <div className="px-2 pt-1 pb-1 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>
                      Native Preferences & Appearance Studio · KDE Plasma 5
                    </span>
                    <span>9 Accents + #HEX</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PERSONALIZATION_CAPABILITIES.map((cap) => (
                  <div
                    key={cap.id}
                    className="rounded-2xl border border-white/[0.08] bg-[#111522]/90 p-5 flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <h3 className="text-base font-bold text-white">
                        {cap.title}
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {cap.description}
                      </p>
                    </div>
                    <div className="pt-2.5 border-t border-white/[0.06] text-[11px] font-mono text-[#F472B6]">
                      {cap.optionsSummary}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Embedded Live Product Showcase (WidgetWall Desktop, Appearance Studio, Source & Packages, Architecture) */}
            <div className="rounded-3xl border border-white/[0.12] bg-[#11141E] shadow-2xl overflow-hidden">
              {/* Showcase Window Frame Header */}
              <div className="px-5 py-4 bg-[#0B0D14] border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5" aria-hidden="true">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-400/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400/80" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">
                      Interactive URWidgets Product Showcase
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      {showcaseStatusSummary ||
                        'Live KDE Plasma 5 WidgetWall & Appearance Studio Environment'}
                    </div>
                  </div>
                </div>

                {/* 4 Showcase Mode Tabs */}
                <div
                  className="flex flex-wrap items-center gap-1.5 p-1 bg-[#141824] border border-white/[0.08] rounded-xl"
                  role="tablist"
                  aria-label="Interactive Product Showcase Views"
                >
                  {(
                    [
                      { id: 'desktop', label: 'WidgetWall Desktop' },
                      { id: 'control-center', label: 'Appearance Studio' },
                      { id: 'source', label: 'Source & Packages' },
                      { id: 'architecture', label: 'Architecture & Audit' },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={activeShowcaseTab === tab.id}
                      onClick={() => onChangeShowcaseTab(tab.id)}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        activeShowcaseTab === tab.id
                          ? 'bg-[#E84A7F] text-white shadow-sm'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Embedded Interactive Showcase Body */}
              <div className="p-4 sm:p-6 bg-[#F4F1EA] dark:bg-[#111216] text-[#1D1D1F] dark:text-[#F5F5F7]">
                {showcaseContent}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            8. GALLERY SECTION ("See URWidgets in Action.")
        ====================================================================== */}
        <section
          id="gallery"
          className="max-w-[1360px] mx-auto px-5 sm:px-8 py-20 lg:py-24 space-y-10"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="text-xs font-mono text-[#F472B6]">
                Product Screenshots & Visual Showcase
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                See URWidgets in Action.
              </h2>
              <p className="text-base text-slate-300 leading-relaxed">
                Explore real captures of the URWidgets WidgetWall desktop,
                individual productivity and media widgets, and the Appearance
                customization interface. Click any frame to inspect in full
                screen.
              </p>
            </div>

            {/* Gallery Category Filter */}
            <div
              className="flex flex-wrap items-center gap-1 p-1 bg-[#111522] border border-white/[0.08] rounded-xl self-start"
              role="group"
              aria-label="Filter gallery images"
            >
              {(
                [
                  'All',
                  'Desktop',
                  'Productivity',
                  'Media',
                  'Customization',
                ] as const
              ).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setGalleryCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    galleryCategory === cat
                      ? 'bg-[#E84A7F] text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map((item) => (
              <div
                key={item.id}
                className="group rounded-2xl border border-white/[0.08] bg-[#101420] overflow-hidden flex flex-col justify-between hover:border-white/25 transition-all"
              >
                <div>
                  <button
                    type="button"
                    onClick={() => setLightboxItem(item)}
                    aria-label={`Open ${item.title} in lightbox`}
                    className="w-full h-44 bg-[#0A0D14] relative overflow-hidden block text-left cursor-pointer"
                  >
                    <Image
                      src={resolveLandingAsset(item.imagePath)}
                      alt={item.title}
                      width={640}
                      height={420}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 rounded-lg bg-black/80 text-white text-xs font-semibold flex items-center gap-1.5">
                        <Maximize2 className="w-3.5 h-3.5" />
                        Inspect Frame
                      </span>
                    </div>
                  </button>

                  <div className="p-4 space-y-2">
                    <div className="text-[11px] font-mono text-[#A78BFA]">
                      {item.category}
                    </div>
                    <h3 className="text-sm font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {item.caption}
                    </p>
                  </div>
                </div>

                <div className="px-4 py-2.5 border-t border-white/[0.06] text-[11px] font-mono text-slate-500">
                  {item.technicalMeta}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =====================================================================
            9. COMPATIBILITY SECTION ("Built for Linux. Designed for KDE Plasma 5.")
        ====================================================================== */}
        <section
          id="compatibility"
          className="border-t border-white/[0.07] bg-[#0C0F18]/80 py-20 lg:py-24"
        >
          <div className="max-w-[1360px] mx-auto px-5 sm:px-8 space-y-12">
            <div className="max-w-3xl space-y-3">
              <div className="text-xs font-mono text-[#60A5FA]">
                System Requirements & Platform Support
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                {COMPATIBILITY_DATA.title}
              </h2>
              <p className="text-base text-slate-300 leading-relaxed">
                {COMPATIBILITY_DATA.description}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Card 1: Currently Supported Target */}
              <div className="rounded-2xl border border-emerald-500/30 bg-[#101622] p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="text-xs font-mono text-emerald-300 font-semibold">
                    {COMPATIBILITY_DATA.supportedTarget.badgeText}
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {COMPATIBILITY_DATA.supportedTarget.statusLabel}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {COMPATIBILITY_DATA.supportedTarget.primaryDistro}
                  </p>
                  <ul className="space-y-2.5 pt-2 border-t border-white/[0.08] text-xs text-slate-200">
                    {COMPATIBILITY_DATA.supportedTarget.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-3 border-t border-white/[0.06] text-[11px] font-mono text-emerald-300/90">
                  Target: KDE Plasma 5 (Linux Mint KDE Plasma 5)
                </div>
              </div>

              {/* Card 2: Potentially Compatible */}
              <div className="rounded-2xl border border-amber-400/25 bg-[#101622] p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="text-xs font-mono text-amber-300 font-semibold">
                    {COMPATIBILITY_DATA.potentiallyCompatible.badgeText}
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {COMPATIBILITY_DATA.potentiallyCompatible.statusLabel}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {COMPATIBILITY_DATA.potentiallyCompatible.description}
                  </p>
                  <ul className="space-y-2 pt-2 border-t border-white/[0.08] text-xs text-slate-300">
                    {COMPATIBILITY_DATA.potentiallyCompatible.items.map(
                      (item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="text-amber-300 font-mono font-bold">
                            ~
                          </span>
                          <span>{item}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div className="pt-3 border-t border-white/[0.06] text-[11px] font-mono text-amber-300/90">
                  Potential targets only — distribution testing required
                </div>
              </div>

              {/* Card 3: Not Supported Yet */}
              <div className="rounded-2xl border border-rose-500/25 bg-[#101622] p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="text-xs font-mono text-rose-300 font-semibold">
                    {COMPATIBILITY_DATA.notSupportedYet.badgeText}
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {COMPATIBILITY_DATA.notSupportedYet.statusLabel}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {COMPATIBILITY_DATA.notSupportedYet.description}
                  </p>
                  <ul className="space-y-2 pt-2 border-t border-white/[0.08] text-xs text-slate-300">
                    {COMPATIBILITY_DATA.notSupportedYet.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-3 border-t border-white/[0.06] text-[11px] font-mono text-rose-300/90">
                  Not implemented or tested in current release
                </div>
              </div>
            </div>

            {/* Minimum Device Requirements Card */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#101420] p-6 sm:p-8 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-[#F472B6]" />
                  <span>{COMPATIBILITY_DATA.minimumRequirements.title}</span>
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  Known Minimum Target Specification
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {COMPATIBILITY_DATA.minimumRequirements.items.map((req) => (
                  <div
                    key={req.label}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-1.5"
                  >
                    <div className="text-xs font-mono text-slate-400">
                      {req.label}
                    </div>
                    <div className="text-sm font-semibold text-white leading-snug">
                      {req.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            10. DOWNLOAD SECTION ("Ready to Customize Your Linux Desktop?")
        ====================================================================== */}
        <section
          id="download"
          className="max-w-[1360px] mx-auto px-5 sm:px-8 pt-20 pb-12 lg:pt-24"
        >
          <div
            className="rounded-3xl border border-white/[0.12] p-8 sm:p-12 lg:p-14 text-center space-y-6 relative overflow-hidden"
            style={{
              background:
                'radial-gradient(circle at 50% 0%, rgba(232,74,127,0.18) 0%, rgba(139,92,246,0.12) 45%, rgba(15,19,29,0.95) 100%)',
            }}
          >
            <div className="text-xs font-mono text-[#F472B6] tracking-wide">
              {OFFICIAL_PRODUCT_IDENTITY.latestPublishedReleaseLabel}
            </div>

            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight max-w-2xl mx-auto"
              style={{ textWrap: 'balance' }}
            >
              Ready to Customize Your Linux Desktop?
            </h2>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Explore URWidgets, download the published release, and make your
              KDE Plasma desktop more personal.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href={OFFICIAL_PRODUCT_IDENTITY.officialReleaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 text-sm sm:text-base font-semibold text-white rounded-xl transition-all flex items-center gap-2.5 shadow-lg hover:opacity-95 whitespace-nowrap shrink-0"
                style={{
                  background:
                    'linear-gradient(135deg, #E84A7F 0%, #8B5CF6 100%)',
                }}
              >
                <Download className="w-4 h-4" />
                <span>Download URWidgets</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>

              <a
                href={OFFICIAL_PRODUCT_IDENTITY.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 text-sm sm:text-base font-semibold text-slate-200 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
              >
                <Code2 className="w-4 h-4" />
                <span>View Source Code</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>

            <div className="pt-4 text-xs font-mono text-slate-400 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <span>{OFFICIAL_PRODUCT_IDENTITY.latestPublishedReleaseLabel}</span>
              <span aria-hidden="true">·</span>
              <span>
                Repository Development Workspace:{' '}
                {OFFICIAL_PRODUCT_IDENTITY.developmentVersion}
              </span>
              <span aria-hidden="true">·</span>
              <span>Target: KDE Plasma 5 (.deb & Source)</span>
            </div>
          </div>
        </section>

        {/* =====================================================================
            11. LINUX TERMINAL INSTALLATION SECTION
        ====================================================================== */}
        <section
          id="install"
          className="max-w-[1360px] mx-auto px-5 sm:px-8 pb-20 lg:pb-24"
        >
          <div className="rounded-3xl border border-white/[0.1] bg-[#0D111A] p-6 sm:p-10 space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="text-xs font-mono text-[#A78BFA] flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#F472B6]" />
                  <span>Debian Package CLI Installation Guide</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Install URWidgets from Terminal
                </h2>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Prefer using the terminal? Download the Debian package from
                  GitHub Releases and install it with the command below.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <a
                  href={OFFICIAL_PRODUCT_IDENTITY.installGuideUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
                >
                  <BookOpen className="w-4 h-4 text-[#A78BFA]" />
                  <span>View Installation Guide</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-75" />
                </a>

                <a
                  href={OFFICIAL_PRODUCT_IDENTITY.allReleasesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
                >
                  <Download className="w-4 h-4 text-[#F472B6]" />
                  <span>View All Releases</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-75" />
                </a>
              </div>
            </div>

            {/* Modern Linux Terminal Code Panel */}
            <div className="rounded-2xl border border-white/[0.12] bg-[#07090E] overflow-hidden shadow-xl">
              <div className="px-4 py-2.5 bg-[#0F131D] border-b border-white/[0.08] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/75" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/75" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/75" />
                  <span className="text-xs font-mono text-slate-400 ml-1">
                    bash — ~/Downloads
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCopyTerminalCommand}
                  className="px-3.5 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] text-xs font-semibold text-white flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  {copyStatus === 'copied' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#F472B6]" />
                      <span>Copy Command</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-5 sm:p-6 overflow-x-auto">
                <pre className="text-xs sm:text-sm font-mono text-slate-100 select-all leading-relaxed">
                  <code>{OFFICIAL_PRODUCT_IDENTITY.terminalInstallCommand}</code>
                </pre>
              </div>

              {copyStatus === 'error' && (
                <div className="px-5 py-2 bg-rose-500/15 border-t border-rose-500/30 text-xs text-rose-200">
                  Clipboard access was blocked by the browser. Please select the
                  command text above and press Ctrl+C.
                </div>
              )}
            </div>

            {/* 5-Step Placeholder Replacement & Installation Instructions */}
            <div className="space-y-3">
              <div className="text-xs font-mono text-slate-400">
                Note: <code className="text-[#F472B6]">NAMA_FILE_URWIDGETS.deb</code>{' '}
                is a filename placeholder. Follow these 5 steps before executing:
              </div>
              <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {TERMINAL_INSTALLATION_STEPS.map((step, index) => (
                  <li
                    key={index}
                    className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 space-y-1.5"
                  >
                    <div className="text-xs font-mono font-bold text-[#F472B6] tabular-nums">
                      Step 0{index + 1}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* =====================================================================
            12. ABOUT THE AUTHOR ("Meet the Developer")
        ====================================================================== */}
        <section
          id="about"
          className="border-t border-white/[0.07] bg-[#0C0F18]/90 py-20 lg:py-24"
        >
          <div className="max-w-[1360px] mx-auto px-5 sm:px-8">
            <div className="rounded-3xl border border-white/[0.1] bg-[#101420] p-8 sm:p-10 lg:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="space-y-3 max-w-2xl">
                <div className="text-xs font-mono text-[#F472B6]">
                  Meet the Developer
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {OFFICIAL_PRODUCT_IDENTITY.author.name}
                </h2>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {OFFICIAL_PRODUCT_IDENTITY.author.bio}
                </p>
              </div>

              {/* Required Author Links: GitHub Repository, rissaxie.com, @hrisgtaa_ */}
              <div className="flex flex-wrap items-center gap-3.5 shrink-0">
                <a
                  href={OFFICIAL_PRODUCT_IDENTITY.author.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.1] text-sm font-semibold text-white flex items-center gap-2.5 transition-colors whitespace-nowrap shrink-0"
                >
                  <Code2 className="w-4 h-4 text-[#A78BFA]" />
                  <span>{OFFICIAL_PRODUCT_IDENTITY.author.githubLabel}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>

                <a
                  href={OFFICIAL_PRODUCT_IDENTITY.author.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.1] text-sm font-semibold text-white flex items-center gap-2.5 transition-colors whitespace-nowrap shrink-0"
                >
                  <Globe className="w-4 h-4 text-[#60A5FA]" />
                  <span>{OFFICIAL_PRODUCT_IDENTITY.author.portfolioLabel}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>

                <a
                  href={OFFICIAL_PRODUCT_IDENTITY.author.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.1] text-sm font-semibold text-white flex items-center gap-2.5 transition-colors whitespace-nowrap shrink-0"
                >
                  <Camera className="w-4 h-4 text-[#F472B6]" />
                  <span>{OFFICIAL_PRODUCT_IDENTITY.author.instagramLabel}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================================
          13. FOOTER
      ====================================================================== */}
      <footer className="border-t border-white/[0.08] bg-[#07090E] py-14 relative z-10">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 justify-between">
            {/* Brand & Tagline */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                  style={{
                    background:
                      'linear-gradient(135deg, #E84A7F 0%, #9B51E0 55%, #3B82F6 100%)',
                  }}
                  aria-hidden="true"
                >
                  UR
                </span>
                <span className="text-lg font-bold text-white tracking-tight">
                  URWidgets
                </span>
              </div>
              <p className="text-sm text-slate-400">
                {OFFICIAL_PRODUCT_IDENTITY.tagline}
              </p>
              <p className="text-xs text-slate-500 font-mono">
                KDE Plasma 5 · Rust · Tauri · QML · Qt
              </p>
            </div>

            {/* Footer Navigation */}
            <div className="md:col-span-4 space-y-2.5">
              <div className="text-xs font-semibold text-white">Navigation</div>
              <ul className="space-y-2 text-xs text-slate-400">
                {[
                  { label: 'Home', id: 'home' },
                  { label: 'Features', id: 'features' },
                  { label: 'Gallery', id: 'gallery' },
                  { label: 'Compatibility', id: 'compatibility' },
                  { label: 'About', id: 'about' },
                  { label: 'Download', id: 'download' },
                ].map((nav) => (
                  <li key={nav.id}>
                    <a
                      href={`#${nav.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(nav.id);
                      }}
                      className="hover:text-white transition-colors"
                    >
                      {nav.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Developer Links */}
            <div className="md:col-span-3 space-y-2.5">
              <div className="text-xs font-semibold text-white">Developer</div>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <a
                    href={OFFICIAL_PRODUCT_IDENTITY.author.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>{OFFICIAL_PRODUCT_IDENTITY.author.githubLabel}</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>
                </li>
                <li>
                  <a
                    href={OFFICIAL_PRODUCT_IDENTITY.author.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Portfolio ({OFFICIAL_PRODUCT_IDENTITY.author.portfolioLabel})</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>
                </li>
                <li>
                  <a
                    href={OFFICIAL_PRODUCT_IDENTITY.author.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Instagram {OFFICIAL_PRODUCT_IDENTITY.author.instagramLabel}</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <span>
              © {currentYear} {OFFICIAL_PRODUCT_IDENTITY.author.name}. All
              rights reserved.
            </span>
            <span className="font-mono">
              {OFFICIAL_PRODUCT_IDENTITY.latestPublishedReleaseLabel} · Linux
              Desktop Customization
            </span>
          </div>
        </div>
      </footer>

      {/* =====================================================================
          GALLERY LIGHTBOX MODAL
      ====================================================================== */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={lightboxItem.title}
          onClick={() => setLightboxItem(null)}
        >
          <div
            className="max-w-5xl w-full rounded-2xl border border-white/15 bg-[#0E121C] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-white">
                  {lightboxItem.title}
                </h3>
                <div className="text-xs font-mono text-slate-400">
                  {lightboxItem.technicalMeta}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={() => {
                    const idx = GALLERY_ITEMS.findIndex(
                      (g) => g.id === lightboxItem.id
                    );
                    const prevIdx =
                      (idx - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length;
                    setLightboxItem(GALLERY_ITEMS[prevIdx]);
                  }}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next image"
                  onClick={() => {
                    const idx = GALLERY_ITEMS.findIndex(
                      (g) => g.id === lightboxItem.id
                    );
                    const nextIdx = (idx + 1) % GALLERY_ITEMS.length;
                    setLightboxItem(GALLERY_ITEMS[nextIdx]);
                  }}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-label="Close lightbox"
                  onClick={() => setLightboxItem(null)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 bg-[#07090E] flex items-center justify-center max-h-[72vh] overflow-auto">
              <Image
                src={resolveLandingAsset(lightboxItem.imagePath)}
                alt={lightboxItem.title}
                width={1360}
                height={760}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[65vh] w-auto h-auto rounded-xl object-contain"
              />
            </div>

            <div className="px-5 py-3.5 border-t border-white/10 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-2">
              <span>{lightboxItem.caption}</span>
              <span className="font-mono text-slate-400">
                Category: {lightboxItem.category}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
