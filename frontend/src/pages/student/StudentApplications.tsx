import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, FileText, ExternalLink } from 'lucide-react';
import { applicationService } from '../../services/applicationService';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/format';

const statusColors: Record<string, string> = {
  submitted: 'bg-gray-100 text-gray-700', 'under-review': 'bg-blue-50 text-primary', shortlisted: 'bg-purple-50 text-secondary',
  interview: 'bg-amber-50 text-warning', hired: 'bg-green-100 text-green-800', rejected: 'bg-red-50 text-error', withdrawn: 'bg-gray-100 text-gray-500',
};

export function StudentApplications() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const applications = applicationService.getByStudent(user!.id);
  const filtered = applications.filter(a => {
    const matchesSearch = a.jobTitle.toLowerCase().includes(search.toLowerCase()) || a.companyName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-midnight">My Applications</h1>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-text" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search applications..." className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-light-slate bg-white text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2.5 rounded-lg border border-light-slate bg-white text-sm outline-none cursor-pointer">
          <option value="">All Status</option>
          <option value="submitted">Submitted</option><option value="under-review">Under Review</option><option value="shortlisted">Shortlisted</option>
          <option value="interview">Interview</option><option value="hired">Hired</option><option value="rejected">Rejected</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-light-slate p-12 text-center">
          <FileText className="w-12 h-12 text-light-slate mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-midnight mb-2">No applications found</h3>
          <p className="text-slate-text mb-4">Start applying to jobs to see them here</p>
          <Link to="/student/jobs" className="text-primary font-medium hover:text-primary-hover">Browse Jobs →</Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-light-slate/50 divide-y divide-light-slate/50">
          {filtered.map(app => (
            <div key={app.id} className="p-4 sm:p-5 hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => setSelected(selected === app.id ? null : app.id)}>
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="font-medium text-midnight">{app.jobTitle}</p>
                  <p className="text-sm text-slate-text">{app.companyName} • Applied {formatDate(app.appliedAt)}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${statusColors[app.status]}`}>{app.status.replace('-', ' ')}</span>
              </div>
              {selected === app.id && (
                <div className="mt-4 pt-4 border-t border-light-slate/50 animate-fade-in">
                  <h4 className="text-sm font-semibold text-midnight mb-3">Application Timeline</h4>
                  <div className="space-y-3">
                    {app.timeline.map((entry, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-2.5 h-2.5 rounded-full ${i === app.timeline.length - 1 ? 'bg-primary' : 'bg-light-slate'}`} />
                          {i < app.timeline.length - 1 && <div className="w-0.5 h-full bg-light-slate mt-1" />}
                        </div>
                        <div className="pb-3">
                          <p className="text-sm font-medium text-midnight capitalize">{entry.status.replace('-', ' ')}</p>
                          <p className="text-xs text-slate-text">{formatDate(entry.date)}</p>
                          {entry.note && <p className="text-xs text-slate-text mt-1 italic">"{entry.note}"</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link to={`/student/jobs/${app.jobId}`} className="inline-flex items-center gap-1 text-sm text-primary font-medium mt-2 hover:text-primary-hover">
                    View Job <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
