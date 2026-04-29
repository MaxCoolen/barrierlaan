import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useNotificationStore } from '@/stores/useNotificationStore'
import { formatShortDate } from '@/utils/formatDate'
import { useNavigate } from 'react-router-dom'

export default function NotificationBell() {
  const { activities, unreadCount, markAllRead, clearAll, notifPermission, setPermission } =
    useNotificationStore()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const count = unreadCount()

  async function requestPermission() {
    if (!('Notification' in window)) return
    const result = await Notification.requestPermission()
    setPermission(result)
  }

  function handleOpen() {
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
    markAllRead()
  }

  function handleActivityClick(path: string) {
    handleClose()
    navigate(path)
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="relative w-9 h-9 rounded-full flex items-center justify-center text-warm-gray hover:bg-sand-100 active:bg-sand-200 transition-colors"
        aria-label="Meldingen"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-terra-400 rounded-full text-white text-[9px] font-bold flex items-center justify-center px-0.5">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {open && createPortal(
        <div className="fixed inset-0 z-50 flex items-end animate-fade-in" onClick={handleClose}>
          <div className="absolute inset-0 sheet-backdrop" />
          <div
            className="relative w-full max-w-lg mx-auto bg-cream rounded-t-4xl shadow-warm-xl animate-slide-up"
            style={{ maxHeight: '75vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-sand-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-2 pb-3 border-b border-sand-100">
              <h2 className="font-display text-xl text-olive-800">Meldingen</h2>
              <div className="flex items-center gap-2">
                {activities.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-xs text-warm-muted px-2 py-1 rounded-lg hover:bg-sand-100"
                  >
                    Wissen
                  </button>
                )}
                <button onClick={handleClose} className="w-8 h-8 rounded-full bg-sand-100 flex items-center justify-center text-warm-gray">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Permission banner */}
            {notifPermission !== 'granted' && notifPermission !== 'denied' && (
              <div className="mx-4 mt-3 p-3 bg-terra-400/10 rounded-xl border border-terra-300/30 flex items-center gap-3">
                <span className="text-xl">🔔</span>
                <div className="flex-1">
                  <p className="text-xs font-medium text-olive-800">Zet meldingen aan</p>
                  <p className="text-[11px] text-warm-gray">Ontvang een melding bij nieuwe activiteit</p>
                </div>
                <button
                  onClick={requestPermission}
                  className="shrink-0 text-xs font-medium text-terra-500 bg-white rounded-lg px-3 py-1.5 shadow-warm-xs"
                >
                  Aanzetten
                </button>
              </div>
            )}

            {/* Activity list */}
            <div className="overflow-y-auto px-4 py-3 pb-8" style={{ maxHeight: 'calc(75vh - 140px)' }}>
              {activities.length === 0 ? (
                <div className="py-10 text-center">
                  <span className="text-4xl block mb-3">🔔</span>
                  <p className="text-warm-gray text-sm">Nog geen meldingen</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {activities.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => handleActivityClick(a.path)}
                      className={`w-full text-left p-3 rounded-xl border transition-colors ${
                        a.read ? 'bg-white border-sand-100' : 'bg-terra-400/5 border-terra-300/30'
                      }`}
                    >
                      <p className={`text-sm leading-snug ${a.read ? 'text-warm-gray' : 'text-olive-800 font-medium'}`}>
                        {a.message}
                      </p>
                      <p className="text-[10px] text-warm-muted mt-1">
                        {formatShortDate(a.createdAt)}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
