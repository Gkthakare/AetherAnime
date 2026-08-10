import { describe, expect, it } from 'vitest';

import { elevation, glass } from '@/shared/lib/graphics';

import { surfaceVariants } from './surface.variants';

describe('surfaceVariants', () => {
  it('defaults to the transparent variant, adding no chrome', () => {
    expect(surfaceVariants()).toBe('');
    expect(surfaceVariants({ variant: undefined })).toBe('');
    expect(surfaceVariants({ variant: 'transparent' })).toBe('');
  });

  it('renders the solid variant from the theme surface token', () => {
    expect(surfaceVariants({ variant: 'solid' })).toBe('bg-card');
  });

  it('renders frosted variants from graphics primitives', () => {
    expect(surfaceVariants({ variant: 'glass' })).toBe(glass.primary);
    expect(surfaceVariants({ variant: 'floating' })).toBe(
      `${glass.floating} ${elevation.floating}`,
    );
  });

  it('lifts only the floating variant off the page', () => {
    expect(surfaceVariants({ variant: 'floating' })).toContain(
      elevation.floating,
    );
    expect(surfaceVariants({ variant: 'glass' })).not.toContain('shadow-');
    expect(surfaceVariants({ variant: 'solid' })).not.toContain('shadow-');
  });

  it('never re-declares blur outside the graphics layer', () => {
    for (const variant of [
      'transparent',
      'solid',
      'glass',
      'floating',
    ] as const) {
      const classes = surfaceVariants({ variant }).split(' ').filter(Boolean);
      const blurClasses = classes.filter((c) => c.startsWith('backdrop-blur'));
      expect(blurClasses.length).toBeLessThanOrEqual(1);
    }
  });
});
