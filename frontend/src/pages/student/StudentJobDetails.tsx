import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, Monitor, Clock, ArrowLeft, Bookmark, BookmarkCheck, Building2, Send, CheckCircle } from 'lucide-react';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatSalary, formatDate } from '../../utils/format';
import { mockCompanies } from '../../data/mockCompanies';
import { mockResumes } from '../../data/mockApplications';

export function StudentJobDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [selectedResume, setSelectedResume] = useState('');

  const job = id ? jobService.getById(id) : undefined;
  if (!job) return <div className="text-center py-20"><p className="text-slate-text">Job not found.</p><Link to="/student/jobs" className="text-primary font-medium mt-2 inline-block">← Browse Jobs</Link></div>;

  const company = mockCompanies.find(c => c.id === job.companyId);
  const isSaved = user ? applicationService.isJobSaved(user.id, job.id) : false;
  const hasApplied = user ? applicationService.hasApplied(user.id, job.id) : false;
  const userResumes = user ? mockResumes.filter(r => r.studentId === user.id) : [];

  const toggleSave = () => {
    if (!user) return;
    if (isSaved) { applicationService.unsaveJob(user.id, job.id); addToast('info', 'Removed from saved'); }
    else { applicationService.saveJob(user.id, job.id); addToast('success', 'Job saved!'); }
  };

  const handleApply = () => {
    if (!user) return;
    applicationService.apply({
      jobId: job.id, jobTitle: job.title, companyName: job.companyName, companyLogo: job.companyLogo,
      studentId: user.id, studentName: user.name, studentEmail: user.email, studentAvatar: user.avatar,
      resumeId: selectedResume || undefined, coverLetter: coverLetter || undefined, status: 'submitted',
    });
    setShowApplyModal(false);
    addToast('success', 'Application submitted!', `Your application for ${job.title} has been sent.`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-slate-text hover:text-midnight font-medium">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Job Header */}
      <div className="bg-white rounded-xl border border-light-slate/50 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
              <Building2 className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-midnight">{job.title}</h1>
              <p className="text-slate-text mt-1">{job.companyName}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="inline-flex items-center gap-1 text-xs bg-gray-50 text-slate-text px-2.5 py-1 rounded-md"><MapPin className="w-3 h-3" />{job.location}</span>
                <span className="inline-flex items-center gap-1 text-xs bg-gray-50 text-slate-text px-2.5 py-1 rounded-md"><Briefcase className="w-3 h-3" />{job.type}</span>
                <span className="inline-flex items-center gap-1 text-xs bg-gray-50 text-slate-text px-2.5 py-1 rounded-md"><Monitor className="w-3 h-3" />{job.workMode}</span>
                <span className="inline-flex items-center gap-1 text-xs bg-gray-50 text-slate-text px-2.5 py-1 rounded-md"><Clock className="w-3 h-3" />{job.experienceLevel}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleSave} className="p-2.5 rounded-lg border border-light-slate hover:bg-gray-50 transition-colors">
              {isSaved ? <BookmarkCheck className="w-5 h-5 text-primary" /> : <Bookmark className="w-5 h-5 text-slate-text" />}
            </button>
            {hasApplied ? (
              <span className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-50 text-success font-semibold rounded-lg text-sm"><CheckCircle className="w-4 h-4" /> Applied</span>
            ) : (
              <button onClick={() => setShowApplyModal(true)} className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-colors text-sm">
                <Send className="w-4 h-4" /> Apply Now
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-light-slate/50">
          <div>
            <p className="text-xs text-slate-text">Salary</p>
            <p className="text-sm font-semibold text-midnight mt-0.5">{formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryPeriod)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-text">Vacancies</p>
            <p className="text-sm font-semibold text-midnight mt-0.5">{job.vacancies}</p>
          </div>
          <div>
            <p className="text-xs text-slate-text">Deadline</p>
            <p className="text-sm font-semibold text-midnight mt-0.5">{formatDate(job.applicationDeadline)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-text">Applicants</p>
            <p className="text-sm font-semibold text-midnight mt-0.5">{job.applicationsCount}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-xl border border-light-slate/50 p-6 sm:p-8 space-y-6">
        <div><h2 className="text-lg font-bold text-midnight mb-3">Description</h2><p className="text-slate-text leading-relaxed">{job.description}</p></div>
        <div><h2 className="text-lg font-bold text-midnight mb-3">Responsibilities</h2><ul className="space-y-2">{job.responsibilities.map((r, i) => <li key={i} className="flex items-start gap-2 text-slate-text"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />{r}</li>)}</ul></div>
        <div><h2 className="text-lg font-bold text-midnight mb-3">Requirements</h2><ul className="space-y-2">{job.requirements.map((r, i) => <li key={i} className="flex items-start gap-2 text-slate-text"><span className="w-1.5 h-1.5 rounded-full bg-slate-text mt-2 shrink-0" />{r}</li>)}</ul></div>
        <div><h2 className="text-lg font-bold text-midnight mb-3">Skills</h2><div className="flex flex-wrap gap-2">{job.skills.map(s => <span key={s} className="text-sm bg-primary-50 text-primary px-3 py-1 rounded-lg font-medium">{s}</span>)}</div></div>
      </div>

      {/* Company Info */}
      {company && (
        <div className="bg-white rounded-xl border border-light-slate/50 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-midnight mb-4">About {company.name}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
            <div><p className="text-xs text-slate-text">Industry</p><p className="text-sm font-medium text-midnight">{company.industry}</p></div>
            <div><p className="text-xs text-slate-text">Company Size</p><p className="text-sm font-medium text-midnight">{company.size} employees</p></div>
            <div><p className="text-xs text-slate-text">Location</p><p className="text-sm font-medium text-midnight">{company.location}</p></div>
          </div>
          <p className="text-slate-text text-sm leading-relaxed">{company.about}</p>
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-modal w-full max-w-lg p-6 animate-scale-in max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-midnight mb-1">Apply for {job.title}</h2>
            <p className="text-sm text-slate-text mb-6">{job.companyName}</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-midnight mb-1.5">Select Resume</label>
                <select value={selectedResume} onChange={e => setSelectedResume(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                  <option value="">No resume selected</option>
                  {userResumes.map(r => <option key={r.id} value={r.id}>{r.fileName}{r.isDefault ? ' (Default)' : ''}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-midnight mb-1.5">Cover Letter (Optional)</label>
                <textarea value={coverLetter} onChange={e => setCoverLetter(e.target.value)} rows={5} className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" placeholder="Why are you a good fit for this role?" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowApplyModal(false)} className="flex-1 px-4 py-2.5 text-sm font-medium rounded-lg border border-light-slate hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleApply} className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg bg-primary text-white hover:bg-primary-hover transition-colors">Submit Application</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
