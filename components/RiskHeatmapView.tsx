"use client"
import React from 'react'
import { useAppContext } from './AppContext'

const heatData = [
  { id: 'h1', label: 'SWEET32 / Blowfish', impact: 4, likelihood: 4, count: 24, category: 'Crypto Weakness' },
  { id: 'h2', label: 'RSA-1024 Key Usage', impact: 4, likelihood: 3, count: 18, category: 'Asymmetric Weakness' },
  { id: 'h3', label: 'MD5 Digest Collision', impact: 3, likelihood: 4, count: 15, category: 'Hash Weakness' },
  { id: 'h4', label: 'Insecure PRNG (Math.random)', impact: 3, likelihood: 3, count: 12, category: 'Randomness' },
  { id: 'h5', label: 'Broken ECDH secp112r1', impact: 4, likelihood: 2, count: 9, category: 'Key Exchange' },
  { id: 'h6', label: 'Missing TLS Cert Pinning', impact: 2, likelihood: 3, count: 7, category: 'Transport' },
  { id: 'h7', label: 'Cleartext API Credentials', impact: 3, likelihood: 2, count: 6, category: 'Secrets Mgmt' },
  { id: 'h8', label: 'Outdated TLS 1.1 Enabled', impact: 2, likelihood: 2, count: 5, category: 'Transport' },
  { id: 'h9', label: 'SHA-1 Signing Certificate', impact: 1, likelihood: 2, count: 3, category: 'Hash Weakness' },
]

function cellColor(impact: number, likelihood: number) {
  const score = impact * likelihood
  if (score >= 12) return 'bg-rose-600 text-white'
  if (score >= 8)  return 'bg-orange-500 text-white'
  if (score >= 4)  return 'bg-amber-400 text-slate-900'
  return 'bg-emerald-100 text-emerald-900'
}

function riskLabel(impact: number, likelihood: number) {
  const score = impact * likelihood
  if (score >= 12) return 'Critical'
  if (score >= 8)  return 'High'
  if (score >= 4)  return 'Medium'
  return 'Low'
}

const AXES = ['1 â€“ Low', '2 â€“ Minor', '3 â€“ Moderate', '4 â€“ Severe']

export default function RiskHeatmapView() {
  const { projectName } = useAppContext()
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{projectName}</p>
        <h2 className="text-2xl font-bold text-slate-900 mt-1">Risk Heatmap</h2>
        <p className="text-sm text-slate-500 mt-1">Impact vs. Likelihood matrix of 412 Critical & High severity findings.</p>
      </div>

      <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-xl p-6 shadow-sm">
        <div className="flex gap-2 items-end">
          {/* Y-Axis Label */}
          <div className="flex flex-col justify-between h-64 pr-2 items-end shrink-0">
            <span className="text-[10px] text-slate-500 rotate-0 leading-3">4 â€“ Severe</span>
            <span className="text-[10px] text-slate-500">3 â€“ Moderate</span>
            <span className="text-[10px] text-slate-500">2 â€“ Minor</span>
            <span className="text-[10px] text-slate-500">1 â€“ Low</span>
          </div>

          {/* Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-4 gap-1" style={{ height: 256 }}>
              {[4,3,2,1].map(impact =>
                [1,2,3,4].map(likelihood => {
                  const items = heatData.filter(d => d.impact === impact && d.likelihood === likelihood)
                  return (
                    <div
                      key={`${impact}-${likelihood}`}
                      className={`rounded-lg flex flex-col items-center justify-center p-2 min-h-[60px] ${cellColor(impact, likelihood)}`}
                    >
                      {items.map(it => (
                        <span key={it.id} className="text-[9px] font-semibold text-center leading-tight">{it.label}</span>
                      ))}
                      {items.length > 0 && (
                        <span className="text-[10px] mt-1 opacity-80">{items.reduce((a,b) => a+b.count,0)} vulns</span>
                      )}
                    </div>
                  )
                })
              )}
            </div>
            {/* X-Axis */}
            <div className="grid grid-cols-4 gap-1 mt-1">
              {AXES.map(l => <div key={l} className="text-[10px] text-slate-500 text-center">{l}</div>)}
            </div>
            <div className="text-center text-xs text-slate-400 mt-1 font-medium">Likelihood â†’</div>
          </div>

          {/* Y Label */}
          <div className="writing-mode-vert pl-2 text-xs text-slate-400 font-medium" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}>
            Impact â†‘
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-4 mt-6 flex-wrap">
          {[['bg-rose-600','Critical (12-16)'],['bg-orange-500','High (8-11)'],['bg-amber-400','Medium (4-7)'],['bg-emerald-100','Low (1-3)']].map(([c,l]) => (
            <div key={l} className="flex items-center gap-2 text-xs text-slate-600">
              <div className={`w-3 h-3 rounded ${c}`}></div>{l}
            </div>
          ))}
        </div>
      </div>

      {/* Top 5 Table */}
      <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Top 5 Highest-Risk Components</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-semibold text-slate-500 border-b border-slate-100">
              <th className="pb-3 pr-4">Finding</th>
              <th className="pb-3 pr-4">Category</th>
              <th className="pb-3 pr-4">Risk Level</th>
              <th className="pb-3">Vuln Count</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {heatData.slice(0,5).map(r => (
              <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 pr-4 font-medium text-slate-800">{r.label}</td>
                <td className="py-3 pr-4 text-slate-500">{r.category}</td>
                <td className="py-3 pr-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${riskLabel(r.impact,r.likelihood) === 'Critical' ? 'bg-rose-100 text-rose-700' : riskLabel(r.impact,r.likelihood) === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-amber-100 text-amber-700'}`}>
                    {riskLabel(r.impact,r.likelihood)}
                  </span>
                </td>
                <td className="py-3 font-bold text-slate-900">{r.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

