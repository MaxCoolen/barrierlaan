export function formatDate(isoString: string): string {
  return new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(isoString))
}

export function formatShortDate(isoString: string): string {
  return new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(isoString))
}

export function formatDayMonth(isoString: string): { day: string; month: string } {
  const date = new Date(isoString)
  return {
    day: new Intl.DateTimeFormat('nl-NL', { day: 'numeric' }).format(date),
    month: new Intl.DateTimeFormat('nl-NL', { month: 'short' }).format(date).replace('.', ''),
  }
}

export function daysUntil(isoString: string): number {
  const diff = new Date(isoString).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function isPast(isoString: string): boolean {
  return new Date(isoString).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)
}
