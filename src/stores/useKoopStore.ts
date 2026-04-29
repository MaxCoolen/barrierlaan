import { create } from 'zustand'
import { doc, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { KoopItem } from '@/types'
import { generateId } from '@/utils/generateId'

interface KoopState {
  items: KoopItem[]
  _setItems: (items: KoopItem[]) => void
  addItem: (name: string, quantity: number, store?: string) => Promise<void>
  toggleBought: (id: string) => Promise<void>
  deleteItem: (id: string) => Promise<void>
}

export const useKoopStore = create<KoopState>()((set, get) => ({
  items: [],
  _setItems: (items) => set({ items }),

  addItem: async (name, quantity, store) => {
    const item: KoopItem = {
      id: generateId(), name, quantity, store, bought: false,
      createdAt: new Date().toISOString(),
    }
    set((s) => ({ items: [item, ...s.items] }))
    await setDoc(doc(db, 'kooplijst', item.id), item)
  },

  toggleBought: async (id) => {
    const item = get().items.find((i) => i.id === id)
    if (!item) return
    const bought = !item.bought
    set((s) => ({ items: s.items.map((i) => i.id === id ? { ...i, bought } : i) }))
    await setDoc(doc(db, 'kooplijst', id), { bought }, { merge: true })
  },

  deleteItem: async (id) => {
    set((s) => ({ items: s.items.filter((i) => i.id !== id) }))
    await deleteDoc(doc(db, 'kooplijst', id))
  },
}))
