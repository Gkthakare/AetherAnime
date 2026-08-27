/**
 * AnimeDestination motion — poster-led pull-in, 400–900ms settle.
 *
 * Sequence (with navigator resolve beat of DURATION.FAST):
 *   poster → identity → body → actions
 * Opacity + transform only. No loops, no layout animation.
 */

import type { Transition, Variants } from 'framer-motion';

import { DELAY, DISTANCE, DURATION, EASING, SCALE } from '@/shared/lib/motion';

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

/** Poster is the visual anchor — first, slightly scaled into place. */
export const animeDestinationPoster: Variants = {
  hidden: { opacity: 0, y: DISTANCE.SM, scale: SCALE.FROM },
  show: {
    opacity: 1,
    y: 0,
    scale: SCALE.TO,
    transition: {
      duration: DURATION.NORMAL,
      ease: EASING.cinematic,
      delay: DELAY.NONE,
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
      delay: DELAY.SHORT,
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
      delay: DELAY.SHORT + DELAY.SHORT,
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
      delay: DELAY.LONG,
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
