---
zoom: 0.9
---

# Defense #1 - X-Frame-Options

<div class="grid grid-cols-2 gap-6 mt-2">

<div>

**The original header** (2009, legacy but still useful) [MDN docs ↗](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options)

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
- `SAMEORIGIN` still allows framing from any same-origin page - an XSS or user-controlled page on your own domain is enough
- Being superseded by CSP `frame-ancestors`

**Still recommended** as defense-in-depth alongside CSP. Universally understood by browsers, zero-cost to add.

<Callout variant="warning" class="mt-4">Missing on <strong>~63%</strong> of production sites — <a href="https://almanac.httparchive.org/en/2024/security" target="_blank">HTTP Archive Web Almanac 2024</a></Callout>

</div>

</div>

---
zoom: 0.9
---

# Defense #2 - CSP `frame-ancestors`

<InfoPopover title="What is CSP?" width="620px" x="4.5rem" y="5.5rem">
  <p><strong>Content Security Policy</strong> is an HTTP response header that lets a server declare which sources are trusted for loading resources — scripts, styles, images, and frames.</p>
  <div class="ip-code">Content-Security-Policy: &lt;directive&gt; &lt;sources&gt;; &lt;directive&gt; &lt;sources&gt;;</div>
  <p style="margin-top:8px">Most common use: <strong>blocking XSS</strong> by restricting where scripts can load from:</p>
  <div class="ip-code">script-src 'self' https://cdn.example.com;</div>
  <p style="margin-top:8px">This blocks inline scripts and untrusted origins — cutting off the most common XSS vectors.<br><br>
  <code>frame-ancestors</code> is a separate directive controlling who can embed your page in an <code>&lt;iframe&gt;</code>.</p>
</InfoPopover>

<div class="grid grid-cols-2 gap-6 mt-2">

<div>

**The modern standard** (recommended over XFO) [MDN docs ↗](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors)

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

<Callout variant="warning" class="mt-4">Missing on <strong>~89%</strong> of production sites — <a href="https://almanac.httparchive.org/en/2024/security" target="_blank">HTTP Archive Web Almanac 2024</a></Callout>

</div>

<div v-click>

**CSP vs X-Frame-Options:**

| Feature | XFO | CSP |
|---------|:---:|:---:|
| Multi-origin allowlist | ❌ | ✅ |
| Wildcard subdomains | ❌ | ✅ |
| Report-only mode | ❌ | ✅ |

**Best practice: set both** for maximum compatibility:

```http
X-Frame-Options: DENY
Content-Security-Policy: frame-ancestors 'none';
```

If they conflict, CSP `frame-ancestors` takes precedence in modern browsers.

</div>

</div>

<style>
.ip-code {
  font-family: monospace;
  font-size: 1em;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 6px 8px;
  margin-top: 6px;
  color: #1e40af;
  word-break: break-all;
}
.ip-body code {
  background: #f1f5f9;
  padding: 1px 5px;
  border-radius: 4px;
}
.ip-body p { margin: 0; }
</style>

---

# Defense #3 - JavaScript Framebusting

<Callout variant="note" class="mt-2 mb-3">Before HTTP headers existed for this, developers wrote client-side JS to detect iframe nesting and force the top window to navigate away. It was the best available option in 2008, broken almost immediately after.</Callout>

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

<Callout variant="error" class="mt-3">JS framebusting is unreliable. Use HTTP headers only.</Callout>

</div>

</div>

---
class: px-14 py-4
zoom: 0.9
---

# Frame Busting Bypass - Live

<div class="fb-grid mt-4">

  <div class="fb-panel">
    <div class="fb-panel-label fb-panel-label--ok">✅ Without bypass - frame buster works</div>
    <div class="fb-mock">
      <div class="fb-mock-nav">🏦 SecureBank: Transfer $500</div>
      <div class="fb-mock-body fb-mock-body--escaped">
        <div class="fb-mock-icon">🚀</div>
        <div class="fb-mock-title">Frame buster activated!</div>
        <div class="fb-mock-sub">top.location redirected; victim's full tab navigates away from the attacker's page</div>
      </div>
    </div>
    <div class="fb-verdict fb-verdict--ok">Attack aborted. The attacker loses the victim.</div>
  </div>

  <div class="fb-panel" v-click>
    <div class="fb-panel-label fb-panel-label--fail">❌ Attacker adds <code>sandbox</code> - bypass succeeds</div>

```html
<iframe src="bank.com/transfer"
  sandbox="allow-scripts allow-forms">
  <!-- allow-top-navigation absent -->
</iframe>
```

<div class="fb-live-badge">LIVE</div>
<div class="fb-iframe-wrap">
  <iframe
    src="/victims/framebusting-victim.html"
    sandbox="allow-scripts allow-same-origin"
    style="width:100%;height:130px;border:none">
  </iframe>
</div>
<div class="fb-verdict fb-verdict--fail">Frame buster throws <code>SecurityError</code>. Victim stays trapped. Attack proceeds.</div>

  </div>

</div>

<style>
.fb-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: start;
}

.fb-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
  animation: fb-in 340ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
.fb-panel.slidev-vclick-hidden { animation-play-state: paused; }

.fb-panel-label {
  font-size: 0.72em;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 6px;
}
.fb-panel-label--ok   { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
.fb-panel-label--fail { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }

.fb-mock {
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
}
.fb-mock-nav {
  background: #1a3a5c;
  color: #fff;
  font-size: 0.72em;
  font-weight: 700;
  padding: 6px 12px;
}
.fb-mock-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 12px;
  height: 90px;
}
.fb-mock-body--escaped { background: #f0fdf4; }
.fb-mock-icon { font-size: 1.6em; }
.fb-mock-title { font-size: 0.8em; font-weight: 800; color: #15803d; }
.fb-mock-sub   { font-size: 0.68em; color: #6b7280; text-align: center; line-height: 1.4; }

.fb-live-badge {
  display: inline-block;
  font-size: 0.62em;
  font-weight: 800;
  letter-spacing: 1px;
  background: #dc2626;
  color: #fff;
  padding: 2px 7px;
  border-radius: 4px;
}

.fb-iframe-wrap {
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
}

.fb-verdict {
  font-size: 0.72em;
  padding: 6px 10px;
  border-radius: 7px;
}
.fb-verdict--ok   { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
.fb-verdict--fail { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }

@keyframes fb-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>

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
class: px-14 py-6
hide: true
zoom: 0.9
---

# Clickjacking vs CSRF - Not the Same Thing

<div class="csrf-intro mt-3">
  Both attacks exploit an authenticated session, but the mechanism is different, and so are the defenses. Knowing the difference matters because <strong>fixing one does not fix the other.</strong>
</div>

<div class="csrf-grid mt-4">

  <div class="csrf-card" v-click>
    <div class="csrf-card-label csrf-label--blue">CSRF - Cross-Site Request Forgery</div>
    <div class="csrf-card-body">
      <div class="csrf-row">
        <span class="csrf-key">How</span>
        <span>Hidden request fires automatically via an <code>&lt;img&gt;</code>, a <code>&lt;form&gt;</code>, or a <code>fetch()</code> on an attacker page the victim merely <em>visits</em></span>
      </div>
      <div class="csrf-row">
        <span class="csrf-key">Interaction</span>
        <span>None needed. The victim doesn't have to click anything.</span>
      </div>
      <div class="csrf-row">
        <span class="csrf-key">Victim sees</span>
        <span>Nothing; the attack is invisible</span>
      </div>
      <div class="csrf-row">
        <span class="csrf-key">Stopped by</span>
        <span>✅ CSRF tokens &nbsp;·&nbsp; ✅ SameSite cookies &nbsp;·&nbsp; ✅ Origin/Referer checks</span>
      </div>
    </div>
  </div>

  <div class="csrf-card" v-click>
    <div class="csrf-card-label csrf-label--red">Clickjacking - UI Redressing</div>
    <div class="csrf-card-body">
      <div class="csrf-row">
        <span class="csrf-key">How</span>
        <span>The victim <em>actually clicks</em> on a real button, in a real authenticated page, inside an invisible iframe overlay</span>
      </div>
      <div class="csrf-row">
        <span class="csrf-key">Interaction</span>
        <span>Required. The victim must physically click.</span>
      </div>
      <div class="csrf-row">
        <span class="csrf-key">Victim sees</span>
        <span>A decoy page; they think they're clicking something harmless</span>
      </div>
      <div class="csrf-row">
        <span class="csrf-key">Stopped by</span>
        <span>❌ CSRF tokens (useless) &nbsp;·&nbsp; ✅ Frame headers &nbsp;·&nbsp; ✅ SameSite cookies</span>
      </div>
    </div>
  </div>

</div>

<Callout v-click variant="warning" class="mt-3"><strong>The dangerous misconception:</strong> "We have CSRF tokens, we're safe." With clickjacking the victim clicks a real button in a real session. The CSRF token is legitimately present and valid. The server cannot tell it was a tricked click. Frame headers are the only fix.</Callout>

<style>
.csrf-intro { font-size: 0.84em; color: #374151; line-height: 1.5; }

.csrf-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.csrf-card {
  border-radius: 14px;
  overflow: hidden;
  border: 1.5px solid #e5e7eb;
  animation: csrf-rise 340ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
.csrf-card.slidev-vclick-hidden { animation-play-state: paused; }

.csrf-card-label {
  font-size: 0.72em;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  padding: 6px 14px;
}
.csrf-label--blue { background: #eff6ff; color: #1d4ed8; border-bottom: 1px solid #bfdbfe; }
.csrf-label--red  { background: #fef2f2; color: #b91c1c; border-bottom: 1px solid #fecaca; }

.csrf-card-body {
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 7px;
  background: #fff;
}

.csrf-row {
  display: flex;
  gap: 10px;
  font-size: 0.74em;
  color: #374151;
  line-height: 1.4;
}
.csrf-key {
  font-weight: 800;
  color: #6b7280;
  min-width: 72px;
  flex-shrink: 0;
  padding-top: 1px;
}

</style>

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
