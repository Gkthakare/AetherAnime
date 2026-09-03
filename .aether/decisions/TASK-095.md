# TASK-095 — Capital Experience: Idle as a place

Status: FROZEN (implementation complete)
Area: World Idle · Continuum landmark · discovery presentation · Navigator hierarchy

## Decision

**Idle now answers "where am I?" before "what should I type."** Continuum is the primary spatial place: catalog discovery rises from its footing as grounded title-signals, Navigator follows the landmark as a quieter instrument, and Continuum focus opens existing ask-light and footing/seam rather than a Navigator result list. TASK-092 transport and TASK-094 `arriveAnime` selection are unchanged.

## Why

[[TASK-095-A]] found the World still read as a website because the identity/ask column outranked geography, and Continuum discovery reused Navigator path chrome in a detached rail. TASK-094 made Continuum functionally discoverable; this task inverts the **visual hierarchy** so place outranks interface.

## Experience model

```
ENTER → WORLD (quiet location marker + Continuum)
  → APPROACH (focus Continuum → light + footing open)
  → DISCOVER (titles rise from the Continuum seam)
  → TRAVEL (TASK-092 DEPART→TRANSIT→URL→ARRIVE)
  → ARRIVE / ACT / RETURN (existing Destination, Memory, Continue)
```

## Protected behaviour

- Selection is `arriveAnime(anime)` only — `widgets/region-activities/region-continuum-discovery.tsx`
- Continuum discovery mounts inside WorldKind order=0, not the RegionActivities rail
- Landmark blur uses `relatedTarget` containment so candidates stay reachable
- TASK-046: living light remains the only continuous breath; Continuum focus reuses `world-environment-ask`
- TASK-050 focus-visible rings composed locally on Continuum and candidates
- Contract tests: `world-kind.capital-experience.test.ts`, `region-continuum-discovery.test.ts`

## Implementation area

`world-scene.tsx` (idle place order) · `world-kind.tsx` + `world-kind.landmarks.css` · `world-place.css` · `region-continuum-discovery.tsx` · `world-living-presence.css`

## Contracts

- Keyboard: location marker → Continuum → discovery titles → Thresholds → Navigator
- Reduced motion: one-shot opacity; no travel on discovery enter
- 390 / 820 / 1440 / 1920: Continuum remains primary; Navigator compact/secondary
- FPS: not measured this task (no new continuous compositor)

## Do not undo

- Do not restore `WORLD_NAVIGATOR_PATH` as Continuum discovery chrome
- Do not put Navigator above Continuum on Idle
- Do not add WebGL/Canvas/R3F, a second transport, or Idle MAL fetching
- Do not make Memory Horizon interactive or add analytics events

## Known limitations

- Destination identity-column presentation superseded by [[TASK-096]]
- Horizon return signal remains subtle (TASK-057-B non-interactive)
- Idle FPS not re-measured in production Chromium this task

## Links

[[TASK-095-A]] · [[TASK-094]] · [[TASK-092]] · [[TASK-053]] · [[TASK-054]] · [[TASK-046]] · [[visual-language]]
