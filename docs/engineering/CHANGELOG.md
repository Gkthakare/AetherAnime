## 2026-08-05 — Sprint-003 · Milestone-I · Task-013

**Task:** Engineering Agent System

**Purpose:** Documentation-only agent roles and permanent workflow to reduce future token use. No application behavior changes.

### Files Changed

- `docs/engineering/agents/ARCHITECT_AGENT.md` (new)
- `docs/engineering/agents/IMPLEMENTATION_AGENT.md` (new)
- `docs/engineering/agents/QA_AGENT.md` (new)
- `docs/engineering/agents/VISUAL_QA_AGENT.md` (new)
- `docs/engineering/agents/DOCUMENTATION_AGENT.md` (new)
- `docs/engineering/agents/REFACTOR_AGENT.md` (new)
- `docs/engineering/agents/PERFORMANCE_AGENT.md` (new)
- `docs/engineering/agents/ENGINEERING_WORKFLOW.md` (new)
- `docs/engineering/CHANGELOG.md`

### Architecture Decisions

- Agents are process contracts under `docs/engineering/agents/`.
- Workflow: Architecture → Implementation → QA → Visual QA → Documentation → Git Commit.

### Performance Impact

- None (docs only).

### Breaking Changes

- None.

### Future Dependencies

- Tasks should reference the active agent + `ENGINEERING_WORKFLOW.md`.

### Verification

- Paths present under `docs/engineering/agents/`; no `apps/**` changes for this task.

---

## 2026-08-05 — Sprint-002 · Milestone-II · Task-012

**Task:** World Transition

**Purpose:** Connect Portal Settling completion to App Router navigation (`/world/{slug}`) without altering Portal phases, ceremony timing, or PortalGeometry.

### Files Changed

- `apps/web/shared/lib/navigation/world-transition.ts` (new)
- `apps/web/shared/lib/navigation/index.ts` (new)
- `apps/web/app/world/[destination]/page.tsx` (new)
- `apps/web/widgets/arrival-scene/arrival-scene.tsx`
- `apps/web/widgets/arrival-scene/arrival-scene.types.ts`
- `apps/web/widgets/portal-cta/portal-cta.types.ts`
- `docs/engineering/CHANGELOG.md`

### Architecture Decisions

- ArrivalScene owns consequence: `onComplete` → `dispatch('complete')` → `router.push(worldHref(...))`.
- Navigation helpers live outside PortalGeometry; PortalCTA phase machine unchanged.
- Guard `transitionedRef` prevents duplicate pushes.

### Performance Impact

- No new loops, polling, or ceremony timers.

### Breaking Changes

- Entering the portal now navigates off Arrival after Settling.

### Future Dependencies

- World Engine content for `/world/[destination]`; richer Navigation Engine.

### Verification

- `tsc --noEmit` · eslint · `next build` — pass

---

## 2026-08-05 — Sprint-002 · Milestone-II · Task-011

**Task:** Particle Engine

**Purpose:** Extremely low-count recycled DOM particles inside `portal-particle-field` that drift inward and absorb into seam/singularity, composing density/speed from `PORTAL_GRAVITY_INTENSITY` without modifying Gravity.

### Files Changed

- `apps/web/widgets/portal-cta/portal-particle.motion.ts` (new)
- `apps/web/widgets/portal-cta/portal-particle-field.tsx` (new)
- `apps/web/widgets/portal-cta/portal-geometry.tsx`
- `docs/engineering/CHANGELOG.md`

### Architecture Decisions

- Particles consume Gravity; Gravity does not import Particles.
- Fixed pool of 4; phase caps 1–4 (reduced 1–2). Transform + opacity only.
- Geometry host replaced empty shell with `PortalParticleField` (same slot).

### Performance Impact

- No canvas/WebGL/filters. No per-frame allocations; recycle via generation counter.
- ≤4 simultaneous motes.

### Breaking Changes

- None.

### Future Dependencies

- World Transition / navigation; optional particle tint per world variant.

### Verification

- `tsc --noEmit` · eslint · `next build` — pass

---

## 2026-08-05 — Sprint-002 · Milestone-II · Task-010

**Task:** Gravity Engine

**Purpose:** Invisible inward attraction composed into existing Portal idle/phase maps — plate bias, seam/field/singularity density, chamber perception — without particles, new loops, or architecture.

### Files Changed

- `apps/web/widgets/portal-cta/portal-cta.motion.ts`
- `apps/web/widgets/portal-cta/portal-geometry.tsx`

### Architecture Decisions

- `PORTAL_GRAVITY_INTENSITY` exported for future Particle Engine.
- Plate gravity softens on Crossing so ceremony yield remains readable.
- Reduced motion scales pull via `PORTAL_GRAVITY_REDUCED`; hierarchy preserved.

### Performance Impact

- No new continuous loops or motion nodes. Subliminal bias only.
- Transform + opacity only.

### Breaking Changes

- None.

### Future Dependencies

- Particle Engine (consumes gravity intensity), World Transition / navigation.

### Verification

- `tsc --noEmit` · eslint · `next build` — pass

---

## 2026-08-05 — Sprint-002 · Milestone-II · Task-009

**Task:** Portal Crossing Ceremony

**Purpose:** Event-driven Accepting → Crossing → Settling → Idle passage on Impossible Threshold — plates yield open, seam luminance yields, singularity deepens, field/chamber inward pull and soft exhale — without new ambient loops, engines, or geometry.

### Files Changed

- `apps/web/widgets/portal-cta/portal-cta.motion.ts`
- `apps/web/widgets/portal-cta/portal-geometry.tsx`
- `apps/web/widgets/portal-cta/portal-cta.tsx`

### Architecture Decisions

- Ceremony unlock travel = `DISTANCE.SM / 4` (Accepting/Crossing only); idle micro-travel unchanged.
- Field + chamber join opacity ceremony maps; particle host still empty.
- Crossing transition shortened to `DURATION.FAST`; Settling remains longer memory.

### Performance Impact

- No new continuous loops. Field/chamber become one-shot opacity motion nodes.
- Transform + opacity only.

### Breaking Changes

- None.

### Future Dependencies

- Gravity Engine, Particle Engine, World Transition / route navigation.

### Verification

- `tsc --noEmit` · eslint · `next build` — pass

---

## 2026-08-05 — Sprint-002 · Milestone-II · Task-008

**Task:** Portal Threshold Phase Response

**Purpose:** Event-driven Impossible Threshold layer targets keyed to `PortalPhase` (seam luminance, singularity density, hairline emphasis, plate settling) without adding ambient loops or changing Idle Motion from Task-007.

### Files Changed

- `apps/web/widgets/portal-cta/portal-cta.motion.ts`
- `apps/web/widgets/portal-cta/portal-geometry.tsx`
- `apps/web/widgets/portal-cta/portal-geometry.types.ts`
- `apps/web/widgets/portal-cta/portal-cta.tsx`

### Architecture Decisions

- Phase responses are one-shot `portalPhaseTransition*` targets; ambient loops remain idle-only via `isPortalAmbientIdle`.
- Aware maps to existing PortalPhase `inviting` (PortalCTA has no separate `aware` state).
- Crossing included for complete lifecycle coverage (yield luminance / open singularity density).
- Reduced motion: opacity phase maps for seam/hairline/singularity; plate translates frozen at rest.

### Performance Impact

- No new infinite loops. Phase changes retarget existing motion nodes only.
- Transform + opacity only.

### Breaking Changes

- `PortalGeometry` gains optional `phase?: PortalPhase`.

### Future Dependencies

- Gravity Engine, Particle Engine, Crossing Engine (geometry choreography beyond opacity/micro-translate).

### Verification

- `tsc --noEmit` · eslint · `next build` — pass

---


**Task:** Living Threshold Idle Motion

**Purpose:** Give Impossible Threshold eternal idle presence (60% Gravitational Drift / 30% Living Stone / 10% Dimensional Luminance) using at most two continuous ambient transform/opacity loops, without ceremony geometry animation, particles, gravity, or Crossing.

### Files Changed

- `apps/web/widgets/portal-cta/portal-cta.motion.ts`
- `apps/web/widgets/portal-cta/portal-geometry.tsx`
- `apps/web/widgets/portal-cta/portal-geometry.types.ts`
- `apps/web/widgets/portal-cta/portal-cta.tsx`
- `docs/engineering/CHANGELOG.md` (created)

### Architecture Decisions

- Keep animation *values* in `portal-cta.motion.ts`; `PortalGeometry` only wires definitions onto layers.
- Enforce Experience Budget Living Threshold exception: exactly two ambient loops (near plate translate, seam opacity).
- Freeze chamber, far plate, field, hairline, singularity at idle so L2/L4 event-driven motion can land later without exceeding the two-loop ceiling.
- Compose ambient periods from `DURATION.CINEMATIC` multipliers (Atmosphere-style long ambient), not magic literals or new foundation tokens.
- Pass `reduceMotion` from `PortalCTA` (`useReducedMotion`) into `PortalGeometry`; freeze ambient loops without removing PortalCTA phase machine.

### Performance Impact

- Two long-running Framer Motion compositor loops (transform + opacity only).
- No layout animation, filters, blur animation, SVG filters, canvas, WebGL, or GSAP.
- Idle ambient does not depend on React state; phase changes do not retarget idle keyframes.

### Breaking Changes

- None for public widget API. `PortalGeometry` gains optional `reduceMotion?: boolean` (default `false`).

### Future Dependencies

- Aware / Inviting luminance & singularity density (event-driven, not ambient).
- Hairline inward drift (L2) when a loop slot is free or event-driven.
- Gravity Engine, Particle Engine, Crossing geometry motion (separate tasks).

### Verification

- `tsc --noEmit` — pass
- `eslint widgets/portal-cta --max-warnings 0` — pass
- `npm run build` — pass
