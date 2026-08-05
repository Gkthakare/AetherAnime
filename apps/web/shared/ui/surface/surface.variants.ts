/**
 * Surface presentation variants.
 *
 * Maps the public `variant` API to Theme semantic utilities and Graphics
 * primitives. Consumers choose a role; this file owns how that role looks.
 */

import { cva } from 'class-variance-authority';

import { elevation, glass } from '@/shared/lib/graphics';

/**
 * Presentation classes for each Surface variant.
 *
 * - `transparent` — no chrome; preserves the host's visual plane.
 * - `solid` — opaque resting surface via Theme (`bg-card` → `colors.surface`).
 * - `glass` — frosted panel from Graphics `glass.primary`.
 * - `floating` — lifted frosted panel from Graphics `glass.floating` + elevation.
 */
export const surfaceVariants = cva('', {
  variants: {
    variant: {
      transparent: '',
      solid: 'bg-card',
      glass: glass.primary,
      floating: `${glass.floating} ${elevation.floating}`,
    },
  },
  defaultVariants: {
    variant: 'transparent',
  },
});
