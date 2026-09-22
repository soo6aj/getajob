import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, ArrowLeft } from 'lucide-react';
import { jobService } from '../../services/jobService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { mockCompanies } from '../../data/mockCompanies';
import type { RecruiterProfile } from '../../types';

export function RecruiterCreateJob() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const recruiter = user as RecruiterProfile;
  const company = mockCompanies.find(c => c.id === recruiter.companyId);

  const [form, setForm] = useState({
    title: '', description: '', responsibilities: '', requirements: '',
    skills: '', category: 'Engineering', type: 'full-time' as const,
    workMode: 'hybrid' as const, experienceLevel: 'entry' as const,
    location: company?.location || '', salaryMin: 0, salaryMax: 0,
    salaryCurrency: 'INR', salaryPeriod: 'yearly' as const,
    vacancies: 1, applicationDeadline: '',
  });
  const [error, setError] = useState('');

  const update = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.location || !form.applicationDeadline) {
      setError('Please fill in all required fields.'); return;
    }
    jobService.create({
      ...form,
      responsibilities: form.responsibilities.split('\n').filter(Boolean),
      requirements: form.requirements.split('\n').filter(Boolean),
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      recruiterId: recruiter.id,
      companyId: recruiter.companyId,
      companyName: company?.name || 'Your Company',
      companyLogo: company?.logo,
      status: 'active',
    } as any);
    addToast('success', 'Job posted!', 'Your job listing is now live.');
    navigate('/recruiter/jobs');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-slate-text hover:text-midnight font-medium">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <h1 className="text-2xl font-bold text-midnight">Post a New Job</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

        <div className="bg-white rounded-xl border border-light-slate/50 p-6 space-y-4">
          <h2 className="font-semibold text-midnight">Job Details</h2>
          <div>
            <label className="block text-sm font-medium text-midnight mb-1.5">Job Title *</label>
            <input type="text" value={form.title} onChange={e => update('title', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="e.g., Frontend Developer" />
          </div>
          <div>
            <label className="block text-sm font-medium text-midnight mb-1.5">Description *</label>
            <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={4} className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" placeholder="Describe the role..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-midnight mb-1.5">Responsibilities (one per line)</label>
            <textarea value={form.responsibilities} onChange={e => update('responsibilities', e.target.value)} rows={3} className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" placeholder="Build scalable UI components..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-midnight mb-1.5">Requirements (one per line)</label>
            <textarea value={form.requirements} onChange={e => update('requirements', e.target.value)} rows={3} className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" placeholder="3+ years of React experience..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-midnight mb-1.5">Skills (comma-separated)</label>
            <input type="text" value={form.skills} onChange={e => update('skills', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="React, TypeScript, Node.js" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-light-slate/50 p-6 space-y-4">
          <h2 className="font-semibold text-midnight">Job Configuration</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-midnight mb-1.5">Category</label>
              <select value={form.category} onChange={e => update('category', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none cursor-pointer">
                {['Engineering', 'Design', 'Marketing', 'Sales', 'Finance', 'Operations', 'Data Science', 'Product Management'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-midnight mb-1.5">Job Type</label>
              <select value={form.type} onChange={e => update('type', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none cursor-pointer">
                <option value="full-time">Full-time</option><option value="part-time">Part-time</option><option value="internship">Internship</option><option value="contract">Contract</option><option value="freelance">Freelance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-midnight mb-1.5">Work Mode</label>
              <select value={form.workMode} onChange={e => update('workMode', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none cursor-pointer">
                <option value="remote">Remote</option><option value="onsite">On-site</option><option value="hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-midnight mb-1.5">Experience Level</label>
              <select value={form.experienceLevel} onChange={e => update('experienceLevel', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none cursor-pointer">
                <option value="entry">Entry Level</option><option value="mid">Mid Level</option><option value="senior">Senior</option><option value="lead">Lead</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-midnight mb-1.5">Location *</label>
              <input type="text" value={form.location} onChange={e => update('location', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-midnight mb-1.5">Vacancies</label>
              <input type="number" value={form.vacancies} onChange={e => update('vacancies', parseInt(e.target.value))} min={1} className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-light-slate/50 p-6 space-y-4">
          <h2 className="font-semibold text-midnight">Salary & Deadline</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-midnight mb-1.5">Min Salary</label>
              <input type="number" value={form.salaryMin} onChange={e => update('salaryMin', parseInt(e.target.value))} className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-midnight mb-1.5">Max Salary</label>
              <input type="number" value={form.salaryMax} onChange={e => update('salaryMax', parseInt(e.target.value))} className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-midnight mb-1.5">Salary Period</label>
              <select value={form.salaryPeriod} onChange={e => update('salaryPeriod', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none cursor-pointer">
                <option value="yearly">Per Year</option><option value="monthly">Per Month</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-midnight mb-1.5">Application Deadline *</label>
            <input type="date" value={form.applicationDeadline} onChange={e => update('applicationDeadline', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 text-sm font-medium rounded-lg border border-light-slate hover:bg-gray-50 transition-colors">Cancel</button>
          <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-colors text-sm">
            <PlusCircle className="w-4 h-4" /> Post Job
          </button>
        </div>
      </form>
    </div>
  );
}
