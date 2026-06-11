(function () {
  const isReal = new URLSearchParams(location.search).has('real')

  function openPopup() {
    window.open(
      './dcj.html' + (isReal ? '?real=1' : ''),
      '_blank',
      `popup=yes,width=${window.innerWidth},height=${window.innerHeight},left=${window.screenX},top=${window.screenY}`,
    )
  }

  function wireAllowButton() {
    document.getElementById('allow-btn').addEventListener('click', () => {
      document.getElementById('allow-btn').style.display = 'none'
      document.getElementById('granted').style.display = 'block'
    })
  }

  window.DCJVictim = {
    revealOAuth() {
      document.documentElement.classList.add('oauth-ready')
      document.title = 'HackerApp is requesting permission | Slack'
      wireAllowButton()
    },
  }

  if (isReal) {
    openPopup()
    return
  }

  openPopup()
})()
