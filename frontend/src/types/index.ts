// ─── User Types ───────────────────────────────────────────────
export type UserRole = 'student' | 'recruiter' | 'admin';
export type AccountStatus = 'active' | 'suspended' | 'deactivated';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  avatar?: string;
  phone?: string;
  status: AccountStatus;
  createdAt: string;
}

export interface StudentProfile extends User {
  role: 'student';
  college: string;
  degree: string;
  graduationYear: number;
  skills: string[];
  experience: Experience[];
  projects: Project[];
  socialLinks: SocialLinks;
  profileCompletion: number;
  defaultResumeId?: string;
}

export interface RecruiterProfile extends User {
  role: 'recruiter';
  companyId: string;
  position: string;
  department?: string;
}

export interface AdminProfile extends User {
  role: 'admin';
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  github?: string;
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  portfolio?: string;
  twitter?: string;
}

// ─── Company Types ────────────────────────────────────────────
export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface Company {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  size: string;
  website?: string;
  email?: string;
  phone?: string;
  location: string;
  about: string;
  socialLinks: SocialLinks;
  verificationStatus: VerificationStatus;
  recruiterId: string;
  createdAt: string;
}

// ─── Job Types ────────────────────────────────────────────────
export type JobType = 'full-time' | 'part-time' | 'internship' | 'contract' | 'freelance';
export type WorkMode = 'remote' | 'onsite' | 'hybrid';
export type JobStatus = 'active' | 'draft' | 'closed' | 'expired';
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead';

export interface Job {
  id: string;
  title: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  category: string;
  type: JobType;
  workMode: WorkMode;
  experienceLevel: ExperienceLevel;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  salaryPeriod: 'monthly' | 'yearly' | 'hourly';
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  vacancies: number;
  applicationDeadline: string;
  status: JobStatus;
  recruiterId: string;
  views: number;
  applicationsCount: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Application Types ────────────────────────────────────────
export type ApplicationStatus =
  | 'submitted'
  | 'under-review'
  | 'shortlisted'
  | 'interview'
  | 'hired'
  | 'rejected'
  | 'withdrawn';

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  companyLogo?: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentAvatar?: string;
  resumeId?: string;
  coverLetter?: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
  timeline: ApplicationTimelineEntry[];
}

export interface ApplicationTimelineEntry {
  status: ApplicationStatus;
  date: string;
  note?: string;
}

// ─── Resume Types ─────────────────────────────────────────────
export interface Resume {
  id: string;
  studentId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
  isDefault: boolean;
}

// ─── Notification Types ───────────────────────────────────────
export type NotificationType =
  | 'application-viewed'
  | 'application-shortlisted'
  | 'interview-scheduled'
  | 'status-changed'
  | 'new-job'
  | 'new-application'
  | 'candidate-update'
  | 'job-approved'
  | 'job-rejected'
  | 'report-filed'
  | 'system';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

// ─── Report Types ─────────────────────────────────────────────
export type ReportItemType = 'job' | 'company' | 'user';
export type ReportStatus = 'pending' | 'resolved' | 'dismissed';

export interface Report {
  id: string;
  itemType: ReportItemType;
  itemId: string;
  itemName: string;
  reason: string;
  description?: string;
  reportedBy: string;
  reporterName: string;
  status: ReportStatus;
  createdAt: string;
  resolvedAt?: string;
}

// ─── Saved Jobs ───────────────────────────────────────────────
export interface SavedJob {
  studentId: string;
  jobId: string;
  savedAt: string;
}

// ─── Analytics Types ──────────────────────────────────────────
export interface AnalyticsData {
  totalViews: number;
  totalApplications: number;
  shortlistingRate: number;
  applicationsOverTime: { date: string; count: number }[];
  applicantsByJob: { jobTitle: string; count: number }[];
  statusDistribution: { status: string; count: number }[];
}

// ─── Auth Types ───────────────────────────────────────────────
export interface AuthState {
  user: User | StudentProfile | RecruiterProfile | AdminProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface StudentRegistration {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  college: string;
  degree: string;
  graduationYear: number;
}

export interface RecruiterRegistration {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  industry: string;
  position: string;
}
