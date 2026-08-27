/**
 * Region activity execution descriptors — capability only, no routing side effects.
 *
 * Portal metadata via `resolvePortalDestination`.
 * Navigation target + href via `resolveWorldNavigationTarget` / `worldHref`.
 */

import {
  resolveWorldNavigationTarget,
  worldHref,
} from '@/shared/lib/navigation';
import type { WorldRegionActivity, WorldRegionDefinition } from '@/shared/world';
import { resolvePortalDestination } from '@/shared/world/world.region.portal';
import type { RegionSceneStatus } from '@/widgets/region-scene';

import { REGION_ACTIVITY_LABEL } from './region-activities.constants';

export type RegionActivityCapability =
  | {
      readonly kind: 'executable';
      readonly activity: 'portal';
      readonly href: string;
      readonly label: string;
      readonly ariaLabel: string;
    }
  | {
      readonly kind: 'unavailable';
      readonly activity: WorldRegionActivity;
      readonly label: string;
    }
  | {
      readonly kind: 'unsupported';
      readonly activity: WorldRegionActivity;
      readonly label: string;
    };

/**
 * Resolve whether a Region activity can execute.
 * Only `portal` with a resolvable navigation target is executable.
 */
export function resolveRegionActivityCapability(
  activity: WorldRegionActivity,
  region: WorldRegionDefinition,
  regionStatus: RegionSceneStatus,
): RegionActivityCapability {
  const label = REGION_ACTIVITY_LABEL[activity];

  if (regionStatus === 'comingSoon' || regionStatus === 'sealed') {
    return { kind: 'unavailable', activity, label };
  }

  if (activity !== 'portal') {
    return { kind: 'unsupported', activity, label };
  }

  const destination = resolvePortalDestination(region);
  if (destination.status === 'executable') {
    const target = resolveWorldNavigationTarget(destination);
    if (!target) {
      return { kind: 'unavailable', activity: 'portal', label };
    }
    const targetName =
      destination.label?.trim() || target.regionId || target.worldSlug;
    return {
      kind: 'executable',
      activity: 'portal',
      href: worldHref(target),
      label,
      ariaLabel: `Enter ${targetName}`,
    };
  }

  return { kind: 'unavailable', activity: 'portal', label };
}
