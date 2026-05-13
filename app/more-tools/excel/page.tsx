'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/language'
import ResultCard from '@/components/ResultCard'
import styles from '../page.module.scss'

const config = { color: '#10b981', icon: 'XLS', title: 'EXCEL → PDF', accept: '.xls,.xlsx,.csv', endpoint: '/api/convert' }

export default function ExcelPage() {
  const { t } = useLanguage()
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ url: string; name: string } | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      if (progressRef.current) clearInterval(progressRef.current)
    }
  }, [])

  const formatSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const handleFiles = useCallback((fileList: FileList) => {
    const validFiles = Array.from(fileList).filter(f => {
      const ext = '.' + f.name.split('.').pop()?.toLowerCase()
      return config.accept.split(',').some(accept => accept.trim() === ext || accept.trim() === f.type)
    })
    if (validFiles.length > 0) {
      setFiles(validFiles)
      setError(null)
    } else {
      setError('Invalid file type')
    }
  }, [config.accept])

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
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    const f = e.dataTransfer.files
    if (f && f.length > 0) handleFiles(f)
  }

  const handleConvert = async () => {
    if (files.length === 0) return
    setError(null)
    setIsProcessing(true)
    setProgress(0)

    progressRef.current = setInterval(() => {
      setProgress(p => Math.min(p + Math.random() * 15, 90))
    }, 300)

    try {
      const formData = new FormData()
      formData.append('files', files[0])

      const response = await fetch(config.endpoint, { method: 'POST', body: formData })
      if (!response.ok) throw new Error('Conversion failed')
      
      const blob = await response.blob()
      setProgress(100)
      
      setTimeout(() => {
        setResult({ url: URL.createObjectURL(blob), name: files[0].name.replace(/\.[^.]+$/, '.pdf') })
      }, 500)
    } catch {
      setError(t('common.error'))
    } finally {
      if (progressRef.current) clearInterval(progressRef.current)
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setFiles([])
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
            title={t('image.complete')}
            description="Your Excel spreadsheet is now a PDF!"
            downloadUrl={result.url}
            fileName={result.name}
            stats={[
              { label: 'Format', value: 'DOC → PDF' },
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
        <p className={styles.humor}>Convert Excel spreadsheets to PDF</p>

        <div className={styles.trialBanner}>
          <span className={styles.trialBadge}>TRIAL</span>
          <p><strong>Formato completo</strong> con servidor propio:</p>
          <a href="https://github.com/RedSparrow135/FakeLove-PDF-Tools" target="_blank" rel="noopener noreferrer" className={styles.repoButton}>
            <svg viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          </a>
        </div>

        <div className={styles.container}>
          {files.length === 0 ? (
            <div 
              className={styles.dropZone} 
              onClick={handleAddFile}
            >
              <div className={styles.dropIcon}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="3" y1="15" x2="21" y2="15" />
                  <line x1="9" y1="3" x2="9" y2="21" />
                  <line x1="15" y1="3" x2="15" y2="21" />
                </svg>
              </div>
              <p>Drop your Excel spreadsheet here</p>
              <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '8px' }}>or click to browse</p>
            </div>
          ) : (
            <div className={styles.fileCard}>
              <div className={styles.fileInfo}>
                <span className={styles.fileIcon}>{config.icon}</span>
                <div className={styles.fileDetails}>
                  <span className={styles.fileName}>{files[0].name}</span>
                  <span className={styles.fileSize}>{formatSize(files[0].size)}</span>
                </div>
              </div>
              <button className={styles.removeBtn} onClick={() => setFiles([])}>Remove</button>
            </div>
          )}

          {error && <div className={styles.error}>{error}</div>}

          {files.length > 0 && (
            <button className={styles.downloadBtn} onClick={handleConvert} disabled={isProcessing}>
              {isProcessing ? `${t('common.processing')} ${Math.round(progress)}%` : 'Convert to PDF'}
            </button>
          )}
        </div>
      </div>

      {isProcessing && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingCard}>
            <div className={styles.loadingIcon}>{config.icon}</div>
            <div className={styles.loadingText}>{t('loader.processing')}</div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
            <div className={styles.loadingHint}>{Math.round(progress)}% complete</div>
          </div>
        </div>
      )}
    </main>
  )
}