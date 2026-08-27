import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const presencePath = join(dir, 'world-idle-presence.css');
const livingCss = readFileSync(join(dir, 'world-living-presence.css'), 'utf8');
const environmentSource = readFileSync(
  join(dir, 'world-environment.tsx'),
  'utf8',
);
const kindSource = readFileSync(
  join(dir, '../world-kind/world-kind.tsx'),
  'utf8',
);
const landmarkCss = readFileSync(
  join(dir, '../world-kind/world-kind.landmarks.css'),
  'utf8',
);

describe('TASK-055 world idle presence', () => {
  test('idle presence is a dedicated stylesheet gated off Home and Destination', () => {
    assert.equal(existsSync(presencePath), true);
    assert.match(environmentSource, /world-idle-presence\.css/);
    const css = readFileSync(presencePath, 'utf8');
    assert.match(css, /\[data-slot='world-scene'\]:not\(\[data-world-anime\]\)/);
    assert.doesNotMatch(css, /atmosphere-layer/);
  });

  test('new presence motion is disabled under reduced motion', () => {
    const css = readFileSync(presencePath, 'utf8');
    assert.match(css, /prefers-reduced-motion:\s*reduce/);
    assert.match(css, /animation:\s*none/);
  });

  test('TASK-046 compositor freeze remains the only large idle light breath', () => {
    assert.match(livingCss, /animation:\s*aether-living-light 19\.2s/);
    assert.match(livingCss, /inset:\s*18%\s*16%/);
    assert.doesNotMatch(
      livingCss,
      /\[data-living='true'\] \.aether-living-depth \{[\s\S]*?animation:/,
    );
    const css = readFileSync(presencePath, 'utf8');
    assert.doesNotMatch(css, /will-change\s*:/);
    assert.doesNotMatch(css, /aether-living-depth/);
    assert.doesNotMatch(css, /WebGL|canvas|particle/i);
  });

  test('TASK-054 crossings and WorldEnvironment stack stay the presentation owners', () => {
    assert.match(kindSource, /data-kind-landmarks/);
    assert.match(landmarkCss, /data-region-order='0'/);
    assert.match(environmentSource, /EnvironmentDepth/);
    assert.match(environmentSource, /worldLivingPresence/);
    assert.doesNotMatch(environmentSource, /from 'three'|gsap|lenis/);
  });
});
