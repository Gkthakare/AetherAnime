# Portal Engine

> Canonical design specification for the permanent Portal Engine — the dimensional gateway into every anime world in AetherAnime.
>
> **Status:** Design Canonical  
> **Classification:** Experience Design · Engine Architecture · Interaction Language  
> **Applies to:** Web today; Desktop, Mobile, VR, and future clients tomorrow  
> **Related:** `docs/design/PORTAL_INVITATION.md` · `docs/design/EXPERIENCE_BUDGET.md` · `docs/AI_CONTEXT/PROJECT_CONTEXT.md` · `docs/architecture/README.md`

This document is the permanent source of truth for the **Portal Engine**.

`PortalCTA` proved the architecture: scenes orchestrate, widgets perform, `Enter {destination}` is sacred, and ceremony is separable from consequence. It is **not** the final portal.

The Portal Engine is the permanent system every world inherits.

Implementation must follow this specification and remain inside the Experience Budget. If implementation and this document disagree, resolve the disagreement before shipping.

This document contains **no implementation code**. It defines architecture, emotion, visual language, and limits only.

---

# Design Goal

The portal must create **one emotion**:

> I don't know what is inside…  
> …but I have to enter.

The portal is **not**:

- a button
- a card
- a CTA
- a marketing conversion control

The portal **is**:

a **dimensional gateway** — a quiet threshold with gravity, geometry, and mystery.

It should feel inspired by quiet cosmic gravity, sacred magical geometry, dimensional thresholds, and mysterious anime worlds — without copying any existing IP.

It must feel elegant. Not noisy. Not overloaded.

It pulls attention naturally. It never screams for it.

---

# Relationship to Existing Canon

| Document | Role |
| --- | --- |
| `PORTAL_INVITATION.md` | Interaction language and emotional lifecycle (`Enter {destination}`, Call to Adventure) |
| `EXPERIENCE_BUDGET.md` | Hard ceilings for motion, light, attention, performance, accessibility |
| `PORTAL_ENGINE.md` (this document) | Permanent gateway system: visual anatomy, ceremony, variants, engine placement, future growth |

The Invitation defines *what the user is asked*.  
The Budget defines *what the world may never exceed*.  
The Engine defines *how the gateway exists as a reusable system*.

---

# 1. Purpose

## Why the Portal Engine exists

AetherAnime is an Anime Operating System. Anime is the content. Immersion is the product.

Users do not “open a show.” They **enter a world**.

The Portal Engine is the platform’s reusable threshold system: the ceremonial gateway that turns observation into belonging. Without it, worlds are content cards. With it, worlds are destinations.

## Why every anime world inherits the same interaction language

If each world invents its own enter control — different verbs, different chrome, different emotional arcs — the OS fragments into a website of unrelated buttons.

One engine means:

- Muscle memory around a single commitment gesture.
- Destinations as the only variable the user must read.
- Accessibility names that stay predictable.
- Future clients (Desktop, Mobile, VR) that inherit identity instead of reinventing thresholds.

The verb remains `Enter`. The destination names the world. The Engine renders the gateway.

## Why entering a world should feel ceremonial

Commitment deserves dignity.

Crossing a threshold is not a funnel step. It is the irreversible emotional beat: *I choose to go in.* Ceremony protects that beat from accidental double-taps, noisy spectacle, and disposable UI animation.

Ceremony is the memory. Consequence (stay, navigate, hand off) is swappable. The Engine keeps them separable forever.

---

# 2. Emotional Journey

Every Portal Engine instance moves the user through the same emotional lifecycle defined by the Portal Invitation:

```
Idle
  ↓
Aware
  ↓
Inviting
  ↓
Accepting
  ↓
Crossing
  ↓
Settling
  ↓
Idle again
```

## Idle

The gateway exists without insisting. Soft gravity is present. Rings rest. The core holds a quiet promise. Curiosity may form; nothing yet asks for a decision.

Idle is readiness — not emptiness, not a screensaver of busy effects.

## Aware

The user notices the threshold — gaze, pointer proximity, or focus lead-in. Recognition only. The seal has been seen; it has not yet invited.

Aware is the first contact between person and dimension.

## Inviting

The portal acknowledges the user. Light gathers toward the core. Rings wake. The destination label feels addressable. The world leans in without shouting.

Inviting is permission. The door is willing.

## Accepting

The user commits. Courage, however quiet. The portal becomes the primary actor. Competing interactions lock so the decision can complete with dignity.

Accepting is the irreversible beat: curiosity becomes commitment.

## Crossing

The threshold opens. Geometry performs the enter gesture. Energy converges inward. Space answers. Atmosphere and identity respond in cascade so the scene feels like one living system — not three timers.

Crossing is passage.

## Settling

The surge resolves into afterglow. Light returns to composure. The seal closes into calm presence. The user feels the aftermath of a decision, not the jolt of a page swap.

Settling is memory.

## Idle again

The lifecycle completes. Peace is earned. Either the user remains on the current scene (completion returns to Idle) or Settling hands off into a new world (completion navigates). Architecturally these are the same journey with different endings.

## How curiosity becomes commitment

Idle and Aware last longer in spirit than Crossing. The Engine never rushes the want. Inviting gathers attention. Accepting converts want into choice. Crossing proves the world heard. Settling lets the choice land.

Spectacle without want is noise. Want without ceremony is a click. The Engine exists to join them.

---

# 3. Visual Language

The Portal Engine presents a **Magical Seal**: concentric sacred geometry around a quiet luminous core — a ritual object, not control chrome.

## Outer Ring

The widest threshold edge. It marks the boundary between *here* and *beyond*. At rest it is restrained; on invitation it gathers luminance; on crossing it expands just enough to suggest the seal unbinding — never spinning into carnival motion.

## Middle Ring

The emphasis band. It carries the brand’s cool light (cyan family) as a secondary circuit between void and core. It counter-moves relative to the outer ring so the seal feels dimensional, not flat sticker art.

## Inner Ring

Quiet depth toward the core. Smaller motion, softer edges. It suggests that something exists *inside* the circle — cooler or quieter space beyond the threshold.

## Portal Core

The luminous heart. Light gathers here. On accepting it concentrates; on crossing it yields inward (openness, not explosion); on settling it returns to calm presence.

The core is the emotional focal point of the seal — never a logo badge, never a play icon pasted on magic.

## Energy Halo

A soft luminous field immediately around the rings. It is atmospheric light, not a second competing glow stack. Halo intensity tracks invitation and ceremony; it must remain within Soft Aether climate and Experience Budget glow rules.

## Gravitational Field

An invisible-to-chrome zone of influence around the seal. The field is felt through environment response (atmosphere pull, particle curves when particles exist, ambient light bias) — not through UI frames or dashed radius indicators.

## Background Interaction

The portal never punches a hole in Soft Aether with hard UI panels. It belongs inside the scene climate. Background interaction means the void and haze acknowledge the seal; the seal does not sit on a card.

## Ambient Lighting

Primary light source: the Portal. Secondary: Atmosphere. Hero never outshines the Portal during ceremony. Ambient lighting supports depth and focus; it does not create a second sun.

## Spacing

Negative space around the seal is sacred. Crowding with badges, stats, promos, or secondary chrome collapses the Call to Adventure into a Call to Action. Hero above. Seal below. Atmosphere behind. Empty air between.

## Scale

The seal must read as a threshold with physical presence without dominating the brand. Peak Crossing scale stays within Experience Budget (~1.10–1.12 on primary ring language). Larger is not more magical — it is louder.

## Depth

Depth comes from layered rings, soft falloff, and the sense that entering means going *in*, not sliding *across*. Flat badges fail the depth test.

## Alive at Idle

Idle life is whisper, not performance:

- Barely perceptible core calm.
- Soft halo breath at the edge of notice.
- Environment drift elsewhere (Atmosphere), not frantic seal loops.

The portal feels alive because the world is breathing — not because the seal is dancing for attention.

---

# 4. Color Language

Color hierarchy (depth → emphasis → singularity):

```
Deep Void
  ↓
Midnight Blue
  ↓
Royal Indigo
  ↓
Electric Cyan
  ↓
White Core
```

## Why this hierarchy

**Deep Void** is Soft Aether rest — the space the user already inhabits. Without void, the seal has nowhere to float and no mystery beyond the rim.

**Midnight Blue** bridges void and structure. It keeps the gateway belonging to night and cosmos rather than neon nightlife.

**Royal Indigo** is brand gravity — the AetherAnime indigo that signals identity without becoming purple-on-white marketing cliché. Rings borrow indigo restraint so geometry feels sacred, not toy-like.

**Electric Cyan** is emphasis light — gathering, focus, invitation. One cyan family for Inviting and accessible focus. Competing accent colors fracture attention and violate the Visual Budget.

**White Core** (or near-white luminous core) is singularity — the point of commitment. It must remain small and earned. A large white core becomes a flashlight; a quiet white core becomes a star.

World variants may tint accents toward a world’s emotional climate (warmer, cooler, greener) **only within Soft Aether restraint**. They may not replace the hierarchy with rainbow, seasonal candy, or HUD neon stacks.

---

# 5. Motion Language

Motion is choreography, not decoration. Every motion has emotional intent. Properties remain transform and opacity unless a future Phase explicitly expands the Performance Budget.

## Outer Ring rotation

**Intent:** cosmic patience; the outer threshold turns like a slow orbit.  
**Emotion:** the universe is larger than the user — and still waiting.  
Rotation stays subtle; Crossing may amplify briefly without carnival spin.

## Middle Ring counter-rotation

**Intent:** dimensional tension; two layers of reality sliding against each other.  
**Emotion:** the threshold is deep, not flat.  
Counter-motion must remain readable as depth, not as busy ornament.

## Inner Ring breathing

**Intent:** living seal; scale/opacity micro-breath toward the core.  
**Emotion:** something on the other side is awake.  
Breath is whisper-amplitude. If breath becomes the focal show, it is over budget.

## Core pulse

**Intent:** heartbeat of invitation.  
**Emotion:** gather → commit → open → rest.  
Pulse intensifies on Inviting/Accepting, yields on Crossing, calms on Settling. No strobing. No seizure-risk flash.

## Halo expansion

**Intent:** light gathering made visible as field, not as explosion.  
**Emotion:** attention concentrating on the threshold.  
Expansion is soft and short-lived; Settling retracts the field.

## Energy convergence

**Intent:** the world pulls inward toward entry.  
**Emotion:** commitment has direction — *in*, not *out*.  
Convergence is the Engine’s signature: attraction, never outward fireworks.

## Seal opening

**Intent:** Crossing as unsealing.  
**Emotion:** passage.  
Rings yield, core opens inward, gravity peaks. Short Crossing; longer memory in Settling.

## Settling

**Intent:** shared exhale.  
**Emotion:** afterglow and dignity.  
Portal, atmosphere, and identity return to composure as one composition — not three independent fade-outs.

---

# 6. Particle System

Particles are a **future capability** of the Portal Engine. They ship only when a Particle Engine (under World / Graphics ownership) exists and the Experience Budget explicitly allows them for a given phase.

Until then, light gathers in planes and rings — not spark fields.

## Philosophy

Particles **do not emit outward**.

They are **attracted inward**.

Outward emission reads as celebration UI and spectacle. Inward absorption reads as gravity and destiny — aligned with “I have to enter.”

## Spawn

Particles spawn sparsely in a soft annulus around the seal — near the gravitational field, never as a screen-filling fog. Spawn rate rises gently from Idle → Inviting → Accepting, peaks early in Crossing, then falls in Settling.

## Lifetime

Short enough to feel ephemeral; long enough to read as dust of light, not flicker. Lifetime shortens under reduced motion or may collapse to zero particles with opacity-led substitutes.

## Speed

Slow near Idle. Slightly faster as invitation gathers. Crossing may accelerate absorption — never into chaotic streaks.

## Spiral

Paths curve toward the core along soft spiral or arc trajectories. Spiral communicates dimension and pull. Straight radial inrush feels mechanical; outward spiral feels firework.

## Absorption

Particles die into the core or inner ring — consumed by the threshold. Absorption is the emotional proof of gravity.

## Fade

Opacity fades as particles approach absorption or as Settling restores calm. No hard pops. No flashing.

## Interaction

On Aware/Inviting, nearby particle paths may bias more strongly toward the seal. Particles never become a second interactive target; the hit target remains the portal control.

## Future scalability

- Count and fidelity scale by device class (mobile → desktop → XR).
- World variants may tint particle color within Soft Aether hierarchy.
- Boss / dungeon portals may raise density slightly — never into particle-heavy spectacle.
- Reduced motion prefers zero particles with preserved emotional phases via opacity/transform.

---

# 7. Gravitational Field

The portal influences space. The field is environmental storytelling, not a visible UI widget.

## Soft atmosphere pull

Atmosphere haze draws slightly toward the seal during Inviting → Crossing — an inhale of Soft Aether. Pull remains secondary to the Portal’s lead (Experience Budget cascade).

## Subtle distortion

Future renderers may suggest gentle spatial bend near the rim (shader/WebGL eras only, under Phase gates). Distortion must stay almost subliminal. Obvious warping becomes sci-fi dashboard language — a Non Goal.

## Nearby particles curve

When particles exist, field lines guide their spiral into the core. The field is the reason particles never spray outward.

## Ambient light bends

Emphasis light biases toward the seal during invitation and ceremony. Background remains Deep Void; cyan does not flood the viewport.

## Rule

If the field becomes more interesting than the seal, the field is over budget. The portal remains the primary light and primary actor.

---

# 8. Interaction Model

Everything remains ceremonial. Input modality changes; emotional meaning does not.

## Hover

Pointer proximity maps to Aware → Inviting. Leaving maps toward Idle when not locked.

## Focus

Keyboard focus must produce the same Aware → Inviting emotional states as pointer. Focus visibility uses the cyan invitation family so focus feels like the seal waking — not pasted browser chrome.

## Keyboard

The portal is a true interactive control. Sequential navigation reaches it. Platform activation keys commit Accepting → Crossing → Settling without a pointing device.

## Touch

Touch targets remain generous. First contact may map to Aware/Inviting; activation maps to Accepting. No gesture gymnastics required for dignity.

## Click / activation

Activation begins Accepting, locks re-entry, and runs ceremony. Duplicate activation must not stack. Lock releases when Settling completes and Idle returns (or when a future navigate completion replaces the scene).

## Reduced Motion

Emotional phases remain intact. Spectacle simplifies: opacity-led gather/open/settle; ambient seal loops rest; particles omit or freeze into still poses. Completion still fires reliably.

## Accessibility

Accessible name expresses `Enter` + destination. Decorative geometry is not announced. Busy/locked state is exposed during ceremony. Color alone never carries state. Rapid luminance changes and flashing are forbidden.

---

# 9. Portal Ceremony

The cinematic is always the same story with swappable endings.

## Portal leads

All meaningful ceremony motion begins at the seal. If the portal does not lead, the sequence is a page animation — not a portal sequence.

## Atmosphere responds

Soft Aether echoes after the portal begins: restrained inhale, slight brightening or drawing-in of haze. Echo, not duet of equals.

## Hero acknowledges

Identity yields focus during Crossing — soft bow, never hijack — then returns in Settling. Brand remains readable within Experience Budget yield limits.

## Scene settles

Arrival (or future world scene) returns to composure as one composition. Settling is part of the story, not a cancel animation.

## Future worlds replace the completion action

Ceremony (Accepting → Crossing → Settling) stays. Consequence changes:

| Era | Completion |
| --- | --- |
| Proven Arrival (current) | Return to Idle on scene |
| World entry | Navigate / hand off into World Engine shell |
| Companion / guild / dungeon | Hand off into that presence |

Ceremony and consequence remain separable forever.

Scenes orchestrate. Portal Engine performs. Widgets never reach sideways to restyle siblings; they subscribe to scene phase.

---

# 10. Portal Variants

One engine. Many destinations.

## Examples

| Label | Meaning |
| --- | --- |
| Enter Naruto | Threshold into that anime world |
| Enter Bleach | Threshold into that anime world |
| Enter One Piece | Threshold into that anime world |
| Enter Solo Leveling | Threshold into that anime world |
| Enter AetherAnime | Platform arrival threshold |
| Enter {Guild} | Social territory |
| Enter {Dungeon} | Challenge threshold |
| Enter {Companion}'s Realm | Relationship threshold |

## What changes

- **Destination name** in `Enter {destination}`.
- **Accent climate** within Soft Aether (subtle hue bias, never a new visual system).
- **Completion action** (idle return vs navigate vs presence handoff).
- **Intensity within budget** (dungeon slightly more charged; companion slightly more personal).
- **Renderer adapter** (2D web → desktop → VR place-in-space).

## What NEVER changes

- The verb `Enter`.
- Call to Adventure over Call to Action.
- Emotional lifecycle Idle → … → Settling → Idle.
- Portal leads; scene follows.
- Soft Aether restraint and Experience Budget ceilings.
- Inward gravity philosophy (attraction, not outward fireworks).
- Accessibility and reduced-motion phase preservation.
- Ceremony separable from consequence.

Variants inherit the Engine. They do not fork a second portal culture.

---

# 11. Portal Architecture

The Portal Engine fits the existing layered architecture. It does **not** redesign Theme, Graphics, Motion, Surface, or Experience composition.

```
Users
  ↓
Experience Layer (ArrivalScene, future World scenes) — orchestrate phase
  ↓
Portal Engine (performer) — gateway presence, local seal life, accept initiation
  ↓
Foundations: Theme · Graphics · Motion · Surface
  ↓
Future Engines: World · Navigation · Audio · Particle · XR
```

## Theme

Color roles (void, indigo, cyan emphasis, text) come from Theme. Portal Engine consumes tokens; it does not invent a parallel palette.

## Graphics

Glow, blur, elevation, glass language live in Graphics. Portal Engine composes Soft Aether light from Graphics primitives within budget — it does not become a second graphics kit.

## Motion

Timing philosophy, durations, easings, and reduced-motion policy live in Motion Foundation. Portal-local choreography (rings, halo, convergence) composes from foundation tokens. No second motion culture.

## Surface

Surface hosts presentation roles (transparent planes, glass when needed). The interactive control remains a semantic control; Surface does not replace accessibility.

## ArrivalScene (and future scenes)

Scenes own composition and canonical scene phase. They wire callbacks and cascade. Portal Engine never owns siblings (Hero, Atmosphere). Performers subscribe to scene phase; they do not import each other.

## World Engine

World Engine owns world identity, destination metadata, and entry shells. Portal Engine consumes destination + completion intent; it does not own world content.

## Future Navigation Engine

Navigation Engine owns route/hand-off consequence after Settling. Portal Engine emits completion; Navigation decides where the user arrives.

## Future Audio Engine

Audio attaches emotional cues to phases (silence first; one cue per beat). Portal Engine does not embed ad-hoc sound files per widget forever — it declares beats Audio can bind to.

## Future Particle Engine

Particle Engine owns spawn/lifetime/integration under budget. Portal Engine declares gravitational intent (inward attraction); Particle Engine simulates within device class limits.

## Future XR Engine

XR maps gaze/controller to Aware/Inviting and confirm/step-through to Accepting/Crossing. Portal Engine philosophy is unchanged; presentation becomes spatial place rather than page point.

---

# 12. Performance Budget

Aligned with `EXPERIENCE_BUDGET.md`. Portal Engine must not silently raise ceilings.

| Concern | Rule |
| --- | --- |
| Moving layers | Prefer few seal layers (rings + core + optional halo). Ambient Atmosphere remains the continuous ambient system (≤3 haze movers on Arrival). |
| Animation properties | Transform and opacity for choreography. |
| Layout | No layout animation / thrashing as part of idle, inviting, or ceremony. |
| Particles | No particles before Particle/World Engine ownership and budget approval. |
| WebGL / shaders / canvas FX | No WebGL before Phase 2 decisions; no invitation-class custom shaders or canvas FX until explicitly gated. |
| Reduced motion | Preserve phases; simplify or omit loops/particles. |
| Battery / mobile | Lower particle counts, softer loops, shorter ceremony dwells if needed — never skip emotional meaning. |
| Desktop | Higher fidelity allowed within Soft Aether restraint — not an excuse for spectacle. |
| Future VR | Stricter budgets; transform/opacity remain default magic; spatial presence replaces page chrome. |

Performance protects wonder. A stuttering gateway breaks immersion faster than a quieter gateway.

---

# 13. Accessibility

Immersion does not excuse exclusion.

| Area | Requirement |
| --- | --- |
| Keyboard | Full ceremony path without pointer. |
| Screen reader | Clear name: enter + destination; decorative rings/halo/particles not announced. |
| Focus | Visible; feels like Inviting light; not alien browser rectangle language. |
| Reduced motion | Full emotional lifecycle; simplified visuals. |
| Color contrast | Destination label and focus remain perceivable on Soft Aether void. |
| Motion sensitivity | No flashing; no rapid luminance oscillation; lock prevents stacked ceremony. |
| Busy state | Ceremony exposes busy/locked so assistive tech does not imply repeat activation. |

---

# 14. Future Extensions

The Engine grows by **adapters and intensity within philosophy** — not by rewriting its soul.

| Extension | How it grows | What stays |
| --- | --- | --- |
| Audio | Bind cues to phases | Silence first; one emotional cue |
| Shaders | Optional rim/field when Phase allows | Soft Aether; no dashboard warp |
| WebGL | Optional renderer path Phase 2+ | Same lifecycle and Enter language |
| Three.js / GPU particles | Particle Engine backends | Inward attraction only |
| World-specific portals | Accent + destination + completion | One Engine |
| Boss portals | Slightly higher charge within budget | No red-alert HUD |
| Guild portals | Crest-like simplicity | No badge clutter |
| Time portals | Narrative framing around same seal | No new verb |

Growth test: if a proposed extension could be replaced by a generic primary button without losing meaning, it is not a Portal Engine extension.

---

# 15. Permanent Design Principles

These twenty rules are immutable. They outrank local taste and short-term feature pressure.

1. **The portal attracts.** It never advertises.
2. **Motion follows intention.** No decorative motion.
3. **Silence is stronger than spectacle.**
4. **Everything serves curiosity.**
5. **Every effect must earn its existence.**
6. **Restraint creates wonder.**
7. **Enter is sacred.** Destinations change; the verb does not.
8. **Call to Adventure over Call to Action.**
9. **Portal leads; scene follows.**
10. **Ceremony and consequence are separable.**
11. **One focal point at a time.**
12. **Light gathers, never explodes.**
13. **Gravity pulls inward.** Particles and energy never firework outward as default language.
14. **Soft Aether is the climate.** Magical does not mean loud.
15. **Negative space is part of the magic.**
16. **Scenes orchestrate; widgets perform.**
17. **Hero yields; Atmosphere echoes; Portal commits.**
18. **Reduced motion preserves phases.** It does not delete the journey.
19. **Performance protects immersion.** Transform, opacity, and honest budgets first.
20. **Every world inherits one gateway soul.** Variants tint; they do not fork.

---

# Non Goals

The Portal Engine must never become:

- A flashy button skin
- A particle toy
- A sci-fi HUD dial
- A generic landing-page CTA
- A competing brand billboard over Soft Aether
- A per-anime reinvented control language

`PortalCTA` was the proof. Arrival remains the quality benchmark. The Portal Engine is how that benchmark scales to every world without losing the emotion:

> I don't know what is inside…  
> …but I have to enter.

---

# Document Control

| Field | Value |
| --- | --- |
| Document | `docs/design/PORTAL_ENGINE.md` |
| Role | Canonical Portal Engine specification |
| Supersedes visually | Future Portal Engine implementations supersede `PortalCTA` presentation; Invitation language remains binding |
| Bound by | `PORTAL_INVITATION.md`, `EXPERIENCE_BUDGET.md` |
| Implementation | Must not begin until this document is accepted as governing for Portal Engine work |

When this document evolves, record why. Do not silently reshape the gateway to fit a temporary spectacle.

---

*End of Portal Engine specification.*
