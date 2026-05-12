'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/language'
import ResultCard from '@/components/ResultCard'
import styles from '../page.module.scss'

const MAX_SIZE = 4.5 * 1024 * 1024 // 4.5MB Vercel limit

export default function WordPage() {
  const { t } = useLanguage()
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ url: string; name: string } | null>(null)

  const config = { color: '#3b82f6', icon: 'DOCX', title: 'WORD → PDF', accept: '.docx,.doc' }

  const formatSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const handleFiles = useCallback((fileList: FileList) => {
    const selectedFile = fileList[0]
    const ext = '.' + selectedFile.name.split('.').pop()?.toLowerCase()
    
    if (!['.docx', '.doc'].includes(ext)) {
      setError('Invalid file type. Please use .docx or .doc')
      return
    }
    
    if (selectedFile.size > MAX_SIZE) {
      setError(`File too large. Maximum size is 4.5MB. Your file is ${formatSize(selectedFile.size)}`)
      return
    }
    
    setFile(selectedFile)
    setError(null)
  }, [])

  const handleAddFile = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = config.accept
    input.onchange = (e) => {
      const f = (e.target as HTMLInputElement).files
      if (f && f.length > 0) handleFiles(f)
    }
    input.click()
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const f = e.dataTransfer.files
    if (f && f.length > 0) handleFiles(f)
  }

  const handleConvert = async () => {
    if (!file) return
    setError(null)
    setIsProcessing(true)
    setProgress(0)

    const interval = setInterval(() => {
      setProgress(p => Math.min(p + Math.random() * 15, 90))
    }, 300)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/wordtopdf', { method: 'POST', body: formData })
      
      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: 'Conversion failed' }))
        throw new Error(data.error)
      }
      
      const blob = await response.blob()
      setProgress(100)
      
      setTimeout(() => {
        setResult({ url: URL.createObjectURL(blob), name: file.name.replace(/\.[^.]+$/, '.pdf') })
      }, 500)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'))
    } finally {
      clearInterval(interval)
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setResult(null)
    setError(null)
    setProgress(0)
  }

  if (result) {
    return (
      <main className={styles.page}>
        <div className={styles.background}>
          <div className={styles.gridLines} />
          <div className={styles.glowOrb} />
        </div>
        <div className={styles.content}>
          <Link href="/" className={styles.backLink}>{t('common.back')}</Link>
          <ResultCard
            title="Conversion Complete!"
            description="Your Word document is now a PDF!"
            downloadUrl={result.url}
            fileName={result.name}
            stats={[
              { label: 'Format', value: 'DOCX → PDF' },
            ]}
          />
          <div className={styles.resultActions}>
            <button className={styles.resetBtn} onClick={handleReset}>{t('common.tryAgain')}</button>
            <Link href="/" className={styles.homeLink}>{t('common.goHome')}</Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main 
      className={styles.page}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className={styles.background}>
        <div className={styles.gridLines} />
        <div className={styles.glowOrb} />
      </div>

      <div className={styles.content}>
        <Link href="/" className={styles.backLink}>{t('common.back')}</Link>
        <h1 className={styles.title}>{config.title}</h1>
        <p className={styles.humor}>Convert Word documents to PDF</p>

        <div className={styles.trialBanner}>
          <span className={styles.trialBadge}>TRIAL</span>
          <p>Versión de prueba. <strong>Formato limitado.</strong> Versión completa: <a href="https://github.com/RedSparrow135/FakeLove-PDF-Tools" target="_blank" rel="noopener noreferrer" className={styles.repoButton}>GitHub</a></p>
        </div>

        <div className={styles.container}>
          {file ? (
            <div className={styles.fileCard}>
              <div className={styles.fileInfo}>
                <span className={styles.fileIcon}>{config.icon}</span>
                <div className={styles.fileDetails}>
                  <span className={styles.fileName}>{file.name}</span>
                  <span className={styles.fileSize}>{formatSize(file.size)}</span>
                </div>
              </div>
              <button className={styles.removeBtn} onClick={handleReset}>Remove</button>
            </div>
          ) : (
            <div 
              className={styles.dropZone} 
              onClick={handleAddFile}
            >
              <div className={styles.dropIcon}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
              </div>
              <p>Drop your Word document here</p>
              <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '8px' }}>or click to browse</p>
            </div>
          )}

          {error && <div className={styles.error}>{error}</div>}

          {file && (
            <button className={styles.downloadBtn} onClick={handleConvert} disabled={isProcessing}>
              {isProcessing ? `Converting... ${Math.round(progress)}%` : 'Convert to PDF'}
            </button>
          )}
        </div>

        {isProcessing && (
          <div className={styles.loadingOverlay}>
            <div className={styles.loadingCard}>
              <div className={styles.loadingIcon}>{config.icon}</div>
              <div className={styles.loadingText}>Converting...</div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }} />
              </div>
              <div className={styles.loadingHint}>{Math.round(progress)}% complete</div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
