import { Link } from 'react-router-dom';
import { Search, ArrowRight, Users, FileText, UserCheck, BarChart3, Sparkles } from 'lucide-react';
import heroImage from '../../assets/hero-illustration.jpg';

export function WelcomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-primary-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Content */}
            <div className="animate-fade-in">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4">
                Opportunities for a Brighter Tomorrow
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-midnight leading-tight">
                Find Your Next
                <br />
                <span className="text-primary">Big Opportunity</span>
              </h1>
              <p className="mt-6 text-lg text-slate-text leading-relaxed max-w-lg">
                Discover jobs and internships, connect with top companies, and take the next step in your career with <strong className="text-midnight">getAjob</strong>.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition-all shadow-md hover:shadow-lg group"
                >
                  <Search className="w-5 h-5" />
                  Explore Opportunities
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/register/recruiter"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-semibold rounded-xl border-2 border-primary hover:bg-primary-50 transition-all group"
                >
                  <Users className="w-5 h-5" />
                  I'm Hiring Talent
                </Link>
              </div>
            </div>

            {/* Right - Illustration + Floating Cards */}
            <div className="relative flex justify-center lg:justify-end">
              {/* Floating Cards */}
              <div className="absolute top-0 left-4 lg:left-0 z-10 animate-float" style={{ animationDelay: '0s' }}>
                <div className="bg-white rounded-xl shadow-card-hover p-4 flex items-center gap-3 border border-light-slate/50">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                    <Search className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-midnight">Find Jobs</p>
                    <p className="text-xs text-slate-text">Browse opportunities<br/>that match your skills.</p>
                  </div>
                </div>
              </div>

              <div className="absolute top-0 right-0 z-10 animate-float" style={{ animationDelay: '1s' }}>
                <div className="bg-white rounded-xl shadow-card-hover p-4 flex items-center gap-3 border border-light-slate/50">
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-midnight">Build Your Career</p>
                    <p className="text-xs text-slate-text">Gain experience<br/>and grow.</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-8 right-4 z-10 animate-float" style={{ animationDelay: '2s' }}>
                <div className="bg-white rounded-xl shadow-card-hover p-4 flex items-center gap-3 border border-light-slate/50">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-midnight">Achieve More</p>
                    <p className="text-xs text-slate-text">Turn your goals<br/>into reality.</p>
                  </div>
                </div>
              </div>

              {/* Hero Image */}
              <div className="relative w-full max-w-lg mt-12 lg:mt-8">
                <img
                  src={heroImage}
                  alt="Students finding jobs and internships on getAjob"
                  className="w-full h-auto object-contain relative z-0"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How getAjob Works */}
      <section id="how-it-works" className="bg-off-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-midnight">
              How get<span className="text-primary">A</span>job Works
            </h2>
            <p className="mt-3 text-slate-text text-lg">
              A simple way to reach your career goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <Search className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-midnight mb-2">1. Discover</h3>
              <p className="text-slate-text leading-relaxed">
                Search for jobs and internships that match your interests.
              </p>
            </div>

            {/* Connector */}
            <div className="hidden md:flex items-start justify-center pt-8">
              <ArrowRight className="w-6 h-6 text-light-slate absolute left-1/2 -translate-x-1/2 -ml-[calc(50%+24px)]" />
            </div>

            {/* Step 2 */}
            <div className="text-center group md:col-start-2 md:row-start-1">
              <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <FileText className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-midnight mb-2">2. Apply</h3>
              <p className="text-slate-text leading-relaxed">
                Submit your application with your profile and resume.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center group md:col-start-3 md:row-start-1">
              <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <UserCheck className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-midnight mb-2">3. Get Hired</h3>
              <p className="text-slate-text leading-relaxed">
                Connect with companies and take the next step in your career.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
