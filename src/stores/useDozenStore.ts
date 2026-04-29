import { create } from 'zustand'
import { doc, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { DozenItem, DozenStatus } from '@/types'
import { generateId } from '@/utils/generateId'

interface DozenState {
  items: DozenItem[]
  _setItems: (items: DozenItem[]) => void
  nextNumber: number
  addItem: (data: Omit<DozenItem, 'id' | 'createdAt' | 'number'> & { number?: number }) => Promise<void>
  updateItem: (id: string, updates: Partial<DozenItem>) => Promise<void>
  updateStatus: (id: string, status: DozenStatus) => Promise<void>
  deleteItem: (id: string) => Promise<void>
}

export const useDozenStore = create<DozenState>()((set, get) => ({
  items: [],
  nextNumber: 1,

  _setItems: (items) => {
    const maxNum = items.length > 0 ? Math.max(...items.map((i) => i.number)) : 0
    set({ items: [...items].sort((a, b) => a.number - b.number), nextNumber: maxNum + 1 })
  },

  addItem: async (data) => {
    const number = data.number ?? get().nextNumber
    const item: DozenItem = {
      id: generateId(), number,
      room: data.room, colorLabel: data.colorLabel,
      status: data.status, description: data.description,
      tags: data.tags, photo: data.photo,
      createdAt: new Date().toISOString(),
    }
    set((s) => ({
      items: [...s.items, item].sort((a, b) => a.number - b.number),
      nextNumber: Math.max(s.nextNumber, number + 1),
    }))
    await setDoc(doc(db, 'dozen', item.id), item)
  },

  updateItem: async (id, updates) => {
    set((s) => ({ items: s.items.map((i) => i.id === id ? { ...i, ...updates } : i) }))
    await setDoc(doc(db, 'dozen', id), updates, { merge: true })
  },

  updateStatus: async (id, status) => {
    set((s) => ({ items: s.items.map((i) => i.id === id ? { ...i, status } : i) }))
    await setDoc(doc(db, 'dozen', id), { status }, { merge: true })
  },

  deleteItem: async (id) => {
    set((s) => ({ items: s.items.filter((i) => i.id !== id) }))
    await deleteDoc(doc(db, 'dozen', id))
  },
}))
