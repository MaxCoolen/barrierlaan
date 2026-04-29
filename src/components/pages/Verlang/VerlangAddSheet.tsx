import { useState } from 'react'
import BottomSheet from '@/components/ui/BottomSheet'
import { useVerlangStore } from '@/stores/useVerlangStore'
import { useToast } from '@/hooks/useToast'
import type { Priority, Person } from '@/types'

interface Props { open: boolean; onClose: () => void }

export default function VerlangAddSheet({ open, onClose }: Props) {
  const addItem = useVerlangStore((s) => s.addItem)
  const toast = useToast()
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [url, setUrl] = useState('')
  const [priority, setPriority] = useState<Priority>('Middel')
  const [addedBy, setAddedBy] = useState<Person>('Max')

  const priorityConfig: { value: Priority; label: string; active: string }[] = [
    { value: 'Hoog', label: '🔴 Hoog', active: 'bg-terra-400 text-white border-terra-400' },
    { value: 'Middel', label: '🟡 Middel', active: 'bg-olive-700 text-white border-olive-700' },
    { value: 'Laag', label: '⚪ Laag', active: 'bg-sand-300 text-olive-800 border-sand-300' },
  ]

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    const safeUrl = url.trim() ? (url.startsWith('http') ? url : `https://${url}`) : undefined
    addItem(title.trim(), priority, addedBy, notes.trim() || undefined, safeUrl)
    toast('Wens toegevoegd! 💝')
    setTitle(''); setNotes(''); setUrl(''); setPriority('Middel'); setAddedBy('Max')
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Wens toevoegen">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-warm-gray mb-1.5">Naam *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Bijv. Nieuwe bank"
            className="input-field"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-warm-gray mb-1.5">Prioriteit</label>
          <div className="flex gap-2">
            {priorityConfig.map(({ value, label, active }) => (
              <button
                key={value}
                type="button"
                onClick={() => setPriority(value)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                  priority === value ? active : 'bg-white text-warm-gray border-sand-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-warm-gray mb-1.5">Notitie <span className="font-normal text-warm-muted">(optioneel)</span></label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Extra info over deze wens..."
            rows={2}
            className="input-field resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-warm-gray mb-1.5">Link <span className="font-normal text-warm-muted">(optioneel)</span></label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="ikea.com/..."
            className="input-field"
            inputMode="url"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-warm-gray mb-1.5">Toegevoegd door</label>
          <div className="flex gap-2">
            {(['Max', 'Medina'] as Person[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setAddedBy(p)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                  addedBy === p
                    ? 'bg-terra-400 text-white border-terra-400'
                    : 'bg-white text-warm-gray border-sand-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!title.trim()}
          className="w-full btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Toevoegen
        </button>
      </form>
    </BottomSheet>
  )
}
