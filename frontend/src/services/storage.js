const STORAGE_KEY = 'llm-arbitrator-auth';

export function readAuthSession() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveAuthSession(session) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearAuthSession() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}

export function buildAuthSession(payload) {
  const accessToken = payload?.access_token || payload?.accessToken || payload?.session?.access_token || payload?.session?.accessToken || '';
  const refreshToken = payload?.refresh_token || payload?.refreshToken || payload?.session?.refresh_token || payload?.session?.refreshToken || '';
  const tokenType = payload?.token_type || payload?.tokenType || payload?.session?.token_type || 'bearer';

  if (!accessToken) {
    return null;
  }

  return {
    accessToken,
    refreshToken,
    tokenType,
  };
}