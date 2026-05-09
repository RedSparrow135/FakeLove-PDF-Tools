'use client'

import { useState, useEffect } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import styles from './FileCard.module.scss'

export interface PDFFileData {
  id: string
  file: File
  name: string
  size: number
  pageCount: number
  thumbnail?: string
  selectedPages: number[]
  isProcessing?: boolean
  isReady?: boolean
}

interface FileCardProps {
  data: PDFFileData
  index: number
  isSelected?: boolean
  isDragging?: boolean
  onRemove: (id: string) => void
  onToggleExpand: (id: string) => void
  onPageSelect: (fileId: string, pageNum: number) => void
  onSelectAll: (fileId: string) => void
  onDeselectAll: (fileId: string) => void
}

export default function FileCard({
  data,
  index,
  isSelected,
  isDragging,
  onRemove,
  onToggleExpand,
  onPageSelect,
  onSelectAll,
  onDeselectAll,
}: FileCardProps) {
  const [showPages, setShowPages] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: data.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : 'auto',
    opacity: isDragging ? 0.8 : 1,
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const handleToggleExpand = () => {
    setShowPages(!showPages)
    onToggleExpand(data.id)
  }

  const pageCount = data.pageCount || 1
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.card} ${isDragging || isSortableDragging ? styles.dragging : ''} ${showPages ? styles.expanded : ''}`}
    >
      <div className={styles.header}>
        <button className={styles.dragHandle} {...attributes} {...listeners}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="9" cy="6" r="2" />
            <circle cx="15" cy="6" r="2" />
            <circle cx="9" cy="12" r="2" />
            <circle cx="15" cy="12" r="2" />
            <circle cx="9" cy="18" r="2" />
            <circle cx="15" cy="18" r="2" />
          </svg>
        </button>

        <div className={styles.order}>{index + 1}</div>

        <div className={styles.info}>
          <div className={styles.name} title={data.name}>{data.name}</div>
          <div className={styles.meta}>
            {formatSize(data.size)} • {data.pageCount} pages
          </div>
        </div>

        <button className={styles.expandBtn} onClick={handleToggleExpand}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points={showPages ? "18 15 12 9 6 15" : "6 9 12 15 18 9"} />
          </svg>
        </button>

        <button className={styles.removeBtn} onClick={() => onRemove(data.id)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {showPages && data.pageCount > 0 && (
        <div className={styles.pageSelector}>
          <div className={styles.pageActions}>
            <button onClick={() => onSelectAll(data.id)}>All</button>
            <button onClick={() => onDeselectAll(data.id)}>None</button>
          </div>
          <div className={styles.pageGrid}>
            {pages.map((pageNum) => (
              <button
                key={pageNum}
                className={`${styles.pageChip} ${data.selectedPages.includes(pageNum) ? styles.selected : ''}`}
                onClick={() => onPageSelect(data.id, pageNum)}
              >
                {pageNum}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}