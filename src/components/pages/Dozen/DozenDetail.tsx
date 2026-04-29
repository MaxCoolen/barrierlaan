import { useState } from 'react'
import { createPortal } from 'react-dom'
import type { DozenItem, DozenStatus, DozenRoom } from '@/types'
import { useDozenStore } from '@/stores/useDozenStore'
import { useToast } from '@/hooks/useToast'
import Modal from '@/components/ui/Modal'

const statusStyle: Record<DozenStatus, string> = {
  Ingepakt:    'bg-terra-400/10 text-terra-500 border-terra-300/30',
  'In transit': 'bg-sand-200 text-olive-700 border-sand-300',
  Uitgepakt:   'bg-olive-600/10 text-olive-700 border-olive-600/20',
}

const roomConfig: Record<DozenRoom, { bg: string; text: string }> = {
  Woonkamer:  { bg: 'bg-terra-400/15', text: 'text-terra-500' },
  Slaapkamer: { bg: 'bg-sand-200',     text: 'text-olive-700' },
  Keuken:     { bg: 'bg-olive-600/10', text: 'text-olive-700' },
  Badkamer:   { bg: 'bg-sand-100',     text: 'text-warm-gray' },
  Zolder:     { bg: 'bg-sand-300/30',  text: 'text-olive-800' },
  Garage:     { bg: 'bg-cream',        text: 'text-warm-gray' },
  Kantoor:    { bg: 'bg-olive-600/10', text: 'text-olive-600' },
  Overig:     { bg: 'bg-sand-50',      text: 'text-warm-muted' },
}

interface Props {
  item: DozenItem
  onClose: () => void
}

export default function DozenDetail({ item, onClose }: Props) {
  const { updateItem, updateStatus, deleteItem } = useDozenStore()
  const toast = useToast()
  const [editDesc, setEditDesc] = useState(false)
  const [desc, setDesc] = useState(item.description)
  const [deleteModal, setDeleteModal] = useState(false)

  function handleStatusChange(status: DozenStatus) {
    updateStatus(item.id, status)
    toast(`Status bijgewerkt: ${status}`)
  }

  function handleSaveDesc() {
    updateItem(item.id, { description: desc.trim() })
    setEditDesc(false)
    toast('Beschrijving opgeslagen')
  }

  const room = roomConfig[item.room]

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 sheet-backdrop" />
      <div
        className="relative w-full max-w-lg mx-auto bg-cream rounded-t-4xl shadow-warm-xl animate-slide-up"
        style={{ maxHeight: '85vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-sand-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-2 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-3xl font-bold text-olive-800">#{item.number}</span>
              {item.colorLabel && (
                <span className="w-4 h-4 rounded-full border border-sand-200" style={{ background: item.colorLabel }} />
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className={`pill text-[11px] ${room.bg} ${room.text}`}>{item.room}</span>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-sand-100 flex items-center justify-center text-warm-gray">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto px-5 pb-8 space-y-5" style={{ maxHeight: 'calc(85vh - 110px)' }}>
          {/* Photo */}
          {item.photo && (
            <img src={item.photo} alt="Doos" className="w-full h-48 object-cover rounded-2xl" />
          )}

          {/* Status */}
          <div>
            <p className="text-xs font-medium text-warm-gray mb-2">Status</p>
            <div className="flex gap-2">
              {(['Ingepakt', 'In transit', 'Uitgepakt'] as DozenStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                    item.status === s
                      ? `${statusStyle[s]} font-semibold`
                      : 'bg-white text-warm-gray border-sand-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-warm-gray">Inhoud / beschrijving</p>
              <button
                onClick={() => setEditDesc(!editDesc)}
                className="text-xs text-terra-400 font-medium"
              >
                {editDesc ? 'Annuleren' : 'Bewerken'}
              </button>
            </div>
            {editDesc ? (
              <div>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={4}
                  className="w-full bg-sand-50 border border-sand-200 rounded-xl px-4 py-3 text-sm text-olive-800 focus:outline-none focus:border-terra-400 resize-none"
                  autoFocus
                />
                <button onClick={handleSaveDesc} className="mt-2 w-full btn-primary text-sm py-2.5">
                  Opslaan
                </button>
              </div>
            ) : (
              <div className="bg-sand-50 rounded-xl px-4 py-3 min-h-[60px]">
                <p className="text-sm text-olive-800 leading-relaxed whitespace-pre-wrap">
                  {item.description || <span className="text-warm-muted italic">Geen beschrijving</span>}
                </p>
              </div>
            )}
          </div>

          {/* Tags */}
          {item.tags.length > 0 && (
            <div>
              <p className="text-xs font-medium text-warm-gray mb-2">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span key={tag} className="pill bg-sand-100 text-warm-gray text-xs">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* Delete */}
          <button
            onClick={() => setDeleteModal(true)}
            className="w-full py-3 rounded-xl border border-terra-400/30 text-terra-500 text-sm font-medium active:bg-terra-400/10 transition-colors"
          >
            Doos verwijderen
          </button>
        </div>
      </div>

      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        title={`Doos #${item.number} verwijderen`}
        message="Weet je zeker dat je deze doos wilt verwijderen?"
        onConfirm={() => { deleteItem(item.id); toast(`Doos #${item.number} verwijderd`, 'info'); onClose() }}
      />
    </div>,
    document.body
  )
}
