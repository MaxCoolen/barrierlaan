import { useState } from 'react'
import { usePlanningStore } from '@/stores/usePlanningStore'
import EmptyState from '@/components/ui/EmptyState'
import Countdown from './Countdown'
import PlanningEventItem from './PlanningEvent'
import PlanningAddSheet from './PlanningAddSheet'

export default function PlanningPage() {
  const { items, moveDate } = usePlanningStore()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [moveDateSheetOpen, setMoveDateSheetOpen] = useState(false)

  const sorted = [...items].sort((a, b) => a.date.localeCompare(b.date))

  return (
    <div className="min-h-full">
      {/* Countdown */}
      <div className="px-4 pt-5 pb-4">
        <Countdown moveDate={moveDate} onEditDate={() => setMoveDateSheetOpen(true)} />
      </div>

      {/* Events */}
      <div className="px-4 pb-6">
        <h2 className="section-header mb-3">Tijdlijn</h2>
        {sorted.length === 0 ? (
          <EmptyState
            icon="📅"
            title="Geen events gepland"
            subtitle="Voeg je eerste mijlpaal toe! 📅"
          />
        ) : (
          <div className="space-y-2">
            {sorted.map((event) => (
              <PlanningEventItem key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setSheetOpen(true)}
        className="fixed bottom-20 right-4 w-14 h-14 bg-terra-400 text-white rounded-full shadow-warm-lg flex items-center justify-center text-2xl active:bg-terra-500 active:scale-95 transition-all z-30"
        aria-label="Event toevoegen"
      >
        +
      </button>

      <PlanningAddSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />

      {/* Move date sheet */}
      {moveDateSheetOpen && (
        <MoveDateSheet open={moveDateSheetOpen} onClose={() => setMoveDateSheetOpen(false)} current={moveDate} />
      )}
    </div>
  )
}

function MoveDateSheet({ onClose, current }: { open: boolean; onClose: () => void; current: string }) {
  const setMoveDate = usePlanningStore((s) => s.setMoveDate)
  const [date, setDate] = useState(current)

  function handleSave() {
    setMoveDate(date)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 sheet-backdrop" />
      <div className="relative w-full max-w-sm bg-cream rounded-3xl shadow-warm-xl p-6 animate-bounce-in" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-display text-xl text-olive-800 mb-4">Verhuisdatum instellen</h3>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input-field mb-4"
        />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-sand-100 text-warm-gray font-medium text-sm">
            Annuleren
          </button>
          <button onClick={handleSave} className="flex-1 btn-primary text-sm py-3">
            Opslaan
          </button>
        </div>
      </div>
    </div>
  )
}
