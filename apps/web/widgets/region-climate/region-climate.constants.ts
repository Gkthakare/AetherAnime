/**
 * RegionClimate — gradient maps + status opacity (no motion values).
 *
 * Maps WorldClimate tokens from Region metadata to restrained Soft Aether tints.
 * Theme CSS variables only — no new palette.
 */

import type { WorldClimate } from '@/shared/world';
import type { RegionSceneStatus } from '@/widgets/region-scene';

/** Localized Region atmosphere — lighter / smaller than World Climate. */
export const REGION_CLIMATE_GRADIENT: Record<WorldClimate, string> = {
  neutral:
    'radial-gradient(ellipse 55% 45% at 50% 42%, color-mix(in oklab, var(--primary) 12%, transparent), transparent 68%)',
  cool:
    'radial-gradient(ellipse 50% 48% at 46% 38%, color-mix(in oklab, var(--ring) 14%, transparent), transparent 70%), radial-gradient(ellipse 40% 35% at 62% 72%, color-mix(in oklab, var(--primary) 8%, transparent), transparent 62%)',
  warm:
    'radial-gradient(ellipse 52% 44% at 52% 36%, color-mix(in oklab, var(--primary) 16%, transparent), transparent 66%), radial-gradient(ellipse 45% 30% at 40% 78%, color-mix(in oklab, var(--ring) 7%, transparent), transparent 58%)',
  charged:
    'radial-gradient(ellipse 48% 42% at 50% 32%, color-mix(in oklab, var(--primary) 18%, transparent), transparent 64%), radial-gradient(ellipse 38% 34% at 68% 68%, color-mix(in oklab, var(--ring) 11%, transparent), transparent 60%)',
};

/** Fallback when climate missing or status unknown. */
export const REGION_CLIMATE_FALLBACK_GRADIENT =
  'radial-gradient(ellipse 50% 42% at 50% 45%, color-mix(in oklab, var(--muted-foreground) 8%, transparent), transparent 70%)';

/**
 * Peak opacity by RegionScene status.
 * Kept low so World Climate remains the dominant world atmosphere.
 */
export const REGION_CLIMATE_STATUS_OPACITY: Record<RegionSceneStatus, number> =
  {
    none: 0,
    ready: 0.52,
    comingSoon: 0.28,
    sealed: 0.22,
    unknown: 0.18,
  };
