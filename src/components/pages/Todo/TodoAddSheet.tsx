import { useState } from 'react'
import BottomSheet from '@/components/ui/BottomSheet'
import { useTodoStore } from '@/stores/useTodoStore'
import { useToast } from '@/hooks/useToast'
import type { TodoCategory } from '@/types'

const CATEGORIES: TodoCategory[] = ['Algemeen', 'Administratief', 'Woning', 'Overig']

interface Props {
  open: boolean
  onClose: () => void
}

export default function TodoAddSheet({ open, onClose }: Props) {
  const addItem = useTodoStore((s) => s.addItem)
  const toast = useToast()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<TodoCategory>('Algemeen')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    addItem(title.trim(), category)
    toast('Taak toegevoegd! 📋')
    setTitle('')
    setCategory('Algemeen')
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Nieuwe taak">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-warm-gray mb-1.5">Taaknaam *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Bijv. Verhuurder contacteren"
            className="input-field"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-warm-gray mb-1.5">Categorie</label>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`py-2.5 px-3 rounded-xl text-sm font-medium border transition-all ${
                  category === cat
                    ? 'bg-terra-400 text-white border-terra-400 shadow-warm-sm'
                    : 'bg-white text-warm-gray border-sand-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!title.trim()}
          className="w-full btn-primary mt-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Taak toevoegen
        </button>
      </form>
    </BottomSheet>
  )
}
