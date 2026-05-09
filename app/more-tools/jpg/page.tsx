'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/language'
import { useProcesses } from '@/lib/processContext'
import ResultCard from '@/components/ResultCard'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import styles from '../page.module.scss'
import { Image } from 'lucide-react'

const config = { color: '#9b59b6', title: 'jpg', titleFull: 'JPG → PDF', accept: 'image/jpeg,image/png', endpoint: '/api/imagetopdf' }

export default function JpgPage() {
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

  const handleFiles = useCallback((fileList: FileList) => {
    const validFiles = Array.from(fileList).filter(f => f.type.startsWith('image/'))
    if (validFiles.length > 0) {
      setFiles(validFiles)
      setError(null)
    } else {
      setError(t('jpg.error1'))
    }
  }, [t])

  const handleAddFile = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = config.accept
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
    setProgress(0)

    const totalSize = files.reduce((acc, f) => acc + f.size, 0)
    processIdRef.current = addProcess({
      fileName: `${files.length} images`,
      operation: 'imagetopdf',
      operationLabel: t('jpg.title'),
      status: 'processing',
      progress: 0,
      originalSize: totalSize,
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
      files.forEach(f => formData.append('files', f))
      formData.append('layout', 'one')

      const response = await fetch(config.endpoint, { method: 'POST', body: formData })
      if (!response.ok) throw new Error('Conversion failed')
      
      const blob = await response.blob()
      setProgress(100)
      if (processIdRef.current) {
        updateProcess(processIdRef.current, { progress: 100, status: 'completed', resultUrl: URL.createObjectURL(blob), resultName: 'images.pdf' })
      }
      
      setTimeout(() => {
        setResult({ url: URL.createObjectURL(blob), name: 'images.pdf' })
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
            title={t('jpg.complete')}
            description={`${files.length} ${t('image.images').toLowerCase()} → PDF`}
            downloadUrl={result.url}
            fileName={result.name}
            stats={[
              { label: t('common.files'), value: String(files.length) },
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
        <p className={styles.humor}>{t('jpg.humor')}</p>

        <div className={styles.container}>
          {files.length === 0 ? (
            <div 
              className={styles.dropZone} 
              onClick={handleAddFile}
              style={{ '--drop-color': config.color } as React.CSSProperties}
            >
              <div className={styles.dropIcon}>
                <Image size={64} strokeWidth={1} />
              </div>
              <p>{t('jpg.drop')}</p>
              <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '8px' }}>{t('image.multiple')}</p>
            </div>
          ) : (
            <div className={styles.fileCard} style={{ flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <span className={styles.countNumber}>{files.length}</span>
              <span className={styles.countLabel}>{t('image.selected')}</span>
              <button className={styles.removeBtn} onClick={() => setFiles([])}>{t('image.removeAll')}</button>
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
              {isProcessing ? `${t('common.processing')} ${Math.round(progress)}%` : t('jpg.button')}
            </button>
          )}
        </div>
      </div>
    </main>
  )
}