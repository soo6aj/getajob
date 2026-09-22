import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, MapPin, Briefcase, Trash2, Building2 } from 'lucide-react';
import { applicationService } from '../../services/applicationService';
import { jobService } from '../../services/jobService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatSalary } from '../../utils/format';

export function StudentSavedJobs() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [, setRefresh] = useState(0);

  const savedJobs = applicationService.getSavedJobs(user!.id);
  const jobs = savedJobs.map(s => jobService.getById(s.jobId)).filter(Boolean);

  const handleUnsave = (jobId: string) => {
    applicationService.unsaveJob(user!.id, jobId);
    addToast('info', 'Job removed from saved');
    setRefresh(r => r + 1);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-midnight">Saved Jobs</h1>
      {jobs.length === 0 ? (
        <div className="bg-white rounded-xl border border-light-slate p-12 text-center">
          <Bookmark className="w-12 h-12 text-light-slate mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-midnight mb-2">No saved jobs yet</h3>
          <p className="text-slate-text mb-4">Save jobs to review them later</p>
          <Link to="/student/jobs" className="text-primary font-medium">Browse Jobs →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map(job => job && (
            <div key={job.id} className="bg-white rounded-xl border border-light-slate/50 p-5 hover:shadow-card-hover transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center"><Building2 className="w-5 h-5 text-primary" /></div>
                  <div>
                    <Link to={`/student/jobs/${job.id}`} className="font-semibold text-midnight hover:text-primary text-sm">{job.title}</Link>
                    <p className="text-xs text-slate-text">{job.companyName}</p>
                  </div>
                </div>
                <button onClick={() => handleUnsave(job.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-text hover:text-error transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-xs bg-gray-50 text-slate-text px-2 py-1 rounded-md inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                <span className="text-xs bg-gray-50 text-slate-text px-2 py-1 rounded-md inline-flex items-center gap-1"><Briefcase className="w-3 h-3" />{job.type}</span>
              </div>
              <p className="text-sm font-medium text-midnight mb-3">{formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryPeriod)}</p>
              <div className="flex gap-2">
                <Link to={`/student/jobs/${job.id}`} className="flex-1 text-center px-4 py-2 text-sm font-medium rounded-lg border border-light-slate hover:bg-gray-50 transition-colors">View</Link>
                {!applicationService.hasApplied(user!.id, job.id) && (
                  <Link to={`/student/jobs/${job.id}`} className="flex-1 text-center px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-white hover:bg-primary-hover transition-colors">Apply</Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
