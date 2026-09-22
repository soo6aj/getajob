import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Briefcase, Eye, Users, MoreVertical, Trash2, Pause, Play } from 'lucide-react';
import { jobService } from '../../services/jobService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatDate, formatSalary } from '../../utils/format';

export function RecruiterJobs() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [statusFilter, setStatusFilter] = useState('');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [, setRefresh] = useState(0);

  const jobs = jobService.getByRecruiter(user!.id);
  const filtered = statusFilter ? jobs.filter(j => j.status === statusFilter) : jobs;

  const toggleStatus = (id: string, current: string) => {
    const newStatus = current === 'active' ? 'paused' : 'active';
    jobService.updateStatus(id, newStatus as any);
    addToast('success', `Job ${newStatus === 'active' ? 'activated' : 'paused'}`);
    setMenuOpen(null);
    setRefresh(r => r + 1);
  };

  const deleteJob = (id: string) => {
    jobService.delete(id);
    addToast('info', 'Job deleted');
    setMenuOpen(null);
    setRefresh(r => r + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-midnight">Manage Jobs</h1>
        <Link to="/recruiter/jobs/create" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-colors text-sm">
          <PlusCircle className="w-4 h-4" /> Post a Job
        </Link>
      </div>

      <div className="flex gap-2">
        {['', 'active', 'paused', 'closed'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${statusFilter === s ? 'bg-primary text-white' : 'bg-white border border-light-slate text-slate-text hover:bg-gray-50'}`}>
            {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All'} ({s ? jobs.filter(j => j.status === s).length : jobs.length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-light-slate p-12 text-center">
          <Briefcase className="w-12 h-12 text-light-slate mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-midnight mb-2">No jobs found</h3>
          <Link to="/recruiter/jobs/create" className="text-primary font-medium">Post your first job →</Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-light-slate/50 divide-y divide-light-slate/50">
          {filtered.map(job => (
            <div key={job.id} className="p-5 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-midnight">{job.title}</h3>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${job.status === 'active' ? 'bg-green-50 text-success' : job.status === 'draft' ? 'bg-amber-50 text-warning' : 'bg-gray-100 text-gray-600'}`}>{job.status}</span>
                  </div>
                  <p className="text-sm text-slate-text mt-1">{job.location} • {job.type} • {job.workMode}</p>
                  <p className="text-sm text-midnight font-medium mt-1">{formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryPeriod)}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-xs text-slate-text flex items-center gap-1"><Users className="w-3 h-3" />{job.applicationsCount} applicants</span>
                    <span className="text-xs text-slate-text flex items-center gap-1"><Eye className="w-3 h-3" />{job.views} views</span>
                    <span className="text-xs text-slate-text">Posted {formatDate(job.createdAt)}</span>
                  </div>
                </div>
                <div className="relative shrink-0">
                  <button onClick={() => setMenuOpen(menuOpen === job.id ? null : job.id)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <MoreVertical className="w-5 h-5 text-slate-text" />
                  </button>
                  {menuOpen === job.id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
                      <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-dropdown border border-light-slate z-20 py-1 animate-scale-in">
                        <button onClick={() => toggleStatus(job.id, job.status)} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-text hover:bg-gray-50 w-full">
                          {job.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          {job.status === 'active' ? 'Pause Job' : 'Activate Job'}
                        </button>
                        <button onClick={() => deleteJob(job.id)} className="flex items-center gap-2 px-4 py-2 text-sm text-error hover:bg-red-50 w-full">
                          <Trash2 className="w-4 h-4" />Delete Job
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
