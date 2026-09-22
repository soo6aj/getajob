import { Link } from 'react-router-dom';
import { Briefcase, FileText, Bookmark, Calendar, ArrowRight, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { applicationService } from '../../services/applicationService';
import { jobService } from '../../services/jobService';
import { formatDate } from '../../utils/format';
import type { StudentProfile } from '../../types';

export function StudentHome() {
  const { user } = useAuth();
  const student = user as StudentProfile;
  const applications = applicationService.getByStudent(student.id);
  const savedJobs = applicationService.getSavedJobs(student.id);
  const activeJobs = jobService.getActive().slice(0, 4);
  const recentApps = applications.slice(0, 5);
  const interviewCount = applications.filter(a => a.status === 'interview').length;
  const shortlistedCount = applications.filter(a => a.status === 'shortlisted').length;

  const stats = [
    { label: 'Applications', value: applications.length, icon: FileText, color: 'bg-primary-50 text-primary', href: '/student/applications' },
    { label: 'Saved Jobs', value: savedJobs.length, icon: Bookmark, color: 'bg-amber-50 text-warning', href: '/student/saved-jobs' },
    { label: 'Interviews', value: interviewCount, icon: Calendar, color: 'bg-green-50 text-success', href: '/student/applications' },
    { label: 'Shortlisted', value: shortlistedCount, icon: TrendingUp, color: 'bg-purple-50 text-secondary', href: '/student/applications' },
  ];

  const statusColors: Record<string, string> = {
    submitted: 'bg-gray-100 text-gray-700',
    'under-review': 'bg-blue-50 text-primary',
    shortlisted: 'bg-purple-50 text-secondary',
    interview: 'bg-green-50 text-success',
    hired: 'bg-green-100 text-green-800',
    rejected: 'bg-red-50 text-error',
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 sm:p-8 text-white">
        <h1 className="text-2xl sm:text-3xl font-bold">Welcome back, {student.name.split(' ')[0]}! 👋</h1>
        <p className="mt-2 text-white/80">Here's what's happening with your job search.</p>
        <div className="mt-4 flex gap-3">
          <Link to="/student/jobs" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-primary font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm">
            <Briefcase className="w-4 h-4" /> Browse Jobs
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <Link key={stat.label} to={stat.href} className="bg-white rounded-xl p-5 border border-light-slate/50 hover:shadow-card-hover transition-all group">
            <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-midnight">{stat.value}</p>
            <p className="text-sm text-slate-text">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Profile Completion */}
      <div className="bg-white rounded-xl p-6 border border-light-slate/50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-midnight">Profile Completion</h3>
          <span className="text-sm font-semibold text-primary">{student.profileCompletion}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div className="bg-primary h-2.5 rounded-full transition-all" style={{ width: `${student.profileCompletion}%` }} />
        </div>
        {student.profileCompletion < 100 && (
          <Link to="/student/profile" className="inline-flex items-center gap-1 mt-3 text-sm text-primary font-medium hover:text-primary-hover">
            Complete your profile <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-white rounded-xl border border-light-slate/50">
          <div className="p-5 border-b border-light-slate flex items-center justify-between">
            <h3 className="font-semibold text-midnight">Recent Applications</h3>
            <Link to="/student/applications" className="text-sm text-primary font-medium hover:text-primary-hover">View All</Link>
          </div>
          <div className="divide-y divide-light-slate/50">
            {recentApps.length === 0 ? (
              <div className="p-8 text-center text-slate-text text-sm">No applications yet. <Link to="/student/jobs" className="text-primary font-medium">Start applying!</Link></div>
            ) : recentApps.map(app => (
              <div key={app.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-midnight truncate">{app.jobTitle}</p>
                  <p className="text-xs text-slate-text">{app.companyName} • {formatDate(app.appliedAt)}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${statusColors[app.status] || 'bg-gray-100 text-gray-700'}`}>
                  {app.status.replace('-', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Jobs */}
        <div className="bg-white rounded-xl border border-light-slate/50">
          <div className="p-5 border-b border-light-slate flex items-center justify-between">
            <h3 className="font-semibold text-midnight">Recommended Jobs</h3>
            <Link to="/student/jobs" className="text-sm text-primary font-medium hover:text-primary-hover">View All</Link>
          </div>
          <div className="divide-y divide-light-slate/50">
            {activeJobs.map(job => (
              <Link key={job.id} to={`/student/jobs/${job.id}`} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors block">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-midnight truncate">{job.title}</p>
                  <p className="text-xs text-slate-text">{job.companyName} • {job.location}</p>
                </div>
                <span className="text-xs text-primary font-medium whitespace-nowrap">{job.type}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
