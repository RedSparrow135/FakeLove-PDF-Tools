'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/language'
import { useProcesses } from '@/lib/processContext'
import ResultCard from '@/components/ResultCard'
import styles from './page.module.scss'

export default function ImageToPdfPage() {
  const { t } = useLanguage()
  const { addProcess, updateProcess } = useProcesses()
  const [files, setFiles] = useState<File[]>([])
  const [layout, setLayout] = useState<'one' | 'two'>('one')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ url: string; name: string; fileCount: number } | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const MAX_SIZE = 4.5 * 1024 * 1024

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const fileKey = params.get('f')
    if (fileKey) {
      const fileData = sessionStorage.getItem(fileKey)
      if (fileData) {
        try {
          const parsed = JSON.parse(fileData)
          const binaryString = atob(parsed.data)
          const bytes = new Uint8Array(binaryString.length)
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i)
          }
          const file = new File([bytes], parsed.name, { type: parsed.type })
          if (file.type.startsWith('image/')) {
            setFiles([file])
            setError(null)
          }
          sessionStorage.removeItem(fileKey)
          window.history.replaceState({}, '', window.location.pathname)
        } catch (e) {
          setError('Error loading file')
        }
      }
    }
  }, [])

  const handleFiles = useCallback((fileList: FileList) => {
    const validFiles = Array.from(fileList).filter(f => {
      if (!f.type.startsWith('image/')) return false
      if (f.size > MAX_SIZE) {
        setError(`File "${f.name}" is too large. Max: 4.5MB`)
        return false
      }
      return true
    })
    if (validFiles.length > 0) {
      setFiles(validFiles)
      setError(null)
    } else {
      setError('Invalid file type or size')
    }
  }, [])

  const handleAddFile = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.multiple = true
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

    const id = addProcess({
      fileName: `${files.length} images`,
      operation: 'imagetopdf',
      operationLabel: t('operation.imagetopdf'),
      status: 'processing',
      progress: 0,
      originalSize: files.reduce((acc, f) => acc + f.size, 0),
    })

    let progress = 0
    const progressInterval = setInterval(() => {
      progress = Math.min(progress + Math.random() * 20, 90)
      updateProcess(id, { progress: Math.round(progress) })
    }, 300)

    try {
      const formData = new FormData()
      files.forEach(f => formData.append('files', f))
      formData.append('layout', layout)

      const response = await fetch('/api/imagetopdf', { method: 'POST', body: formData })
      if (!response.ok) throw new Error('Conversion failed')
      
      clearInterval(progressInterval)
      updateProcess(id, { progress: 100 })

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      
      updateProcess(id, {
        status: 'completed',
        resultUrl: url,
        resultName: 'images.pdf',
        completedAt: Date.now(),
      })
      
      setResult({ url, name: 'images.pdf', fileCount: files.length })
    } catch {
      clearInterval(progressInterval)
      updateProcess(id, { status: 'failed', error: t('common.error') })
      setError(t('common.error'))
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setFiles([])
    setResult(null)
    setError(null)
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
            description={t('image.desc')}
            downloadUrl={result.url}
            fileName={result.name}
            stats={[
              { label: t('image.images') || 'Images', value: result.fileCount },
              { label: t('image.layout') || 'Layout', value: layout === 'one' ? '1/page' : '2/page' },
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
        <h1 className={styles.title}>{t('image.title')}</h1>
        <p className={styles.subtitle}>{t('image.humor')}</p>

        <div className={styles.trialBanner}>
          <span className={styles.trialBadge}>{t('trial.label')}</span>
          <p>{t('trial.limitNote')}</p>
          <a href="https://github.com/RedSparrow135/FakeLove-PDF-Tools" target="_blank" rel="noopener noreferrer" className={styles.repoButton}>
            <svg viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          </a>
        </div>

        <div className={styles.container}>
          {files.length === 0 ? (
            <div className={styles.dropZone} onClick={handleAddFile}>
              <div className={styles.dropIcon}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <p>{t('image.drop')}</p>
              <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '8px' }}>{t('image.multiple') || 'Multiple files allowed'}</p>
            </div>
          ) : files.length > 1 ? (
            <div className={styles.fileCount}>
              <span className={styles.countNumber}>{files.length}</span>
              <span className={styles.countLabel}>{t('image.selected') || 'images selected'}</span>
              <button className={styles.removeBtn} onClick={() => setFiles([])} style={{ marginTop: '16px' }}>{t('image.removeAll') || 'Remove All'}</button>
            </div>
          ) : (
            <div className={styles.fileCard}>
              <div className={styles.fileInfo}>
                <span className={styles.fileIcon}>IMG</span>
                <div className={styles.fileDetails}>
                  <span className={styles.fileName}>{files[0].name}</span>
                </div>
              </div>
              <button className={styles.removeBtn} onClick={() => setFiles([])}>{t('image.remove') || 'Remove'}</button>
            </div>
          )}

          {files.length > 1 && (
            <div className={styles.layoutOptions}>
              <button 
                className={styles.layoutBtn}
                onClick={() => setLayout('one')}
                style={{ background: layout === 'one' ? '#ec4899' : undefined }}
              >
                {t('image.onePerPage')}
              </button>
              <button 
                className={styles.layoutBtn}
                onClick={() => setLayout('two')}
                style={{ background: layout === 'two' ? '#ec4899' : undefined }}
              >
                {t('image.twoPerPage')}
              </button>
            </div>
          )}

          {error && <div className={styles.error}>{error}</div>}

          {files.length > 0 && (
            <button 
              className={styles.downloadBtn} 
              onClick={handleConvert} 
              disabled={isProcessing}
            >
              {isProcessing ? t('common.processing') : `${t('image.button')} (${files.length})`}
            </button>
          )}
        </div>
      </div>
    </main>
  )
}