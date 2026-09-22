import type { Application, ApplicationStatus, SavedJob } from '../types';
import { mockApplications, mockSavedJobs } from '../data/mockApplications';

const APPS_KEY = 'getajob_applications';
const SAVED_KEY = 'getajob_saved_jobs';

function getApps(): Application[] {
  try {
    const stored = localStorage.getItem(APPS_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  localStorage.setItem(APPS_KEY, JSON.stringify(mockApplications));
  return [...mockApplications];
}

function saveApps(apps: Application[]) {
  localStorage.setItem(APPS_KEY, JSON.stringify(apps));
}

function getSaved(): SavedJob[] {
  try {
    const stored = localStorage.getItem(SAVED_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  localStorage.setItem(SAVED_KEY, JSON.stringify(mockSavedJobs));
  return [...mockSavedJobs];
}

function saveSaved(saved: SavedJob[]) {
  localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
}

export const applicationService = {
  getByStudent(studentId: string): Application[] {
    return getApps().filter(a => a.studentId === studentId);
  },

  getByJob(jobId: string): Application[] {
    return getApps().filter(a => a.jobId === jobId);
  },

  getByRecruiter(recruiterId: string, allJobs: { id: string; recruiterId: string }[]): Application[] {
    const recruiterJobIds = allJobs.filter(j => j.recruiterId === recruiterId).map(j => j.id);
    return getApps().filter(a => recruiterJobIds.includes(a.jobId));
  },

  getAll(): Application[] {
    return getApps();
  },

  getAllApplications(): Application[] {
    return getApps();
  },

  getById(id: string): Application | undefined {
    return getApps().find(a => a.id === id);
  },

  hasApplied(studentId: string, jobId: string): boolean {
    return getApps().some(a => a.studentId === studentId && a.jobId === jobId);
  },

  apply(application: Omit<Application, 'id' | 'appliedAt' | 'updatedAt' | 'timeline'>): Application {
    const apps = getApps();
    const newApp: Application = {
      ...application,
      id: `app-${Date.now()}`,
      status: 'submitted',
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [{ status: 'submitted', date: new Date().toISOString() }],
    };
    apps.push(newApp);
    saveApps(apps);
    return newApp;
  },

  updateStatus(id: string, status: ApplicationStatus, note?: string): Application | undefined {
    const apps = getApps();
    const index = apps.findIndex(a => a.id === id);
    if (index === -1) return undefined;
    const now = new Date().toISOString();
    apps[index].status = status;
    apps[index].updatedAt = now;
    apps[index].timeline.push({ status, date: now, note });
    saveApps(apps);
    return apps[index];
  },

  // Saved jobs
  getSavedJobs(studentId: string): SavedJob[] {
    return getSaved().filter(s => s.studentId === studentId);
  },

  isJobSaved(studentId: string, jobId: string): boolean {
    return getSaved().some(s => s.studentId === studentId && s.jobId === jobId);
  },

  saveJob(studentId: string, jobId: string): void {
    const saved = getSaved();
    if (!saved.some(s => s.studentId === studentId && s.jobId === jobId)) {
      saved.push({ studentId, jobId, savedAt: new Date().toISOString() });
      saveSaved(saved);
    }
  },

  unsaveJob(studentId: string, jobId: string): void {
    const saved = getSaved();
    saveSaved(saved.filter(s => !(s.studentId === studentId && s.jobId === jobId)));
  },
};
