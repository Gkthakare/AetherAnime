'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { zIndex } from '@/shared/config/theme';
import { cn } from '@/lib/utils';

import type { ArrivalPhase } from '../arrival-scene/arrival-scene.types';

import {
  atmosphereEnter,
  atmosphereEnterTransition,
  atmospherePhaseMotion,
  atmospherePhaseMotionReduced,
  atmospherePhaseTransition,
  atmospherePhaseTransitionReduced,
  cyanAccentDrift,
  cyanAccentTransition,
  indigoFarDrift,
  indigoFarTransition,
  indigoNearDrift,
  indigoNearTransition,
} from './atmosphere-layer.motion';
import type { AtmosphereLayerProps } from './atmosphere-layer.types';

function isCeremonyPhase(phase: ArrivalPhase): boolean {
  return (
    phase === 'accepting' || phase === 'crossing' || phase === 'settling'
  );
}

/**
 * AtmosphereLayer — living environmental depth behind Arrival content.
 *
 * Environmental echo performer: subscribes to `ArrivalPhase` only. Never
 * imports Portal or Hero. Soft Aether must never overpower the Portal seal.
 *
 * Visual budget: ≤3 moving layers, transform + opacity only, no particles /
 * WebGL / bloom.
 *
 * Layering: ExperienceLayout → ArrivalScene → AtmosphereLayer (z-background).
 */
export function AtmosphereLayer({
  phase = 'idle',
  className,
  ...props
}: AtmosphereLayerProps) {
  const reduceMotion = useReducedMotion();
  const ceremony = isCeremonyPhase(phase);
  const poses = reduceMotion
    ? atmospherePhaseMotionReduced[phase]
    : atmospherePhaseMotion[phase];
  const phaseTransition = reduceMotion
    ? atmospherePhaseTransitionReduced
    : atmospherePhaseTransition[phase];

  return (
    <div
      data-slot="atmosphere-layer"
      data-phase={phase}
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden',
        className,
      )}
      style={{ zIndex: zIndex.background }}
      {...props}
    >
      {/* Static void — Theme background → surface depth (no motion). */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, var(--background) 0%, color-mix(in oklab, var(--card) 55%, var(--background)) 100%)',
        }}
      />

      <motion.div
        className="absolute inset-0"
        variants={atmosphereEnter}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        transition={atmosphereEnterTransition}
      >
        {/* Moving 1/3 — far indigo haze */}
        <motion.div
          className="absolute inset-[-12%]"
          initial={false}
          animate={
            reduceMotion || ceremony
              ? poses.indigoFar
              : indigoFarDrift
          }
          transition={
            reduceMotion || ceremony
              ? phaseTransition
              : indigoFarTransition
          }
          style={{
            background:
              'radial-gradient(ellipse 70% 55% at 48% 42%, color-mix(in oklab, var(--primary) 28%, transparent), transparent 68%)',
          }}
        />

        {/* Moving 2/3 — near indigo haze (counter-phase) */}
        <motion.div
          className="absolute inset-[-10%]"
          initial={false}
          animate={
            reduceMotion || ceremony
              ? poses.indigoNear
              : indigoNearDrift
          }
          transition={
            reduceMotion || ceremony
              ? phaseTransition
              : indigoNearTransition
          }
          style={{
            background:
              'radial-gradient(ellipse 55% 45% at 58% 48%, color-mix(in oklab, var(--primary) 20%, transparent), transparent 65%)',
          }}
        />

        {/* Moving 3/3 — restrained cyan accent */}
        <motion.div
          className="absolute inset-[-8%]"
          initial={false}
          animate={
            reduceMotion || ceremony
              ? poses.cyanAccent
              : cyanAccentDrift
          }
          transition={
            reduceMotion || ceremony
              ? phaseTransition
              : cyanAccentTransition
          }
          style={{
            background:
              'radial-gradient(ellipse 40% 32% at 42% 55%, color-mix(in oklab, var(--ring) 16%, transparent), transparent 70%)',
          }}
        />
      </motion.div>

      {/* Static vignette — keeps focus toward center / Hero */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 75% 70% at 50% 45%, transparent 40%, color-mix(in oklab, var(--background) 75%, transparent) 100%)',
        }}
      />
    </div>
  );
}
