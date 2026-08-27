'use client';

import { useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { spacing } from '@/shared/config/theme';
import { getRegion, type WorldRegionId } from '@/shared/world';
import { RegionActivities } from '@/widgets/region-activities';
import { RegionIdentity } from '@/widgets/region-identity';
import { useWorldScene } from '@/widgets/world-scene/world-scene-context';

import { resolveRegionSceneStatus } from './region-scene.constants';
import { RegionSceneContext } from './region-scene-context';
import {
  regionSceneEnterFrom,
  regionSceneEnterTo,
  regionSceneEnterTransition,
  regionSceneEnterTransitionReduced,
} from './region-scene.motion';
import type {
  RegionSceneContextValue,
  RegionSceneProps,
} from './region-scene.types';

/**
 * RegionScene — Region runtime layer under WorldScene.
 *
 * Derives currentRegion from World Focus + Region Registry.
 * Defaults: Identity → RegionIdentity (orientation), then Shell children,
 * then RegionActivities (actions after destinations / context).
 * Does not own Focus, World Lifecycle, Portal, or routing.
 */
export function RegionScene({
  identity,
  activities,
  children,
  className,
}: RegionSceneProps) {
  const { focusedRegion, dispatchFocus, clearFocus } = useWorldScene();
  const reduceMotion = useReducedMotion();
  const transition = reduceMotion
    ? regionSceneEnterTransitionReduced
    : regionSceneEnterTransition;

  const currentRegion = focusedRegion
    ? (getRegion(focusedRegion) ?? null)
    : null;
  const regionStatus = resolveRegionSceneStatus(currentRegion, focusedRegion);

  const selectRegion = useCallback(
    (id: WorldRegionId) => {
      dispatchFocus(id);
    },
    [dispatchFocus],
  );

  const clearRegion = useCallback(() => {
    clearFocus();
  }, [clearFocus]);

  const contextValue: RegionSceneContextValue = {
    currentRegion,
    regionStatus,
    selectRegion,
    clearRegion,
  };

  return (
    <RegionSceneContext.Provider value={contextValue}>
      <motion.div
        data-slot="region-scene"
        data-region-id={currentRegion?.id ?? focusedRegion ?? undefined}
        data-region-slug={currentRegion?.slug}
        data-region-status={regionStatus}
        className={className}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: spacing.lg,
          width: '100%',
        }}
        initial={reduceMotion ? false : regionSceneEnterFrom}
        animate={regionSceneEnterTo}
        transition={transition}
      >
        {identity ?? <RegionIdentity />}
        {children}
        {activities ?? <RegionActivities />}
      </motion.div>
    </RegionSceneContext.Provider>
  );
}
