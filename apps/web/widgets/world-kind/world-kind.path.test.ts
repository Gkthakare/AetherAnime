import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { WORLD_KIND_REGION_PATH } from './world-kind.constants';

const dir = dirname(fileURLToPath(import.meta.url));
const kindSource = readFileSync(join(dir, 'world-kind.tsx'), 'utf8');
const placeCss = readFileSync(
  join(dir, '../world-layout/world-place.css'),
  'utf8',
);

describe('TASK-053 region landmarks', () => {
  test('idle regions travel as a path, not a stacked card list', () => {
    assert.match(WORLD_KIND_REGION_PATH, /flex-row/);
    assert.doesNotMatch(kindSource, /recede \? 'min-h-0' : 'min-h-20'/);
    assert.match(kindSource, /data-region-availability/);
    assert.match(kindSource, /focus-visible:ring-2 focus-visible:ring-ring/);
  });

  test('idle world does not paint a giant center ellipse over the place', () => {
    assert.match(placeCss, /world-environment-identity-veil/);
    assert.match(placeCss, /:not\(\[data-world-anime\]\)/);
    assert.doesNotMatch(placeCss, /ellipse 52% 38% at 50% 50%/);
  });
});
