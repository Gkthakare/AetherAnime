# TASK-063 ARCHITECTURE AUDIT

Status: FROZEN (audit complete)
Area: Entire AetherAnime application · forensic integration audit after TASK-062

## Executive Summary

**READY** — the TASK-046 → TASK-062 lineage forms a coherent production system. Ownership boundaries largely hold; frozen decisions match code; measured Idle / Continue+Horizon / Destination FPS ≈60–61 at all four required viewports.

Top findings:

1. **Ownership is coherent** — WorldScene directs lifecycle/arrival; Navigator owns ask/Continue; Memory is a single recorder; Environment is presentation-gated; URL writes stay in `WorldSceneNavigation`.
2. **TASK-061 / TASK-062 match code** — Continue from Memory newest only; no `aetheranime.continue.v1`; AI remains parse → validate → retrieve → candidates.
3. **Geography / Destination / Horizon gates hold** — Idle-only far plates; Destination far opacity `0`; Horizon non-interactive Idle-only; exactly two `data-region-order` values (`0`/`1`).
4. **Optional hygiene only** — permanent `will-change-[opacity]` on living light; unused `@base-ui/react` / `shadcn` deps; Watchlist `storage` listener unfiltered vs Memory.
5. **No required blockers** before the next feature task.

## Scope

Inspected: WorldScene, WorldEnvironment (+ geography / destination-presence / living / realm-crossing), WorldClimate, AnimeArrivalAtmosphere, WorldKind landmarks, AnimeDestination, WorldMemoryHorizon, WorldNavigator (+ Continue), Memory/Watchlist/semantic-intent, navigation commit helpers, world page + Home AtmosphereLayer, persistence/network/CSS/deps/tests, production Chromium FPS on port 3200.

Not changed: production code, CSS, tests, assets, schemas, APIs, frozen decisions (except this audit record + index/memory pointers).

## System Map

```
User ask (type/voice)
  → WorldNavigator
  → planAnimeAsk (deterministic-first)
  → [optional] POST /api/anime-intent → StructuredAnimeIntent
  → retrieve/rank (catalog + /api/anime-discovery)
  → candidate paths
  → explicit confirm
  → WorldScene.arriveAnime
  → WorldSceneNavigation → ?anime=
  → WorldEnvironment / WorldKind / AnimeDestination

Memory (arrivedAnime effect → rememberArrival)
  → Horizon (Idle decorative read)
  → Continue (Navigator Idle suggestion → arriveAnime / hydrate)
```

Ownership: Scene = orchestration + single Memory write; Navigator = instrument; Environment/Kind/Horizon = presentation; Page + Navigation adapter = URL; domain modules = persistence/intent.

## Ownership Audit

### WorldScene

Finding: Owns Lifecycle/Presence/Focus/`arrivedAnime`, derives atmosphere, mounts default composition, single `rememberArrival(arrivedAnime)` effect. Discovered URL hydrate via `handoffAnimeArrival` + `requestDiscoveredAnime`. Does not write URL.
Classification: KEEP (hydrate-in-director is intentional; optional future MOVE LATER only if a dedicated arrival-hydrate module is justified)
Evidence: `widgets/world-scene/world-scene.tsx`; `world-memory-arrival.test.ts`

### WorldEnvironment

Finding: Presentation-only plates + living light + Destination presence CSS. Geography gated `[data-slot='world-scene']:not([data-world-anime])`. Destination presence gated `[data-world-anime]`; far stays hidden.
Classification: KEEP
Evidence: `world-idle-geography.css`, `world-destination-presence.css`; production probe `farOpacity: "0"` on Destination

### Navigator

Finding: Ask / interpret / candidates / Watchlist return / Continue / Escape clear. Reads Memory via stable snapshot; never writes Memory/Watchlist/URL.
Classification: KEEP
Evidence: `world-navigator.tsx`, `world-navigator.continue.ts`

### Memory

Finding: Sole key `aetheranime.memory.v1`; sole writer Scene effect; readers Continue + Horizon; no direct localStorage outside domain.
Classification: KEEP
Evidence: `anime.memory.ts` grep; Continue/Horizon contracts

### WorldKind

Finding: Continuum order `0` + Thresholds order `1` only; TASK-059 footing/silhouette CSS; Idle-only landmark architecture; no Continue/Memory/Destination crossing.
Classification: KEEP
Evidence: landmarks CSS/tests; production `regionOrders: ["0","1"]`

### Destination

Finding: Composition + Watchlist toggle + metadata fetch + paths; no Continue; TASK-060 environment applies via Scene attrs; no Continue Destination mode.
Classification: KEEP
Evidence: `anime-destination.tsx` (no Continue); Destination probes

### WorldRealmCrossing

Finding: Arrival-ceremony overlay under `world-environment/`; separate from Idle Continuum/Thresholds.
Classification: KEEP / FALSE POSITIVE if treated as third Idle crossing
Evidence: `world-realm-crossing.css`; atmosphere `source === 'arrival'`

### AI

Finding: Matches TASK-062 — Navigator-native structured intent only; no chatbot surface; LLM does not navigate or mutate stores.
Classification: KEEP
Evidence: `anime.semantic-intent.ts`, `/api/anime-intent`, Navigator semantic branch

## TASK-046 → TASK-062 Consistency Matrix

| Task | Intended | Actual | Status | Evidence |
|------|----------|--------|--------|----------|
| 046 | Living light sole continuous breath @ ≥120rem idle; Climate frozen | Living light + Climate large-idle freeze still in code/contracts | MATCH | `world-living-presence.css`, `world-climate.constants.ts` |
| 052 | Home threshold; AtmosphereLayer reuses WorldEnvironment; no Climate | `AtmosphereLayer` mounts `<WorldEnvironment />`; no Climate | MATCH | `atmosphere-layer.tsx`, entrance tests |
| 053 | Idle is a place; Navigator instrument | Place layout + threshold form contracts present | MATCH | place tests |
| 054 | Crossings spatial, unequal | Continuum/Thresholds distinct distance treatment | MATCH | WorldKind path/landmarks |
| 055 | Idle presence inside 046 budget | Idle presence CSS; living paused on arrival | MATCH | `world-idle-presence.css`, living `source !== 'arrival'` |
| 057-A | Memory on `arrivedAnime`; places not visits | Single Scene effect `rememberArrival` | MATCH | `world-memory-arrival.test.ts` |
| 057-B | Horizon Idle decorative non-interactive | CSS gate + `pointer-events: none` + `aria-hidden` | MATCH | probes `horizonPE: "none"` |
| 058-E | Far + mid-continuation Idle-only; soft blend; Direction A obsolete | Geography CSS; default inert; no Direction A assets | MATCH | geography CSS/tests; asset manifest |
| 059 | CSS footing + silhouette; two crossings | Landmarks CSS; orders 0/1 only | MATCH | probes + landmarks tests |
| 060 | Hybrid Destination presence; far not restored | Destination CSS; far opacity 0 | MATCH | production probes |
| 061 | Continue = Memory newest; Navigator; arrive path; no new key | Implemented; no continue key | MATCH | Continue tests + persistence grep |
| 062 | AI = Navigator structured intent; no new surface | Code matches; no AI UI | MATCH | semantic-intent + Navigator |

Brain note (not code): `TASK-058-E.md` header uses `Status: accepted` while INDEX treats it as frozen — **MINOR DRIFT** (docs only).

## Persistence Audit

| Key | Owner | Writer | Readers | Schema |
|---|---|---|---|---|
| `aetheranime.memory.v1` | `anime.memory.ts` | WorldScene `rememberArrival` | Continue, Horizon | `{ animeId, slug, lastArrivedAt, title? }` |
| `aetheranime.watchlist.v1` | `anime.watchlist.ts` | Destination toggle | Navigator, Destination | `{ animeId, slug, savedAt, title? }` |

Absent: sessionStorage, IndexedDB, `aetheranime.continue.*`, world-position stores.

## Network Audit

| Request | Trigger | New for Continue/AI? |
|---|---|---|
| `POST /api/anime-intent` | Semantic ask only | Pre-existing (TASK-062 lock) |
| `GET /api/anime-discovery` q/similar/id | Ask / retrieve / hydrate | Pre-existing |
| `GET /api/anime-metadata/[slug]` | Destination mount | Pre-existing |

Idle: 0 API requests. Continue catalog: 0. Continue discovered / URL discovered: existing `?id=` hydrate. No polling.

## Routing Audit

| Concern | Owner |
|---|---|
| Read `?anime=` / `?region=` | `app/world/[destination]/page.tsx` validators |
| Write URL | `WorldSceneNavigation` only |
| Arrival state | WorldScene |
| Home | `/` ArrivalScene — no Continue / no Memory UI |

Mutually exclusive anime/region on write; anime wins on read. No duplicate URL writers found.

## CSS / Compositor Audit

| Item | Class |
|---|---|
| Geography / destination-presence / landmarks: no continuous animation | KEEP |
| Living + Idle light keyframes (cascaded) | KEEP (intentional dual Idle cascade) |
| Realm crossing / arrival wash one-shot keyframes | KEEP |
| `will-change-[opacity]` always on `.aether-living-light` | RISK → OPTIONAL FIX |
| Direction A CSS | OBSOLETE residue (comment only) |

## Performance Audit

Production Chromium @ `http://127.0.0.1:3200` (measured 2026-08-26):

| Viewport | Idle empty | Continue + Horizon | Destination |
|---|---:|---:|---:|
| 390×844 | 60 | 61 | 61 |
| 820×1180 | 61 | 60 | 61 |
| 1440×900 | 60 | 60 | 61 |
| 1920×1080 | 60 | 61 | 61 |

Architectural risks (not regressions at measured FPS): permanent living-light `will-change`; dual Idle light animations; Destination image/metadata decode on arrival (expected).

## Accessibility Audit

| Surface | Finding | Class |
|---|---|---|
| Continue | Real `button`, `aria-label`, path-item focus-visible | KEEP |
| Horizon | `aria-hidden`, non-interactive | KEEP |
| Env layers | decorative / pointer-events none where intended | KEEP |
| Reduced motion | Living/idle/wash/horizon branches present | KEEP |
| Global focus matrix | Unchanged by Continue/AI design | KEEP |

## Test Audit

Strengths: dense contract tests for geography, destination presence, landmarks, Memory write site, Continue, semantic intent, living budget.

Gaps (OPTIONAL): few end-to-end browser contract automations beyond manual QA; Watchlist `storage` filter asymmetry untested; Home geography inertness is asserted via CSS selectors (no live DOM Home probe in this audit beyond code).

Brittle pattern: many `assert.match(source, …)` contracts — intentional for frozen decisions; do not weaken.

## Dependency Audit

| Package | Status |
|---|---|
| next, react, framer-motion, next-themes, clsx, tailwind-merge, cva, tw-animate-css | KEEP used |
| `@base-ui/react` | UNUSED (no imports; UI kit removed) |
| `shadcn` | UNUSED runtime (CLI leftover; `components/ui` deleted) |

## Failed / Superseded Artifact Audit

**TASK-058 Direction A:** obsolete by decision text; no Direction A selectors or orphan environment WebPs; all seven environment assets are manifest-referenced. Safe to leave comment; no asset deletion required.

## Findings

### Finding 1 — Permanent living-light will-change

Classification: OPTIONAL FIX  
Severity: P2  
Area: WorldEnvironment / performance  
Evidence: `world-environment.tsx` class `will-change-[opacity]`; computed `willChange: "opacity"` even when Idle probes show living attr nuances; FPS still ≈60  
Why it matters: compositor hint left permanently; tests ban will-change on bitmaps/geography but allow light  
Recommended future action: scope will-change to `data-living='true'` only if a later perf task needs it  
Does it block new feature work? NO

### Finding 2 — Unused UI kit dependencies

Classification: OPTIONAL FIX  
Severity: P3  
Area: dependencies  
Evidence: `package.json` lists `@base-ui/react`, `shadcn`; zero source imports  
Why it matters: install weight / confusion  
Recommended future action: remove unused deps in a hygiene task  
Does it block new feature work? NO

### Finding 3 — Watchlist storage subscription unfiltered

Classification: OPTIONAL FIX  
Severity: P3  
Area: Watchlist  
Evidence: `subscribeWatchlist` listens to all `storage` events; Memory filters by key  
Why it matters: extra cross-tab re-renders when unrelated keys change  
Recommended future action: mirror Memory key filter  
Does it block new feature work? NO

### Finding 4 — Discovered hydrate owned by WorldScene handoff

Classification: DEFER  
Severity: P3  
Area: WorldScene  
Evidence: `handoffAnimeArrival` → `requestDiscoveredAnime`  
Why it matters: Director also performs network hydrate (parallel to Navigator hydrate entry points)  
Recommended future action: only extract if arrival hydration grows  
Does it block new feature work? NO

### Finding 5 — TASK-058-E decision status string drift

Classification: OPTIONAL FIX  
Severity: P3  
Area: brain  
Evidence: `TASK-058-E.md` says `Status: accepted`; INDEX lists as frozen  
Why it matters: agent routing ambiguity  
Recommended future action: normalize status language to `FROZEN`  
Does it block new feature work? NO

### Finding 6 — Dual Idle light animation cascade

Classification: FALSE POSITIVE  
Severity: —  
Area: presence CSS  
Evidence: base `aether-living-light` overridden by Idle `aether-idle-light` under `:not([data-world-anime])`  
Why investigated: looks duplicated  
Why correct: intentional Idle retuning inside 046 budget  

### Finding 7 — Home receives WorldEnvironment but not Idle geography

Classification: FALSE POSITIVE  
Severity: —  
Area: TASK-052 / 058-E  
Evidence: default far plates `opacity:0`; enable only under `world-scene:not([data-world-anime])`; Home has AtmosphereLayer without world-scene  
Why investigated: Home mounts WorldEnvironment  

### Finding 8 — RealmCrossing as third Idle crossing

Classification: FALSE POSITIVE  
Severity: —  
Area: crossings  
Evidence: ceremony overlay on arrival atmosphere only; Continuum/Thresholds remain the only Idle region orders  

## Required Fixes

None.

## Optional Fixes

1. P2 — Scope living-light `will-change` to active living only (Finding 1)  
2. P3 — Remove unused `@base-ui/react` / `shadcn` (Finding 2)  
3. P3 — Filter Watchlist `storage` by key (Finding 3)  
4. P3 — Normalize TASK-058-E decision status to FROZEN (Finding 5)

## Deferred

1. P3 — Extract discovered arrival hydrate from WorldScene if complexity grows (Finding 4)

## False Positives

- Dual Idle light keyframes (Finding 6)  
- Home WorldEnvironment implying Idle geography (Finding 7)  
- WorldRealmCrossing as third Idle crossing (Finding 8)  
- Direction A “failed assets still in tree” — none remain  

## Recommended Task Sequence

Architecture is ready for the next feature task.

Optional hygiene (non-blocking), if scheduled:

- TASK-064 — Dependency / Watchlist subscription hygiene (`@base-ui`/`shadcn` removal; Watchlist storage key filter)  
- TASK-065 — Living-light will-change scoping + 1920 Idle re-measure (only if pursuing compositor polish)

Do not implement now.

## Scope Boundary

NOT changed: production TS/TSX/CSS/assets/tests/APIs/schemas/persistence/AI. Frozen product decisions through TASK-062 untouched. This file records audit evidence only.

## Decision

TASK-063 AUDIT COMPLETE — READY

## Links

[[TASK-046]] · [[TASK-052]] · [[TASK-053]] · [[TASK-054]] · [[TASK-055]] · [[TASK-057-A]] · [[TASK-057-B]] · [[TASK-058-E]] · [[TASK-059]] · [[TASK-060]] · [[TASK-061]] · [[TASK-062]] · [[current-state]] · [[visual-debt]] · [[open-questions]] · [[data-flow]] · [[network]] · [[performance-contract]]
