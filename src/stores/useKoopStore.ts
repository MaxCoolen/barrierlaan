import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { KoopItem } from '@/types'
import { generateId } from '@/utils/generateId'

interface KoopState {
  items: KoopItem[]
  addItem: (name: string, quantity: number, store?: string) => void
  toggleBought: (id: string) => void
  deleteItem: (id: string) => void
}

export const useKoopStore = create<KoopState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (name, quantity, store) =>
        set((s) => ({
          items: [
            { id: generateId(), name, quantity, store, bought: false, createdAt: new Date().toISOString() },
            ...s.items,
          ],
        })),
      toggleBought: (id) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, bought: !i.bought } : i)),
        })),
      deleteItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
    }),
    { name: 'barrierlaan-koop' }
  )
)
