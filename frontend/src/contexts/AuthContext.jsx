import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loginRequest, registerRequest } from '../features/auth/auth.service';
import { buildAuthSession, clearAuthSession, readAuthSession, saveAuthSession } from '../services/storage';
import { getUserProfileFromToken } from '../utils/jwt';

const AuthContext = createContext(null);

function normalizeUser(session) {
  if (!session?.accessToken) {
    return null;
  }

  return getUserProfileFromToken(session.accessToken);
}

function normalizeSessionPayload(payload) {
  if (!payload) {
    return null;
  }

  return buildAuthSession(payload) || buildAuthSession(payload.session) || buildAuthSession(payload.data) || null;
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readAuthSession();

    if (stored) {
      setSession(stored);
      setUser(normalizeUser(stored));
    }

    setHydrated(true);

    const handleLogout = () => {
      setSession(null);
      setUser(null);
      clearAuthSession();
    };

    window.addEventListener('auth:logout', handleLogout);

    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  const login = async (credentials) => {
    const response = await loginRequest(credentials);
    const nextSession = normalizeSessionPayload(response);

    if (nextSession) {
      saveAuthSession(nextSession);
      setSession(nextSession);
      setUser(normalizeUser(nextSession));
    }

    return response;
  };

  const register = async (credentials) => {
    const response = await registerRequest(credentials);
    const nextSession = normalizeSessionPayload(response);

    if (nextSession) {
      saveAuthSession(nextSession);
      setSession(nextSession);
      setUser(normalizeUser(nextSession));
    }

    return response;
  };

  const logout = () => {
    clearAuthSession();
    setSession(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      session,
      user,
      hydrated,
      isAuthenticated: Boolean(session?.accessToken),
      login,
      register,
      logout,
    }),
    [session, user, hydrated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }

  return context;
}