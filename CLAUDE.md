# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # dev server at http://localhost:3030 with hot reload
pnpm build      # static SPA export
pnpm export     # export to PDF/PPTX
```

No linter or test runner is configured.

## Architecture

This is a [Slidev](https://sli.dev) presentation. Slidev compiles `slides.md` into a Vite/Vue 3 SPA. Each `---` separator in the markdown creates a new slide. Slide frontmatter (between `---` pairs) controls layout, transitions, and per-slide settings.

### Key files

- **`slides.md`** — the entire presentation. Slides are separated by `---`. The first frontmatter block is the global headmatter (sets theme, transition, colorSchema for all slides).
- **`components/ClickjackDemo.vue`** — reusable demo component used on three slides. Renders an attacker page underneath a victim `<iframe>` whose opacity is controlled by a range slider. Import is automatic (Slidev auto-imports from `components/`).
- **`public/victims/`** — standalone HTML pages served as static files. Referenced as `/victims/bank.html` etc. in `ClickjackDemo` props. They must work as self-contained pages at ~600×300 px viewport (they appear inside the demo iframe).

### Slidev-specific patterns used in this repo

**Layouts** — set per slide via frontmatter: `layout: center`, `layout: two-cols` (uses `::left::` / `::right::` slot markers in the slide body). Do not enable `mdc: true` globally — it conflicts with the `::slot::` syntax.

**Click steps** — `v-click` on an element hides it until the user presses →. Slidev adds `.slidev-vclick-hidden` to unrevealed elements. `$clicks` is a reactive integer (per-slide click counter) available in slide templates and `<script setup>` blocks via `useNav()` from `@slidev/client`.

**Animations triggered by v-click** — the pattern used here is `animation-play-state: paused` on `.element.slidev-vclick-hidden` and `running` otherwise. This freezes the CSS animation at frame 0 until Slidev reveals the element. For elements that aren't themselves `v-click` targets, use `$clicks >= N` in a `:class` binding to add an animation class instead of relying on `:has()` (which doesn't reliably retrigger paused animations on class mutation).

**Programmatic navigation** — import `useNav` from `@slidev/client` inside a slide's `<script setup>` block to call `next()` / `prev()` imperatically. Always clear timers in `onUnmounted`.

**Inline styles vs Tailwind** — the geist theme does not apply gradient text to headings, so plain Tailwind color classes (`text-gray-900`, `text-red-600`) work without `-webkit-text-fill-color` overrides. If the theme is changed to seriph, all heading colors must use explicit inline `-webkit-text-fill-color` to escape its gradient.

**`<style>` blocks in slides** — styles are global (not scoped to the slide), so use prefixed class names (e.g. `cj-*`) to avoid bleed into other slides.

### Victim pages (`public/victims/`)

Each page is a self-contained HTML file with a centered "sensitive" button. The button must be visually centered so it aligns with the attacker's CTA button in `ClickjackDemo`. Do not add `X-Frame-Options` or CSP headers to these pages — they are intentionally embeddable for demo purposes.

### Presentation tone

The presentation is designed to be **fun and engaging** — dry security content loses the audience. When adding or editing slides:
- Prefer concrete, relatable examples over abstract descriptions
- Use humor, vivid scenarios, and surprising facts where appropriate
- Attacker page copy in demos should be entertainingly cheesy ("You've been selected!", "Claim your prize!")
- Keep slides punchy: short bullet points, strong visuals, minimal walls of text
- Animations and interactive elements are encouraged — they hold attention

### Color / accessibility conventions

- `colorSchema: light` is set globally; all colors must pass WCAG AA on white.
- Decorative elements carry `aria-hidden="true"` and `pointer-events: none`.
- Background blur shapes use `position:absolute; inset:0; overflow:hidden; z-index:0` with content at `z-index:1`.
- Card backgrounds use `bg-*-50` with `border-*-200`; avoid `bg-*-800/900` (dark-mode only).
