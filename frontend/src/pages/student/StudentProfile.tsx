import { useState } from 'react';
import { User, Save, Plus, X, Globe, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import type { StudentProfile } from '../../types';

export function StudentProfilePage() {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();
  const student = user as StudentProfile;
  const [form, setForm] = useState({ name: student.name, email: student.email, phone: student.phone || '', college: student.college, degree: student.degree, graduationYear: student.graduationYear, skills: student.skills.join(', '), linkedin: student.socialLinks.linkedin || '', github: student.socialLinks.github || '', portfolio: student.socialLinks.portfolio || '' });
  const [newSkill, setNewSkill] = useState('');
  const [skills, setSkills] = useState<string[]>(student.skills);

  const addSkill = () => { if (newSkill.trim() && !skills.includes(newSkill.trim())) { setSkills([...skills, newSkill.trim()]); setNewSkill(''); } };
  const removeSkill = (s: string) => setSkills(skills.filter(sk => sk !== s));

  const handleSave = () => {
    updateUser({ ...form, skills } as any);
    addToast('success', 'Profile updated!', 'Your changes have been saved.');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-midnight">My Profile</h1>

      {/* Profile Completion */}
      <div className="bg-white rounded-xl border border-light-slate/50 p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-midnight">Profile Completion</span>
          <span className="text-sm font-bold text-primary">{student.profileCompletion}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2"><div className="bg-primary h-2 rounded-full" style={{ width: `${student.profileCompletion}%` }} /></div>
      </div>

      {/* Personal Info */}
      <div className="bg-white rounded-xl border border-light-slate/50 p-6 space-y-4">
        <h2 className="font-semibold text-midnight flex items-center gap-2"><User className="w-5 h-5" /> Personal Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-midnight mb-1.5">Full Name</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-midnight mb-1.5">Email</label>
            <input type="email" value={form.email} disabled className="w-full px-4 py-3 rounded-lg border border-light-slate bg-gray-50 text-slate-text cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-medium text-midnight mb-1.5">Phone</label>
            <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="+91 98765 43210" />
          </div>
          <div>
            <label className="block text-sm font-medium text-midnight mb-1.5">Graduation Year</label>
            <input type="number" value={form.graduationYear} onChange={e => setForm({ ...form, graduationYear: parseInt(e.target.value) })} className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-midnight mb-1.5">College</label>
            <input type="text" value={form.college} onChange={e => setForm({ ...form, college: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-midnight mb-1.5">Degree</label>
            <input type="text" value={form.degree} onChange={e => setForm({ ...form, degree: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white rounded-xl border border-light-slate/50 p-6">
        <h2 className="font-semibold text-midnight mb-4">Skills</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {skills.map(s => (
            <span key={s} className="inline-flex items-center gap-1 text-sm bg-primary-50 text-primary px-3 py-1 rounded-lg font-medium">
              {s}<button onClick={() => removeSkill(s)} className="hover:text-error"><X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="text" value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} className="flex-1 px-4 py-2.5 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" placeholder="Add a skill" />
          <button onClick={addSkill} className="px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"><Plus className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-white rounded-xl border border-light-slate/50 p-6 space-y-4">
        <h2 className="font-semibold text-midnight">Social Links</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3"><Globe className="w-5 h-5 text-slate-text shrink-0" /><input type="url" value={form.linkedin} onChange={e => setForm({ ...form, linkedin: e.target.value })} className="flex-1 px-4 py-2.5 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" placeholder="LinkedIn URL" /></div>
          <div className="flex items-center gap-3"><ExternalLink className="w-5 h-5 text-slate-text shrink-0" /><input type="url" value={form.github} onChange={e => setForm({ ...form, github: e.target.value })} className="flex-1 px-4 py-2.5 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" placeholder="GitHub URL" /></div>
          <div className="flex items-center gap-3"><Globe className="w-5 h-5 text-slate-text shrink-0" /><input type="url" value={form.portfolio} onChange={e => setForm({ ...form, portfolio: e.target.value })} className="flex-1 px-4 py-2.5 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" placeholder="Portfolio URL" /></div>
        </div>
      </div>

      <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-colors">
        <Save className="w-5 h-5" /> Save Changes
      </button>
    </div>
  );
}

export { StudentProfilePage as StudentProfile };
