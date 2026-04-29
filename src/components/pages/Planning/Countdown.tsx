import { daysUntil } from '@/utils/formatDate'

interface Props {
  moveDate: string
  onEditDate: () => void
}

export default function Countdown({ moveDate, onEditDate }: Props) {
  if (!moveDate) {
    return (
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-olive-700 text-base">Verhuisdatum</p>
            <p className="text-sm text-warm-gray mt-0.5">Nog niet ingesteld</p>
          </div>
          <button
            onClick={onEditDate}
            className="px-3 py-2 rounded-xl bg-terra-400/10 text-terra-500 text-sm font-medium active:bg-terra-400/20 transition-colors"
          >
            Instellen
          </button>
        </div>
      </div>
    )
  }

  const days = daysUntil(moveDate)
  const dateLabel = new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(moveDate))

  let headline: string
  let sub: string
  let accent: string

  if (days > 0) {
    headline = `Nog ${days} ${days === 1 ? 'dag' : 'dagen'}!`
    sub = `Verhuisdag: ${dateLabel}`
    accent = 'text-terra-400'
  } else if (days === 0) {
    headline = '🎉 Het is vandaag!'
    sub = 'De grote dag is aangebroken!'
    accent = 'text-olive-700'
  } else {
    headline = `${Math.abs(days)} dagen geleden`
    sub = `Verhuisd op ${dateLabel}`
    accent = 'text-warm-gray'
  }

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className={`font-display text-2xl font-semibold ${accent}`}>{headline}</p>
          <p className="text-sm text-warm-gray mt-1">{sub}</p>
        </div>
        <button
          onClick={onEditDate}
          className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-warm-muted hover:bg-sand-100 transition-colors"
          aria-label="Datum aanpassen"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
          </svg>
        </button>
      </div>

      {/* Progress bar if future */}
      {days > 0 && days <= 365 && (
        <div className="mt-3">
          <div className="h-1.5 bg-sand-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-terra-400 rounded-full transition-all duration-1000"
              style={{ width: `${Math.max(5, 100 - (days / 365) * 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
