import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { KostenItem, KostenCategory, RecurringBill } from '@/types'
import { generateId } from '@/utils/generateId'

interface KostenState {
  items: KostenItem[]
  recurring: RecurringBill[]
  addItem: (description: string, amount: number, category: KostenCategory, date?: string) => void
  togglePaid: (id: string) => void
  deleteItem: (id: string) => void
  addRecurring: (name: string, amount: number, frequency: RecurringBill['frequency']) => void
  deleteRecurring: (id: string) => void
}

export const useKostenStore = create<KostenState>()(
  persist(
    (set) => ({
      items: [],
      recurring: [],
      addItem: (description, amount, category, date) =>
        set((s) => ({
          items: [
            { id: generateId(), description, amount, category, paid: false, date, createdAt: new Date().toISOString() },
            ...s.items,
          ],
        })),
      togglePaid: (id) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, paid: !i.paid } : i)),
        })),
      deleteItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      addRecurring: (name, amount, frequency) =>
        set((s) => ({
          recurring: [
            ...s.recurring,
            { id: generateId(), name, amount, frequency, createdAt: new Date().toISOString() },
          ],
        })),
      deleteRecurring: (id) =>
        set((s) => ({ recurring: s.recurring.filter((r) => r.id !== id) })),
    }),
    { name: 'barrierlaan-kosten' }
  )
)
