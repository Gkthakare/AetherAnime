'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { useRegionScene } from '@/widgets/region-scene/region-scene-context';

import {
  REGION_CLIMATE_FALLBACK_GRADIENT,
  REGION_CLIMATE_GRADIENT,
  REGION_CLIMATE_STATUS_OPACITY,
} from './region-climate.constants';
import {
  regionClimateEnterTransition,
  regionClimateEnterTransitionReduced,
  regionClimateSwapTransition,
  regionClimateSwapTransitionReduced,
} from './region-climate.motion';
import type { RegionClimateProps } from './region-climate.types';

/**
 * RegionClimate — Region-level atmospheric emphasis in the presence layer.
 *
 * Observes `useRegionScene()` only. Does not replace WorldClimate.
 * No Registry lookup. No Focus read. No continuous loops.
 */
export function RegionClimate({ className }: RegionClimateProps) {
  const { currentRegion, regionStatus } = useRegionScene();
  const reduceMotion = useReducedMotion();

  const climate = currentRegion?.climate;
  const peak = REGION_CLIMATE_STATUS_OPACITY[regionStatus];
  const gradient =
    climate != null
      ? REGION_CLIMATE_GRADIENT[climate]
      : REGION_CLIMATE_FALLBACK_GRADIENT;

  const swapKey =
    regionStatus === 'none'
      ? 'none'
      : `${climate ?? 'fallback'}:${regionStatus}`;

  const transition = reduceMotion
    ? regionClimateSwapTransitionReduced
    : regionClimateSwapTransition;

  return (
    <div
      data-slot="region-climate-host"
      className={cn('pointer-events-none absolute inset-0', className)}
      aria-hidden="true"
    >
      <AnimatePresence mode="wait" initial={false}>
        {peak > 0 ? (
          <motion.div
            key={swapKey}
            data-slot="region-climate"
            data-region-climate={climate ?? 'fallback'}
            data-region-status={regionStatus}
            className="absolute inset-0"
            style={{ background: gradient }}
            initial={
              reduceMotion
                ? false
                : { opacity: 0 }
            }
            animate={{ opacity: peak }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={
              reduceMotion
                ? regionClimateEnterTransitionReduced
                : peak > 0
                  ? transition
                  : regionClimateEnterTransition
            }
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
