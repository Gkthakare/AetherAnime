/**
 * CatalogAnimeProvider — local catalog only.
 *
 * Not a MAL adapter. Not a Crunchyroll adapter. Those remain unimplemented
 * future boundaries (server / authorized). This object does not pretend to
 * fetch, score, or stream.
 */

import { ANIME_CATALOG } from './anime.catalog';
import { toAnimeSlug } from './anime.normalize';
import type { CatalogAnimeProvider } from './anime.types';

export const catalogAnimeProvider: CatalogAnimeProvider = {
  kind: 'catalog',
  getAll() {
    return ANIME_CATALOG;
  },
  getById(id) {
    return ANIME_CATALOG.find((anime) => anime.id === id);
  },
  getBySlug(slug) {
    const normalized = toAnimeSlug(slug);
    if (normalized.length === 0) return undefined;
    return ANIME_CATALOG.find((anime) => anime.slug === normalized);
  },
};
