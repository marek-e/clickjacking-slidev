---
theme: default
transition: fade
title: Clickjacking — Understanding & Defending
class: text-center
---

# Clickjacking

### Understand the attack. Master the defense.

---

# Agenda

- Definition & intuition
- Attack mechanics
- Variants
- Targets & impact
- Detection
- Modern defenses
- Common pitfalls
- Real-world cases
- Final checklist
- Live PoC

---

# Definition

## Clickjacking = Click hijacking

- User thinks they click A → actually clicks B
- Visual/interactive masking
- No need to infect the victim

---

# Intuition

- Visible benign page
- Hidden iframe layered on top
- One click = sensitive action on another site

---

# Technical Mechanics

- **iframe** embedding from another origin
- CSS tricks: opacity, z-index, pointer-events
- User interacts with invisible content
- Not phishing (no imitation), not XSS (no injection)

---

# Key Variants

## UI Redressing

Overlapping clickable UI

## Likejacking

Hijacking social actions

## Cursorjacking

Fake cursor vs real cursor position

## File Upload Hijacking

Invisible overlay on upload fields

---

# Typical Targets

- Change email/password
- Transfer money
- Delete account
- Force OAuth consent
- Admin-panel actions

---

# Impact

- Account takeover
- Financial fraud
- Privilege escalation
- Privacy/GDPR violations

---

# Detection

## Frontend

- Suspicious iframes
- Invisible overlays

## Backend

- Sensitive actions triggered instantly
- Missing expected navigation flow

---

# Defenses (1) — Basic

## X-Frame-Options

- DENY / SAMEORIGIN / ALLOW-FROM
- Simple but limited
- Deprecated in favor of CSP

---

# Defenses (2) — Modern Standard

## CSP frame-ancestors

Robust, fine-grained iframe control.

```http
Content-Security-Policy: frame-ancestors 'self';
```
