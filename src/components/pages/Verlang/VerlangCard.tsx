import { useState } from 'react'
import type { VerlangItem, Priority } from '@/types'
import { useVerlangStore } from '@/stores/useVerlangStore'
import { useKoopStore } from '@/stores/useKoopStore'
import { useToast } from '@/hooks/useToast'
import PriorityBadge from '@/components/ui/PriorityBadge'
import Modal from '@/components/ui/Modal'

interface Props { item: VerlangItem }

const priorities: Priority[] = ['Hoog', 'Middel', 'Laag']

const priorityStyle: Record<Priority, string> = {
  Hoog:   'bg-terra-400 text-white border-terra-400',
  Middel: 'bg-olive-700 text-white border-olive-700',
  Laag:   'bg-sand-200 text-warm-gray border-sand-200',
}

export default function VerlangCard({ item }: Props) {
  const { updatePriority, toggleAcquired, deleteItem } = useVerlangStore()
  const addKoopItem = useKoopStore((s) => s.addItem)
  const toast = useToast()
  const [deleteModal, setDeleteModal] = useState(false)
  const [moveModal, setMoveModal] = useState(false)
  const [popping, setPopping] = useState(false)

  function handleToggle() {
    setPopping(true)
    setTimeout(() => setPopping(false), 350)
    toggleAcquired(item.id)
    toast(item.acquired ? 'Teruggezet op verlanglijst' : 'Verkregen! 🎉', 'success')
  }

  function handlePriority(p: Priority) {
    if (p === item.priority) return
    updatePriority(item.id, p)
    toast(`Prioriteit gewijzigd naar ${p}`)
  }

  function handleMoveToKoop() {
    addKoopItem(item.title, 1, undefined, item.url ?? undefined)
    deleteItem(item.id)
    toast('Verplaatst naar kooplijst 🛒')
  }

  return (
    <>
      <div className={`card p-4 card-pressed ${item.acquired ? 'opacity-60' : ''}`}>
        <div className="flex items-start gap-3">
          {/* Acquired checkbox */}
          <button
            onClick={handleToggle}
            className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all mt-0.5 ${
              popping ? 'animate-check-pop' : ''
            } ${item.acquired ? 'bg-olive-700 border-olive-700' : 'border-sand-300 bg-white'}`}
          >
            {item.acquired && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <PriorityBadge priority={item.priority} />
            </div>
            <p className={`text-sm font-medium text-olive-800 leading-snug ${item.acquired ? 'line-through text-warm-muted' : ''}`}>
              {item.title}
            </p>
            {item.notes && (
              <p className="text-xs text-warm-gray mt-1 line-clamp-2">{item.notes}</p>
            )}
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-terra-400 font-medium mt-1.5"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
                Bekijken
              </a>
            )}
          </div>

          {/* Delete */}
          <button
            onClick={() => setDeleteModal(true)}
            className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-warm-muted hover:text-terra-400 hover:bg-terra-400/10 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        {/* Priority picker */}
        {!item.acquired && (
          <div className="mt-3 flex gap-1.5">
            {priorities.map((p) => (
              <button
                key={p}
                onClick={() => handlePriority(p)}
                className={`flex-1 py-1.5 rounded-xl text-[11px] font-medium border transition-all ${
                  item.priority === p
                    ? priorityStyle[p]
                    : 'bg-white text-warm-gray border-sand-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-2.5 pt-2.5 border-t border-sand-100 flex items-center justify-between">
          <span className="text-[10px] text-warm-muted">
            Van <span className="font-medium text-olive-600">{item.addedBy}</span>
          </span>
          {!item.acquired && (
            <button
              onClick={() => setMoveModal(true)}
              className="flex items-center gap-1 text-[11px] text-terra-400 font-medium active:opacity-70"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              Naar kooplijst
            </button>
          )}
        </div>
      </div>

      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Wens verwijderen"
        message={`Weet je zeker dat je "${item.title}" wilt verwijderen?`}
        onConfirm={() => { deleteItem(item.id); toast('Wens verwijderd', 'info') }}
      />

      <Modal
        open={moveModal}
        onClose={() => setMoveModal(false)}
        title="Naar kooplijst"
        message={`"${item.title}" verplaatsen naar de kooplijst? Het item wordt van de verlanglijst verwijderd.`}
        onConfirm={handleMoveToKoop}
      />
    </>
  )
}
