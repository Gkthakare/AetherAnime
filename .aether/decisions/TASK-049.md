# TASK-049 — Shared identity enter motion

Status: FROZEN
Area: motion primitives

## Decision

The duplicated one-shot enter motion in `WorldIdentity` and `RegionIdentity` is consolidated into a single shared primitive at `shared/lib/motion/identity.ts`, with identical timing, easing, transform, opacity, and reduced-motion behaviour.

## Why

A repository duplication audit confirmed the two widgets had independently defined the same motion primitive. Two copies of one primitive drift: a change to one silently desynchronises the identity language between the world and its regions.

## Protected behaviour

`shared/lib/motion/identity.ts` is the only definition of the identity enter motion. Both consumers read from it. Values are byte-identical to the pre-consolidation motion — this was a consolidation, not a retune. Covered by `shared/lib/motion/identity.test.ts`.

## Implementation area

`shared/lib/motion/identity.ts` · `widgets/world-identity/` · `widgets/region-identity/`

## Contracts

Reduced motion is part of the primitive, not the caller's job.

## Do not undo

- Do not re-derive identity enter motion inside a widget.
- Do not change the shared values to solve a single caller's problem; if one caller genuinely needs different motion, that is a new primitive with a new name and a reason.

## Links

[[engineering-rules]] · [[TASK-050]] · [[animation]] · [[rendering]]
