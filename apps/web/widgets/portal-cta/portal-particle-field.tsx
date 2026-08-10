'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

import type { PortalPhase } from './portal-cta.types';
import {
  PORTAL_PARTICLE_POOL,
  createPortalParticleCycle,
  portalParticleActiveCount,
} from './portal-particle.motion';

export interface PortalParticleFieldProps {
  phase: PortalPhase;
  reduceMotion?: boolean;
}

/**
 * Portal Particle Engine — recycled DOM motes inside the geometry host.
 *
 * Consumes Gravity intensity via `portal-particle.motion.ts`.
 * Does not alter Gravity, plates, or geometry structure.
 */
export function PortalParticleField({
  phase,
  reduceMotion = false,
}: PortalParticleFieldProps) {
  const active = portalParticleActiveCount(phase, reduceMotion);

  return (
    <div
      data-slot="portal-particle-field"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {Array.from({ length: PORTAL_PARTICLE_POOL }, (_, index) => (
        <PortalParticle
          key={index}
          index={index}
          active={index < active}
          phase={phase}
          reduceMotion={reduceMotion}
        />
      ))}
    </div>
  );
}

interface PortalParticleProps {
  index: number;
  active: boolean;
  phase: PortalPhase;
  reduceMotion: boolean;
}

function PortalParticle({
  index,
  active,
  phase,
  reduceMotion,
}: PortalParticleProps) {
  const [generation, setGeneration] = useState(0);
  const cycle = createPortalParticleCycle(
    index,
    generation,
    phase,
    reduceMotion,
  );

  if (!active) {
    return (
      <span
        className="absolute left-1/2 top-1/2 size-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
        data-particle={index}
        data-active="false"
      />
    );
  }

  return (
    <motion.span
      data-particle={index}
      data-active="true"
      className="absolute left-1/2 top-1/2 size-0.5 rounded-full"
      style={{
        marginLeft: -1,
        marginTop: -1,
        background:
          'color-mix(in oklab, var(--ring) 55%, var(--foreground))',
      }}
      initial={false}
      animate={{
        x: cycle.x,
        y: cycle.y,
        opacity: cycle.opacity,
      }}
      transition={cycle.transition}
      onAnimationComplete={() => {
        setGeneration((g) => g + 1);
      }}
    />
  );
}
