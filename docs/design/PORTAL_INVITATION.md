# Portal Invitation

> Canonical design specification for every portal interaction in AetherAnime.
>
> **Status:** Approved  
> **Classification:** Experience Design · Interaction Language · Product Architecture  
> **Applies to:** Web today; Desktop, Mobile, VR, and future clients tomorrow  
> **Related vision:** Enter the World Beyond the Screen

This document is the permanent source of truth for the Portal Invitation.

Implementation must follow this specification.

If implementation and this document disagree, resolve the disagreement before shipping.

---

# Purpose

The Portal Invitation is the user's first *decision* inside AetherAnime.

It is not a marketing button.

It is not a conversion funnel control.

It is the threshold between observing the world and entering it.

AetherAnime is an Anime Operating System. Immersion is the product. Anime is the content. The Portal Invitation exists to transform arrival into belonging — to turn the emotional state of *looking at* a living world into the emotional state of *stepping into* it.

Brand and atmosphere create wonder.

The Portal asks for commitment.

Without it, Arrival is a beautiful postcard. With it, Arrival becomes the opening scene of an adventure.

## Call to Adventure, not Call to Action

Traditional products speak in *Call to Action* language: Click here. Sign up. Watch now. Get started. The interface demands a transaction.

AetherAnime speaks in *Call to Adventure* language.

A Call to Adventure is an invitation into a story the user will inhabit. It does not pressure. It does not shout. It does not compete with the brand for attention. It opens a door and waits.

| Call to Action | Call to Adventure |
| --- | --- |
| Converts the user | Commits the user |
| Demands attention | Gathers attention |
| Completes a funnel | Begins a journey |
| Generic verbs (“Start”, “Go”) | Constant verb + living destination |
| Button chrome | Threshold presence |

Every portal in the platform must preserve this distinction. If an interaction could be replaced by a generic primary button without losing meaning, it is not a Portal Invitation.

---

# Interaction Language

## Form

```
Enter {destination}
```

- **Verb:** `Enter` — constant across the entire platform.
- **Destination:** a named place in the Anime Operating System.

Sprint-002 destination: `AetherAnime`.

Visible label example: **Enter AetherAnime**.

## Why the verb never changes

`Enter` is the platform's fundamental verb of immersion.

It means: cross the threshold; leave the outside; inhabit what is beyond.

Changing the verb per scene (`Explore`, `Join`, `Play`, `Open`, `Launch`) would fragment the interaction language into a pile of unrelated buttons. Users would relearn meaning on every screen. The portal would stop feeling like a *system* and start feeling like a *website*.

By keeping `Enter` constant:

- Muscle memory forms around one commitment gesture.
- Destinations become the only variable the user must read.
- Future portals inherit identity instead of inventing new chrome.
- Accessibility names remain predictable: the action is always “enter,” the target is always named.

The verb is policy. Destinations are content.

## Future examples

| Context | Label |
| --- | --- |
| Platform arrival | Enter AetherAnime |
| Individual anime world | Enter [Anime Title] |
| Guild hall | Enter [Guild Name] |
| Dungeon / challenge space | Enter [Dungeon Name] |
| Companion presence | Enter [Companion]'s Realm |
| Desktop shell world | Enter AetherAnime |
| VR spatial threshold | Enter [World Name] |

The structure never changes. Only `{destination}` changes.

---

# Emotional Journey

The Portal Invitation moves the user through a deliberate emotional lifecycle. Every portal interaction — on Arrival or in future scenes — should be mappable to these states.

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
Idle
```

## Idle

The world is at rest. Soft Aether atmosphere lives quietly. The Magical Seal is present but calm. The invitation exists without insisting. Curiosity may form, but nothing yet asks for a decision.

Idle is not emptiness. It is readiness without urgency.

## Aware

The user notices the portal — through gaze, pointer proximity, or keyboard focus. Awareness is the first contact between person and threshold. The seal has not yet invited; it has only been seen.

Aware is recognition.

## Inviting

The portal acknowledges the user. Light gathers. Rings wake. The destination label feels addressable. Atmosphere and Hero may hint that the world is listening — never enough to steal focus from the seal.

Inviting is permission. The door is willing.

## Accepting

The user commits. This is the irreversible emotional beat of the journey: *I choose to enter.* The portal becomes the primary actor. The rest of the scene prepares to respond. Re-entry into competing interactions is locked so the decision can complete with dignity.

Accepting is courage, however quiet.

## Crossing

The threshold opens. The Magical Seal performs the enter gesture. The world responds in cascade — Atmosphere first as environment, Hero as identity — so the scene feels like one living system reacting to a choice, not three widgets animating on a timer.

Crossing is passage.

In Sprint-002, Crossing remains on Arrival: a cinematic acceptance that proves the world heard the user. In later evolution, Crossing may continue into navigation or a new scene. The emotional meaning does not change; only where the user arrives afterward.

## Settling

The surge resolves. Light returns to composure. The seal closes into calm presence. Atmosphere and Hero return to their resting characters. The user feels the aftermath of a decision, not the jolt of a page swap.

Settling is afterglow.

## Idle (return)

The lifecycle completes. The scene is again at rest — either still on Arrival (Sprint-002 completion action: return to idle) or in a new world (future completion action: navigate). Architecturally these are the same journey with different endings. Emotionally, Idle after Settling should feel earned: the world has answered, and peace has returned.

---

# Visual Language

This section describes artistic intent only. It does not prescribe implementation techniques.

## Magical Seal

The Portal Invitation takes the form of a Magical Seal: concentric rings around a quiet luminous core.

The seal is a ritual object, not a control surface. It suggests covenant — a named world held behind a circle of light. When the user enters, they do not “press a button”; they unseal a threshold.

The seal should feel geometric, elegant, and restrained. It is anime-coded without pastiche: no overloaded sigils, no noisy ornament, no stone gateway weight. Circles and light are enough.

## Soft Aether

The seal lives inside Soft Aether — the Arrival visual climate of soft indigo depth, restrained cyan emphasis, and generous void.

Soft Aether means:

- Atmosphere is haze, not weather.
- Color is breathed, not painted thick.
- Motion is drift, not spectacle.
- Magic is whispered until the user leans in.

The Portal may be the brightest focal point in the scene, but it must still belong to Soft Aether. It gathers light; it does not puncture the world's tone.

## Light gathering

Light on the portal should feel like attention concentrating.

At rest, light is low and even. On awareness and invitation, luminance pools toward the core and the outer rings. On accepting and crossing, light intensifies with purpose — still gathered, never detonated.

Light gathering is the visual equivalent of the Call to Adventure: the world leans toward the user without shouting.

## Depth

The seal must read as a threshold with depth, not as a flat badge on glass.

Depth comes from layered rings, soft falloff, and the sense that something exists *beyond* the core — a cooler or quieter space inside the circle. The user should feel that entering means going *in*, not sliding *across*.

Depth is spatial storytelling. It prepares the later truth of navigation without requiring a new route today.

## Negative space

The portal needs room to breathe.

Negative space around the seal protects its ritual character. Crowding it with badges, promos, stats, or secondary chrome would collapse the Call to Adventure into a Call to Action.

Hero above. Seal below. Atmosphere behind. Empty air between. That emptiness is part of the design.

---

# Motion Language

Motion in the Portal Invitation is choreography, not decoration.

## Portal leads

The Magical Seal is the primary actor. All meaningful motion begins here. Hover and focus wake the seal first. Acceptance is initiated by the seal. Crossing is performed by the seal.

If the portal does not lead, the sequence is not a portal sequence — it is a page animation.

## Atmosphere responds

Atmosphere is the environment. It does not compete with the seal. When the user accepts, Soft Aether acknowledges: a restrained inhale, a slight brightening or drawing-in of haze, as if the void noticed a decision.

Atmosphere responds *after* the portal begins. It is echo, not duet of equals.

## Hero acknowledges

Hero is identity — the name of the world the user is entering. During Crossing, the Hero softens or settles in acknowledgment: the brand yields focus to the act of entering, then returns to composure in Settling.

Hero never hijacks the sequence. It bows.

## Scene settles

After Crossing, the entire Arrival returns to Idle as one composition. Settlement should feel like a single exhale shared by seal, air, and identity — not three independent fade-outs.

## Timing philosophy

- **Curiosity before spectacle.** Idle and Aware last longer in spirit than Crossing. The user must have time to want the door before it opens.
- **Cascade, not sync.** Portal → Atmosphere → Hero. Offsets create the feeling of a world responding. Simultaneous motion reads as UI kit animation.
- **Short crossing, longer memory.** The accept sequence should be brief enough to feel decisive and long enough to feel ceremonial. It must never obstruct; it must never trivialise.
- **Return is part of the story.** Settling is not an afterthought or a cancel animation. It is the emotional resolution of Sprint-002's stay-on-Arrival completion — and the same beat that will later hand off to navigation.
- **Restraint over duration tricks.** Soft Aether motion prefers soft transforms and opacity shifts over elaborate timelines. If a beat needs complexity to be understood, the visual language has failed.

Numeric durations, easing curves, and implementation constants belong in the motion foundation and widget motion modules — never as the definition of this language.

---

# Accessibility

The Portal Invitation must be operable, perceivable, and respectful for every user. Immersion does not excuse exclusion.

## Keyboard

The portal is a true interactive control.

- It must be reachable by sequential keyboard navigation.
- It must activate with the platform's standard activation keys.
- Keyboard focus must produce the Aware → Inviting emotional states, not only pointer hover.
- Keyboard users must be able to complete Accepting → Crossing → Settling without a pointing device.

## Reduced motion

When the user prefers reduced motion, the emotional lifecycle remains intact; the spectacle does not.

- Crossing may become a shortened, opacity-led acknowledgment rather than ring choreography.
- Ambient idle drift on the seal may rest at a still Inviting-capable pose.
- Atmosphere and Hero responses must also quiet themselves so the cascade does not become a motion-only story.
- The completion action (return to idle today; navigate later) must still fire reliably.

Reduced motion is a first-class path, not a broken fallback.

## Focus visibility

Focus must be visible without breaking Soft Aether.

The focus treatment should use the brand's emphasis light — the same family of cyan attention used for gathering — so focus feels like the seal waking, not like a browser default rectangle pasted on magic.

Focus visibility is part of Inviting, not a separate accessibility skin.

## ARIA

Assistive technology must receive a clear name and role.

- The accessible name must express the interaction language: enter, plus the destination.
- Decorative ring geometry and luminous ornament must not be announced.
- While Accepting / Crossing / Settling are in progress, the control should expose busy state so duplicate activation is not implied as available.
- The portal must not rely on color alone to communicate state.

## Interaction locking

During Accepting, Crossing, and Settling, the invitation is locked.

- Additional activations must not restart or stack choreography.
- The lock releases when Settling completes and Idle returns (or when a future navigate completion replaces the scene).
- Locking protects dignity: a Call to Adventure should not stutter because of accidental double activation.

---

# Performance Principles

Immersion requires responsiveness. The Portal Invitation obeys a strict visual budget.

## Transform

Prefer movement expressed as transform. Position, scale, and rotation of seal layers may change; document flow must not.

## Opacity

Prefer opacity for waking, gathering, and settling light. Opacity changes are the Soft Aether way to breathe.

## No layout thrashing

The portal must not cause layout recalculation as part of its idle, inviting, or crossing life. Geometry that participates in motion should be composed so animation does not reshape surrounding Arrival content.

## No WebGL

The Magical Seal is not a 3D scene. WebGL is out of scope for this invitation and must not be introduced to “make it more magical.”

## No particles

Particle systems are spectacle language. Soft Aether forbids them on the Portal Invitation. Light gathers in planes and rings, not in spark fields.

## No shaders

Custom shaders are out of scope. The seal's magic comes from composition, restraint, and choreography — not from GPU programs.

## No unnecessary repainting

Avoid effects that force continuous expensive repaints of large regions. Soft shadows and luminous edges are allowed only when they serve light gathering and remain within the Arrival performance climate already established by Atmosphere.

If a proposed enhancement violates these principles, it is not a Portal Invitation enhancement — it is a different product decision and must be documented separately.

---

# Architecture

This section defines product architecture boundaries. It does not prescribe file contents or code.

## Why PortalCTA is separate from ArrivalScene

**ArrivalScene** is the scene director. It owns composition: what is on stage, in what order, and how the scene's emotional phase progresses when the user accepts the invitation.

**PortalCTA** (Portal Invitation widget) is the primary actor. It owns the Magical Seal's presence, the Enter {destination} language, local invitation states, and the initiation of acceptance.

Separating them preserves a permanent rule of the Experience layer:

- Scenes orchestrate.
- Widgets perform.
- No widget reaches sideways to restyle its siblings.

If the seal lived inside ArrivalScene as anonymous markup, every future portal (anime world, guild, dungeon) would reinvent the invitation. If ArrivalScene lived inside the portal, the portal would become a page. Separation keeps the Call to Adventure reusable and the Arrival composition replaceable.

## Why Motion is separate

Motion language is a platform system. Timing philosophy, reduced-motion policy, and reusable entrance vocabulary belong in the Motion foundation. Widget-local choreography may exist for seal-specific rings and for Arrival cascade offsets, but those locals compose from the foundation — they do not invent a second motion culture.

Separating Motion from the portal widget ensures:

- Hero, Atmosphere, and Portal speak one temporal dialect.
- Future portals inherit the same emotional pacing.
- Performance and accessibility policies have a single place to evolve.

## Why Surface is reused

Surface is the presentation primitive for visual roles (transparent planes, solid rests, glass, floating glass). The Magical Seal may rest upon or within Surface so that chrome — when any is needed — comes from the design system rather than one-off panel styling.

Reusing Surface prevents the portal from becoming a parallel UI kit. The invitation can remain special in *meaning* while remaining ordinary in *infrastructure*.

The portal's hit target remains a semantic interactive control. Surface does not replace accessibility semantics; it hosts presentation.

## Extension points

The Portal Invitation is designed to evolve without rewriting its soul.

| Extension point | What varies | What must not vary |
| --- | --- | --- |
| **Destination** | The named world in `Enter {destination}` | The verb `Enter` |
| **Completion action** | Return to Idle (Sprint-002) or navigate / hand off to another scene (future) | Accepting → Crossing → Settling emotional arc |
| **Scene response** | How strongly Atmosphere and Hero acknowledge | Portal leads; responses cascade; Soft Aether restraint |
| **Visual intensity** | Slightly brighter focal within Soft Aether | No explosion, particles, or WebGL |
| **Platform renderer** | Web, Desktop, VR presentation adapters | Interaction language and emotional lifecycle |

Sprint-002 locks completion to *return to Idle on Arrival* while requiring the completion boundary to be swappable later. The animation is the ceremony. The completion action is the consequence. Ceremony and consequence must remain separable.

---

# Future Evolution

The Magical Seal on Arrival is the first portal, not the only portal.

## Anime portals

Each anime world may present an Enter {Anime Title} seal. Visual accents may reflect that world's identity, but Soft Aether restraint and the Enter verb remain. Crossing may navigate into that world's experience shell.

## Guild portals

Guilds are social territories. Enter {Guild Name} invites belonging to a community space. The seal may carry crest-like simplicity, never badge clutter. The emotional lifecycle is identical: invitation, commitment, passage, settlement.

## Dungeon portals

Dungeons are challenge thresholds. Enter {Dungeon Name} may feel slightly more charged, still within light-gathering rules. Difficulty is narrative context around the seal — not red alert chrome on the control.

## VR portals

In spatial environments, the Magical Seal becomes a place in space rather than a point on a page. The interaction language does not change. Gaze and controller focus map to Aware and Inviting. Stepping through or confirming maps to Accepting and Crossing. Performance principles tighten further: transform and opacity remain the default magic.

## Desktop portals

Desktop shells may use the same invitation to enter the OS-level world from system chrome. The portal must still feel like adventure, not like a window-manager button. Destination naming keeps the desktop experience continuous with the web Arrival.

## AI Companion portals

Companions may offer Enter {Companion}'s Realm as a relationship threshold. The seal should feel personal without becoming a chat launch icon. Crossing leads into companion presence; Settling may occur inside that presence rather than back on Arrival.

Across all evolutions: one verb, one lifecycle, one Soft Aether ethic, separable completion.

---

# Design Principles

These principles are permanent. They outrank local taste and short-term feature pressure.

1. **Curiosity before spectacle.** Let the user want the door before the door performs.
2. **Light gathers, never explodes.** Intensity is concentration, not detonation.
3. **The world responds to the user.** Atmosphere and identity acknowledge decisions; they do not animate for their own sake.
4. **Interactions create ripples, not explosions.** Cascade quietly. End cleanly.
5. **The portal invites; it never demands attention.** No badges, urgency timers, or competing promo chrome on the seal.
6. **Enter is sacred.** The verb does not change. Destinations do.
7. **Call to Adventure over Call to Action.** If it could be a generic button, it is not a portal.
8. **Portal leads; scene follows.** Choreography has a primary actor.
9. **Ceremony and consequence are separable.** The same Crossing may return to Idle or navigate onward.
10. **Negative space is part of the magic.** Do not fill the void around the seal.
11. **Soft Aether is the climate.** Magical does not mean loud.
12. **Accessibility is immersion for everyone.** Keyboard, focus, reduced motion, and clear naming are part of the invitation — not extras.
13. **Performance protects wonder.** Transform, opacity, no WebGL, no particles, no shaders, no layout thrash.
14. **Scenes orchestrate; widgets perform.** ArrivalScene directs; Portal Invitation acts.
15. **One interaction language for the platform.** Arrival today; anime worlds, guilds, dungeons, VR, desktop, and companions tomorrow — same soul.

---

# Document Control

| Field | Value |
| --- | --- |
| Document | `docs/design/PORTAL_INVITATION.md` |
| Role | Canonical Portal Invitation specification |
| Approved concept | Magical Seal within Soft Aether |
| Sprint-002 completion | Return to Idle on Arrival after Crossing |
| Future completion | Navigate / hand off by changing completion action only |
| Implementation | Must not begin until this document is accepted as governing |

When this document evolves, record why. Do not silently reshape the Call to Adventure.

---

*End of Portal Invitation specification.*
