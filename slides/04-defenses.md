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
