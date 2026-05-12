'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/language'
import { useProcesses } from '@/lib/processContext'
import ResultCard from '@/components/ResultCard'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import styles from '../page.module.scss'
import { FileText } from 'lucide-react'

const config = { color: '#e74c3c', title: 'pptx', titleFull: 'PPTX → PDF', accept: '.ppt,.pptx', endpoint: '/api/convert' }

export default function PptxPage() {
  const { t } = useLanguage()
  const { addProcess, updateProcess } = useProcesses()
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ url: string; name: string } | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const processIdRef = useRef<string | null>(null)
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
      setError(t('pptx.error1'))
    }
  }, [config.accept, t])

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

    processIdRef.current = addProcess({
      fileName: files[0].name,
      operation: 'convert',
      operationLabel: t('pptx.title'),
      status: 'processing',
      progress: 0,
      originalSize: files[0].size,
    })

    progressRef.current = setInterval(() => {
      setProgress(p => {
        const newProgress = Math.min(p + Math.random() * 12, 90)
        if (processIdRef.current) {
          updateProcess(processIdRef.current, { progress: newProgress })
        }
        return newProgress
      })
    }, 250)

    try {
      const formData = new FormData()
      formData.append('files', files[0])

      const response = await fetch(config.endpoint, { method: 'POST', body: formData })
      if (!response.ok) throw new Error('Conversion failed')
      
      const blob = await response.blob()
      setProgress(100)
      if (processIdRef.current) {
        updateProcess(processIdRef.current, { progress: 100, status: 'completed', resultUrl: URL.createObjectURL(blob), resultName: files[0].name.replace(/\.[^.]+$/, '.pdf') })
      }
      
      setTimeout(() => {
        setResult({ url: URL.createObjectURL(blob), name: files[0].name.replace(/\.[^.]+$/, '.pdf') })
      }, 500)
    } catch {
      setError(t('common.error'))
      if (processIdRef.current) {
        updateProcess(processIdRef.current, { status: 'failed', error: 'Conversion failed' })
      }
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
          <LanguageSwitcher />
          <Link href="/" className={styles.backLink}>{t('common.back')}</Link>
          <ResultCard
            title={t('pptx.complete')}
            description={t('pptx.desc')}
            downloadUrl={result.url}
            fileName={result.name}
            stats={[
              { label: t('common.files'), value: '1' },
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
        <LanguageSwitcher />
        <Link href="/" className={styles.backLink}>{t('common.back')}</Link>
        <h1 className={styles.title} style={{ color: config.color }}>{config.titleFull}</h1>
        <p className={styles.humor}>{t('pptx.humor')}</p>

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
              style={{ '--drop-color': config.color } as React.CSSProperties}
            >
              <div className={styles.dropIcon}>
                <FileText size={64} strokeWidth={1} />
              </div>
              <p>{t('pptx.drop')}</p>
              <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '8px' }}>or click to browse</p>
            </div>
          ) : (
            <div className={styles.fileCard}>
              <div className={styles.fileInfo}>
                <span className={styles.fileIcon} style={{ background: config.color }}>{config.title}</span>
                <div className={styles.fileDetails}>
                  <span className={styles.fileName}>{files[0].name}</span>
                  <span className={styles.fileSize}>{formatSize(files[0].size)}</span>
                </div>
              </div>
              <button className={styles.removeBtn} onClick={() => setFiles([])}>{t('image.remove')}</button>
            </div>
          )}

          {error && <div className={styles.error}>{error}</div>}

          {files.length > 0 && (
            <button 
              className={styles.downloadBtn} 
              onClick={handleConvert} 
              disabled={isProcessing}
              style={{ '--btn-color': config.color } as React.CSSProperties}
            >
              {isProcessing ? `${t('common.processing')} ${Math.round(progress)}%` : t('pptx.button')}
            </button>
          )}
        </div>
      </div>
    </main>
  )
}