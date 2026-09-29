"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import Logo from './Logo'
import { useAppContext } from './AppContext'

export default function SetupView() {
  const router = useRouter()
  const { projectName, setProjectName } = useAppContext()

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 font-sans text-slate-900">
      <div className="w-full max-w-lg bg-white border border-[#E5E5E5] rounded-[16px] p-8 shadow-sm">
        <Logo />
        <h2 className="mt-6 text-2xl font-semibold">Create New Audit Project</h2>
        <p className="text-slate-500 mt-2 text-sm">Define the scope of your cryptographic discovery project.</p>
        
        <div className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
            <input 
              value={projectName} 
              onChange={e => setProjectName(e.target.value)} 
              type="text" 
              placeholder="Project Name" 
              className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-[12px] text-sm focus:outline-none focus:border-slate-400" 
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button 
            disabled={!projectName} 
            onClick={() => router.push('/integration')}
            className="px-6 py-3 bg-[#18181B] text-white rounded-full text-sm font-medium hover:bg-black transition-colors disabled:opacity-50"
          >
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  )
}

