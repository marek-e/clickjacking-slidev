# Demo Full-Screen Teaser — Design Spec

**Date:** 2026-05-27  
**Scope:** Bank Transfer Hijacking demo slide (`slides/02-the-attack.md`)

## Goal

Before showing the interactive demo widget, display the attacker's scam page full-screen with no educational framing (no "ATTACKER PAGE" badge, no controls). On the first presenter keypress (→), the fake page zooms out and fades away to reveal the ClickjackDemo widget underneath.

## What Changes

**File:** `slides/02-the-attack.md` — the "Demo - Bank Transfer Hijacking" slide only.  
**Component:** `components/ClickjackDemo.vue` — **not modified**.

### New element: `.cj-teaser` overlay

Added at the top level of the slide content (sibling of the existing `<div style="position:relative">` wrapper), before it in source order.

```html
<div class="cj-teaser" :class="{ 'cj-teaser--out': $clicks >= 1 }" aria-hidden="true">
  <!-- dark gradient bg, gold title, grey body, green CTA — no badge -->
</div>
```

Positioning: `position: absolute; inset: 0; z-index: 50` — same pattern as background blur shapes on the title slide. Covers the full slide viewport including padding.

Content: mirrors the ClickjackDemo attacker layer visuals exactly (same copy from existing component props: title `📩 You won an iPhone 19!`, body, button). No "ATTACKER PAGE" badge. No interactive controls. `pointer-events: none` while animating out.

### Click step registration

`v-click` is added to the `<div style="position:relative">` wrapper that contains ClickjackDemo. This:
1. Registers one click step so the first `→` keypress increments `$clicks` instead of navigating to the next slide.
2. Removes `.slidev-vclick-hidden` from the demo widget in sync with the overlay exit.

### Exit animation

On `$clicks >= 1`, the overlay gets `.cj-teaser--out`:

```css
@keyframes cj-teaser-exit {
  from { transform: scale(1);    opacity: 1; }
  to   { transform: scale(0.55); opacity: 0; }
}
.cj-teaser--out {
  animation: cj-teaser-exit 480ms cubic-bezier(0.4, 0, 1, 1) forwards;
  pointer-events: none;
}
```

Duration 480ms, ease-in so it retreats quickly. Scale shrinks to 55% while fading, giving a clear zoom-out "pull back" feel. The demo widget beneath becomes visible at the same moment the animation starts.

## What Is Not Changed

- `ClickjackDemo.vue` — zero modifications.
- `onBtnClick` / bank alert overlay — untouched.
- The GitHub stars demo slide — untouched.
- All other slides and components — untouched.

## Presenter Flow After Change

1. Arrive at demo slide — audience sees only the scam page, full-screen, no labels.
2. Press `→` once — scam page zooms out and fades (~480ms), demo widget appears.
3. Demo proceeds as before: drag opacity slider, click button, bank alert fires, auto-advance.
