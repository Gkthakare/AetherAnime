# World Engine

> Canonical design specification for the permanent World Engine — what exists after the Portal ceremony completes.
>
> **Status:** Design Canonical  
> **Classification:** Experience Design · Engine Architecture  
> **Applies to:** Web today; Desktop, Mobile, VR, and future clients tomorrow  
> **Related:** `docs/design/PORTAL_ENGINE.md` · `docs/design/PORTAL_INVITATION.md` · `docs/design/EXPERIENCE_BUDGET.md` · `docs/engineering/agents/ENGINEERING_WORKFLOW.md`

This document is the permanent source of truth for the **World Engine**.

It contains **no implementation code**. It defines ownership, lifecycle, shell, state, composition, boundaries, and future compatibility only.

Implementation must follow this specification and remain inside the Experience Budget. If implementation and this document disagree, resolve the disagreement before shipping.

---

# Design Goal

The World Engine creates **one continuity**:

> I crossed the threshold.  
> …and the world held me.

The World Engine is **not**:

- the Portal
- Arrival choreography
- a marketing landing page after navigate
- a second portal culture

The World Engine **is**:

the reusable system that owns **presence after entry** — identity of the destination, the shell the user lands in, and the composition of what may live there.

---

# Relationship to Existing Canon

| Document | Role |
| --- | --- |
| `PORTAL_ENGINE.md` | Threshold ceremony; emits completion; does not own world content |
| `PORTAL_INVITATION.md` | `Enter {destination}`; ceremony separable from consequence |
| `EXPERIENCE_BUDGET.md` | Hard ceilings for motion, light, attention, performance |
| `WORLD_ENGINE.md` (this document) | Post-ceremony presence: shell, state, composition, variants |

Portal defines *how the user commits*.  
World defines *where the user belongs afterward*.  
Budget defines *what neither may exceed*.

---

# 1. Purpose

## Why the World Engine exists

AetherAnime is an Anime Operating System. Crossing a portal without a world is an unfinished sentence.

The World Engine exists so every destination inherits:

- One entry continuity after Settling.
- One ownership model for presence (not ad-hoc pages inventing identity).
- Room for anime worlds, guilds, companions, and multiplayer without forking Arrival.

## What “after the Portal” means

Portal Settling completes. Consequence navigates (or hands off). **World Engine begins.**

The emotional memory of Crossing remains; the World Engine does not re-perform Portal ceremony.

---

# 2. World Ownership

| Concern | Owner |
| --- | --- |
| Portal phases, geometry, gravity, particles, seal interaction | **Portal Engine** |
| Arrival composition (Hero, Atmosphere, Portal orchestration) | **ArrivalScene** (Experience Director) |
| Route resolution / hand-off after Settling | **Navigation** (helpers today; Navigation Engine later) |
| Destination identity, entry shell, in-world composition & state | **World Engine** |
| Theme / Motion / Graphics / Surface foundations | **Shared foundations** (consumed, not forked) |

## Ownership laws

1. **World Engine owns post-entry presence.** It does not own Portal behavior.
2. **Portal Engine never imports World content modules** to decide ceremony.
3. **ArrivalScene does not become the World.** It may trigger transition; it does not render anime/guild/companion interiors.
4. **Navigation carries the user; World receives them.** Navigation does not author world identity.
5. **One destination variable.** Worlds differ by identity + climate + contents — not by inventing a new enter verb.

---

# 3. Engine Boundaries

```
ArrivalScene (Experience Director)
  → Portal Engine (ceremony performer)
  → completion
  → Navigation (route / hand-off)
  → World Engine (presence owner)
       → World Shell
       → World composition (zones / widgets under World)
       → Foundations (Theme · Graphics · Motion · Surface)
```

## World Engine may

- Define destination metadata (id, display name, slug, kind, climate intent).
- Own the World Shell layout and in-world scene director.
- Own world-local phase / presence state (distinct from PortalPhase / ArrivalPhase).
- Compose world zones and feature widgets under Experience Budget.
- Tint Soft Aether climate within budget (never a second visual OS).

## World Engine must not

- Own or redefine PortalPhase, PortalGeometry, Gravity, or Particle systems.
- Schedule Accepting → Crossing → Settling.
- Replace `Enter` with another verb.
- Reach sideways into ArrivalScene performers to restyle them after leave.
- Exceed Experience Budget ceilings to “feel more like a world.”

## Portal Engine must not

- Render world interiors, guild rosters, companion chat, or multiplayer sessions.
- Own `/world/[destination]` content beyond emitting completion intent.
- Fork destination-specific ceremony machines.

---

# 4. Relationship with ArrivalScene and Portal Engine

## ArrivalScene

- Orchestrates Arrival only.
- On Portal `onComplete` (after Settling), may dispatch scene `complete` and invoke Navigation.
- Once navigation commits, Arrival is no longer the active experience director for that journey.

## Portal Engine

- Remains the threshold everywhere `Enter {destination}` appears (Arrival, future in-world portals, guild/companion thresholds).
- Consumes destination + completion intent.
- Does not own what loads after navigate.

## Hand-off contract

| Beat | Owner |
| --- | --- |
| Idle → … → Settling on Arrival | Arrival + Portal |
| Completion event | Portal emits; Arrival observes |
| Route change | Navigation |
| First paint of destination | World Shell (World Engine) |
| Ongoing presence | World Engine |

Ceremony and consequence stay separable forever (`PORTAL_ENGINE` / `PORTAL_INVITATION`).

---

# 5. World Lifecycle

World lifecycle is **not** PortalPhase. Do not overload Portal names.

```
Pending Entry
  ↓
Receiving   (shell mounts; destination resolved)
  ↓
Present     (world at rest; user belongs)
  ↓
Engaged     (user acts inside the world)
  ↓
Yielding    (optional: leave, switch world, or re-enter a portal)
  ↓
Released    (shell teardown / hand-off complete)
```

| Phase | Meaning |
| --- | --- |
| **Pending Entry** | Navigation in flight; World not yet authoritative |
| **Receiving** | Shell mounts; identity asserted; Soft Aether climate applied |
| **Present** | Default in-world rest — curiosity without portal insistence |
| **Engaged** | Features active (browse, social, companion, play) within budget |
| **Yielding** | User leaves or opens another threshold; world does not fight exit |
| **Released** | Resources released; no zombie world state on Arrival |

### Rules

- Receiving must not replay Portal Crossing spectacle as a second show.
- Present may be quiet — stillness is allowed.
- Engaged content obeys Budget (attention, motion, light).
- A new Portal inside a world is still Portal Engine — World only hosts it.

---

# 6. World Shell

The **World Shell** is the first composed surface after entry.

## Responsibilities

- Assert destination identity (name readable; brand hierarchy respected).
- Provide a stable layout region for world composition.
- Apply Soft Aether climate intent for this destination.
- Remain host-agnostic (web route today; desktop/VR shells later).

## Non-responsibilities

- Portal ceremony playback
- Global app chrome unrelated to the destination
- Owning Navigation implementation details

## Shell principles

1. **Earned calm** — entry should feel like afterglow of Settling, not a new trailer.
2. **One composition** — first viewport is a world presence, not a dashboard dump.
3. **ExperienceLayout (or successor shell) may wrap** — World Shell fills the experience stage; it does not fork a parallel layout OS.
4. **Placeholder content is temporary** — empty shells are architecture debt to clear, not a product aesthetic.

---

# 7. World State

World state is destination-scoped presence data. It is not Portal local UI state.

## Minimum state concepts

| Concept | Intent |
| --- | --- |
| `destinationId` / slug | Stable identity key |
| `kind` | `anime` · `platform` · `guild` · `companion` · `dungeon` · future |
| `displayName` | Human label (aligned with `Enter {destination}`) |
| `lifecycle` | World lifecycle phase above |
| `climate` | Soft Aether tint intent (token-level, not a new palette system) |
| `capabilities` | Feature flags for what this world may compose (social, companion, play, …) |

## Rules

- State survives within the world session; it does not rewrite ArrivalPhase.
- Reduced motion and a11y preferences remain platform-global; World reads them, does not invent conflicting modes.
- Multiplayer / companion presence extend state later — they do not replace `kind` + `lifecycle`.

---

# 8. World Composition

```
World Shell
  ├── Identity region (destination signal)
  ├── Presence region (atmosphere / climate of this world)
  ├── Primary activity region (kind-specific)
  └── Optional thresholds (Portal Engine instances for deeper entry)
```

## Composition laws

1. **Scene orchestrates; widgets perform** — same law as Arrival; World Scene Director owns world-local phase.
2. **No sideways restyle** — world widgets subscribe to world lifecycle / props; they do not patch PortalCTA internals.
3. **Portals inside worlds** are Portal Engine performers with World-provided destination + completion.
4. **Budget applies per viewport** — world density is not an excuse for HUD chrome inflation.

## Kind-shaped primary activity (future)

| Kind | Primary activity region tends toward |
| --- | --- |
| Anime world | Title presence, entry into watch/lore/space |
| Guild | Belonging / territory |
| Companion | Relationship presence |
| Dungeon | Challenge context |
| Platform | OS home continuity |

Kinds change contents, not engine philosophy.

---

# 9. World Responsibilities (summary)

**World Engine is responsible for:**

- Destination identity and metadata
- World Shell and in-world scene direction
- World lifecycle and state
- Composition slots for kind-specific features
- Climate intent within Soft Aether
- Hosting future in-world portals without owning their ceremony

**World Engine is not responsible for:**

- Portal emotional lifecycle or Impossible Threshold identity
- Arrival Hero / Atmosphere choreography
- Low-level routing primitives (Navigation owns hand-off)
- Global auth, payments, or infra platforms (consume; do not absorb)

---

# 10. Future Compatibility

## Anime Worlds

Each title is a `kind: anime` destination. Accent climate may shift; Enter verb and Portal Engine stay. World Shell hosts title presence and deeper entry portals.

## Guilds

`kind: guild` — social territory. Crest-like restraint; no badge clutter as identity. Portal: `Enter {Guild}`. World owns belonging surfaces after entry.

## AI Companion

`kind: companion` — relationship threshold. Portal may settle into companion presence rather than a generic shell. World owns presence continuity; chat/systems are features under the shell, not a replacement OS.

## Multiplayer

Multiplayer is a **capability** on a world (often guild or anime space), not a separate engine that replaces World. Session membership extends World state; spectacle remains Budget-bound. Portal is still how you enter the shared place.

## Dungeons / challenges

`kind: dungeon` — slightly more charged climate still inside light-gathering rules. Difficulty is narrative context, not alert chrome.

## Cross-client

Web route `/world/[destination]` is the first host. Desktop and VR consume the same World ownership model with different render adapters — same lifecycle, same boundaries.

---

# 11. Experience Budget

World Engine inherits `EXPERIENCE_BUDGET.md` in full.

- No particle-heavy or canvas FX as default world wallpaper without explicit budget amendment.
- Attention hierarchy still applies: one primary actor per moment.
- Reduced motion preserves world lifecycle meaning; it may quiet climate motion.

---

# 12. Non Goals

- Redesigning Portal Engine, ArrivalScene, Hero, or Atmosphere
- Merging PortalPhase with World lifecycle
- Building full anime/guild/companion product surfaces in the architecture task
- Inventing a second design-token system per world
- Treating World Transition routing helpers as the World Engine itself

---

# 13. Implementation Contract (for later tasks)

Documentation-only until an Implementation task authorizes code.

**Likely future surfaces (informative, not a build order):**

- World metadata module (destination registry)
- World Shell widget + World Scene director
- Replacement of placeholder `/world/[destination]` body with Shell composition
- Optional Navigation Engine promotion of today’s `worldHref` helpers

**Must not change without explicit task:**

- Portal ceremony timing / phases
- PortalGeometry ownership
- Arrival orchestration contract names

---

# 14. Immutable Principles

1. **World begins after Portal completes.**
2. **World never owns Portal behavior.**
3. **Ceremony and consequence stay separable.**
4. **One Enter language; many destinations.**
5. **Shell is presence, not a second trailer.**
6. **Kinds extend composition; they do not fork engines.**
7. **Experience Budget outranks local world taste.**
8. **Scene orchestrates; widgets perform — inside worlds too.**

---

# Approval

| Field | Value |
| --- | --- |
| Document | `WORLD_ENGINE.md` |
| Stage | Architecture Review (Sprint-003 · Milestone-I · Task-001) |
| Implementation | Must not begin until this document is accepted as governing for World Engine work |
