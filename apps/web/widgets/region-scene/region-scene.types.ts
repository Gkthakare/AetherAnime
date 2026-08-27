/**
 * RegionScene — types only.
 *
 * Region runtime layer. Selection signal is World Focus; RegionScene resolves
 * registry metadata + status. No Lifecycle / Presence / Ambient / Navigation.
 */

import type { ReactNode } from 'react';

import type { WorldRegionDefinition, WorldRegionId } from '@/shared/world';

/** Runtime status for the current Region. */
export const REGION_SCENE_STATUSES = [
  'none',
  'ready',
  'comingSoon',
  'sealed',
  'unknown',
] as const;

export type RegionSceneStatus = (typeof REGION_SCENE_STATUSES)[number];

/** Shared context for features mounted under RegionScene. */
export type RegionSceneContextValue = {
  /** Resolved region metadata from Focus + Region Registry — null when none. */
  readonly currentRegion: WorldRegionDefinition | null;
  /** Derived from Focus + availability. */
  readonly regionStatus: RegionSceneStatus;
  /**
   * Select region — forwards to World Focus (canonical selection signal).
   * RegionScene does not store a parallel selection.
   */
  readonly selectRegion: (id: WorldRegionId) => void;
  /** Clear selection — forwards to World Focus clear. */
  readonly clearRegion: () => void;
};

export type RegionSceneProps = {
  /** Identity override; defaults to RegionIdentity. */
  identity?: ReactNode;
  /** Activities override; defaults to RegionActivities. */
  activities?: ReactNode;
  children?: ReactNode;
  className?: string;
};
