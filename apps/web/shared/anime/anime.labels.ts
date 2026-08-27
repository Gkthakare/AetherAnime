/**
 * Canonical AnimeType display labels.
 *
 * Shared by destination metadata and navigator path meta. Do not add
 * synopsis, year, or genre formatting here.
 */

import type { AnimeType } from './anime.types';

export const ANIME_TYPE_LABEL: Record<AnimeType, string> = {
  tv: 'TV',
  movie: 'Movie',
  ova: 'OVA',
  ona: 'ONA',
  special: 'Special',
};
