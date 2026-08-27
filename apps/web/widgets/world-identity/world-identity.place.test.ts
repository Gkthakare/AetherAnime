import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { HERO_TITLE_SCALE } from '@/widgets/hero/hero.constants';

import { WORLD_IDENTITY_TITLE_SCALE } from './world-identity.constants';

const dir = dirname(fileURLToPath(import.meta.url));
const identitySource = readFileSync(join(dir, 'world-identity.tsx'), 'utf8');

describe('TASK-053 world identity as location marker', () => {
  test('world name is quieter than the Home threshold title', () => {
    assert.doesNotMatch(WORLD_IDENTITY_TITLE_SCALE.name, /text-7xl/);
    assert.doesNotMatch(WORLD_IDENTITY_TITLE_SCALE.name, /text-6xl/);
    assert.match(WORLD_IDENTITY_TITLE_SCALE.name, /text-2xl|text-3xl/);
    assert.match(HERO_TITLE_SCALE, /lg:text-6xl/);
  });

  test('identity remains a location, not a card or hero section', () => {
    assert.match(identitySource, /data-slot="world-identity-engine"/);
    assert.doesNotMatch(identitySource, /rounded-2xl|backdrop-blur|bg-card/);
    assert.match(identitySource, /identityEnterFrom/);
  });
});
