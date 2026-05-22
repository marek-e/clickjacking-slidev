# Color System Unification — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace ~55 color values across 8 files to implement a unified palette — one value per semantic role, all neutrals on slate, pastel pattern consistent everywhere.

**Architecture:** Pure color value substitutions only — hex literals and Tailwind class names. No logic changes. Each file is fully independent; tasks can run in any order. Verification is visual via the Slidev dev server (`pnpm dev` at `http://localhost:3030`), which hot-reloads on every save.

**Tech Stack:** Tailwind CSS v3, Slidev, Vue 3. No test runner configured — all verification is visual.

---

## Token reference (copy-paste ready)

| Old | New | Role |
|-----|-----|------|
| `#111827` (gray-900) | `#0f172a` (slate-900) | headings |
| `#1f2937` (gray-800) | `#0f172a` (slate-900) | headings |
| `#374151` (gray-700) | `#334155` (slate-700) | body text |
| `#6b7280` (gray-500) | `#64748b` (slate-500) | muted |
| `#4b5563` (gray-600) | `#64748b` (slate-500) | muted |
| `#9ca3af` (gray-400) | `#94a3b8` (slate-400) | secondary labels |
| `#e5e7eb` (gray-200) | `#e2e8f0` (slate-200) | borders |
| `#d1d5db` (gray-300) | `#e2e8f0` (slate-200) | borders |
| `#f3f4f6` (gray-100) | `#f1f5f9` (slate-100) | subtle dividers |
| `#f9fafb` (gray-50)  | `#f8fafc` (slate-50)  | surfaces |
| `#22c55e` (green-500)| `#16a34a` (green-600) | safe accent |
| `#28a745` (Bootstrap)| `#16a34a` (green-600) | safe accent |
| `#ef4444` (red-500)  | `#dc2626` (red-600)   | danger accent |
| `#ff4444` (non-TW)   | `#dc2626` (red-600)   | danger accent |
| `#0369a1` (sky-700)  | `#1d4ed8` (blue-700)  | blue text |
| `#1e40af` (blue-800) | `#1d4ed8` (blue-700)  | blue text |
| `#3b82f6` (blue-500) | `#2563eb` (blue-600)  | blue accent |
| `#64b5f6` (non-TW)   | `#60a5fa` (blue-400)  | blue-light |
| `#38bdf8` (sky-400)  | `#60a5fa` (blue-400)  | blue-light |
| `#7c3aed` (violet)   | `#dc2626` (red-600)   | slider accent |
| `#92400e` (amber-800)| `#b45309` (amber-700) | amber text |
| `#dcfce7` (green-100)| `#bbf7d0` (green-200) | green border |
| `#fee2e2` (red-100)  | `#fef2f2` (red-50)    | red surface |
| `#fca5a5` (red-300)  | `#fecaca` (red-200)   | red border |
| `#f0fff4` (non-TW)   | `#f0fdf4` (green-50)  | green surface |
| `#eef2f7` (non-TW)   | `#f1f5f9` (slate-100) | subtle divider |
| `#1a3a5c` (non-TW)   | `#1e293b` (slate-800) | dark nav bg |

---

## Task 1: components/AgendaItem.vue

**Files:**
- Modify: `components/AgendaItem.vue`

- [ ] **Step 1: Apply all 5 changes**

  In `components/AgendaItem.vue` make these exact substitutions:

  ```css
  /* .agenda-item */
  background: #f8fafc;          /* was #f9fafb */
  border: 1px solid #e2e8f0;    /* was #e5e7eb */
  color: #0f172a;               /* was #1f2937 */

  /* .agenda-n */
  background: #e2e8f0;          /* was #e5e7eb */
  color: #334155;               /* was #374151 */

  /* .agenda-demo */
  background: #fef2f2;          /* was #fee2e2 */
  border: 1px solid #fecaca;    /* was #fca5a5 */
  /* color: #dc2626 — already correct, no change */
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add components/AgendaItem.vue
  git commit -m "style: unify AgendaItem colors to slate/pastel palette"
  ```

---

## Task 2: components/OffsetCard.vue

**Files:**
- Modify: `components/OffsetCard.vue`

- [ ] **Step 1: Rename 3 Tailwind class occurrences**

  In `components/OffsetCard.vue` (all in the template, not in a `<style>` block):

  Occurrence 1 — inline header branch:
  ```diff
  - class="font-bold text-gray-900 leading-tight"
  + class="font-bold text-slate-900 leading-tight"
  ```

  Occurrence 2 — non-inline header branch:
  ```diff
  - class="font-bold text-gray-900"
  + class="font-bold text-slate-900"
  ```

  Occurrence 3 — body slot:
  ```diff
  - class="text-sm text-gray-600 mt-1 flex-1"
  + class="text-sm text-slate-600 mt-1 flex-1"
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add components/OffsetCard.vue
  git commit -m "style: unify OffsetCard colors to slate palette"
  ```

---

## Task 3: components/InfoPopover.vue

**Files:**
- Modify: `components/InfoPopover.vue`

- [ ] **Step 1: Apply 2 changes**

  In `components/InfoPopover.vue`:

  ```css
  /* .ip-btn:hover, .ip-btn--active */
  border-color: #2563eb;    /* was #3b82f6 (blue-500 → blue-600) */

  /* .ip-body */
  color: #334155;           /* was #374151 (gray-700 → slate-700) */
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add components/InfoPopover.vue
  git commit -m "style: unify InfoPopover colors to slate/blue-600 palette"
  ```

---

## Task 4: components/ClickjackDemo.vue

**Files:**
- Modify: `components/ClickjackDemo.vue`

- [ ] **Step 1: Slide UI — stage border + slider accent**

  ```css
  /* .cj-stage */
  border: 2px solid #e2e8f0;    /* was #d1d5db (gray-300 → slate-200) */

  /* .cj-slider */
  accent-color: #dc2626;        /* was #7c3aed (violet-600 → red-600) */
  ```

- [ ] **Step 2: Slide UI — status, legend, and dots**

  ```css
  /* .cj-status */
  color: #64748b;               /* was #6b7280 (gray-500 → slate-500) */

  /* .cj-legend */
  color: #64748b;               /* was #4b5563 (gray-600 → slate-500) */

  /* .cj-opacity-badge */
  color: #60a5fa;               /* was #64b5f6 (non-Tailwind → blue-400) */

  /* .dot-victim */
  background: #60a5fa;          /* was #64b5f6 (non-Tailwind → blue-400) */

  /* .cj-pos-lbl */
  color: #60a5fa;               /* was #38bdf8 (sky-400 → blue-400) */
  ```

- [ ] **Step 3: Demo coherence — attacker page badge + button**

  ```css
  /* .cj-badge */
  background: #dc2626;          /* was #ff4444 (non-Tailwind → red-600) */

  /* .cj-attacker-btn */
  background: #16a34a;          /* was #28a745 (Bootstrap → green-600) */
  box-shadow: 0 4px 14px rgba(22, 163, 74, 0.45);  /* was rgba(40, 167, 69, 0.45) */
  ```

- [ ] **Step 4: Commit**

  ```bash
  git add components/ClickjackDemo.vue
  git commit -m "style: unify ClickjackDemo colors — slate neutrals, red-600 slider, green-600 button"
  ```

---

## Task 5: slides.md

**Files:**
- Modify: `slides.md`

- [ ] **Step 1: Apply 2 changes**

  In `slides.md`:

  ```diff
  - <p class="m-0 text-sm font-medium text-gray-800 tracking-wide">
  + <p class="m-0 text-sm font-medium text-slate-700 tracking-wide">
  ```

  ```css
  /* .cj-ripple — in the <style> block */
  background: rgba(220, 38, 38, 0.45);   /* was rgba(185, 28, 28, 0.45) */
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add slides.md
  git commit -m "style: unify slides.md cover colors to slate/red-600 palette"
  ```

---

## Task 6: slides/02-the-attack.md

This file has 5 embedded `<style>` blocks and 3 inline Tailwind class updates in slide bodies. Work through them in order top-to-bottom.

**Files:**
- Modify: `slides/02-the-attack.md`

- [ ] **Step 1: How It Works slide — `<style>` block (~lines 145–262)**

  ```css
  /* .cj-mail-dot */
  background: #16a34a;                              /* was #22c55e */
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.25);   /* was rgba(34, 197, 94, 0.25) */

  /* .cj-mail-card */
  border: 1px solid #e2e8f0;                        /* was #e5e7eb */

  /* .cj-mail-head */
  border-bottom: 1px solid #f1f5f9;                 /* was #eef2f7 */

  /* .cj-mail-title */
  color: #0f172a;                                   /* was #111827 */

  /* .cj-mail-snippet */
  color: #64748b;                                   /* was #6b7280 */

  /* .cj-mail-copy */
  color: #334155;                                   /* was #374151 */
  ```

- [ ] **Step 2: Bank Demo slide — `<style>` block (~lines 330–442)**

  ```css
  /* .cj-bank-toast */
  color: #e2e8f0;                                   /* was #e5e7eb */

  /* .cj-bank-toast-dot */
  background: #dc2626;                              /* was #ef4444 */
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.28);   /* was rgba(239, 68, 68, 0.28) */

  /* @keyframes cj-bank-dot-pulse */
  from { box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.28); }  /* was rgba(239,68,68,0.28) */
  to   { box-shadow: 0 0 0 6px rgba(220, 38, 38, 0); }     /* was rgba(239,68,68,0) */

  /* .cj-bank-receipt */
  border: 1px solid #e2e8f0;                        /* was #e5e7eb */

  /* .cj-bank-receipt-title */
  color: #0f172a;                                   /* was #111827 */

  /* .cj-bank-receipt-sub */
  color: #64748b;                                   /* was #6b7280 */

  /* .cj-bank-receipt-row */
  color: #334155;                                   /* was #374151 */

  /* .cj-bank-receipt-row span */
  color: #94a3b8;                                   /* was #9ca3af */
  ```

- [ ] **Step 3: Double Con slide — `<style>` block (~lines 510–700)**

  ```css
  /* .dc-panel */
  border: 2px solid #e2e8f0;                        /* was #e5e7eb */

  /* .dc-fake-title */
  color: #0f172a;                                   /* was #111827 */

  /* .dc-fake-sub */
  color: #64748b;                                   /* was #6b7280 */

  /* .dc-fake-row */
  color: #334155;                                   /* was #374151 */
  border-bottom: 1px solid #f1f5f9;                 /* was #f3f4f6 */

  /* .dc-fake-row span */
  color: #94a3b8;                                   /* was #9ca3af */

  /* .dc-bank-log-header */
  color: #64748b;                                   /* was #6b7280 */

  /* .dc-bank-log-dot */
  background: #dc2626;                              /* was #ef4444 */
  box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.3);    /* was rgba(239,68,68,0.3) */

  /* .dc-bank-log-row */
  color: #0f172a;                                   /* was #111827 */
  border-bottom: 1px solid #f1f5f9;                 /* was #f3f4f6 */

  /* .dc-bank-log-row span */
  color: #94a3b8;                                   /* was #9ca3af */

  /* .dc-bank-log-note */
  color: #64748b;                                   /* was #6b7280 */

  /* .dc-inline-code */
  color: #1d4ed8;                                   /* was #0369a1 (sky-700 → blue-700) */

  /* .dc-trick-title */
  color: #0f172a;                                   /* was #111827 */

  /* .dc-trick-code */
  color: #0f172a;                                   /* was #111827 */

  /* .dc-trick-caption */
  color: #0f172a;                                   /* was #111827 */
  ```

- [ ] **Step 4: Stakes + Prerequisites slides — `<style>` blocks**

  Stakes slide (`<style>` after the OffsetCards grid):
  ```css
  /* .ri-intro */
  color: #334155;               /* was #374151 */
  ```

  Prerequisites slide (`<style>` at the bottom of that slide):
  ```css
  /* .pq-intro */
  color: #334155;               /* was #374151 */

  /* .pq-num */
  color: #0f172a;               /* was #111827 */

  /* .pq-title */
  color: #0f172a;               /* was #111827 */

  /* .pq-desc */
  color: #64748b;               /* was #6b7280 */
  ```

- [ ] **Step 5: Session Cookie slide — `<style>` block**

  ```css
  /* .sc-intro */
  color: #334155;               /* was #374151 */

  /* .sc-step-title */
  color: #0f172a;               /* was #111827 */

  /* .sc-step-desc */
  color: #64748b;               /* was #6b7280 */

  /* .sc-fix */
  border: 1px solid #bbf7d0;   /* was #dcfce7 (green-100 → green-200, pastel pattern) */

  /* .sc-fix-label */
  color: #b45309;               /* was #92400e (amber-800 → amber-700) */

  /* .sc-fix-text */
  color: #334155;               /* was #374151 */

  /* .sc-caveat-text */
  color: #334155;               /* was #374151 */
  ```

- [ ] **Step 6: Inline Tailwind classes in slide bodies**

  Pre-armed Forms slide — 3 class renames in the slide HTML (not in a `<style>` block):

  ```diff
  - <div class="mt-3 text-sm text-gray-600">
  + <div class="mt-3 text-sm text-slate-600">
  ```

  ```diff
  - <div class="text-gray-500 mt-0.5">Fake: "Dismiss banner"</div>
  + <div class="text-slate-500 mt-0.5">Fake: "Dismiss banner"</div>
  ```

  ```diff
  - <div class="text-gray-500 mt-0.5">Fake: "Confirm free trial"</div>
  + <div class="text-slate-500 mt-0.5">Fake: "Confirm free trial"</div>
  ```

  ```diff
  - <div class="text-gray-400 text-[10px] mt-1">↓ real: Accept ToS</div>
  + <div class="text-slate-400 text-[10px] mt-1">↓ real: Accept ToS</div>
  ```

  ```diff
  - <div class="text-gray-400 text-[10px] mt-1">↓ real: Pay $500</div>
  + <div class="text-slate-400 text-[10px] mt-1">↓ real: Pay $500</div>
  ```

- [ ] **Step 7: Commit**

  ```bash
  git add slides/02-the-attack.md
  git commit -m "style: unify 02-the-attack.md colors — slate neutrals, red-600/green-600 accents"
  ```

---

## Task 7: slides/04-defenses.md

**Files:**
- Modify: `slides/04-defenses.md`

- [ ] **Step 1: CSP slide — `.ip-code` style block**

  ```css
  /* .ip-code (inside CSP frame-ancestors slide <style> block) */
  color: #1d4ed8;               /* was #1e40af (blue-800 → blue-700) */
  ```

- [ ] **Step 2: Frame Busting Bypass slide — style block**

  ```css
  /* .fb-mock-nav */
  background: #1e293b;          /* was #1a3a5c (non-Tailwind → slate-800) */

  /* .fb-mock-sub */
  color: #64748b;               /* was #6b7280 */
  ```

- [ ] **Step 3: Defenses in Action slide — inline styles in HTML**

  Find the protected box markup and change one value:
  ```diff
  - <div style="border:2px solid #4ade80; border-radius:8px; height:190px; background:#f0fff4; ...
  + <div style="border:2px solid #4ade80; border-radius:8px; height:190px; background:#f0fdf4; ...
  ```
  (`#f0fff4` → `#f0fdf4`, non-Tailwind → green-50. The border `#4ade80` is already green-400, leave it.)

  Also update the inline code badge:
  ```diff
  - <code style="font-size:0.72em; color:#374151; background:#e5e7eb; padding:4px 10px; border-radius:4px;">
  + <code style="font-size:0.72em; color:#334155; background:#e2e8f0; padding:4px 10px; border-radius:4px;">
  ```

- [ ] **Step 4: CSRF comparison slide — style block** (this slide has `hide: true` but update for consistency)

  ```css
  /* .csrf-intro */
  color: #334155;               /* was #374151 */

  /* .csrf-card */
  border: 1.5px solid #e2e8f0;  /* was #e5e7eb */

  /* .csrf-key */
  color: #64748b;               /* was #6b7280 */

  /* .csrf-row */
  color: #334155;               /* was #374151 */
  ```

- [ ] **Step 5: Final slide — Tailwind class renames**

  In the "That's it!" slide at the bottom of `04-defenses.md`:

  ```diff
  - <div class="mt-4 text-gray-600 text-lg">
  + <div class="mt-4 text-slate-600 text-lg">
  ```

  Three resource cards (all three follow this pattern):
  ```diff
  - <div class="bg-gray-100 rounded-xl p-4 border border-gray-200">
  + <div class="bg-slate-100 rounded-xl p-4 border border-slate-200">
  ```

  ```diff
  - <div class="text-gray-600 text-xs mt-1">
  + <div class="text-slate-600 text-xs mt-1">
  ```

- [ ] **Step 6: Commit**

  ```bash
  git add slides/04-defenses.md
  git commit -m "style: unify 04-defenses.md colors — slate neutrals, blue-700, green-50"
  ```

---

## Task 8: Visual verification

**Files:** none (read-only verification pass)

- [ ] **Step 1: Start dev server if not already running**

  ```bash
  pnpm dev
  ```
  Open `http://localhost:3030`.

- [ ] **Step 2: Verify cover slide (slide 1)**
  - Subtitle text uses a cool slate tone (not warm gray)
  - Ripple animation on the cursor click is red-600

- [ ] **Step 3: Verify Agenda slide**
  - AgendaItem cards have slate-50 background, slate-200 border
  - DEMO badges are red-50/red-200/red-600 (pastel, not red-100/red-300)

- [ ] **Step 4: Verify How It Works slide**
  - Mail notification dot is green-600 (slightly darker than before)
  - Mail card body text has a cool slate tone

- [ ] **Step 5: Verify Bank Demo slide**
  - Bank alert dot is red-600 (matches danger palette)
  - ClickjackDemo slider thumb is red (not violet)
  - Demo legend victim dot is blue-400

- [ ] **Step 6: Verify Double Con slide**
  - Bank log dot is red-600
  - Inline code snippets (`.dc-inline-code`) use blue-700

- [ ] **Step 7: Verify Prerequisites + Session Cookie slides**
  - Step cards have slate-50 backgrounds
  - "↳ Fix" lines are green-600
  - SameSite fix box border is green-200 (pastel)

- [ ] **Step 8: Verify Pre-armed Forms slide**
  - Intro text and chain click labels use slate tones

- [ ] **Step 9: Verify Defenses slides**
  - Fake browser nav bar is slate-800 (was a custom blue-navy)
  - InfoPopover button hover is blue-600 border
  - Final slide resource cards use slate-100 backgrounds

- [ ] **Step 10: Verify ClickjackDemo attacker page**
  - "ATTACKER PAGE" badge is a clean red-600 (not the slightly off `#ff4444`)
  - "Claim Prize" button is green-600 (matches `#16a34a` throughout)

- [ ] **Step 11: Final commit**

  ```bash
  git add -p   # sanity check — should be empty (all changes already committed)
  git log --oneline -8
  ```
  Expected: 7 new commits above the last brainstorm commit, nothing staged.
