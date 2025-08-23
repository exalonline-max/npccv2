import React from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../state/authStore'
import ToastContainer from './ToastContainer'

export default function LayoutShell({children}){
  const user = useAuthStore(s=>s.user)
  const logout = useAuthStore(s=>s.logout)
  const selected = useAuthStore(s=>s.selectedAccount)
  const hasTopbar = !!user
  return (
    <div className="min-h-screen">
      {/* fixed topbar for logged-in users */}
      {hasTopbar && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-base-200 border-b">
          <div className="max-w-6xl mx-auto h-12 flex items-center px-4">
            <div className="flex-1 flex items-center">
              <span className="text-sm mr-4">Signed in as <strong>{user.display_name}</strong></span>
              {selected && <span className="badge badge-outline mr-4">{selected.slug}</span>}
            </div>
            <div className="flex-none">
              <button className="btn btn-sm btn-ghost mr-2" onClick={()=>{ window.open('/', '_blank', 'noopener') }}>Open App</button>
              <button className="btn btn-sm btn-error" onClick={async ()=>{ await logout(); window.location.href = '/login' }}>Logout</button>
            </div>
          </div>
        </div>
      )}

      <div className="navbar bg-base-100 shadow-md">
        <div className="flex-1 px-4">
          <a className="btn btn-ghost normal-case text-xl">NPC Chatter</a>
        </div>
        <div className="flex-none pr-4">
          <div className="hidden sm:flex items-center">
            <span className="mr-4">{user?.display_name || 'Guest'}</span>
            {selected && <span className="badge badge-outline mr-4">{selected.slug}</span>}
            {!user ? (
              <Link className="btn btn-sm" to="/login">Login</Link>
            ) : (
              <button className="btn btn-sm" onClick={async ()=>{ await logout(); window.location.href = '/login' }}>Logout</button>
            )}
          </div>
        </div>
      </div>
  <main className={"p-6 " + (hasTopbar ? 'pt-20' : '')}>{children}</main>
  <ToastContainer />
    </div>
  )
}
