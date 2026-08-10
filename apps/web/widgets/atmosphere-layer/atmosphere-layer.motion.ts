/**
 * AtmosphereLayer motion definitions.
 *
 * All animation values for the ambient field live here — never inside the
 * component. Timing reuses the Motion Foundation (`DURATION`, `EASING`,
 * `DELAY`) where it applies; ambient drift periods are local because they are
 * intentionally far longer than UI motion (curiosity, not attention).
 *
 * Ceremony responses are environmental echoes keyed by ArrivalPhase — never
 * loud enough to overpower the Portal. Prefer drift (slow translate) over
 * breathing (opacity pulse). Opacity variation stays very soft.
 *
 * Atmosphere never imports Portal or Hero.
 */

import type { Transition, Variants } from 'framer-motion';

import {
  DELAY,
  EASING,
  cinematicTransition,
  createEchoPhaseTransitions,
  echoPhaseTransitionReduced,
} from '@/shared/lib/motion';

import type { ArrivalPhase } from '../arrival-scene/arrival-scene.types';

/**
 * Resting opacities for reduced-motion / static atmosphere.
 * Tuned so depth remains without movement.
 */
export const ATMOSPHERE_REST = {
  indigoFar: 0.5,
  indigoNear: 0.38,
  cyanAccent: 0.22,
} as const;

/**
 * Ambient drift periods (seconds).
 *
 * Local to Atmosphere — UI presets must not stretch to these lengths.
 * Phase-offset across layers so motion never syncs into a single pulse.
 */
const DRIFT = {
  far: 36,
  near: 28,
  accent: 42,
} as const;

/** Soft enter for the atmosphere shell (once on mount). */
export const atmosphereEnter: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const atmosphereEnterTransition: Transition = {
  ...cinematicTransition,
  delay: DELAY.NONE,
};

export type DriftMotion = {
  opacity: number[];
  x: string[];
  y: string[];
};

export type DriftTransition = {
  opacity: Transition;
  x: Transition;
  y: Transition;
};

/**
 * Drift transition for one plane.
 *
 * Every plane sways on the same recipe — a continuous opacity loop plus
 * cinematic x / y loops — and differs only in period. `yFactor` detunes the
 * vertical loop so x and y never resolve together into a single pulse.
 */
function createDriftTransition(
  period: number,
  yFactor: number,
): DriftTransition {
  return {
    opacity: {
      duration: period,
      repeat: Infinity,
      ease: 'easeInOut',
    },
    x: {
      duration: period,
      repeat: Infinity,
      ease: EASING.cinematic,
    },
    y: {
      duration: period * yFactor,
      repeat: Infinity,
      ease: EASING.cinematic,
    },
  };
}

/**
 * Far indigo haze — deepest moving plane.
 * Largest, slowest drift; barely perceptible opacity sway.
 */
export const indigoFarDrift: DriftMotion = {
  opacity: [0.46, 0.52, 0.48, 0.5, 0.46],
  x: ['0%', '1.4%', '0.3%', '-1.0%', '0%'],
  y: ['0%', '-0.9%', '0.5%', '0.2%', '0%'],
};

export const indigoFarTransition: DriftTransition = createDriftTransition(
  DRIFT.far,
  1.1,
);

/**
 * Near indigo haze — mid-depth plane.
 * Counter-phased drift so layers feel independent.
 */
export const indigoNearDrift: DriftMotion = {
  opacity: [0.34, 0.4, 0.36, 0.38, 0.34],
  x: ['0%', '-1.1%', '-0.2%', '0.9%', '0%'],
  y: ['0%', '0.8%', '-0.4%', '-0.3%', '0%'],
};

export const indigoNearTransition: DriftTransition = createDriftTransition(
  DRIFT.near,
  0.95,
);

/**
 * Restrained cyan accent — cool highlight, never a bloom.
 * Slowest drift; lowest opacity band.
 */
export const cyanAccentDrift: DriftMotion = {
  opacity: [0.18, 0.24, 0.2, 0.22, 0.18],
  x: ['0%', '0.8%', '-0.5%', '0.3%', '0%'],
  y: ['0%', '-0.6%', '0.4%', '-0.2%', '0%'],
};

export const cyanAccentTransition: DriftTransition = createDriftTransition(
  DRIFT.accent,
  1.05,
);

export type AtmosphereLayerPose = {
  opacity: number;
  x: number | string;
  y: number | string;
};

type AtmosphereCeremonyPose = {
  indigoFar: AtmosphereLayerPose;
  indigoNear: AtmosphereLayerPose;
  cyanAccent: AtmosphereLayerPose;
};

/**
 * Resting pose — no travel, Soft Aether at its rest opacities.
 * Shared by every pre-ceremony phase (idle / aware / inviting).
 */
const ATMOSPHERE_REST_POSE: AtmosphereCeremonyPose = {
  indigoFar: { opacity: ATMOSPHERE_REST.indigoFar, x: 0, y: 0 },
  indigoNear: { opacity: ATMOSPHERE_REST.indigoNear, x: 0, y: 0 },
  cyanAccent: { opacity: ATMOSPHERE_REST.cyanAccent, x: 0, y: 0 },
};

/**
 * Ceremony holds — light gathers / cyan strengthens / drift pauses.
 * Opacity deltas stay small so Soft Aether never overpowers the seal.
 */
export const atmospherePhaseMotion: Record<
  ArrivalPhase,
  AtmosphereCeremonyPose
> = {
  idle: ATMOSPHERE_REST_POSE,
  aware: ATMOSPHERE_REST_POSE,
  inviting: ATMOSPHERE_REST_POSE,
  accepting: {
    indigoFar: { opacity: 0.54, x: '0.2%', y: '-0.15%' },
    indigoNear: { opacity: 0.42, x: '-0.15%', y: '0.1%' },
    cyanAccent: { opacity: 0.28, x: 0, y: 0 },
  },
  crossing: {
    indigoFar: { opacity: 0.58, x: 0, y: 0 },
    indigoNear: { opacity: 0.44, x: 0, y: 0 },
    cyanAccent: { opacity: 0.34, x: 0, y: 0 },
  },
  settling: {
    indigoFar: { opacity: 0.52, x: 0, y: 0 },
    indigoNear: { opacity: 0.39, x: 0, y: 0 },
    cyanAccent: { opacity: 0.24, x: 0, y: 0 },
  },
};

/** Reduced motion: same phases, opacity-only echo (no translate). */
export const atmospherePhaseMotionReduced: Record<
  ArrivalPhase,
  AtmosphereCeremonyPose
> = {
  idle: atmospherePhaseMotion.idle,
  aware: atmospherePhaseMotion.aware,
  inviting: atmospherePhaseMotion.inviting,
  accepting: {
    indigoFar: { opacity: 0.54, x: 0, y: 0 },
    indigoNear: { opacity: 0.42, x: 0, y: 0 },
    cyanAccent: { opacity: 0.28, x: 0, y: 0 },
  },
  crossing: {
    indigoFar: { opacity: 0.56, x: 0, y: 0 },
    indigoNear: { opacity: 0.43, x: 0, y: 0 },
    cyanAccent: { opacity: 0.32, x: 0, y: 0 },
  },
  settling: {
    indigoFar: { opacity: 0.51, x: 0, y: 0 },
    indigoNear: { opacity: 0.39, x: 0, y: 0 },
    cyanAccent: { opacity: 0.23, x: 0, y: 0 },
  },
};

/** Atmosphere leads the cascade — no delay (Hero uses DELAY.SHORT). */
export const atmospherePhaseTransition: Record<ArrivalPhase, Transition> =
  createEchoPhaseTransitions(DELAY.NONE);

export const atmospherePhaseTransitionReduced: Transition =
  echoPhaseTransitionReduced;
