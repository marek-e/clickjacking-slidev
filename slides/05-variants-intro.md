---
layout: center
class: text-center px-16
zoom: 0.9
---

<div aria-hidden="true" style="position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0">
  <div style="position:absolute;top:-60px;right:-40px;width:280px;height:280px;border-radius:50%;background:rgba(220,38,38,0.10);filter:blur(48px)"></div>
  <div style="position:absolute;bottom:-50px;left:-30px;width:240px;height:240px;border-radius:50%;background:rgba(234,88,12,0.08);filter:blur(40px)"></div>
</div>

<div style="position:relative;z-index:1">

<span class="av-eyebrow">Beyond the iframe</span>

# You Fixed the Frame.<br/>They Changed the Game.

<p class="av-lead">
  Classic clickjacking dies when you ship <code>X-Frame-Options</code> and <code>frame-ancestors</code>.
  Attackers didn't retire — they moved to layers your headers never see.
</p>

<div class="av-grid mt-8">

  <div class="av-card" v-click>
    <div class="av-card-tag av-card-tag--red">Coming up first</div>
    <div class="av-card-icon" aria-hidden="true">🖱️🖱️</div>
    <div class="av-card-title">DoubleClickjacking</div>
    <p class="av-card-body">
      Popup + <code>window.opener</code> + the gap between <code>mousedown</code> and <code>mouseup</code>.
      Hijacks OAuth without a single iframe.
    </p>
    <div class="av-card-hook">"Double-click to verify you're human."</div>
  </div>

  <div class="av-card" v-click>
    <div class="av-card-tag av-card-tag--orange">Then</div>
    <div class="av-card-icon" aria-hidden="true">🧩</div>
    <div class="av-card-title">Extension Clickjacking</div>
    <p class="av-card-body">
      No victim site in a frame. The target is <strong>your password manager's UI</strong> —
      injected into the page DOM, hidden with one line of CSS.
    </p>
    <div class="av-card-hook">"Accept all cookies" → credentials gone.</div>
  </div>

</div>

</div>

<style>
.av-eyebrow {
  display: inline-block;
  padding: 4px 14px;
  border-radius: 999px;
  border: 1px solid var(--cj-danger-border);
  background: var(--cj-danger-bg);
  color: var(--cj-danger-text);
  font-size: 0.72em;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.av-lead {
  margin: 1rem auto 0;
  max-width: 36rem;
  font-size: 1.05em;
  line-height: 1.55;
  color: var(--cj-text);
}

.av-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  text-align: left;
}

.av-card {
  position: relative;
  padding: 18px 18px 16px;
  border-radius: 16px;
  border: 1.5px solid var(--cj-border);
  background: #fff;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
  animation: av-rise 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
.av-card.slidev-vclick-hidden { animation-play-state: paused; }

.av-card-tag {
  display: inline-block;
  margin-bottom: 10px;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.62em;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.av-card-tag--red {
  background: var(--cj-danger-bg);
  color: var(--cj-danger-text);
  border: 1px solid var(--cj-danger-border);
}
.av-card-tag--orange {
  background: var(--cj-warning-bg);
  color: var(--cj-warning-text);
  border: 1px solid var(--cj-warning-border);
}

.av-card-icon { font-size: 1.6em; line-height: 1; margin-bottom: 6px; }
.av-card-title {
  font-size: 1.15em;
  font-weight: 900;
  color: var(--cj-text-strong);
  margin-bottom: 6px;
}
.av-card-body {
  margin: 0;
  font-size: 0.82em;
  line-height: 1.5;
  color: var(--cj-text-muted);
}
.av-card-hook {
  margin-top: 12px;
  padding: 8px 10px;
  border-radius: 10px;
  background: var(--cj-surface);
  border: 1px dashed var(--cj-border);
  font-size: 0.76em;
  font-style: italic;
  color: var(--cj-text);
}

.av-punch {
  margin: 0 auto;
  max-width: 32rem;
  font-size: 1.1em;
  line-height: 1.5;
  color: var(--cj-text-strong);
  animation: av-rise 380ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
.av-punch.slidev-vclick-hidden { animation-play-state: paused; }

@keyframes av-rise {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
