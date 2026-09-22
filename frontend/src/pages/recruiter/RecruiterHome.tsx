import { Link } from 'react-router-dom';
import { Briefcase, Users, Eye, TrendingUp, PlusCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import { formatRelativeDate } from '../../utils/format';
import type { RecruiterProfile } from '../../types';

export function RecruiterHome() {
  const { user } = useAuth();
  const recruiter = user as RecruiterProfile;
  const jobs = jobService.getByRecruiter(recruiter.id);
  const allApps = applicationService.getByRecruiter(recruiter.id, jobs);
  const activeJobs = jobs.filter(j => j.status === 'active');
  const totalViews = jobs.reduce((sum, j) => sum + j.views, 0);

  const stats = [
    { label: 'Active Jobs', value: activeJobs.length, icon: Briefcase, color: 'bg-primary-50 text-primary' },
    { label: 'Total Applicants', value: allApps.length, icon: Users, color: 'bg-green-50 text-success' },
    { label: 'Total Views', value: totalViews, icon: Eye, color: 'bg-purple-50 text-secondary' },
    { label: 'Shortlisted', value: allApps.filter(a => a.status === 'shortlisted' || a.status === 'interview').length, icon: TrendingUp, color: 'bg-amber-50 text-warning' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-secondary to-primary rounded-2xl p-6 sm:p-8 text-white">
        <h1 className="text-2xl sm:text-3xl font-bold">Welcome back, {recruiter.name.split(' ')[0]}! 👋</h1>
        <p className="mt-2 text-white/80">Here's an overview of your hiring activity.</p>
        <Link to="/recruiter/jobs/create" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-secondary font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm mt-4">
          <PlusCircle className="w-4 h-4" /> Post a Job
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl p-5 border border-light-slate/50 hover:shadow-card-hover transition-all">
            <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-3`}><s.icon className="w-5 h-5" /></div>
            <p className="text-2xl font-bold text-midnight">{s.value}</p>
            <p className="text-sm text-slate-text">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-light-slate/50">
          <div className="p-5 border-b border-light-slate flex items-center justify-between">
            <h3 className="font-semibold text-midnight">Recent Jobs</h3>
            <Link to="/recruiter/jobs" className="text-sm text-primary font-medium">View All</Link>
          </div>
          <div className="divide-y divide-light-slate/50">
            {jobs.slice(0, 5).map(job => (
              <div key={job.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-midnight truncate">{job.title}</p>
                  <p className="text-xs text-slate-text">{job.applicationsCount} applicants • {formatRelativeDate(job.createdAt)}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${job.status === 'active' ? 'bg-green-50 text-success' : job.status === 'closed' ? 'bg-gray-100 text-gray-600' : 'bg-amber-50 text-warning'}`}>
                  {job.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-light-slate/50">
          <div className="p-5 border-b border-light-slate flex items-center justify-between">
            <h3 className="font-semibold text-midnight">Recent Applications</h3>
            <Link to="/recruiter/applicants" className="text-sm text-primary font-medium">View All</Link>
          </div>
          <div className="divide-y divide-light-slate/50">
            {allApps.slice(0, 5).map(app => (
              <div key={app.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-midnight truncate">{app.studentName}</p>
                  <p className="text-xs text-slate-text">{app.jobTitle} • {formatRelativeDate(app.appliedAt)}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${app.status === 'submitted' ? 'bg-gray-100 text-gray-700' : app.status === 'shortlisted' ? 'bg-purple-50 text-secondary' : app.status === 'hired' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                  {app.status.replace('-', ' ')}
                </span>
              </div>
            ))}
            {allApps.length === 0 && <div className="p-8 text-center text-sm text-slate-text">No applications yet</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
