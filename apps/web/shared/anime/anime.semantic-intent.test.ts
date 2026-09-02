import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { parseAnimeIntent } from './anime.intent';
import {
  constraintQuery,
  createHttpSemanticIntentProvider,
  normalizeStructuredIntentPayload,
  planAnimeAsk,
  retrieveForStructuredIntent,
  validateStructuredAnimeIntent,
} from './anime.semantic-intent';
import type {
  SemanticIntentProvider,
  StructuredAnimeIntent,
} from './anime.semantic-intent';
import { normalizeVoiceQuery } from './anime.voice';
import { resolveAnime } from './anime.resolver';

function countingProvider(
  result: StructuredAnimeIntent | null,
): SemanticIntentProvider & { calls: number } {
  const provider = {
    calls: 0,
    async parseIntent() {
      provider.calls += 1;
      return result;
    },
  };
  return provider;
}

const DARK_RECOMMEND: StructuredAnimeIntent = {
  type: 'recommend',
  title: null,
  seedTitle: null,
  constraints: {
    genres: [],
    themes: [],
    protagonistTraits: ['overpowered'],
    tone: ['dark'],
  },
  exclusions: { watchlisted: false },
};

describe('planAnimeAsk — deterministic first', () => {
  test('Solo Leveling arrives locally with zero LLM need', () => {
    const plan = planAnimeAsk('Solo Leveling');
    assert.equal(plan.kind, 'arrive');
    if (plan.kind === 'arrive') {
      assert.equal(plan.anime.slug, 'solo-leveling');
    }
    assert.equal(plan.llmCalls, 0);
  });

  test('Take me to Solo Leveling still uses the local resolver', () => {
    const plan = planAnimeAsk(
      normalizeVoiceQuery('Take me to Solo Leveling'),
    );
    assert.equal(plan.kind, 'arrive');
    assert.equal(plan.llmCalls, 0);
  });

  test('Show me Jujutsu Kaisen uses discovery, not the LLM', () => {
    const plan = planAnimeAsk(
      normalizeVoiceQuery('Show me Jujutsu Kaisen'),
    );
    assert.equal(plan.kind, 'discover');
    assert.equal(plan.llmCalls, 0);
    if (plan.kind === 'discover') {
      assert.deepEqual(plan.lookup, {
        kind: 'search',
        query: 'Jujutsu Kaisen',
      });
    }
  });

  test('something like Solo Leveling stays on the existing similar path', () => {
    const plan = planAnimeAsk('something like Solo Leveling');
    assert.equal(plan.kind, 'discover');
    assert.equal(plan.llmCalls, 0);
    if (plan.kind === 'discover') {
      assert.deepEqual(plan.lookup, {
        kind: 'similar',
        slug: 'solo-leveling',
      });
    }
  });

  test('Fate remains locally ambiguous with zero LLM calls', () => {
    const plan = planAnimeAsk(normalizeVoiceQuery('Take me to Fate'));
    assert.equal(plan.kind, 'ambiguous');
    assert.equal(plan.llmCalls, 0);
    const resolved = resolveAnime('Fate');
    assert.equal(resolved.status, 'ambiguous');
  });

  test('completely unknown anime can still use discovery without an LLM', () => {
    const plan = planAnimeAsk('completely unknown anime');
    assert.equal(plan.kind, 'discover');
    assert.equal(plan.llmCalls, 0);
  });

  test('watchlist exclusion is deterministic', () => {
    const plan = planAnimeAsk(
      normalizeVoiceQuery("Show me something I haven't saved yet"),
    );
    assert.equal(plan.kind, 'filter');
    assert.equal(plan.llmCalls, 0);
    if (plan.kind === 'filter') {
      assert.equal(plan.exclusions.watchlisted, true);
    }
  });

  test('dark OP request requires one semantic call', () => {
    const plan = planAnimeAsk(
      'I want something dark with an overpowered protagonist',
    );
    assert.equal(plan.kind, 'semantic');
    assert.equal(plan.llmCalls, 1);
  });

  test('plot-shaped hunter ask routes to semantic, not title navigate', () => {
    const plan = planAnimeAsk(
      'anime about a hunter who becomes stronger through a mysterious system',
    );
    assert.equal(plan.kind, 'semantic');
    assert.equal(plan.llmCalls, 1);
    if (plan.kind === 'semantic') {
      assert.match(plan.input, /hunter/i);
    }
  });

  test('exact title Solo Leveling still arrives without semantic', () => {
    const plan = planAnimeAsk('Solo Leveling');
    assert.equal(plan.kind, 'arrive');
    assert.equal(plan.llmCalls, 0);
  });

  test('similar with a modifier requires one semantic call', () => {
    const plan = planAnimeAsk('something like Fate Zero but darker');
    assert.equal(plan.kind, 'semantic');
    assert.equal(plan.llmCalls, 1);
  });

  test('voice and typing share planAnimeAsk', () => {
    const typed = planAnimeAsk(
      'I want something dark with an overpowered protagonist',
    );
    const spoken = planAnimeAsk(
      normalizeVoiceQuery(
        'I want something dark with an overpowered protagonist',
      ),
    );
    assert.deepEqual(typed, spoken);
    assert.equal(parseAnimeIntent('Solo Leveling').kind, 'navigate');
  });
});

describe('validateStructuredAnimeIntent', () => {
  test('accepts a bounded recommend intent', () => {
    assert.deepEqual(
      validateStructuredAnimeIntent(DARK_RECOMMEND),
      DARK_RECOMMEND,
    );
  });

  test('malformed output fails safely', () => {
    assert.equal(validateStructuredAnimeIntent(null), null);
    assert.equal(validateStructuredAnimeIntent('recommend'), null);
    assert.equal(validateStructuredAnimeIntent({ type: 'agent' }), null);
  });

  test('normalizes common provider quirks before validation', () => {
    assert.deepEqual(
      validateStructuredAnimeIntent(
        normalizeStructuredIntentPayload({
          type: 'recommend',
          title: null,
          seedTitle: '',
          constraints: {
            genres: [],
            themes: ['mysterious'],
            protagonistTraits: ['becomes increasingly powerful'],
            tone: 'intense and adventurous',
          },
          exclusions: { watchlisted: false },
        }),
      ),
      {
        type: 'recommend',
        title: null,
        seedTitle: null,
        constraints: {
          genres: [],
          themes: ['mysterious'],
          protagonistTraits: ['becomes increasingly powerful'],
          tone: ['intense and adventurous'],
        },
        exclusions: { watchlisted: false },
      },
    );
  });

  test('unknown fields are rejected', () => {
    assert.equal(
      validateStructuredAnimeIntent({ ...DARK_RECOMMEND, url: 'https://evil.example' }),
      null,
    );
    assert.equal(
      validateStructuredAnimeIntent({
        ...DARK_RECOMMEND,
        titles: ['Attack on Titan'],
      }),
      null,
    );
  });

  test('model cannot smuggle a URL or Watch Now link', () => {
    assert.equal(
      validateStructuredAnimeIntent({
        ...DARK_RECOMMEND,
        title: 'https://malicious.example/watch',
      }),
      null,
    );
    assert.equal(
      validateStructuredAnimeIntent({
        type: 'navigate',
        title: 'javascript:alert(1)',
        seedTitle: null,
        constraints: DARK_RECOMMEND.constraints,
        exclusions: { watchlisted: false },
      }),
      null,
    );
  });
});

describe('semantic provider call budget', () => {
  test('direct and known queries never invoke the provider', async () => {
    const provider = countingProvider(DARK_RECOMMEND);
    const plan = planAnimeAsk('Solo Leveling');
    assert.equal(plan.llmCalls, 0);
    assert.equal(provider.calls, 0);
  });

  test('semantic query invokes the provider exactly once', async () => {
    const provider = countingProvider(DARK_RECOMMEND);
    const plan = planAnimeAsk(
      'I want something dark with an overpowered protagonist',
    );
    assert.equal(plan.kind, 'semantic');
    if (plan.kind !== 'semantic') return;
    const first = await provider.parseIntent(plan.input);
    const second = await provider.parseIntent(plan.input);
    assert.deepEqual(first, DARK_RECOMMEND);
    assert.deepEqual(second, DARK_RECOMMEND);
    assert.equal(provider.calls, 2);
  });

  test('unavailable provider fails safely', async () => {
    const provider = countingProvider(null);
    const intent = await provider.parseIntent(
      'I want something dark with an overpowered protagonist',
    );
    assert.equal(intent, null);
    assert.equal(provider.calls, 1);
  });

  test('HTTP provider skips the network without credentials', async () => {
    let called = 0;
    const provider = createHttpSemanticIntentProvider({
      apiKey: '',
      baseUrl: 'https://example.invalid/v1',
      model: 'test-model',
      fetchImpl: async () => {
        called += 1;
        return new Response('{}');
      },
    });
    assert.equal(await provider.parseIntent('dark anime'), null);
    assert.equal(called, 0);
  });

  test('HTTP provider timeout fails safely', async () => {
    const provider = createHttpSemanticIntentProvider({
      apiKey: 'test-key',
      baseUrl: 'https://example.invalid/v1',
      model: 'test-model',
      fetchImpl: async () => {
        throw new Error('timeout');
      },
    });
    assert.equal(await provider.parseIntent('dark anime'), null);
  });

  test('HTTP provider malformed JSON fails safely', async () => {
    const provider = createHttpSemanticIntentProvider({
      apiKey: 'test-key',
      baseUrl: 'https://example.invalid/v1',
      model: 'test-model',
      fetchImpl: async () =>
        new Response(JSON.stringify({ choices: [{ message: { content: 'nope' } }] }), {
          status: 200,
        }),
    });
    assert.equal(await provider.parseIntent('dark anime'), null);
  });

  test('HTTP provider prefers max_completion_tokens for newer chat models', async () => {
    let limitUsed: string | null = null;
    const provider = createHttpSemanticIntentProvider({
      apiKey: 'test-key',
      baseUrl: 'https://example.invalid/v1',
      model: 'gpt-new',
      fetchImpl: async (_url, init) => {
        const body = JSON.parse(String(init?.body)) as Record<string, unknown>;
        if ('max_completion_tokens' in body) limitUsed = 'max_completion_tokens';
        if ('max_tokens' in body) limitUsed = 'max_tokens';
        return new Response(
          JSON.stringify({
            choices: [{ message: { content: JSON.stringify(DARK_RECOMMEND) } }],
          }),
          { status: 200 },
        );
      },
    });
    assert.deepEqual(await provider.parseIntent('dark anime'), DARK_RECOMMEND);
    assert.equal(limitUsed, 'max_completion_tokens');
  });

  test('HTTP provider retries max_tokens when max_completion_tokens is rejected', async () => {
    let calls = 0;
    let retriedWith: string | null = null;
    const provider = createHttpSemanticIntentProvider({
      apiKey: 'test-key',
      baseUrl: 'https://example.invalid/v1',
      model: 'gpt-legacy',
      fetchImpl: async (_url, init) => {
        calls += 1;
        const body = JSON.parse(String(init?.body)) as Record<string, unknown>;
        if ('max_completion_tokens' in body) {
          return new Response(
            JSON.stringify({
              error: {
                type: 'invalid_request_error',
                code: 'unsupported_parameter',
                param: 'max_completion_tokens',
              },
            }),
            { status: 400 },
          );
        }
        retriedWith = 'max_tokens' in body ? 'max_tokens' : 'unknown';
        return new Response(
          JSON.stringify({
            choices: [{ message: { content: JSON.stringify(DARK_RECOMMEND) } }],
          }),
          { status: 200 },
        );
      },
    });
    assert.deepEqual(await provider.parseIntent('dark anime'), DARK_RECOMMEND);
    assert.equal(calls, 2);
    assert.equal(retriedWith, 'max_tokens');
  });

  test('HTTP provider retries without temperature when temperature 0 is rejected', async () => {
    let calls = 0;
    let secondHadTemperature = false;
    const provider = createHttpSemanticIntentProvider({
      apiKey: 'test-key',
      baseUrl: 'https://example.invalid/v1',
      model: 'gpt-reasoning',
      fetchImpl: async (_url, init) => {
        calls += 1;
        const body = JSON.parse(String(init?.body)) as Record<string, unknown>;
        if ('temperature' in body) {
          return new Response(
            JSON.stringify({
              error: {
                type: 'invalid_request_error',
                code: 'unsupported_value',
                param: 'temperature',
              },
            }),
            { status: 400 },
          );
        }
        secondHadTemperature = 'temperature' in body;
        return new Response(
          JSON.stringify({
            choices: [{ message: { content: JSON.stringify(DARK_RECOMMEND) } }],
          }),
          { status: 200 },
        );
      },
    });
    assert.deepEqual(await provider.parseIntent('dark anime'), DARK_RECOMMEND);
    assert.equal(calls, 2);
    assert.equal(secondHadTemperature, false);
  });
});

describe('constraintQuery', () => {
  test('includes protagonistTraits with tone, themes, and genres', () => {
    assert.equal(
      constraintQuery({
        type: 'recommend',
        title: null,
        seedTitle: null,
        constraints: {
          genres: ['Action'],
          themes: ['psychological'],
          protagonistTraits: ['overpowered'],
          tone: ['dark'],
        },
        exclusions: { watchlisted: false },
      }),
      'dark psychological overpowered Action',
    );
  });

  test('traits-only intents still produce a retrieval query', () => {
    assert.equal(
      constraintQuery({
        type: 'recommend',
        title: null,
        seedTitle: null,
        constraints: {
          genres: [],
          themes: [],
          protagonistTraits: ['overpowered'],
          tone: [],
        },
        exclusions: { watchlisted: false },
      }),
      'overpowered',
    );
  });
});

describe('retrieveForStructuredIntent', () => {
  test('does not let intent titles become arrivals', async () => {
    const candidates = await retrieveForStructuredIntent(
      {
        type: 'recommend',
        title: 'Attack on Titan',
        seedTitle: null,
        constraints: DARK_RECOMMEND.constraints,
        exclusions: { watchlisted: false },
      },
      {
        searchByTitle: async () => [],
        getSimilarByCanonicalAnime: async () => [],
      },
    );
    assert.equal(
      candidates.some((candidate) => candidate.title === 'Attack on Titan'),
      false,
    );
  });

  test('seed similar uses application retrieval, not model titles', async () => {
    const candidates = await retrieveForStructuredIntent(
      {
        type: 'recommend',
        title: null,
        seedTitle: 'Fate Zero',
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
          throw new Error('search should not run when the seed resolves');
        },
        getSimilarByCanonicalAnime: async (anime) => {
          assert.equal(anime.slug, 'fate-zero');
          return [
            {
              malId: 10087,
              title: 'Fate/Zero',
              alternateTitle: null,
              year: 2011,
              type: 'tv',
              episodeCount: 25,
              status: 'finished',
              genres: ['Action', 'Fantasy', 'Drama'],
              studios: ['ufotable'],
            },
            {
              malId: 40748,
              title: 'Jujutsu Kaisen',
              alternateTitle: null,
              year: 2020,
              type: 'tv',
              episodeCount: 24,
              status: 'finished',
              genres: ['Action'],
              studios: ['MAPPA'],
            },
          ];
        },
      },
    );
    assert.equal(candidates[0]?.title, 'Jujutsu Kaisen');
    assert.equal(
      candidates.some((candidate) => candidate.malId === 10087),
      false,
    );
  });

  test('watchlist exclusion filters after retrieval', async () => {
    const candidates = await retrieveForStructuredIntent(
      {
        type: 'filter',
        title: null,
        seedTitle: null,
        constraints: {
          genres: [],
          themes: [],
          protagonistTraits: [],
          tone: [],
        },
        exclusions: { watchlisted: true },
      },
      {
        searchByTitle: async () => [],
        getSimilarByCanonicalAnime: async () => [],
        watchlistedSlugs: ['solo-leveling'],
      },
    );
    assert.ok(candidates.length > 0);
    assert.equal(
      candidates.some((candidate) => candidate.title === 'Solo Leveling'),
      false,
    );
  });

  test('navigate intent with a resolved catalog title pins that anime first', async () => {
    const candidates = await retrieveForStructuredIntent(
      {
        type: 'navigate',
        title: 'Solo Leveling',
        seedTitle: 'Solo Leveling',
        constraints: {
          genres: ['action', 'fantasy'],
          themes: ['hunters'],
          protagonistTraits: ['determined'],
          tone: ['intense'],
        },
        exclusions: { watchlisted: false },
      },
      {
        searchByTitle: async () => [],
        getSimilarByCanonicalAnime: async () => {
          throw new Error('similar lookup must not run for resolved navigate');
        },
      },
    );
    assert.equal(candidates[0]?.title, 'Solo Leveling');
  });
});
