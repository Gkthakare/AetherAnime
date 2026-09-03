'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { spacing } from '@/shared/config/theme';
import { legibility } from '@/shared/lib/graphics';
import { DISTANCE } from '@/shared/lib/motion';
import {
  isContinuumDiscoveryRegion,
  resolveContinuumDiscoveryCandidates,
} from '@/shared/world';
import { cn } from '@/lib/utils';
import {
  navigatorPathFromCatalog,
  WORLD_NAVIGATOR_PATH,
} from '@/widgets/world-navigator/world-navigator.paths';
import { useRegionScene } from '@/widgets/region-scene/region-scene-context';
import { useWorldScene } from '@/widgets/world-scene/world-scene-context';

import { REGION_ACTIVITY_LABEL } from './region-activities.constants';
import {
  regionActivitiesEnterFrom,
  regionActivitiesEnterTo,
  regionActivitiesEnterTransitionReduced,
  regionActivitiesSwapTransition,
  regionActivitiesSwapTransitionReduced,
} from './region-activities.motion';

/**
 * ContinuumDiscovery — World landmark explore activity.
 *
 * Surfaces curated catalog destinations when Continuum is focused.
 * Selection hands off to WorldScene arriveAnime (TASK-092 transport).
 */
export function RegionContinuumDiscovery({ className }: { className?: string }) {
  const { currentRegion, regionStatus } = useRegionScene();
  const { arriveAnime, isTransportLocked, arrivedAnime } = useWorldScene();
  const reduceMotion = useReducedMotion();

  const ready =
    currentRegion != null &&
    isContinuumDiscoveryRegion(currentRegion.id) &&
    regionStatus === 'ready' &&
    currentRegion.activities?.includes('explore');

  const candidates = ready ? resolveContinuumDiscoveryCandidates() : [];
  const visible = ready && candidates.length > 0 && !arrivedAnime;

  const swapTransition = reduceMotion
    ? regionActivitiesSwapTransitionReduced
    : regionActivitiesSwapTransition;

  if (!visible || !currentRegion) return null;

  return (
    <motion.div
      key={currentRegion.id}
      data-slot="region-continuum-discovery"
      data-region-id={currentRegion.id}
      data-activity="explore"
      className={cn(
        'mx-auto flex w-full max-w-md flex-col items-stretch',
        className,
      )}
      style={{ gap: spacing.sm }}
      initial={reduceMotion ? false : regionActivitiesEnterFrom}
      animate={regionActivitiesEnterTo}
      exit={
        reduceMotion ? undefined : { opacity: 0, y: -(DISTANCE.SM / 3) }
      }
      transition={
        reduceMotion ? regionActivitiesEnterTransitionReduced : swapTransition
      }
    >
      <p
        className={cn(
          'text-center text-[0.5625rem] uppercase tracking-[0.28em] text-muted-foreground lg:text-left',
          legibility.copy,
        )}
      >
        {REGION_ACTIVITY_LABEL.explore}
      </p>

      <ul
        data-slot="region-continuum-discovery-paths"
        className={WORLD_NAVIGATOR_PATH.list}
        style={{ gap: spacing.xs }}
      >
        {candidates.map((anime, index) => {
          const path = navigatorPathFromCatalog(anime);
          const isPrimary = index === 0;

          return (
            <motion.li
              key={path.key}
              className="w-full"
              initial={reduceMotion ? false : { opacity: 0, y: DISTANCE.SM / 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.28,
                delay: reduceMotion ? 0 : index * 0.05,
              }}
            >
              <button
                type="button"
                data-slot="region-continuum-discovery-candidate"
                data-candidate-slug={anime.slug}
                data-candidate-primary={isPrimary || undefined}
                disabled={isTransportLocked}
                aria-label={`Travel to ${path.title}`}
                onClick={() => {
                  if (isTransportLocked) return;
                  arriveAnime(anime);
                }}
                className={cn(WORLD_NAVIGATOR_PATH.item, legibility.copy)}
              >
                <span className={WORLD_NAVIGATOR_PATH.title}>{path.title}</span>
                {path.meta ? (
                  <span className={WORLD_NAVIGATOR_PATH.meta}>{path.meta}</span>
                ) : null}
                {isPrimary ? (
                  <span className={WORLD_NAVIGATOR_PATH.context}>
                    Found in the continuum
                  </span>
                ) : null}
              </button>
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
}
