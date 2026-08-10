import { describe, expect, it } from 'vitest';

import { DELAY } from '@/shared/lib/motion';

import { ARRIVAL_PHASE_ORDER } from '../arrival-scene/arrival-scene.motion';
import {
  ATMOSPHERE_REST,
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

const LAYERS = ['indigoFar', 'indigoNear', 'cyanAccent'] as const;

const DRIFTS = {
  indigoFar: indigoFarDrift,
  indigoNear: indigoNearDrift,
  cyanAccent: cyanAccentDrift,
} as const;

const DRIFT_TRANSITIONS = {
  indigoFar: indigoFarTransition,
  indigoNear: indigoNearTransition,
  cyanAccent: cyanAccentTransition,
} as const;

const percent = (value: string) => Number.parseFloat(value);

describe('resting atmosphere', () => {
  it('orders depth so the far haze reads deepest and cyan stays restrained', () => {
    expect(ATMOSPHERE_REST.indigoFar).toBeGreaterThan(
      ATMOSPHERE_REST.indigoNear,
    );
    expect(ATMOSPHERE_REST.indigoNear).toBeGreaterThan(
      ATMOSPHERE_REST.cyanAccent,
    );
  });

  it('fades the shell in from nothing on mount without delay', () => {
    expect(atmosphereEnter).toEqual({
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    });
    expect(atmosphereEnterTransition.delay).toBe(DELAY.NONE);
  });
});

describe('ambient drift', () => {
  it('loops forever and returns to the starting keyframe', () => {
    for (const layer of LAYERS) {
      const drift = DRIFTS[layer];
      expect(drift.opacity.at(0)).toBe(drift.opacity.at(-1));
      expect(drift.x.at(0)).toBe(drift.x.at(-1));
      expect(drift.y.at(0)).toBe(drift.y.at(-1));
      for (const transition of Object.values(DRIFT_TRANSITIONS[layer])) {
        expect(transition.repeat).toBe(Infinity);
      }
    }
  });

  it('drifts in percentages so layers scale with the viewport', () => {
    for (const layer of LAYERS) {
      for (const value of [...DRIFTS[layer].x, ...DRIFTS[layer].y]) {
        expect(value.endsWith('%')).toBe(true);
        expect(Math.abs(percent(value))).toBeLessThanOrEqual(1.5);
      }
    }
  });

  it('keeps opacity sway soft and centred on the resting value', () => {
    for (const layer of LAYERS) {
      const values = DRIFTS[layer].opacity;
      const rest = ATMOSPHERE_REST[layer];
      expect(Math.max(...values) - Math.min(...values)).toBeLessThanOrEqual(
        0.1,
      );
      for (const value of values) {
        expect(Math.abs(value - rest)).toBeLessThanOrEqual(0.06);
      }
    }
  });

  it('desynchronizes layers so drift never becomes one pulse', () => {
    const periods = LAYERS.map(
      (layer) => DRIFT_TRANSITIONS[layer].opacity.duration as number,
    );
    expect(new Set(periods).size).toBe(periods.length);
    for (const layer of LAYERS) {
      const transition = DRIFT_TRANSITIONS[layer];
      expect(transition.y.duration).not.toBe(transition.x.duration);
    }
  });

  it('drifts far slower than UI motion', () => {
    for (const layer of LAYERS) {
      expect(
        DRIFT_TRANSITIONS[layer].opacity.duration as number,
      ).toBeGreaterThan(20);
    }
  });
});

describe('ceremony echo', () => {
  it('covers every arrival phase and layer in both modes', () => {
    for (const map of [atmospherePhaseMotion, atmospherePhaseMotionReduced]) {
      expect(Object.keys(map).sort()).toEqual([...ARRIVAL_PHASE_ORDER].sort());
      for (const phase of ARRIVAL_PHASE_ORDER) {
        expect(Object.keys(map[phase]).sort()).toEqual([...LAYERS].sort());
      }
    }
  });

  it('holds at rest until the user commits', () => {
    for (const phase of ['idle', 'aware', 'inviting'] as const) {
      for (const layer of LAYERS) {
        expect(atmospherePhaseMotion[phase][layer]).toEqual({
          opacity: ATMOSPHERE_REST[layer],
          x: 0,
          y: 0,
        });
      }
    }
  });

  it('gathers light through crossing then returns toward rest', () => {
    for (const layer of LAYERS) {
      expect(atmospherePhaseMotion.crossing[layer].opacity).toBeGreaterThan(
        atmospherePhaseMotion.accepting[layer].opacity,
      );
      expect(atmospherePhaseMotion.settling[layer].opacity).toBeLessThan(
        atmospherePhaseMotion.crossing[layer].opacity,
      );
    }
  });

  it('keeps every echo a soft delta from rest', () => {
    for (const map of [atmospherePhaseMotion, atmospherePhaseMotionReduced]) {
      for (const phase of ARRIVAL_PHASE_ORDER) {
        for (const layer of LAYERS) {
          const { opacity } = map[phase][layer];
          expect(opacity).toBeGreaterThan(0);
          expect(opacity).toBeLessThanOrEqual(1);
          expect(Math.abs(opacity - ATMOSPHERE_REST[layer])).toBeLessThan(0.13);
        }
      }
    }
  });

  it('echoes with opacity only under reduced motion', () => {
    for (const phase of ARRIVAL_PHASE_ORDER) {
      for (const layer of LAYERS) {
        expect(atmospherePhaseMotionReduced[phase][layer].x).toBe(0);
        expect(atmospherePhaseMotionReduced[phase][layer].y).toBe(0);
      }
    }
  });

  it('leads the cascade with no delay', () => {
    for (const phase of ARRIVAL_PHASE_ORDER) {
      expect(atmospherePhaseTransition[phase].delay).toBe(DELAY.NONE);
    }
    expect(atmospherePhaseTransitionReduced.delay).toBe(DELAY.NONE);
  });

  it('never loops a ceremony response', () => {
    for (const phase of ARRIVAL_PHASE_ORDER) {
      expect(atmospherePhaseTransition[phase]).not.toHaveProperty('repeat');
    }
    expect(atmospherePhaseTransitionReduced).not.toHaveProperty('repeat');
  });
});
