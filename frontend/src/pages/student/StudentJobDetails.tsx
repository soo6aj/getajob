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
  const [educationLevel, setEducationLevel] = useState('B.Tech');
  const [primarySkill, setPrimarySkill] = useState('React / Frontend');
  const [graduationYear, setGraduationYear] = useState('2025');
  const [preferredWorkMode, setPreferredWorkMode] = useState('Hybrid');
  const [willingToRelocate, setWillingToRelocate] = useState(true);
  const [authorizedToWork, setAuthorizedToWork] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [modalError, setModalError] = useState('');

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      addToast('info', 'Resume Attached', file.name);
    }
  };

  const handleApply = () => {
    if (!user) return;
    setModalError('');
    if (!agreeTerms) {
      setModalError('You must agree to the Terms & Data Consent to apply.');
      return;
    }
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

      {/* Apply Modal with Comprehensive Interactive Controls */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-modal w-full max-w-xl p-6 animate-scale-in max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-midnight mb-1">Apply for {job.title}</h2>
            <p className="text-sm text-slate-text mb-6">{job.companyName}</p>

            {modalError && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mb-4">{modalError}</div>}

            <div className="space-y-5">
              {/* Dropdowns (<select>) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-midnight mb-1.5">Education Level</label>
                  <select value={educationLevel} onChange={e => setEducationLevel(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option value="B.Tech">B.Tech / B.E.</option>
                    <option value="M.Tech">M.Tech / M.E.</option>
                    <option value="BCA">BCA</option>
                    <option value="MCA">MCA</option>
                    <option value="B.Sc">B.Sc CS/IT</option>
                    <option value="MBA">MBA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-midnight mb-1.5">Primary Skill</label>
                  <select value={primarySkill} onChange={e => setPrimarySkill(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option value="React / Frontend">React / Frontend</option>
                    <option value="Node.js / Backend">Node.js / Backend</option>
                    <option value="Full Stack">Full Stack Development</option>
                    <option value="Python / Data Science">Python / Data Science</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="DevOps / Cloud">DevOps / Cloud</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-midnight mb-1.5">Graduation Year</label>
                  <select value={graduationYear} onChange={e => setGraduationYear(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                  </select>
                </div>
              </div>

              {/* Radio Buttons (Preferred Work Mode) */}
              <div>
                <label className="block text-xs font-semibold text-midnight mb-2">Preferred Work Mode</label>
                <div className="flex items-center gap-6">
                  {['Remote', 'Hybrid', 'On-site'].map(mode => (
                    <label key={mode} className="inline-flex items-center gap-2 cursor-pointer text-sm text-midnight">
                      <input
                        type="radio"
                        name="workMode"
                        value={mode}
                        checked={preferredWorkMode === mode}
                        onChange={e => setPreferredWorkMode(e.target.value)}
                        className="w-4 h-4 text-primary focus:ring-primary accent-primary"
                      />
                      <span>{mode}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* File Input (type="file") & Resume Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-midnight">Select Existing Resume</label>
                <select value={selectedResume} onChange={e => setSelectedResume(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                  <option value="">Choose saved resume</option>
                  {userResumes.map(r => <option key={r.id} value={r.id}>{r.fileName}{r.isDefault ? ' (Default)' : ''}</option>)}
                </select>

                <div className="pt-1">
                  <label className="block text-xs font-semibold text-midnight mb-1">Or Upload New Resume (.pdf, .docx)</label>
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc"
                    onChange={handleFileUpload}
                    className="w-full text-xs text-slate-text file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary hover:file:bg-primary-100 cursor-pointer"
                  />
                  {uploadedFileName && <p className="mt-1 text-xs text-emerald-600 font-medium">Selected file: {uploadedFileName}</p>}
                </div>
              </div>

              {/* Date Picker (type="date") */}
              <div>
                <label className="block text-xs font-semibold text-midnight mb-1.5">Available Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {/* Checkboxes */}
              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-midnight">
                  <input
                    type="checkbox"
                    checked={willingToRelocate}
                    onChange={e => setWillingToRelocate(e.target.checked)}
                    className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                  />
                  <span>Willing to Relocate to job location</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-midnight">
                  <input
                    type="checkbox"
                    checked={authorizedToWork}
                    onChange={e => setAuthorizedToWork(e.target.checked)}
                    className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                  />
                  <span>Authorized to work in India</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-midnight font-medium">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={e => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                  />
                  <span>Agree to Terms & Data Consent *</span>
                </label>
              </div>

              {/* Textarea (<textarea>) */}
              <div>
                <label className="block text-xs font-semibold text-midnight mb-1.5">Cover Letter / Short Bio</label>
                <textarea
                  value={coverLetter}
                  onChange={e => setCoverLetter(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  placeholder="Why are you a good fit for this role?"
                />
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
