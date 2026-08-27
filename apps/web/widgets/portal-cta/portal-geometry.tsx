'use client';

import { motion } from 'framer-motion';

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
  PORTAL_GATE_FRAME,
  PORTAL_GEOMETRY_SIZE_CLASS,
  PORTAL_HAIRLINE,
  PORTAL_MATERIAL,
  PORTAL_PLATE_CLIP,
  PORTAL_SEAM,
  PORTAL_SINGULARITY,
} from './portal-geometry.constants';
import type { PortalGeometryProps } from './portal-geometry.types';
import { PortalParticleField } from './portal-particle-field';

/**
 * PortalGeometry — Impossible Threshold structure, idle ambient life,
 * phase/ceremony responses, Gravity poses, and Particle Engine host mount.
 *
 * Task-009: cinematic material / luminance / depth fidelity.
 * Animation values live in `portal-cta.motion.ts` / `portal-particle.motion.ts`.
 * Ambient loops only when `isPortalAmbientIdle`; particles recycle in-host.
 */
export function PortalGeometry({
  className,
  reduceMotion = false,
  phase = 'idle',
}: PortalGeometryProps) {
  const ambient = isPortalAmbientIdle(phase, reduceMotion);
  const phaseTransition = reduceMotion
    ? portalPhaseTransitionReduced
    : portalPhaseTransition[phase];

  const plateNearAnimate = ambient
    ? portalPlateNearIdle
    : reduceMotion
      ? portalPlateNearPhaseReduced[phase]
      : portalPlateNearPhase[phase];
  const plateNearTransition = ambient
    ? portalPlateNearIdleTransition
    : phaseTransition;

  const plateFarAnimate = reduceMotion
    ? portalPlateFarPhaseReduced[phase]
    : portalPlateFarPhase[phase];

  const seamAnimate = ambient
    ? portalSeamIdle
    : reduceMotion
      ? portalSeamPhaseReduced[phase]
      : portalSeamPhase[phase];
  const seamTransition = ambient ? portalSeamIdleTransition : phaseTransition;

  const hairlineAnimate = reduceMotion
    ? portalHairlinePhaseReduced[phase]
    : portalHairlinePhase[phase];

  const singularityAnimate = reduceMotion
    ? portalSingularityPhaseReduced[phase]
    : portalSingularityPhase[phase];

  const fieldAnimate = reduceMotion
    ? portalFieldPhaseReduced[phase]
    : portalFieldPhase[phase];

  const chamberAnimate = reduceMotion
    ? portalChamberPhaseReduced[phase]
    : portalChamberPhase[phase];

  return (
    <div
      data-slot="portal-geometry"
      data-phase={phase}
      className={cn(PORTAL_GEOMETRY_SIZE_CLASS, className)}
    >
      <div
        data-slot="portal-gate-frame"
        aria-hidden="true"
        className={PORTAL_GATE_FRAME.outer}
      />
      <div
        data-slot="portal-gate-aperture"
        aria-hidden="true"
        className={PORTAL_GATE_FRAME.aperture}
      />

      {/* Far atmosphere — static cosmic depth (no ambient loop). */}
      <div
        data-slot="portal-atmosphere"
        aria-hidden="true"
        className="pointer-events-none absolute rounded-[42%] opacity-[0.85] transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
        style={{
          inset: '-28%',
          background: PORTAL_MATERIAL.atmosphere,
        }}
      />

      <motion.div
        data-slot="portal-field"
        className="pointer-events-none absolute rounded-[38%]"
        style={{
          inset: PORTAL_FIELD.inset,
          background: PORTAL_MATERIAL.field,
        }}
        initial={false}
        animate={fieldAnimate}
        transition={phaseTransition}
      />

      <motion.div
        data-slot="portal-plate-near"
        className="pointer-events-none absolute inset-0"
        style={{
          clipPath: PORTAL_PLATE_CLIP.near,
          background: PORTAL_MATERIAL.plateNear,
          opacity: 0.72,
        }}
        initial={false}
        animate={plateNearAnimate}
        transition={plateNearTransition}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: PORTAL_MATERIAL.plateEdgeNear, opacity: 0.55 }}
        />
      </motion.div>

      <motion.div
        data-slot="portal-plate-far"
        className="pointer-events-none absolute inset-0"
        style={{
          clipPath: PORTAL_PLATE_CLIP.far,
          background: PORTAL_MATERIAL.plateFar,
          opacity: 0.58,
        }}
        initial={false}
        animate={plateFarAnimate}
        transition={phaseTransition}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: PORTAL_MATERIAL.plateEdgeFar, opacity: 0.45 }}
        />
      </motion.div>

      <motion.div
        data-slot="portal-chamber"
        className="pointer-events-none absolute inset-[18%] rounded-[28%]"
        style={{
          background: PORTAL_MATERIAL.chamber,
        }}
        initial={false}
        animate={chamberAnimate}
        transition={phaseTransition}
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
          background: PORTAL_MATERIAL.seam,
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
          background: PORTAL_MATERIAL.hairline,
        }}
        initial={false}
        animate={hairlineAnimate}
        transition={phaseTransition}
      />

      <motion.div
        data-slot="portal-singularity"
        className={cn(
          'pointer-events-none absolute',
          PORTAL_SINGULARITY.className,
        )}
        style={{
          background: PORTAL_MATERIAL.singularity,
        }}
        initial={false}
        animate={singularityAnimate}
        transition={phaseTransition}
      />
    </div>
  );
}
