import { Link } from 'react-router-dom';
import { GraduationCap, Building2 } from 'lucide-react';
import { Logo } from '../../components/common/Logo';

export function RegisterPage() {
  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block"><Logo size="lg" /></Link>
          <h1 className="mt-6 text-2xl font-bold text-midnight">Create your account</h1>
          <p className="mt-2 text-slate-text">Choose how you want to use getAjob</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/register/student"
            className="bg-white rounded-2xl shadow-card p-8 border border-light-slate/50 hover:shadow-card-hover hover:border-primary/30 transition-all group text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary group-hover:scale-110 transition-all">
              <GraduationCap className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-lg font-bold text-midnight mb-2">I'm a Job Seeker</h2>
            <p className="text-sm text-slate-text">Find jobs, internships, and build your career</p>
          </Link>

          <Link
            to="/register/recruiter"
            className="bg-white rounded-2xl shadow-card p-8 border border-light-slate/50 hover:shadow-card-hover hover:border-secondary/30 transition-all group text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-5 group-hover:bg-secondary group-hover:scale-110 transition-all">
              <Building2 className="w-8 h-8 text-secondary group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-lg font-bold text-midnight mb-2">I'm a Recruiter</h2>
            <p className="text-sm text-slate-text">Post jobs, find talent, and grow your team</p>
          </Link>
        </div>

        <p className="mt-6 text-center text-sm text-slate-text">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:text-primary-hover">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
