/**
 * Composed motion presets.
 *
 * Presets are the top layer of the foundation and the primary surface widgets
 * consume. Each preset bundles a variant, a transition, and the orchestration
 * props (initial / animate / whileInView) into a single object that can be
 * spread directly onto a `motion.*` element. A widget should describe *which*
 * reveal it wants (`heroReveal`), never the individual animation values.
 */

import type { Transition, Variants } from 'framer-motion';

import { DELAY } from './constants';
import { cinematicTransition, normalTransition, slowTransition } from './transitions';
import { scaleIn, slideUp } from './variants';

/** Viewport configuration for scroll-triggered reveals. */
export interface MotionViewport {
  once?: boolean;
  amount?: number | 'some' | 'all';
}

/**
 * A ready-to-spread motion configuration.
 *
 * The optional string fields reference variant state keys (e.g. `'hidden'`,
 * `'visible'`) so the same preset works whether a widget animates on mount
 * (`animate`) or on scroll (`whileInView`).
 */
export interface MotionPreset {
  variants: Variants;
  transition?: Transition;
  initial?: string | boolean;
  animate?: string;
  whileInView?: string;
  exit?: string;
  viewport?: MotionViewport;
}

/**
 * Hero-level entrance.
 *
 * Cinematic rise on mount for the most important, above-the-fold content.
 */
export const heroReveal: MotionPreset = {
  variants: slideUp,
  transition: { ...cinematicTransition, delay: DELAY.SHORT },
  initial: 'hidden',
  animate: 'visible',
};

/**
 * Section-level reveal.
 *
 * Deliberate rise triggered as the section scrolls into view.
 */
export const sectionReveal: MotionPreset = {
  variants: slideUp,
  transition: slowTransition,
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, amount: 0.3 },
};

/**
 * Card-level reveal.
 *
 * Subtle scale-in for grid and list items as they enter the viewport.
 */
export const cardReveal: MotionPreset = {
  variants: scaleIn,
  transition: normalTransition,
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, amount: 0.2 },
};

/** Aggregate lookup of every named preset. */
export const presets = {
  heroReveal,
  sectionReveal,
  cardReveal,
} satisfies Record<string, MotionPreset>;

export type PresetName = keyof typeof presets;
