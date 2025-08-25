import create from 'zustand'
import api, { directApi } from '../lib/api'

export const useAuthStore = create((set, get) => ({
  user: null,
  memberships: [],
  selectedAccount: null,
  login: async (email, password) => {
    try{
      const res = await api.post('/auth/login', { email, password })
      // After a successful login we must fetch the authenticated user even when
      // on the public marketing host (www.npcchatter.com). fetchMe normally
      // skips calling the protected /me endpoint to avoid noisy 401s for
      // unauthenticated visitors; force=true bypasses that guard for the login
      // flow so the store is populated immediately.
      await get().fetchMe(true)
      return res
    }catch(e){
      // If the Vercel proxy returns 404 (NOT_FOUND), fallback to calling the backend directly.
      if(e && e.response && e.response.status === 404){
        const res = await directApi.post('/auth/login', { email, password })
        // direct backend login may be used when the proxy is missing; force
        // fetching the authenticated user so the client sees the new session
        // immediately even on the public marketing host.
        await get().fetchMe(true)
        return res
      }
      throw e
    }
  },
  logout: async () => {
    await api.post('/auth/logout')
    set({ user: null, memberships: [], selectedAccount: null })
  },
  fetchMe: async (force = false) => {
    try{
      // By default, avoid calling the protected /me endpoint from the public
      // marketing site (www.npcchatter.com) to prevent noisy 401s for
      // unauthenticated visitors. If `force` is true, bypass that guard so
      // callers (like login) can populate the store immediately after auth.
      if(!force && typeof window !== 'undefined'){
        const host = window.location.hostname || ''
        if(host === 'www.npcchatter.com' || host === 'npcchatter.com'){
          set({ user: null, memberships: [] })
          return null
        }
      }

      let res
      try{
        res = await api.get('/me')
      }catch(err){
        // If the Vercel proxy is missing or returns 404, fallback to the direct
        // backend so the client can populate the authenticated user after
        // login. This avoids a situation where login succeeds but /me is
        // unavailable through the proxy and the UI immediately treats the user
        // as unauthenticated.
        if(err && err.response && err.response.status === 404){
          res = await directApi.get('/me')
        }else{
          throw err
        }
      }

      set({ user: res.data.user, memberships: res.data.memberships })
      return res.data
    }catch(e){
      set({ user: null, memberships: [] })
      return null
    }
  },
  setSelectedAccount: (account) => set({ selectedAccount: account })
}))
