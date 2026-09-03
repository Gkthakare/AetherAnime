# TASK-098 — Living Anime Universe

Status: FROZEN (implementation complete)
Area: Destination interaction · paths exploration · neighboring worlds

## Decision

**The arrived universe is a place the traveller can explore, not only a cinematic page.** TASK-097 visual depth stays. TASK-098 adds destination-local exploration: path focus changes spatial emphasis, world facts open Signals, watchlist claims identity, and neighboring worlds travel through existing `arriveAnime`.

## Why

Visual depth alone still read as a website. Capital Experience requires EXPLORE / INTERACT / DISCOVER DEEPER with visible consequence, using only real catalog/MAL facts and existing architecture.

## Protected behaviour

- Explore/claimed state is local to `AnimeDestination` (`data-universe-explore`, `data-universe-claimed`); no global traveller or camera
- Neighboring worlds reuse `requestAnimeDiscovery({ kind: 'similar' })` + `canonicalizeDiscoveryCandidate` + `arriveAnime`; fetch on Paths listen or Kinship, abortable, remounted by `key={anime.slug}`
- World genres are exploration thresholds into Signals (`#anime-universe-paths`), not filters
- Spatial identity is `data-slot="anime-universe-anchor"` — not a sticky site header
- Contract tests: `anime-destination.living.test.ts` plus TASK-096/097 destination suites

## Implementation area

`anime-destination.tsx` · `anime-destination-paths.tsx` · `anime-destination.universe.css` · `anime-destination.constants.ts`

## Contracts

Keyboard Tab: index → Return → Watch Now → Watchlist → Enter the story → genre thresholds → Paths. Focus-visible uses local `--ring`. Reduced motion keeps content, navigation, and state; drops travel. Production Chromium FPS was not re-measured this close. No new persistence, analytics, compositor, or transport.

## Do not undo

- Do not invent characters, episodes, lore, artwork, or franchise-neighbor helpers
- Do not add a second recommendation system or prefetch similar lookup on hero arrival
- Do not turn Paths or neighbors into card grids, dashboards, or “Recommended for you”
- Do not add WebGL/Canvas/R3F, particles, scroll hijack, or a second camera/transport

## Links

[[TASK-097]] · [[TASK-096]] · [[TASK-092]] · [[TASK-046]] · [[visual-language]] · [[data-flow]]
