import { cn } from '@/lib/utils';

import {
  WORLD_ENVIRONMENT_DEPTH_DAMPING,
  WORLD_ENVIRONMENT_DEPTH_OVERSCAN,
  WORLD_ENVIRONMENT_LANDSCAPE_MEDIA,
  WORLD_ENVIRONMENT_PORTRAIT_MEDIA,
  WORLD_ENVIRONMENT_TRANSPARENT_PIXEL,
} from './world-environment.constants';
import type { EnvironmentPlateLayerProps } from './world-environment.types';

/**
 * One image layer at one depth.
 *
 * Orientation is resolved by `<picture><source media>`, so the browser commits
 * to a source before layout and the choice never depends on script or state.
 * Depth is an inline `transform` reading the container's custom properties,
 * which means the layer has a correct resting position with no JavaScript at
 * all — the pointer response only ever perturbs it.
 *
 * The layer overscans its box because a translated layer that fitted exactly
 * would expose the scene base along one edge as it shifts.
 *
 * Omitting `portrait` makes the layer landscape-only: the source is gated on
 * landscape and the `<img>` falls back to an inline transparent pixel, so a
 * portrait viewport renders nothing and requests nothing.
 */
export function EnvironmentPlateLayer({
  slot,
  landscape,
  landscapeSize,
  portrait,
  portraitSize,
  transform,
  priority = false,
  className,
  imageClassName,
}: Readonly<EnvironmentPlateLayerProps>) {
  const landscapeOnly = portrait === undefined;

  return (
    <picture
      data-slot={slot}
      className={cn(
        'absolute block',
        WORLD_ENVIRONMENT_DEPTH_OVERSCAN,
        WORLD_ENVIRONMENT_DEPTH_DAMPING,
        className,
      )}
      style={{ transform }}
    >
      {landscapeOnly ? (
        <source
          media={WORLD_ENVIRONMENT_LANDSCAPE_MEDIA}
          srcSet={landscape}
          width={landscapeSize.width}
          height={landscapeSize.height}
        />
      ) : (
        <source
          media={WORLD_ENVIRONMENT_PORTRAIT_MEDIA}
          srcSet={portrait}
          width={portraitSize?.width}
          height={portraitSize?.height}
        />
      )}
      {/*
        Orientation art direction requires <picture><source media>. next/image
        renders a single <img> and cannot swap sources on a media query, and
        its width-only `sizes` heuristic served a 390x219 file into a 390x844
        portrait viewport. These plates are pre-optimised static WebP, so the
        optimiser has nothing left to add.
      */}
      <img
        src={landscapeOnly ? WORLD_ENVIRONMENT_TRANSPARENT_PIXEL : landscape}
        alt=""
        width={landscapeSize.width}
        height={landscapeSize.height}
        fetchPriority={priority ? 'high' : 'low'}
        className={cn(
          'absolute inset-0 size-full object-cover object-center',
          imageClassName,
        )}
      />
    </picture>
  );
}
