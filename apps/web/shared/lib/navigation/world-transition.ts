/**
 * World Transition — ceremony consequence helpers.
 *
 * Portal / Arrival own emotional timing. This module only resolves where
 * completion may navigate. It never schedules ceremony phases.
 */

/** Stable URL segment for `Enter {destination}`. */
export function toWorldSlug(destination: string): string {
  return destination
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** App Router href for a world entry shell after Portal Settling completes. */
export function worldHref(destination: string): string {
  const slug = toWorldSlug(destination);
  return slug.length > 0 ? `/world/${slug}` : '/world/aetheranime';
}
