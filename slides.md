---
theme: geist
title: Clickjacking — The Art of the Invisible Click
transition: fade
colorSchema: light
defaults:
  layout: default
  class: px-16 py-8

layout: center
class: text-center
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
  if (currentPage.value === 1 && val >= 1) {
    // Anchor the next slide's radial transition on the cursor click point.
    // .cj-click-word is non-animated at flush:'pre', so its rect is stable.
    // (118,52) = .cj-cursor offset; (+4,+4) ≈ SVG arrow tip in viewBox 20×28.
    const word = document.querySelector('.cj-click-word')
    const slide = word?.closest('.slidev-page') ?? document.body
    if (word) {
      const r = word.getBoundingClientRect()
      const sr = slide.getBoundingClientRect()
      const x = ((r.left + 122 - sr.left) / sr.width) * 100
      const y = ((r.top + 56 - sr.top) / sr.height) * 100
      document.documentElement.style.setProperty('--cj-x', x + '%')
      document.documentElement.style.setProperty('--cj-y', y + '%')
    }
    timer = setTimeout(next, 1200)
  }
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

# Agenda

<div class="grid grid-cols-2 gap-6 mt-6">

<div class="flex flex-col gap-2">
  <div class="text-xs font-bold tracking-widest uppercase text-red-600 mb-1 underline">The Attack</div>
  <AgendaItem n="1">What is Clickjacking?</AgendaItem>
  <AgendaItem n="2">How it works: mechanics</AgendaItem>
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

<div class="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-sm flex gap-1">
    <span class="font-bold text-amber-800">📖 Origin: </span>
    <span class="text-gray-700"> "Jacking" itself traces back to <strong>hi-jack</strong>, robbing someone mid-journey. The attacker intercepts your click mid-intent.</span>
</div>

<div v-click class="mt-4 p-4 bg-green-50 rounded-xl border border-green-600">

> **Clickjacking** or **UI Redressing** is a UI attack that tricks victims into clicking something **different** from what they perceive they are clicking.

</div>

<div v-click class="cj-stagger mt-6 grid grid-cols-3 gap-4 text-center items-stretch">
  <div class="cj-stagger-item h-full" style="animation-delay: 0ms">
    <OffsetCard label="User sees" title="User sees" accent="blue">
      <template #icon>👁️</template>
      An innocent button on a harmless page
    </OffsetCard>
  </div>

  <div class="cj-stagger-item h-full" style="animation-delay: 120ms">
    <OffsetCard label="User clicks" title="User clicks" accent="red">
      <template #icon>🖱️</template>
      A transparent <code>iframe</code> overlaid on top
    </OffsetCard>
  </div>

  <div class="cj-stagger-item h-full" style="animation-delay: 240ms">
    <OffsetCard label="Result" title="Result" accent="orange">
      <template #icon>💥</template>
      A sensitive action executes silently
    </OffsetCard>
  </div>
</div>

<style>
.cj-stagger .cj-stagger-item {
  opacity: 0;
  transform: translateY(14px);
  animation: cj-stagger-rise 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-play-state: running;
  will-change: transform, opacity;
}

.cj-stagger.slidev-vclick-hidden .cj-stagger-item {
  animation-play-state: paused;
}

@keyframes cj-stagger-rise {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

---

# How It Works ? The Mechanics behind the attack

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

<div class="cj-mech-right" v-click="4">

**CSS properties exploited:**

| Property | Role in the attack |
|----------|--------------------|
| `opacity: 0.001` | Makes iframe invisible |
| `z-index: 10` | Places iframe on top |
| `position: absolute` | Aligns with lure button |

<div class="mt-4">
  <OffsetCard title="Invisible target" accent="red" :shadow-size="5">
    <template #icon>👻</template>
    <span class="font-semibold text-gray-900">The victim never sees the iframe.</span><br />
    They believe they’re clicking the attacker’s button. In reality, they’re clicking a sensitive action on another site.
  </OffsetCard>
</div>

<div class="cj-mail" v-click="5">
  <div class="cj-mail-toast">
    <div class="cj-mail-dot" aria-hidden="true"></div>
    <div class="cj-mail-meta">
      <div class="cj-mail-from">New email</div>
      <div class="cj-mail-subject">You won an iPhone 19</div>
    </div>
    <div class="cj-mail-time">now</div>
  </div>

  <div class="cj-mail-card">
    <div class="cj-mail-head">
      <div class="cj-mail-avatar" aria-hidden="true">🎁</div>
      <div>
        <div class="cj-mail-title">Promo Team</div>
        <div class="cj-mail-snippet">Claim within 10 minutes to secure your prize.</div>
      </div>
    </div>
    <div class="cj-mail-body">
      <div class="cj-mail-copy">
        Congratulations. Your iPhone 19 is reserved.
      </div>
      <a class="cj-mail-link" href="#" @click.prevent="next()" tabindex="-1">Claim iPhone 19</a>
    </div>
  </div>
</div>

<script setup>
import { useNav } from '@slidev/client'
const { next } = useNav()
</script>

</div>

</div>

<style>
/* Mechanics slide email transition (global CSS, keep prefixed) */
.cj-mech-right {
  position: relative;
}

.cj-mail {
  position: absolute;
  top: -100px;
  right: -25px;
  width: min(430px, 100%);
  z-index: 10;
}

/* Notification toast in top-right corner */
.cj-mail-toast {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 14px;
  background: #0f172a;
  color: #e5e7eb;
  border: 1px solid rgba(148, 163, 184, 0.35);
  box-shadow: 0 14px 40px rgba(2, 6, 23, 0.28);
  width: min(360px, 100%);
  transform: translateY(14px) scale(0.98);
  opacity: 0;
  animation: cj-mail-toast-in 520ms cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-play-state: paused;
  z-index: 2;
}
.cj-mail.slidev-vclick-hidden .cj-mail-toast {
  animation-play-state: paused;
}
.cj-mail:not(.slidev-vclick-hidden) .cj-mail-toast {
  animation-play-state: running;
}

.cj-mail-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #22c55e;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.25);
  flex-shrink: 0;
}
.cj-mail-meta { min-width: 0; }
.cj-mail-from { font-size: 11px; color: #94a3b8; line-height: 1.1; }
.cj-mail-subject { font-size: 13px; font-weight: 700; color: #f8fafc; line-height: 1.2; }
.cj-mail-time { margin-left: auto; font-size: 11px; color: #94a3b8; }

.cj-mail-card {
  margin-top: 54px; /* leave room for toast */
  width: 100%;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transform: translateY(10px);
  opacity: 0;
  animation: cj-mail-card-in 520ms 120ms cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-play-state: paused;
}
.cj-mail:not(.slidev-vclick-hidden) .cj-mail-card {
  animation-play-state: running;
}

.cj-mail-head {
  display: flex;
  gap: 10px;
  padding: 12px 12px 10px;
  border-bottom: 1px solid #eef2f7;
}
.cj-mail-avatar {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: #fff7ed;
  border: 1px solid #fed7aa;
  flex-shrink: 0;
}
.cj-mail-title { font-weight: 800; color: #111827; line-height: 1.1; }
.cj-mail-snippet { font-size: 12px; color: #6b7280; margin-top: 1px; line-height: 1.2; }

.cj-mail-body { padding: 12px; display: flex; flex-direction: column; gap: 10px; }
.cj-mail-copy { font-size: 13px; color: #374151; line-height: 1.35; }
.cj-mail-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: fit-content;
  padding: 8px 12px;
  border-radius: 12px;
  background: #16a34a;
  color: #ffffff;
  font-weight: 800;
  text-decoration: none;
  box-shadow: 0 10px 22px rgba(22, 163, 74, 0.25);
}
.cj-mail-link::after { content: "↗"; font-weight: 900; opacity: 0.95; }

@keyframes cj-mail-toast-in {
  from { opacity: 0; transform: translateY(14px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes cj-mail-card-in {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>

---
layout: center
---

## Demo - Bank Transfer Hijacking

<div style="position:relative">
<ClickjackDemo
  victim-url="/victims/bank.html"
  attacker-title="📩 You won an iPhone 19!"
  attacker-body="Congratulations. Your iPhone 19 is reserved for you. Click below to claim it before it expires."
  attacker-button="Claim your iPhone 19  now 🎁"
  victim-label="SecureBank: Confirm Transfer $500"
  :height="320"
  :show-position-controls="true"
  :clickable="true"
  @button-click="onBtnClick"
/>

<!-- Bank alert overlay -->
<div v-if="bankAlert" class="cj-bank-overlay" aria-live="assertive">
  <div class="cj-bank-toast">
    <div class="cj-bank-toast-dot" aria-hidden="true"></div>
    <div class="cj-bank-toast-meta">
      <div class="cj-bank-toast-label">SecureBank Alert</div>
      <div class="cj-bank-toast-msg">Transfer initiated</div>
    </div>
    <div class="cj-bank-toast-time">now</div>
  </div>

  <div class="cj-bank-receipt">
    <div class="cj-bank-receipt-head">
      <span class="cj-bank-receipt-icon" aria-hidden="true">🏦</span>
      <div>
        <div class="cj-bank-receipt-title">Transfer Confirmed</div>
        <div class="cj-bank-receipt-sub">SecureBank · Transaction receipt</div>
      </div>
      <span class="cj-bank-receipt-status">✅ DONE</span>
    </div>
    <div class="cj-bank-receipt-rows">
      <div class="cj-bank-receipt-row"><span>Amount</span><strong class="cj-bank-amount">– $500.00</strong></div>
      <div class="cj-bank-receipt-row"><span>Recipient</span><strong>HACKER_4444</strong></div>
      <div class="cj-bank-receipt-row"><span>Reference</span><code>CLICKJACKING-LOL</code></div>
    </div>
    <div class="cj-bank-receipt-footer">One click. That's all it took. 💸</div>
  </div>
</div>
</div>

<script setup>
import { ref, onUnmounted } from 'vue'
import { useNav } from '@slidev/client'

const { next } = useNav()
const bankAlert = ref(false)
let timer

function onBtnClick() {
  bankAlert.value = true
  timer = setTimeout(next, 2600)
}

onUnmounted(() => clearTimeout(timer))
</script>

<style>
/* ── Bank alert overlay (slide 5) ───────────────────────── */
.cj-bank-overlay {
  position: absolute;
  top: -10px;
  right: -10px;
  width: min(340px, 100%);
  z-index: 20;
  pointer-events: none;
}

.cj-bank-toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 14px;
  background: #0f172a;
  color: #e5e7eb;
  border: 1px solid rgba(148, 163, 184, 0.35);
  box-shadow: 0 14px 40px rgba(2, 6, 23, 0.32);
  animation: cj-bank-toast-in 480ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.cj-bank-toast-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.28);
  flex-shrink: 0;
  animation: cj-bank-dot-pulse 0.7s ease 0.5s 2 alternate both;
}

.cj-bank-toast-meta { min-width: 0; }
.cj-bank-toast-label { font-size: 11px; color: #94a3b8; line-height: 1.1; }
.cj-bank-toast-msg   { font-size: 13px; font-weight: 700; color: #fca5a5; line-height: 1.2; }
.cj-bank-toast-time  { margin-left: auto; font-size: 11px; color: #94a3b8; flex-shrink: 0; }

.cj-bank-receipt {
  margin-top: 8px;
  border-radius: 14px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 16px 40px rgba(0,0,0,0.10);
  overflow: hidden;
  animation: cj-bank-card-in 480ms 100ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.cj-bank-receipt-head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px 10px;
  border-bottom: 1px solid #f1f5f9;
}
.cj-bank-receipt-icon {
  font-size: 1.5em;
  flex-shrink: 0;
}
.cj-bank-receipt-title { font-weight: 800; color: #111827; font-size: 0.88em; }
.cj-bank-receipt-sub   { font-size: 0.7em; color: #6b7280; margin-top: 1px; }
.cj-bank-receipt-status {
  margin-left: auto;
  font-size: 0.72em;
  font-weight: 800;
  color: #16a34a;
  flex-shrink: 0;
}

.cj-bank-receipt-rows {
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.cj-bank-receipt-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.78em;
  color: #374151;
}
.cj-bank-receipt-row span { color: #9ca3af; }
.cj-bank-amount { color: #dc2626 !important; }

.cj-bank-receipt-footer {
  padding: 8px 14px;
  background: #fef2f2;
  border-top: 1px solid #fecaca;
  font-size: 0.72em;
  color: #b91c1c;
  font-weight: 700;
  text-align: center;
  animation: cj-bank-footer-in 350ms 400ms both;
}

@keyframes cj-bank-toast-in {
  from { opacity: 0; transform: translateX(24px) scale(0.97); }
  to   { opacity: 1; transform: translateX(0) scale(1); }
}
@keyframes cj-bank-card-in {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes cj-bank-footer-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes cj-bank-dot-pulse {
  from { box-shadow: 0 0 0 3px rgba(239,68,68,0.28); }
  to   { box-shadow: 0 0 0 6px rgba(239,68,68,0); }
}
</style>

<!--
PRESENTER NOTE:
Start with opacity at 0 so the user only sees the prize page (the attack scenario).
Slowly drag the slider to reveal the victim iframe: a bank transfer confirmation.
Key message: one click on "Claim Prize" = one confirmed bank transfer.
Then actually click the button to trigger the bank alert and advance the slide.
-->

---
class: px-14 py-4
---

# The Double Con — Keeping the Victim Fooled

<div class="dc-intro" v-show="$clicks < 2">
  After hijacking your click, a smart attacker doesn't go silent. They <strong>listen for the click</strong> and immediately swap their page content — keeping the illusion alive while the damage is already done.
</div>

<div class="dc-split mt-5">

  <!-- Left: what the victim sees -->
  <div class="dc-panel dc-panel--victim">
    <div class="dc-panel-label dc-panel-label--victim">👤 What the victim sees</div>
    <div class="dc-fake-site">
      <div class="dc-fake-header">
        <span class="dc-fake-logo">📦 iPhonePromo<span class="dc-fake-tld">.net</span></span>
      </div>
      <div class="dc-fake-body">
        <div class="dc-fake-checkmark" aria-hidden="true">✅</div>
        <div class="dc-fake-title">Order Confirmed!</div>
        <div class="dc-fake-sub">Your iPhone 19 is on its way 🎉</div>
        <div class="dc-fake-rows">
          <div class="dc-fake-row"><span>Item</span><strong>iPhone 19 Pro · 1×</strong></div>
          <div class="dc-fake-row"><span>Total</span><strong class="dc-fake-free">FREE</strong></div>
          <div class="dc-fake-row"><span>Delivery</span><strong>3–5 business days</strong></div>
        </div>
        <button class="dc-fake-btn" tabindex="-1">📍 Track my order</button>
      </div>
    </div>
  </div>

  <!-- Right: what actually happened -->
  <div class="dc-panel dc-panel--reality" v-show="$clicks >= 1">
    <div class="dc-panel-label dc-panel-label--reality">🏦 Meanwhile at SecureBank…</div>
    <div class="dc-bank-log">
      <div class="dc-bank-log-header">
        <span class="dc-bank-log-dot"></span> Transaction log · just now
      </div>
      <div class="dc-bank-log-rows">
        <div class="dc-bank-log-row"><span>Type</span><strong>Outgoing wire transfer</strong></div>
        <div class="dc-bank-log-row"><span>Amount</span><strong class="dc-bank-red">– $500.00</strong></div>
        <div class="dc-bank-log-row"><span>To</span><strong>HACKER_4444</strong></div>
        <div class="dc-bank-log-row"><span>Status</span><strong class="dc-bank-green">✔ Completed</strong></div>
        <div class="dc-bank-log-row"><span>Origin</span><span class="dc-inline-code">iPhonePromo.net</span></div>
      </div>
      <div class="dc-bank-log-note">Victim will only notice when checking their statement.</div>
    </div>
  </div>

</div>

<div class="dc-trick-box" v-show="$clicks >= 2">
  <div class="dc-trick-title">How the attacker detects the click</div>
  <div class="dc-trick-code">window.addEventListener('blur', () => {<br>&nbsp;&nbsp;// iframe just stole focus = victim clicked<br>&nbsp;&nbsp;showFakeConfirmation()<br>})</div>
  <div class="dc-trick-caption">Same trick we used to build the demo ↑</div>
</div>

<style>
/* ── Double Con slide ─────────────────────────────────── */
.dc-intro {
  font-size: 0.88em;
  color: #374151;
  line-height: 1.5;
  padding: 10px 14px;
  background: #fefce8;
  border: 1px solid #fde68a;
  border-radius: 10px;
}

.dc-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  align-items: start;
  margin-top: 10px !important;
}

.dc-panel {
  border-radius: 14px;
  overflow: hidden;
  border: 2px solid #e5e7eb;
}
.dc-panel--reality { border-color: #fca5a5; }

.dc-panel-label {
  font-size: 0.7em;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  padding: 5px 12px;
}
.dc-panel-label--victim  { background: #f0fdf4; color: #15803d; }
.dc-panel-label--reality { background: #fef2f2; color: #b91c1c; }

/* Fake site */
.dc-fake-site { background: #fff; }
.dc-fake-header {
  padding: 8px 12px;
  background: #1e293b;
  display: flex;
  align-items: center;
}
.dc-fake-logo { font-size: 0.78em; font-weight: 800; color: #f8fafc; }
.dc-fake-tld  { color: #94a3b8; font-weight: 400; }

.dc-fake-body {
  padding: 8px 12px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
}
.dc-fake-checkmark { font-size: 1.4em; animation: dc-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }
.dc-fake-title { font-weight: 800; font-size: 1em; color: #111827; }
.dc-fake-sub   { font-size: 0.75em; color: #6b7280; }

.dc-fake-rows {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 4px;
}
.dc-fake-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.75em;
  color: #374151;
  padding: 3px 0;
  border-bottom: 1px solid #f3f4f6;
}
.dc-fake-row span { color: #9ca3af; }
.dc-fake-free { color: #16a34a !important; }

.dc-fake-btn {
  margin-top: 6px;
  padding: 7px 18px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.78em;
  font-weight: 700;
  pointer-events: none;
}

/* Bank log */
.dc-bank-log {
  background: #0f172a;
  padding: 8px 12px;
}
.dc-bank-log-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.68em;
  color: #64748b;
  margin-bottom: 8px;
  font-family: monospace;
}
.dc-bank-log-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #ef4444;
  box-shadow: 0 0 0 2px rgba(239,68,68,0.3);
  flex-shrink: 0;
}
.dc-bank-log-rows {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.dc-bank-log-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.76em;
  color: #e2e8f0;
}
.dc-bank-log-row span { color: #475569; }
.dc-bank-red   { color: #f87171 !important; }
.dc-bank-green { color: #4ade80 !important; }

.dc-inline-code {
  font-family: monospace;
  font-size: 0.9em;
  background: #1e293b;
  color: #7dd3fc;
  padding: 1px 5px;
  border-radius: 4px;
}

.dc-panel--reality,
.dc-trick-box {
  animation: dc-fade-slide 380ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes dc-fade-slide {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.dc-bank-log-note {
  margin-top: 8px;
  font-size: 0.68em;
  color: #64748b;
  font-style: italic;
}

/* Trick box — full-width row below the grid */
.dc-trick-box {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 10px;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 10px 16px;
}
.dc-trick-title {
  font-size: 0.68em;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  flex-shrink: 0;
}
.dc-trick-code {
  flex: 1;
  font-size: 0.7em;
  color: #e2e8f0;
  line-height: 1.5;
  font-family: monospace;
  background: #1e293b;
  border-radius: 6px;
  padding: 6px 10px;
}
.dc-trick-caption {
  font-size: 0.68em;
  color: #38bdf8;
  font-style: italic;
  white-space: nowrap;
  flex-shrink: 0;
}

@keyframes dc-pop {
  from { transform: scale(0.4); opacity: 0; }
  to   { transform: scale(1);   opacity: 1; }
}
</style>

---

# Key Attack Variants

<div class="grid grid-cols-2 gap-5 mt-4">

<div v-click class="bg-slate-50 rounded-xl p-4 border border-slate-200">
  <div class="font-bold text-yellow-700 mb-2">🪟 UI Redressing</div>
  <div class="text-sm text-gray-600">Any clickable element can be hijacked, not just buttons. Forms, dropdowns, links, even CAPTCHA-like flows.</div>
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

## Demo 2 - OAuth Consent Hijacking

<ClickjackDemo
  victim-url="/victims/oauth.html"
  attacker-title="🔒 Security Verification Required"
  attacker-body="For your protection, we need to confirm your identity. This is a standard one-time check."
  attacker-button="Verify My Identity ✓"
  victim-label="FastAuth OAuth: Grant full account access to DataHarvest Pro"
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

## Demo 3 - Likejacking

<ClickjackDemo
  victim-url="/victims/social.html"
  attacker-title="🎵 Listen to this amazing track"
  attacker-body="10 million plays and counting. Click play to listen. No sign up needed!"
  attacker-button="▶ Play Now"
  victim-label="ConnectHub: Like this Page (14K followers)"
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

# Defense #1 - X-Frame-Options

<div class="grid grid-cols-2 gap-6 mt-2">

<div>

**The original header** (2009, legacy but still useful)

```http
# Block all framing - strongest
X-Frame-Options: DENY

# Allow same origin only
X-Frame-Options: SAMEORIGIN

# Specific origin - deprecated, not in Chrome
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

**Still recommended** as defense-in-depth alongside CSP. Universally understood by browsers, zero-cost to add.

<div class="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-400 text-sm">

⚠️ Missing on **~35%** of production apps  
(source: securityheaders.com scan, 2023)

</div>

</div>

</div>

---

# Defense #2 - CSP `frame-ancestors`

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

# Defense #3 - JavaScript Framebusting

<div class="grid grid-cols-2 gap-6 mt-2">

<div>

**Classic approach** (fragile, do not rely on)

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
No <code>X-Frame-Options</code> or CSP set. It embeds in any page, from any origin.
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
<code>frame-ancestors 'none'</code>: browser refuses to embed. Attack impossible.
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
