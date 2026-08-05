# Experience Budget

> Permanent guardrail for every experience in AetherAnime.
>
> **Status:** Canonical  
> **Classification:** Experience Design · Engineering Limits · Product Architecture  
> **Applies to:** Web today; Desktop, Mobile, VR, and future clients tomorrow  
> **Related:** `docs/design/PORTAL_INVITATION.md` · `docs/AI_CONTEXT/PROJECT_CONTEXT.md`

This document defines artistic and engineering limits. It does not prescribe implementation code.

If a feature and this budget disagree, the budget wins until the conflict is explicitly resolved in writing.

---

# 1. Purpose

AetherAnime is an Anime Operating System. Immersion is the product.

Immersion is achieved through **restraint**, **consistency**, and **emotional pacing** — not by continuously adding more effects.

The Experience Budget exists so that every scene, widget, and future system shares the same ceiling:

- What may move.
- How bright light may become.
- Who may hold attention.
- What performance and accessibility costs are acceptable.

Without a budget, each new feature adds noise. Noise kills wonder. Wonder is the platform’s promise.

This document protects Arrival — and every experience that follows — from feature creep, spectacle inflation, and accidental redesigns disguised as “polish.”

---

# 2. Experience Philosophy

These principles outrank local taste and short-term feature pressure.

1. **Curiosity before spectacle.** Let the user want the door before the door performs.
2. **Light gathers, never explodes.** Intensity is concentration, not detonation.
3. **The world responds to the user.** Atmosphere and identity acknowledge decisions; they do not animate for their own sake.
4. **Interactions create ripples, not explosions.** Cascade quietly. End cleanly.
5. **One focal point at a time.** Competing focal points destroy immersion.
6. **Calm is the default state.** Idle is readiness, not emptiness — and not a waiting room full of motion.
7. **Motion serves emotion.** If motion does not change how the user feels, remove it.
8. **Silence is part of the experience.** Negative space, stillness, and quiet afterglow are design materials — not missing content.

---

# 3. Motion Budget

| Limit | Rule |
| --- | --- |
| Simultaneously moving elements | **Maximum 3** noticeable movers in a composition (Arrival: three Atmosphere haze planes at rest). |
| Continuous ambient animation | **Atmosphere only.** Other widgets may breathe on interaction, not forever. |
| Portal | **Primary motion.** Leads every invitation ceremony. |
| Hero | **Subtle yield only.** Never performs the ceremony. |
| Maximum noticeable Hero movement | **3px** translate (or equivalent optical yield). |
| Portal scale during Crossing | About **1.10–1.12** peak scale on the primary ring language. |
| Allowed animation properties | **Transform and opacity only.** |
| Layout animation | **Forbidden** as part of experience choreography. |
| Infinite loops | Only for ambient Atmosphere drift. No unnecessary infinite loops on interactive chrome. |
| Cascade | Portal → Atmosphere → Hero. Offsets create response; sync reads as UI kit. |
| Timing philosophy | Short Crossing, longer Settling memory. Curiosity lasts longer in spirit than spectacle. |

Numeric durations live in the Motion Foundation and widget motion modules. This budget defines *limits*, not keyframes.

---

# 4. Visual Budget

| Role | Rule |
| --- | --- |
| Primary light source | **Portal** (Magical Seal). |
| Secondary light / climate | **Atmosphere** (Soft Aether). |
| Hero luminance | Hero **never** becomes brighter or more luminous than the Portal during a ceremony. |
| Cyan / emphasis | Restrained. One emphasis family for gathering and focus — not competing neon accents. |
| Color | No rainbow palettes. No seasonal candy. Soft indigo depth + restrained cyan emphasis. |
| Glow | No competing glows. Soft seal light is allowed; stacked bloom is not. |
| Hierarchy | One visual hierarchy per viewport. If removing an effect improves clarity, the effect was over budget. |
| Particles / bloom / shaders | Out of budget for Arrival-class surfaces (see Performance Budget). |

---

# 5. Attention Budget

Primary focus order on Arrival (and the default for branded thresholds):

```
Brand
  ↓
Portal
  ↓
Tagline
  ↓
Atmosphere
  ↓
Future Scroll Indicator
```

Rules:

- Only **one** element may be the user’s primary focus at a time.
- Brand introduces the world; Portal asks for commitment; Tagline whispers; Atmosphere supports; Scroll invites continuation later.
- Badges, promos, stats, and HUD chrome may not enter the first viewport without an explicit product decision that updates this budget.

---

# 6. Performance Budget

| Rule | Requirement |
| --- | --- |
| Motion properties | Transform and opacity only for experience choreography. |
| GPU friendliness | Prefer compositor-friendly animation; avoid forcing large-area continuous paints. |
| Layout | No layout thrashing as part of idle, inviting, or ceremony life. |
| Particles | **No particles before World Engine** ownership exists. |
| WebGL | **No WebGL before Phase 2** platform decisions. |
| Shaders | **No custom shaders** for invitation / Arrival-class magic. |
| Canvas effects | **No canvas particle/FX layers** for Soft Aether invitation surfaces. |
| Animated layers | Limit simultaneous animated layers; Arrival ambient cap remains three moving haze planes. |

If a proposed enhancement violates this section, it is a different product decision — document it separately; do not silently exceed the budget.

---

# 7. Accessibility Budget

| Rule | Requirement |
| --- | --- |
| Reduced motion | Must **preserve emotional phases** (Idle → Aware → Inviting → Accepting → Crossing → Settling → Idle). Simplify visuals; do not skip the journey. |
| Keyboard | Keyboard interactions equal mouse interactions for invitation (reach, wake, accept, complete). |
| Focus | Visible focus should feel like part of the world (Inviting light), not pasted browser chrome. |
| Flashing | No flashing. No seizure-risk strobing. |
| Luminance | No rapid luminance swings; light gathers and settles. |
| Naming | Interactive portals expose clear enter + destination language. |
| Locking | During Accepting / Crossing / Settling, duplicate activation must not stack choreography. |

Immersion does not excuse exclusion.

---

# 8. Audio Budget (Future)

Reserved rules for when Audio Engine lands. Do not invent competing sound cultures per feature.

1. **Silence first.** Quiet is the default; sound is earned.
2. **One emotional cue** per meaningful beat (e.g. accept), not a fanfare stack.
3. **No layered notification sounds** competing with world ambience.
4. **Ambient before musical.** Climate and presence precede score.
5. **Reduced motion / sensitivity** paths must remain usable without requiring audio.

---

# 9. Future Systems

Every future system must respect this budget before shipping surface motion, light, or attention claims:

- Navbar / chrome
- World Portals
- Guilds
- Achievements
- AI Companion
- Floating Islands
- VR spatial thresholds
- Desktop shell
- Individual Anime Worlds

Scenes orchestrate. Widgets perform. No system may seize primary focus from an active invitation without an explicit, documented exception.

---

# 10. Non Goals

AetherAnime must never become:

- Flashy
- Noisy
- Particle-heavy
- Over-animated
- A game HUD
- A sci-fi dashboard
- A generic marketing landing page

**The Arrival experience remains the quality benchmark.** New experiences should feel like the same world — quieter or deeper — not like a different product shouting louder.

---

# Document Control

| Field | Value |
| --- | --- |
| Document | `docs/design/EXPERIENCE_BUDGET.md` |
| Role | Permanent Experience Budget |
| Relationship | Complements `PORTAL_INVITATION.md` (invitation language) with platform-wide limits |
| Evolution | Record why when limits change. Do not silently raise ceilings for one feature. |

When this document evolves, record why. Do not silently reshape the budget to fit a temporary idea.

---

*End of Experience Budget.*
