# TASK-059 — Physical crossing architecture

Status: FROZEN (implementation complete)
Area: world idle / Continuum · Thresholds

## Decision

Continuum and Thresholds remain owned by **WorldKind** (semantic + interaction). Their physicality is **CSS-only grounded footing and distant threshold silhouettes** in `world-kind.landmarks.css`, with minimal inert `aria-hidden` spans in `world-kind.tsx` when pseudo-elements alone cannot carry the silhouette. Environmental contact under/around existing region Surfaces — not new environment plates, not portals, not a second navigation system.

- **Continuum (Current / order 0):** near footing — low sill / pier contact on the ground seam; stronger ground presence, quieter than identity.
- **Thresholds (Ahead / order 1):** farther, softer broken-threshold silhouette along the same seam; smaller, more atmospheric, never a doorway beam.

No new artwork. TASK-058-E geography stays the world; Memory Horizon stays upper-trailing; WorldRealmCrossing stays the arrival ceremony only.

## Why

TASK-054 made crossings spatial by position/scale/seam, but they still read as typography on a cyan rule. Architectural L-frames were already tried and rejected as UI chrome. New midground plates would compete with TASK-058-E. Production Chromium QA (after-v3) shows a perceptible jagged footing under Continuum and a quieter upright broken silhouette under Thresholds at ~59.9 FPS with 0 new network requests.

## Protected behaviour

- Do not move Continuum/Thresholds interaction out of WorldKind.
- Do not paint crossing architecture in the upper-trailing Memory register.
- Do not place luminous architecture on the geographic far horizon band.
- Do not reintroduce equal-weight plates, L-frames-as-chrome, keyframes in landmarks CSS, or HUD (minimap/reticle/arrows).
- Decorative silhouettes: `aria-hidden`; focus/keyboard stay on existing region Surfaces.
- Static CSS only. No canvas/WebGL/particles; no full-screen continuous animation.
- Contract: `world-kind.landmarks.test.ts` (TASK-054 + TASK-059).

## Implementation area

`widgets/world-kind/world-kind.landmarks.css` · `widgets/world-kind/world-kind.tsx` (inert spans only) · `widgets/world-kind/world-kind.landmarks.test.ts`

## Contracts

Performance: static CSS → no new compositor breath (TASK-046). Idle ≈59.9 FPS at 390 / 820 / 1440 / 1920 (measured). Accessibility: no new tab stops. Network: 0. Assets: 0.

## Do not undo

- Do not redefine Current/Ahead/Continuum/Thresholds.
- Do not turn Ahead into a destination portal or Continuum into a menu.
- Do not require new WebP plates to “fix” V1 physicality.
- Do not edit `world-idle-geography.css`, Memory Horizon, WorldScene, or WorldRealmCrossing for crossing contact language.

## Links

[[TASK-053]] · [[TASK-054]] · [[TASK-055]] · [[TASK-057-B]] · [[TASK-058-E]] · [[TASK-046]] · [[visual-language]] · [[visual-debt]]
