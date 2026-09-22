import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { Logo } from '../../components/common/Logo';
import { useToast } from '../../context/ToastContext';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
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
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-midnight mb-1.5">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-light-slate focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="you@example.com" required />
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
  const { addToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { addToast('error', 'Password too short', 'Min 6 characters.'); return; }
    if (password !== confirm) { addToast('error', 'Passwords do not match'); return; }
    setDone(true);
    addToast('success', 'Password reset!', 'You can now sign in with your new password.');
  };

  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block"><Logo size="lg" /></Link>
          <h1 className="mt-6 text-2xl font-bold text-midnight">Reset your password</h1>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-8 border border-light-slate/50">
          {done ? (
            <div className="text-center">
              <p className="text-success font-semibold mb-4">Password reset successfully!</p>
              <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover">Sign in</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-midnight mb-1.5">New Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-light-slate focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Min 6 characters" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-midnight mb-1.5">Confirm Password</label>
                <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-light-slate focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Repeat your password" required />
              </div>
              <button type="submit" className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-colors">Reset Password</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
