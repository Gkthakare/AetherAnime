import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { worldClimateAllowsDrift } from './world-climate.motion';

const dir = dirname(fileURLToPath(import.meta.url));
const viewSource = readFileSync(join(dir, 'world-climate.tsx'), 'utf8');

describe('worldClimateAllowsDrift arrival pause', () => {
  test('idle present world may drift', () => {
    assert.equal(worldClimateAllowsDrift('present', false, false), true);
  });

  test('catalog arrival pauses climate drift so mix-blend wash is not re-composited every frame', () => {
    assert.equal(worldClimateAllowsDrift('present', false, true), false);
    assert.equal(worldClimateAllowsDrift('engaged', false, true), false);
  });

  test('reduced motion never drifts', () => {
    assert.equal(worldClimateAllowsDrift('present', true, false), false);
  });

  test('WorldClimate passes arrivedAnime into the drift gate', () => {
    assert.match(viewSource, /arrivedAnime/);
    assert.match(viewSource, /worldClimateAllowsDrift\(/);
    assert.match(viewSource, /arrivedAnime != null/);
  });
});

describe('worldClimateAllowsDrift large idle surface', () => {
  test('1920 idle holds climate still so living light remains the only breath', () => {
    assert.equal(worldClimateAllowsDrift('present', false, false, true), false);
    assert.equal(worldClimateAllowsDrift('engaged', false, false, true), false);
  });

  test('compact idle surfaces may still drift', () => {
    assert.equal(worldClimateAllowsDrift('present', false, false, false), true);
  });

  test('WorldClimate observes the 1920 idle-surface media gate', () => {
    assert.match(viewSource, /WORLD_CLIMATE_LARGE_IDLE_SURFACE_MEDIA/);
    assert.match(viewSource, /largeIdleSurface/);
    assert.match(viewSource, /useState\(true\)/);
  });
});
