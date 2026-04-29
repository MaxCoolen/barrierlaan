import { useState } from 'react'
import { useVerlangStore } from '@/stores/useVerlangStore'
import type { Priority } from '@/types'
import EmptyState from '@/components/ui/EmptyState'
import VerlangCard from './VerlangCard'
import VerlangAddSheet from './VerlangAddSheet'

const PRIORITIES: Priority[] = ['Hoog', 'Middel', 'Laag']

const priorityIcons: Record<Priority, string> = {
  Hoog: '🔴',
  Middel: '🟡',
  Laag: '⚪',
}

export default function VerlangPage() {
  const items = useVerlangStore((s) => s.items)
  const [sheetOpen, setSheetOpen] = useState(false)

  const priorityOrder: Record<Priority, number> = { Hoog: 0, Middel: 1, Laag: 2 }
  const sorted = [...items].sort((a, b) => {
    const po = priorityOrder[a.priority] - priorityOrder[b.priority]
    if (po !== 0) return po
    return b.createdAt.localeCompare(a.createdAt)
  })

  const acquired = items.filter((i) => i.acquired).length

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="px-4 pt-5 pb-4">
        <div className="card p-4 flex items-center gap-4">
          <div className="text-3xl">💝</div>
          <div>
            <p className="font-display text-olive-700 text-base">Verlanglijst</p>
            <p className="text-xs text-warm-gray mt-0.5">
              {acquired} van {items.length} verkregen
            </p>
          </div>
        </div>
      </div>

      {/* Items grouped by priority */}
      <div className="px-4 pb-6">
        {sorted.length === 0 ? (
          <EmptyState
            icon="💝"
            title="Verlanglijst is leeg"
            subtitle="Wat wil jij graag hebben? 💝"
          />
        ) : (
          <div className="space-y-5">
            {PRIORITIES.filter((p) => sorted.some((i) => i.priority === p)).map((priority) => {
              const group = sorted.filter((i) => i.priority === priority)
              return (
                <div key={priority}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm">{priorityIcons[priority]}</span>
                    <span className="text-sm font-semibold text-olive-700">{priority}</span>
                    <span className="text-xs text-warm-muted">
                      ({group.filter((i) => i.acquired).length}/{group.length})
                    </span>
                  </div>
                  <div className="space-y-2">
                    {group.map((item) => (
                      <VerlangCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setSheetOpen(true)}
        className="fixed bottom-20 right-4 w-14 h-14 bg-terra-400 text-white rounded-full shadow-warm-lg flex items-center justify-center text-2xl active:bg-terra-500 active:scale-95 transition-all z-30"
        aria-label="Wens toevoegen"
      >
        +
      </button>

      <VerlangAddSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </div>
  )
}
