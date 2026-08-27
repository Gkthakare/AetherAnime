import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { resolveAnime } from '@/shared/anime';
import type { AnimeDiscoveryCandidate } from '@/shared/anime/anime.discovery';
import type { WatchlistReturnRow } from '@/shared/anime';

import {
  WORLD_NAVIGATOR_STATUS,
} from './world-navigator.constants';
import {
  WORLD_NAVIGATOR_PATH,
  navigatorPathFromCatalog,
  navigatorPathFromDiscovery,
  navigatorPathFromWatchlist,
  navigatorPathsFromCatalog,
} from './world-navigator.paths';

function discovery(
  partial: Partial<AnimeDiscoveryCandidate> &
    Pick<AnimeDiscoveryCandidate, 'malId' | 'title'>,
): AnimeDiscoveryCandidate & { matchReason?: string | null } {
  return {
    alternateTitle: null,
    year: 2020,
    type: 'tv',
    episodeCount: 24,
    status: 'finished',
    genres: ['Action'],
    studios: [],
    poster: null,
    ...partial,
  };
}

describe('navigator path presentation language', () => {
  test('status copy stays world-native and never says search results', () => {
    assert.equal(
      WORLD_NAVIGATOR_STATUS.ambiguous,
      'Several destinations answer to that name.',
    );
    assert.equal(
      WORLD_NAVIGATOR_STATUS.discovered,
      'The world found a few paths.',
    );
    assert.equal(
      WORLD_NAVIGATOR_STATUS.watchlist,
      'Saved destinations answer.',
    );
    for (const line of [
      WORLD_NAVIGATOR_STATUS.ambiguous,
      WORLD_NAVIGATOR_STATUS.discovered,
      WORLD_NAVIGATOR_STATUS.watchlist,
    ]) {
      assert.doesNotMatch(line, /search|result|filter|sort|browse|provider/i);
    }
  });

  test('path plates stay architectural, not cards', () => {
    assert.match(WORLD_NAVIGATOR_PATH.list, /max-w-md/);
    assert.match(WORLD_NAVIGATOR_PATH.item, /before:/);
    assert.match(WORLD_NAVIGATOR_PATH.item, /focus-visible:ring-2/);
    assert.doesNotMatch(WORLD_NAVIGATOR_PATH.item, /rounded-xl|shadow-lg|animate-/);
    assert.doesNotMatch(WORLD_NAVIGATOR_PATH.item, /grid/);
  });
});

describe('catalog ambiguous paths', () => {
  test('Fate yields multiple titled paths without arriving', () => {
    const result = resolveAnime('Fate');
    assert.equal(result.status, 'ambiguous');
    if (result.status !== 'ambiguous') return;
    const paths = navigatorPathsFromCatalog(result.candidates);
    assert.ok(paths.length >= 2);
    const titles = paths.map((path) => path.title);
    assert.ok(titles.includes('Fate/stay night'));
    assert.ok(titles.includes('Fate/Zero'));
    assert.ok(titles.includes('Fate/Grand Order'));
    for (const path of paths) {
      assert.equal('arrived' in path, false);
      assert.equal('poster' in path, false);
      assert.doesNotMatch(path.title, /anime\./);
      assert.doesNotMatch(path.meta ?? '', /mal/i);
    }
  });

  test('catalog path shows year and type, never an internal id', () => {
    const result = resolveAnime('Fate/Zero');
    assert.equal(result.status, 'resolved');
    if (result.status !== 'resolved') return;
    const path = navigatorPathFromCatalog(result.anime);
    assert.equal(path.title, 'Fate/Zero');
    assert.equal(path.meta, '2011 · TV');
    assert.equal(path.context, null);
    assert.doesNotMatch(path.key, /^mal-/);
  });
});

describe('discovery and semantic paths', () => {
  test('discovered title is visible without fabricated artwork or provider names', () => {
    const path = navigatorPathFromDiscovery(
      discovery({ malId: 40748, title: 'Jujutsu Kaisen', year: 2020 }),
    );
    assert.equal(path.title, 'Jujutsu Kaisen');
    assert.equal(path.meta, '2020 · TV');
    assert.equal('poster' in path, false);
    assert.doesNotMatch(path.title, /40748/);
    assert.doesNotMatch(path.meta ?? '', /mal|myanimelist|provider/i);
    assert.doesNotMatch(path.context ?? '', /mal|confidence|llm/i);
  });

  test('semantic matchReason stays quiet context, not chatbot reasoning', () => {
    const path = navigatorPathFromDiscovery({
      ...discovery({ malId: 1, title: 'Monster', year: 2004 }),
      matchReason: 'dark · psychological',
    });
    assert.equal(path.context, 'dark · psychological');
    assert.doesNotMatch(path.context ?? '', /ai thinks|confidence/i);
  });
});

describe('watchlist paths', () => {
  test('catalog saved rows use the canonical title', () => {
    const result = resolveAnime('Solo Leveling');
    assert.equal(result.status, 'resolved');
    if (result.status !== 'resolved') return;
    const row: WatchlistReturnRow = {
      kind: 'catalog',
      entry: {
        animeId: result.anime.id,
        slug: result.anime.slug,
        savedAt: '2026-08-18T00:00:00.000Z',
        title: result.anime.canonicalTitle,
      },
      anime: result.anime,
    };
    const path = navigatorPathFromWatchlist(row);
    assert.equal(path.title, 'Solo Leveling');
    assert.equal(path.meta, '2024 · TV');
    assert.equal(path.context, null);
  });

  test('discovered saved rows use persisted title and never treat it as identity', () => {
    const titled: WatchlistReturnRow = {
      kind: 'discovered',
      entry: {
        animeId: 'anime.discovered.40748',
        slug: 'discovered-40748',
        savedAt: '2026-08-18T00:00:00.000Z',
        title: 'Jujutsu Kaisen',
      },
      animeId: 'anime.discovered.40748',
      slug: 'discovered-40748',
      malId: 40748,
    };
    const legacy: WatchlistReturnRow = {
      kind: 'discovered',
      entry: {
        animeId: 'anime.discovered.40748',
        slug: 'discovered-40748',
        savedAt: '2026-08-18T00:00:00.000Z',
      },
      animeId: 'anime.discovered.40748',
      slug: 'discovered-40748',
      malId: 40748,
    };
    assert.equal(navigatorPathFromWatchlist(titled).title, 'Jujutsu Kaisen');
    assert.equal(navigatorPathFromWatchlist(legacy).title, 'discovered-40748');
    assert.equal(navigatorPathFromWatchlist(titled).key, titled.animeId);
    assert.equal(navigatorPathFromWatchlist(legacy).key, legacy.animeId);
    assert.equal(
      navigatorPathFromWatchlist(titled).context,
      'Saved destination',
    );
  });
});

describe('empty and exact-match boundaries', () => {
  test('empty catalog candidates stay empty', () => {
    assert.deepEqual(navigatorPathsFromCatalog([]), []);
  });

  test('path mapping does not mark exact catalog titles as a candidate arrival', () => {
    const result = resolveAnime('Solo Leveling');
    assert.equal(result.status, 'resolved');
    if (result.status !== 'resolved') return;
    const path = navigatorPathFromCatalog(result.anime);
    assert.equal('arrived' in path, false);
    assert.equal('autoArrive' in path, false);
  });
});
