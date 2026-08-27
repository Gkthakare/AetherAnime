import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import type { AnimeDiscoveryCandidate } from './anime.discovery';
import {
  buildAnimeSemanticProfile,
  contentTokensForLexical,
  explainSemanticMatch,
  isSemanticTag,
  normalizeSemanticToken,
  rankBySemanticPreference,
  rankDiscoveryByAskRelevance,
  scoreSemanticCandidate,
  SEMANTIC_TAGS,
} from './anime.semantic-profile';
import type { StructuredAnimeIntent } from './anime.semantic-intent';
import { retrieveForStructuredIntent } from './anime.semantic-intent';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

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

const SCHOOL_ROMANCE: AnimeDiscoveryCandidate = {
  malId: 4224,
  title: 'Toradora!',
  alternateTitle: null,
  year: 2008,
  type: 'tv',
  episodeCount: 25,
  status: 'finished',
  genres: ['Comedy', 'Romance', 'School'],
  studios: ['J.C.Staff'],
  synopsis: 'A soft-spoken boy and a fierce girl navigate high school misunderstandings.',
};

const WAR_DRAMA: AnimeDiscoveryCandidate = {
  malId: 10087,
  title: 'Fate/Zero',
  alternateTitle: null,
  year: 2011,
  type: 'tv',
  episodeCount: 25,
  status: 'finished',
  genres: ['Action', 'Fantasy', 'Drama'],
  studios: ['ufotable'],
  synopsis:
    'The war that precedes the war — ideals collide before the next generation inherits the night.',
};

const HUNTER_ASK =
  'anime about a hunter who becomes stronger through a mysterious system';

const HUNTER_INTENT: StructuredAnimeIntent = {
  type: 'recommend',
  title: null,
  seedTitle: null,
  constraints: {
    genres: [],
    themes: ['mysterious'],
    protagonistTraits: ['underdog'],
    tone: [],
  },
  exclusions: { watchlisted: false },
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

describe('TASK-080 lexical soft score and hunter fixture', () => {
  test('stopwords do not dominate content tokens', () => {
    const tokens = contentTokensForLexical(HUNTER_ASK);
    assert.ok(tokens.includes('hunter'));
    assert.ok(tokens.includes('mysterious'));
    assert.ok(tokens.includes('system'));
    assert.equal(tokens.includes('anime'), false);
    assert.equal(tokens.includes('about'), false);
    assert.equal(tokens.includes('who'), false);
    assert.equal(tokens.includes('becomes'), false);
    assert.equal(tokens.includes('stronger'), false);
  });

  test('tag evidence remains primary over lexical soft score', () => {
    const withAsk = scoreSemanticCandidate(HORROR, DARK_OP, HUNTER_ASK);
    const actionWithAsk = scoreSemanticCandidate(
      ACTION_FANTASY,
      DARK_OP,
      HUNTER_ASK,
    );
    assert.ok(withAsk.total > actionWithAsk.total);
  });

  test('deterministic fixture ranks Solo Leveling in top 3 for hunter ask', () => {
    const fixture = [
      SCHOOL_ROMANCE,
      COMEDY,
      WAR_DRAMA,
      ACTION_FANTASY,
    ];
    const ranked = rankBySemanticPreference(
      fixture,
      HUNTER_INTENT,
      null,
      HUNTER_ASK,
    );
    const index = ranked.findIndex((row) => row.malId === 52299);
    assert.ok(index >= 0 && index < 3, `Solo rank index=${index}`);
    assert.equal(ranked[0]?.malId, 52299);
  });

  test('semantic-unavailable safety net still ranks Solo via ask relevance', () => {
    const fixture = [SCHOOL_ROMANCE, COMEDY, WAR_DRAMA, ACTION_FANTASY];
    const ranked = rankDiscoveryByAskRelevance(fixture, HUNTER_ASK);
    const index = ranked.findIndex((row) => row.malId === 52299);
    assert.ok(index >= 0 && index < 3);
  });

  test('source has no hardcoded hunter-query to solo-leveling map', () => {
    const dir = dirname(fileURLToPath(import.meta.url));
    const profile = readFileSync(join(dir, 'anime.semantic-profile.ts'), 'utf8');
    const intent = readFileSync(join(dir, 'anime.semantic-intent.ts'), 'utf8');
    const blob = `${profile}\n${intent}`;
    assert.doesNotMatch(
      blob,
      /hunter who becomes stronger[\s\S]{0,80}solo-leveling|solo-leveling[\s\S]{0,80}hunter who becomes stronger/i,
    );
  });
});
