/**
 * Watch Now navigation — existing verified URL, existing browser gesture.
 *
 * Presentation (crossing beat) must not wrap this in timers or awaits.
 */

export const WATCH_NOW_OPEN_TARGET = '_blank' as const;

export const WATCH_NOW_OPEN_FEATURES = 'noopener,noreferrer' as const;

export function openWatchPath(url: string): void {
  window.open(url, WATCH_NOW_OPEN_TARGET, WATCH_NOW_OPEN_FEATURES);
}
