/**
 * Deterministic anime resolver — local catalog, no LLM, no silent fuzzy pick.
 *
 * Order: normalize → exact canonical → exact alternate → slug →
 * near-exact token / unique prefix → ambiguous → unknown.
 */

import { getAllAnime } from './anime.repository';
import {
  animeQueryTokens,
  normalizeAnimeQuery,
  toAnimeSlug,
} from './anime.normalize';
import type { AnimeResolution, CanonicalAnime } from './anime.types';

function titleForms(anime: CanonicalAnime): ReadonlyArray<string> {
  return [anime.canonicalTitle, ...anime.alternateTitles].map(normalizeAnimeQuery);
}

function titleTokens(anime: CanonicalAnime): ReadonlySet<string> {
  return new Set(titleForms(anime).flatMap((form) => form.split(' ').filter(Boolean)));
}

export function resolveAnime(
  query: string,
  catalog: ReadonlyArray<CanonicalAnime> = getAllAnime(),
): AnimeResolution {
  const trimmed = query.trim();
  const normalized = normalizeAnimeQuery(trimmed);
  if (normalized.length === 0) {
    return { status: 'unknown', query: trimmed };
  }

  const exactCanonical = catalog.filter(
    (anime) => normalizeAnimeQuery(anime.canonicalTitle) === normalized,
  );
  if (exactCanonical.length === 1) {
    return { status: 'resolved', anime: exactCanonical[0] };
  }
  if (exactCanonical.length > 1) {
    return { status: 'ambiguous', query: trimmed, candidates: exactCanonical };
  }

  const exactAlternate = catalog.filter((anime) =>
    anime.alternateTitles.some(
      (title) => normalizeAnimeQuery(title) === normalized,
    ),
  );
  if (exactAlternate.length === 1) {
    return { status: 'resolved', anime: exactAlternate[0] };
  }
  if (exactAlternate.length > 1) {
    return { status: 'ambiguous', query: trimmed, candidates: exactAlternate };
  }

  const slug = toAnimeSlug(trimmed);
  const slugMatches = catalog.filter((anime) => anime.slug === slug);
  if (slugMatches.length === 1) {
    return { status: 'resolved', anime: slugMatches[0] };
  }
  if (slugMatches.length > 1) {
    return { status: 'ambiguous', query: trimmed, candidates: slugMatches };
  }

  const tokens = animeQueryTokens(trimmed);
  const tokenMatches = catalog.filter((anime) => {
    const haystack = titleTokens(anime);
    return tokens.every((token) => haystack.has(token));
  });

  if (tokenMatches.length > 1) {
    return { status: 'ambiguous', query: trimmed, candidates: tokenMatches };
  }

  if (tokenMatches.length === 1 && tokens.length >= 2) {
    return { status: 'resolved', anime: tokenMatches[0] };
  }

  const prefixMatches = catalog.filter((anime) =>
    titleForms(anime).some(
      (form) => form === normalized || form.startsWith(`${normalized} `),
    ),
  );

  if (prefixMatches.length === 1 && normalized.length >= 4) {
    return { status: 'resolved', anime: prefixMatches[0] };
  }
  if (prefixMatches.length > 1) {
    return { status: 'ambiguous', query: trimmed, candidates: prefixMatches };
  }

  return { status: 'unknown', query: trimmed };
}
