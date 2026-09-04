# TASK-107 — Unified Dimensional Rupture

Status: FROZEN (implementation complete; not deployed)
Area: World → Anime arrival ceremony · final visual unity over TASK-106

## Decision

**World→Anime travel remains the TASK-104…106 one-shot cyan event-seam ceremony, now choreographed as one physical rupture: deep void first, irregular multi-band tear, distant canonical-poster world that approaches via scale (not a fade), asymmetric off-center env compression, and elongated directional silhouettes (still ≤2 pseudo-elements).** TASK-103 Destination chambers and transport lifecycle remain unchanged.

## Why

TASK-106 had the correct ingredients but they could still read as independent effects. Capital gap was perceptual unity (void → tear → distant world approaches → crossing) before Experiment 1 measurement freeze.

## Protected behaviour

- All TASK-103…106 protections remain
- `DURATION.WARP` 2.4s; one-shot CSS; `data-warp="black-hole"`
- Reveal invisible until ~34%; approaches with decreasing scale through peak
- Horizon: ≥2 offset rim bands (asymmetric tear); hollow transparent core
- Silhouettes: skew/elongation on existing ::before/::after only; off at ≤480px + reduced motion
- Env: `transform-origin` off-center on `world-environment-crossing`; mid-ceremony scaleX/Y ≥1.4
- Contracts: `world-realm-crossing.immersion.test.ts` TASK-107 block

## Implementation area

`world-realm-crossing.css` · `world-realm-crossing.view.tsx` · `world-realm-crossing.immersion.test.ts`

## Contracts

Accessibility: decorative `aria-hidden`; reduced motion drops travel + silhouettes. Performance (local headed Chromium RC): settled Destination ~115 FPS avg; A→B hop ~23.5 FPS avg (p95 ≈121ms) — below TASK-106 ~30.8/85; accepted as one-shot ceremony cost for unified depth (no WebGL/rAF). Do not claim continuous ≥55 FPS during hop.

## Do not undo

- Do not revert to simple poster fade or geometrically clean oval doorway
- Do not restore warm accretion / conic spin / oval-ring
- Do not add WebGL, particles, new CrossingLayers, or reopen Destination / Exp 1

## Links

[[TASK-106]] · [[TASK-105]] · [[TASK-104]] · [[TASK-103]] · [[visual-language]] · [[performance-contract]]
