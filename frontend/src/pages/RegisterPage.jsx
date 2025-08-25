import React, { useState } from 'react'
import api from '../lib/api'

export default function RegisterPage(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = async ()=>{
    setError('')
    try{
      await api.post('/auth/register', { email, password })
      window.location.href = '/login'
    }catch(e){
      setError(e?.response?.data?.error || 'Register failed')
    }
  }

  return (
    <div className="container">
      <h2>Register</h2>
      <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button onClick={submit}>Register</button>
      {error && <div style={{color:'red'}}>{error}</div>}
    </div>
  )
}
