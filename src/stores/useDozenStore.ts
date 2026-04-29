import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DozenItem, DozenStatus } from '@/types'
import { generateId } from '@/utils/generateId'

interface DozenState {
  items: DozenItem[]
  nextNumber: number
  addItem: (data: Omit<DozenItem, 'id' | 'createdAt' | 'number'> & { number?: number }) => void
  updateItem: (id: string, updates: Partial<DozenItem>) => void
  updateStatus: (id: string, status: DozenStatus) => void
  deleteItem: (id: string) => void
}

export const useDozenStore = create<DozenState>()(
  persist(
    (set, get) => ({
      items: [],
      nextNumber: 1,
      addItem: (data) => {
        const number = data.number ?? get().nextNumber
        set((s) => ({
          items: [
            ...s.items,
            {
              id: generateId(),
              number,
              room: data.room,
              colorLabel: data.colorLabel,
              status: data.status,
              description: data.description,
              tags: data.tags,
              photo: data.photo,
              createdAt: new Date().toISOString(),
            },
          ].sort((a, b) => a.number - b.number),
          nextNumber: Math.max(s.nextNumber, number) + 1,
        }))
      },
      updateItem: (id, updates) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
        })),
      updateStatus: (id, status) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, status } : i)),
        })),
      deleteItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
    }),
    { name: 'barrierlaan-dozen' }
  )
)
