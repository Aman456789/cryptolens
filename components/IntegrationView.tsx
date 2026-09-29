"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import Logo from './Logo'

const yamlContent = `name: ECDAT Enterprise Cryptographic Audit
on:
  push:
    branches: [ "main", "release/*" ]
  pull_request:
    branches: [ "main" ]

jobs:
  pqc-discovery-and-remediation:
    name: PQC Scan (NIST FIPS 203/204)
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Codebase
        uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Login to Enterprise Registry
        uses: docker/login-action@v2
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}

      - name: Run CryptoLens Scanner (Air-Gapped Ready)
        uses: ntro/ecdat-action@v3.0
        with:
          project-token: \${{ secrets.ECDAT_PROJECT_TOKEN }}
          fail-on-critical: true
          export-format: 'cyclonedx-1.6'
          mosca-timeline-check: true

      - name: Upload CBOM Artifacts
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: cryptographic-bill-of-materials
          path: ./ecdat-reports/`

const guideContent = `# CryptoLens (ECDAT v3.0) - CI/CD Integration Guide
**Target Standard:** NIST FIPS 203/204 | **Compliance:** National Quantum Mission (NQM)

## Overview
This guide provides instructions to integrate the ECDAT Post-Quantum Cryptography (PQC) scanner into your GitHub Actions pipeline. The scanner utilizes a Dual-Risk Mosca Engine and Semgrep AST parsing to detect legacy cryptographic primitives (RSA, ECC, Blowfish) and auto-remediate them to ML-KEM.

## Step-by-Step Integration

### Step 1: Configure Repository Secrets
1. Navigate to **Settings > Secrets and variables > Actions** in your GitHub repository.
2. Click **New repository secret**.
3. Name: \`ECDAT_PROJECT_TOKEN\`
4. Value: Paste your generated project token from the Settings dashboard.
5. Click **Add secret**.

### Step 2: Add the Workflow File
1. In the root of your repository, ensure this directory exists: \`.github/workflows/\`
2. Create a new file named \`ecdat-scan.yml\`.
3. Copy the contents of the downloaded \`ecdat-pipeline.yml\` file into this new file.

### Step 3: Commit and Verify
1. Commit and push the file to your \`main\` branch.
2. Verify that the "ECDAT Enterprise Cryptographic Audit" workflow triggers successfully and generates the CycloneDX 1.6 CBOM.`

export default function IntegrationView() {
  const router = useRouter()
  const [copied, setCopied] = useState(false)

  const handleNextAndDownload = () => {
    // 1. Download YAML
    const yamlBlob = new Blob([yamlContent], { type: 'text/yaml' })
    const yamlUrl = URL.createObjectURL(yamlBlob)
    const yamlLink = document.createElement('a')
    yamlLink.href = yamlUrl
    yamlLink.download = 'ecdat-pipeline.yml'
    document.body.appendChild(yamlLink)
    yamlLink.click()
    document.body.removeChild(yamlLink)
    URL.revokeObjectURL(yamlUrl)

    // 2. Download Guide (as Markdown)
    const guideBlob = new Blob([guideContent], { type: 'text/markdown' })
    const guideUrl = URL.createObjectURL(guideBlob)
    const guideLink = document.createElement('a')
    guideLink.href = guideUrl
    guideLink.download = 'ECDAT_Integration_Guide.md'
    document.body.appendChild(guideLink)
    guideLink.click()
    document.body.removeChild(guideLink)
    URL.revokeObjectURL(guideUrl)

    // 3. Navigate to next page
    router.push('/scanner')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(yamlContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 font-sans text-slate-900">
      <div className="w-full max-w-2xl bg-white border border-[#E5E5E5] rounded-[16px] p-8 shadow-sm text-center">
        <Logo />
        <h2 className="mt-6 text-2xl font-semibold">Step 1: Pipeline Integration</h2>
        <p className="text-slate-500 mt-2 text-sm max-w-lg mx-auto">
          Follow these instructions to integrate ECDAT into your CI/CD pipeline for continuous discovery. Download the resources below to get started.
        </p>
        
        <div className="mt-10 mb-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => {
              const guideBlob = new Blob([guideContent], { type: 'text/markdown' })
              const guideUrl = URL.createObjectURL(guideBlob)
              const guideLink = document.createElement('a')
              guideLink.href = guideUrl
              guideLink.download = 'ECDAT_Integration_Guide.md'
              document.body.appendChild(guideLink)
              guideLink.click()
              document.body.removeChild(guideLink)
              URL.revokeObjectURL(guideUrl)
            }}
            className="w-full sm:w-auto px-6 py-4 bg-white border-2 border-[#18181B] text-[#18181B] rounded-full text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            Download Integration Guide (.md)
          </button>
          
          <button 
            onClick={() => {
              const yamlBlob = new Blob([yamlContent], { type: 'text/yaml' })
              const yamlUrl = URL.createObjectURL(yamlBlob)
              const yamlLink = document.createElement('a')
              yamlLink.href = yamlUrl
              yamlLink.download = 'ecdat-pipeline.yml'
              document.body.appendChild(yamlLink)
              yamlLink.click()
              document.body.removeChild(yamlLink)
              URL.revokeObjectURL(yamlUrl)
            }}
            className="w-full sm:w-auto px-6 py-4 bg-white border-2 border-[#18181B] text-[#18181B] rounded-full text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            Download Pipeline (.yml)
          </button>
        </div>

        <div className="mt-12 pt-6 border-t border-[#E5E5E5] flex justify-center">
          <button 
            onClick={() => router.push('/scanner')}
            className="flex items-center gap-2 px-8 py-4 bg-[#18181B] text-white rounded-full text-sm font-medium hover:bg-black transition-colors"
          >
            Next: Network Scanner <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
