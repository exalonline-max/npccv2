import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import AccountPickerPage from './pages/AccountPickerPage'
import CreateAccountPage from './pages/CreateAccountPage'
import LandingPage from './pages/LandingPage'
import RegisterPage from './pages/RegisterPage'
import DashboardDM from './pages/DashboardDM'
import DashboardPlayer from './pages/DashboardPlayer'
import { useAuthStore } from './state/authStore'
import axios, { directApi } from './lib/api'

function App(){
  const fetchMe = useAuthStore(state => state.fetchMe)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(()=>{
    const init = async () => {
      // Avoid calling auth/tenant endpoints from the public www host. Public pages
      // (www.npcchatter.com) are intended for marketing/login and will return 401
      // for /api/me; skip the init to prevent noisy 401s in the browser console.
      const host = (typeof window !== 'undefined' && window.location.hostname) || ''
      if(host === 'www.npcchatter.com' || host === 'npcchatter.com') return

      // Only run tenant-root redirect when visiting the hostname root ("/")
      if(location && location.pathname && location.pathname !== '/') return

      const me = await fetchMe()
      try{
        let res
        try{
          res = await axios.get('/tenant/current')
        }catch(err){
          if(err && err.response && err.response.status === 404){
            res = await directApi.get('/tenant/current')
          }else{
            throw err
          }
        }
        const account = res.data.account
        if(account){
          // determine if this hostname looks like a tenant subdomain (admintest1.npcchatter.com or admintest1.lvh.me)
          const host = window.location.hostname || ''
          const parts = host.split('.')
          const isTenantSubdomain = parts.length > 2 && (host.endsWith('npcchatter.com') || host.endsWith('lvh.me'))

          if(isTenantSubdomain){
            // If user is not authenticated, send them to login so they can sign in for this tenant
            if(!me || !me.user){
              navigate('/login')
              return
            }

            // if the current user is a DM for this account, take them to the DM dashboard
            const isDm = (me.memberships || []).some(m => m.account && m.account.slug === account.slug && m.role && m.role.toLowerCase() === 'dm')
            if(isDm){
              navigate('/dm')
              return
            }

            // fallback: player view
            navigate('/player')
            return
          }
        }
      }catch(e){
        // ignore tenant check failures
      }
    }
    init()
  }, [])

  return (
    <Routes>
      <Route path="/" element={<LandingPage/>} />
      <Route path="/login" element={<LoginPage/>} />
  <Route path="/register" element={<RegisterPage/>} />
  <Route path="/campaigns" element={<AccountPickerPage/>} />
  <Route path="/campaigns/create" element={<CreateAccountPage/>} />
  <Route path="/app/dm" element={<DashboardDM/>} />
  <Route path="/app/player" element={<DashboardPlayer/>} />
  {/* Tenant root routes: visiting https://<slug>.<domain>/ should redirect to /dm or /player */}
  <Route path="/dm" element={<DashboardDM/>} />
  <Route path="/player" element={<DashboardPlayer/>} />
    </Routes>
  )
}

export default App
