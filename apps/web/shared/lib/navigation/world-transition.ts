/**
 * World Transition — ceremony consequence helpers.
 *
 * Portal / Arrival own emotional timing. This module only resolves where
 * completion may navigate. It never schedules ceremony phases.
 */

import type { WorldRegionId } from '@/shared/world/world.region.types';

import type { WorldNavigationTarget } from './world-navigation-target';

/** Stable URL segment for `Enter {destination}`. */
export function toWorldSlug(destination: string): string {
  return destination
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export type WorldHrefOptions = {
  readonly regionId?: WorldRegionId;
  readonly animeSlug?: string;
};

function normalizeAnimeSlug(raw?: string): string | undefined {
  const slug = raw?.trim() ? toWorldSlug(raw) : '';
  return slug.length > 0 ? slug : undefined;
}

function normalizeWorldHrefInput(
  destination: string | WorldNavigationTarget,
  options?: WorldHrefOptions,
): WorldNavigationTarget {
  if (typeof destination === 'string') {
    const worldSlug = toWorldSlug(destination);
    const animeSlug = normalizeAnimeSlug(options?.animeSlug);
    if (animeSlug) return { worldSlug, animeSlug };
    const regionId = options?.regionId?.trim() || undefined;
    return regionId ? { worldSlug, regionId } : { worldSlug };
  }

  const worldSlug = toWorldSlug(destination.worldSlug);
  const animeSlug = normalizeAnimeSlug(destination.animeSlug);
  if (animeSlug) return { worldSlug, animeSlug };
  const regionId = destination.regionId?.trim() || undefined;
  return regionId ? { worldSlug, regionId } : { worldSlug };
}

function buildWorldPath(target: WorldNavigationTarget): string {
  const slug = target.worldSlug;
  return slug.length > 0 ? `/world/${slug}` : '/world/aetheranime';
}

/** App Router href for a world entry shell after Portal Settling completes. */
export function worldHref(destination: string): string;
export function worldHref(
  destination: string,
  options: WorldHrefOptions,
): string;
export function worldHref(target: WorldNavigationTarget): string;
export function worldHref(
  destination: string | WorldNavigationTarget,
  options?: WorldHrefOptions,
): string {
  const target = normalizeWorldHrefInput(destination, options);
  const base = buildWorldPath(target);
  if (target.animeSlug) {
    const params = new URLSearchParams({ anime: target.animeSlug });
    return `${base}?${params.toString()}`;
  }
  const regionId = target.regionId;
  if (!regionId) return base;

  const params = new URLSearchParams({ region: regionId });
  return `${base}?${params.toString()}`;
}

/**
 * Compare pathname + region + anime query. Origin is only used to parse
 * relative hrefs; it is not written to the URL.
 */
export function matchesWorldHref(
  currentHref: string,
  targetHref: string,
  origin = 'https://aether.local',
): boolean {
  const current = new URL(currentHref, origin);
  const target = new URL(targetHref, origin);
  if (current.pathname !== target.pathname) return false;
  const currentRegion = current.searchParams.get('region') ?? undefined;
  const targetRegion = target.searchParams.get('region') ?? undefined;
  const currentAnime = current.searchParams.get('anime') ?? undefined;
  const targetAnime = target.searchParams.get('anime') ?? undefined;
  return currentRegion === targetRegion && currentAnime === targetAnime;
}
