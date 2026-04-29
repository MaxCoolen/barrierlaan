import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export default function BottomSheet({ open, onClose, title, children }: Props) {
  const [visible, setVisible] = useState(false)
  const [animating, setAnimating] = useState(false)
  const prevOpen = useRef(false)

  useEffect(() => {
    if (open && !prevOpen.current) {
      setVisible(true)
      setAnimating(false)
      document.body.classList.add('sheet-open')
    } else if (!open && prevOpen.current) {
      setAnimating(true)
      document.body.classList.remove('sheet-open')
      const t = setTimeout(() => {
        setVisible(false)
        setAnimating(false)
      }, 280)
      return () => clearTimeout(t)
    }
    prevOpen.current = open
  }, [open])

  if (!visible) return null

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center ${!animating ? 'animate-fade-in' : ''}`}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 sheet-backdrop" />

      {/* Sheet */}
      <div
        className={`relative w-full max-w-lg bg-cream rounded-t-4xl shadow-warm-xl overflow-hidden ${
          animating ? 'animate-slide-down' : 'animate-slide-up'
        }`}
        style={{ maxHeight: '88vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-sand-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-2 pb-4">
          <h2 className="font-display text-xl text-olive-800">{title}</h2>
          <button
            onClick={onClose}
            className="touch-target w-10 h-10 rounded-full bg-sand-100 text-warm-gray hover:bg-sand-200 transition-colors"
            aria-label="Sluiten"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-5 pb-8" style={{ maxHeight: 'calc(88vh - 100px)' }}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}
