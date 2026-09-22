import { useState } from 'react';
import { Bell, Check, CheckCheck, Mail, Briefcase, UserCheck, Calendar, Star } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatRelativeDate } from '../../utils/format';
import { Link } from 'react-router-dom';

const typeIcons: Record<string, typeof Bell> = {
  'application-viewed': Mail, 'application-shortlisted': Star, 'interview-scheduled': Calendar,
  'status-changed': Briefcase, 'new-job': Briefcase, 'new-application': UserCheck, 'candidate-update': UserCheck,
  'job-approved': Check, 'job-rejected': Bell, 'report-filed': Bell, system: Bell,
};

export function NotificationsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [, setRefresh] = useState(0);
  const notifications = notificationService.getByUser(user!.id);

  const markAllRead = () => { notificationService.markAllAsRead(user!.id); setRefresh(r => r + 1); addToast('success', 'All notifications marked as read'); };
  const markRead = (id: string) => { notificationService.markAsRead(id); setRefresh(r => r + 1); };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-midnight">Notifications</h1>
        {notifications.some(n => !n.read) && (
          <button onClick={markAllRead} className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:text-primary-hover"><CheckCheck className="w-4 h-4" /> Mark all as read</button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-xl border border-light-slate p-12 text-center">
          <Bell className="w-12 h-12 text-light-slate mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-midnight mb-2">No notifications</h3>
          <p className="text-slate-text">You're all caught up!</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-light-slate/50 divide-y divide-light-slate/50">
          {notifications.map(n => {
            const Icon = typeIcons[n.type] || Bell;
            return (
              <div key={n.id} onClick={() => markRead(n.id)} className={`p-4 sm:p-5 flex items-start gap-4 hover:bg-gray-50/50 transition-colors cursor-pointer ${!n.read ? 'bg-primary-50/30' : ''}`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${!n.read ? 'bg-primary-100' : 'bg-gray-100'}`}>
                  <Icon className={`w-5 h-5 ${!n.read ? 'text-primary' : 'text-slate-text'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm ${!n.read ? 'font-semibold text-midnight' : 'font-medium text-slate-text'}`}>{n.title}</p>
                    <span className="text-xs text-slate-text whitespace-nowrap">{formatRelativeDate(n.createdAt)}</span>
                  </div>
                  <p className="text-sm text-slate-text mt-0.5">{n.message}</p>
                  {n.link && <Link to={n.link} className="text-xs text-primary font-medium mt-1 inline-block hover:text-primary-hover">View Details →</Link>}
                </div>
                {!n.read && <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-2" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export { NotificationsPage as StudentNotifications };
