import React, { useEffect, useState } from 'react'
import api from '../lib/api'

export default function DashboardPage(){
  const [user, setUser] = useState(null)
  const [campaigns, setCampaigns] = useState([])
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  useEffect(()=>{
    const load = async ()=>{
      try{
        const res = await api.get('/me')
        setUser(res.data.user)
        setCampaigns(res.data.campaigns || [])
      }catch(e){
        // not authenticated
      }
    }
    load()
  }, [])

  const create = async ()=>{
    setError('')
    try{
      const res = await api.post('/campaigns', { name })
      setCampaigns([...campaigns, res.data.campaign])
      setName('')
    }catch(e){
      setError(e?.response?.data?.error || 'Failed')
    }
  }

  return (
    <div className="container">
      <h2>Dashboard</h2>
      {user && <div>
        <strong>{user.display_name || user.email}</strong>
      </div>}
      <div>
        <h3>Campaigns</h3>
        <ul>
          {campaigns.map(c=> <li key={c.id}>{c.name}</li>)}
        </ul>
        <input placeholder="New campaign name" value={name} onChange={e=>setName(e.target.value)} />
        <button onClick={create}>Create</button>
        {error && <div style={{color:'red'}}>{error}</div>}
      </div>
    </div>
  )
}
