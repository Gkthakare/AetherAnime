# TASK-097 — Capital Experience: Universe visual expansion

Status: FROZEN (implementation complete)
Area: Destination universe composition · spatial index · poster recomposition

## Decision

**The arrived universe is a descending environmental composition, not a long details page.** TASK-096 architecture stays: native document scroll, one poster contract, black-hole warp, no second transport. TASK-097 changes how that universe is seen — cinematic arrival, spatial Story/World/Record, branching Paths, coordinate index, and Beyond as continuation.

## Why

TASK-096 made Destination a universe in structure. In production it still read as stacked text under one faint plate. Capital Experience requires the environment to stay the protagonist while the traveller scrolls deeper, using only verified catalog facts.

## Protected behaviour

- Artwork remains `CanonicalAnime.poster`, recomposed via `data-crop` fields — never fabricated characters, stills, or lore
- Spatial index is the existing in-page coordinate (`destinationUniverseNav` + `useUniverseHere`); not a second navigator
- Paths keep `aria-expanded` / kinship-similar fetch; visual fork only
- Warp remains one-shot CSS (`world-realm-crossing.css`); no cyan `border-ring` restoration
- Contract tests: `anime-destination.depth.test.ts` plus TASK-096 universe/warp tests

## Implementation area

`anime-destination.tsx` · `anime-destination.universe.css` · `anime-destination.universe.ts` · `use-universe-here.ts` · `anime-destination-paths.tsx` · `world-realm-crossing.css`

## Contracts

Keyboard Tab order: index → Return → Watch Now → Watchlist → Enter the story → Paths. Focus-visible uses local `--ring`. Reduced motion keeps content, drops travel. Settled Destination FPS was measured in headless Chromium only (390: 60 rAF/s; 1440: 46 rAF/s with GPU disabled) — not claimed as the production Chromium contract. No new continuous compositor.

## Do not undo

- Do not restore a metadata table, card grid, or identity-column destination
- Do not invent episode/character galleries when the model has none
- Do not add WebGL/Canvas/R3F, scroll hijack, or a second camera/transport
- Do not make the spatial index a dominating HUD

## Links

[[TASK-096]] · [[TASK-095]] · [[TASK-075]] · [[TASK-046]] · [[visual-language]] · [[performance-contract]]
