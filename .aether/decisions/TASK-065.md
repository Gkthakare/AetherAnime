# TASK-065 — Visual coherence audit (Home → Idle → Destination)

Status: FROZEN
Area: visual language · Home · World Idle · Destination

## Decision

After production Chromium review at 390×844 / 820×1180 / 1440×900 / 1920×1080, AetherAnime reads as **one world that changes state**, not three independently tuned scenes. Shared grammar (WorldEnvironment material, dark indigo climate, cyan as accent, mist depth, instrument UI) holds across Home → Idle → Destination while protected surface distinctions remain intact. **No production change.**

## Why

Audit-first matrix + live screenshots + probes showed continuity without collapsing roles: Home is a quieter threshold (Idle geography / Horizon / Continue / Kind absent; portal present); Idle is a place (near→mid→far geography, crossings, living light, residual Memory, Navigator instrument); Destination is an arrived place (far/mid-continuation gated off, living off, identity+poster dominant, Horizon hidden, Continue suppressed). TASK-064 portrait bands improve Idle depth without corridor / fake-hero failure. No CSS value or composition knob was identified as a coherence bottleneck worth reopening frozen surfaces.

## Protected behaviour

- Do not treat surface *difference* as a defect — Home / Idle / Destination purposes remain distinct ([[TASK-052]] · [[TASK-053]] · [[TASK-060]]).
- Do not manufacture visual changes solely to justify a task number.
- Existing deferred debt (portrait mid plate artwork; Class C destination plates; still-frame opacity of TASK-055 motion) stays debt, not new work orders from this audit.
- Destination may retain faintly receded region chrome after arrival; it must not return to Idle geography weight or first-glance Continuum/Thresholds competition.

## Implementation area

None (audit only). Evidence: `%TEMP%/aether-065-qa/shots/` (screenshots, `report.json`, `fps-capped.json`).

## Contracts

- Unit suite 463 pass; `tsc --noEmit` 0; ESLint 0; `next build` 0.
- Production Chromium FPS (headless + `--disable-gpu`, rAF sample ≈1.2s): Home / Idle empty / Idle Memory+Continue / Destination ≈60–61 at all four viewports.
- Network: Home & Idle = 0 `/api/*`; Destination = existing `/api/anime-metadata/<slug>` only.
- Reduced motion Idle: living-light `animationName: none`; far geography opacity preserved.

## Do not undo

- Do not reopen TASK-064 portrait bands to force desktop parity.
- Do not add Geography / Memory UI / Continue chrome / crossings / continuous breath to “unify” surfaces.
- Do not redesign Navigator or Destination to chase visual similarity.

## Links

[[visual-language]] · [[TASK-052]] · [[TASK-053]] · [[TASK-055]] · [[TASK-058-E]] · [[TASK-059]] · [[TASK-060]] · [[TASK-064]] · [[visual-debt]] · [[current-state]] · [[performance-contract]]
