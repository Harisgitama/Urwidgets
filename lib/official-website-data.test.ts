import test from 'node:test';
import assert from 'node:assert/strict';
import {
  OFFICIAL_PRODUCT_IDENTITY,
  LANDING_NAV_ITEMS,
  PRODUCT_HIGHLIGHTS,
  WIDGET_FEATURES,
  PERSONALIZATION_CAPABILITIES,
  GALLERY_ITEMS,
  COMPATIBILITY_DATA,
  TERMINAL_INSTALLATION_STEPS,
  resolveLandingAsset,
} from './official-website-data';

test('Project identity matches exact tagline, release v3.0.2 URL, INSTALL.md URL, and author links', () => {
  assert.equal(OFFICIAL_PRODUCT_IDENTITY.name, 'URWidgets');
  assert.equal(
    OFFICIAL_PRODUCT_IDENTITY.tagline,
    'Your Desktop. Your Widgets. Your Way.'
  );
  assert.equal(
    OFFICIAL_PRODUCT_IDENTITY.description,
    'URWidgets is a customizable Linux desktop widget ecosystem designed to bring productivity, media controls, personalization, and everyday utilities into one cohesive KDE Plasma experience.'
  );
  assert.equal(
    OFFICIAL_PRODUCT_IDENTITY.repositoryUrl,
    'https://github.com/Harisgitama/Urwidgets'
  );
  assert.equal(
    OFFICIAL_PRODUCT_IDENTITY.officialReleaseUrl,
    'https://github.com/Harisgitama/Urwidgets/releases/tag/3.0.2'
  );
  assert.equal(
    OFFICIAL_PRODUCT_IDENTITY.allReleasesUrl,
    'https://github.com/Harisgitama/Urwidgets/releases'
  );
  assert.equal(
    OFFICIAL_PRODUCT_IDENTITY.installGuideUrl,
    'https://github.com/Harisgitama/Urwidgets/blob/main/INSTALL.md'
  );
  assert.equal(
    OFFICIAL_PRODUCT_IDENTITY.officialWebsiteUrl,
    'https://harisgitama.github.io/Urwidgets/'
  );
  assert.equal(
    OFFICIAL_PRODUCT_IDENTITY.latestPublishedReleaseLabel,
    'Latest Published Release: v3.0.2'
  );
  assert.equal(OFFICIAL_PRODUCT_IDENTITY.author.name, 'Haris Gitama');
  assert.equal(
    OFFICIAL_PRODUCT_IDENTITY.author.portfolioUrl,
    'https://rissaxie.com'
  );
  assert.equal(OFFICIAL_PRODUCT_IDENTITY.author.portfolioLabel, 'rissaxie.com');
  assert.equal(
    OFFICIAL_PRODUCT_IDENTITY.author.instagramUrl,
    'https://www.instagram.com/hrisgtaa_/'
  );
  assert.equal(OFFICIAL_PRODUCT_IDENTITY.author.instagramLabel, '@hrisgtaa_');
});

test('Navigation bar items match Home, Features, Gallery, Compatibility, and About', () => {
  assert.deepEqual(
    LANDING_NAV_ITEMS.map((i) => i.label),
    ['Home', 'Features', 'Gallery', 'Compatibility', 'About']
  );
});

test('Features section defines all 10 implemented URWidgets widget categories and 6 product highlights', () => {
  assert.equal(WIDGET_FEATURES.length, 10);
  const titles = WIDGET_FEATURES.map((w) => w.title);
  assert.deepEqual(titles, [
    'Clock & Alarms',
    'Calendar',
    'Weather',
    'Pomodoro',
    'Notes',
    'Music Player',
    'To-Do List',
    'Photo Frame',
    'Quick Actions',
    'System Monitor',
  ]);
  assert.equal(PRODUCT_HIGHLIGHTS.length, 6);
  assert.deepEqual(
    PRODUCT_HIGHLIGHTS.map((h) => h.title),
    [
      'Desktop Productivity',
      'Media Control',
      'Visual Personalization',
      'Native Linux Integration',
      'Shared Rust Core',
      'Lightweight Architecture',
    ]
  );
  assert.equal(PERSONALIZATION_CAPABILITIES.length, 6);
  assert.equal(GALLERY_ITEMS.length, 11);
});

test('Compatibility section accurately states KDE Plasma 5 support and lists unsupported desktops', () => {
  assert.equal(COMPATIBILITY_DATA.supportedTarget.environment, 'KDE Plasma 5');
  assert.equal(
    COMPATIBILITY_DATA.supportedTarget.primaryDistro,
    'Linux Mint with KDE Plasma 5.'
  );
  assert.ok(
    COMPATIBILITY_DATA.notSupportedYet.items.includes('KDE Plasma 6')
  );
  assert.ok(COMPATIBILITY_DATA.notSupportedYet.items.includes('GNOME'));
  assert.ok(COMPATIBILITY_DATA.notSupportedYet.items.includes('Cinnamon'));
  assert.ok(COMPATIBILITY_DATA.notSupportedYet.items.includes('XFCE'));
  const ramReq = COMPATIBILITY_DATA.minimumRequirements.items.find(
    (i) => i.label === 'Minimum RAM'
  );
  assert.equal(ramReq?.value, '8 GB');
});

test('Terminal installation section provides exact placeholder command and 5 steps', () => {
  assert.equal(
    OFFICIAL_PRODUCT_IDENTITY.terminalInstallCommand,
    'cd ~/Downloads && sudo apt install ./NAMA_FILE_URWIDGETS.deb'
  );
  assert.equal(TERMINAL_INSTALLATION_STEPS.length, 5);
  assert.ok(
    resolveLandingAsset('/images/gallery/widgetwall-desktop-showcase.png').endsWith(
      '/images/gallery/widgetwall-desktop-showcase.png'
    )
  );
});
