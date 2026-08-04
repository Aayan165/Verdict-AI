import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loginRequest, registerRequest } from '../features/auth/auth.service';
import { getProfile } from '../features/profile/profile.service';
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
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
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
      setProfile(null);
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
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (!session?.accessToken) {
      setProfile(null);
      return null;
    }

    setProfileLoading(true);

    try {
      const nextProfile = await getProfile();
      setProfile(nextProfile);
      return nextProfile;
    } catch {
      setProfile(null);
      return null;
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    if (!session?.accessToken) {
      setProfile(null);
      setProfileLoading(false);
      return undefined;
    }

    let cancelled = false;

    const loadProfile = async () => {
      setProfileLoading(true);

      try {
        const nextProfile = await getProfile();

        if (!cancelled) {
          setProfile(nextProfile);
        }
      } catch {
        if (!cancelled) {
          setProfile(null);
        }
      } finally {
        if (!cancelled) {
          setProfileLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [session]);

  const value = useMemo(
    () => ({
      session,
      user,
      profile,
      profileLoading,
      hydrated,
      isAuthenticated: Boolean(session?.accessToken),
      login,
      register,
      logout,
      refreshProfile,
    }),
    [session, user, profile, profileLoading, hydrated, refreshProfile],
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