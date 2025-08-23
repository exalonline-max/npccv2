import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { useAuthStore } from '../state/authStore'
import { useToastStore } from '../state/toastStore'

export default function CreateAccountPage(){
  const [slug, setSlug] = useState('')
  const [display, setDisplay] = useState('')
  const user = useAuthStore(s => s.user)
  const navigate = useNavigate()

  const toast = useToastStore(s => s.push)
  const submit = async (e)=>{
    e.preventDefault()
    if(!user){
      // not signed in
      toast('You must be signed in to create a campaign', 'error')
      navigate('/login')
      return
    }

    if(!/^[a-z0-9-]{3,50}$/.test(slug)){
      toast('invalid slug', 'error')
      return
    }

    try{
      const res = await api.post('/campaigns', { slug, display_name: display })
      if(res && res.status === 201){
        toast('Campaign created', 'success')
        // provide an explicit open button instead of redirecting the current tab
        const open = () => window.open(`https://${slug}.lvh.me:5173`, '_blank', 'noopener')
        // lightweight confirm CTA
        if(window.confirm('Campaign created. Open in a new tab?')){
          open()
        }
      }else{
        toast('Unexpected response from server', 'error')
      }
    }catch(err){
      const msg = err?.response?.data?.error || err.message || 'Failed to create campaign'
      toast(msg, 'error')
    }
  }

  const goBack = () => {
    try{
      if(window.history.length > 1){
        navigate(-1)
      }else{
        navigate('/campaigns')
      }
    }catch(e){
      navigate('/campaigns')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl">Create Campaign</h2>
          <button className="btn btn-ghost" onClick={goBack}>Cancel</button>
        </div>
        <form onSubmit={submit}>
          <input className="input input-bordered w-full mb-2" placeholder="slug (subdomain)" value={slug} onChange={e=>setSlug(e.target.value)} />
          <input className="input input-bordered w-full mb-4" placeholder="display name" value={display} onChange={e=>setDisplay(e.target.value)} />
          <div className="flex">
            <button className="btn btn-primary w-full">Create Campaign</button>
          </div>
        </form>
      </div>
    </div>
  )
}
