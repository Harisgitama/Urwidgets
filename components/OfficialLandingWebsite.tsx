'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  Menu,
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Bell,
  Calendar as CalendarIcon,
  Image as ImageIcon,
  Sliders,
  Music,
  LayoutGrid,
  Sparkles,
  Monitor,
  Terminal,
  ExternalLink,
  Download,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertTriangle,
  XCircle,
  Code2,
  Globe,
  Camera,
  Maximize2,
} from 'lucide-react';
import {
  URWIDGETS_PROJECT_IDENTITY,
  OFFICIAL_NAV_LINKS,
  PRODUCT_HIGHLIGHTS,
  OFFICIAL_FEATURES,
  GALLERY_ITEMS,
  COMPATIBILITY_TIERS,
  MINIMUM_DEVICE_REQUIREMENTS,
  LATEST_CHANGELOG_SUMMARY,
  GalleryCategory,
  GalleryItem,
  filterGalleryItems,
  getNextLightboxIndex,
} from '@/lib/official-website-data';
import { downloadReleaseArtifact } from '@/lib/download-release';

interface OfficialLandingWebsiteProps {
  onOpenInteractiveStudio?: () => void;
}

const DEMO_TRACKS = [
  {
    title: 'Velvet Horizon',
    artist: 'Klangwerk & Sol',
    source: '~/Music/velvet_horizon.flac',
    durationSecs: 214,
    cover: '/images/photo_widget_architecture.jpg',
  },
  {
    title: 'Warm Linen Rain',
    artist: 'Harbor Ensemble',
    source: '~/Music/warm_linen_rain.mp3',
    durationSecs: 188,
    cover: '/images/photo_widget_botanical.jpg',
  },
  {
    title: 'Subtle Drift (SomaFM Stream)',
    artist: 'Aura Nord',
    source: 'https://ice2.somafm.com/groovesalad-128-mp3',
    durationSecs: 246,
    cover: '/images/alpine_mist_wallpaper.jpg',
  },
];

const DEMO_PHOTOS = [
  {
    src: '/images/photo_widget_architecture.jpg',
    label: '~/Pictures/architectural_glass.jpg',
  },
  {
    src: '/images/photo_widget_botanical.jpg',
    label: '~/Pictures/botanical_leaf.jpg',
  },
  {
    src: '/images/alpine_mist_wallpaper.jpg',
    label: '~/Pictures/alpine_mist.jpg',
  },
];

const ACCENT_PRESETS = [
  { id: 'purple', label: 'Lavender', hex: '#A78BFA' },
  { id: 'blue', label: 'Electric Blue', hex: '#60A5FA' },
  { id: 'indigo', label: 'Indigo', hex: '#818CF8' },
  { id: 'pink', label: 'Rose', hex: '#F472B6' },
];

export default function OfficialLandingWebsite({
  onOpenInteractiveStudio,
}: OfficialLandingWebsiteProps) {
  // Mobile navigation state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Interactive Hero Concept Mockup state
  const [heroAccentHex, setHeroAccentHex] = useState('#A78BFA');
  const [heroGlassStyle, setHeroGlassStyle] = useState<
    'liquid-dark' | 'liquid-light' | 'tinted'
  >('liquid-dark');

  // Interactive Music Player demo state
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [progressSecs, setProgressSecs] = useState(68);
  const [volumePct, setVolumePct] = useState(80);
  const [isMuted, setIsMuted] = useState(false);

  // Interactive Alarm demo state
  const [alarms, setAlarms] = useState([
    { id: 'alm-1', time: '07:00', label: 'Morning Focus', enabled: true },
    { id: 'alm-2', time: '13:30', label: 'Afternoon Review', enabled: true },
  ]);
  const [ringtonePath, setRingtonePath] = useState('~/Music/');
  const [alarmRingingBanner, setAlarmRingingBanner] = useState<string | null>(
    null
  );

  // Interactive Calendar demo state
  const [calMonthIndex, setCalMonthIndex] = useState(10); // November
  const [selectedDate, setSelectedDate] = useState(11);

  // Interactive Photo Frame demo state
  const [photoIndex, setPhotoIndex] = useState(0);
  const [slideshowActive, setSlideshowActive] = useState(true);

  // Gallery Filter & Lightbox state
  const [galleryCategory, setGalleryCategory] =
    useState<GalleryCategory>('all');
  const [lightboxItemIndex, setLightboxItemIndex] = useState<number | null>(
    null
  );

  const filteredGallery = filterGalleryItems(GALLERY_ITEMS, galleryCategory);
  const activeTrack = DEMO_TRACKS[trackIndex % DEMO_TRACKS.length];
  const activePhoto = DEMO_PHOTOS[photoIndex % DEMO_PHOTOS.length];

  // Progress timer only when music is actively playing in the demo
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setProgressSecs((prev) => {
        if (prev + 1 >= activeTrack.durationSecs) {
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, activeTrack.durationSecs]);

  // Photo Frame slideshow timer
  useEffect(() => {
    if (!slideshowActive) return;
    const timer = setInterval(() => {
      setPhotoIndex((prev) => (prev + 1) % DEMO_PHOTOS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slideshowActive]);

  const scrollToSection = useCallback((sectionId: string) => {
    setMobileMenuOpen(false);
    if (typeof document === 'undefined') return;
    const el = document.getElementById(sectionId.replace(/^#/, ''));
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Lightbox keyboard navigation
  useEffect(() => {
    if (lightboxItemIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxItemIndex(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxItemIndex((prev) =>
          prev === null
            ? 0
            : getNextLightboxIndex(prev, filteredGallery.length, 'next')
        );
      } else if (e.key === 'ArrowLeft') {
        setLightboxItemIndex((prev) =>
          prev === null
            ? 0
            : getNextLightboxIndex(prev, filteredGallery.length, 'prev')
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxItemIndex, filteredGallery.length]);

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const monthNames = [
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

  const renderHighlightIcon = (
    key: (typeof PRODUCT_HIGHLIGHTS)[number]['iconKey']
  ) => {
    switch (key) {
      case 'widgets':
        return <LayoutGrid className="w-5 h-5 text-violet-400" />;
      case 'palette':
        return <Sparkles className="w-5 h-5 text-sky-400" />;
      case 'music':
        return <Music className="w-5 h-5 text-indigo-400" />;
      case 'plasma':
        return <Monitor className="w-5 h-5 text-purple-400" />;
      case 'linux':
        return <Terminal className="w-5 h-5 text-blue-400" />;
    }
  };

  const renderFeatureIcon = (id: (typeof OFFICIAL_FEATURES)[number]['id']) => {
    switch (id) {
      case 'music-player':
        return <Music className="w-5 h-5 text-violet-300" />;
      case 'alarm':
        return <Bell className="w-5 h-5 text-sky-300" />;
      case 'calendar':
        return <CalendarIcon className="w-5 h-5 text-indigo-300" />;
      case 'photo-frame':
        return <ImageIcon className="w-5 h-5 text-purple-300" />;
      case 'appearance':
        return <Sliders className="w-5 h-5 text-blue-300" />;
    }
  };

  const activeLightboxItem: GalleryItem | null =
    lightboxItemIndex !== null && filteredGallery[lightboxItemIndex]
      ? filteredGallery[lightboxItemIndex]
      : null;

  const isLightMockup = heroGlassStyle === 'liquid-light';

  return (
    <div className="min-h-screen bg-[#0B0D14] text-slate-100 selection:bg-violet-500/30 selection:text-violet-200">
      {/* Sticky Navigation Bar — Strict 3-Zone Contract */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#0B0D14]/85 backdrop-blur-xl">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('home');
            }}
            className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 rounded-md"
          >
            URWidgets
          </a>

          {/* Zone 2: Desktop Navigation Links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300"
          >
            {OFFICIAL_NAV_LINKS.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.id);
                }}
                className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-violet-400/70"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Primary Action + Mobile Menu Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={URWIDGETS_PROJECT_IDENTITY.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all shadow-sm whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </a>

            <button
              type="button"
              aria-label={
                mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
              }
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-white/10 bg-white/[0.04] text-slate-200 hover:bg-white/[0.08] transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <nav
            aria-label="Mobile Navigation"
            className="md:hidden border-t border-white/[0.08] bg-[#0E111B]/95 backdrop-blur-xl px-4 py-4 space-y-2"
          >
            {OFFICIAL_NAV_LINKS.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.id);
                }}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-white/[0.06] hover:text-white transition-colors"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-2 border-t border-white/[0.08]">
              <a
                href={URWIDGETS_PROJECT_IDENTITY.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
            </div>
          </nav>
        )}
      </header>

      <main>
        {/* ================= 4. HERO SECTION ================= */}
        <section
          id="home"
          className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-24 border-b border-white/[0.07]"
        >
          {/* Ambient radial glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[420px] rounded-full bg-gradient-to-tr from-violet-600/20 via-indigo-500/15 to-sky-500/10 blur-3xl"
          />

          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Left Column: Headline, Copy & CTAs */}
              <div className="lg:col-span-5 space-y-6">
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-violet-300/90">
                  <span>Open-Source Linux Project</span>
                  <span aria-hidden="true">·</span>
                  <span>KDE Plasma 5</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">
                    v{URWIDGETS_PROJECT_IDENTITY.version}
                  </span>
                </div>

                <h1
                  className="text-4xl sm:text-5xl lg:text-[52px] font-bold tracking-tight text-white leading-[1.1]"
                  style={{ textWrap: 'balance' }}
                >
                  Your Desktop. Your Widgets. Your Way.
                </h1>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                  URWidgets brings customizable desktop widgets to your Linux
                  experience, combining functionality, personalization, and a
                  clean visual design.
                </p>

                <p className="text-sm text-slate-400 leading-relaxed">
                  Developed specifically for{' '}
                  <strong className="text-slate-200 font-semibold">
                    KDE Plasma 5
                  </strong>
                  , URWidgets pairs native QML desktop applets with a
                  lightweight{' '}
                  <strong className="text-slate-200 font-semibold">
                    Rust &amp; Tauri
                  </strong>{' '}
                  backend so your widgets stay smooth, responsive, and easy on
                  system resources.
                </p>

                {/* Primary & Secondary CTAs */}
                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <a
                    href={URWIDGETS_PROJECT_IDENTITY.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-950/50 whitespace-nowrap"
                  >
                    <Download className="w-4 h-4" />
                    Download URWidgets
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>

                  <button
                    type="button"
                    onClick={() => scrollToSection('features')}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-slate-200 border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:text-white transition-colors whitespace-nowrap"
                  >
                    Explore Features
                  </button>
                </div>

                {/* Secondary quick links: Direct verified packages & Interactive Studio */}
                <div className="pt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
                  <span>Author: Haris Gitama</span>
                  <span aria-hidden="true">·</span>
                  <a
                    href={URWIDGETS_PROJECT_IDENTITY.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-300 hover:text-violet-200 underline underline-offset-4"
                  >
                    rissaxie.com
                  </a>
                  {onOpenInteractiveStudio && (
                    <>
                      <span aria-hidden="true">·</span>
                      <button
                        type="button"
                        onClick={onOpenInteractiveStudio}
                        className="text-sky-300 hover:text-sky-200 underline underline-offset-4 font-medium"
                      >
                        Open Full Interactive Studio &amp; Source Inspector
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Right Column: Interactive KDE Plasma 5 Desktop Concept Mockup */}
              <div className="lg:col-span-7">
                <div className="rounded-2xl border border-white/15 bg-[#101420]/90 shadow-2xl overflow-hidden">
                  {/* Mockup Window Top Bar */}
                  <div className="px-4 py-2.5 border-b border-white/10 bg-[#0C0F18] flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-200">
                        KDE Plasma 5 Desktop — Interactive Concept Preview
                      </span>
                      <span className="text-[11px] text-slate-400 hidden sm:inline">
                        · Try clicking controls below
                      </span>
                    </div>

                    {/* Live Appearance & Accent Switcher inside Mockup */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-white/[0.05] p-0.5 rounded-lg border border-white/10">
                        {(
                          [
                            { id: 'liquid-dark', label: 'Dark Glass' },
                            { id: 'liquid-light', label: 'Light Glass' },
                            { id: 'tinted', label: 'Tinted' },
                          ] as const
                        ).map((mode) => (
                          <button
                            key={mode.id}
                            type="button"
                            onClick={() => setHeroGlassStyle(mode.id)}
                            className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap ${
                              heroGlassStyle === mode.id
                                ? 'bg-violet-600 text-white'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {mode.label}
                          </button>
                        ))}
                      </div>

                      <div
                        className="flex items-center gap-1"
                        role="group"
                        aria-label="Select mockup accent color"
                      >
                        {ACCENT_PRESETS.map((ac) => (
                          <button
                            key={ac.id}
                            type="button"
                            aria-label={`Accent ${ac.label}`}
                            onClick={() => setHeroAccentHex(ac.hex)}
                            className={`w-4 h-4 rounded-full transition-transform ${
                              heroAccentHex === ac.hex
                                ? 'scale-110 ring-2 ring-white'
                                : 'opacity-75 hover:opacity-100'
                            }`}
                            style={{ backgroundColor: ac.hex }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Mockup Desktop Wallpaper Canvas */}
                  <div className="relative p-4 sm:p-5 min-h-[420px] flex flex-col justify-between overflow-hidden">
                    <Image
                      src="/images/alpine_mist_wallpaper.jpg"
                      alt="KDE Plasma 5 Desktop Wallpaper Backdrop"
                      fill
                      priority
                      referrerPolicy="no-referrer"
                      className="object-cover object-center opacity-55"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-[#0B0D14]/85 via-[#0B0D14]/45 to-[#0B0D14]/35"
                    />

                    {/* Alarm Triggered Banner inside Mockup */}
                    {alarmRingingBanner && (
                      <div className="relative z-10 mb-3 px-3.5 py-2 rounded-xl bg-amber-500/20 border border-amber-400/50 backdrop-blur-md flex items-center justify-between gap-2 text-xs text-amber-100">
                        <span>
                          Alarm Ringing: <strong>{alarmRingingBanner}</strong>{' '}
                          (Source: {ringtonePath})
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setAlarmRingingBanner(null)}
                            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium"
                          >
                            Snooze 10m
                          </button>
                          <button
                            type="button"
                            onClick={() => setAlarmRingingBanner(null)}
                            className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-semibold"
                          >
                            Stop
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 2x2 Widget Grid inside Hero Concept Mockup */}
                    <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* Widget 1: Music Player */}
                      <div
                        className={`rounded-2xl p-3.5 border backdrop-blur-xl transition-colors ${
                          isLightMockup
                            ? 'bg-white/80 border-white/60 text-slate-900 shadow-lg'
                            : heroGlassStyle === 'tinted'
                              ? 'bg-violet-950/65 border-violet-400/30 text-white shadow-lg'
                              : 'bg-[#121624]/80 border-white/15 text-white shadow-lg'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/15">
                            <Image
                              src={activeTrack.cover}
                              alt={activeTrack.title}
                              fill
                              referrerPolicy="no-referrer"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-semibold truncate">
                              {activeTrack.title}
                            </div>
                            <div
                              className={`text-[11px] truncate ${
                                isLightMockup
                                  ? 'text-slate-600'
                                  : 'text-slate-300'
                              }`}
                            >
                              {activeTrack.artist}
                            </div>
                            <div
                              className={`text-[10px] font-mono truncate ${
                                isLightMockup
                                  ? 'text-slate-500'
                                  : 'text-slate-400'
                              }`}
                            >
                              {activeTrack.source}
                            </div>
                          </div>
                        </div>

                        {/* Progress & Seek */}
                        <div className="mt-2.5 space-y-1">
                          <input
                            type="range"
                            aria-label="Seek track position"
                            min={0}
                            max={activeTrack.durationSecs}
                            value={progressSecs}
                            onChange={(e) =>
                              setProgressSecs(Number(e.target.value))
                            }
                            className="w-full h-1.5 accent-violet-400 cursor-pointer"
                          />
                          <div
                            className={`flex justify-between text-[10px] font-mono tabular-nums ${
                              isLightMockup
                                ? 'text-slate-600'
                                : 'text-slate-400'
                            }`}
                          >
                            <span>{formatDuration(progressSecs)}</span>
                            <span>
                              {formatDuration(activeTrack.durationSecs)}
                            </span>
                          </div>
                        </div>

                        {/* Playback & Volume Controls */}
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              aria-label="Previous track"
                              onClick={() => {
                                setTrackIndex(
                                  (prev) =>
                                    (prev + DEMO_TRACKS.length - 1) %
                                    DEMO_TRACKS.length
                                );
                                setProgressSecs(0);
                              }}
                              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                            >
                              <SkipBack className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              aria-label={
                                isPlaying ? 'Pause music' : 'Play music'
                              }
                              onClick={() => setIsPlaying((prev) => !prev)}
                              className="p-2 rounded-xl text-slate-950 font-semibold transition-transform active:scale-95"
                              style={{ backgroundColor: heroAccentHex }}
                            >
                              {isPlaying ? (
                                <Pause className="w-3.5 h-3.5" />
                              ) : (
                                <Play className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              type="button"
                              aria-label="Next track"
                              onClick={() => {
                                setTrackIndex(
                                  (prev) => (prev + 1) % DEMO_TRACKS.length
                                );
                                setProgressSecs(0);
                              }}
                              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                            >
                              <SkipForward className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              aria-label={isMuted ? 'Unmute' : 'Mute'}
                              onClick={() => setIsMuted((prev) => !prev)}
                              className="p-1 rounded hover:bg-white/10"
                            >
                              {isMuted || volumePct === 0 ? (
                                <VolumeX className="w-3.5 h-3.5" />
                              ) : (
                                <Volume2 className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <input
                              type="range"
                              aria-label="Music volume"
                              min={0}
                              max={100}
                              value={isMuted ? 0 : volumePct}
                              onChange={(e) => {
                                setIsMuted(false);
                                setVolumePct(Number(e.target.value));
                              }}
                              className="w-14 h-1 accent-violet-400 cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Widget 2: Clock & Alarm Widget */}
                      <div
                        className={`rounded-2xl p-3.5 border backdrop-blur-xl transition-colors flex flex-col justify-between ${
                          isLightMockup
                            ? 'bg-white/80 border-white/60 text-slate-900 shadow-lg'
                            : heroGlassStyle === 'tinted'
                              ? 'bg-violet-950/65 border-violet-400/30 text-white shadow-lg'
                              : 'bg-[#121624]/80 border-white/15 text-white shadow-lg'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-light tracking-tight font-mono tabular-nums">
                              07:00
                            </div>
                            <div
                              className={`text-[11px] ${
                                isLightMockup
                                  ? 'text-slate-600'
                                  : 'text-slate-300'
                              }`}
                            >
                              Alarms · Ringtone: {ringtonePath}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setAlarmRingingBanner('Morning Focus (07:00)')
                            }
                            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-950"
                            style={{ backgroundColor: heroAccentHex }}
                          >
                            Test Ring
                          </button>
                        </div>

                        <div className="mt-2 space-y-1.5">
                          {alarms.map((alm) => (
                            <div
                              key={alm.id}
                              className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs ${
                                isLightMockup
                                  ? 'bg-slate-900/5'
                                  : 'bg-white/[0.06]'
                              }`}
                            >
                              <div className="truncate">
                                <span className="font-mono font-semibold tabular-nums">
                                  {alm.time}
                                </span>{' '}
                                <span className="opacity-80">
                                  · {alm.label}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  setAlarms((prev) =>
                                    prev.map((a) =>
                                      a.id === alm.id
                                        ? { ...a, enabled: !a.enabled }
                                        : a
                                    )
                                  )
                                }
                                className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors ${
                                  alm.enabled
                                    ? 'bg-violet-500 text-white'
                                    : 'bg-white/10 text-slate-400'
                                }`}
                              >
                                {alm.enabled ? 'ON' : 'OFF'}
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="mt-2 flex items-center gap-1.5">
                          <input
                            type="text"
                            aria-label="Unified alarm ringtone path"
                            value={ringtonePath}
                            onChange={(e) => setRingtonePath(e.target.value)}
                            className={`flex-1 min-w-0 px-2 py-1 rounded-lg text-[11px] font-mono border ${
                              isLightMockup
                                ? 'bg-white border-slate-300 text-slate-800'
                                : 'bg-black/30 border-white/10 text-slate-200'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Widget 3: Monthly Calendar Widget */}
                      <div
                        className={`rounded-2xl p-3.5 border backdrop-blur-xl transition-colors ${
                          isLightMockup
                            ? 'bg-white/80 border-white/60 text-slate-900 shadow-lg'
                            : heroGlassStyle === 'tinted'
                              ? 'bg-violet-950/65 border-violet-400/30 text-white shadow-lg'
                              : 'bg-[#121624]/80 border-white/15 text-white shadow-lg'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold">
                            {monthNames[calMonthIndex]} 2026
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              aria-label="Previous month"
                              onClick={() =>
                                setCalMonthIndex((prev) => (prev + 11) % 12)
                              }
                              className="p-1 rounded hover:bg-white/10"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setCalMonthIndex(10);
                                setSelectedDate(11);
                              }}
                              className="px-1.5 py-0.5 rounded text-[10px] font-medium hover:bg-white/10"
                            >
                              Today
                            </button>
                            <button
                              type="button"
                              aria-label="Next month"
                              onClick={() =>
                                setCalMonthIndex((prev) => (prev + 1) % 12)
                              }
                              className="p-1 rounded hover:bg-white/10"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono tabular-nums">
                          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, idx) => (
                            <span key={idx} className="opacity-50 font-semibold">
                              {d}
                            </span>
                          ))}
                          {Array.from({ length: 28 }, (_, i) => i + 1).map(
                            (day) => {
                              const isSelected = day === selectedDate;
                              return (
                                <button
                                  key={day}
                                  type="button"
                                  onClick={() => setSelectedDate(day)}
                                  className={`h-5 rounded-full flex items-center justify-center transition-colors ${
                                    isSelected
                                      ? 'text-slate-950 font-bold'
                                      : 'hover:bg-white/10'
                                  }`}
                                  style={
                                    isSelected
                                      ? { backgroundColor: heroAccentHex }
                                      : undefined
                                  }
                                >
                                  {day}
                                </button>
                              );
                            }
                          )}
                        </div>
                      </div>

                      {/* Widget 4: Clean Photo Frame Widget */}
                      <div className="relative rounded-2xl overflow-hidden border border-white/20 min-h-[150px] shadow-lg group">
                        <Image
                          src={activePhoto.src}
                          alt={activePhoto.label}
                          fill
                          referrerPolicy="no-referrer"
                          className="object-cover transition-opacity duration-500"
                        />
                        <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between text-[11px] text-slate-200">
                          <span className="font-mono truncate">
                            {activePhoto.label}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setSlideshowActive((prev) => !prev)
                            }
                            className="px-2 py-0.5 rounded bg-black/50 hover:bg-black/70 text-[10px] text-white border border-white/15 shrink-0"
                          >
                            {slideshowActive ? 'Slideshow ON' : 'Paused'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Mockup Footer Caption */}
                    <div className="relative z-10 mt-3.5 pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-300">
                      <span>
                        Interactive concept representation of URWidgets on KDE
                        Plasma 5
                      </span>
                      <span className="font-mono text-slate-400">
                        org.urwidgets.ecosystem · Rust + QML
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 5. PRODUCT HIGHLIGHTS ================= */}
        <section
          aria-labelledby="highlights-heading"
          className="py-16 lg:py-20 border-b border-white/[0.07] bg-[#0D101A]"
        >
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 space-y-10">
            <div className="max-w-2xl space-y-2">
              <p className="text-xs font-semibold text-violet-400">
                Core Highlights
              </p>
              <h2
                id="highlights-heading"
                className="text-2xl sm:text-3xl font-bold tracking-tight text-white"
              >
                Crafted for a Cohesive KDE Plasma 5 Workspace
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {PRODUCT_HIGHLIGHTS.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl p-5 border border-white/[0.08] bg-[#121624]/70 hover:border-violet-400/30 transition-colors flex flex-col justify-between gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center">
                    {renderHighlightIcon(item.iconKey)}
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-base font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 6. FEATURES SECTION ================= */}
        <section
          id="features"
          aria-labelledby="features-heading"
          className="py-20 lg:py-24 border-b border-white/[0.07]"
        >
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 space-y-12">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-semibold text-violet-400">
                Widget Capabilities &amp; Personalization
              </p>
              <h2
                id="features-heading"
                className="text-3xl sm:text-4xl font-bold tracking-tight text-white"
              >
                Everything You Need on Your Desktop
              </h2>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                Each URWidgets module is designed for everyday usability on KDE
                Plasma 5, backed by non-blocking Rust CLI/D-Bus execution so
                desktop interactions remain immediate.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {OFFICIAL_FEATURES.map((feat, idx) => {
                const isWide = idx < 2;
                return (
                  <article
                    key={feat.id}
                    className={`${
                      isWide ? 'lg:col-span-6' : 'lg:col-span-4'
                    } rounded-2xl p-6 sm:p-7 border border-white/[0.08] bg-[#111522]/85 hover:border-violet-400/30 transition-colors flex flex-col justify-between gap-6`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-400/20 flex items-center justify-center">
                          {renderFeatureIcon(feat.id)}
                        </div>
                        <span className="text-xs font-mono text-slate-400 tabular-nums">
                          {feat.numberLabel} · URWidgets Module
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <h3 className="text-xl font-bold text-white">
                          {feat.title}
                        </h3>
                        <p className="text-xs font-medium text-violet-300">
                          {feat.subtitle}
                        </p>
                      </div>

                      <p className="text-sm text-slate-300 leading-relaxed">
                        {feat.description}
                      </p>

                      <ul className="space-y-2 pt-1">
                        {feat.capabilities.map((cap, capIdx) => (
                          <li
                            key={capIdx}
                            className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300"
                          >
                            <Check className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                            <span>{cap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {feat.technicalNote && (
                      <div className="pt-4 border-t border-white/[0.08] text-xs text-slate-400 leading-relaxed">
                        {feat.technicalNote}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= 7. GALLERY SECTION ================= */}
        <section
          id="gallery"
          aria-labelledby="gallery-heading"
          className="py-20 lg:py-24 border-b border-white/[0.07] bg-[#0D101A]"
        >
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <p className="text-xs font-semibold text-violet-400">
                  Visual Showcase
                </p>
                <h2
                  id="gallery-heading"
                  className="text-3xl sm:text-4xl font-bold tracking-tight text-white"
                >
                  See URWidgets in Action
                </h2>
                <p className="text-sm text-slate-400">
                  Explore the desktop layout, individual widgets, and appearance
                  configuration. Click any preview card to inspect it in the
                  full-screen lightbox.
                </p>
              </div>

              {/* Interactive Filter Controls */}
              <div
                className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/10 self-start"
                role="group"
                aria-label="Filter gallery items"
              >
                {(
                  [
                    { id: 'all', label: 'All (6)' },
                    { id: 'desktop', label: 'Desktop' },
                    { id: 'widgets', label: 'Widgets' },
                    { id: 'appearance', label: 'Appearance' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setGalleryCategory(tab.id);
                      setLightboxItemIndex(null);
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                      galleryCategory === tab.id
                        ? 'bg-violet-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Gallery Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGallery.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setLightboxItemIndex(idx)}
                  className="group text-left rounded-2xl overflow-hidden border border-white/[0.08] bg-[#121624] hover:border-violet-400/40 transition-all flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                >
                  {/* Visual Preview Area */}
                  <div className="relative h-52 w-full overflow-hidden bg-[#0B0D14]">
                    <Image
                      src={item.imageSrc}
                      alt={item.title}
                      fill
                      referrerPolicy="no-referrer"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-65"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-[#121624] via-black/40 to-transparent"
                    />

                    {/* Contextual Widget Overlay Graphic */}
                    <div className="absolute inset-4 flex flex-col justify-between">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-200">
                        <span>{item.aspectLabel}</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/50 border border-white/15 text-white">
                          <Maximize2 className="w-3 h-3" />
                          Inspect
                        </span>
                      </div>

                      {/* Mini schematic card representing the exact URWidgets screen */}
                      <div className="rounded-xl p-3 bg-[#101422]/85 border border-white/15 backdrop-blur-md">
                        {item.previewType === 'desktop-overview' && (
                          <div className="flex items-center justify-between text-xs text-white">
                            <span>WidgetWall Desktop Containment</span>
                            <span className="font-mono text-violet-300">
                              KDE Plasma 5
                            </span>
                          </div>
                        )}
                        {item.previewType === 'music-player' && (
                          <div className="flex items-center justify-between text-xs text-white">
                            <span>♪ Velvet Horizon — ~/Music/</span>
                            <span className="font-mono text-violet-300">
                              01:08 / 03:34
                            </span>
                          </div>
                        )}
                        {item.previewType === 'alarm' && (
                          <div className="flex items-center justify-between text-xs text-white">
                            <span>🔔 07:00 Morning Focus · Snooze 10m</span>
                            <span className="font-mono text-sky-300">
                              ~/Music/
                            </span>
                          </div>
                        )}
                        {item.previewType === 'calendar' && (
                          <div className="flex items-center justify-between text-xs text-white">
                            <span>November 2026 · Mon–Sun Grid</span>
                            <span className="font-mono text-indigo-300">
                              EN / ID
                            </span>
                          </div>
                        )}
                        {item.previewType === 'photo-frame' && (
                          <div className="flex items-center justify-between text-xs text-white">
                            <span>Pure Rounded Photo Slideshow</span>
                            <span className="font-mono text-purple-300">
                              550ms Crossfade
                            </span>
                          </div>
                        )}
                        {item.previewType === 'appearance-config' && (
                          <div className="flex items-center justify-between text-xs text-white">
                            <span>Liquid Glass · Custom Accent #RRGGBB</span>
                            <span className="font-mono text-sky-300">
                              Rust Sync
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Text Body */}
                  <div className="p-5 space-y-2.5 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {item.caption}
                      </p>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-400">
                      {item.highlights.map((h, i) => (
                        <React.Fragment key={h}>
                          {i > 0 && <span aria-hidden="true">·</span>}
                          <span>{h}</span>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 8. COMPATIBILITY SECTION ================= */}
        <section
          id="compatibility"
          aria-labelledby="compatibility-heading"
          className="py-20 lg:py-24 border-b border-white/[0.07]"
        >
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 space-y-12">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-semibold text-violet-400">
                Platform &amp; Environment Support
              </p>
              <h2
                id="compatibility-heading"
                className="text-3xl sm:text-4xl font-bold tracking-tight text-white"
              >
                Built for Linux. Designed for KDE Plasma 5.
              </h2>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                URWidgets is developed specifically for KDE Plasma 5. Below is
                the verified compatibility status across Linux distributions and
                desktop environments.
              </p>
            </div>

            {/* 3 Compatibility Tiers */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {COMPATIBILITY_TIERS.map((tier) => {
                const isSupported = tier.id === 'supported';
                const isPotential = tier.id === 'potentially-compatible';
                return (
                  <div
                    key={tier.id}
                    className="rounded-2xl p-6 border border-white/[0.08] bg-[#111522]/90 flex flex-col justify-between gap-6"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          {isSupported && (
                            <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                          )}
                          {isPotential && (
                            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                          )}
                          {!isSupported && !isPotential && (
                            <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                          )}
                          <h3 className="text-lg font-bold text-white">
                            {tier.title}
                          </h3>
                        </div>
                        <span className="text-xs font-mono text-slate-400">
                          {tier.badgeText}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {tier.summary}
                      </p>

                      <ul className="space-y-2.5 pt-1">
                        {tier.items.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300"
                          >
                            <span
                              aria-hidden="true"
                              className="text-slate-500 font-mono"
                            >
                              —
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cross-Distro Dependency Note & Minimum Device Requirements */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-7 rounded-2xl p-6 border border-white/[0.08] bg-[#121624]">
                <h3 className="text-base font-bold text-white mb-4">
                  Minimum Device Requirements
                </h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {MINIMUM_DEVICE_REQUIREMENTS.map((req) => (
                    <div
                      key={req.label}
                      className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1"
                    >
                      <dt className="text-xs text-slate-400">{req.label}</dt>
                      <dd className="text-sm font-semibold text-white font-mono tabular-nums">
                        {req.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="lg:col-span-5 rounded-2xl p-6 border border-white/[0.08] bg-[#121624] flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white">
                    Important Distribution &amp; Dependency Note
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Qt versions, KDE Frameworks packages, system package names,
                    and runtime dependencies may differ across Linux
                    distributions.
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    URWidgets does not claim compatibility with KDE Plasma 6,
                    GNOME, Cinnamon, XFCE, or other desktop environments.
                    Support is only listed as available when directly
                    implemented and tested.
                  </p>
                </div>

                <div className="pt-3 border-t border-white/[0.08] text-xs font-mono text-slate-400">
                  Target: KDE Plasma 5 · Qt 5.15 QML · Rust &amp; Tauri
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 9. DOWNLOAD & LATEST CHANGELOG SECTION ================= */}
        <section
          id="download"
          aria-labelledby="download-heading"
          className="py-20 lg:py-24 border-b border-white/[0.07] bg-gradient-to-b from-[#0E1220] to-[#0B0D14]"
        >
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 space-y-12">
            {/* Primary Download CTA Banner */}
            <div className="rounded-3xl p-8 sm:p-12 border border-violet-400/25 bg-gradient-to-br from-[#161B2E] via-[#121626] to-[#0E111D] shadow-2xl text-center max-w-4xl mx-auto space-y-6">
              <p className="text-xs font-semibold text-violet-300">
                Open-Source Release · KDE Plasma 5
              </p>
              <h2
                id="download-heading"
                className="text-3xl sm:text-4xl font-bold tracking-tight text-white"
              >
                Ready to Customize Your Linux Desktop?
              </h2>
              <p className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Explore URWidgets, download the project, and make your KDE
                Plasma desktop more personal.
              </p>

              {/* Official GitHub CTAs */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <a
                  href={URWIDGETS_PROJECT_IDENTITY.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-950/50 whitespace-nowrap"
                >
                  <Download className="w-4 h-4" />
                  Download on GitHub
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>

                <a
                  href={URWIDGETS_PROJECT_IDENTITY.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-200 border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:text-white transition-colors whitespace-nowrap"
                >
                  <Code2 className="w-4 h-4" />
                  View Source Code
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              </div>

              {/* Verified Local Build Artifacts available in this environment */}
              <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-slate-400">
                <span>
                  Verified build artifacts generated in this workspace (v
                  {LATEST_CHANGELOG_SUMMARY.version}):
                </span>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <a
                    href="/api/download/urwidgets-bundle.deb"
                    download="urwidgets-bundle.deb"
                    onClick={(e) => {
                      e.preventDefault();
                      void downloadReleaseArtifact('urwidgets-bundle.deb');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/15 bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 font-mono"
                  >
                    <Download className="w-3.5 h-3.5 text-violet-400" />
                    urwidgets-bundle.deb
                  </a>
                  <a
                    href="/api/download/urwidgets-bundle.zip"
                    download="urwidgets-bundle.zip"
                    onClick={(e) => {
                      e.preventDefault();
                      void downloadReleaseArtifact('urwidgets-bundle.zip');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/15 bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 font-mono"
                  >
                    <Download className="w-3.5 h-3.5 text-sky-400" />
                    urwidgets-bundle.zip
                  </a>
                </div>
              </div>
            </div>

            {/* Latest Release Changelog Card (with rissaxie.com under Author) */}
            <div className="max-w-4xl mx-auto rounded-2xl p-6 sm:p-8 border border-white/[0.08] bg-[#111522]/90 space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/[0.08] pb-4">
                <div className="space-y-1">
                  <div className="text-xs font-mono text-violet-400">
                    CHANGELOG · v{LATEST_CHANGELOG_SUMMARY.version} (
                    {LATEST_CHANGELOG_SUMMARY.date})
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {LATEST_CHANGELOG_SUMMARY.title}
                  </h3>
                </div>
                <div className="text-xs text-slate-300 space-y-0.5 text-left sm:text-right">
                  <div>
                    Author:{' '}
                    <strong className="text-white">
                      {LATEST_CHANGELOG_SUMMARY.author}
                    </strong>
                  </div>
                  <div>
                    Website:{' '}
                    <a
                      href={LATEST_CHANGELOG_SUMMARY.authorWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet-300 hover:text-violet-200 underline underline-offset-4 font-mono"
                    >
                      https://rissaxie.com
                    </a>
                  </div>
                </div>
              </div>

              <ul className="space-y-2.5">
                {LATEST_CHANGELOG_SUMMARY.highlights.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300"
                  >
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ================= 10. ABOUT THE AUTHOR ================= */}
        <section
          id="about"
          aria-labelledby="about-heading"
          className="py-20 lg:py-24 border-b border-white/[0.07]"
        >
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto rounded-2xl p-8 sm:p-10 border border-white/[0.08] bg-[#121624] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
              <div className="space-y-3">
                <p className="text-xs font-semibold text-violet-400">
                  Meet the Developer
                </p>
                <h2
                  id="about-heading"
                  className="text-2xl sm:text-3xl font-bold tracking-tight text-white"
                >
                  {URWIDGETS_PROJECT_IDENTITY.author}
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                  Creator and maintainer of{' '}
                  <strong className="text-white">URWidgets</strong> — building
                  clean, resource-efficient desktop widgets and native Linux
                  experiences for KDE Plasma 5 with Rust, Tauri, and QML.
                </p>
                <div className="pt-1 text-xs font-mono text-slate-400">
                  Portfolio:{' '}
                  <a
                    href={URWIDGETS_PROJECT_IDENTITY.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-300 hover:text-violet-200 underline underline-offset-4"
                  >
                    https://rissaxie.com
                  </a>
                </div>
              </div>

              {/* Three Required Active Social / Profile Links */}
              <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto shrink-0">
                <a
                  href={URWIDGETS_PROJECT_IDENTITY.githubProfileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between sm:justify-start gap-2.5 px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-white transition-colors"
                >
                  <Code2 className="w-4 h-4 text-violet-400" />
                  <span>GitHub · @Harisgitama</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>

                <a
                  href={URWIDGETS_PROJECT_IDENTITY.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between sm:justify-start gap-2.5 px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-white transition-colors"
                >
                  <Globe className="w-4 h-4 text-sky-400" />
                  <span>Portfolio · rissaxie.com</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>

                <a
                  href={URWIDGETS_PROJECT_IDENTITY.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between sm:justify-start gap-2.5 px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-white transition-colors"
                >
                  <Camera className="w-4 h-4 text-pink-400" />
                  <span>Instagram · @hrigtaa_</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ================= 11. FOOTER ================= */}
      <footer className="bg-[#080A10] text-slate-400 py-12">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-white/[0.08]">
            {/* Brand & Description */}
            <div className="md:col-span-5 space-y-3">
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('home');
                }}
                className="text-lg font-bold tracking-tight text-white inline-block"
              >
                URWidgets
              </a>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
                Customizable desktop widgets for Linux and KDE Plasma 5,
                combining functionality, personalization, and a clean Liquid
                Glass visual design.
              </p>
              <div className="text-xs text-slate-400">
                Created by{' '}
                <a
                  href={URWIDGETS_PROJECT_IDENTITY.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-200 hover:text-white underline underline-offset-4"
                >
                  Haris Gitama (rissaxie.com)
                </a>
              </div>
            </div>

            {/* Page Navigation */}
            <div className="md:col-span-4 space-y-2.5">
              <div className="text-xs font-semibold text-white">Navigation</div>
              <ul className="grid grid-cols-2 gap-2 text-xs">
                {OFFICIAL_NAV_LINKS.map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(item.id);
                      }}
                      className="hover:text-white transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="#download"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('download');
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Download
                  </a>
                </li>
              </ul>
            </div>

            {/* External Project & Author Links */}
            <div className="md:col-span-3 space-y-2.5">
              <div className="text-xs font-semibold text-white">
                Project &amp; Author Links
              </div>
              <ul className="space-y-2 text-xs">
                <li>
                  <a
                    href={URWIDGETS_PROJECT_IDENTITY.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>GitHub Repository</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a
                    href={URWIDGETS_PROJECT_IDENTITY.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Author Portfolio (rissaxie.com)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a
                    href={URWIDGETS_PROJECT_IDENTITY.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Instagram (@hrigtaa_)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>
              &copy; {new Date().getFullYear()} URWidgets by Haris Gitama.
              Released under the MIT License.
            </p>
            <p className="font-mono text-[11px]">
              Linux · KDE Plasma 5 · Rust &amp; Tauri
            </p>
          </div>
        </div>
      </footer>

      {/* ================= GALLERY LIGHTBOX MODAL ================= */}
      {activeLightboxItem && lightboxItemIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Gallery preview: ${activeLightboxItem.title}`}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setLightboxItemIndex(null)}
        >
          <div
            className="relative max-w-4xl w-full rounded-2xl border border-white/15 bg-[#101422] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Header */}
            <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  {activeLightboxItem.title}
                </h3>
                <p className="text-xs font-mono text-slate-400">
                  {activeLightboxItem.aspectLabel} ({lightboxItemIndex + 1} of{' '}
                  {filteredGallery.length})
                </p>
              </div>
              <button
                type="button"
                aria-label="Close lightbox"
                onClick={() => setLightboxItemIndex(null)}
                className="p-2 rounded-lg border border-white/10 bg-white/[0.05] text-slate-200 hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Lightbox Image / Preview Body */}
            <div className="relative h-[320px] sm:h-[420px] w-full bg-[#090B10]">
              <Image
                src={activeLightboxItem.imageSrc}
                alt={activeLightboxItem.title}
                fill
                referrerPolicy="no-referrer"
                className="object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101422] via-transparent to-black/30" />

              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#0D101B]/90 border border-white/15 backdrop-blur-md space-y-2">
                <p className="text-sm text-slate-200">
                  {activeLightboxItem.caption}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-violet-300 font-mono">
                  {activeLightboxItem.highlights.map((h, i) => (
                    <React.Fragment key={h}>
                      {i > 0 && <span aria-hidden="true">·</span>}
                      <span>{h}</span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/* Lightbox Footer Controls */}
            <div className="px-5 py-3.5 border-t border-white/10 flex items-center justify-between gap-4 bg-[#0C0F19]">
              <button
                type="button"
                onClick={() =>
                  setLightboxItemIndex(
                    getNextLightboxIndex(
                      lightboxItemIndex,
                      filteredGallery.length,
                      'prev'
                    )
                  )
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <span className="text-xs text-slate-400">
                Use Left/Right arrows or Esc
              </span>

              <button
                type="button"
                onClick={() =>
                  setLightboxItemIndex(
                    getNextLightboxIndex(
                      lightboxItemIndex,
                      filteredGallery.length,
                      'next'
                    )
                  )
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-white transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
