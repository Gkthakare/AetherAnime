/**
 * RegionActivities — presentation config only (no Region content).
 *
 * Activity *tokens* come from WorldRegionDefinition.activities.
 * Labels here are display mapping for those tokens — not invented activities.
 */

import type { WorldRegionActivity } from '@/shared/world';
import type { RegionSceneStatus } from '@/widgets/region-scene';

/** Human-readable labels for canonical activity tokens. */
export const REGION_ACTIVITY_LABEL: Record<WorldRegionActivity, string> = {
  explore: 'Explore',
  lore: 'Discover',
  social: 'Meet',
  companion: 'Meet',
  play: 'Play',
  portal: 'Enter',
  media: 'Watch',
};

/** Opacity by RegionScene status — presentation only. */
export const REGION_ACTIVITIES_STATUS_OPACITY: Record<
  RegionSceneStatus,
  number
> = {
  none: 0,
  ready: 1,
  comingSoon: 0.72,
  sealed: 0.62,
  unknown: 0,
};
