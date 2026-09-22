import { useState } from 'react';
import { Building2, Save, Globe, Mail, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { mockCompanies } from '../../data/mockCompanies';
import type { RecruiterProfile } from '../../types';

export function RecruiterCompany() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const recruiter = user as RecruiterProfile;
  const company = mockCompanies.find(c => c.id === recruiter.companyId) || mockCompanies[0];
  const [form, setForm] = useState({ name: company.name, about: company.about, industry: company.industry, size: company.size, location: company.location, website: company.website || '', email: company.email || '', phone: company.phone || '' });
  const update = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));
  const handleSave = () => addToast('success', 'Company profile updated!');

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-midnight">Company Profile</h1>

      <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center"><Building2 className="w-8 h-8" /></div>
          <div><h2 className="text-xl font-bold">{form.name}</h2><p className="text-white/80">{form.industry} • {form.size} employees</p></div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-light-slate/50 p-6 space-y-4">
        <h2 className="font-semibold text-midnight">Company Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-midnight mb-1.5">Company Name</label>
            <input type="text" value={form.name} onChange={e => update('name', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-midnight mb-1.5">Industry</label>
            <input type="text" value={form.industry} onChange={e => update('industry', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-midnight mb-1.5">Company Size</label>
            <input type="text" value={form.size} onChange={e => update('size', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-midnight mb-1.5">Location</label>
            <input type="text" value={form.location} onChange={e => update('location', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-midnight mb-1.5">About</label>
          <textarea value={form.about} onChange={e => update('about', e.target.value)} rows={4} className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-light-slate/50 p-6 space-y-4">
        <h2 className="font-semibold text-midnight">Contact Information</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3"><Globe className="w-5 h-5 text-slate-text shrink-0" /><input type="url" value={form.website} onChange={e => update('website', e.target.value)} className="flex-1 px-4 py-2.5 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" placeholder="Website URL" /></div>
          <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-slate-text shrink-0" /><input type="email" value={form.email} onChange={e => update('email', e.target.value)} className="flex-1 px-4 py-2.5 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" placeholder="Contact email" /></div>
          <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-slate-text shrink-0" /><input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} className="flex-1 px-4 py-2.5 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" placeholder="Contact phone" /></div>
        </div>
      </div>

      <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-colors">
        <Save className="w-5 h-5" /> Save Changes
      </button>
    </div>
  );
}
