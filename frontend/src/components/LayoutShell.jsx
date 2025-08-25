import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { useAuthStore } from '../state/authStore'
import ToastContainer from './ToastContainer'
import { APP_VERSION, BUILD_TIME } from '../version'

function Topbar(){
  const user = useAuthStore(s=>s.user)
  const selected = useAuthStore(s=>s.selectedAccount)
  const logout = useAuthStore(s=>s.logout)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    // navigate to login page after logout
    navigate('/login')
  }

  const showDebug = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('debug') === '1'

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-base-200 border-b">
      <div className="max-w-6xl mx-auto h-14 flex items-center px-4">
        <div className="flex-1 flex items-center">
          <Link to="/" className="btn btn-ghost normal-case text-lg">NPC Chatter</Link>
          {selected && <span className="badge badge-outline ml-4">{selected.slug}</span>}
          {!user && (
            <span className="ml-4 badge badge-info">Guest</span>
          )}
          {showDebug && (
            <div className="ml-4 text-xs opacity-80">ver: {APP_VERSION} · {BUILD_TIME}</div>
          )}
        </div>

          <div className="flex-none flex items-center gap-3">
          {user ? (
            <>
              <div className="text-sm text-right">
                <div className="font-medium">{user.display_name}</div>
                <div className="text-xs opacity-70">{user.email}</div>
                {showDebug && (
                  <div className="text-xs text-muted mt-1">API: {api.defaults?.baseURL || 'unknown'}</div>
                )}
              </div>
              <button className="btn btn-sm btn-ghost" onClick={()=>{ window.open('/', '_blank', 'noopener') }}>Open App</button>
              <button className="btn btn-sm btn-error" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="btn btn-sm btn-primary" to="/login">Login</Link>
              <Link className="btn btn-sm btn-ghost" to="/register">Create campaign</Link>
              {showDebug && (
                <div className="ml-3 text-xs opacity-70">API: {api.defaults?.baseURL || 'unknown'}</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function LayoutShell({children}){
  const user = useAuthStore(s=>s.user)
  const hasTopbar = true // always reserve space; topbar will show login or user info

  return (
    <div className="min-h-screen">
      <Topbar />

      {/* main content needs top padding to account for fixed topbar */}
      <main className={"p-6 " + (hasTopbar ? 'pt-20' : '')}>
        {children}
      </main>

      <ToastContainer />
    </div>
  )
}
