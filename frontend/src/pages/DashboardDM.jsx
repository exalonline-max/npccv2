import React, { useState } from 'react'
import LayoutShell from '../components/LayoutShell'
import { useAuthStore } from '../state/authStore'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'

export default function DashboardDM(){
  const logout = useAuthStore(s=>s.logout)
  const user = useAuthStore(s=>s.user)
  const memberships = useAuthStore(s=>s.memberships)
  const selected = useAuthStore(s=>s.selectedAccount)
  const navigate = useNavigate()
  const [messages, setMessages] = useState([
    {id:1, text: 'Welcome to your DM dashboard.'}
  ])
  const [draft, setDraft] = useState('')
  const [sessionActive, setSessionActive] = useState(false)

  const send = (e)=>{
    e.preventDefault()
    if(!draft) return
    setMessages(m=>[...m, { id: Date.now(), text: draft }])
    setDraft('')
  }

  const rollD20 = () => {
    const roll = Math.floor(Math.random() * 20) + 1
    setMessages(m=>[...m, { id: Date.now(), text: `DM rolled d20: ${roll}` }])
  }

  const announceToPlayers = async () => {
    const msg = window.prompt('Announcement to players:')
    if(!msg) return
    // In a real app we'd call an API to broadcast; for now just append locally
    setMessages(m=>[...m, { id: Date.now(), text: `Announcement: ${msg}` }])
  }

  return (
    <LayoutShell>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">DM Dashboard</h1>
        <div>
          <button className="btn btn-ghost mr-2" onClick={()=> navigate(-1)}>Back</button>
          <button className={`btn mr-2 ${sessionActive ? 'btn-warning' : 'btn-success'}`} onClick={()=> setSessionActive(s=>!s)}>{sessionActive ? 'End Session' : 'Start Session'}</button>
          <button className="btn btn-ghost mr-2" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="card p-4 mb-4">
        <div className="h-64 overflow-auto" style={{whiteSpace: 'pre-wrap'}}>
          {messages.map(m=> (
            <div key={m.id} className="py-1">{m.text}</div>
          ))}
        </div>
      </div>

      <div className="card p-4 mb-4">
        <h3 className="text-lg mb-2">Pending Join Requests</h3>
        <Requests />
      </div>

      <div className="card p-4 mb-4">
  <h3 className="text-lg mb-2">Players in this Campaign</h3>
  <PlayersList memberships={memberships} selected={selected} />
      </div>

      <form onSubmit={send} className="flex">
        <input className="input input-bordered flex-1 mr-2" placeholder="Write a message" value={draft} onChange={e=>setDraft(e.target.value)} />
  <button className="btn btn-primary">Send</button>
  <button type="button" className="btn btn-secondary ml-2" onClick={rollD20}>Roll d20</button>
  <button type="button" className="btn ml-2" onClick={announceToPlayers}>Announce</button>
      </form>
    </LayoutShell>
  )
}

function PlayersList({ memberships, selected }){
  const [players, setPlayers] = React.useState([])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(()=>{
    let mounted = true
    const load = async () => {
      setLoading(true)
      try{
        if(selected && selected.id){
          const res = await api.get(`/campaigns/${selected.id}/members`)
          if(mounted){
            setPlayers(res.data.members || [])
          }
        }else{
          // fallback: derive from memberships in client store
          const dm = memberships.find(m=> m.role && m.role.toLowerCase() === 'dm')
          if(dm){
            const derived = memberships.filter(m=> m.account.id === dm.account.id && m.role.toLowerCase() !== 'dm')
            if(mounted) setPlayers(derived)
          }else{
            if(mounted) setPlayers([])
          }
        }
      }catch(e){
        // if forbidden or error, fallback to client-side derivation
        const dm = memberships.find(m=> m.role && m.role.toLowerCase() === 'dm')
        if(dm){
          const derived = memberships.filter(m=> m.account.id === dm.account.id && m.role.toLowerCase() !== 'dm')
          if(mounted) setPlayers(derived)
        }else{
          if(mounted) setPlayers([])
        }
      }finally{
        if(mounted) setLoading(false)
      }
    }
    load()
    return ()=>{ mounted = false }
  }, [selected, memberships])

  if(loading) return <div>Loading players…</div>
  if(players.length === 0) return <div>No players found for this campaign</div>

  return (
    <ul>
      {players.map(p=> (
        <li key={p.id} className="py-2 flex justify-between">
          <div>
            <div className="font-medium">{p.user?.display_name || p.user?.email}</div>
            <div className="text-sm text-muted">{p.user?.email}</div>
          </div>
          <div className="text-sm badge">{p.status || 'active'}</div>
        </li>
      ))}
    </ul>
  )
}

function Requests(){
  const [reqs, setReqs] = React.useState([])

  const fetch = async ()=>{
    try{
      const res = await api.get('/campaigns/requests')
      setReqs(res.data.requests || [])
    }catch(e){
      setReqs([])
    }
  }

  React.useEffect(()=>{ fetch() }, [])

  const approve = async (id)=>{
    await api.post(`/campaigns/requests/${id}/approve`)
    fetch()
  }
  const deny = async (id)=>{
    await api.post(`/campaigns/requests/${id}/deny`)
    fetch()
  }

  if(reqs.length===0) return <div>No pending requests</div>

  return (
    <ul>
      {reqs.map(r=> (
        <li key={r.id} className="flex justify-between py-2">
          <div>{r.user?.display_name || r.user?.email} wants to join {r.account.display_name || r.account.slug}</div>
          <div>
            <button className="btn btn-sm mr-2" onClick={()=>approve(r.id)}>Approve</button>
            <button className="btn btn-sm" onClick={()=>deny(r.id)}>Deny</button>
          </div>
        </li>
      ))}
    </ul>
  )
}
