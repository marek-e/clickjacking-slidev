# DOM-Based Extension Clickjacking — Your Security Tool Is the Target

<div class="mt-2" style="font-size:0.88em;color:var(--cj-text-muted)">Classic clickjacking hides another website. This hides <strong style="color:var(--cj-text-strong)">your password manager</strong>.</div>

<div class="ecj-contrast mt-5">
  <div class="ecj-panel ecj-panel--classic">
    <div class="ecj-panel-label">Classic Clickjacking</div>
    <div class="ecj-panel-body">Attacker loads <code>bank.com</code> in an invisible <code>iframe</code> and overlays a fake button on top.</div>
    <div class="ecj-panel-code">iframe { opacity: 0.001; z-index: 10; }</div>
  </div>

  <div class="ecj-vs" aria-hidden="true">vs</div>

  <div class="ecj-panel ecj-panel--ext">
    <div class="ecj-panel-label">Extension Clickjacking</div>
    <div class="ecj-panel-body">Malicious script hides the extension's injected autofill UI, then overlays a fake "Accept Cookies" banner on top.</div>
    <div class="ecj-panel-code">document.querySelector('.pm-autofill')<br>.style.opacity = '0'</div>
  </div>
</div>

<Callout v-click variant="error" class="mt-5" noIcon>No iframe. No CORS. No frame headers. One line of JavaScript on any page that loads an untrusted script.</Callout>

<style>
.ecj-contrast {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 16px;
  align-items: stretch;
}
.ecj-panel {
  border-radius: 14px;
  overflow: hidden;
  border: 1.5px solid var(--cj-border);
  display: flex;
  flex-direction: column;
}
.ecj-panel--ext { border-color: var(--cj-danger-border); }

.ecj-panel-label {
  font-size: 0.7em;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 5px 12px;
  background: var(--cj-defense-bg);
  color: var(--cj-defense-text);
}
.ecj-panel--ext .ecj-panel-label {
  background: var(--cj-danger-bg);
  color: var(--cj-danger-text);
}
.ecj-panel-body {
  padding: 10px 12px;
  font-size: 0.78em;
  color: var(--cj-text);
  line-height: 1.45;
  background: #fff;
  flex: 1;
}
.ecj-panel-code {
  padding: 7px 12px;
  font-family: monospace;
  font-size: 0.7em;
  background: var(--cj-divider);
  color: var(--cj-text-strong);
  border-top: 1px solid var(--cj-border);
  line-height: 1.5;
}
.ecj-vs {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9em;
  font-weight: 900;
  color: var(--cj-text-muted);
  padding: 0 4px;
}
</style>

---
zoom: 0.92
---

# Why Browser Extensions Can't Defend Themselves

<div class="ecj-intro mt-3">
  Extensions inject UI elements directly into the page DOM via content scripts. Once injected, the page's own JavaScript can freely traverse, style, and hide those elements — no different from any other DOM node.
</div>

<div class="grid grid-cols-2 gap-6 mt-4">

<div>

**Three attack variants:**

| Variant | Technique |
|---------|-----------|
| Element opacity | `opacity: 0` on the extension root element |
| Parent opacity | `document.body.style.opacity = '0'` — hides everything |
| Overlay | Abs-positioned `<div>` covers the extension UI |

**Why password managers are worst-case:**
Their autofill features trigger the moment a field is focused — a single click exfiltrates credentials with no further interaction needed.

</div>

<div v-click>

**What classical defenses can't stop this:**

- ❌ `X-Frame-Options` — only applies to iframes
- ❌ `CSP frame-ancestors` — only applies to iframes
- ❌ `SameSite` cookies — no cross-site request is made
- ❌ Iframe sandbox — no iframe involved

<Callout variant="warning" class="mt-4">
  <strong>11 password managers</strong> tested across 40M+ active installs — all initially vulnerable. Credentials, payment cards (including CVV), TOTP codes, and passkeys all exfiltrable with a single click.
</Callout>

</div>

</div>

<style>
.ecj-intro { font-size: 0.84em; color: var(--cj-text); line-height: 1.5; }
</style>

---
layout: center
---

## Demo — Cookie Banner Steals Your Credentials

<div class="ecj-demo-wrap">
  <div class="ecj-demo-hint">Click "Accept All" on the page below</div>
  <iframe src="/victims/ext-clickjack-demo.html" style="width:760px;height:400px;border:none;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.10);"></iframe>
</div>

<style>
.ecj-demo-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.ecj-demo-hint {
  font-size: 0.8em;
  color: var(--cj-text-muted);
  font-style: italic;
}
</style>

<!--
PRESENTER NOTE:
Point out: this looks like a normal banking dashboard.
Ask the audience what they'd do if they saw this cookie banner.
Click "Accept All" — the hidden password manager popup flashes briefly, then the damage card shows stolen credentials.
Key message: the user did nothing wrong. Their own security tool was used against them.
-->

---
zoom: 0.92
---

# DOM Extension Clickjacking — Scale & Defense

<div class="grid grid-cols-2 gap-6 mt-4">

<div>

**Scale of impact:**

<div class="ecj-stat">
  <div class="ecj-stat-num">11</div>
  <div class="ecj-stat-label">Password managers tested — all initially vulnerable</div>
</div>
<div class="ecj-stat ecj-stat--red mt-3">
  <div class="ecj-stat-num">40M+</div>
  <div class="ecj-stat-label">Active users across tested managers</div>
</div>

**Exfiltrable in a single click:**
- Login credentials + TOTP codes
- Full credit card number + CVV
- Passkeys &amp; WebAuthn assertions

</div>

<div v-click>

**For extension developers:**
- Use **Shadow DOM (`mode: 'closed'`)**  — page JS cannot reach elements inside
- Check `getComputedStyle(el).opacity` and `visibility` before autofilling
- Use `MutationObserver` to detect style mutation and abort fill

**For web authors:**
- Avoid untrusted third-party scripts on auth or payment pages
- `Permissions-Policy: clipboard-read=(), clipboard-write=()`

**For users:**
- Keep extensions updated; prefer ones that check element visibility before filling

</div>

</div>

<Callout v-click variant="note" class="mt-5">The browser's own security extensions become the attack surface. Fixing this requires the extension ecosystem — not just one site — to adapt.</Callout>

<style>
.ecj-stat {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  background: var(--cj-warning-bg);
  border: 1.5px solid var(--cj-warning-border);
  border-radius: 12px;
}
.ecj-stat--red {
  background: var(--cj-danger-bg);
  border-color: var(--cj-danger-border);
}
.ecj-stat-num   { font-size: 2em; font-weight: 900; color: var(--cj-text-strong); line-height: 1; }
.ecj-stat-label { font-size: 0.8em; color: var(--cj-text-muted); line-height: 1.3; }
</style>
