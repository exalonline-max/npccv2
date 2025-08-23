import React from 'react'
import { useToastStore } from '../state/toastStore'

export default function ToastContainer(){
  const toasts = useToastStore(s => s.toasts)
  const remove = useToastStore(s => s.remove)

  return (
    <div className="fixed right-4 bottom-4 z-50 space-y-2">
      {toasts.map(t => (
        <div key={t.id} className={`card p-3 shadow-md ${t.type === 'error' ? 'bg-red-100' : 'bg-base-100'}`}>
          <div className="flex items-center justify-between">
            <div className="text-sm">{t.msg}</div>
            <button className="btn btn-ghost btn-xs" onClick={()=>remove(t.id)}>✕</button>
          </div>
        </div>
      ))}
    </div>
  )
}
