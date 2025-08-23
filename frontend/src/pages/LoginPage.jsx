import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../state/authStore'

export default function LoginPage(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const login = useAuthStore(s=>s.login)
  const navigate = useNavigate()
  const isDev = process.env.NODE_ENV !== 'production'

  const submit = async (e)=>{
    e.preventDefault()
  await login(email, password)
  navigate('/campaigns')
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="card p-6">
        <h2 className="text-2xl mb-4">Sign in</h2>
        <form onSubmit={submit}>
          <input className="input input-bordered w-full mb-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="input input-bordered w-full mb-4" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button className="btn btn-primary w-full">Sign in</button>
        </form>

        {isDev && (
          <div className="mt-4 flex gap-2">
            <button type="button" className="btn btn-sm" onClick={()=>{ setEmail('dm@npx.test'); setPassword('Password123!') }}>Auto-fill DM</button>
            <button type="button" className="btn btn-sm" onClick={()=>{ setEmail('player@npx.test'); setPassword('Password123!') }}>Auto-fill Player</button>
          </div>
        )}

      </div>
    </div>
  )
}
