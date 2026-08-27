# TASK-050 — Focus system: no abstraction

Status: FROZEN
Area: accessibility / styling conventions

## Decision

**No shared focus-ring abstraction.** The repeated `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background` utilities stay composed locally at each control.

## Why

The audit asked whether the repeated strings were one design primitive. They are not: they apply an **already-shared** `--ring` token to different interaction roles. The token is the abstraction; the utility string is just its local application. Extracting a `FOCUS_RING` helper would add indirection, imply a uniformity that does not exist, and make legitimately different controls harder to vary.

This is the counterpart to [[TASK-049]]: that one *was* a genuine duplicated primitive and was consolidated. Same audit method, opposite and correct conclusion.

## Protected behaviour

Local composition of the focus-visible recipe per control, over the shared `--ring` token. `world-kind.landmarks.test.ts` asserts the recipe survives on the region controls.

## Implementation area

Wherever interactive controls are defined — `widgets/**`, and the ring token in the theme layer.

## Contracts

Accessibility: every interactive control has a visible focus indicator. Some controls are intentionally different — the Navigator input is caret/border-only by design.

## Do not undo

- Do not introduce `FOCUS_RING`, `focusRing()`, or an equivalent shared helper.
- Do not treat repeated utility strings as duplication in future audits without first checking whether they serve different roles.
- Do not "unify" a control whose focus treatment is deliberately different.

## Links

[[engineering-rules]] · [[accessibility]] · [[TASK-049]] · [[TASK-050.1]]
