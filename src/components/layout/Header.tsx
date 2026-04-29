import { useState } from 'react'
import { useUserStore } from '@/stores/useUserStore'
import NotificationBell from '@/components/ui/NotificationBell'

export default function Header() {
  const { currentUser, setUser } = useUserStore()
  const [switcher, setSwitcher] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-cream/90 backdrop-blur-md border-b border-sand-100">
      <div className="px-4 h-16 flex items-center justify-between gap-3">
        {/* Title */}
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-xl text-olive-800 leading-tight truncate">
            Max &amp; Medina <span className="text-base">🏡</span>
          </h1>
          <p className="text-[10px] text-warm-gray font-body tracking-wide">
            Barriërlaan 78 — Ons nieuwe thuis
          </p>
        </div>

        {/* Right side */}
        <div className="shrink-0 flex items-center gap-1">
          <NotificationBell />

          {/* User chip */}
          {currentUser && (
            <div className="relative">
              <button
                onClick={() => setSwitcher(!switcher)}
                className="flex items-center gap-1.5 bg-sand-100 rounded-full px-3 py-1.5 text-xs font-medium text-olive-700 active:bg-sand-200 transition-colors"
              >
                <span className="text-sm">👤</span>
                <span>{currentUser}</span>
                <svg className={`w-3 h-3 text-warm-gray transition-transform ${switcher ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* User switcher dropdown */}
              {switcher && (
                <div className="absolute top-10 right-0 bg-white rounded-2xl shadow-warm-lg border border-sand-100 py-2 min-w-[130px] z-50 animate-bounce-in">
                  {(['Max', 'Medina'] as const).map((person) => (
                    <button
                      key={person}
                      onClick={() => { setUser(person); setSwitcher(false) }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        currentUser === person
                          ? 'text-terra-400 font-semibold bg-terra-400/5'
                          : 'text-olive-700 hover:bg-sand-50'
                      }`}
                    >
                      👤 {person}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
