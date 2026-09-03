# TASK-093 — Capital Phase Experience Architecture Audit

Status: FROZEN (audit complete)
Area: Capital Phase · product experience · World + Destination architecture

## 1. Executive finding

**TASK-092 solved movement; it did not solve meaning.**

Production operator QA confirms: World → Anime transportation is physically coherent, but the product still reads as **World → Navigator → Anime detail page**. The environment is strong; the **activity surface is thin**. Transport improves state change; it does not give the user reasons to explore, act, save progress, or return.

**Core diagnosis:** AetherAnime has a **place shell** (WorldEnvironment, transport, ceremony) without a **place economy** (discoverable landmarks, destination activities, return signals). Navigator became the de facto product because it is the only fully functional loop.

**Strategic conclusion:** The next phase must add **product depth through places and activities**, not through more motion polish. Navigator must become an **accelerator** into a system the user can also discover by walking the World.

## 2. Live operator evidence

Observed on production (`dpl_93FoPdqkLffo4zWNrxBmmRAZQ9hn`, commit `36c3553`) after TASK-092 deploy:

| Observation | Implication |
|---|---|
| World environment visually strong | Visual foundation is not the bottleneck |
| World Idle largely static/inert | Idle has atmosphere but few **affordances** |
| Navigator dominates interaction | Single-loop product; not an OS |
| Transport perceptible (deferred URL, recede, crossing) | TASK-092 success criterion met for **movement** |
| Anime Destination polished but catalog-like | Metadata hierarchy wins over **place activities** |
| Insufficient activities after arrival | User completes arrival, then leaves |
| No compelling return reason | Memory/Horizon too subtle to drive re-entry |
| World feels like presentation layer around navigation | Scene Director orchestrates **transitions**, not **life** |

Evidence type: operator journey + screenshots. Not a mandate for random redesign — a mandate for **product architecture**.

## 3. Current product loop

```
ENTER (Home ceremony)
  ↓
WORLD IDLE (stand in environment)
  ↓
ASK (Navigator — primary action)
  ↓
RESOLVE (intent / discovery / semantic)
  ↓
SELECT (path list or exact arrive)
  ↓
TRANSPORT (TASK-092 — depart → transit → URL → arrive)
  ↓
ANIME DESTINATION (poster + metadata + Watch Now + Watchlist + optional paths)
  ↓
LEAVE (external watch or browser back)
```

**What the user can actually do in World Idle today** (source-verified):

| Action | Mechanism | Product value |
|---|---|---|
| Type/voice ask | Navigator form | High — only full discovery loop |
| Select ambiguous/discovered candidates | Navigator path list | High |
| Continue to last place | Navigator button (Memory newest) | Medium — hidden in instrument |
| Focus region (Continuum / Thresholds) | WorldKind → `?region=` | **Low** — copy in WorldDetails only |
| Activate region | `activateRegion` | **None yet** — no destination commit |
| Observe Memory Horizon | Decorative marks | **Low** — non-interactive (TASK-057-B) |
| Pointer parallax | EnvironmentDepth | Atmospheric only |
| Arrive via URL | Deep link handoff | Bypasses transport |

**Decorative vs meaningful today:**

| Element | Role today | Could become |
|---|---|---|
| Memory Horizon | Decorative residual | Signal archive (read-only landmark) |
| Continuum / Thresholds crossings | Spatial + focus + copy | **True place thresholds** with activities |
| WorldDetails | Region status text | Place-specific discovery surface |
| Kinship / Story paths | Post-arrival appendix | **Primary destination activities** |
| Watchlist | Toggle on Destination | **Saved-worlds place** |
| Continue | Navigator-only | **World landmark + Navigator intent** |

## 4. Target product loop

Minimum compelling loop (Capital Phase target):

```
ENTER
  ↓
EXPLORE (World landmarks — without typing first)
  ↓
DISCOVER (curated / memory / featured signals)
  ↓
FOCUS (approach a place or anime signal)
  ↓
TRAVEL (existing TASK-092 transport)
  ↓
ARRIVE
  ↓
ACT (destination activities — paths, watch, save, relate)
  ↓
MEMORY (place recorded — existing model)
  ↓
RETURN (World shows evidence of journey)
  ↓
WORLD CHANGES (subtle — signals, not HUD)
```

**Smallest implementation that makes this real:** One **non-Navigator discovery path** on World Idle **plus** one **activity-first destination surface** — not six new pages.

## 5. World model

The World is `/world/aetheranime` idle: `WorldScene` + `WorldEnvironment` + `WorldShell` (identity / primary / secondary).

**Persistent:** URL, Memory, Watchlist, environment plates, region registry metadata.

**Responsive today:** Ask-light on Navigator focus; transport lifecycle; arrival atmosphere; living presence (idle breath).

**Not responsive today:** Memory count/recency (TASK-066); Watchlist presence; discovery history; unfinished activities; return personalization.

**World should change on return (ranked, within TASK-066):**

1. **Continue landmark** — visible when Memory exists (not buried in Navigator idle)
2. **Horizon density** — already maps Memory; could gain semantic legend
3. **Featured discovery signal** — one curated World surface (not algorithm feed)
4. **Saved-worlds signal** — Watchlist count as environmental cue (not card grid)

**World should NOT become:** scroll narrative, 3D walk space, chat panel, or dashboard.

## 6. Place model

| Concept | Classification | Rationale |
|---|---|---|
| **World (AetherAnime)** | True place — anchor | Canonical standing location |
| **Anime** | Destination inside World | Already implemented via `?anime=` |
| **Watchlist** | **Place** (future) | Saved worlds deserve spatial entry, not modal list |
| **Memory / Journey** | **Instrument + landmark** | Horizon + Continue; not a separate page first |
| **Discovery / Featured** | **Place region** or Continuum activity | Fills "explore without Navigator" gap |
| **Profile** | **Deferred place** | No accounts; local identity insufficient for V1 Capital |
| **Navigator** | **Instrument** | Fast-travel / intent accelerator — not a place |
| **Continuum / Thresholds** | **Landmark regions** | Registry exists; need activities not just copy |
| **Home** | Threshold (separate route) | TASK-052 — unchanged |

**Not a sitemap:** Places are **spatial commitments** (`?anime=`, future `?place=watchlist`, region activities), not parallel page tree.

## 7. Destination model

**Today** (`AnimeDestination`): poster field + identity + synopsis + MAL metadata + Watch Now + Watchlist toggle + `AnimeDestinationPaths` (Story chamber, Signal tags, Kinship constellation on demand).

**Problem:** Visual hierarchy matches **detail page** (metadata block competes with place). Paths exist but feel **appendix**, not **why you came**.

**Ranked post-arrival activities** (product value × architectural fit):

| Rank | Activity | Exists | Gap |
|---|---|---|---|
| 1 | **Follow relationship path (Kinship travel)** | Partial | Should feel like **departure to another world**, not list click |
| 2 | **Watch (verified official)** | Yes | Correct; keep subordinate to exploration |
| 3 | **Save to Watchlist** | Yes | Needs **saved-worlds place** to complete loop |
| 4 | **Explore story record** | Partial | Story chamber exists; needs activity framing |
| 5 | **Return to World** | Implicit (Escape/clear) | Needs explicit **place exit** ceremony (reuse transport grammar) |
| 6 | **Continue / resume** | Idle-only | Could surface on Destination as **return path** |
| 7 | Similar / discover more | Kinship API | Tie to World discovery, not only Destination |
| 8 | Episodes / characters / trailers | No data | **Defer** — no invented catalog |
| 9 | Achievements / gamification | No | **Reject** |

**Destination should contain:** atmosphere + **1–3 primary activities** + supporting metadata whisper + transport exit.

## 8. Activity model

**Activity** = a user-initiated action that **changes place, persistence, or discovery state** with product meaning.

| Activity | Core | Keep |
|---|---|---|
| **explore** | Walk World landmarks | **Yes** — underbuilt |
| **discover** | Find anime without exact title | Yes — Navigator today |
| **arrive / travel** | TASK-092 transport | Yes — frozen |
| **watch** | Leave to official source | Yes |
| **save** | Watchlist | Yes — extend spatially |
| **continue** | Resume last place | Yes |
| **follow path** | Kinship / story | Yes — elevate |
| **focus** | Region/anime approach | Extend TASK-093 spatial focus |
| **return** | Exit destination to World | Add explicit grammar |
| compare, inspect metadata | Secondary | Subordinate |
| chat, achievement, social | **Reject** | No product value / scope |

## 9. Navigator role

**Current (frozen TASK-067):** Primary discovery + routing instrument; deterministic-first; semantic assist; never auto-arrives except exact catalog; not a chatbot.

**Target evolution:** **Universal intent accelerator** — same architecture, expanded **intents**:

| Intent class | Example | Status |
|---|---|---|
| Descriptive discovery | "anime about a hunter…" | Live |
| Exact arrive | "Solo Leveling" | Live |
| Continue | "return to this place" | Partial — button only |
| Watchlist | "show my saved anime" | Phase in Navigator — **needs Watchlist place** |
| Place travel | "take me to watchlist" | **New** — requires place model |
| Recommendation | "what should I watch?" | **Curated discovery place first**, Navigator second |

**Do not:** chatbot UI, query history persistence, LLM narrative, auto-navigation.

Navigator **remains instrument**; World landmarks must carry **explore-without-typing** load.

## 10. Memory role

**Current (`aetheranime.memory.v1`):** Places not visits; `{ animeId, slug, lastArrivedAt, title? }`; cap 60; drives Continue + Horizon; recorded at `arrivedAnime` (TASK-057-A).

**Evolution (within TASK-066 unless superseded):**

| Mechanism | Change | Justification |
|---|---|---|
| Schema expansion | **Defer** | No visit counts without decision |
| Horizon interactivity | **Evaluate** | Read-only "return to mark" — conflicts TASK-057-B if interactive |
| World signals from Memory | **Subtle cues** | e.g. Continue landmark outside Navigator |
| Recent places strip | **Reject as card list** | Violates visual language |
| Journey unfinished state | **Defer** | No watch progress in V1 |

Memory becomes meaningful when **World and Destination respond** to it — not when Memory becomes a dashboard.

## 11. Watchlist role

**Current (`aetheranime.watchlist.v1`):** Explicit save; Navigator `watchlist` phase returns rows; Destination toggle.

**Target:** **Watchlist as a World place** — constellation of saved destinations, not CRUD table.

Minimum spatial representation:

- Entry landmark on World Idle (environmental cue when count > 0)
- Transport to Watchlist place (reuse TASK-092 grammar)
- Kinship-like path layout for saved titles
- Navigator fast-travel: "my saved anime"

**Do not:** grid cards, bulk edit UI, accounts sync (deferred).

## 12. Profile role

**Defer** Capital Phase implementation.

Local-only Profile without accounts is **identity theater**. When introduced (post-gate):

- Journey summary (from Memory — read only)
- Preferences (genre signals — local)
- Not gamification / achievements

**Now:** Profile would distract from **World + Anime place depth**.

## 13. Return / persistence model

**"What should be different tomorrow?"** (ranked)

1. **Continue visible on World** — evidence Memory exists
2. **Watchlist environmental signal** — saved worlds waiting
3. **Horizon marks** — already show recent places (still non-interactive)
4. **Featured discovery rotation** — optional curated signal (static config OK)
5. **Personalized World climate** — **defer** (TASK-066 forbids Memory-driven environment without decision)

Return value = **recognition**, not **notification spam**.

## 14. Architecture mapping

| Layer | Current | Extension |
|---|---|---|
| **Experience Shell** | `ExperienceLayout` | Unchanged |
| **Scene Director** | `WorldScene` + transport phase | Add **place mode** derived from URL/query — not new global store |
| **Environment** | `WorldEnvironment` | Optional **place atmosphere** tokens |
| **Transport** | TASK-092 lifecycle | Reuse for Watchlist place, Kinship travel, World return |
| **Place Shell** | `WorldLayout` / `WorldShell` | Slot content by **place kind** |
| **Instruments** | Navigator, Continue | Navigator intents; Continue as landmark |
| **Navigation Adapter** | `WorldSceneNavigation` | New place hrefs when places ship |

**Extend, do not replace:** Scene Director + Navigation Adapter split ([[TASK-091]] · TASK-092).

## 15. Required new abstractions

| Abstraction | Required? | Notes |
|---|---|---|
| **Place kind** (world / anime / watchlist / discovery) | **Yes — minimal enum** | Derived from URL + scene state |
| **Landmark** (World Idle affordance) | **Yes — conceptual** | Maps to regions + new entry points |
| **Activity** (destination action) | **Yes — product taxonomy** | Drives layout priority |
| **Transport lifecycle** | **No — exists** | TASK-092 |
| **Global world-position store** | **No** | TASK-066 rejected |
| **Journey / session state machine** | **No** | URL + Memory sufficient |
| **User account model** | **No** | Deferred |

## 16. Explicitly rejected abstractions

- WebGL / R3F / 3D camera
- Scroll hijacking / 400vh narratives
- Particle systems / decorative motion
- Generic chatbot / AI avatar
- Achievement / XP / badges
- Social feed / accounts (now)
- Card grid dashboards
- Second navigation / compositor system
- Query history persistence
- Memory-driven living-light changes (without TASK-066 supersession)
- Fake clickable decorations without destination

## 17. Ranked implementation roadmap

| Task | Objective | User outcome | Architecture | Risk | Perf | Frozen impact |
|---|---|---|---|---|---|---|
| **TASK-094** | **World discovery landmark** — Continuum (or equivalent) surfaces curated discovery **without Navigator first** | User explores before typing | Extend `WorldKind` + region focus → discovery surface; reuse retrieval APIs | Medium | Low | Extends TASK-053/054/059; no conflict |
| **TASK-095** | **Destination activity-first layout** — Kinship/Story/Watch primary; metadata subordinate | Arrival feels like **place with things to do** | `AnimeDestination` composition only | Low | Low | Extends TASK-080 presentation |
| **TASK-096** | **Watchlist place** — spatial saved-worlds destination + transport | Save loop completes inside World | New place kind + `WorldScene` slot; reuse transport | Medium | Low | None if URL pattern additive |
| **TASK-097** | **Return transport** — explicit World exit from Destination (reuse TASK-092 reverse) | Leaving feels like travel home | Extend transport for `clearAnimeArrival` ceremony | Low | Low | Compatible TASK-092 |
| **TASK-098** | **Continue landmark** — World Idle affordance outside Navigator | Return path visible | World Idle landmark + existing Continue logic | Low | None | TASK-061 compatible |
| **TASK-099** | **Navigator place intents** — "my watchlist", "continue" as typed intents | Navigator as accelerator | Extend `planAnimeAsk` routing | Medium | None | TASK-067 extension — document only |
| **TASK-100** | **Home → World transport continuity** | Enter feels continuous | TASK-091 deferred item | Medium | Medium | TASK-052 compatible |
| **Deferred** | Profile place | — | — | — | — | Accounts decision required |
| **Deferred** | Horizon interactivity | — | — | — | — | **Conflicts TASK-057-B** — needs supersession |
| **Deferred** | Memory-driven environment | — | — | — | — | **Conflicts TASK-066** — needs supersession |

**Experiment 1 (TASK-090):** No analytics architecture changes during active baseline. GROWTH events remain unwired until readout.

## 18. Frozen-decision impact

| Decision | Conflict | Resolution |
|---|---|---|
| **TASK-066** | World signals from Memory | **Remain frozen** — subtle Continue landmark OK; no climate/geography driven by Memory |
| **TASK-057-B** | Interactive Horizon | **Remain frozen** — do not make marks clickable without supersession |
| **TASK-067** | Navigator as chatbot / primary feed | **Remain frozen** — expand intents, not UI paradigm |
| **TASK-061** | Continue semantics | **Compatible** — surface Continue more visibly |
| **TASK-062** | AI boundaries | **Compatible** — structured intent only |
| **TASK-092** | Transport | **Frozen** — reuse grammar |
| **TASK-069** | V1 freeze | **Capital Phase extension** — bounded place/activity work explicitly approved post-TASK-092 |
| **TASK-090** | Analytics | **Do not modify** during Exp 1 window |

**Superseding decisions required (future, not now):** TASK-057-B if Horizon becomes interactive; TASK-066 if environment derives from Memory.

## 19. Risks

| Risk | Mitigation |
|---|---|
| Building more animation instead of activities | Roadmap prioritizes discovery + layout |
| Watchlist place becomes CRUD grid | Kinship-path spatial pattern |
| Navigator remains primary | TASK-094 mandatory before Navigator expansion |
| Scope creep to Profile/accounts | Explicit defer |
| TASK-090 contamination | No analytics changes |
| Performance regression | Reuse TASK-092 transient ceremony; no new continuous layers |
| Breaking transport / deep links | Place model derives from URL; handoff paths preserved |

## 20. Success criteria

Future user can:

1. Enter without knowing an anime title
2. Discover something **without Navigator as first action**
3. Understand World regions/places have distinct purposes
4. Travel between places (TASK-092)
5. Arrive with **meaningful activities**
6. Save / watch / explore paths
7. Leave and return
8. See **evidence of memory** on World (not a dashboard)
9. Still use Navigator for fast intent travel
10. Feel: **"an anime world I inhabit"**

## 21. Recommended next implementation task

**TASK-094 — World Discovery Landmark (Continuum activity surface)**

**Why first:** Operator QA proves transport is insufficient; the highest-leverage gap is **World Idle inertness**. User must **explore before ask**. Continuum region already exists in registry with `activities: ['explore', 'lore', 'portal']` but delivers **copy only** (`WorldDetails`). Activating discovery here breaks the Navigator monopoly without new routes or accounts.

**Out of scope for TASK-094:** Watchlist place, Profile, Navigator redesign, analytics, new transport architecture.

## Links

[[TASK-091]] · [[TASK-092]] · [[TASK-090]] · [[TASK-087]] · [[TASK-066]] · [[TASK-061]] · [[TASK-067]] · [[TASK-053]] · [[TASK-059]] · [[TASK-080]] · [[vision]] · [[visual-language]] · [[current-state]]
