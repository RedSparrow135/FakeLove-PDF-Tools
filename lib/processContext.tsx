'use client'

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'

export type ProcessStatus = 'queued' | 'processing' | 'completed' | 'failed'
export type OperationType = 'merge' | 'split' | 'compress' | 'imagetopdf' | 'convert' | 'extract'

export interface ProcessItem {
  id: string
  fileName: string
  operation: OperationType
  operationLabel: string
  status: ProcessStatus
  progress: number
  originalSize: number
  resultUrl?: string
  resultName?: string
  createdAt: number
  completedAt?: number
  error?: string
}

interface ProcessContextType {
  processes: ProcessItem[]
  activeProcess: ProcessItem | null
  addProcess: (item: Omit<ProcessItem, 'id' | 'createdAt'>) => string
  updateProcess: (id: string, updates: Partial<ProcessItem>) => void
  removeProcess: (id: string) => void
  clearCompleted: () => void
  clearAll: () => void
  getRecentProcesses: (limit?: number) => ProcessItem[]
  getActiveProcesses: () => ProcessItem[]
  setActiveProcess: (process: ProcessItem | null) => void
  isLoading: boolean
}

const STORAGE_KEY = 'fake_love_processes'

const ProcessContext = createContext<ProcessContextType | null>(null)

function saveToStorage(processes: ProcessItem[]) {
  try {
    const serialized = JSON.stringify(processes.map(p => ({
      ...p,
      resultUrl: undefined,
    })))
    localStorage.setItem(STORAGE_KEY, serialized)
  } catch (e) {
    console.error('Failed to save to localStorage:', e)
  }
}

function loadFromStorage(): ProcessItem[] {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY)
    if (serialized) {
      return JSON.parse(serialized)
    }
  } catch (e) {
    console.error('Failed to load from localStorage:', e)
  }
  return []
}

export function ProcessProvider({ children }: { children: ReactNode }) {
  const [processes, setProcesses] = useState<ProcessItem[]>([])
  const [activeProcess, setActiveProcess] = useState<ProcessItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const saved = loadFromStorage()
    setProcesses(saved)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!isLoading) {
      saveToStorage(processes)
    }
  }, [processes, isLoading])

  const addProcess = useCallback((item: Omit<ProcessItem, 'id' | 'createdAt'>) => {
    const id = `process_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newProcess: ProcessItem = {
      ...item,
      id,
      createdAt: Date.now(),
    }
    setProcesses(prev => [newProcess, ...prev])
    return id
  }, [])

  const updateProcess = useCallback((id: string, updates: Partial<ProcessItem>) => {
    setProcesses(prev => prev.map(p => 
      p.id === id ? { ...p, ...updates } : p
    ))
  }, [])

  const removeProcess = useCallback((id: string) => {
    setProcesses(prev => {
      const updated = prev.filter(p => p.id !== id)
      saveToStorage(updated)
      return updated
    })
  }, [])

  const clearCompleted = useCallback(() => {
    setProcesses(prev => {
      const updated = prev.filter(p => p.status !== 'completed' && p.status !== 'failed')
      saveToStorage(updated)
      return updated
    })
  }, [])

  const clearAll = useCallback(() => {
    setProcesses([])
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const getRecentProcesses = useCallback((limit = 20) => {
    return processes.slice(0, limit)
  }, [processes])

  const getActiveProcesses = useCallback(() => {
    return processes.filter(p => p.status === 'processing' || p.status === 'queued')
  }, [processes])

  return (
    <ProcessContext.Provider value={{ 
      processes, 
      activeProcess,
      addProcess, 
      updateProcess, 
      removeProcess, 
      clearCompleted,
      clearAll,
      getRecentProcesses,
      getActiveProcesses,
      setActiveProcess,
      isLoading
    }}>
      {children}
    </ProcessContext.Provider>
  )
}

export function useProcesses() {
  const context = useContext(ProcessContext)
  if (!context) {
    throw new Error('useProcesses must be used within ProcessProvider')
  }
  return context
}

export const operationLabels: Record<OperationType, string> = {
  merge: 'Merge PDF',
  split: 'Split PDF',
  compress: 'Compress',
  imagetopdf: 'Image to PDF',
  convert: 'Convert',
  extract: 'Extract',
}

export const operationDescriptions: Record<OperationType, string> = {
  merge: 'Combine multiple PDF files into one document',
  split: 'Extract specific pages from a PDF',
  compress: 'Reduce PDF file size while maintaining quality',
  imagetopdf: 'Convert images to PDF format',
  convert: 'Convert documents to PDF',
  extract: 'Extract content from PDF',
}