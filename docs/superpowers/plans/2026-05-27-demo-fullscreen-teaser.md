# Demo Full-Screen Teaser Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** On the Bank Transfer Hijacking demo slide, show the attacker scam page full-screen (no badge) until the first presenter keypress, then animate it out to reveal the interactive ClickjackDemo widget.

**Architecture:** A `position: absolute; inset: 0; z-index: 50` overlay div is added to the demo slide — same full-bleed pattern used by background shapes on the title slide. It holds the scam page visuals. On `$clicks >= 1` (first → keypress), a CSS animation scales it down to 55% and fades it out. A `v-click` on the ClickjackDemo wrapper registers the click step with Slidev and makes the demo widget appear in sync.

**Tech Stack:** Slidev (Vue 3 + Vite), Markdown slide source, scoped-by-prefix CSS in `<style>` blocks

---

### Task 1: Add the teaser overlay HTML

**Files:**
- Modify: `slides/02-the-attack.md:268-270`

The overlay must be inserted between the slide title and the `<div style="position:relative">` wrapper that contains ClickjackDemo. This places it at the top level of the slide content so `position: absolute; inset: 0` is relative to the full slide viewport (not the inner wrapper).

- [ ] **Step 1: Open the file and locate the insertion point**

Open `slides/02-the-attack.md`. Find this block (around line 268):

```
## Demo - Bank Transfer Hijacking

<div style="position:relative">
```

- [ ] **Step 2: Insert the overlay div between the title and the wrapper**

Replace:
```markdown
## Demo - Bank Transfer Hijacking

<div style="position:relative">
```

With:
```markdown
## Demo - Bank Transfer Hijacking

<div class="cj-teaser" :class="{ 'cj-teaser--out': $clicks >= 1 }" aria-hidden="true">
  <div class="cj-teaser-title">📩 You won an iPhone 19!</div>
  <p class="cj-teaser-body">Congratulations. Your iPhone 19 is reserved for you. Click below to claim it before it expires.</p>
  <button class="cj-teaser-btn" tabindex="-1">Claim your iPhone 19  now 🎁</button>
</div>

<div v-click style="position:relative">
```

Note: `v-click` is added to the existing wrapper. This registers one click step so the first `→` keypress increments `$clicks` to 1 (triggering the overlay animation) instead of immediately navigating to the next slide. It also removes `.slidev-vclick-hidden` from the demo widget in sync with the overlay exit.

---

### Task 2: Add the teaser CSS

**Files:**
- Modify: `slides/02-the-attack.md` — the `<style>` block starting at line 330

- [ ] **Step 1: Locate the `<style>` block in the demo slide section**

Open `slides/02-the-attack.md`. Find the line:
```css
<style>
/* ── Bank alert overlay (slide 5) ───────────────────────── */
```
(around line 330)

- [ ] **Step 2: Prepend the teaser CSS before the existing bank alert styles**

Insert after `<style>` and before `/* ── Bank alert overlay`:

```css
/* ── Full-screen teaser overlay ────────────────────────── */
.cj-teaser {
  position: absolute;
  inset: 0;
  z-index: 50;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px;
  text-align: center;
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
  color: #fff;
}

.cj-teaser-title {
  font-size: 1.8em;
  font-weight: 700;
  color: #ffd700;
}

.cj-teaser-body {
  color: #bbb;
  max-width: 400px;
  line-height: 1.4;
  margin: 0;
}

.cj-teaser-btn {
  padding: 12px 32px;
  background: var(--cj-safe);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  font-weight: 700;
  pointer-events: none;
  box-shadow: 0 4px 14px rgba(22, 163, 74, 0.45);
}

.cj-teaser--out {
  animation: cj-teaser-exit 480ms cubic-bezier(0.4, 0, 1, 1) forwards;
  pointer-events: none;
}

@keyframes cj-teaser-exit {
  from { transform: scale(1);    opacity: 1; }
  to   { transform: scale(0.55); opacity: 0; }
}

```

---

### Task 3: Verify visually in the browser

No test runner is configured for this project. Verification is manual.

- [ ] **Step 1: Start the dev server**

```bash
pnpm dev
```

Open `http://localhost:3030` in a browser.

- [ ] **Step 2: Navigate to the demo slide**

Press `→` through the slides until you reach **"Demo - Bank Transfer Hijacking"**. The slide number is the 5th slide (after cover → what is clickjacking → mechanics → the demo).

Expected: The slide shows **only the dark scam page** — gold title "📩 You won an iPhone 19!", grey body text, green button. No "ATTACKER PAGE" badge. No slider. No legend. The slide title ("Demo - Bank Transfer Hijacking") is hidden behind the overlay.

- [ ] **Step 3: Press → to trigger the animation**

Expected: The scam page **scales down and fades out** over ~480ms, revealing the ClickjackDemo widget (opacity slider, position controls, legend, slide title). The transition should feel like a quick zoom-out/retreat.

- [ ] **Step 4: Verify the demo still works end-to-end**

After the overlay exits:
- Drag the opacity slider → victim iframe fades in/out correctly
- Drag the top/left sliders → iframe repositions
- Click the green "Claim your iPhone 19 now 🎁" button → bank alert overlay appears, slide auto-advances after ~2.6 seconds

- [ ] **Step 5: Navigate back to the demo slide and check keyboard flow**

Press `←` to go back to the demo slide. Expected: overlay is **visible again** (it resets on slide re-entry since `$clicks` resets).

---

### Task 4: Commit

- [ ] **Step 1: Stage and commit**

```bash
git add slides/02-the-attack.md
git commit -m "feat: add full-screen teaser overlay to bank demo slide"
```
