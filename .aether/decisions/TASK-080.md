# TASK-080 — Navigator relevance + Destination contain field + arrival ceremony

Status: FROZEN
Area: Navigator · Destination atmosphere · Destination arrival motion

## Decision

**TASK-080 COMPLETE.** Plot-shaped asks route into the existing semantic pipeline; soft stopword-filtered lexical/synopsis ranking (fixture Solo Leveling #1) backs semantic failure. Destination environmental image uses `object-fit: contain` in a full-viewport field with softer scale/vignette (no crop-era overscan). Arrival stagger is identity-keyed (`key={anime.id}`) within ~1.2–1.6s; settled Destination stays static. RealmCrossing untouched.

## Why

Production verification: descriptive hunter asks skipped semantic routing; Option D still read as cropped cover; arrival layers were concurrent rather than sequenced.

## Protected behaviour

- No second artwork field / artwork API / slug↔query hardcode / continuous Destination breath.
- TASK-074 poster validation and `remotePatterns` unchanged.
- Home/Idle/Memory/Continue/Watchlist unchanged.
- Tests: semantic-intent/profile TASK-080 suites; atmosphere contain contracts; `anime-destination.arrival.test.ts`.

## Implementation area

`anime.semantic-intent.ts` · `anime.semantic-profile.ts` · `world-navigator.tsx` (semantic-null safety net) · `anime-arrival-atmosphere/*` · `anime-destination.motion.ts` · `anime-destination.tsx`

## Contracts

- Suite: 494 pass; tsc/lint/build 0.
- Settled FPS ≈60–62; arrival window ~18–25 at 1440 (separate).
- Evidence: `%TEMP%\aether-080-qa\`

## Do not undo

- Do not restore `object-cover` + `inset-[-28%]` as the Option D primary field.
- Do not remove plot-shaped descriptive detection or stopword lexical filter.
- Do not remove arrival identity keying.

## Links

[[TASK-075]] · [[TASK-074]] · [[TASK-068]] · [[TASK-062]] · [[visual-debt]] · [[current-state]]
