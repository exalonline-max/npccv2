import React from 'react'
import { useAuthStore } from '../state/authStore'

export default function RoleGuard({role, children}){
  const memberships = useAuthStore(s=>s.memberships)
  // naive check
  const ok = memberships.some(m => m.role === role)
  if(!ok) return <div className="p-4">403 - forbidden. <a href="/campaigns">Switch campaign</a></div>
  return children
}
