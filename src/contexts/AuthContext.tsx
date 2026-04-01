import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, UserRole } from '@/types/blog';
import { authApi, getToken } from '@/services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
  canAccess: (requiredRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      authApi.me().then(setUser).catch(() => setUser(null)).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user } = await authApi.login(email, password);
    setUser(user);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const { user } = await authApi.register({ name, email, password });
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
  }, []);

  const hasRole = useCallback((roles: UserRole[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  }, [user]);

  const canAccess = useCallback((requiredRoles: UserRole[]) => {
    if (!user) return false;
    const hierarchy: Record<UserRole, number> = { super_admin: 4, admin: 3, editor: 2, writer: 1 };
    const minRequired = Math.min(...requiredRoles.map(r => hierarchy[r]));
    return hierarchy[user.role] >= minRequired;
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, hasRole, canAccess }}>
      {children}
    </AuthContext.Provider>
  );
};
