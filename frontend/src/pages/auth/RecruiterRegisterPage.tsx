import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { Logo } from '../../components/common/Logo';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function RecruiterRegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', companyName: '', industry: '', position: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { registerRecruiter } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const update = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password || !form.companyName || !form.position) {
      setError('Please fill in all required fields.'); return;
    }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    setIsLoading(true);
    const result = await registerRecruiter(form);
    setIsLoading(false);
    if (result.success) {
      addToast('success', 'Account created!', 'Welcome to getAjob.');
      navigate('/recruiter/home');
    } else setError(result.error || 'Registration failed.');
  };

  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block"><Logo size="lg" /></Link>
          <h1 className="mt-6 text-2xl font-bold text-midnight">Create Recruiter Account</h1>
          <p className="mt-2 text-slate-text">Start hiring the best talent</p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-8 border border-light-slate/50">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-midnight mb-1.5">Full Name *</label>
              <input type="text" value={form.name} onChange={e => update('name', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-light-slate focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Your full name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-midnight mb-1.5">Email Address *</label>
              <input type="email" value={form.email} onChange={e => update('email', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-light-slate focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="you@company.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-midnight mb-1.5">Company Name *</label>
              <input type="text" value={form.companyName} onChange={e => update('companyName', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-light-slate focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Acme Corporation" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-midnight mb-1.5">Industry</label>
                <input type="text" value={form.industry} onChange={e => update('industry', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-light-slate focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="IT" />
              </div>
              <div>
                <label className="block text-sm font-medium text-midnight mb-1.5">Your Position *</label>
                <input type="text" value={form.position} onChange={e => update('position', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-light-slate focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="HR Manager" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-midnight mb-1.5">Password *</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => update('password', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-light-slate focus:ring-2 focus:ring-primary/20 focus:border-primary pr-12 outline-none transition-all" placeholder="Min 6 characters" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-text hover:text-midnight">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-midnight mb-1.5">Confirm Password *</label>
              <input type="password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-light-slate focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Repeat your password" />
            </div>
            <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover disabled:opacity-50 transition-colors mt-2">
              {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <UserPlus className="w-5 h-5" />}
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>
        <p className="mt-6 text-center text-sm text-slate-text">Already have an account? <Link to="/login" className="text-primary font-semibold hover:text-primary-hover">Sign in</Link></p>
      </div>
    </div>
  );
}
