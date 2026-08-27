import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import type { AnimeDiscoveryCandidate } from './anime.discovery';
import {
  buildAnimeSemanticProfile,
  explainSemanticMatch,
  isSemanticTag,
  normalizeSemanticToken,
  scoreSemanticCandidate,
  SEMANTIC_TAGS,
} from './anime.semantic-profile';
import type { StructuredAnimeIntent } from './anime.semantic-intent';
import { retrieveForStructuredIntent } from './anime.semantic-intent';

const HORROR: AnimeDiscoveryCandidate = {
  malId: 19,
  title: 'Monster',
  alternateTitle: null,
  year: 2004,
  type: 'tv',
  episodeCount: 74,
  status: 'finished',
  genres: ['Drama', 'Horror', 'Mystery', 'Psychological'],
  studios: ['Madhouse'],
  synopsis:
    'A brilliant surgeon ruins his career after saving a boy who later becomes a killer.',
};

const ACTION_FANTASY: AnimeDiscoveryCandidate = {
  malId: 52299,
  title: 'Solo Leveling',
  alternateTitle: null,
  year: 2024,
  type: 'tv',
  episodeCount: 12,
  status: 'finished',
  genres: ['Action', 'Fantasy'],
  studios: ['A-1 Pictures'],
  synopsis:
    'A hunter the world ranked weakest is called into a climbing that only answers those who keep going alone.',
};

const COMEDY: AnimeDiscoveryCandidate = {
  malId: 918,
  title: 'Gintama',
  alternateTitle: null,
  year: 2006,
  type: 'tv',
  episodeCount: 201,
  status: 'finished',
  genres: ['Action', 'Comedy', 'Sci-Fi'],
  studios: ['Sunrise'],
  synopsis: 'Odd jobs and jokes in an occupied Edo.',
};

const DARK_OP: StructuredAnimeIntent = {
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
};

describe('semantic taxonomy', () => {
  test('accepts bounded tags and rejects invented ones', () => {
    assert.equal(isSemanticTag('dark'), true);
    assert.equal(isSemanticTag('psychological'), true);
    assert.equal(isSemanticTag('overpowered'), true);
    assert.equal(isSemanticTag('cyberpunk-slice'), false);
    assert.equal(SEMANTIC_TAGS.length, 19);
    assert.deepEqual([...SEMANTIC_TAGS], [
      'dark',
      'lighthearted',
      'wholesome',
      'tragic',
      'comedic',
      'intense',
      'mysterious',
      'psychological',
      'supernatural',
      'revenge',
      'romance',
      'war',
      'isekai',
      'school',
      'overpowered',
      'underdog',
      'strategic',
      'antihero',
      'action-heavy',
    ]);
  });

  test('normalizes a bounded synonym table', () => {
    assert.equal(normalizeSemanticToken('grim'), 'dark');
    assert.equal(normalizeSemanticToken('OP'), 'overpowered');
    assert.equal(normalizeSemanticToken('broken protagonist'), 'overpowered');
    assert.equal(normalizeSemanticToken('feel-good'), 'wholesome');
    assert.equal(normalizeSemanticToken('https://evil.example'), null);
  });
});

describe('AnimeSemanticProfile', () => {
  test('maps MAL genres conservatively', () => {
    const profile = buildAnimeSemanticProfile(HORROR);
    const tags = profile.evidence.map((entry) => entry.tag);
    assert.ok(tags.includes('dark'));
    assert.ok(tags.includes('psychological'));
    assert.ok(tags.includes('mysterious'));
    assert.equal(tags.includes('overpowered'), false);
    assert.equal(
      profile.evidence.find((entry) => entry.tag === 'dark')?.provenance,
      'explicit',
    );
  });

  test('does not treat Action or Fantasy as dark', () => {
    const profile = buildAnimeSemanticProfile(ACTION_FANTASY);
    assert.equal(
      profile.evidence.some((entry) => entry.tag === 'dark'),
      false,
    );
  });

  test('synopsis can only contribute derived bounded signals', () => {
    const profile = buildAnimeSemanticProfile(ACTION_FANTASY);
    const underdog = profile.evidence.find((entry) => entry.tag === 'underdog');
    assert.equal(underdog?.provenance, 'derived');
    assert.equal(underdog?.source, 'synopsis');
  });
});

describe('semantic scoring', () => {
  test('exact semantic match ranks above unknown evidence', () => {
    const horror = scoreSemanticCandidate(HORROR, DARK_OP);
    const action = scoreSemanticCandidate(ACTION_FANTASY, DARK_OP);
    assert.ok(horror.total > action.total);
    assert.equal(
      horror.judgements.find((item) => item.tag === 'dark')?.kind,
      'match',
    );
    assert.equal(
      action.judgements.find((item) => item.tag === 'dark')?.kind,
      'unknown',
    );
  });

  test('unknown is not a contradiction', () => {
    const scored = scoreSemanticCandidate(ACTION_FANTASY, DARK_OP);
    assert.equal(
      scored.judgements.some((item) => item.kind === 'contradiction'),
      false,
    );
    assert.equal(
      scored.judgements.find((item) => item.tag === 'overpowered')?.kind,
      'unknown',
    );
  });

  test('horror contradicts a wholesome request', () => {
    const scored = scoreSemanticCandidate(HORROR, {
      ...DARK_OP,
      constraints: {
        genres: [],
        themes: [],
        protagonistTraits: [],
        tone: ['wholesome'],
      },
    });
    assert.equal(
      scored.judgements.find((item) => item.tag === 'wholesome')?.kind,
      'contradiction',
    );
    assert.ok(scored.total < 0);
  });

  test('explanations are human-readable and cannot carry URLs', () => {
    const scored = scoreSemanticCandidate(HORROR, DARK_OP);
    const reason = explainSemanticMatch(scored);
    assert.match(reason ?? '', /Dark|Psychological/);
    assert.doesNotMatch(reason ?? '', /https?:|94%|AI thinks/i);
  });
});

describe('retrieveForStructuredIntent uses semantic ranking', () => {
  test('dark request orders horror above unsupported action fantasy', async () => {
    const ranked = await retrieveForStructuredIntent(DARK_OP, {
      searchByTitle: async () => [ACTION_FANTASY, HORROR, COMEDY],
      getSimilarByCanonicalAnime: async () => [],
    });
    assert.equal(ranked[0]?.malId, 19);
    assert.notEqual(ranked[0]?.malId, ranked[1]?.malId);
  });

  test('seed similar still excludes the seed and applies dark ranking', async () => {
    const ranked = await retrieveForStructuredIntent(
      {
        type: 'recommend',
        title: null,
        seedTitle: 'Solo Leveling',
        constraints: {
          genres: [],
          themes: [],
          protagonistTraits: [],
          tone: ['dark'],
        },
        exclusions: { watchlisted: false },
      },
      {
        searchByTitle: async () => {
          throw new Error('search should not run');
        },
        getSimilarByCanonicalAnime: async (anime) => {
          assert.equal(anime.slug, 'solo-leveling');
          return [ACTION_FANTASY, HORROR];
        },
      },
    );
    assert.equal(
      ranked.some((candidate) => candidate.malId === 52299),
      false,
    );
    assert.equal(ranked[0]?.malId, 19);
  });
});
