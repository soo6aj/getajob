import { Link } from 'react-router-dom';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="bg-midnight text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="bg-white rounded-lg p-2 w-fit mb-4">
              <Logo size="sm" />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Connecting talented students and job seekers with the right opportunities. Your career journey starts here.
            </p>
          </div>

          {/* For Job Seekers */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">For Job Seekers</h4>
            <ul className="space-y-2.5">
              <li><Link to="/register/student" className="text-sm text-gray-400 hover:text-white transition-colors">Create Account</Link></li>
              <li><Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors">Browse Jobs</Link></li>
              <li><Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors">My Applications</Link></li>
            </ul>
          </div>

          {/* For Recruiters */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">For Recruiters</h4>
            <ul className="space-y-2.5">
              <li><Link to="/register/recruiter" className="text-sm text-gray-400 hover:text-white transition-colors">Post a Job</Link></li>
              <li><Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors">Find Talent</Link></li>
              <li><Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors">Company Profile</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-2.5">
              <li><Link to="/#how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">About</Link></li>
              <li><a href="mailto:support@getajob.com" className="text-sm text-gray-400 hover:text-white transition-colors">Contact</a></li>
              <li><Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} getAjob. All rights reserved.
          </p>
          <p className="text-sm text-gray-500">
            Opportunities for a brighter tomorrow.
          </p>
        </div>
      </div>
    </footer>
  );
}
