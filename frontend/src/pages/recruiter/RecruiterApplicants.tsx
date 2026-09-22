import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, Check, Eye, Star, Clock } from 'lucide-react';
import { applicationService } from '../../services/applicationService';
import { jobService } from '../../services/jobService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/format';
import type { ApplicationStatus } from '../../types';

const statusColors: Record<string, string> = {
  submitted: 'bg-gray-100 text-gray-700', 'under-review': 'bg-blue-50 text-primary', shortlisted: 'bg-purple-50 text-secondary',
  interview: 'bg-amber-50 text-warning', hired: 'bg-green-100 text-green-800', rejected: 'bg-red-50 text-error',
};

export function RecruiterApplicants() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [jobFilter, setJobFilter] = useState('');
  const [, setRefresh] = useState(0);

  const jobs = jobService.getByRecruiter(user!.id);
  const allApps = applicationService.getByRecruiter(user!.id, jobs);

  const filtered = allApps.filter(a => {
    const matchesSearch = a.studentName.toLowerCase().includes(search.toLowerCase()) || a.jobTitle.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || a.status === statusFilter;
    const matchesJob = !jobFilter || a.jobId === jobFilter;
    return matchesSearch && matchesStatus && matchesJob;
  });

  const updateStatus = (id: string, status: ApplicationStatus, note?: string) => {
    applicationService.updateStatus(id, status, note);
    addToast('success', `Application ${status.replace('-', ' ')}`);
    setRefresh(r => r + 1);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-midnight">Applicants</h1>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-text" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or job..." className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-light-slate bg-white text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
        <select value={jobFilter} onChange={e => setJobFilter(e.target.value)} className="px-4 py-2.5 rounded-lg border border-light-slate bg-white text-sm outline-none cursor-pointer">
          <option value="">All Jobs</option>
          {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2.5 rounded-lg border border-light-slate bg-white text-sm outline-none cursor-pointer">
          <option value="">All Status</option>
          <option value="submitted">Submitted</option><option value="under-review">Under Review</option><option value="shortlisted">Shortlisted</option>
          <option value="interview">Interview</option><option value="hired">Hired</option><option value="rejected">Rejected</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-light-slate p-12 text-center">
          <Users className="w-12 h-12 text-light-slate mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-midnight mb-2">No applicants found</h3>
          <p className="text-slate-text">Applicants will appear here once people apply to your jobs.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-light-slate/50 divide-y divide-light-slate/50">
          {filtered.map(app => (
            <div key={app.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-primary-100 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                    {app.studentName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-midnight">{app.studentName}</p>
                    <p className="text-sm text-slate-text">{app.studentEmail}</p>
                    <p className="text-xs text-slate-text mt-0.5">Applied for <span className="font-medium text-midnight">{app.jobTitle}</span> • {formatDate(app.appliedAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link to={`/recruiter/applicants/${app.id}`} className="px-3 py-1 bg-white border border-light-slate hover:bg-gray-50 text-midnight text-xs font-semibold rounded-lg flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> Details
                  </Link>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[app.status]}`}>{app.status.replace('-', ' ')}</span>
                </div>
              </div>
              {app.coverLetter && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-slate-text italic">
                  "{app.coverLetter.slice(0, 200)}{app.coverLetter.length > 200 ? '...' : ''}"
                </div>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                {app.status === 'submitted' && (
                  <>
                    <button onClick={() => updateStatus(app.id, 'under-review', 'Application is being reviewed')} className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-primary rounded-lg hover:bg-blue-100 transition-colors">Review</button>
                    <button onClick={() => updateStatus(app.id, 'rejected', 'Not a match for this role')} className="px-3 py-1.5 text-xs font-medium bg-red-50 text-error rounded-lg hover:bg-red-100 transition-colors">Reject</button>
                  </>
                )}
                {app.status === 'under-review' && (
                  <>
                    <button onClick={() => updateStatus(app.id, 'shortlisted', 'Candidate shortlisted')} className="px-3 py-1.5 text-xs font-medium bg-purple-50 text-secondary rounded-lg hover:bg-purple-100 transition-colors flex items-center gap-1"><Star className="w-3 h-3" />Shortlist</button>
                    <button onClick={() => updateStatus(app.id, 'rejected', 'Not a match')} className="px-3 py-1.5 text-xs font-medium bg-red-50 text-error rounded-lg hover:bg-red-100 transition-colors">Reject</button>
                  </>
                )}
                {app.status === 'shortlisted' && (
                  <>
                    <button onClick={() => updateStatus(app.id, 'interview', 'Interview scheduled')} className="px-3 py-1.5 text-xs font-medium bg-amber-50 text-warning rounded-lg hover:bg-amber-100 transition-colors flex items-center gap-1"><Clock className="w-3 h-3" />Schedule Interview</button>
                    <button onClick={() => updateStatus(app.id, 'rejected', 'Not proceeding')} className="px-3 py-1.5 text-xs font-medium bg-red-50 text-error rounded-lg hover:bg-red-100 transition-colors">Reject</button>
                  </>
                )}
                {app.status === 'interview' && (
                  <>
                    <button onClick={() => updateStatus(app.id, 'hired', 'Congratulations! Offer extended.')} className="px-3 py-1.5 text-xs font-medium bg-green-50 text-success rounded-lg hover:bg-green-100 transition-colors flex items-center gap-1"><Check className="w-3 h-3" />Hire</button>
                    <button onClick={() => updateStatus(app.id, 'rejected', 'Did not pass interview')} className="px-3 py-1.5 text-xs font-medium bg-red-50 text-error rounded-lg hover:bg-red-100 transition-colors">Reject</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
