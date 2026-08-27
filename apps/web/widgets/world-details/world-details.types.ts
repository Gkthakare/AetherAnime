/**
 * WorldDetails — types only.
 *
 * Observes RegionScene; never owns or dispatches Focus.
 */

export type WorldDetailsProps = {
  /** Layout composition only. */
  className?: string;
  /** Arrival recede — parent-derived from arrivedAnime. Details stay mounted. */
  recede?: boolean;
};
