import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Logo } from './Logo';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'For Job Seekers', href: '/register/student' },
  { label: 'For Recruiters', href: '/register/recruiter' },
  { label: 'About', href: '/#how-it-works' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleAboutClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault();
      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
      setMobileOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-light-slate/60">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link to="/" className="shrink-0">
            <Logo size="md" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={link.href === '/#how-it-works' ? handleAboutClick : undefined}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === link.href
                    ? 'text-primary bg-primary-50'
                    : 'text-slate-text hover:text-midnight hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2.5 text-sm font-semibold text-primary border border-primary rounded-lg hover:bg-primary-50 transition-colors"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-hover transition-colors shadow-sm"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-slate-text hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-light-slate animate-slide-down">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={(e) => {
                    if (link.href === '/#how-it-works') handleAboutClick(e);
                    setMobileOpen(false);
                  }}
                  className="px-4 py-3 text-sm font-medium text-slate-text hover:text-midnight hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-light-slate">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm font-semibold text-primary text-center border border-primary rounded-lg hover:bg-primary-50 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm font-semibold text-white text-center bg-primary rounded-lg hover:bg-primary-hover transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
