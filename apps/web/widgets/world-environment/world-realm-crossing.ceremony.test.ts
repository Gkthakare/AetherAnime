/**
 * TASK-104 — Aether arrival ceremony visual grammar contracts.
 *
 * Guards cyan event-seam / threshold-aperture language against the
 * pre-104 warm accretion portal identity. Transport lifecycle and
 * layer slots stay frozen from TASK-096.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { DURATION } from '@/shared/lib/motion';

const dir = dirname(fileURLToPath(import.meta.url));
const crossingCss = readFileSync(join(dir, 'world-realm-crossing.css'), 'utf8');
const crossingView = readFileSync(join(dir, 'world-realm-crossing.view.tsx'), 'utf8');
const crossingMotion = readFileSync(
  join(dir, 'world-realm-crossing.motion.ts'),
  'utf8',
);

/** Warm amber/orange/ivory portal identity — forbidden as ceremony dominance. */
const WARM_PORTAL_COLOR =
  /255,\s*17[6-9]|255,\s*18[0-9]|255,\s*19[0-9]|255,\s*2[0-4]\d|255,\s*248|232,\s*118|180,\s*90|255,\s*236,\s*210|255,\s*186|#f[fd][a-f0-9]{4}|#e[89a-f][0-9a-f]{4}/i;

/** Background-bearing rule for a warp layer (skips the shared opacity:0 group). */
function layerBackgroundBlock(slot: string): string | undefined {
  const re = new RegExp(
    `\\[data-slot='${slot}'\\]\\s*\\{[^}]*background:[\\s\\S]*?\\n\\}`,
  );
  return crossingCss.match(re)?.[0];
}

describe('TASK-104 aether arrival ceremony grammar', () => {
  test('accretion and emergence reject warm amber/orange portal bloom', () => {
    const accretionBlock = layerBackgroundBlock('world-warp-accretion');
    const emergenceBlock = layerBackgroundBlock('world-warp-emergence');
    const distortionBlock = layerBackgroundBlock('world-warp-distortion');
    assert.ok(accretionBlock, 'accretion layer styles required');
    assert.ok(emergenceBlock, 'emergence layer styles required');
    assert.ok(distortionBlock, 'distortion layer styles required');
    assert.doesNotMatch(accretionBlock, WARM_PORTAL_COLOR);
    assert.doesNotMatch(emergenceBlock, WARM_PORTAL_COLOR);
    assert.doesNotMatch(distortionBlock, WARM_PORTAL_COLOR);
  });

  test('accretion uses cyan/indigo dimensional seam light, not a neon full ring', () => {
    const accretionBlock = layerBackgroundBlock('world-warp-accretion');
    assert.ok(accretionBlock);
    assert.match(accretionBlock, /oklch|oklab|rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+/i);
    // Prefer linear/asymmetric seam over classic spinning conic accretion disk.
    assert.match(accretionBlock, /linear-gradient/);
    assert.match(accretionBlock, /mask-image|-webkit-mask-image/);
    assert.doesNotMatch(accretionBlock, /conic-gradient/);
  });

  test('emergence uses restrained cyan/indigo destination leak, not warm bloom', () => {
    const emergenceBlock = layerBackgroundBlock('world-warp-emergence');
    assert.ok(emergenceBlock);
    assert.match(emergenceBlock, /oklch|oklab|rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+/i);
    assert.doesNotMatch(emergenceBlock, WARM_PORTAL_COLOR);
  });

  test('horizon remains an aperture / event boundary without warm rim', () => {
    const horizonBlock = layerBackgroundBlock('world-warp-horizon');
    assert.ok(horizonBlock);
    assert.doesNotMatch(horizonBlock, WARM_PORTAL_COLOR);
    assert.match(horizonBlock, /#000|rgba?\(\s*0/);
  });

  test('accretion motion is a seam formation, not a spinning accretion disk', () => {
    const accretionKeyframes = crossingCss.match(
      /@keyframes aether-warp-accretion\s*\{[\s\S]*?\n\}/,
    )?.[0];
    assert.ok(accretionKeyframes);
    // Allow at most a slight directional shift — ban multi-revolution spins.
    const rotates = [...accretionKeyframes.matchAll(/rotate\((-?\d+(?:\.\d+)?)deg\)/g)].map(
      (m) => Math.abs(Number(m[1])),
    );
    assert.ok(
      rotates.every((deg) => deg <= 28),
      `accretion rotation must stay ≤28deg for seam language, got ${rotates.join(',')}`,
    );
  });

  test('emergence begins before the final quarter so destination participates early', () => {
    const emergenceKeyframes = crossingCss.match(
      /@keyframes aether-warp-emergence\s*\{[\s\S]*?\n\}/,
    )?.[0];
    assert.ok(emergenceKeyframes);
    // First non-zero opacity keyframe must be at or before 48%.
    const stops = [
      ...emergenceKeyframes.matchAll(
        /(\d+)%\s*\{[^}]*opacity:\s*([0-9.]+)/g,
      ),
    ].map((m) => ({ pct: Number(m[1]), opacity: Number(m[2]) }));
    const firstVisible = stops.find((s) => s.opacity > 0.05);
    assert.ok(firstVisible, 'emergence must become visible');
    assert.ok(
      firstVisible.pct <= 48,
      `emergence must start by 48%, started at ${firstVisible.pct}%`,
    );
  });

  test('environment compression remains the spatial driver', () => {
    assert.match(crossingCss, /@keyframes aether-warp-env/);
    assert.match(crossingView, /aether-warp-env/);
    assert.match(crossingMotion, /REALM_CROSSING_SCALE/);
  });

  test('ceremony duration and layer slots stay on the TASK-096 crossing architecture', () => {
    assert.equal(DURATION.WARP, 2.4);
    assert.match(crossingView, /world-warp-veil/);
    assert.match(crossingView, /world-warp-climate/);
    assert.match(crossingView, /world-warp-distortion/);
    assert.match(crossingView, /world-warp-accretion/);
    assert.match(crossingView, /world-warp-horizon/);
    assert.match(crossingView, /world-warp-emergence/);
    assert.match(crossingView, /data-warp="black-hole"/);
    assert.match(crossingView, /aether-warp-reduced/);
    assert.match(crossingCss, /prefers-reduced-motion:\s*reduce/);
  });

  test('no WebGL, canvas, particles, or second transport in crossing surface', () => {
    const sources = `${crossingCss}\n${crossingView}\n${crossingMotion}`;
    assert.doesNotMatch(sources, /\bTHREE\b|@react-three|from ['"]three['"]|HTMLCanvasElement|particle-system|createPortal\s*\(/);
    assert.doesNotMatch(sources, /backdrop-filter/);
  });
});
