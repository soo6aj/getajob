import { useState, useMemo } from 'react';
import {
  Flag, Filter, User, Building2, Briefcase
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import type { Report, ReportStatus, ReportItemType } from '../../types';
import { formatDate } from '../../utils/format';

export function AdminReports() {
  const { addToast } = useToast();
  const [reports, setReports] = useState<Report[]>(() => adminService.getReports());
  const [statusFilter, setStatusFilter] = useState<'all' | ReportStatus>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | ReportItemType>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      const matchStatus = statusFilter === 'all' || r.status === statusFilter;
      const matchType = typeFilter === 'all' || r.itemType === typeFilter;
      return matchStatus && matchType;
    });
  }, [reports, statusFilter, typeFilter]);

  const handleResolve = (reportId: string) => {
    adminService.updateReportStatus(reportId, 'resolved');
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: 'resolved', resolvedAt: new Date().toISOString() } : r));
    addToast('success', 'Report Resolved', 'The report has been resolved and marked as actioned.');
    if (selectedReport?.id === reportId) {
      setSelectedReport(prev => prev ? { ...prev, status: 'resolved' } : null);
    }
  };

  const handleDismiss = (reportId: string) => {
    adminService.updateReportStatus(reportId, 'dismissed');
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: 'dismissed', resolvedAt: new Date().toISOString() } : r));
    addToast('info', 'Report Dismissed', 'The report has been dismissed without platform action.');
    if (selectedReport?.id === reportId) {
      setSelectedReport(prev => prev ? { ...prev, status: 'dismissed' } : null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-midnight">Content & Abuse Reports</h1>
        <p className="text-sm text-slate-text mt-1">
          Review reported listings, fake company profiles, and community safety flags.
        </p>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-light-slate/50 p-4 flex flex-wrap gap-3 items-center justify-between shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-text" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 bg-off-white border border-light-slate rounded-lg text-xs font-medium text-midnight outline-none cursor-pointer"
            >
              <option value="all">All Report Statuses</option>
              <option value="pending">Pending Review Only</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </select>
          </div>

          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value as any)}
            className="px-3 py-2 bg-off-white border border-light-slate rounded-lg text-xs font-medium text-midnight outline-none cursor-pointer"
          >
            <option value="all">All Entity Types</option>
            <option value="job">Jobs</option>
            <option value="company">Companies</option>
            <option value="user">Users</option>
          </select>
        </div>

        <span className="text-xs text-slate-text font-medium">
          Showing {filteredReports.length} report(s)
        </span>
      </div>

      {/* Reports Feed / Table */}
      <div className="bg-white rounded-xl border border-light-slate/50 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-off-white border-b border-light-slate text-xs font-semibold text-slate-text uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Flagged Entity</th>
                <th className="px-6 py-3.5">Violation Reason</th>
                <th className="px-6 py-3.5">Reported By</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-slate/50">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-text">
                    No reports match your filters.
                  </td>
                </tr>
              ) : (
                filteredReports.map(report => {
                  const Icon = report.itemType === 'job' ? Briefcase : report.itemType === 'company' ? Building2 : User;
                  return (
                    <tr key={report.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            report.itemType === 'job' ? 'bg-blue-50 text-primary' :
                            report.itemType === 'company' ? 'bg-teal-50 text-secondary' : 'bg-purple-50 text-purple-600'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-midnight truncate max-w-xs">{report.itemName}</p>
                            <span className="text-[10px] text-slate-text uppercase font-semibold">{report.itemType}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-semibold text-error">{report.reason}</p>
                        {report.description && (
                          <p className="text-xs text-slate-text truncate max-w-xs mt-0.5">{report.description}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-text">
                        {report.reporterName}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-text">
                        {formatDate(report.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                          report.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          report.status === 'resolved' ? 'bg-green-50 text-green-700 border border-green-200' :
                          'bg-gray-100 text-slate-text'
                        }`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => setSelectedReport(report)}
                            className="px-2.5 py-1.5 rounded-lg border border-light-slate text-xs font-semibold text-slate-text hover:text-midnight hover:bg-gray-50"
                          >
                            Details
                          </button>
                          {report.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleResolve(report.id)}
                                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200"
                              >
                                Resolve
                              </button>
                              <button
                                onClick={() => handleDismiss(report.id)}
                                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-text bg-gray-100 hover:bg-gray-200"
                              >
                                Dismiss
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-modal animate-scale-in">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-error flex items-center justify-center font-bold">
                  <Flag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-midnight text-base">Report #{selectedReport.id}</h3>
                  <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    selectedReport.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                    selectedReport.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-slate-text'
                  }`}>
                    {selectedReport.status}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedReport(null)} className="text-slate-text hover:text-midnight p-1">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-off-white rounded-xl space-y-1.5">
                <span className="text-slate-text uppercase text-[10px] font-bold">Flagged Entity</span>
                <p className="font-bold text-midnight text-sm">{selectedReport.itemName}</p>
                <p className="text-slate-text">Type: <span className="capitalize font-medium text-midnight">{selectedReport.itemType}</span> (ID: {selectedReport.itemId})</p>
              </div>

              <div className="p-3 bg-red-50 rounded-xl space-y-1">
                <span className="text-red-700 uppercase text-[10px] font-bold">Reported Reason</span>
                <p className="font-semibold text-red-900">{selectedReport.reason}</p>
                {selectedReport.description && (
                  <p className="text-red-800 mt-1 leading-relaxed">{selectedReport.description}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-text pt-2">
                <div>
                  <span className="block text-[10px] font-semibold uppercase">Reporter</span>
                  <span className="font-medium text-midnight">{selectedReport.reporterName}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-semibold uppercase">Reported Date</span>
                  <span className="font-medium text-midnight">{formatDate(selectedReport.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-light-slate flex items-center justify-between">
              {selectedReport.status === 'pending' ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleResolve(selectedReport.id)}
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold"
                  >
                    Action & Resolve
                  </button>
                  <button
                    onClick={() => handleDismiss(selectedReport.id)}
                    className="px-3 py-1.5 border border-light-slate text-slate-text hover:bg-gray-100 rounded-lg text-xs font-semibold"
                  >
                    Dismiss Report
                  </button>
                </div>
              ) : (
                <span className="text-xs text-slate-text">Report already marked as {selectedReport.status}.</span>
              )}

              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-1.5 border border-light-slate rounded-lg text-xs font-semibold hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
