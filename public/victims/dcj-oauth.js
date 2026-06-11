window.DCJOAuth = {
  clientId() {
    return window.__DCJ_GITHUB_CLIENT_ID__ || '178c6fc778ccc68e1d6a'
  },
  scope() {
    return window.__DCJ_GITHUB_OAUTH_SCOPE__ || 'read:user'
  },
  buildAuthorizeUrl(port) {
    const p = port || window.location.port || '3030'
    const redirectUri = `http://localhost:${p}/callback/`
    return (
      'https://github.com/login/oauth/authorize' +
      '?client_id=' + encodeURIComponent(this.clientId()) +
      '&redirect_uri=' + encodeURIComponent(redirectUri) +
      '&scope=' + encodeURIComponent(this.scope()) +
      '&state=dcj-demo'
    )
  },
}
