/**
 * Local first-slice catalog.
 *
 * Exists only to prove destination architecture. Fate titles are included
 * specifically to exercise ambiguous resolution.
 *
 * Posters are project-owned WebP under public/assets — not MAL, Crunchyroll,
 * or other remote promotional key art.
 *
 * Synopses are original orientation copy, not provider text.
 * officialUrl is a verified official destination (information/access site),
 * not a playable streaming session. Watch Now uses that verified path.
 */

import type { CanonicalAnime } from './anime.types';

const EMPTY_RATINGS = {
  mal: null,
  crunchyroll: null,
} as const;

const SOLO_LEVELING = {
  id: 'anime.solo-leveling',
  canonicalTitle: 'Solo Leveling',
  alternateTitles: ['Ore dake Level Up na Ken', 'Solo Levelling'],
  slug: 'solo-leveling',
  synopsis:
    'A hunter the world ranked weakest is called into a climbing that only answers those who keep going alone.',
  year: 2024,
  type: 'tv',
  episodeCount: 12,
  status: 'finished',
  genres: ['Action', 'Fantasy'],
  studios: ['A-1 Pictures'],
  poster: '/assets/aetheranime/anime/solo-leveling/solo-leveling-poster.webp',
  officialUrl: 'https://sololeveling-anime.net/',
  ratings: EMPTY_RATINGS,
} as const satisfies CanonicalAnime;

const FATE_STAY_NIGHT = {
  id: 'anime.fate-stay-night',
  canonicalTitle: 'Fate/stay night',
  alternateTitles: ['Fate stay night', 'Fatestay night'],
  slug: 'fate-stay-night',
  synopsis:
    'A hidden war of relics and chosen masters gathers under one city’s ordinary sky.',
  year: 2006,
  type: 'tv',
  episodeCount: 24,
  status: 'finished',
  genres: ['Action', 'Fantasy', 'Supernatural'],
  studios: ['Studio Deen'],
  poster: '/assets/aetheranime/anime/fate-stay-night/fate-stay-night-poster.webp',
  // 2006 Studio Deen TV — no verified official destination. fate-sn.com is Heaven’s Feel.
  officialUrl: null,
  ratings: EMPTY_RATINGS,
} as const satisfies CanonicalAnime;

const FATE_ZERO = {
  id: 'anime.fate-zero',
  canonicalTitle: 'Fate/Zero',
  alternateTitles: ['Fate Zero'],
  slug: 'fate-zero',
  synopsis:
    'The war that precedes the war — ideals collide before the next generation inherits the night.',
  year: 2011,
  type: 'tv',
  episodeCount: 25,
  status: 'finished',
  genres: ['Action', 'Fantasy', 'Drama'],
  studios: ['ufotable'],
  poster: '/assets/aetheranime/anime/fate-zero/fate-zero-poster.webp',
  officialUrl: 'https://www.fate-zero.jp/',
  ratings: EMPTY_RATINGS,
} as const satisfies CanonicalAnime;

const FATE_GRAND_ORDER = {
  id: 'anime.fate-grand-order',
  canonicalTitle: 'Fate/Grand Order',
  alternateTitles: ['FGO', 'Fate Grand Order'],
  slug: 'fate-grand-order',
  synopsis:
    'A grand order of lost histories, summoned into one long campaign across time.',
  year: 2016,
  type: 'special',
  episodeCount: null,
  status: 'finished',
  genres: ['Action', 'Fantasy'],
  studios: ['Lay-duce'],
  poster: '/assets/aetheranime/anime/fate-grand-order/fate-grand-order-poster.webp',
  officialUrl: 'https://anime.fate-go.jp/FirstOrder/',
  ratings: EMPTY_RATINGS,
} as const satisfies CanonicalAnime;

export const ANIME_CATALOG: ReadonlyArray<CanonicalAnime> = Object.freeze([
  SOLO_LEVELING,
  FATE_STAY_NIGHT,
  FATE_ZERO,
  FATE_GRAND_ORDER,
]);
