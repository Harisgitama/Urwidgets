import test from 'node:test';
import assert from 'node:assert/strict';
import {
  URWIDGETS_PROJECT_IDENTITY,
  OFFICIAL_NAV_LINKS,
  PRODUCT_HIGHLIGHTS,
  OFFICIAL_FEATURES,
  GALLERY_ITEMS,
  COMPATIBILITY_TIERS,
  MINIMUM_DEVICE_REQUIREMENTS,
  LATEST_CHANGELOG_SUMMARY,
  filterGalleryItems,
  getNextLightboxIndex,
} from './official-website-data';

test('project identity contains exact author, repository, and social links', () => {
  assert.equal(URWIDGETS_PROJECT_IDENTITY.name, 'URWidgets');
  assert.equal(
    URWIDGETS_PROJECT_IDENTITY.repoUrl,
    'https://github.com/Harisgitama/Urwidgets'
  );
  assert.equal(URWIDGETS_PROJECT_IDENTITY.author, 'Haris Gitama');
  assert.equal(URWIDGETS_PROJECT_IDENTITY.portfolioUrl, 'https://rissaxie.com');
  assert.equal(
    URWIDGETS_PROJECT_IDENTITY.instagramUrl,
    'https://www.instagram.com/hrigtaa_/'
  );
  assert.equal(URWIDGETS_PROJECT_IDENTITY.platform, 'Linux');
  assert.equal(URWIDGETS_PROJECT_IDENTITY.supportedDesktop, 'KDE Plasma 5');
});

test('navigation bar defines all required sections', () => {
  const labels = OFFICIAL_NAV_LINKS.map((n) => n.label);
  assert.deepEqual(labels, [
    'Home',
    'Features',
    'Gallery',
    'Compatibility',
    'About',
  ]);
});

test('product highlights and features match published scope without Todo List', () => {
  assert.equal(PRODUCT_HIGHLIGHTS.length, 5);
  const featureIds = OFFICIAL_FEATURES.map((f) => f.id);
  assert.deepEqual(featureIds, [
    'music-player',
    'alarm',
    'calendar',
    'photo-frame',
    'appearance',
  ]);
  const hasTodoFeature = OFFICIAL_FEATURES.some((f) =>
    f.title.toLowerCase().includes('todo')
  );
  assert.equal(hasTodoFeature, false);
});

test('gallery filtering and lightbox index wrapping work deterministically', () => {
  assert.equal(GALLERY_ITEMS.length, 6);
  const widgetsOnly = filterGalleryItems(GALLERY_ITEMS, 'widgets');
  assert.equal(widgetsOnly.length, 4);
  const allItems = filterGalleryItems(GALLERY_ITEMS, 'all');
  assert.equal(allItems.length, 6);

  assert.equal(getNextLightboxIndex(0, 6, 'prev'), 5);
  assert.equal(getNextLightboxIndex(5, 6, 'next'), 0);
  assert.equal(getNextLightboxIndex(2, 6, 'next'), 3);
});

test('compatibility section honestly lists KDE Plasma 5 support and unsupported DEs', () => {
  const unsupported = COMPATIBILITY_TIERS.find(
    (t) => t.id === 'not-supported'
  );
  assert.ok(unsupported);
  assert.ok(unsupported.items.includes('KDE Plasma 6'));
  assert.ok(unsupported.items.includes('GNOME'));
  assert.ok(unsupported.items.includes('Cinnamon'));
  assert.ok(unsupported.items.includes('XFCE'));

  const ramReq = MINIMUM_DEVICE_REQUIREMENTS.find(
    (r) => r.label === 'Minimum RAM'
  );
  assert.equal(ramReq?.value, '8 GB');
  assert.equal(LATEST_CHANGELOG_SUMMARY.authorWebsite, 'https://rissaxie.com');
});
