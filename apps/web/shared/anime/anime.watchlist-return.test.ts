import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { canonicalizeDiscoveryCandidate } from './anime.discovery';
import { metadataLookupTarget } from './anime.mal.identity';
import { getAnimeBySlug } from './anime.repository';
import { planAnimeAsk } from './anime.semantic-intent';
import { normalizeVoiceQuery } from './anime.voice';
import { verifiedWatchUrl, watchPathsForAnime } from './anime.watch-path';
import {
  isOnWatchlist,
  readWatchlist,
  toggleWatchlist,
  WATCHLIST_STORAGE_KEY,
} from './anime.watchlist';
import {
  hydratedAnimeMatchesWatchlistRow,
  isWatchlistReturnQuery,
  resolveWatchlistReturn,
  watchlistReturnLabel,
  watchlistReturnRows,
} from './anime.watchlist-return';
import type { WatchlistEntry } from './anime.watchlist';
import type { AnimeDiscoveryCandidate } from './anime.discovery';

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

function save(
  entry: {
    readonly animeId: string;
    readonly slug: string;
    readonly title?: string;
  },
  store = memoryStore(),
) {
  toggleWatchlist(entry, store, '2026-08-18T04:00:00.000Z');
  return store;
}

describe('isWatchlistReturnQuery', () => {
  test('recognizes watchlist return asks after voice prefix stripping', () => {
    assert.equal(isWatchlistReturnQuery('watchlist'), true);
    assert.equal(isWatchlistReturnQuery('my watchlist'), true);
    assert.equal(
      isWatchlistReturnQuery(normalizeVoiceQuery('Show me my watchlist')),
      true,
    );
    assert.equal(
      isWatchlistReturnQuery(normalizeVoiceQuery('Take me to my watchlist')),
      true,
    );
    assert.equal(isWatchlistReturnQuery('saved'), true);
  });

  test('does not steal watchlist exclusion or named titles', () => {
    assert.equal(
      isWatchlistReturnQuery(
        normalizeVoiceQuery("Show me something I haven't saved yet"),
      ),
      false,
    );
    assert.equal(isWatchlistReturnQuery('Solo Leveling'), false);
    assert.equal(isWatchlistReturnQuery('Jujutsu Kaisen'), false);
  });
});

describe('catalog watchlist round-trip', () => {
  test('save, leave, select returns the same CanonicalAnime identity', () => {
    const solo = getAnimeBySlug('solo-leveling');
    assert.ok(solo);
    const store = save({ animeId: solo.id, slug: solo.slug });
    const entry = readWatchlist(store)[0];
    assert.ok(entry);
    const resolved = resolveWatchlistReturn(entry);
    assert.equal(resolved.kind, 'catalog');
    if (resolved.kind !== 'catalog') return;
    assert.equal(resolved.anime, solo);
    assert.equal(resolved.anime.id, 'anime.solo-leveling');
    assert.equal(resolved.anime.slug, 'solo-leveling');
    assert.equal(isOnWatchlist(resolved.anime.id, store), true);
  });
});

describe('discovered watchlist round-trip', () => {
  test('save discovered-{malId}, leave, select keeps discovered identity', () => {
    const anime = canonicalizeDiscoveryCandidate(JUJUTSU);
    const store = save({ animeId: anime.id, slug: anime.slug });
    const entry = readWatchlist(store)[0];
    assert.ok(entry);
    const resolved = resolveWatchlistReturn(entry);
    assert.equal(resolved.kind, 'discovered');
    if (resolved.kind !== 'discovered') return;
    assert.equal(resolved.slug, 'discovered-40748');
    assert.equal(resolved.malId, 40748);
    assert.equal(resolved.animeId, 'anime.discovered.40748');
    assert.equal(isOnWatchlist(anime.id, store), true);
  });
});

describe('catalog and discovered identity separation', () => {
  test('discovered-40748 does not resolve to a catalog title', () => {
    const resolved = resolveWatchlistReturn({
      animeId: 'anime.discovered.40748',
      slug: 'discovered-40748',
      savedAt: '2026-08-18T04:00:00.000Z',
    });
    assert.equal(resolved.kind, 'discovered');
    if (resolved.kind !== 'discovered') return;
    assert.notEqual(resolved.slug, 'solo-leveling');
    assert.notEqual(resolved.slug, 'fate-stay-night');
    assert.equal(getAnimeBySlug(resolved.slug), undefined);
  });

  test('catalog Fate/Zero remains catalog-owned', () => {
    const fateZero = getAnimeBySlug('fate-zero');
    assert.ok(fateZero);
    const resolved = resolveWatchlistReturn({
      animeId: fateZero.id,
      slug: fateZero.slug,
      savedAt: '2026-08-18T04:00:00.000Z',
    });
    assert.equal(resolved.kind, 'catalog');
    if (resolved.kind !== 'catalog') return;
    assert.equal(resolved.anime.slug, 'fate-zero');
  });
});

describe('watchlist return does not become metadata or watch-path', () => {
  test('selection itself is not a metadata lookup', () => {
    const solo = getAnimeBySlug('solo-leveling');
    assert.ok(solo);
    const resolved = resolveWatchlistReturn({
      animeId: solo.id,
      slug: solo.slug,
      savedAt: '2026-08-18T04:00:00.000Z',
    });
    assert.equal(resolved.kind, 'catalog');
    assert.equal(
      metadataLookupTarget({ status: 'unknown', query: 'watchlist' }),
      null,
    );
    if (resolved.kind !== 'catalog') return;
    assert.equal(
      metadataLookupTarget({ status: 'resolved', anime: resolved.anime }),
      'solo-leveling',
    );
  });

  test('watchlist selection does not manufacture Watch Now', () => {
    const discovered = resolveWatchlistReturn({
      animeId: 'anime.discovered.40748',
      slug: 'discovered-40748',
      savedAt: '2026-08-18T04:00:00.000Z',
    });
    assert.equal(discovered.kind, 'discovered');
    const anime = canonicalizeDiscoveryCandidate(JUJUTSU);
    const paths = watchPathsForAnime(anime);
    assert.equal(verifiedWatchUrl(paths), null);
    assert.equal(
      paths.find((path) => path.provider === 'crunchyroll')?.status,
      'unknown',
    );

    const solo = getAnimeBySlug('solo-leveling');
    assert.ok(solo);
    assert.equal(
      verifiedWatchUrl(watchPathsForAnime(solo)),
      'https://sololeveling-anime.net/',
    );
  });
});

describe('invalid watchlist rows fail safely', () => {
  test('does not fabricate CanonicalAnime for unresolvable rows', () => {
    const resolved = resolveWatchlistReturn({
      animeId: 'anime.invented',
      slug: 'not-a-real-slug',
      savedAt: '2026-08-18T04:00:00.000Z',
    });
    assert.equal(resolved.kind, 'unresolvable');
    assert.equal('anime' in resolved, false);
  });

  test('mismatched catalog id and slug fail safely', () => {
    const resolved = resolveWatchlistReturn({
      animeId: 'anime.solo-leveling',
      slug: 'fate-zero',
      savedAt: '2026-08-18T04:00:00.000Z',
    });
    assert.equal(resolved.kind, 'unresolvable');
  });

  test('watchlistReturnRows omits unresolvable entries', () => {
    const solo = getAnimeBySlug('solo-leveling');
    assert.ok(solo);
    const entries: WatchlistEntry[] = [
      {
        animeId: solo.id,
        slug: solo.slug,
        savedAt: '2026-08-18T04:00:00.000Z',
      },
      {
        animeId: 'anime.invented',
        slug: 'ghost',
        savedAt: '2026-08-18T04:00:00.000Z',
      },
      {
        animeId: 'anime.discovered.40748',
        slug: 'discovered-40748',
        savedAt: '2026-08-18T04:00:00.000Z',
      },
    ];
    const rows = watchlistReturnRows(entries);
    assert.equal(rows.length, 2);
    assert.equal(rows[0]?.kind, 'catalog');
    assert.equal(rows[1]?.kind, 'discovered');
  });
});

describe('duplicate selection does not duplicate watchlist rows', () => {
  test('resolving the same saved row twice leaves one storage row', () => {
    const solo = getAnimeBySlug('solo-leveling');
    assert.ok(solo);
    const store = save({ animeId: solo.id, slug: solo.slug });
    const entry = readWatchlist(store)[0];
    assert.ok(entry);
    resolveWatchlistReturn(entry);
    resolveWatchlistReturn(entry);
    assert.equal(readWatchlist(store).length, 1);
    assert.equal(isOnWatchlist(solo.id, store), true);
    assert.equal(store.data.get(WATCHLIST_STORAGE_KEY)?.includes(solo.id), true);
  });
});

describe('discovered hydration must match persisted identity exactly', () => {
  test('valid discovered row accepts exact hydration', () => {
    const anime = canonicalizeDiscoveryCandidate(JUJUTSU);
    assert.equal(
      hydratedAnimeMatchesWatchlistRow(
        {
          animeId: 'anime.discovered.40748',
          slug: 'discovered-40748',
          savedAt: '2026-08-18T04:00:00.000Z',
        },
        anime,
      ),
      true,
    );
    assert.equal(anime.id, 'anime.discovered.40748');
    assert.equal(anime.slug, 'discovered-40748');
  });

  test('wrong hydrated animeId is rejected', () => {
    const anime = canonicalizeDiscoveryCandidate({
      ...JUJUTSU,
      malId: 16498,
      title: 'Shingeki no Kyojin',
    });
    assert.equal(
      hydratedAnimeMatchesWatchlistRow(
        {
          animeId: 'anime.discovered.40748',
          slug: 'discovered-40748',
          savedAt: '2026-08-18T04:00:00.000Z',
        },
        anime,
      ),
      false,
    );
  });

  test('mismatched discovered slug is unresolvable', () => {
    const resolved = resolveWatchlistReturn({
      animeId: 'anime.discovered.40748',
      slug: 'discovered-16498',
      savedAt: '2026-08-18T04:00:00.000Z',
    });
    assert.equal(resolved.kind, 'unresolvable');
  });

  test('catalog-owned hydration does not silently migrate a discovered row', () => {
    const catalog = canonicalizeDiscoveryCandidate({
      ...JUJUTSU,
      malId: 52299,
      title: 'Ore dake Level Up na Ken',
    });
    assert.equal(catalog.slug, 'solo-leveling');
    assert.equal(
      hydratedAnimeMatchesWatchlistRow(
        {
          animeId: 'anime.discovered.52299',
          slug: 'discovered-52299',
          savedAt: '2026-08-18T04:00:00.000Z',
        },
        catalog,
      ),
      false,
    );
  });
});

describe('watchlist display title is presentation only', () => {
  test('new catalog and discovered saves store canonicalTitle', () => {
    const solo = getAnimeBySlug('solo-leveling');
    assert.ok(solo);
    const catalogStore = save({
      animeId: solo.id,
      slug: solo.slug,
      title: solo.canonicalTitle,
    });
    assert.equal(readWatchlist(catalogStore)[0]?.title, 'Solo Leveling');

    const discovered = canonicalizeDiscoveryCandidate(JUJUTSU);
    const discoveredStore = save({
      animeId: discovered.id,
      slug: discovered.slug,
      title: discovered.canonicalTitle,
    });
    assert.equal(readWatchlist(discoveredStore)[0]?.title, 'Jujutsu Kaisen');
  });

  test('existing rows without title still load and fall back to discovered slug', () => {
    const store = memoryStore({
      [WATCHLIST_STORAGE_KEY]: JSON.stringify([
        {
          animeId: 'anime.discovered.40748',
          slug: 'discovered-40748',
          savedAt: '2026-08-17T12:00:00.000Z',
        },
      ]),
    });
    const entry = readWatchlist(store)[0];
    assert.ok(entry);
    assert.equal(entry.title, undefined);
    const rows = watchlistReturnRows([entry]);
    assert.equal(rows[0]?.kind, 'discovered');
    if (rows[0]?.kind !== 'discovered') return;
    assert.equal(watchlistReturnLabel(rows[0]), 'discovered-40748');
  });

  test('title never affects identity resolution', () => {
    const withTitle = resolveWatchlistReturn({
      animeId: 'anime.discovered.40748',
      slug: 'discovered-40748',
      title: 'A forged name',
      savedAt: '2026-08-18T04:00:00.000Z',
    });
    const withoutTitle = resolveWatchlistReturn({
      animeId: 'anime.discovered.40748',
      slug: 'discovered-40748',
      savedAt: '2026-08-18T04:00:00.000Z',
    });
    assert.equal(withTitle.kind, 'discovered');
    assert.equal(withoutTitle.kind, 'discovered');
    if (withTitle.kind !== 'discovered' || withoutTitle.kind !== 'discovered') {
      return;
    }
    assert.equal(withTitle.animeId, withoutTitle.animeId);
    assert.equal(withTitle.slug, withoutTitle.slug);
    const rows = watchlistReturnRows([
      {
        animeId: 'anime.discovered.40748',
        slug: 'discovered-40748',
        title: 'Jujutsu Kaisen',
        savedAt: '2026-08-18T04:00:00.000Z',
      },
    ]);
    assert.equal(rows[0]?.kind, 'discovered');
    if (rows[0]?.kind !== 'discovered') return;
    assert.equal(watchlistReturnLabel(rows[0]), 'Jujutsu Kaisen');
  });
});

describe('watchlist return planner is deterministic', () => {
  test('watchlist asks are 0 LLM and not discovery', () => {
    const spoken = planAnimeAsk(normalizeVoiceQuery('Show me my watchlist'));
    assert.equal(spoken.kind, 'watchlist');
    assert.equal(spoken.llmCalls, 0);
    assert.equal(planAnimeAsk('watchlist').kind, 'watchlist');
    assert.equal(planAnimeAsk('watchlist').llmCalls, 0);
    assert.equal(planAnimeAsk('my watchlist').kind, 'watchlist');
    assert.equal(planAnimeAsk('my watchlist').llmCalls, 0);
  });

  test('named titles, Fate, and semantic routing remain unchanged', () => {
    assert.equal(planAnimeAsk('Solo Leveling').kind, 'arrive');
    assert.equal(planAnimeAsk('Solo Leveling').llmCalls, 0);
    const fate = planAnimeAsk(normalizeVoiceQuery('Take me to Fate'));
    assert.equal(fate.kind, 'ambiguous');
    assert.equal(fate.llmCalls, 0);
    const semantic = planAnimeAsk(
      'I want something dark with an overpowered protagonist',
    );
    assert.equal(semantic.kind, 'semantic');
    assert.equal(semantic.llmCalls, 1);
    const exclusion = planAnimeAsk(
      normalizeVoiceQuery("Show me something I haven't saved yet"),
    );
    assert.equal(exclusion.kind, 'filter');
  });
});
