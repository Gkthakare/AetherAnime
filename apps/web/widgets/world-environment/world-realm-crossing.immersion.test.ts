/**
 * TASK-105 / TASK-106 — Immersive + cinematic rift ceremony contracts.
 *
 * Extends TASK-104 cyan event-seam grammar with depth, converging
 * trajectories, monumental aperture, destination poster reveal, and
 * TASK-106 full-frame cinematic composition (silhouettes, asymmetric pull).
 * Does not reopen TASK-103 Destination or transport lifecycle.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import type { CanonicalAnime } from '@/shared/anime';

import { worldArrivalAtmosphere } from './world-arrival.atmosphere';
import { worldRealmCrossing } from './world-realm-crossing';

const dir = dirname(fileURLToPath(import.meta.url));
const crossingCss = readFileSync(join(dir, 'world-realm-crossing.css'), 'utf8');
const crossingView = readFileSync(join(dir, 'world-realm-crossing.view.tsx'), 'utf8');
const atmosphereSource = readFileSync(join(dir, 'world-arrival.atmosphere.ts'), 'utf8');

const WARM_PORTAL_COLOR =
  /255,\s*17[6-9]|255,\s*18[0-9]|255,\s*19[0-9]|255,\s*2[0-4]\d|255,\s*248|232,\s*118|180,\s*90|255,\s*236,\s*210|255,\s*186/i;

function anime(partial: {
  readonly slug: string;
  readonly genres: ReadonlyArray<string>;
  readonly poster?: string | null;
}): CanonicalAnime {
  return {
    id: `anime.${partial.slug}`,
    canonicalTitle: partial.slug,
    alternateTitles: [],
    slug: partial.slug,
    synopsis: 'Local orientation copy.',
    year: 2024,
    type: 'tv',
    episodeCount: 12,
    status: 'finished',
    genres: partial.genres,
    studios: [],
    poster: partial.poster ?? null,
    officialUrl: null,
    ratings: { mal: null, crunchyroll: null },
  };
}

describe('TASK-105 immersive dimensional traversal', () => {
  test('distortion carries converging light trajectories toward the threshold', () => {
    const distortion = crossingCss.match(
      /\[data-slot='world-warp-distortion'\]\s*\{[\s\S]*?\n\}/,
    )?.[0];
    assert.ok(distortion);
    const linearCount = (distortion.match(/linear-gradient/g) ?? []).length;
    assert.ok(
      linearCount >= 2,
      `distortion needs converging trajectories (≥2 linear-gradients), got ${linearCount}`,
    );
    assert.doesNotMatch(distortion, WARM_PORTAL_COLOR);
    assert.doesNotMatch(distortion, /conic-gradient/);
  });

  test('accretion remains a cyan seam and adds dimensional edge light without conic spin', () => {
    const accretion = crossingCss.match(
      /\[data-slot='world-warp-accretion'\]\s*\{[\s\S]*?\n\}/,
    )?.[0];
    assert.ok(accretion);
    assert.match(accretion, /linear-gradient/);
    assert.doesNotMatch(accretion, /conic-gradient/);
    assert.doesNotMatch(accretion, WARM_PORTAL_COLOR);
    const linearCount = (accretion.match(/linear-gradient/g) ?? []).length;
    assert.ok(linearCount >= 2, 'seam needs multi-band dimensional light');
  });

  test('horizon aperture is monumental (tall deep void, not a tiny oval widget)', () => {
    const horizon = crossingCss.match(
      /\[data-slot='world-warp-horizon'\]\s*\{[\s\S]*?\n\}/,
    )?.[0];
    assert.ok(horizon);
    assert.match(horizon, /ellipse\s+\d+%\s+\d+%/);
    const dims = [...horizon.matchAll(/ellipse\s+(\d+)%\s+(\d+)%/g)].map((m) => ({
      w: Number(m[1]),
      h: Number(m[2]),
    }));
    assert.ok(dims.length >= 1);
    assert.ok(
      dims.some((d) => d.h >= 70),
      `aperture height should be monumental (≥70%), got ${JSON.stringify(dims)}`,
    );
    assert.doesNotMatch(horizon, WARM_PORTAL_COLOR);
  });

  test('destination reveal layer uses canonical poster as environmental field', () => {
    assert.match(crossingView, /world-warp-reveal/);
    assert.match(crossingView, /poster/);
    assert.match(atmosphereSource, /poster:/);
    assert.match(crossingCss, /world-warp-reveal/);
    assert.match(crossingCss, /@keyframes aether-warp-reveal/);
    const revealKeyframes = crossingCss.match(
      /@keyframes aether-warp-reveal\s*\{[\s\S]*?\n\}/,
    )?.[0];
    assert.ok(revealKeyframes);
    const stops = [
      ...revealKeyframes.matchAll(/(\d+)%\s*\{[^}]*opacity:\s*([0-9.]+)/g),
    ].map((m) => ({ pct: Number(m[1]), opacity: Number(m[2]) }));
    const firstVisible = stops.find((s) => s.opacity > 0.05);
    assert.ok(firstVisible);
    assert.ok(
      firstVisible.pct <= 48,
      `poster reveal must start by 48%, started at ${firstVisible.pct}%`,
    );
  });

  test('atmosphere carries validated poster for arrival reveal without owning CanonicalAnime in crossing.ts', () => {
    const withPoster = worldArrivalAtmosphere({
      arrivedAnime: anime({
        slug: 'solo-leveling',
        genres: ['Action', 'Fantasy'],
        poster: '/assets/aetheranime/anime/solo-leveling/solo-leveling-poster.webp',
      }),
      regionClimate: null,
    });
    const without = worldArrivalAtmosphere({
      arrivedAnime: anime({
        slug: 'solo-leveling',
        genres: ['Action', 'Fantasy'],
        poster: null,
      }),
      regionClimate: null,
    });
    assert.equal(
      withPoster.poster,
      '/assets/aetheranime/anime/solo-leveling/solo-leveling-poster.webp',
    );
    assert.equal(without.poster, null);
    assert.equal(
      worldRealmCrossing({ atmosphere: withPoster, reduceMotion: false }).active,
      true,
    );
    const crossingTs = readFileSync(join(dir, 'world-realm-crossing.ts'), 'utf8');
    assert.doesNotMatch(crossingTs, /CanonicalAnime/);
  });

  test('environment compression remains the spatial driver with forward pull', () => {
    const env = crossingCss.match(/@keyframes aether-warp-env\s*\{[\s\S]*?\n\}/)?.[0];
    assert.ok(env);
    assert.ok(
      /scaleX\(1\.[3-9]/.test(env) || /scaleY\(1\.[3-9]/.test(env) || /scale\(1\.[4-9]/.test(env),
      'env pull needs substantial peak scale',
    );
    assert.match(crossingView, /aether-warp-env/);
  });

  test('TASK-104 protections remain: no warm portal, black-hole data-warp, reduced motion, no WebGL', () => {
    assert.match(crossingView, /data-warp="black-hole"/);
    assert.match(crossingCss, /prefers-reduced-motion:\s*reduce/);
    assert.doesNotMatch(
      `${crossingCss}\n${crossingView}`,
      /\bTHREE\b|@react-three|HTMLCanvasElement|particle-system/,
    );
    assert.doesNotMatch(crossingCss, /backdrop-filter/);
    for (const slot of [
      'world-warp-accretion',
      'world-warp-emergence',
      'world-warp-distortion',
      'world-warp-horizon',
    ]) {
      const block = crossingCss.match(
        new RegExp(`\\[data-slot='${slot}'\\]\\s*\\{[^}]*background:[\\s\\S]*?\\n\\}`),
      )?.[0];
      assert.ok(block, slot);
      assert.doesNotMatch(block, WARM_PORTAL_COLOR);
    }
  });
});

describe('TASK-106 cinematic rift composition', () => {
  test('foreground depth uses a few large ::before/::after silhouettes — no new CrossingLayer', () => {
    assert.match(crossingCss, /\[data-slot='world-realm-crossing'\]::before/);
    assert.match(crossingCss, /\[data-slot='world-realm-crossing'\]::after/);
    assert.match(crossingCss, /@keyframes aether-warp-silhouette/);
    assert.doesNotMatch(crossingView, /world-warp-silhouette/);
    assert.doesNotMatch(crossingCss, /animation:\s*[^;]*infinite/);
  });

  test('destination reveal stays unmistakably present through the cinematic peak window', () => {
    const revealKeyframes = crossingCss.match(
      /@keyframes aether-warp-reveal\s*\{[\s\S]*?\n\}/,
    )?.[0];
    assert.ok(revealKeyframes);
    const stops = [
      ...revealKeyframes.matchAll(/(\d+)%\s*\{[^}]*opacity:\s*([0-9.]+)/g),
    ].map((m) => ({ pct: Number(m[1]), opacity: Number(m[2]) }));
    const peakWindow = stops.filter((s) => s.pct >= 35 && s.pct <= 58);
    assert.ok(peakWindow.length >= 1, 'need a reveal stop in 35–58% (≈850–1400ms)');
    assert.ok(
      peakWindow.some((s) => s.opacity >= 0.9),
      `reveal must be ≥0.9 in cinematic peak, got ${JSON.stringify(peakWindow)}`,
    );
  });

  test('horizon aperture keeps a hollow transparent core for destination beyond the rim', () => {
    const horizon = crossingCss.match(
      /\[data-slot='world-warp-horizon'\]\s*\{[\s\S]*?\n\}/,
    )?.[0];
    assert.ok(horizon);
    assert.match(horizon, /transparent\s+0%/);
    assert.match(horizon, /transparent\s+(3[0-9]|4[0-9])%/);
    assert.doesNotMatch(horizon, /conic-gradient/);
  });

  test('environment pull uses asymmetric spacetime stretch, not a flat zoom', () => {
    const env = crossingCss.match(/@keyframes aether-warp-env\s*\{[\s\S]*?\n\}/)?.[0];
    assert.ok(env);
    assert.ok(/scaleX\(1\.[4-9]/.test(env), 'scaleX peak');
    assert.ok(/scaleY\(1\.[4-9]/.test(env), 'scaleY peak');
    assert.match(crossingView, /aether-warp-env/);
  });

  test('no continuous JS animation, rAF loops, WebGL, or particle systems', () => {
    const sources = `${crossingCss}\n${crossingView}`;
    assert.doesNotMatch(sources, /requestAnimationFrame/);
    assert.doesNotMatch(
      sources,
      /\bTHREE\b|@react-three|HTMLCanvasElement|particle-system/,
    );
    assert.doesNotMatch(crossingCss, /animation:[^;]*infinite/);
  });
});

describe('TASK-107 unified dimensional rupture', () => {
  test('destination stays in deep void until mid-ceremony, then approaches (not a simple fade)', () => {
    const revealKeyframes = crossingCss.match(
      /@keyframes aether-warp-reveal\s*\{[\s\S]*?\n\}/,
    )?.[0];
    assert.ok(revealKeyframes);
    const opacityStops = [
      ...revealKeyframes.matchAll(/(\d+)%\s*\{[^}]*opacity:\s*([0-9.]+)/g),
    ].map((m) => ({ pct: Number(m[1]), opacity: Number(m[2]) }));
    const scaleStops = [
      ...revealKeyframes.matchAll(/(\d+)%\s*\{[^}]*transform:[^;]*scale\(([0-9.]+)/g),
    ].map((m) => ({ pct: Number(m[1]), scale: Number(m[2]) }));

    const early = opacityStops.filter((s) => s.pct > 0 && s.pct < 32);
    assert.ok(
      early.every((s) => s.opacity <= 0.05),
      `void must dominate before ~35% (≤32% stops ≤0.05), got ${JSON.stringify(early)}`,
    );

    const firstVisible = opacityStops.find((s) => s.opacity > 0.05);
    assert.ok(firstVisible);
    assert.ok(
      firstVisible.pct >= 32 && firstVisible.pct <= 45,
      `world should emerge ~35–45%, got ${firstVisible.pct}%`,
    );

    const far = scaleStops.find((s) => s.pct >= 32 && s.pct <= 45);
    const near = scaleStops.find((s) => s.pct >= 60 && s.pct <= 78);
    assert.ok(far && near, 'need far and approach scale stops');
    assert.ok(
      far.scale > near.scale,
      `destination must approach (far scale ${far.scale} > near ${near.scale})`,
    );
  });

  test('horizon aperture uses asymmetric multi-band tear, not a single clean oval', () => {
    const horizon = crossingCss.match(
      /\[data-slot='world-warp-horizon'\]\s*\{[\s\S]*?\n\}/,
    )?.[0];
    assert.ok(horizon);
    const positions = [...horizon.matchAll(/at\s+(\d+)%\s+(\d+)%/g)].map((m) => ({
      x: Number(m[1]),
      y: Number(m[2]),
    }));
    assert.ok(positions.length >= 2, 'need ≥2 offset rim bands for irregularity');
    const xs = new Set(positions.map((p) => p.x));
    assert.ok(xs.size >= 2, 'left/right rim intensity must differ (offset X)');
    assert.doesNotMatch(horizon, /conic-gradient/);
    assert.doesNotMatch(horizon, WARM_PORTAL_COLOR);
  });

  test('silhouettes remain ≤2 elongated directional forms via existing pseudo-elements', () => {
    assert.match(crossingCss, /skew/i);
    const before = crossingCss.match(
      /\[data-slot='world-realm-crossing'\]\[data-crossing-spatial='true'\]::before\s*\{[\s\S]*?\n\}/,
    )?.[0];
    const after = crossingCss.match(
      /\[data-slot='world-realm-crossing'\]\[data-crossing-spatial='true'\]::after\s*\{[\s\S]*?\n\}/,
    )?.[0];
    assert.ok(before && after);
    assert.doesNotMatch(crossingView, /world-warp-silhouette/);
    assert.match(crossingCss, /max-width:\s*480px[\s\S]*animation:\s*none/);
  });

  test('environment pull uses off-center origin and mid-ceremony instability', () => {
    assert.match(
      crossingCss,
      /world-environment-crossing[^\n]*origin|origin-[^\s"]+|transform-origin/,
    );
    const env = crossingCss.match(/@keyframes aether-warp-env\s*\{[\s\S]*?\n\}/)?.[0];
    assert.ok(env);
    assert.ok(/scaleX\(1\.[4-9]/.test(env), 'scaleX peak');
    assert.ok(/scaleY\(1\.[4-9]/.test(env), 'scaleY peak');
  });
});
