import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { ANIME_CATALOG } from '@/shared/anime/anime.catalog';
import { canonicalizeDiscoveryCandidate } from '@/shared/anime/anime.discovery';
import {
  verifiedWatchUrl,
  watchPathsForAnime,
} from '@/shared/anime/anime.watch-path';

import {
  ANIME_DESTINATION_STAGE,
  animePosterPreviewCopy,
} from './anime-destination.constants';

const widgetDir = dirname(fileURLToPath(import.meta.url));
const destinationSource = readFileSync(
  join(widgetDir, 'anime-destination.tsx'),
  'utf8',
);
const constantsSource = readFileSync(
  join(widgetDir, 'anime-destination.constants.ts'),
  'utf8',
);
const typesSource = readFileSync(
  join(widgetDir, '../../shared/anime/anime.types.ts'),
  'utf8',
);

function bySlug(slug: string) {
  const anime = ANIME_CATALOG.find((entry) => entry.slug === slug);
  assert.ok(anime, slug);
  return anime;
}

function figureSource(): string {
  const start = destinationSource.indexOf('function UniverseFigure');
  const end = destinationSource.indexOf(
    'export function AnimeDestination',
    start,
  );
  assert.ok(start > 0 && end > start);
  return destinationSource.slice(start, end);
}

describe('poster is environmental universe art', () => {
  test('figure is decorative artwork, not Watch Now', () => {
    const figure = figureSource();
    assert.match(figure, /data-slot="anime-universe-figure"/);
    assert.match(figure, /aria-hidden="true"/);
    assert.doesNotMatch(figure, /openWatchPath/);
    assert.doesNotMatch(figure, /type="button"/);
    assert.match(
      destinationSource,
      /onClick=\{\(\) => \{\s*if \(watchUrl\) openWatchPath\(watchUrl\);/,
    );
  });

  test('figure state is not domain, URL, or preview-toggle state', () => {
    assert.doesNotMatch(destinationSource, /setPreviewed/);
    assert.doesNotMatch(destinationSource, /searchParams.*preview|dispatchFocus/);
    assert.doesNotMatch(typesSource, /previewed|posterPreview/);
  });

  test('identity fragment helper stays synopsis-free even if unused by the figure', () => {
    assert.match(constantsSource, /export function animePosterPreviewCopy/);
    assert.doesNotMatch(destinationSource, /synopsis\.slice/);
    assert.doesNotMatch(figureSource(), /Watch Now|crunchyroll|myanimelist/i);
  });
});

describe('poster preview copy', () => {
  test('catalog preview uses alternate, year, and genres without synopsis', () => {
    const solo = bySlug('solo-leveling');
    const preview = animePosterPreviewCopy(solo);
    assert.match(preview, /Ore dake Level Up na Ken/);
    assert.match(preview, /2024/);
    assert.match(preview, /ACTION/);
    assert.doesNotMatch(preview, /hunter the world ranked weakest/);
    assert.ok(preview.length <= 120);
  });

  test('discovered preview does not invent artwork or Watch Now', () => {
    const discovered = canonicalizeDiscoveryCandidate({
      malId: 40748,
      title: 'Jujutsu Kaisen',
      alternateTitle: null,
      year: 2020,
      type: 'tv',
      episodeCount: 24,
      status: 'finished',
      genres: ['Action'],
      studios: [],
    });
    assert.equal(discovered.poster, null);
    assert.equal(verifiedWatchUrl(watchPathsForAnime(discovered)), null);
    const preview = animePosterPreviewCopy(discovered);
    assert.match(preview, /2020/);
    assert.match(preview, /ACTION/);
    assert.doesNotMatch(preview, /Watch Now/);
    assert.ok(preview.length <= 120);
    const figure = figureSource();
    assert.match(figure, /DestinationMark/);
  });
});

describe('TASK-096 universe geometry', () => {
  test('stage occupies the canvas and supporting hierarchy stays below the hero', () => {
    assert.doesNotMatch(ANIME_DESTINATION_STAGE, /max-w-5xl/);
    assert.match(ANIME_DESTINATION_STAGE, /w-full/);
    const supporting = destinationSource.indexOf(
      'data-slot="anime-destination-supporting"',
    );
    const studios = destinationSource.indexOf('{studios}');
    const watchNow = destinationSource.indexOf(
      'data-slot="anime-destination-watch-now"',
    );
    assert.ok(studios > supporting);
    assert.ok(studios > watchNow);
  });
});
