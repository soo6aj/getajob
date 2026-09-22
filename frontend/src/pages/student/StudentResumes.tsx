import { useState } from 'react';
import { Upload, FileText, Trash2, Star, StarOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { mockResumes } from '../../data/mockApplications';
import { formatFileSize, formatDate } from '../../utils/format';
import type { Resume } from '../../types';

export function StudentResumes() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [resumes, setResumes] = useState<Resume[]>(mockResumes.filter(r => r.studentId === user!.id));

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { addToast('error', 'File too large', 'Maximum file size is 5MB'); return; }
    const newResume: Resume = { id: `res-${Date.now()}`, studentId: user!.id, fileName: file.name, fileSize: file.size, fileType: file.type, uploadedAt: new Date().toISOString(), isDefault: resumes.length === 0 };
    setResumes(prev => [...prev, newResume]);
    addToast('success', 'Resume uploaded!', `${file.name} has been added.`);
    e.target.value = '';
  };

  const handleDelete = (id: string) => { setResumes(prev => prev.filter(r => r.id !== id)); addToast('info', 'Resume deleted'); };
  const setDefault = (id: string) => { setResumes(prev => prev.map(r => ({ ...r, isDefault: r.id === id }))); addToast('success', 'Default resume updated'); };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-midnight">My Resumes</h1>
        <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-colors cursor-pointer text-sm">
          <Upload className="w-4 h-4" /> Upload Resume
          <input type="file" accept=".pdf,.doc,.docx" onChange={handleUpload} className="hidden" />
        </label>
      </div>

      {resumes.length === 0 ? (
        <div className="bg-white rounded-xl border border-light-slate p-12 text-center">
          <FileText className="w-12 h-12 text-light-slate mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-midnight mb-2">No resumes uploaded</h3>
          <p className="text-slate-text mb-4">Upload your resume to apply for jobs</p>
        </div>
      ) : (
        <div className="space-y-3">
          {resumes.map(resume => (
            <div key={resume.id} className="bg-white rounded-xl border border-light-slate/50 p-5 flex items-center justify-between hover:shadow-card transition-all">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-red-500" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-midnight truncate">{resume.fileName}</p>
                  <p className="text-xs text-slate-text">{formatFileSize(resume.fileSize)} • Uploaded {formatDate(resume.uploadedAt)}</p>
                  {resume.isDefault && <span className="inline-flex items-center gap-1 text-xs text-primary font-medium mt-1"><Star className="w-3 h-3" /> Default Resume</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {!resume.isDefault && (
                  <button onClick={() => setDefault(resume.id)} className="p-2 rounded-lg hover:bg-amber-50 text-slate-text hover:text-warning transition-colors" title="Set as default"><StarOff className="w-4 h-4" /></button>
                )}
                <button onClick={() => handleDelete(resume.id)} className="p-2 rounded-lg hover:bg-red-50 text-slate-text hover:text-error transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
