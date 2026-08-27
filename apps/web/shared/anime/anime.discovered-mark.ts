/**
 * Project-owned geometric identity for discovered destinations.
 *
 * Not a poster. Not a remote image. Deterministic from application data.
 */

const SEAL_HUES = [198, 258, 172, 28, 332] as const;

export type DiscoveredDestinationMark = {
  readonly kind: 'local-seal';
  readonly glyph: string;
  readonly hue: number;
  readonly inscription: string;
};

function glyphFromTitle(title: string): string {
  const match = /[A-Za-z0-9]/.exec(title);
  return (match?.[0] ?? '#').toUpperCase();
}

export function discoveredDestinationMark(input: {
  readonly malId: number;
  readonly title: string;
  readonly genres: ReadonlyArray<string>;
  readonly year: number | null;
}): DiscoveredDestinationMark {
  const genre = input.genres[0]?.trim() ?? '';
  const inscription = [input.year != null ? String(input.year) : '', genre]
    .filter((part) => part.length > 0)
    .join(' · ');

  return {
    kind: 'local-seal',
    glyph: glyphFromTitle(input.title),
    hue: SEAL_HUES[input.malId % SEAL_HUES.length] ?? SEAL_HUES[0],
    inscription,
  };
}
