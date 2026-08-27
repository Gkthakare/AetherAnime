/**
 * WorldClimate — gradient atmospheres (CSS only; theme variables).
 *
 * Status overrides for unknown / comingSoon. Otherwise Ambient variant
 * drives Soft Aether mood. No artwork, images, or textures.
 */

import type { WorldAmbientVariant } from '@/shared/world';
import type { WorldShellStatus } from '@/widgets/world-shell';

import type { WorldClimateMood } from './world-climate.types';

/**
 * 1920 CSS px and above. Isolation showed two full-viewport opacity loops
 * over the landscape stack drop idle below 60; this gate freezes climate
 * drift so living light remains the only breath.
 */
export const WORLD_CLIMATE_LARGE_IDLE_SURFACE_MEDIA = '(min-width: 120rem)';

/** Soft full-bleed gradients — color-mix against theme tokens only. */
export const WORLD_CLIMATE_GRADIENT: Record<WorldClimateMood, string> = {
  calm:
    'radial-gradient(ellipse 70% 55% at 50% 40%, color-mix(in oklab, var(--primary) 16%, transparent), transparent 70%), radial-gradient(ellipse 90% 70% at 50% 100%, color-mix(in oklab, var(--ring) 10%, transparent), transparent 65%)',
  dream:
    'radial-gradient(ellipse 65% 60% at 48% 35%, color-mix(in oklab, var(--ring) 18%, transparent), transparent 72%), radial-gradient(ellipse 80% 55% at 60% 90%, color-mix(in oklab, var(--primary) 12%, transparent), transparent 60%)',
  mystic:
    'radial-gradient(ellipse 60% 50% at 52% 30%, color-mix(in oklab, var(--primary) 22%, transparent), transparent 68%), radial-gradient(ellipse 85% 60% at 40% 95%, color-mix(in oklab, var(--foreground) 6%, transparent), transparent 55%)',
  energetic:
    'radial-gradient(ellipse 75% 50% at 50% 25%, color-mix(in oklab, var(--primary) 26%, transparent), transparent 65%), radial-gradient(ellipse 70% 50% at 70% 80%, color-mix(in oklab, var(--ring) 14%, transparent), transparent 58%)',
  unknown:
    'radial-gradient(ellipse 70% 55% at 50% 45%, color-mix(in oklab, var(--muted-foreground) 12%, transparent), transparent 70%)',
  comingSoon:
    'radial-gradient(ellipse 65% 50% at 50% 40%, color-mix(in oklab, var(--ring) 14%, transparent), transparent 68%), radial-gradient(ellipse 80% 45% at 50% 100%, color-mix(in oklab, var(--primary) 8%, transparent), transparent 60%)',
};

/**
 * Resolve mood from Scene status + Ambient variant.
 * Status wins for unknown / comingSoon; otherwise Ambient owns emphasis.
 */
export function resolveWorldClimateMood(
  status: WorldShellStatus,
  variant: WorldAmbientVariant,
): WorldClimateMood {
  if (status === 'unknown') return 'unknown';
  if (status === 'comingSoon') return 'comingSoon';
  return variant;
}
