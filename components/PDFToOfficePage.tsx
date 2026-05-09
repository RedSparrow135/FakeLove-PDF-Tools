'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/language'
import { useProcesses } from '@/lib/processContext'
import ResultCard from '@/components/ResultCard'
import styles from '../app/imagetopdf/page.module.scss'
import { FileText } from 'lucide-react'

interface Props {
  format: 'docx' | 'xlsx' | 'pptx'
  formatLabel: string
  color: string
}

export default function PDFToOfficePage({ format, formatLabel, color }: Props) {
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

  const handleFiles = (fileList: FileList) => {
    const validFiles = Array.from(fileList).filter(f => f.name.toLowerCase().endsWith('.pdf'))
    if (validFiles.length > 0) {
      setFiles(validFiles)
      setError(null)
    } else {
      setError(t('pdf2docx.error1'))
    }
  }

  const handleAddFile = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf'
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
      operationLabel: `PDF → ${formatLabel}`,
      status: 'processing',
      progress: 0,
      originalSize: files[0].size,
    })

    progressRef.current = setInterval(() => {
      setProgress(p => {
        const newProgress = Math.min(p + Math.random() * 10, 90)
        if (processIdRef.current) {
          updateProcess(processIdRef.current, { progress: newProgress })
        }
        return newProgress
      })
    }, 300)

    try {
      const formData = new FormData()
      formData.append('files', files[0])
      formData.append('format', format)

      const response = await fetch('/api/pdftooffice', { method: 'POST', body: formData })
      if (!response.ok) throw new Error('Conversion failed')
      
      const blob = await response.blob()
      setProgress(100)
      if (processIdRef.current) {
        updateProcess(processIdRef.current, { 
          progress: 100, 
          status: 'completed',
          resultUrl: URL.createObjectURL(blob),
          resultName: files[0].name.replace('.pdf', `.${format}`)
        })
      }
      
      setTimeout(() => {
        setResult({ url: URL.createObjectURL(blob), name: files[0].name.replace('.pdf', `.${format}`) })
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
          <Link href="/" className={styles.backLink}>{t('common.back')}</Link>
          <ResultCard
            title={`PDF → ${formatLabel}`}
            description={`Your PDF is now a ${formatLabel} file!`}
            downloadUrl={result.url}
            fileName={result.name}
            stats={[{ label: 'Format', value: format.toUpperCase() }]}
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
        <h1 className={styles.title} style={{ color }}>PDF → {formatLabel}</h1>
        <p className={styles.subtitle}>Convert your PDF to {formatLabel}</p>

        <div className={styles.container}>
          {files.length === 0 ? (
            <div 
              className={styles.dropZone} 
              onClick={handleAddFile}
              style={{ '--drop-color': color } as React.CSSProperties}
            >
              <div className={styles.dropIcon}>
                <FileText size={64} strokeWidth={1} />
              </div>
              <p>Drop your PDF here</p>
              <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '8px' }}>or click to browse</p>
            </div>
          ) : (
            <div className={styles.fileCard}>
              <div className={styles.fileInfo}>
                <span className={styles.fileIcon} style={{ background: color }}>PDF</span>
                <div className={styles.fileDetails}>
                  <span className={styles.fileName}>{files[0].name}</span>
                </div>
              </div>
              <button className={styles.removeBtn} onClick={() => setFiles([])}>Remove</button>
            </div>
          )}

          {error && <div className={styles.error}>{error}</div>}

          {files.length > 0 && (
            <button 
              className={styles.downloadBtn} 
              onClick={handleConvert} 
              disabled={isProcessing}
              style={{ '--btn-color': color } as React.CSSProperties}
            >
              {isProcessing ? `${t('common.processing')} ${Math.round(progress)}%` : `Convert to ${formatLabel}`}
            </button>
          )}
        </div>
      </div>
    </main>
  )
}