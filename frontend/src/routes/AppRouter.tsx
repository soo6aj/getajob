import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from '../layouts/PublicLayout';
import { StudentLayout } from '../layouts/StudentLayout';
import { RecruiterLayout } from '../layouts/RecruiterLayout';
import { AdminLayout } from '../layouts/AdminLayout';

// Route Guard
import { ProtectedRoute } from './ProtectedRoute';

// Public & Auth Pages
import { WelcomePage } from '../pages/public/WelcomePage';
import { NotFoundPage } from '../pages/public/NotFoundPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { StudentRegisterPage } from '../pages/auth/StudentRegisterPage';
import { RecruiterRegisterPage } from '../pages/auth/RecruiterRegisterPage';
import { ForgotPasswordPage, ResetPasswordPage } from '../pages/auth/PasswordPages';

// Student Pages
import { StudentHome } from '../pages/student/StudentHome';
import { StudentJobs } from '../pages/student/StudentJobs';
import { StudentJobDetails } from '../pages/student/StudentJobDetails';
import { StudentApplications } from '../pages/student/StudentApplications';
import { StudentSavedJobs } from '../pages/student/StudentSavedJobs';
import { StudentProfile } from '../pages/student/StudentProfile';
import { StudentResumes } from '../pages/student/StudentResumes';
import { StudentNotifications } from '../pages/student/StudentNotifications';
import { StudentSettings } from '../pages/student/StudentSettings';

// Recruiter Pages
import { RecruiterHome } from '../pages/recruiter/RecruiterHome';
import { RecruiterJobs } from '../pages/recruiter/RecruiterJobs';
import { RecruiterCreateJob } from '../pages/recruiter/RecruiterCreateJob';
import { RecruiterEditJob } from '../pages/recruiter/RecruiterEditJob';
import { RecruiterApplicants } from '../pages/recruiter/RecruiterApplicants';
import { RecruiterApplicantDetails } from '../pages/recruiter/RecruiterApplicantDetails';
import { RecruiterCompany } from '../pages/recruiter/RecruiterCompany';
import { RecruiterAnalytics } from '../pages/recruiter/RecruiterAnalytics';
import { RecruiterNotifications } from '../pages/recruiter/RecruiterNotifications';
import { RecruiterSettings } from '../pages/recruiter/RecruiterSettings';

// Admin Pages
import { AdminHome } from '../pages/admin/AdminHome';
import { AdminUsers } from '../pages/admin/AdminUsers';
import { AdminJobs } from '../pages/admin/AdminJobs';
import { AdminCompanies } from '../pages/admin/AdminCompanies';
import { AdminReports } from '../pages/admin/AdminReports';
import { AdminSettings } from '../pages/admin/AdminSettings';

export const router = createBrowserRouter([
  // Public & Landing
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <WelcomePage /> },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/register/student',
    element: <StudentRegisterPage />,
  },
  {
    path: '/register/recruiter',
    element: <RecruiterRegisterPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage />,
  },

  // Student Dashboard Routes
  {
    path: '/student',
    element: (
      <ProtectedRoute allowedRoles={['student']}>
        <StudentLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/student/home" replace /> },
      { path: 'home', element: <StudentHome /> },
      { path: 'jobs', element: <StudentJobs /> },
      { path: 'jobs/:id', element: <StudentJobDetails /> },
      { path: 'applications', element: <StudentApplications /> },
      { path: 'saved-jobs', element: <StudentSavedJobs /> },
      { path: 'profile', element: <StudentProfile /> },
      { path: 'resumes', element: <StudentResumes /> },
      { path: 'notifications', element: <StudentNotifications /> },
      { path: 'settings', element: <StudentSettings /> },
    ],
  },

  // Recruiter Dashboard Routes
  {
    path: '/recruiter',
    element: (
      <ProtectedRoute allowedRoles={['recruiter']}>
        <RecruiterLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/recruiter/home" replace /> },
      { path: 'home', element: <RecruiterHome /> },
      { path: 'jobs', element: <RecruiterJobs /> },
      { path: 'jobs/create', element: <RecruiterCreateJob /> },
      { path: 'jobs/:id/edit', element: <RecruiterEditJob /> },
      { path: 'applicants', element: <RecruiterApplicants /> },
      { path: 'applicants/:id', element: <RecruiterApplicantDetails /> },
      { path: 'company', element: <RecruiterCompany /> },
      { path: 'analytics', element: <RecruiterAnalytics /> },
      { path: 'notifications', element: <RecruiterNotifications /> },
      { path: 'settings', element: <RecruiterSettings /> },
    ],
  },

  // Admin Dashboard Routes
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/home" replace /> },
      { path: 'home', element: <AdminHome /> },
      { path: 'users', element: <AdminUsers /> },
      { path: 'jobs', element: <AdminJobs /> },
      { path: 'companies', element: <AdminCompanies /> },
      { path: 'reports', element: <AdminReports /> },
      { path: 'settings', element: <AdminSettings /> },
    ],
  },

  // 404 Catch-All
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
