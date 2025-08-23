import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { useAuthStore } from '../state/authStore'
import { useToastStore } from '../state/toastStore'

export default function RegisterPage(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [display, setDisplay] = useState('')
  const login = useAuthStore(s=>s.login)
  const navigate = useNavigate()

  const toast = useToastStore(s => s.push)
  const submit = async (e)=>{
    e.preventDefault()
    try{
      const res = await api.post('/auth/register', { email, password, display_name: display })
      if(res && res.status === 201){
        // auto-login
  await login(email, password)
  navigate('/campaigns')
      }else{
        toast('Unexpected response', 'error')
      }
    }catch(err){
      const msg = err?.response?.data?.error || err.message || 'Registration failed'
      toast(msg, 'error')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="card p-6">
        <h2 className="text-2xl mb-4">Create your account</h2>
        <form onSubmit={submit}>
          <input className="input input-bordered w-full mb-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="input input-bordered w-full mb-2" placeholder="Display name" value={display} onChange={e=>setDisplay(e.target.value)} />
          <input className="input input-bordered w-full mb-4" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button className="btn btn-primary w-full">Create account</button>
        </form>
      </div>
    </div>
  )
}
