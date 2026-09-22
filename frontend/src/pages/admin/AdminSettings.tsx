import { useState } from 'react';
import { Shield, Lock, Database, Save, AlertTriangle, Key } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export function AdminSettings() {
  const { addToast } = useToast();

  const [platformConfig, setPlatformConfig] = useState({
    siteName: 'getAjob',
    supportEmail: 'support@getajob.careers',
    allowStudentRegistration: true,
    allowRecruiterRegistration: true,
    requireCompanyVerification: true,
    maintenanceMode: false,
  });

  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirm: '',
  });

  const handleSavePlatform = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('success', 'Configuration Saved', 'Platform system preferences updated.');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) {
      addToast('error', 'Mismatch', 'New passwords do not match.');
      return;
    }
    addToast('success', 'Security Credentials Updated', 'Admin authentication password has been updated.');
    setPasswords({ current: '', newPass: '', confirm: '' });
  };

  const handleBackupExport = () => {
    addToast('info', 'Export Triggered', 'Generating JSON system snapshot backup of portal records...');
    setTimeout(() => {
      addToast('success', 'Backup Complete', 'Export file getajob-backup.json is ready.');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-midnight">System & Platform Settings</h1>
        <p className="text-sm text-slate-text mt-1">
          Configure site-wide registration policies, administrative security, and database backup routines.
        </p>
      </div>

      {/* General Platform Controls */}
      <form onSubmit={handleSavePlatform} className="bg-white rounded-xl border border-light-slate/50 p-6 space-y-5 shadow-sm">
        <h2 className="text-base font-bold text-midnight flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" /> Platform Governance & Registrations
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-midnight mb-1.5">Platform Brand Name</label>
            <input
              type="text"
              value={platformConfig.siteName}
              onChange={e => setPlatformConfig(prev => ({ ...prev, siteName: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-light-slate rounded-lg outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-midnight mb-1.5">Official Support Email</label>
            <input
              type="email"
              value={platformConfig.supportEmail}
              onChange={e => setPlatformConfig(prev => ({ ...prev, supportEmail: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-light-slate rounded-lg outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="pt-3 border-t border-light-slate/60 space-y-3">
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-semibold text-midnight">Allow Student Self-Registration</p>
              <p className="text-xs text-slate-text">Allow candidate job seekers to sign up publicly</p>
            </div>
            <button
              type="button"
              onClick={() => setPlatformConfig(p => ({ ...p, allowStudentRegistration: !p.allowStudentRegistration }))}
              className={`relative w-11 h-6 rounded-full transition-colors ${platformConfig.allowStudentRegistration ? 'bg-primary' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${platformConfig.allowStudentRegistration ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-semibold text-midnight">Allow Recruiter Registrations</p>
              <p className="text-xs text-slate-text">Allow new employers to submit company accounts</p>
            </div>
            <button
              type="button"
              onClick={() => setPlatformConfig(p => ({ ...p, allowRecruiterRegistration: !p.allowRecruiterRegistration }))}
              className={`relative w-11 h-6 rounded-full transition-colors ${platformConfig.allowRecruiterRegistration ? 'bg-primary' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${platformConfig.allowRecruiterRegistration ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-semibold text-midnight">Mandatory Company Verification</p>
              <p className="text-xs text-slate-text">Require manual admin verification before job postings go live</p>
            </div>
            <button
              type="button"
              onClick={() => setPlatformConfig(p => ({ ...p, requireCompanyVerification: !p.requireCompanyVerification }))}
              className={`relative w-11 h-6 rounded-full transition-colors ${platformConfig.requireCompanyVerification ? 'bg-primary' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${platformConfig.requireCompanyVerification ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between py-1 border-t border-light-slate/60 pt-3">
            <div>
              <p className="text-sm font-semibold text-error flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> System Maintenance Mode
              </p>
              <p className="text-xs text-slate-text">Show platform maintenance screen to all non-admin visitors</p>
            </div>
            <button
              type="button"
              onClick={() => setPlatformConfig(p => ({ ...p, maintenanceMode: !p.maintenanceMode }))}
              className={`relative w-11 h-6 rounded-full transition-colors ${platformConfig.maintenanceMode ? 'bg-error' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${platformConfig.maintenanceMode ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button type="submit" className="flex items-center gap-1.5 px-4 py-2.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-hover transition-colors">
            <Save className="w-4 h-4" /> Save Platform Preferences
          </button>
        </div>
      </form>

      {/* Security Credentials */}
      <form onSubmit={handlePasswordChange} className="bg-white rounded-xl border border-light-slate/50 p-6 space-y-4 shadow-sm">
        <h2 className="text-base font-bold text-midnight flex items-center gap-2">
          <Lock className="w-5 h-5 text-primary" /> Administrator Credentials & Security
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-midnight mb-1">Current Password</label>
            <input
              type="password"
              required
              value={passwords.current}
              onChange={e => setPasswords(prev => ({ ...prev, current: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-light-slate rounded-lg outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-midnight mb-1">New Password</label>
            <input
              type="password"
              required
              value={passwords.newPass}
              onChange={e => setPasswords(prev => ({ ...prev, newPass: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-light-slate rounded-lg outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-midnight mb-1">Confirm Password</label>
            <input
              type="password"
              required
              value={passwords.confirm}
              onChange={e => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-light-slate rounded-lg outline-none focus:border-primary"
            />
          </div>
        </div>

        <button type="submit" className="flex items-center gap-1.5 px-4 py-2 bg-midnight text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors">
          <Key className="w-3.5 h-3.5" /> Update Admin Password
        </button>
      </form>

      {/* Database & Export Section */}
      <div className="bg-white rounded-xl border border-light-slate/50 p-6 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-midnight flex items-center gap-2">
            <Database className="w-5 h-5 text-secondary" /> Data Export & Platform Backup
          </h2>
          <p className="text-xs text-slate-text mt-0.5">
            Download an aggregated JSON snapshot of all jobs, companies, users, and audit records.
          </p>
        </div>
        <button
          onClick={handleBackupExport}
          className="px-4 py-2 border border-light-slate rounded-lg text-xs font-semibold text-midnight hover:bg-gray-50 flex items-center gap-1.5"
        >
          <Database className="w-3.5 h-3.5" /> Export Records
        </button>
      </div>
    </div>
  );
}
