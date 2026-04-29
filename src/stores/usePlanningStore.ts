import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PlanningEvent } from '@/types'
import { generateId } from '@/utils/generateId'

interface PlanningState {
  items: PlanningEvent[]
  moveDate: string
  addEvent: (title: string, date: string, description?: string) => void
  toggleDone: (id: string) => void
  deleteEvent: (id: string) => void
  setMoveDate: (date: string) => void
}

export const usePlanningStore = create<PlanningState>()(
  persist(
    (set) => ({
      items: [],
      moveDate: '',
      addEvent: (title, date, description) =>
        set((s) => ({
          items: [
            ...s.items,
            { id: generateId(), title, date, description, done: false, createdAt: new Date().toISOString() },
          ],
        })),
      toggleDone: (id) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, done: !i.done } : i)),
        })),
      deleteEvent: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      setMoveDate: (date) => set({ moveDate: date }),
    }),
    { name: 'barrierlaan-planning' }
  )
)
