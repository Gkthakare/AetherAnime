/**
 * Catalog arrival atmosphere — decorative projection from arrivedAnime.poster.
 *
 * Active only when that poster string is present. Discovered arrivals without
 * artwork, candidates, and idle never pass a poster, so they never receive a
 * bitmap field. Not a store, not Focus, not a route.
 */

export type AnimeArrivalAtmospherePresentation = {
  readonly active: boolean;
  readonly source: string | null;
  readonly spatial: boolean;
  readonly ariaHidden: true;
};

export type AnimeArrivalAtmosphereInput = {
  readonly poster: string | null;
  readonly reduceMotion: boolean;
};

export function animeArrivalAtmosphere(
  input: AnimeArrivalAtmosphereInput,
): AnimeArrivalAtmospherePresentation {
  const source =
    typeof input.poster === 'string' && input.poster.length > 0
      ? input.poster
      : null;
  const active = source != null;

  return {
    active,
    source,
    spatial: active && !input.reduceMotion,
    ariaHidden: true,
  };
}
