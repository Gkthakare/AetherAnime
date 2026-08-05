/**
 * Hero ceremony response — yield, do not perform.
 *
 * Mount reveal stays in the Motion Foundation (`heroReveal`).
 * Yield stays within Experience Budget: opacity ≥ 0.94, translate ≤ 3px.
 *
 * Hero never imports Portal or Atmosphere.
 */

import type { Transition } from 'framer-motion';

import { DELAY, EASING } from '@/shared/lib/motion';
import {
  cinematicTransition,
  fastTransition,
  normalTransition,
  slowTransition,
} from '@/shared/lib/motion';

import type { ArrivalPhase } from '../arrival-scene/arrival-scene.types';

type HeroPhaseMotion = {
  opacity: number;
  y: number;
};

/**
 * Rest / yield poses (px).
 * Budget: minimum opacity 0.94 · maximum translate 3px.
 */
export const heroPhaseMotion: Record<ArrivalPhase, HeroPhaseMotion> = {
  idle: { opacity: 1, y: 0 },
  aware: { opacity: 1, y: 0 },
  inviting: { opacity: 1, y: 0 },
  accepting: { opacity: 0.97, y: 2 },
  crossing: { opacity: 0.94, y: 3 },
  settling: { opacity: 0.98, y: 1 },
};

/** Reduced motion: same phases, opacity-only yield (no translate). */
export const heroPhaseMotionReduced: Record<ArrivalPhase, HeroPhaseMotion> = {
  idle: { opacity: 1, y: 0 },
  aware: { opacity: 1, y: 0 },
  inviting: { opacity: 1, y: 0 },
  accepting: { opacity: 0.97, y: 0 },
  crossing: { opacity: 0.94, y: 0 },
  settling: { opacity: 0.98, y: 0 },
};

/**
 * Phase transitions. `DELAY.SHORT` lets Atmosphere echo before Hero yields
 * (cascade: Portal → Atmosphere → Hero).
 */
export const heroPhaseTransition: Record<ArrivalPhase, Transition> = {
  idle: { ...slowTransition, delay: DELAY.SHORT, ease: EASING.exit },
  aware: { ...fastTransition, delay: DELAY.SHORT },
  inviting: { ...fastTransition, delay: DELAY.SHORT },
  accepting: { ...normalTransition, delay: DELAY.SHORT },
  crossing: { ...cinematicTransition, delay: DELAY.SHORT },
  settling: { ...slowTransition, delay: DELAY.SHORT, ease: EASING.exit },
};

export const heroPhaseTransitionReduced: Transition = {
  ...fastTransition,
  delay: DELAY.NONE,
};
