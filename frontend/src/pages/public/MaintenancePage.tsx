import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function MaintenancePage() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-off-white flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl border border-light-slate/60 p-8 text-center space-y-6 shadow-modal">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                    <AlertTriangle className="w-9 h-9" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-midnight">System Maintenance Mode</h1>
                    <p className="text-sm text-slate-text leading-relaxed">
                        getAjob is currently undergoing scheduled platform maintenance and updates. Non-admin visitor access is temporarily paused.
                    </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-light-slate/50 text-xs text-slate-text space-y-1">
                    <p className="font-semibold text-midnight">Expected Downtime</p>
                    <p>We'll be back online shortly. Thank you for your patience!</p>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                    {user?.role === 'admin' ? (
                        <Link
                            to="/admin/home"
                            className="w-full py-2.5 bg-primary text-white font-semibold text-sm rounded-lg hover:bg-primary-hover transition-colors inline-flex items-center justify-center gap-2"
                        >
                            <ShieldCheck className="w-4 h-4" /> Go to Admin Console
                        </Link>
                    ) : (
                        <Link
                            to="/login"
                            className="w-full py-2.5 bg-midnight text-white font-semibold text-sm rounded-lg hover:bg-slate-800 transition-colors block"
                        >
                            Administrator Login
                        </Link>
                    )}

                    {user && (
                        <button
                            onClick={logout}
                            className="text-xs text-slate-text hover:text-midnight underline py-1"
                        >
                            Sign Out ({user.name})
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
