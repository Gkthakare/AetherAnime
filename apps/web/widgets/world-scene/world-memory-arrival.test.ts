import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { canonicalizeDiscoveryCandidate } from '@/shared/anime/anime.discovery';
import type { AnimeDiscoveryCandidate } from '@/shared/anime/anime.discovery';
import { getAnimeBySlug } from '@/shared/anime/anime.repository';
import {
  readMemory,
  rememberArrival,
  type MemoryStore,
} from '@/shared/anime/anime.memory';
import type { CanonicalAnime } from '@/shared/anime/anime.types';

const dir = dirname(fileURLToPath(import.meta.url));
const sceneSource = readFileSync(join(dir, 'world-scene.tsx'), 'utf8');
const memorySource = readFileSync(
  join(dir, '../../shared/anime/anime.memory.ts'),
  'utf8',
);
const barrelSource = readFileSync(
  join(dir, '../../shared/anime/index.ts'),
  'utf8',
);
const watchlistSource = readFileSync(
  join(dir, '../../shared/anime/anime.watchlist.ts'),
  'utf8',
);

/** Executable source only. Prose may name concepts the code must not import. */
function code(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');
}

/** Source slice owned by a single useCallback / effect. */
function block(source: string, start: string, end: string): string {
  const from = source.indexOf(start);
  assert.notEqual(from, -1, `${start} not found`);
  const to = source.indexOf(end, from);
  assert.notEqual(to, -1, `${end} not found after ${start}`);
  return source.slice(from, to);
}

function memoryStore(): MemoryStore {
  const data = new Map<string, string>();
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, value);
    },
    removeItem: (key) => {
      data.delete(key);
    },
  };
}

function catalogAnime(slug: string): CanonicalAnime {
  const anime = getAnimeBySlug(slug);
  assert.ok(anime, `${slug} is in the catalog`);
  return anime;
}

const JUJUTSU: AnimeDiscoveryCandidate = {
  malId: 40748,
  title: 'Jujutsu Kaisen',
  alternateTitle: null,
  year: 2020,
  type: 'tv',
  episodeCount: 24,
  status: 'finished',
  genres: ['Action'],
  studios: ['MAPPA'],
};

/**
 * Faithful model of the WorldScene arrival convergence and its recorder.
 *
 * `commit` stands for setArrivedAnime, which every arrival path calls.
 * The effect body and dependency semantics mirror world-scene.tsx: React
 * re-runs the recorder only when the arrivedAnime reference changes.
 */
function scene(store: MemoryStore, startAt = 1_800_000_000_000) {
  let committed: CanonicalAnime | null = null;
  let observed: CanonicalAnime | null | undefined;
  let clock = startAt;

  const runEffect = () => {
    if (!committed) return;
    clock += 1000;
    rememberArrival(committed, store, clock);
  };

  const commit = (next: CanonicalAnime | null) => {
    committed = next;
    if (observed === next) return;
    observed = next;
    runEffect();
  };

  return {
    /** PATH 3 — useState initializer resolving initialAnimeSlug. */
    mountWith(slug: string | null) {
      commit(slug ? (getAnimeBySlug(slug) ?? null) : null);
    },
    /** PATH 1 — arriveAnime(), including its existing identity guard. */
    arriveAnime(anime: CanonicalAnime) {
      if (committed?.id === anime.id) return;
      commit(anime);
    },
    /** PATH 2 — handoffAnimeArrival() for a catalog slug. */
    handoffCatalog(slug: string) {
      commit(getAnimeBySlug(slug) ?? null);
    },
    /** PATH 2 — handoffAnimeArrival() resolving a discovered slug. */
    handoffDiscovered(candidate: AnimeDiscoveryCandidate) {
      commit(canonicalizeDiscoveryCandidate(candidate));
    },
    clearAnimeArrival() {
      commit(null);
    },
    /** Strict Mode / remount re-invocation with no dependency change. */
    replayEffect() {
      runEffect();
    },
  };
}

describe('world memory arrival convergence', () => {
  test('PATH 3 — initial catalog ?anime= records memory', () => {
    const store = memoryStore();
    // The initializer seeds arrivedAnime and the hand-off effect intentionally
    // early-returns, so onAnimeArrive never fires for this path.
    scene(store).mountWith('solo-leveling');
    assert.deepEqual(
      readMemory(store).map((row) => row.slug),
      ['solo-leveling'],
    );
    assert.equal(readMemory(store)[0]?.title, 'Solo Leveling');
  });

  test('PATH 2 — URL hand-off and Back/Forward record each arrival once', () => {
    const store = memoryStore();
    const world = scene(store);
    world.mountWith('solo-leveling');
    world.handoffCatalog('fate-zero');
    // Back to the previous destination.
    world.handoffCatalog('solo-leveling');

    const memory = readMemory(store);
    assert.equal(memory.length, 2, 'Back/Forward must not duplicate identities');
    assert.equal(memory[0]?.slug, 'solo-leveling', 'returning refreshes recency');
    assert.equal(memory[1]?.slug, 'fate-zero');
  });

  test('PATH 2 — discovered hand-off records the hydrated destination', () => {
    const store = memoryStore();
    scene(store).handoffDiscovered(JUJUTSU);
    const memory = readMemory(store);
    assert.equal(memory.length, 1);
    assert.equal(memory[0]?.animeId, 'anime.discovered.40748');
    assert.equal(memory[0]?.slug, 'discovered-40748');
    assert.equal(memory[0]?.title, 'Jujutsu Kaisen');
  });

  test('PATH 1 — Navigator arrival records memory', () => {
    const store = memoryStore();
    // Navigator resolves a catalog anime, then calls arriveAnime(plan.anime).
    scene(store).arriveAnime(catalogAnime('fate-stay-night'));
    assert.deepEqual(
      readMemory(store).map((row) => row.slug),
      ['fate-stay-night'],
    );
  });

  test('PATH 1 — Kinship selection records memory, display alone does not', () => {
    const store = memoryStore();
    const world = scene(store);
    world.mountWith('fate-zero');

    // Kinship candidates rendered but not selected.
    canonicalizeDiscoveryCandidate(JUJUTSU);
    assert.deepEqual(
      readMemory(store).map((row) => row.slug),
      ['fate-zero'],
      'a displayed Kinship candidate is not a place the traveller has been',
    );

    // Selecting a candidate calls arriveAnime(canonicalizeDiscoveryCandidate(...)).
    world.arriveAnime(canonicalizeDiscoveryCandidate(JUJUTSU));
    assert.deepEqual(
      readMemory(store).map((row) => row.slug),
      ['discovered-40748', 'fate-zero'],
    );
  });

  test('a single arrival cannot create duplicate records', () => {
    const store = memoryStore();
    const world = scene(store);
    const solo = catalogAnime('solo-leveling');

    world.arriveAnime(solo);
    // The existing arriveAnime identity guard rejects re-arriving in place.
    world.arriveAnime(solo);
    // Strict Mode may invoke the recorder again for the same arrival.
    world.replayEffect();
    world.replayEffect();

    const memory = readMemory(store);
    assert.equal(memory.length, 1);
    assert.equal(memory[0]?.slug, 'solo-leveling');
  });

  test('leaving and returning updates recency instead of appending', () => {
    const store = memoryStore();
    const world = scene(store);
    const solo = catalogAnime('solo-leveling');

    world.arriveAnime(solo);
    const first = readMemory(store)[0]?.lastArrivedAt ?? 0;

    world.clearAnimeArrival();
    world.arriveAnime(catalogAnime('fate-zero'));
    world.clearAnimeArrival();
    world.arriveAnime(solo);

    const memory = readMemory(store);
    assert.equal(memory.length, 2);
    assert.equal(memory[0]?.slug, 'solo-leveling');
    assert.ok(
      (memory[0]?.lastArrivedAt ?? 0) > first,
      'a later arrival refreshes recency',
    );
  });

  test('clearing an arrival never records or erases memory', () => {
    const store = memoryStore();
    const world = scene(store);
    world.mountWith(null);
    assert.deepEqual(readMemory(store), [], 'world idle remembers nothing');

    world.arriveAnime(catalogAnime('solo-leveling'));
    world.clearAnimeArrival();
    world.replayEffect();
    assert.equal(readMemory(store).length, 1, 'leaving does not forget');
  });
});

describe('world memory arrival wiring', () => {
  test('the recorder observes arrivedAnime, not a single arrival path', () => {
    const recorder = block(
      sceneSource,
      '// World Memory observes committed arrival',
      'const ambient =',
    );
    assert.match(recorder, /useEffect\(\(\) => \{/);
    assert.match(recorder, /if \(!arrivedAnime\) return;/);
    assert.match(recorder, /rememberArrival\(arrivedAnime\);/);
    assert.match(recorder, /\}, \[arrivedAnime\]\);/);
    assert.match(
      sceneSource,
      /import \{ rememberArrival \} from '@\/shared\/anime\/anime\.memory';/,
    );
  });

  test('memory is not wired to onAnimeArrive at selection time', () => {
    const transport = block(
      sceneSource,
      'const beginAnimeTransport = useCallback(',
      'const arriveAnime = useCallback(',
    );
    assert.match(transport, /onUrlCommit:/);
    assert.match(transport, /onAnimeArrive\?\.\(anime\)/);
    assert.doesNotMatch(
      transport,
      /onDepart:[\s\S]{0,200}onAnimeArrive/,
      'URL commit must not fire during depart',
    );

    const arrive = block(
      sceneSource,
      'const arriveAnime = useCallback(',
      'const clearAnimeArrival',
    );
    assert.doesNotMatch(
      arrive,
      /rememberArrival/,
      'in-scene arrival must not be a second memory write site',
    );

    const handoff = block(
      sceneSource,
      'const handoffAnimeArrival = useCallback(',
      '// Same-route ?region=',
    );
    assert.doesNotMatch(
      handoff,
      /rememberArrival/,
      'URL hand-off must not be a second memory write site',
    );

    // Exactly one write site in the scene.
    assert.equal(sceneSource.split('rememberArrival(').length - 1, 1);
  });

  test('the recorder adds no state, ref, callback, or URL authority', () => {
    const recorder = block(
      sceneSource,
      '// World Memory observes committed arrival',
      'const ambient =',
    );
    assert.doesNotMatch(recorder, /useState|useRef|useCallback/);
    assert.doesNotMatch(recorder, /router|searchParams|worldHref|history/);
    assert.doesNotMatch(recorder, /onAnimeArrive|onAnimeClear/);
    assert.doesNotMatch(recorder, /setArrivedAnime|lastAnimeArrivalRef/);
  });

  test('protected arrival machinery is unchanged', () => {
    assert.match(sceneSource, /const commitAnimeArrivalVisual = useCallback/);
    assert.match(sceneSource, /if \(arrivedAnimeRef\.current\?\.id === anime\.id\) return;/);
    assert.match(sceneSource, /if \(lastAnimeArrivalRef\.current === arrival\) return;/);
    assert.match(sceneSource, /handoffAnimeArrival\(arrival\);/);
    assert.match(sceneSource, /const \[arrivedAnime, setArrivedAnime\] = useState/);
    assert.doesNotMatch(sceneSource, /useState.*[Mm]emory|memoryRef/);
  });
});

describe('world memory domain boundary', () => {
  test('the domain imports nothing from UI or sibling features', () => {
    // A standalone module is the strongest form of the boundary.
    assert.doesNotMatch(memorySource, /^import/m);
    assert.doesNotMatch(memorySource, /require\(/);

    const source = code(memorySource);
    for (const forbidden of [
      'world-scene',
      'world-navigator',
      'anime-destination',
      'watchlist',
      'Watchlist',
      'kinship',
      'Kinship',
      'react',
      'framer-motion',
      'WorldEnvironment',
      'WorldKind',
      'CanonicalAnime',
    ]) {
      assert.equal(
        source.includes(forbidden),
        false,
        `anime.memory must not reference ${forbidden} in code`,
      );
    }
  });

  test('memory is not exported through the shared/anime barrel', () => {
    assert.doesNotMatch(barrelSource, /anime\.memory/);
  });

  test('memory and watchlist remain independent stores', () => {
    assert.match(memorySource, /'aetheranime\.memory\.v1'/);
    assert.match(watchlistSource, /'aetheranime\.watchlist\.v1'/);
    assert.doesNotMatch(memorySource, /aetheranime\.watchlist/);
    assert.doesNotMatch(watchlistSource, /aetheranime\.memory|rememberArrival/);
  });

  test('memory performs no network, timer, or animation work', () => {
    for (const forbidden of [
      'fetch(',
      'setTimeout',
      'setInterval',
      'requestAnimationFrame',
      'XMLHttpRequest',
      '/api/',
      'eval(',
      'Function(',
    ]) {
      assert.equal(
        memorySource.includes(forbidden),
        false,
        `anime.memory must not use ${forbidden}`,
      );
    }
  });
});
