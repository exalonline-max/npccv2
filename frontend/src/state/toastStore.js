import create from 'zustand'

export const useToastStore = create((set) => ({
  toasts: [],
  push: (msg, type = 'info') => {
    const id = Date.now() + Math.random()
    set(s => ({ toasts: [...s.toasts, { id, msg, type }] }))
    setTimeout(() => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })), 4000)
  },
  remove: (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) }))
}))

export default useToastStore
