import { useState } from 'react'
import { useTodoStore } from '@/stores/useTodoStore'
import type { TodoCategory } from '@/types'
import EmptyState from '@/components/ui/EmptyState'
import TodoItem from './TodoItem'
import TodoAddSheet from './TodoAddSheet'

const CATEGORIES: TodoCategory[] = ['Algemeen', 'Administratief', 'Woning', 'Overig']

const categoryColors: Record<TodoCategory, string> = {
  Algemeen:      'bg-sand-100 text-olive-700',
  Administratief:'bg-terra-400/10 text-terra-500',
  Woning:        'bg-olive-600/10 text-olive-700',
  Overig:        'bg-sand-200 text-warm-gray',
}

export default function TodoPage() {
  const items = useTodoStore((s) => s.items)
  const [activeCategory, setActiveCategory] = useState<TodoCategory | 'Alle'>('Alle')
  const [sheetOpen, setSheetOpen] = useState(false)

  const filtered = activeCategory === 'Alle' ? items : items.filter((i) => i.category === activeCategory)
  const done = items.filter((i) => i.completed).length
  const total = items.length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <div className="min-h-full">
      {/* Progress section */}
      <div className="px-4 pt-5 pb-4">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-display text-olive-700 text-base">
              {done} van {total} gedaan
            </span>
            <span className="text-sm font-medium text-terra-400">{pct}%</span>
          </div>
          <div className="h-2 bg-sand-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-terra-400 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          {total === 0 && (
            <p className="text-xs text-warm-muted mt-2">Voeg je eerste taak toe om te beginnen</p>
          )}
          {total > 0 && done === total && (
            <p className="text-xs text-olive-600 mt-2 font-medium">Alles gedaan! Geweldig! 🎉</p>
          )}
        </div>
      </div>

      {/* Category filter */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
          {(['Alle', ...CATEGORIES] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-terra-400 text-white shadow-warm-sm'
                  : 'bg-white text-warm-gray border border-sand-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Task list */}
      <div className="px-4 pb-6">
        {filtered.length === 0 ? (
          <EmptyState
            icon="📋"
            title={activeCategory === 'Alle' ? 'Nog geen taken' : `Geen ${activeCategory} taken`}
            subtitle={activeCategory === 'Alle' ? 'Voeg je eerste taak toe! 🎉' : 'Alle taken in deze categorie zijn gedaan'}
          />
        ) : (
          <div className="space-y-2">
            {activeCategory === 'Alle' ? (
              // Group by category
              CATEGORIES.filter((cat) => items.some((i) => i.category === cat)).map((cat) => {
                const catItems = items.filter((i) => i.category === cat)
                return (
                  <div key={cat}>
                    <div className="flex items-center gap-2 mb-2 mt-4 first:mt-0">
                      <span className={`pill ${categoryColors[cat]}`}>{cat}</span>
                      <span className="text-xs text-warm-muted">
                        {catItems.filter((i) => i.completed).length}/{catItems.length}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {catItems.map((item) => (
                        <TodoItem key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                )
              })
            ) : (
              filtered.map((item) => <TodoItem key={item.id} item={item} />)
            )}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setSheetOpen(true)}
        className="fixed bottom-20 right-4 w-14 h-14 bg-terra-400 text-white rounded-full shadow-warm-lg flex items-center justify-center text-2xl active:bg-terra-500 active:scale-95 transition-all z-30"
        aria-label="Taak toevoegen"
      >
        +
      </button>

      <TodoAddSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </div>
  )
}
