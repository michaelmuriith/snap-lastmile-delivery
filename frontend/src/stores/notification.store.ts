import { create } from 'zustand';
import type { NotificationState, Notification } from '../types';
import { apiService } from '../services/api';

interface NotificationStore extends NotificationState {
  // Actions
  fetchNotifications: (page?: number, limit?: number) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (notification: Notification) => void;
  clearError: () => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  // Initial state
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  // Actions
  fetchNotifications: async (page = 1, limit = 20) => {
    set({ isLoading: true });
    try {
      const response = await apiService.getNotifications(page, limit);
      const unreadCount = response.data.filter(n => !n.isRead).length;

      set({
        notifications: response.data,
        unreadCount,
        isLoading: false,
      });
    } catch (error: any) {
      set({ isLoading: false });
      console.error('Failed to fetch notifications:', error);
    }
  },

  markAsRead: async (id: string) => {
    try {
      const updatedNotification = await apiService.markNotificationAsRead(id);
      set((state) => ({
        notifications: state.notifications.map(n =>
          n.id === id ? updatedNotification : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error: any) {
      console.error('Failed to mark notification as read:', error);
    }
  },

  markAllAsRead: async () => {
    try {
      // Mark all notifications as read in the backend
      const promises = get().notifications
        .filter(n => !n.isRead)
        .map(n => apiService.markNotificationAsRead(n.id));

      await Promise.all(promises);

      set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, isRead: true })),
        unreadCount: 0,
      }));
    } catch (error: any) {
      console.error('Failed to mark all notifications as read:', error);
    }
  },

  addNotification: (notification: Notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: notification.isRead ? state.unreadCount : state.unreadCount + 1,
    }));
  },

  clearError: () => {
    // No error state in this store currently
  },
}));