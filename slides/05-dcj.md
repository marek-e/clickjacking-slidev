# DoubleClickjacking — No iframe Required

<span class="dcj-badge">2024 · Paulos Yibelo</span>

<Callout variant="error" class="mt-4" noIcon>"You set <code>X-Frame-Options: DENY</code> on every page." Doesn't matter. <strong>No iframe is involved.</strong></Callout>

<div class="dcj-three-col mt-6">
  <OffsetCard title="Classic Clickjacking" accent="blue">
    <template #icon>🖼️</template>
    Loads victim in an invisible <code>iframe</code>. Blocked by <code>X-Frame-Options</code> and <code>CSP frame-ancestors</code>.
  </OffsetCard>
  <OffsetCard title="DoubleClickjacking" accent="red">
    <template #icon>🖱️</template>
    Uses a <strong>popup window</strong> and the <code>window.opener</code> API. Zero iframes. All frame-based defenses are blind to it.
  </OffsetCard>
  <OffsetCard title="What's Bypassed" accent="orange">
    <template #icon>🚫</template>
    <code>X-Frame-Options</code> · <code>CSP frame-ancestors</code> · <code>SameSite</code> cookies (Lax &amp; Strict)
  </OffsetCard>
</div>

<style>
.dcj-badge {
  display: inline-block;
  padding: 3px 12px;
  border-radius: 999px;
  background: var(--cj-danger-bg);
  color: var(--cj-danger-text);
  border: 1px solid var(--cj-danger-border);
  font-size: 0.72em;
  font-weight: 700;
  letter-spacing: 0.3px;
}
.dcj-three-col {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
</style>

---

# How It Works — The Timing Trick

<div class="dcj-steps mt-5">
  <div class="dcj-step">
    <div class="dcj-step-num">01</div>
    <div>
      <div class="dcj-step-title">Attacker serves a popup</div>
      <div class="dcj-step-desc">A decoy popup opens asking the victim to <strong>"double-click to verify you're human."</strong> The popup's parent window is the attacker's page — it holds <code>window.opener</code> access to control the parent's URL.</div>
    </div>
  </div>

  <div class="dcj-step">
    <div class="dcj-step-num">02</div>
    <div>
      <div class="dcj-step-title"><code>mousedown</code> fires — parent page swaps silently</div>
      <div class="dcj-step-desc">On the <em>first press</em> of the double-click, <code>mousedown</code> fires immediately. The popup runs <code>window.opener.location = 'https://slack.com/oauth/v2/authorize?…'</code>, redirecting the parent tab to a real OAuth consent screen.</div>
    </div>
  </div>

  <div class="dcj-step dcj-step--red">
    <div class="dcj-step-num">03</div>
    <div>
      <div class="dcj-step-title"><code>mouseup</code> completes — on the OAuth "Allow" button</div>
      <div class="dcj-step-desc">By the time the second click completes, the parent tab has loaded the consent screen with the "Allow" button exactly under the cursor. The victim just authorized the attacker's app without realizing it.</div>
    </div>
  </div>
</div>

<div class="dcj-timing-note" v-click>
  <code>mousedown → opener.location swap → mouseup → click on Allow</code>
  <span>The entire UI swap happens in the ~100 ms gap between press and release — imperceptible to humans, reliable for scripts.</span>
</div>

<style>
.dcj-steps { display: flex; flex-direction: column; gap: 10px; }

.dcj-step {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding: 12px 16px;
  background: var(--cj-surface);
  border: 1px solid var(--cj-border);
  border-radius: 12px;
}
.dcj-step--red { background: var(--cj-danger-bg); border-color: var(--cj-danger-border); }

.dcj-step-num {
  font-size: 1.8em;
  font-weight: 900;
  color: var(--cj-text-strong);
  line-height: 1;
  min-width: 2.2rem;
  text-align: center;
}
.dcj-step-title { font-size: 0.84em; font-weight: 800; color: var(--cj-text-strong); margin-bottom: 3px; }
.dcj-step-desc  { font-size: 0.76em; color: var(--cj-text-muted); line-height: 1.45; }

.dcj-timing-note {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 12px;
  padding: 10px 16px;
  background: #fff;
  border: 1.5px solid var(--cj-text);
  border-radius: 12px;
  font-size: 0.76em;
  animation: dcj-rise 380ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
.dcj-timing-note.slidev-vclick-hidden { animation-play-state: paused; }
.dcj-timing-note code {
  font-family: monospace;
  font-size: 0.85em;
  background: var(--cj-divider);
  padding: 4px 8px;
  border-radius: 6px;
  white-space: nowrap;
  flex-shrink: 0;
  color: var(--cj-text-strong);
}
.dcj-timing-note span { color: var(--cj-text-muted); }

@keyframes dcj-rise {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>

---
layout: center
---

## Demo — OAuth Hijack via Double-Click

<DblClickDemo />

<!--
PRESENTER NOTE:
Ask the audience: "What do you think you're double-clicking?"
Then perform the double-click on "Double-click to verify".
The panel swaps mid-press; mouseup fires on the now-visible "Allow" button.
Show the damage card: one double-click, full Slack OAuth access granted.
-->

---
zoom: 0.92
---

# DoubleClickjacking — Targets & Defense

<div class="grid grid-cols-2 gap-6 mt-4">

<div>

**Vulnerable targets:**

- OAuth consent flows — Slack, Salesforce, Shopify, GitHub Apps
- Crypto wallet transaction approvals
- Payment confirmations & subscription signups
- Account changes: email, password, 2FA device registration

<Callout variant="error" class="mt-4" noIcon>PoCs publicly demonstrated on Salesforce and Slack with full account takeover in a single double-click.</Callout>

</div>

<div v-click>

**Defense approaches:**

| Approach | What it does |
|----------|-------------|
| `pointer-events: none` on load | Disable sensitive buttons; re-enable only after cursor moves over them naturally |
| Activation delay (100–500 ms) | Require hover before click registers on OAuth buttons |
| `rel="noopener noreferrer"` | Prevent child windows from reading or writing `window.opener.location` |
| Browser heuristics | Chrome/Firefox adding event-timing checks (in progress as of 2025) |

<Callout variant="error" class="mt-3" noIcon><code>X-Frame-Options</code> and <code>CSP frame-ancestors</code> don't help here. There is no iframe.</Callout>

</div>

</div>
