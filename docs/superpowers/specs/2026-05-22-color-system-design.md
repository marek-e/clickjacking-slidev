# Color System Unification — Design Spec

**Date:** 2026-05-22  
**Scope:** Slide UI only. Demo scenes (attacker pages, toasts, receipts) addressed for coherence only — their aesthetic is intentionally "scammy/dark" and is preserved.

---

## Problem

The presentation has ~60 distinct color values across 8 files. The same semantic role (e.g. "danger/red") is split across 4–5 values. Tailwind `gray-*` and `slate-*` scales are used interchangeably for identical roles. Five non-Tailwind hex values are scattered through the codebase.

---

## Decision

**Option B — Palette Consolidation:** one value per semantic role, all neutrals on Tailwind's slate scale, pastel pattern extended consistently everywhere.

---

## The Unified Palette

### Semantic accent colors
Pastel pattern throughout: `*-50` bg · `*-200` border · `*-600` accent · `*-700` text on light bg.

| Role | Tokens | Replaces |
|------|--------|----------|
| Danger / attacker / error | red-600/50/200/700 | `#ff4444`, `#ef4444`, `#dc2626`, `#b91c1c`, `#fca5a5` |
| Defense / info | blue-600/50/200/700 | `#2563eb`, `#1d4ed8`, `#1e40af`, `#0369a1`, `#64b5f6` |
| Safe / fix / success | green-600/50/200/700 | `#16a34a`, `#15803d`, `#22c55e`, `#28a745` |
| Warning / escalation | amber-600/50/200/700 | `#d97706`, `#fde68a`, `#92400e` split across amber-600/300/800 |

### Neutral scale — slate only
Replaces all `gray-*` hex values and Tailwind `gray-*` classes.

| Token | Hex | Role |
|-------|-----|------|
| slate-900 | `#0f172a` | Headings, strong labels (replaces `#111827` gray-900) |
| slate-700 | `#334155` | Body text, descriptions (replaces `#374151` gray-700) |
| slate-500 | `#64748b` | Muted text, captions (replaces `#6b7280` gray-500) |
| slate-400 | `#94a3b8` | Step numbers, meta labels (already correct) |
| slate-300 | `#cbd5e1` | Decorative arrows/separators (already correct) |
| slate-200 | `#e2e8f0` | All borders/dividers (replaces `#e5e7eb` gray-200) |
| slate-100 | `#f1f5f9` | Subtle interior dividers (replaces `#f3f4f6` gray-100) |
| slate-50  | `#f8fafc` | All card/step surfaces (replaces `#f9fafb` gray-50) |

### Interactive elements

| Context | From | To |
|---------|------|----|
| ClickjackDemo slider `accent-color` | `#7c3aed` violet-600 | `#dc2626` red-600 |
| Demo legend victim dot | `#64b5f6` (non-Tailwind) | `#60a5fa` blue-400 |

---

## File-by-File Changes

### `slides.md` — 2 changes
- Cover ripple: `rgba(185,28,28,…)` → `rgba(220,38,38,…)` (red-600)
- Cover heading class: `text-gray-800` → `text-slate-700`

### `slides/02-the-attack.md` — ~30 changes

**Mechanical gray→slate sweep (all slides in this file):**
- `#374151` → `#334155` (slate-700) — body text
- `#111827` → `#0f172a` (slate-900) — headings
- `#6b7280` → `#64748b` (slate-500) — muted text
- `#9ca3af` → `#94a3b8` (slate-400) — secondary labels
- `#e5e7eb` → `#e2e8f0` (slate-200) — borders
- `#f9fafb` → `#f8fafc` (slate-50) — card surfaces
- `#f3f4f6` → `#f1f5f9` (slate-100) — subtle dividers
- Tailwind classes `text-gray-600 / text-gray-400 / text-gray-500` → `text-slate-*` equivalents

**Semantic consolidations:**
- Mail notification dot `#22c55e` (green-500) → `#16a34a` (green-600)
- Bank log dot `#ef4444` (red-500) → `#dc2626` (red-600)
- Bank alert dot `#ef4444` (red-500) → `#dc2626` (red-600)
- `.dc-inline-code` text `#0369a1` (sky-700) → `#1d4ed8` (blue-700)
- `.sc-fix` border `#dcfce7` (green-100) → `#bbf7d0` (green-200) — aligns with pastel pattern
- `.sc-fix-label` `#92400e` (amber-800) → `#b45309` (amber-700)

### `slides/04-defenses.md` — 8 changes
- `.ip-code` text `#1e40af` (blue-800) → `#1d4ed8` (blue-700)
- `.fb-mock-nav` bg `#1a3a5c` (non-Tailwind) → `#1e293b` (slate-800)
- `.fb-mock-sub` text `#6b7280` → `#64748b` (slate-500)
- Defenses in Action protected bg `#f0fff4` (non-Tailwind) → `#f0fdf4` (green-50)
- Code badge bg/text `#e5e7eb`/`#374151` → `#e2e8f0`/`#334155` (slate-200/slate-700)
- CSRF card border `#e5e7eb` → `#e2e8f0` (slate-200)
- CSRF body/key text gray values → slate equivalents
- Final slide: `bg-gray-100 / border-gray-200 / text-gray-600` → `bg-slate-100 / border-slate-200 / text-slate-600`

### `components/AgendaItem.vue` — 5 changes
- Item bg `#f9fafb` → `#f8fafc` (slate-50)
- Item border + number bg `#e5e7eb` → `#e2e8f0` (slate-200)
- Item text `#1f2937` (gray-800) → `#0f172a` (slate-900)
- Number text `#374151` → `#334155` (slate-700)
- Demo badge: bg `#fee2e2` (red-100) → `#fef2f2` (red-50); border `#fca5a5` (red-300) → `#fecaca` (red-200) — aligns with pastel pattern

### `components/ClickjackDemo.vue` — 8 changes

**Slide UI (controls + legend):**
- Stage border `#d1d5db` (gray-300) → `#e2e8f0` (slate-200)
- Slider `accent-color` `#7c3aed` (violet-600) → `#dc2626` (red-600)
- Status text `#6b7280` + legend `#4b5563` → `#64748b` (slate-500)
- Victim legend dot `#64b5f6` → `#60a5fa` (blue-400)
- Position control label `#38bdf8` (sky-400) → `#60a5fa` (blue-400)

**Demo coherence (attacker page):**
- ATTACKER PAGE badge `#ff4444` → `#dc2626` (red-600)
- Claim Prize button `#28a745` (Bootstrap green) → `#16a34a` (green-600)

### `components/InfoPopover.vue` — 2 changes
- Button hover border `#3b82f6` (blue-500) → `#2563eb` (blue-600)
- Popover body text `#374151` → `#334155` (slate-700)

### `components/OffsetCard.vue` — 2 changes
- `text-gray-900` → `text-slate-900`
- `text-gray-600` → `text-slate-600`

---

## Untouched

- **`components/Callout.vue`** — already fully on Tailwind tokens, no changes needed
- All existing `red-50/200/700`, `green-50/200/700`, `amber-50/200/700` semantic surfaces — already correct
- Dark demo UI: `#0f172a`, `#1e293b` toasts — already slate-900/800
- Demo position code panel lime-400 value highlight — intentionally kept (terminal/syntax aesthetic)
- Attacker page gradient, gold title text, dark purple bg — intentionally preserved
- Demo red/green notification dots distinction (email = green, bank alert = red) — semantically correct, preserved

---

## Out of Scope

- `slides-en.md`, `slides-fr.md` (translations, not the live presentation)
- `public/victims/*.html` (victim pages inside the iframe — demo scene)
- Theme-level CSS (geist theme)
