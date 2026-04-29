import { useNotificationStore } from '@/stores/useNotificationStore'
import { useToastStore } from '@/stores/useToastStore'

export function useNotify() {
  const addActivity = useNotificationStore((s) => s.addActivity)
  const showToast = useToastStore((s) => s.show)

  return async function notify(title: string, body: string, path: string) {
    addActivity(body, path)
    showToast(body)

    if (
      document.visibilityState === 'hidden' &&
      'Notification' in window &&
      Notification.permission === 'granted' &&
      'serviceWorker' in navigator
    ) {
      try {
        const reg = await navigator.serviceWorker.ready
        await reg.showNotification(title, {
          body,
          icon: './favicon.svg',
          badge: './favicon.svg',
          data: { path },
          vibrate: [100, 50, 100],
          tag: path,
        } as NotificationOptions)
      } catch (e) {
        console.warn('Notificatie mislukt:', e)
      }
    }
  }
}
