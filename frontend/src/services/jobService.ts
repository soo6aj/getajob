import type { Job, JobStatus } from '../types';
import { mockJobs } from '../data/mockJobs';

const JOBS_KEY = 'getajob_jobs';

function getJobs(): Job[] {
  try {
    const stored = localStorage.getItem(JOBS_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  localStorage.setItem(JOBS_KEY, JSON.stringify(mockJobs));
  return [...mockJobs];
}

function saveJobs(jobs: Job[]) {
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
}

export const jobService = {
  getAll(): Job[] {
    return getJobs();
  },

  getAllJobs(): Job[] {
    return getJobs();
  },

  getActive(): Job[] {
    return getJobs().filter(j => j.status === 'active');
  },

  getById(id: string): Job | undefined {
    return getJobs().find(j => j.id === id);
  },

  getByRecruiter(recruiterId: string): Job[] {
    return getJobs().filter(j => j.recruiterId === recruiterId);
  },

  search(query: string, filters?: {
    location?: string;
    type?: string;
    workMode?: string;
    experienceLevel?: string;
    salaryMin?: number;
    sortBy?: string;
  }): Job[] {
    let results = getJobs().filter(j => j.status === 'active');
    const q = query.toLowerCase().trim();

    if (q) {
      results = results.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.companyName.toLowerCase().includes(q) ||
        j.skills.some(s => s.toLowerCase().includes(q)) ||
        j.category.toLowerCase().includes(q)
      );
    }

    if (filters?.location) {
      results = results.filter(j => j.location.toLowerCase().includes(filters.location!.toLowerCase()));
    }
    if (filters?.type) {
      results = results.filter(j => j.type === filters.type);
    }
    if (filters?.workMode) {
      results = results.filter(j => j.workMode === filters.workMode);
    }
    if (filters?.experienceLevel) {
      results = results.filter(j => j.experienceLevel === filters.experienceLevel);
    }
    if (filters?.salaryMin) {
      results = results.filter(j => (j.salaryMax ?? 0) >= filters.salaryMin!);
    }

    if (filters?.sortBy === 'newest') {
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (filters?.sortBy === 'salary-high') {
      results.sort((a, b) => (b.salaryMax ?? 0) - (a.salaryMax ?? 0));
    } else if (filters?.sortBy === 'salary-low') {
      results.sort((a, b) => (a.salaryMin ?? 0) - (b.salaryMin ?? 0));
    } else if (filters?.sortBy === 'applications') {
      results.sort((a, b) => b.applicationsCount - a.applicationsCount);
    }

    return results;
  },

  create(job: Omit<Job, 'id' | 'views' | 'applicationsCount' | 'createdAt' | 'updatedAt'>): Job {
    const jobs = getJobs();
    const newJob: Job = {
      ...job,
      id: `job-${Date.now()}`,
      views: 0,
      applicationsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    jobs.push(newJob);
    saveJobs(jobs);
    return newJob;
  },

  update(id: string, updates: Partial<Job>): Job | undefined {
    const jobs = getJobs();
    const index = jobs.findIndex(j => j.id === id);
    if (index === -1) return undefined;
    jobs[index] = { ...jobs[index], ...updates, updatedAt: new Date().toISOString() };
    saveJobs(jobs);
    return jobs[index];
  },

  updateStatus(id: string, status: JobStatus): Job | undefined {
    return this.update(id, { status });
  },

  delete(id: string): boolean {
    const jobs = getJobs();
    const filtered = jobs.filter(j => j.id !== id);
    if (filtered.length === jobs.length) return false;
    saveJobs(filtered);
    return true;
  },
};
