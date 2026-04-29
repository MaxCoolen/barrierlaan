import { useState } from 'react'
import BottomSheet from '@/components/ui/BottomSheet'
import { usePlanningStore } from '@/stores/usePlanningStore'
import { useToast } from '@/hooks/useToast'

interface Props { open: boolean; onClose: () => void }

export default function PlanningAddSheet({ open, onClose }: Props) {
  const addEvent = usePlanningStore((s) => s.addEvent)
  const toast = useToast()
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !date) return
    addEvent(title.trim(), date, description.trim() || undefined)
    toast('Event toegevoegd! 📅')
    setTitle(''); setDate(''); setDescription('')
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Event toevoegen">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-warm-gray mb-1.5">Titel *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Bijv. Sleuteloverdracht"
            className="input-field"
            autoFocus
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-warm-gray mb-1.5">Datum *</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="block text-xs font-medium text-warm-gray mb-1.5">Beschrijving <span className="font-normal text-warm-muted">(optioneel)</span></label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Extra details..."
            rows={3}
            className="input-field resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={!title.trim() || !date}
          className="w-full btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Toevoegen
        </button>
      </form>
    </BottomSheet>
  )
}
