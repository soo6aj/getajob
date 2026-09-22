import { useState, useMemo } from 'react';
import {
  Building2, Search, CheckCircle, XCircle, Clock, Globe, MapPin,
  ShieldCheck
} from 'lucide-react';
import { companyService } from '../../services/companyService';
import { useToast } from '../../context/ToastContext';
import type { Company, VerificationStatus } from '../../types';
import { formatDate } from '../../utils/format';

export function AdminCompanies() {
  const { addToast } = useToast();
  const [companies, setCompanies] = useState<Company[]>(() => companyService.getAllCompanies());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | VerificationStatus>('all');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const filteredCompanies = useMemo(() => {
    return companies.filter(c => {
      const matchSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.industry.toLowerCase().includes(search.toLowerCase()) ||
        c.location.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || c.verificationStatus === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [companies, search, statusFilter]);

  const handleUpdateStatus = (companyId: string, status: VerificationStatus) => {
    companyService.updateVerification(companyId, status);
    setCompanies(prev => prev.map(c => c.id === companyId ? { ...c, verificationStatus: status } : c));
    addToast(
      status === 'verified' ? 'success' : 'warning',
      `Company ${status === 'verified' ? 'Verified' : 'Status Updated'}`,
      `Verification status has been set to ${status}.`
    );
    if (selectedCompany?.id === companyId) {
      setSelectedCompany(prev => prev ? { ...prev, verificationStatus: status } : null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-midnight">Company Management & Verification</h1>
        <p className="text-sm text-slate-text mt-1">
          Verify corporate employers, review registration documents, and grant official verification badges.
        </p>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-light-slate/50 p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-text absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by company name, industry, or location..."
            className="w-full pl-10 pr-4 py-2.5 bg-off-white border border-light-slate rounded-lg text-sm outline-none focus:border-primary focus:bg-white transition-colors"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as any)}
          className="px-3 py-2 bg-off-white border border-light-slate rounded-lg text-xs font-medium text-midnight outline-none cursor-pointer"
        >
          <option value="all">All Verification Statuses</option>
          <option value="pending">Pending Review Only</option>
          <option value="verified">Verified Companies</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCompanies.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl border border-light-slate/50 p-12 text-center text-slate-text">
            No companies found matching your criteria.
          </div>
        ) : (
          filteredCompanies.map(c => (
            <div
              key={c.id}
              className="bg-white rounded-xl border border-light-slate/50 p-5 shadow-sm hover:border-primary/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center font-bold text-lg">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                    c.verificationStatus === 'verified' ? 'bg-green-50 text-green-700 border border-green-200' :
                    c.verificationStatus === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {c.verificationStatus === 'verified' && <CheckCircle className="w-3 h-3" />}
                    {c.verificationStatus === 'pending' && <Clock className="w-3 h-3" />}
                    {c.verificationStatus === 'rejected' && <XCircle className="w-3 h-3" />}
                    {c.verificationStatus}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-midnight text-base">{c.name}</h3>
                  <p className="text-xs text-slate-text mt-0.5">{c.industry} • {c.size} Employees</p>
                  <p className="text-xs text-slate-text flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" /> {c.location}
                  </p>
                </div>

                <p className="text-xs text-slate-text line-clamp-2 leading-relaxed">
                  {c.about}
                </p>
              </div>

              <div className="pt-4 border-t border-light-slate/60 mt-4 flex items-center justify-between">
                <button
                  onClick={() => setSelectedCompany(c)}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  View Details
                </button>

                <div className="flex items-center gap-2">
                  {c.verificationStatus !== 'verified' && (
                    <button
                      onClick={() => handleUpdateStatus(c.id, 'verified')}
                      className="px-2.5 py-1 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Verify
                    </button>
                  )}
                  {c.verificationStatus !== 'rejected' && (
                    <button
                      onClick={() => handleUpdateStatus(c.id, 'rejected')}
                      className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Company Modal */}
      {selectedCompany && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-modal animate-scale-in">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center font-bold">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-midnight text-lg flex items-center gap-1.5">
                    {selectedCompany.name}
                    {selectedCompany.verificationStatus === 'verified' && (
                      <ShieldCheck className="w-4 h-4 text-green-600" />
                    )}
                  </h3>
                  <p className="text-xs text-slate-text">{selectedCompany.industry} • {selectedCompany.location}</p>
                </div>
              </div>
              <button onClick={() => setSelectedCompany(null)} className="text-slate-text hover:text-midnight p-1">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-text block mb-1 font-semibold uppercase tracking-wider">About Company</span>
                <p className="text-slate-text leading-relaxed bg-off-white p-3 rounded-lg">
                  {selectedCompany.about}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <span className="text-slate-text block">Company Size</span>
                  <span className="font-semibold text-midnight">{selectedCompany.size} Employees</span>
                </div>
                <div>
                  <span className="text-slate-text block">Registered On</span>
                  <span className="font-semibold text-midnight">{formatDate(selectedCompany.createdAt)}</span>
                </div>
                {selectedCompany.website && (
                  <div className="col-span-2">
                    <span className="text-slate-text block">Official Website</span>
                    <a
                      href={selectedCompany.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary font-semibold hover:underline flex items-center gap-1"
                    >
                      <Globe className="w-3.5 h-3.5" /> {selectedCompany.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-light-slate flex items-center justify-between">
              <div className="flex items-center gap-2">
                {selectedCompany.verificationStatus !== 'verified' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedCompany.id, 'verified')}
                    className="px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Grant Verification Badge
                  </button>
                )}
                {selectedCompany.verificationStatus !== 'rejected' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedCompany.id, 'rejected')}
                    className="px-3 py-1.5 bg-error text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Reject Verification
                  </button>
                )}
              </div>

              <button
                onClick={() => setSelectedCompany(null)}
                className="px-4 py-1.5 border border-light-slate text-xs font-semibold rounded-lg hover:bg-gray-50"
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
