/**
 * Deterministic anime query / slug normalization.
 * Shared with world slug rules: lowercase, alphanumeric runs, hyphen joins.
 */

export function normalizeAnimeQuery(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[/_.]+/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function toAnimeSlug(input: string): string {
  return normalizeAnimeQuery(input).replace(/\s+/g, '-');
}

export function animeQueryTokens(input: string): ReadonlyArray<string> {
  const normalized = normalizeAnimeQuery(input);
  return normalized.length === 0 ? [] : normalized.split(' ');
}
