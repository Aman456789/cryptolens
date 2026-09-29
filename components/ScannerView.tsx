"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Loader2, Circle } from 'lucide-react'
import Logo from './Logo'
import { useAppContext } from './AppContext'

export default function ScannerView() {
  const router = useRouter()
  const { userUrl, setUserUrl, projectName, setActiveTab } = useAppContext()
  const [running, setRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(-1)
  const [done, setDone] = useState(false)

  const steps = [
    { name: 'Authenticating Project Token & Scope', time: 0 },
    { name: 'Initializing Air-Gapped Scanner Image (ghcr.io)', time: 8500 },
    { name: 'Semgrep AST Cryptographic Discovery', time: 17000 },
    { name: 'AI Triage: DistilRoBERTa Noise Filtration', time: 25500 },
    { name: 'Mosca Dual-Risk Engine (D+T>Q) Evaluation', time: 34000 },
    { name: 'Double-Validation Gate: SAST-on-Patch & NIST KAT', time: 42500 },
    { name: 'Generating CBOM & Persisting to MongoDB', time: 51000 },
  ]

  const startScan = () => {
    if (!userUrl) return
    setRunning(true)
    
    steps.forEach((step, index) => {
      setTimeout(() => {
        setCurrentStep(index)
      }, step.time)
    })

    setTimeout(() => {
      setCurrentStep(7)
      setDone(true)
    }, 60000)
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 font-sans text-slate-900">
      <div className="w-full max-w-2xl bg-white border border-[#E5E5E5] rounded-[16px] p-8 shadow-sm">
        <Logo />
        <h2 className="mt-6 text-2xl font-semibold">Step 2: Initiate Cryptographic Audit</h2>
        <p className="text-slate-500 mt-2 text-sm">Provide the target network URL to begin Nmap discovery.</p>
        
        {!running ? (
          <div className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Target Network URL</label>
              <input 
                value={userUrl} 
                onChange={e => setUserUrl(e.target.value)} 
                type="text" 
                placeholder="xyz.com" 
                className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-[12px] text-sm focus:outline-none focus:border-slate-400" 
              />
            </div>
            <button 
              disabled={!userUrl}
              onClick={startScan}
              className="w-full py-3 bg-[#18181B] text-white rounded-full text-sm font-medium hover:bg-black transition-colors disabled:opacity-50"
            >
              Start Secure Nmap Scan
            </button>
          </div>
        ) : (
          <div className="mt-10">
            <div className="relative pl-6 border-l-2 border-[#E5E5E5] space-y-8 ml-2">
              {steps.map((step, index) => {
                const isActive = currentStep === index;
                const isCompleted = currentStep > index;
                const isPending = currentStep < index;

                return (
                  <div key={index} className="relative">
                    <div className="absolute -left-[35px] bg-white">
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                      ) : isActive ? (
                        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                      ) : (
                        <Circle className="w-6 h-6 text-slate-300" />
                      )}
                    </div>
                    <div>
                      <h4 className={`text-sm font-medium ${isCompleted ? 'text-slate-900' : isActive ? 'text-blue-700' : 'text-slate-400'}`}>
                        {step.name}
                      </h4>
                      <p className="text-xs mt-1 text-slate-500">
                        {isCompleted ? 'Completed' : isActive ? 'Processing...' : 'Pending'}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
            
            {done && (
              <div className="mt-10 flex justify-end pt-6 border-t border-[#E5E5E5]">
                <button 
                  onClick={() => {
                    setActiveTab('dashboard')
                    router.push('/dashboard')
                  }}
                  className="px-8 py-3 bg-[#18181B] text-white rounded-full text-sm font-medium hover:bg-black transition-colors"
                >
                  View Executive Dashboard
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

