'use client';

import { useEffect, useState } from 'react';

import { motion, useReducedMotion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { useWorldScene } from '@/widgets/world-scene/world-scene-context';

import {
  WORLD_CLIMATE_GRADIENT,
  WORLD_CLIMATE_LARGE_IDLE_SURFACE_MEDIA,
  resolveWorldClimateMood,
} from './world-climate.constants';
import {
  worldClimateAllowsDrift,
  worldClimateDriftOpacity,
  worldClimateDriftTransition,
  worldClimateEnterTransition,
  worldClimateEnterTransitionReduced,
  worldClimateOpacityPeak,
} from './world-climate.motion';
import type { WorldClimateProps } from './world-climate.types';

/**
 * WorldClimate — Soft Aether atmosphere in the WorldShell presence slot.
 *
 * Observes Scene Ambient (+ status / lifecycle for peak & drift).
 * Never looks up Registry. Never interprets Presence directly.
 */
export function WorldClimate({ className }: WorldClimateProps) {
  const { status, lifecycle, ambient, arrivedAnime } = useWorldScene();
  const reduceMotion = useReducedMotion();
  const [largeIdleSurface, setLargeIdleSurface] = useState(true);

  useEffect(() => {
    const media = window.matchMedia(WORLD_CLIMATE_LARGE_IDLE_SURFACE_MEDIA);
    const sync = () => setLargeIdleSurface(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  const mood = resolveWorldClimateMood(status, ambient.variant);
  const drift = worldClimateAllowsDrift(
    lifecycle,
    !!reduceMotion,
    arrivedAnime != null,
    largeIdleSurface,
  );
  const peak = worldClimateOpacityPeak(lifecycle, ambient);

  const animate = drift
    ? { opacity: worldClimateDriftOpacity(lifecycle, ambient) }
    : { opacity: peak };

  const transition = reduceMotion
    ? worldClimateEnterTransitionReduced
    : drift
      ? worldClimateDriftTransition
      : worldClimateEnterTransition;

  return (
    <motion.div
      data-slot="world-climate"
      data-climate-mood={mood}
      data-world-lifecycle={lifecycle}
      data-world-ambient-level={ambient.level}
      data-world-ambient-variant={ambient.variant}
      aria-hidden="true"
      className={cn('absolute inset-0', className)}
      style={{ background: WORLD_CLIMATE_GRADIENT[mood] }}
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={animate}
      transition={transition}
    />
  );
}
