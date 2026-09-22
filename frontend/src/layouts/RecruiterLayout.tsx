import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, PlusCircle, Users, Building2, BarChart3, Bell, Settings, LogOut, Menu, X, ChevronDown
} from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/notificationService';
import { getInitials } from '../utils/format';

const recruiterNav = [
  { label: 'Dashboard', href: '/recruiter/home', icon: LayoutDashboard },
  { label: 'Manage Jobs', href: '/recruiter/jobs', icon: Briefcase },
  { label: 'Post a Job', href: '/recruiter/jobs/create', icon: PlusCircle },
  { label: 'Applicants', href: '/recruiter/applicants', icon: Users },
  { label: 'Company Profile', href: '/recruiter/company', icon: Building2 },
  { label: 'Analytics', href: '/recruiter/analytics', icon: BarChart3 },
  { label: 'Notifications', href: '/recruiter/notifications', icon: Bell },
  { label: 'Settings', href: '/recruiter/settings', icon: Settings },
];

export function RecruiterLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const unreadCount = user ? notificationService.getUnreadCount(user.id) : 0;

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="min-h-screen bg-off-white flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-light-slate fixed inset-y-0 left-0 z-30">
        <div className="p-5 border-b border-light-slate">
          <Link to="/recruiter/home"><Logo size="md" /></Link>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {recruiterNav.map((item) => {
            const isActive = location.pathname === item.href || (item.href !== '/recruiter/jobs/create' && location.pathname.startsWith(item.href + '/'));
            return (
              <Link key={item.href} to={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive ? 'bg-primary-50 text-primary' : 'text-slate-text hover:bg-gray-50 hover:text-midnight'
                }`}>
                <item.icon className="w-5 h-5" />{item.label}
                {item.label === 'Notifications' && unreadCount > 0 && (
                  <span className="ml-auto bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-light-slate">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-text hover:bg-red-50 hover:text-error w-full transition-colors">
            <LogOut className="w-5 h-5" />Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="lg:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setSidebarOpen(false)} />}
      <aside className={`lg:hidden fixed inset-y-0 left-0 w-72 bg-white z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 border-b border-light-slate flex items-center justify-between">
          <Link to="/recruiter/home" onClick={() => setSidebarOpen(false)}><Logo size="md" /></Link>
          <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {recruiterNav.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link key={item.href} to={item.href} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive ? 'bg-primary-50 text-primary' : 'text-slate-text hover:bg-gray-50'
                }`}>
                <item.icon className="w-5 h-5" />{item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-light-slate">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-text hover:bg-red-50 hover:text-error w-full">
            <LogOut className="w-5 h-5" />Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-light-slate px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
            <Menu className="w-5 h-5 text-slate-text" />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-4">
            <Link to="/recruiter/notifications" className="relative p-2 rounded-lg hover:bg-gray-100">
              <Bell className="w-5 h-5 text-slate-text" />
              {unreadCount > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full border-2 border-white" />}
            </Link>
            <div className="relative">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100">
                <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-xs font-bold">
                  {user ? getInitials(user.name) : '?'}
                </div>
                <span className="hidden sm:block text-sm font-medium text-midnight">{user?.name?.split(' ')[0]}</span>
                <ChevronDown className="w-4 h-4 text-slate-text" />
              </button>
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-dropdown border border-light-slate z-20 py-2 animate-scale-in">
                    <div className="px-4 py-2 border-b border-light-slate">
                      <p className="text-sm font-semibold text-midnight">{user?.name}</p>
                      <p className="text-xs text-slate-text">{user?.email}</p>
                    </div>
                    <Link to="/recruiter/company" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-text hover:bg-gray-50"><Building2 className="w-4 h-4" />Company Profile</Link>
                    <Link to="/recruiter/settings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-text hover:bg-gray-50"><Settings className="w-4 h-4" />Settings</Link>
                    <div className="border-t border-light-slate mt-1 pt-1">
                      <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 text-sm text-error hover:bg-red-50 w-full"><LogOut className="w-4 h-4" />Logout</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 animate-fade-in"><Outlet /></main>
      </div>
    </div>
  );
}
