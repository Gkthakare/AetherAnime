import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { REGION_IDENTITY_COPY } from '@/widgets/region-identity/region-identity.constants';
import { WORLD_IDENTITY_COPY } from '@/widgets/world-identity/world-identity.constants';
import { WORLD_NAVIGATOR_COPY } from '@/widgets/world-navigator/world-navigator.constants';

import { HERO_COPY, HERO_TITLE_SCALE } from './hero.constants';

const dir = dirname(fileURLToPath(import.meta.url));
const heroSource = readFileSync(join(dir, 'hero.tsx'), 'utf8');

describe('TASK-052 arrival identity', () => {
  test('speaks as a world threshold rather than a marketing landing', () => {
    assert.equal(HERO_COPY.regionalSpace, REGION_IDENTITY_COPY.noneEyebrow);
    assert.equal(HERO_COPY.present, WORLD_IDENTITY_COPY.validEyebrow);
    assert.equal(HERO_COPY.invitation, WORLD_NAVIGATOR_COPY.orientation);
    assert.doesNotMatch(heroSource, /Enter the World Beyond the Screen/);
    assert.doesNotMatch(heroSource, /Discover thousands of anime/i);
    assert.doesNotMatch(heroSource, /Your anime journey starts here/i);
  });

  test('title yields visual protagonism to the portal', () => {
    assert.doesNotMatch(HERO_TITLE_SCALE, /text-8xl/);
    assert.doesNotMatch(heroSource, /text-8xl/);
    assert.match(heroSource, /data-slot="hero-eyebrow"/);
    assert.match(heroSource, /data-slot="hero-title"/);
    assert.match(heroSource, /data-slot="hero-invitation"/);
  });
});
