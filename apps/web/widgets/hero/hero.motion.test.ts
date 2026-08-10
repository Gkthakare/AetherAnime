import { describe, expect, it } from 'vitest';

import { DELAY } from '@/shared/lib/motion';

import { ARRIVAL_PHASE_ORDER } from '../arrival-scene/arrival-scene.motion';
import {
  heroPhaseMotion,
  heroPhaseMotionReduced,
  heroPhaseTransition,
  heroPhaseTransitionReduced,
} from './hero.motion';

/** Experience Budget: opacity >= 0.94 · translate <= 3px. */
const MIN_OPACITY = 0.94;
const MAX_TRANSLATE = 3;

describe('heroPhaseMotion', () => {
  it('covers every arrival phase in both modes', () => {
    for (const map of [heroPhaseMotion, heroPhaseMotionReduced]) {
      expect(Object.keys(map).sort()).toEqual([...ARRIVAL_PHASE_ORDER].sort());
    }
  });

  it('stays inside the experience budget', () => {
    for (const map of [heroPhaseMotion, heroPhaseMotionReduced]) {
      for (const pose of Object.values(map)) {
        expect(pose.opacity).toBeGreaterThanOrEqual(MIN_OPACITY);
        expect(pose.opacity).toBeLessThanOrEqual(1);
        expect(Math.abs(pose.y)).toBeLessThanOrEqual(MAX_TRANSLATE);
      }
    }
  });

  it('rests fully present until the user commits', () => {
    for (const phase of ['idle', 'aware', 'inviting'] as const) {
      expect(heroPhaseMotion[phase]).toEqual({ opacity: 1, y: 0 });
      expect(heroPhaseMotionReduced[phase]).toEqual({ opacity: 1, y: 0 });
    }
  });

  it('yields most on crossing and recovers on settling', () => {
    expect(heroPhaseMotion.crossing.opacity).toBeLessThan(
      heroPhaseMotion.accepting.opacity,
    );
    expect(heroPhaseMotion.settling.opacity).toBeGreaterThan(
      heroPhaseMotion.crossing.opacity,
    );
    expect(heroPhaseMotion.crossing.y).toBeGreaterThan(
      heroPhaseMotion.accepting.y,
    );
    expect(heroPhaseMotion.settling.y).toBeLessThan(heroPhaseMotion.crossing.y);
  });

  it('yields with opacity only under reduced motion', () => {
    for (const pose of Object.values(heroPhaseMotionReduced)) {
      expect(pose.y).toBe(0);
    }
  });

  it('keeps identical opacity in both modes so meaning survives', () => {
    for (const phase of ARRIVAL_PHASE_ORDER) {
      expect(heroPhaseMotionReduced[phase].opacity).toBe(
        heroPhaseMotion[phase].opacity,
      );
    }
  });
});

describe('heroPhaseTransition', () => {
  it('lets atmosphere echo first by delaying every hero response', () => {
    for (const phase of ARRIVAL_PHASE_ORDER) {
      expect(heroPhaseTransition[phase].delay).toBe(DELAY.SHORT);
    }
  });

  it('gives crossing the longest, most cinematic response', () => {
    const durations = ARRIVAL_PHASE_ORDER.map(
      (phase) => heroPhaseTransition[phase].duration as number,
    );
    expect(heroPhaseTransition.crossing.duration).toBe(Math.max(...durations));
  });

  it('drops the delay under reduced motion', () => {
    expect(heroPhaseTransitionReduced.delay).toBe(DELAY.NONE);
    expect(heroPhaseTransitionReduced.duration as number).toBeLessThanOrEqual(
      heroPhaseTransition.aware.duration as number,
    );
  });

  it('never loops — hero acknowledges once per phase', () => {
    for (const phase of ARRIVAL_PHASE_ORDER) {
      expect(heroPhaseTransition[phase]).not.toHaveProperty('repeat');
    }
    expect(heroPhaseTransitionReduced).not.toHaveProperty('repeat');
  });
});
