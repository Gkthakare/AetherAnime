import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { DISTANCE, DURATION, EASING } from './constants';
import {
  identityEnterFrom,
  identityEnterTo,
  identityEnterTransition,
  identityEnterTransitionReduced,
} from './identity';

const dir = dirname(fileURLToPath(import.meta.url));
const worldIdentitySource = readFileSync(
  join(dir, '../../../widgets/world-identity/world-identity.tsx'),
  'utf8',
);
const regionIdentitySource = readFileSync(
  join(dir, '../../../widgets/region-identity/region-identity.tsx'),
  'utf8',
);

describe('identity enter motion', () => {
  test('preserves the existing identity-enter states and transitions', () => {
    assert.deepEqual(identityEnterFrom, { opacity: 0, y: DISTANCE.SM / 2 });
    assert.deepEqual(identityEnterTo, { opacity: 1, y: 0 });
    assert.equal(identityEnterTransition.duration, DURATION.SLOW);
    assert.deepEqual(identityEnterTransition.ease, EASING.entrance);
    assert.equal(identityEnterTransition.delay, undefined);
    assert.equal(identityEnterTransitionReduced.duration, DURATION.FAST);
    assert.deepEqual(identityEnterTransitionReduced.ease, EASING.standard);
    assert.equal(identityEnterTransitionReduced.delay, undefined);
  });

  test('WorldIdentity and RegionIdentity consume the shared primitive', () => {
    assert.match(
      worldIdentitySource,
      /from '@\/shared\/lib\/motion\/identity'/,
    );
    assert.match(worldIdentitySource, /identityEnterFrom/);
    assert.match(worldIdentitySource, /identityEnterTo/);
    assert.match(worldIdentitySource, /identityEnterTransitionReduced/);
    assert.doesNotMatch(worldIdentitySource, /world-identity\.motion/);

    assert.match(
      regionIdentitySource,
      /from '@\/shared\/lib\/motion\/identity'/,
    );
    assert.match(regionIdentitySource, /identityEnterFrom/);
    assert.match(regionIdentitySource, /identityEnterTo/);
    assert.match(regionIdentitySource, /identityEnterTransitionReduced/);
    assert.doesNotMatch(regionIdentitySource, /region-identity\.motion/);
    assert.match(
      regionIdentitySource,
      /\.\.\.identityEnterTo,\s*opacity: statusOpacity/,
    );
  });
});
