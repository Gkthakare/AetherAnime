/**
 * Deterministic navigate vs similar intent.
 * Runs after voice prefix stripping. Not an LLM.
 */

export type AnimeIntent =
  | { readonly kind: 'navigate'; readonly title: string }
  | { readonly kind: 'similar'; readonly title: string };

const SIMILAR_PREFIXES = [
  /^something like\s+/i,
  /^anime like\s+/i,
  /^titles like\s+/i,
  /^similar to\s+/i,
] as const;

export function parseAnimeIntent(query: string): AnimeIntent {
  const title = query.trim();
  if (title.length === 0) {
    return { kind: 'navigate', title };
  }

  for (const prefix of SIMILAR_PREFIXES) {
    if (prefix.test(title)) {
      return { kind: 'similar', title: title.replace(prefix, '').trim() };
    }
  }

  return { kind: 'navigate', title };
}
