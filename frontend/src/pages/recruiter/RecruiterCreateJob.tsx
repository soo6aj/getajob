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
    educationQualification: "Bachelor's Degree",
    location: company?.location || '', salaryMin: 400000, salaryMax: 1200000,
    salaryCurrency: 'INR', salaryPeriod: 'yearly' as const,
    vacancies: 1, applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    perks: {
      healthInsurance: true,
      flexibleHours: true,
      relocationAllowance: false,
      paidTimeOff: true,
    }
  });
  const [error, setError] = useState('');

  const update = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));
  const togglePerk = (perkKey: keyof typeof form.perks) => {
    setForm(prev => ({
      ...prev,
      perks: { ...prev.perks, [perkKey]: !prev.perks[perkKey] }
    }));
  };

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
          <h2 className="font-semibold text-midnight text-lg">Job Details & Textareas</h2>
          <div>
            <label className="block text-sm font-medium text-midnight mb-1.5">Job Title *</label>
            <input type="text" value={form.title} onChange={e => update('title', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="e.g., Senior Frontend Engineer" />
          </div>
          <div>
            <label className="block text-sm font-medium text-midnight mb-1.5">Job Description * (&lt;textarea&gt;)</label>
            <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={4} className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" placeholder="Describe the role..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-midnight mb-1.5">Responsibilities (one per line, &lt;textarea&gt;)</label>
            <textarea value={form.responsibilities} onChange={e => update('responsibilities', e.target.value)} rows={3} className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" placeholder="Build scalable UI components..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-midnight mb-1.5">Requirements (one per line, &lt;textarea&gt;)</label>
            <textarea value={form.requirements} onChange={e => update('requirements', e.target.value)} rows={3} className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" placeholder="3+ years of React experience..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-midnight mb-1.5">Skills (comma-separated)</label>
            <input type="text" value={form.skills} onChange={e => update('skills', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="React, TypeScript, Node.js" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-light-slate/50 p-6 space-y-5">
          <h2 className="font-semibold text-midnight text-lg">Dropdowns & Radio Controls</h2>

          {/* Dropdown (<select>) Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-midnight mb-1.5">Category (&lt;select&gt;)</label>
              <select value={form.category} onChange={e => update('category', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer">
                {['Engineering', 'Design', 'Marketing', 'Sales', 'Finance', 'Operations', 'Data Science', 'Product Management'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-midnight mb-1.5">Job Type (&lt;select&gt;)</label>
              <select value={form.type} onChange={e => update('type', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer">
                <option value="full-time">Full-Time</option>
                <option value="part-time">Part-Time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-midnight mb-1.5">Required Experience (&lt;select&gt;)</label>
              <select value={form.experienceLevel} onChange={e => update('experienceLevel', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer">
                <option value="entry">Entry Level (0-2 yrs)</option>
                <option value="mid">Mid Level (2-5 yrs)</option>
                <option value="senior">Senior Level (5+ yrs)</option>
                <option value="lead">Lead / Principal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-midnight mb-1.5">Education Qualification (&lt;select&gt;)</label>
              <select value={form.educationQualification} onChange={e => update('educationQualification', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer">
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Master's Degree">Master's Degree</option>
                <option value="Doctorate / PhD">Doctorate / PhD</option>
                <option value="Diploma / Associate">Diploma / Associate</option>
                <option value="Any Qualification">Any Qualification</option>
              </select>
            </div>
          </div>

          {/* Radio Buttons (Workplace Type) */}
          <div>
            <label className="block text-sm font-medium text-midnight mb-2">Workplace Type (Radio Buttons)</label>
            <div className="flex flex-wrap items-center gap-6 p-4 bg-gray-50 rounded-xl border border-light-slate/50">
              {[
                { value: 'remote', label: 'Remote', desc: 'Work from anywhere' },
                { value: 'hybrid', label: 'Hybrid', desc: 'Mix of office & home' },
                { value: 'onsite', label: 'On-site', desc: 'Work at company office' }
              ].map(item => (
                <label key={item.value} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="recruiterWorkMode"
                    value={item.value}
                    checked={form.workMode === item.value}
                    onChange={e => update('workMode', e.target.value)}
                    className="w-4 h-4 text-primary focus:ring-primary accent-primary cursor-pointer"
                  />
                  <div>
                    <span className="text-sm font-semibold text-midnight">{item.label}</span>
                    <span className="block text-xs text-slate-text">{item.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Checkboxes (Perks & Benefits) */}
          <div>
            <label className="block text-sm font-medium text-midnight mb-2">Perks & Benefits (Checkboxes)</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { key: 'healthInsurance', label: 'Health Insurance' },
                { key: 'flexibleHours', label: 'Flexible Hours' },
                { key: 'relocationAllowance', label: 'Relocation Allowance' },
                { key: 'paidTimeOff', label: 'Paid Time Off' },
              ].map(perk => (
                <label key={perk.key} className="flex items-center gap-2 p-3 bg-white rounded-lg border border-light-slate cursor-pointer hover:border-primary/50 transition-all">
                  <input
                    type="checkbox"
                    checked={form.perks[perk.key as keyof typeof form.perks]}
                    onChange={() => togglePerk(perk.key as keyof typeof form.perks)}
                    className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                  />
                  <span className="text-xs font-medium text-midnight">{perk.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-sm font-medium text-midnight mb-1.5">Location *</label>
              <input type="text" value={form.location} onChange={e => update('location', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="e.g. Bangalore, India" />
            </div>
            <div>
              <label className="block text-sm font-medium text-midnight mb-1.5">Vacancies</label>
              <input type="number" value={form.vacancies} onChange={e => update('vacancies', parseInt(e.target.value))} min={1} className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
          </div>
        </div>

        {/* Salary Range Slider & Date Picker Section */}
        <div className="bg-white rounded-xl border border-light-slate/50 p-6 space-y-4">
          <h2 className="font-semibold text-midnight text-lg">Range Sliders & Date Picker</h2>

          {/* Range Slider for Salary */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-light-slate/50">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-semibold text-midnight">Salary Range Slider</label>
              <span className="text-xs font-bold text-primary bg-primary-50 px-2.5 py-1 rounded-md">
                ₹{(form.salaryMin / 100000).toFixed(1)}L - ₹{(form.salaryMax / 100000).toFixed(1)}L / year
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-text mb-1">
                <span>Minimum Salary: ₹{form.salaryMin.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="100000"
                max="3000000"
                step="50000"
                value={form.salaryMin}
                onChange={e => update('salaryMin', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-text mb-1">
                <span>Maximum Salary: ₹{form.salaryMax.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="200000"
                max="5000000"
                step="50000"
                value={form.salaryMax}
                onChange={e => update('salaryMax', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>

          {/* Date Picker (type="date") */}
          <div>
            <label className="block text-sm font-medium text-midnight mb-1.5">Application Deadline * (&lt;input type="date"&gt;)</label>
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
