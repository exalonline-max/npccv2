import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import AccountPickerPage from './pages/AccountPickerPage'
import CreateAccountPage from './pages/CreateAccountPage'
import LandingPage from './pages/LandingPage'
import RegisterPage from './pages/RegisterPage'
import DashboardDM from './pages/DashboardDM'
import DashboardPlayer from './pages/DashboardPlayer'
import { useAuthStore } from './state/authStore'
import axios from './lib/api'

function App(){
  const fetchMe = useAuthStore(state => state.fetchMe)
  const navigate = useNavigate()

  useEffect(()=>{
    const init = async () => {
      const me = await fetchMe()
      try{
        const res = await axios.get('/tenant/current')
        const account = res.data.account
        if(account && me && me.user){
          // if the current user is a DM for this account, take them to the DM dashboard
          const isDm = (me.memberships || []).some(m => m.account && m.account.slug === account.slug && m.role && m.role.toLowerCase() === 'dm')
          if(isDm){
            navigate('/app/dm')
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
    </Routes>
  )
}

export default App
