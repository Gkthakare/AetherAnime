import { describe, expect, it } from 'vitest';

import { DISTANCE } from '@/shared/lib/motion';

import { PORTAL_GRAVITY_INTENSITY, isPortalLocked } from './portal-cta.motion';
import type { PortalPhase } from './portal-cta.types';
import {
  type PortalParticleCycle,
  PORTAL_PARTICLE_COUNT,
  PORTAL_PARTICLE_COUNT_REDUCED,
  PORTAL_PARTICLE_POOL,
  createPortalParticleCycle,
  portalParticleActiveCount,
} from './portal-particle.motion';

const ALL_PHASES: readonly PortalPhase[] = [
  'idle',
  'inviting',
  'accepting',
  'crossing',
  'settling',
];

const distance = (p: { x: number; y: number }) => Math.hypot(p.x, p.y);

type OpacityTween = { duration: number; delay: number; times: number[] };

/** The per-value opacity tween nested inside the cycle transition. */
function opacityTween(
  transition: PortalParticleCycle['transition'],
): OpacityTween {
  return (transition as { opacity: OpacityTween }).opacity;
}

describe('particle counts', () => {
  it('never activates more slots than the fixed DOM pool', () => {
    for (const phase of ALL_PHASES) {
      expect(PORTAL_PARTICLE_COUNT[phase]).toBeLessThanOrEqual(
        PORTAL_PARTICLE_POOL,
      );
      expect(portalParticleActiveCount(phase, false)).toBeLessThanOrEqual(
        PORTAL_PARTICLE_POOL,
      );
      expect(portalParticleActiveCount(phase, true)).toBeLessThanOrEqual(
        PORTAL_PARTICLE_POOL,
      );
    }
  });

  it('keeps at least one particle alive in every phase', () => {
    for (const phase of ALL_PHASES) {
      expect(portalParticleActiveCount(phase, false)).toBeGreaterThanOrEqual(1);
      expect(portalParticleActiveCount(phase, true)).toBeGreaterThanOrEqual(1);
    }
  });

  it('activates the fewest particles on idle and the most on crossing', () => {
    const counts = ALL_PHASES.map((phase) => PORTAL_PARTICLE_COUNT[phase]);
    expect(PORTAL_PARTICLE_COUNT.idle).toBe(Math.min(...counts));
    expect(PORTAL_PARTICLE_COUNT.crossing).toBe(Math.max(...counts));
  });

  it('never activates more particles under reduced motion', () => {
    for (const phase of ALL_PHASES) {
      expect(PORTAL_PARTICLE_COUNT_REDUCED[phase]).toBeLessThanOrEqual(
        PORTAL_PARTICLE_COUNT[phase],
      );
      expect(portalParticleActiveCount(phase, true)).toBeLessThanOrEqual(
        portalParticleActiveCount(phase, false),
      );
    }
  });
});

describe('createPortalParticleCycle', () => {
  it('is deterministic for the same slot and generation', () => {
    expect(createPortalParticleCycle(1, 3, 'crossing', false)).toEqual(
      createPortalParticleCycle(1, 3, 'crossing', false),
    );
  });

  it('spawns different slots at different points on the annulus', () => {
    const a = createPortalParticleCycle(0, 0, 'idle', false);
    const b = createPortalParticleCycle(1, 0, 'idle', false);
    expect([a.x[0], a.y[0]]).not.toEqual([b.x[0], b.y[0]]);
  });

  it('respawns the same slot elsewhere on the next generation', () => {
    const first = createPortalParticleCycle(2, 0, 'idle', false);
    const second = createPortalParticleCycle(2, 1, 'idle', false);
    expect([first.x[0], first.y[0]]).not.toEqual([second.x[0], second.y[0]]);
  });

  it('spawns inside the annulus band', () => {
    for (let index = 0; index < PORTAL_PARTICLE_POOL; index += 1) {
      for (let generation = 0; generation < 10; generation += 1) {
        const cycle = createPortalParticleCycle(
          index,
          generation,
          'inviting',
          false,
        );
        const radius = distance({ x: cycle.x[0], y: cycle.y[0] });
        expect(radius).toBeGreaterThanOrEqual(DISTANCE.NORMAL - 1e-9);
        expect(radius).toBeLessThanOrEqual(DISTANCE.LG * 0.75 + 1e-9);
      }
    }
  });

  it('drifts inward only — never outward or into orbit', () => {
    for (let index = 0; index < PORTAL_PARTICLE_POOL; index += 1) {
      for (const phase of ALL_PHASES) {
        const cycle = createPortalParticleCycle(index, index, phase, false);
        expect(cycle.x).toHaveLength(2);
        expect(cycle.y).toHaveLength(2);
        const from = { x: cycle.x[0], y: cycle.y[0] };
        const to = { x: cycle.x[1], y: cycle.y[1] };
        expect(distance(to)).toBeLessThan(distance(from));
      }
    }
  });

  it('absorbs even slots into the singularity and odd slots just off the seam', () => {
    const even = createPortalParticleCycle(0, 0, 'idle', false);
    expect([even.x[1], even.y[1]]).toEqual([0, 0]);

    const odd = createPortalParticleCycle(1, 0, 'idle', false);
    const residual = distance({ x: odd.x[1], y: odd.y[1] });
    expect(residual).toBeGreaterThan(0);
    expect(residual).toBeLessThan(DISTANCE.SM);
  });

  it('shrinks travel under reduced motion without changing the target', () => {
    const full = createPortalParticleCycle(3, 2, 'accepting', false);
    const reduced = createPortalParticleCycle(3, 2, 'accepting', true);
    expect(distance({ x: reduced.x[0], y: reduced.y[0] })).toBeLessThan(
      distance({ x: full.x[0], y: full.y[0] }),
    );
    expect(reduced.opacity).toEqual(full.opacity);
  });

  it('fades in and out so particles never pop', () => {
    const cycle = createPortalParticleCycle(2, 1, 'crossing', false);
    expect(cycle.opacity[0]).toBe(0);
    expect(cycle.opacity[2]).toBe(0);
    expect(cycle.opacity[1]).toBeGreaterThan(0);
  });

  it('keeps peak opacity soft so particles never compete with the portal', () => {
    for (const phase of ALL_PHASES) {
      const peak = createPortalParticleCycle(0, 0, phase, false).opacity[1];
      expect(peak).toBeLessThanOrEqual(0.4);
    }
    expect(
      createPortalParticleCycle(0, 0, 'crossing', false).opacity[1],
    ).toBeGreaterThan(
      createPortalParticleCycle(0, 0, 'idle', false).opacity[1],
    );
  });

  it('shortens lifetime as gravity intensifies', () => {
    const duration = (phase: PortalPhase) =>
      createPortalParticleCycle(0, 0, phase, false).transition
        .duration as number;
    expect(duration('crossing')).toBeLessThan(duration('idle'));
    expect(duration('accepting')).toBeLessThan(duration('inviting'));
    for (const phase of ALL_PHASES) {
      expect(duration(phase)).toBeGreaterThan(0);
    }
  });

  it('respawns more densely as gravity intensifies', () => {
    const delay = (phase: PortalPhase) =>
      createPortalParticleCycle(0, 0, phase, false).transition.delay as number;
    expect(delay('crossing')).toBeLessThan(delay('idle'));
    expect(PORTAL_GRAVITY_INTENSITY.crossing).toBeGreaterThan(
      PORTAL_GRAVITY_INTENSITY.idle,
    );
  });

  it('staggers slots so particles do not pulse as one ring', () => {
    const delays = Array.from(
      { length: PORTAL_PARTICLE_POOL },
      (_, index) =>
        createPortalParticleCycle(index, 0, 'idle', false).transition
          .delay as number,
    );
    expect(new Set(delays).size).toBe(delays.length);
    expect(delays).toEqual([...delays].sort((a, b) => a - b));
  });

  it('slows lifetime and rarefies respawn under reduced motion', () => {
    const full = createPortalParticleCycle(0, 0, 'idle', false).transition;
    const reduced = createPortalParticleCycle(0, 0, 'idle', true).transition;
    expect(reduced.duration as number).toBeLessThan(full.duration as number);
    expect(reduced.delay as number).toBeGreaterThan(full.delay as number);
  });

  it('drives the same opacity clock as the position tween', () => {
    const cycle = createPortalParticleCycle(1, 1, 'settling', false);
    const opacity = opacityTween(cycle.transition);
    expect(opacity.duration).toBe(cycle.transition.duration);
    expect(opacity.delay).toBe(cycle.transition.delay);
    expect(opacity.times).toHaveLength(cycle.opacity.length);
    expect(opacity.times[0]).toBe(0);
    expect(opacity.times.at(-1)).toBe(1);
    expect(opacity.times[1]).toBeGreaterThan(0);
    expect(opacity.times[1]).toBeLessThan(1);
  });

  it('peaks later in the lifetime when gravity is strong', () => {
    const peakAt = (phase: PortalPhase) =>
      opacityTween(createPortalParticleCycle(0, 0, phase, false).transition)
        .times[1];
    expect(peakAt('crossing')).toBeGreaterThan(peakAt('idle'));
  });

  it('emits cycles for locked phases too — particles reveal the ceremony', () => {
    for (const phase of ALL_PHASES.filter(isPortalLocked)) {
      expect(portalParticleActiveCount(phase, false)).toBeGreaterThan(0);
    }
  });
});
