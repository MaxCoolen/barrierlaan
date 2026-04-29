import { useState } from 'react'
import type { PlanningEvent } from '@/types'
import { usePlanningStore } from '@/stores/usePlanningStore'
import { useToast } from '@/hooks/useToast'
import { formatDayMonth, isPast } from '@/utils/formatDate'
import Modal from '@/components/ui/Modal'

interface Props { event: PlanningEvent }

export default function PlanningEventItem({ event }: Props) {
  const { toggleDone, deleteEvent } = usePlanningStore()
  const toast = useToast()
  const [deleteModal, setDeleteModal] = useState(false)
  const [popping, setPopping] = useState(false)

  const past = isPast(event.date)
  const { day, month } = formatDayMonth(event.date)

  function handleToggle() {
    setPopping(true)
    setTimeout(() => setPopping(false), 350)
    toggleDone(event.id)
    toast(event.done ? 'Teruggezet' : 'Gedaan! 🎉')
  }

  return (
    <>
      <div className={`card p-3.5 flex items-start gap-3 card-pressed ${past || event.done ? 'opacity-60' : ''}`}>
        {/* Date badge */}
        <div className="shrink-0 w-12 bg-sand-100 rounded-xl p-1.5 text-center border border-sand-200">
          <p className="text-lg font-display font-bold text-olive-800 leading-none">{day}</p>
          <p className="text-[10px] font-medium text-warm-gray uppercase tracking-wide mt-0.5">{month}</p>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pt-0.5">
          <p className={`text-sm font-medium text-olive-800 leading-snug ${event.done ? 'line-through text-warm-muted' : ''}`}>
            {event.title}
          </p>
          {event.description && (
            <p className="text-xs text-warm-gray mt-0.5 line-clamp-2">{event.description}</p>
          )}
        </div>

        {/* Actions */}
        <div className="shrink-0 flex items-center gap-1 pt-0.5">
          <button
            onClick={handleToggle}
            className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${
              popping ? 'animate-check-pop' : ''
            } ${event.done ? 'bg-olive-700 border-olive-700' : 'border-sand-300 bg-white'}`}
          >
            {event.done && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          <button
            onClick={() => setDeleteModal(true)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-warm-muted hover:text-terra-400 hover:bg-terra-400/10 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Event verwijderen"
        message={`Weet je zeker dat je "${event.title}" wilt verwijderen?`}
        onConfirm={() => { deleteEvent(event.id); toast('Event verwijderd', 'info') }}
      />
    </>
  )
}
