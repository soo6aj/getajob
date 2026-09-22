import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Briefcase, Building2, Flag, Shield, TrendingUp, AlertTriangle,
  CheckCircle2, ArrowRight, UserPlus, FileCheck
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { adminService } from '../../services/adminService';
import { userService } from '../../services/userService';
import { companyService } from '../../services/companyService';
import { formatDate } from '../../utils/format';

const platformGrowthData = [
  { month: 'Oct', users: 120, jobs: 45 },
  { month: 'Nov', users: 240, jobs: 90 },
  { month: 'Dec', users: 410, jobs: 160 },
  { month: 'Jan', users: 650, jobs: 280 },
  { month: 'Feb', users: 920, jobs: 410 },
  { month: 'Mar', users: 1250, jobs: 540 },
];

export function AdminHome() {
  const stats = useMemo(() => adminService.getPlatformStats(), []);
  const reports = useMemo(() => adminService.getReports().filter(r => r.status === 'pending'), []);
  const pendingCompanies = useMemo(() => companyService.getAllCompanies().filter(c => c.verificationStatus === 'pending'), []);
  const recentUsers = useMemo(() => userService.getAllUsers().slice(0, 5), []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-midnight rounded-2xl p-6 lg:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-primary-200">
            <Shield className="w-3.5 h-3.5" /> Platform Control Center
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">System Administrator Dashboard</h1>
          <p className="text-gray-300 text-sm max-w-xl">
            Real-time platform metrics, user moderation, company verification queues, and audit telemetry.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 relative z-10">
          <Link
            to="/admin/reports"
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow transition-colors"
          >
            <AlertTriangle className="w-4 h-4" /> Review Reports ({stats.pendingReports})
          </Link>
          <Link
            to="/admin/companies"
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            <FileCheck className="w-4 h-4" /> Pending Companies ({stats.pendingCompanies})
          </Link>
        </div>
        {/* Subtle geometric backdrop */}
        <div className="absolute right-0 -bottom-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-light-slate/50 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-text uppercase tracking-wider">Total Users</span>
            <div className="p-2 rounded-lg bg-blue-50 text-primary">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-midnight mt-2">{stats.totalUsers}</p>
          <div className="flex items-center gap-2 text-xs text-slate-text mt-1">
            <span>{stats.totalStudents} students</span>
            <span>•</span>
            <span>{stats.totalRecruiters} recruiters</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-light-slate/50 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-text uppercase tracking-wider">Total Postings</span>
            <div className="p-2 rounded-lg bg-teal-50 text-secondary">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-midnight mt-2">{stats.totalJobs}</p>
          <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{stats.activeJobs} active & published</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-light-slate/50 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-text uppercase tracking-wider">Companies</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-midnight mt-2">{stats.totalCompanies}</p>
          <p className="text-xs text-amber-600 mt-1">{stats.pendingCompanies} pending approval</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-light-slate/50 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-text uppercase tracking-wider">Moderation Queue</span>
            <div className="p-2 rounded-lg bg-red-50 text-error">
              <Flag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-midnight mt-2">{stats.pendingReports}</p>
          <p className="text-xs text-slate-text mt-1">Pending user safety reports</p>
        </div>
      </div>

      {/* Platform Chart & Moderation Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-light-slate/50 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-midnight">Platform Growth Trends</h3>
              <p className="text-xs text-slate-text">New registrations and active listings velocity</p>
            </div>
            <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +42% MoM
            </span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={platformGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="adminUserGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="adminJobGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D9488" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0D9488" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', border: 'none', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="users" name="Active Users" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#adminUserGrad)" />
                <Area type="monotone" dataKey="jobs" name="Job Postings" stroke="#0D9488" strokeWidth={2} fillOpacity={1} fill="url(#adminJobGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Action Queue */}
        <div className="bg-white rounded-xl border border-light-slate/50 p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-midnight">Moderation Queue</h3>
            <p className="text-xs text-slate-text">Pending reports requiring administrative review</p>
          </div>

          <div className="space-y-3 flex-1 my-2 overflow-y-auto max-h-64">
            {reports.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-xs font-semibold text-midnight">Queue Clear</p>
                <p className="text-[11px] text-slate-text">No pending reports to resolve.</p>
              </div>
            ) : (
              reports.map(rep => (
                <div key={rep.id} className="p-3 rounded-lg border border-red-100 bg-red-50/50 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-700 uppercase">{rep.itemType} Flagged</span>
                    <span className="text-[10px] text-slate-text">{formatDate(rep.createdAt)}</span>
                  </div>
                  <p className="text-xs font-semibold text-midnight truncate">{rep.itemName}</p>
                  <p className="text-[11px] text-slate-text line-clamp-1">{rep.reason}</p>
                </div>
              ))
            )}
          </div>

          <Link
            to="/admin/reports"
            className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-xs font-semibold text-midnight transition-colors"
          >
            <span>Open All Moderation Cases</span>
            <ArrowRight className="w-4 h-4 text-slate-text" />
          </Link>
        </div>
      </div>

      {/* Bottom Grid: Recent Users & Pending Companies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Registrations */}
        <div className="bg-white rounded-xl border border-light-slate/50 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-midnight flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-primary" /> Recent Registrations
            </h3>
            <Link to="/admin/users" className="text-xs text-primary font-semibold hover:underline">
              View All
            </Link>
          </div>

          <div className="divide-y divide-light-slate/50">
            {recentUsers.map(u => (
              <div key={u.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-midnight">{u.name}</p>
                  <p className="text-xs text-slate-text">{u.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                    u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                    u.role === 'recruiter' ? 'bg-teal-100 text-teal-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {u.role}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                    u.status === 'active' ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'
                  }`}>
                    {u.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Company Verifications */}
        <div className="bg-white rounded-xl border border-light-slate/50 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-midnight flex items-center gap-2">
              <Building2 className="w-4 h-4 text-secondary" /> Company Verification Requests
            </h3>
            <Link to="/admin/companies" className="text-xs text-primary font-semibold hover:underline">
              Manage
            </Link>
          </div>

          <div className="space-y-3">
            {pendingCompanies.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-xs font-semibold text-midnight">All Companies Verified</p>
                <p className="text-[11px] text-slate-text">No companies currently awaiting verification review.</p>
              </div>
            ) : (
              pendingCompanies.map(c => (
                <div key={c.id} className="p-3 rounded-lg border border-light-slate/60 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-midnight">{c.name}</h4>
                    <p className="text-xs text-slate-text">{c.industry} • {c.location}</p>
                  </div>
                  <Link
                    to="/admin/companies"
                    className="px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-hover transition-colors"
                  >
                    Review
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
