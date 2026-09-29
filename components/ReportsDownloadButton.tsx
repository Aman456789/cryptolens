"use client"
import React, { useState } from 'react'
export default function ReportsDownloadButton({ label }: { label: string }) {
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle')
  const handleClick = () => {
    setState('loading')
    setTimeout(() => setState('done'), 1500)
    setTimeout(() => setState('idle'), 3500)
  }
  return (
    <button 
      onClick={handleClick}
      disabled={state !== 'idle'}
      className={`w-full mt-6 py-2.5 rounded-full text-sm font-medium transition-colors ${state === 'done' ? 'bg-emerald-600 text-white' : 'bg-[#18181B] text-white hover:bg-black disabled:opacity-70'}`}
    >
      {state === 'idle' && label}
      {state === 'loading' && 'Downloading...'}
      {state === 'done' && 'Success'}
    </button>
  )
}

