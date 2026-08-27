# TASK-075 — Destination Option D environmental artwork

Status: FROZEN
Area: Destination / anime-specific environmental presence

## Decision

**Option D implemented.** When `CanonicalAnime.poster` is non-null, Destination paints a recognizable anime environmental field via `AnimeArrivalAtmosphere` (soft `BLUR_RADIUS.lg`, settle ≈0.82, no screen-blend wash) and subordinates generic WorldEnvironment mid/near plates through `data-anime-artwork="present"`. Null poster keeps TASK-060 fallback (no field). Same `poster` channel for catalog local paths and TASK-074 MAL CDN URLs — no second artwork field.

## Why

TASK-073 locked Option D; TASK-074 unlocked all-anime artwork. Prior Destination still read as generic architecture with a faint poster wash. Visual supersession of TASK-060 Class A wash intensity for Destination composition only.

## Protected behaviour

- Destination-gated only; Idle/Home unchanged.
- One atmosphere `Image` + existing FG poster; decorative `aria-hidden`.
- Static settled field; one-shot arrival ceremony retained; no continuous breath.
- Null → no fake art.
- Do not restore Idle far/mid-continuation under Destination.

## Implementation area

`anime-arrival-atmosphere.css` · `.view.tsx` · `.motion.ts` · `world-destination-presence.css` · `world-environment.tsx` (`data-anime-artwork`) · Option D contract tests

## Contracts

- Settled Destination ≈60 FPS (measure after ship).
- Tests: Option D suite + updated wash contracts; Idle geography untouched.
- Network: no new APIs; Home/Idle no artwork fetch.

## Do not undo

- Do not reintroduce atmospheric/screen wash as the primary field.
- Do not add artworkUrl / second compositor / Idle geography changes.

## Links

[[TASK-073]] · [[TASK-074]] · [[TASK-060]] · [[visual-language]] · [[performance-contract]] · [[visual-debt]] · [[current-state]]
