import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { ANIME_CATALOG } from '@/shared/anime/anime.catalog';

import {
  buildPlausibleForwardHeaders,
  plausibleEventUrl,
  plausibleProps,
  resolvePlausibleVisitorTransport,
} from './analytics.server';
import { validateProductEvent } from './analytics.validate';

const solo = ANIME_CATALOG[0]!;

describe('analytics — Plausible visitor transport', () => {
  test('forwards browser User-Agent as HTTP header only', () => {
    const transport = resolvePlausibleVisitorTransport({
      userAgent: 'Mozilla/5.0 Chrome/120.0.0.0',
      forwardedFor: '203.0.113.10, 10.0.0.1',
    });

    const headers = buildPlausibleForwardHeaders(transport);
    assert.equal(headers['User-Agent'], 'Mozilla/5.0 Chrome/120.0.0.0');
    assert.equal(headers['X-Forwarded-For'], '203.0.113.10');
    assert.equal(headers['Content-Type'], 'application/json');
  });

  test('uses first valid IP from X-Forwarded-For chain', () => {
    const transport = resolvePlausibleVisitorTransport({
      userAgent: 'Mozilla/5.0',
      forwardedFor: ' 198.51.100.4 , 10.0.0.1 ',
    });
    assert.equal(transport.forwardedFor, '198.51.100.4');
  });

  test('falls back to x-real-ip when x-forwarded-for is absent', () => {
    const transport = resolvePlausibleVisitorTransport({
      userAgent: 'Mozilla/5.0',
      forwardedFor: null,
      realIp: '203.0.113.55',
    });
    assert.equal(transport.forwardedFor, '203.0.113.55');
  });

  test('does not place IP or User-Agent into event props', () => {
    const event = {
      name: 'navigator_ask_submitted',
      ask_class: 'exact',
      session_id: 'session-transport',
    } as const;

    const props = plausibleProps(event);
    assert.equal('user_agent' in props, false);
    assert.equal('ip' in props, false);
    assert.equal('User-Agent' in props, false);
    assert.equal(validateProductEvent({ ...event, user_agent: 'hidden' }).ok, false);
    assert.equal(validateProductEvent({ ...event, ip: '127.0.0.1' }).ok, false);
  });
});

describe('analytics — Plausible page URL', () => {
  test('uses world page URLs instead of /api/events', () => {
    assert.equal(
      plausibleEventUrl(
        { name: 'world_entered', source: 'home', session_id: 's1' },
        'aetheranime.com',
      ),
      'https://aetheranime.com/world/aetheranime',
    );
    assert.equal(
      plausibleEventUrl(
        {
          name: 'destination_arrived',
          anime_id: solo.id,
          slug: solo.slug,
          origin: 'catalog',
          via: 'navigator',
          session_id: 's1',
        },
        'aetheranime.com',
      ),
      `https://aetheranime.com/world/aetheranime?anime=${encodeURIComponent(solo.slug)}`,
    );
    assert.doesNotMatch(
      plausibleEventUrl(
        { name: 'navigator_ask_submitted', ask_class: 'descriptive', session_id: 's1' },
        'aetheranime.com',
      ),
      /\/api\/events/,
    );
  });

  test('event names remain unchanged in props payload', () => {
    const event = {
      name: 'destination_arrived',
      anime_id: solo.id,
      slug: solo.slug,
      origin: 'catalog',
      via: 'navigator',
      session_id: 's1',
    } as const;
    const props = plausibleProps(event);
    assert.equal(props.anime_id, solo.id);
    assert.equal(props.slug, solo.slug);
    assert.equal('name' in props, false);
  });
});

describe('analytics — Plausible dropped response handling', () => {
  test('forwards visitor metadata and page URL to Plausible request body', async () => {
    const originalFetch = globalThis.fetch;
    let capturedInit: RequestInit | undefined;
    Object.defineProperty(globalThis, 'fetch', {
      configurable: true,
      value: async (_url: string, init?: RequestInit) => {
        capturedInit = init;
        return new Response('{}', { status: 202 });
      },
    });

    const priorEnabled = process.env.ANALYTICS_ENABLED;
    const priorDomain = process.env.PLAUSIBLE_DOMAIN;
    process.env.ANALYTICS_ENABLED = 'true';
    process.env.PLAUSIBLE_DOMAIN = 'aetheranime.com';

    const { forwardProductEventToPlausible } = await import('./analytics.server');
    await forwardProductEventToPlausible(
      {
        name: 'destination_arrived',
        anime_id: solo.id,
        slug: solo.slug,
        origin: 'catalog',
        via: 'navigator',
        session_id: 'forward-body',
      },
      { userAgent: 'Mozilla/5.0 Chrome/120', forwardedFor: '203.0.113.10' },
    );

    assert.ok(capturedInit);
    const headers = capturedInit!.headers as Record<string, string>;
    assert.equal(headers['User-Agent'], 'Mozilla/5.0 Chrome/120');
    assert.equal(headers['X-Forwarded-For'], '203.0.113.10');

    const body = JSON.parse(String(capturedInit!.body));
    assert.equal(body.name, 'destination_arrived');
    assert.equal(
      body.url,
      `https://aetheranime.com/world/aetheranime?anime=${encodeURIComponent(solo.slug)}`,
    );
    assert.doesNotMatch(body.url, /\/api\/events/);

    Object.defineProperty(globalThis, 'fetch', {
      configurable: true,
      value: originalFetch,
    });
    if (priorEnabled !== undefined) process.env.ANALYTICS_ENABLED = priorEnabled;
    else delete process.env.ANALYTICS_ENABLED;
    if (priorDomain !== undefined) process.env.PLAUSIBLE_DOMAIN = priorDomain;
    else delete process.env.PLAUSIBLE_DOMAIN;
  });

  test('forwardProductEventToPlausible reports dropped events safely', async () => {
    const originalFetch = globalThis.fetch;
    Object.defineProperty(globalThis, 'fetch', {
      configurable: true,
      value: async () =>
        new Response('{}', {
          status: 202,
          headers: { 'x-plausible-dropped': '1' },
        }),
    });

    const priorEnabled = process.env.ANALYTICS_ENABLED;
    const priorDomain = process.env.PLAUSIBLE_DOMAIN;
    process.env.ANALYTICS_ENABLED = 'true';
    process.env.PLAUSIBLE_DOMAIN = 'aetheranime.com';

    const { forwardProductEventToPlausible } = await import('./analytics.server');
    const result = await forwardProductEventToPlausible(
      { name: 'world_entered', source: 'direct', session_id: 'drop-test' },
      { userAgent: 'Mozilla/5.0', forwardedFor: '203.0.113.10' },
    );

    assert.equal(result.dropped, true);
    assert.equal(result.recorded, false);
    assert.equal(result.status, 202);

    Object.defineProperty(globalThis, 'fetch', {
      configurable: true,
      value: originalFetch,
    });
    if (priorEnabled !== undefined) process.env.ANALYTICS_ENABLED = priorEnabled;
    else delete process.env.ANALYTICS_ENABLED;
    if (priorDomain !== undefined) process.env.PLAUSIBLE_DOMAIN = priorDomain;
    else delete process.env.PLAUSIBLE_DOMAIN;
  });

  test('analytics failure remains non-blocking for route consumers', async () => {
    const originalFetch = globalThis.fetch;
    Object.defineProperty(globalThis, 'fetch', {
      configurable: true,
      value: () => Promise.reject(new Error('network down')),
    });

    const priorEnabled = process.env.ANALYTICS_ENABLED;
    const priorDomain = process.env.PLAUSIBLE_DOMAIN;
    process.env.ANALYTICS_ENABLED = 'true';
    process.env.PLAUSIBLE_DOMAIN = 'aetheranime.com';

    const { forwardProductEventToPlausible } = await import('./analytics.server');
    const result = await forwardProductEventToPlausible(
      { name: 'world_entered', source: 'direct', session_id: 'fail-test' },
      { userAgent: 'Mozilla/5.0', forwardedFor: '203.0.113.10' },
    );

    assert.equal(result.recorded, false);
    assert.equal(result.dropped, false);
    assert.equal(result.status, 0);

    Object.defineProperty(globalThis, 'fetch', {
      configurable: true,
      value: originalFetch,
    });
    if (priorEnabled !== undefined) process.env.ANALYTICS_ENABLED = priorEnabled;
    else delete process.env.ANALYTICS_ENABLED;
    if (priorDomain !== undefined) process.env.PLAUSIBLE_DOMAIN = priorDomain;
    else delete process.env.PLAUSIBLE_DOMAIN;
  });
});
