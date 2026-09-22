import { useState } from 'react';
import { User, Shield, Bell as BellIcon, Lock, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function SettingsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [notifPrefs, setNotifPrefs] = useState({ email: true, jobAlerts: true, applicationUpdates: true, marketing: false });
  const [privacySettings, setPrivacySettings] = useState({ profileVisible: true, showEmail: false, showPhone: false });

  const handleSave = () => addToast('success', 'Settings saved!');

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-midnight">Settings</h1>

      {/* Account */}
      <div className="bg-white rounded-xl border border-light-slate/50 p-6">
        <h2 className="font-semibold text-midnight flex items-center gap-2 mb-4"><User className="w-5 h-5" /> Account</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-light-slate/50">
            <div><p className="text-sm font-medium text-midnight">Email</p><p className="text-sm text-slate-text">{user?.email}</p></div>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-light-slate/50">
            <div><p className="text-sm font-medium text-midnight">Name</p><p className="text-sm text-slate-text">{user?.name}</p></div>
          </div>
          <div className="flex items-center justify-between py-2">
            <div><p className="text-sm font-medium text-midnight">Role</p><p className="text-sm text-slate-text capitalize">{user?.role}</p></div>
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-white rounded-xl border border-light-slate/50 p-6">
        <h2 className="font-semibold text-midnight flex items-center gap-2 mb-4"><Shield className="w-5 h-5" /> Privacy</h2>
        <div className="space-y-4">
          {[
            { key: 'profileVisible' as const, label: 'Profile visible to recruiters', desc: 'Allow recruiters to discover your profile' },
            { key: 'showEmail' as const, label: 'Show email on profile', desc: 'Display email address on your public profile' },
            { key: 'showPhone' as const, label: 'Show phone on profile', desc: 'Display phone number on your public profile' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between">
              <div><p className="text-sm font-medium text-midnight">{item.label}</p><p className="text-xs text-slate-text">{item.desc}</p></div>
              <button onClick={() => setPrivacySettings(p => ({ ...p, [item.key]: !p[item.key] }))} className={`relative w-11 h-6 rounded-full transition-colors ${privacySettings[item.key] ? 'bg-primary' : 'bg-gray-200'}`}>
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${privacySettings[item.key] ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl border border-light-slate/50 p-6">
        <h2 className="font-semibold text-midnight flex items-center gap-2 mb-4"><BellIcon className="w-5 h-5" /> Notification Preferences</h2>
        <div className="space-y-4">
          {[
            { key: 'email' as const, label: 'Email notifications', desc: 'Receive updates via email' },
            { key: 'jobAlerts' as const, label: 'Job alerts', desc: 'New jobs matching your skills' },
            { key: 'applicationUpdates' as const, label: 'Application updates', desc: 'Status changes on your applications' },
            { key: 'marketing' as const, label: 'Marketing emails', desc: 'Tips, news, and promotions' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between">
              <div><p className="text-sm font-medium text-midnight">{item.label}</p><p className="text-xs text-slate-text">{item.desc}</p></div>
              <button onClick={() => setNotifPrefs(p => ({ ...p, [item.key]: !p[item.key] }))} className={`relative w-11 h-6 rounded-full transition-colors ${notifPrefs[item.key] ? 'bg-primary' : 'bg-gray-200'}`}>
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${notifPrefs[item.key] ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-xl border border-light-slate/50 p-6">
        <h2 className="font-semibold text-midnight flex items-center gap-2 mb-4"><Lock className="w-5 h-5" /> Change Password</h2>
        <div className="space-y-3 max-w-md">
          <input type="password" placeholder="Current password" className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" />
          <input type="password" placeholder="New password" className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" />
          <input type="password" placeholder="Confirm new password" className="w-full px-4 py-3 rounded-lg border border-light-slate outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" />
        </div>
      </div>

      <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-colors">
        <Save className="w-5 h-5" /> Save Settings
      </button>
    </div>
  );
}

export { SettingsPage as StudentSettings };
