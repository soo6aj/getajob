import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Logo } from '../../components/common/Logo';
import { useToast } from '../../context/ToastContext';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [touched, setTouched] = useState(false);
  const { addToast } = useToast();

  const validateEmail = (value: string): string => {
    if (!value.trim()) return 'Email address is required';
    if (!EMAIL_REGEX.test(value.trim())) return 'Please enter a valid email address';
    return '';
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (touched) {
      setEmailError(validateEmail(value));
    }
  };

  const handleBlur = () => {
    setTouched(true);
    setEmailError(validateEmail(email));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      return;
    }

    setEmailError('');
    setSent(true);
    addToast('success', 'Reset link sent!', 'Check your email for the password reset link.');
  };

  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block"><Logo size="lg" /></Link>
          <h1 className="mt-6 text-2xl font-bold text-midnight">Forgot your password?</h1>
          <p className="mt-2 text-slate-text">Enter your email and we'll send you a reset link</p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-8 border border-light-slate/50">
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-lg font-semibold text-midnight mb-2">Check your email</h3>
              <p className="text-sm text-slate-text mb-6">We've sent a password reset link to <strong>{email}</strong></p>
              <Link to="/login" className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary-hover">
                <ArrowLeft className="w-4 h-4" /> Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label className="block text-sm font-medium text-midnight mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => handleEmailChange(e.target.value)}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 rounded-lg border outline-none transition-all ${emailError && touched
                    ? 'border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-500'
                    : 'border-light-slate focus:ring-2 focus:ring-primary/20 focus:border-primary'
                  }`}
                  placeholder="Enter your email address"
                  autoComplete="email"
                />
                {emailError && touched && <p className="mt-1 text-xs text-red-500 font-medium">{emailError}</p>}
              </div>
              <button type="submit" className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-colors">Send Reset Link</button>
            </form>
          )}
        </div>
        <p className="mt-6 text-center text-sm text-slate-text">
          <Link to="/login" className="text-primary font-semibold hover:text-primary-hover">← Back to login</Link>
        </p>
      </div>
    </div>
  );
}

export function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [done, setDone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const { addToast } = useToast();

  const validateField = (field: string, value: string, currentPassword = password): string => {
    switch (field) {
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
        if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter';
        if (!/[0-9]/.test(value)) return 'Password must contain at least one number';
        if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) return 'Password must contain at least one special character';
        return '';
      case 'confirm':
        if (!value) return 'Please confirm your password';
        if (value !== currentPassword) return 'Passwords do not match';
        return '';
      default:
        return '';
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, field === 'password' ? password : confirm);
    setFieldErrors(prev => ({ ...prev, [field]: error }));
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (touched.password) {
      const error = validateField('password', value);
      setFieldErrors(prev => ({ ...prev, password: error }));
    }
    // Re-validate confirm when password changes
    if (touched.confirm && confirm) {
      const confirmError = confirm !== value ? 'Passwords do not match' : '';
      setFieldErrors(prev => ({ ...prev, confirm: confirmError }));
    }
  };

  const handleConfirmChange = (value: string) => {
    setConfirm(value);
    if (touched.confirm) {
      const error = validateField('confirm', value, password);
      setFieldErrors(prev => ({ ...prev, confirm: error }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ password: true, confirm: true });

    const errors: Record<string, string> = {};
    const passwordError = validateField('password', password);
    const confirmError = validateField('confirm', confirm, password);
    if (passwordError) errors.password = passwordError;
    if (confirmError) errors.confirm = confirmError;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setDone(true);
    addToast('success', 'Password reset!', 'You can now sign in with your new password.');
  };

  const getPasswordStrength = (): { label: string; color: string; width: string } => {
    if (!password) return { label: '', color: '', width: '0%' };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) score++;

    if (score <= 2) return { label: 'Weak', color: 'bg-red-500', width: '33%' };
    if (score <= 3) return { label: 'Fair', color: 'bg-yellow-500', width: '50%' };
    if (score <= 4) return { label: 'Good', color: 'bg-blue-500', width: '75%' };
    return { label: 'Strong', color: 'bg-green-500', width: '100%' };
  };

  const passwordStrength = getPasswordStrength();

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
          <h1 className="mt-6 text-2xl font-bold text-midnight">Reset your password</h1>
          <p className="mt-2 text-slate-text">Choose a strong password for your account</p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-8 border border-light-slate/50">
          {done ? (
            <div className="text-center">
              <p className="text-success font-semibold mb-4">Password reset successfully!</p>
              <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover">Sign in</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label className="block text-sm font-medium text-midnight mb-1.5">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => handlePasswordChange(e.target.value)}
                    onBlur={() => handleBlur('password')}
                    className={`${getInputClass('password')} pr-12`}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-text hover:text-midnight">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {password && (
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
                <label className="block text-sm font-medium text-midnight mb-1.5">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirm}
                    onChange={e => handleConfirmChange(e.target.value)}
                    onBlur={() => handleBlur('confirm')}
                    className={`${getInputClass('confirm')} pr-12`}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-text hover:text-midnight">
                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {fieldErrors.confirm && touched.confirm && <p className="mt-1 text-xs text-red-500 font-medium">{fieldErrors.confirm}</p>}
              </div>
              <button type="submit" className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-colors">Reset Password</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
