import { useRef, useState } from 'react'
import BottomSheet from '@/components/ui/BottomSheet'
import { useDozenStore } from '@/stores/useDozenStore'
import { useToast } from '@/hooks/useToast'
import type { DozenRoom, DozenStatus } from '@/types'

const ROOMS: DozenRoom[] = ['Woonkamer', 'Slaapkamer', 'Keuken', 'Badkamer', 'Zolder', 'Garage', 'Kantoor', 'Overig']
const COLOR_OPTIONS = ['#C0714A', '#4A5240', '#C9B89A', '#8B6E4E', '#7A7570', '#D4A574', '#9E8C6B', '']

async function resizeImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const MAX = 500
      let { width, height } = img
      if (width > MAX) { height = Math.round((height * MAX) / width); width = MAX }
      if (height > MAX) { width = Math.round((width * MAX) / height); height = MAX }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.55))
    }
    img.src = url
  })
}

interface Props { open: boolean; onClose: () => void }

export default function DozenAddSheet({ open, onClose }: Props) {
  const { addItem, nextNumber } = useDozenStore()
  const toast = useToast()
  const [number, setNumber] = useState<number | ''>('')
  const [room, setRoom] = useState<DozenRoom>('Overig')
  const [status, setStatus] = useState<DozenStatus>('Ingepakt')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [colorLabel, setColorLabel] = useState('')
  const [photo, setPhoto] = useState<string | undefined>()
  const [loadingPhoto, setLoadingPhoto] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setLoadingPhoto(true)
    try {
      const resized = await resizeImage(file)
      setPhoto(resized)
    } catch {
      toast('Foto kon niet worden geladen', 'error')
    } finally {
      setLoadingPhoto(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const num = number === '' ? nextNumber : Number(number)
    addItem({ number: num, room, status, description: description.trim(), tags: tags.split(',').map((t) => t.trim()).filter(Boolean), colorLabel: colorLabel || undefined, photo })
    toast(`Doos ${num} toegevoegd! 📦`)
    setNumber(''); setRoom('Overig'); setStatus('Ingepakt'); setDescription('')
    setTags(''); setColorLabel(''); setPhoto(undefined)
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Doos toevoegen">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Number */}
        <div>
          <label className="block text-xs font-medium text-warm-gray mb-1.5">
            Dozenummer <span className="font-normal text-warm-muted">(standaard: {nextNumber})</span>
          </label>
          <input
            type="number"
            inputMode="numeric"
            value={number}
            onChange={(e) => setNumber(e.target.value ? parseInt(e.target.value) : '')}
            placeholder={String(nextNumber)}
            className="input-field"
          />
        </div>

        {/* Room */}
        <div>
          <label className="block text-xs font-medium text-warm-gray mb-1.5">Kamer van bestemming</label>
          <div className="grid grid-cols-4 gap-1.5">
            {ROOMS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRoom(r)}
                className={`py-2 rounded-xl text-xs font-medium border transition-all ${
                  room === r ? 'bg-terra-400 text-white border-terra-400' : 'bg-white text-warm-gray border-sand-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-medium text-warm-gray mb-1.5">Status</label>
          <div className="flex gap-2">
            {(['Ingepakt', 'In transit', 'Uitgepakt'] as DozenStatus[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                  status === s ? 'bg-olive-700 text-white border-olive-700' : 'bg-white text-warm-gray border-sand-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-warm-gray mb-1.5">Inhoud / beschrijving</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Bijv. Keukenspullen, borden, glazen, bestek"
            rows={3}
            className="input-field resize-none"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-medium text-warm-gray mb-1.5">Tags <span className="font-normal text-warm-muted">(komma gescheiden)</span></label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="borden, glazen, bestek"
            className="input-field"
          />
        </div>

        {/* Color label */}
        <div>
          <label className="block text-xs font-medium text-warm-gray mb-1.5">Kleurlabel <span className="font-normal text-warm-muted">(optioneel)</span></label>
          <div className="flex items-center gap-2 flex-wrap">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColorLabel(c)}
                className={`w-7 h-7 rounded-full border-2 transition-all ${
                  colorLabel === c ? 'border-olive-700 scale-110' : 'border-sand-200'
                } ${!c ? 'bg-cream text-warm-muted text-xs flex items-center justify-center' : ''}`}
                style={c ? { background: c } : undefined}
                title={c || 'Geen kleur'}
              >
                {!c && '✕'}
              </button>
            ))}
          </div>
        </div>

        {/* Photo */}
        <div>
          <label className="block text-xs font-medium text-warm-gray mb-1.5">Foto <span className="font-normal text-warm-muted">(optioneel)</span></label>
          {photo ? (
            <div className="relative">
              <img src={photo} alt="Doos foto" className="w-full h-32 object-cover rounded-xl" />
              <button
                type="button"
                onClick={() => setPhoto(undefined)}
                className="absolute top-2 right-2 w-7 h-7 bg-olive-800/70 text-white rounded-full flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={loadingPhoto}
              className="w-full h-20 border-2 border-dashed border-sand-300 rounded-xl flex flex-col items-center justify-center gap-1 text-warm-muted text-xs active:bg-sand-50 transition-colors"
            >
              <span className="text-2xl">{loadingPhoto ? '⏳' : '📷'}</span>
              {loadingPhoto ? 'Laden...' : 'Foto toevoegen'}
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhoto}
            className="hidden"
          />
        </div>

        <button
          type="submit"
          className="w-full btn-primary"
        >
          Doos toevoegen
        </button>
      </form>
    </BottomSheet>
  )
}
