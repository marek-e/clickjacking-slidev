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
