# TASK-095-A — Capital Phase World Experience Transformation Audit

Status: FROZEN (audit complete)
Area: Capital Phase · World Idle visual/experience composition · Continuum · transport presentation

## Executive finding

**The World still reads as a website because the foreground is a stacked UI column (identity + ask instrument + region labels + copy rails), while the immersive environment is a non-interactive backdrop.** TASK-092 made travel coherent; TASK-094 made Continuum functionally discoverable; neither inverted the **visual hierarchy** so place outranks interface.

Core diagnosis (source-grounded): `WorldEnvironment` is `pointer-events-none` full-bleed depth; interactive life lives in `WorldShell` / `WorldLayout` as left-anchored text, input, and path lists. Continuum discovery reuses `WORLD_NAVIGATOR_PATH` styling and mounts under `RegionActivities` — so Navigator-free discovery still *looks like opening a menu*.

**Strategic conclusion for TASK-095-B:** Do not add another feature. **Recompose Idle** so Continuum focus produces an environmental discovery event, and demote the ask instrument until the World reads as a place first. Prefer DOM/CSS + existing React composition + existing motion primitives. Do not open WebGL/Canvas.

---

## Current experience diagnosis

### Why it reads as a website

| Mechanism (source) | Effect |
|---|---|
| Identity column = `WorldIdentity` + `WorldNavigator` + optional Destination (`world-scene.tsx`) | First eye stop is brand + **search field**, not geography |
| Idle layout: left text column `max-width: 26rem`, `pt-[12–16vh]` (`world-shell`, `world-place.css`) | Classic landing-page overlay on a background image |
| Landmarks = labeled `Surface` buttons + CSS footing/silhouette (`world-kind` + `landmarks.css`) | Places read as **nav labels on a seam**, not destinations |
| Continuum discovery = Navigator path chrome under RegionActivities (`region-continuum-discovery.tsx`) | Explore looks like **results list**, not world reveal |
| RegionIdentity + WorldKind header + WorldDetails | Multiple **copy bands** → information architecture of a site |
| Environment + Horizon + Living light are decorative (`pointer-events-none`) | Atmosphere without agency → “pretty website background” |
| Transport: chrome recede + realm crossing + poster field (`worldArrivalPresentation`, `WorldRealmCrossing`) | Perceived as **page transition choreography**, not inhabiting a crossing |
| Scroll = normal document; pointer parallax only on fine pointer | Input barely changes *what the place is* |

### Current product loop (visual truth)

```
ENTER → stand in backdrop
  → notice title + ASK FIELD (dominant)
  → optionally hover Continuum → text list appears below
  → select → chrome fades / crossing / URL / Destination column
  → catalog-like destination
```

TASK-093’s target loop (EXPLORE → DISCOVER → …) is **architecturally possible** after TASK-094 but **not visually primary**.

---

## Existing strengths

- Full environment stack (far / identity plate / mid-continuation / mid / foreground, TASK-058-E) is strong and already 2.5D.
- Living light + idle mist presence (TASK-046 gated) gives subtle life without a second continuous layer.
- Spatial crossings: Continuum near footing vs Thresholds distant silhouette (TASK-054 / TASK-059).
- TASK-092 transport ownership (Scene Director + deferred URL) is sound — reuse, don’t rewrite.
- TASK-094 proves Navigator-free selection → `arriveAnime` works.
- Visual language and performance contracts are clear and protective.
- Reduced motion and focus-visible rings exist on interactive paths.

---

## Major visual deficiencies

1. **Hierarchy inversion:** interaction/instrument outranks environment/place on first paint.
2. **Landmark thinness:** Continuum/Thresholds are ~5–9.5rem text+CSS architecture, not spatial volumes.
3. **Discovery as menu:** Continuum explore inherits Navigator path presentation and sits outside the landmark’s visual mass.
4. **Redundant orientation chrome:** RegionIdentity often restates Continuum while Kind + Details also speak — website stacking.
5. **Transport not environmental enough:** Destination mounts into the *identity column* (same UI stack), so “arrival” feels like content swap.
6. **No environmental storytelling on focus:** Continuum focus dispatches Focus / region climate tokens, but the user-visible change is mostly opacity/scale on labels + a list — not a place “opening.”
7. **Return invisibility:** Memory Horizon marks are too subtle to read as world change (TASK-057-B correctly non-interactive; still not a return signal).

---

## Current visual composition (source map)

| Layer | Dominant / subordinate | Feels like |
|---|---|---|
| Far / mid / FG plates + living light | Dominant *pixels*, subordinate *agency* | Environment |
| Memory Horizon | Very subordinate | Decorative residual |
| Identity title / tagline | Mid — left marker (TASK-053) | Quiet place name + still UI |
| **Navigator input** | **Dominant interaction** | Website search |
| Continuum / Thresholds labels | Mid | UI nav |
| CSS footing / silhouette | Subordinate decorative | Environmental hint |
| WorldDetails / RegionIdentity | Subordinate copy | Site helper text |
| Continuum discovery list | On focus: dominant interaction | Menu / results |
| Anime Destination (arrived) | Dominant content column | Detail page |

**Eye first (Idle):** Navigator field / identity column → then landmarks → environment as wallpaper.

---

## Depth / spatiality

**Present:** aerial veil, parallax on identity/mid/foreground (fine pointer), ground seam + footing/threshold CSS, idle geography plates.

**Missing:**
- Interactive content that *occupies* near/mid bands (discovery sits in RegionScene flex column after Shell, not on Continuum footing).
- Landmark scale that competes with the ask field.
- Transport depth change that relocates the traveller *through* plates (crossing overlay exists but Destination UI stays in the same column).

**Reposition opportunity:** Bind Continuum discovery to `[data-region-order='0']` spatial zone; keep Navigator as trailing instrument; let environment climate/ask-light already owned by Environment respond harder on Continuum focus.

---

## World activity

| Region / element | Invites exploration? | Meaningful state change? |
|---|---|---|
| Continuum | Partially (must discover focus) | Yes after TASK-094 → arriveAnime |
| Thresholds | Weak — copy / unavailable portal | Mostly decorative |
| Horizon | No (non-interactive) | Memory already recorded elsewhere |
| Navigator | Strong | Full loop |
| Pointer parallax | Atmospheric only | No product state |

World becomes static when: no focus, no typing, Continuum not hovered — living light only.

---

## Discovery (TASK-094 critique, visual)

- **Discoverable without Navigator:** yes, if user focuses Continuum (hover/keyboard/`?region=`).
- **Feels like exploration?** No — list under “Explore” with path-item buttons identical to Navigator candidates.
- **Needed response on focus/activation:** Continuum footing brightens / expands; discovery candidates appear *as path marks along the seam* or as grounded titles rising from the footing; environment climate shifts; WorldDetails copy yields to discovery; Navigator stays available but quieter.

---

## Transport

Phases exist (`departing` → `in_transit` → URL → `arriving` → settle). Visuals: chrome recede (`WORLD_ARRIVAL_RECEDE`), realm crossing, poster field, Destination mount.

**Gap:** phases are timed ceremony on UI chrome more than one continuous environmental event. Destination appearing in the same identity column as the ask field reinforces “page.”

**095-B stance:** Keep TASK-092 semantics; amplify environmental continuity (crossing + poster + recede) and ensure Continuum discovery selection *feels* like leaving the footing — without new transport architecture.

---

## Environment opportunities (no new system)

Reuse only:
- `WorldEnvironment` climate / destination atmosphere / ask-light
- Living presence pause during transport (`transportActive`)
- `WorldRealmCrossing`
- Continuum footing / ground seam CSS
- Existing motion primitives (`DURATION`, one-shot enters)

Environmental storytelling: Continuum focus = “worlds gather” — candidates as gathered signals on the continuum seam, not catalog rows.

---

## Scroll / pointer / input

- **Scroll:** document scroll; does not drive narrative. **Do not hijack scroll** for 095-B.
- **Pointer:** fine-pointer parallax only; touch does not get depth. Acceptable.
- **Focus:** WorldKind hover/focus drives Focus reducer — correct model; discovery must visually bind to that focus, not float as a third band.

Optional later (deferred): scroll as soft environment emphasis — only if it does not fight touch scroll or accessibility.

---

## Responsive strategy

| Viewport | Current risk | Target |
|---|---|---|
| **390** | Column stack: identity+nav+landmarks+list = tall website; footing compressed | Continuum primary; discovery inline under Continuum; Navigator compact; less RegionIdentity noise |
| **820** | Same stack with more air; still UI-led | Continuum + discovery as mid composition; nav secondary |
| **1440** | Left 26rem UI vs wide environment unused | Open trailing environment; Continuum seam reads across; discovery on footing |
| **1920** | Same + TASK-046 climate freeze | No new continuous full-frame layer; living light remains sole breath |

---

## Target World composition

### Visual target (concrete mechanisms)

| Band | Mechanism |
|---|---|
| **Background** | Existing far + mid-continuation plates; slight climate wash on Continuum focus (existing tokens) |
| **Midground** | Identity landmark plate + Continuum footing as **primary place** (larger footing mass, stronger seam) |
| **Foreground** | Thresholds silhouette quieter; no new FG UI plates |
| **Landmarks** | Continuum: name + footing + **discovery path marks** attached to order=0; Thresholds: distant, non-competing |
| **Typography** | World title stays location marker; “Explore” label demoted or removed when candidates speak; candidate titles as place names, not form results |
| **Lighting** | Existing dimensional light + Continuum focus boost on footing radial / seam (CSS), not new glow system |
| **Motion** | One-shot discovery rise from footing; TASK-092 transport unchanged; no new continuous layer |
| **Artwork** | Catalog posters only at Destination / existing Option D field — **no Idle poster grid** |
| **Transitions** | Focus Continuum → place opens; select → transport; clear anime → World Idle with Continuum still meaningful |
| **Empty space** | Trailing/right environment must remain unpaneled (no card grid) |
| **Navigator** | Visually quieter instrument (opacity/scale/position) — logic unchanged (TASK-067) |

### Target experiential loop

```
ENTER → WORLD (environment + Continuum readable as place)
  → EXPLORE (approach Continuum — focus changes light/footing)
  → DISCOVER (candidates rise from Continuum, not from ask field)
  → FOCUS (one title)
  → TRAVEL (TASK-092 environmental crossing)
  → ARRIVE (Destination in World; poster field)
  → ACT (existing watch/save/paths — Destination layout may follow later)
  → RETURN (Idle; Horizon/Continue still existing — no new persistence)
```

---

## Interaction model

1. Idle: Continuum is the obvious place to go (size + footing + cue); Navigator available but not the first read.
2. Focus Continuum (pointer/keyboard/region query): environmental acknowledgement + discovery affordance in Continuum’s spatial zone.
3. Select candidate: `arriveAnime` only (TASK-092 / TASK-094 contracts).
4. Thresholds: unchanged semantics; visually subordinate.
5. Keyboard: Continuum landmark → discovery candidates remain tabbable; focus rings preserved.
6. Reduced motion: structure + opacity; no travel.

---

## WOW moment (one primary)

**Continuum focus transforms the Idle World:** the Continuum footing/seam becomes an active gathering of destinations — curated titles rise from the landmark itself — while the environment’s light/climate answers. The user understands *“I found these by standing in the Continuum”* before any typing.

Achievable with composition + CSS + relocating existing TASK-094 candidates; no WebGL, no new API, no transport rewrite.

---

## Implementation options (ranked)

| Option | Fit | Verdict |
|---|---|---|
| **A. DOM/CSS** | Landmark mass, seam, footing, demote nav chrome, bind discovery placement | **Primary** |
| **B. Existing React composition** | Move discovery into Continuum/Kind zone; quiet RegionIdentity/Details on Continuum focus | **Primary** |
| **C. Existing motion primitives** | One-shot rise; reuse transport ceremony | **Support** |
| **D. Image sequence / richer artwork** | Only if A–C insufficient after QA | Defer |
| **E. Canvas** | Unnecessary for this wow | **Reject for 095** |
| **F. WebGL / R3F** | Architecture breach + perf risk | **Reject for 095** |

---

## Recommended architecture

**Extend, don’t replace:**
- Scene Director / Navigation Adapter / TASK-092 transport
- TASK-094 `resolveContinuumDiscoveryCandidates` + `arriveAnime` handoff
- `WorldEnvironment` / living presence / realm crossing
- WorldKind focus model
- No global world-position store; no journey state machine; no new routes; no analytics/persistence changes

**Composition ownership for 095-B:**
- Presentation of Continuum discovery moves toward Continuum landmark (Kind/primary or region-scoped slot), not a generic bottom activity rail that reads as a site footer menu.
- RegionActivities Thresholds path stays as-is.

---

## Performance constraints

- TASK-046: no second continuous full-viewport opacity layer; living light remains sole breath at ≥120rem.
- No WebGL/Canvas; no particle systems; no plate keyframes.
- Discovery remains sync catalog (no Idle MAL fetch).
- Measure Idle FPS at 390 / 820 / 1440 / 1920 after 095-B in production Chromium.

---

## Accessibility constraints

- Continuum + candidates keyboard reachable; visible focus rings (TASK-050).
- Reduced-motion branches for any new one-shot motion.
- Do not rely on hover-only discovery (keyboard/`?region=` must work — already partly true).
- Do not steal focus on Continuum focus.

---

## Explicit non-goals (TASK-095 / 095-B)

- WebGL / R3F / Canvas / particles
- Global camera or world-position state
- Scroll hijacking
- New persistence / Memory schema / Horizon interactivity (TASK-057-B / TASK-066)
- New analytics events (TASK-090 Experiment 1)
- Navigator logic redesign / chatbot (TASK-062 / TASK-067)
- Watchlist place / Profile / Destination activity-first redesign (later tasks)
- Fake anime artwork / new artwork API
- Generic glassmorphism / card grids / decorative glow without Continuum semantics
- Replacing TASK-092 transport
- Changing production configuration

**Note:** TASK-094’s “next = Destination activity-first” is **deferred**. Visual website-read on Idle is the higher-leverage Capital Phase blocker; Destination layout follows once World first inspection transforms.

---

## Minimal implementation scope (TASK-095-B)

Smallest set for a **clearly visible** first-inspection change:

1. **Idle hierarchy rebalance** — demote Navigator visual weight; promote Continuum landmark mass/footing/seam (CSS + layout).
2. **Continuum discovery relocation** — candidates render as Continuum-place affordance (spatially bound to order=0), not a Navigator-clone list in a detached rail.
3. **Focus environmental response** — strengthen existing climate/light/footing response when Continuum focused; suppress redundant RegionIdentity/Details noise during discovery.
4. **Preserve contracts** — TASK-094 selection → `arriveAnime`; Thresholds unchanged; transport unchanged; no analytics/persistence.

Optional stretch (only if 1–3 land): Continuum→Anime transport emphasis using existing crossing tokens.

---

## Risks

| Risk | Mitigation |
|---|---|
| Demoting Navigator hurts ask conversion | Keep fully functional; visual quiet only |
| Discovery still looks like a menu | Forbid `WORLD_NAVIGATOR_PATH` clone as primary Continuum chrome; design grounded path marks |
| Perf regression from more CSS blur/opacity | Reuse tokens; measure; no new continuous layer |
| Breaking TASK-054/059 landmark tests | Extend landmarks CSS; keep decorative architecture non-interactive |
| Scope creep to Destination/WebGL | Hard non-goals above |

---

## Acceptance criteria

A future operator on production Idle can report:

1. First glance: **place/environment + Continuum**, not “search page.”
2. Focusing Continuum visibly changes the World (light/footing/discovery), without opening Navigator.
3. Discovery feels attached to Continuum, not a results dropdown.
4. Selecting a candidate still runs TASK-092 transport to existing Anime Destination.
5. Navigator still works as fast-travel instrument.
6. Thresholds, Horizon non-interactivity, Memory, analytics, reduced motion, keyboard focus unchanged in contract.
7. No new continuous compositor layer; Idle FPS still within contract when measured.

---

## Recommended TASK-095-B implementation sequence

1. Contract tests first: Continuum discovery placement/ownership; no router; transport lock; Thresholds untouched; Navigator behavior untouched.
2. CSS/layout: Continuum landmark mass + Idle hierarchy (nav quieter).
3. React: bind discovery UI into Continuum spatial composition; quiet RegionIdentity/Details when Continuum discovery active.
4. Motion: one-shot discovery entrance from footing; reduced-motion branch.
5. Verify: tests → tsc → lint → build → production-browser visual QA at 390/820/1440/1920 + reduced motion; measure FPS if continuous layers touched (should not be).
6. Decision record TASK-095-B; deploy only after operator-visible pass criteria.

---

## Protected behaviour (must not break)

- TASK-092 transport lifecycle and Navigation Adapter URL ownership
- TASK-094 `arriveAnime` handoff / catalog discovery source
- TASK-057-A Memory on `arrivedAnime`; TASK-057-B Horizon non-interactive
- TASK-061 Continue; TASK-062/067 Navigator semantics
- TASK-046 compositor budget; TASK-050 focus; reduced motion
- TASK-090 no new analytics

## Implementation area (for 095-B, not this audit)

Likely: `world-kind` / `world-kind.landmarks.css` · `world-place.css` · `region-continuum-discovery` · `region-activities` · possibly `world-shell` / identity-column presentation · environment atmosphere props already derived from Focus.

## Do not undo

- Do not solve “website feel” by adding WebGL or a second navigation system.
- Do not bury Continuum discovery behind Navigator again.
- Do not invent Idle recommendation APIs or fake posters.

## Links

[[TASK-093]] · [[TASK-094]] · [[TASK-092]] · [[TASK-053]] · [[TASK-054]] · [[TASK-059]] · [[TASK-046]] · [[TASK-066]] · [[TASK-067]] · [[TASK-090]] · [[visual-language]] · [[performance-contract]]
