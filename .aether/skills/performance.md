# Skill — Performance

## Measure, isolate, then change

The only reliable method:

1. Baseline in a production build, per viewport, per surface. Median FPS, P95 frame time, dropped frames.
2. Isolation matrix — disable one suspect layer at a time and re-measure. The variant that recovers the frames is the cause.
3. Change the cause, not the symptom.
4. Re-measure with the identical method.

Reading CSS and guessing which layer is expensive is not diagnosis. It has been wrong before.

## Know what actually costs

- **Animated area is the cost**, not the number of animations. One opacity loop over a full 1920×1080 frame is far more expensive than the same loop on an inset box. Shrinking the box preserves the effect and recovers the frames.
- **Two full-viewport opacity loops stacked over an image stack** is the known failure mode at 1920 ([[TASK-046]]).
- **Static plates are cheap.** Large artwork sitting still costs nothing per frame; the same artwork animated costs everything.
- **Blur is a measured cost**, never a casual choice.
- **`will-change` is not free.** It promotes a layer permanently. Do not add it.

## Prefer freezing to deleting

When a surface exceeds budget, the ordered options are: shrink the animated box → gate the animation off that surface/viewport → freeze one of several competing loops → remove the effect. Reach for removal last; the world should stay alive.

## Production or it did not happen

Dev-server measurements are meaningless here. Build, serve, measure in production Chromium. Report "not measured" rather than a plausible number — a fabricated FPS figure is worse than an absent one.

## Watch the request budget too

Performance includes network. Arrival loads metadata only; opening a path adds at most one request, and only where documented. No prefetch, no polling.

## Related

[[performance-contract]] · [[animation]] · [[rendering]] · [[performance-task]] · [[TASK-046]]
