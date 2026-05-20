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
src: ./slides/01-cover.md
---

---
src: ./slides/02-the-attack.md
---

---
src: ./slides/03-impact-detection.md
---

---
src: ./slides/04-defenses.md
---
