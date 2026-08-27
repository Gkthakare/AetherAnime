# Skill — Visual Design

Craft technique for composition work. The rules live in [[visual-language]]; this is how to actually get there.

## Diagnose before designing

When a surface "feels wrong", name the failure before touching anything:

| Symptom | Usual cause |
|---|---|
| feels like a website | centered composition, hero-scale title, symmetric everything |
| feels like a dashboard | equal-weight plates in a row or grid |
| feels flat | one plane; nothing occludes or is occluded |
| feels busy | more than one thing competing for attention at the same weight |
| feels dead | nothing changes while the user is still |
| feels fake | motion or glow with no spatial cause |

Each has a different fix. Adding glow fixes none of them.

## Weight is the tool

Hierarchy is enforced by *relative* weight, not by adding emphasis to the thing you want noticed. To promote something, demote everything around it: shrink the title, quiet the eyebrow, drop the tagline, thin the rule. Demotion is almost always the cheaper and better-looking move.

## Make space with space

To turn UI into place, use position, scale, occlusion, and ground contact — not chrome. A crossing reads as *near* because it is larger, lower, and grounded; it reads as *far* because it is smaller, higher, dimmer, and sits along a seam. No frame required, and frames usually make it worse (an L-shaped frame reads as UI, not architecture).

## Iterate in words first

Propose 2–3 iterations described spatially ("current is grounded and near, ahead recedes along a ground seam") before writing CSS. Implement one, look at it, then decide. Iterating in CSS produces layered hacks.

## Judge it correctly

Composition can be judged in screenshots. **Motion, presence, and depth cannot** — they need a live production browser. Never conclude that subtle presence "isn't visible" from a still.

Check every viewport. Mobile is where spatial ideas usually collapse, and it is the easiest one to skip.

## Related

[[cinematic-ui]] · [[animation]] · [[visual-language]] · [[visual-task]]
