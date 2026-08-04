export function decodeJwt(token) {
  if (!token || typeof token !== 'string') {
    return null;
  }

  const parts = token.split('.');

  if (parts.length < 2) {
    return null;
  }

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    return JSON.parse(window.atob(padded));
  } catch {
    return null;
  }
}

export function getUserProfileFromToken(token) {
  const claims = decodeJwt(token);

  if (!claims) {
    return null;
  }

  return {
    id: claims.sub || claims.user_id || claims.id || '',
    email: claims.email || claims.user_email || '',
    createdAt: claims.created_at || claims.createdAt || (claims.iat ? new Date(claims.iat * 1000).toISOString() : ''),
    claims,
  };
}

export function getInitials(email) {
  if (!email) {
    return 'LA';
  }

  const value = email.includes('@') ? email.split('@')[0] : email;

  return value
    .split(/[._-\s]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}