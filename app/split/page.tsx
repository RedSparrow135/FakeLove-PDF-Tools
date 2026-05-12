'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/language'
import { useProcesses } from '@/lib/processContext'
import ResultCard from '@/components/ResultCard'
import styles from './page.module.scss'

interface PageThumb {
  pageNum: number
  dataUrl: string
}

type SplitMode = 'selection' | 'every' | 'single'

const MAX_SIZE = 4.5 * 1024 * 1024

export default function SplitPage() {
  const { t } = useLanguage()
  const { addProcess, updateProcess } = useProcesses()
  const [file, setFile] = useState<File | null>(null)
  const [pages, setPages] = useState<PageThumb[]>([])
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set())
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoadingPages, setIsLoadingPages] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ url: string; name: string } | null>(null)
  
  const [splitMode, setSplitMode] = useState<SplitMode>('selection')
  const [everyN, setEveryN] = useState(1)
  const [rangeFrom, setRangeFrom] = useState('')
  const [rangeTo, setRangeTo] = useState('')
  
  const [dragStart, setDragStart] = useState<number | null>(null)
  const [isDragOverWorkspace, setIsDragOverWorkspace] = useState(false)
  const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map())

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
          if (file.size > MAX_SIZE) {
            setError(`File too large. Maximum: 4.5MB`)
          } else {
            setFile(file)
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

  useEffect(() => {
    if (file && !isLoadingPages) {
      loadPages(file)
    }
  }, [file])

  const loadPages = async (pdfFile: File) => {
    setIsLoadingPages(true)
    setPages([])
    setSelectedPages(new Set())

    try {
      const pdfjsLib = await import('pdfjs-dist')
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'
      
      const arrayBuffer = await pdfFile.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      const pageCount = pdf.numPages
      const loadedPages: PageThumb[] = []

      for (let i = 1; i <= Math.min(pageCount, 100); i++) {
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale: 0.25 })
        
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        canvas.height = viewport.height
        canvas.width = viewport.width

        if (context) {
          await page.render({ canvasContext: context, viewport }).promise
          loadedPages.push({
            pageNum: i,
            dataUrl: canvas.toDataURL()
          })
        }
      }

      setPages(loadedPages)
    } catch {
      setError(t('split.error1'))
    } finally {
      setIsLoadingPages(false)
    }
  }

  const togglePage = (pageNum: number) => {
    const newSelected = new Set(selectedPages)
    if (newSelected.has(pageNum)) {
      newSelected.delete(pageNum)
    } else {
      newSelected.add(pageNum)
    }
    setSelectedPages(newSelected)
  }

  const handleClick = (pageNum: number, e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (e.shiftKey && dragStart !== null) {
      const start = Math.min(dragStart, pageNum)
      const end = Math.max(dragStart, pageNum)
      const newSelected = new Set(selectedPages)
      for (let i = start; i <= end; i++) {
        newSelected.add(i)
      }
      setSelectedPages(newSelected)
    } else {
      togglePage(pageNum)
      setDragStart(pageNum)
    }
  }

  const selectAll = () => {
    setSelectedPages(new Set(pages.map(p => p.pageNum)))
  }

  const deselectAll = () => {
    setSelectedPages(new Set())
  }

  const selectRange = () => {
    const from = parseInt(rangeFrom)
    const to = parseInt(rangeTo)
    if (!isNaN(from) && !isNaN(to) && from <= to) {
      const newSelected = new Set(selectedPages)
      for (let i = from; i <= to; i++) {
        if (i <= pages.length) newSelected.add(i)
      }
      setSelectedPages(newSelected)
    }
  }

  const handleSplit = async () => {
    if (!file) {
      setError(t('split.error1'))
      return
    }

    if (splitMode === 'selection' && selectedPages.size === 0) {
      setError(t('split.error2'))
      return
    }

    setError(null)
    setIsProcessing(true)

    const id = addProcess({
      fileName: file.name,
      operation: 'split',
      operationLabel: t('operation.split'),
      status: 'processing',
      progress: 0,
      originalSize: file.size,
    })

    let progress = 0
    const progressInterval = setInterval(() => {
      progress = Math.min(progress + Math.random() * 20, 90)
      updateProcess(id, { progress: Math.round(progress) })
    }, 300)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('mode', splitMode)
      
      if (splitMode === 'selection') {
        formData.append('range', Array.from(selectedPages).join(','))
      } else if (splitMode === 'every') {
        formData.append('every', everyN.toString())
      }

      const response = await fetch('/api/split', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Split failed')

      clearInterval(progressInterval)
      updateProcess(id, { progress: 100 })

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      
      updateProcess(id, {
        status: 'completed',
        resultUrl: url,
        resultName: 'split.pdf',
        completedAt: Date.now(),
      })
      
      setResult({ url, name: 'split.pdf' })
    } catch {
      clearInterval(progressInterval)
      updateProcess(id, { status: 'failed', error: t('common.error') })
      setError(t('common.error'))
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setPages([])
    setSelectedPages(new Set())
    setResult(null)
    setError(null)
  }

  const handleFileSelected = (files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0]
      if (selectedFile.size > MAX_SIZE) {
        setError(`File too large. Maximum: 4.5MB`)
        return
      }
      setFile(selectedFile)
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const handleAddMore = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf'
    input.onchange = (e) => {
      const f = (e.target as HTMLInputElement).files?.[0]
      if (f) handleFileSelected([f])
    }
    input.click()
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOverWorkspace(true)
  }

  const handleDragLeave = () => {
    setIsDragOverWorkspace(false)
  }

  const handleDropFile = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOverWorkspace(false)
    const files = Array.from(e.dataTransfer.files).filter(f => f.name.toLowerCase().endsWith('.pdf'))
    if (files.length > 0) {
      handleFileSelected(files)
    }
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
            title={t('split.complete')}
            description={t('split.desc')}
            downloadUrl={result.url}
            fileName={result.name}
            stats={[
              { label: 'Pages Extracted', value: selectedPages.size },
              { label: 'Total Pages', value: pages.length },
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

  if (!file) {
    return (
      <main className={styles.page}>
        <div className={styles.background}>
          <div className={styles.gridLines} />
          <div className={styles.glowOrb} />
        </div>
        <div className={styles.content}>
          <Link href="/" className={styles.backLink}>{t('common.back')}</Link>
          <h1 className={styles.title}>{t('split.title')}</h1>
          <p className={styles.subtitle}>{t('split.humor')}</p>
          <div className={styles.uploadSection}>
            <div 
              className={styles.dropZone}
              onClick={() => handleAddMore()}
            >
              <div className={styles.dropIcon}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
              </div>
              <p>{t('split.drop')}</p>
            </div>
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
        <h1 className={styles.title}>{t('split.title')}</h1>
        <p className={styles.subtitle}>{t('split.humor')}</p>
        
        <div className={styles.trialBanner}>
          <span className={styles.trialBadge}>TRIAL</span>
          <p>Límite de 4.5MB. <strong>Archivos ilimitados</strong> en servidor propio:</p>
          <a href="https://github.com/RedSparrow135/FakeLove-PDF-Tools" target="_blank" rel="noopener noreferrer" className={styles.repoButton}>
            <svg viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          </a>
        </div>

        <div className={styles.layout}>
          <div 
            className={`${styles.workspace} ${isDragOverWorkspace ? styles.dragOver : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDropFile}
          >
            <div className={styles.fileBar}>
              <div className={styles.fileInfo}>
                <span className={styles.fileName}>{file.name}</span>
                <span className={styles.fileSize}>{formatSize(file.size)}</span>
              </div>
              <button className={styles.removeBtn} onClick={handleReset}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className={styles.actionBar}>
              <div className={styles.selectButtons}>
                <button onClick={selectAll}>{t('split.selectAll')}</button>
                <button onClick={deselectAll}>{t('split.deselectAll')}</button>
              </div>
              
              <div className={styles.rangeInput}>
                <input
                  type="number"
                  placeholder="From"
                  value={rangeFrom}
                  onChange={(e) => setRangeFrom(e.target.value)}
                  min={1}
                  max={pages.length}
                />
                <span>to</span>
                <input
                  type="number"
                  placeholder="To"
                  value={rangeTo}
                  onChange={(e) => setRangeTo(e.target.value)}
                  min={1}
                  max={pages.length}
                />
                <button onClick={selectRange}>Apply</button>
              </div>

              <div className={styles.selectionCount}>
                <span className={styles.countBadge}>{selectedPages.size}</span> selected
              </div>
            </div>

            {isLoadingPages ? (
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>{t('common.loading')}</p>
              </div>
            ) : (
              <div className={styles.pagesGrid}>
                {pages.map((page) => (
                  <div
                    key={page.pageNum}
                    ref={(el) => { if (el) pageRefs.current.set(page.pageNum, el) }}
                    className={`${styles.pageCard} ${selectedPages.has(page.pageNum) ? styles.selected : ''}`}
                    onClick={(e) => handleClick(page.pageNum, e)}
                  >
                    <img src={page.dataUrl} alt={`Page ${page.pageNum}`} />
                    <span className={styles.pageNumber}>{page.pageNum}</span>
                    {selectedPages.has(page.pageNum) && (
                      <span className={styles.checkIcon}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {pages.length >= 100 && (
              <p className={styles.warning}>{t('split.warning')}</p>
            )}
          </div>

          <aside className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2>{t('split.title')}</h2>
              <p className={styles.panelHint}>{t('split.panelHint')}</p>
            </div>

            <div className={styles.modeSelector}>
              <label>{t('split.panelHint')}</label>
              <select value={splitMode} onChange={(e) => setSplitMode(e.target.value as SplitMode)}>
                <option value="selection">By Selection</option>
                <option value="every">Every N Pages</option>
                <option value="single">Single Pages</option>
              </select>
            </div>

            {splitMode === 'every' && (
              <div className={styles.everyInput}>
                <label>Split every</label>
                <input
                  type="number"
                  value={everyN}
                  onChange={(e) => setEveryN(parseInt(e.target.value) || 1)}
                  min={1}
                  max={pages.length}
                />
                <span>pages</span>
              </div>
            )}

            {splitMode === 'selection' && (
              <div className={styles.preview}>
                <h4>Preview</h4>
                <div className={styles.previewGroups}>
                  {selectedPages.size > 0 && (
                    <div className={styles.previewGroup}>
                      <span>File 1</span>
                      <span>Pages {Array.from(selectedPages).sort((a, b) => a - b).join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className={styles.panelInfo}>
              <div className={styles.panelStat}>
                <span>Total Pages</span>
                <span>{pages.length}</span>
              </div>
              <div className={styles.panelStat}>
                <span>{t('split.pagesSelected')}</span>
                <span>{selectedPages.size}</span>
              </div>
            </div>

            <button
              className={styles.splitBtn}
              onClick={handleSplit}
              disabled={
                (splitMode === 'selection' && selectedPages.size === 0) ||
                isProcessing
              }
            >
              {isProcessing ? t('common.processing') : t('split.extract')}
            </button>

            {error && <div className={styles.error}>{error}</div>}
          </aside>
        </div>
      </div>
    </main>
  )
}