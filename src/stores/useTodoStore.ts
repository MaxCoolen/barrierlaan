import { create } from 'zustand'
import { doc, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { TodoItem, TodoCategory } from '@/types'
import { generateId } from '@/utils/generateId'

interface TodoState {
  items: TodoItem[]
  _setItems: (items: TodoItem[]) => void
  addItem: (title: string, category: TodoCategory) => Promise<void>
  toggleItem: (id: string) => Promise<void>
  deleteItem: (id: string) => Promise<void>
}

export const useTodoStore = create<TodoState>()((set, get) => ({
  items: [],
  _setItems: (items) => set({ items }),

  addItem: async (title, category) => {
    const item: TodoItem = {
      id: generateId(), title, category, completed: false,
      createdAt: new Date().toISOString(),
    }
    set((s) => ({ items: [item, ...s.items] }))
    await setDoc(doc(db, 'todos', item.id), item)
  },

  toggleItem: async (id) => {
    const item = get().items.find((i) => i.id === id)
    if (!item) return
    const completed = !item.completed
    set((s) => ({ items: s.items.map((i) => i.id === id ? { ...i, completed } : i) }))
    await setDoc(doc(db, 'todos', id), { completed }, { merge: true })
  },

  deleteItem: async (id) => {
    set((s) => ({ items: s.items.filter((i) => i.id !== id) }))
    await deleteDoc(doc(db, 'todos', id))
  },
}))
