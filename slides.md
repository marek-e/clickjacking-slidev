---
theme: geist
title: Clickjacking — The Art of the Invisible Click
layout: center
class: text-center
transition: fade
colorSchema: light
---

<!-- Background shapes -->
<div aria-hidden="true" style="position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0">

  <!-- large red circle, top-left -->
  <div style="position:absolute;top:-80px;left:-80px;width:320px;height:320px;border-radius:50%;background:rgba(220,38,38,0.12);filter:blur(48px)"></div>

  <!-- medium orange ellipse, bottom-right -->
  <div style="position:absolute;bottom:-60px;right:-40px;width:280px;height:220px;border-radius:50%;background:rgba(234,88,12,0.10);filter:blur(40px)"></div>

</div>

<!-- Content -->
<div class="flex flex-col items-center justify-center gap-5" style="position:relative;z-index:1">

  <span class="px-4 py-1 rounded-full border border-red-600 bg-red-50 text-red-600 text-xs font-bold tracking-widest uppercase">
    🔒 Web Security
  </span>

  <h1 class="m-0 leading-none font-black text-gray-900" style="font-size:5.5rem; letter-spacing:-2px">
    <span :class="['cj-click-word', $clicks >= 1 ? 'cj-growing' : '']" style="position:relative; display:inline-block">Click<span v-click class="cj-cursor" aria-hidden="true"><svg viewBox="0 0 20 28" width="36" height="50" style="display:block;filter:drop-shadow(0 2px 5px rgba(0,0,0,0.22))"><path d="M2,2 L2,22 L7,17 L10,26 L14,24 L11,15 L18,15 Z" fill="white" stroke="#111827" stroke-width="1.5" stroke-linejoin="round"/></svg><span class="cj-ripple"></span></span></span><span class="text-red-600">jacking</span>
  </h1>

  <div class="w-12 h-1 rounded bg-red-600"></div>

  <p class="m-0 text-2xl font-light text-gray-900">The Art of the Invisible Click</p>

  <p class="m-0 text-sm font-medium text-gray-800 tracking-wide">Understanding the attack · Mastering the defense</p>

</div>

<script setup>
import { watch, onUnmounted } from 'vue'
import { useNav } from '@slidev/client'

const { clicks, currentPage, next } = useNav()
let timer

watch(clicks, (val) => {
  if (currentPage.value === 1 && val >= 1) timer = setTimeout(next, 1200)
})

onUnmounted(() => clearTimeout(timer))
</script>

<style>
/* ── "Click" word grows on press ──────────────────────────
   $clicks >= 1 adds .cj-growing, which starts the animation
   fresh (adding a new animation property always restarts it).
   Timing mirrors the cursor: peak at 70%, release at 82%.
*/
.cj-growing {
  transform-origin: center bottom;
  animation: cj-word-grow 1.1s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
@keyframes cj-word-grow {
  0%   { transform: scale(1);    }
  60%  { transform: scale(1);    }
  70%  { transform: scale(1.22); }
  82%  { transform: scale(0.97); }
  100% { transform: scale(1);    }
}

/* ── Cursor drop-and-click animation ──────────────────────
   animation-play-state: paused freezes it at frame 0 while
   Slidev keeps the element hidden (.slidev-vclick-hidden).
   The moment v-click removes that class, the animation runs.
*/
.cj-cursor {
  position: absolute;
  top: 52px;
  left: 118px;
  animation: cj-cursor-drop 1.1s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  animation-play-state: running;
}
.cj-cursor.slidev-vclick-hidden {
  animation-play-state: paused;
}
@keyframes cj-cursor-drop {
  0%   { transform: translate(20px, -30px) rotate(18deg); opacity: 0; }
  22%  { transform: translate(0, 0)        rotate(0deg);  opacity: 1; }
  52%  { transform: scale(1); }
  67%  { transform: translate(0, 6px)      scale(0.78); }
  82%  { transform: translate(0, 0)        scale(1.08); }
  100% { transform: translate(0, 0)        scale(1);    }
}

/* ── Click ripple ──────────────────────────────────────── */
.cj-ripple {
  position: absolute;
  top: 28px;
  left: -3px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgba(185, 28, 28, 0.45);
  animation: cj-ripple-out 0.5s ease-out 0.72s both;
  animation-play-state: running;
}
.cj-cursor.slidev-vclick-hidden .cj-ripple {
  animation-play-state: paused;
}
@keyframes cj-ripple-out {
  0%   { transform: scale(0);   opacity: 0.7; }
  100% { transform: scale(4.5); opacity: 0;   }
}
</style>

---
layout: center
---

# Agenda

<div class="grid grid-cols-2 gap-6 mt-6">

<div class="flex flex-col gap-2">
  <div class="text-xs font-bold tracking-widest uppercase text-red-600 mb-1 underline">The Attack</div>
  <AgendaItem n="1">What is Clickjacking?</AgendaItem>
  <AgendaItem n="2">How it works — mechanics</AgendaItem>
  <AgendaItem n="3" demo>Bank transfer hijack</AgendaItem>
  <AgendaItem n="4">Attack variants</AgendaItem>
  <AgendaItem n="5" demo>OAuth consent hijack</AgendaItem>
  <AgendaItem n="6" demo>Likejacking</AgendaItem>
</div>

<div class="flex flex-col gap-2">
  <div class="text-xs font-bold tracking-widest uppercase text-blue-600 mb-1 underline">The Defense</div>
  <AgendaItem n="7">Targets &amp; real-world impact</AgendaItem>
  <AgendaItem n="8">Detection</AgendaItem>
  <AgendaItem n="9">X-Frame-Options</AgendaItem>
  <AgendaItem n="10">CSP <code>frame-ancestors</code></AgendaItem>
  <AgendaItem n="11">JavaScript framebusting</AgendaItem>
  <AgendaItem n="12" demo>Defenses in action</AgendaItem>
  <AgendaItem n="13">Security checklist</AgendaItem>
</div>

</div>

---

# What is Clickjacking?

<div class="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-300">

> **Clickjacking** — a UI attack that tricks victims into clicking something **different** from what they perceive they are clicking.

</div>

<div v-click class="mt-6 grid grid-cols-3 gap-4 text-center">
  <div class="bg-blue-50 rounded-xl p-4 border border-blue-200">
    <div class="text-3xl mb-2">👁️</div>
    <div class="font-bold">User sees</div>
    <div class="text-sm text-gray-600 mt-1">An innocent button on a harmless page</div>
  </div>
  <div class="bg-red-50 rounded-xl p-4 border border-red-200">
    <div class="text-3xl mb-2">🖱️</div>
    <div class="font-bold">User clicks</div>
    <div class="text-sm text-gray-600 mt-1">A transparent <code>iframe</code> overlaid on top</div>
  </div>
  <div class="bg-orange-50 rounded-xl p-4 border border-orange-200">
    <div class="text-3xl mb-2">💥</div>
    <div class="font-bold">Result</div>
    <div class="text-sm text-gray-600 mt-1">A sensitive action executes silently</div>
  </div>
</div>

<div v-click class="mt-5 text-sm text-gray-500 text-center">
  ≠ Phishing (no imitation of the victim site) &nbsp;·&nbsp; ≠ XSS (no code injection) &nbsp;·&nbsp; ≠ CSRF (requires user's real click)
</div>

---

# How It Works — The Mechanics

<div class="grid grid-cols-2 gap-6">

<div>

The attacker hosts a page with **two layers**:

```html {all|4-9|12-13|all}
<!-- attacker.html -->
<style>
  iframe {
    position: absolute; /* overlay */
    opacity: 0.001;     /* invisible */
    z-index: 10;        /* on top */
    top: 0; left: 0;
    width: 100%; height: 100%;
  }
</style>

<!-- The "lure" the victim sees -->
<button>🎁 Claim Your Prize!</button>

<!-- The real target (transparent) -->
<iframe src="https://bank.com/transfer
   ?amount=500&to=attacker_account">
</iframe>
```

</div>

<div v-click>

**CSS properties exploited:**

| Property | Role in the attack |
|----------|--------------------|
| `opacity: 0.001` | Makes iframe invisible |
| `z-index: 10` | Places iframe on top |
| `position: absolute` | Aligns with lure button |

<div class="mt-4 p-3 bg-red-50 rounded-lg border border-red-300 text-sm">

**The victim never sees the iframe.**  
They believe they're clicking the attacker's button — they're actually clicking a sensitive action on another site.

</div>

</div>

</div>

---
layout: center
class: p-4
---

## Demo 1 — Bank Transfer Hijacking

<ClickjackDemo
  victim-url="/victims/bank.html"
  attacker-title="🎉 Congratulations! You've been selected!"
  attacker-body="You are today's lucky winner. Click below to claim your €500 Amazon voucher instantly!"
  attacker-button="Claim Prize Now 🎁"
  victim-label="SecureBank — Confirm Transfer $500"
  :height="270"
/>

<!--
PRESENTER NOTE:
Start with opacity at 0 — user only sees the prize page (the attack scenario).
Slowly drag slider to reveal the victim iframe — a bank transfer confirmation.
Key message: one click on "Claim Prize" = one confirmed bank transfer.
-->

---

# Key Attack Variants

<div class="grid grid-cols-2 gap-5 mt-4">

<div v-click class="bg-slate-50 rounded-xl p-4 border border-slate-200">
  <div class="font-bold text-yellow-700 mb-2">🪟 UI Redressing</div>
  <div class="text-sm text-gray-600">Any clickable element can be hijacked — not just buttons. Forms, dropdowns, links, even CAPTCHA-like flows.</div>
</div>

<div v-click class="bg-slate-50 rounded-xl p-4 border border-slate-200">
  <div class="font-bold text-blue-700 mb-2">👍 Likejacking</div>
  <div class="text-sm text-gray-600">Hidden social buttons (Like, Follow, Share) positioned under innocent content. Facebook 2010: millions of unwanted Likes in days.</div>
</div>

<div v-click class="bg-slate-50 rounded-xl p-4 border border-slate-200">
  <div class="font-bold text-purple-700 mb-2">🖱️ Cursorjacking</div>
  <div class="text-sm text-gray-600">CSS custom cursor displayed with an offset. The victim thinks they click somewhere safe, but their real cursor is elsewhere.</div>
</div>

<div v-click class="bg-slate-50 rounded-xl p-4 border border-slate-200">
  <div class="font-bold text-green-700 mb-2">📁 File Upload Hijacking</div>
  <div class="text-sm text-gray-600">Invisible overlay on file upload fields. Victim unknowingly opens a file picker and uploads sensitive files to the attacker.</div>
</div>

</div>

---
layout: center
class: p-4
---

## Demo 2 — OAuth Consent Hijacking

<ClickjackDemo
  victim-url="/victims/oauth.html"
  attacker-title="🔒 Security Verification Required"
  attacker-body="For your protection, we need to confirm your identity. This is a standard one-time check."
  attacker-button="Verify My Identity ✓"
  victim-label="FastAuth OAuth — Grant full account access to DataHarvest Pro"
  :height="270"
/>

<!--
PRESENTER NOTE:
At 0% opacity: looks like a legit security check. The user clicks "Verify My Identity".
Reveal the iframe: they're actually clicking "Allow Access" on an OAuth consent page
granting a third-party app full read/write access to their account (email, contacts, passwords).
-->

---
layout: center
class: p-4
---

## Demo 3 — Likejacking

<ClickjackDemo
  victim-url="/victims/social.html"
  attacker-title="🎵 Listen to this amazing track"
  attacker-body="10 million plays and counting. Click play to listen — no sign up needed!"
  attacker-button="▶ Play Now"
  victim-label="ConnectHub — Like this Page (14K followers)"
  :height="270"
/>

<!--
PRESENTER NOTE:
Classic likejacking. The attacker places a "Play" button over the social Like button.
The user clicks Play, but actually likes a page they've never heard of.
At scale this can be used for spam, influencing algorithms, or social engineering.
-->

---

# Targets & Real-World Impact

<div class="grid grid-cols-2 gap-6 mt-4">

<div>

**High-value targets:**
- Change email / password
- Transfer funds or crypto
- Force OAuth consent
- Delete account or data
- Admin panel actions
- Camera / microphone access (Flash, 2008)
- Subscribe to paid services

</div>

<div v-click>

**Notable cases:**

| Year | Target | Impact |
|------|--------|--------|
| 2008 | Adobe Flash Player | Mic/cam access via settings page |
| 2008 | Twitter | Forced tweets at scale |
| 2010 | Facebook | Mass Likejacking campaign |
| 2012 | Instagram | Forced follows |
| 2015 | LinkedIn | Invisible action buttons |
| 2021+ | OAuth flows | Account takeover, still common |

</div>

</div>

---

# Detection

<div class="grid grid-cols-2 gap-6 mt-4">

<div>

### Frontend signals
- `<iframe>` elements with `opacity < 0.1`
- High `z-index` elements covering large areas
- `position: absolute/fixed` over interactive content
- Invisible elements with `pointer-events: auto`

```js
// Simple heuristic detector
document.querySelectorAll('*').forEach(el => {
  const s = getComputedStyle(el)
  const op = parseFloat(s.opacity)
  const zi = parseInt(s.zIndex)

  if (op < 0.1 && zi > 5 && el.tagName === 'IFRAME') {
    console.warn('⚠️ Suspicious iframe:', el.src)
  }
})
```

</div>

<div v-click>

### Backend signals
- Sensitive action triggered in **1 click** from an external referrer
- No prior navigation or form state leading to the action
- Referrer header from an unexpected origin
- Missing confirmation steps for destructive operations

### Tools
- Browser DevTools → **Layers** panel
- DevTools → Elements → inspect z-index
- Browser extensions: *Clickjacking Tester*
- Burp Suite: passive scanner flags missing headers

</div>

</div>

---

# Defense #1 — X-Frame-Options

<div class="grid grid-cols-2 gap-6 mt-2">

<div>

**The original header** (2009, legacy but still useful)

```http
# Block all framing — strongest
X-Frame-Options: DENY

# Allow same origin only
X-Frame-Options: SAMEORIGIN

# Specific origin — deprecated, not in Chrome
X-Frame-Options: ALLOW-FROM https://trusted.com
```

Server configuration:

```nginx
# Nginx
add_header X-Frame-Options "DENY" always;
```

```python
# Django (settings.py)
X_FRAME_OPTIONS = 'DENY'
```

```java
// Spring Security
http.headers().frameOptions().deny();
```

</div>

<div v-click>

**Limitations:**
- `ALLOW-FROM` not supported in Chrome, Safari
- Cannot specify **multiple** allowed origins
- Does **not** protect against same-origin attacks
- Being superseded by CSP `frame-ancestors`

**Still recommended** as defense-in-depth alongside CSP — universally understood by browsers, zero-cost to add.

<div class="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-400 text-sm">

⚠️ Missing on **~35%** of production apps  
(source: securityheaders.com scan, 2023)

</div>

</div>

</div>

---

# Defense #2 — CSP `frame-ancestors`

<div class="grid grid-cols-2 gap-6 mt-2">

<div>

**The modern standard** (recommended over XFO)

```http
# Block all framing
Content-Security-Policy: frame-ancestors 'none';

# Allow same origin only
Content-Security-Policy: frame-ancestors 'self';

# Allowlist specific origins
Content-Security-Policy: frame-ancestors
  'self'
  https://trusted-partner.com
  https://embed.example.com;
```

</div>

<div v-click>

**CSP vs X-Frame-Options:**

| Feature | XFO | CSP |
|---------|:---:|:---:|
| Multi-origin allowlist | ❌ | ✅ |
| Wildcard subdomains | ❌ | ✅ |
| Report-only mode | ❌ | ✅ |
| Chrome / Safari | ✅ | ✅ |

**Best practice: set both** for maximum compatibility:

```http
X-Frame-Options: DENY
Content-Security-Policy: frame-ancestors 'none';
```

If they conflict, CSP `frame-ancestors` takes precedence in modern browsers.

</div>

</div>

---

# Defense #3 — JavaScript Framebusting

<div class="grid grid-cols-2 gap-6 mt-2">

<div>

**Classic approach** (fragile — do not rely on)

```js
// The classic framebusting script
if (window.top !== window.self) {
  window.top.location = window.self.location
}

// More aggressive variant
if (window !== top) {
  document.body.style.display = 'none'
  top.location.replace(location.href)
}
```

</div>

<div v-click>

**The bypass:** HTML5 `sandbox` attribute

```html
<!-- Attacker disables top-navigation -->
<iframe
  src="https://bank.com/transfer"
  sandbox="allow-forms allow-scripts">
  <!--        ↑ allow-top-navigation is ABSENT -->
  <!-- JS framebusting can't redirect anymore! -->
</iframe>
```

**Other bypass vectors:**
- `onbeforeunload` handler to cancel navigation
- XSS on target page to replace framebusting script
- Double-frame trick

<div class="mt-3 p-3 bg-red-50 rounded-lg border border-red-300 text-sm">
❌ JS framebusting is unreliable. Use HTTP headers only.
</div>

</div>

</div>

---
layout: two-cols
layoutClass: gap-4
---

# Defenses in Action

::left::

### ❌ Not Protected

<div style="border:2px solid #f87171; border-radius:8px; overflow:hidden; height:190px;">
  <iframe src="/victims/bank.html" style="width:100%; height:100%; border:none;"></iframe>
</div>

<div class="mt-2 text-sm text-red-600">
No <code>X-Frame-Options</code> or CSP set — embeds in any page, from any origin.
</div>

::right::

### ✅ Protected

<div style="border:2px solid #4ade80; border-radius:8px; height:190px; background:#f0fff4; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px;">
  <div style="font-size:2.5em;">🚫</div>
  <div style="color:#dc2626; font-weight:700; font-size:1.05em;">Refused to Display</div>
  <code style="font-size:0.72em; color:#374151; background:#e5e7eb; padding:4px 10px; border-radius:4px;">X-Frame-Options: DENY</code>
  <div style="font-size:0.78em; color:#6b7280;">Browser blocked the iframe</div>
</div>

<div class="mt-2 text-sm text-green-700">
<code>frame-ancestors 'none'</code> — browser refuses to embed. Attack impossible.
</div>

---

# Security Checklist

<div class="grid grid-cols-2 gap-5 mt-3">

<div>

**Server-side (mandatory)**
- [ ] `X-Frame-Options: DENY` on all sensitive pages
- [ ] `Content-Security-Policy: frame-ancestors 'none'`
- [ ] Apply headers at the framework level, not per-route
- [ ] Verify with [securityheaders.com](https://securityheaders.com)

**Sensitive actions**
- [ ] Multi-step confirmation for financial ops
- [ ] Re-authentication for critical changes (email, password)
- [ ] Rate limiting on state-changing endpoints
- [ ] `SameSite=Lax` (or `Strict`) on session cookies

</div>

<div v-click>

**Do NOT rely on:**
- ❌ JavaScript framebusting alone
- ❌ CSRF tokens alone (they don't prevent clickjacking)
- ❌ Obscure URLs or login walls
- ❌ Assuming users "won't fall for it"

**Also consider:**
- User gesture confirmation for destructive actions
- Visual confirmation patterns before irreversible ops
- Regular penetration testing / header scanning in CI
- `Permissions-Policy` to restrict camera/mic access

</div>

</div>

---
layout: center
class: text-center
---

# That's it!

<div class="mt-4 text-gray-600 text-lg">
One attack, one HTTP header, two lines of config.
</div>

<div class="mt-8 grid grid-cols-3 gap-5 text-sm max-w-2xl mx-auto">
  <div class="bg-gray-100 rounded-xl p-4 border border-gray-200">
    <div class="text-2xl mb-2">📖</div>
    <div class="font-bold">OWASP</div>
    <div class="text-gray-600 text-xs mt-1">Clickjacking Defense Cheat Sheet</div>
  </div>
  <div class="bg-gray-100 rounded-xl p-4 border border-gray-200">
    <div class="text-2xl mb-2">🛡️</div>
    <div class="font-bold">securityheaders.com</div>
    <div class="text-gray-600 text-xs mt-1">Scan your site's response headers</div>
  </div>
  <div class="bg-gray-100 rounded-xl p-4 border border-gray-200">
    <div class="text-2xl mb-2">🔬</div>
    <div class="font-bold">MDN Web Docs</div>
    <div class="text-gray-600 text-xs mt-1">X-Frame-Options · CSP reference</div>
  </div>
</div>
