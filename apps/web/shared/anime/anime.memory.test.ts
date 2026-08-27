import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { ANIME_CATALOG } from './anime.catalog';
import {
  MEMORY_CHANGE_EVENT,
  MEMORY_LIMIT,
  MEMORY_STORAGE_KEY,
  readMemory,
  recentMemories,
  rememberArrival,
  subscribeMemory,
  type MemoryEntry,
} from './anime.memory';

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

const blockedStore = {
  getItem(): string | null {
    throw new Error('blocked');
  },
  setItem() {
    throw new Error('blocked');
  },
  removeItem() {
    throw new Error('blocked');
  },
};

function raw(store: ReturnType<typeof memoryStore>): unknown {
  return JSON.parse(store.getItem(MEMORY_STORAGE_KEY) ?? '[]');
}

function place(id: string, slug: string, canonicalTitle?: string) {
  return { id, slug, ...(canonicalTitle ? { canonicalTitle } : {}) };
}

/**
 * Minimal window seam. The domain only needs event plumbing, so a bare
 * EventTarget proves same-tab and cross-tab notification without a DOM.
 */
function withWindow(run: (target: EventTarget) => void) {
  const target = new EventTarget();
  const stub = {
    addEventListener: target.addEventListener.bind(target),
    removeEventListener: target.removeEventListener.bind(target),
    dispatchEvent: target.dispatchEvent.bind(target),
  };
  const globals = globalThis as { window?: unknown };
  const had = 'window' in globals;
  const previous = globals.window;
  globals.window = stub;
  try {
    run(target);
  } finally {
    if (had) globals.window = previous;
    else delete globals.window;
  }
}

const SOLO = 1_800_000_000_000;

describe('world memory storage', () => {
  test('empty storage returns empty memory', () => {
    assert.deepEqual(readMemory(memoryStore()), []);
    assert.deepEqual(recentMemories(10, memoryStore()), []);
  });

  test('first committed arrival creates one record', () => {
    const store = memoryStore();
    assert.equal(
      rememberArrival(place('anime.solo-leveling', 'solo-leveling'), store, SOLO),
      true,
    );
    assert.deepEqual(raw(store), [
      {
        animeId: 'anime.solo-leveling',
        slug: 'solo-leveling',
        lastArrivedAt: SOLO,
      },
    ]);
  });

  test('a second distinct arrival creates a second record', () => {
    const store = memoryStore();
    rememberArrival(place('anime.solo-leveling', 'solo-leveling'), store, SOLO);
    rememberArrival(place('anime.fate-zero', 'fate-zero'), store, SOLO + 1000);
    assert.equal(readMemory(store).length, 2);
  });

  test('re-arrival updates recency without adding a record', () => {
    const store = memoryStore();
    rememberArrival(place('anime.solo-leveling', 'solo-leveling'), store, SOLO);
    rememberArrival(place('anime.fate-zero', 'fate-zero'), store, SOLO + 1000);
    rememberArrival(
      place('anime.solo-leveling', 'solo-leveling'),
      store,
      SOLO + 2000,
    );

    const memory = readMemory(store);
    assert.equal(memory.length, 2);
    const solo = memory.find((row) => row.animeId === 'anime.solo-leveling');
    assert.equal(solo?.lastArrivedAt, SOLO + 2000);
    // Memory records places, not visits.
    assert.equal(
      memory.filter((row) => row.animeId === 'anime.solo-leveling').length,
      1,
    );
  });

  test('ordering is newest first', () => {
    const store = memoryStore();
    rememberArrival(place('anime.solo-leveling', 'solo-leveling'), store, SOLO);
    rememberArrival(place('anime.fate-zero', 'fate-zero'), store, SOLO + 1000);
    rememberArrival(place('anime.fate-stay-night', 'fate-stay-night'), store, SOLO + 2000);
    assert.deepEqual(
      readMemory(store).map((row) => row.slug),
      ['fate-stay-night', 'fate-zero', 'solo-leveling'],
    );
  });

  test('equal timestamps order deterministically by animeId', () => {
    const forward = memoryStore();
    rememberArrival(place('anime.b', 'b'), forward, SOLO);
    rememberArrival(place('anime.a', 'a'), forward, SOLO);

    const reverse = memoryStore();
    rememberArrival(place('anime.a', 'a'), reverse, SOLO);
    rememberArrival(place('anime.b', 'b'), reverse, SOLO);

    const order = ['anime.a', 'anime.b'];
    assert.deepEqual(readMemory(forward).map((row) => row.animeId), order);
    assert.deepEqual(readMemory(reverse).map((row) => row.animeId), order);
  });

  test('memory caps at 60 records and discards the oldest', () => {
    const store = memoryStore();
    for (let index = 0; index < MEMORY_LIMIT + 1; index += 1) {
      rememberArrival(
        place(`anime.${index}`, `slug-${index}`),
        store,
        SOLO + index * 1000,
      );
    }
    const memory = readMemory(store);
    assert.equal(MEMORY_LIMIT, 60);
    assert.equal(memory.length, MEMORY_LIMIT);
    assert.equal(memory[0]?.animeId, `anime.${MEMORY_LIMIT}`);
    // The oldest identity fell off, the newest survived.
    assert.equal(
      memory.some((row) => row.animeId === 'anime.0'),
      false,
    );
    assert.equal(
      memory.some((row) => row.animeId === 'anime.1'),
      true,
    );
  });

  test('recentMemories never returns more than the requested limit', () => {
    const store = memoryStore();
    for (let index = 0; index < 10; index += 1) {
      rememberArrival(
        place(`anime.${index}`, `slug-${index}`),
        store,
        SOLO + index * 1000,
      );
    }
    assert.equal(recentMemories(3, store).length, 3);
    assert.equal(recentMemories(99, store).length, 10);
    assert.deepEqual(recentMemories(0, store), []);
    assert.deepEqual(recentMemories(-1, store), []);
    assert.deepEqual(
      recentMemories(2, store).map((row) => row.animeId),
      ['anime.9', 'anime.8'],
    );
  });

  test('malformed JSON is safely ignored and healed by the next write', () => {
    const store = memoryStore({ [MEMORY_STORAGE_KEY]: '{not json' });
    assert.deepEqual(readMemory(store), []);
    assert.equal(
      rememberArrival(place('anime.solo-leveling', 'solo-leveling'), store, SOLO),
      true,
    );
    assert.equal(readMemory(store).length, 1);

    const notArray = memoryStore({ [MEMORY_STORAGE_KEY]: '{"a":1}' });
    assert.deepEqual(readMemory(notArray), []);
  });

  test('malformed records are rejected while valid rows survive', () => {
    const store = memoryStore({
      [MEMORY_STORAGE_KEY]: JSON.stringify([
        null,
        'string-row',
        42,
        { slug: 'missing-id', lastArrivedAt: SOLO },
        { animeId: '', slug: 'empty-id', lastArrivedAt: SOLO },
        { animeId: 'anime.no-slug', lastArrivedAt: SOLO },
        { animeId: 'anime.empty-slug', slug: '', lastArrivedAt: SOLO },
        { animeId: 'anime.no-time', slug: 'no-time' },
        { animeId: 'anime.zero', slug: 'zero', lastArrivedAt: 0 },
        { animeId: 'anime.negative', slug: 'negative', lastArrivedAt: -5 },
        { animeId: 'anime.nan', slug: 'nan', lastArrivedAt: Number.NaN },
        { animeId: 'anime.string-time', slug: 'st', lastArrivedAt: '2026' },
        { animeId: 'anime.valid', slug: 'valid', lastArrivedAt: SOLO },
      ]),
    });
    assert.deepEqual(readMemory(store), [
      { animeId: 'anime.valid', slug: 'valid', lastArrivedAt: SOLO },
    ]);
  });

  test('duplicate stored identities collapse to the newest on read', () => {
    const store = memoryStore({
      [MEMORY_STORAGE_KEY]: JSON.stringify([
        { animeId: 'anime.solo', slug: 'solo-leveling', lastArrivedAt: SOLO },
        {
          animeId: 'anime.solo',
          slug: 'solo-leveling',
          lastArrivedAt: SOLO - 5000,
        },
      ]),
    });
    const memory = readMemory(store);
    assert.equal(memory.length, 1);
    assert.equal(memory[0]?.lastArrivedAt, SOLO);
  });

  test('unavailable storage never throws into the application', () => {
    assert.deepEqual(readMemory(blockedStore), []);
    assert.deepEqual(recentMemories(5, blockedStore), []);
    assert.equal(
      rememberArrival(place('anime.solo-leveling', 'solo-leveling'), blockedStore),
      false,
    );
  });

  test('server render has no window and does not throw', () => {
    assert.equal(typeof (globalThis as { window?: unknown }).window, 'undefined');
    assert.deepEqual(readMemory(), []);
    assert.deepEqual(recentMemories(5), []);
    assert.equal(
      rememberArrival(place('anime.solo-leveling', 'solo-leveling')),
      false,
    );
    assert.equal(typeof subscribeMemory(() => {}), 'function');
    // Unsubscribing on the server is also inert.
    subscribeMemory(() => {})();
  });

  test('an invalid timestamp is refused rather than persisted', () => {
    const store = memoryStore();
    assert.equal(
      rememberArrival(place('anime.solo', 'solo-leveling'), store, Number.NaN),
      false,
    );
    assert.equal(
      rememberArrival(place('anime.solo', 'solo-leveling'), store, 0),
      false,
    );
    assert.equal(
      rememberArrival(place('', 'solo-leveling'), store, SOLO),
      false,
    );
    assert.equal(rememberArrival(place('anime.solo', ''), store, SOLO), false);
    assert.deepEqual(readMemory(store), []);
  });

  test('same-tab subscribers are notified after a write', () => {
    withWindow(() => {
      const store = memoryStore();
      let calls = 0;
      const unsubscribe = subscribeMemory(() => {
        calls += 1;
      });
      rememberArrival(place('anime.solo', 'solo-leveling'), store, SOLO);
      assert.equal(calls, 1);
      unsubscribe();
      rememberArrival(place('anime.fate-zero', 'fate-zero'), store, SOLO + 1);
      assert.equal(calls, 1);
    });
  });

  test('cross-tab storage events notify only for the memory key', () => {
    withWindow((target) => {
      let calls = 0;
      const unsubscribe = subscribeMemory(() => {
        calls += 1;
      });

      target.dispatchEvent(
        Object.assign(new Event('storage'), { key: MEMORY_STORAGE_KEY }),
      );
      assert.equal(calls, 1);

      target.dispatchEvent(
        Object.assign(new Event('storage'), {
          key: 'aetheranime.watchlist.v1',
        }),
      );
      assert.equal(calls, 1, 'watchlist writes are not memory changes');

      // A cleared storage reports a null key.
      target.dispatchEvent(Object.assign(new Event('storage'), { key: null }));
      assert.equal(calls, 2);

      unsubscribe();
      target.dispatchEvent(
        Object.assign(new Event('storage'), { key: MEMORY_STORAGE_KEY }),
      );
      assert.equal(calls, 2);
    });
  });

  test('the change event name is distinct from watchlist', () => {
    assert.equal(MEMORY_CHANGE_EVENT, 'aetheranime:memory');
    assert.equal(MEMORY_STORAGE_KEY, 'aetheranime.memory.v1');
    assert.notEqual(MEMORY_STORAGE_KEY, 'aetheranime.watchlist.v1');
  });

  test('title is optional and a cached title survives a title-less re-arrival', () => {
    const store = memoryStore();
    rememberArrival(place('anime.solo', 'solo-leveling'), store, SOLO);
    assert.equal(readMemory(store)[0]?.title, undefined);
    assert.deepEqual(raw(store), [
      { animeId: 'anime.solo', slug: 'solo-leveling', lastArrivedAt: SOLO },
    ]);

    rememberArrival(
      place('anime.solo', 'solo-leveling', 'Solo Leveling'),
      store,
      SOLO + 1000,
    );
    assert.equal(readMemory(store)[0]?.title, 'Solo Leveling');

    rememberArrival(place('anime.solo', 'solo-leveling'), store, SOLO + 2000);
    assert.equal(
      readMemory(store)[0]?.title,
      'Solo Leveling',
      'a later arrival without a title keeps the cached one',
    );

    const blank = memoryStore();
    rememberArrival(place('anime.blank', 'blank', '   '), blank, SOLO);
    assert.equal(readMemory(blank)[0]?.title, undefined);
  });

  test('CanonicalAnime is never persisted wholesale', () => {
    const anime = ANIME_CATALOG.find((entry) => entry.slug === 'solo-leveling');
    assert.ok(anime, 'solo-leveling is in the catalog');
    const store = memoryStore();
    rememberArrival(anime, store, SOLO);

    const persisted = raw(store) as ReadonlyArray<Record<string, unknown>>;
    assert.deepEqual(Object.keys(persisted[0] ?? {}).sort(), [
      'animeId',
      'lastArrivedAt',
      'slug',
      'title',
    ]);
    assert.equal(persisted[0]?.animeId, anime.id);
    assert.equal(persisted[0]?.slug, 'solo-leveling');
    assert.equal(persisted[0]?.title, anime.canonicalTitle);

    const serialized = store.getItem(MEMORY_STORAGE_KEY) ?? '';
    for (const forbidden of [
      'synopsis',
      'genres',
      'studios',
      'ratings',
      'poster',
      'episodeCount',
      'alternateTitles',
      'officialUrl',
      'canonicalTitle',
      'year',
      'status',
      'type',
    ]) {
      assert.equal(
        serialized.includes(forbidden),
        false,
        `${forbidden} must not reach storage`,
      );
    }
  });

  test('memory entries expose only the V1 contract fields', () => {
    const store = memoryStore();
    rememberArrival(place('anime.solo', 'solo-leveling', 'Solo Leveling'), store, SOLO);
    const entry = readMemory(store)[0] as MemoryEntry;
    assert.deepEqual(Object.keys(entry).sort(), [
      'animeId',
      'lastArrivedAt',
      'slug',
      'title',
    ]);
  });
});
