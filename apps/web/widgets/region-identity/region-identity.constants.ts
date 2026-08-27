/**
 * RegionIdentity — structural fallback copy + accent class maps (no motion).
 *
 * Region-specific copy comes from WorldRegionDefinition via RegionScene.
 * Only status fallbacks and structural labels live here.
 */

import type { WorldRegionAccent } from '@/shared/world';
import type { RegionSceneStatus } from '@/widgets/region-scene';

export const REGION_IDENTITY_COPY = {
  noneEyebrow: 'Regional space',
  noneTitle: 'No region focused',
  noneDescription:
    'Focus a region to reveal its identity here.',
  unknownEyebrow: 'Unrecognized',
  unknownTitle: 'Region unknown',
  unknownDescription:
    'This focus has no Region Registry entry.',
  comingSoonHint: 'Coming soon',
  sealedHint: 'Sealed',
} as const;

/** Emblem edge / fill / accent rule classes from Region accent tokens. */
export const REGION_IDENTITY_ACCENT_CLASS: Record<
  WorldRegionAccent,
  { readonly emblem: string; readonly fill: string; readonly rule: string }
> = {
  neutral: {
    emblem: 'border-border/40',
    fill: 'bg-border/25',
    rule: 'bg-border/40',
  },
  subtle: {
    emblem: 'border-border/50',
    fill: 'bg-muted-foreground/15',
    rule: 'bg-muted-foreground/25',
  },
  ring: {
    emblem: 'border-ring/45',
    fill: 'bg-ring/15',
    rule: 'bg-ring/35',
  },
  primary: {
    emblem: 'border-primary/40',
    fill: 'bg-primary/15',
    rule: 'bg-primary/35',
  },
  muted: {
    emblem: 'border-border/25',
    fill: 'bg-border/15',
    rule: 'bg-border/25',
  },
};

export const REGION_IDENTITY_ACCENT_FALLBACK =
  REGION_IDENTITY_ACCENT_CLASS.neutral;

/**
 * Opacity emphasis by RegionScene status — presentation only.
 *
 * `none` sits well below the rest of the scale: with no region focused the
 * World identity must own the composition, so the Region layer recedes to a
 * marker rather than reading as a second hero. Focused statuses stay below
 * WorldIdentity (opacity 1) so orientation never competes with the world name.
 */
export const REGION_IDENTITY_STATUS_OPACITY: Record<
  RegionSceneStatus,
  number
> = {
  none: 0.45,
  ready: 0.82,
  comingSoon: 0.72,
  sealed: 0.64,
  unknown: 0.7,
};
