'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { spacing, zIndex } from '@/shared/config/theme';
import { legibility } from '@/shared/lib/graphics';
import { heroReveal } from '@/shared/lib/motion';
import { Surface } from '@/shared/ui/surface';
import { cn } from '@/lib/utils';

import { HERO_COPY, HERO_TITLE_SCALE } from './hero.constants';
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
    <Surface
      variant="transparent"
      className="relative"
      style={{ zIndex: zIndex.content }}
    >
      <motion.section className="text-center" {...heroReveal}>
        <motion.div
          data-slot="hero"
          data-phase={phase}
          className="flex flex-col items-center"
          style={{ gap: spacing.md }}
          animate={pose}
          transition={transition}
        >
          <p
            data-slot="hero-eyebrow"
            className={cn(
              'text-[0.6875rem] uppercase tracking-[0.42em] text-ring/80',
              legibility.copy,
            )}
          >
            {HERO_COPY.regionalSpace}
          </p>

          <div className="flex flex-col items-center" style={{ gap: spacing.sm }}>
            <span
              aria-hidden="true"
              className="size-2.5 rotate-45 border border-ring/45 bg-ring/10"
            />
            <div className="flex items-center" style={{ gap: spacing.sm }}>
              <span
                aria-hidden="true"
                className="h-px w-6 bg-gradient-to-r from-transparent to-ring/40"
              />
              <p
                className={cn(
                  'text-[0.6875rem] uppercase tracking-[0.42em] text-ring/90',
                  legibility.copy,
                )}
              >
                {HERO_COPY.present}
              </p>
              <span
                aria-hidden="true"
                className="h-px w-6 bg-gradient-to-l from-transparent to-ring/40"
              />
            </div>
          </div>

          <h1
            data-slot="hero-title"
            className={cn(
              'text-foreground',
              HERO_TITLE_SCALE,
              legibility.display,
            )}
          >
            {HERO_COPY.title}
          </h1>

          <span
            aria-hidden="true"
            className="h-px w-28 bg-gradient-to-r from-transparent via-ring/45 to-transparent"
          />

          <p
            data-slot="hero-invitation"
            className={cn(
              'max-w-md text-sm leading-relaxed text-foreground/75',
              legibility.copy,
            )}
          >
            {HERO_COPY.invitation}
          </p>
        </motion.div>
      </motion.section>
    </Surface>
  );
}
