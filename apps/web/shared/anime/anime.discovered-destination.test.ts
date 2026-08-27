import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { ANIME_CATALOG } from './anime.catalog';
import { canonicalizeDiscoveryCandidate } from './anime.discovery';
import { discoveredDestinationMark } from './anime.discovered-mark';
import { metadataLookupTarget } from './anime.mal.identity';
import { createMalMetadataProvider } from './anime.mal.provider';
import {
  metadataResponseForSlug,
  overlayDiscoveredMetadata,
} from './anime.metadata';
import { getAllAnime } from './anime.repository';
import { resolveAnime } from './anime.resolver';
import { planAnimeAsk } from './anime.semantic-intent';
import { scoreSemanticCandidate } from './anime.semantic-profile';
import { normalizeVoiceQuery } from './anime.voice';
import { verifiedWatchUrl, watchPathsForAnime } from './anime.watch-path';
import {
  WATCHLIST_STORAGE_KEY,
  isOnWatchlist,
  readWatchlist,
  toggleWatchlist,
} from './anime.watchlist';
import type { AnimeDiscoveryCandidate } from './anime.discovery';
import type { CanonicalAnime } from './anime.types';

const JUJUTSU: AnimeDiscoveryCandidate = {
  malId: 40748,
  title: 'Jujutsu Kaisen',
  alternateTitle: 'Jujutsu Kaisen',
  year: 2020,
  type: 'tv',
  episodeCount: 24,
  status: 'finished',
  genres: ['Action'],
  studios: ['MAPPA'],
  synopsis: 'A boy swallows a curse and is dragged into sorcery.',
};

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

describe('discovered CanonicalAnime identity', () => {
  test('unknown MAL candidate canonicalizes deterministically', () => {
    const first = canonicalizeDiscoveryCandidate(JUJUTSU);
    const second = canonicalizeDiscoveryCandidate(JUJUTSU);
    assert.equal(first.slug, 'discovered-40748');
    assert.equal(first.id, 'anime.discovered.40748');
    assert.deepEqual(first, second);
  });

  test('catalog MAL ID still canonicalizes to the catalog title', () => {
    const anime = canonicalizeDiscoveryCandidate({
      ...JUJUTSU,
      malId: 52299,
      title: 'Ore dake Level Up na Ken',
    });
    assert.equal(anime.slug, 'solo-leveling');
    assert.equal(anime.id, 'anime.solo-leveling');
  });

  test('Fate titles remain distinct from discovered identities', () => {
    const discovered = canonicalizeDiscoveryCandidate(JUJUTSU);
    const stayNight = canonicalizeDiscoveryCandidate({
      ...JUJUTSU,
      malId: 356,
      title: 'Fate/stay night',
    });
    assert.equal(stayNight.slug, 'fate-stay-night');
    assert.notEqual(discovered.slug, stayNight.slug);
    assert.notEqual(discovered.slug, 'fate-zero');
    assert.notEqual(discovered.slug, 'fate-grand-order');
  });

  test('discovered identity does not mutate catalog', () => {
    const before = getAllAnime().map((anime) => anime.slug);
    canonicalizeDiscoveryCandidate(JUJUTSU);
    assert.deepEqual(
      getAllAnime().map((anime) => anime.slug),
      before,
    );
    assert.deepEqual(
      ANIME_CATALOG.map((anime) => anime.slug),
      ['solo-leveling', 'fate-stay-night', 'fate-zero', 'fate-grand-order'],
    );
  });
});

describe('discovered visual identity', () => {
  test('discovered poster is local and project-owned', () => {
    const anime = canonicalizeDiscoveryCandidate(JUJUTSU);
    assert.equal(anime.poster, null);
    const mark = discoveredDestinationMark({
      malId: 40748,
      title: anime.canonicalTitle,
      genres: anime.genres,
      year: anime.year,
    });
    assert.equal(mark.kind, 'local-seal');
    assert.equal('src' in mark, false);
    assert.equal('url' in mark, false);
    assert.equal(
      discoveredDestinationMark({
        malId: 40748,
        title: anime.canonicalTitle,
        genres: anime.genres,
        year: anime.year,
      }).hue,
      mark.hue,
    );
    assert.notEqual(
      discoveredDestinationMark({
        malId: 40749,
        title: 'Shingeki no Kyojin',
        genres: ['Action'],
        year: 2013,
      }).hue,
      mark.hue,
    );
  });
});

describe('discovered watch path', () => {
  test('discovered title does not receive an invented official URL', () => {
    const anime = canonicalizeDiscoveryCandidate(JUJUTSU);
    assert.equal(anime.officialUrl, null);
    assert.equal(verifiedWatchUrl(watchPathsForAnime(anime)), null);
  });

  test('Crunchyroll remains unknown', () => {
    const paths = watchPathsForAnime(canonicalizeDiscoveryCandidate(JUJUTSU));
    assert.equal(
      paths.find((path) => path.provider === 'crunchyroll')?.status,
      'unknown',
    );
  });
});

describe('discovered metadata after confirmation', () => {
  test('no metadata request occurs before required confirmation', () => {
    const unknown = resolveAnime('Jujutsu Kaisen');
    assert.equal(unknown.status, 'unknown');
    assert.equal(metadataLookupTarget(unknown), null);
    const fate = resolveAnime('Fate');
    assert.equal(fate.status, 'ambiguous');
    assert.equal(metadataLookupTarget(fate), null);
  });

  test('confirmed discovered identity can look up metadata by discovered slug', () => {
    const anime = canonicalizeDiscoveryCandidate(JUJUTSU);
    assert.equal(
      metadataLookupTarget({ status: 'resolved', anime }),
      'discovered-40748',
    );
  });

  test('Mal metadata provider can enrich a discovered CanonicalAnime', async () => {
    const anime = canonicalizeDiscoveryCandidate(JUJUTSU);
    const provider = createMalMetadataProvider({
      clientId: 'test-client',
      fetchImpl: async (input) => {
        const url = String(input);
        assert.match(url, /\/anime\/40748/);
        assert.doesNotMatch(url, /[?&]q=/);
        return new Response(
          JSON.stringify({
            id: 40748,
            title: 'Jujutsu Kaisen',
            alternative_titles: { en: 'Jujutsu Kaisen' },
            synopsis: 'A boy swallows a curse.',
            mean: 8.64,
            rank: 70,
            popularity: 20,
            num_list_users: 2000000,
            num_scoring_users: 1400000,
            genres: [{ id: 1, name: 'Action' }],
          }),
          { status: 200 },
        );
      },
    });
    const metadata = await provider.getByCanonicalAnime(anime);
    assert.equal(metadata?.malId, 40748);
    assert.equal(metadata?.score, 8.64);
    assert.equal(metadata?.rank, 70);
    assert.equal(anime.slug, 'discovered-40748');
  });

  test('metadata failure leaves destination intact', async () => {
    const anime = canonicalizeDiscoveryCandidate(JUJUTSU);
    const before: CanonicalAnime = { ...anime };
    const provider = createMalMetadataProvider({
      clientId: 'test-client',
      fetchImpl: async () => {
        throw new Error('network');
      },
    });
    assert.equal(await provider.getByCanonicalAnime(anime), null);
    assert.deepEqual(anime, before);
    assert.equal(anime.canonicalTitle, 'Jujutsu Kaisen');
  });

  test('late metadata response cannot overwrite a newer destination', () => {
    assert.equal(
      metadataResponseForSlug('discovered-40748', 'solo-leveling', false),
      'ignore',
    );
    assert.equal(
      metadataResponseForSlug('discovered-40748', 'discovered-40748', true),
      'ignore',
    );
    assert.equal(
      metadataResponseForSlug('discovered-40748', 'discovered-40748', false),
      'apply',
    );
  });

  test('discovered overlay uses metadata without replacing CanonicalAnime', () => {
    const anime = canonicalizeDiscoveryCandidate(JUJUTSU);
    const overlay = overlayDiscoveredMetadata(anime, {
      source: 'mal',
      malId: 40748,
      title: 'Jujutsu Kaisen',
      alternateTitle: 'Jujutsu Kaisen',
      synopsis: 'A boy swallows a curse and is dragged into sorcery.',
      score: 8.64,
      scoredBy: 1400000,
      rank: 70,
      popularity: 20,
      members: 2000000,
      genres: ['Action'],
      url: 'https://myanimelist.net/anime/40748',
    });
    assert.equal(
      overlay.synopsis,
      'A boy swallows a curse and is dragged into sorcery.',
    );
    assert.equal(overlay.rank, 70);
    assert.equal(anime.synopsis.includes('beyond the known catalog'), true);
    const failed = overlayDiscoveredMetadata(anime, null);
    assert.equal(failed.synopsis, anime.synopsis);
    assert.equal(failed.rank, null);
  });
});

describe('discovered watchlist uses CanonicalAnime identity', () => {
  test('save, saved state, remove, and return keep the same discovered identity', () => {
    const anime = canonicalizeDiscoveryCandidate(JUJUTSU);
    const store = memoryStore();
    assert.equal(isOnWatchlist(anime.id, store), false);
    toggleWatchlist({ animeId: anime.id, slug: anime.slug }, store, '2026-08-17T13:00:00.000Z');
    assert.equal(isOnWatchlist(anime.id, store), true);
    assert.equal(isOnWatchlist(String(anime.slug.replace('discovered-', '')), store), false);
    const serialized = store.getItem(WATCHLIST_STORAGE_KEY) ?? '';
    const returned = memoryStore({ [WATCHLIST_STORAGE_KEY]: serialized });
    assert.equal(isOnWatchlist(anime.id, returned), true);
    assert.equal(readWatchlist(returned)[0]?.slug, 'discovered-40748');
    toggleWatchlist({ animeId: anime.id, slug: anime.slug }, returned);
    assert.equal(isOnWatchlist(anime.id, returned), false);
  });
});

describe('Task-023 does not reopen semantic or LLM routing', () => {
  test('semantic ranking remains unchanged', () => {
    const horror = scoreSemanticCandidate(
      {
        malId: 19,
        title: 'Monster',
        alternateTitle: null,
        year: 2004,
        type: 'tv',
        episodeCount: 74,
        status: 'finished',
        genres: ['Drama', 'Horror', 'Mystery', 'Psychological'],
        studios: ['Madhouse'],
        synopsis: 'A doctor pursues a former patient.',
      },
      {
        type: 'recommend',
        title: null,
        seedTitle: null,
        constraints: {
          genres: [],
          themes: ['psychological'],
          protagonistTraits: ['overpowered'],
          tone: ['dark'],
        },
        exclusions: { watchlisted: false },
      },
    );
    assert.equal(horror.judgements.find((item) => item.tag === 'dark')?.kind, 'match');
    assert.equal(
      horror.judgements.find((item) => item.tag === 'overpowered')?.kind,
      'unknown',
    );
    assert.ok(horror.total > 0);
  });

  test('deterministic title requests remain 0 LLM calls', () => {
    assert.equal(planAnimeAsk('Solo Leveling').llmCalls, 0);
    assert.equal(
      planAnimeAsk(normalizeVoiceQuery('Take me to Solo Leveling')).llmCalls,
      0,
    );
  });

  test('ambiguous requests remain 0 LLM calls', () => {
    const plan = planAnimeAsk(normalizeVoiceQuery('Take me to Fate'));
    assert.equal(plan.kind, 'ambiguous');
    assert.equal(plan.llmCalls, 0);
  });
});
