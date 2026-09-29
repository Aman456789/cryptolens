"use client"
import React, { useState } from 'react'
import { Save, User, Server, Zap, CheckCircle2 } from 'lucide-react'
import { useAppContext } from './AppContext'

export default function ProfileSettingsView() {
  const { userName, setUserName, userEmail, setUserEmail, projectName, setProjectName, llmMode, setLlmMode } = useAppContext()
  const [localName, setLocalName] = useState(userName)
  const [localEmail, setLocalEmail] = useState(userEmail)
  const [localProject, setLocalProject] = useState(projectName)
  const [localLlm, setLocalLlm] = useState<'cloud' | 'airgap'>(llmMode)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setUserName(localName); setUserEmail(localEmail); setProjectName(localProject); setLlmMode(localLlm)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Profile & Settings</h2>
        <p className="text-sm text-slate-500 mt-1">Manage your operator profile and configure the LLM remediation engine.</p>
      </div>

      {/* Profile Section */}
      <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-xl p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <User className="w-5 h-5 text-slate-500" />
          <h3 className="font-semibold text-slate-900">Operator Profile</h3>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Display Name</label>
          <input value={localName} onChange={e => setLocalName(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
          <input type="email" value={localEmail} onChange={e => setLocalEmail(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Default Project Name</label>
          <input value={localProject} onChange={e => setLocalProject(e.target.value)}
            placeholder="e.g., NQM-2024 Audit"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-colors" />
          <p className="text-xs text-slate-400 mt-1.5">This appears in the top header across all dashboard views.</p>
        </div>
      </div>

      {/* LLM Engine Section */}
      <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-xl p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <Zap className="w-5 h-5 text-slate-500" />
          <h3 className="font-semibold text-slate-900">LLM Remediation Engine</h3>
        </div>
        <p className="text-sm text-slate-500">Select how ECDAT generates AI-assisted remediation guidance for discovered cryptographic weaknesses.</p>
        <div className="space-y-3">
          <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${localLlm === 'cloud' ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-slate-200'}`}>
            <input type="radio" name="llm" value="cloud" checked={localLlm === 'cloud'} onChange={() => setLocalLlm('cloud')} className="mt-0.5 accent-blue-600" />
            <div>
              <p className="text-sm font-semibold text-slate-900">Cloud API Mode</p>
              <p className="text-xs text-slate-500 mt-0.5">Uses ECDAT's hosted Gemini-Ultra endpoint for real-time remediation synthesis. Requires internet connectivity. Recommended for standard deployments.</p>
            </div>
          </label>
          <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${localLlm === 'airgap' ? 'border-purple-500 bg-purple-50' : 'border-slate-100 hover:border-slate-200'}`}>
            <input type="radio" name="llm" value="airgap" checked={localLlm === 'airgap'} onChange={() => setLocalLlm('airgap')} className="mt-0.5 accent-purple-600" />
            <div>
              <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">Air-Gapped NIM Container <Server className="w-3 h-3 text-slate-400" /></p>
              <p className="text-xs text-slate-500 mt-0.5">Runs a local NVIDIA NIM microservice container (Llama-3 70B). No data leaves the network boundary. Required for classified / SCIF environments.</p>
            </div>
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all ${saved ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-black'}`}
        >
          {saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
        </button>
      </div>
    </div>
  )
}

