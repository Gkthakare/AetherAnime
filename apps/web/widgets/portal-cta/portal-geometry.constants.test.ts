import { describe, expect, it } from 'vitest';

import {
  PORTAL_FIELD,
  PORTAL_GEOMETRY_SIZE_CLASS,
  PORTAL_HAIRLINE,
  PORTAL_PLATE_CLIP,
  PORTAL_SEAM,
  PORTAL_SINGULARITY,
} from './portal-geometry.constants';

/** `polygon(6% 14%, …)` -> `[[6, 14], …]`. */
function clipPoints(clip: string): number[][] {
  return clip
    .replace(/^polygon\(|\)$/g, '')
    .split(',')
    .map((point) => point.trim().split(/\s+/).map(Number.parseFloat));
}

describe('geometry canvas', () => {
  it('declares a dual-scale, overflow-visible canvas', () => {
    expect(PORTAL_GEOMETRY_SIZE_CLASS).toContain('size-28');
    expect(PORTAL_GEOMETRY_SIZE_CLASS).toContain('md:size-32');
    expect(PORTAL_GEOMETRY_SIZE_CLASS).toContain('overflow-visible');
    expect(PORTAL_GEOMETRY_SIZE_CLASS).toContain('relative');
  });

  it('keeps the singularity dual-scale too', () => {
    expect(PORTAL_SINGULARITY.className).toBe('size-2.5 md:size-3');
  });
});

describe('fracture plates', () => {
  it('defines four-point clip paths inside the canvas', () => {
    for (const clip of Object.values(PORTAL_PLATE_CLIP)) {
      const points = clipPoints(clip);
      expect(points).toHaveLength(4);
      for (const [x, y] of points) {
        expect(x).toBeGreaterThanOrEqual(0);
        expect(x).toBeLessThanOrEqual(100);
        expect(y).toBeGreaterThanOrEqual(0);
        expect(y).toBeLessThanOrEqual(100);
      }
    }
  });

  it('places the near plate left of the far plate', () => {
    const centerX = (clip: string) => {
      const xs = clipPoints(clip).map(([x]) => x);
      return xs.reduce((sum, x) => sum + x, 0) / xs.length;
    };
    expect(centerX(PORTAL_PLATE_CLIP.near)).toBeLessThan(
      centerX(PORTAL_PLATE_CLIP.far),
    );
  });

  it('stays asymmetric — a calm fissure, not a mirrored shape', () => {
    expect(PORTAL_PLATE_CLIP.near).not.toBe(PORTAL_PLATE_CLIP.far);
    const nearYs = clipPoints(PORTAL_PLATE_CLIP.near).map(([, y]) => y);
    expect(new Set(nearYs).size).toBeGreaterThan(1);
  });
});

describe('seam and hairline', () => {
  it('keeps the hairline a thinner, shorter support than the seam', () => {
    expect(Number.parseFloat(PORTAL_HAIRLINE.width)).toBeLessThan(
      Number.parseFloat(PORTAL_SEAM.width),
    );
    expect(Number.parseFloat(PORTAL_HAIRLINE.height)).toBeLessThan(
      Number.parseFloat(PORTAL_SEAM.height),
    );
    expect(PORTAL_HAIRLINE.opacity).toBeLessThan(1);
  });

  it('crosses the seam by rotating the hairline the other way', () => {
    expect(Number.parseFloat(PORTAL_SEAM.rotate)).toBeLessThan(0);
    expect(Number.parseFloat(PORTAL_HAIRLINE.rotate)).toBeGreaterThan(0);
  });

  it('centres the seam on the threshold', () => {
    expect(PORTAL_SEAM.left).toBe('calc(50% - 1px)');
  });
});

describe('atmospheric field', () => {
  it('bleeds outside the canvas as a soft translucent yield', () => {
    expect(Number.parseFloat(PORTAL_FIELD.inset)).toBeLessThan(0);
    expect(PORTAL_FIELD.opacity).toBeGreaterThan(0);
    expect(PORTAL_FIELD.opacity).toBeLessThan(1);
  });
});
