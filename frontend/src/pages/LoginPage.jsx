import React, { useState } from 'react'
import api from '../lib/api'

export default function LoginPage(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = async ()=>{
    setError('')
    try{
      await api.post('/auth/login', { email, password })
      window.location.href = '/'
    }catch(e){
      setError(e?.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div className="container">
      <h2>Log in</h2>
      <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button onClick={submit}>Log in</button>
      {error && <div style={{color:'red'}}>{error}</div>}
    </div>
  )
}
