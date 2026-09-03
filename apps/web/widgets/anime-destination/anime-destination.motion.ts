/**
 * AnimeDestination motion — arrival-keyed one-shot (TASK-080).
 *
 * Sequence within ~1.2–1.6s cinematic window (after RealmCrossing starts):
 *   atmosphere (existing) → FG poster → identity → body → actions → static
 * Opacity + transform only. No loops. Replays only when arrival identity changes.
 */

import type { Transition, Variants } from 'framer-motion';

import { DISTANCE, DURATION, EASING, SCALE } from '@/shared/lib/motion';

/**
 * Delays (seconds) keyed so FG poster follows atmosphere emerge (~0.58 of 1.2s).
 * Total path settle stays within ~1.5s.
 */
export const ANIME_DESTINATION_ARRIVAL_DELAY = {
  poster: 1.05,
  identity: 1.28,
  body: 1.48,
  actions: 1.62,
} as const;

export const animeDestinationEnterTransition: Transition = {
  duration: DURATION.FAST,
  ease: EASING.entrance,
};

export const animeDestinationEnterTransitionReduced: Transition = {
  duration: DURATION.FAST,
  ease: EASING.standard,
};

export const animeDestinationEnterFrom = {
  opacity: 0,
} as const;

export const animeDestinationEnterTo = {
  opacity: 1,
} as const;

/** Poster is the visual anchor — follows atmosphere field presence. */
export const animeDestinationPoster: Variants = {
  hidden: { opacity: 0, y: DISTANCE.SM, scale: SCALE.FROM },
  show: {
    opacity: 1,
    y: 0,
    scale: SCALE.TO,
    transition: {
      duration: DURATION.NORMAL,
      ease: EASING.cinematic,
      delay: ANIME_DESTINATION_ARRIVAL_DELAY.poster,
    },
  },
};

export const animeDestinationPosterReduced: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: DURATION.FAST, ease: EASING.standard },
  },
};

/** Title + metadata settle after the poster is present. */
export const animeDestinationIdentity: Variants = {
  hidden: { opacity: 0, y: DISTANCE.SM / 3 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.NORMAL,
      ease: EASING.entrance,
      delay: ANIME_DESTINATION_ARRIVAL_DELAY.identity,
    },
  },
};

export const animeDestinationBody: Variants = {
  hidden: { opacity: 0, y: DISTANCE.SM / 3 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.NORMAL,
      ease: EASING.entrance,
      delay: ANIME_DESTINATION_ARRIVAL_DELAY.body,
    },
  },
};

export const animeDestinationActions: Variants = {
  hidden: { opacity: 0, y: DISTANCE.SM / 3 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.NORMAL,
      ease: EASING.entrance,
      delay: ANIME_DESTINATION_ARRIVAL_DELAY.actions,
    },
  },
};

export const animeDestinationCopyReduced: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: DURATION.FAST, ease: EASING.standard },
  },
};

/**
 * Watch Now crossing — one-shot gate emphasis. No delay.
 * Applied as CSS :active / group-active so window.open stays synchronous.
 */
export const watchNowCrossingTransition: Transition = {
  duration: DURATION.FAST,
  ease: EASING.standard,
};

export const watchNowCrossingArrow = {
  x: DISTANCE.SM / 3,
} as const;

export const watchNowCrossingRule = {
  scaleX: 1.08,
} as const;
