'use client';

import type { Transition } from 'framer-motion';
import { motion, useReducedMotion } from 'framer-motion';

import { zIndex } from '@/shared/config/theme';
import {
  isCeremonyPhase,
  phaseTransition,
  phaseValue,
} from '@/shared/lib/motion';
import { cn } from '@/lib/utils';

import type {
  AtmosphereLayerPose,
  DriftMotion,
  DriftTransition,
} from './atmosphere-layer.motion';
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
  const reduceMotion = !!useReducedMotion();
  /** Drift pauses on a ceremony pose (and always under reduced motion). */
  const hold = reduceMotion || isCeremonyPhase(phase);
  const poses = phaseValue(
    phase,
    reduceMotion,
    atmospherePhaseMotion,
    atmospherePhaseMotionReduced,
  );
  const ceremonyTransition = phaseTransition(
    phase,
    reduceMotion,
    atmospherePhaseTransition,
    atmospherePhaseTransitionReduced,
  );

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
        <AtmospherePlane
          className="absolute inset-[-12%]"
          background="radial-gradient(ellipse 70% 55% at 48% 42%, color-mix(in oklab, var(--primary) 28%, transparent), transparent 68%)"
          hold={hold}
          pose={poses.indigoFar}
          drift={indigoFarDrift}
          holdTransition={ceremonyTransition}
          driftTransition={indigoFarTransition}
        />

        {/* Moving 2/3 — near indigo haze (counter-phase) */}
        <AtmospherePlane
          className="absolute inset-[-10%]"
          background="radial-gradient(ellipse 55% 45% at 58% 48%, color-mix(in oklab, var(--primary) 20%, transparent), transparent 65%)"
          hold={hold}
          pose={poses.indigoNear}
          drift={indigoNearDrift}
          holdTransition={ceremonyTransition}
          driftTransition={indigoNearTransition}
        />

        {/* Moving 3/3 — restrained cyan accent */}
        <AtmospherePlane
          className="absolute inset-[-8%]"
          background="radial-gradient(ellipse 40% 32% at 42% 55%, color-mix(in oklab, var(--ring) 16%, transparent), transparent 70%)"
          hold={hold}
          pose={poses.cyanAccent}
          drift={cyanAccentDrift}
          holdTransition={ceremonyTransition}
          driftTransition={cyanAccentTransition}
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

interface AtmospherePlaneProps {
  /** Layout only — the plane's inset within the atmosphere. */
  className: string;
  background: string;
  /** When true the plane holds a ceremony pose instead of drifting. */
  hold: boolean;
  pose: AtmosphereLayerPose;
  drift: DriftMotion;
  holdTransition: Transition;
  driftTransition: DriftTransition;
}

/**
 * One moving depth plane.
 *
 * Every plane behaves identically — ambient drift at rest, a held pose during
 * ceremony — and differs only in its gradient and drift values.
 */
function AtmospherePlane({
  className,
  background,
  hold,
  pose,
  drift,
  holdTransition,
  driftTransition,
}: AtmospherePlaneProps) {
  return (
    <motion.div
      className={className}
      initial={false}
      animate={hold ? pose : drift}
      transition={hold ? holdTransition : driftTransition}
      style={{ background }}
    />
  );
}
