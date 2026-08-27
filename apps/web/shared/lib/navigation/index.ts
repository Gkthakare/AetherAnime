/**
 * Navigation helpers — World Transition and future route hand-offs.
 */

export {
  matchesCurrentWorldHref,
  worldHrefFromActivation,
  worldHrefFromAnimeArrival,
} from './world-navigation-commit';
export {
  resolveWorldNavigationTarget,
} from './world-navigation-target';
export type { WorldNavigationTarget } from './world-navigation-target';
export {
  toWorldSlug,
  matchesWorldHref,
  worldHref,
} from './world-transition';
export type { WorldHrefOptions } from './world-transition';
