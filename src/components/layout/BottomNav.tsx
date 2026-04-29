import { NavLink } from 'react-router-dom'
import { useInspiratieStore } from '@/stores/useInspiratieStore'

const tabs = [
  { path: '/todo',       label: 'To-do',    icon: '📋' },
  { path: '/kooplijst',  label: 'Kopen',    icon: '🛒' },
  { path: '/kosten',     label: 'Kosten',   icon: '💰' },
  { path: '/planning',   label: 'Planning', icon: '📅' },
  { path: '/inspiratie', label: 'Ideeën',   icon: '🛋️', hasBadge: true },
  { path: '/dozen',      label: 'Dozen',    icon: '📦' },
  { path: '/verlang',    label: 'Verlang',  icon: '💝' },
]

export default function BottomNav() {
  const unreadCount = useInspiratieStore((s) => s.unreadCount)

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-cream/95 backdrop-blur-md border-t border-sand-100 pb-safe">
      <div className="flex items-stretch h-16">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-colors ${
                isActive ? 'text-terra-400' : 'text-warm-gray'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-terra-400" />
                )}
                <span className="relative text-lg leading-none">
                  {tab.icon}
                  {tab.hasBadge && unreadCount() > 0 && (
                    <span className="absolute -top-1 -right-1.5 min-w-[14px] h-3.5 bg-terra-400 rounded-full text-white text-[8px] font-bold flex items-center justify-center px-0.5">
                      {unreadCount()}
                    </span>
                  )}
                </span>
                <span className={`text-[8px] font-medium leading-none ${isActive ? 'text-terra-400' : 'text-warm-muted'}`}>
                  {tab.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
