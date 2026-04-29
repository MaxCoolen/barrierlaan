import { create } from 'zustand'
import type { ToastMessage, ToastType } from '@/types'
import { generateId } from '@/utils/generateId'

interface ToastState {
  toasts: ToastMessage[]
  show: (message: string, type?: ToastType) => void
  dismiss: (id: string) => void
}

export const useToastStore = create<ToastState>()((set) => ({
  toasts: [],
  show: (message, type = 'success') => {
    const id = generateId()
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }))
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3000)
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))
