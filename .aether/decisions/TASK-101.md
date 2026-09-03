# TASK-101 — Living Universe

Status: FROZEN
Area: Anime Destination / Universe · depth-answering environment

## Decision

**Spatial `data-universe-here` drives environmental field promotion and recession so scroll depth answers the traveller.** Alive means the place has more existence than the current content plane — not decorative animation, NPCs, or new data.

## Why

TASK-097/098 already recomposed poster crops and set `data-universe-here` via IntersectionObserver, but field opacities stayed fixed while scrolling. The destination read as a cinematic details page. Wiring existing here → existing fields closes that gap with no new state, persistence, or catalog invention. Production QA measured story/world/record/beyond field opacities shifting with here (e.g. story crop 0.78 vs others 0.16).

## Protected behaviour

- CSS under `[data-universe-here='…']` promotes matching `[data-crop]` fields and recedes others; figure softens deeper in
- TASK-098 `[data-universe-explore='story']` field boost reasserted after depth rules so Paths explore still wins
- No `sessionStorage` / living persistence / particles / WebGL / second network or transport
- Contract: `anime-destination.living-depth.test.ts`
- `journeyOrigin` / TASK-099 network / TASK-096 warp unchanged

## Implementation area

`anime-destination.universe.css` · `anime-destination.living-depth.test.ts` (uses existing `use-universe-here` + `data-universe-here` on destination)

## Contracts

Reduced motion: opacity hierarchy preserved; transitions dropped. Keyboard/pointer/touch exploration unchanged. Production Chromium FPS not re-measured this close (event-driven CSS opacity only; no continuous compositor).

## Do not undo

- Do not invent NPCs, lore, particles, or a Living Universe Engine
- Do not leave `data-universe-here` unused by the environment again
- Do not let depth recession override Paths explore story field without an explore reassertion
- Do not add journey/network/persistence to “feel alive”

## Links

[[TASK-100]] · [[TASK-099]] · [[TASK-098]] · [[TASK-097]] · [[TASK-096]] · [[visual-language]]
