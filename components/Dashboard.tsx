"use client"
import React, { useState } from 'react'
import {
  Search, FileText, Activity, LayoutDashboard, Network, Database, Lock,
  RefreshCw, AlertCircle, CircleUser, Calendar, ChevronDown, Clock, Cpu,
  CheckCircle2, X, ExternalLink, Settings, ShieldAlert, ArrowRight, GitMerge
} from 'lucide-react'
import Logo from './Logo'
import { useAppContext, cryptoDataMatrix } from './AppContext'
import RiskHeatmapView from './RiskHeatmapView'
import CbomInventoryView from './CbomInventoryView'
import MoscaTimelineView from './MoscaTimelineView'
import ReportsView from './ReportsView'
import ProfileSettingsView from './ProfileSettingsView'
import MigrationPlannerView from './MigrationPlannerView'
import ExecutiveReport from './ExecutiveReport'

export default function Dashboard() {
  const { activeTab, setActiveTab, projectName, userName, userEmail } = useAppContext()
  const [showAllRisks, setShowAllRisks] = useState(false)
  const [selectedNode, setSelectedNode] = useState<number | null>(null)

  const mockRisks = [
    { id: 1, title: "RSA-1024 detected in auth.js", severity: "Critical" },
    { id: 2, title: "MD5 hash collision in user_service", severity: "High" },
    { id: 3, title: "SWEET32 (Blowfish) in legacy API", severity: "Critical" },
    { id: 4, title: "Hardcoded symmetric key in config.yaml", severity: "High" },
    { id: 5, title: "SHA-1 used for digital signatures", severity: "Medium" },
    { id: 6, title: "Missing secure flag on session cookie", severity: "Medium" },
    { id: 7, title: "Outdated TLS 1.1 protocol still enabled", severity: "High" },
    { id: 8, title: "Insecure PRNG (Math.random) used for tokens", severity: "High" },
    { id: 9, title: "Weak ECDH curve (secp112r1) in VPN config", severity: "Medium" },
    { id: 10, title: "Cleartext credentials found in error logs", severity: "Critical" },
  ]

  const nodes = [
    { id: 0, title: "Main Server",     ip: "10.0.1.10",    status: "Secured",           details: "Ports: 443, 8443 | Crypto: ML-KEM Ready", color: "bg-emerald-500", x: 380, y: 270 },
    { id: 1, title: "Cloud Gateway",   ip: "52.12.34.56",  status: "Monitored",          details: "Protocol: TLS 1.3",                        color: "bg-blue-500",    x: 380, y: 100 },
    { id: 2, title: "Target API",      ip: "api.internal", status: "Active",             details: "Active Sessions: 1,204",                   color: "bg-indigo-500",  x: 600, y: 190 },
    { id: 3, title: "Database",        ip: "10.0.5.8",     status: "Secured",            details: "Encryption: AES-256-GCM",                  color: "bg-emerald-500", x: 600, y: 380 },
    { id: 4, title: "Key Vault",       ip: "10.0.6.12",    status: "Highly Restricted",  details: "Keys Managed: 142",                        color: "bg-purple-500",  x: 160, y: 380 },
    { id: 5, title: "Untrusted Host",  ip: "192.168.1.45", status: "VULNERABLE",         details: "SWEET32 (Blowfish) Detected. Immediate remediation required.", color: "bg-rose-500", x: 140, y: 190 },
  ]

  const edges = [
    [1,0],[0,2],[0,3],[0,4],[5,1],[5,4]
  ]

  const navItems = [
    { tab: 'planner', icon: GitMerge, label: 'Migration Planner', section: 'Remediation & Reports' },
    { tab: 'dashboard', icon: LayoutDashboard, label: 'Executive Dashboard', section: 'Overview' },
    { tab: 'topology',  icon: Network,         label: 'Network Topology',    section: 'Overview' },
    { tab: 'heatmap',   icon: Activity,        label: 'Risk Heatmap',        section: 'Discovery & Analysis' },
    { tab: 'cbom',      icon: Database,        label: 'CBOM Inventory',      section: 'Discovery & Analysis' },
    { tab: 'timeline',  icon: RefreshCw,       label: 'Mosca HNDL Timeline', section: 'Discovery & Analysis' },
    { tab: 'reports',   icon: FileText,        label: 'Compliance Reports',  section: 'Remediation & Reports' },
    { tab: 'settings',  icon: Settings,        label: 'Profile & Settings',  section: 'bottom' },
  ]

  const sections = ['Overview', 'Discovery & Analysis', 'Remediation & Reports']

  return (
    <>
    <div className="min-h-screen bg-white flex font-sans text-slate-900 overflow-hidden relative print:hidden">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
        @keyframes flow  { from { stroke-dashoffset: 24 } to { stroke-dashoffset: 0 } }
        .node-float   { animation: float 4.0s ease-in-out infinite }
        .node-float-d1{ animation: float 4.0s ease-in-out infinite 1.3s }
        .node-float-d2{ animation: float 4.0s ease-in-out infinite 2.6s }
        .data-flow    { animation: flow 1s linear infinite }
      `}} />

      {/* Sidebar */}
      <aside className="w-64 border-r border-[#E5E5E5] bg-white flex flex-col p-4 shrink-0 z-10">
        <div className="flex items-center gap-3 px-2 mb-8 mt-2">
          <Logo />
          <div>
            <p className="font-semibold text-sm">ECDAT</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Post-Quantum Analysis</p>
          </div>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto">
          {sections.map(section => (
            <div key={section}>
              <p className="px-3 text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">{section}</p>
              {navItems.filter(n => n.section === section).map(({ tab, icon: Icon, label }) => (
                <button key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Icon className="w-4 h-4 shrink-0" /> {label}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Profile & Settings at bottom */}
        <div className="pt-4 border-t border-slate-100 mt-4">
          <button
            onClick={() => setActiveTab('settings' as any)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Settings className="w-4 h-4 shrink-0" /> Profile & Settings
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-16 border-b border-[#E5E5E5] bg-white flex items-center justify-between px-8 shrink-0 z-10">
          <div className="text-base font-semibold text-slate-800">{projectName || 'CryptoLens Project'}</div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 cursor-pointer hover:bg-slate-200 transition-colors">
              <CircleUser className="w-5 h-5" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 bg-slate-50">

          {/* â&quot;€â&quot;€ Executive Dashboard â&quot;€â&quot;€ */}
          {activeTab === 'dashboard' && (
            <div className="max-w-6xl mx-auto space-y-4">
              <div className="flex justify-between items-end pb-2">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{projectName}</p>
                  <h2 className="text-[28px] font-bold text-blue-950 tracking-tight mt-1">Executive Summary</h2>
                  <p className="text-sm text-slate-500 mt-1">Overall security posture and key metrics at a glance.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 cursor-pointer transition-colors">
                  <Calendar className="w-4 h-4 text-slate-500" /> Last 7 days <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
                </button>
              </div>

              {/* 4 Metric Cards */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { icon: ShieldAlert, color: 'bg-rose-50 text-rose-500', label: 'Total Vulnerabilities', val: '2,104', trend: 'â†&mdash; 12%', trendColor: 'text-rose-600' },
                  { icon: Cpu,         color: 'bg-blue-50 text-blue-600',  label: 'Critical & High',       val: '568',   trend: 'â†˜ 25%', trendColor: 'text-emerald-500' },
                  { icon: CheckCircle2,color: 'bg-emerald-50 text-emerald-500', label: 'Remediated',       val: '890',   trend: 'â†&mdash; 18%', trendColor: 'text-emerald-500' },
                  { icon: Clock,       color: 'bg-purple-50 text-purple-500', label: 'Pending',            val: '646',   trend: 'â†˜ 40%', trendColor: 'text-emerald-500' },
                ].map(({ icon: Icon, color, label, val, trend, trendColor }) => (
                  <div key={label} className="bg-white/40 backdrop-blur-md border border-white/60 rounded-xl p-5 shadow-sm">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-medium text-slate-500 mb-1">{label}</p>
                    <p className="text-3xl font-bold text-slate-900 mb-3">{val}</p>
                    <p className={`text-xs font-medium flex items-center gap-1 ${trendColor}`}>
                      {trend} <span className="text-slate-400 font-normal">vs. previous 7 days</span>
                    </p>
                  </div>
                ))}
              </div>

              {/* Compliance */}
              <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-xl p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Compliance Progress</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full" style={{ width: '78%' }} />
                  </div>
                  <span className="font-bold text-slate-900 text-sm">78%</span>
                </div>
                <div className="flex items-center gap-6 text-xs font-medium">
                  {[['bg-emerald-500','Compliant','78%'],['bg-blue-500','At Risk','12%'],['bg-slate-300','Non-Compliant','10%']].map(([c,l,v]) => (
                    <div key={l} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${c}`} />
                      <span className="text-slate-500">{l} <strong className="text-slate-700">{v}</strong></span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Radar */}
                <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-xl p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-900 mb-4">Security Posture</h3>
                  <div className="relative w-full h-[240px] flex items-center justify-center">
                    <svg width="230" height="230" viewBox="0 0 240 240">
                      <polygon points="120,20 215,89 179,200 61,200 25,89" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
                      <polygon points="120,45 191,96 164,179 76,179 49,96" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
                      <polygon points="120,70 167,104 149,158 91,158 73,104" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
                      <line x1="120" y1="120" x2="120" y2="20" stroke="#e2e8f0" strokeWidth="1"/>
                      <line x1="120" y1="120" x2="215" y2="89" stroke="#e2e8f0" strokeWidth="1"/>
                      <line x1="120" y1="120" x2="179" y2="200" stroke="#e2e8f0" strokeWidth="1"/>
                      <line x1="120" y1="120" x2="61" y2="200" stroke="#e2e8f0" strokeWidth="1"/>
                      <line x1="120" y1="120" x2="25" y2="89" stroke="#e2e8f0" strokeWidth="1"/>
                      <polygon points="120,28 203.7,92.8 164.6,181.4 70.1,188.7 42.9,94.9" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth="2"/>
                      <circle cx="120" cy="28" r="3" fill="#3b82f6"/>
                      <circle cx="203.7" cy="92.8" r="3" fill="#3b82f6"/>
                      <circle cx="164.6" cy="181.4" r="3" fill="#3b82f6"/>
                      <circle cx="70.1" cy="188.7" r="3" fill="#3b82f6"/>
                      <circle cx="42.9" cy="94.9" r="3" fill="#3b82f6"/>
                    </svg>
                    <div className="absolute top-0 w-full text-center text-[10px] text-slate-500">Network Security<br/><strong className="text-slate-900">92%</strong></div>
                    <div className="absolute right-0 top-1/3 text-right text-[10px] text-slate-500 pr-1">Endpoint<br/>Security<br/><strong className="text-slate-900">88%</strong></div>
                    <div className="absolute right-4 bottom-1 text-right text-[10px] text-slate-500">Application<br/><strong className="text-slate-900">76%</strong></div>
                    <div className="absolute left-5 bottom-1 text-left text-[10px] text-slate-500">Data Security<br/><strong className="text-slate-900">85%</strong></div>
                    <div className="absolute left-0 top-1/3 text-left text-[10px] text-slate-500 pl-1">Identity &<br/>Access<br/><strong className="text-slate-900">81%</strong></div>
                  </div>
                </div>

                {/* Top Risks */}
                <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-xl p-6 shadow-sm flex flex-col">
                  <h3 className="text-sm font-semibold text-slate-900 mb-6">Top Risks</h3>
                  <div className="space-y-4 flex-1">
                    {cryptoDataMatrix.algorithmBreakdown.map((entry) => {
                      const dotColor = entry.risk === 'Critical' ? 'bg-rose-500' : entry.risk === 'High' ? 'bg-orange-400' : 'bg-amber-400'
                      return (
                        <div key={entry.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={'w-2 h-2 rounded-full ' + dotColor} />
                            <span className="text-sm text-slate-600 font-medium">{entry.algo}</span>
                          </div>
                          <span className="text-sm font-bold text-slate-900">{entry.count}</span>
                        </div>
                      )
                    })}
                  </div>
                  <button onClick={() => setShowAllRisks(true)} className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1 mt-6 cursor-pointer">
                    View All <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>


              {/* Migration Program + Readiness Radar Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* NIST FIPS 203/204 Migration Program */}
                <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-xl p-6 shadow-sm flex flex-col gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Migration Program</p>
                    <div className="flex justify-between items-center">
                      <h3 className="text-base font-bold text-slate-900">NIST FIPS 203/204 readiness</h3>
                      <span className="text-sm font-bold text-emerald-600">76% complete</span>
                    </div>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400" style={{ width: '76%' }} />
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    {[['Migrated','1,603','text-emerald-600'],['In remediation','412','text-orange-500'],['Untriaged','89','text-slate-500']].map(([label, val, cls]) => (
                      <div key={label}>
                        <p className="text-xs text-slate-400">{label}</p>
                        <p className={`text-2xl font-bold mt-0.5 ${cls}`}>{val}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Readiness Radar */}
                <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Security Dimensions</p>
                      <h3 className="text-base font-bold text-slate-900">Readiness radar</h3>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    {/* Hexagonal SVG Radar */}
                    <svg width="140" height="130" viewBox="0 0 140 130" className="shrink-0">
                      {/* Hex grids */}
                      {[1,0.75,0.5,0.25].map((scale, i) => (
                        <polygon key={i}
                          points={[0,1,2,3,4,5].map(k => {
                            const angle = (k * 60 - 90) * Math.PI / 180
                            return `${70 + 55 * scale * Math.cos(angle)},${65 + 55 * scale * Math.sin(angle)}`
                          }).join(' ')}
                          fill="none" stroke="#e2e8f0" strokeWidth="1"
                        />
                      ))}
                      {/* Spokes */}
                      {[0,1,2,3,4,5].map(k => {
                        const angle = (k * 60 - 90) * Math.PI / 180
                        return <line key={k} x1="70" y1="65" x2={70 + 55 * Math.cos(angle)} y2={65 + 55 * Math.sin(angle)} stroke="#e2e8f0" strokeWidth="1"/>
                      })}
                      {/* Data polygon: 88,64,72,81,58,76 â†&apos; as fractions of 100 */}
                      <polygon
                        points={[88,64,72,81,58,76].map((v, k) => {
                          const angle = (k * 60 - 90) * Math.PI / 180
                          const r = 55 * (v / 100)
                          return `${70 + r * Math.cos(angle)},${65 + r * Math.sin(angle)}`
                        }).join(' ')}
                        fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth="2"
                      />
                      {[88,64,72,81,58,76].map((v, k) => {
                        const angle = (k * 60 - 90) * Math.PI / 180
                        const r = 55 * (v / 100)
                        return <circle key={k} cx={70 + r * Math.cos(angle)} cy={65 + r * Math.sin(angle)} r="3" fill="#3b82f6"/>
                      })}
                    </svg>
                    {/* Legend */}
                    <div className="space-y-2 my-auto">
                      {[['Quantum urgency','88'],['Network exposure','64'],['Code vulnerability','72'],['Data shelf life','81'],['Cryptographic entropy','58'],['Migration readiness','76']].map(([label, val]) => (
                        <div key={label} className="flex items-center justify-between gap-4 text-xs">
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                            <span className="text-slate-500 whitespace-nowrap">{label}</span>
                          </div>
                          <span className="font-bold text-slate-900">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Control Plane / Telemetry */}
              <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Discovery Telemetry</p>
                    <h3 className="text-base font-bold text-slate-900">Active control plane</h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-emerald-600">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { name: 'Semgrep AST', sub: '18 repos indexed', value: '98.2%', color: 'text-blue-600' },
                    { name: 'DistilRoBERTa', sub: 'Context checks', value: '512 tokens', color: 'text-purple-600' },
                    { name: 'Mosca engine', sub: 'Risk calculations', value: 'D + T > Q', color: 'text-rose-600' },
                    { name: 'Asset sync', sub: 'Network boundaries', value: '6 online', color: 'text-emerald-600' },
                  ].map(({ name, sub, value, color }) => (
                    <div key={name} className="bg-white/20 backdrop-blur-md border border-white/50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-semibold text-slate-700">{name}</span>
                      </div>
                      <p className="text-xs text-slate-400 mb-1">{sub}</p>
                      <p className={`text-sm font-bold ${color}`}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* All Risks Modal */}
              {showAllRisks && (
                <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">All Identified Vulnerabilities</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Comprehensive risk register for this audit cycle.</p>
                      </div>
                      <button onClick={() => setShowAllRisks(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="p-6 max-h-[60vh] overflow-y-auto space-y-2">
                      {mockRisks.map(r => (
                        <div key={r.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <AlertCircle className={`w-5 h-5 shrink-0 ${r.severity === 'Critical' ? 'text-rose-500' : r.severity === 'High' ? 'text-orange-500' : 'text-amber-500'}`} />
                            <span className="text-sm font-medium text-slate-700">{r.title}</span>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ml-4 ${r.severity === 'Critical' ? 'bg-rose-100 text-rose-700' : r.severity === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-amber-100 text-amber-700'}`}>
                            {r.severity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* â&quot;€â&quot;€ Network Topology â&quot;€â&quot;€ */}
          {activeTab === 'topology' && (
            <div className="w-full min-h-[600px] bg-slate-900 rounded-[20px] p-6 relative overflow-hidden border border-slate-800 shadow-inner">
              <h2 className="text-xl font-bold text-white mb-1">Live Network Topology</h2>
              <p className="text-slate-400 text-sm mb-4">Interactive mapping of assets and cryptographic boundaries.</p>
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minHeight: 600 }}>
                <defs>
                  <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2"/>
                    <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.8"/>
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2"/>
                  </linearGradient>
                </defs>
                {edges.map(([fromId, toId], i) => {
                  const from = nodes[fromId]; const to = nodes[toId]
                  const x1 = from.x+80; const y1 = from.y+40; const x2 = to.x+80; const y2 = to.y+40
                  const mx = (x1+x2)/2
                  const d = `M ${x1} ${y1} Q ${mx} ${y1} ${mx} ${(y1+y2)/2} T ${x2} ${y2}`
                  return (
                    <g key={i}>
                      <path d={d} fill="none" stroke="#1e293b" strokeWidth="4"/>
                      <path d={d} fill="none" stroke="url(#glow)" strokeWidth="2" strokeDasharray="8 8" className="data-flow"/>
                    </g>
                  )
                })}
              </svg>
              {nodes.map((node, i) => (
                <div key={node.id} onClick={() => setSelectedNode(node.id)} style={{ left: node.x, top: node.y, width: 155, position: 'absolute' }}
                  className={`cursor-pointer ${['node-float','node-float-d1','node-float-d2'][i%3]}`}>
                  <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl hover:border-blue-500 transition-colors shadow-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${node.color}`} />
                      <span className="text-white font-medium text-sm truncate">{node.title}</span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono">{node.ip}</p>
                  </div>
                </div>
              ))}
              {selectedNode !== null && (() => {
                const n = nodes[selectedNode]
                return (
                  <div className="absolute top-6 right-6 w-76 bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-2xl z-20" style={{ width: 280 }}>
                    <div className="flex justify-between items-start mb-5">
                      <h3 className="text-white font-bold text-lg">Asset Details</h3>
                      <button onClick={() => setSelectedNode(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5"/></button>
                    </div>
                    <div className="space-y-4">
                      {[['Asset Name', n.title, 'text-white'],['IP / Address', n.ip, 'text-blue-400 font-mono'],['Security Status', n.status, n.color.replace('bg-','text-').replace('500','300')]].map(([label, val, cls]) => (
                        <div key={label as string}>
                          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{label}</p>
                          <p className={`text-sm font-medium ${cls}`}>{val}</p>
                        </div>
                      ))}
                      <div className="pt-4 border-t border-slate-700">
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Technical Summary</p>
                        <p className="text-sm text-slate-300 leading-relaxed">{n.details}</p>
                      </div>
                      <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 mt-2">
                        <ExternalLink className="w-4 h-4"/> View Full Log
                      </button>
                    </div>
                  </div>
                )
              })()}
            </div>
          )}

          {activeTab === 'heatmap'  && <RiskHeatmapView />}
          {activeTab === 'cbom'     && <CbomInventoryView />}
          {activeTab === 'timeline' && <MoscaTimelineView />}
          {activeTab === 'reports'  && <ReportsView />}
          {activeTab === 'settings' && <ProfileSettingsView key={activeTab + userName + userEmail + projectName} />}
          {activeTab === 'planner' && <MigrationPlannerView />}
        </div>
      </main>
    </div>
      <ExecutiveReport></ExecutiveReport>
    </>
  )
}

