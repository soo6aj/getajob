import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Clock, Briefcase, Monitor, Filter, Bookmark, BookmarkCheck, Building2 } from 'lucide-react';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatSalary, formatRelativeDate } from '../../utils/format';

export function StudentJobs() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ location: '', type: '', workMode: '', experienceLevel: '', salaryMin: 0, sortBy: 'newest' });
  const [page, setPage] = useState(1);
  const perPage = 9;

  const jobs = useMemo(() => {
    return jobService.search(searchQuery, filters);
  }, [searchQuery, filters]);

  const totalPages = Math.ceil(jobs.length / perPage);
  const paginatedJobs = jobs.slice((page - 1) * perPage, page * perPage);

  const clearFilters = () => {
    setFilters({ location: '', type: '', workMode: '', experienceLevel: '', salaryMin: 0, sortBy: 'newest' });
    setPage(1);
  };

  const toggleSave = (jobId: string) => {
    if (!user) return;
    if (applicationService.isJobSaved(user.id, jobId)) {
      applicationService.unsaveJob(user.id, jobId);
      addToast('info', 'Job removed from saved');
    } else {
      applicationService.saveJob(user.id, jobId);
      addToast('success', 'Job saved!');
    }
  };

  const typeLabels: Record<string, string> = { 'full-time': 'Full-time', 'part-time': 'Part-time', internship: 'Internship', contract: 'Contract', freelance: 'Freelance' };
  const modeLabels: Record<string, string> = { remote: 'Remote', onsite: 'On-site', hybrid: 'Hybrid' };
  const expLabels: Record<string, string> = { entry: 'Entry Level', mid: 'Mid Level', senior: 'Senior', lead: 'Lead' };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-midnight">Browse Jobs</h1>
        <p className="text-slate-text mt-1">Discover opportunities that match your skills</p>
      </div>

      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-text" />
          <input
            type="text" value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
            placeholder="Search by job title, company, or skill..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-light-slate bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          />
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-light-slate bg-white hover:bg-gray-50 text-sm font-medium text-midnight transition-colors">
          <Filter className="w-4 h-4" /> Filters
        </button>
        <select value={filters.sortBy} onChange={e => setFilters(prev => ({ ...prev, sortBy: e.target.value }))} className="px-4 py-3 rounded-xl border border-light-slate bg-white text-sm font-medium text-midnight outline-none cursor-pointer">
          <option value="newest">Newest First</option>
          <option value="salary-high">Salary: High to Low</option>
          <option value="salary-low">Salary: Low to High</option>
          <option value="applications">Most Applied</option>
        </select>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-light-slate p-5 animate-slide-down">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-midnight">Filters</h3>
            <button onClick={clearFilters} className="text-sm text-primary font-medium hover:text-primary-hover">Clear all</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-text mb-1.5">Location</label>
              <input type="text" value={filters.location} onChange={e => { setFilters(prev => ({ ...prev, location: e.target.value })); setPage(1); }}
                placeholder="e.g., Bengaluru" className="w-full px-3 py-2.5 rounded-lg border border-light-slate text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-text mb-1.5">Job Type</label>
              <select value={filters.type} onChange={e => { setFilters(prev => ({ ...prev, type: e.target.value })); setPage(1); }}
                className="w-full px-3 py-2.5 rounded-lg border border-light-slate text-sm outline-none cursor-pointer">
                <option value="">All Types</option>
                {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-text mb-1.5">Work Mode</label>
              <select value={filters.workMode} onChange={e => { setFilters(prev => ({ ...prev, workMode: e.target.value })); setPage(1); }}
                className="w-full px-3 py-2.5 rounded-lg border border-light-slate text-sm outline-none cursor-pointer">
                <option value="">All Modes</option>
                {Object.entries(modeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-text mb-1.5">Experience</label>
              <select value={filters.experienceLevel} onChange={e => { setFilters(prev => ({ ...prev, experienceLevel: e.target.value })); setPage(1); }}
                className="w-full px-3 py-2.5 rounded-lg border border-light-slate text-sm outline-none cursor-pointer">
                <option value="">All Levels</option>
                {Object.entries(expLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <p className="text-sm text-slate-text">{jobs.length} job{jobs.length !== 1 ? 's' : ''} found</p>

      {/* Job Cards */}
      {paginatedJobs.length === 0 ? (
        <div className="bg-white rounded-xl border border-light-slate p-12 text-center">
          <Briefcase className="w-12 h-12 text-light-slate mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-midnight mb-2">No jobs found</h3>
          <p className="text-slate-text mb-4">Try adjusting your search or filters</p>
          <button onClick={clearFilters} className="text-primary font-medium hover:text-primary-hover">Clear filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {paginatedJobs.map(job => {
            const isSaved = user ? applicationService.isJobSaved(user.id, job.id) : false;
            const hasApplied = user ? applicationService.hasApplied(user.id, job.id) : false;
            return (
              <div key={job.id} className="bg-white rounded-xl border border-light-slate/50 p-5 hover:shadow-card-hover transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-text truncate">{job.companyName}</p>
                      <Link to={`/student/jobs/${job.id}`} className="text-sm font-semibold text-midnight hover:text-primary truncate block">{job.title}</Link>
                    </div>
                  </div>
                  <button onClick={() => toggleSave(job.id)} className="shrink-0 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                    {isSaved ? <BookmarkCheck className="w-5 h-5 text-primary" /> : <Bookmark className="w-5 h-5 text-slate-text" />}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 text-xs bg-gray-50 text-slate-text px-2 py-1 rounded-md">
                    <MapPin className="w-3 h-3" />{job.location}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs bg-gray-50 text-slate-text px-2 py-1 rounded-md">
                    <Briefcase className="w-3 h-3" />{typeLabels[job.type]}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs bg-gray-50 text-slate-text px-2 py-1 rounded-md">
                    <Monitor className="w-3 h-3" />{modeLabels[job.workMode]}
                  </span>
                </div>
                <p className="text-sm text-midnight font-medium mb-1">
                  {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryPeriod)}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {job.skills.slice(0, 3).map(skill => (
                    <span key={skill} className="text-xs bg-primary-50 text-primary px-2 py-0.5 rounded-md font-medium">{skill}</span>
                  ))}
                  {job.skills.length > 3 && <span className="text-xs text-slate-text">+{job.skills.length - 3}</span>}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-light-slate/50">
                  <span className="text-xs text-slate-text flex items-center gap-1">
                    <Clock className="w-3 h-3" />{formatRelativeDate(job.createdAt)}
                  </span>
                  {hasApplied ? (
                    <span className="text-xs text-success font-medium">Applied ✓</span>
                  ) : (
                    <Link to={`/student/jobs/${job.id}`} className="text-xs text-primary font-semibold hover:text-primary-hover">View Details →</Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 text-sm font-medium rounded-lg border border-light-slate hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Previous</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${p === page ? 'bg-primary text-white' : 'hover:bg-gray-50 text-slate-text'}`}>{p}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 text-sm font-medium rounded-lg border border-light-slate hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Next</button>
        </div>
      )}
    </div>
  );
}
