import type { VariantProps } from 'class-variance-authority';
import type { HTMLAttributes, ReactNode } from 'react';

import type { surfaceVariants } from './surface.variants';

/** Supported Surface presentation roles. */
export type SurfaceVariant = NonNullable<
  VariantProps<typeof surfaceVariants>['variant']
>;

/**
 * Props for the Surface presentation primitive.
 *
 * Design API: `variant` only. Blur, border, elevation, padding, and shadow are
 * owned internally by the chosen variant — they are never public props.
 *
 * `className` is allowed for layout composition (flex, width, positioning).
 * It must never override design primitives.
 */
export interface SurfaceProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof surfaceVariants> {
  children: ReactNode;
}
