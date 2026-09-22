import type { Notification } from '../types';
import { mockNotifications } from '../data/mockApplications';

const NOTIF_KEY = 'getajob_notifications';

function getNotifs(): Notification[] {
  try {
    const stored = localStorage.getItem(NOTIF_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  localStorage.setItem(NOTIF_KEY, JSON.stringify(mockNotifications));
  return [...mockNotifications];
}

function saveNotifs(notifs: Notification[]) {
  localStorage.setItem(NOTIF_KEY, JSON.stringify(notifs));
}

export const notificationService = {
  getByUser(userId: string): Notification[] {
    return getNotifs()
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getUnreadCount(userId: string): number {
    return getNotifs().filter(n => n.userId === userId && !n.read).length;
  },

  markAsRead(id: string): void {
    const notifs = getNotifs();
    const index = notifs.findIndex(n => n.id === id);
    if (index !== -1) {
      notifs[index].read = true;
      saveNotifs(notifs);
    }
  },

  markAllAsRead(userId: string): void {
    const notifs = getNotifs();
    notifs.forEach(n => { if (n.userId === userId) n.read = true; });
    saveNotifs(notifs);
  },

  add(notification: Omit<Notification, 'id' | 'createdAt'>): Notification {
    const notifs = getNotifs();
    const newNotif: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    notifs.unshift(newNotif);
    saveNotifs(notifs);
    return newNotif;
  },

  create(notification: Omit<Notification, 'id' | 'createdAt' | 'read'> & { read?: boolean }): Notification {
    return this.add({ read: false, ...notification });
  },
};
