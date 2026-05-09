'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/language'
import { useProcesses } from '@/lib/processContext'
import ResultCard from '@/components/ResultCard'
import styles from './page.module.scss'

type CompressionLevel = 'low' | 'medium' | 'high' | 'extreme'

interface PageThumb {
  pageNum: number
  dataUrl: string
}

export default function CompressPage() {
  const { t } = useLanguage()
  const { addProcess, updateProcess } = useProcesses()
  const [fileInfo, setFileInfo] = useState<{ file: File; size: number; name: string } | null>(null)
  const [pages, setPages] = useState<PageThumb[]>([])
  const [isLoadingPages, setIsLoadingPages] = useState(false)
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('medium')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ url: string; name: string; originalSize: number; compressedSize: number } | null>(null)

  const compressionOptions = {
    low: { scale: 0.8, quality: 0.9, name: t('compress.low'), desc: t('compress.lowDesc'), savings: '~20%' },
    medium: { scale: 0.6, quality: 0.7, name: t('compress.medium'), desc: t('compress.mediumDesc'), savings: '~50%' },
    high: { scale: 0.4, quality: 0.5, name: t('compress.high'), desc: t('compress.highDesc'), savings: '~70%' },
    extreme: { scale: 0.25, quality: 0.3, name: t('compress.extreme') || 'Extreme', desc: 'Maximum reduction, quality loss expected', savings: '~85%' },
  }

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const getSavingsPercent = (original: number, compressed: number): number => {
    return Math.round(((original - compressed) / original) * 100)
  }

  const handleFileSelected = async (files: File[]) => {
    if (files.length > 0) {
      const newFile = files[0]
      setFileInfo({
        file: newFile,
        size: newFile.size,
        name: newFile.name,
      })
      setError(null)
      loadPages(newFile)
    }
  }

  const loadPages = async (pdfFile: File) => {
    setIsLoadingPages(true)
    setPages([])

    try {
      const pdfjsLib = await import('pdfjs-dist')
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'
      
      const arrayBuffer = await pdfFile.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      const pageCount = Math.min(pdf.numPages, 10)
      const loadedPages: PageThumb[] = []

      for (let i = 1; i <= pageCount; i++) {
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale: 0.8 })
        
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        canvas.height = viewport.height
        canvas.width = viewport.width

        if (context) {
          context.fillStyle = '#ffffff'
          context.fillRect(0, 0, canvas.width, canvas.height)
          await page.render({ canvasContext: context, viewport }).promise
          loadedPages.push({
            pageNum: i,
            dataUrl: canvas.toDataURL('image/jpeg', 0.85)
          })
        }
      }

      setPages(loadedPages)
    } catch {
      console.error('Failed to load pages')
    } finally {
      setIsLoadingPages(false)
    }
  }

  const handleAddFile = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf'
    input.onchange = (e) => {
      const f = (e.target as HTMLInputElement).files?.[0]
      if (f) handleFileSelected([f])
    }
    input.click()
  }

  const handleCompress = async () => {
    if (!fileInfo) {
      setError(t('compress.error1'))
      return
    }

    setError(null)
    setIsProcessing(true)

    const id = addProcess({
      fileName: fileInfo.name,
      operation: 'compress',
      operationLabel: t('operation.compress'),
      status: 'processing',
      progress: 0,
      originalSize: fileInfo.size,
    })

    let progress = 0
    const progressInterval = setInterval(() => {
      progress = Math.min(progress + Math.random() * 20, 90)
      updateProcess(id, { progress: Math.round(progress) })
    }, 300)

    try {
      const formData = new FormData()
      formData.append('file', fileInfo.file)
      formData.append('level', compressionLevel)

      const response = await fetch('/api/compress', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Compress failed')
      }

      clearInterval(progressInterval)
      updateProcess(id, { progress: 100 })

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      
      updateProcess(id, {
        status: 'completed',
        resultUrl: url,
        resultName: 'compressed.pdf',
        completedAt: Date.now(),
      })
      
      setResult({ 
        url, 
        name: 'compressed.pdf',
        originalSize: fileInfo.size,
        compressedSize: blob.size,
      })
    } catch (err: any) {
      clearInterval(progressInterval)
      updateProcess(id, { status: 'failed', error: err.message })
      setError(err.message || t('common.error'))
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setFileInfo(null)
    setResult(null)
    setError(null)
  }

  if (result) {
    const savings = getSavingsPercent(result.originalSize, result.compressedSize)
    return (
      <main className={styles.page}>
        <div className={styles.background}>
          <div className={styles.gridLines} />
          <div className={styles.glowOrb} />
        </div>
        <div className={styles.content}>
          <Link href="/" className={styles.backLink}>{t('common.back')}</Link>
          <ResultCard
            title={t('compress.complete')}
            description={t('compress.desc')}
            downloadUrl={result.url}
            fileName={result.name}
            stats={[
              { label: 'Original', value: formatSize(result.originalSize) },
              { label: 'Compressed', value: formatSize(result.compressedSize) },
              { label: 'Saved', value: `${savings}%` },
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
    <main className={styles.page}>
      <div className={styles.background}>
        <div className={styles.gridLines} />
        <div className={styles.glowOrb} />
      </div>

      <div className={styles.content}>
        <Link href="/" className={styles.backLink}>{t('common.back')}</Link>
        <h1 className={styles.title}>{t('compress.title')}</h1>
        <p className={styles.subtitle}>{t('compress.humor')}</p>

        {!fileInfo ? (
          <div className={styles.uploadSection}>
            <div className={styles.dropZone} onClick={handleAddFile}>
              <div className={styles.dropIcon}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
              </div>
              <p>{t('compress.drop')}</p>
            </div>
          </div>
        ) : (
          <div className={styles.layout}>
            <div className={styles.workspace}>
              <div className={styles.fileBar}>
                <div className={styles.fileInfo}>
                  <span className={styles.fileName}>{fileInfo.name}</span>
                  <span className={styles.fileSize}>{formatSize(fileInfo.size)}</span>
                </div>
                <button className={styles.removeBtn} onClick={handleReset}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className={styles.previewBox}>
                {isLoadingPages ? (
                  <div className={styles.loadingPreview}>
                    <div className={styles.spinner}></div>
                    <p>{t('common.loading')}</p>
                  </div>
                ) : pages.length > 0 ? (
                  <div className={styles.pagesGrid}>
                    {pages.map((page) => (
                      <div key={page.pageNum} className={styles.pageThumb}>
                        <img src={page.dataUrl} alt={`Page ${page.pageNum}`} />
                        <span className={styles.pageNum}>{page.pageNum}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.previewIcon}>
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                    <p>PDF Preview</p>
                  </div>
                )}
              </div>
            </div>

            <aside className={styles.panel}>
              <div className={styles.panelHeader}>
                <h2>{t('compress.title')}</h2>
                <p className={styles.panelHint}>{t('compress.panelHint')}</p>
              </div>

              <div className={styles.levelSelector}>
                {(['low', 'medium', 'high', 'extreme'] as CompressionLevel[]).map((level) => (
                  <button
                    key={level}
                    className={`${styles.levelBtn} ${compressionLevel === level ? styles.selected : ''} ${level === 'extreme' ? styles.extreme : ''}`}
                    onClick={() => setCompressionLevel(level)}
                  >
                    <span className={styles.levelName}>{compressionOptions[level].name}</span>
                    <span className={styles.levelDesc}>{compressionOptions[level].desc}</span>
                    <span className={styles.levelSavings}>{compressionOptions[level].savings} smaller</span>
                  </button>
                ))}
              </div>

              <div className={styles.estimate}>
                <div className={styles.estimateRow}>
                  <span>Original</span>
                  <span>{formatSize(fileInfo.size)}</span>
                </div>
                <div className={styles.estimateRow}>
                  <span>{t('compress.estimated') || 'Estimated'}</span>
                  <span>~{formatSize(Math.round(fileInfo.size * compressionOptions[compressionLevel].scale))}</span>
                </div>
                <div className={`${styles.estimateRow} ${styles.savings}`}>
                  <span>{t('compress.potentialSavings') || 'Potential savings'}</span>
                  <span>{compressionOptions[compressionLevel].savings}</span>
                </div>
              </div>

              <button
                className={styles.compressBtn}
                onClick={handleCompress}
                disabled={isProcessing}
              >
                {isProcessing ? t('common.processing') : t('compress.button')}
              </button>

              {error && <div className={styles.error}>{error}</div>}
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}