'use client'

import { useEffect, useState } from 'react'
import styles from './PreviewModal.module.scss'

interface PagePreview {
  pageNum: number
  thumbnail?: string
}

interface PreviewModalProps {
  isOpen: boolean
  onClose: () => void
  fileName: string
  pageCount: number
  pages: PagePreview[]
}

export default function PreviewModal({
  isOpen,
  onClose,
  fileName,
  pageCount,
  pages,
}: PreviewModalProps) {
  const [selectedPage, setSelectedPage] = useState(1)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const pageNumbers = Array.from({ length: pageCount }, (_, i) => i + 1)

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>{fileName}</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.preview}>
            <div className={styles.pageNumber}>Page {selectedPage}</div>
            <div className={styles.previewBox}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <p>Preview</p>
            </div>
          </div>

          <div className={styles.pageGrid}>
            {pageNumbers.map((num) => (
              <button
                key={num}
                className={`${styles.pageThumb} ${selectedPage === num ? styles.active : ''}`}
                onClick={() => setSelectedPage(num)}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}