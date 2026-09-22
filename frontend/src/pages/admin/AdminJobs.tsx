import { useState, useMemo } from 'react';
import {
  Search, Filter, Trash2, MapPin, Building2
} from 'lucide-react';
import { jobService } from '../../services/jobService';
import { useToast } from '../../context/ToastContext';
import type { Job, JobStatus } from '../../types';
import { formatDate, formatSalary } from '../../utils/format';

export function AdminJobs() {
  const { addToast } = useToast();
  const [jobs, setJobs] = useState<Job[]>(() => jobService.getAll());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | JobStatus>('all');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const filteredJobs = useMemo(() => {
    return jobs.filter(j => {
      const matchSearch =
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.companyName.toLowerCase().includes(search.toLowerCase()) ||
        j.location.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || j.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [jobs, search, statusFilter]);

  const handleUpdateStatus = (jobId: string, status: JobStatus) => {
    jobService.updateStatus(jobId, status);
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status } : j));
    addToast('success', 'Status Updated', `Job status changed to ${status}.`);
  };

  const handleDeleteJob = (jobId: string) => {
    if (confirm('Are you sure you want to permanently delete this job listing from the portal?')) {
      jobService.delete(jobId);
      setJobs(prev => prev.filter(j => j.id !== jobId));
      addToast('success', 'Job Deleted', 'The job listing has been permanently removed.');
      if (selectedJob?.id === jobId) setSelectedJob(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-midnight">Job Moderation</h1>
        <p className="text-sm text-slate-text mt-1">
          Review, approve, and moderate job postings created across all recruiter accounts.
        </p>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-light-slate/50 p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-text absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by job title, company, or location..."
            className="w-full pl-10 pr-4 py-2.5 bg-off-white border border-light-slate rounded-lg text-sm outline-none focus:border-primary focus:bg-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-text" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-off-white border border-light-slate rounded-lg text-xs font-medium text-midnight outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="draft">Drafts</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-light-slate/50 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-off-white border-b border-light-slate text-xs font-semibold text-slate-text uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Job Title & Company</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Type & Mode</th>
                <th className="px-6 py-3.5">Engagement</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-slate/50">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-text">
                    No jobs found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredJobs.map(job => (
                  <tr key={job.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-midnight hover:text-primary cursor-pointer" onClick={() => setSelectedJob(job)}>
                          {job.title}
                        </p>
                        <p className="text-xs text-slate-text flex items-center gap-1.5 mt-0.5">
                          <Building2 className="w-3.5 h-3.5 text-secondary" />
                          <span>{job.companyName}</span>
                          <span>•</span>
                          <MapPin className="w-3 h-3" />
                          <span>{job.location}</span>
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs bg-gray-100 text-midnight px-2.5 py-1 rounded font-medium">
                        {job.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs space-y-0.5">
                        <p className="font-medium text-midnight capitalize">{job.type}</p>
                        <p className="text-slate-text capitalize">{job.workMode}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-slate-text">
                        <span>{job.views || 0} views</span>
                        <span className="mx-1">•</span>
                        <span className="font-semibold text-primary">{job.applicationsCount || 0} apps</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        job.status === 'active' ? 'bg-green-50 text-green-700 border border-green-200' :
                        job.status === 'draft' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => setSelectedJob(job)}
                          className="px-2.5 py-1.5 rounded-lg border border-light-slate text-xs font-semibold text-slate-text hover:text-midnight hover:bg-gray-50"
                        >
                          Review
                        </button>
                        {job.status === 'active' ? (
                          <button
                            onClick={() => handleUpdateStatus(job.id, 'closed')}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100"
                          >
                            Close
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateStatus(job.id, 'active')}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100"
                          >
                            Activate
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="p-1.5 text-slate-text hover:text-error hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Job Inspection Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-modal animate-scale-in max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-secondary tracking-wider">{selectedJob.companyName}</span>
                <h3 className="font-bold text-midnight text-xl mt-0.5">{selectedJob.title}</h3>
                <p className="text-xs text-slate-text flex items-center gap-2 mt-1">
                  <span>{selectedJob.location}</span>
                  <span>•</span>
                  <span className="capitalize">{selectedJob.type}</span>
                  <span>•</span>
                  <span className="capitalize">{selectedJob.workMode}</span>
                  <span>•</span>
                  <span>Posted {formatDate(selectedJob.createdAt)}</span>
                </p>
              </div>
              <button onClick={() => setSelectedJob(null)} className="text-slate-text hover:text-midnight p-1">
                ✕
              </button>
            </div>

            {/* Compensation & Metadata */}
            <div className="p-4 bg-off-white rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-text block">Compensation</span>
                <span className="font-bold text-midnight">
                  {formatSalary(selectedJob.salaryMin, selectedJob.salaryMax, selectedJob.salaryCurrency, selectedJob.salaryPeriod)}
                </span>
              </div>
              <div>
                <span className="text-slate-text block">Experience</span>
                <span className="font-bold text-midnight capitalize">{selectedJob.experienceLevel}</span>
              </div>
              <div>
                <span className="text-slate-text block">Vacancies</span>
                <span className="font-bold text-midnight">{selectedJob.vacancies}</span>
              </div>
              <div>
                <span className="text-slate-text block">Deadline</span>
                <span className="font-bold text-midnight">{formatDate(selectedJob.applicationDeadline)}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-text">Job Description</h4>
              <p className="text-xs text-slate-text leading-relaxed whitespace-pre-line bg-gray-50 p-3 rounded-lg">
                {selectedJob.description}
              </p>
            </div>

            {/* Skills */}
            {selectedJob.skills.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-text mb-2">Required Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedJob.skills.map(s => (
                    <span key={s} className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-4 border-t border-light-slate flex items-center justify-between">
              <button
                onClick={() => handleDeleteJob(selectedJob.id)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-error hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Remove Posting
              </button>

              <div className="flex items-center gap-2">
                {selectedJob.status !== 'active' && (
                  <button
                    onClick={() => {
                      handleUpdateStatus(selectedJob.id, 'active');
                      setSelectedJob(prev => prev ? { ...prev, status: 'active' } : null);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700"
                  >
                    Approve / Publish
                  </button>
                )}
                {selectedJob.status === 'active' && (
                  <button
                    onClick={() => {
                      handleUpdateStatus(selectedJob.id, 'closed');
                      setSelectedJob(prev => prev ? { ...prev, status: 'closed' } : null);
                    }}
                    className="px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700"
                  >
                    Close Listing
                  </button>
                )}
                <button
                  onClick={() => setSelectedJob(null)}
                  className="px-4 py-2 border border-light-slate rounded-lg text-xs font-semibold hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
