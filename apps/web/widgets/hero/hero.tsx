'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { heroReveal } from '@/shared/lib/motion';
import { Surface } from '@/shared/ui/surface';

import {
  heroPhaseMotion,
  heroPhaseMotionReduced,
  heroPhaseTransition,
  heroPhaseTransitionReduced,
} from './hero.motion';
import type { HeroProps } from './hero.types';

/**
 * Hero — Arrival identity performer.
 *
 * Owns brand presence only. Subscribes to `ArrivalPhase` from the Director;
 * yields focus during accepting / crossing / settling. Never imports Portal
 * or Atmosphere.
 *
 * Layering: ExperienceLayout → ArrivalScene → Hero (z-content).
 */
export function Hero({ phase = 'idle' }: HeroProps) {
  const reduceMotion = useReducedMotion();
  const pose = reduceMotion
    ? heroPhaseMotionReduced[phase]
    : heroPhaseMotion[phase];
  const transition = reduceMotion
    ? heroPhaseTransitionReduced
    : heroPhaseTransition[phase];

  return (
    <Surface variant="transparent">
      <motion.section className="text-center" {...heroReveal}>
        <motion.div
          data-slot="hero"
          data-phase={phase}
          animate={pose}
          transition={transition}
        >
          <h1 className="text-6xl font-bold tracking-tight text-foreground md:text-8xl">
            AetherAnime
          </h1>

          <p className="mt-6 text-lg text-muted-foreground md:text-xl">
            Enter the World Beyond the Screen
          </p>
        </motion.div>
      </motion.section>
    </Surface>
  );
}
