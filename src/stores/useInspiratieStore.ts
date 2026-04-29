import { create } from 'zustand'
import { doc, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { InspiratieItem, Person } from '@/types'
import { generateId } from '@/utils/generateId'
import { stripUndefined } from '@/utils/stripUndefined'

interface InspiratieState {
  items: InspiratieItem[]
  _setItems: (items: InspiratieItem[]) => void
  addItem: (title: string, url: string, addedBy: Person, notes?: string) => Promise<void>
  markAllRead: () => Promise<void>
  toggleFavorite: (id: string) => Promise<void>
  toggleViewed: (id: string) => Promise<void>
  vote: (id: string, voter: Person, vote: 'ja' | 'nee') => Promise<void>
  deleteItem: (id: string) => Promise<void>
  unreadCount: () => number
}

export const useInspiratieStore = create<InspiratieState>()((set, get) => ({
  items: [],
  _setItems: (items) => set({ items }),

  addItem: async (title, url, addedBy, notes) => {
    const item: InspiratieItem = {
      id: generateId(), title, url, addedBy, notes,
      viewed: false, favorite: false, isNew: true,
      votes: { max: null, medina: null },
      createdAt: new Date().toISOString(),
    }
    set((s) => ({ items: [item, ...s.items] }))
    await setDoc(doc(db, 'inspiratie', item.id), stripUndefined(item))
  },

  markAllRead: async () => {
    const unread = get().items.filter((i) => i.isNew)
    set((s) => ({ items: s.items.map((i) => ({ ...i, isNew: false })) }))
    await Promise.all(
      unread.map((i) => setDoc(doc(db, 'inspiratie', i.id), { isNew: false }, { merge: true }))
    )
  },

  toggleFavorite: async (id) => {
    const item = get().items.find((i) => i.id === id)
    if (!item) return
    const favorite = !item.favorite
    set((s) => ({ items: s.items.map((i) => i.id === id ? { ...i, favorite } : i) }))
    await setDoc(doc(db, 'inspiratie', id), { favorite }, { merge: true })
  },

  toggleViewed: async (id) => {
    set((s) => ({ items: s.items.map((i) => i.id === id ? { ...i, viewed: true, isNew: false } : i) }))
    await setDoc(doc(db, 'inspiratie', id), { viewed: true, isNew: false }, { merge: true })
  },

  vote: async (id, voter, vote) => {
    const field = `votes.${voter.toLowerCase()}`
    set((s) => ({
      items: s.items.map((i) => {
        if (i.id !== id) return i
        const existingVotes = i.votes ?? { max: null, medina: null }
        return { ...i, votes: { ...existingVotes, [voter.toLowerCase()]: vote } }
      }),
    }))
    await setDoc(doc(db, 'inspiratie', id), { [field]: vote }, { merge: true })
  },

  deleteItem: async (id) => {
    set((s) => ({ items: s.items.filter((i) => i.id !== id) }))
    await deleteDoc(doc(db, 'inspiratie', id))
  },

  unreadCount: () => get().items.filter((i) => i.isNew).length,
}))
