<script setup>
import { ref } from 'vue'

const phase = ref('idle')

function onVerifyDown() {
  phase.value = 'auth'
}

function onAllowUp() {
  if (phase.value === 'auth') {
    phase.value = 'done'
  }
}
</script>

<template>
  <div class="dcjd-root">
    <!-- Card wrapper: fixed height keeps layout stable during the instant swap -->
    <div class="dcjd-card">

      <!-- Panel A: Security-check decoy (visible when idle) -->
      <div class="dcjd-panel" :class="phase === 'idle' ? 'dcjd-on' : 'dcjd-off'">
        <span class="dcjd-icon">🔒</span>
        <h3 class="dcjd-title">Security Verification Required</h3>
        <p class="dcjd-body">Please double-click below to prove you're not a robot.</p>
        <button class="dcjd-btn dcjd-btn--blue" @mousedown.prevent="onVerifyDown">
          Double-click to verify ✓
        </button>
        <p class="dcjd-hint">Protected by reCAPTCHA Enterprise</p>
      </div>

      <!-- Panel B: OAuth consent (visible when auth or done) -->
      <!-- Both panels in DOM simultaneously; transition:none ensures mouseup hits this button -->
      <div class="dcjd-panel" :class="phase !== 'idle' ? 'dcjd-on' : 'dcjd-off'">
        <div class="dcjd-oauth-head">
          <div class="dcjd-slack-badge">S</div>
          <div>
            <div class="dcjd-app-name">HackerApp</div>
            <div class="dcjd-app-sub">wants to access your Slack workspace</div>
          </div>
        </div>
        <div class="dcjd-scopes">
          <div class="dcjd-scope">📖 Read all channels &amp; messages</div>
          <div class="dcjd-scope">👥 Access member information</div>
          <div class="dcjd-scope">✉️ Send messages as you</div>
        </div>
        <button class="dcjd-btn dcjd-btn--green" @mouseup="onAllowUp">Allow</button>
        <button class="dcjd-btn dcjd-btn--ghost">Cancel</button>
      </div>
    </div>

    <!-- Damage card: slides in from the right after double-click completes -->
    <div v-if="phase === 'done'" class="dcjd-damage">
      <div class="dcjd-toast">
        <div class="dcjd-dot"></div>
        <div class="dcjd-toast-body">
          <div class="dcjd-toast-label">Slack</div>
          <div class="dcjd-toast-msg">HackerApp connected</div>
        </div>
        <div class="dcjd-toast-time">now</div>
      </div>
      <div class="dcjd-receipt">
        <div class="dcjd-receipt-head">
          <span class="dcjd-receipt-emoji">🔓</span>
          <div>
            <div class="dcjd-receipt-title">OAuth Access Granted</div>
            <div class="dcjd-receipt-sub">Slack · HackerApp</div>
          </div>
          <span class="dcjd-receipt-badge">✅ DONE</span>
        </div>
        <div class="dcjd-receipt-rows">
          <div class="dcjd-receipt-row"><span>App</span><strong>HackerApp</strong></div>
          <div class="dcjd-receipt-row"><span>Scopes</span><strong>read, write, users:read</strong></div>
          <div class="dcjd-receipt-row"><span>Method</span><code>DoubleClickjacking</code></div>
        </div>
        <div class="dcjd-receipt-footer">You double-clicked once. That's all it took. 🔓</div>
      </div>
    </div>
  </div>
</template>

<style>
/* ── DblClickDemo ────────────────────────────────────── */
.dcjd-root {
  position: relative;
  display: flex;
  justify-content: center;
  width: 680px;
  margin: 0 auto;
}

.dcjd-card {
  position: relative;
  width: 360px;
  height: 320px;
  flex-shrink: 0;
}

.dcjd-panel {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 24px 28px;
  border-radius: 18px;
  background: #ffffff;
  border: 1.5px solid var(--cj-border);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.09);
}

/* No transition — instant swap so mouseup registers on the new button */
.dcjd-on  { opacity: 1; pointer-events: auto;  z-index: 2; }
.dcjd-off { opacity: 0; pointer-events: none;   z-index: 1; }

/* Panel A */
.dcjd-icon  { font-size: 2em; line-height: 1; }
.dcjd-title { font-size: 0.95em; font-weight: 800; color: var(--cj-text-strong); margin: 0; text-align: center; }
.dcjd-body  { font-size: 0.76em; color: var(--cj-text-muted); margin: 0; text-align: center; line-height: 1.4; }
.dcjd-hint  { font-size: 0.64em; color: var(--cj-text-meta); margin: 0; }

.dcjd-btn {
  padding: 9px 24px;
  border: none;
  border-radius: 10px;
  font-size: 0.82em;
  font-weight: 800;
  cursor: pointer;
  width: 100%;
}
.dcjd-btn--blue  { background: var(--cj-defense);  color: #fff; box-shadow: 0 4px 14px rgba(59,130,246,0.28); }
.dcjd-btn--green { background: var(--cj-safe);     color: #fff; box-shadow: 0 4px 14px rgba(22,163,74,0.28);  }
.dcjd-btn--ghost { background: transparent; color: var(--cj-text-muted); border: 1px solid var(--cj-border); }

/* Panel B */
.dcjd-oauth-head {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--cj-divider);
}
.dcjd-slack-badge {
  width: 38px; height: 38px;
  border-radius: 10px;
  background: #4a154b;
  color: #fff;
  font-size: 1.3em;
  font-weight: 900;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.dcjd-app-name { font-size: 0.85em; font-weight: 800; color: var(--cj-text-strong); }
.dcjd-app-sub  { font-size: 0.7em; color: var(--cj-text-muted); }

.dcjd-scopes { width: 100%; display: flex; flex-direction: column; gap: 5px; }
.dcjd-scope {
  font-size: 0.74em;
  color: var(--cj-text);
  padding: 5px 10px;
  background: var(--cj-surface);
  border-radius: 8px;
  border: 1px solid var(--cj-border);
}

/* Damage card — positioned to the right of the card */
.dcjd-damage {
  position: absolute;
  top: -16px;
  right: 0;
  width: 280px;
  z-index: 40;
  animation: dcjd-in 400ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.dcjd-toast {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 11px;
  border-radius: 12px;
  background: var(--cj-nav);
  border: 1px solid rgba(148,163,184,0.35);
  box-shadow: 0 12px 36px rgba(2,6,23,0.28);
}
.dcjd-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--cj-danger);
  box-shadow: 0 0 0 3px rgba(220,38,38,0.3);
  flex-shrink: 0;
}
.dcjd-toast-body  { min-width: 0; }
.dcjd-toast-label { font-size: 10px; color: var(--cj-text-meta); line-height: 1.1; }
.dcjd-toast-msg   { font-size: 12px; font-weight: 700; color: var(--cj-danger-border); line-height: 1.2; }
.dcjd-toast-time  { margin-left: auto; font-size: 10px; color: var(--cj-text-meta); flex-shrink: 0; }

.dcjd-receipt {
  margin-top: 6px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid var(--cj-border);
  box-shadow: 0 12px 32px rgba(0,0,0,0.08);
  overflow: hidden;
}
.dcjd-receipt-head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px 8px;
  border-bottom: 1px solid var(--cj-divider);
}
.dcjd-receipt-emoji  { font-size: 1.4em; flex-shrink: 0; }
.dcjd-receipt-title  { font-weight: 800; color: var(--cj-text-strong); font-size: 0.8em; line-height: 1.1; }
.dcjd-receipt-sub    { font-size: 0.65em; color: var(--cj-text-muted); margin-top: 1px; }
.dcjd-receipt-badge  { margin-left: auto; font-size: 0.62em; font-weight: 800; color: var(--cj-safe); flex-shrink: 0; }

.dcjd-receipt-rows { padding: 8px 12px; display: flex; flex-direction: column; gap: 4px; }
.dcjd-receipt-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.72em;
  color: var(--cj-text);
  padding: 2px 0;
  border-bottom: 1px solid var(--cj-divider);
}
.dcjd-receipt-row span { color: var(--cj-text-meta); }
.dcjd-receipt-row code {
  background: var(--cj-divider);
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 0.9em;
}

.dcjd-receipt-footer {
  padding: 6px 12px;
  background: var(--cj-danger-bg);
  border-top: 1px solid var(--cj-danger-border);
  font-size: 0.68em;
  font-weight: 700;
  color: var(--cj-danger-text);
  text-align: center;
}

@keyframes dcjd-in {
  from { opacity: 0; transform: translateX(18px) scale(0.97); }
  to   { opacity: 1; transform: translateX(0) scale(1); }
}
</style>
