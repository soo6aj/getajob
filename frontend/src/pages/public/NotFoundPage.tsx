import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Logo } from '../../components/common/Logo';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center p-4">
      <div className="text-center">
        <Link to="/" className="inline-block mb-8"><Logo size="lg" /></Link>
        <h1 className="text-8xl font-extrabold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-bold text-midnight mb-3">Page not found</h2>
        <p className="text-slate-text mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button onClick={() => window.history.back()} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-midnight font-semibold rounded-lg border border-light-slate hover:bg-gray-50 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-colors">
            <Home className="w-4 h-4" /> Home Page
          </Link>
        </div>
      </div>
    </div>
  );
}
