import { useState } from 'react'
import { useKoopStore } from '@/stores/useKoopStore'
import EmptyState from '@/components/ui/EmptyState'
import KoopItem from './KoopItem'
import KoopAddSheet from './KoopAddSheet'

type Filter = 'Alle' | 'Te kopen' | 'Gekocht'

export default function KoopPage() {
  const items = useKoopStore((s) => s.items)
  const [filter, setFilter] = useState<Filter>('Alle')
  const [sheetOpen, setSheetOpen] = useState(false)

  const filtered = items.filter((i) => {
    if (filter === 'Te kopen') return !i.bought
    if (filter === 'Gekocht') return i.bought
    return true
  })

  const bought = items.filter((i) => i.bought).length
  const total = items.length

  return (
    <div className="min-h-full">
      {/* Summary */}
      <div className="px-4 pt-5 pb-4">
        <div className="card p-4 flex items-center gap-4">
          <div className="flex-1">
            <p className="text-2xl font-display text-olive-800 font-semibold">{bought}<span className="text-warm-gray font-normal text-lg"> / {total}</span></p>
            <p className="text-xs text-warm-gray mt-0.5">items gekocht</p>
          </div>
          {total > 0 && (
            <div className="w-12 h-12 rounded-full border-4 border-sand-200 relative flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#EDE5D8" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15.9" fill="none"
                  stroke="#C0714A" strokeWidth="3"
                  strokeDasharray={`${total > 0 ? (bought / total) * 100 : 0} 100`}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
              <span className="text-[10px] font-bold text-terra-400 relative z-10">
                {total > 0 ? Math.round((bought / total) * 100) : 0}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Filter */}
      <div className="px-4 mb-4">
        <div className="flex bg-sand-100 rounded-xl p-1 gap-1">
          {(['Alle', 'Te kopen', 'Gekocht'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === f
                  ? 'bg-white text-olive-800 shadow-warm-xs'
                  : 'text-warm-gray'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="px-4 pb-6">
        {filtered.length === 0 ? (
          <EmptyState
            icon="🛒"
            title={filter === 'Alle' ? 'Boodschappenlijst is leeg' : filter === 'Gekocht' ? 'Nog niets gekocht' : 'Alles gekocht!'}
            subtitle={filter === 'Alle' ? 'Voeg je eerste item toe! 🛒' : filter === 'Gekocht' ? 'Vink items af om ze hier te zien' : 'Wat een held! 🎉'}
          />
        ) : (
          <div className="space-y-2">
            {filtered.map((item) => (
              <KoopItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setSheetOpen(true)}
        className="fixed bottom-20 right-4 w-14 h-14 bg-terra-400 text-white rounded-full shadow-warm-lg flex items-center justify-center text-2xl active:bg-terra-500 active:scale-95 transition-all z-30"
        aria-label="Item toevoegen"
      >
        +
      </button>

      <KoopAddSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </div>
  )
}
