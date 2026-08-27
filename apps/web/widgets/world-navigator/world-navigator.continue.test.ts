import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { getAnimeBySlug } from '@/shared/anime/anime.repository';
import type { MemoryEntry } from '@/shared/anime/anime.memory';
import {
  MEMORY_STORAGE_KEY,
} from '@/shared/anime/anime.memory';

import {
  WORLD_NAVIGATOR_CONTINUE,
  continueControlLabel,
  continueDestinationTitle,
  hydratedAnimeMatchesContinueEntry,
  readNewestMemorySnapshot,
  resetNewestMemorySnapshotCache,
  resolveContinueArrival,
  resolveContinueCandidate,
} from './world-navigator.continue';
import { WORLD_NAVIGATOR_COPY } from './world-navigator.constants';

const dir = dirname(fileURLToPath(import.meta.url));
const navigatorSource = readFileSync(join(dir, 'world-navigator.tsx'), 'utf8');
const continueSource = readFileSync(
  join(dir, 'world-navigator.continue.ts'),
  'utf8',
);
const memoryHorizonView = readFileSync(
  join(dir, '../world-memory-horizon/world-memory-horizon.view.tsx'),
  'utf8',
);
const landmarkCss = readFileSync(
  join(dir, '../world-kind/world-kind.landmarks.css'),
  'utf8',
);
const arrivalScene = readFileSync(
  join(dir, '../arrival-scene/arrival-scene.tsx'),
  'utf8',
);

function memory(
  partial: Partial<MemoryEntry> & Pick<MemoryEntry, 'animeId' | 'slug'>,
): MemoryEntry {
  return {
    lastArrivedAt: partial.lastArrivedAt ?? 1,
    ...partial,
  };
}

describe('TASK-061 continue candidate derivation', () => {
  test('empty Memory yields no candidate', () => {
    assert.equal(resolveContinueCandidate(undefined, null), null);
  });

  test('catalog Memory entry becomes a singular Continue candidate', () => {
    const solo = getAnimeBySlug('solo-leveling');
    assert.ok(solo);
    const entry = memory({
      animeId: solo.id,
      slug: solo.slug,
      title: solo.canonicalTitle,
      lastArrivedAt: 100,
    });
    const candidate = resolveContinueCandidate(entry, null);
    assert.ok(candidate);
    assert.equal(candidate.arrival.kind, 'catalog');
    if (candidate.arrival.kind === 'catalog') {
      assert.equal(candidate.arrival.anime.id, solo.id);
    }
    assert.match(continueControlLabel(entry), /^Continue to Solo Leveling$/);
  });

  test('newest of multiple entries wins — caller passes recentMemories(1)[0]', () => {
    const solo = getAnimeBySlug('solo-leveling');
    const fate = getAnimeBySlug('fate-zero');
    assert.ok(solo && fate);
    const newest = memory({
      animeId: fate.id,
      slug: fate.slug,
      title: fate.canonicalTitle,
      lastArrivedAt: 200,
    });
    const older = memory({
      animeId: solo.id,
      slug: solo.slug,
      title: solo.canonicalTitle,
      lastArrivedAt: 100,
    });
    // V1 API surface: only the newest is considered.
    assert.ok(resolveContinueCandidate(newest, null));
    assert.equal(
      resolveContinueCandidate(newest, null)?.entry.animeId,
      fate.id,
    );
    assert.notEqual(
      resolveContinueCandidate(newest, null)?.entry.animeId,
      older.animeId,
    );
  });

  test('already-arrived destination suppresses Continue', () => {
    const solo = getAnimeBySlug('solo-leveling');
    assert.ok(solo);
    const entry = memory({
      animeId: solo.id,
      slug: solo.slug,
      title: solo.canonicalTitle,
    });
    assert.equal(resolveContinueCandidate(entry, solo.id), null);
  });

  test('optional title falls back without breaking the label', () => {
    const solo = getAnimeBySlug('solo-leveling');
    assert.ok(solo);
    const entry = memory({ animeId: solo.id, slug: solo.slug });
    assert.equal(continueDestinationTitle(entry), solo.canonicalTitle);
    assert.match(continueControlLabel(entry), /Continue to/);
  });

  test('invalid Memory place fails soft as unresolvable / no candidate', () => {
    const entry = memory({
      animeId: 'anime.unknown.1',
      slug: 'not-a-real-slug',
      title: 'Ghost',
    });
    assert.equal(resolveContinueArrival(entry).kind, 'unresolvable');
    assert.equal(resolveContinueCandidate(entry, null), null);
  });

  test('discovered slug shape is accepted without fabricating CanonicalAnime', () => {
    const entry = memory({
      animeId: 'anime.discovered.40748',
      slug: 'discovered-40748',
      title: 'Jujutsu Kaisen',
    });
    const arrival = resolveContinueArrival(entry);
    assert.equal(arrival.kind, 'discovered');
    if (arrival.kind === 'discovered') {
      assert.equal(arrival.malId, 40748);
    }
    assert.ok(resolveContinueCandidate(entry, null));
  });

  test('hydration identity must match Memory entry exactly', () => {
    const entry = memory({
      animeId: 'anime.discovered.40748',
      slug: 'discovered-40748',
    });
    const solo = getAnimeBySlug('solo-leveling');
    assert.ok(solo);
    assert.equal(hydratedAnimeMatchesContinueEntry(entry, solo), false);
  });

  test('newest Memory snapshot is referentially stable across identical reads', () => {
    resetNewestMemorySnapshotCache();
    const store = {
      data: new Map<string, string>(),
      getItem(key: string) {
        return this.data.get(key) ?? null;
      },
      setItem(key: string, value: string) {
        this.data.set(key, value);
      },
      removeItem(key: string) {
        this.data.delete(key);
      },
    };
    store.setItem(
      MEMORY_STORAGE_KEY,
      JSON.stringify([
        {
          animeId: 'anime.solo-leveling',
          slug: 'solo-leveling',
          lastArrivedAt: 100,
          title: 'Solo Leveling',
        },
      ]),
    );
    const first = readNewestMemorySnapshot(store);
    const second = readNewestMemorySnapshot(store);
    assert.ok(first);
    assert.equal(first, second);
    assert.equal(first.animeId, 'anime.solo-leveling');

    store.setItem(
      MEMORY_STORAGE_KEY,
      JSON.stringify([
        {
          animeId: 'anime.fate-zero',
          slug: 'fate-zero',
          lastArrivedAt: 200,
          title: 'Fate/Zero',
        },
      ]),
    );
    const third = readNewestMemorySnapshot(store);
    assert.ok(third);
    assert.notEqual(third, first);
    assert.equal(third.animeId, 'anime.fate-zero');
    resetNewestMemorySnapshotCache();
  });
});

describe('TASK-061 continue presentation contracts', () => {
  test('Continue module exists and avoids watching / episode language', () => {
    assert.equal(existsSync(join(dir, 'world-navigator.continue.ts')), true);
    assert.match(navigatorSource, /world-navigator\.continue/);
    assert.match(navigatorSource, /data-slot="world-navigator-continue"/);
    assert.doesNotMatch(continueSource, /Continue Watching|Resume Episode|Watch Again/i);
    assert.equal(WORLD_NAVIGATOR_CONTINUE.labelPrefix, 'Continue to');
    assert.doesNotMatch(WORLD_NAVIGATOR_COPY.watchlistWhisper, /Continue/);
  });

  test('Continue uses Memory read APIs and no new persistence key', () => {
    assert.match(navigatorSource, /subscribeMemory/);
    assert.match(
      navigatorSource,
      /readNewestMemorySnapshot|recentMemories/,
    );
    assert.match(continueSource, /recentMemories\(1/);
    assert.doesNotMatch(navigatorSource, /aetheranime\.continue/);
    assert.doesNotMatch(continueSource, /localStorage|sessionStorage|indexedDB/i);
    assert.equal(MEMORY_STORAGE_KEY, 'aetheranime.memory.v1');
  });

  test('Continue activation reuses arriveAnime and never auto-arrives on render', () => {
    assert.match(navigatorSource, /arriveAnime/);
    assert.match(
      navigatorSource,
      /data-slot="world-navigator-continue"[\s\S]{0,400}onClick|onClick[\s\S]{0,200}continue/i,
    );
    // No useEffect that calls arrive from Memory.
    assert.doesNotMatch(
      navigatorSource,
      /useEffect\([\s\S]{0,200}recentMemories[\s\S]{0,200}arriveAnime/,
    );
  });

  test('Memory Horizon, Home, crossings, and Watchlist stay separate', () => {
    assert.doesNotMatch(memoryHorizonView, /continue|onClick|tabIndex/i);
    assert.doesNotMatch(arrivalScene, /Continue From This Place|world-navigator-continue/);
    assert.doesNotMatch(landmarkCss, /continue/i);
    assert.doesNotMatch(navigatorSource, /toggleWatchlist/);
  });

  test('no continuous animation and no third crossing', () => {
    assert.doesNotMatch(continueSource, /@keyframes|animation:/);
    assert.doesNotMatch(navigatorSource, /data-region-order|world-continuum|thresholds-ahead/);
  });
});
