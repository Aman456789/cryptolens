"use client"
import React, { createContext, useContext, useState } from 'react'


export interface AlgoEntry {
  id: string; algo: string; count: number; risk: string
  status: string; replacement: string; file: string; category: string
}

export const cryptoDataMatrix = {
  totalAssets: 2104,
  totalVulnerabilities: 412,
  remediated: 89,
  pending: 323,
  algorithmBreakdown: [
    { id: "VULN-001", algo: "RSA-1024/2048",       count: 156, risk: "Critical", status: "Pending",    replacement: "ML-KEM-768 (FIPS 203)", file: "crypto/keys/rsa_utils.py",       category: "Key Exchange"       },
    { id: "VULN-002", algo: "ECC (secp256r1)",      count: 114, risk: "High",     status: "Pending",    replacement: "ML-KEM-768 (FIPS 203)", file: "network/tls_handshake.c",       category: "Key Exchange"       },
    { id: "VULN-003", algo: "Blowfish / SWEET32",   count:  89, risk: "High",     status: "Remediated", replacement: "AES-256-GCM",           file: "legacy/cipher_utils.js",        category: "Encryption"         },
    { id: "VULN-004", algo: "MD5 / SHA-1",          count:  53, risk: "Medium",   status: "Pending",    replacement: "ML-DSA-65 (FIPS 204)",  file: "auth/hash_auth.go",             category: "Signature/Hashing"  }
  ] as AlgoEntry[]
}

export type AppTab = 'dashboard' | 'timeline' | 'reports' | 'topology' | 'heatmap' | 'cbom' | 'settings'

interface AppContextType {
  userName: string; setUserName: (v: string) => void
  userEmail: string; setUserEmail: (v: string) => void
  projectName: string; setProjectName: (v: string) => void
  userUrl: string; setUserUrl: (v: string) => void
  activeTab: AppTab; setActiveTab: (v: AppTab) => void
  llmMode: 'cloud' | 'airgap'; setLlmMode: (v: 'cloud' | 'airgap') => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [projectName, setProjectName] = useState('')
  const [userUrl, setUserUrl] = useState('')
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard')
  const [llmMode, setLlmMode] = useState<'cloud' | 'airgap'>('airgap')

  return (
    <AppContext.Provider value={{ userName, setUserName, userEmail, setUserEmail, projectName, setProjectName, userUrl, setUserUrl, activeTab, setActiveTab, llmMode, setLlmMode }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be inside AppProvider')
  return ctx
}

