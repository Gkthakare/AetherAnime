# Visual Language

Durable design rules for AetherAnime. These are constraints, not suggestions. They were established across TASK-052 → TASK-055 and apply to all future visual work.

## First principle

AetherAnime should feel like **entering an anime world**, not like browsing an anime catalog. If a change makes the screen read as an interface first and a place second, the change is wrong regardless of how polished it looks.

## Environment is the primary surface

The environment stack is the protagonist. UI is *embedded in* the world, not placed on top of it. Text and controls sit inside the scene's light, depth, and atmosphere; they do not float on plates above it.

When something needs to be legible, prefer local, motivated treatment — a small identity veil, a ground seam, an aerial gradient — over a global panel or scrim.

## Hierarchy

```
environment  →  place  →  destination  →  interaction  →  supporting metadata
```

Read it as a budget. The environment gets the most visual weight; supporting metadata gets the least. A change that promotes metadata above interaction, or interaction above the destination, breaks the hierarchy even if each element looks fine in isolation.

Consequences already frozen: on the world idle surface the world title is a quiet **location marker**, not a hero headline; the Navigator is a **world instrument**, not a centered website search field; region crossings are **places along a path**, not equal-weight UI plates.

## Avoid

- generic SaaS UI, dashboard aesthetics
- card-heavy layouts; lists of plates standing in for space
- excessive glassmorphism, panels-on-panels
- generic neon cyberpunk
- HUD overload, reticles, minimaps, coordinate readouts
- decorative animation without spatial purpose
- excessive glow, particle spam
- duplicated atmosphere systems
- centered landing-page composition on a surface that is supposed to be a place

## Motion

Motion exists to communicate one of four things:

- **depth** — parallax, aerial separation, plate ordering
- **presence** — the world is alive while you stand still
- **transition** — a crossing actually happened
- **attention** — something noticed you (focus, hover, arrival)

Motion that communicates none of these does not ship. "Because animation is possible" is not a reason. Presence motion in particular must be slow, irregular, and low-amplitude — perceived subconsciously, not watched.

Every motion has a reduced-motion answer: keep the structure and the content, drop the travel. Opacity-only, or nothing.

## Colour and light

Cyan is the **interaction/accent language** — attention, the portal, the instrument, the crossing. It is not a universal glow and it is not the world's ambient colour. The world is lit by its own dimensional light; interactions borrow cyan sparingly.

## Reuse over parallel systems

A visual change must first try the existing infrastructure: `WorldEnvironment` layers, `WorldClimate`, living presence, the depth stack, existing climate tokens, existing motion primitives. Introducing a second system that does what one of these already does is a defect. Home reuses `WorldEnvironment` for exactly this reason ([[TASK-052]]).

Concretely: no new full-viewport animated layer, no second atmosphere pipeline, no parallel motion primitive, no widget-local reimplementation of a shared token.

## Surfaces differ on purpose

`Home`, `World idle`, `Destination`, and `Arrival` intentionally look and animate differently. New CSS must be **gated** to the surface it belongs to (the scene exposes `data-world-anime`, `data-world-lifecycle`, `data-world-presence`, `data-world-focus`, `data-living`). A rule that leaks across surfaces is a bug even if it looks correct where you tested it.

## Related

[[performance-contract]] · [[rendering]] · [[cinematic-ui]] · [[visual-design]] · [[TASK-052]] · [[TASK-053]] · [[TASK-054]] · [[TASK-055]]
