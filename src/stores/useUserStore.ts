import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Person } from '@/types'

interface UserState {
  currentUser: Person | null
  setUser: (user: Person) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      currentUser: null,
      setUser: (user) => set({ currentUser: user }),
      clearUser: () => set({ currentUser: null }),
    }),
    { name: 'barrierlaan-user' }
  )
)
