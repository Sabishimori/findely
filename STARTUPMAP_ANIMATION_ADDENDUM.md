# StartupMap — Animation Addendum

This is a follow-up patch to the main build spec (`BUILD_SPEC.md`), which is already running. Don't restart or re-read the whole spec — just apply this on top of wherever the build currently is.

---

## What this adds

Two lightweight animation libraries, scoped tight so the app stays minimal (per the original spec's UI direction) instead of turning cinematic.

```
Motion   (formerly Framer Motion) — panel open/close + hover states only
Lenis    — smooth scroll feel on the board's scrollable columns
```

**Explicitly not adding:** GSAP, Three.js, Anime.js, Trig JS — these are built for cinematic marketing-site effects (scroll-triggered reveals, 3D, parallax). This is a personal job tracker, not a landing page. Adding them would work against the minimal-UI goal already set.

---

## Where this applies

- **Detail slide-over panel**: animate in/out with Motion — around 200ms, ease-out. Replaces an instant show/hide with a slide transition.
- **Board cards**: subtle hover state — small opacity or scale shift on hover, nothing bouncy or attention-grabbing.
- **Board columns**: wrap the scrollable column container with Lenis for smoother scroll feel. This should be invisible in effect — you shouldn't consciously notice it, just feel it's smoother than default browser scroll.
- **Map markers**: no animation library needed here — Mapbox's own hover/selected ring state (already in the base spec) is enough.

---

## What NOT to do with this

- No scroll-triggered reveal animations (elements fading/sliding in as you scroll)
- No staggered entrance animations on the board columns loading
- No parallax anywhere
- No animated counters, number tickers, or "playful" micro-interactions beyond the panel/hover states above
- If an animation needs explaining, or someone would go "ooh" at it, it's too much for this tool — cut it

---

## Implementation notes for the agent

- Install: `motion` and `lenis` (npm packages) — nothing else animation-related.
- Keep animation durations short (150–250ms range). No animation should make the app feel slower to use.
- This is a small addition to whatever sprint is currently in progress or the next polish pass — not a new multi-step sprint. Apply it, verify the panel/hover/scroll feel right, then continue with the existing build sequence from `BUILD_SPEC.md`.
- Do not treat this addendum as license to add more animation later without being asked again — the constraint list above still holds.
