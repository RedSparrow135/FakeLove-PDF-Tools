'use client'

import styles from './MergePanel.module.scss'

interface MergePanelProps {
  fileCount: number
  totalPages: number
  selectedPages: number
  onMerge: () => void
  onSortByName: () => void
  onSortBySize: () => void
  onAddMore: () => void
  isProcessing: boolean
  disabled?: boolean
}

export default function MergePanel({
  fileCount,
  totalPages,
  selectedPages,
  onMerge,
  onSortByName,
  onSortBySize,
  onAddMore,
  isProcessing,
  disabled = false,
}: MergePanelProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.info}>
        <div className={styles.stat}>
          <span className={styles.label}>Files</span>
          <span className={styles.value}>{fileCount}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>Total Pages</span>
          <span className={styles.value}>{totalPages}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>Selected</span>
          <span className={styles.value}>{selectedPages}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.mergeBtn} onClick={onMerge} disabled={disabled || isProcessing}>
          {isProcessing ? 'Merging...' : `Merge PDF${fileCount > 1 ? 's' : ''}`}
        </button>

        <div className={styles.secondary}>
          <button className={styles.sortBtn} onClick={onSortByName}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="14" y2="12" />
              <line x1="4" y1="18" x2="8" y2="18" />
            </svg>
            Sort A-Z
          </button>
          <button className={styles.sortBtn} onClick={onSortBySize}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
            By Size
          </button>
        </div>

        <button className={styles.addBtn} onClick={onAddMore}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add More
        </button>
      </div>
    </div>
  )
}