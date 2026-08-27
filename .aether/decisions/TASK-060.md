# TASK-060 — Destination environmental presence

Status: FROZEN (implementation complete)
Area: Destination / arrived place environment

## Decision

Destination environmental presence is a **hybrid** owned by **WorldEnvironment**: the existing AetherAnime environment remains recognizable, while Destination-gated local atmosphere and spatial recomposition establish arrived place. Driven by existing `worldArrivalAtmosphere` + poster wash. Class A assets only. No Idle geography reopen, no per-anime plates, no RealmCrossing persistence, no Memory/crossing reuse.

V1 ships as `world-destination-presence.css` (static, `[data-world-anime]` only) plus modest arrival wash opacity lift and poster-wash mask integration.

## Why

Destination kept Idle plate weight with only a weak genre wash (~0.16) and optional poster overlay — media-panel over the world. Production Chromium AFTER shows intimate compression, stronger near haze contact, denser place light, and poster wash biased to the identity register; Idle geography / Memory / crossings remain gated off. Idle and Destination ≈59.9 FPS; only pre-existing metadata requests.

## Protected behaviour

- Do not edit TASK-058-E Idle geography plates or `world-idle-geography.css` composition.
- Do not reuse TASK-059 Continuum footing / Threshold silhouette / crossing seam.
- Do not show Memory Horizon on Destination.
- Do not merge persistent place into WorldRealmCrossing (ceremony only).
- Do not add a second continuous full-viewport breath (TASK-046).
- Decorative only: environment remains `aria-hidden` / `pointer-events-none`.
- Static Destination presence CSS — no keyframes in `world-destination-presence.css`.
- No new CanonicalAnime schema fields.
- Contract: `world-destination-presence.test.ts`.

## Implementation area

`widgets/world-environment/world-destination-presence.css` · `world-environment.tsx` · `world-environment.constants.ts` (arrival opacities) · `widgets/anime-arrival-atmosphere/anime-arrival-atmosphere.css` · `world-destination-presence.test.ts`

## Contracts

Performance: Idle ≈59.9 FPS; Destination ≈59.9 FPS settled (measured). Network: 0 new environmental requests. Assets: 0. Accessibility: decorative.

## Do not undo

- Do not turn Destination into a second Idle scene.
- Do not make Destination a giant poster wallpaper or portal chamber.
- Do not invent per-title climate fields before exhausting genre tokens + poster wash + composition.
- Do not restore Idle far/mid-continuation under Destination.

## Links

[[TASK-046]] · [[TASK-052]] · [[TASK-053]] · [[TASK-054]] · [[TASK-055]] · [[TASK-057-B]] · [[TASK-058-E]] · [[TASK-059]] · [[visual-language]] · [[visual-debt]] · [[rendering]]
