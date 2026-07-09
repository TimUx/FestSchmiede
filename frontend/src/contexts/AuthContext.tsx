import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User } from '@/types';
import { api, configureAuthRefresh } from '@/services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = 'verein_token';
const REFRESH_KEY = 'verein_refresh_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    configureAuthRefresh({
      getRefreshToken: () => localStorage.getItem(REFRESH_KEY),
      onTokensRefreshed: (accessToken, refreshToken) => {
        localStorage.setItem(TOKEN_KEY, accessToken);
        if (refreshToken) {
          localStorage.setItem(REFRESH_KEY, refreshToken);
        }
        setToken(accessToken);
      },
      onAuthFailed: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_KEY);
        setToken(null);
        setUser(null);
      },
    });
  }, []);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    api.me(token)
      .then(setUser)
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_KEY);
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await api.login(email, password);
    localStorage.setItem(TOKEN_KEY, result.token);
    if (result.refreshToken) {
      localStorage.setItem(REFRESH_KEY, result.refreshToken);
    }
    setToken(result.token);
    setUser(result.user);
    return result.user;
  }, []);

  const logout = useCallback(() => {
    const refreshToken = localStorage.getItem(REFRESH_KEY);
    if (refreshToken) {
      void api.logout(refreshToken).catch(() => {});
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAdmin: user?.role === 'ADMIN',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth muss innerhalb von AuthProvider verwendet werden');
  return ctx;
}
