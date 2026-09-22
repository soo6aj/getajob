import type { User, StudentProfile, RecruiterProfile, AdminProfile, AccountStatus } from '../types';
import { mockStudents, mockRecruiters, mockAdmin } from '../data/mockUsers';

const STORAGE_KEY = 'getajob_users_status_overrides';

type AnyUser = User | StudentProfile | RecruiterProfile | AdminProfile;

function getStatusOverrides(): Record<string, AccountStatus> {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch { /* ignore */ }
  return {};
}

function saveStatusOverrides(overrides: Record<string, AccountStatus>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
}

function getCustomUsers(): AnyUser[] {
  try {
    const custom = localStorage.getItem('getajob_custom_users');
    if (custom) return JSON.parse(custom);
  } catch { /* ignore */ }
  return [];
}

export const userService = {
  getAllUsers(): AnyUser[] {
    const overrides = getStatusOverrides();
    const staticUsers = [...mockStudents, ...mockRecruiters, mockAdmin];
    const customUsers = getCustomUsers();
    
    // Merge without duplicates by ID
    const userMap = new Map<string, AnyUser>();
    staticUsers.forEach(u => userMap.set(u.id, { ...u, status: overrides[u.id] || u.status }));
    customUsers.forEach(u => userMap.set(u.id, { ...u, status: overrides[u.id] || u.status }));
    
    return Array.from(userMap.values());
  },

  getUserById(id: string): AnyUser | undefined {
    return this.getAllUsers().find(u => u.id === id);
  },

  updateUserStatus(id: string, status: AccountStatus): boolean {
    const overrides = getStatusOverrides();
    overrides[id] = status;
    saveStatusOverrides(overrides);
    return true;
  },

  getStudents(): StudentProfile[] {
    return this.getAllUsers().filter((u): u is StudentProfile => u.role === 'student');
  },

  getRecruiters(): RecruiterProfile[] {
    return this.getAllUsers().filter((u): u is RecruiterProfile => u.role === 'recruiter');
  },
};
