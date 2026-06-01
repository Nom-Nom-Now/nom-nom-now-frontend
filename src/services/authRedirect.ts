let redirectInProgress = false;

export function buildLoginRedirectUrl(currentUrl = currentRelativeUrl()) {
  const params = new URLSearchParams();
  params.set('sessionExpired', '1');

  if (currentUrl && currentUrl !== '/') {
    params.set('redirect', currentUrl);
  }

  return `/?${params.toString()}`;
}

export function redirectToLogin() {
  if (redirectInProgress || window.location.pathname === '/') {
    return;
  }

  redirectInProgress = true;
  window.location.assign(buildLoginRedirectUrl());
}

function currentRelativeUrl() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}
