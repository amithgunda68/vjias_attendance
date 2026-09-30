import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserRole, StudentProfile, FacultyProfile, AdminProfile } from '../types';
import { DEMO_STUDENT, DEMO_FACULTY, DEMO_ADMIN } from '../services/mockData';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

type AuthUser = StudentProfile | FacultyProfile | AdminProfile;

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  isDemo: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  registerStudent: (email: string, password: string, profile: StudentRegistration) => Promise<boolean>;
  demoLogin: (role: UserRole) => void;
  logout: () => Promise<void>;
}

export interface StudentRegistration {
  fullName: string;
  rollNumber: string;
  hallTicketNumber: string;
  department: string;
  course: string;
  semester: number;
  section: string;
  academicYear: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (isSupabaseConfigured) return null;
    const savedRole = localStorage.getItem('demo_user_role') as UserRole | null;
    if (savedRole === 'faculty') return DEMO_FACULTY;
    if (savedRole === 'admin') return DEMO_ADMIN;
    return DEMO_STUDENT; // Default initial view is student for convenience
  });
  const [authLoading, setAuthLoading] = useState(isSupabaseConfigured);
  const [isDemo, setIsDemo] = useState(!isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      if (user) {
        localStorage.setItem('demo_user_role', user.role);
      } else {
        localStorage.removeItem('demo_user_role');
      }
      return;
    }

    const client = supabase;
    if (!client) return;
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null);
        setAuthLoading(false);
        return;
      }

      window.setTimeout(async () => {
        const { data, error } = await client
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error || !data) {
          setUser(null);
        } else {
          setUser(profileFromRow(data, session.user.email ?? ''));
        }
        setIsDemo(false);
        setAuthLoading(false);
      }, 0);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    if (!supabase) throw new Error('Supabase is not configured.');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile) {
      await supabase.auth.signOut();
      throw new Error('Your account has no portal profile yet. Ask an administrator to set up your profile.');
    }

    const authenticatedUser = profileFromRow(profile, data.user.email ?? email);
    setUser(authenticatedUser);
    setIsDemo(false);
    return authenticatedUser;
  };

  const registerStudent = async (email: string, password: string, profile: StudentRegistration) => {
    if (!supabase) throw new Error('Supabase is not configured.');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: profile.fullName,
          roll_number: profile.rollNumber,
          hall_ticket_number: profile.hallTicketNumber,
          department: profile.department,
          course: profile.course,
          semester: String(profile.semester),
          section: profile.section,
          academic_year: profile.academicYear,
        },
      },
    });
    if (error) throw error;
    if (!data.user) throw new Error('Supabase did not return a newly created user.');
    if (!data.session) return false;

    const { data: row, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
    if (profileError || !row) throw new Error('Account created, but its student profile is not available yet.');
    const registeredUser = profileFromRow(row, data.user.email ?? email);
    setUser(registeredUser);
    setIsDemo(false);
    return true;
  };

  const demoLogin = (role: UserRole) => {
    if (isSupabaseConfigured) return;
    if (role === 'student') setUser(DEMO_STUDENT);
    else if (role === 'faculty') setUser(DEMO_FACULTY);
    else if (role === 'admin') setUser(DEMO_ADMIN);
    setIsDemo(true);
  };

  const logout = async () => {
    if (supabase && !isDemo) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
    setUser(null);
    setIsDemo(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        authLoading,
        isDemo,
        login,
        registerStudent,
        demoLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function profileFromRow(row: Record<string, unknown>, email: string): AuthUser {
  const base = {
    id: String(row.id),
    name: String(row.full_name ?? email),
    email,
    department: typeof row.department === 'string' ? row.department : undefined,
    avatar: typeof row.avatar_url === 'string' ? row.avatar_url : undefined,
  };
  const role = row.role as UserRole;

  if (role === 'faculty') {
    return {
      ...base,
      role,
      facultyId: String(row.faculty_id ?? ''),
      designation: String(row.designation ?? 'Faculty'),
      assignedSubjects: [],
    };
  }
  if (role === 'admin') {
    return {
      ...base,
      role,
      adminId: String(row.admin_id ?? ''),
      title: String(row.title ?? 'Administrator'),
    };
  }
  return {
    ...base,
    role: 'student',
    rollNumber: String(row.roll_number ?? ''),
    hallTicketNumber: typeof row.hall_ticket_number === 'string' ? row.hall_ticket_number : undefined,
    course: String(row.course ?? ''),
    semester: Number(row.semester ?? 1),
    section: String(row.section ?? ''),
    academicYear: String(row.academic_year ?? ''),
  };
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
