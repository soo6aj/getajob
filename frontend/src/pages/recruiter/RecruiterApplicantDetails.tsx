import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Mail, Phone, Calendar, Download, FileText, CheckCircle2,
  XCircle, Clock, Award, ExternalLink, Globe, Send
} from 'lucide-react';
import { applicationService } from '../../services/applicationService';
import { jobService } from '../../services/jobService';
import { userService } from '../../services/userService';
import { useToast } from '../../context/ToastContext';
import { notificationService } from '../../services/notificationService';
import type { Application, ApplicationStatus, StudentProfile } from '../../types';
import { formatDate } from '../../utils/format';

const statusColors: Record<ApplicationStatus, { bg: string; text: string; label: string }> = {
  submitted: { bg: 'bg-blue-50 text-blue-700 border-blue-200', text: 'text-blue-700', label: 'Submitted' },
  'under-review': { bg: 'bg-amber-50 text-amber-700 border-amber-200', text: 'text-amber-700', label: 'Under Review' },
  shortlisted: { bg: 'bg-purple-50 text-purple-700 border-purple-200', text: 'text-purple-700', label: 'Shortlisted' },
  interview: { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', text: 'text-indigo-700', label: 'Interview' },
  hired: { bg: 'bg-green-50 text-green-700 border-green-200', text: 'text-green-700', label: 'Hired' },
  rejected: { bg: 'bg-red-50 text-red-700 border-red-200', text: 'text-red-700', label: 'Rejected' },
  withdrawn: { bg: 'bg-gray-50 text-gray-700 border-gray-200', text: 'text-gray-700', label: 'Withdrawn' },
};

export function RecruiterApplicantDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [application, setApplication] = useState<Application | null>(null);
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [statusNote, setStatusNote] = useState('');
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewForm, setInterviewForm] = useState({
    date: '',
    time: '14:00',
    type: 'Technical Interview',
    link: 'https://meet.google.com/abc-defg-hij',
    notes: '',
  });

  useEffect(() => {
    if (id) {
      const app = applicationService.getById(id);
      if (app) {
        setApplication(app);
        const stu = userService.getStudents().find(s => s.id === app.studentId || s.email === app.studentEmail);
        if (stu) setStudent(stu);
      }
    }
  }, [id]);

  if (!application) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <h2 className="text-xl font-bold text-midnight mb-2">Application not found</h2>
        <button onClick={() => navigate('/recruiter/applicants')} className="text-primary hover:underline text-sm font-medium">
          Back to Applicants
        </button>
      </div>
    );
  }

  const job = jobService.getById(application.jobId);

  const handleUpdateStatus = (newStatus: ApplicationStatus, note?: string) => {
    const updated = applicationService.updateStatus(application.id, newStatus, note || statusNote);
    if (updated) {
      setApplication({ ...updated });
      setStatusNote('');
      addToast('success', 'Status Updated', `Application status changed to ${statusColors[newStatus].label}.`);
      
      // Notify student
      notificationService.create({
        userId: application.studentId,
        type: 'status-changed',
        title: `Application Update: ${application.jobTitle}`,
        message: `Your application status has been updated to "${statusColors[newStatus].label}" by ${application.companyName}.`,
        link: '/student/applications',
      });
    }
  };

  const handleScheduleInterview = (e: React.FormEvent) => {
    e.preventDefault();
    const note = `Interview scheduled for ${interviewForm.date} at ${interviewForm.time} (${interviewForm.type}). Meeting Link: ${interviewForm.link}`;
    handleUpdateStatus('interview', note);
    setShowInterviewModal(false);
    addToast('success', 'Interview Scheduled', 'Candidate has been notified with the meeting details.');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate('/recruiter/applicants')}
          className="inline-flex items-center gap-2 text-sm text-slate-text hover:text-midnight font-medium w-fit"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Applicants
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-text font-medium">Current Status:</span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[application.status].bg}`}>
            {statusColors[application.status].label}
          </span>
        </div>
      </div>

      {/* Main Profile & Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Candidate Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-xl border border-light-slate/50 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-midnight">{application.studentName}</h1>
                <p className="text-sm text-slate-text mt-1">
                  Applied for <Link to={`/recruiter/jobs/${application.jobId}/edit`} className="text-primary hover:underline font-semibold">{application.jobTitle}</Link>
                </p>
                <p className="text-xs text-slate-text mt-0.5">Applied on {formatDate(application.appliedAt)}</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">
                {application.studentName.slice(0, 2).toUpperCase()}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-light-slate">
              <div className="flex items-center gap-2 text-sm text-slate-text">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href={`mailto:${application.studentEmail}`} className="hover:underline truncate">{application.studentEmail}</a>
              </div>
              {student?.phone && (
                <div className="flex items-center gap-2 text-sm text-slate-text">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <span>{student.phone}</span>
                </div>
              )}
              {student?.college && (
                <div className="flex items-center gap-2 text-sm text-slate-text">
                  <Award className="w-4 h-4 text-primary shrink-0" />
                  <span className="truncate">{student.college}</span>
                </div>
              )}
              {student?.degree && (
                <div className="flex items-center gap-2 text-sm text-slate-text">
                  <Calendar className="w-4 h-4 text-primary shrink-0" />
                  <span>{student.degree} ({student.graduationYear})</span>
                </div>
              )}
            </div>

            {/* Social Links */}
            {student?.socialLinks && (
              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-light-slate">
                {student.socialLinks.linkedin && (
                  <a href={student.socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-slate-text hover:text-primary flex items-center gap-1 text-xs">
                    <Globe className="w-4 h-4" /> LinkedIn
                  </a>
                )}
                {student.socialLinks.github && (
                  <a href={student.socialLinks.github} target="_blank" rel="noreferrer" className="text-slate-text hover:text-midnight flex items-center gap-1 text-xs">
                    <ExternalLink className="w-4 h-4" /> GitHub
                  </a>
                )}
                {student.socialLinks.portfolio && (
                  <a href={student.socialLinks.portfolio} target="_blank" rel="noreferrer" className="text-slate-text hover:text-primary flex items-center gap-1 text-xs">
                    <Globe className="w-4 h-4" /> Portfolio
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Cover Letter */}
          {application.coverLetter && (
            <div className="bg-white rounded-xl border border-light-slate/50 p-6 space-y-3">
              <h3 className="font-semibold text-midnight flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" /> Cover Letter / Note
              </h3>
              <p className="text-sm text-slate-text leading-relaxed whitespace-pre-line bg-off-white p-4 rounded-lg">
                {application.coverLetter}
              </p>
            </div>
          )}

          {/* Skills */}
          {student?.skills && student.skills.length > 0 && (
            <div className="bg-white rounded-xl border border-light-slate/50 p-6 space-y-3">
              <h3 className="font-semibold text-midnight">Skills & Proficiencies</h3>
              <div className="flex flex-wrap gap-2">
                {student.skills.map((skill, i) => {
                  const isMatching = job?.skills.some(s => s.toLowerCase() === skill.toLowerCase());
                  return (
                    <span
                      key={i}
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        isMatching
                          ? 'bg-primary/10 text-primary border border-primary/20 font-semibold'
                          : 'bg-gray-100 text-slate-text'
                      }`}
                    >
                      {skill} {isMatching && '✓ Match'}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Experience */}
          {student?.experience && student.experience.length > 0 && (
            <div className="bg-white rounded-xl border border-light-slate/50 p-6 space-y-4">
              <h3 className="font-semibold text-midnight">Experience</h3>
              <div className="space-y-4">
                {student.experience.map(exp => (
                  <div key={exp.id} className="border-l-2 border-primary/30 pl-4 space-y-1">
                    <h4 className="text-sm font-semibold text-midnight">{exp.title}</h4>
                    <p className="text-xs text-slate-text">{exp.company} • {exp.location}</p>
                    <p className="text-xs text-slate-text">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                    <p className="text-xs text-slate-text mt-1">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {student?.projects && student.projects.length > 0 && (
            <div className="bg-white rounded-xl border border-light-slate/50 p-6 space-y-4">
              <h3 className="font-semibold text-midnight">Projects</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {student.projects.map(proj => (
                  <div key={proj.id} className="border border-light-slate/60 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-midnight">{proj.title}</h4>
                      <div className="flex gap-2">
                        {proj.github && (
                          <a href={proj.github} target="_blank" rel="noreferrer" className="text-slate-text hover:text-midnight" title="GitHub Repository">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {proj.link && (
                          <a href={proj.link} target="_blank" rel="noreferrer" className="text-slate-text hover:text-primary">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-slate-text line-clamp-2">{proj.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {proj.technologies.map(t => (
                        <span key={t} className="text-[10px] bg-gray-100 text-slate-text px-2 py-0.5 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resume Preview Card */}
          <div className="bg-white rounded-xl border border-light-slate/50 p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-midnight">{application.studentName}_Resume.pdf</p>
                <p className="text-xs text-slate-text">PDF Document • 1.2 MB</p>
              </div>
            </div>
            <button
              onClick={() => addToast('info', 'Downloading Resume', 'Simulating resume PDF download...')}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 text-xs font-semibold rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>
        </div>

        {/* Right 1 Col: Workflow Actions & Timeline */}
        <div className="space-y-6">
          {/* Status Progression Card */}
          <div className="bg-white rounded-xl border border-light-slate/50 p-6 space-y-4">
            <h3 className="font-semibold text-midnight text-sm">Hiring Action</h3>

            <div className="space-y-2">
              <button
                onClick={() => handleUpdateStatus('under-review')}
                disabled={application.status === 'under-review'}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg border border-amber-200 text-amber-800 bg-amber-50 hover:bg-amber-100 disabled:opacity-50 transition-colors"
              >
                <span>Move to Under Review</span>
                <Clock className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleUpdateStatus('shortlisted')}
                disabled={application.status === 'shortlisted'}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg border border-purple-200 text-purple-800 bg-purple-50 hover:bg-purple-100 disabled:opacity-50 transition-colors"
              >
                <span>Shortlist Candidate</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowInterviewModal(true)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg border border-indigo-200 text-indigo-800 bg-indigo-50 hover:bg-indigo-100 transition-colors"
              >
                <span>Schedule Interview...</span>
                <Calendar className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleUpdateStatus('hired')}
                disabled={application.status === 'hired'}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg border border-green-200 text-green-800 bg-green-50 hover:bg-green-100 disabled:opacity-50 transition-colors"
              >
                <span>Extend Offer / Hire</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleUpdateStatus('rejected')}
                disabled={application.status === 'rejected'}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg border border-red-200 text-red-800 bg-red-50 hover:bg-red-100 disabled:opacity-50 transition-colors"
              >
                <span>Reject Application</span>
                <XCircle className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Note Input */}
            <div className="pt-3 border-t border-light-slate space-y-2">
              <label className="block text-xs font-medium text-slate-text">Add Note to Timeline</label>
              <textarea
                value={statusNote}
                onChange={e => setStatusNote(e.target.value)}
                placeholder="Write an internal review note..."
                rows={2}
                className="w-full p-2 text-xs border border-light-slate rounded-lg outline-none focus:ring-1 focus:ring-primary resize-none"
              />
              <button
                onClick={() => {
                  if (!statusNote) return;
                  handleUpdateStatus(application.status, statusNote);
                }}
                disabled={!statusNote}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-primary text-white rounded-lg text-xs font-semibold disabled:opacity-50 hover:bg-primary-hover"
              >
                <Send className="w-3.5 h-3.5" /> Save Note
              </button>
            </div>
          </div>

          {/* Activity Timeline Card */}
          <div className="bg-white rounded-xl border border-light-slate/50 p-6 space-y-4">
            <h3 className="font-semibold text-midnight text-sm">Application History</h3>
            <div className="relative pl-4 space-y-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-light-slate">
              {application.timeline.map((entry, idx) => (
                <div key={idx} className="relative space-y-1">
                  <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-primary border-2 border-white" />
                  <p className="text-xs font-semibold text-midnight capitalize">{entry.status.replace('-', ' ')}</p>
                  <p className="text-[11px] text-slate-text">{formatDate(entry.date)}</p>
                  {entry.note && (
                    <p className="text-xs text-slate-text bg-gray-50 p-2 rounded border border-light-slate/50 mt-1">
                      {entry.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Interview Modal */}
      {showInterviewModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-modal animate-scale-in">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-midnight text-lg">Schedule Interview</h3>
              <button onClick={() => setShowInterviewModal(false)} className="text-slate-text hover:text-midnight">
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-text">
              Set interview details for <strong>{application.studentName}</strong> for the role of <strong>{application.jobTitle}</strong>.
            </p>

            <form onSubmit={handleScheduleInterview} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-midnight mb-1">Interview Date *</label>
                <input
                  type="date"
                  required
                  value={interviewForm.date}
                  onChange={e => setInterviewForm(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-light-slate rounded-lg text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-midnight mb-1">Time *</label>
                <input
                  type="time"
                  required
                  value={interviewForm.time}
                  onChange={e => setInterviewForm(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full px-3 py-2 border border-light-slate rounded-lg text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-midnight mb-1">Round / Type</label>
                <select
                  value={interviewForm.type}
                  onChange={e => setInterviewForm(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-light-slate rounded-lg text-sm outline-none"
                >
                  <option>Screening Call</option>
                  <option>Technical Interview</option>
                  <option>System Design Interview</option>
                  <option>HR & Culture Fit</option>
                  <option>Final Round</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-midnight mb-1">Meeting Link / Room</label>
                <input
                  type="text"
                  value={interviewForm.link}
                  onChange={e => setInterviewForm(prev => ({ ...prev, link: e.target.value }))}
                  className="w-full px-3 py-2 border border-light-slate rounded-lg text-sm outline-none"
                  placeholder="https://meet.google.com/..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInterviewModal(false)}
                  className="px-4 py-2 border border-light-slate rounded-lg text-xs font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary-hover"
                >
                  Confirm & Notify Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
