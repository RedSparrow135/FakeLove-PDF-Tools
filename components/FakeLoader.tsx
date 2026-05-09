'use client'

import { useState, useEffect } from 'react'
import styles from './FakeLoader.module.scss'

interface FakeLoaderProps {
  message?: string
  fakeDuration?: number
  onComplete?: () => void
}

const fakeMessages = [
  'Analyzing your emotional PDF trauma...',
  'We\'re actually thinking about it...',
  'This is taking longer than your last relationship...',
  'Pretending to work hard...',
  '99% done... just kidding, keep waiting...',
  'Loading sarcasm levels...',
  'Calculating how much you need this...',
]

export default function FakeLoader({
  message = 'Processing...',
  fakeDuration = 3000,
  onComplete,
}: FakeLoaderProps) {
  const [progress, setProgress] = useState(0)
  const [currentMessage, setCurrentMessage] = useState(message)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        const increment = Math.random() * 20 + 5
        const next = Math.min(prev + increment, 100)
        
        if (next < 30) {
          setCurrentMessage(fakeMessages[0])
        } else if (next < 60) {
          setCurrentMessage(fakeMessages[Math.floor(Math.random() * 2) + 1])
        } else if (next < 90) {
          setCurrentMessage(fakeMessages[Math.floor(Math.random() * 3) + 2])
        } else if (next < 100) {
          setCurrentMessage(fakeMessages[Math.floor(Math.random() * 2) + 5])
        }
        
        return next
      })
    }, 500)

    setTimeout(() => {
      setShowSuccess(true)
      setCurrentMessage('Done! That was suspiciously easy.')
      onComplete?.()
    }, fakeDuration)

    return () => clearInterval(interval)
  }, [fakeDuration, onComplete])

  return (
    <div className={styles.loader}>
      {!showSuccess ? (
        <>
          <div className={styles.progressBar}>
            <div 
              className={styles.progress} 
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className={styles.message}>{currentMessage}</p>
          <p className={styles.percentage}>{Math.floor(progress)}%</p>
        </>
      ) : (
        <div className={styles.success}>
          <span className={styles.check}>✓</span>
          <p>{currentMessage}</p>
        </div>
      )}
    </div>
  )
}