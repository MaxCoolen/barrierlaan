import { create } from 'zustand'
import { doc, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { KostenItem, KostenCategory, RecurringBill } from '@/types'
import { generateId } from '@/utils/generateId'

interface KostenState {
  items: KostenItem[]
  recurring: RecurringBill[]
  _setItems: (items: KostenItem[]) => void
  _setRecurring: (recurring: RecurringBill[]) => void
  addItem: (description: string, amount: number, category: KostenCategory, date?: string) => Promise<void>
  togglePaid: (id: string) => Promise<void>
  deleteItem: (id: string) => Promise<void>
  addRecurring: (name: string, amount: number, frequency: RecurringBill['frequency']) => Promise<void>
  deleteRecurring: (id: string) => Promise<void>
}

export const useKostenStore = create<KostenState>()((set, get) => ({
  items: [],
  recurring: [],
  _setItems: (items) => set({ items }),
  _setRecurring: (recurring) => set({ recurring }),

  addItem: async (description, amount, category, date) => {
    const item: KostenItem = {
      id: generateId(), description, amount, category, paid: false, date,
      createdAt: new Date().toISOString(),
    }
    set((s) => ({ items: [item, ...s.items] }))
    await setDoc(doc(db, 'kosten', item.id), item)
  },

  togglePaid: async (id) => {
    const item = get().items.find((i) => i.id === id)
    if (!item) return
    const paid = !item.paid
    set((s) => ({ items: s.items.map((i) => i.id === id ? { ...i, paid } : i) }))
    await setDoc(doc(db, 'kosten', id), { paid }, { merge: true })
  },

  deleteItem: async (id) => {
    set((s) => ({ items: s.items.filter((i) => i.id !== id) }))
    await deleteDoc(doc(db, 'kosten', id))
  },

  addRecurring: async (name, amount, frequency) => {
    const bill: RecurringBill = {
      id: generateId(), name, amount, frequency,
      createdAt: new Date().toISOString(),
    }
    set((s) => ({ recurring: [...s.recurring, bill] }))
    await setDoc(doc(db, 'recurring', bill.id), bill)
  },

  deleteRecurring: async (id) => {
    set((s) => ({ recurring: s.recurring.filter((r) => r.id !== id) }))
    await deleteDoc(doc(db, 'recurring', id))
  },
}))
