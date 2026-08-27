import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { ANIME_CATALOG } from './anime.catalog';
import {
  canonicalizeDiscoveryCandidate,
  discoveryLookupTarget,
  normalizeMalDiscoveryPayload,
} from './anime.discovery';
import { parseAnimeIntent } from './anime.intent';
import { createMalDiscoveryProvider } from './anime.mal.discovery';
import {
  discoveredMalIdFromSlug,
  discoveredSlugForMalId,
  malIdForSlug,
} from './anime.mal.identity';
import { getAnimeBySlug, resolveInitialAnimeArrival } from './anime.repository';
import { resolveAnime } from './anime.resolver';
import { normalizeVoiceQuery } from './anime.voice';
import { verifiedWatchUrl, watchPathsForAnime } from './anime.watch-path';
import {
  WATCHLIST_STORAGE_KEY,
  readWatchlist,
  toggleWatchlist,
} from './anime.watchlist';

const JUJUTSU_NODE = {
  id: 40748,
  title: 'Jujutsu Kaisen',
  alternative_titles: { en: 'Jujutsu Kaisen', ja: '呪術廻戦' },
  start_date: '2020-10-03',
  media_type: 'tv',
  num_episodes: 24,
  status: 'finished_airing',
  genres: [{ id: 1, name: 'Action' }],
  studios: [{ id: 1, name: 'MAPPA' }],
};

describe('parseAnimeIntent', () => {
  test('plain titles navigate', () => {
    assert.deepEqual(parseAnimeIntent('Jujutsu Kaisen'), {
      kind: 'navigate',
      title: 'Jujutsu Kaisen',
    });
  });

  test('something like becomes similar intent', () => {
    assert.deepEqual(parseAnimeIntent('something like Solo Leveling'), {
      kind: 'similar',
      title: 'Solo Leveling',
    });
  });

  test('voice command still yields similar intent', () => {
    const spoken = normalizeVoiceQuery(
      'Show me something like Solo Leveling',
    );
    assert.deepEqual(parseAnimeIntent(spoken), {
      kind: 'similar',
      title: 'Solo Leveling',
    });
  });
});

describe('discoveryLookupTarget', () => {
  test('local catalog match does not start discovery', () => {
    const intent = parseAnimeIntent('Solo Leveling');
    const resolution = resolveAnime(intent.title);
    assert.equal(discoveryLookupTarget(intent, resolution), null);
  });

  test('unknown title can look up discovery search', () => {
    const intent = parseAnimeIntent('Jujutsu Kaisen');
    const resolution = resolveAnime(intent.title);
    assert.equal(resolution.status, 'unknown');
    assert.deepEqual(discoveryLookupTarget(intent, resolution), {
      kind: 'search',
      query: 'Jujutsu Kaisen',
    });
  });

  test('ambiguous Fate does not look up discovery', () => {
    const intent = parseAnimeIntent(
      normalizeVoiceQuery('Take me to Fate'),
    );
    const resolution = resolveAnime(intent.title);
    assert.equal(resolution.status, 'ambiguous');
    assert.equal(discoveryLookupTarget(intent, resolution), null);
  });

  test('similar Solo Leveling looks up recommendations by catalog slug', () => {
    const intent = parseAnimeIntent('something like Solo Leveling');
    const resolution = resolveAnime(intent.title);
    assert.deepEqual(discoveryLookupTarget(intent, resolution), {
      kind: 'similar',
      slug: 'solo-leveling',
    });
  });

  test('similar unknown seed does not look up discovery', () => {
    const intent = parseAnimeIntent('something like Completely Unknown Anime');
    const resolution = resolveAnime(intent.title);
    assert.equal(resolution.status, 'unknown');
    assert.equal(discoveryLookupTarget(intent, resolution), null);
  });

  test('voice Jujutsu Kaisen is unknown locally then eligible for search', () => {
    const intent = parseAnimeIntent(
      normalizeVoiceQuery('Take me to Jujutsu Kaisen'),
    );
    const resolution = resolveAnime(intent.title);
    assert.equal(resolution.status, 'unknown');
    assert.deepEqual(discoveryLookupTarget(intent, resolution), {
      kind: 'search',
      query: 'Jujutsu Kaisen',
    });
  });
});

describe('normalizeMalDiscoveryPayload', () => {
  test('maps a MAL search payload to application candidates', () => {
    const candidates = normalizeMalDiscoveryPayload({
      data: [{ node: JUJUTSU_NODE }],
    });
    assert.equal(candidates.length, 1);
    assert.equal(candidates[0]?.malId, 40748);
    assert.equal(candidates[0]?.title, 'Jujutsu Kaisen');
    assert.equal(candidates[0]?.year, 2020);
    assert.equal(candidates[0]?.type, 'tv');
    assert.equal('main_picture' in (candidates[0] ?? {}), false);
    assert.equal('node' in (candidates[0] ?? {}), false);
  });

  test('malformed provider result fails safely', () => {
    assert.deepEqual(normalizeMalDiscoveryPayload(null), []);
    assert.deepEqual(normalizeMalDiscoveryPayload({ data: 'nope' }), []);
    assert.deepEqual(
      normalizeMalDiscoveryPayload({ data: [{ node: { id: 0, title: '' } }] }),
      [],
    );
  });

  test('provider identity is preserved', () => {
    const candidates = normalizeMalDiscoveryPayload({
      data: [{ node: JUJUTSU_NODE }, { node: { ...JUJUTSU_NODE, id: 16498, title: 'Shingeki no Kyojin' } }],
    });
    assert.deepEqual(
      candidates.map((candidate) => candidate.malId),
      [40748, 16498],
    );
  });
});

describe('canonicalizeDiscoveryCandidate', () => {
  test('catalog MAL IDs canonicalize to the local CanonicalAnime', () => {
    const anime = canonicalizeDiscoveryCandidate({
      malId: 52299,
      title: 'Ore dake Level Up na Ken',
      alternateTitle: 'Solo Leveling',
      year: 2024,
      type: 'tv',
      episodeCount: 12,
      status: 'finished',
      genres: ['Action'],
      studios: ['A-1 Pictures'],
    });
    assert.equal(anime.slug, 'solo-leveling');
    assert.equal(anime.id, 'anime.solo-leveling');
    assert.equal(anime.officialUrl, 'https://sololeveling-anime.net/');
    assert.ok(anime.poster);
  });

  test('unknown MAL IDs become discovered CanonicalAnime, not catalog Fate titles', () => {
    const anime = canonicalizeDiscoveryCandidate({
      malId: 40748,
      title: 'Jujutsu Kaisen',
      alternateTitle: null,
      year: 2020,
      type: 'tv',
      episodeCount: 24,
      status: 'finished',
      genres: ['Action'],
      studios: ['MAPPA'],
    });
    assert.equal(anime.slug, 'discovered-40748');
    assert.equal(anime.id, 'anime.discovered.40748');
    assert.equal(anime.poster, null);
    assert.equal(anime.officialUrl, null);
    assert.notEqual(anime.slug, 'fate-stay-night');
    assert.notEqual(anime.slug, 'fate-zero');
    assert.doesNotMatch(anime.canonicalTitle, /Heaven|Unlimited Blade|Fate\/Zero/i);
  });

  test('discovered watch path is unavailable official and unknown Crunchyroll', () => {
    const anime = canonicalizeDiscoveryCandidate({
      malId: 40748,
      title: 'Jujutsu Kaisen',
      alternateTitle: null,
      year: 2020,
      type: 'tv',
      episodeCount: 24,
      status: 'finished',
      genres: ['Action'],
      studios: ['MAPPA'],
    });
    const paths = watchPathsForAnime(anime);
    assert.equal(verifiedWatchUrl(paths), null);
    assert.equal(
      paths.find((path) => path.provider === 'official')?.status,
      'unavailable',
    );
    assert.equal(
      paths.find((path) => path.provider === 'crunchyroll')?.status,
      'unknown',
    );
  });
});

describe('discovered slug identity', () => {
  test('discovered slugs round-trip a MAL id without replacing catalog ids', () => {
    assert.equal(discoveredSlugForMalId(40748), 'discovered-40748');
    assert.equal(discoveredMalIdFromSlug('discovered-40748'), 40748);
    assert.equal(malIdForSlug('discovered-40748'), 40748);
    assert.equal(malIdForSlug('solo-leveling'), 52299);
    assert.equal(malIdForSlug('does-not-exist'), null);
  });
});

describe('MalDiscoveryProvider', () => {
  test('search does not auto-resolve a CanonicalAnime', async () => {
    const provider = createMalDiscoveryProvider({
      clientId: 'test-client',
      fetchImpl: async (input) => {
        const url = String(input);
        assert.match(url, /[?&]q=Jujutsu/);
        return new Response(
          JSON.stringify({ data: [{ node: JUJUTSU_NODE }] }),
          { status: 200 },
        );
      },
    });
    const candidates = await provider.searchByTitle('Jujutsu Kaisen');
    assert.equal(candidates.length, 1);
    assert.equal(candidates[0]?.malId, 40748);
    assert.equal('canonicalTitle' in (candidates[0] ?? {}), false);
  });

  test('missing credentials skip the network', async () => {
    let called = 0;
    const provider = createMalDiscoveryProvider({
      clientId: '',
      fetchImpl: async () => {
        called += 1;
        return new Response('{}');
      },
    });
    assert.deepEqual(await provider.searchByTitle('Jujutsu Kaisen'), []);
    assert.equal(called, 0);
  });

  test('provider error returns no candidates', async () => {
    const provider = createMalDiscoveryProvider({
      clientId: 'test-client',
      fetchImpl: async () => {
        throw new Error('network');
      },
    });
    assert.deepEqual(await provider.searchByTitle('Jujutsu Kaisen'), []);
  });

  test('similar lookup reads MAL details recommendations, not a 404 path', async () => {
    const solo = getAnimeBySlug('solo-leveling');
    assert.ok(solo);
    let requested = '';
    const provider = createMalDiscoveryProvider({
      clientId: 'test-client',
      fetchImpl: async (input) => {
        requested = String(input);
        return new Response(
          JSON.stringify({
            id: 52299,
            title: 'Ore dake Level Up na Ken',
            recommendations: [{ node: JUJUTSU_NODE }],
          }),
          { status: 200 },
        );
      },
    });
    const candidates = await provider.getSimilarByCanonicalAnime(solo);
    assert.match(requested, /\/anime\/52299\?fields=recommendations$/);
    assert.doesNotMatch(requested, /\/recommendations\?/);
    assert.equal(candidates.length, 1);
    assert.equal(candidates[0]?.malId, 40748);
  });
});

describe('watchlist is unchanged by discovery identities', () => {
  test('discovered ids still persist only animeId, slug, and savedAt', () => {
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
    toggleWatchlist(
      { animeId: 'anime.discovered.40748', slug: 'discovered-40748' },
      store,
      '2026-08-17T12:00:00.000Z',
    );
    const entries = readWatchlist(store);
    assert.equal(entries.length, 1);
    assert.deepEqual(Object.keys(entries[0] ?? {}).sort(), [
      'animeId',
      'savedAt',
      'slug',
    ]);
    assert.equal(store.data.has(WATCHLIST_STORAGE_KEY), true);
  });
});

describe('catalog still owns the four known titles', () => {
  test('Fate titles remain distinct catalog entries', () => {
    const slugs = ANIME_CATALOG.map((anime) => anime.slug);
    assert.deepEqual(slugs, [
      'solo-leveling',
      'fate-stay-night',
      'fate-zero',
      'fate-grand-order',
    ]);
  });

  test('discovered slugs are valid arrivals without becoming catalog titles', () => {
    assert.equal(
      resolveInitialAnimeArrival('discovered-40748'),
      'discovered-40748',
    );
    assert.equal(resolveInitialAnimeArrival('solo-leveling'), 'solo-leveling');
    assert.equal(resolveInitialAnimeArrival('not-a-title'), undefined);
  });
});
