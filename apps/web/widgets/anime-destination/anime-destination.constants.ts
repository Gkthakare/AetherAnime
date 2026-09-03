/**
 * AnimeDestination copy — place language, not dashboard chrome.
 *
 * Provider labels are presentation only. This widget does not import
 * provider-specific types; unavailable values stay honest.
 */

export const ANIME_DESTINATION_COPY = {
  eyebrow: 'Anime destination',
  watchNow: 'Watch Now',
  watchNowUnavailable: 'Watch Now unavailable',
  saveWatchlist: 'Save to Watchlist',
  savedWatchlist: 'Saved to Watchlist',
  removeWatchlist: 'Remove from Watchlist',
  studioLabel: 'Studio',
  malLabel: 'MyAnimeList',
  malUnavailable: 'Unavailable',
  crunchyrollLabel: 'Crunchyroll',
  crunchyrollUnavailable: 'Availability unavailable',
  pathsEyebrow: 'Paths within this world',
  story: 'Story',
  storyHint: 'The record of this destination',
  signals: 'Signals',
  signalsHint: 'What kind of world answers here',
  kinship: 'Kinship',
  kinshipHint: 'Nearby destinations',
  kinshipListening: 'Listening for nearby worlds…',
  kinshipEmpty: 'Nearby worlds could not answer.',
  kinshipAnswered: 'Nearby worlds have answered beyond.',
  storyReturn: 'Return to the paths',
  enterStory: 'Enter the story',
  returnContinuum: 'Return to Continuum',
  universeIndex: 'Universe',
  pathsHere: 'You are here',
  neighbors: 'Neighboring worlds',
  networkOrigin: 'This world',
  journeyFrom: 'From',
  claimed: 'This universe is remembered',
  storyHeading: 'The Story',
  worldHeading: 'The World',
  recordHeading: 'The Record',
  worldSection: 'World',
  recordSection: 'Record',
  beyondEyebrow: 'And beyond',
  beyondTitle: 'More worlds exist.',
  beyondBody: 'This world ends here. The universe does not.',
  beyondApproach: 'Approach neighboring worlds beyond.',
} as const;

/** Honest count line for Beyond — never invents worlds. */
export function formatBeyondNetworkLine(count: number): string {
  if (count <= 0) return ANIME_DESTINATION_COPY.beyondBody;
  if (count === 1) return 'One world waits beyond.';
  return `${count} worlds wait beyond.`;
}

export const ANIME_UNIVERSE_NETWORK_MAX = 3 as const;

export function formatMalScore(score: number): string {
  return score.toFixed(2);
}

export function formatMalRank(rank: number): string {
  return `Rank ${rank.toLocaleString('en-US')}`;
}

export function formatMalScoredBy(scoredBy: number): string {
  return `${scoredBy.toLocaleString('en-US')} scored`;
}

export type MalSupportingInput = {
  readonly score: number | null;
  readonly rank: number | null;
  readonly scoredBy: number | null;
};

/** One provenance line. Not a rating widget or dashboard row. */
export function formatMalSupportingLine(input: MalSupportingInput): string {
  const parts: string[] = [];
  if (input.score != null) parts.push(`Score ${formatMalScore(input.score)}`);
  if (input.rank != null) parts.push(formatMalRank(input.rank));
  if (input.scoredBy != null) parts.push(formatMalScoredBy(input.scoredBy));
  return parts.length > 0
    ? parts.join(' · ')
    : ANIME_DESTINATION_COPY.malUnavailable;
}

/**
 * Poster plate — a place-object, not a media card.
 * Same wash/edge language as Region plates: leading accent, dissolving trail.
 */
export const ANIME_POSTER_PLATE =
  'bg-gradient-to-r from-ring/8 to-transparent to-[62%]' as const;

/**
 * Poster width — identity artifact, not a thumbnail or wallpaper.
 * Mobile ~150–200px · tablet ~220–260px · desktop 300px (stable past lg).
 */
export const ANIME_DESTINATION_POSTER_WIDTH =
  'w-[clamp(9.375rem,42vw,12.5rem)] md:w-[clamp(13.75rem,28vw,16.25rem)] lg:w-[18.75rem]' as const;

/** Discovered seal — compact artifact, not an empty poster hole. */
export const ANIME_SEAL_WIDTH = 'w-[4.5rem] md:w-[5rem]' as const;

/**
 * Destination stage — the arrived universe occupies the World canvas.
 */
export const ANIME_DESTINATION_STAGE = 'w-full' as const;

export const ANIME_ARRIVAL_STAGE_GRID =
  'grid w-full grid-cols-1 items-start justify-items-center gap-x-8 gap-y-6 lg:justify-center lg:justify-items-stretch' as const;

export const ANIME_ARRIVAL_STAGE_GRID_POSTER =
  'lg:grid-cols-[18.75rem_minmax(22.5rem,35rem)]' as const;

export const ANIME_ARRIVAL_STAGE_GRID_SEAL =
  'lg:grid-cols-[auto_minmax(18rem,32rem)]' as const;

export const ANIME_DESTINATION_COPY_COLUMN =
  'flex min-w-0 w-full max-w-md flex-col items-center lg:max-w-none lg:items-start lg:pt-1 lg:text-left' as const;

export const ANIME_DESTINATION_IDENTITY =
  'flex w-full flex-col items-center lg:items-start' as const;

export const ANIME_DESTINATION_EYEBROW =
  'text-[0.5625rem] uppercase tracking-[0.32em] text-muted-foreground/60' as const;

export const ANIME_DESTINATION_ALTERNATE =
  'text-[0.6875rem] text-muted-foreground/55' as const;

export const ANIME_DESTINATION_METADATA =
  'text-[0.6875rem] uppercase tracking-[0.18em] text-muted-foreground' as const;

export const ANIME_DESTINATION_GENRES =
  'text-[0.6875rem] uppercase tracking-[0.18em] text-foreground/65' as const;

export const ANIME_DESTINATION_SYNOPSIS =
  'max-w-[38rem] text-base leading-[1.85] text-foreground/72 md:text-lg' as const;

export const ANIME_DESTINATION_SUPPORTING =
  'flex w-full flex-col items-center border-t border-border/20 pt-4 lg:items-start' as const;

export const ANIME_DESTINATION_SUPPORTING_LABEL =
  'text-[0.5625rem] uppercase tracking-[0.22em] text-muted-foreground/55' as const;

export const ANIME_DESTINATION_SUPPORTING_VALUE =
  'text-[0.6875rem] text-muted-foreground/70' as const;

export const ANIME_DESTINATION_PATHS =
  'relative flex w-full max-w-xl flex-col items-start' as const;

export const ANIME_DESTINATION_PATH_BUTTON =
  [
    'relative min-h-11 w-full py-2.5 pl-3 text-left',
    'border-b border-border/30',
    "before:absolute before:top-1.5 before:bottom-1.5 before:left-0 before:w-px before:bg-border/50 before:content-['']",
    'outline-none motion-safe:transition-colors motion-reduce:transition-none',
    'hover:border-ring/50 hover:before:w-0.5 hover:before:bg-ring',
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'aria-expanded:before:w-0.5 aria-expanded:before:bg-ring',
  ].join(' ');

export const ANIME_DESTINATION_PATH_TITLE =
  'block text-[0.6875rem] uppercase tracking-[0.22em] text-foreground/85' as const;

export const ANIME_DESTINATION_PATH_HINT =
  'mt-0.5 block text-[0.625rem] text-muted-foreground/60' as const;

/** Inscription revealed in place — not a card, panel, or article surface. */
export const ANIME_DESTINATION_STORY_CHAMBER =
  'flex w-full max-w-[32rem] flex-col text-left' as const;

export const ANIME_DESTINATION_STORY_RECORD =
  'text-[0.9375rem] leading-[1.85] text-foreground/75 first-line:text-foreground/90' as const;

export const ANIME_DESTINATION_STORY_RULE =
  'mt-5 w-10 border-0 border-t border-border/35' as const;

export const ANIME_DESTINATION_STORY_RETURN =
  'mt-3 text-[0.5625rem] uppercase tracking-[0.22em] text-muted-foreground/45' as const;

/**
 * Kinship constellation — branching paths from the destination, not a card list.
 * Vertical spine + short branch marks via pseudo-elements. No SVG.
 */
export const ANIME_DESTINATION_KINSHIP_CONSTELLATION =
  [
    'relative ml-0.5 flex w-full max-w-[32rem] flex-col pl-4 md:ml-1 md:pl-6',
    "before:pointer-events-none before:absolute before:bottom-2 before:left-0 before:top-1 before:w-px before:bg-ring/35 before:content-['']",
  ].join(' ');

export const ANIME_DESTINATION_KINSHIP_BRANCH =
  [
    'relative w-full',
    "before:pointer-events-none before:absolute before:left-[-1rem] before:top-[1.35rem] before:h-px before:w-4 before:bg-ring/35 before:content-['']",
    'md:before:left-[-1.5rem] md:before:w-6',
  ].join(' ');

export const ANIME_DESTINATION_KINSHIP_PATH =
  [
    'relative min-h-11 w-full py-2.5 pl-3 text-left',
    "before:absolute before:top-1.5 before:bottom-1.5 before:left-0 before:w-px before:bg-transparent before:content-['']",
    'text-foreground/85',
    'outline-none motion-safe:transition-[color,transform] motion-reduce:transition-none',
    'hover:text-foreground hover:before:w-0.5 hover:before:bg-ring',
    'motion-safe:hover:translate-x-0.5',
    'focus-visible:text-foreground focus-visible:before:w-0.5 focus-visible:before:bg-ring',
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  ].join(' ');

export const ANIME_DESTINATION_KINSHIP_TITLE =
  'block text-sm leading-snug' as const;

export const ANIME_DESTINATION_KINSHIP_META =
  'mt-0.5 block text-[0.625rem] tracking-[0.08em] text-muted-foreground/80' as const;

/** Arrived title — destination identity at universe scale. */
export const ANIME_DESTINATION_TITLE =
  'text-[clamp(3rem,14vw,9rem)] md:text-[clamp(3.75rem,9vw,10rem)] lg:text-[clamp(4.5rem,8.4vw,11rem)]' as const;

export const ANIME_DESTINATION_POSTER_SIZES =
  '(max-width: 767px) 100vw, (max-width: 1279px) 52vw, 640px' as const;

export const ANIME_POSTER_EDGE = {
  rest: 'bg-ring/40',
  preview: 'bg-ring',
} as const;

/** Presence scale — artifact responding, not a card lift. Reduced motion is gated in AnimePoster. */
export const ANIME_POSTER_PRESENCE_SCALE =
  'hover:scale-[1.02] focus-visible:scale-[1.02]' as const;

export const ANIME_POSTER_PREVIEW_MAX = 120;

export type AnimePosterPreviewInput = {
  readonly alternateTitles: ReadonlyArray<string>;
  readonly year: number | null;
  readonly genres: ReadonlyArray<string>;
};

/**
 * Compact identity fragment for the poster overlay.
 * Complements the copy column; does not repeat the synopsis.
 */
export function animePosterPreviewCopy(input: AnimePosterPreviewInput): string {
  const alternate = input.alternateTitles[0]?.trim() || null;
  const genres = input.genres.slice(0, 2).join(' · ').toUpperCase();
  const identity = [
    input.year != null ? String(input.year) : null,
    genres || null,
  ]
    .filter((part): part is string => Boolean(part))
    .join(' · ');
  const text = [alternate, identity].filter(Boolean).join('\n');
  if (text.length <= ANIME_POSTER_PREVIEW_MAX) return text;
  return `${text.slice(0, ANIME_POSTER_PREVIEW_MAX - 1).trimEnd()}…`;
}

/**
 * Watch Now — plate-edge threshold, not a pill or filled CTA.
 * Leading accent + underline. Arrow is visual only.
 */
export const ANIME_DESTINATION_WATCH_NOW =
  'relative inline-flex items-center gap-2 pl-3 text-sm uppercase tracking-[0.2em] text-foreground' as const;

export const ANIME_DESTINATION_WATCH_NOW_EDGE =
  'before:absolute before:top-0.5 before:bottom-0.5 before:left-0 before:w-px before:bg-ring before:content-[\'\']' as const;

export const ANIME_DESTINATION_WATCH_NOW_RULE =
  'pb-1 outline-none motion-safe:transition-[color] motion-reduce:transition-none hover:text-ring hover:before:w-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background' as const;

/**
 * Crossing beat — :active plate-edge + underline toward the arrow.
 * CSS only; does not delay openWatchPath. Reduced motion skips travel.
 */
export const ANIME_DESTINATION_WATCH_NOW_CROSSING =
  'group active:before:w-0.5 group-active:text-ring motion-reduce:transition-none' as const;

export const ANIME_DESTINATION_WATCH_NOW_RULE_MARK =
  'pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-ring/80 group-hover:bg-ring group-active:bg-ring motion-safe:transition-transform motion-safe:duration-200 motion-reduce:transition-none motion-safe:group-active:scale-x-[1.08] motion-reduce:group-active:scale-x-100' as const;

export const ANIME_DESTINATION_WATCH_NOW_ARROW =
  'inline-block motion-safe:transition-transform motion-safe:duration-200 motion-reduce:transition-none motion-safe:group-active:translate-x-1' as const;

export const ANIME_DESTINATION_WATCH_NOW_UNAVAILABLE =
  'relative inline-flex cursor-not-allowed items-center pl-3 text-[0.6875rem] uppercase tracking-[0.22em] text-muted-foreground/50 border-b border-border/20 pb-1 before:absolute before:top-0.5 before:bottom-0.5 before:left-0 before:w-px before:bg-border/30 before:content-[\'\']' as const;

export const ANIME_STATUS_LABEL = {
  finished: 'Finished',
  airing: 'Airing',
  upcoming: 'Upcoming',
} as const;

export function formatUniverseRecordLine(input: {
  readonly episodeCount: number | null;
  readonly status: keyof typeof ANIME_STATUS_LABEL;
}): string | null {
  if (input.episodeCount == null) return null;
  const episodes = `${input.episodeCount} ${
    input.episodeCount === 1 ? 'episode' : 'episodes'
  }`;
  return `${episodes} · ${ANIME_STATUS_LABEL[input.status]}`;
}
