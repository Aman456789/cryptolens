"use client"
import React from 'react'
import { useAppContext, cryptoDataMatrix } from './AppContext'

export default function ExecutiveReport() {
  const { projectName } = useAppContext()
  const d = new Date()
  const dateStr = d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  
  return (
    <div className="hidden print:block w-full h-full bg-white text-black font-sans">
      <div className="max-w-[210mm] min-h-[297mm] mx-auto bg-white p-12 relative">
        
        {/* Header */}
        <div className="flex items-end justify-between border-b-2 border-slate-900 pb-6 mb-10">
          <div>
            <img src="/ecdat-logo.svg" alt="ECDAT Logo" className="h-10" onError={(e) => { e.currentTarget.style.display = 'none' }} />
            <div className="text-3xl font-black tracking-tight mt-2 flex items-center">
              <div className="w-6 h-6 bg-blue-600 mr-3 rounded-sm"></div>
              ECDAT
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{projectName || 'Enterprise Audit'}</p>
            <p className="text-sm text-slate-800 font-medium mt-1">{dateStr}</p>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-serif font-bold text-slate-900 mb-8">
          Post-Quantum Cryptographic Audit<br/>
          <span className="text-2xl text-slate-600 font-normal">Executive Report</span>
        </h1>

        {/* Section 1 */}
        <div className="mb-10">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">1. Executive Overview</h2>
          <p className="text-slate-700 leading-relaxed text-sm">
            The ECDAT Enterprise Cryptographic Discovery and Analysis Tool has successfully completed a comprehensive scan of the defined network boundary and source repositories. The analysis identified the presence of legacy cryptographic primitives that are vulnerable to both classical computing exploits and emerging cryptographically-relevant quantum computer (CRQC) threats. Immediate remediation using NIST FIPS 203/204 approved algorithms is required to maintain a secure posture.
          </p>
        </div>

        {/* Section 2 */}
        <div className="mb-10">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">2. Provable Metrics</h2>
          <div className="grid grid-cols-2 gap-px bg-slate-200 border border-slate-200">
            <div className="bg-white p-6">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Assets</p>
              <p className="text-3xl font-bold text-slate-900">{cryptoDataMatrix.totalAssets.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Critical & High Risks</p>
              <p className="text-3xl font-bold text-rose-600">{cryptoDataMatrix.totalVulnerabilities.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Remediated (ML-KEM/AES)</p>
              <p className="text-3xl font-bold text-emerald-600">{cryptoDataMatrix.remediated}</p>
            </div>
            <div className="bg-white p-6">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Pending Action</p>
              <p className="text-3xl font-bold text-orange-500">{cryptoDataMatrix.pending}</p>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="mb-10">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">3. Vulnerability Breakdown</h2>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-slate-500 border-b border-slate-200">
                <th className="font-semibold py-3 px-2">Algorithm</th>
                <th className="font-semibold py-3 px-2">Count</th>
                <th className="font-semibold py-3 px-2">Status</th>
                <th className="font-semibold py-3 px-2">NIST Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cryptoDataMatrix.algorithmBreakdown.map((algo) => (
                <tr key={algo.id}>
                  <td className="py-3 px-2 font-medium text-slate-900">{algo.algo}</td>
                  <td className="py-3 px-2">{algo.count}</td>
                  <td className="py-3 px-2 font-semibold">
                    {algo.status === 'Remediated' ? (
                      <span className="text-emerald-600">{algo.status}</span>
                    ) : (
                      <span className="text-orange-600">{algo.status}</span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-slate-600">{algo.replacement}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 4 */}
        <div className="mb-10">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">4. Mosca Theorem Exposure</h2>
          <div className="bg-slate-50 p-6 border-l-4 border-slate-900 text-sm text-slate-700 leading-relaxed">
            <div className="font-serif text-2xl font-bold mb-3 italic">D + T {'>'} Q</div>
            <p>
              According to Michele Mosca's Theorem, the organizational data is in a vulnerable state. 
              The shelf-life of the cryptographic data (<strong>D</strong>) plus the migration time to post-quantum standards (<strong>T</strong>) 
              currently exceeds the estimated timeline for the arrival of a Cryptographically-Relevant Quantum Computer (<strong>Q</strong>). 
              The network is highly susceptible to <em>Harvest-Now-Decrypt-Later (HNDL)</em> attacks until the pending {cryptoDataMatrix.pending} assets are fully migrated.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-12 left-12 right-12 text-center text-xs text-slate-400 border-t border-slate-200 pt-6">
          CONFIDENTIAL &mdash; strictly restricted to authorized personnel. Generated by ECDAT Enterprise.
        </div>
      </div>
    </div>
  )
}
