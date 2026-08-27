import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { matchesWorldHref, worldHref } from './world-transition';

describe('worldHref anime query', () => {
  test('writes ?anime= for an anime slug and omits region', () => {
    assert.equal(
      worldHref({ worldSlug: 'aetheranime', animeSlug: 'solo-leveling' }),
      '/world/aetheranime?anime=solo-leveling',
    );
  });

  test('keeps region query when no anime slug is present', () => {
    assert.equal(
      worldHref({ worldSlug: 'aetheranime', regionId: 'world-continuum' }),
      '/world/aetheranime?region=world-continuum',
    );
  });

  test('treats anime and region as mutually exclusive — anime wins on write', () => {
    assert.equal(
      worldHref({
        worldSlug: 'aetheranime',
        regionId: 'world-continuum',
        animeSlug: 'solo-leveling',
      }),
      '/world/aetheranime?anime=solo-leveling',
    );
  });

  test('same anime href matches; a different anime href does not', () => {
    const current = 'https://aether.local/world/aetheranime?anime=solo-leveling';
    assert.equal(
      matchesWorldHref(current, '/world/aetheranime?anime=solo-leveling'),
      true,
    );
    assert.equal(
      matchesWorldHref(current, '/world/aetheranime?anime=fate-zero'),
      false,
    );
  });

  test('discovered watchlist slugs write the existing anime query', () => {
    assert.equal(
      worldHref({ worldSlug: 'aetheranime', animeSlug: 'discovered-40748' }),
      '/world/aetheranime?anime=discovered-40748',
    );
  });

  test('anime href does not match a region href on the same world', () => {
    assert.equal(
      matchesWorldHref(
        'https://aether.local/world/aetheranime?anime=solo-leveling',
        '/world/aetheranime?region=world-continuum',
      ),
      false,
    );
  });
});
