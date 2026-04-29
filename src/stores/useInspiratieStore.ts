import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { InspiratieItem, Person } from '@/types'
import { generateId } from '@/utils/generateId'

interface InspiratieState {
  items: InspiratieItem[]
  addItem: (title: string, url: string, addedBy: Person, notes?: string) => void
  markAllRead: () => void
  toggleFavorite: (id: string) => void
  toggleViewed: (id: string) => void
  vote: (id: string, voter: Person, vote: 'ja' | 'nee') => void
  deleteItem: (id: string) => void
  unreadCount: () => number
}

export const useInspiratieStore = create<InspiratieState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (title, url, addedBy, notes) =>
        set((s) => ({
          items: [
            {
              id: generateId(),
              title,
              url,
              addedBy,
              notes,
              viewed: false,
              favorite: false,
              isNew: true,
              votes: { max: null, medina: null },
              createdAt: new Date().toISOString(),
            },
            ...s.items,
          ],
        })),
      markAllRead: () =>
        set((s) => ({
          items: s.items.map((i) => ({ ...i, isNew: false })),
        })),
      toggleFavorite: (id) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, favorite: !i.favorite } : i)),
        })),
      toggleViewed: (id) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, viewed: true, isNew: false } : i)),
        })),
      vote: (id, voter, vote) =>
        set((s) => ({
          items: s.items.map((i) => {
            if (i.id !== id) return i
            const existingVotes = i.votes ?? { max: null, medina: null }
            return {
              ...i,
              votes: {
                ...existingVotes,
                [voter.toLowerCase()]: vote,
              },
            }
          }),
        })),
      deleteItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      unreadCount: () => get().items.filter((i) => i.isNew).length,
    }),
    { name: 'barrierlaan-inspiratie' }
  )
)
