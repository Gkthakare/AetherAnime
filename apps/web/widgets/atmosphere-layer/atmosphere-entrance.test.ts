import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const atmosphereSource = readFileSync(join(dir, 'atmosphere-layer.tsx'), 'utf8');
const atmosphereCss = readFileSync(join(dir, 'atmosphere-layer.css'), 'utf8');
const livingCss = readFileSync(
  join(dir, '../world-environment/world-living-presence.css'),
  'utf8',
);

describe('TASK-052 home environment', () => {
  test('reuses WorldEnvironment instead of a parallel atmosphere system', () => {
    assert.match(atmosphereSource, /WorldEnvironment/);
    assert.match(atmosphereSource, /data-slot="atmosphere-layer"/);
    assert.match(atmosphereSource, /aria-hidden="true"/);
    assert.match(atmosphereSource, /pointer-events-none/);
    assert.doesNotMatch(atmosphereSource, /inset-\[-12%\]/);
    assert.doesNotMatch(atmosphereSource, /indigoFarDrift/);
  });

  test('portal attention brightens nearby living light without a second climate', () => {
    assert.match(atmosphereCss, /data-slot='arrival-scene'/);
    assert.match(atmosphereCss, /data-slot='portal-cta'/);
    assert.match(atmosphereCss, /world-environment-ask/);
    assert.doesNotMatch(atmosphereSource, /WorldClimate/);
  });

  test('TASK-046 living-light compositor budget remains intact', () => {
    assert.match(livingCss, /@media \(min-width:\s*120rem\)/);
    assert.match(
      livingCss,
      /\[data-slot='world-environment'\] \.aether-living-light \{[\s\S]*?inset:\s*18%\s*16%/,
    );
    assert.match(livingCss, /animation:\s*aether-living-light 19\.2s/);
  });
});
