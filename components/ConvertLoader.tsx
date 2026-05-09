'use client'

import { useState, useEffect } from 'react'
import styles from './ConvertLoader.module.scss'

interface ConvertLoaderProps {
  message?: string
  onComplete?: () => void
}

const conversionStages = [
  { percent: 10, message: 'Finding LibreOffice somewhere... 🔍' },
  { percent: 25, message: 'Waking up LibreOffice... ☕' },
  { percent: 40, message: 'Loading your document... 📄' },
  { percent: 55, message: 'Analyzing the content... 🧐' },
  { percent: 70, message: 'Converting pages... 🔄' },
  { percent: 85, message: 'Polish it up... ✨' },
  { percent: 100, message: 'Done! That was SUSPICIOUSLY easy! 😏' },
]

export default function ConvertLoader({
  message = 'Converting...',
  onComplete,
}: ConvertLoaderProps) {
  const [stage, setStage] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setStage((prev) => {
        if (prev >= conversionStages.length - 1) {
          clearInterval(interval)
          setShowSuccess(true)
          setTimeout(() => onComplete?.(), 1000)
          return prev
        }
        return prev + 1
      })
    }, 800)

    return () => clearInterval(interval)
  }, [onComplete])

  const currentStage = conversionStages[stage]

  if (showSuccess) {
    return (
      <div className={styles.loader}>
        <div className={styles.successAnimation}>
          <span className={styles.heart}>💕</span>
          <span className={styles.heart}>❤️</span>
          <span className={styles.heart}>💕</span>
        </div>
        <p className={styles.successText}>{currentStage.message}</p>
      </div>
    )
  }

  return (
    <div className={styles.loader}>
      <div className={styles.ecgContainer}>
        <svg className={styles.ecgLine} viewBox="0 0 200 40">
          <polyline
            className={styles.ecgPath}
            points="0,20 30,20 35,20 40,5 45,35 50,5 55,20 80,20 85,20 90,5 95,35 100,5 105,20 130,20 135,20 140,5 145,35 150,5 155,20 180,20"
          />
        </svg>
        <div className={styles.ecgDot} />
      </div>

      <div className={styles.progressBar}>
        <div 
          className={styles.progress}
          style={{ width: `${currentStage.percent}%` }}
        />
        <div className={styles.progressGlow} />
      </div>

      <p className={styles.message}>{currentStage.message}</p>
      <p className={styles.percentage}>{currentStage.percent}%</p>

      <div className={styles.statusDots}>
        {conversionStages.map((s, i) => (
          <span 
            key={i} 
            className={`${styles.dot} ${i <= stage ? styles.active : ''}`}
          />
        ))}
      </div>
    </div>
  )
}