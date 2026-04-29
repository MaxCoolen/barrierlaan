import type { Priority } from '@/types'

const config: Record<Priority, { label: string; className: string }> = {
  Hoog:   { label: 'Hoog',   className: 'bg-terra-400/15 text-terra-500 border border-terra-300/30' },
  Middel: { label: 'Middel', className: 'bg-sand-200 text-olive-700 border border-sand-300' },
  Laag:   { label: 'Laag',   className: 'bg-cream text-warm-gray border border-sand-200' },
}

export default function PriorityBadge({ priority }: { priority: Priority }) {
  const { label, className } = config[priority]
  return (
    <span className={`pill text-[11px] ${className}`}>{label}</span>
  )
}
