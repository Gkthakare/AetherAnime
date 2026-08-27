/**
 * MAL details → AnimeMetadata. Never throws. Never invents scores.
 */

import type { AnimeMetadata } from './anime.metadata';
import { asFiniteNumber, asRecord, asString, namedList } from './anime.mal.parse';

function alternateTitle(
  title: string,
  alternatives: Record<string, unknown> | null,
): string | null {
  if (!alternatives) return null;
  const english = asString(alternatives.en);
  if (english && english !== title) return english;
  const synonyms = alternatives.synonyms;
  if (Array.isArray(synonyms)) {
    for (const synonym of synonyms) {
      const value = asString(synonym);
      if (value && value !== title) return value;
    }
  }
  const japanese = asString(alternatives.ja);
  if (japanese && japanese !== title) return japanese;
  return null;
}

export function normalizeMalAnime(payload: unknown): AnimeMetadata | null {
  const record = asRecord(payload);
  if (!record) return null;
  const malId = asFiniteNumber(record.id);
  const title = asString(record.title);
  if (malId == null || malId <= 0 || !title) return null;

  return {
    source: 'mal',
    malId,
    title,
    alternateTitle: alternateTitle(title, asRecord(record.alternative_titles)),
    synopsis: asString(record.synopsis),
    score: asFiniteNumber(record.mean),
    scoredBy: asFiniteNumber(record.num_scoring_users),
    rank: asFiniteNumber(record.rank),
    popularity: asFiniteNumber(record.popularity),
    members: asFiniteNumber(record.num_list_users),
    genres: namedList(record.genres),
    url: `https://myanimelist.net/anime/${malId}`,
  };
}
