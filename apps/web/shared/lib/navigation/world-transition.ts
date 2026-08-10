/**
 * World Transition — ceremony consequence helpers.
 *
 * Portal / Arrival own emotional timing. This module only resolves where
 * completion may navigate. It never schedules ceremony phases.
 */

/** Upper bound for a rendered world slug, keeping route input finite. */
export const MAX_WORLD_SLUG_LENGTH = 64;

/** Stable URL segment for `Enter {destination}`. */
export function toWorldSlug(destination: string): string {
  return destination
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, MAX_WORLD_SLUG_LENGTH)
    .replace(/-+$/g, '');
}

/** Whether a raw route segment resolves to a world slug we render as-is. */
export function isWorldSlug(destination: string): boolean {
  const slug = toWorldSlug(destination);
  return slug.length > 0 && slug === destination;
}

/** App Router href for a world entry shell after Portal Settling completes. */
export function worldHref(destination: string): string {
  const slug = toWorldSlug(destination);
  return slug.length > 0 ? `/world/${slug}` : '/world/aetheranime';
}
