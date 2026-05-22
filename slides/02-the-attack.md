# What is Clickjacking?

<Callout variant="note" class="mt-4"><strong>Origin:</strong> "Jacking" itself traces back to <strong>hi-jack</strong>, robbing someone mid-journey. The attacker intercepts your click mid-intent.</Callout>

<Callout v-click variant="success" icon="🎯" class="mt-4">
 <strong>Clickjacking</strong> or <strong>UI Redressing</strong> is a UI attack that tricks victims into clicking something <strong>different</strong> from what they perceive they are clicking.

</Callout>

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

```html {all|3-9|12-13|all}
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
    <span class="font-semibold text-slate-900">The victim never sees the iframe.</span><br />
    They believe they're clicking the attacker's button. In reality, they're clicking a sensitive action on another site.
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
  background: var(--cj-nav);
  color: var(--cj-border);
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
  background: var(--cj-safe);
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.25);
  flex-shrink: 0;
}
.cj-mail-meta { min-width: 0; }
.cj-mail-from { font-size: 11px; color: var(--cj-text-meta); line-height: 1.1; }
.cj-mail-subject { font-size: 13px; font-weight: 700; color: var(--cj-surface); line-height: 1.2; }
.cj-mail-time { margin-left: auto; font-size: 11px; color: var(--cj-text-meta); }

.cj-mail-card {
  margin-top: 54px; /* leave room for toast */
  width: 100%;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid var(--cj-border);
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
  border-bottom: 1px solid var(--cj-divider);
}
.cj-mail-avatar {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: var(--cj-warning-bg);
  border: 1px solid var(--cj-warning-border);
  flex-shrink: 0;
}
.cj-mail-title { font-weight: 800; color: var(--cj-text-strong); line-height: 1.1; }
.cj-mail-snippet { font-size: 12px; color: var(--cj-text-muted); margin-top: 1px; line-height: 1.2; }

.cj-mail-body { padding: 12px; display: flex; flex-direction: column; gap: 10px; }
.cj-mail-copy { font-size: 13px; color: var(--cj-text); line-height: 1.35; }
.cj-mail-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: fit-content;
  padding: 8px 12px;
  border-radius: 12px;
  background: var(--cj-safe);
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
  :start-y="-57"
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
  background: var(--cj-nav);
  color: var(--cj-border);
  border: 1px solid rgba(148, 163, 184, 0.35);
  box-shadow: 0 14px 40px rgba(2, 6, 23, 0.32);
  animation: cj-bank-toast-in 480ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.cj-bank-toast-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--cj-danger);
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.28);
  flex-shrink: 0;
  animation: cj-bank-dot-pulse 0.7s ease 0.5s 2 alternate both;
}

.cj-bank-toast-meta { min-width: 0; }
.cj-bank-toast-label { font-size: 11px; color: var(--cj-text-meta); line-height: 1.1; }
.cj-bank-toast-msg   { font-size: 13px; font-weight: 700; color: var(--cj-danger-border); line-height: 1.2; }
.cj-bank-toast-time  { margin-left: auto; font-size: 11px; color: var(--cj-text-meta); flex-shrink: 0; }

.cj-bank-receipt {
  margin-top: 8px;
  border-radius: 14px;
  background: #ffffff;
  border: 1px solid var(--cj-border);
  box-shadow: 0 16px 40px rgba(0,0,0,0.10);
  overflow: hidden;
  animation: cj-bank-card-in 480ms 100ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.cj-bank-receipt-head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px 10px;
  border-bottom: 1px solid var(--cj-divider);
}
.cj-bank-receipt-icon {
  font-size: 1.5em;
  flex-shrink: 0;
}
.cj-bank-receipt-title { font-weight: 800; color: var(--cj-text-strong); font-size: 0.88em; }
.cj-bank-receipt-sub   { font-size: 0.7em; color: var(--cj-text-muted); margin-top: 1px; }
.cj-bank-receipt-status {
  margin-left: auto;
  font-size: 0.72em;
  font-weight: 800;
  color: var(--cj-safe);
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
  color: var(--cj-text);
}
.cj-bank-receipt-row span { color: var(--cj-text-meta); }
.cj-bank-amount { color: var(--cj-danger) !important; }

.cj-bank-receipt-footer {
  padding: 8px 14px;
  background: var(--cj-danger-bg);
  border-top: 1px solid var(--cj-danger-border);
  font-size: 0.72em;
  color: var(--cj-danger-text);
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
  from { box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.28); }
  to   { box-shadow: 0 0 0 6px rgba(220, 38, 38, 0); }
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
class: px-14 py-2
zoom: 0.88
---

# The Double Con - Keeping the Victim Fooled

<Callout variant="note" noIcon>After hijacking your click, a smart attacker doesn't go silent. They <strong>listen for the click</strong> and immediately swap their page content, keeping the illusion alive while the damage is already done.</Callout>

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
  <div class="dc-panel dc-panel--reality" v-click>
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

<div class="dc-trick-box" v-click>
  <div class="dc-trick-title">How the attacker detects the click</div>
  <div class="dc-trick-code">window.addEventListener('blur', () => {<br>&nbsp;&nbsp;// iframe just stole focus = victim clicked<br>&nbsp;&nbsp;showFakeConfirmation()<br>})</div>
  <div class="dc-trick-caption">Same trick used to build the demo</div>
</div>

<style>
/* ── Double Con slide ─────────────────────────────────── */
.dc-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  align-items: stretch;
  margin-top: 10px !important;
}

.dc-panel {
  border-radius: 14px;
  overflow: hidden;
  border: 2px solid var(--cj-border);
  display: flex;
  flex-direction: column;
}

.dc-panel-label {
  font-size: 0.7em;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  padding: 5px 12px;
}
.dc-panel-label--victim  { background: var(--cj-safe-bg); color: var(--cj-safe-text); }
.dc-panel-label--reality { background: var(--cj-danger-bg); color: var(--cj-danger-text); }

/* Fake site */
.dc-fake-site { background: #fff; flex: 1; display: flex; flex-direction: column; }
.dc-fake-header {
  padding: 8px 12px;
  background: var(--cj-nav);
  display: flex;
  align-items: center;
}
.dc-fake-logo { font-size: 0.78em; font-weight: 800; color: var(--cj-surface); }
.dc-fake-tld  { color: var(--cj-text-meta); font-weight: 400; }

.dc-fake-body {
  padding: 8px 12px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  text-align: center;
  flex: 1;
}
.dc-fake-checkmark { font-size: 1.4em; animation: dc-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }
.dc-fake-title { font-weight: 800; font-size: 1em; color: var(--cj-text-strong); }
.dc-fake-sub   { font-size: 0.75em; color: var(--cj-text-muted); }

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
  color: var(--cj-text);
  padding: 3px 0;
  border-bottom: 1px solid var(--cj-divider);
}
.dc-fake-row span { color: var(--cj-text-meta); }
.dc-fake-free { color: var(--cj-safe) !important; }

.dc-fake-btn {
  margin-top: 6px;
  padding: 7px 18px;
  background: var(--cj-defense);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.78em;
  font-weight: 700;
  pointer-events: none;
}

/* Bank log */
.dc-bank-log {
  background: #ffffff;
  padding: 8px 12px;
  flex: 1;
}
.dc-bank-log-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.68em;
  color: var(--cj-text-muted);
  margin-bottom: 8px;
  font-family: monospace;
}
.dc-bank-log-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--cj-danger);
  box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.3);
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
  color: var(--cj-text-strong);
  padding: 3px 0;
  border-bottom: 1px solid var(--cj-divider);
}
.dc-bank-log-row span { color: var(--cj-text-meta); }
.dc-bank-red   { color: var(--cj-danger) !important; }
.dc-bank-green { color: var(--cj-safe) !important; }

.dc-inline-code {
  font-family: monospace;
  font-size: 0.9em;
  background: var(--cj-divider);
  color: var(--cj-defense-text);
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
  color: var(--cj-text-muted);
  font-style: italic;
}

/* Trick box - full-width row below the grid */
.dc-trick-box {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 10px;
  background: #ffffff;
  border: 1px solid var(--cj-text);
  border-radius: 12px;
  padding: 10px 16px;
}
.dc-trick-title {
  font-size: 0.68em;
  font-weight: 700;
  color: var(--cj-text-strong);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  flex-shrink: 0;
}
.dc-trick-code {
  flex: 1;
  font-size: 0.7em;
  color: var(--cj-text-strong);
  line-height: 1.5;
  font-family: monospace;
  background: var(--cj-divider);
  border-radius: 6px;
  padding: 6px 10px;
}
.dc-trick-caption {
  font-size: 0.68em;
  color: var(--cj-text-strong);
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

# The Stakes - What Attackers Actually Get

<div class="ri-intro mt-3">
  Impact scales with what the target allows in a single click. Here's the damage map:
</div>

<div class="ri-grid mt-4">

  <div class="ri-item" v-click>
    <OffsetCard title="Financial" accent="purple">
      <template #icon>💸</template>
      Unauthorized transfers, forced purchases, crypto withdrawals, subscription signups
    </OffsetCard>
  </div>

  <div class="ri-item" v-click>
    <OffsetCard title="Account takeover" accent="orange">
      <template #icon>🔐</template>
      Forced OAuth consent, email/password change, 2FA device registration
    </OffsetCard>
  </div>

  <div class="ri-item" v-click>
    <OffsetCard title="Privacy breach" accent="blue">
      <template #icon>🎤</template>
      Mic & camera access grants, file uploads to attacker, location sharing
    </OffsetCard>
  </div>

  <div class="ri-item" v-click>
    <OffsetCard title="Social manipulation" accent="green">
      <template #icon>📣</template>
      Fake likes, follows, reviews, GitHub stars - weaponized reputation at scale
    </OffsetCard>
  </div>

</div>

<Callout v-click variant="error" class="mt-8" noIcon><strong>The twist:</strong> browser, server logs, audit trail — all completely legitimate. No malware. No injection. Just a misplaced click.</Callout>

<style>
.ri-intro { font-size: 0.86em; color: var(--cj-text); }

.ri-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.ri-item {
  height: 100%;
  animation: ri-rise 320ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
.ri-item.slidev-vclick-hidden { animation-play-state: paused; }


@keyframes ri-rise {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>

---

# Notable Real-World Attacks

| Year | Target | Impact |
|------|--------|--------|
| 2008 | [Adobe Flash Player](https://blog.guya.net/2008/10/07/malicious-camera-spying-using-clickjacking/) | Mic/cam access via settings page |
| 2009 | [Twitter](https://www.theregister.com/2009/02/13/twitter_clickjack_attack/) | "Don't Click" worm — forced tweets at scale |
| 2010 | [Facebook](https://www.theregister.com/2010/06/01/facebook_clickjacking_worm/) | Mass Likejacking campaign |
| 2015 | [LinkedIn](https://www.securityweek.com/linkedin-patches-clickjacking-flaw-exploitable-css/) | CSS-based invisible action buttons |
| 2018 | [Yelp Reservations](https://hackerone.com/reports/355859) | Stored credit card charged via hijacked booking button |
| 2024 | [DoubleClickjacking](https://www.bleepingcomputer.com/news/security/new-doubleclickjacking-attack-exploits-double-clicks-to-hijack-accounts/) | OAuth consent hijack — Slack, Salesforce, Shopify |


---
layout: center
---

## Demo - Farm stars on GitHub

<ClickjackDemo
  victim-url="/victims/github-star.html"
  attacker-title="🏆 You're in the top 1%!"
  attacker-body="Our data shows you're one of the most active open-source contributors this month. Claim your free developer badge now."
  attacker-button="Claim My Badge 🎖️"
  ad-header="Don't miss your chance to claim your free developer badge now."
  ad-header-bg="#6366f1"
  attacker-bg="#24292f"
  victim-label="GitHub: Star octocat/Hello-World"
  :height="300"
  :ad-mode="true"
  :show-position-controls="true"
  :clickable="true"
  :start-y="-14"
  :start-x="-20"
/>

<!--
PRESENTER NOTE:
This is a real historical attack vector. Before GitHub added X-Frame-Options: DENY,
repos could be embedded on any attacker page. A single phishing prompt could
star-bomb any repository - inflating credibility, gaming the trending list.
Today GitHub is protected. But the same attack still lands on self-hosted GitLab,
Gitea, internal CI dashboards, or any platform with a one-click social action
that forgot the header.
-->

---

# When Are You Vulnerable? The Prerequisites

<div class="pq-intro mt-3">
  Three boxes must be checked for an attack to land. Fix any one - the attack collapses.
</div>

<div class="pq-steps mt-5">

  <div class="pq-step" v-click>
    <div class="pq-num">01</div>
    <div>
      <div class="pq-title">The page is embeddable in an <code>iframe</code></div>
      <div class="pq-desc">No <code>X-Frame-Options</code> header. No <code>Content-Security-Policy: frame-ancestors</code>. The browser happily loads the victim site inside any attacker-controlled frame.</div>
      <div class="pq-fix">↳ Fix: one HTTP header on your server</div>
    </div>
  </div>

  <div class="pq-step" v-click>
    <div class="pq-num">02</div>
    <div>
      <div class="pq-title">A sensitive action fires on a single click</div>
      <div class="pq-desc">No re-authentication, no CAPTCHA, no confirmation dialog. The victim is already logged in and the action executes immediately on click.</div>
      <div class="pq-fix">↳ Fix: confirmation step for financial or destructive operations</div>
    </div>
  </div>

  <div class="pq-step" v-click>
    <div class="pq-num">03</div>
    <div>
      <div class="pq-title">The attacker can predict the button's position</div>
      <div class="pq-desc">The target UI is public and stable. The attacker inspects the page, measures pixel offsets, then positions the iframe until their lure sits exactly over the target button.</div>
      <div class="pq-fix">↳ Not reliably preventable - which is why 01 and 02 are the only real fixes</div>
    </div>
  </div>

</div>

<style>
.pq-intro { font-size: 0.86em; color: var(--cj-text); }

.pq-steps {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pq-step {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding: 14px 16px;
  background: var(--cj-surface);
  border: 1px solid var(--cj-border);
  border-radius: 12px;
  animation: pq-in 360ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
.pq-step.slidev-vclick-hidden { animation-play-state: paused; }

.pq-num {
  font-size: 2em;
  font-weight: 900;
  color: var(--cj-text-strong);
  line-height: 1;
  min-width: 2.4rem;
  text-align: center;
}

.pq-title { font-size: 0.84em; font-weight: 800; color: var(--cj-text-strong); margin-bottom: 3px; }
.pq-desc  { font-size: 0.76em; color: var(--cj-text-muted); line-height: 1.45; }
.pq-fix   { margin-top: 5px; font-size: 0.72em; font-weight: 700; color: var(--cj-safe); }

@keyframes pq-in {
  from { opacity: 0; transform: translateX(-12px); }
  to   { opacity: 1; transform: translateX(0); }
}

</style>

---

# How Does the Victim's Session Get In?

<div class="sc-intro mt-3">
  The attack requires the victim to be logged into the target site. Here's why their session automatically reaches the attacker's iframe.
</div>

<div class="sc-flow mt-6">

  <div class="sc-step">
    <div class="sc-step-header">
      <span class="sc-step-num">01</span>
      <span class="sc-step-icon">🔐</span>
    </div>
    <div class="sc-step-title">Login stores a credential</div>
    <div class="sc-step-desc">You authenticate with your bank. The browser stores a credential — a <strong>session cookie</strong> or <strong>JWT</strong> — that proves your identity on every future request.</div>
  </div>

  <div class="sc-arrow" aria-hidden="true">→</div>

  <div class="sc-step sc-step--mid">
    <div class="sc-step-header">
      <span class="sc-step-num">02</span>
      <span class="sc-step-icon">🎣</span>
    </div>
    <div class="sc-step-title">Attacker embeds your bank</div>
    <div class="sc-step-desc">The attacker loads your bank invisibly in an <code>iframe</code>. Your browser <em>automatically</em> sends your cookie with that request; it never checks who's asking.</div>
  </div>

  <div class="sc-arrow" aria-hidden="true">→</div>

  <div class="sc-step sc-step--end">
    <div class="sc-step-header">
      <span class="sc-step-num">03</span>
      <span class="sc-step-icon">🏦</span>
    </div>
    <div class="sc-step-title">Bank sees a valid session</div>
    <div class="sc-step-desc">The server receives the cookie, recognizes you, and renders your full account page. The attack is primed. One click away.</div>
  </div>

</div>

<div class="sc-fix" v-click>
  <span class="sc-fix-label">🍪 Partial fix</span>
  <span class="sc-fix-text"><code>SameSite=Lax</code> (now the browser default) tells the browser not to send cookies inside cross-site iframes; the bank shows a login screen instead. Still, pair it with frame headers for a complete defense.</span>
</div>

<div class="sc-caveat" v-click>
  <span class="sc-caveat-label">⚠️ JWT in <code>localStorage</code>?</span>
  <span class="sc-caveat-text"><code>SameSite</code> doesn't help — there's no cookie. The framed page reads its own <code>localStorage</code> and attaches the token itself. Frame headers are the <em>only</em> fix.</span>
</div>

<style>
/* ── Session cookie slide ───────────────────────────── */
.sc-intro {
  font-size: 0.86em;
  color: var(--cj-text);
}

.sc-flow {
  display: grid;
  grid-template-columns: 1fr 48px 1fr 48px 1fr;
  align-items: stretch;
}

.sc-step {
  background: var(--cj-surface);
  border: 1.5px solid var(--cj-border);
  border-radius: 14px;
  padding: 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.sc-step--mid { background: var(--cj-warning-bg); border-color: var(--cj-warning-border); }
.sc-step--end { background: var(--cj-danger-bg); border-color: var(--cj-danger-border); }

.sc-step-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.sc-step-num {
  font-size: 0.65em;
  font-weight: 900;
  color: var(--cj-text-meta);
  letter-spacing: 2px;
}
.sc-step-icon { font-size: 1.7em; line-height: 1; }
.sc-step-title { font-size: 0.86em; font-weight: 800; color: var(--cj-text-strong); }
.sc-step-desc  { font-size: 0.74em; color: var(--cj-text-muted); line-height: 1.5; }

.sc-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4em;
  color: #cbd5e1;
  font-weight: 700;
}

.sc-fix {
  display: flex;
  gap: 12px;
  align-items: baseline;
  margin-top: 18px;
  padding: 10px 16px;
  background: var(--cj-safe-bg);
  border: 1px solid var(--cj-safe-border);
  border-radius: 12px;
  font-size: 0.78em;
  line-height: 1.5;
  animation: sc-rise 360ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
.sc-fix.slidev-vclick-hidden { animation-play-state: paused; }
.sc-fix-label { font-weight: 800; color: var(--cj-warning-text); white-space: nowrap; }
.sc-fix-text  { color: var(--cj-text); }

.sc-caveat {
  display: flex;
  gap: 12px;
  align-items: baseline;
  margin-top: 18px;
  padding: 10px 16px;
  background: var(--cj-danger-bg);
  border: 1px solid var(--cj-danger-border);
  border-radius: 12px;
  font-size: 0.78em;
  line-height: 1.5;
  animation: sc-rise 360ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
.sc-caveat.slidev-vclick-hidden { animation-play-state: paused; }
.sc-caveat-label { font-weight: 800; color: var(--cj-danger-text); white-space: nowrap; }
.sc-caveat-text  { color: var(--cj-text); }

@keyframes sc-rise {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>

---

# Pre-armed Forms & Chained Clicks

<div class="mt-3 text-sm text-slate-600">
  Some sites accept form values via URL, handing the attacker a pre-armed payload.
</div>

<div class="mt-5 font-mono text-sm bg-slate-50 border border-slate-200 rounded-xl p-4 text-blue-700">
  https://bank.com/transfer<strong>?amount=500&amp;to=attacker_account</strong>
</div>

<Callout variant="info" class="mt-5">The attacker loads the victim page inside an iframe with the form <strong>already filled</strong>, then overlays just the submit button with their lure. One click from the victim and the transaction fires without them ever choosing to initiate it.</Callout>

<Callout v-click variant="escalation" class="mt-4">
  <strong>Chain it.</strong> Nothing stops placing <em>two</em> fake buttons over two different successive targets inside an iframe:
  <div class="mt-2 flex gap-2 font-mono text-xs">
    <div class="flex-1 bg-white rounded-lg border border-orange-200 px-3 py-2 text-center">
      <div class="text-orange-600 font-bold">Click 1</div>
      <div class="text-slate-500 mt-0.5">Fake: "Dismiss banner"</div>
      <div class="text-slate-400 text-[10px] mt-1">↓ real: Accept ToS</div>
    </div>
    <div class="flex-1 bg-white rounded-lg border border-orange-200 px-3 py-2 text-center">
      <div class="text-orange-600 font-bold">Click 2</div>
      <div class="text-slate-500 mt-0.5">Fake: "Confirm free trial"</div>
      <div class="text-slate-400 text-[10px] mt-1">↓ real: Pay $500</div>
    </div>
  </div>
  <div class="mt-2 text-slate-500">No single action looks suspicious. The victim never suspects a thing.</div>
</Callout>
