"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import Logo from './Logo'
import { useAppContext } from './AppContext'

export default function AuthView() {
  const router = useRouter()
  const { setUserName, setUserEmail } = useAppContext()
  const [authTab, setAuthTab] = useState<'register' | 'login'>('register')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setUserName(name || 'Security Admin')
      setUserEmail(email)
      setAuthTab('login')
      setPassword('')
      setShowPass(false)
    }, 1000)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      router.push('/setup')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 font-sans text-slate-900">
      <div className="w-full max-w-md bg-white border border-[#E5E5E5] rounded-[16px] p-8 shadow-sm">
        <div className="flex flex-col items-center mb-8">
          <Logo />
          <h1 className="mt-6 text-xl font-semibold text-slate-900">ECDAT Authentication</h1>
          <p className="text-sm text-slate-500 mt-2">Enterprise Cryptographic Discovery</p>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => { setAuthTab('register'); setLoading(false) }}
            className={`flex-1 py-2 text-sm font-medium rounded-full transition-colors ${authTab === 'register' ? 'bg-[#18181B] text-white' : 'bg-white text-slate-600 hover:bg-[#E5E5E5]'}`}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => { setAuthTab('login'); setLoading(false) }}
            className={`flex-1 py-2 text-sm font-medium rounded-full transition-colors ${authTab === 'login' ? 'bg-[#18181B] text-white' : 'bg-white text-slate-600 hover:bg-[#E5E5E5]'}`}
          >
            Login
          </button>
        </div>

        {authTab === 'register' ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input required value={name} onChange={e => setName(e.target.value)} type="text" placeholder="Enter Full Name" className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-[12px] text-sm focus:outline-none focus:border-slate-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Work Email</label>
              <input required value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="name@company.com" className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-[12px] text-sm focus:outline-none focus:border-slate-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input required value={password} onChange={e => setPassword(e.target.value)} type={showPass ? 'text' : 'password'} placeholder="........" className="w-full px-4 py-3 pr-10 bg-white border border-[#E5E5E5] rounded-[12px] text-sm focus:outline-none focus:border-slate-400" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button disabled={loading} type="submit" className="w-full mt-4 py-3 bg-[#18181B] text-white rounded-full text-sm font-medium hover:bg-black transition-colors disabled:opacity-70">
              {loading ? <span className="flex items-center gap-2 justify-center"><Loader2 className="w-4 h-4 animate-spin" /> Processing...</span> : <span>Create Account</span>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Work Email</label>
              <input required value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="name@company.com" className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-[12px] text-sm focus:outline-none focus:border-slate-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input required value={password} onChange={e => setPassword(e.target.value)} type={showPass ? 'text' : 'password'} placeholder="........" className="w-full px-4 py-3 pr-10 bg-white border border-[#E5E5E5] rounded-[12px] text-sm focus:outline-none focus:border-slate-400" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button disabled={loading} type="submit" className="w-full mt-4 py-3 bg-[#18181B] text-white rounded-full text-sm font-medium hover:bg-black transition-colors disabled:opacity-70">
              {loading ? <span className="flex items-center gap-2 justify-center"><Loader2 className="w-4 h-4 animate-spin" /> Processing...</span> : <span>Login</span>}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

