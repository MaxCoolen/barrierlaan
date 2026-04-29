import { useState } from 'react'
import { useKostenStore } from '@/stores/useKostenStore'
import type { KostenCategory } from '@/types'
import { formatCurrency } from '@/utils/formatCurrency'
import EmptyState from '@/components/ui/EmptyState'
import KostenItem from './KostenItem'
import KostenAddSheet from './KostenAddSheet'
import RecurringSection from './RecurringSection'

const CATEGORIES: KostenCategory[] = ['Woning', 'Meubels', 'Verbouwing', 'Transport', 'Diversen']

const CAT_META: Record<KostenCategory, { icon: string; color: string; bar: string }> = {
  Woning:     { icon: '🏠', color: 'text-olive-700',  bar: 'bg-olive-600' },
  Meubels:    { icon: '🛋️', color: 'text-terra-500',  bar: 'bg-terra-400' },
  Verbouwing: { icon: '🔨', color: 'text-amber-700',  bar: 'bg-amber-500' },
  Transport:  { icon: '🚛', color: 'text-warm-gray',  bar: 'bg-warm-gray' },
  Diversen:   { icon: '📦', color: 'text-olive-600',  bar: 'bg-sand-300' },
}

type Tab = 'eenmalig' | 'vast'

// ── Budget editor ─────────────────────────────────────────────────────────────
function BudgetCard({ budget, grand }: { budget: number | null; grand: number }) {
  const setBudget = useKostenStore((s) => s.setBudget)
  const [editing, setEditing] = useState(false)
  const [input, setInput] = useState('')

  function handleSave() {
    const val = parseFloat(input.replace(',', '.'))
    setBudget(isNaN(val) || val <= 0 ? null : val)
    setEditing(false)
    setInput('')
  }

  if (editing) {
    return (
      <div className="mx-4 mb-3 card p-4">
        <p className="text-xs font-medium text-warm-gray mb-2">Budget instellen (€)</p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray text-sm">€</span>
            <input
              type="number"
              inputMode="decimal"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSave() }}
              placeholder="bijv. 15000"
              className="input-field pl-8"
              autoFocus
            />
          </div>
          <button onClick={handleSave} className="px-4 py-2.5 bg-terra-400 text-white rounded-xl text-sm font-medium">Sla op</button>
          {budget !== null && (
            <button onClick={() => { setBudget(null); setEditing(false) }} className="px-3 py-2.5 border border-sand-200 rounded-xl text-sm text-warm-gray">✕</button>
          )}
        </div>
      </div>
    )
  }

  if (budget === null) {
    return (
      <div className="mx-4 mb-3">
        <button
          onClick={() => setEditing(true)}
          className="w-full card p-3.5 flex items-center gap-2 text-warm-gray text-sm border-dashed active:opacity-70 transition-opacity"
        >
          <svg className="w-4 h-4 text-warm-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Budget instellen
        </button>
      </div>
    )
  }

  const pct = Math.min((grand / budget) * 100, 100)
  const overBudget = grand > budget
  const remaining = budget - grand

  return (
    <div className="mx-4 mb-3 card p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[10px] text-warm-muted uppercase tracking-wide font-medium">Budget</p>
          <p className="font-display text-lg text-olive-800 leading-tight">{formatCurrency(budget)}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-warm-muted">{overBudget ? 'over budget' : 'over'}</p>
          <p className={`font-display text-lg font-semibold leading-tight ${overBudget ? 'text-terra-500' : 'text-olive-600'}`}>
            {overBudget ? '+' : ''}{formatCurrency(Math.abs(remaining))}
          </p>
        </div>
      </div>
      {/* Progress bar */}
      <div className="h-2.5 bg-sand-100 rounded-full overflow-hidden mb-1">
        <div
          className={`h-full rounded-full transition-all duration-700 ${overBudget ? 'bg-terra-400' : 'bg-olive-600'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between items-center">
        <p className="text-[10px] text-warm-muted">{Math.round(pct)}% gebruikt</p>
        <button onClick={() => { setInput(String(budget)); setEditing(true) }} className="text-[11px] text-terra-400 font-medium">
          Aanpassen
        </button>
      </div>
    </div>
  )
}

// ── Category chart ────────────────────────────────────────────────────────────
function CategoryChart({ items }: { items: ReturnType<typeof useKostenStore.getState>['items'] }) {
  const totals = CATEGORIES.map((cat) => ({
    cat,
    total: items.filter((i) => i.category === cat).reduce((a, b) => a + b.amount, 0),
    paid:  items.filter((i) => i.category === cat && i.paid).reduce((a, b) => a + b.amount, 0),
  })).filter((c) => c.total > 0)

  if (totals.length === 0) return null

  const max = Math.max(...totals.map((c) => c.total))

  return (
    <div className="mx-4 mb-4 card p-4">
      <p className="text-[10px] text-warm-muted uppercase tracking-wide font-medium mb-3">Per categorie</p>
      <div className="space-y-3">
        {totals.sort((a, b) => b.total - a.total).map(({ cat, total, paid }) => {
          const meta = CAT_META[cat]
          const widthPct = (total / max) * 100
          const paidPct = (paid / total) * 100
          return (
            <div key={cat}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-olive-700 font-medium flex items-center gap-1.5">
                  <span>{meta.icon}</span>{cat}
                </span>
                <span className="text-xs font-semibold text-olive-800 font-display">{formatCurrency(total)}</span>
              </div>
              {/* Bar: betaald deel + onbetaald deel */}
              <div className="h-2 bg-sand-100 rounded-full overflow-hidden">
                <div className="h-full flex rounded-full overflow-hidden" style={{ width: `${widthPct}%` }}>
                  <div className={`h-full ${meta.bar}`} style={{ width: `${paidPct}%` }} />
                  <div className={`h-full ${meta.bar} opacity-25`} style={{ width: `${100 - paidPct}%` }} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-sand-100">
        <span className="flex items-center gap-1.5 text-[10px] text-warm-muted">
          <span className="w-2 h-2 rounded-full bg-olive-600 inline-block" />Betaald
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-warm-muted">
          <span className="w-2 h-2 rounded-full bg-sand-300 inline-block" />Nog te betalen
        </span>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function KostenPage() {
  const { items, budget } = useKostenStore()
  const [activeTab, setActiveTab] = useState<Tab>('eenmalig')
  const [catFilter, setCatFilter] = useState<KostenCategory | 'Alle'>('Alle')
  const [onlyUnpaid, setOnlyUnpaid] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)

  const totalPaid   = items.filter((i) => i.paid).reduce((a, b) => a + b.amount, 0)
  const totalUnpaid = items.filter((i) => !i.paid).reduce((a, b) => a + b.amount, 0)
  const grand       = totalPaid + totalUnpaid
  const paidPct     = grand > 0 ? (totalPaid / grand) * 100 : 0

  const filtered = items
    .filter((i) => catFilter === 'Alle' || i.category === catFilter)
    .filter((i) => !onlyUnpaid || !i.paid)
    .sort((a, b) => {
      // Onbetaald boven, daarna op datum/aanmaak
      if (a.paid !== b.paid) return a.paid ? 1 : -1
      return b.createdAt.localeCompare(a.createdAt)
    })

  return (
    <div className="min-h-full pb-24">

      {/* ── Hero summary ───────────────────────────────────────────────── */}
      <div className="px-4 pt-5 pb-3">
        <div className="card overflow-hidden">
          {/* Top: totaal */}
          <div className="px-4 pt-4 pb-3">
            <p className="text-[10px] text-warm-muted uppercase tracking-widest font-medium mb-1">Totale kosten</p>
            <p className="font-display text-4xl text-olive-800 font-semibold leading-none">
              {formatCurrency(grand)}
            </p>
          </div>

          {/* Stacked progress bar */}
          {grand > 0 && (
            <div className="px-4 pb-3">
              <div className="h-3 bg-sand-100 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-olive-600 transition-all duration-700 rounded-l-full"
                  style={{ width: `${paidPct}%` }}
                />
                <div
                  className="h-full bg-terra-300 transition-all duration-700"
                  style={{ width: `${100 - paidPct}%` }}
                />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[10px] text-olive-600 font-medium">{Math.round(paidPct)}% betaald</span>
                <span className="text-[10px] text-terra-500 font-medium">{Math.round(100 - paidPct)}% open</span>
              </div>
            </div>
          )}

          {/* Betaald / Te betalen split */}
          <div className="grid grid-cols-2 border-t border-sand-100">
            <div className="px-4 py-3 border-r border-sand-100">
              <p className="text-[10px] text-warm-muted mb-0.5">Betaald</p>
              <p className="font-display text-lg text-olive-700 font-semibold">{formatCurrency(totalPaid)}</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-[10px] text-warm-muted mb-0.5">Te betalen</p>
              <p className="font-display text-lg text-terra-500 font-semibold">{formatCurrency(totalUnpaid)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Budget ─────────────────────────────────────────────────────── */}
      <BudgetCard budget={budget} grand={grand} />

      {/* ── Category chart ─────────────────────────────────────────────── */}
      <CategoryChart items={items} />

      {/* ── Tabs ───────────────────────────────────────────────────────── */}
      <div className="px-4 mb-4">
        <div className="flex bg-sand-100 rounded-xl p-1 gap-1">
          <button
            onClick={() => setActiveTab('eenmalig')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === 'eenmalig' ? 'bg-white text-olive-800 shadow-warm-xs' : 'text-warm-gray'}`}
          >
            Eenmalig {items.length > 0 && <span className="opacity-60">({items.length})</span>}
          </button>
          <button
            onClick={() => setActiveTab('vast')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === 'vast' ? 'bg-white text-olive-800 shadow-warm-xs' : 'text-warm-gray'}`}
          >
            Vaste lasten
          </button>
        </div>
      </div>

      {activeTab === 'eenmalig' ? (
        <div className="px-4">
          {/* Categorie filter */}
          {items.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2 mb-3" style={{ scrollbarWidth: 'none' }}>
              {(['Alle', ...CATEGORIES] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCatFilter(cat)}
                  className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                    catFilter === cat
                      ? 'bg-terra-400 text-white shadow-warm-sm'
                      : 'bg-white text-warm-gray border border-sand-200'
                  }`}
                >
                  {cat !== 'Alle' && CAT_META[cat as KostenCategory].icon + ' '}{cat}
                </button>
              ))}
            </div>
          )}

          {/* Onbetaald toggle */}
          {items.length > 0 && (
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-warm-muted">{filtered.length} posten</p>
              <button
                onClick={() => setOnlyUnpaid((v) => !v)}
                className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border transition-all ${
                  onlyUnpaid
                    ? 'bg-terra-400/10 text-terra-500 border-terra-300/30'
                    : 'text-warm-gray border-sand-200 bg-white'
                }`}
              >
                <span className={`w-3 h-3 rounded-full border flex items-center justify-center transition-all ${onlyUnpaid ? 'bg-terra-400 border-terra-400' : 'border-sand-300'}`}>
                  {onlyUnpaid && <span className="w-1.5 h-1.5 bg-white rounded-full block" />}
                </span>
                Alleen onbetaald
              </button>
            </div>
          )}

          {filtered.length === 0 ? (
            <EmptyState
              icon="💸"
              title={items.length === 0 ? 'Nog geen kosten' : 'Geen posten gevonden'}
              subtitle={items.length === 0 ? 'Voeg je eerste kostenpost toe! 💸' : 'Probeer een andere filter'}
            />
          ) : (
            <div className="space-y-2">
              {filtered.map((item) => <KostenItem key={item.id} item={item} />)}
            </div>
          )}
        </div>
      ) : (
        <RecurringSection />
      )}

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
