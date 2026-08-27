# TASK-050.1 — Production keyboard verification

Status: FROZEN
Area: accessibility

## Decision

Production Chromium keyboard focus was verified against the existing focus-visible system across the surface matrix and **passed**. No styling redesign, no shared token, and no application code changes were made. Verification is the deliverable.

## Why

[[TASK-050]] concluded that no abstraction was justified, which is only a safe conclusion if the un-abstracted system actually works in a real browser. Static reasoning about focus is not evidence.

## Protected behaviour

Verified in a production build at 390×844, 820×1180, 1440×900, and 1920×1080 across Home and Destination:

- keyboard focus works
- focus is visible on every required control
- focus order matches the spatial order
- focus is not stolen or trapped
- the Navigator input is caret/border-only **by design**, not a gap

## Implementation area

None — no code changed. Re-verification uses `npm run build` + `npm run start`.

## Contracts

Accessibility claims about this system must be re-verified in a production browser after any change to focus styling, DOM order, or control composition.

## Do not undo

- Do not reorder DOM in a way that breaks the spatial keyboard order.
- Do not add autofocus or focus-stealing behaviour on expand.
- Do not "fix" the Navigator input's focus treatment; it is intentional.
- Do not claim accessibility conformance from static inspection.

## Links

[[TASK-050]] · [[accessibility]] · [[accessibility-task]] · [[engineering-rules]]
