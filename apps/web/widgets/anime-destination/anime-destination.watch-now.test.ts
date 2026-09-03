import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { ANIME_CATALOG } from '@/shared/anime/anime.catalog';
import {
  verifiedWatchUrl,
  watchPathsForAnime,
} from '@/shared/anime/anime.watch-path';
import { DISTANCE, DURATION } from '@/shared/lib/motion';

import {
  ANIME_DESTINATION_COPY,
  ANIME_DESTINATION_WATCH_NOW,
  ANIME_DESTINATION_WATCH_NOW_CROSSING,
  ANIME_DESTINATION_WATCH_NOW_EDGE,
  ANIME_DESTINATION_WATCH_NOW_RULE,
  ANIME_DESTINATION_WATCH_NOW_UNAVAILABLE,
} from './anime-destination.constants';
import {
  watchNowCrossingArrow,
  watchNowCrossingRule,
  watchNowCrossingTransition,
} from './anime-destination.motion';
import {
  WATCH_NOW_OPEN_FEATURES,
  WATCH_NOW_OPEN_TARGET,
  openWatchPath,
} from './anime-destination.watch-now';

const widgetDir = dirname(fileURLToPath(import.meta.url));
const destinationSource = readFileSync(
  join(widgetDir, 'anime-destination.tsx'),
  'utf8',
);
const watchNowSource = readFileSync(
  join(widgetDir, 'anime-destination.watch-now.ts'),
  'utf8',
);

function bySlug(slug: string) {
  const anime = ANIME_CATALOG.find((entry) => entry.slug === slug);
  assert.ok(anime, slug);
  return anime;
}

describe('Watch Now authority is unchanged', () => {
  test('verified Solo Leveling remains enabled on the official URL', () => {
    const url = verifiedWatchUrl(watchPathsForAnime(bySlug('solo-leveling')));
    assert.equal(url, 'https://sololeveling-anime.net/');
  });

  test('verified Fate/Zero remains a different official URL', () => {
    const url = verifiedWatchUrl(watchPathsForAnime(bySlug('fate-zero')));
    assert.equal(url, 'https://www.fate-zero.jp/');
  });

  test('Fate/stay night remains unavailable with no fabricated URL', () => {
    const paths = watchPathsForAnime(bySlug('fate-stay-night'));
    const official = paths.find((path) => path.provider === 'official');
    assert.equal(official?.status, 'unavailable');
    assert.equal(verifiedWatchUrl(paths), null);
  });

  test('Crunchyroll remains unknown, not unavailable or verified', () => {
    const crunchyroll = watchPathsForAnime(bySlug('solo-leveling')).find(
      (path) => path.provider === 'crunchyroll',
    );
    assert.equal(crunchyroll?.status, 'unknown');
    assert.equal(crunchyroll?.url, null);
  });
});

describe('openWatchPath', () => {
  test('opens the given URL synchronously with noopener,noreferrer', () => {
    const calls: unknown[][] = [];
    const original = globalThis.window;
    const open = (...args: unknown[]) => {
      calls.push(args);
      return null;
    };
    (globalThis as { window: { open: typeof open } }).window = { open };
    try {
      openWatchPath('https://sololeveling-anime.net/');
    } finally {
      if (original) globalThis.window = original;
    }
    assert.deepEqual(calls, [
      [
        'https://sololeveling-anime.net/',
        WATCH_NOW_OPEN_TARGET,
        WATCH_NOW_OPEN_FEATURES,
      ],
    ]);
    assert.equal(WATCH_NOW_OPEN_TARGET, '_blank');
    assert.equal(WATCH_NOW_OPEN_FEATURES, 'noopener,noreferrer');
  });
});

describe('Watch Now crossing presentation', () => {
  test('crossing motion is one-shot FAST with no delay', () => {
    assert.equal(watchNowCrossingTransition.duration, DURATION.FAST);
    assert.equal(
      (watchNowCrossingTransition as { delay?: number }).delay,
      undefined,
    );
    assert.equal(watchNowCrossingArrow.x, DISTANCE.SM / 3);
    assert.ok(watchNowCrossingRule.scaleX > 1);
  });

  test('enabled threshold keeps focus-visible and plate-edge language', () => {
    assert.match(ANIME_DESTINATION_WATCH_NOW_RULE, /focus-visible:ring-2/);
    assert.match(ANIME_DESTINATION_WATCH_NOW_EDGE, /before:/);
    assert.match(ANIME_DESTINATION_WATCH_NOW, /text-sm/);
    assert.match(ANIME_DESTINATION_WATCH_NOW_CROSSING, /group-active:/);
    assert.match(ANIME_DESTINATION_WATCH_NOW_CROSSING, /motion-reduce:/);
    assert.doesNotMatch(ANIME_DESTINATION_WATCH_NOW_CROSSING, /animate-pulse|spinner/);
  });

  test('unavailable stays disabled language, not a clickable gate', () => {
    assert.match(ANIME_DESTINATION_WATCH_NOW_UNAVAILABLE, /cursor-not-allowed/);
    assert.doesNotMatch(
      ANIME_DESTINATION_WATCH_NOW_UNAVAILABLE,
      /group-active:/,
    );
    assert.equal(
      ANIME_DESTINATION_COPY.watchNowUnavailable,
      'Watch Now unavailable',
    );
  });

  test('Save remains a quieter action than Watch Now', () => {
    assert.equal(ANIME_DESTINATION_COPY.saveWatchlist, 'Save to Watchlist');
    assert.match(ANIME_DESTINATION_WATCH_NOW, /text-sm/);
  });

  test('keyboard activation stays a real button with immediate openWatchPath', () => {
    assert.match(destinationSource, /type="button"/);
    assert.match(destinationSource, /data-slot="anime-destination-watch-now"/);
    assert.match(destinationSource, /openWatchPath\(watchUrl\)/);
    assert.doesNotMatch(destinationSource, /setTimeout|requestAnimationFrame/);
    assert.doesNotMatch(watchNowSource, /setTimeout|await /);
    assert.match(destinationSource, /ANIME_DESTINATION_WATCH_NOW_CROSSING/);
  });

  test('crossing stays local presentation and does not touch frozen architecture', () => {
    assert.doesNotMatch(destinationSource, /useState\(.*crossing/);
    assert.doesNotMatch(
      destinationSource,
      /world-environment|worldArrivalAtmosphere|CanonicalAnime\s*=/,
    );
    assert.doesNotMatch(destinationSource, /resolveAnime|WORLD_NAVIGATOR_PATH/);
    assert.match(destinationSource, /openWatchPath\(watchUrl\)/);
    assert.doesNotMatch(
      destinationSource,
      /openWatchPath[\s\S]{0,80}arriveAnime|arriveAnime[\s\S]{0,80}openWatchPath/,
    );
  });
});
