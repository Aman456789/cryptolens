"use client"
import React, { useState } from 'react'
import { Search, Filter, CheckCircle2, AlertTriangle } from 'lucide-react'
import { useAppContext, cryptoDataMatrix } from './AppContext'

// Full CBOM asset list &mdash; first 4 rows are the provable matrix entries, rest are supporting assets
const ASSETS = [
  { id: 'VULN-001', name: 'RSA Key Generation',       algo: 'RSA-1024/2048',       loc: 'crypto/keys/rsa_utils.py:L42',    pq: 'Vulnerable', risk: 'Critical', replacement: 'ML-KEM-768 (FIPS 203)' },
  { id: 'VULN-002', name: 'TLS Handshake Cipher',     algo: 'ECC (secp256r1)',      loc: 'network/tls_handshake.c:L88',     pq: 'Vulnerable', risk: 'High',     replacement: 'ML-KEM-768 (FIPS 203)' },
  { id: 'VULN-003', name: 'Legacy Block Cipher',      algo: 'Blowfish / SWEET32',  loc: 'legacy/cipher_utils.js:L14',      pq: 'Vulnerable', risk: 'High',     replacement: 'AES-256-GCM'           },
  { id: 'VULN-004', name: 'Auth Hash Function',       algo: 'MD5 / SHA-1',         loc: 'auth/hash_auth.go:L31',           pq: 'Vulnerable', risk: 'Medium',   replacement: 'ML-DSA-65 (FIPS 204)'  },
  { id: 'SAFE-001', name: 'Database Connection',      algo: 'AES-256-GCM',         loc: 'db/connector.ts:L18',             pq: 'Safe',       risk: 'Low',      replacement: '&mdash;'                     },
  { id: 'SAFE-002', name: 'Password Hashing',         algo: 'bcrypt (SHA-512)',     loc: 'user_service.ts:L91',             pq: 'Safe',       risk: 'Low',      replacement: '&mdash;'                     },
  { id: 'SAFE-003', name: 'S3 Bucket Encryption',     algo: 'AES-256-CBC',         loc: 'storage/s3.ts:L23',               pq: 'Safe',       risk: 'Medium',   replacement: '&mdash;'                     },
  { id: 'SAFE-004', name: 'HMAC API Signature',       algo: 'HMAC-SHA256',         loc: 'gateway/middleware.ts:L66',       pq: 'Safe',       risk: 'Low',      replacement: '&mdash;'                     },
  { id: 'SAFE-005', name: 'Session Cookie Secret',    algo: 'AES-256-GCM',         loc: 'session/store.ts:L12',            pq: 'Safe',       risk: 'Low',      replacement: '&mdash;'                     },
  { id: 'SAFE-006', name: 'VPN Tunnel Encryption',    algo: 'AES-256-GCM',         loc: 'vpn/config.yaml:L30',             pq: 'Safe',       risk: 'Low',      replacement: '&mdash;'                     },
  { id: 'SAFE-007', name: 'OTP Secret (TOTP)',        algo: 'HMAC-SHA256',         loc: 'mfa/totp.ts:L17',                 pq: 'Safe',       risk: 'Low',      replacement: '&mdash;'                     },
  { id: 'SAFE-008', name: 'Certificate Signing',      algo: 'SHA-256 (ECDSA P-384)',loc: 'pki/cert.ts:L4',                 pq: 'Safe',       risk: 'Low',      replacement: '&mdash;'                     },
  { id: 'SAFE-009', name: 'Data-at-Rest Key',         algo: 'AES-256-GCM',         loc: 'db/encryption.ts:L55',            pq: 'Safe',       risk: 'Low',      replacement: '&mdash;'                     },
  { id: 'SAFE-010', name: 'OAuth2 Client Secret',     algo: 'PBKDF2-SHA256',       loc: 'oauth/client.ts:L34',             pq: 'Safe',       risk: 'Low',      replacement: '&mdash;'                     },
  { id: 'SAFE-011', name: 'SSH Host Key (Ed25519)',   algo: 'Ed25519 (PQ-aware)',  loc: 'ssh/hostkeys.conf:L1',            pq: 'Safe',       risk: 'Low',      replacement: '&mdash;'                     },
]

export default function CbomInventoryView() {
  const { projectName } = useAppContext()
  const [search, setSearch] = useState('')
  const [filterPq, setFilterPq] = useState('All')
  const [filterRisk, setFilterRisk] = useState('All')

  const filtered = ASSETS.filter(a => {
    const s = search.toLowerCase()
    const matchSearch = a.name.toLowerCase().includes(s) || a.algo.toLowerCase().includes(s) || a.loc.toLowerCase().includes(s)
    const matchPq = filterPq === 'All' || (filterPq === 'Vulnerable' ? a.pq === 'Vulnerable' : a.pq === 'Safe')
    const matchRisk = filterRisk === 'All' || a.risk === filterRisk
    return matchSearch && matchPq && matchRisk
  })

  const pqBadge = (pq: string) => pq === 'Safe' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
  const riskBadge = (r: string) => ({
    Critical: 'bg-rose-100 text-rose-700', High: 'bg-orange-100 text-orange-700',
    Medium: 'bg-amber-100 text-amber-700', Low: 'bg-slate-100 text-slate-600'
  }[r] ?? 'bg-slate-100 text-slate-600')

  // Summary stats derived from matrix
  const vuln = cryptoDataMatrix.totalVulnerabilities
  const rem  = cryptoDataMatrix.remediated
  const pend = cryptoDataMatrix.pending

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{projectName}</p>
        <h2 className="text-2xl font-bold text-slate-900 mt-1">CBOM Inventory</h2>
        <p className="text-sm text-slate-500 mt-1">CycloneDX 1.6 Cryptographic Bill of Materials &mdash; {cryptoDataMatrix.totalAssets.toLocaleString()} total assets ({vuln} vulnerabilities: {pend} pending, {rem} remediated).</p>
      </div>

      {/* Summary strip from matrix */}
      <div className="grid grid-cols-4 gap-3">
        {cryptoDataMatrix.algorithmBreakdown.map(entry => (
          <div key={entry.id} className="bg-white/40 backdrop-blur-md border border-white/60 rounded-xl p-4 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{entry.category}</p>
            <p className="text-sm font-semibold text-slate-800 truncate">{entry.algo}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{entry.count}</p>
            <p className={'text-[10px] font-semibold mt-1 ' + (entry.status === 'Remediated' ? 'text-emerald-600' : 'text-rose-600')}>{entry.status}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-xl p-4 shadow-sm flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, algorithm, or file path..."
            className="bg-transparent text-sm flex-1 outline-none text-slate-700 placeholder-slate-400" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select value={filterPq} onChange={e => setFilterPq(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 outline-none">
            <option>All</option><option>Safe</option><option>Vulnerable</option>
          </select>
          <select value={filterRisk} onChange={e => setFilterRisk(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 outline-none">
            <option>All</option><option>Critical</option><option>High</option><option>Medium</option><option>Low</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-semibold text-slate-500 bg-slate-50 border-b border-slate-100">
              {['ID','Asset Name','Algorithm','Location','PQ Status','Risk','Recommended Replacement'].map(h => (
                <th key={h} className="px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-mono text-[10px] text-slate-400">{a.id}</td>
                <td className="px-4 py-3 font-medium text-slate-800">{a.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-600">{a.algo}</td>
                <td className="px-4 py-3 font-mono text-xs text-blue-600">{a.loc}</td>
                <td className="px-4 py-3">
                  <span className={'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ' + pqBadge(a.pq)}>
                    {a.pq === 'Safe' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    {a.pq}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={'px-2.5 py-0.5 rounded-full text-xs font-semibold ' + riskBadge(a.risk)}>{a.risk}</span>
                </td>
                <td className="px-4 py-3 text-xs font-mono text-slate-500">{a.replacement}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-400 bg-slate-50">
          Showing {filtered.length} of {ASSETS.length} assets Â· {vuln} total vulnerabilities Â· {pend} pending Â· {rem} remediated
        </div>
      </div>
    </div>
  )
}

