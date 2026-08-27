import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import {
  WATCHLIST_STORAGE_KEY,
  isOnWatchlist,
  readWatchlist,
  toggleWatchlist,
} from './anime.watchlist';

function memoryStore(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem(key: string) {
      return data.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      data.set(key, value);
    },
    removeItem(key: string) {
      data.delete(key);
    },
    data,
  };
}

describe('watchlist storage', () => {
  test('persists only animeId, slug, and savedAt', () => {
    const store = memoryStore();
    const now = '2026-08-16T13:57:00.000Z';
    toggleWatchlist(
      { animeId: 'anime.solo-leveling', slug: 'solo-leveling' },
      store,
      now,
    );
    const raw = JSON.parse(store.getItem(WATCHLIST_STORAGE_KEY) ?? '[]') as unknown;
    assert.deepEqual(raw, [
      {
        animeId: 'anime.solo-leveling',
        slug: 'solo-leveling',
        savedAt: now,
      },
    ]);
  });

  test('toggle removes an existing entry', () => {
    const store = memoryStore();
    toggleWatchlist(
      { animeId: 'anime.solo-leveling', slug: 'solo-leveling' },
      store,
      '2026-08-16T13:57:00.000Z',
    );
    toggleWatchlist(
      { animeId: 'anime.solo-leveling', slug: 'solo-leveling' },
      store,
      '2026-08-16T13:58:00.000Z',
    );
    assert.deepEqual(readWatchlist(store), []);
    assert.equal(isOnWatchlist('anime.solo-leveling', store), false);
  });

  test('returns empty list when storage throws', () => {
    const store = {
      getItem() {
        throw new Error('blocked');
      },
      setItem() {
        throw new Error('blocked');
      },
      removeItem() {
        throw new Error('blocked');
      },
    };
    assert.deepEqual(readWatchlist(store), []);
    assert.equal(
      toggleWatchlist(
        { animeId: 'anime.solo-leveling', slug: 'solo-leveling' },
        store,
      ),
      false,
    );
  });

  test('optional title is stored as presentation and ignored when absent', () => {
    const store = memoryStore();
    toggleWatchlist(
      {
        animeId: 'anime.solo-leveling',
        slug: 'solo-leveling',
        title: 'Solo Leveling',
      },
      store,
      '2026-08-18T06:00:00.000Z',
    );
    const withTitle = readWatchlist(store)[0];
    assert.equal(withTitle?.title, 'Solo Leveling');
    assert.equal(withTitle?.animeId, 'anime.solo-leveling');
    assert.equal(withTitle?.slug, 'solo-leveling');

    const legacy = memoryStore({
      [WATCHLIST_STORAGE_KEY]: JSON.stringify([
        {
          animeId: 'anime.discovered.40748',
          slug: 'discovered-40748',
          savedAt: '2026-08-17T12:00:00.000Z',
        },
      ]),
    });
    const withoutTitle = readWatchlist(legacy)[0];
    assert.equal(withoutTitle?.animeId, 'anime.discovered.40748');
    assert.equal(withoutTitle?.slug, 'discovered-40748');
    assert.equal(withoutTitle?.title, undefined);
  });
});
