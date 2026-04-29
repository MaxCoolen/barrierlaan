import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TodoItem, TodoCategory } from '@/types'
import { generateId } from '@/utils/generateId'

interface TodoState {
  items: TodoItem[]
  addItem: (title: string, category: TodoCategory) => void
  toggleItem: (id: string) => void
  deleteItem: (id: string) => void
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (title, category) =>
        set((s) => ({
          items: [
            { id: generateId(), title, category, completed: false, createdAt: new Date().toISOString() },
            ...s.items,
          ],
        })),
      toggleItem: (id) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, completed: !i.completed } : i)),
        })),
      deleteItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
    }),
    { name: 'barrierlaan-todo' }
  )
)
