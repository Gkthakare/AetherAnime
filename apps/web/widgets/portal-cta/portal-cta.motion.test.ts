import { describe, expect, it } from 'vitest';

import { DISTANCE, DURATION } from '@/shared/lib/motion';

import {
  PORTAL_GRAVITY_INTENSITY,
  PORTAL_SEQUENCE,
  PORTAL_SEQUENCE_REDUCED,
  isPortalAmbientIdle,
  isPortalLocked,
  portalChamberPhase,
  portalEnterTransition,
  portalFieldPhase,
  portalFieldPhaseReduced,
  portalHairlinePhase,
  portalHairlinePhaseReduced,
  portalPhaseTransition,
  portalPhaseTransitionReduced,
  portalPlateFarPhase,
  portalPlateFarPhaseReduced,
  portalPlateNearIdle,
  portalPlateNearIdleReduced,
  portalPlateNearIdleTransition,
  portalPlateNearPhase,
  portalPlateNearPhaseReduced,
  portalSeamIdle,
  portalSeamIdleReduced,
  portalSeamIdleTransition,
  portalSeamPhase,
  portalSeamPhaseReduced,
  portalSingularityPhase,
  portalSingularityPhaseReduced,
} from './portal-cta.motion';
import type { PortalPhase } from './portal-cta.types';

const ALL_PHASES: readonly PortalPhase[] = [
  'idle',
  'inviting',
  'accepting',
  'crossing',
  'settling',
];

const OPACITY_MAPS = {
  seam: portalSeamPhase,
  seamReduced: portalSeamPhaseReduced,
  hairline: portalHairlinePhase,
  singularity: portalSingularityPhase,
  singularityReduced: portalSingularityPhaseReduced,
  field: portalFieldPhase,
  fieldReduced: portalFieldPhaseReduced,
  chamber: portalChamberPhase,
} as const;

describe('isPortalLocked', () => {
  it('locks activation from accepting through settling', () => {
    expect(isPortalLocked('accepting')).toBe(true);
    expect(isPortalLocked('crossing')).toBe(true);
    expect(isPortalLocked('settling')).toBe(true);
  });

  it('leaves idle and inviting activatable', () => {
    expect(isPortalLocked('idle')).toBe(false);
    expect(isPortalLocked('inviting')).toBe(false);
  });
});

describe('isPortalAmbientIdle', () => {
  it('runs ambient loops only while idle with full motion', () => {
    expect(isPortalAmbientIdle('idle', false)).toBe(true);
    expect(isPortalAmbientIdle('idle', true)).toBe(false);
    for (const phase of ALL_PHASES.filter((p) => p !== 'idle')) {
      expect(isPortalAmbientIdle(phase, false)).toBe(false);
      expect(isPortalAmbientIdle(phase, true)).toBe(false);
    }
  });
});

describe('accept sequence dwells', () => {
  it('composes dwells from motion foundation durations', () => {
    expect(PORTAL_SEQUENCE).toEqual({
      accepting: DURATION.NORMAL,
      crossing: DURATION.NORMAL,
      settling: DURATION.CINEMATIC,
    });
  });

  it('shortens every dwell under reduced motion', () => {
    for (const phase of ['accepting', 'crossing', 'settling'] as const) {
      expect(PORTAL_SEQUENCE_REDUCED[phase]).toBeLessThan(
        PORTAL_SEQUENCE[phase],
      );
    }
  });

  it('keeps settling longer than crossing (short passage, long memory)', () => {
    expect(PORTAL_SEQUENCE.settling).toBeGreaterThan(PORTAL_SEQUENCE.crossing);
    expect(PORTAL_SEQUENCE_REDUCED.settling).toBeGreaterThan(
      PORTAL_SEQUENCE_REDUCED.crossing,
    );
  });
});

describe('transitions', () => {
  it('delays the mount reveal behind a slow cinematic rise', () => {
    expect(portalEnterTransition.duration).toBe(DURATION.SLOW);
    expect(portalEnterTransition.delay).toBe(DURATION.FAST);
  });

  it('loops ambient idle motion by mirroring, forever', () => {
    for (const transition of [
      portalPlateNearIdleTransition,
      portalSeamIdleTransition,
    ]) {
      expect(transition.repeat).toBe(Infinity);
      expect(transition.repeatType).toBe('mirror');
      expect(transition.duration as number).toBeGreaterThan(
        DURATION.CINEMATIC * 10,
      );
    }
  });

  it('never repeats a phase transition — loops stay exclusive to idle', () => {
    for (const phase of ALL_PHASES) {
      expect(portalPhaseTransition[phase]).not.toHaveProperty('repeat');
      expect(portalPhaseTransition[phase].duration as number).toBeGreaterThan(
        0,
      );
    }
    expect(portalPhaseTransitionReduced).not.toHaveProperty('repeat');
  });

  it('gives settling a longer exhale than the crossing beat', () => {
    expect(portalPhaseTransition.settling.duration as number).toBeGreaterThan(
      portalPhaseTransition.crossing.duration as number,
    );
  });

  it('collapses reduced motion onto the fastest duration', () => {
    expect(portalPhaseTransitionReduced.duration).toBe(DURATION.FAST);
  });
});

describe('ambient idle keyframes', () => {
  it('keeps plate travel below conscious UI movement', () => {
    for (const value of [...portalPlateNearIdle.x, ...portalPlateNearIdle.y]) {
      expect(Math.abs(value)).toBeLessThan(DISTANCE.SM);
    }
  });

  it('closes both plate loops so mirroring never jumps', () => {
    expect(portalPlateNearIdle.x.at(0)).toBe(portalPlateNearIdle.x.at(-1));
    expect(portalPlateNearIdle.y.at(0)).toBe(portalPlateNearIdle.y.at(-1));
    expect(portalPlateNearIdle.x).toHaveLength(portalPlateNearIdle.y.length);
  });

  it('closes the seam luminance loop and keeps it inside the opacity range', () => {
    expect(portalSeamIdle.opacity.at(0)).toBe(portalSeamIdle.opacity.at(-1));
    for (const value of portalSeamIdle.opacity) {
      expect(value).toBeGreaterThan(0.5);
      expect(value).toBeLessThanOrEqual(1);
    }
  });

  it('freezes ambient motion into a single pose under reduced motion', () => {
    expect(typeof portalPlateNearIdleReduced.x).toBe('number');
    expect(typeof portalPlateNearIdleReduced.y).toBe('number');
    expect(typeof portalSeamIdleReduced.opacity).toBe('number');
    expect(portalSeamIdleReduced.opacity).toBeGreaterThan(0);
    expect(portalSeamIdleReduced.opacity).toBeLessThanOrEqual(1);
  });
});

describe('gravity engine', () => {
  it('peaks intensity on crossing and whispers on idle', () => {
    expect(PORTAL_GRAVITY_INTENSITY.crossing).toBe(1);
    expect(PORTAL_GRAVITY_INTENSITY.idle).toBeLessThan(
      PORTAL_GRAVITY_INTENSITY.inviting,
    );
    expect(PORTAL_GRAVITY_INTENSITY.inviting).toBeLessThan(
      PORTAL_GRAVITY_INTENSITY.accepting,
    );
    expect(PORTAL_GRAVITY_INTENSITY.settling).toBeLessThan(
      PORTAL_GRAVITY_INTENSITY.accepting,
    );
  });

  it('keeps every intensity normalized to 0–1', () => {
    for (const phase of ALL_PHASES) {
      expect(PORTAL_GRAVITY_INTENSITY[phase]).toBeGreaterThan(0);
      expect(PORTAL_GRAVITY_INTENSITY[phase]).toBeLessThanOrEqual(1);
    }
  });

  it('biases the near plate inward (+x) and the far plate inward (−x)', () => {
    for (const phase of ALL_PHASES) {
      const near = portalPlateNearPhaseReduced[phase];
      const far = portalPlateFarPhaseReduced[phase];
      expect(near.x).toBeGreaterThan(portalPlateNearPhaseReduced.idle.x - 1);
      expect(far.x).toBeLessThan(portalPlateFarPhase.idle.x + 1);
    }
    expect(portalPlateNearPhaseReduced.crossing.x).not.toBe(
      portalPlateFarPhaseReduced.crossing.x,
    );
  });

  it('scales reduced-motion pull down while preserving hierarchy', () => {
    const nearPull = (phase: PortalPhase) =>
      portalPlateNearPhaseReduced[phase].x - portalPlateNearPhaseReduced.idle.x;
    expect(nearPull('accepting')).toBeGreaterThan(nearPull('inviting'));
    expect(nearPull('inviting')).toBeGreaterThan(0);
    expect(Math.abs(portalPlateNearPhaseReduced.crossing.x)).toBeLessThan(
      Math.abs(portalPlateNearPhase.crossing.x) + 1,
    );
  });
});

describe('phase poses', () => {
  it('keeps every plate pose well under the smallest travel distance', () => {
    for (const map of [
      portalPlateNearPhase,
      portalPlateNearPhaseReduced,
      portalPlateFarPhase,
      portalPlateFarPhaseReduced,
    ]) {
      for (const phase of ALL_PHASES) {
        expect(Math.abs(map[phase].x)).toBeLessThan(DISTANCE.SM);
        expect(Math.abs(map[phase].y)).toBeLessThan(DISTANCE.SM);
      }
    }
  });

  it('defines a pose for every phase in every layer map', () => {
    for (const map of Object.values(OPACITY_MAPS)) {
      expect(Object.keys(map).sort()).toEqual([...ALL_PHASES].sort());
    }
  });

  it('clamps every layer opacity to 0–1', () => {
    for (const map of Object.values(OPACITY_MAPS)) {
      for (const phase of ALL_PHASES) {
        expect(map[phase].opacity).toBeGreaterThanOrEqual(0);
        expect(map[phase].opacity).toBeLessThanOrEqual(1);
      }
    }
  });

  it('yields the seam and singularity open on crossing', () => {
    expect(portalSeamPhase.crossing.opacity).toBeLessThan(
      portalSeamPhase.idle.opacity,
    );
    expect(portalSingularityPhase.crossing.opacity).toBeLessThan(
      portalSingularityPhase.idle.opacity,
    );
  });

  it('gathers light as commitment builds from idle to accepting', () => {
    expect(portalSeamPhase.inviting.opacity).toBeGreaterThan(
      portalSeamPhase.idle.opacity,
    );
    expect(portalSeamPhase.accepting.opacity).toBeGreaterThanOrEqual(
      portalSeamPhase.inviting.opacity,
    );
    expect(portalSingularityPhase.accepting.opacity).toBeGreaterThan(
      portalSingularityPhase.idle.opacity,
    );
  });

  it('keeps the hairline a supporting light beneath the seam', () => {
    for (const phase of ALL_PHASES) {
      expect(portalHairlinePhase[phase].opacity).toBeLessThan(
        portalSeamPhase[phase].opacity,
      );
    }
  });

  it('densifies the atmospheric field toward crossing', () => {
    expect(portalFieldPhase.crossing.opacity).toBeGreaterThan(
      portalFieldPhase.idle.opacity,
    );
    expect(portalFieldPhase.settling.opacity).toBeLessThan(
      portalFieldPhase.crossing.opacity,
    );
  });

  it('deepens the chamber void as the ceremony commits', () => {
    expect(portalChamberPhase.crossing.opacity).toBeLessThan(
      portalChamberPhase.idle.opacity,
    );
    expect(portalChamberPhase.settling.opacity).toBeLessThan(
      portalChamberPhase.idle.opacity,
    );
  });

  it('reuses full-motion opacity for layers with no reduced variant', () => {
    expect(portalHairlinePhaseReduced).toBe(portalHairlinePhase);
  });
});
