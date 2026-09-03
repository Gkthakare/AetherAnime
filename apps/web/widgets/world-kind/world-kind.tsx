'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { spacing } from '@/shared/config/theme';
import { legibility } from '@/shared/lib/graphics';
import { Surface } from '@/shared/ui/surface';
import {
  isContinuumDiscoveryRegion,
  isWorldRegionInteractive,
  resolveWorldRegions,
} from '@/shared/world';
import { cn } from '@/lib/utils';
import { RegionContinuumDiscovery } from '@/widgets/region-activities';
import { useWorldScene } from '@/widgets/world-scene/world-scene-context';

import {
  WORLD_KIND_PLACEHOLDERS,
  WORLD_KIND_REGION_EDGE,
  WORLD_KIND_REGION_EDGE_FALLBACK,
  WORLD_KIND_REGION_PATH,
  WORLD_KIND_REGION_PATH_ARRIVAL,
  WORLD_KIND_REGION_PLATE,
  WORLD_KIND_REGION_PLATE_FALLBACK,
  resolveWorldKindMode,
} from './world-kind.constants';
import {
  worldKindEnterFrom,
  worldKindEnterTo,
  worldKindEnterTransition,
  worldKindEnterTransitionReduced,
  worldKindFocusTransition,
  worldKindOpacity,
  worldKindRegionOpacity,
  worldKindRegionScale,
} from './world-kind.motion';
import type { WorldKindProps } from './world-kind.types';
import './world-kind.landmarks.css';

function focusRemainsInRegion(
  current: EventTarget,
  next: EventTarget | null,
): boolean {
  return next instanceof Node && current instanceof Node && current.contains(next);
}

/**
 * WorldKind — primary-slot composition language for World Engine.
 *
 * Observes Scene context including Focus. Regions from Region Engine;
 * Focus is owned by WorldScene — Kind only renders it.
 */
export function WorldKind({ className }: WorldKindProps) {
  const {
    world,
    status,
    lifecycle,
    ambient,
    focusedRegion,
    dispatchFocus,
    clearFocus,
    activateRegion,
    arrivedAnime,
    transportPhase,
  } = useWorldScene();
  const reduceMotion = useReducedMotion();

  const mode = resolveWorldKindMode(status, world?.kind);
  const placeholder = WORLD_KIND_PLACEHOLDERS[mode];
  const regions = resolveWorldRegions(status, world);
  const recede = arrivedAnime != null || transportPhase !== 'idle';
  const chromeGap = recede ? spacing.xs : spacing.md;
  const baseOpacity = worldKindOpacity(lifecycle, ambient, recede);

  return (
    <motion.div
      data-slot="world-kind"
      data-kind-mode={mode}
      data-world-lifecycle={lifecycle}
      data-world-ambient-level={ambient.level}
      data-world-ambient-variant={ambient.variant}
      data-world-focus={focusedRegion ?? undefined}
      className={cn('w-full', className)}
      data-arrival-recede={recede || undefined}
      initial={reduceMotion ? false : worldKindEnterFrom}
      animate={{ ...worldKindEnterTo, opacity: baseOpacity }}
      transition={
        reduceMotion
          ? worldKindEnterTransitionReduced
          : worldKindEnterTransition
      }
    >
      <div
        className="flex w-full flex-col items-stretch"
        style={{ gap: chromeGap }}
      >
        <div
          data-slot="world-kind-header"
          className="flex flex-col items-center text-center"
          style={{ gap: spacing.xs }}
        >
          <p
            className={cn(
              'text-[0.625rem] uppercase tracking-[0.32em] text-muted-foreground',
              legibility.copy,
            )}
          >
            {placeholder.eyebrow}
          </p>
          <p
            className={cn(
              'text-xs text-muted-foreground/70',
              legibility.copy,
            )}
          >
            {placeholder.title}
          </p>
        </div>

        <div
          className={recede ? WORLD_KIND_REGION_PATH_ARRIVAL : WORLD_KIND_REGION_PATH}
          data-kind-landmarks={recede ? undefined : true}
          style={{ gap: chromeGap }}
        >
          {regions.map((region) => {
            const interactive = isWorldRegionInteractive(region);
            const isFocused = focusedRegion === region.id;
            const regionOpacity = worldKindRegionOpacity(
              1,
              focusedRegion,
              region.id,
            );
            const scale = worldKindRegionScale(
              focusedRegion,
              region.id,
              !!reduceMotion,
            );

            const edge = region.accent
              ? WORLD_KIND_REGION_EDGE[region.accent]
              : WORLD_KIND_REGION_EDGE_FALLBACK;
            const plate = region.accent
              ? WORLD_KIND_REGION_PLATE[region.accent]
              : WORLD_KIND_REGION_PLATE_FALLBACK;

            let plateClass = 'bg-transparent';
            if (recede) {
              plateClass = isFocused ? plate.focused : plate.rest;
            }

            const handleActivate = () => {
              if (interactive) activateRegion(region.id);
            };

            return (
              <motion.div
                key={region.id}
                data-slot="world-kind-region"
                data-region-id={region.id}
                data-region-slug={region.slug}
                data-region-availability={region.availability}
                data-region-order={region.order}
                data-focused={isFocused || undefined}
                data-arrival-recede={recede || undefined}
                className={cn(
                  'origin-left',
                  recede ? 'w-full' : 'flex min-w-0 flex-1 basis-0 flex-col',
                )}
                animate={{ opacity: regionOpacity, scale }}
                transition={worldKindFocusTransition}
                onPointerEnter={() => {
                  if (interactive) dispatchFocus(region.id);
                }}
                onPointerLeave={(event) => {
                  if (!interactive) return;
                  if (
                    focusRemainsInRegion(
                      event.currentTarget,
                      event.currentTarget.ownerDocument.activeElement,
                    )
                  ) {
                    return;
                  }
                  clearFocus();
                }}
                onFocus={() => {
                  if (interactive) dispatchFocus(region.id);
                }}
                onBlur={(event) => {
                  if (!interactive) return;
                  if (focusRemainsInRegion(event.currentTarget, event.relatedTarget)) {
                    return;
                  }
                  clearFocus();
                }}
              >
                <Surface
                  variant="transparent"
                  tabIndex={interactive ? 0 : undefined}
                  role={interactive ? 'button' : undefined}
                  aria-label={
                    interactive ? `Activate ${region.displayName}` : undefined
                  }
                  aria-expanded={
                    isContinuumDiscoveryRegion(region.id)
                      ? isFocused
                      : undefined
                  }
                  aria-controls={
                    isContinuumDiscoveryRegion(region.id)
                      ? 'world-continuum-discovery'
                      : undefined
                  }
                  onClick={(event) => {
                    if (event.detail === 0) return;
                    handleActivate();
                  }}
                  onKeyDown={(event) => {
                    if (!interactive) return;
                    if (event.key !== 'Enter' && event.key !== ' ') return;
                    event.preventDefault();
                    handleActivate();
                  }}
                  className={cn(
                    'relative flex w-full text-left outline-none',
                    recede ? 'items-center' : 'items-end',
                    recede ? 'min-h-0' : 'min-h-11',
                    'border border-transparent transition-colors duration-200 motion-reduce:transition-none',
                    plateClass,
                    interactive && [
                      'cursor-pointer',
                      'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    ],
                  )}
                  style={{
                    paddingBlock: recede ? spacing.xs : undefined,
                    paddingInline: recede ? spacing.md : spacing.lg,
                  }}
                >
                  <span
                    data-slot="world-kind-region-edge"
                    aria-hidden="true"
                    className={cn(
                      'absolute left-0 transition-[width,background-color] duration-200 motion-reduce:transition-none',
                      recede
                        ? 'inset-y-2'
                        : 'world-kind-landmark-jamb',
                      recede && (isFocused ? 'w-0.5' : 'w-px'),
                      isFocused ? edge.focused : edge.rest,
                    )}
                  />

                  {!recede ? (
                    <span
                      data-slot="world-kind-crossing-architecture"
                      data-crossing-architecture={
                        region.order === 0 ? 'footing' : 'threshold'
                      }
                      aria-hidden="true"
                      className="pointer-events-none"
                    />
                  ) : null}

                  <span
                    className="flex flex-col"
                    style={{ gap: spacing.xs }}
                  >
                    {region.eyebrow ? (
                      <span
                        data-slot="world-kind-region-eyebrow"
                        className={cn(
                          'text-[0.5625rem] uppercase tracking-[0.32em] text-muted-foreground',
                          legibility.copy,
                        )}
                      >
                        {region.eyebrow}
                      </span>
                    ) : null}

                    <span
                      data-slot="world-kind-region-name"
                      className={cn(
                        recede
                          ? 'text-base tracking-[-0.01em] text-foreground/90'
                          : 'text-sm tracking-[0.01em] text-foreground/80',
                        legibility.copy,
                      )}
                    >
                      {region.displayName}
                    </span>
                  </span>

                  <span
                    data-slot="world-kind-region-marker"
                    aria-hidden="true"
                    className={cn(
                      'ml-auto h-px w-5 transition-colors duration-200 motion-reduce:transition-none',
                      isFocused ? edge.focused : edge.rest,
                    )}
                  />
                </Surface>
                {!recede && isContinuumDiscoveryRegion(region.id) ? (
                  <RegionContinuumDiscovery />
                ) : null}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
