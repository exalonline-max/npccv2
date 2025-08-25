import create from 'zustand'
import api, { directApi } from '../lib/api'

export const useAuthStore = create((set, get) => ({
  user: null,
  memberships: [],
  selectedAccount: null,
  login: async (email, password) => {
    try{
      const res = await api.post('/auth/login', { email, password })
      await get().fetchMe()
      return res
    }catch(e){
      // If the Vercel proxy returns 404 (NOT_FOUND), fallback to calling the backend directly.
      if(e && e.response && e.response.status === 404){
        const res = await directApi.post('/auth/login', { email, password })
        await get().fetchMe()
        return res
      }
      throw e
    }
  },
  logout: async () => {
    await api.post('/auth/logout')
    set({ user: null, memberships: [], selectedAccount: null })
  },
  fetchMe: async () => {
    try{
      // Don't call the protected /me endpoint from the public marketing site
      // to avoid noisy 401s in the browser console for unauthenticated visitors.
      if(typeof window !== 'undefined'){
        const host = window.location.hostname || ''
        if(host === 'www.npcchatter.com' || host === 'npcchatter.com'){
          set({ user: null, memberships: [] })
          return null
        }
      }

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
