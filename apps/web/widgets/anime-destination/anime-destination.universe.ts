/**
 * Destination universe — presentation derivation only.
 *
 * Sections exist only when CanonicalAnime (or honest overlay metadata)
 * already has the facts. Nothing here invents characters, episodes, or lore.
 */

export type DestinationUniverseNavId =
  | 'overview'
  | 'story'
  | 'world'
  | 'record'
  | 'beyond';

export type DestinationUniverseNavEntry = {
  readonly id: DestinationUniverseNavId;
  readonly label: string;
  readonly href: `#${string}`;
};

export type DestinationUniverseNavInput = {
  readonly synopsis: string;
  readonly year: number | null;
  readonly genres: ReadonlyArray<string>;
  readonly studios: ReadonlyArray<string>;
  readonly episodeCount: number | null;
  readonly score: number | null;
};

const LABELS: Record<DestinationUniverseNavId, string> = {
  overview: 'Overview',
  story: 'Story',
  world: 'World',
  record: 'Record',
  beyond: 'Beyond',
};

/** First sentence of a real synopsis. Empty input stays empty. */
export function destinationIdentityStatement(synopsis: string): string {
  const text = synopsis.trim();
  if (!text) return '';
  const match = text.match(/^[^.!?]+[.!?]?/);
  return (match?.[0] ?? text).trim();
}

export function destinationHasWorldSection(input: {
  readonly year: number | null;
  readonly genres: ReadonlyArray<string>;
  readonly studios: ReadonlyArray<string>;
}): boolean {
  return (
    input.year != null ||
    input.genres.length > 0 ||
    input.studios.length > 0
  );
}

export function destinationHasRecordSection(input: {
  readonly episodeCount: number | null;
  readonly score: number | null;
}): boolean {
  return input.episodeCount != null || input.score != null;
}

/** Spatial index for the arrived universe. Overview and Beyond always exist. */
export function destinationUniverseNav(
  input: DestinationUniverseNavInput,
): ReadonlyArray<DestinationUniverseNavEntry> {
  const entries: DestinationUniverseNavEntry[] = [
    { id: 'overview', label: LABELS.overview, href: '#anime-universe-hero' },
  ];

  if (input.synopsis.trim()) {
    entries.push({
      id: 'story',
      label: LABELS.story,
      href: '#anime-universe-story',
    });
  }

  if (destinationHasWorldSection(input)) {
    entries.push({
      id: 'world',
      label: LABELS.world,
      href: '#anime-universe-world',
    });
  }

  if (destinationHasRecordSection(input)) {
    entries.push({
      id: 'record',
      label: LABELS.record,
      href: '#anime-universe-record',
    });
  }

  entries.push({
    id: 'beyond',
    label: LABELS.beyond,
    href: '#anime-universe-beyond',
  });

  return entries;
}
