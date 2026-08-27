# Directive — Performance Task

## Purpose

Restore or protect frame rate with evidence, not intuition.

## When to use

A surface is dropping frames, a change needs a compositor budget check, or a claim about performance needs verification.

## Required context

Always: [[performance-contract]].
Usually: [[rendering]], [[TASK-046]].

## Process

1. **Measure the baseline first.** Production build (`npm run build` && `npm run start`), Chromium, at 390 / 820 / 1440 / 1920 and on the affected surface. Record median FPS, P95 frame time, dropped frames.
2. **Isolate.** Build a matrix: current, then each suspect layer disabled one at a time. Do not change anything until a variant explains the loss. Inspection is not evidence.
3. **Choose the smallest change that keeps the world alive.** Freezing or insetting an existing animated surface beats deleting the effect; deleting beats adding a new mechanism.
4. Write the contract test that locks the fix in (the gate, the media query, the inset).
5. **Re-measure** with the same method and report before/after side by side.
6. Verify no visual regression at every viewport, plus reduced motion.

## Quality gates

- baseline and after numbers from the **same** measurement method, production build
- contract targets met: ≈60 FPS idle at all four viewports, ≥55 FPS arrival
- visual regression checked at every viewport
- no `will-change` added, no blur added, no layer added
- tests, `npx tsc --noEmit`, `npm run lint`, `npm run build`

## Stop conditions

- the target cannot be met without deleting an effect a frozen decision protects
- the fix would require a new dependency or a rendering-technology change (WebGL, canvas)
- measurement is impossible in the current environment — report that instead of guessing

## Expected report

Baseline table · isolation matrix · diagnosis · change made and why it is the smallest one · after table · visual regression per viewport · reduced motion · tests / types / lint / build.

Any number in this report must come from a measurement you ran. If you did not measure it, write "not measured".
