import { useEffect, useState } from 'react'
import type { ToastMessage } from '@/types'
import { useToastStore } from '@/stores/useToastStore'

function ToastItem({ toast }: { toast: ToastMessage }) {
  const dismiss = useToastStore((s) => s.dismiss)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setLeaving(true), 2700)
    return () => clearTimeout(t)
  }, [])

  const icons: Record<ToastMessage['type'], string> = {
    success: '✓',
    error: '✕',
    info: 'i',
  }

  const colors: Record<ToastMessage['type'], string> = {
    success: 'bg-olive-700 text-white',
    error: 'bg-terra-500 text-white',
    info: 'bg-sand-200 text-olive-800',
  }

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-warm-lg text-sm font-medium max-w-xs mx-auto ${colors[toast.type]} ${
        leaving ? 'animate-toast-out' : 'animate-toast-in'
      }`}
      onClick={() => dismiss(toast.id)}
    >
      <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold shrink-0">
        {icons[toast.type]}
      </span>
      <span>{toast.message}</span>
    </div>
  )
}

export default function ToastProvider() {
  const toasts = useToastStore((s) => s.toasts)

  return (
    <div className="fixed bottom-24 left-0 right-0 z-50 flex flex-col gap-2 items-center px-4 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} />
        </div>
      ))}
    </div>
  )
}
