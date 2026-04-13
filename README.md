# Clickjacking — The Art of the Invisible Click

An interactive security presentation built with [Slidev](https://sli.dev), covering clickjacking attacks and defenses with live in-slide demos.

## Getting started

```bash
pnpm install
pnpm dev        # dev server at http://localhost:3030
pnpm build      # static export
```

## Structure

```
slides.md                   # main presentation (16 slides)
components/
  ClickjackDemo.vue          # reusable interactive demo component
public/victims/
  bank.html                  # fake SecureBank "Confirm Transfer $500"
  oauth.html                 # fake OAuth consent (full account access)
  social.html                # fake ConnectHub "Like this Page"
slides-en.md                 # archived English draft
slides-fr.md                 # archived French draft
```

## Presentation outline

| # | Slide | Type |
|---|-------|------|
| 1 | Title — Clickjacking | Animated title |
| 2 | Agenda | Index |
| 3 | What is Clickjacking? | Concept |
| 4 | How it works — mechanics | Code |
| 5 | Demo 1 — Bank transfer hijack | **Live demo** |
| 6 | Key attack variants | Concept |
| 7 | Demo 2 — OAuth consent hijack | **Live demo** |
| 8 | Demo 3 — Likejacking | **Live demo** |
| 9 | Targets & real-world impact | Concept |
| 10 | Detection | Technique |
| 11 | Defense #1 — X-Frame-Options | Defense |
| 12 | Defense #2 — CSP frame-ancestors | Defense |
| 13 | Defense #3 — JS framebusting & bypass | Defense |
| 14 | Defenses in action | **Live demo** |
| 15 | Security checklist | Summary |
| 16 | Q&A / references | Closing |

## Interactive demos (`ClickjackDemo.vue`)

Each live demo slide embeds a `<ClickjackDemo>` component that shows:

- **Bottom layer**: the attacker's page (always visible — what the victim sees)
- **Top layer**: a victim iframe at controlled opacity (what is really being clicked)
- **Slider**: drag from 0 % (attack in progress, iframe invisible) to 100 % (victim page fully revealed)

```md
<ClickjackDemo
  victim-url="/victims/bank.html"
  attacker-title="🎉 Congratulations! You've been selected!"
  attacker-body="Click below to claim your €500 Amazon voucher."
  attacker-button="Claim Prize Now 🎁"
  victim-label="SecureBank — Confirm Transfer $500"
  :height="270"
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `victim-url` | `String` | — | Path to the victim HTML page (served from `public/`) |
| `victim-label` | `String` | `'Victim page'` | Legend label for the victim layer |
| `attacker-title` | `String` | `'🎉 Congratulations!'` | Headline on the attacker page |
| `attacker-body` | `String` | `'…'` | Body copy on the attacker page |
| `attacker-button` | `String` | `'Claim Your Prize'` | CTA button text on the attacker page |
| `height` | `Number` | `260` | Stage height in pixels |

## Title slide

The title slide (`layout: center`, geist theme, light mode) features:

- Large **Click<span>jacking</span>** heading with a red accent on "jacking"
- A thin red divider bar
- Two blurred decorative background shapes (red circle top-left, orange ellipse bottom-right)
- A **cursor click animation** triggered on the first keypress:
  - An SVG mouse cursor drops into position over "Click", presses down, bounces back
  - A red ripple expands from the cursor tip at the moment of press
  - "Click" scales up to 1.22× in sync with the press frame, then settles
  - After 1.2 s the presentation automatically advances to slide 2 (no second keypress needed)

### How the cursor animation works

The cursor element has `v-click`. Its CSS animation uses `animation-play-state: paused` while Slidev keeps it hidden (`.slidev-vclick-hidden`), freezing it at frame 0. When `v-click` removes that class the animation runs immediately from the start.

The word growth uses `$clicks` (Slidev's reactive per-slide click counter) to add a `.cj-growing` class. Adding a new `animation` property always starts the animation fresh — no pausing tricks needed.

Auto-advance uses `useNav()` from `@slidev/client`:

```js
watch(clicks, (val) => {
  if (val >= 1) timer = setTimeout(next, 1200)
})
```

## Theme & design choices

| Setting | Value | Reason |
|---------|-------|--------|
| Theme | `geist` | Clean, modern, no gradient-text on headings |
| `colorSchema` | `light` | Optimised for projection on screen |
| Transitions | `fade` | Works cleanly with iframe-heavy slides; no directional glitch on backwards navigation |

### Light-mode color palette

All slide content uses colors verified for WCAG AA contrast on white:

| Role | Class / value | Contrast |
|------|---------------|----------|
| Body text | `text-gray-900` `#111827` | 19.5 : 1 |
| Secondary text | `text-gray-700` `#374151` | 11.5 : 1 |
| Muted text | `text-gray-500` `#6b7280` | 5.6 : 1 |
| Accent / danger | `text-red-600` / `#dc2626` | 5.5 : 1 |
| Card backgrounds | `bg-*-50` with `border-*-200` | — |
| Warning callout | `bg-amber-50 border-amber-400` | — |

## Accessibility notes

- All decorative visuals (background shapes, cursor illustration) carry `aria-hidden="true"` and `pointer-events: none`
- Heading hierarchy: each slide uses a single `h1` or the Slidev `# Title` macro; no skipped levels
- The title `h1` uses explicit color values to prevent theme gradient overrides from making text invisible
- Victim demo pages (`public/victims/*.html`) use semantic HTML and sufficient contrast for readability when revealed at full opacity

## Known pitfalls (fixed during development)

| Issue | Root cause | Fix |
|-------|-----------|-----|
| Transitions broken | `mdc: true` conflicts with `::left::`/`::right::` slot syntax; `<iframe … />` self-closing tag swallowed subsequent DOM | Removed `mdc: true`; changed to `<iframe …></iframe>` |
| "Click" invisible on title | seriph theme applied `-webkit-text-fill-color: transparent` gradient to all `h1` elements | Switched to geist theme (no gradient text) |
| Word growth not triggering | `:has()` CSS selector doesn't reliably re-trigger paused animations on class mutation | Replaced with `$clicks` reactive binding adding `.cj-growing` class |
| Slide not vertically centered | `height: 100%` requires an explicit height on the parent | Used Slidev's built-in `layout: center` |
