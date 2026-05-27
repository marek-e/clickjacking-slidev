# Design: Advanced Clickjacking Variants — Bonus Slides

**Date:** 2026-05-27  
**Status:** Approved  
**References:** https://www.evil.blog/2024/12/doubleclickjacking-what.html · https://marektoth.com/blog/dom-based-extension-clickjacking/

---

## Overview

Extend the clickjacking presentation with two bonus sections placed after the existing "That's it!" closing slide. Each section covers a modern variant that bypasses all classical defenses, contains 4 slides, and includes an interactive demo.

Topics:
1. **DoubleClickjacking** — popup-based timing attack that needs no iframe
2. **DOM-Based Extension Clickjacking** — targets browser extension DOM elements injected into pages

---

## New Files

| File | Purpose |
|------|---------|
| `slides/05-dcj.md` | DoubleClickjacking section (4 slides) |
| `slides/06-ext-cj.md` | DOM-based extension CJ section (4 slides) |
| `components/DblClickDemo.vue` | Interactive demo component for DCJ |
| `public/victims/ext-clickjack-demo.html` | Self-contained demo page for extension CJ |

**slides.md changes:** Add two `src:` imports after the existing closing slide block.

---

## Section 1: DoubleClickjacking (`slides/05-dcj.md`)

### Slide 1 — What is DoubleClickjacking?

**Layout:** default (left-aligned content, consistent with rest of deck)

Content:
- Section badge: `2024 · Paulos Yibelo`
- Opening callout (variant `error`): "You put `X-Frame-Options: DENY` on every page. No iframe needed."
- Three OffsetCard components in a row (matching the layout on "What is Clickjacking?"):
  - "Classic clickjacking" — requires embedding victim in an iframe; blocked by frame headers
  - "DoubleClickjacking" — uses a legitimate popup window; no iframe, no framing
  - "Result" — all existing frame-based defenses are completely bypassed
- Bottom callout (variant `warning`): "Bypasses X-Frame-Options, CSP frame-ancestors, AND SameSite cookies."

### Slide 2 — How It Works (Mechanics)

**Layout:** default with two-column grid

Content (left column — step diagram, 3 numbered steps):
1. Attacker opens decoy popup: "🔒 Double-click to verify you're human"
2. `mousedown` (first press) fires → `window.opener.location` silently swaps the parent tab to a real OAuth consent screen
3. `mouseup` (completing the double-click) lands on the "Allow Access" button the victim never chose to click

Content (right column, revealed on v-click):
- Code snippet showing the `mousedown` / opener swap technique
- Callout (variant `note`): "The entire UI swap happens in the ~100 ms between first press and second click. Imperceptible to humans, reliable for scripts."

### Slide 3 — Demo (Interactive)

**Layout:** `center`

Uses `DblClickDemo.vue`. The component has two visual states:

**State A — Decoy popup** (initial):
- Dark background overlay styled like a browser popup
- Title: "🔒 Security Verification Required"
- Body: "Please double-click the button below to prove you're not a robot."
- Large "Double-click to verify" button
- On `mousedown` of this button → transition to State B

**State B — OAuth consent** (after mousedown):
- Smooth CSS transition (scale + fade) replaces the popup UI with a fake "Slack – Authorization Request" consent screen
- Scopes listed: `channels:read`, `users:read`, `chat:write`
- "Allow" button prominent
- On `mouseup` (completing the double-click) → emit event, show damage card

**Damage card** (after double-click completes):
- Toast notification: "Slack connected"
- Receipt card with: App name "HackerApp", permissions granted, timestamp "now"
- Footer: "You double-clicked once. That's all it took. 🔓"

`DblClickDemo.vue` implementation notes:
- Manages state with `ref`: `'idle' | 'swapping' | 'done'`
- `mousedown` handler sets state to `'swapping'`; `mouseup` on the OAuth button sets to `'done'`
- CSS transitions handle the visual swap; no JS animation library needed
- `emit('complete')` so the parent slide can call `next()` after a delay

### Slide 4 — Vulnerable Targets & Defense

**Layout:** two-column grid

Left (vulnerable targets):
- OAuth consent flows (Slack, Salesforce, Shopify, GitHub Apps)
- Crypto wallet transaction confirmations
- Payment confirmations
- Account setting changes, 2FA device registration

Right (defense, v-click reveal):
- `pointer-events: none` on sensitive buttons by default; enable only after detecting genuine hover/cursor movement over the button
- Brief activation delay (100–500 ms) on OAuth consent buttons after page load
- Browsers: Chrome/Firefox adding event-timing heuristics (in progress)
- Explicit `rel="noopener noreferrer"` on all outbound links that open windows (prevents opener access)

Bottom callout (variant `error`): "Frame headers don't save you here. The attack needs no iframe."

---

## Section 2: DOM-Based Extension Clickjacking (`slides/06-ext-cj.md`)

### Slide 1 — The Twist: Your Security Tool Is the Target

**Layout:** default

Content:
- Opening hook: "Classic clickjacking hides another website. This hides your password manager."
- Two-column contrast panel (custom CSS):
  - Left "Classic": attacker loads bank.com in invisible iframe, overlays fake button
  - Right "Extension CJ": attacker sets `el.style.opacity = '0'` on extension's injected autofill popup, overlays fake "Accept Cookies" button
- Single JS line callout: `document.querySelector('.pm-autofill').style.opacity = '0'`
- Callout (variant `error`): "No iframe. No CORS. No frame headers. One line of JavaScript."

### Slide 2 — Why Extensions Can't Defend Themselves

**Layout:** default

Content:
- Explanation: extensions inject elements directly into the page DOM via content scripts; the page's JS context can freely read and mutate those elements
- Password managers are especially dangerous: they autofill credentials on focus/click, so a single click → credential exfiltration
- Attack variants table (3 rows):
  1. `opacity: 0` on extension root element
  2. `opacity: 0` on parent / body (hides everything)
  3. Semi-transparent overlay covering the extension UI
- Callout (variant `warning`): "11 password managers tested (40M+ active installs). All initially vulnerable."

### Slide 3 — Demo (Interactive Page)

**Layout:** center

`public/victims/ext-clickjack-demo.html` — self-contained page (no Slidev dependency). The slide embeds it via `<iframe src="/victims/ext-clickjack-demo.html" style="width:100%;height:420px;border:none">`, matching the "Defenses in Action" pattern.

**Visible layer:**
- Realistic cookie consent banner at the bottom: "🍪 We use cookies for analytics." with "Accept" (green) and "Decline" buttons

**Hidden layer (underneath the banner, opacity:0, pointer-events:all):**
- Fake password manager autofill popup styled like a real browser extension UI
- Pre-filled: `alice@corp.com` / `••••••••`
- Single "Autofill" button positioned directly below the "Accept" button

**On click of "Accept":**
- Briefly reveals the hidden autofill popup (opacity flash)
- Shows a credential-theft toast card: "💀 Credentials captured: alice@corp.com · [password]"
- Explanatory note: "You clicked 'Accept Cookies'. The extension's Autofill button was directly underneath."

### Slide 4 — Scale & Defense

**Layout:** two-column grid

Left (scale / real-world impact):
- Stat card: "11 password managers tested · 40M+ users at risk"
- Impact list: login credentials + TOTP stolen, full credit card + CVV exfiltrated, passkeys intercepted, session tokens captured
- Note: subdomain exploitation — managers autofill across all subdomains, so attackers target weakest subdomains

Right (defense, v-click reveal):
- **For extension developers:**
  - Use Shadow DOM in `closed` mode — page JS cannot reach inside
  - Check `getComputedStyle(el).opacity` and `visibility` before autofilling
  - Use `MutationObserver` to detect style/class manipulation and abort fill
- **For web authors:**
  - Don't load untrusted third-party scripts on auth/payment pages
  - Use `Permissions-Policy` to restrict clipboard and credential access
- **For users:**
  - Keep extensions updated; prefer extensions with explicit visibility checks

Bottom callout (variant `note`): "The browser's own security extensions become the attack surface. Defense requires the extension ecosystem to adapt."

---

## Slides.md Changes

After the existing closing slide block (currently the last `src:` import or the last `---` in slides.md), add:

```markdown
---
src: ./slides/05-dcj.md
---

---
src: ./slides/06-ext-cj.md
---
```

No agenda changes needed — these are bonus slides outside the main flow.

---

## Styling Conventions

- CSS class prefix `dcj-` for DoubleClickjacking slides
- CSS class prefix `ecj-` for Extension CJ slides
- All styles remain in their respective `<style>` blocks (global, prefixed)
- Colors: follow existing `var(--cj-*)` tokens; no new CSS variables
- `colorSchema: light` — all colors must pass WCAG AA on white

---

## What Is Not In Scope

- Agenda slide updates (bonus slides are outside the numbered agenda)
- Changes to existing slides or components
- New Callout or OffsetCard variants
- Any backend or server-side code
