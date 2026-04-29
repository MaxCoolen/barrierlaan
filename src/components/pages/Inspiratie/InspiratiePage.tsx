import { useEffect, useState } from 'react'
import { useInspiratieStore } from '@/stores/useInspiratieStore'
import type { Person } from '@/types'
import EmptyState from '@/components/ui/EmptyState'
import InspiratieCard from './InspiratieCard'
import InspiratieAddSheet from './InspiratieAddSheet'

type Filter = 'Alle' | 'Favorieten' | 'Max' | 'Medina' | 'Allebei ✓' | 'Nog stemmen'

export default function InspiratiePage() {
  const { items, markAllRead } = useInspiratieStore()
  const [filter, setFilter] = useState<Filter>('Alle')
  const [sheetOpen, setSheetOpen] = useState(false)

  useEffect(() => {
    markAllRead()
  }, [markAllRead])

  const filtered = items.filter((i) => {
    const votes = i.votes ?? { max: null, medina: null }
    if (filter === 'Favorieten') return i.favorite
    if (filter === 'Max' || filter === 'Medina') return i.addedBy === (filter as Person)
    if (filter === 'Allebei ✓') return votes.max === 'ja' && votes.medina === 'ja'
    if (filter === 'Nog stemmen') return votes.max === null || votes.medina === null
    return true
  })

  const filters: Filter[] = ['Alle', 'Favorieten', 'Max', 'Medina', 'Allebei ✓', 'Nog stemmen']

  return (
    <div className="min-h-full">
      {/* Filter */}
      <div className="px-4 pt-5 pb-4">
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                filter === f
                  ? 'bg-terra-400 text-white shadow-warm-sm'
                  : 'bg-white text-warm-gray border border-sand-200'
              }`}
            >
              {f === 'Favorieten' ? '♥ Favorieten' : f}
            </button>
          ))}
        </div>
      </div>

      {items.length > 0 && (
        <div className="px-4 mb-3">
          <p className="text-xs text-warm-muted">{filtered.length} {filtered.length === 1 ? 'item' : 'items'}</p>
        </div>
      )}

      <div className="px-4 pb-6">
        {filtered.length === 0 ? (
          <EmptyState
            icon="🛋️"
            title={filter === 'Alle' ? 'Nog geen inspiratie' : 'Geen items gevonden'}
            subtitle={filter === 'Alle' ? 'Voeg je eerste link toe! 🛋️' : 'Probeer een andere filter'}
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <InspiratieCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => setSheetOpen(true)}
        className="fixed bottom-20 right-4 w-14 h-14 bg-terra-400 text-white rounded-full shadow-warm-lg flex items-center justify-center text-2xl active:bg-terra-500 active:scale-95 transition-all z-30"
        aria-label="Link toevoegen"
      >
        +
      </button>

      <InspiratieAddSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </div>
  )
}
