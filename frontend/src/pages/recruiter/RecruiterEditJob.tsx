import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Trash2 } from 'lucide-react';
import { jobService } from '../../services/jobService';
import { useToast } from '../../context/ToastContext';

export function RecruiterEditJob() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '',
    description: '',
    responsibilities: '',
    requirements: '',
    skills: '',
    category: 'Engineering',
    type: 'full-time' as const,
    workMode: 'hybrid' as const,
    experienceLevel: 'entry' as const,
    location: '',
    salaryMin: 0,
    salaryMax: 0,
    salaryCurrency: 'INR',
    salaryPeriod: 'yearly' as 'yearly' | 'monthly' | 'hourly',
    vacancies: 1,
    applicationDeadline: '',
    status: 'active' as const,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      const job = jobService.getById(id);
      if (job) {
        setForm({
          title: job.title,
          description: job.description,
          responsibilities: job.responsibilities.join('\n'),
          requirements: job.requirements.join('\n'),
          skills: job.skills.join(', '),
          category: job.category,
          type: job.type as any,
          workMode: job.workMode as any,
          experienceLevel: job.experienceLevel as any,
          location: job.location,
          salaryMin: job.salaryMin || 0,
          salaryMax: job.salaryMax || 0,
          salaryCurrency: job.salaryCurrency || 'INR',
          salaryPeriod: job.salaryPeriod || 'yearly',
          vacancies: job.vacancies || 1,
          applicationDeadline: job.applicationDeadline || '',
          status: job.status as any,
        });
      } else {
        setError('Job not found.');
      }
    }
    setLoading(false);
  }, [id]);

  const update = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (!form.title || !form.description || !form.location || !form.applicationDeadline) {
      setError('Please fill in all required fields.');
      return;
    }

    jobService.update(id, {
      title: form.title,
      description: form.description,
      responsibilities: form.responsibilities.split('\n').filter(Boolean),
      requirements: form.requirements.split('\n').filter(Boolean),
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      category: form.category,
      type: form.type,
      workMode: form.workMode,
      experienceLevel: form.experienceLevel,
      location: form.location,
      salaryMin: Number(form.salaryMin),
      salaryMax: Number(form.salaryMax),
      salaryCurrency: form.salaryCurrency,
      salaryPeriod: form.salaryPeriod,
      vacancies: Number(form.vacancies),
      applicationDeadline: form.applicationDeadline,
      status: form.status,
    });

    addToast('success', 'Job updated!', 'Your changes have been saved.');
    navigate('/recruiter/jobs');
  };

  const handleDelete = () => {
    if (!id) return;
    if (confirm('Are you sure you want to delete this job posting? This cannot be undone.')) {
      jobService.delete(id);
      addToast('success', 'Job deleted', 'The job posting was removed.');
      navigate('/recruiter/jobs');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error && !form.title) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <h2 className="text-xl font-bold text-midnight mb-2">{error}</h2>
        <button onClick={() => navigate('/recruiter/jobs')} className="text-primary hover:underline text-sm font-medium">
          Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-slate-text hover:text-midnight font-medium">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button onClick={handleDelete} className="inline-flex items-center gap-1.5 text-sm text-error hover:bg-red-50 px-3 py-1.5 rounded-lg border border-red-200 transition-colors">
          <Trash2 className="w-4 h-4" /> Delete Job
        </button>
      </div>

      <h1 className="text-2xl font-bold text-midnight">Edit Job Posting</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

        <div className="bg-white rounded-xl border border-light-slate/50 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-midnight">Job Details</h2>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-slate-text">Status:</label>
              <select
                value={form.status}
                onChange={e => update('status', e.target.value)}
                className="text-xs px-2.5 py-1 rounded border border-light-slate bg-gray-50 font-medium"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-midnight mb-1.5">Job Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => update('title', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-midnight mb-1.5">Description *</label>
            <textarea
              value={form.description}
              onChange={e => update('description', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-midnight mb-1.5">Responsibilities (one per line)</label>
            <textarea
              value={form.responsibilities}
              onChange={e => update('responsibilities', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-midnight mb-1.5">Requirements (one per line)</label>
            <textarea
              value={form.requirements}
              onChange={e => update('requirements', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-midnight mb-1.5">Skills (comma-separated)</label>
            <input
              type="text"
              value={form.skills}
              onChange={e => update('skills', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
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
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-midnight mb-1.5">Work Mode</label>
              <select value={form.workMode} onChange={e => update('workMode', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none cursor-pointer">
                <option value="remote">Remote</option>
                <option value="onsite">On-site</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-midnight mb-1.5">Experience Level</label>
              <select value={form.experienceLevel} onChange={e => update('experienceLevel', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none cursor-pointer">
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead</option>
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
              <input type="number" value={form.salaryMin} onChange={e => update('salaryMin', parseInt(e.target.value) || 0)} className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-midnight mb-1.5">Max Salary</label>
              <input type="number" value={form.salaryMax} onChange={e => update('salaryMax', parseInt(e.target.value) || 0)} className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-midnight mb-1.5">Salary Period</label>
              <select value={form.salaryPeriod} onChange={e => update('salaryPeriod', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none cursor-pointer">
                <option value="yearly">Per Year</option>
                <option value="monthly">Per Month</option>
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
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
