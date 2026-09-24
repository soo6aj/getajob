import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { Logo } from '../../components/common/Logo';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'email':
        if (!value.trim()) return 'Email address is required';
        if (!EMAIL_REGEX.test(value.trim())) return 'Please enter a valid email address';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return '';
      default:
        return '';
    }
  };

  const validateAll = (): Record<string, string> => {
    const errors: Record<string, string> = {};
    const emailError = validateField('email', email);
    const passwordError = validateField('password', password);
    if (emailError) errors.email = emailError;
    if (passwordError) errors.password = passwordError;
    return errors;
  };

  const handleBlur = (field: string, value: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, value);
    setFieldErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (touched.email) {
      const error = validateField('email', value);
      setFieldErrors(prev => ({ ...prev, email: error }));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (touched.password) {
      const error = validateField('password', value);
      setFieldErrors(prev => ({ ...prev, password: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationErrors = validateAll();
    setTouched({ email: true, password: true });

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    setFieldErrors({});
    setIsLoading(true);
    const result = await login({ email: email.trim(), password });
    setIsLoading(false);
    if (result.success) {
      addToast('success', 'Welcome back!', 'You have been logged in successfully.');
      if (email === 'admin@demo.com') navigate('/admin/home');
      else if (email === 'recruiter@demo.com' || email.includes('recruiter') || email.includes('techcorp')) navigate('/recruiter/home');
      else navigate('/student/home');
    } else {
      setError(result.error || 'Login failed.');
    }
  };

  const demoLogin = async (email: string) => {
    setIsLoading(true);
    const result = await login({ email, password: 'demo123' });
    setIsLoading(false);
    if (result.success) {
      addToast('success', 'Demo login successful!');
      if (email === 'admin@demo.com') navigate('/admin/home');
      else if (email === 'recruiter@demo.com') navigate('/recruiter/home');
      else navigate('/student/home');
    } else {
      setError(result.error || 'Login failed.');
    }
  };

  const getInputClass = (fieldName: string) =>
    `w-full px-4 py-3 rounded-lg border outline-none transition-all ${fieldErrors[fieldName] && touched[fieldName]
      ? 'border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-500'
      : 'border-light-slate focus:ring-2 focus:ring-primary/20 focus:border-primary'
    }`;

  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block"><Logo size="lg" /></Link>
          <h1 className="mt-6 text-2xl font-bold text-midnight">Welcome back</h1>
          <p className="mt-2 text-slate-text">Sign in to your account to continue</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-8 border border-light-slate/50">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
            )}
            <div>
              <label className="block text-sm font-medium text-midnight mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => handleEmailChange(e.target.value)}
                onBlur={() => handleBlur('email', email)}
                className={getInputClass('email')}
                placeholder="Enter your email address"
                autoComplete="email"
              />
              {fieldErrors.email && touched.email && <p className="mt-1 text-xs text-red-500 font-medium">{fieldErrors.email}</p>}
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-midnight">Password</label>
                <Link to="/forgot-password" className="text-xs text-primary hover:text-primary-hover font-medium">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => handlePasswordChange(e.target.value)}
                  onBlur={() => handleBlur('password', password)}
                  className={`${getInputClass('password')} pr-12`}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-text hover:text-midnight">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {fieldErrors.password && touched.password && <p className="mt-1 text-xs text-red-500 font-medium">{fieldErrors.password}</p>}
            </div>
            <button
              type="submit" disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <LogIn className="w-5 h-5" />}
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-light-slate">
            <p className="text-xs text-slate-text text-center mb-3">Quick demo login</p>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => demoLogin('student@demo.com')} className="px-3 py-2 text-xs font-medium bg-primary-50 text-primary rounded-lg hover:bg-primary-100 transition-colors">Student</button>
              <button onClick={() => demoLogin('recruiter@demo.com')} className="px-3 py-2 text-xs font-medium bg-purple-50 text-secondary rounded-lg hover:bg-purple-100 transition-colors">Recruiter</button>
              <button onClick={() => demoLogin('admin@demo.com')} className="px-3 py-2 text-xs font-medium bg-gray-100 text-midnight rounded-lg hover:bg-gray-200 transition-colors">Admin</button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-text">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-semibold hover:text-primary-hover">Create Account</Link>
        </p>
      </div>
    </div>
  );
}
