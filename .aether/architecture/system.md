# System

Composition and ownership map. Code is authoritative; this file exists so an agent knows *where to look* and *what not to duplicate*.

## Director hierarchy

```
app/page.tsx                 →  ExperienceLayout → ArrivalScene            (Home)
app/world/[destination]/     →  ExperienceLayout → WorldSceneNavigation
                                                     → [[WorldScene]]      (world)
```

A **director** owns state for a stage and publishes it through context. Everything below a director is a performer that subscribes and renders. There are three directors:

| Director | File | Owns |
|---|---|---|
| `ArrivalScene` | `widgets/arrival-scene/arrival-scene.tsx` | `ArrivalPhase` ceremony, portal → world hand-off |
| `WorldScene` | `widgets/world-scene/world-scene.tsx` | lifecycle, presence, focus, arrived anime, derived ambient |
| `RegionScene` | `widgets/region-scene/region-scene.tsx` | current region runtime under world focus |

## [[WorldScene]] — the scene director

State it owns, and only it:

- `lifecycle` — via `reduceWorldLifecycle`
- `presence` — via `reduceWorldPresence`
- `focusedRegion` — via `reduceWorldFocus`
- `arrivedAnime: CanonicalAnime | null` — **parallel to focus**, never in the focus reducer or the region registry
- `ambient` — derived by `resolveWorldAmbient({ lifecycle, presence, focusedRegion })`

It publishes all of this plus `dispatchFocus`, `clearFocus`, `activateRegion`, `arriveAnime`, `clearAnimeArrival` on `WorldSceneContext`, and mirrors it onto DOM data attributes that CSS gates on:

`data-world-slug` `data-world-id` `data-world-status` `data-world-lifecycle` `data-world-presence` `data-world-focus` `data-world-anime` `data-world-ambient-level` `data-world-ambient-variant`

Boundaries:

- Never reads search params, never writes the URL. Navigation arrival enters through validated `initialRegionId` / `initialAnimeSlug` props and is applied by dedicated hand-off effects that track the last applied identity in refs.
- Arriving an anime clears curated focus. Activating a region clears an arrived anime.
- Discovered (non-catalog) arrivals hydrate through `requestDiscoveredAnime` with an `AbortController` that is aborted on re-entry and unmount.

## Composition below WorldScene

```
WorldScene
├── world-scene-atmosphere (z-0, aria-hidden)
│   ├── [[WorldEnvironment]]      artwork, depth, light, poster wash
│   └── [[WorldClimate]]          scene-wide climate drift
├── WorldRealmCrossing            one-shot black-hole warp (TASK-092 presentation)
└── RegionScene (z-10)
    └── WorldShell                permanent destination architecture
        └── WorldLayout           slot placement (idle vs arrival)
            ├── identity  → WorldIdentity (+ Navigator on Idle only)
            ├── presence  → RegionClimate       (subordinate to WorldClimate, stage-scoped)
            ├── primary   → WorldKind on Idle; AnimeDestination universe on arrival
            └── secondary → WorldDetails        (yields on arrival)
```

`WorldShell` is a composition host only — it reads identity metadata from scene context and places slots. It owns no domain state.

## Domain layer

`shared/world` — registries and reducers. `WORLD_REGISTRY`, `WORLD_REGION_REGISTRY`, region helpers (`getRegion`, `resolveWorldRegions`, `isWorldRegionInteractive`, `resolveInitialRegionFocus`), validation (`assertValidWorldRegionDefinition`, `assertUniqueRegionRegistry`), portal destination resolution, and the four reducers/derivations. Regions of note: `AETHERANIME_REGION_CONTINUUM_ID`, `AETHERANIME_REGION_THRESHOLDS_ID`, plus system regions for awaiting-kind / sealed-stage / world.

`shared/anime` — the anime domain, entered through `shared/anime/index.ts`. See [[data-flow]].

## Destination systems

| System | Location | Owns |
|---|---|---|
| `AnimeDestination` | `widgets/anime-destination/` | arrived universe: environmental hero, poster recomposition, spatial Story/World/Record, branching Paths, coordinate index, Watch/Watchlist, Beyond |
| Watch Now | `anime-destination.watch-now.ts` + `shared/anime/anime.watch-path.ts` | the only external threshold; `window.open(url, '_blank', 'noopener,noreferrer')` on an already-verified https URL |
| Watchlist / Save | `shared/anime/anime.watchlist.ts` | local-first persistence, key `aetheranime.watchlist.v1`, event `aetheranime:watchlist` |
| Story | `anime-destination.paths.ts` (`destinationStoryRecord`) | catalog orientation + already-loaded MAL synopsis. Zero extra requests, no LLM |
| Signals | `destinationSignalTags` over `shared/anime/anime.semantic-profile.ts` | application-owned semantic evidence, no scores |
| Kinship | `destinationKinshipAvailable` + `requestAnimeDiscovery({ kind: 'similar' })` | branching candidate paths; at most one request per mounted destination |
| Universe network | `AnimeUniverseNetwork` + `useNeighboringWorlds` | Beyond spatial neighbors (≤3); catalog or discovered MAL identity; travel via `arriveAnime` |

`AnimeDestinationPaths` remounts an inner instance keyed on `anime.slug` so path state cannot leak between destinations.

## [[Navigator]]

`widgets/world-navigator/` — the world's instrument. Owns query input, voice (`world-navigator.speech.ts` + `normalizeVoiceQuery`), semantic intent requests, discovery requests, watchlist return rows, and candidate path rendering. It **proposes**; arrival happens through `arriveAnime` on the scene. Search and recommendations never auto-arrive.

## Must not be duplicated

- A second scene/state owner for world lifecycle, presence, focus, or arrival.
- A second atmosphere or climate system. Extend [[WorldEnvironment]] / [[WorldClimate]].
- A second identity-enter motion primitive ([[TASK-049]] put it in `shared/lib/motion/identity.ts`).
- A shared focus-ring abstraction ([[TASK-050]] decided against one).
- Any client-side third-party API access. Provider calls are server-only ([[network]]).
- URL writes outside `shared/lib/navigation`.

## Related

[[rendering]] · [[routing]] · [[data-flow]] · [[network]] · [[engineering-rules]]
