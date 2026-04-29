import { useState } from 'react'
import type { KostenItem as IKostenItem } from '@/types'
import { useKostenStore } from '@/stores/useKostenStore'
import { useToast } from '@/hooks/useToast'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatShortDate } from '@/utils/formatDate'
import Modal from '@/components/ui/Modal'

const categoryColors: Record<IKostenItem['category'], string> = {
  Woning:      'bg-olive-600/10 text-olive-700',
  Meubels:     'bg-sand-200 text-olive-700',
  Verbouwing:  'bg-terra-400/10 text-terra-500',
  Transport:   'bg-sand-100 text-warm-gray',
  Diversen:    'bg-cream text-warm-muted border border-sand-200',
}

interface Props { item: IKostenItem }

export default function KostenItem({ item }: Props) {
  const { togglePaid, deleteItem } = useKostenStore()
  const toast = useToast()
  const [deleteModal, setDeleteModal] = useState(false)
  const [popping, setPopping] = useState(false)

  function handleToggle() {
    setPopping(true)
    setTimeout(() => setPopping(false), 350)
    togglePaid(item.id)
    toast(item.paid ? 'Gemarkeerd als onbetaald' : 'Betaald! 💰', 'success')
  }

  return (
    <>
      <div className={`card p-3.5 flex items-center gap-3 card-pressed ${item.paid ? 'opacity-70' : ''}`}>
        {/* Paid checkbox */}
        <button
          onClick={handleToggle}
          className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            popping ? 'animate-check-pop' : ''
          } ${item.paid ? 'bg-olive-700 border-olive-700' : 'border-sand-300 bg-white'}`}
        >
          {item.paid && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <span className={`text-sm font-medium block truncate ${item.paid ? 'line-through text-warm-muted' : 'text-olive-800'}`}>
            {item.description}
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`pill text-[10px] ${categoryColors[item.category]}`}>{item.category}</span>
            {item.date && <span className="text-[10px] text-warm-muted">{formatShortDate(item.date)}</span>}
          </div>
        </div>

        {/* Amount */}
        <span className={`shrink-0 text-sm font-semibold font-display ${item.paid ? 'text-warm-muted line-through' : 'text-olive-800'}`}>
          {formatCurrency(item.amount)}
        </span>

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

      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Post verwijderen"
        message={`Weet je zeker dat je "${item.description}" wilt verwijderen?`}
        onConfirm={() => { deleteItem(item.id); toast('Post verwijderd', 'info') }}
      />
    </>
  )
}
