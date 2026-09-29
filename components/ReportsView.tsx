"use client"
import React, { useState } from 'react'
import { FileJson, FileText, Sheet, Download, CheckCircle2, Loader2 } from 'lucide-react'
import { useAppContext } from './AppContext'

function DownloadCard({
  icon: Icon, title, description, color, filename, mime, content
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string; description: string; color: string; filename: string; mime: string; content: string
}) {
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle')

  const handleDownload = () => {
    if (mime === 'application/pdf') { window.print(); return; }
    setState('loading')
    setTimeout(() => {
      const blob = new Blob([content], { type: mime })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = filename
      document.body.appendChild(a); a.click()
      document.body.removeChild(a); URL.revokeObjectURL(url)
      setState('done')
      setTimeout(() => setState('idle'), 3000)
    }, 1000)
  }

  return (
    <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-xl p-6 shadow-sm flex flex-col gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500 mt-1">{description}</p>
      </div>
      <button
        onClick={handleDownload}
        disabled={state !== 'idle'}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-lg text-sm font-semibold border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-all disabled:opacity-60 cursor-pointer"
      >
        {state === 'idle' && <><Download className="w-4 h-4" /> Download</>}
        {state === 'loading' && <><Loader2 className="w-4 h-4 animate-spin" /> Downloading...</>}
        {state === 'done' && <><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Downloaded!</>}
      </button>
    </div>
  )
}

export default function ReportsView() {
  const { projectName } = useAppContext()
  const jsonPreview = JSON.stringify({
    bomFormat: "CycloneDX", specVersion: "1.6",
    metadata: { component: { name: projectName || "ECDAT Audit", version: "1.0.0" } },
    summary: { totalAssets: 2104, criticalHigh: 412, remediated: 89, pending: 156 },
    components: [
      { name: "RSA-2048 JWT Key", algorithm: "RS256", location: "auth_service.ts:42", pqStatus: "VULNERABLE" },
      { name: "AES-256-GCM DB Key", algorithm: "AES-256-GCM", location: "db/connector.ts:18", pqStatus: "SAFE" },
      { name: "Blowfish Legacy Module", algorithm: "Blowfish-CBC", location: "crypto/legacy.ts:3", pqStatus: "CRITICAL" }
    ]
  }, null, 2)

  const csvContent = `Asset Name,Algorithm,Location,PQ Status,Risk
JWT Signing Key,RS256 (RSA-2048),auth_service.ts:L42,Vulnerable,Critical
Database Connection,AES-256-GCM,db/connector.ts:L18,Safe,Low
TLS Handshake,ECDHE-RSA-AES128,nginx.conf:L55,Vulnerable,High
Password Hash,bcrypt (SHA-512),user_service.ts:L91,Safe,Low
Legacy API Token,MD5,legacy_api/routes.ts:L7,Vulnerable,Critical`

  const pdfContent = `ECDAT EXECUTIVE SUMMARY REPORT
Project: ${projectName || 'ECDAT Audit'}
Generated: ${new Date().toISOString()}
Standard: NIST FIPS 203/204

EXECUTIVE OVERVIEW
Total Cryptographic Assets: 2,104
Critical & High Findings: 412
Remediated: 89
Pending Action: 156
Compliance Score: 78%

TOP CRITICAL FINDINGS
1. Blowfish-CBC (SWEET32) - 24 instances - IMMEDIATE ACTION REQUIRED
2. RSA-1024 Key Usage - 18 instances - Upgrade to ML-KEM 768
3. MD5 Digest - 15 instances - Replace with SHA-3

RECOMMENDATIONS
Prioritize migration of RSA and ECC primitives to NIST-approved ML-KEM (FIPS 203)
and ML-DSA (FIPS 204) algorithms within 90 days.`

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{projectName}</p>
        <h2 className="text-2xl font-bold text-slate-900 mt-1">Compliance & Remediation Reports</h2>
        <p className="text-sm text-slate-500 mt-1">Export audit-ready reports and cryptographic asset inventories.</p>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <DownloadCard
          icon={FileJson} title="CycloneDX 1.6 CBOM" color="bg-blue-50 text-blue-600"
          description="Machine-readable JSON cryptographic bill of materials conforming to CycloneDX 1.6 specification."
          filename="ecdat-cbom.json" mime="application/json" content={jsonPreview}
        />
        <DownloadCard
          icon={FileText} title="Executive Summary" color="bg-purple-50 text-purple-600"
          description="Executive-level narrative report detailing security posture, risk findings, and PQC recommendations."
          filename="ecdat-executive-summary.txt" mime="application/pdf" content=""
        />
        <DownloadCard
          icon={Sheet} title="Raw Asset Data (CSV)" color="bg-emerald-50 text-emerald-600"
          description="Flat CSV file containing all 2,104 discovered cryptographic asset records for SIEM ingestion."
          filename="ecdat-assets.csv" mime="text/csv" content={csvContent}
        />
      </div>

      {/* JSON Preview Panel */}
      <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50">
          <p className="text-sm font-semibold text-slate-700">JSON Preview &mdash; ecdat-cbom.json</p>
          <span className="text-xs text-slate-400 font-mono">{projectName || 'ECDAT Audit'}</span>
        </div>
        <pre className="p-5 text-xs text-slate-600 font-mono overflow-x-auto bg-white leading-relaxed max-h-72 overflow-y-auto">
          {jsonPreview}
        </pre>
      </div>
    </div>
  )
}

