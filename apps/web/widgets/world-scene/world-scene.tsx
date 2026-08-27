'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { cn } from '@/lib/utils';
import {
  getAnimeBySlug,
  requestDiscoveredAnime,
  type CanonicalAnime,
} from '@/shared/anime';
import { discoveredMalIdFromSlug } from '@/shared/anime/anime.mal.identity';
import { rememberArrival } from '@/shared/anime/anime.memory';
import {
  WORLD_FOCUS_NONE,
  WORLD_LIFECYCLE_DEFAULT,
  getRegion,
  initialWorldPresence,
  reduceWorldFocus,
  reduceWorldLifecycle,
  reduceWorldPresence,
  resolveWorldAmbient,
  resolveWorldRegionActivation,
  type WorldFocusRegion,
  type WorldLifecycleEvent,
  type WorldPresenceEvent,
} from '@/shared/world';
import { AnimeDestination } from '@/widgets/anime-destination';
import { WorldClimate } from '@/widgets/world-climate';
import { WorldDetails } from '@/widgets/world-details';
import { WorldEnvironment, WorldRealmCrossing, worldArrivalAtmosphere } from '@/widgets/world-environment';
import { WorldMemoryHorizon } from '@/widgets/world-memory-horizon';
import { WorldIdentity } from '@/widgets/world-identity';
import { WorldKind } from '@/widgets/world-kind';
import { WorldNavigator } from '@/widgets/world-navigator';
import { WorldShell } from '@/widgets/world-shell';
import { worldArrivalPresentation } from '@/widgets/world-layout/world-arrival.presentation';
import { RegionClimate } from '@/widgets/region-climate';
import { RegionScene } from '@/widgets/region-scene';

import { WorldSceneContext } from './world-scene-context';
import {
  worldSceneEnterFrom,
  worldSceneEnterTo,
  worldSceneEnterTransition,
  worldSceneEnterTransitionReduced,
} from './world-scene.motion';
import type {
  WorldSceneContextValue,
  WorldSceneProps,
} from './world-scene.types';

/**
 * WorldScene — Scene Director for composition, Lifecycle, Presence, Focus,
 * and derived Ambient.
 *
 * Environment + WorldClimate are scene-wide layers so the world artwork spans
 * the whole scene rather than only the Shell stage. RegionClimate stays in the
 * Shell presence slot: subordinate to WorldClimate and scoped to the stage.
 *
 * Defaults: Kind → primary, Details → secondary.
 * Arrived anime occupies the identity column as the focal destination.
 * Kind and Details stay mounted and recede. Anime arrival is parallel to
 * Focus. It never enters the Focus reducer or Region Registry. Atmosphere
 * presentation may follow arrivedAnime using existing climate tokens.
 *
 * Navigation arrival Focus handoff observes validated `initialRegionId` prop
 * changes only — never reads search params or writes URL.
 */
export function WorldScene({
  slug,
  world,
  status,
  initialLifecycle = WORLD_LIFECYCLE_DEFAULT,
  initialPresence,
  initialRegionId,
  initialAnimeSlug,
  onRegionActivate,
  onAnimeArrive,
  onAnimeClear,
  identity,
  presence: presenceSlot,
  primary,
  secondary,
  children,
  className,
}: WorldSceneProps) {
  const reduceMotion = useReducedMotion();
  const transition = reduceMotion
    ? worldSceneEnterTransitionReduced
    : worldSceneEnterTransition;

  const [lifecycle, setLifecycle] = useState(initialLifecycle);
  const [presence, setPresence] = useState(
    () => initialPresence ?? initialWorldPresence(status),
  );
  const initialAnime = initialAnimeSlug
    ? (getAnimeBySlug(initialAnimeSlug) ?? null)
    : null;

  const [focusedRegion, setFocusedRegion] = useState<WorldFocusRegion | null>(
    () => (initialAnime ? WORLD_FOCUS_NONE : (initialRegionId ?? WORLD_FOCUS_NONE)),
  );
  const [arrivedAnime, setArrivedAnime] = useState<CanonicalAnime | null>(
    () => initialAnime,
  );

  /** Last applied navigation-arrival identity (null = no region query). */
  const lastArrivalRef = useRef<WorldFocusRegion | null>(
    initialAnime ? null : (initialRegionId ?? null),
  );
  /** Last applied anime-arrival slug (null = no anime query). */
  const lastAnimeArrivalRef = useRef<string | null>(
    initialAnime?.slug ?? null,
  );
  const arrivedAnimeRef = useRef<CanonicalAnime | null>(initialAnime);
  const discoveredHydrateRef = useRef<AbortController | null>(null);

  const dispatchLifecycle = useCallback((event: WorldLifecycleEvent) => {
    setLifecycle((phase) => reduceWorldLifecycle(phase, event));
  }, []);

  const dispatchPresence = useCallback((event: WorldPresenceEvent) => {
    setPresence((current) => reduceWorldPresence(current, event));
  }, []);

  const dispatchFocus = useCallback((region: WorldFocusRegion) => {
    setFocusedRegion((current) =>
      reduceWorldFocus(current, { type: 'focus', region }),
    );
  }, []);

  const clearFocus = useCallback(() => {
    setFocusedRegion((current) => reduceWorldFocus(current, { type: 'clear' }));
  }, []);

  /**
   * Navigation arrival → Focus. Distinct from transient dispatchFocus.
   * Never mutates URL. Validated upstream via resolveInitialRegionFocus.
   */
  const handoffNavigationFocus = useCallback(
    (region: WorldFocusRegion | null) => {
      if (region) {
        setFocusedRegion((current) =>
          reduceWorldFocus(current, { type: 'focus', region }),
        );
      } else {
        setFocusedRegion((current) =>
          reduceWorldFocus(current, { type: 'clear' }),
        );
      }
    },
    [],
  );

  const activateRegion = useCallback(
    (region: WorldFocusRegion) => {
      const intent = resolveWorldRegionActivation(world, region);
      if (!intent) return;
      if (arrivedAnimeRef.current) {
        arrivedAnimeRef.current = null;
        lastAnimeArrivalRef.current = null;
        setArrivedAnime(null);
      }
      onRegionActivate?.(intent);
    },
    [world, onRegionActivate],
  );

  const arriveAnime = useCallback(
    (anime: CanonicalAnime) => {
      if (arrivedAnimeRef.current?.id === anime.id) return;
      arrivedAnimeRef.current = anime;
      lastAnimeArrivalRef.current = anime.slug;
      setArrivedAnime(anime);
      setFocusedRegion((current) =>
        reduceWorldFocus(current, { type: 'clear' }),
      );
      onAnimeArrive?.(anime);
    },
    [onAnimeArrive],
  );

  const clearAnimeArrival = useCallback(() => {
    if (!arrivedAnimeRef.current) return;
    arrivedAnimeRef.current = null;
    lastAnimeArrivalRef.current = null;
    setArrivedAnime(null);
    onAnimeClear?.();
  }, [onAnimeClear]);

  /**
   * Navigation arrival → anime. Distinct from Navigator-driven arriveAnime.
   * Never mutates URL. Validated upstream via resolveInitialAnimeArrival.
   */
  const handoffAnimeArrival = useCallback((slug: string | null) => {
    discoveredHydrateRef.current?.abort();
    discoveredHydrateRef.current = null;

    if (!slug) {
      arrivedAnimeRef.current = null;
      setArrivedAnime(null);
      return;
    }

    const catalog = getAnimeBySlug(slug) ?? null;
    if (catalog) {
      arrivedAnimeRef.current = catalog;
      setArrivedAnime(catalog);
      setFocusedRegion((current) =>
        reduceWorldFocus(current, { type: 'clear' }),
      );
      return;
    }

    const malId = discoveredMalIdFromSlug(slug);
    if (malId == null) {
      arrivedAnimeRef.current = null;
      setArrivedAnime(null);
      return;
    }

    if (arrivedAnimeRef.current?.slug === slug) return;

    const controller = new AbortController();
    discoveredHydrateRef.current = controller;
    requestDiscoveredAnime(malId, controller.signal)
      .then((anime) => {
        if (controller.signal.aborted) return;
        arrivedAnimeRef.current = anime;
        setArrivedAnime(anime);
        if (anime) {
          setFocusedRegion((current) =>
            reduceWorldFocus(current, { type: 'clear' }),
          );
        }
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        arrivedAnimeRef.current = null;
        setArrivedAnime(null);
      });
  }, []);

  // Same-route ?region= / Back / Forward: prop updates without remount.
  // Only runs when validated arrival identity changes — not on transient Focus.
  useEffect(() => {
    const arrival = initialRegionId ?? null;
    if (lastArrivalRef.current === arrival) return;
    lastArrivalRef.current = arrival;
    handoffNavigationFocus(arrival);
  }, [initialRegionId, handoffNavigationFocus]);

  // Same-route ?anime= / Back / Forward. Never writes URL. Never touches
  // the Focus reducer except to clear curated Focus when an anime arrives.
  useEffect(() => {
    const arrival = initialAnimeSlug ?? null;
    if (lastAnimeArrivalRef.current === arrival) return;
    lastAnimeArrivalRef.current = arrival;
    handoffAnimeArrival(arrival);
  }, [initialAnimeSlug, handoffAnimeArrival]);

  useEffect(() => {
    return () => {
      discoveredHydrateRef.current?.abort();
    };
  }, []);

  // World Memory observes committed arrival rather than any one arrival path:
  // in-scene arriveAnime, URL / Back / Forward / discovered hand-off, and the
  // first-load initializer all converge on arrivedAnime. Passive recorder —
  // it owns no state and never writes URL. Identity deduplication lives in the
  // domain, so a repeated effect run records recency instead of a duplicate.
  useEffect(() => {
    if (!arrivedAnime) return;
    rememberArrival(arrivedAnime);
  }, [arrivedAnime]);

  const ambient = resolveWorldAmbient({
    lifecycle,
    presence,
    focusedRegion,
  });

  const atmosphere = worldArrivalAtmosphere({
    arrivedAnime,
    regionClimate: focusedRegion
      ? (getRegion(focusedRegion)?.climate ?? null)
      : null,
  });
  const arrival = worldArrivalPresentation(arrivedAnime != null);

  const contextValue: WorldSceneContextValue = {
    slug,
    world,
    status,
    lifecycle,
    dispatchLifecycle,
    presence,
    dispatchPresence,
    focusedRegion,
    dispatchFocus,
    clearFocus,
    activateRegion,
    arrivedAnime,
    arriveAnime,
    clearAnimeArrival,
    ambient,
  };

  return (
    <WorldSceneContext.Provider value={contextValue}>
      <motion.div
        data-slot="world-scene"
        data-world-slug={slug}
        data-world-id={world?.id}
        data-world-status={status}
        data-world-lifecycle={lifecycle}
        data-world-presence={presence}
        data-world-focus={focusedRegion ?? undefined}
        data-world-anime={arrivedAnime?.slug}
        data-world-ambient-level={ambient.level}
        data-world-ambient-variant={ambient.variant}
        className={cn(
          'relative flex min-h-full w-full flex-1 self-stretch',
          className,
        )}
        initial={reduceMotion ? false : worldSceneEnterFrom}
        animate={worldSceneEnterTo}
        transition={transition}
      >
        <div
          data-slot="world-scene-atmosphere"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        >
          <WorldEnvironment
            atmosphere={atmosphere}
            poster={arrivedAnime?.poster ?? null}
          />
          <WorldClimate />
          <WorldMemoryHorizon />
        </div>
        <WorldRealmCrossing atmosphere={atmosphere} />
        <RegionScene className="relative z-10 pt-4 lg:pt-6">
          <WorldShell
            identity={
              identity ?? (
                <div
                  data-slot="world-identity-column"
                  data-world-arrival={
                    arrival.destinationInIdentity ? 'anime' : 'idle'
                  }
                  className={cn(
                    'flex w-full flex-col',
                    arrival.destinationInIdentity
                      ? 'items-center'
                      : 'items-stretch',
                    arrival.destinationInIdentity && [
                      '[&_[data-slot=world-identity-engine]]:gap-2',
                      '[&_[data-slot=world-identity-title]]:text-lg',
                      '[&_[data-slot=world-identity-title]]:sm:text-xl',
                      '[&_[data-slot=world-identity-title]]:lg:text-2xl',
                      '[&_[data-slot=world-identity-subtitle]]:hidden',
                      '[&_[data-slot=world-identity-tagline]]:hidden',
                      '[&_[data-slot=world-identity-accent]]:hidden',
                    ],
                  )}
                  style={{
                    gap: arrival.identityGap,
                  }}
                >
                  <WorldIdentity />
                  <WorldNavigator />
                  {arrival.destinationInIdentity && arrivedAnime ? (
                    <AnimeDestination key={arrivedAnime.slug} />
                  ) : null}
                </div>
              )
            }
            presence={presenceSlot ?? <RegionClimate />}
            primary={primary ?? children ?? <WorldKind />}
            secondary={
              secondary ?? (
                <WorldDetails recede={arrival.recedeWorldChrome} />
              )
            }
          />
        </RegionScene>
      </motion.div>
    </WorldSceneContext.Provider>
  );
}
