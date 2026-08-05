import { cn } from '@/lib/utils';

import type { SurfaceProps } from './surface.types';
import { surfaceVariants } from './surface.variants';

/**
 * Surface — the first reusable UI presentation primitive.
 *
 * Layering: Theme (config) → Graphics (appearance) → Surface (presentation).
 * Surface consumes Graphics and Theme semantic utilities; it never imports
 * Motion, widgets, or domain logic.
 *
 * Public design prop: `variant` (`transparent` | `solid` | `glass` | `floating`).
 *
 * `className` is for layout composition only (e.g. flex, width, positioning).
 * It must never be used to override design primitives such as background, blur,
 * border, shadow, or elevation — those belong to the variant.
 */
export function Surface({
  variant = 'transparent',
  className,
  children,
  ...props
}: SurfaceProps) {
  return (
    <div
      data-slot="surface"
      className={cn(surfaceVariants({ variant }), className)}
      {...props}
    >
      {children}
    </div>
  );
}
