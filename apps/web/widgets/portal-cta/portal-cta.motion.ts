/**
 * PortalCTA motion — ceremony timing, mount enter, Living Threshold idle,
 * event-driven phase responses, Crossing Ceremony, and Gravity Engine.
 *
 * Idle ambient (Task-007): max TWO continuous loops (near plate + seam).
 * Phase / ceremony (Task-008–009): one-shot transform/opacity — no new loops.
 * Gravity Engine (Task-010): invisible inward want composed into existing maps.
 *
 * Canon: `docs/design/PORTAL_MOTION.md`
 */

import type { Transition } from 'framer-motion';

import { DISTANCE, DURATION, EASING } from '@/shared/lib/motion';

import type { PortalPhase } from './portal-cta.types';
import { PORTAL_FIELD } from './portal-geometry.constants';

/** Phases during which activation must be locked. */
const LOCKED_PHASES: ReadonlySet<PortalPhase> = new Set([
  'accepting',
  'crossing',
  'settling',
]);

export function isPortalLocked(phase: PortalPhase): boolean {
  return LOCKED_PHASES.has(phase);
}

/** True when Living Threshold ambient loops should run (full motion + idle). */
export function isPortalAmbientIdle(
  phase: PortalPhase,
  reduceMotion: boolean,
): boolean {
  return phase === 'idle' && !reduceMotion;
}

/**
 * Accept sequence dwell per phase (seconds), composed from foundation durations.
 * Timing philosophy: short Crossing, longer Settling memory.
 */
export const PORTAL_SEQUENCE = {
  accepting: DURATION.NORMAL,
  crossing: DURATION.NORMAL,
  settling: DURATION.CINEMATIC,
} as const;

/** Abbreviated dwells when `prefers-reduced-motion` is set. */
export const PORTAL_SEQUENCE_REDUCED = {
  accepting: DURATION.FAST,
  crossing: DURATION.FAST,
  settling: DURATION.NORMAL,
} as const;

/** Mount reveal for the invitation block (transform + opacity only). */
export const portalEnterTransition: Transition = {
  duration: DURATION.SLOW,
  ease: EASING.cinematic,
  delay: DURATION.FAST,
};

/**
 * Ambient idle periods — composed from Motion Foundation only.
 * Intentionally longer than UI motion (presence, not chrome).
 */
const PORTAL_IDLE_PERIOD = {
  plate: DURATION.CINEMATIC * 28,
  seam: DURATION.CINEMATIC * 20,
} as const;

/** Micro-travel (px) — below conscious “UI move”; never DISTANCE.SM. */
const PORTAL_IDLE_TRAVEL = {
  plate: 1,
} as const;

/**
 * Ceremony unlock travel (px) — Accepting / Crossing only.
 * Composed from foundation distance; stays well below DISTANCE.SM.
 */
const PORTAL_CEREMONY_TRAVEL = {
  plate: DISTANCE.SM / 4,
} as const;

/* -------------------------------------------------------------------------- */
/* Gravity Engine (Task-010) — invisible inward want; not a particle system     */
/* -------------------------------------------------------------------------- */

type PlatePose = { x: number; y: number };
type OpacityPose = { opacity: number };

/**
 * Phase gravity intensity (0–1). Peaks on Crossing field response;
 * Idle is a whisper seed for ambient drift.
 * Future Particle Engine reads this export — does not invent a second force.
 */
export const PORTAL_GRAVITY_INTENSITY: Record<PortalPhase, number> = {
  idle: 0.25,
  inviting: 0.55,
  accepting: 0.85,
  crossing: 1,
  settling: 0.35,
};

/** Plate pull softens on Crossing so ceremony yield (passage) can read. */
const PORTAL_GRAVITY_PLATE_INTENSITY: Record<PortalPhase, number> = {
  idle: 0.3,
  inviting: 0.65,
  accepting: 0.9,
  crossing: 0.2,
  settling: 0.4,
};

/** Max additional inward pull (px) — same order as idle micro-travel. */
const PORTAL_GRAVITY_PULL = PORTAL_IDLE_TRAVEL.plate;

/** Reduced-motion travel scale — hierarchy preserved, amplitude cut. */
const PORTAL_GRAVITY_REDUCED = 0.4;

/** Subliminal density gain for seam / field / singularity / chamber. */
const PORTAL_GRAVITY_DENSITY = {
  seam: 0.04,
  field: 0.08,
  singularity: 0.05,
  chamber: 0.06,
  hairline: 0.06,
} as const;

function portalGravityAmount(
  intensity: number,
  reduceMotion: boolean,
): number {
  return (
    PORTAL_GRAVITY_PULL *
    intensity *
    (reduceMotion ? PORTAL_GRAVITY_REDUCED : 1)
  );
}

function addPose(a: PlatePose, b: PlatePose): PlatePose {
  return { x: a.x + b.x, y: a.y + b.y };
}

/** Near plate sits left of singularity — gravity bias +x / slight +y. */
function nearGravityBias(
  phase: PortalPhase,
  reduceMotion = false,
): PlatePose {
  const g = portalGravityAmount(
    PORTAL_GRAVITY_PLATE_INTENSITY[phase],
    reduceMotion,
  );
  return { x: g, y: g * 0.4 };
}

/** Far plate sits right of singularity — gravity bias −x / slight −y. */
function farGravityBias(
  phase: PortalPhase,
  reduceMotion = false,
): PlatePose {
  const g = portalGravityAmount(
    PORTAL_GRAVITY_PLATE_INTENSITY[phase],
    reduceMotion,
  );
  return { x: -g, y: -g * 0.4 };
}

function gravityDensity(
  phase: PortalPhase,
  base: number,
  gain: number,
  reduceMotion = false,
): number {
  const i =
    PORTAL_GRAVITY_INTENSITY[phase] *
    (reduceMotion ? PORTAL_GRAVITY_REDUCED : 1);
  return Math.min(1, Math.max(0, base + gain * i));
}

function mapPhasePoses(
  base: Record<PortalPhase, PlatePose>,
  bias: (phase: PortalPhase, reduce: boolean) => PlatePose,
  reduce: boolean,
): Record<PortalPhase, PlatePose> {
  return {
    idle: addPose(base.idle, bias('idle', reduce)),
    inviting: addPose(base.inviting, bias('inviting', reduce)),
    accepting: addPose(base.accepting, bias('accepting', reduce)),
    crossing: addPose(base.crossing, bias('crossing', reduce)),
    settling: addPose(base.settling, bias('settling', reduce)),
  };
}

/** Idle gravity whisper — bias ambient keyframes toward the singularity. */
const idleGravity = nearGravityBias('idle');

/**
 * Loop A — near fracture plate (idle ambient only).
 * Living Stone + Gravity Engine inward seed (still ≤ two ambient loops).
 */
export const portalPlateNearIdle: { x: number[]; y: number[] } = {
  x: [
    -PORTAL_IDLE_TRAVEL.plate + idleGravity.x,
    idleGravity.x,
    -PORTAL_IDLE_TRAVEL.plate * 0.5 + idleGravity.x,
    PORTAL_IDLE_TRAVEL.plate * 0.5 + idleGravity.x,
    -PORTAL_IDLE_TRAVEL.plate + idleGravity.x,
  ],
  y: [
    -PORTAL_IDLE_TRAVEL.plate * 0.5 + idleGravity.y,
    PORTAL_IDLE_TRAVEL.plate * 0.25 + idleGravity.y,
    idleGravity.y,
    -PORTAL_IDLE_TRAVEL.plate * 0.25 + idleGravity.y,
    -PORTAL_IDLE_TRAVEL.plate * 0.5 + idleGravity.y,
  ],
};

export const portalPlateNearIdleTransition: Transition = {
  duration: PORTAL_IDLE_PERIOD.plate,
  ease: EASING.cinematic,
  repeat: Infinity,
  repeatType: 'mirror',
};

/** Ungravited rest pose — gravity applied once via bias helpers. */
const portalPlateNearRest: PlatePose = {
  x: -PORTAL_IDLE_TRAVEL.plate,
  y: -PORTAL_IDLE_TRAVEL.plate * 0.5,
};

/** Reduced motion — frozen plate rest with idle gravity whisper only. */
export const portalPlateNearIdleReduced: { x: number; y: number } = addPose(
  portalPlateNearRest,
  nearGravityBias('idle', true),
);

/**
 * Loop B — primary seam luminance (idle ambient only).
 * Slightly denser mid-cycle under gravity whisper (still opacity-only).
 */
export const portalSeamIdle: { opacity: number[] } = {
  opacity: [
    gravityDensity('idle', 0.72, PORTAL_GRAVITY_DENSITY.seam),
    gravityDensity('idle', 0.9, PORTAL_GRAVITY_DENSITY.seam),
    gravityDensity('idle', 0.78, PORTAL_GRAVITY_DENSITY.seam),
    gravityDensity('idle', 0.86, PORTAL_GRAVITY_DENSITY.seam),
    gravityDensity('idle', 0.72, PORTAL_GRAVITY_DENSITY.seam),
  ],
};

export const portalSeamIdleTransition: Transition = {
  duration: PORTAL_IDLE_PERIOD.seam,
  ease: EASING.cinematic,
  repeat: Infinity,
  repeatType: 'mirror',
};

/** Reduced motion — static inviting-capable seam luminance. */
export const portalSeamIdleReduced: { opacity: number } = {
  opacity: gravityDensity('idle', 0.82, PORTAL_GRAVITY_DENSITY.seam, true),
};

/* -------------------------------------------------------------------------- */
/* Event-driven PortalPhase responses — gravity composed into poses           */
/* -------------------------------------------------------------------------- */

/**
 * One-shot transitions into phase poses — foundation durations only.
 * Never `repeat: Infinity` (ambient loops stay exclusive to idle).
 */
export const portalPhaseTransition: Record<PortalPhase, Transition> = {
  idle: {
    duration: DURATION.SLOW,
    ease: EASING.cinematic,
  },
  inviting: {
    duration: DURATION.FAST,
    ease: EASING.entrance,
  },
  accepting: {
    duration: DURATION.NORMAL,
    ease: EASING.entrance,
  },
  /** Short decisive passage — dwell remains PORTAL_SEQUENCE.crossing. */
  crossing: {
    duration: DURATION.FAST,
    ease: EASING.cinematic,
  },
  /** Soft exhale / afterglow — longer than Crossing. */
  settling: {
    duration: DURATION.SLOW,
    ease: EASING.exit,
  },
};

export const portalPhaseTransitionReduced: Transition = {
  duration: DURATION.FAST,
  ease: EASING.standard,
};

/** Near plate bases — ceremony yield on Crossing; gravity applied below. */
const portalPlateNearBase: Record<PortalPhase, PlatePose> = {
  idle: { x: -PORTAL_IDLE_TRAVEL.plate, y: -PORTAL_IDLE_TRAVEL.plate * 0.5 },
  inviting: { x: 0, y: 0 },
  accepting: {
    x: PORTAL_CEREMONY_TRAVEL.plate * 0.5,
    y: PORTAL_IDLE_TRAVEL.plate * 0.5,
  },
  crossing: {
    x: -PORTAL_CEREMONY_TRAVEL.plate,
    y: -PORTAL_CEREMONY_TRAVEL.plate * 0.5,
  },
  settling: {
    x: -PORTAL_IDLE_TRAVEL.plate * 0.5,
    y: -PORTAL_IDLE_TRAVEL.plate * 0.25,
  },
};

/**
 * L1 near plate — Living Stone + Gravity inward bias.
 * Crossing plate intensity softens so fracture can yield open.
 */
export const portalPlateNearPhase: Record<PortalPhase, PlatePose> =
  mapPhasePoses(portalPlateNearBase, nearGravityBias, false);

/** Reduced: hierarchy via gravity, travel scaled down. */
export const portalPlateNearPhaseReduced: Record<PortalPhase, PlatePose> =
  mapPhasePoses(
    {
      idle: portalPlateNearRest,
      inviting: portalPlateNearRest,
      accepting: portalPlateNearRest,
      crossing: portalPlateNearRest,
      settling: portalPlateNearRest,
    },
    nearGravityBias,
    true,
  );

const portalPlateFarBase: Record<PortalPhase, PlatePose> = {
  idle: {
    x: PORTAL_IDLE_TRAVEL.plate * 2,
    y: PORTAL_IDLE_TRAVEL.plate,
  },
  inviting: {
    x: PORTAL_IDLE_TRAVEL.plate,
    y: PORTAL_IDLE_TRAVEL.plate,
  },
  accepting: {
    x: PORTAL_IDLE_TRAVEL.plate * 0.5,
    y: PORTAL_IDLE_TRAVEL.plate * 0.5,
  },
  crossing: {
    x: PORTAL_CEREMONY_TRAVEL.plate,
    y: PORTAL_CEREMONY_TRAVEL.plate * 0.75,
  },
  settling: {
    x: PORTAL_IDLE_TRAVEL.plate * 2,
    y: PORTAL_IDLE_TRAVEL.plate,
  },
};

/** Far plate — Gravity bias toward singularity (−x). */
export const portalPlateFarPhase: Record<PortalPhase, PlatePose> =
  mapPhasePoses(portalPlateFarBase, farGravityBias, false);

export const portalPlateFarPhaseReduced: Record<PortalPhase, PlatePose> =
  mapPhasePoses(
    {
      idle: portalPlateFarBase.idle,
      inviting: portalPlateFarBase.idle,
      accepting: portalPlateFarBase.idle,
      crossing: portalPlateFarBase.idle,
      settling: portalPlateFarBase.idle,
    },
    farGravityBias,
    true,
  );

/**
 * L3 seam — gather + gravity attraction (density). Crossing still yields open.
 */
export const portalSeamPhase: Record<PortalPhase, OpacityPose> = {
  idle: {
    opacity: gravityDensity('idle', 0.82, PORTAL_GRAVITY_DENSITY.seam),
  },
  inviting: {
    opacity: gravityDensity('inviting', 0.95, PORTAL_GRAVITY_DENSITY.seam),
  },
  accepting: {
    opacity: gravityDensity('accepting', 1, PORTAL_GRAVITY_DENSITY.seam),
  },
  crossing: {
    opacity: gravityDensity('crossing', 0.52, PORTAL_GRAVITY_DENSITY.seam),
  },
  settling: {
    opacity: gravityDensity('settling', 0.78, PORTAL_GRAVITY_DENSITY.seam),
  },
};

export const portalSeamPhaseReduced: Record<PortalPhase, OpacityPose> = {
  idle: {
    opacity: gravityDensity('idle', 0.82, PORTAL_GRAVITY_DENSITY.seam, true),
  },
  inviting: {
    opacity: gravityDensity(
      'inviting',
      0.92,
      PORTAL_GRAVITY_DENSITY.seam,
      true,
    ),
  },
  accepting: {
    opacity: gravityDensity(
      'accepting',
      0.98,
      PORTAL_GRAVITY_DENSITY.seam,
      true,
    ),
  },
  crossing: {
    opacity: gravityDensity(
      'crossing',
      0.62,
      PORTAL_GRAVITY_DENSITY.seam,
      true,
    ),
  },
  settling: {
    opacity: gravityDensity(
      'settling',
      0.82,
      PORTAL_GRAVITY_DENSITY.seam,
      true,
    ),
  },
};

/** L2 hairline — gravity densifies support light toward the core. */
export const portalHairlinePhase: Record<PortalPhase, OpacityPose> = {
  idle: {
    opacity: gravityDensity('idle', 0.35, PORTAL_GRAVITY_DENSITY.hairline),
  },
  inviting: {
    opacity: gravityDensity(
      'inviting',
      0.5,
      PORTAL_GRAVITY_DENSITY.hairline,
    ),
  },
  accepting: {
    opacity: gravityDensity(
      'accepting',
      0.62,
      PORTAL_GRAVITY_DENSITY.hairline,
    ),
  },
  crossing: {
    opacity: gravityDensity(
      'crossing',
      0.28,
      PORTAL_GRAVITY_DENSITY.hairline,
    ),
  },
  settling: {
    opacity: gravityDensity(
      'settling',
      0.4,
      PORTAL_GRAVITY_DENSITY.hairline,
    ),
  },
};

export const portalHairlinePhaseReduced: Record<PortalPhase, OpacityPose> =
  portalHairlinePhase;

/**
 * L4 singularity — invitation density under gravity. Crossing still opens
 * (opacity yield). Never positional bounce.
 */
export const portalSingularityPhase: Record<PortalPhase, OpacityPose> = {
  idle: {
    opacity: gravityDensity(
      'idle',
      0.85,
      PORTAL_GRAVITY_DENSITY.singularity,
    ),
  },
  inviting: {
    opacity: gravityDensity(
      'inviting',
      0.95,
      PORTAL_GRAVITY_DENSITY.singularity,
    ),
  },
  accepting: {
    opacity: gravityDensity(
      'accepting',
      1,
      PORTAL_GRAVITY_DENSITY.singularity,
    ),
  },
  crossing: {
    opacity: gravityDensity(
      'crossing',
      0.28,
      PORTAL_GRAVITY_DENSITY.singularity,
    ),
  },
  settling: {
    opacity: gravityDensity(
      'settling',
      0.9,
      PORTAL_GRAVITY_DENSITY.singularity,
    ),
  },
};

export const portalSingularityPhaseReduced: Record<PortalPhase, OpacityPose> = {
  idle: {
    opacity: gravityDensity(
      'idle',
      0.85,
      PORTAL_GRAVITY_DENSITY.singularity,
      true,
    ),
  },
  inviting: {
    opacity: gravityDensity(
      'inviting',
      0.92,
      PORTAL_GRAVITY_DENSITY.singularity,
      true,
    ),
  },
  accepting: {
    opacity: gravityDensity(
      'accepting',
      0.98,
      PORTAL_GRAVITY_DENSITY.singularity,
      true,
    ),
  },
  crossing: {
    opacity: gravityDensity(
      'crossing',
      0.4,
      PORTAL_GRAVITY_DENSITY.singularity,
      true,
    ),
  },
  settling: {
    opacity: gravityDensity(
      'settling',
      0.88,
      PORTAL_GRAVITY_DENSITY.singularity,
      true,
    ),
  },
};

/**
 * Atmospheric field — gravity densifies Soft Aether pull (opacity only).
 */
export const portalFieldPhase: Record<PortalPhase, OpacityPose> = {
  idle: {
    opacity: gravityDensity(
      'idle',
      PORTAL_FIELD.opacity,
      PORTAL_GRAVITY_DENSITY.field,
    ),
  },
  inviting: {
    opacity: gravityDensity(
      'inviting',
      PORTAL_FIELD.opacity + 0.07,
      PORTAL_GRAVITY_DENSITY.field,
    ),
  },
  accepting: {
    opacity: gravityDensity(
      'accepting',
      PORTAL_FIELD.opacity + 0.17,
      PORTAL_GRAVITY_DENSITY.field,
    ),
  },
  crossing: {
    opacity: gravityDensity(
      'crossing',
      PORTAL_FIELD.opacity + 0.27,
      PORTAL_GRAVITY_DENSITY.field,
    ),
  },
  settling: {
    opacity: gravityDensity(
      'settling',
      PORTAL_FIELD.opacity + 0.03,
      PORTAL_GRAVITY_DENSITY.field,
    ),
  },
};

export const portalFieldPhaseReduced: Record<PortalPhase, OpacityPose> = {
  idle: {
    opacity: gravityDensity(
      'idle',
      PORTAL_FIELD.opacity,
      PORTAL_GRAVITY_DENSITY.field,
      true,
    ),
  },
  inviting: {
    opacity: gravityDensity(
      'inviting',
      PORTAL_FIELD.opacity + 0.07,
      PORTAL_GRAVITY_DENSITY.field,
      true,
    ),
  },
  accepting: {
    opacity: gravityDensity(
      'accepting',
      PORTAL_FIELD.opacity + 0.17,
      PORTAL_GRAVITY_DENSITY.field,
      true,
    ),
  },
  crossing: {
    opacity: gravityDensity(
      'crossing',
      PORTAL_FIELD.opacity + 0.27,
      PORTAL_GRAVITY_DENSITY.field,
      true,
    ),
  },
  settling: {
    opacity: gravityDensity(
      'settling',
      PORTAL_FIELD.opacity + 0.03,
      PORTAL_GRAVITY_DENSITY.field,
      true,
    ),
  },
};

/**
 * Chamber perception — gravity deepens void slightly (opacity only; no translate).
 */
export const portalChamberPhase: Record<PortalPhase, OpacityPose> = {
  idle: {
    opacity: gravityDensity('idle', 1, -PORTAL_GRAVITY_DENSITY.chamber),
  },
  inviting: {
    opacity: gravityDensity('inviting', 1, -PORTAL_GRAVITY_DENSITY.chamber),
  },
  accepting: {
    opacity: gravityDensity(
      'accepting',
      0.92,
      -PORTAL_GRAVITY_DENSITY.chamber,
    ),
  },
  crossing: {
    opacity: gravityDensity(
      'crossing',
      0.72,
      -PORTAL_GRAVITY_DENSITY.chamber,
    ),
  },
  settling: {
    opacity: gravityDensity(
      'settling',
      0.96,
      -PORTAL_GRAVITY_DENSITY.chamber,
    ),
  },
};

export const portalChamberPhaseReduced: Record<PortalPhase, OpacityPose> =
  portalChamberPhase;
