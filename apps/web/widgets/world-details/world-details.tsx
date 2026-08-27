'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import { spacing } from '@/shared/config/theme';
import { legibility } from '@/shared/lib/graphics';
import { DISTANCE } from '@/shared/lib/motion';
import { cn } from '@/lib/utils';
import { useRegionScene } from '@/widgets/region-scene/region-scene-context';
import { worldArrivalChromeOpacity } from '@/widgets/world-layout/world-arrival.presentation';

import {
  WORLD_DETAILS_COPY,
  WORLD_DETAILS_STATUS_OPACITY,
} from './world-details.constants';
import {
  worldDetailsEnterFrom,
  worldDetailsEnterTo,
  worldDetailsEnterTransition,
  worldDetailsEnterTransitionReduced,
  worldDetailsSwapFrom,
  worldDetailsSwapTransition,
  worldDetailsSwapTransitionReduced,
} from './world-details.motion';
import type { WorldDetailsProps } from './world-details.types';

/**
 * WorldDetails — secondary-slot contextual presentation.
 *
 * Consumes `useRegionScene()` only. Never reads Focus or Registry directly.
 * Does not recreate RegionIdentity (no emblem / eyebrow / accent) or
 * WorldKind (no destination edge, wash, marker, or focus scale).
 */
export function WorldDetails({ className, recede = false }: WorldDetailsProps) {
  const { currentRegion, regionStatus } = useRegionScene();
  const reduceMotion = useReducedMotion();

  const swapTransition = reduceMotion
    ? worldDetailsSwapTransitionReduced
    : worldDetailsSwapTransition;
  const emphasis = worldArrivalChromeOpacity(
    WORLD_DETAILS_STATUS_OPACITY[regionStatus],
    recede,
  );
  const swapKey = currentRegion?.id ?? regionStatus;

  const statusHint =
    regionStatus === 'comingSoon'
      ? WORLD_DETAILS_COPY.comingSoon
      : regionStatus === 'sealed'
        ? WORLD_DETAILS_COPY.sealed
        : undefined;

  const showRegionCopy =
    currentRegion != null &&
    (regionStatus === 'ready' ||
      regionStatus === 'comingSoon' ||
      regionStatus === 'sealed');

  return (
    <motion.div
      data-slot="world-details"
      data-region-id={currentRegion?.id}
      data-region-status={regionStatus}
      className={cn(
        'mx-auto w-full max-w-md text-center lg:mx-0 lg:max-w-none lg:text-left',
        className,
      )}
      data-arrival-recede={recede || undefined}
      initial={reduceMotion ? false : worldDetailsEnterFrom}
      animate={{ ...worldDetailsEnterTo, opacity: emphasis }}
      transition={
        reduceMotion
          ? worldDetailsEnterTransitionReduced
          : worldDetailsEnterTransition
      }
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={swapKey}
          initial={reduceMotion ? false : worldDetailsSwapFrom}
          animate={{ opacity: 1, y: 0 }}
          exit={
            reduceMotion
              ? undefined
              : { opacity: 0, y: -(DISTANCE.SM / 3) }
          }
          transition={swapTransition}
          className="flex flex-col items-center lg:items-start"
          style={{ gap: recede ? spacing.xs : spacing.sm }}
        >
          {showRegionCopy ? (
            <>
              <p
                className={cn(
                  'text-[0.5625rem] uppercase tracking-[0.32em] text-muted-foreground',
                  legibility.copy,
                )}
              >
                {currentRegion.displayName}
              </p>
              <p
                className={cn(
                  recede
                    ? 'line-clamp-2 text-xs leading-relaxed text-foreground/75'
                    : 'text-sm leading-relaxed text-foreground/75',
                  legibility.copy,
                )}
              >
                {currentRegion.description}
              </p>
              {statusHint ? (
                <p
                  className={cn(
                    'text-[0.5625rem] uppercase tracking-[0.32em] text-muted-foreground',
                    legibility.copy,
                  )}
                >
                  {statusHint}
                </p>
              ) : null}
            </>
          ) : (
            <p
              className={cn(
                'text-xs leading-relaxed text-muted-foreground',
                legibility.copy,
              )}
            >
              {regionStatus === 'unknown'
                ? WORLD_DETAILS_COPY.unknown
                : WORLD_DETAILS_COPY.idle}
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
