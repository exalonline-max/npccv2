import create from 'zustand'
import api from '../lib/api'

export const useAuthStore = create((set, get) => ({
  user: null,
  memberships: [],
  selectedAccount: null,
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    await get().fetchMe()
    return res
  },
  logout: async () => {
    await api.post('/auth/logout')
    set({ user: null, memberships: [], selectedAccount: null })
  },
  fetchMe: async () => {
    try{
      const res = await api.get('/me')
      set({ user: res.data.user, memberships: res.data.memberships })
      return res.data
    }catch(e){
      set({ user: null, memberships: [] })
      return null
    }
  },
  setSelectedAccount: (account) => set({ selectedAccount: account })
}))
