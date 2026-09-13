import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserRole, StudentProfile, FacultyProfile, AdminProfile } from '../types';
import { DEMO_STUDENT, DEMO_FACULTY, DEMO_ADMIN } from '../services/mockData';

type AuthUser = StudentProfile | FacultyProfile | AdminProfile;

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const savedRole = localStorage.getItem('demo_user_role') as UserRole | null;
    if (savedRole === 'faculty') return DEMO_FACULTY;
    if (savedRole === 'admin') return DEMO_ADMIN;
    return DEMO_STUDENT; // Default initial view is student for convenience
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('demo_user_role', user.role);
    } else {
      localStorage.removeItem('demo_user_role');
    }
  }, [user]);

  const login = (role: UserRole) => {
    if (role === 'student') setUser(DEMO_STUDENT);
    else if (role === 'faculty') setUser(DEMO_FACULTY);
    else if (role === 'admin') setUser(DEMO_ADMIN);
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: UserRole) => {
    login(role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
