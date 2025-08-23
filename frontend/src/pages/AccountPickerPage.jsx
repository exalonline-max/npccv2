import React from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import { useAuthStore } from '../state/authStore'
import { useToastStore } from '../state/toastStore'

export default function AccountPickerPage(){
  const memberships = useAuthStore(s=>s.memberships)
  const user = useAuthStore(s=>s.user)
  const [code, setCode] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const fetchMe = useAuthStore(s => s.fetchMe)

  const toast = useToastStore(s => s.push)

  const join = async () => {
    if(!code || code.trim().length < 3){
      toast('Please enter a valid join code', 'error')
      return
    }
    setLoading(true)
    try{
      await api.post('/campaigns/join', { code: code.trim().toUpperCase() })
      await fetchMe()
      toast('Join request submitted', 'info')
      setCode('')
    }catch(e){
      toast(e?.response?.data?.error || 'Failed to join', 'error')
    }finally{
      setLoading(false)
    }
  }

  const [lastCopiedId, setLastCopiedId] = React.useState(null)

  const copyCode = async (membership) => {
    const code = membership?.account?.join_code
    if(!code) return
    try{
      await navigator.clipboard.writeText(code)
      setLastCopiedId(membership.id)
      setTimeout(()=> setLastCopiedId(null), 2000)
    }catch(e){
      // fallback: prompt
      window.prompt('Copy join code', code)
    }
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-semibold mb-4">Your Campaigns</h2>

      <div className="mb-4">
        <Link className="btn btn-primary mr-3" to="/campaigns/create">Create Campaign</Link>
        <Link className="btn btn-ghost" to="/campaigns">Refresh</Link>
      </div>

      <div>
        {memberships.length === 0 && (
          <div className="card p-6 bg-base-200">You have no campaigns yet. Create one or join with a code below.</div>
        )}

        {memberships.map(m => (
          <div key={m.id} className="card bg-base-100 shadow-sm p-4 mb-3 flex items-center justify-between">
            <div>
              <div className="text-lg font-medium">{m.account.display_name || m.account.slug} <span className="badge ml-2">{m.role}</span></div>
              <div className="text-sm text-muted mt-1">slug: <span className="font-mono">{m.account.slug}</span></div>
            </div>

            <div className="flex items-center space-x-3">
              {m.account.join_code && (
                <div className="flex items-center space-x-2">
                  <div className="badge badge-outline font-mono">{m.account.join_code}</div>
                  <button className="btn btn-sm" onClick={()=>copyCode(m)}>{lastCopiedId === m.id ? 'Copied' : 'Copy'}</button>
                </div>
              )}

              <button className="btn btn-sm" onClick={()=> window.open(`https://${m.account.slug}.lvh.me:5173`, '_blank', 'noopener')}>Open</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 card p-4">
        <h3 className="font-bold mb-2">Join Campaign</h3>
        <div className="flex">
          <input className="input input-bordered flex-1 mr-2" placeholder="Enter 6-char code" value={code} onChange={e=>setCode(e.target.value)} />
          <button className="btn" onClick={join} disabled={loading || !code.trim()}>{loading ? 'Joining...' : 'Join'}</button>
        </div>
      </div>
    </div>
  )
}
