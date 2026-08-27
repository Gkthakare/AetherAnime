/**
 * Structured semantic intent — untrusted model output, application-owned.
 *
 * The LLM never navigates, never writes URLs, and never touches watchlist.
 * planAnimeAsk is deterministic-first and records the LLM call budget.
 */

import { discoveryLookupTarget } from './anime.discovery';
import type { AnimeDiscoveryCandidate } from './anime.discovery';
import { parseAnimeIntent } from './anime.intent';
import { malIdForSlug } from './anime.mal.identity';
import { getAllAnime } from './anime.repository';
import { resolveAnime } from './anime.resolver';
import { rankBySemanticPreference } from './anime.semantic-profile';
import type { CanonicalAnime } from './anime.types';
import { normalizeVoiceQuery } from './anime.voice';
import { isWatchlistReturnQuery } from './anime.watchlist-return';

export const STRUCTURED_INTENT_TYPES = [
  'navigate',
  'similar',
  'recommend',
  'filter',
] as const;

export type StructuredIntentType = (typeof STRUCTURED_INTENT_TYPES)[number];

export type StructuredAnimeConstraints = {
  readonly genres: ReadonlyArray<string>;
  readonly themes: ReadonlyArray<string>;
  readonly protagonistTraits: ReadonlyArray<string>;
  readonly tone: ReadonlyArray<string>;
};

export type StructuredAnimeExclusions = {
  readonly watchlisted: boolean;
};

export type StructuredAnimeIntent = {
  readonly type: StructuredIntentType;
  readonly title: string | null;
  readonly seedTitle: string | null;
  readonly constraints: StructuredAnimeConstraints;
  readonly exclusions: StructuredAnimeExclusions;
};

export type SemanticIntentProvider = {
  parseIntent(input: string): Promise<StructuredAnimeIntent | null>;
};

export type AnimeAskRoute =
  | {
      readonly kind: 'arrive';
      readonly anime: CanonicalAnime;
      readonly llmCalls: 0;
    }
  | {
      readonly kind: 'ambiguous';
      readonly candidates: ReadonlyArray<CanonicalAnime>;
      readonly llmCalls: 0;
    }
  | {
      readonly kind: 'discover';
      readonly lookup: import('./anime.discovery').DiscoveryLookup;
      readonly llmCalls: 0;
    }
  | {
      readonly kind: 'filter';
      readonly exclusions: { readonly watchlisted: true };
      readonly llmCalls: 0;
    }
  | {
      readonly kind: 'watchlist';
      readonly llmCalls: 0;
    }
  | {
      readonly kind: 'semantic';
      readonly input: string;
      readonly llmCalls: 1;
    }
  | { readonly kind: 'unknown'; readonly llmCalls: 0 };

const INTENT_KEYS = new Set([
  'type',
  'title',
  'seedTitle',
  'constraints',
  'exclusions',
]);
const CONSTRAINT_KEYS = new Set([
  'genres',
  'themes',
  'protagonistTraits',
  'tone',
]);
const EXCLUSION_KEYS = new Set(['watchlisted']);
const FORBIDDEN_URI = /https?:|javascript:|data:|file:/i;
const WATCHLIST_EXCLUSION =
  /haven'?t saved|not on my watchlist|not saved yet/i;
const DESCRIPTIVE =
  /\b(overpowered|protagonist|but darker)\b|^i want something\b/i;
/** Plot-shaped asks: "about a …", "who becomes/gains/…" — not exact titles. */
const PLOT_SHAPED =
  /\babout\s+an?\b|\bwho\b.{0,48}\b(becomes|becoming|gains|gets|learns|faces|fights|discovers)\b/i;

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value == null || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function hasOnlyKeys(
  record: Record<string, unknown>,
  allowed: ReadonlySet<string>,
): boolean {
  return Object.keys(record).every((key) => allowed.has(key));
}

function asBoundedString(value: unknown): string | null {
  if (value == null) return null;
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (trimmed.length === 0) return null;
  if (trimmed.length > 80) return null;
  if (FORBIDDEN_URI.test(trimmed)) return null;
  return trimmed;
}

function asStringList(value: unknown): ReadonlyArray<string> | null {
  if (!Array.isArray(value)) return null;
  if (value.length > 8) return null;
  const items: string[] = [];
  for (const entry of value) {
    if (typeof entry !== 'string') return null;
    const trimmed = entry.trim();
    if (trimmed.length === 0 || trimmed.length > 32) return null;
    if (FORBIDDEN_URI.test(trimmed)) return null;
    items.push(trimmed);
  }
  return items;
}

export function validateStructuredAnimeIntent(
  value: unknown,
): StructuredAnimeIntent | null {
  const record = asRecord(value);
  if (!record || !hasOnlyKeys(record, INTENT_KEYS)) return null;
  if (
    typeof record.type !== 'string' ||
    !STRUCTURED_INTENT_TYPES.includes(record.type as StructuredIntentType)
  ) {
    return null;
  }

  const title = record.title == null ? null : asBoundedString(record.title);
  if (record.title != null && title == null) return null;
  const seedTitle =
    record.seedTitle == null ? null : asBoundedString(record.seedTitle);
  if (record.seedTitle != null && seedTitle == null) return null;

  const constraintsRecord = asRecord(record.constraints);
  if (!constraintsRecord || !hasOnlyKeys(constraintsRecord, CONSTRAINT_KEYS)) {
    return null;
  }
  const genres = asStringList(constraintsRecord.genres);
  const themes = asStringList(constraintsRecord.themes);
  const protagonistTraits = asStringList(constraintsRecord.protagonistTraits);
  const tone = asStringList(constraintsRecord.tone);
  if (!genres || !themes || !protagonistTraits || !tone) return null;

  const exclusionsRecord = asRecord(record.exclusions);
  if (
    !exclusionsRecord ||
    !hasOnlyKeys(exclusionsRecord, EXCLUSION_KEYS) ||
    typeof exclusionsRecord.watchlisted !== 'boolean'
  ) {
    return null;
  }

  return {
    type: record.type as StructuredIntentType,
    title,
    seedTitle,
    constraints: { genres, themes, protagonistTraits, tone },
    exclusions: { watchlisted: exclusionsRecord.watchlisted },
  };
}

function hasSimilarModifier(text: string): boolean {
  const intent = parseAnimeIntent(text);
  return intent.kind === 'similar' && /\bbut\b/i.test(intent.title);
}

function looksLikeDescriptiveRequest(text: string): boolean {
  if (DESCRIPTIVE.test(text)) return true;
  if (PLOT_SHAPED.test(text)) return true;
  const intent = parseAnimeIntent(text);
  if (intent.kind === 'similar') return false;
  return /\bsomething\b/i.test(text) && /\b(with|dark|want)\b/i.test(text);
}

function requiresSemanticInterpretation(text: string): boolean {
  return hasSimilarModifier(text) || looksLikeDescriptiveRequest(text);
}

export function planAnimeAsk(raw: string): AnimeAskRoute {
  const input = normalizeVoiceQuery(raw).trim();
  if (input.length === 0) return { kind: 'unknown', llmCalls: 0 };

  if (WATCHLIST_EXCLUSION.test(input) && !hasSimilarModifier(input)) {
    return {
      kind: 'filter',
      exclusions: { watchlisted: true },
      llmCalls: 0,
    };
  }

  if (isWatchlistReturnQuery(input)) {
    return { kind: 'watchlist', llmCalls: 0 };
  }

  if (requiresSemanticInterpretation(input)) {
    return { kind: 'semantic', input, llmCalls: 1 };
  }

  const intent = parseAnimeIntent(input);
  const resolution = resolveAnime(intent.title);
  if (intent.kind === 'navigate' && resolution.status === 'resolved') {
    return { kind: 'arrive', anime: resolution.anime, llmCalls: 0 };
  }
  if (resolution.status === 'ambiguous') {
    return {
      kind: 'ambiguous',
      candidates: resolution.candidates,
      llmCalls: 0,
    };
  }

  const lookup = discoveryLookupTarget(intent, resolution);
  if (lookup) return { kind: 'discover', lookup, llmCalls: 0 };
  return { kind: 'unknown', llmCalls: 0 };
}

export type SemanticRetrievalDeps = {
  searchByTitle(
    query: string,
  ): Promise<ReadonlyArray<AnimeDiscoveryCandidate>>;
  getSimilarByCanonicalAnime(
    anime: CanonicalAnime,
  ): Promise<ReadonlyArray<AnimeDiscoveryCandidate>>;
  watchlistedSlugs?: ReadonlyArray<string>;
};

function catalogCandidates(): AnimeDiscoveryCandidate[] {
  return getAllAnime().flatMap((anime) => {
    const malId = malIdForSlug(anime.slug);
    if (malId == null) return [];
    return [
      {
        malId,
        title: anime.canonicalTitle,
        alternateTitle: anime.alternateTitles[0] ?? null,
        year: anime.year,
        type: anime.type,
        episodeCount: anime.episodeCount,
        status: anime.status,
        genres: anime.genres,
        studios: anime.studios,
        synopsis: anime.synopsis,
        poster: anime.poster,
      },
    ];
  });
}

function slugForCandidate(candidate: AnimeDiscoveryCandidate): string {
  const catalog = getAllAnime().find(
    (anime) => malIdForSlug(anime.slug) === candidate.malId,
  );
  return catalog?.slug ?? `discovered-${candidate.malId}`;
}

export function constraintQuery(intent: StructuredAnimeIntent): string {
  return [
    ...intent.constraints.tone,
    ...intent.constraints.themes,
    ...intent.constraints.protagonistTraits,
    ...intent.constraints.genres,
  ]
    .join(' ')
    .trim();
}

function uniqueCandidates(
  candidates: ReadonlyArray<AnimeDiscoveryCandidate>,
): AnimeDiscoveryCandidate[] {
  const seen = new Set<number>();
  return candidates.filter((candidate) => {
    if (seen.has(candidate.malId)) return false;
    seen.add(candidate.malId);
    return true;
  });
}

export async function retrieveForStructuredIntent(
  intent: StructuredAnimeIntent,
  deps: SemanticRetrievalDeps,
  askText?: string,
): Promise<ReadonlyArray<AnimeDiscoveryCandidate>> {
  let seedMalId: number | null = null;
  let retrieved: AnimeDiscoveryCandidate[] = [];

  if (intent.seedTitle) {
    const seed = resolveAnime(intent.seedTitle);
    if (seed.status === 'resolved') {
      seedMalId = malIdForSlug(seed.anime.slug);
      retrieved = [
        ...(await deps.getSimilarByCanonicalAnime(seed.anime)),
      ];
    } else {
      retrieved = [...(await deps.searchByTitle(intent.seedTitle))];
    }
  } else if (intent.type === 'filter' || intent.exclusions.watchlisted) {
    retrieved = catalogCandidates();
  } else {
    const query = constraintQuery(intent);
    const searched = query.length >= 3 ? await deps.searchByTitle(query) : [];
    retrieved = [...catalogCandidates(), ...searched];
  }

  let ranked = rankBySemanticPreference(
    uniqueCandidates(retrieved),
    intent,
    seedMalId,
    askText,
  );
  if (intent.exclusions.watchlisted) {
    const blocked = new Set(deps.watchlistedSlugs ?? []);
    ranked = ranked.filter(
      (candidate) => !blocked.has(slugForCandidate(candidate)),
    );
  }
  return ranked.slice(0, 5);
}

const SEMANTIC_SYSTEM_PROMPT =
  'Return JSON only with keys type, title, seedTitle, constraints, exclusions. type must be navigate, similar, recommend, or filter. constraints has genres, themes, protagonistTraits, tone string arrays. exclusions.watchlisted is boolean. Do not recommend titles. Do not include URLs or extra keys.';

export type SemanticFetch = (
  input: string,
  init?: RequestInit,
) => Promise<Response>;

export type HttpSemanticIntentProviderOptions = {
  apiKey: string;
  baseUrl: string;
  model: string;
  fetchImpl?: SemanticFetch;
};

function parseModelContent(payload: unknown): unknown {
  const record = asRecord(payload);
  const choices = record?.choices;
  if (!Array.isArray(choices) || choices.length === 0) return null;
  const message = asRecord(asRecord(choices[0])?.message);
  const content = message?.content;
  if (typeof content !== 'string') return null;
  const trimmed = content.replace(/^```json\s*|\s*```$/g, '').trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    return null;
  }
}

export function createHttpSemanticIntentProvider(
  options: HttpSemanticIntentProviderOptions,
): SemanticIntentProvider {
  const fetchImpl = options.fetchImpl ?? fetch;
  const apiKey = options.apiKey.trim();
  const baseUrl = options.baseUrl.replace(/\/$/, '').trim();
  const model = options.model.trim();

  return {
    async parseIntent(input: string) {
      const text = input.trim();
      if (apiKey.length === 0 || baseUrl.length === 0 || model.length === 0) {
        return null;
      }
      if (text.length === 0) return null;
      try {
        const response = await fetchImpl(`${baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            temperature: 0,
            max_tokens: 250,
            response_format: { type: 'json_object' },
            messages: [
              { role: 'system', content: SEMANTIC_SYSTEM_PROMPT },
              { role: 'user', content: text.slice(0, 240) },
            ],
          }),
          signal: AbortSignal.timeout(8000),
        });
        if (!response.ok) return null;
        return validateStructuredAnimeIntent(
          parseModelContent(await response.json()),
        );
      } catch {
        return null;
      }
    },
  };
}
