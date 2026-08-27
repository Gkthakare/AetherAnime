# TASK-073 — Destination anime-specific background design

Status: FROZEN
Area: Destination / visual composition · pre-deployment revision

## Decision

**DESIGN LOCKED — Option D (hybrid poster field + subordinate AetherAnime framing).** Destination must read as “I arrived at THIS anime’s world.” The selected anime’s own artwork becomes a large, recognizably visible environmental field; generic WorldEnvironment remains framing/depth only. TASK-060 Class A “poster as faint place light” is **insufficient** for this requirement and is visually superseded here for Destination composition only.

**All-anime artwork is NOT yet guaranteed by current code.** Catalog titles have local `CanonicalAnime.poster`. Discovered destinations intentionally ship `poster: null` (seal). MAL already exposes `main_picture` on existing endpoints, but discovery/metadata adapters deliberately omit it. Implementing all-anime support requires a follow-on **data-contract** task (extend existing MAL fields + safe `next/image` remote allowlist or CSS remote background) — **not** a new artwork API, and **not** silent `CanonicalAnime` reinterpretation inside this design task.

## Why

Production Destination keeps generic mid-plate opacity high (~0.84) while `AnimeArrivalAtmosphere` uses ~72px atmospheric blur, screen blend, and low settle opacity — poster reads as color wash, not place. Foreground poster identifies the title; the place behind it still reads as AetherAnime architecture.

## Protected behaviour

- Destination-gated only (`data-world-anime` / arrived poster path). Idle and Home unchanged.
- Reuse `AnimeArrivalAtmosphere` + `WorldEnvironment` ownership — no new compositor.
- One decoded poster bitmap for atmosphere (plus existing sharp foreground poster) — do not stack duplicate wash layers.
- Decorative: `aria-hidden`, no focus, no alt-as-content.
- Static settle preferred; one-shot arrival may remain; no continuous poster motion.
- Null poster → honest TASK-060-style environment fallback (never fake art).
- Do not implement remote posters until data-contract + `remotePatterns` (or equivalent) are explicitly decided.

## Implementation area (future)

`widgets/anime-arrival-atmosphere/*` · `widgets/world-environment/world-destination-presence.css` · possibly `next.config.ts` images · MAL adapter field lists — **after** data-contract clearance. Not this task.

## Contracts

- Visual QA: without reading the title, Destination background must evidence the selected anime when poster exists.
- Settled Destination ≈60 FPS; do not count arrival ceremony.
- Network: reuse existing metadata/discovery; no new artwork API; no Idle/Home fetches.
- Tests: extend arrival-atmosphere + destination-presence contracts; Idle geography contracts must still pass unchanged.

## Do not undo

- Do not turn Destination into Netflix/media-hero wallpaper.
- Do not restore Idle far/mid-continuation under Destination.
- Do not claim all-anime support while discovered `poster` remains null.
- Do not fabricate or generate artwork.

## Links

[[TASK-060]] · [[TASK-069]] · [[TASK-071]] · [[TASK-072]] · [[visual-language]] · [[performance-contract]] · [[visual-debt]] · [[current-state]]
