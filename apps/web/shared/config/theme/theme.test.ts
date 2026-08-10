import { describe, expect, it } from 'vitest';

import {
  breakpoints,
  colors,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  radius,
  spacing,
  theme,
  typography,
  zIndex,
} from './index';

const HEX_COLOR = /^#[0-9A-F]{6}$/;
const REM_LENGTH = /^\d+(\.\d+)?rem$/;

function rem(value: string): number {
  return Number.parseFloat(value);
}

function isAscending(values: number[]): boolean {
  return values.every((value, i) => i === 0 || values[i - 1] < value);
}

describe('colors', () => {
  it('declares every role as an uppercase six-digit hex', () => {
    for (const value of Object.values(colors)) {
      expect(value).toMatch(HEX_COLOR);
    }
  });

  it('keeps the surface ladder lifting away from the background', () => {
    expect(colors.background).not.toBe(colors.surface);
    expect(colors.surface).not.toBe(colors.surfaceElevated);
  });

  it('exposes the brand hues the graphics foundation derives from', () => {
    expect(colors.primary).toBe('#6C63FF');
    expect(colors.accent).toBe('#00F5D4');
  });

  it('uses distinct hues for every status role', () => {
    const statuses = [colors.success, colors.warning, colors.danger];
    expect(new Set(statuses).size).toBe(statuses.length);
  });
});

describe('typography', () => {
  it('declares platform-agnostic families with a system fallback', () => {
    for (const stack of Object.values(fontFamily)) {
      expect(stack.split(',').length).toBeGreaterThan(1);
    }
    expect(fontFamily.mono).toContain('monospace');
  });

  it('scales font sizes in rem, ascending from xs to 4xl', () => {
    const sizes = Object.values(fontSize);
    for (const size of sizes) {
      expect(size).toMatch(REM_LENGTH);
    }
    expect(isAscending(sizes.map(rem))).toBe(true);
    expect(fontSize.md).toBe('1rem');
  });

  it('orders weights and line heights', () => {
    expect(isAscending(Object.values(fontWeight))).toBe(true);
    expect(isAscending(Object.values(lineHeight))).toBe(true);
  });

  it('groups every type token under the namespace', () => {
    expect(typography).toEqual({
      fontFamily,
      fontSize,
      fontWeight,
      lineHeight,
    });
  });
});

describe('spacing and radius', () => {
  it('starts both scales at zero', () => {
    expect(rem(spacing.none)).toBe(0);
    expect(rem(radius.none)).toBe(0);
  });

  it('ascends the spacing scale with the default gap at 1rem', () => {
    const steps = Object.values(spacing);
    for (const step of steps) {
      expect(step).toMatch(REM_LENGTH);
    }
    expect(isAscending(steps.map(rem))).toBe(true);
    expect(spacing.md).toBe('1rem');
  });

  it('ascends the graded radius steps and keeps `full` a pill length', () => {
    const graded = [radius.none, radius.sm, radius.md, radius.lg, radius.xl];
    for (const step of graded) {
      expect(step).toMatch(REM_LENGTH);
    }
    expect(isAscending(graded.map(rem))).toBe(true);
    expect(radius.full).toBe('9999px');
  });
});

describe('z-index and breakpoints', () => {
  it('orders stacking levels from background to toast', () => {
    expect(Object.values(zIndex)).toEqual([0, 10, 100, 200, 300, 400]);
    expect(isAscending(Object.values(zIndex))).toBe(true);
  });

  it('spaces stacking levels so intermediate layers can be inserted', () => {
    const levels = Object.values(zIndex);
    for (let i = 1; i < levels.length; i += 1) {
      expect(levels[i] - levels[i - 1]).toBeGreaterThanOrEqual(10);
    }
  });

  it('declares mobile-first breakpoints as ascending pixel numbers', () => {
    const widths = Object.values(breakpoints);
    for (const width of widths) {
      expect(Number.isInteger(width)).toBe(true);
    }
    expect(isAscending(widths)).toBe(true);
    expect(breakpoints.xs).toBe(480);
  });
});

describe('theme namespace', () => {
  it('aggregates every token module', () => {
    expect(theme).toEqual({
      colors,
      typography,
      spacing,
      radius,
      zIndex,
      breakpoints,
    });
  });

  it('stays free of framework-specific utility strings', () => {
    const serialized = JSON.stringify(theme);
    expect(serialized).not.toContain('bg-');
    expect(serialized).not.toContain('backdrop-blur');
    expect(serialized).not.toContain('shadow-');
  });
});
