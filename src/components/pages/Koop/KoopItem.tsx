import { useState, useRef } from 'react'
import type { KoopItem as IKoopItem } from '@/types'
import { useKoopStore } from '@/stores/useKoopStore'
import { useKostenStore } from '@/stores/useKostenStore'
import { useToast } from '@/hooks/useToast'
import Modal from '@/components/ui/Modal'

interface Props { item: IKoopItem }

export default function KoopItem({ item }: Props) {
  const { toggleBought, deleteItem } = useKoopStore()
  const addKosten = useKostenStore((s) => s.addItem)
  const toast = useToast()
  const [deleteModal, setDeleteModal] = useState(false)
  const [priceModal, setPriceModal] = useState(false)
  const [price, setPrice] = useState('')
  const [popping, setPopping] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleToggle() {
    if (item.bought) {
      // Terugzetten — geen prijs nodig
      toggleBought(item.id)
      return
    }
    // Afvinken → prijs-modal tonen
    setPriceModal(true)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  function handlePriceConfirm() {
    setPopping(true)
    setTimeout(() => setPopping(false), 350)
    toggleBought(item.id)
    const amount = parseFloat(price.replace(',', '.'))
    if (!isNaN(amount) && amount > 0) {
      addKosten(item.name, amount, 'Diversen')
      toast(`In het mandje! 🛒 €${amount.toFixed(2)} toegevoegd aan kosten.`)
    } else {
      toast('In het mandje! 🛒')
    }
    setPrice('')
    setPriceModal(false)
  }

  function handlePriceSkip() {
    setPopping(true)
    setTimeout(() => setPopping(false), 350)
    toggleBought(item.id)
    toast('In het mandje! 🛒')
    setPrice('')
    setPriceModal(false)
  }

  return (
    <>
      <div className={`card p-3.5 card-pressed ${item.bought ? 'opacity-60' : ''}`}>
        <div className="flex items-center gap-3">
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
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-terra-400 font-medium mt-0.5"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
                Bekijken
              </a>
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
      </div>

      {/* Prijs-modal bij afvinken */}
      {priceModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 pb-8" onClick={() => handlePriceSkip()}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-warm-lg p-5 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-lg text-olive-800 mb-1">Hoeveel heb je betaald?</h3>
            <p className="text-xs text-warm-gray mb-4">Dit wordt automatisch toegevoegd aan de kostenpagina.</p>
            <div className="relative mb-4">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray text-sm font-medium">€</span>
              <input
                ref={inputRef}
                type="number"
                inputMode="decimal"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handlePriceConfirm() }}
                placeholder="0,00"
                className="input-field pl-8"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={handlePriceSkip} className="flex-1 py-2.5 rounded-xl border border-sand-200 text-warm-gray text-sm font-medium">
                Overslaan
              </button>
              <button onClick={handlePriceConfirm} className="flex-1 py-2.5 rounded-xl bg-terra-400 text-white text-sm font-medium active:bg-terra-500">
                Opslaan
              </button>
            </div>
          </div>
        </div>
      )}

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
