/**
 * Application-owned semantic taxonomy, profiles, and scoring.
 *
 * The LLM may request tags. It does not score anime. Unknown is not false.
 */

import type { AnimeDiscoveryCandidate } from './anime.discovery';
import type { StructuredAnimeIntent } from './anime.semantic-intent';

export const SEMANTIC_TAGS = [
  'dark',
  'lighthearted',
  'wholesome',
  'tragic',
  'comedic',
  'intense',
  'mysterious',
  'psychological',
  'supernatural',
  'revenge',
  'romance',
  'war',
  'isekai',
  'school',
  'overpowered',
  'underdog',
  'strategic',
  'antihero',
  'action-heavy',
] as const;

export type SemanticTag = (typeof SEMANTIC_TAGS)[number];

export type SemanticProvenance = 'explicit' | 'derived';
export type SemanticSource = 'genre' | 'synopsis';
export type SemanticJudgementKind =
  | 'match'
  | 'partial'
  | 'unknown'
  | 'contradiction';

export type SemanticEvidence = {
  readonly tag: SemanticTag;
  readonly provenance: SemanticProvenance;
  readonly source: SemanticSource;
};

export type AnimeSemanticProfile = {
  readonly malId: number;
  readonly evidence: ReadonlyArray<SemanticEvidence>;
};

export type SemanticJudgement = {
  readonly tag: SemanticTag;
  readonly kind: SemanticJudgementKind;
};

export type SemanticScore = {
  readonly total: number;
  readonly judgements: ReadonlyArray<SemanticJudgement>;
};

const TAG_SET = new Set<string>(SEMANTIC_TAGS);

const SYNONYMS: Record<string, SemanticTag> = {
  dark: 'dark',
  grim: 'dark',
  bleak: 'dark',
  depressing: 'dark',
  'morally dark': 'dark',
  serious: 'intense',
  intense: 'intense',
  wholesome: 'wholesome',
  'feel-good': 'wholesome',
  comedic: 'comedic',
  funny: 'comedic',
  humorous: 'comedic',
  tragic: 'tragic',
  mysterious: 'mysterious',
  psychological: 'psychological',
  supernatural: 'supernatural',
  revenge: 'revenge',
  romance: 'romance',
  war: 'war',
  isekai: 'isekai',
  school: 'school',
  overpowered: 'overpowered',
  op: 'overpowered',
  'broken protagonist': 'overpowered',
  'ridiculously strong': 'overpowered',
  'ridiculously strong mc': 'overpowered',
  underdog: 'underdog',
  strategic: 'strategic',
  antihero: 'antihero',
  'action-heavy': 'action-heavy',
  action: 'action-heavy',
};

const GENRE_TO_TAG: Record<string, { tag: SemanticTag; provenance: SemanticProvenance }> = {
  horror: { tag: 'dark', provenance: 'explicit' },
  thriller: { tag: 'intense', provenance: 'explicit' },
  suspense: { tag: 'intense', provenance: 'explicit' },
  comedy: { tag: 'comedic', provenance: 'explicit' },
  mystery: { tag: 'mysterious', provenance: 'explicit' },
  psychological: { tag: 'psychological', provenance: 'explicit' },
  supernatural: { tag: 'supernatural', provenance: 'explicit' },
  romance: { tag: 'romance', provenance: 'explicit' },
  isekai: { tag: 'isekai', provenance: 'explicit' },
  school: { tag: 'school', provenance: 'explicit' },
  military: { tag: 'war', provenance: 'explicit' },
  action: { tag: 'action-heavy', provenance: 'derived' },
};

const SYNOPSIS_PHRASES: ReadonlyArray<{
  tag: SemanticTag;
  pattern: RegExp;
}> = [
  { tag: 'revenge', pattern: /\b(revenge|vengeance|avenges|avenged)\b/i },
  { tag: 'underdog', pattern: /\b(weakest|underdog)\b/i },
  { tag: 'overpowered', pattern: /\boverpowered\b/i },
];

const CONTRADICTIONS: ReadonlyArray<readonly [SemanticTag, SemanticTag]> = [
  ['wholesome', 'dark'],
  ['lighthearted', 'dark'],
];

const SCORE = {
  match: 4,
  partial: 1,
  unknown: 0,
  contradiction: -3,
} as const;

const TAG_LABEL: Record<SemanticTag, string> = {
  dark: 'Dark tone',
  lighthearted: 'Lighthearted',
  wholesome: 'Wholesome',
  tragic: 'Tragic',
  comedic: 'Comedic',
  intense: 'Intense',
  mysterious: 'Mysterious',
  psychological: 'Psychological',
  supernatural: 'Supernatural',
  revenge: 'Revenge',
  romance: 'Romance',
  war: 'War',
  isekai: 'Isekai',
  school: 'School',
  overpowered: 'Overpowered protagonist',
  underdog: 'Underdog protagonist',
  strategic: 'Strategic protagonist',
  antihero: 'Antihero',
  'action-heavy': 'Action-heavy',
};

export function isSemanticTag(value: string): value is SemanticTag {
  return TAG_SET.has(value);
}

export function normalizeSemanticToken(raw: string): SemanticTag | null {
  const key = raw.trim().toLowerCase().replace(/\s+/g, ' ');
  if (key.length === 0 || /https?:|javascript:|data:/i.test(key)) return null;
  return SYNONYMS[key] ?? (isSemanticTag(key) ? key : null);
}

function requestedTags(intent: StructuredAnimeIntent): SemanticTag[] {
  const tokens = [
    ...intent.constraints.tone,
    ...intent.constraints.themes,
    ...intent.constraints.protagonistTraits,
    ...intent.constraints.genres,
  ];
  const tags: SemanticTag[] = [];
  const seen = new Set<SemanticTag>();
  for (const token of tokens) {
    const tag = normalizeSemanticToken(token);
    if (!tag || seen.has(tag)) continue;
    seen.add(tag);
    tags.push(tag);
  }
  return tags;
}

function pushEvidence(
  list: SemanticEvidence[],
  seen: Set<SemanticTag>,
  entry: SemanticEvidence,
) {
  if (seen.has(entry.tag)) return;
  seen.add(entry.tag);
  list.push(entry);
}

export function buildAnimeSemanticProfile(
  candidate: AnimeDiscoveryCandidate,
): AnimeSemanticProfile {
  const evidence: SemanticEvidence[] = [];
  const seen = new Set<SemanticTag>();

  for (const genre of candidate.genres) {
    const mapped = GENRE_TO_TAG[genre.trim().toLowerCase()];
    if (!mapped) continue;
    pushEvidence(evidence, seen, {
      tag: mapped.tag,
      provenance: mapped.provenance,
      source: 'genre',
    });
  }

  const synopsis = candidate.synopsis?.trim() ?? '';
  if (synopsis.length > 0) {
    for (const rule of SYNOPSIS_PHRASES) {
      if (!rule.pattern.test(synopsis)) continue;
      pushEvidence(evidence, seen, {
        tag: rule.tag,
        provenance: 'derived',
        source: 'synopsis',
      });
    }
  }

  return { malId: candidate.malId, evidence };
}

function hasExplicit(profile: AnimeSemanticProfile, tag: SemanticTag): boolean {
  return profile.evidence.some(
    (entry) => entry.tag === tag && entry.provenance === 'explicit',
  );
}

function evidenceFor(
  profile: AnimeSemanticProfile,
  tag: SemanticTag,
): SemanticEvidence | undefined {
  return profile.evidence.find((entry) => entry.tag === tag);
}

function contradicts(profile: AnimeSemanticProfile, requested: SemanticTag): boolean {
  return CONTRADICTIONS.some(([want, against]) => {
    return requested === want && hasExplicit(profile, against);
  });
}

export function scoreSemanticCandidate(
  candidate: AnimeDiscoveryCandidate,
  intent: StructuredAnimeIntent,
): SemanticScore {
  const profile = buildAnimeSemanticProfile(candidate);
  const tags = requestedTags(intent);
  const judgements: SemanticJudgement[] = tags.map((tag) => {
    if (contradicts(profile, tag)) {
      return { tag, kind: 'contradiction' };
    }
    const found = evidenceFor(profile, tag);
    if (!found) return { tag, kind: 'unknown' };
    return {
      tag,
      kind: found.provenance === 'explicit' ? 'match' : 'partial',
    };
  });

  const total = judgements.reduce((sum, judgement) => {
    return sum + SCORE[judgement.kind];
  }, 0);

  return { total, judgements };
}

export function explainSemanticMatch(score: SemanticScore): string | null {
  const labels = score.judgements
    .filter((item) => item.kind === 'match' || item.kind === 'partial')
    .map((item) => TAG_LABEL[item.tag])
    .filter((label) => !/https?:|javascript:/i.test(label));
  if (labels.length === 0) return null;
  return labels.join(' · ');
}

function franchiseKey(title: string): string {
  return title.split(/[/:]/)[0]?.trim().toLowerCase() ?? title.toLowerCase();
}

export function rankBySemanticPreference(
  candidates: ReadonlyArray<AnimeDiscoveryCandidate>,
  intent: StructuredAnimeIntent,
  seedMalId: number | null,
): Array<AnimeDiscoveryCandidate & { matchReason: string | null }> {
  const scored = candidates
    .filter((candidate) => candidate.malId !== seedMalId)
    .map((candidate) => {
      const score = scoreSemanticCandidate(candidate, intent);
      return {
        candidate,
        score: score.total,
        matchReason: explainSemanticMatch(score),
      };
    })
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      return left.candidate.malId - right.candidate.malId;
    });

  const kept: Array<AnimeDiscoveryCandidate & { matchReason: string | null }> =
    [];
  const franchiseCount = new Map<string, number>();
  for (const entry of scored) {
    const key = franchiseKey(entry.candidate.title);
    const used = franchiseCount.get(key) ?? 0;
    if (used >= 2) continue;
    franchiseCount.set(key, used + 1);
    kept.push({ ...entry.candidate, matchReason: entry.matchReason });
  }
  return kept;
}
