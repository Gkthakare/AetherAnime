# TASK-106 — Cinematic Rift Composition

Status: FROZEN (implementation complete; not deployed)
Area: World → Anime arrival ceremony · cinematic full-frame rift over TASK-105

## Decision

**World→Anime travel remains the TASK-104/105 one-shot cyan event-seam ceremony, recomposed for cinematic rift reading: edge-to-center trajectories, asymmetric env pull, large peripheral silhouettes (::before/::after only), hollow monumental aperture, and unmistakable canonical-poster destination beyond the rim during the peak window.** TASK-103 Destination chambers and transport lifecycle remain unchanged.

## Why

TASK-105 was structurally correct but still often read as cyan slit + dark void. Capital gap was composition (full-frame energy, destination presence, depth planes) — not a new transport or Destination redesign. Performance goal: more impact with ≤ prior compositor cost (single accretion mask; no mask-composite intersect; silhouettes via pseudo-elements, not new CrossingLayers).

## Protected behaviour

- All TASK-103…105 protections remain
- `DURATION.WARP` 2.4s; one-shot CSS; `data-warp="black-hole"`
- Hollow horizon core; reveal peak ≥0.9 in ≈35–58% window
- Silhouettes: ≤2 large forms on crossing root; disabled at ≤480px and under reduced motion
- Poster only via `worldArrivalAtmosphere.poster`
- Contracts: `world-realm-crossing.immersion.test.ts` (TASK-105 + TASK-106 blocks) + ceremony/crossing suites

## Implementation area

`world-realm-crossing.css` · `world-realm-crossing.view.tsx` (comment) · `world-realm-crossing.immersion.test.ts`

## Contracts

Accessibility: decorative `aria-hidden`; reduced motion drops travel + silhouettes. Performance (local headed Chromium RC): settled Destination ~116.5 FPS avg; A→B hop ~30.8 FPS avg (p95 ≈85ms) — slightly above TASK-105 hop ~28.5 / p95≈79. Do not claim continuous ≥55 FPS during hop.

## Do not undo

- Do not revert to opaque filled horizon or warm accretion / conic spin / oval-ring
- Do not add WebGL, particles, rAF loops, or new CrossingLayer architecture for silhouettes
- Do not reopen Destination chambers, analytics, or Experiment 1

## Links

[[TASK-105]] · [[TASK-104]] · [[TASK-103]] · [[visual-language]] · [[performance-contract]]
