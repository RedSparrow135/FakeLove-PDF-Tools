'use client'

import { useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  useDroppable,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { useLanguage } from '@/lib/language'
import { useProcesses } from '@/lib/processContext'
import FileCard, { PDFFileData } from '@/components/FileCard'
import ResultCard from '@/components/ResultCard'
import styles from './page.module.scss'

const emotionalMessages = [
  "Drop your PDFs... don't be scared",
  "Arrange this like your life (if you can)",
  "More files? We don't judge... much",
  "Drag around... we promise not to tell",
  "Your files look lonely... let's unite them",
]

const MAX_SIZE = 4.5 * 1024 * 1024 // 4.5MB - Límite Vercel

export default function MergePage() {
  const { t } = useLanguage()
  const { addProcess, updateProcess } = useProcesses()
  const [files, setFiles] = useState<PDFFileData[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<{ url: string; name: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)
  const [messageIndex, setMessageIndex] = useState(0)
  const [activeId, setActiveId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { setNodeRef: setDropZoneRef } = useDroppable({ id: 'workspace' })

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const getPageCount = async (file: File): Promise<number> => {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const { PDFDocument } = await import('pdf-lib')
      const pdf = await PDFDocument.load(arrayBuffer)
      return pdf.getPageCount()
    } catch { return 1 }
  }

  const handleFilesSelected = useCallback(async (newFiles: File[]) => {
    setError(null)
    setWarning(null)
    
    const sizeWarning = newFiles.some(f => f.size > MAX_SIZE)
    if (sizeWarning) {
      setWarning(`⚠️ Versión de prueba: Límite de 4.5MB por archivo en Vercel. Algunos archivos pueden fallar.`)
    }
    
    const pdfFiles: PDFFileData[] = []
    for (const file of newFiles) {
      if (file.size > MAX_SIZE) {
        setWarning(`⚠️ "${file.name}" supera el límite de 4.5MB`)
        continue
      }
      const pageCount = await getPageCount(file)
      const allPages = Array.from({ length: pageCount }, (_, i) => i + 1)
      pdfFiles.push({
        id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        file,
        name: file.name,
        size: file.size,
        pageCount,
        selectedPages: allPages,
      })
    }
    setFiles((prev) => [...prev, ...pdfFiles])
    setMessageIndex((prev) => (prev + 1) % emotionalMessages.length)
  }, [])

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    if (over && active.id !== over.id) {
      const oldIndex = files.findIndex((f) => f.id === active.id)
      const newIndex = files.findIndex((f) => f.id === over.id)
      setFiles((prev) => arrayMove(prev, oldIndex, newIndex))
    }
  }

  const handleRemove = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }, [])

  const handleToggleExpand = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }, [])

  const handlePageSelect = useCallback((fileId: string, pageNum: number) => {
    setFiles((prev) =>
      prev.map((f) => {
        if (f.id !== fileId) return f
        const isSelected = f.selectedPages.includes(pageNum)
        const newPages = isSelected
          ? f.selectedPages.filter((p) => p !== pageNum)
          : [...f.selectedPages, pageNum].sort((a, b) => a - b)
        return { ...f, selectedPages: newPages }
      })
    )
  }, [])

  const handleSortByName = useCallback(() => {
    setFiles((prev) => [...prev].sort((a, b) => a.name.localeCompare(b.name)))
  }, [])

  const handleSortBySize = useCallback(() => {
    setFiles((prev) => [...prev].sort((a, b) => a.size - b.size))
  }, [])

  const handleAddMore = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (selectedFiles.length) await handleFilesSelected(selectedFiles)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleMerge = useCallback(async () => {
    const validFiles = files.filter((f) => f.selectedPages.length > 0)
    if (validFiles.length < 1) {
      setError(t('merge.error1'))
      return
    }
    
    const totalSize = validFiles.reduce((acc, f) => acc + f.size, 0)
    if (totalSize > MAX_SIZE) {
      setError('⚠️ El tamaño total excede 4.5MB. No se puede procesar en Vercel.')
      return
    }
    
    const oversizedFiles = validFiles.filter(f => f.size > MAX_SIZE)
    if (oversizedFiles.length > 0) {
      setError(`⚠️ "${oversizedFiles[0].name}" es muy grande. Límite: 4.5MB`)
      return
    }
    
    setError(null)
    setIsProcessing(true)

    const totalPages = validFiles.reduce((acc, f) => acc + f.selectedPages.length, 0)
    const id = addProcess({
      fileName: `${validFiles.length} files`,
      operation: 'merge',
      operationLabel: t('operation.merge'),
      status: 'processing',
      progress: 0,
      originalSize: validFiles.reduce((acc, f) => acc + f.size, 0),
    })

    let progress = 0
    const progressInterval = setInterval(() => {
      progress = Math.min(progress + Math.random() * 20, 90)
      updateProcess(id, { progress: Math.round(progress) })
    }, 300)

    try {
      const formData = new FormData()
      for (const pf of validFiles) {
        formData.append('files', pf.file)
        formData.append('pages', pf.selectedPages.join(','))
      }
      const response = await fetch('/api/merge', { method: 'POST', body: formData })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }))
        throw new Error(errorData.error || 'Merge failed')
      }
      
      clearInterval(progressInterval)
      updateProcess(id, { progress: 100 })
      
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      
      updateProcess(id, {
        status: 'completed',
        resultUrl: url,
        resultName: 'merged.pdf',
        completedAt: Date.now(),
      })
      
      setResult({ url, name: 'merged.pdf' })
    } catch (err) {
      clearInterval(progressInterval)
      const errorMsg = err instanceof Error ? err.message : t('common.error')
      updateProcess(id, { status: 'failed', error: errorMsg })
      setError(errorMsg)
    } finally {
      setIsProcessing(false)
    }
  }, [files, t, addProcess, updateProcess])

  const handleReset = () => {
    setFiles([])
    setResult(null)
    setError(null)
  }

  const totalPages = files.reduce((acc, f) => acc + f.selectedPages.length, 0)
  const totalSize = files.reduce((acc, f) => acc + f.size, 0)
  const formatSizeMB = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  const selectedFiles = files.filter((f) => f.selectedPages.length > 0)
  const activeFile = activeId ? files.find((f) => f.id === activeId) : null

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
            title={t('merge.complete')}
            description={t('merge.desc')}
            downloadUrl={result.url}
            fileName={result.name}
            stats={[
              { label: t('merge.files'), value: files.length },
              { label: t('merge.pages'), value: totalPages },
            ]}
          />
          <div className={styles.resultActions}>
            <button className={styles.resetBtn} onClick={handleReset}>{t('merge.button')}</button>
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
        <h1 className={styles.title}>{t('merge.title')}</h1>
        <p className={styles.subtitle}>{t('merge.humor')}</p>
        
        <div className={styles.trialBanner}>
          <span className={styles.trialBadge}>TRIAL</span>
          <p>Límite de 4.5MB. <strong>Archivos ilimitados</strong> en servidor propio:</p>
          <a href="https://github.com/RedSparrow135/FakeLove-PDF-Tools" target="_blank" rel="noopener noreferrer" className={styles.repoButton}>
            <svg viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          </a>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className={styles.layout}>
            <div className={styles.workspace} ref={setDropZoneRef}>
              {files.length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="12" y1="18" x2="12" y2="12" />
                      <line x1="9" y1="15" x2="15" y2="15" />
                    </svg>
                  </div>
                  <p className={styles.emptyText}>{t('merge.drop')}</p>
                  <p className={styles.emptyHint}>{emotionalMessages[messageIndex]}</p>
                  <button className={styles.addBtn} onClick={handleAddMore}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add PDFs
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    multiple
                    onChange={handleFileChange}
                    hidden
                  />
                </div>
              ) : (
                <>
                  <div className={styles.toolbar}>
                    <div className={styles.badge}>
                      <span>{files.length}</span> files
                    </div>
                    <div className={styles.toolbarActions}>
                      <button className={styles.sortBtn} onClick={handleSortByName}>
                        A-Z
                      </button>
                      <button className={styles.sortBtn} onClick={handleSortBySize}>
                        Size
                      </button>
                      <button className={styles.addMoreBtn} onClick={handleAddMore}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Add More
                      </button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      multiple
                      onChange={handleFileChange}
                      hidden
                    />
                  </div>

                  <SortableContext items={files.map((f) => f.id)} strategy={rectSortingStrategy}>
                    <div className={styles.grid}>
                      {files.map((file, index) => (
                        <FileCard
                          key={file.id}
                          data={file}
                          index={index}
                          isSelected={file.selectedPages.length > 0}
                          isDragging={activeId === file.id}
                          onRemove={handleRemove}
                          onToggleExpand={handleToggleExpand}
                          onPageSelect={handlePageSelect}
                          onSelectAll={(id) => {
                            const f = files.find((x) => x.id === id)
                            if (f) {
                              const all = Array.from({ length: f.pageCount }, (_, i) => i + 1)
                              setFiles((prev) => prev.map((x) => x.id === id ? { ...x, selectedPages: all } : x))
                            }
                          }}
                          onDeselectAll={(id) => {
                            setFiles((prev) => prev.map((x) => x.id === id ? { ...x, selectedPages: [] } : x))
                          }}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </>
              )}
            </div>

            <aside className={styles.panel}>
              <div className={styles.panelHeader}>
                <h2>{t('merge.title')}</h2>
                <p className={styles.panelHint}>{t('merge.panelHint')}</p>
              </div>

              <div className={styles.panelInfo}>
                <div className={styles.panelStat}>
                  <span className={styles.panelStatLabel}>{t('merge.files')}</span>
                  <span className={styles.panelStatValue}>{files.length}</span>
                </div>
                <div className={styles.panelStat}>
                  <span className={styles.panelStatLabel}>Total Pages</span>
                  <span className={styles.panelStatValue}>{files.reduce((acc, f) => acc + f.pageCount, 0)}</span>
                </div>
                <div className={styles.panelStat}>
                  <span className={styles.panelStatLabel}>Total Size</span>
                  <span className={styles.panelStatValue}>{formatSizeMB(totalSize)}</span>
                </div>
                <div className={styles.panelStat}>
                  <span className={styles.panelStatLabel}>{t('merge.selected')}</span>
                  <span className={styles.panelStatValue}>{totalPages}</span>
                </div>
                {warning && (
                  <div className={styles.warning}>{warning}</div>
                )}
              </div>

              <div className={styles.panelActions}>
                <button
                  className={styles.mergeBtn}
                  onClick={handleMerge}
                  disabled={selectedFiles.length < 1 || isProcessing}
                >
                  {isProcessing ? t('common.processing') : t('merge.button')}
                </button>
              </div>

              {error && <div className={styles.error}>{error}</div>}
            </aside>
          </div>

          <DragOverlay adjustScale={false}>
            {activeFile ? (
              <div className={styles.dragOverlay}>
                <FileCard
                  data={activeFile}
                  index={files.findIndex((f) => f.id === activeFile.id)}
                  onRemove={() => {}}
                  onToggleExpand={() => {}}
                  onPageSelect={() => {}}
                  onSelectAll={() => {}}
                  onDeselectAll={() => {}}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </main>
  )
}