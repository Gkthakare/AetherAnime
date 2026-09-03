import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { canonicalizeDiscoveryCandidate } from '@/shared/anime/anime.discovery';
import {
  verifiedWatchUrl,
  watchPathsForAnime,
} from '@/shared/anime/anime.watch-path';

import {
  ANIME_DESTINATION_COPY,
  ANIME_DESTINATION_POSTER_WIDTH,
  ANIME_DESTINATION_STAGE,
  ANIME_DESTINATION_TITLE,
  ANIME_DESTINATION_WATCH_NOW,
  formatMalSupportingLine,
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
const metadataHookSource = readFileSync(
  join(widgetDir, 'use-anime-metadata.ts'),
  'utf8',
);

function sliceProviders(): string {
  const start = destinationSource.indexOf('anime-destination-providers');
  assert.ok(start > 0);
  return destinationSource.slice(start, start + 1800);
}

describe('destination information hierarchy', () => {
  test('copy order is identity, action, then deep story and supporting context', () => {
    const title = destinationSource.indexOf('data-slot="anime-destination-title"');
    const metadata = destinationSource.indexOf('metadataLine(anime)');
    const watchNow = destinationSource.indexOf(
      'data-slot="anime-destination-watch-now"',
    );
    const story = destinationSource.indexOf('id="anime-universe-story"');
    const supporting = destinationSource.indexOf(
      'data-slot="anime-destination-supporting"',
    );

    assert.ok(title > 0);
    assert.ok(metadata > title);
    assert.ok(watchNow > metadata);
    assert.ok(story > watchNow);
    assert.ok(supporting > story);
  });

  test('studio is quiet supporting context, not a primary identity line', () => {
    const supporting = destinationSource.indexOf(
      'data-slot="anime-destination-supporting"',
    );
    const studios = destinationSource.indexOf('{studios}');
    const watchNow = destinationSource.indexOf(
      'data-slot="anime-destination-watch-now"',
    );

    assert.ok(supporting > 0);
    assert.ok(studios > supporting);
    assert.ok(studios > watchNow);
    assert.equal(ANIME_DESTINATION_COPY.studioLabel, 'Studio');
  });

  test('MAL provenance is one editorial line, not stacked dashboard rows', () => {
    assert.match(constantsSource, /export function formatMalSupportingLine/);
    assert.match(destinationSource, /formatMalSupportingLine/);
    assert.doesNotMatch(
      destinationSource,
      /data-slot="anime-destination-mal-scored-by"/,
    );
    assert.doesNotMatch(
      destinationSource,
      /data-slot="anime-destination-mal-rank"/,
    );
  });

  test('title stays destination identity and Watch Now stays the threshold', () => {
    assert.match(ANIME_DESTINATION_TITLE, /clamp\(4\.5rem/);
    assert.equal(ANIME_DESTINATION_COPY.watchNow, 'Watch Now');
    assert.equal(
      ANIME_DESTINATION_COPY.watchNowUnavailable,
      'Watch Now unavailable',
    );
    assert.match(ANIME_DESTINATION_WATCH_NOW, /text-sm/);
    assert.doesNotMatch(ANIME_DESTINATION_WATCH_NOW, /rounded|bg-primary|h-11/);
    assert.equal(ANIME_DESTINATION_COPY.saveWatchlist, 'Save to Watchlist');
  });

  test('genres remain descriptive copy, not filter controls', () => {
    const genresRender = destinationSource.indexOf('{genres}');
    const beforeGenres = destinationSource.slice(
      Math.max(0, genresRender - 400),
      genresRender,
    );
    assert.doesNotMatch(beforeGenres, /<button/);
    assert.doesNotMatch(destinationSource, /rounded-full/);
  });
});

describe('provider language remains provenance', () => {
  test('provider region does not create a second Watch Now action', () => {
    const providers = sliceProviders();
    assert.doesNotMatch(providers, /<button/);
    assert.doesNotMatch(destinationSource, /Watch on Crunchyroll/);
    assert.equal(
      ANIME_DESTINATION_COPY.crunchyrollUnavailable,
      'Availability unavailable',
    );
    assert.match(destinationSource, /ANIME_DESTINATION_COPY\.crunchyrollUnavailable/);
  });

  test('discovered destinations do not fabricate availability or artwork', () => {
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
    assert.match(destinationSource, /data-destination-artwork=\{anime\.poster \? 'poster' : 'seal'\}/);
  });

  test('no new provider network or CanonicalAnime field is introduced', () => {
    assert.doesNotMatch(destinationSource, /fetch\(/);
    assert.doesNotMatch(destinationSource, /crunchyroll\.com|myanimelist\.net/);
    assert.match(metadataHookSource, /\/api\/anime-metadata\//);
    assert.doesNotMatch(typesSource, /backdrop|artworkKey|providerDashboard/);
  });
});

describe('TASK-096 universe geometry', () => {
  test('destination stage leaves the TASK-035 column and occupies the canvas', () => {
    assert.doesNotMatch(ANIME_DESTINATION_STAGE, /max-w-5xl/);
    assert.match(ANIME_DESTINATION_STAGE, /w-full/);
    assert.match(destinationSource, /data-slot="anime-universe-hero"/);
    assert.match(ANIME_DESTINATION_POSTER_WIDTH, /18\.75rem/);
  });
});

describe('MAL supporting line', () => {
  test('composes score, rank, and scored-by into one provenance sentence', () => {
    assert.equal(
      formatMalSupportingLine({
        score: 8.14,
        rank: 540,
        scoredBy: 734574,
      }),
      'Score 8.14 · Rank 540 · 734,574 scored',
    );
  });

  test('stays honest when MAL values are absent', () => {
    assert.equal(
      formatMalSupportingLine({
        score: null,
        rank: null,
        scoredBy: null,
      }),
      ANIME_DESTINATION_COPY.malUnavailable,
    );
  });
});
