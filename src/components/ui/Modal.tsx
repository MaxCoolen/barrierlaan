import { createPortal } from 'react-dom'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  message: string
  onConfirm: () => void
  confirmLabel?: string
  variant?: 'danger' | 'primary'
}

export default function Modal({
  open,
  onClose,
  title,
  message,
  onConfirm,
  confirmLabel = 'Verwijderen',
  variant = 'danger',
}: Props) {
  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 sheet-backdrop" />
      <div
        className="relative w-full max-w-sm bg-cream rounded-3xl shadow-warm-xl p-6 animate-bounce-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-display text-xl text-olive-800 mb-2">{title}</h3>
        <p className="text-warm-gray text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-sand-100 text-warm-gray font-medium text-sm active:bg-sand-200 transition-colors"
          >
            Annuleren
          </button>
          <button
            onClick={() => { onConfirm(); onClose() }}
            className={`flex-1 py-3 rounded-xl font-medium text-sm text-white transition-colors ${
              variant === 'danger'
                ? 'bg-terra-500 active:bg-terra-600'
                : 'bg-olive-700 active:bg-olive-800'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
