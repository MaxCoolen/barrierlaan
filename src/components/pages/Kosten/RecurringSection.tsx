import { useState } from 'react'
import { useKostenStore } from '@/stores/useKostenStore'
import { useToast } from '@/hooks/useToast'
import { formatCurrency } from '@/utils/formatCurrency'
import BottomSheet from '@/components/ui/BottomSheet'
import Modal from '@/components/ui/Modal'
import type { RecurringBill } from '@/types'

function AddRecurringSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addRecurring = useKostenStore((s) => s.addRecurring)
  const toast = useToast()
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [frequency, setFrequency] = useState<RecurringBill['frequency']>('Maandelijks')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const num = parseFloat(amount.replace(',', '.'))
    if (!name.trim() || isNaN(num)) return
    addRecurring(name.trim(), num, frequency)
    toast('Vaste last toegevoegd!')
    setName(''); setAmount(''); setFrequency('Maandelijks')
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Vaste last toevoegen">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-warm-gray mb-1.5">Naam *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Bijv. Huur" className="input-field" autoFocus />
        </div>
        <div>
          <label className="block text-xs font-medium text-warm-gray mb-1.5">Bedrag (€) *</label>
          <input type="text" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0,00" className="input-field" />
        </div>
        <div>
          <label className="block text-xs font-medium text-warm-gray mb-1.5">Frequentie</label>
          <div className="flex gap-2">
            {(['Maandelijks', 'Jaarlijks'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFrequency(f)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                  frequency === f ? 'bg-terra-400 text-white border-terra-400' : 'bg-white text-warm-gray border-sand-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <button type="submit" disabled={!name.trim() || !amount.trim()} className="w-full btn-primary disabled:opacity-40">
          Toevoegen
        </button>
      </form>
    </BottomSheet>
  )
}

export default function RecurringSection() {
  const { recurring, deleteRecurring } = useKostenStore()
  const toast = useToast()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<RecurringBill | null>(null)

  const monthlyTotal = recurring.reduce((acc, r) => {
    return acc + (r.frequency === 'Maandelijks' ? r.amount : r.amount / 12)
  }, 0)

  return (
    <div className="px-4 pb-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="section-header">Vaste lasten</h2>
          {recurring.length > 0 && (
            <p className="text-xs text-warm-gray mt-0.5">≈ {formatCurrency(monthlyTotal)} / maand</p>
          )}
        </div>
        <button
          onClick={() => setSheetOpen(true)}
          className="flex items-center gap-1 text-terra-400 text-sm font-medium py-1 px-2 rounded-lg active:bg-terra-400/10 transition-colors"
        >
          <span className="text-lg leading-none">+</span> Toevoegen
        </button>
      </div>

      {recurring.length === 0 ? (
        <div className="card p-4 text-center">
          <p className="text-sm text-warm-muted">Geen vaste lasten toegevoegd</p>
        </div>
      ) : (
        <div className="space-y-2">
          {recurring.map((bill) => (
            <div key={bill.id} className="card p-3.5 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-olive-800 block truncate">{bill.name}</span>
                <span className="text-xs text-warm-muted">{bill.frequency}</span>
              </div>
              <span className="shrink-0 font-display text-sm text-olive-800 font-semibold">{formatCurrency(bill.amount)}</span>
              <button
                onClick={() => setDeleteTarget(bill)}
                className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-warm-muted hover:text-terra-400 hover:bg-terra-400/10 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <AddRecurringSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Vaste last verwijderen"
        message={`Weet je zeker dat je "${deleteTarget?.name}" wilt verwijderen?`}
        onConfirm={() => { if (deleteTarget) { deleteRecurring(deleteTarget.id); toast('Vaste last verwijderd', 'info') } }}
      />
    </div>
  )
}
