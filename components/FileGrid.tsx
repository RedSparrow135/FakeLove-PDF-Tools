'use client'

import { useState } from 'react'
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
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import FileCard, { PDFFileData } from './FileCard'
import styles from './FileGrid.module.scss'

interface FileGridProps {
  files: PDFFileData[]
  onFilesChange: (files: PDFFileData[]) => void
  onRemove: (id: string) => void
  onPageSelect: (fileId: string, pageNum: number) => void
  onToggleExpand: (fileId: string) => void
}

export default function FileGrid({
  files,
  onFilesChange,
  onRemove,
  onPageSelect,
  onToggleExpand,
}: FileGridProps) {
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (over && active.id !== over.id) {
      const oldIndex = files.findIndex((f) => f.id === active.id)
      const newIndex = files.findIndex((f) => f.id === over.id)
      onFilesChange(arrayMove(files, oldIndex, newIndex))
    }
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  const handleSelectAll = (fileId: string) => {
    const file = files.find((f) => f.id === fileId)
    if (file) {
      const allPages = Array.from({ length: file.pageCount }, (_, i) => i + 1)
      const updated = files.map((f) =>
        f.id === fileId ? { ...f, selectedPages: allPages } : f
      )
      onFilesChange(updated)
    }
  }

  const handleDeselectAll = (fileId: string) => {
    const updated = files.map((f) =>
      f.id === fileId ? { ...f, selectedPages: [] } : f
    )
    onFilesChange(updated)
  }

  const activeFile = activeId ? files.find((f) => f.id === activeId) : null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={files.map((f) => f.id)} strategy={rectSortingStrategy}>
        <div className={styles.grid}>
          {files.map((file, index) => (
            <FileCard
              key={file.id}
              data={file}
              index={index}
              isSelected={file.selectedPages.length > 0}
              isDragging={activeId === file.id}
              onRemove={onRemove}
              onToggleExpand={onToggleExpand}
              onPageSelect={onPageSelect}
              onSelectAll={handleSelectAll}
              onDeselectAll={handleDeselectAll}
            />
          ))}
        </div>
      </SortableContext>

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
  )
}