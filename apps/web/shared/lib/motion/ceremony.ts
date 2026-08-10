/**
 * Shared ceremony vocabulary.
 *
 * Portal (local `PortalPhase`) and the Director (`ArrivalPhase`) share one
 * emotional clock: the same committed phases, the same dwells, and — for
 * environmental / identity echoes — the same per-phase transition feel. Those
 * values used to be re-declared in every widget; they live here so a single
 * retune reaches Portal, Atmosphere, and Hero at once.
 *
 * Phase *ownership* is unchanged: scenes still declare their own phase unions
 * and widgets still subscribe to their director. This module only owns values
 * keyed by phase name.
 */

import type { Transition } from 'framer-motion';

import { DELAY, DURATION, EASING } from './constants';
import {
  cinematicTransition,
  fastTransition,
  normalTransition,
  slowTransition,
} from './transitions';

/**
 * Phases in which the ceremony is committed: interaction locks and performers
 * respond instead of resting.
 */
export const CEREMONY_PHASES: ReadonlySet<string> = new Set([
  'accepting',
  'crossing',
  'settling',
]);

/** True once commitment has begun (Accepting → Crossing → Settling). */
export function isCeremonyPhase(phase: string): boolean {
  return CEREMONY_PHASES.has(phase);
}

/**
 * Dwell before the next ceremony beat (seconds).
 * Timing philosophy: short Crossing, longer Settling memory.
 */
export const CEREMONY_SEQUENCE = {
  accepting: DURATION.NORMAL,
  crossing: DURATION.NORMAL,
  settling: DURATION.CINEMATIC,
} as const;

/** Abbreviated dwells when `prefers-reduced-motion` is set. */
export const CEREMONY_SEQUENCE_REDUCED = {
  accepting: DURATION.FAST,
  crossing: DURATION.FAST,
  settling: DURATION.NORMAL,
} as const;

/**
 * Echo transitions per phase — the response feel shared by performers that
 * follow the Portal (Atmosphere, Hero). Portal itself leads and keeps its own,
 * shorter timings.
 */
const CEREMONY_ECHO_TRANSITION = {
  idle: { ...slowTransition, ease: EASING.exit },
  aware: fastTransition,
  inviting: fastTransition,
  accepting: normalTransition,
  crossing: cinematicTransition,
  settling: { ...slowTransition, ease: EASING.exit },
} satisfies Record<string, Transition>;

/** Phase keys covered by the echo transitions. */
export type CeremonyEchoPhase = keyof typeof CEREMONY_ECHO_TRANSITION;

/**
 * Echo transitions offset by a cascade delay, so followers can order themselves
 * behind the Portal (Atmosphere leads with `DELAY.NONE`, Hero trails with
 * `DELAY.SHORT`) without re-declaring durations or easings.
 */
export function createEchoPhaseTransitions(
  delay: number,
): Record<CeremonyEchoPhase, Transition> {
  return {
    idle: { ...CEREMONY_ECHO_TRANSITION.idle, delay },
    aware: { ...CEREMONY_ECHO_TRANSITION.aware, delay },
    inviting: { ...CEREMONY_ECHO_TRANSITION.inviting, delay },
    accepting: { ...CEREMONY_ECHO_TRANSITION.accepting, delay },
    crossing: { ...CEREMONY_ECHO_TRANSITION.crossing, delay },
    settling: { ...CEREMONY_ECHO_TRANSITION.settling, delay },
  };
}

/** Single reduced-motion echo transition: one snappy feel for every phase. */
export const echoPhaseTransitionReduced: Transition = {
  ...fastTransition,
  delay: DELAY.NONE,
};
