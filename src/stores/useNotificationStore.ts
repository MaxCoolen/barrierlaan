import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ActivityItem } from '@/types'
import { generateId } from '@/utils/generateId'

interface NotificationState {
  activities: ActivityItem[]
  notifPermission: 'default' | 'granted' | 'denied'
  addActivity: (message: string, path: string) => void
  markAllRead: () => void
  setPermission: (perm: NotificationPermission) => void
  clearAll: () => void
  unreadCount: () => number
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      activities: [],
      notifPermission: 'default',
      addActivity: (message, path) =>
        set((s) => ({
          activities: [
            { id: generateId(), message, path, read: false, createdAt: new Date().toISOString() },
            ...s.activities,
          ].slice(0, 50), // keep last 50
        })),
      markAllRead: () =>
        set((s) => ({
          activities: s.activities.map((a) => ({ ...a, read: true })),
        })),
      setPermission: (perm) =>
        set({ notifPermission: perm as 'default' | 'granted' | 'denied' }),
      clearAll: () => set({ activities: [] }),
      unreadCount: () => get().activities.filter((a) => !a.read).length,
    }),
    { name: 'barrierlaan-notifications' }
  )
)
