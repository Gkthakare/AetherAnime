import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { AETHERANIME_WORLD_SLUG, WORLD_REGISTRY } from '@/shared/world';

import {
  WORLD_IDENTITY_COPY,
  WORLD_IDENTITY_TAGLINE_SCALE,
  worldIdentityUserFacingSubtitle,
  worldIdentityUserFacingTagline,
} from './world-identity.constants';

const aether = WORLD_REGISTRY.find(
  (world) => world.slug === AETHERANIME_WORLD_SLUG,
);

describe('worldIdentityUserFacingTagline', () => {
  test('valid idle uses the invitation, not the registry operating-system tagline', () => {
    const tagline = worldIdentityUserFacingTagline({
      status: 'valid',
      registryTagline: aether?.tagline,
    });

    assert.equal(tagline, WORLD_IDENTITY_COPY.invitation);
    assert.match(tagline ?? '', /speak/i);
    assert.match(tagline ?? '', /type/i);
    assert.match(tagline ?? '', /title/i);
    assert.match(tagline ?? '', /likeness/i);
    assert.match(tagline ?? '', /feeling/i);
    assert.match(tagline ?? '', /saved/i);
    assert.doesNotMatch(tagline ?? '', /operating system/i);
    assert.doesNotMatch(tagline ?? '', /try /i);
    assert.doesNotMatch(tagline ?? '', /search/i);
    assert.doesNotMatch(tagline ?? '', /solo leveling/i);
  });

  test('explicit tagline override still wins', () => {
    assert.equal(
      worldIdentityUserFacingTagline({
        status: 'valid',
        registryTagline: aether?.tagline,
        taglineOverride: 'Threshold open',
      }),
      'Threshold open',
    );
  });

  test('unknown and coming-soon worlds do not show the ask invitation', () => {
    assert.equal(
      worldIdentityUserFacingTagline({ status: 'unknown' }),
      undefined,
    );
    assert.equal(
      worldIdentityUserFacingTagline({ status: 'comingSoon' }),
      undefined,
    );
  });
});

describe('worldIdentityUserFacingSubtitle', () => {
  test('valid worlds do not surface registry engineering description', () => {
    assert.equal(
      worldIdentityUserFacingSubtitle({
        status: 'valid',
        description: aether?.description,
      }),
      '',
    );
  });

  test('unknown and coming-soon keep their own descriptions', () => {
    assert.equal(
      worldIdentityUserFacingSubtitle({ status: 'unknown' }),
      WORLD_IDENTITY_COPY.unknownDescription,
    );
    assert.equal(
      worldIdentityUserFacingSubtitle({ status: 'comingSoon' }),
      WORLD_IDENTITY_COPY.comingSoonDescription,
    );
  });
});

describe('invitation presentation', () => {
  test('invitation type is readable sentence case, not tracked uppercase microcopy', () => {
    assert.doesNotMatch(WORLD_IDENTITY_TAGLINE_SCALE.invitation, /uppercase/);
    assert.match(WORLD_IDENTITY_TAGLINE_SCALE.invitation, /text-sm/);
  });
});

describe('world registry freeze', () => {
  test('internal AetherAnime registry tagline remains architectural', () => {
    assert.ok(aether);
    assert.match(aether?.tagline ?? '', /operating system/i);
  });
});
