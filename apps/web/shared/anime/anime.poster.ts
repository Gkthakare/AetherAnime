/**
 * TASK-074 — validated presentation artwork for CanonicalAnime.poster.
 *
 * Accepts:
 *   - local catalog paths under /assets/aetheranime/anime/
 *   - HTTPS cdn.myanimelist.net /images/anime/ URLs
 *
 * Everything else → null. Never invents artwork.
 */

import { asRecord, asString } from './anime.mal.parse';

const LOCAL_POSTER =
  /^\/assets\/aetheranime\/anime\/[a-z0-9-]+\/[a-z0-9-]+-poster\.webp$/;
const MAL_CDN_HOST = 'cdn.myanimelist.net';
const MAL_ANIME_IMAGE_PATH = /^\/images\/anime\//;

/**
 * Validate a poster source for CanonicalAnime.poster / discovery candidates.
 */
export function validateAnimePosterSource(value: unknown): string | null {
  const raw = asString(value);
  if (!raw) return null;

  if (LOCAL_POSTER.test(raw)) return raw;

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }

  if (url.protocol !== 'https:') return null;
  if (url.hostname !== MAL_CDN_HOST) return null;
  if (!MAL_ANIME_IMAGE_PATH.test(url.pathname)) return null;
  // Reject credentials / unexpected ports.
  if (url.username || url.password) return null;
  if (url.port) return null;

  return url.href;
}

/**
 * Prefer main_picture.large, then medium. Each candidate URL is validated.
 */
export function malMainPicturePoster(mainPicture: unknown): string | null {
  const picture = asRecord(mainPicture);
  if (!picture) return null;
  return (
    validateAnimePosterSource(picture.large) ??
    validateAnimePosterSource(picture.medium)
  );
}
