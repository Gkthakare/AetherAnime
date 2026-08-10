## 2026-08-10 — Sprint-003 · Milestone-I · Task-014

**Task:** Unit Test Foundation

**Purpose:** The web app shipped with no test runner (the Husky `pre-commit` hook already called `npm test`, which did not exist) and therefore 0% coverage. Adds Vitest plus unit tests for the least-covered modules — the whole Theme / Graphics / Motion foundation, Portal Gravity and Particle Engines, ceremony lifecycle, and the Director. No application behavior changes.

### Files Changed

- `apps/web/vitest.config.ts` (new)
- `apps/web/vitest.setup.ts` (new)
- `apps/web/lib/utils.test.ts` (new)
- `apps/web/shared/config/theme/theme.test.ts` (new)
- `apps/web/shared/lib/graphics/graphics.test.ts` (new)
- `apps/web/shared/lib/motion/motion.test.ts` (new)
- `apps/web/shared/lib/navigation/world-transition.test.ts` (new)
- `apps/web/shared/ui/surface/surface.test.tsx` (new)
- `apps/web/shared/ui/surface/surface.variants.test.ts` (new)
- `apps/web/widgets/arrival-scene/arrival-scene.motion.test.ts` (new)
- `apps/web/widgets/arrival-scene/arrival-scene.test.tsx` (new)
- `apps/web/widgets/atmosphere-layer/atmosphere-layer.motion.test.ts` (new)
- `apps/web/widgets/experience-layout/experience-layout.test.tsx` (new)
- `apps/web/widgets/hero/hero.motion.test.ts` (new)
- `apps/web/widgets/hero/hero.test.tsx` (new)
- `apps/web/widgets/portal-cta/portal-cta.motion.test.ts` (new)
- `apps/web/widgets/portal-cta/portal-cta.test.tsx` (new)
- `apps/web/widgets/portal-cta/portal-cta.reduced-motion.test.tsx` (new)
- `apps/web/widgets/portal-cta/portal-geometry.constants.test.ts` (new)
- `apps/web/widgets/portal-cta/portal-particle.motion.test.ts` (new)
- `apps/web/package.json`
- `docs/engineering/CHANGELOG.md`

### Architecture Decisions

- Tests are colocated with their module (`x.ts` → `x.test.ts`), matching the existing `x.motion.ts` / `x.types.ts` colocation.
- Default environment is `node`; component tests opt into jsdom per file via a `@vitest-environment` docblock, so foundation tests stay DOM-free.
- Tests assert canon invariants (composition from foundation tokens, lifecycle order, ambient-loop count, Experience Budget, reduced-motion hierarchy) rather than snapshotting values, so retuning a token does not break the suite.
- Reduced motion lives in its own test file because Framer Motion reads the media query once per module registry.
- `vitest.setup.ts` stubs `matchMedia` (absent in jsdom) reporting full motion.

### Performance Impact

- None at runtime; test-only dependencies.

### Breaking Changes

- None. Node ≥ 20.19 is now required locally (Vitest 4 config loading needs `require(esm)`); recorded in `engines`.

### Future Dependencies

- Portal / Arrival choreography changes should extend the phase-map tests rather than add new snapshots.
- Uncovered by design for now: `app/**` route entries, `shared/providers/**`, and the vendored `components/ui/button.tsx`.

### Verification

- `npm run test:coverage` — 18 files, 204 tests passing; 91% statements / 90% branches over `app`, `components`, `lib`, `shared`, `widgets`.
- `npx tsc --noEmit`, `npm run lint`, `npx prettier --check` clean.

---

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
