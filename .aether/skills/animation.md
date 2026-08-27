# Skill — Animation

## Choose the mechanism deliberately

| Need | Mechanism |
|---|---|
| ambient, always-on presence | CSS `@keyframes`, gated by a data attribute |
| entrance / state transition | framer-motion variants + shared transition presets |
| pointer-driven depth | CSS custom properties (`--depth-x/y`) + `transform`, fine pointer only |
| sequenced ceremony | an explicit phase reducer, not chained timeouts |

Ambient loops in JS are a mistake — they keep the main thread awake for something the compositor can do alone.

## Animate cheap properties only

`opacity` and `transform`. Anything else on a large surface is a repaint. Size the *box* as carefully as the property: a 19.2s opacity loop is free on an inset core and expensive across a 2 Mpx frame. When a loop costs too much at a large viewport, **shrink the animated box** before deleting the effect ([[TASK-046]]).

## Presence must be irregular

A sine breath reads as a pulsing UI element. Life reads as irregular: five uneven keyframe stops at uneven times, long period (≈20–32s), low amplitude, sub-2% translate. The user should never be able to predict or watch it.

Reuse an existing animated layer's keyframes rather than adding a layer. Replacing the curve on a layer that already animates costs nothing; adding a second animated layer costs a compositor surface.

## Gate every rule

Scope ambient CSS to the surface that owns it using the scene's data attributes (`:not([data-world-anime])`, `[data-living='true']`, a media query). An ungated rule will show up on a surface you did not test.

## Reduced motion is a branch, not a switch

Under `prefers-reduced-motion: reduce`: keep structure, keep content, keep static treatment; drop animation and transforms. `animation: none` and `transform: none` on exactly the rules you added. An animation shipped without this branch is unfinished.

## Compositor hints

Do not add `will-change`. The one sanctioned hint already exists on the dimensional light layer. `will-change` on a plate or container promotes a large surface permanently and usually makes things worse.

## Related

[[performance]] · [[cinematic-ui]] · [[rendering]] · [[performance-contract]]
