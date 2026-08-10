import { describe, expect, it } from 'vitest';

import {
  BLUR_RADIUS,
  BORDER_COLOR,
  ELEVATION_SHADOW,
  GLOW_COLOR,
  GRADIENT,
  blur,
  borders,
  elevation,
  glass,
  glow,
  gradients,
} from './index';

/** `24px` -> `24`, `0.5rem` -> `0.5`. */
function numericPart(value: string): number {
  return Number.parseFloat(value);
}

describe('blur primitives', () => {
  it('exposes a utility class for every radius', () => {
    expect(Object.keys(blur)).toEqual(Object.keys(BLUR_RADIUS));
  });

  it('mirrors each raw radius inside its utility class', () => {
    for (const level of Object.keys(
      BLUR_RADIUS,
    ) as (keyof typeof BLUR_RADIUS)[]) {
      expect(blur[level]).toBe(`backdrop-blur-[${BLUR_RADIUS[level]}]`);
    }
  });

  it('increases radius monotonically from sm to xl', () => {
    const radii = [
      BLUR_RADIUS.sm,
      BLUR_RADIUS.md,
      BLUR_RADIUS.lg,
      BLUR_RADIUS.xl,
    ].map(numericPart);
    expect(radii).toEqual([...radii].sort((a, b) => a - b));
    expect(new Set(radii).size).toBe(radii.length);
  });
});

describe('border primitives', () => {
  it('exposes a utility class for every border color', () => {
    expect(Object.keys(borders)).toEqual(Object.keys(BORDER_COLOR));
  });

  it('always declares a border width alongside the color', () => {
    for (const value of Object.values(borders)) {
      expect(value.startsWith('border ')).toBe(true);
    }
  });

  it('keeps the accent edge on the brand accent hue', () => {
    expect(BORDER_COLOR.accent).toContain('0 245 212');
    expect(borders.accent).toContain('#00F5D4');
  });
});

describe('elevation primitives', () => {
  it('exposes a utility class for every level', () => {
    expect(Object.keys(elevation)).toEqual(Object.keys(ELEVATION_SHADOW));
  });

  it('uses neutral black shadows only — colored light belongs to glow', () => {
    for (const shadow of Object.values(ELEVATION_SHADOW)) {
      expect(shadow).toContain('rgb(0 0 0');
    }
  });

  it('deepens the shadow as the surface rises', () => {
    const alpha = (shadow: string) =>
      Number.parseFloat(shadow.split('/')[1].replace(')', ''));
    expect(alpha(ELEVATION_SHADOW.surface)).toBeLessThan(
      alpha(ELEVATION_SHADOW.floating),
    );
    expect(alpha(ELEVATION_SHADOW.floating)).toBeLessThan(
      alpha(ELEVATION_SHADOW.modal),
    );
  });
});

describe('glow primitives', () => {
  it('derives halos from the brand palette', () => {
    expect(GLOW_COLOR.primary).toContain('108 99 255');
    expect(GLOW_COLOR.accent).toContain('0 245 212');
    expect(glow.primary).toContain('108_99_255');
    expect(glow.accent).toContain('0_245_212');
  });

  it('spreads the hero bloom wider than interactive halos', () => {
    expect(glow.hero).toContain('80px');
    expect(glow.primary).toContain('24px');
    expect(glow.accent).toContain('24px');
  });

  it('emits zero-offset halos so light reads as emissive', () => {
    for (const value of Object.values(glow)) {
      expect(value).toContain('shadow-[0_0_');
    }
  });
});

describe('gradient primitives', () => {
  it('exposes a utility class for every recipe', () => {
    expect(Object.keys(gradients)).toEqual(Object.keys(GRADIENT));
  });

  it('mirrors each raw recipe inside its utility class', () => {
    for (const name of Object.keys(GRADIENT) as (keyof typeof GRADIENT)[]) {
      const expected = GRADIENT[name].replace(/, /g, ',').replace(/ /g, '_');
      expect(gradients[name]).toBe(`bg-[${expected}]`);
    }
  });
});

describe('glass composition', () => {
  it('composes blur and border primitives rather than re-declaring them', () => {
    expect(glass.primary).toContain(blur.md);
    expect(glass.primary).toContain(borders.glass);
    expect(glass.secondary).toContain(blur.sm);
    expect(glass.secondary).toContain(borders.subtle);
    expect(glass.floating).toContain(blur.lg);
    expect(glass.floating).toContain(borders.glass);
  });

  it('gives every surface a translucent fill', () => {
    for (const surface of Object.values(glass)) {
      expect(surface).toMatch(/^bg-white\/\d+ /);
    }
  });

  it('blurs floating surfaces more deeply than resting ones', () => {
    expect(numericPart(BLUR_RADIUS.lg)).toBeGreaterThan(
      numericPart(BLUR_RADIUS.md),
    );
  });
});
