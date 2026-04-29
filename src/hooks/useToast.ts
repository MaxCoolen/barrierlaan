import { useToastStore } from '@/stores/useToastStore'

export function useToast() {
  return useToastStore((s) => s.show)
}
