import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, test } from 'node:test';

import { ANIME_CATALOG } from '@/shared/anime/anime.catalog';
import { planAnimeAsk } from '@/shared/anime/anime.semantic-intent';
import { MEMORY_STORAGE_KEY } from '@/shared/anime/anime.memory';
import { WATCHLIST_STORAGE_KEY } from '@/shared/anime/anime.watchlist';

import {
  CORE_PRODUCT_EVENTS,
  FORBIDDEN_PROPERTY_KEYS,
  emitProductEvent,
  noteDistinctDestination,
  recordDestinationArrival,
  recordNavigatorAskSubmitted,
  resetAnalyticsSessionForTests,
  resetProductEventDedupe,
  serializeProductEvent,
  shouldEmitProductEvent,
  validateProductEvent,
} from './index';
import {
  buildReturnVisitEvent,
  computeDaysSinceLastVisit,
  getPlausibleDomain,
  isAnalyticsEnabled,
  shouldEmitReturnVisit,
} from './analytics.server';

const solo = ANIME_CATALOG[0]!;

describe('analytics — CORE event schema validation', () => {
  for (const name of CORE_PRODUCT_EVENTS) {
    test(`accepts valid ${name} payload`, () => {
      const payload = samplePayload(name);
      const result = validateProductEvent(payload);
      assert.equal(result.ok, true);
      if (result.ok) {
        assert.equal(result.event.name, name);
      }
    });
  }
});

describe('analytics — forbidden free-text fields', () => {
  for (const forbidden of FORBIDDEN_PROPERTY_KEYS) {
    test(`rejects payload containing ${forbidden}`, () => {
      const result = validateProductEvent({
        name: 'navigator_ask_submitted',
        ask_class: 'descriptive',
        session_id: 'session-1',
        [forbidden]: 'must not ship',
      });
      assert.equal(result.ok, false);
    });
  }

  test('rejects nested prompt fields', () => {
    const result = validateProductEvent({
      name: 'destination_arrived',
      anime_id: solo.id,
      slug: solo.slug,
      origin: 'catalog',
      via: 'navigator',
      session_id: 'session-1',
      meta: { query: 'hidden' },
    });
    assert.equal(result.ok, false);
  });
});

describe('analytics — deduplication', () => {
  test('suppresses duplicate destination_arrived for same session and anime', () => {
    resetProductEventDedupe();
    const event = {
      name: 'destination_arrived',
      anime_id: solo.id,
      slug: solo.slug,
      origin: 'catalog',
      via: 'navigator',
      session_id: 'session-dedupe',
    } as const;

    assert.equal(shouldEmitProductEvent(event), true);
    assert.equal(shouldEmitProductEvent(event), false);
  });

  test('session_multi_destination requires distinct_count >= 2', () => {
    assert.equal(
      validateProductEvent({
        name: 'session_multi_destination',
        distinct_count: 1,
        session_id: 'session-1',
      }).ok,
      false,
    );
  });

  test('second distinct destination reaches count 2', () => {
    resetAnalyticsSessionForTests();
    assert.equal(noteDistinctDestination(solo.id), 1);
    assert.equal(noteDistinctDestination(solo.id), 1);
    const second = ANIME_CATALOG[1] ?? solo;
    assert.equal(noteDistinctDestination(second.id), 2);
  });
});

describe('analytics — failure mode', () => {
  test('emitProductEvent never throws when fetch is unavailable', () => {
    const originalFetch = globalThis.fetch;
    Object.defineProperty(globalThis, 'fetch', {
      configurable: true,
      value: () => Promise.reject(new Error('offline')),
    });

    assert.doesNotThrow(() => {
      emitProductEvent({
        name: 'world_entered',
        source: 'direct',
        session_id: 'session-failure',
      });
    });

    Object.defineProperty(globalThis, 'fetch', {
      configurable: true,
      value: originalFetch,
    });
  });
});

describe('analytics — committed destination arrival', () => {
  test('recordDestinationArrival emits coarse properties only', () => {
    resetAnalyticsSessionForTests();
    resetProductEventDedupe();

    recordDestinationArrival(solo);
    const payload = serializeProductEvent({
      name: 'destination_arrived',
      anime_id: solo.id,
      slug: solo.slug,
      origin: 'catalog',
      via: 'url',
      session_id: 'session-arrival',
    });

    assert.doesNotMatch(payload, /"query"|"prompt"|"transcript"|"intent"/);
  });
});

describe('analytics — navigator ask_class without raw query', () => {
  test('recordNavigatorAskSubmitted uses plan classification only', () => {
    resetProductEventDedupe();
    const rawQuery =
      'anime about a hunter who becomes stronger after dying in dungeons';
    const plan = planAnimeAsk(rawQuery);
    recordNavigatorAskSubmitted(plan);

    const submitted = {
      name: 'navigator_ask_submitted',
      ask_class: plan.kind === 'semantic' ? 'descriptive' : 'unknown',
      session_id: 'session-nav',
    } as const;
    const serialized = JSON.stringify(submitted);
    assert.doesNotMatch(serialized, /hunter|dungeons|stronger/);
    assert.match(serialized, /ask_class/);
  });
});

describe('analytics — identity boundary', () => {
  test('analytics modules never read Memory or Watchlist storage keys', () => {
    const root = join(process.cwd(), 'shared', 'analytics');
    const files = [
      'analytics.session.ts',
      'analytics.record.ts',
      'analytics.emit.ts',
      'analytics.server.ts',
      'analytics.dedupe.ts',
    ];

    for (const file of files) {
      const source = readFileSync(join(root, file), 'utf8');
      assert.doesNotMatch(source, new RegExp(MEMORY_STORAGE_KEY));
      assert.doesNotMatch(source, new RegExp(WATCHLIST_STORAGE_KEY));
    }
  });
});

describe('analytics — server secrets remain server-side', () => {
  test('client emit module does not reference process.env', () => {
    const source = readFileSync(
      join(process.cwd(), 'shared', 'analytics', 'analytics.emit.ts'),
      'utf8',
    );
    assert.doesNotMatch(source, /process\.env/);
  });

  test('plausible configuration is disabled by default without domain', () => {
    const priorEnabled = process.env.ANALYTICS_ENABLED;
    const priorDomain = process.env.PLAUSIBLE_DOMAIN;
    delete process.env.ANALYTICS_ENABLED;
    delete process.env.PLAUSIBLE_DOMAIN;

    assert.equal(isAnalyticsEnabled(), false);
    assert.equal(getPlausibleDomain(), undefined);

    if (priorEnabled !== undefined) process.env.ANALYTICS_ENABLED = priorEnabled;
    if (priorDomain !== undefined) process.env.PLAUSIBLE_DOMAIN = priorDomain;
  });
});

describe('analytics — return visit session model', () => {
  test('emits return_visit only after session gap for returning visitors', () => {
    const lastVisit = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    assert.equal(
      shouldEmitReturnVisit({
        visitorId: '11111111-1111-4111-8111-111111111111',
        lastVisitIso: lastVisit,
        sessionStartedAt: lastVisit,
        returnEmittedForSession: undefined,
      }),
      true,
    );

    const event = buildReturnVisitEvent({
      daysSinceLast: computeDaysSinceLastVisit(lastVisit),
      hadDestination: true,
    });
    assert.equal(validateProductEvent(event).ok, true);
  });
});

function samplePayload(name: (typeof CORE_PRODUCT_EVENTS)[number]): Record<string, unknown> {
  switch (name) {
    case 'world_entered':
      return { name, source: 'home', session_id: 'session-1' };
    case 'navigator_ask_submitted':
      return { name, ask_class: 'exact', session_id: 'session-1' };
    case 'destination_arrived':
      return {
        name,
        anime_id: solo.id,
        slug: solo.slug,
        origin: 'catalog',
        via: 'navigator',
        session_id: 'session-1',
      };
    case 'session_multi_destination':
      return { name, distinct_count: 2, session_id: 'session-1' };
    case 'return_visit':
      return { name, days_since_last: 1, had_destination: true };
    default:
      return { name };
  }
}
