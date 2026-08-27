/**
 * WorldScene — types only.
 *
 * Scene Director owns Lifecycle, Presence, Focus, and parallel anime arrival.
 * Ambient is derived visual state — never dispatched.
 * Does not look up Registry or own Navigation / Portal.
 * Anime arrival is not Focus, not Registry, and not Region climate.
 */

import type { ReactNode } from 'react';

import type { CanonicalAnime } from '@/shared/anime';
import type {
  WorldAmbient,
  WorldDefinition,
  WorldFocusRegion,
  WorldLifecycle,
  WorldLifecycleEvent,
  WorldPresence,
  WorldPresenceEvent,
  WorldRegionActivationIntent,
} from '@/shared/world';
import type {
  WorldShellSlots,
  WorldShellStatus,
} from '@/widgets/world-shell';

/** Shared context for features mounted under the Scene Director. */
export type WorldSceneContextValue = {
  readonly slug: string;
  readonly world?: WorldDefinition;
  readonly status: WorldShellStatus;
  readonly lifecycle: WorldLifecycle;
  readonly dispatchLifecycle: (event: WorldLifecycleEvent) => void;
  readonly presence: WorldPresence;
  readonly dispatchPresence: (event: WorldPresenceEvent) => void;
  /** Interaction attention — null when none. */
  readonly focusedRegion: WorldFocusRegion | null;
  readonly dispatchFocus: (region: WorldFocusRegion) => void;
  readonly clearFocus: () => void;
  /** Explicit Region commit — distinct from transient Focus. */
  readonly activateRegion: (region: WorldFocusRegion) => void;
  /**
   * Parallel anime arrival — never a FocusRegion, never Registry-backed.
   * Null when the world has no arrived anime.
   */
  readonly arrivedAnime: CanonicalAnime | null;
  readonly arriveAnime: (anime: CanonicalAnime) => void;
  readonly clearAnimeArrival: () => void;
  /** Derived visual ambient — observe only. */
  readonly ambient: WorldAmbient;
};

export interface WorldSceneProps extends WorldShellSlots {
  slug: string;
  world?: WorldDefinition;
  status: WorldShellStatus;
  initialLifecycle?: WorldLifecycle;
  initialPresence?: WorldPresence;
  /**
   * Validated navigation-arrival Region from the World route.
   * Mount: seeds Focus. Subsequent prop changes: navigation → Focus handoff.
   * Never read from search params inside WorldScene.
   */
  initialRegionId?: WorldFocusRegion;
  /**
   * Validated catalog anime slug from the World route.
   * Mount: seeds arrivedAnime. Subsequent prop changes: navigation handoff.
   * Never read from search params inside WorldScene.
   */
  initialAnimeSlug?: string;
  /** Optional observer for explicit Region activation intents. */
  onRegionActivate?: (intent: WorldRegionActivationIntent) => void;
  /** Optional observer for intentional anime arrival (URL write lives in Navigation). */
  onAnimeArrive?: (anime: CanonicalAnime) => void;
  /** Optional observer for clearing anime arrival. */
  onAnimeClear?: () => void;
  children?: ReactNode;
  className?: string;
}
