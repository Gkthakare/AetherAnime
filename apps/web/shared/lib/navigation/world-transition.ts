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

/**
 * App Router href for a world entry shell after Portal Settling completes.
 *
 * A destination with no addressable characters has no world to open. Throwing
 * keeps that a visible programming error instead of quietly sending the user
 * through the threshold into a different world than the one they accepted.
 */
export function worldHref(destination: string): string {
  const slug = toWorldSlug(destination);
  if (slug.length === 0) {
    throw new Error(
      `worldHref: destination "${destination}" has no addressable slug.`,
    );
  }
  return `/world/${slug}`;
}
