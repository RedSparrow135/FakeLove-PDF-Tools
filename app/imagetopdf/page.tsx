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
          <span className={styles.trialBadge}>TRIAL</span>
          <p>Límite de 4.5MB en Vercel. <strong>Sin límites</strong> en servidor propio: <a href="https://github.com/RedSparrow135/FakeLove-PDF-Tools" target="_blank" rel="noopener noreferrer" className={styles.repoButton}>GitHub</a></p>
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