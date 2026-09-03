'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { spacing } from '@/shared/config/theme';
import { legibility } from '@/shared/lib/graphics';
import { DISTANCE, DURATION, EASING, STAGGER } from '@/shared/lib/motion';
import {
  isContinuumDiscoveryRegion,
  resolveContinuumDiscoveryCandidates,
} from '@/shared/world';
import { cn } from '@/lib/utils';
import { useRegionScene } from '@/widgets/region-scene/region-scene-context';
import { useWorldScene } from '@/widgets/world-scene/world-scene-context';

import {
  regionActivitiesEnterFrom,
  regionActivitiesEnterTo,
  regionActivitiesEnterTransitionReduced,
  regionActivitiesSwapTransition,
  regionActivitiesSwapTransitionReduced,
} from './region-activities.motion';

/**
 * ContinuumDiscovery — destinations gathered on the Continuum footing.
 *
 * Catalog candidates rise from the landmark itself. Selection hands off to
 * WorldScene arriveAnime (TASK-092 transport). Not a Navigator result list.
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
      id="world-continuum-discovery"
      data-slot="region-continuum-discovery"
      data-region-id={currentRegion.id}
      data-activity="explore"
      className={cn('flex w-full flex-col items-stretch', className)}
      style={{ gap: spacing.xs }}
      initial={reduceMotion ? false : regionActivitiesEnterFrom}
      animate={regionActivitiesEnterTo}
      exit={
        reduceMotion ? undefined : { opacity: 0, y: -(DISTANCE.SM / 3) }
      }
      transition={
        reduceMotion ? regionActivitiesEnterTransitionReduced : swapTransition
      }
    >
      <ul
        data-slot="region-continuum-discovery-signals"
        className="m-0 flex list-none flex-row flex-wrap items-end p-0"
        style={{ gap: spacing.md }}
      >
        {candidates.map((anime, index) => {
          const isPrimary = index === 0;

          return (
            <motion.li
              key={anime.id}
              className="min-w-0"
              initial={
                reduceMotion ? false : { opacity: 0, y: DISTANCE.SM }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? DURATION.FAST : DURATION.NORMAL,
                delay: reduceMotion ? 0 : index * STAGGER.FAST,
                ease: EASING.entrance,
              }}
            >
              <button
                type="button"
                data-slot="region-continuum-discovery-candidate"
                data-candidate-slug={anime.slug}
                data-candidate-primary={isPrimary || undefined}
                disabled={isTransportLocked}
                aria-label={`Travel to ${anime.canonicalTitle}`}
                onClick={() => {
                  if (isTransportLocked) return;
                  arriveAnime(anime);
                }}
                className={cn(
                  'relative bg-transparent text-left text-foreground/85 outline-none',
                  'transition-colors duration-200 motion-reduce:transition-none',
                  'hover:text-foreground',
                  'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  legibility.copy,
                )}
              >
                <span
                  data-slot="region-continuum-discovery-title"
                  className={cn(
                    'block tracking-[0.01em]',
                    isPrimary ? 'text-base' : 'text-sm',
                  )}
                >
                  {anime.canonicalTitle}
                </span>
              </button>
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
}
