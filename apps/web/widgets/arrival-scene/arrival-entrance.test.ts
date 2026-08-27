import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const arrivalSource = readFileSync(join(dir, 'arrival-scene.tsx'), 'utf8');
const homeSource = readFileSync(join(dir, '../../app/page.tsx'), 'utf8');

describe('TASK-052 arrival scene composition', () => {
  test('Home remains ArrivalScene with a single portal invitation', () => {
    assert.match(homeSource, /ArrivalScene/);
    assert.match(arrivalSource, /<AtmosphereLayer phase=\{phase\} \/>/);
    assert.match(arrivalSource, /<Hero phase=\{phase\} \/>/);
    assert.match(arrivalSource, /<PortalCTA/);
    assert.match(arrivalSource, /destination=\{ARRIVAL_DESTINATION\}/);
    assert.match(arrivalSource, /const ARRIVAL_DESTINATION = 'AetherAnime'/);
    assert.equal((arrivalSource.match(/<PortalCTA/g) ?? []).length, 1);
  });

  test('does not introduce catalog, dashboard, or continuation chrome', () => {
    assert.doesNotMatch(arrivalSource, /Continue From This Place/);
    assert.doesNotMatch(arrivalSource, /AnimeDestination/);
    assert.doesNotMatch(arrivalSource, /WorldMemory/);
    assert.doesNotMatch(homeSource, /pricing|carousel|catalog/i);
  });
});
