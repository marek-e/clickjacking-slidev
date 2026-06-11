window.DCJOAuth = {
  clientId() {
    return window.__DCJ_GITHUB_CLIENT_ID__ || '178c6fc778ccc68e1d6a'
  },
  scope() {
    return window.__DCJ_GITHUB_OAUTH_SCOPE__ || 'read:user'
  },
  redirectUri() {
    if (window.__DCJ_GITHUB_REDIRECT_URI__) {
      return window.__DCJ_GITHUB_REDIRECT_URI__
    }
    return `${window.location.origin}/callback/`
  },
  buildAuthorizeUrl() {
    return (
      'https://github.com/login/oauth/authorize' +
      '?client_id=' + encodeURIComponent(this.clientId()) +
      '&redirect_uri=' + encodeURIComponent(this.redirectUri()) +
      '&scope=' + encodeURIComponent(this.scope()) +
      '&state=dcj-demo'
    )
  },
}
