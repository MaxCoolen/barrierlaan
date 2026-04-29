import { useState } from 'react'
import type { KoopItem as IKoopItem } from '@/types'
import { useKoopStore } from '@/stores/useKoopStore'
import { useToast } from '@/hooks/useToast'
import Modal from '@/components/ui/Modal'

interface Props { item: IKoopItem }

export default function KoopItem({ item }: Props) {
  const { toggleBought, deleteItem } = useKoopStore()
  const toast = useToast()
  const [deleteModal, setDeleteModal] = useState(false)
  const [popping, setPopping] = useState(false)

  function handleToggle() {
    setPopping(true)
    setTimeout(() => setPopping(false), 350)
    toggleBought(item.id)
    if (!item.bought) toast('In het mandje! 🛒')
  }

  return (
    <>
      <div className={`card p-3.5 flex items-center gap-3 card-pressed ${item.bought ? 'opacity-60' : ''}`}>
        {/* Checkbox */}
        <button
          onClick={handleToggle}
          className={`shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
            popping ? 'animate-check-pop' : ''
          } ${item.bought ? 'bg-olive-700 border-olive-700' : 'border-sand-300 bg-white'}`}
          aria-label={item.bought ? 'Markeer als niet gekocht' : 'Markeer als gekocht'}
        >
          {item.bought && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <span className={`text-sm font-medium block truncate ${item.bought ? 'line-through text-warm-muted' : 'text-olive-800'}`}>
            {item.name}
          </span>
          {item.store && (
            <span className="text-xs text-warm-muted">{item.store}</span>
          )}
        </div>

        {/* Quantity */}
        <span className="shrink-0 pill bg-sand-100 text-warm-gray text-xs">×{item.quantity}</span>

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
        title="Item verwijderen"
        message={`Weet je zeker dat je "${item.name}" wilt verwijderen?`}
        onConfirm={() => { deleteItem(item.id); toast('Item verwijderd', 'info') }}
      />
    </>
  )
}
