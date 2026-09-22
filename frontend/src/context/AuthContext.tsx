import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User, StudentProfile, RecruiterProfile, AdminProfile, UserRole, LoginCredentials, StudentRegistration, RecruiterRegistration } from '../types';
import { mockStudents, mockRecruiters, mockAdmin } from '../data/mockUsers';

interface AuthContextType {
  user: User | StudentProfile | RecruiterProfile | AdminProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  registerStudent: (data: StudentRegistration) => Promise<{ success: boolean; error?: string }>;
  registerRecruiter: (data: RecruiterRegistration) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = 'getajob_session';

function getStoredSession(): { userId: string; role: UserRole } | null {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return null;
}

function findUserById(userId: string): User | StudentProfile | RecruiterProfile | AdminProfile | null {
  if (userId === mockAdmin.id) return mockAdmin;
  const student = mockStudents.find(s => s.id === userId);
  if (student) return student;
  const recruiter = mockRecruiters.find(r => r.id === userId);
  if (recruiter) return recruiter;
  // Check localStorage for newly registered users
  try {
    const customUsers = JSON.parse(localStorage.getItem('getajob_custom_users') || '[]');
    const custom = customUsers.find((u: User) => u.id === userId);
    if (custom) return custom;
  } catch { /* ignore */ }
  return null;
}

function findUserByEmail(email: string): User | StudentProfile | RecruiterProfile | AdminProfile | null {
  if (email === mockAdmin.email) return mockAdmin;
  const student = mockStudents.find(s => s.email === email);
  if (student) return student;
  const recruiter = mockRecruiters.find(r => r.email === email);
  if (recruiter) return recruiter;
  try {
    const customUsers = JSON.parse(localStorage.getItem('getajob_custom_users') || '[]');
    const custom = customUsers.find((u: User) => u.email === email);
    if (custom) return custom;
  } catch { /* ignore */ }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | StudentProfile | RecruiterProfile | AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = getStoredSession();
    if (session) {
      const foundUser = findUserById(session.userId);
      if (foundUser) {
        setUser(foundUser);
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const foundUser = findUserByEmail(credentials.email);
    if (!foundUser) {
      return { success: false, error: 'No account found with this email address.' };
    }

    // For demo: accept "demo123" for mock users or any password for custom users
    const isDemoUser = [...mockStudents, ...mockRecruiters, mockAdmin].some(u => u.email === credentials.email);
    if (isDemoUser && credentials.password !== 'demo123') {
      return { success: false, error: 'Invalid password. For demo accounts, use "demo123".' };
    }

    if (foundUser.status === 'suspended') {
      return { success: false, error: 'Your account has been suspended. Contact support.' };
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: foundUser.id, role: foundUser.role }));
    setUser(foundUser);
    return { success: true };
  }, []);

  const registerStudent = useCallback(async (data: StudentRegistration) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    if (findUserByEmail(data.email)) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newStudent: StudentProfile = {
      id: `stu-${Date.now()}`,
      email: data.email,
      role: 'student',
      name: data.name,
      status: 'active',
      createdAt: new Date().toISOString(),
      college: data.college,
      degree: data.degree,
      graduationYear: data.graduationYear,
      skills: [],
      experience: [],
      projects: [],
      socialLinks: {},
      profileCompletion: 25,
    };

    const customUsers = JSON.parse(localStorage.getItem('getajob_custom_users') || '[]');
    customUsers.push(newStudent);
    localStorage.setItem('getajob_custom_users', JSON.stringify(customUsers));
    localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: newStudent.id, role: 'student' }));
    setUser(newStudent);
    return { success: true };
  }, []);

  const registerRecruiter = useCallback(async (data: RecruiterRegistration) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    if (findUserByEmail(data.email)) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const companyId = `comp-${Date.now()}`;
    const newRecruiter: RecruiterProfile = {
      id: `rec-${Date.now()}`,
      email: data.email,
      role: 'recruiter',
      name: data.name,
      status: 'active',
      createdAt: new Date().toISOString(),
      companyId,
      position: data.position,
    };

    const customUsers = JSON.parse(localStorage.getItem('getajob_custom_users') || '[]');
    customUsers.push(newRecruiter);
    localStorage.setItem('getajob_custom_users', JSON.stringify(customUsers));
    localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: newRecruiter.id, role: 'recruiter' }));
    setUser(newRecruiter);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      registerStudent,
      registerRecruiter,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
