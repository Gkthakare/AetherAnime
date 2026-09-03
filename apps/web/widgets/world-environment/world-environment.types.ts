import type { ReactNode } from 'react';

import type { WorldClimate } from '@/shared/world';

import type { WorldArrivalAtmosphere } from './world-arrival.atmosphere';

export type WorldEnvironmentProps = {
  readonly className?: string;
  /**
   * Soft Aether climate of the focused destination.
   *
   * Presentation token only — not a Region, not Focus state. Omit or `null`
   * leaves the dimensional light and identity veil in their neutral rest.
   * Prefer `atmosphere` when derived from WorldScene.
   */
  readonly destinationClimate?: WorldClimate | null;
  /**
   * Idle / region / arrival presentation. When provided, climate and mix
   * follow this object instead of `destinationClimate` plus default opacities.
   */
  readonly atmosphere?: WorldArrivalAtmosphere;
  /**
   * Catalog poster path for the decorative arrival wash.
   * Null when idle, candidate, unknown, or discovered (no local poster).
   */
  readonly poster?: string | null;
  /** Pause idle living breath during departure before arrival atmosphere. */
  readonly transportActive?: boolean;
};

export type EnvironmentDepthProps = {
  readonly children: ReactNode;
  readonly className?: string;
};

type PlateSize = { readonly width: number; readonly height: number };

/** One image layer inside the depth composition. */
export type EnvironmentPlateLayerProps = {
  readonly slot: string;
  readonly landscape: string;
  readonly landscapeSize: PlateSize;
  /** Omit for a layer that only exists in landscape. */
  readonly portrait?: string;
  readonly portraitSize?: PlateSize;
  readonly transform: string;
  readonly priority?: boolean;
  readonly className?: string;
  readonly imageClassName?: string;
};
