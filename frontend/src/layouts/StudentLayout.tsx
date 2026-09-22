import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, FileText, Bookmark, User, FileUp, Bell, Settings, LogOut, Menu, X, ChevronDown
} from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/notificationService';
import { getInitials } from '../utils/format';

const studentNav = [
  { label: 'Dashboard', href: '/student/home', icon: LayoutDashboard },
  { label: 'Browse Jobs', href: '/student/jobs', icon: Briefcase },
  { label: 'My Applications', href: '/student/applications', icon: FileText },
  { label: 'Saved Jobs', href: '/student/saved-jobs', icon: Bookmark },
  { label: 'My Profile', href: '/student/profile', icon: User },
  { label: 'My Resumes', href: '/student/resumes', icon: FileUp },
  { label: 'Notifications', href: '/student/notifications', icon: Bell },
  { label: 'Settings', href: '/student/settings', icon: Settings },
];

export function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const unreadCount = user ? notificationService.getUnreadCount(user.id) : 0;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-off-white flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-light-slate fixed inset-y-0 left-0 z-30">
        <div className="p-5 border-b border-light-slate">
          <Link to="/student/home"><Logo size="md" /></Link>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {studentNav.map((item) => {
            const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary-50 text-primary'
                    : 'text-slate-text hover:bg-gray-50 hover:text-midnight'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
                {item.label === 'Notifications' && unreadCount > 0 && (
                  <span className="ml-auto bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-light-slate">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-text hover:bg-red-50 hover:text-error w-full transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar - Mobile */}
      <aside className={`lg:hidden fixed inset-y-0 left-0 w-72 bg-white z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 border-b border-light-slate flex items-center justify-between">
          <Link to="/student/home" onClick={() => setSidebarOpen(false)}><Logo size="md" /></Link>
          <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {studentNav.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive ? 'bg-primary-50 text-primary' : 'text-slate-text hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
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

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-light-slate px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
            <Menu className="w-5 h-5 text-slate-text" />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-4">
            <Link to="/student/notifications" className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5 text-slate-text" />
              {unreadCount > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full border-2 border-white" />}
            </Link>
            <div className="relative">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary flex items-center justify-center text-xs font-bold">
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
                    <Link to="/student/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-text hover:bg-gray-50"><User className="w-4 h-4" />My Profile</Link>
                    <Link to="/student/settings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-text hover:bg-gray-50"><Settings className="w-4 h-4" />Settings</Link>
                    <div className="border-t border-light-slate mt-1 pt-1">
                      <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 text-sm text-error hover:bg-red-50 w-full"><LogOut className="w-4 h-4" />Logout</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
