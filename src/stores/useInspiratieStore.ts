import { create } from 'zustand'
import { doc, setDoc, deleteDoc, arrayUnion } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { InspiratieItem, InspiratieComment, Person } from '@/types'
import { generateId } from '@/utils/generateId'
import { stripUndefined } from '@/utils/stripUndefined'
import { useVerlangStore } from '@/stores/useVerlangStore'

interface InspiratieState {
  items: InspiratieItem[]
  _setItems: (items: InspiratieItem[]) => void
  addItem: (title: string, url: string, addedBy: Person, notes?: string) => Promise<void>
  markAllRead: () => Promise<void>
  toggleFavorite: (id: string) => Promise<void>
  toggleViewed: (id: string) => Promise<void>
  vote: (id: string, voter: Person, vote: 'ja' | 'nee') => Promise<void>
  addComment: (id: string, author: Person, text: string) => Promise<void>
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
      comments: [],
      addedToVerlang: false,
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
    const shouldAddToVerlang = favorite && !item.addedToVerlang
    set((s) => ({
      items: s.items.map((i) => i.id === id
        ? { ...i, favorite, addedToVerlang: shouldAddToVerlang ? true : i.addedToVerlang }
        : i
      ),
    }))
    const update: Record<string, unknown> = { favorite }
    if (shouldAddToVerlang) update.addedToVerlang = true
    await setDoc(doc(db, 'inspiratie', id), update, { merge: true })
    if (shouldAddToVerlang) {
      await useVerlangStore.getState().addItem(item.title, 'Middel', item.addedBy, item.notes, item.url)
    }
  },

  toggleViewed: async (id) => {
    set((s) => ({ items: s.items.map((i) => i.id === id ? { ...i, viewed: true, isNew: false } : i) }))
    await setDoc(doc(db, 'inspiratie', id), { viewed: true, isNew: false }, { merge: true })
  },

  vote: async (id, voter, v) => {
    const item = get().items.find((i) => i.id === id)
    if (!item) return
    const existingVotes = item.votes ?? { max: null, medina: null }
    const updatedVotes = { ...existingVotes, [voter.toLowerCase()]: v }
    set((s) => ({
      items: s.items.map((i) => i.id === id ? { ...i, votes: updatedVotes } : i),
    }))
    const field = `votes.${voter.toLowerCase()}`
    await setDoc(doc(db, 'inspiratie', id), { [field]: v }, { merge: true })
  },

  addComment: async (id, author, text) => {
    const comment: InspiratieComment = {
      id: generateId(), author, text,
      createdAt: new Date().toISOString(),
    }
    set((s) => ({
      items: s.items.map((i) => i.id === id
        ? { ...i, comments: [...(i.comments ?? []), comment] }
        : i
      ),
    }))
    await setDoc(doc(db, 'inspiratie', id), { comments: arrayUnion(comment) }, { merge: true })
  },

  deleteItem: async (id) => {
    set((s) => ({ items: s.items.filter((i) => i.id !== id) }))
    await deleteDoc(doc(db, 'inspiratie', id))
  },

  unreadCount: () => get().items.filter((i) => i.isNew).length,
}))
