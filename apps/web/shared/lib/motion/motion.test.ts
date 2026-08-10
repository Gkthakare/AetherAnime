import { describe, expect, it } from 'vitest';

import {
  DELAY,
  DISTANCE,
  DURATION,
  EASING,
  SCALE,
  STAGGER,
  cardReveal,
  cinematicTransition,
  fadeIn,
  fadeOut,
  fastTransition,
  heroReveal,
  normalTransition,
  presets,
  scaleIn,
  sectionReveal,
  slideDown,
  slideUp,
  slowTransition,
  springTransition,
  staggerContainer,
  transitions,
} from './index';

describe('motion constants', () => {
  it('orders durations from fast to cinematic', () => {
    const ordered = [
      DURATION.FAST,
      DURATION.NORMAL,
      DURATION.SLOW,
      DURATION.CINEMATIC,
    ];
    expect(ordered).toEqual([...ordered].sort((a, b) => a - b));
  });

  it('declares every easing as a four-point cubic bezier with in-range x', () => {
    for (const curve of Object.values(EASING)) {
      expect(curve).toHaveLength(4);
      expect(curve[0]).toBeGreaterThanOrEqual(0);
      expect(curve[0]).toBeLessThanOrEqual(1);
      expect(curve[2]).toBeGreaterThanOrEqual(0);
      expect(curve[2]).toBeLessThanOrEqual(1);
    }
  });

  it('keeps travel distances small and ascending', () => {
    expect(DISTANCE.SM).toBeLessThan(DISTANCE.NORMAL);
    expect(DISTANCE.NORMAL).toBeLessThan(DISTANCE.LG);
    expect(DISTANCE.LG).toBeLessThanOrEqual(48);
  });

  it('scales in from a subtle offset up to identity', () => {
    expect(SCALE.FROM).toBeGreaterThan(0.9);
    expect(SCALE.FROM).toBeLessThan(SCALE.TO);
    expect(SCALE.TO).toBe(1);
  });

  it('orders stagger and delay ladders', () => {
    expect(STAGGER.FAST).toBeLessThan(STAGGER.NORMAL);
    expect(STAGGER.NORMAL).toBeLessThan(STAGGER.SLOW);
    expect(DELAY.NONE).toBe(0);
    expect(DELAY.SHORT).toBeLessThan(DELAY.LONG);
  });
});

describe('transitions', () => {
  it('composes durations from the constants layer only', () => {
    expect(fastTransition.duration).toBe(DURATION.FAST);
    expect(normalTransition.duration).toBe(DURATION.NORMAL);
    expect(slowTransition.duration).toBe(DURATION.SLOW);
    expect(cinematicTransition.duration).toBe(DURATION.CINEMATIC);
  });

  it('composes easings from the constants layer only', () => {
    expect(fastTransition.ease).toBe(EASING.standard);
    expect(normalTransition.ease).toBe(EASING.entrance);
    expect(slowTransition.ease).toBe(EASING.entrance);
    expect(cinematicTransition.ease).toBe(EASING.cinematic);
  });

  it('describes the spring by physics rather than duration', () => {
    expect(springTransition.type).toBe('spring');
    expect(springTransition).not.toHaveProperty('duration');
  });

  it('registers every named transition in the lookup', () => {
    expect(transitions).toEqual({
      fast: fastTransition,
      normal: normalTransition,
      slow: slowTransition,
      cinematic: cinematicTransition,
      spring: springTransition,
    });
  });
});

describe('variants', () => {
  it('fades between full transparency and full opacity', () => {
    expect(fadeIn).toEqual({ hidden: { opacity: 0 }, visible: { opacity: 1 } });
    expect(fadeOut.hidden).toEqual({ opacity: 0 });
    expect(fadeOut.visible).toEqual({ opacity: 1 });
  });

  it('slides from opposite directions into the same resting pose', () => {
    expect(slideUp.hidden).toEqual({ opacity: 0, y: DISTANCE.NORMAL });
    expect(slideDown.hidden).toEqual({ opacity: 0, y: -DISTANCE.NORMAL });
    expect(slideUp.visible).toEqual({ opacity: 1, y: 0 });
    expect(slideDown.visible).toEqual({ opacity: 1, y: 0 });
  });

  it('scales in from the constant offset', () => {
    expect(scaleIn.hidden).toEqual({ opacity: 0, scale: SCALE.FROM });
    expect(scaleIn.visible).toEqual({ opacity: 1, scale: SCALE.TO });
  });

  it('keeps the stagger container orchestration-only', () => {
    expect(staggerContainer.hidden).toEqual({});
    expect(staggerContainer.visible).toEqual({
      transition: { staggerChildren: STAGGER.NORMAL },
    });
  });
});

describe('presets', () => {
  it('reveals the hero on mount with a delayed cinematic rise', () => {
    expect(heroReveal.variants).toBe(slideUp);
    expect(heroReveal.animate).toBe('visible');
    expect(heroReveal.whileInView).toBeUndefined();
    expect(heroReveal.transition).toEqual({
      ...cinematicTransition,
      delay: DELAY.SHORT,
    });
  });

  it('reveals scroll-triggered presets once when partially in view', () => {
    for (const preset of [sectionReveal, cardReveal]) {
      expect(preset.initial).toBe('hidden');
      expect(preset.whileInView).toBe('visible');
      expect(preset.animate).toBeUndefined();
      expect(preset.viewport?.once).toBe(true);
      expect(preset.viewport?.amount).toBeGreaterThan(0);
    }
    expect(sectionReveal.viewport?.amount).toBeGreaterThan(
      cardReveal.viewport?.amount as number,
    );
  });

  it('uses the scale-in variant for cards and the slide-up variant for sections', () => {
    expect(sectionReveal.variants).toBe(slideUp);
    expect(cardReveal.variants).toBe(scaleIn);
  });

  it('registers every named preset in the lookup', () => {
    expect(presets).toEqual({ heroReveal, sectionReveal, cardReveal });
  });
});
