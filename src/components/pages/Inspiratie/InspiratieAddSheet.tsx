import { useState } from 'react'
import BottomSheet from '@/components/ui/BottomSheet'
import { useInspiratieStore } from '@/stores/useInspiratieStore'
import { useToast } from '@/hooks/useToast'
import type { Person } from '@/types'

interface Props { open: boolean; onClose: () => void }

export default function InspiratieAddSheet({ open, onClose }: Props) {
  const addItem = useInspiratieStore((s) => s.addItem)
  const toast = useToast()
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [notes, setNotes] = useState('')
  const [addedBy, setAddedBy] = useState<Person>('Max')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !url.trim()) return
    const safeUrl = url.startsWith('http') ? url : `https://${url}`
    addItem(title.trim(), safeUrl, addedBy, notes.trim() || undefined)
    toast('Link toegevoegd! 🛋️')
    setTitle(''); setUrl(''); setNotes(''); setAddedBy('Max')
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Link toevoegen">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-warm-gray mb-1.5">Titel *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Bijv. IKEA KALLAX kast"
            className="input-field"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-warm-gray mb-1.5">URL *</label>
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
          <label className="block text-xs font-medium text-warm-gray mb-1.5">Notitie <span className="font-normal text-warm-muted">(optioneel)</span></label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Bijv. Past goed in de woonkamer"
            rows={2}
            className="input-field resize-none"
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
          disabled={!title.trim() || !url.trim()}
          className="w-full btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Toevoegen
        </button>
      </form>
    </BottomSheet>
  )
}
