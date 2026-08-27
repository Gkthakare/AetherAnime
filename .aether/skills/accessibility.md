# Skill — Accessibility

## Focus

Compose the focus ring locally per role: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`. This is deliberately not abstracted — the utilities apply an already-shared `--ring` token to different interaction semantics, and a shared helper would be a false abstraction ([[TASK-050]]).

Some controls are legitimately different. A text instrument may be caret- and border-only by design; that is a decision, not a gap.

Never steal focus on expand. Never trap focus outside a modal (there are no modals here).

## Order follows space

Keyboard order should match the spatial reading of the scene — poster → primary action → save → paths. If DOM order and visual order disagree, fix the DOM, not the tab index.

## Expandables

`aria-expanded` + `aria-controls` on the trigger, a labelled region as the target, `aria-live="polite"` on anything that populates asynchronously. Content that is merely collapsed should not be announced as present.

## Decorative layers

Every atmosphere, environment, and light layer is `aria-hidden="true"` and `pointer-events-none`. Decoration must never appear in the accessibility tree or intercept a click.

## Reduced motion

Treat `prefers-reduced-motion: reduce` as a first-class rendering mode: structure and content unchanged, animation and transforms removed, static treatment retained. Check it as a separate QA pass, not as an afterthought.

## Verify, don't assume

Accessibility claims come from walking the surface with a keyboard in a **production build**, viewport by viewport. Static analysis and intent do not count as verification ([[TASK-050.1]]).

## Related

[[engineering-rules]] · [[accessibility-task]] · [[TASK-050]] · [[TASK-050.1]]
