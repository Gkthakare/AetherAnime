import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  PORTAL_GATE_FRAME,
  PORTAL_GEOMETRY_SIZE_CLASS,
} from './portal-geometry.constants';

const dir = dirname(fileURLToPath(import.meta.url));
const geometrySource = readFileSync(join(dir, 'portal-geometry.tsx'), 'utf8');
const ctaSource = readFileSync(join(dir, 'portal-cta.tsx'), 'utf8');

describe('TASK-052 portal entrance', () => {
  test('geometry occupies a meaningful focus area without filling the viewport', () => {
    assert.doesNotMatch(PORTAL_GEOMETRY_SIZE_CLASS, /\bsize-32\b/);
    assert.doesNotMatch(PORTAL_GEOMETRY_SIZE_CLASS, /\bmd:size-40\b/);
    assert.match(PORTAL_GEOMETRY_SIZE_CLASS, /min\(/);
    assert.match(PORTAL_GEOMETRY_SIZE_CLASS, /md:size-64|md:size-\[/);
    assert.doesNotMatch(PORTAL_GEOMETRY_SIZE_CLASS, /size-full|w-screen|h-screen/);
  });

  test('gate framing is architectural depth, not a second interactive control', () => {
    assert.match(geometrySource, /data-slot="portal-gate-frame"/);
    assert.match(geometrySource, /data-slot="portal-gate-aperture"/);
    assert.equal(PORTAL_GATE_FRAME.interactive, false);
    assert.match(geometrySource, /pointer-events-none/);
  });

  test('Portal CTA label, keyboard focus, and single control remain unchanged', () => {
    assert.match(ctaSource, /Enter \$\{destination\}/);
    assert.match(ctaSource, /data-slot="portal-cta"/);
    assert.match(ctaSource, /focus-visible:ring-2/);
    assert.match(ctaSource, /focus-visible:ring-ring/);
    assert.match(ctaSource, /focus-visible:ring-offset-4/);
    assert.equal((ctaSource.match(/<button/g) ?? []).length, 1);
  });
});
