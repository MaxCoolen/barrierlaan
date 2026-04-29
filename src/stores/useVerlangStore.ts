import { create } from 'zustand'
import { doc, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { VerlangItem, Priority, Person } from '@/types'
import { generateId } from '@/utils/generateId'

interface VerlangState {
  items: VerlangItem[]
  _setItems: (items: VerlangItem[]) => void
  addItem: (title: string, priority: Priority, addedBy: Person, notes?: string, url?: string) => Promise<void>
  toggleAcquired: (id: string) => Promise<void>
  deleteItem: (id: string) => Promise<void>
}

export const useVerlangStore = create<VerlangState>()((set, get) => ({
  items: [],
  _setItems: (items) => set({ items }),

  addItem: async (title, priority, addedBy, notes, url) => {
    const item: VerlangItem = {
      id: generateId(), title, priority, addedBy, notes, url, acquired: false,
      createdAt: new Date().toISOString(),
    }
    set((s) => ({ items: [item, ...s.items] }))
    await setDoc(doc(db, 'verlang', item.id), item)
  },

  toggleAcquired: async (id) => {
    const item = get().items.find((i) => i.id === id)
    if (!item) return
    const acquired = !item.acquired
    set((s) => ({ items: s.items.map((i) => i.id === id ? { ...i, acquired } : i) }))
    await setDoc(doc(db, 'verlang', id), { acquired }, { merge: true })
  },

  deleteItem: async (id) => {
    set((s) => ({ items: s.items.filter((i) => i.id !== id) }))
    await deleteDoc(doc(db, 'verlang', id))
  },
}))
