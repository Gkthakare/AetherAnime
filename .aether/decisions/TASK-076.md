# TASK-076 — V1 visual / product acceptance audit

Status: FROZEN
Area: Home / Idle / Destination acceptance after TASK-075

## Decision

**TASK-076 ACCEPTED WITH DEFERRED POLISH.** Production Chromium evidence confirms Home → Idle → Destination still reads as threshold → travelling world → arrived anime place. TASK-075 Option D artwork is present, data-driven, and anime-differentiated without becoming a poster wall or streaming dashboard. V1 freeze ([[TASK-069]]) still holds. Remaining items are non-blocking polish already deferred or poster-dependent field strength — not frozen-boundary breaks.

## Why

Audit-only verification after Option D ship: 483 tests; tsc/lint/build 0; settled FPS ≈60–62 across four viewports; screenshots at `%TEMP%\aether-076-qa\shots\`. Catalog posters differ; discovered-40748 uses validated MAL CDN; forced `poster: null` yields seal + no atmosphere field.

## Protected behaviour

- Do not treat arrival-window ~15 FPS as settled regression ([[TASK-068]]).
- Do not reopen Option D / poster trust for polish variance.
- Horizon remains Idle-gated (`opacity:0` / `visibility:hidden` under `data-world-anime`).
- Artwork stays on `CanonicalAnime.poster` only; no `/api/*artwork*`.

## Implementation area

Evidence only: `%TEMP%\aether-076-qa\` (report.json, shots, probe-extra.json). No production source change.

## Contracts

Settled Home / Idle / Idle+Memory+Continue / Destination ≈60 FPS. Arrival window measured separately (~15 FPS).

## Do not undo

- Do not “fix” deferred Class C / portrait mid-plate as acceptance blockers.
- Do not broaden `remotePatterns` or add artwork APIs from audit findings.

## Links

[[TASK-075]] · [[TASK-074]] · [[TASK-069]] · [[TASK-068]] · [[visual-debt]] · [[current-state]]
