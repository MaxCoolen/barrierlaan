import { useState } from 'react'
import { useKostenStore } from '@/stores/useKostenStore'
import type { KostenCategory } from '@/types'
import EmptyState from '@/components/ui/EmptyState'
import { formatCurrency } from '@/utils/formatCurrency'
import KostenItem from './KostenItem'
import KostenAddSheet from './KostenAddSheet'
import RecurringSection from './RecurringSection'

const CATEGORIES: KostenCategory[] = ['Woning', 'Meubels', 'Verbouwing', 'Transport', 'Diversen']

export default function KostenPage() {
  const items = useKostenStore((s) => s.items)
  const [filter, setFilter] = useState<KostenCategory | 'Alle'>('Alle')
  const [sheetOpen, setSheetOpen] = useState(false)

  const filtered = filter === 'Alle' ? items : items.filter((i) => i.category === filter)
  const totalPaid = items.filter((i) => i.paid).reduce((a, b) => a + b.amount, 0)
  const totalUnpaid = items.filter((i) => !i.paid).reduce((a, b) => a + b.amount, 0)
  const grand = totalPaid + totalUnpaid

  return (
    <div className="min-h-full">
      {/* Summary */}
      <div className="px-4 pt-5 pb-4 space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <div className="card p-3 text-center">
            <p className="text-[10px] text-warm-gray mb-1">Totaal</p>
            <p className="font-display text-base text-olive-800 leading-tight">{formatCurrency(grand)}</p>
          </div>
          <div className="card p-3 text-center border-olive-600/20" style={{ borderColor: 'rgba(90,102,80,0.15)', background: 'rgba(90,102,80,0.04)' }}>
            <p className="text-[10px] text-olive-600 mb-1">Betaald</p>
            <p className="font-display text-base text-olive-700 leading-tight">{formatCurrency(totalPaid)}</p>
          </div>
          <div className="card p-3 text-center" style={{ borderColor: 'rgba(192,113,74,0.2)', background: 'rgba(192,113,74,0.04)' }}>
            <p className="text-[10px] text-terra-500 mb-1">Te betalen</p>
            <p className="font-display text-base text-terra-500 leading-tight">{formatCurrency(totalUnpaid)}</p>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {(['Alle', ...CATEGORIES] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                filter === cat
                  ? 'bg-terra-400 text-white shadow-warm-sm'
                  : 'bg-white text-warm-gray border border-sand-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Items */}
      <div className="px-4 pb-4">
        <h2 className="section-header mb-3">Eenmalige kosten</h2>
        {filtered.length === 0 ? (
          <EmptyState
            icon="💸"
            title="Nog geen kosten"
            subtitle="Voeg je eerste kostenpost toe! 💸"
          />
        ) : (
          <div className="space-y-2">
            {filtered.map((item) => (
              <KostenItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Recurring */}
      <RecurringSection />

      <div className="h-6" />

      {/* FAB */}
      <button
        onClick={() => setSheetOpen(true)}
        className="fixed bottom-20 right-4 w-14 h-14 bg-terra-400 text-white rounded-full shadow-warm-lg flex items-center justify-center text-2xl active:bg-terra-500 active:scale-95 transition-all z-30"
        aria-label="Kosten toevoegen"
      >
        +
      </button>

      <KostenAddSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </div>
  )
}
