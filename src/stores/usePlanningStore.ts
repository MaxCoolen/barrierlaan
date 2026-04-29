import { create } from 'zustand'
import { doc, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { PlanningEvent } from '@/types'
import { generateId } from '@/utils/generateId'
import { stripUndefined } from '@/utils/stripUndefined'

interface PlanningState {
  items: PlanningEvent[]
  moveDate: string
  _setItems: (items: PlanningEvent[]) => void
  _setMoveDate: (date: string) => void
  addEvent: (title: string, date: string, description?: string) => Promise<void>
  toggleDone: (id: string) => Promise<void>
  deleteEvent: (id: string) => Promise<void>
  setMoveDate: (date: string) => Promise<void>
}

export const usePlanningStore = create<PlanningState>()((set, get) => ({
  items: [],
  moveDate: '',
  _setItems: (items) => set({ items }),
  _setMoveDate: (moveDate) => set({ moveDate }),

  addEvent: async (title, date, description) => {
    const event: PlanningEvent = {
      id: generateId(), title, date, description, done: false,
      createdAt: new Date().toISOString(),
    }
    set((s) => ({ items: [...s.items, event] }))
    await setDoc(doc(db, 'planning', event.id), stripUndefined(event))
  },

  toggleDone: async (id) => {
    const item = get().items.find((i) => i.id === id)
    if (!item) return
    const done = !item.done
    set((s) => ({ items: s.items.map((i) => i.id === id ? { ...i, done } : i) }))
    await setDoc(doc(db, 'planning', id), { done }, { merge: true })
  },

  deleteEvent: async (id) => {
    set((s) => ({ items: s.items.filter((i) => i.id !== id) }))
    await deleteDoc(doc(db, 'planning', id))
  },

  setMoveDate: async (date) => {
    set({ moveDate: date })
    await setDoc(doc(db, 'config', 'planning'), { moveDate: date }, { merge: true })
  },
}))
