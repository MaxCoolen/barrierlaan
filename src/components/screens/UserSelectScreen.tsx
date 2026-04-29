import { useUserStore } from '@/stores/useUserStore'
import type { Person } from '@/types'

export default function UserSelectScreen() {
  const setUser = useUserStore((s) => s.setUser)

  function handleSelect(user: Person) {
    setUser(user)
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6">
      {/* Logo area */}
      <div className="text-center mb-10">
        <div className="text-6xl mb-4">🏡</div>
        <h1 className="font-display text-3xl text-olive-800 leading-tight">
          Barriërlaan 78
        </h1>
        <p className="text-warm-gray mt-2 text-sm">Welkom bij jullie verhuisplanner</p>
      </div>

      {/* Question */}
      <div className="w-full max-w-xs">
        <p className="font-display text-xl text-olive-700 text-center mb-6">
          Wie ben jij?
        </p>

        <div className="space-y-3">
          <button
            onClick={() => handleSelect('Max')}
            className="w-full py-5 rounded-3xl bg-terra-400 text-white font-display text-2xl shadow-warm-lg active:bg-terra-500 active:scale-[0.98] transition-all"
          >
            👤 Max
          </button>
          <button
            onClick={() => handleSelect('Medina')}
            className="w-full py-5 rounded-3xl bg-olive-700 text-white font-display text-2xl shadow-warm-lg active:bg-olive-800 active:scale-[0.98] transition-all"
          >
            👤 Medina
          </button>
        </div>

        <p className="text-center text-warm-muted text-xs mt-6">
          Je keuze wordt onthouden op dit apparaat
        </p>
      </div>
    </div>
  )
}
