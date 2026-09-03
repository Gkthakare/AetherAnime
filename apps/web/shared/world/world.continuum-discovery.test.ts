import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import type { CanonicalAnime } from '../anime/anime.types';

import { AETHERANIME_REGION_CONTINUUM_ID } from './world.region.constants';
import {
  CONTINUUM_DISCOVERY_MAX,
  isContinuumDiscoveryRegion,
  resolveContinuumDiscoveryCandidates,
} from './world.continuum-discovery';

describe('continuum discovery data', () => {
  test('Continuum region id is the discovery landmark', () => {
    assert.equal(isContinuumDiscoveryRegion(AETHERANIME_REGION_CONTINUUM_ID), true);
    assert.equal(isContinuumDiscoveryRegion('thresholds-ahead'), false);
    assert.equal(isContinuumDiscoveryRegion(null), false);
  });

  test('returns a small curated set from the existing catalog contract', () => {
    const candidates = resolveContinuumDiscoveryCandidates();
    assert.ok(candidates.length >= 1);
    assert.ok(candidates.length <= CONTINUUM_DISCOVERY_MAX);
  });

  test('every candidate is a valid CanonicalAnime from catalog', () => {
    for (const anime of resolveContinuumDiscoveryCandidates()) {
      assert.ok(anime.id.startsWith('anime.'));
      assert.ok(anime.slug.length > 0);
      assert.ok(anime.canonicalTitle.length > 0);
      assert.ok(anime.poster != null && anime.poster.startsWith('/assets/'));
    }
  });

  test('primary candidate is first in the ordered set', () => {
    const [primary] = resolveContinuumDiscoveryCandidates();
    assert.ok(primary);
    assert.equal(primary.slug, 'solo-leveling');
  });

  test('does not invent slugs outside catalog', () => {
    const slugs = resolveContinuumDiscoveryCandidates().map(
      (anime: CanonicalAnime) => anime.slug,
    );
    for (const slug of slugs) {
      assert.match(slug, /^[a-z0-9-]+$/);
      assert.notEqual(slug, 'discovered-40748');
    }
  });
});
