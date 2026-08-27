import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { resolveAnime } from './anime.resolver';
import { normalizeVoiceQuery } from './anime.voice';
import {
  malIdForSlug,
  metadataLookupTarget,
} from './anime.mal.identity';
import { normalizeMalAnime } from './anime.mal.normalize';
import { createMalMetadataProvider } from './anime.mal.provider';
import type { CanonicalAnime } from './anime.types';

const SOLO_LEVELING_MAL = {
  id: 52299,
  title: 'Ore dake Level Up na Ken',
  alternative_titles: {
    en: 'Solo Leveling',
    ja: '俺だけレベルアップな件',
    synonyms: ['Na Honjaman Level Up'],
  },
  synopsis: 'A hunter ranked weakest begins to climb.',
  mean: 8.14,
  rank: 400,
  popularity: 50,
  num_list_users: 800000,
  num_scoring_users: 450000,
  media_type: 'tv',
  status: 'finished_airing',
  genres: [
    { id: 1, name: 'Action' },
    { id: 10, name: 'Fantasy' },
  ],
  num_episodes: 12,
  start_date: '2024-01-07',
  end_date: '2024-03-31',
  average_episode_duration: 1440,
};

describe('normalizeMalAnime', () => {
  test('maps a valid MAL details payload to normalized metadata', () => {
    const metadata = normalizeMalAnime(SOLO_LEVELING_MAL);
    assert.ok(metadata);
    assert.equal(metadata.source, 'mal');
    assert.equal(metadata.malId, 52299);
    assert.equal(metadata.title, 'Ore dake Level Up na Ken');
    assert.equal(metadata.alternateTitle, 'Solo Leveling');
    assert.equal(metadata.synopsis, 'A hunter ranked weakest begins to climb.');
    assert.equal(metadata.score, 8.14);
    assert.equal(metadata.scoredBy, 450000);
    assert.equal(metadata.rank, 400);
    assert.equal(metadata.popularity, 50);
    assert.equal(metadata.members, 800000);
    assert.deepEqual(metadata.genres, ['Action', 'Fantasy']);
    assert.equal(metadata.url, 'https://myanimelist.net/anime/52299');
  });

  test('missing score becomes null, not 0', () => {
    const metadata = normalizeMalAnime({ ...SOLO_LEVELING_MAL, mean: null });
    assert.equal(metadata?.score, null);
  });

  test('score 0 is preserved and not converted to null', () => {
    const metadata = normalizeMalAnime({ ...SOLO_LEVELING_MAL, mean: 0 });
    assert.equal(metadata?.score, 0);
  });

  test('missing synopsis becomes null', () => {
    const metadata = normalizeMalAnime({
      ...SOLO_LEVELING_MAL,
      synopsis: undefined,
    });
    assert.equal(metadata?.synopsis, null);
  });

  test('missing genres become an empty list', () => {
    const metadata = normalizeMalAnime({
      ...SOLO_LEVELING_MAL,
      genres: undefined,
    });
    assert.deepEqual(metadata?.genres, []);
  });

  test('extracts a single English alternate title when present', () => {
    const metadata = normalizeMalAnime(SOLO_LEVELING_MAL);
    assert.equal(metadata?.alternateTitle, 'Solo Leveling');
  });

  test('malformed provider response fails safely', () => {
    assert.equal(normalizeMalAnime(null), null);
    assert.equal(normalizeMalAnime('nope'), null);
    assert.equal(normalizeMalAnime({ title: 'Solo Leveling' }), null);
    assert.equal(normalizeMalAnime({ id: '52299' }), null);
  });
});

describe('mal identity mapping', () => {
  test('maps verified catalog slugs to distinct MAL IDs', () => {
    assert.equal(malIdForSlug('solo-leveling'), 52299);
    assert.equal(malIdForSlug('fate-stay-night'), 356);
    assert.equal(malIdForSlug('fate-zero'), 10087);
    assert.equal(malIdForSlug('fate-grand-order'), 34321);
  });

  test('Fate-family identities are not interchangeable', () => {
    const stayNight = malIdForSlug('fate-stay-night');
    const fateZero = malIdForSlug('fate-zero');
    const grandOrder = malIdForSlug('fate-grand-order');
    assert.notEqual(stayNight, fateZero);
    assert.notEqual(stayNight, grandOrder);
    assert.notEqual(fateZero, grandOrder);
  });

  test('unknown slug has no MAL identity', () => {
    assert.equal(malIdForSlug('does-not-exist'), null);
  });
});

describe('metadata lookup is not resolution', () => {
  test('resolved Solo Leveling can look up metadata by canonical slug', () => {
    const result = resolveAnime('Solo Leveling');
    assert.equal(metadataLookupTarget(result), 'solo-leveling');
    assert.equal(malIdForSlug(metadataLookupTarget(result) ?? ''), 52299);
  });

  test('unknown anime does not produce a metadata lookup target', () => {
    const result = resolveAnime('something completely nonexistent');
    assert.equal(result.status, 'unknown');
    assert.equal(metadataLookupTarget(result), null);
  });

  test('ambiguous Fate does not look up metadata until a candidate is selected', () => {
    const result = resolveAnime('Fate');
    assert.equal(result.status, 'ambiguous');
    assert.equal(metadataLookupTarget(result), null);
    if (result.status === 'ambiguous') {
      const selected = result.candidates.find(
        (anime) => anime.slug === 'fate-zero',
      );
      assert.ok(selected);
      assert.equal(malIdForSlug(selected.slug), 10087);
      assert.notEqual(malIdForSlug(selected.slug), 356);
    }
  });

  test('voice transcript still resolves locally before any MAL identity', () => {
    const result = resolveAnime(
      normalizeVoiceQuery('Take me to Solo Leveling'),
    );
    assert.equal(result.status, 'resolved');
    if (result.status === 'resolved') {
      assert.equal(result.anime.slug, 'solo-leveling');
      assert.equal(malIdForSlug(result.anime.slug), 52299);
    }
  });

  test('canonical identity remains unchanged by metadata normalization', () => {
    const result = resolveAnime('Solo Leveling');
    assert.equal(result.status, 'resolved');
    if (result.status !== 'resolved') return;
    const before: CanonicalAnime = result.anime;
    normalizeMalAnime(SOLO_LEVELING_MAL);
    assert.equal(before.slug, 'solo-leveling');
    assert.equal(before.canonicalTitle, 'Solo Leveling');
    assert.equal(before.ratings.mal, null);
  });
});

describe('MalMetadataProvider', () => {
  test('unknown MAL ID returns null', async () => {
    const provider = createMalMetadataProvider({
      clientId: 'test-client',
      fetchImpl: async () =>
        new Response(JSON.stringify({ error: 'not_found' }), { status: 404 }),
    });
    const result = resolveAnime('Solo Leveling');
    assert.equal(result.status, 'resolved');
    if (result.status !== 'resolved') return;
    assert.equal(await provider.getByCanonicalAnime(result.anime), null);
  });

  test('provider error returns null without throwing', async () => {
    const provider = createMalMetadataProvider({
      clientId: 'test-client',
      fetchImpl: async () => {
        throw new Error('network');
      },
    });
    const result = resolveAnime('Solo Leveling');
    assert.equal(result.status, 'resolved');
    if (result.status !== 'resolved') return;
    assert.equal(await provider.getByCanonicalAnime(result.anime), null);
  });

  test('missing credentials skip the network and return null', async () => {
    let called = 0;
    const provider = createMalMetadataProvider({
      clientId: '',
      fetchImpl: async () => {
        called += 1;
        return new Response('{}');
      },
    });
    const result = resolveAnime('Solo Leveling');
    assert.equal(result.status, 'resolved');
    if (result.status !== 'resolved') return;
    assert.equal(await provider.getByCanonicalAnime(result.anime), null);
    assert.equal(called, 0);
  });

  test('valid response enriches resolved Solo Leveling without becoming the resolver', async () => {
    const provider = createMalMetadataProvider({
      clientId: 'test-client',
      fetchImpl: async (input) => {
        const url = String(input);
        assert.match(url, /\/anime\/52299/);
        assert.doesNotMatch(url, /[?&]q=/);
        return new Response(JSON.stringify(SOLO_LEVELING_MAL), { status: 200 });
      },
    });
    const result = resolveAnime('Solo Leveling');
    assert.equal(result.status, 'resolved');
    if (result.status !== 'resolved') return;
    const metadata = await provider.getByCanonicalAnime(result.anime);
    assert.equal(metadata?.malId, 52299);
    assert.equal(metadata?.score, 8.14);
    assert.equal(result.anime.slug, 'solo-leveling');
  });
});
