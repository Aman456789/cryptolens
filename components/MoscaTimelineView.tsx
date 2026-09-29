"use client"
import React, { useState } from 'react'
import { AlertTriangle, Shield, Clock, Zap } from 'lucide-react'
import { useAppContext } from './AppContext'

export default function MoscaTimelineView() {
  const { projectName } = useAppContext()
  const [D, setD] = useState(5)
  const [T, setT] = useState(5)
  const [Q, setQ] = useState(8)

  const isVulnerable = D + T > Q
  const currentYear = 2026
  const totalSpan = Math.max(D + T, Q) + 2
  const dPct  = Math.round((D / totalSpan) * 100)
  const tPct  = Math.round((T / totalSpan) * 100)
  const qMark = Math.round((Q / totalSpan) * 100)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{projectName}</p>
        <h2 className="text-2xl font-bold text-slate-900">Mosca HNDL Timeline Simulator</h2>
        <p className="text-sm text-slate-500 mt-1">
          Quantify your exposure window to Harvest Now, Decrypt Later (HNDL) attacks using Michele Mosca's Theorem:
          {' '}<span className="font-bold text-slate-800 italic">D + T &gt; Q</span>
        </p>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-xl p-5 shadow-sm">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
            <Shield className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xs text-slate-500 font-medium mb-0.5">Security Shelf-Life (<em>D</em>)</p>
          <p className="text-3xl font-bold text-slate-900">{D}<span className="text-base font-medium text-slate-400 ml-1">yr</span></p>
          <p className="text-[11px] text-slate-400 mt-1 leading-tight">How long your encrypted data must remain secret.</p>
        </div>
        <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-xl p-5 shadow-sm">
          <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center mb-3">
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-xs text-slate-500 font-medium mb-0.5">PQC Migration Time (<em>T</em>)</p>
          <p className="text-3xl font-bold text-slate-900">{T}<span className="text-base font-medium text-slate-400 ml-1">yr</span></p>
          <p className="text-[11px] text-slate-400 mt-1 leading-tight">Time required to migrate to Post-Quantum Cryptography.</p>
        </div>
        <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-xl p-5 shadow-sm">
          <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center mb-3">
            <Zap className="w-4 h-4 text-slate-600" />
          </div>
          <p className="text-xs text-slate-500 font-medium mb-0.5">Q-Day Arrival (Est. <em>Q</em>)</p>
          <p className="text-3xl font-bold text-slate-900">{Q}<span className="text-base font-medium text-slate-400 ml-1">yr</span></p>
          <p className="text-[11px] text-slate-400 mt-1 leading-tight">Predicted arrival of a cryptographically-relevant quantum computer.</p>
        </div>
      </div>

      {/* Sliders */}
      <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-xl p-6 shadow-sm space-y-6">
        <h3 className="text-sm font-semibold text-slate-900">Adjust Parameters</h3>
        {[
          { label: 'D &mdash; Security Shelf-Life', val: D, set: setD, max: 20, color: 'accent-blue-600', textColor: 'text-blue-600' },
          { label: 'T &mdash; PQC Migration Time', val: T, set: setT, max: 15, color: 'accent-purple-600', textColor: 'text-purple-600' },
          { label: 'Q &mdash; Q-Day Estimated Arrival', val: Q, set: setQ, max: 20, color: 'accent-slate-700', textColor: 'text-slate-700' },
        ].map(({ label, val, set, max, color, textColor }) => (
          <div key={label}>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-700">{label}</label>
              <span className={`text-sm font-bold ${textColor}`}>{val} years</span>
            </div>
            <input type="range" min={1} max={max} value={val}
              onChange={e => set(Number(e.target.value))}
              className={`w-full h-2 rounded-full appearance-none bg-slate-100 cursor-pointer ${color}`} />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>1 yr</span><span>{max} yr</span>
            </div>
          </div>
        ))}
      </div>

      {/* Timeline Bar */}
      <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900 mb-2">
          Visual Exposure Timeline <span className="font-normal text-slate-500">(Current Year: {currentYear})</span>
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Showing D={D}yr + T={T}yr = <strong>{D+T} yr</strong> total window vs Q-Day in <strong>{Q} yr</strong> (~{currentYear + Q}).
        </p>

        {/* Bar */}
        <div className="relative w-full h-11 flex rounded-xl overflow-hidden shadow-inner">
          <div
            className="bg-blue-500 flex items-center justify-center text-white text-xs font-bold transition-all duration-500"
            style={{ width: `${dPct}%` }}
          >D={D}yr</div>
          <div
            className="bg-purple-500 flex items-center justify-center text-white text-xs font-bold transition-all duration-500"
            style={{ width: `${tPct}%` }}
          >T={T}yr</div>
          <div
            className="bg-slate-700 flex-1 flex items-center justify-center text-white text-xs font-bold"
          >Q-Day ~{currentYear + Q}</div>
        </div>

        {/* Q-Day marker line */}
        <div className="relative mt-2" style={{ height: 24 }}>
          <div className="absolute flex flex-col items-center" style={{ left: `${qMark}%`, transform: 'translateX(-50%)' }}>
            <div className="w-px h-3 bg-red-500"></div>
            <span className="text-[10px] text-red-600 font-bold whitespace-nowrap mt-0.5">â&ndash;² Q-Day ~{currentYear + Q}</span>
          </div>
        </div>

        <div className="flex gap-4 mt-4 flex-wrap">
          {[['bg-blue-500','D &mdash; Security Shelf-Life'],['bg-purple-500','T &mdash; PQC Migration Time'],['bg-slate-700','Q-Day (Crypto-Relevant QC)']].map(([c,l]) => (
            <div key={l} className="flex items-center gap-2 text-xs text-slate-600">
              <div className={`w-3 h-2 rounded ${c}`}></div>{l}
            </div>
          ))}
        </div>
      </div>

      {/* Verdict */}
      <div className={`rounded-xl p-6 border-2 ${isVulnerable ? 'bg-rose-50 border-rose-300' : 'bg-emerald-50 border-emerald-300'}`}>
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isVulnerable ? 'bg-rose-100' : 'bg-emerald-100'}`}>
            <AlertTriangle className={`w-5 h-5 ${isVulnerable ? 'text-rose-600' : 'text-emerald-600'}`} />
          </div>
          <div>
            <h3 className={`font-bold text-lg ${isVulnerable ? 'text-rose-800' : 'text-emerald-800'}`}>
              {isVulnerable
                ? `VULNERABLE: D(${D}) + T(${T}) = ${D+T} > Q(${Q}) &mdash; Immediate Action Required`
                : `PROTECTED: D(${D}) + T(${T}) = ${D+T} â‰¤ Q(${Q}) &mdash; Within Safe Bounds`}
            </h3>
            <p className={`text-sm mt-2 leading-relaxed ${isVulnerable ? 'text-rose-700' : 'text-emerald-700'}`}>
              {isVulnerable
                ? `Your combined data shelf-life (${D}yr) and PQC migration window (${T}yr) totals ${D+T} years, exceeding the estimated ${Q}-year window to a cryptographically-relevant quantum computer (Q-Day ~${currentYear + Q}). Adversaries are likely already harvesting encrypted traffic for future decryption. Accelerate PQC migration to NIST FIPS 203 (ML-KEM) and FIPS 204 (ML-DSA) immediately.`
                : `Your combined window of ${D+T} years falls within the estimated ${Q}-year Q-Day arrival (~${currentYear + Q}). Continue accelerating migration to ML-KEM and ML-DSA to maintain this posture before quantum computing advances beyond projections.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

