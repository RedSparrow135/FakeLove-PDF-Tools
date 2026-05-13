'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, X, FileIcon, Eye, ArrowRight, Loader2 } from 'lucide-react'
import styles from './FileUploader.module.scss'
import { useLanguage } from '@/lib/language'

interface FileUploaderProps {
  onFileSelected?: (file: File) => void
}

interface FileWithPreview {
  file: File
  previewUrl?: string
  isImage: boolean
}

const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp']
const SUPPORTED_DOC_TYPES = ['application/pdf']
const ALL_SUPPORTED = [...SUPPORTED_IMAGE_TYPES, ...SUPPORTED_DOC_TYPES]
const MAX_FILE_SIZE = 4.5 * 1024 * 1024

const formatSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export default function FileUploader({ onFileSelected }: FileUploaderProps) {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<FileWithPreview | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const processFile = useCallback((file: File): Promise<FileWithPreview> => {
    if (file.size > MAX_FILE_SIZE) {
      alert(`El archivo es demasiado grande. Máximo ${formatSize(MAX_FILE_SIZE)} para Vercel (versión de prueba).`)
      return Promise.reject(new Error('File too large'))
    }
    return new Promise((resolve) => {
      const isImage = SUPPORTED_IMAGE_TYPES.includes(file.type)
      if (isImage) {
        const reader = new FileReader()
        reader.onload = (e) => {
          resolve({
            file,
            previewUrl: e.target?.result as string,
            isImage: true,
          })
        }
        reader.readAsDataURL(file)
      } else {
        resolve({ file, isImage: false })
      }
    })
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      try {
        const processed = await processFile(files[0])
        setSelectedFile(processed)
        setIsOpen(true)
      } catch {}
    }
  }, [processFile])

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      try {
        const processed = await processFile(files[0])
        setSelectedFile(processed)
        setIsOpen(true)
      } catch {}
    }
  }, [processFile])

  const handleClose = useCallback(() => {
    setSelectedFile(null)
    setIsOpen(false)
    setIsProcessing(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  const storeFileForTransfer = useCallback(async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer()
    const base64 = btoa(
      new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
    )
    const fileData = JSON.stringify({
      name: file.name,
      type: file.type,
      size: file.size,
      data: base64,
    })
    const key = `fakelove_file_${Date.now()}`
    sessionStorage.setItem(key, fileData)
    return key
  }, [])

  const handleAction = useCallback(async (action: string) => {
    if (!selectedFile) return
    
    setIsProcessing(true)
    
    try {
      const storageKey = await storeFileForTransfer(selectedFile.file)
      
      if (onFileSelected) {
        onFileSelected(selectedFile.file)
      }
      
      const routes: Record<string, string> = {
        merge: '/merge',
        split: '/split',
        compress: '/compress',
        imagetopdf: '/imagetopdf',
        convert: '/more-tools/word',
        preview: selectedFile.isImage ? '/imagetopdf' : '/split',
      }
      
      window.location.href = `${routes[action]}?f=${encodeURIComponent(storageKey)}`
    } catch (error) {
      setIsProcessing(false)
      console.error('Error transferring file:', error)
    }
  }, [selectedFile, onFileSelected, storeFileForTransfer])

  const getFileExtension = (filename: string): string => {
    return filename.split('.').pop()?.toUpperCase() || 'FILE'
  }

  return (
    <>
      <div 
        className={`${styles.floatingButton} ${isDragging ? styles.dragging : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload size={24} />
        <input
          ref={fileInputRef}
          type="file"
          accept={ALL_SUPPORTED.join(',')}
          onChange={handleFileSelect}
          className={styles.hiddenInput}
        />
      </div>

      {isOpen && selectedFile && (
        <div className={styles.overlay} onClick={handleClose}>
          <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={handleClose}>
              <X size={20} />
            </button>

            <div className={styles.header}>
              <h2>{t('upload.title')}</h2>
            </div>

            <div className={styles.fileInfo}>
              {selectedFile.isImage && selectedFile.previewUrl ? (
                <div className={styles.previewImage}>
                  <img src={selectedFile.previewUrl} alt={selectedFile.file.name} />
                </div>
              ) : (
                <div className={styles.pdfIcon}>
                  <FileIcon size={48} />
                </div>
              )}
              <div className={styles.fileDetails}>
                <span className={styles.fileName}>{selectedFile.file.name}</span>
                <span className={styles.fileSize}>
                  {formatSize(selectedFile.file.size)} · {getFileExtension(selectedFile.file.name)}
                </span>
              </div>
            </div>

            <div className={styles.actions}>
              <p className={styles.actionsTitle}>{t('upload.actions')}</p>
              
              <div className={styles.actionGrid}>
                <button 
                  className={styles.actionBtn}
                  onClick={() => handleAction('merge')}
                  disabled={isProcessing}
                >
                  <ArrowRight size={18} />
                  <span>{t('action.merge')}</span>
                </button>
                
                <button 
                  className={styles.actionBtn}
                  onClick={() => handleAction('split')}
                  disabled={isProcessing}
                >
                  <ArrowRight size={18} />
                  <span>{t('action.split')}</span>
                </button>
                
                <button 
                  className={styles.actionBtn}
                  onClick={() => handleAction('compress')}
                  disabled={isProcessing}
                >
                  <ArrowRight size={18} />
                  <span>{t('action.compress')}</span>
                </button>
                
                <button 
                  className={styles.actionBtn}
                  onClick={() => handleAction('imagetopdf')}
                  disabled={isProcessing}
                >
                  <ArrowRight size={18} />
                  <span>{t('action.imagetopdf')}</span>
                </button>

                <button 
                  className={styles.actionBtn}
                  onClick={() => handleAction('convert')}
                  disabled={isProcessing}
                >
                  <ArrowRight size={18} />
                  <span>{t('action.convert')}</span>
                </button>

                <button 
                  className={styles.actionBtnSecondary}
                  onClick={() => handleAction('preview')}
                  disabled={isProcessing}
                >
                  <Eye size={18} />
                  <span>{t('action.preview')}</span>
                </button>
              </div>

              {isProcessing && (
                <div className={styles.processing}>
                  <Loader2 size={20} className={styles.spinner} />
                  <span>Processing...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}