import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { Logo } from '../../components/common/Logo';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function RecruiterRegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', companyName: '', industry: '', position: '' });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { registerRecruiter } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const validate = (currentForm = form) => {
    const errors: Record<string, string> = {};
    if (!currentForm.name.trim()) errors.name = 'Full name is required';
    if (!currentForm.email.trim()) errors.email = 'Email address is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentForm.email)) errors.email = 'Please enter a valid email address';

    if (!currentForm.phone.trim()) errors.phone = 'Phone number is required';
    else if (currentForm.phone.replace(/[^0-9]/g, '').length < 10) errors.phone = 'Please enter a valid phone number (at least 10 digits)';

    if (!currentForm.companyName.trim()) errors.companyName = 'Company name is required';
    if (!currentForm.position.trim()) errors.position = 'Position is required';

    if (!currentForm.password) errors.password = 'Password is required';
    else if (currentForm.password.length < 6) errors.password = 'Password must be at least 6 characters';

    if (!currentForm.confirmPassword) errors.confirmPassword = 'Please confirm your password';
    else if (currentForm.password !== currentForm.confirmPassword) errors.confirmPassword = 'Passwords do not match';

    return errors;
  };

  const update = (key: string, value: string) => {
    const updated = { ...form, [key]: value };
    setForm(updated);
    if (fieldErrors[key]) {
      setFieldErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    const result = await registerRecruiter(form);
    setIsLoading(false);
    if (result.success) {
      addToast('success', 'Account created!', 'Welcome to getAjob.');
      navigate('/recruiter/home');
    } else setError(result.error || 'Registration failed.');
  };

  const getInputClass = (fieldName: string) =>
    `w-full px-4 py-3 rounded-lg border outline-none transition-all ${fieldErrors[fieldName]
      ? 'border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-500'
      : 'border-light-slate focus:ring-2 focus:ring-primary/20 focus:border-primary'
    }`;

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
              <input type="text" value={form.name} onChange={e => update('name', e.target.value)} className={getInputClass('name')} placeholder="Your full name" />
              {fieldErrors.name && <p className="mt-1 text-xs text-red-500 font-medium">{fieldErrors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-midnight mb-1.5">Email Address *</label>
              <input type="email" value={form.email} onChange={e => update('email', e.target.value)} className={getInputClass('email')} placeholder="you@company.com" />
              {fieldErrors.email && <p className="mt-1 text-xs text-red-500 font-medium">{fieldErrors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-midnight mb-1.5">Phone Number *</label>
              <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} className={getInputClass('phone')} placeholder="+91 9876543210" />
              {fieldErrors.phone && <p className="mt-1 text-xs text-red-500 font-medium">{fieldErrors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-midnight mb-1.5">Company Name *</label>
              <input type="text" value={form.companyName} onChange={e => update('companyName', e.target.value)} className={getInputClass('companyName')} placeholder="Acme Corporation" />
              {fieldErrors.companyName && <p className="mt-1 text-xs text-red-500 font-medium">{fieldErrors.companyName}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-midnight mb-1.5">Industry</label>
                <input type="text" value={form.industry} onChange={e => update('industry', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-light-slate focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="IT" />
              </div>
              <div>
                <label className="block text-sm font-medium text-midnight mb-1.5">Your Position *</label>
                <input type="text" value={form.position} onChange={e => update('position', e.target.value)} className={getInputClass('position')} placeholder="HR Manager" />
                {fieldErrors.position && <p className="mt-1 text-xs text-red-500 font-medium">{fieldErrors.position}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-midnight mb-1.5">Password *</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => update('password', e.target.value)} className={`${getInputClass('password')} pr-12`} placeholder="Min 6 characters" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-text hover:text-midnight">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {fieldErrors.password && <p className="mt-1 text-xs text-red-500 font-medium">{fieldErrors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-midnight mb-1.5">Confirm Password *</label>
              <input type="password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} className={getInputClass('confirmPassword')} placeholder="Repeat your password" />
              {fieldErrors.confirmPassword && <p className="mt-1 text-xs text-red-500 font-medium">{fieldErrors.confirmPassword}</p>}
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
