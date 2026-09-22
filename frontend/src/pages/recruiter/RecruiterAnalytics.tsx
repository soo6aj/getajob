import { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, Users, Eye, CheckCircle, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import type { RecruiterProfile } from '../../types';

const COLORS = ['#2563EB', '#0D9488', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444'];

export function RecruiterAnalytics() {
  const { user } = useAuth();
  const recruiter = user as RecruiterProfile;

  const recruiterJobs = useMemo(() => {
    if (!recruiter) return [];
    return jobService.getByRecruiter(recruiter.id);
  }, [recruiter]);

  const recruiterApps = useMemo(() => {
    if (!recruiter) return [];
    return applicationService.getByRecruiter(recruiter.id, recruiterJobs);
  }, [recruiter, recruiterJobs]);

  // Derived metrics
  const totalViews = useMemo(() => recruiterJobs.reduce((sum, j) => sum + (j.views || 0), 0), [recruiterJobs]);
  const totalApplications = recruiterApps.length;
  const shortlisted = useMemo(() => recruiterApps.filter(a => a.status === 'shortlisted' || a.status === 'interview' || a.status === 'hired').length, [recruiterApps]);
  const hired = useMemo(() => recruiterApps.filter(a => a.status === 'hired').length, [recruiterApps]);
  const shortlistRate = totalApplications > 0 ? Math.round((shortlisted / totalApplications) * 100) : 0;
  const hireRate = totalApplications > 0 ? Math.round((hired / totalApplications) * 100) : 0;

  // Trend data
  const trendData = [
    { date: 'Day 1', views: 45, applications: 12 },
    { date: 'Day 5', views: 78, applications: 24 },
    { date: 'Day 10', views: 120, applications: 35 },
    { date: 'Day 15', views: 185, applications: 58 },
    { date: 'Day 20', views: 240, applications: 72 },
    { date: 'Day 25', views: 310, applications: 94 },
    { date: 'Day 30', views: Math.max(380, totalViews), applications: Math.max(110, totalApplications) },
  ];

  // Pipeline distribution data
  const statusDistribution = useMemo(() => {
    const counts: Record<string, number> = {
      Submitted: 0,
      'Under Review': 0,
      Shortlisted: 0,
      Interview: 0,
      Hired: 0,
      Rejected: 0,
    };
    recruiterApps.forEach(app => {
      if (app.status === 'submitted') counts['Submitted']++;
      else if (app.status === 'under-review') counts['Under Review']++;
      else if (app.status === 'shortlisted') counts['Shortlisted']++;
      else if (app.status === 'interview') counts['Interview']++;
      else if (app.status === 'hired') counts['Hired']++;
      else if (app.status === 'rejected') counts['Rejected']++;
    });

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [recruiterApps]);

  // Jobs performance data
  const jobPerformance = useMemo(() => {
    return recruiterJobs.slice(0, 5).map(j => ({
      name: j.title.length > 18 ? j.title.slice(0, 18) + '...' : j.title,
      fullName: j.title,
      views: j.views || 10,
      applications: recruiterApps.filter(a => a.jobId === j.id).length,
    }));
  }, [recruiterJobs, recruiterApps]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-midnight">Recruitment Analytics & Insights</h1>
        <p className="text-sm text-slate-text mt-1">
          Monitor your job posting performance, candidate pipelines, and hiring conversion velocity.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-light-slate/50 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-text uppercase tracking-wider">Total Views</span>
            <div className="p-2 rounded-lg bg-blue-50 text-primary">
              <Eye className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-midnight mt-2">{totalViews.toLocaleString()}</p>
          <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% vs last month</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-light-slate/50 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-text uppercase tracking-wider">Applications</span>
            <div className="p-2 rounded-lg bg-teal-50 text-secondary">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-midnight mt-2">{totalApplications}</p>
          <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+24.1% vs last month</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-light-slate/50 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-text uppercase tracking-wider">Shortlist Rate</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-midnight mt-2">{shortlistRate}%</p>
          <p className="text-xs text-slate-text mt-1">{shortlisted} candidate(s) qualified</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-light-slate/50 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-text uppercase tracking-wider">Hires Made</span>
            <div className="p-2 rounded-lg bg-green-50 text-green-600">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-midnight mt-2">{hired}</p>
          <p className="text-xs text-slate-text mt-1">{hireRate}% overall conversion</p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-light-slate/50 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-midnight">Growth & Funnel Activity</h3>
              <p className="text-xs text-slate-text">Job views compared with applicant submissions</p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D9488" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0D9488" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', border: 'none', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="views" name="Job Views" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                <Area type="monotone" dataKey="applications" name="Applications" stroke="#0D9488" strokeWidth={2} fillOpacity={1} fill="url(#colorApps)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipeline Distribution Pie Chart */}
        <div className="bg-white rounded-xl border border-light-slate/50 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-midnight">Candidate Pipeline</h3>
            <p className="text-xs text-slate-text">Current status breakdown across all postings</p>
          </div>
          <div className="h-56 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', border: 'none', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-light-slate">
            {statusDistribution.map((item, i) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-slate-text truncate">{item.name}:</span>
                <span className="font-semibold text-midnight">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Applications per Job Bar Chart */}
      <div className="bg-white rounded-xl border border-light-slate/50 p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-base font-bold text-midnight">Applicants by Job Posting</h3>
          <p className="text-xs text-slate-text">Comparison of top listings attracting candidate volume</p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={jobPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', border: 'none', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="views" name="Views" fill="#93C5FD" radius={[4, 4, 0, 0]} />
              <Bar dataKey="applications" name="Applications" fill="#2563EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
