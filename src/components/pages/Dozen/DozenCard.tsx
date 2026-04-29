import type { DozenItem, DozenRoom, DozenStatus } from '@/types'
import { useDozenStore } from '@/stores/useDozenStore'
import { useToast } from '@/hooks/useToast'

const roomConfig: Record<DozenRoom, { bg: string; text: string }> = {
  Woonkamer:  { bg: 'bg-terra-400/15', text: 'text-terra-500' },
  Slaapkamer: { bg: 'bg-sand-200',     text: 'text-olive-700' },
  Keuken:     { bg: 'bg-olive-600/10', text: 'text-olive-700' },
  Badkamer:   { bg: 'bg-sand-100',     text: 'text-warm-gray' },
  Zolder:     { bg: 'bg-sand-300/30',  text: 'text-olive-800' },
  Garage:     { bg: 'bg-cream',        text: 'text-warm-gray border border-sand-200' },
  Kantoor:    { bg: 'bg-olive-600/10', text: 'text-olive-600' },
  Overig:     { bg: 'bg-sand-50',      text: 'text-warm-muted' },
}

const statusCycle: Record<DozenStatus, DozenStatus> = {
  Ingepakt:    'In transit',
  'In transit': 'Uitgepakt',
  Uitgepakt:   'Ingepakt',
}

const statusStyle: Record<DozenStatus, string> = {
  Ingepakt:    'bg-terra-400/10 text-terra-500',
  'In transit': 'bg-sand-200 text-olive-700',
  Uitgepakt:   'bg-olive-600/10 text-olive-700',
}

interface Props {
  item: DozenItem
  onTap: () => void
}

export default function DozenCard({ item, onTap }: Props) {
  const updateStatus = useDozenStore((s) => s.updateStatus)
  const toast = useToast()
  const room = roomConfig[item.room]

  function handleStatusCycle(e: React.MouseEvent) {
    e.stopPropagation()
    const next = statusCycle[item.status]
    updateStatus(item.id, next)
    toast(`Doos ${item.number}: ${next}`)
  }

  return (
    <div
      className="card p-4 flex items-center gap-3 card-pressed active:scale-[0.98] transition-all"
      onClick={onTap}
    >
      {/* Number */}
      <div className="shrink-0 w-12 h-12 bg-sand-100 rounded-2xl flex items-center justify-center border border-sand-200">
        <span className="font-display text-xl font-bold text-olive-800">
          {item.number}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
          <span className={`pill text-[11px] ${room.bg} ${room.text}`}>
            {item.room}
          </span>
          {item.colorLabel && (
            <span className="w-3 h-3 rounded-full border border-sand-200 shrink-0" style={{ background: item.colorLabel }} />
          )}
        </div>
        <p className="text-sm text-olive-800 line-clamp-1 font-medium">
          {item.description || 'Geen beschrijving'}
        </p>
        {item.tags.length > 0 && (
          <p className="text-[11px] text-warm-muted mt-0.5 line-clamp-1">
            {item.tags.join(', ')}
          </p>
        )}
      </div>

      {/* Status button */}
      <button
        onClick={handleStatusCycle}
        className={`shrink-0 pill text-[11px] py-1 px-2 ${statusStyle[item.status]}`}
      >
        {item.status}
      </button>

      {/* Photo indicator */}
      {item.photo && (
        <div className="shrink-0 w-8 h-8 rounded-lg overflow-hidden border border-sand-200">
          <img src={item.photo} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Chevron */}
      <svg className="shrink-0 w-4 h-4 text-sand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  )
}
