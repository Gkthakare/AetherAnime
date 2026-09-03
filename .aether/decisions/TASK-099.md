# TASK-099 — Universe Network

Status: FROZEN (implementation complete)
Area: Destination · Beyond · neighboring-universe travel

## Decision

**Neighboring anime are a spatial universe network, not recommendations.** Beyond presents up to three real MAL-similar worlds as environmental destinations; selection travels through existing `arriveAnime` → TASK-092 transport → TASK-096 warp. Discovered destinations keep second-order kinship via MAL identity.

## Why

TASK-098 surfaced neighbors as path-local text. Capital Experience requires World → Universe → Neighbor → Universe continuity without a graph engine, second transport, or fabricated relationships.

## Protected behaviour

- Kinship available when `malIdForSlug(slug) != null` (catalog or `discovered-{id}`)
- Similar API seeds via `resolveSimilarLookupAnime` — never invents titles
- Network owns presentation (`anime-destination-network.tsx`); travel remains `arriveAnime` + `markArrivalVia('kinship')`
- Max three neighbors (`ANIME_UNIVERSE_NETWORK_MAX`); lazy abortable fetch; remount `key={slug}`
- Contract tests: `anime-destination.network.test.ts` plus living/paths suites

## Implementation area

`anime-destination.tsx` · `anime-destination-network.tsx` · `use-neighboring-worlds.ts` · `anime-destination.universe.css` · `app/api/anime-discovery/route.ts` · `anime.repository.ts`

## Contracts

Keyboard/pointer/touch share `data-neighbor-state` prominence. Reduced motion keeps network, selection, and destination change. Production Chromium FPS was not re-measured this close. No graph store, no recursive prefetch, no WebGL/Canvas/R3F.

## Do not undo

- Do not add a global universe graph, traveller coordinates, or second recommendation system
- Do not route neighbors outside `arriveAnime` / black-hole warp
- Do not fabricate relationships, posters, or anime data when MAL is silent
- Do not turn Beyond neighbors into card grids or “Recommended for you”

## Links

[[TASK-098]] · [[TASK-097]] · [[TASK-096]] · [[TASK-092]] · [[visual-language]] · [[data-flow]]
