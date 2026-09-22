import type { Company, VerificationStatus } from '../types';
import { mockCompanies } from '../data/mockCompanies';

const STORAGE_KEY = 'getajob_companies';

function getStoredCompanies(): Company[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch { /* ignore */ }
  return mockCompanies;
}

function saveCompanies(companies: Company[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(companies));
}

export const companyService = {
  getAllCompanies(): Company[] {
    return getStoredCompanies();
  },

  getCompanyById(id: string): Company | undefined {
    return getStoredCompanies().find(c => c.id === id);
  },

  getCompanyByRecruiterId(recruiterId: string): Company | undefined {
    return getStoredCompanies().find(c => c.recruiterId === recruiterId);
  },

  updateCompany(id: string, updates: Partial<Company>): Company | null {
    const companies = getStoredCompanies();
    const index = companies.findIndex(c => c.id === id);
    if (index === -1) return null;
    companies[index] = { ...companies[index], ...updates };
    saveCompanies(companies);
    return companies[index];
  },

  updateVerification(id: string, status: VerificationStatus): Company | null {
    return this.updateCompany(id, { verificationStatus: status });
  },

  createCompany(companyData: Omit<Company, 'id' | 'createdAt'>): Company {
    const companies = getStoredCompanies();
    const newCompany: Company = {
      ...companyData,
      id: `comp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    companies.push(newCompany);
    saveCompanies(companies);
    return newCompany;
  },
};
