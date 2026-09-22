import type { Report, ReportStatus } from '../types';
import { mockReports } from '../data/mockReports';
import { userService } from './userService';
import { jobService } from './jobService';
import { companyService } from './companyService';
import { applicationService } from './applicationService';

const REPORTS_KEY = 'getajob_reports';

function getStoredReports(): Report[] {
  try {
    const data = localStorage.getItem(REPORTS_KEY);
    if (data) return JSON.parse(data);
  } catch { /* ignore */ }
  return mockReports;
}

function saveReports(reports: Report[]) {
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
}

export const adminService = {
  getReports(): Report[] {
    return getStoredReports();
  },

  updateReportStatus(id: string, status: ReportStatus): boolean {
    const reports = getStoredReports();
    const idx = reports.findIndex(r => r.id === id);
    if (idx === -1) return false;
    reports[idx] = {
      ...reports[idx],
      status,
      resolvedAt: status !== 'pending' ? new Date().toISOString() : undefined,
    };
    saveReports(reports);
    return true;
  },

  getPlatformStats() {
    const users = userService.getAllUsers();
    const students = users.filter(u => u.role === 'student');
    const recruiters = users.filter(u => u.role === 'recruiter');
    const jobs = jobService.getAllJobs();
    const activeJobs = jobs.filter(j => j.status === 'active');
    const companies = companyService.getAllCompanies();
    const pendingCompanies = companies.filter(c => c.verificationStatus === 'pending');
    const reports = getStoredReports();
    const pendingReports = reports.filter(r => r.status === 'pending');
    const applications = applicationService.getAllApplications();

    return {
      totalUsers: users.length,
      totalStudents: students.length,
      totalRecruiters: recruiters.length,
      totalJobs: jobs.length,
      activeJobs: activeJobs.length,
      totalCompanies: companies.length,
      pendingCompanies: pendingCompanies.length,
      totalApplications: applications.length,
      pendingReports: pendingReports.length,
    };
  },
};
