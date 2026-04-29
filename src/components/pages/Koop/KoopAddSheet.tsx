import { useState } from 'react'
import BottomSheet from '@/components/ui/BottomSheet'
import { useKoopStore } from '@/stores/useKoopStore'
import { useToast } from '@/hooks/useToast'

interface Props { open: boolean; onClose: () => void }

export default function KoopAddSheet({ open, onClose }: Props) {
  const addItem = useKoopStore((s) => s.addItem)
  const toast = useToast()
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [store, setStore] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    addItem(name.trim(), quantity, store.trim() || undefined)
    toast('Item toegevoegd! 🛒')
    setName(''); setQuantity(1); setStore('')
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Item toevoegen">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-warm-gray mb-1.5">Naam *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Bijv. Verfroller"
            className="input-field"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-warm-gray mb-1.5">Aantal</label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-xl bg-sand-100 text-olive-700 font-bold text-lg flex items-center justify-center active:bg-sand-200 transition-colors"
            >−</button>
            <span className="text-xl font-display text-olive-800 min-w-[2rem] text-center">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 rounded-xl bg-sand-100 text-olive-700 font-bold text-lg flex items-center justify-center active:bg-sand-200 transition-colors"
            >+</button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-warm-gray mb-1.5">Winkel <span className="text-warm-muted font-normal">(optioneel)</span></label>
          <input
            type="text"
            value={store}
            onChange={(e) => setStore(e.target.value)}
            placeholder="Bijv. IKEA, Action, Gamma"
            className="input-field"
          />
        </div>

        <button
          type="submit"
          disabled={!name.trim()}
          className="w-full btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Toevoegen
        </button>
      </form>
    </BottomSheet>
  )
}
