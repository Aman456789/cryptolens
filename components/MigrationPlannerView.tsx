"use client"
import React, { useState } from 'react'
import { AlertCircle, AlertTriangle, CheckCircle2, Copy, CheckCheck, ChevronDown, ChevronUp } from 'lucide-react'
import { useAppContext, cryptoDataMatrix } from './AppContext'

// â”€â”€ Code line arrays (no template literals in JSX) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const RSA_VULN = [
  'from Crypto.PublicKey import RSA',
  'from Crypto.Cipher import PKCS1_OAEP',
  '',
  '# RSA-1024: Broken by Shor algorithm on CRQC',
  'def generate_keypair():',
  '    key = RSA.generate(1024)',
  '    return key.export_key()',
]
const RSA_PATCH = [
  '# ML-KEM-768 â€” NIST FIPS 203 approved',
  'from cryptography.hazmat.primitives.asymmetric',
  '    import mlkem',
  '',
  'def generate_keypair():',
  '    key = mlkem.MLKEM768()',
  '    return key.generate_key()',
]
const ECC_VULN = [
  'from cryptography.hazmat.primitives.asymmetric',
  '    import ec',
  '',
  '# secp256r1 (ECDH): Broken by Shor on CRQC',
  'def tls_key_exchange():',
  '    privkey = ec.generate_private_key(',
  '        ec.SECP256R1())',
  '    return privkey.public_key()',
]
const ECC_PATCH = [
  '# ML-KEM-768 â€” NIST FIPS 203 Key Encapsulation',
  'from cryptography.hazmat.primitives.asymmetric',
  '    import mlkem',
  '',
  'def tls_key_exchange():',
  '    kem = mlkem.MLKEM768()',
  '    enc, shared_secret = kem.encapsulate(',
  '        kem.public_key())',
  '    return enc, shared_secret',
]
const MD5_VULN = [
  'import hashlib',
  '',
  '# MD5: Collision attacks demonstrated (2004)',
  '# SHA-1: SHAttered collision (2017)',
  'def hash_token(token: str) -> str:',
  '    return hashlib.md5(token.encode()).hexdigest()',
]
const MD5_PATCH = [
  '# ML-DSA-65 â€” NIST FIPS 204 Digital Signature',
  'from cryptography.hazmat.primitives.asymmetric',
  '    import mldsa',
  '',
  'def hash_token(token: str) -> bytes:',
  '    signer = mldsa.MLDSA65()',
  '    return signer.sign(token.encode())',
]
const BLOW_VULN = [
  'from Crypto.Cipher import Blowfish',
  '',
  '# Blowfish: SWEET32 birthday attack (CVE-2016-2183)',
  'def encrypt_legacy(data, key):',
  '    cipher = Blowfish.new(key, Blowfish.MODE_CBC)',
  '    return cipher.encrypt(data)',
]
const BLOW_PATCH = [
  '# AES-256-GCM â€” Authenticated Encryption (NIST SP 800-38D)',
  'from cryptography.hazmat.primitives.ciphers.aead',
  '    import AESGCM',
  '',
  'def encrypt_legacy(data, key):',
  '    aesgcm = AESGCM(key)',
  '    nonce = os.urandom(12)',
  '    return aesgcm.encrypt(nonce, data, None)',
]

function CopyButton({ lines }: { lines: string[] }) {
  const [copied, setCopied] = useState(false)
  const handle = () => {
    navigator.clipboard.writeText(lines.join('\n'))
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={handle} className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors">
      {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

function CodeCard({ side, lines }: { side: 'vuln' | 'patch', lines: string[] }) {
  const isVuln = side === 'vuln'
  return (
    <div className={'flex-1 rounded-xl overflow-hidden border min-w-0 ' + (isVuln ? 'border-rose-800' : 'border-emerald-800')}>
      <div className={'flex items-center justify-between px-4 py-2 text-[11px] font-semibold ' + (isVuln ? 'bg-rose-950 text-rose-300' : 'bg-emerald-950 text-emerald-300')}>
        <span>{isVuln ? 'â— Vulnerable Code' : 'âœ“ Patched Code'}</span>
        <CopyButton lines={lines} />
      </div>
      <div className="bg-[#0d1117] p-4 overflow-x-auto">
        <table className={'text-xs font-mono w-full ' + (isVuln ? 'text-rose-300' : 'text-emerald-300')}>
          <tbody>
            {lines.map((line, i) => (
              <tr key={i}>
                <td className="select-none text-slate-600 pr-4 text-right w-6 align-top">{i + 1}</td>
                <td className="whitespace-pre align-top">{line || ' '}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

interface PendingCardProps { title: string; file: string; line: string; desc: string; vulnLines: string[]; patchLines: string[]; replacement: string }

function PendingCard({ title, file, line, desc, vulnLines, patchLines, replacement }: PendingCardProps) {
  const [expanded, setExpanded] = useState(true)
  return (
    <div className="bg-white/40 backdrop-blur-md border-2 border-rose-300 rounded-2xl overflow-hidden shadow-lg">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center"><AlertCircle className="w-5 h-5 text-rose-600" /></div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Replace with <strong>{replacement}</strong></p>
          </div>
        </div>
        <button onClick={() => setExpanded(!expanded)} className="text-slate-400 hover:text-slate-600">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>
      <div className="px-6 pb-3 flex items-center gap-3 text-xs text-slate-500 flex-wrap">
        <span className="font-mono text-blue-600">{file}</span>
        <span>â€¢</span>
        <span>Line {line}</span>
        <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-rose-100 text-rose-700 ml-1">OWASP A02:2021</span>
      </div>
      <div className="px-6 pb-4">
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
      {expanded && (
        <div className="px-6 pb-6 flex gap-3">
          <CodeCard side="vuln" lines={vulnLines} />
          <CodeCard side="patch" lines={patchLines} />
        </div>
      )}
    </div>
  )
}

function CompletedCard({ title, file, line, desc, vulnLines, patchLines }: { title: string; file: string; line: string; desc: string; vulnLines: string[]; patchLines: string[] }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="bg-white/40 backdrop-blur-md border-2 border-emerald-300 rounded-2xl overflow-hidden shadow-lg">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-emerald-600" /></div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">âœ“ Remediated â€” AES-256-GCM deployed to 89 instances</p>
          </div>
        </div>
        <button onClick={() => setExpanded(!expanded)} className="text-slate-400 hover:text-slate-600">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>
      <div className="px-6 pb-3 flex items-center gap-3 text-xs text-slate-500 flex-wrap">
        <span className="font-mono text-blue-600">{file}</span>
        <span>â€¢</span><span>Line {line}</span>
        <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-700 ml-1">REMEDIATED</span>
      </div>
      <div className="px-6 pb-4"><p className="text-xs text-slate-500">{desc}</p></div>
      {expanded && (
        <div className="px-6 pb-6 flex gap-3">
          <CodeCard side="vuln" lines={vulnLines} />
          <CodeCard side="patch" lines={patchLines} />
        </div>
      )}
    </div>
  )
}

export default function MigrationPlannerView() {
  const { projectName } = useAppContext()
  const total = cryptoDataMatrix.totalVulnerabilities  // 412
  const done  = cryptoDataMatrix.remediated            // 89
  const pct   = Math.round((done / total) * 100)       // ~22%
  const pending = cryptoDataMatrix.algorithmBreakdown.filter(e => e.status === 'Pending')

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{projectName}</p>
          <h2 className="text-2xl font-bold text-slate-900">Migration Planner</h2>
          <p className="text-sm text-slate-500 mt-1">Review and remediate vulnerabilities with secure code suggestions.</p>
        </div>
        <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-xl px-5 py-4 shadow-sm text-right shrink-0 min-w-[200px]">
          <p className="text-xs text-slate-400 mb-1 font-medium">Progress</p>
          <p className="text-2xl font-bold text-slate-900">{done} <span className="text-sm font-normal text-slate-400">/ {total} remediated</span></p>
          <p className="text-[11px] text-slate-400 mt-0.5">{pct}% complete â€” {cryptoDataMatrix.pending} still pending</p>
          <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full" style={{ width: pct + '%' }} />
          </div>
        </div>
      </div>

      <p className="text-sm font-semibold text-rose-700">Pending Remediation ({cryptoDataMatrix.pending} instances across {pending.length} algorithm classes)</p>

      <PendingCard title="RSA-1024/2048" file="crypto/keys/rsa_utils.py" line="42"
        desc="RSA-1024/2048 is broken by Shor's algorithm on a Cryptographically-Relevant Quantum Computer (CRQC). Replace with ML-KEM-768 per NIST FIPS 203."
        replacement="ML-KEM-768 (FIPS 203)" vulnLines={RSA_VULN} patchLines={RSA_PATCH} />

      <PendingCard title="ECC (secp256r1) â€” TLS Key Exchange" file="network/tls_handshake.c" line="88"
        desc="Elliptic Curve Diffie-Hellman over secp256r1 is vulnerable to Shor's algorithm. Replace with ML-KEM-768 Key Encapsulation Mechanism per NIST FIPS 203."
        replacement="ML-KEM-768 (FIPS 203)" vulnLines={ECC_VULN} patchLines={ECC_PATCH} />

      <PendingCard title="MD5 / SHA-1 â€” Auth Hashing" file="auth/hash_auth.go" line="31"
        desc="MD5 is susceptible to collision attacks (Xiaoyun Wang, 2004). SHA-1 was shattered (Google, 2017). Replace with ML-DSA-65 for post-quantum signature integrity per NIST FIPS 204."
        replacement="ML-DSA-65 (FIPS 204)" vulnLines={MD5_VULN} patchLines={MD5_PATCH} />

      <div className="pt-2 border-t-2 border-dashed border-emerald-200">
        <p className="text-sm font-semibold text-emerald-700 mb-4">Completed ({done} instances remediated)</p>
        <CompletedCard title="Blowfish / SWEET32" file="legacy/cipher_utils.js" line="14"
          desc="SWEET32 birthday attack (CVE-2016-2183) exploits Blowfish's 64-bit block size. All {done} instances have been replaced with AES-256-GCM authenticated encryption."
          vulnLines={BLOW_VULN} patchLines={BLOW_PATCH} />
      </div>
    </div>
  )
}

