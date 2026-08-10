/**
 * Portal Particle Engine — motion definitions only.
 *
 * Particles reveal Gravity. They consume `PORTAL_GRAVITY_INTENSITY`.
 * Gravity never imports this module.
 *
 * Canon: PORTAL_ENGINE §6 · PORTAL_MOTION Gravity/Particle compatibility.
 */

import type { Transition } from 'framer-motion';

import { DISTANCE, DURATION, EASING } from '@/shared/lib/motion';

import { PORTAL_GRAVITY_INTENSITY } from './portal-cta.motion';
import type { PortalPhase } from './portal-cta.types';
import { PORTAL_SEAM } from './portal-geometry.constants';

/** Fixed DOM pool — never allocate particle nodes per frame. */
export const PORTAL_PARTICLE_POOL = 4;

/** Active slots per phase — extremely low; Idle almost subconscious. */
export const PORTAL_PARTICLE_COUNT: Record<PortalPhase, number> = {
  idle: 1,
  inviting: 2,
  accepting: 3,
  crossing: 4,
  settling: 2,
};

/** Reduced motion — fewer slots; phases preserved. */
export const PORTAL_PARTICLE_COUNT_REDUCED: Record<PortalPhase, number> = {
  idle: 1,
  inviting: 1,
  accepting: 2,
  crossing: 2,
  settling: 1,
};

/** Soft peak opacity — particles never compete with the Portal. */
const PORTAL_PARTICLE_PEAK: Record<PortalPhase, number> = {
  idle: 0.22,
  inviting: 0.28,
  accepting: 0.34,
  crossing: 0.4,
  settling: 0.2,
};

/** Annulus radius (px) — soft spawn ring; composed from foundation distance. */
const PORTAL_PARTICLE_RADIUS = {
  min: DISTANCE.NORMAL,
  max: DISTANCE.LG * 0.75,
} as const;

/** Reduced-motion travel scale (local to particles; does not alter Gravity). */
const PORTAL_PARTICLE_TRAVEL_REDUCED = 0.45;

/** Residual px at seam absorb — below idle plate travel consciousness. */
const PORTAL_IDLE_ABSORB_TIP = DISTANCE.SM / 6;

export type PortalParticleCycle = {
  x: number[];
  y: number[];
  opacity: number[];
  transition: Transition;
};

/**
 * Deterministic annulus angle — async feel without per-frame RNG.
 * Golden-angle stepping keeps particles from clustering into a ring UI.
 */
function particleAngle(index: number, generation: number): number {
  return (index * 2.399963 + generation * 1.618034) % (Math.PI * 2);
}

function particleRadius(index: number, generation: number, reduce: boolean): number {
  const t = ((index * 3 + generation * 5) % 10) / 10;
  const radius =
    PORTAL_PARTICLE_RADIUS.min +
    (PORTAL_PARTICLE_RADIUS.max - PORTAL_PARTICLE_RADIUS.min) * t;
  return reduce ? radius * PORTAL_PARTICLE_TRAVEL_REDUCED : radius;
}

/**
 * Lifetime shortens as gravity intensifies (absorbed faster under commitment).
 * Idle stays long; Crossing commits inward.
 */
function particleDuration(phase: PortalPhase, reduce: boolean): number {
  const g = PORTAL_GRAVITY_INTENSITY[phase];
  const base = DURATION.CINEMATIC * (reduce ? 2.5 : 5);
  return base * (1.15 - g * 0.55);
}

/** Respawn gap — rarer when gravity is quiet; denser under Crossing. */
function particleDelay(phase: PortalPhase, index: number, reduce: boolean): number {
  const g = PORTAL_GRAVITY_INTENSITY[phase];
  const base = DURATION.SLOW * (2.4 - g * 1.4);
  const stagger = DURATION.NORMAL * index * (1.1 - g * 0.4);
  return (reduce ? base * 1.25 : base) + stagger;
}

/**
 * Absorb target: even → singularity (origin); odd → slight seam-axis yield.
 * Short residual keeps absorption readable without orbit.
 */
function absorbTarget(index: number, reduce: boolean): { x: number; y: number } {
  if (index % 2 === 0) {
    return { x: 0, y: 0 };
  }
  const seam = (parseFloat(PORTAL_SEAM.rotate) * Math.PI) / 180;
  const tip = reduce
    ? PORTAL_IDLE_ABSORB_TIP * PORTAL_PARTICLE_TRAVEL_REDUCED
    : PORTAL_IDLE_ABSORB_TIP;
  return { x: Math.cos(seam) * tip, y: Math.sin(seam) * tip };
}

/**
 * One absorb cycle — inward drift only. No orbit, spiral, or outward path.
 */
export function createPortalParticleCycle(
  index: number,
  generation: number,
  phase: PortalPhase,
  reduceMotion: boolean,
): PortalParticleCycle {
  const angle = particleAngle(index, generation);
  const radius = particleRadius(index, generation, reduceMotion);
  const from = {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  };
  const to = absorbTarget(index, reduceMotion);
  const peak = PORTAL_PARTICLE_PEAK[phase];
  const duration = particleDuration(phase, reduceMotion);
  const delay = particleDelay(phase, index, reduceMotion);
  const g = PORTAL_GRAVITY_INTENSITY[phase];

  return {
    x: [from.x, to.x],
    y: [from.y, to.y],
    opacity: [0, peak, 0],
    transition: {
      duration,
      ease: EASING.cinematic,
      delay,
      opacity: {
        duration,
        ease: EASING.cinematic,
        delay,
        times: [0, 0.35 + g * 0.1, 1],
      },
    },
  };
}

export function portalParticleActiveCount(
  phase: PortalPhase,
  reduceMotion: boolean,
): number {
  const map = reduceMotion
    ? PORTAL_PARTICLE_COUNT_REDUCED
    : PORTAL_PARTICLE_COUNT;
  return Math.min(PORTAL_PARTICLE_POOL, map[phase]);
}
