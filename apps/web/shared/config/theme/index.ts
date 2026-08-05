/**
 * Theme foundation.
 *
 * The single source of truth for AetherAnime's design tokens. Theme is
 * *configuration*, not a library: it declares the raw, framework-agnostic values
 * (colors, typography, spacing, radius, stacking, breakpoints) that every other
 * system derives from. Graphics and motion are libraries that consume these
 * tokens; widgets consume both.
 *
 * Consume theme through this barrel so nothing downstream re-declares a design
 * value inline:
 *
 *   import { colors, spacing, theme } from '@/shared/config/theme';
 *
 * Every token is immutable (`as const`), semantically named (by role, not by
 * value or component), and platform-agnostic (no React, no JSX, no framework
 * utility classes) so web, desktop, mobile, and VR clients can all read them.
 *
 * How the theme reaches the screen (web):
 *
 *   config/theme/colors.ts        // this module — source of truth
 *        │  (values mirrored, by hand, per role)
 *        ▼
 *   app/globals.css  :root / .dark  // shadcn/Tailwind CSS variables (--background, --primary, …)
 *        │  (@theme inline maps --color-* → var(--*))
 *        ▼
 *   Tailwind v4 utilities + shadcn components  // bg-background, text-foreground, <Button />, …
 *
 * The colors module is authoritative; the CSS variables are its web reflection.
 * Because CSS cannot import TypeScript and this task adds no runtime theming JS,
 * that reflection is currently maintained by hand — see `colors.ts` for the
 * sync contract. The remaining foundation values (typography, spacing, radius,
 * z-index, breakpoints) are not yet bridged into CSS variables.
 */

export * from './colors';
export * from './typography';
export * from './spacing';
export * from './radius';
export * from './z-index';
export * from './breakpoints';

import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { radius } from './radius';
import { zIndex } from './z-index';
import { breakpoints } from './breakpoints';

/**
 * Aggregated theme namespace.
 *
 * Groups every token module under one immutable object for ergonomic access
 * (`theme.colors.background`, `theme.spacing.md`). Prefer the named module
 * imports when you only need one group; use `theme` when a consumer wants the
 * whole design-token surface.
 */
export const theme = {
  colors,
  typography,
  spacing,
  radius,
  zIndex,
  breakpoints,
} as const;

/** Shape of the complete design-token surface. */
export type Theme = typeof theme;
