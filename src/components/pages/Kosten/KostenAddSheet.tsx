import { useState } from 'react'
import BottomSheet from '@/components/ui/BottomSheet'
import { useKostenStore } from '@/stores/useKostenStore'
import { useToast } from '@/hooks/useToast'
import type { KostenCategory } from '@/types'

const CATEGORIES: KostenCategory[] = ['Woning', 'Meubels', 'Verbouwing', 'Transport', 'Diversen']

interface Props { open: boolean; onClose: () => void }

export default function KostenAddSheet({ open, onClose }: Props) {
  const addItem = useKostenStore((s) => s.addItem)
  const toast = useToast()
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<KostenCategory>('Diversen')
  const [date, setDate] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const num = parseFloat(amount.replace(',', '.'))
    if (!description.trim() || isNaN(num)) return
    addItem(description.trim(), num, category, date || undefined)
    toast('Kostenpost toegevoegd! 💰')
    setDescription(''); setAmount(''); setCategory('Diversen'); setDate('')
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Kosten toevoegen">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-warm-gray mb-1.5">Omschrijving *</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Bijv. Aanbetaling huurwoning"
            className="input-field"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-warm-gray mb-1.5">Bedrag (€) *</label>
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0,00"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-warm-gray mb-1.5">Categorie</label>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`py-2 px-2 rounded-xl text-xs font-medium border transition-all ${
                  category === cat
                    ? 'bg-terra-400 text-white border-terra-400'
                    : 'bg-white text-warm-gray border-sand-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-warm-gray mb-1.5">Datum <span className="font-normal text-warm-muted">(optioneel)</span></label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-field" />
        </div>

        <button
          type="submit"
          disabled={!description.trim() || !amount.trim()}
          className="w-full btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Toevoegen
        </button>
      </form>
    </BottomSheet>
  )
}
