'use client';

import { motion } from 'framer-motion';

import { phaseTransition, phaseValue } from '@/shared/lib/motion';
import { cn } from '@/lib/utils';

import {
  isPortalAmbientIdle,
  portalChamberPhase,
  portalChamberPhaseReduced,
  portalFieldPhase,
  portalFieldPhaseReduced,
  portalHairlinePhase,
  portalHairlinePhaseReduced,
  portalPhaseTransition,
  portalPhaseTransitionReduced,
  portalPlateFarPhase,
  portalPlateFarPhaseReduced,
  portalPlateNearIdle,
  portalPlateNearIdleTransition,
  portalPlateNearPhase,
  portalPlateNearPhaseReduced,
  portalSeamIdle,
  portalSeamIdleTransition,
  portalSeamPhase,
  portalSeamPhaseReduced,
  portalSingularityPhase,
  portalSingularityPhaseReduced,
} from './portal-cta.motion';
import {
  PORTAL_FIELD,
  PORTAL_GEOMETRY_SIZE_CLASS,
  PORTAL_HAIRLINE,
  PORTAL_PLATE_CLIP,
  PORTAL_SEAM,
} from './portal-geometry.constants';
import type { PortalGeometryProps } from './portal-geometry.types';
import { PortalParticleField } from './portal-particle-field';

/**
 * PortalGeometry — Impossible Threshold structure, idle ambient life,
 * phase/ceremony responses, Gravity poses, and Particle Engine host mount.
 *
 * Animation values live in `portal-cta.motion.ts` / `portal-particle.motion.ts`.
 * Ambient loops only when `isPortalAmbientIdle`; particles recycle in-host.
 */
export function PortalGeometry({
  className,
  reduceMotion = false,
  phase = 'idle',
}: PortalGeometryProps) {
  const ambient = isPortalAmbientIdle(phase, reduceMotion);
  const responseTransition = phaseTransition(
    phase,
    reduceMotion,
    portalPhaseTransition,
    portalPhaseTransitionReduced,
  );

  const plateNearAnimate = ambient
    ? portalPlateNearIdle
    : phaseValue(
        phase,
        reduceMotion,
        portalPlateNearPhase,
        portalPlateNearPhaseReduced,
      );
  const plateNearTransition = ambient
    ? portalPlateNearIdleTransition
    : responseTransition;

  const plateFarAnimate = phaseValue(
    phase,
    reduceMotion,
    portalPlateFarPhase,
    portalPlateFarPhaseReduced,
  );

  const seamAnimate = ambient
    ? portalSeamIdle
    : phaseValue(phase, reduceMotion, portalSeamPhase, portalSeamPhaseReduced);
  const seamTransition = ambient
    ? portalSeamIdleTransition
    : responseTransition;

  const hairlineAnimate = phaseValue(
    phase,
    reduceMotion,
    portalHairlinePhase,
    portalHairlinePhaseReduced,
  );

  const singularityAnimate = phaseValue(
    phase,
    reduceMotion,
    portalSingularityPhase,
    portalSingularityPhaseReduced,
  );

  const fieldAnimate = phaseValue(
    phase,
    reduceMotion,
    portalFieldPhase,
    portalFieldPhaseReduced,
  );

  const chamberAnimate = phaseValue(
    phase,
    reduceMotion,
    portalChamberPhase,
    portalChamberPhaseReduced,
  );

  return (
    <div
      data-slot="portal-geometry"
      data-phase={phase}
      className={cn(PORTAL_GEOMETRY_SIZE_CLASS, className)}
    >
      <motion.div
        data-slot="portal-field"
        className="pointer-events-none absolute rounded-[40%]"
        style={{
          inset: PORTAL_FIELD.inset,
          background:
            'radial-gradient(ellipse 55% 65% at 46% 48%, color-mix(in oklab, var(--primary) 14%, transparent), transparent 70%)',
        }}
        initial={false}
        animate={fieldAnimate}
        transition={responseTransition}
      />

      <motion.div
        data-slot="portal-plate-near"
        className="pointer-events-none absolute inset-0"
        style={{
          clipPath: PORTAL_PLATE_CLIP.near,
          background:
            'linear-gradient(145deg, color-mix(in oklab, var(--primary) 22%, var(--card)) 0%, color-mix(in oklab, var(--card) 70%, var(--background)) 55%, var(--background) 100%)',
          opacity: 0.55,
        }}
        initial={false}
        animate={plateNearAnimate}
        transition={plateNearTransition}
      />

      <motion.div
        data-slot="portal-plate-far"
        className="pointer-events-none absolute inset-0"
        style={{
          clipPath: PORTAL_PLATE_CLIP.far,
          background:
            'linear-gradient(210deg, color-mix(in oklab, var(--card) 80%, var(--background)) 0%, color-mix(in oklab, var(--primary) 12%, var(--background)) 100%)',
          opacity: 0.42,
        }}
        initial={false}
        animate={plateFarAnimate}
        transition={responseTransition}
      />

      <motion.div
        data-slot="portal-chamber"
        className="pointer-events-none absolute inset-[22%] rounded-[32%]"
        style={{
          background:
            'radial-gradient(ellipse 70% 80% at 48% 50%, var(--background) 0%, color-mix(in oklab, var(--background) 85%, transparent) 55%, transparent 75%)',
        }}
        initial={false}
        animate={chamberAnimate}
        transition={responseTransition}
      />

      <PortalParticleField phase={phase} reduceMotion={reduceMotion} />

      <motion.div
        data-slot="portal-seam"
        className="pointer-events-none absolute"
        style={{
          width: PORTAL_SEAM.width,
          height: PORTAL_SEAM.height,
          top: PORTAL_SEAM.top,
          left: PORTAL_SEAM.left,
          transform: `rotate(${PORTAL_SEAM.rotate})`,
          background:
            'linear-gradient(180deg, transparent 0%, color-mix(in oklab, var(--ring) 55%, transparent) 12%, color-mix(in oklab, var(--foreground) 75%, var(--ring)) 48%, color-mix(in oklab, var(--ring) 60%, transparent) 82%, transparent 100%)',
        }}
        initial={false}
        animate={seamAnimate}
        transition={seamTransition}
      />

      <motion.div
        data-slot="portal-hairline"
        className="pointer-events-none absolute"
        style={{
          width: PORTAL_HAIRLINE.width,
          height: PORTAL_HAIRLINE.height,
          top: PORTAL_HAIRLINE.top,
          left: PORTAL_HAIRLINE.left,
          transform: `rotate(${PORTAL_HAIRLINE.rotate})`,
          background:
            'linear-gradient(180deg, transparent, color-mix(in oklab, var(--primary) 45%, transparent), transparent)',
        }}
        initial={false}
        animate={hairlineAnimate}
        transition={responseTransition}
      />

      <motion.div
        data-slot="portal-singularity"
        className="pointer-events-none absolute left-1/2 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full md:size-3"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, var(--foreground) 0%, color-mix(in oklab, var(--ring) 40%, var(--foreground)) 35%, transparent 72%)',
        }}
        initial={false}
        animate={singularityAnimate}
        transition={responseTransition}
      />
    </div>
  );
}
