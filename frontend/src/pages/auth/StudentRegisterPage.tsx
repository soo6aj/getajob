import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { Logo } from '../../components/common/Logo';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const NAME_REGEX = /^[a-zA-Z\s.'-]+$/;
const PHONE_REGEX = /^[+]?[\d\s()-]{10,15}$/;
const PHONE_INPUT_REGEX = /^[+\d\s()-]*$/;

interface StudentFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  college: string;
  degree: string;
  graduationYear: number;
  [key: string]: string | number;
}

export function StudentRegisterPage() {
  const [form, setForm] = useState<StudentFormData>({ name: '', email: '', phone: '', password: '', confirmPassword: '', college: '', degree: '', graduationYear: new Date().getFullYear() + 1 });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { registerStudent } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const validateField = (field: string, value: string | number, currentForm = form): string => {
    const strValue = String(value);
    switch (field) {
      case 'name':
        if (!strValue.trim()) return 'Full name is required';
        if (strValue.trim().length < 2) return 'Name must be at least 2 characters';
        if (!NAME_REGEX.test(strValue.trim())) return 'Name can only contain letters, spaces, hyphens, apostrophes, and dots';
        return '';
      case 'email':
        if (!strValue.trim()) return 'Email address is required';
        if (!EMAIL_REGEX.test(strValue.trim())) return 'Please enter a valid email address';
        return '';
      case 'phone':
        if (!strValue.trim()) return 'Phone number is required';
        if (!PHONE_REGEX.test(strValue.trim())) return 'Please enter a valid phone number (10-15 digits)';
        {
          const digitsOnly = strValue.replace(/[^0-9]/g, '');
          if (digitsOnly.length < 10) return 'Phone number must have at least 10 digits';
          if (digitsOnly.length > 15) return 'Phone number must not exceed 15 digits';
        }
        return '';
      case 'college':
        if (!strValue.trim()) return 'College name is required';
        if (strValue.trim().length < 2) return 'College name must be at least 2 characters';
        return '';
      case 'degree':
        if (!strValue.trim()) return 'Degree is required';
        if (strValue.trim().length < 2) return 'Degree must be at least 2 characters';
        return '';
      case 'graduationYear': {
        const year = typeof value === 'number' ? value : parseInt(strValue);
        if (isNaN(year)) return 'Please enter a valid year';
        if (year < 2000 || year > 2035) return 'Graduation year must be between 2000 and 2035';
        return '';
      }
      case 'password':
        if (!strValue) return 'Password is required';
        if (strValue.length < 8) return 'Password must be at least 8 characters';
        if (!/[A-Z]/.test(strValue)) return 'Password must contain at least one uppercase letter';
        if (!/[a-z]/.test(strValue)) return 'Password must contain at least one lowercase letter';
        if (!/[0-9]/.test(strValue)) return 'Password must contain at least one number';
        if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(strValue)) return 'Password must contain at least one special character';
        return '';
      case 'confirmPassword':
        if (!strValue) return 'Please confirm your password';
        if (strValue !== currentForm.password) return 'Passwords do not match';
        return '';
      default:
        return '';
    }
  };

  const validateAll = (): Record<string, string> => {
    const errors: Record<string, string> = {};
    const fields = ['name', 'email', 'phone', 'college', 'degree', 'graduationYear', 'password', 'confirmPassword'] as const;
    for (const field of fields) {
      const error = validateField(field, form[field], form);
      if (error) errors[field] = error;
    }
    return errors;
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, form[field] as string | number, form);
    setFieldErrors(prev => ({ ...prev, [field]: error }));
  };

  const update = (key: string, value: string | number) => {
    // Block non-phone characters from phone input
    if (key === 'phone' && typeof value === 'string' && !PHONE_INPUT_REGEX.test(value)) {
      return;
    }

    const updated = { ...form, [key]: value };
    setForm(updated);

    if (touched[key]) {
      const error = validateField(key, value, updated);
      setFieldErrors(prev => ({ ...prev, [key]: error }));
    }

    // Re-validate confirmPassword when password changes
    if (key === 'password' && touched.confirmPassword) {
      const confirmError = validateField('confirmPassword', updated.confirmPassword, updated);
      setFieldErrors(prev => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    ['name', 'email', 'phone', 'college', 'degree', 'graduationYear', 'password', 'confirmPassword'].forEach(f => allTouched[f] = true);
    setTouched(allTouched);

    const validationErrors = validateAll();
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    setFieldErrors({});
    setIsLoading(true);
    const result = await registerStudent({
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      college: form.college.trim(),
      degree: form.degree.trim(),
    });
    setIsLoading(false);
    if (result.success) {
      addToast('success', 'Account created!', 'Welcome to getAjob.');
      navigate('/student/home');
    } else setError(result.error || 'Registration failed.');
  };

  const getInputClass = (fieldName: string) =>
    `w-full px-4 py-3 rounded-lg border outline-none transition-all ${fieldErrors[fieldName] && touched[fieldName]
      ? 'border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-500'
      : 'border-light-slate focus:ring-2 focus:ring-primary/20 focus:border-primary'
    }`;

  const getPasswordStrength = (): { label: string; color: string; width: string } => {
    const p = form.password;
    if (!p) return { label: '', color: '', width: '0%' };
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[a-z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(p)) score++;

    if (score <= 2) return { label: 'Weak', color: 'bg-red-500', width: '33%' };
    if (score <= 3) return { label: 'Fair', color: 'bg-yellow-500', width: '50%' };
    if (score <= 4) return { label: 'Good', color: 'bg-blue-500', width: '75%' };
    return { label: 'Strong', color: 'bg-green-500', width: '100%' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block"><Logo size="lg" /></Link>
          <h1 className="mt-6 text-2xl font-bold text-midnight">Create Student Account</h1>
          <p className="mt-2 text-slate-text">Start your career journey today</p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-8 border border-light-slate/50">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

            <div>
              <label className="block text-sm font-medium text-midnight mb-1.5">Full Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => {
                  // Only allow letters, spaces, dots, hyphens, apostrophes
                  const val = e.target.value;
                  if (val === '' || /^[a-zA-Z\s.'-]*$/.test(val)) {
                    update('name', val);
                  }
                }}
                onBlur={() => handleBlur('name')}
                className={getInputClass('name')}
                placeholder="Enter your full name"
                autoComplete="name"
              />
              {fieldErrors.name && touched.name && <p className="mt-1 text-xs text-red-500 font-medium">{fieldErrors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-midnight mb-1.5">Email Address *</label>
              <input
                type="email"
                value={form.email}
                onChange={e => update('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                className={getInputClass('email')}
                placeholder="Enter your email address"
                autoComplete="email"
              />
              {fieldErrors.email && touched.email && <p className="mt-1 text-xs text-red-500 font-medium">{fieldErrors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-midnight mb-1.5">Phone Number *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => update('phone', e.target.value)}
                onBlur={() => handleBlur('phone')}
                className={getInputClass('phone')}
                placeholder="Enter your phone number"
                autoComplete="tel"
              />
              {fieldErrors.phone && touched.phone && <p className="mt-1 text-xs text-red-500 font-medium">{fieldErrors.phone}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-midnight mb-1.5">College *</label>
                <input
                  type="text"
                  value={form.college}
                  onChange={e => update('college', e.target.value)}
                  onBlur={() => handleBlur('college')}
                  className={getInputClass('college')}
                  placeholder="Your college name"
                  autoComplete="organization"
                />
                {fieldErrors.college && touched.college && <p className="mt-1 text-xs text-red-500 font-medium">{fieldErrors.college}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-midnight mb-1.5">Degree *</label>
                <input
                  type="text"
                  value={form.degree}
                  onChange={e => update('degree', e.target.value)}
                  onBlur={() => handleBlur('degree')}
                  className={getInputClass('degree')}
                  placeholder="Your degree program"
                />
                {fieldErrors.degree && touched.degree && <p className="mt-1 text-xs text-red-500 font-medium">{fieldErrors.degree}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-midnight mb-1.5">Graduation Year</label>
              <input
                type="number"
                value={form.graduationYear}
                onChange={e => update('graduationYear', parseInt(e.target.value) || 0)}
                onBlur={() => handleBlur('graduationYear')}
                className={getInputClass('graduationYear')}
                min={2000}
                max={2035}
              />
              {fieldErrors.graduationYear && touched.graduationYear && <p className="mt-1 text-xs text-red-500 font-medium">{fieldErrors.graduationYear}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-midnight mb-1.5">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => update('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  className={`${getInputClass('password')} pr-12`}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-text hover:text-midnight">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full ${passwordStrength.color} rounded-full transition-all duration-300`} style={{ width: passwordStrength.width }} />
                    </div>
                    <span className="text-xs font-medium text-slate-text">{passwordStrength.label}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-text">Use 8+ chars with uppercase, lowercase, number & special character</p>
                </div>
              )}
              {fieldErrors.password && touched.password && <p className="mt-1 text-xs text-red-500 font-medium">{fieldErrors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-midnight mb-1.5">Confirm Password *</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={e => update('confirmPassword', e.target.value)}
                  onBlur={() => handleBlur('confirmPassword')}
                  className={`${getInputClass('confirmPassword')} pr-12`}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-text hover:text-midnight">
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {fieldErrors.confirmPassword && touched.confirmPassword && <p className="mt-1 text-xs text-red-500 font-medium">{fieldErrors.confirmPassword}</p>}
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
