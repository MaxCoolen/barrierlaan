import { useState, useMemo } from 'react'
import { useDozenStore } from '@/stores/useDozenStore'
import type { DozenRoom, DozenStatus } from '@/types'
import EmptyState from '@/components/ui/EmptyState'
import DozenCard from './DozenCard'
import DozenAddSheet from './DozenAddSheet'
import DozenDetail from './DozenDetail'

export const roomConfig: Record<DozenRoom, { bg: string; text: string; dot: string }> = {
  Woonkamer:  { bg: 'bg-terra-400/15', text: 'text-terra-500',  dot: '#C0714A' },
  Slaapkamer: { bg: 'bg-sand-200',     text: 'text-olive-700',  dot: '#C9B89A' },
  Keuken:     { bg: 'bg-olive-600/10', text: 'text-olive-700',  dot: '#5C6650' },
  Badkamer:   { bg: 'bg-sand-100',     text: 'text-warm-gray',  dot: '#8C7B6B' },
  Zolder:     { bg: 'bg-sand-300/30',  text: 'text-olive-800',  dot: '#B5A07E' },
  Garage:     { bg: 'bg-cream',        text: 'text-warm-gray',  dot: '#A89585' },
  Kantoor:    { bg: 'bg-olive-600/10', text: 'text-olive-600',  dot: '#4A5240' },
  Overig:     { bg: 'bg-sand-50',      text: 'text-warm-muted', dot: '#C9B89A' },
}

const statusConfig: Record<DozenStatus, { label: string; bg: string; text: string }> = {
  Ingepakt:    { label: 'Ingepakt',    bg: 'bg-terra-400/10', text: 'text-terra-500' },
  'In transit':{ label: 'In transit', bg: 'bg-sand-200',      text: 'text-olive-700' },
  Uitgepakt:   { label: 'Uitgepakt',  bg: 'bg-olive-600/10', text: 'text-olive-700' },
}

const ROOMS: DozenRoom[] = ['Woonkamer', 'Slaapkamer', 'Keuken', 'Badkamer', 'Zolder', 'Garage', 'Kantoor', 'Overig']

export { statusConfig }

export default function DozenPage() {
  const items = useDozenStore((s) => s.items)
  const [addOpen, setAddOpen] = useState(false)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterRoom, setFilterRoom] = useState<DozenRoom | 'Alle'>('Alle')
  const [filterStatus, setFilterStatus] = useState<DozenStatus | 'Alle'>('Alle')
  const [quickSearch, setQuickSearch] = useState(false)

  const filtered = useMemo(() => {
    return items.filter((d) => {
      if (filterRoom !== 'Alle' && d.room !== filterRoom) return false
      if (filterStatus !== 'Alle' && d.status !== filterStatus) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        return (
          String(d.number).includes(q) ||
          d.room.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q))
        )
      }
      return true
    })
  }, [items, search, filterRoom, filterStatus])

  const ingepakt = items.filter((d) => d.status === 'Ingepakt').length
  const uitgepakt = items.filter((d) => d.status === 'Uitgepakt').length
  const transit = items.filter((d) => d.status === 'In transit').length
  const pct = items.length > 0 ? Math.round((uitgepakt / items.length) * 100) : 0

  const detailItem = detailId ? items.find((i) => i.id === detailId) ?? null : null

  return (
    <div className="min-h-full">
      {/* Stats */}
      <div className="px-4 pt-5 pb-3">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-display text-olive-700 text-base">
              {uitgepakt} van {items.length} uitgepakt
            </span>
            <span className="text-sm font-medium text-terra-400">{pct}%</span>
          </div>
          <div className="h-2 bg-sand-100 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-olive-700 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-lg font-display font-semibold text-terra-400">{ingepakt}</p>
              <p className="text-[10px] text-warm-muted">Ingepakt</p>
            </div>
            <div>
              <p className="text-lg font-display font-semibold text-olive-600">{transit}</p>
              <p className="text-[10px] text-warm-muted">In transit</p>
            </div>
            <div>
              <p className="text-lg font-display font-semibold text-olive-700">{uitgepakt}</p>
              <p className="text-[10px] text-warm-muted">Uitgepakt</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="px-4 mb-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Zoek op nummer, kamer, inhoud..."
              className="w-full bg-white border border-sand-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-olive-800 placeholder-warm-muted focus:outline-none focus:border-terra-400 transition-colors"
            />
          </div>
          <button
            onClick={() => setQuickSearch(true)}
            className="shrink-0 w-11 h-11 bg-terra-400 text-white rounded-xl flex items-center justify-center shadow-warm-sm active:bg-terra-500 transition-colors"
            title="Doos op nummer zoeken"
          >
            #
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 mb-3 space-y-2">
        {/* Room filter */}
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {(['Alle', ...ROOMS] as const).map((r) => (
            <button
              key={r}
              onClick={() => setFilterRoom(r)}
              className={`shrink-0 px-3 py-1 rounded-xl text-xs font-medium transition-colors ${
                filterRoom === r
                  ? 'bg-terra-400 text-white'
                  : 'bg-white text-warm-gray border border-sand-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex gap-2">
          {(['Alle', 'Ingepakt', 'In transit', 'Uitgepakt'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s as DozenStatus | 'Alle')}
              className={`flex-1 py-1.5 rounded-xl text-[11px] font-medium transition-colors ${
                filterStatus === s
                  ? 'bg-olive-700 text-white'
                  : 'bg-white text-warm-gray border border-sand-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="px-4 pb-6">
        {items.length === 0 ? (
          <EmptyState
            icon="📦"
            title="Nog geen dozen"
            subtitle="Pak je eerste doos in! 📦"
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="Geen dozen gevonden"
            subtitle="Probeer een andere zoekterm of filter"
          />
        ) : (
          <div className="space-y-2">
            {filtered.map((item) => (
              <DozenCard
                key={item.id}
                item={item}
                onTap={() => setDetailId(item.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setAddOpen(true)}
        className="fixed bottom-20 right-4 w-14 h-14 bg-terra-400 text-white rounded-full shadow-warm-lg flex items-center justify-center text-2xl active:bg-terra-500 active:scale-95 transition-all z-30"
        aria-label="Doos toevoegen"
      >
        +
      </button>

      <DozenAddSheet open={addOpen} onClose={() => setAddOpen(false)} />

      {detailItem && (
        <DozenDetail item={detailItem} onClose={() => setDetailId(null)} />
      )}

      {/* Quick number search modal */}
      {quickSearch && (
        <QuickNumberSearch
          onClose={() => setQuickSearch(false)}
          onSearch={(n) => { setSearch(String(n)); setQuickSearch(false) }}
        />
      )}
    </div>
  )
}

function QuickNumberSearch({ onClose, onSearch }: { onClose: () => void; onSearch: (n: number) => void }) {
  const [num, setNum] = useState('')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 sheet-backdrop" />
      <div className="relative w-full max-w-xs bg-cream rounded-3xl shadow-warm-xl p-6 animate-bounce-in" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-display text-xl text-olive-800 mb-2">Doos zoeken</h3>
        <p className="text-xs text-warm-gray mb-4">Voer het dozenummer in</p>
        <input
          type="number"
          inputMode="numeric"
          value={num}
          onChange={(e) => setNum(e.target.value)}
          placeholder="0"
          className="w-full text-center text-4xl font-display text-olive-800 bg-sand-100 rounded-2xl py-4 mb-4 focus:outline-none focus:ring-2 focus:ring-terra-400 border-none"
          autoFocus
        />
        <button
          onClick={() => num && onSearch(parseInt(num))}
          disabled={!num}
          className="w-full btn-primary disabled:opacity-40"
        >
          Zoeken
        </button>
      </div>
    </div>
  )
}
