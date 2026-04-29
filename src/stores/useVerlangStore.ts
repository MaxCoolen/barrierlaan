import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { VerlangItem, Priority, Person } from '@/types'
import { generateId } from '@/utils/generateId'

interface VerlangState {
  items: VerlangItem[]
  addItem: (title: string, priority: Priority, addedBy: Person, notes?: string, url?: string) => void
  toggleAcquired: (id: string) => void
  deleteItem: (id: string) => void
}

export const useVerlangStore = create<VerlangState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (title, priority, addedBy, notes, url) =>
        set((s) => ({
          items: [
            { id: generateId(), title, priority, addedBy, notes, url, acquired: false, createdAt: new Date().toISOString() },
            ...s.items,
          ],
        })),
      toggleAcquired: (id) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, acquired: !i.acquired } : i)),
        })),
      deleteItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
    }),
    { name: 'barrierlaan-verlang' }
  )
)
