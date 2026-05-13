'use client'

import { useState, useEffect } from 'react'
import styles from './SplashScreen.module.scss'
import CardiogramECG from './CardiogramECG'

interface SplashScreenProps {
  onComplete: () => void
  minDuration?: number
}

export default function SplashScreen({ onComplete, minDuration = 3000 }: SplashScreenProps) {
  const [progress, setProgress] = useState(0)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 150)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    let currentProgress = 0
    
    const progressInterval = setInterval(() => {
      currentProgress += 1.2
      setProgress(Math.min(currentProgress, 100))
      
      if (currentProgress >= 100) {
        clearInterval(progressInterval)
        setTimeout(onComplete, 400)
      }
    }, minDuration / 85)

    return () => clearInterval(progressInterval)
  }, [minDuration, onComplete])

  const statusMessages = [
    'INITIALIZING SYSTEM...',
    'LOADING CORE MODULES...',
    'CALIBRATING CARDIAC SENSOR...',
    'ESTABLISHING NEURAL LINK...',
    'DECRYPTING EMOTIONS...',
    'SYSTEM READY.'
  ]

  const getStatusMessage = () => {
    const index = Math.min(
      Math.floor((progress / 100) * statusMessages.length), 
      statusMessages.length - 1
    )
    return statusMessages[index]
  }

  return (
    <div className={styles.splash}>
      <div className={styles.background}>
        <div className={styles.gridLines} />
        <div className={styles.glowPulse} />
        <div className={styles.horizonGlow} />
        
        <div className={styles.particles}>
          {Array.from({ length: 25 }).map((_, i) => (
            <div 
              key={i} 
              className={styles.particle}
              style={{
                left: `${(i * 4.2) % 100}%`,
                animationDelay: `${(i * 0.2) % 4}s`,
                animationDuration: `${3 + (i % 4)}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className={`${styles.content} ${showContent ? styles.visible : ''}`}>
        <CardiogramECG speed={5} />

        <div className={styles.progressSection}>
          <div className={styles.progressTrack}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className={styles.progressPercent}>{Math.round(progress)}%</span>
        </div>

        <div className={styles.statusSection}>
          <span className={styles.statusText}>{getStatusMessage()}</span>
        </div>
      </div>

      <div className={styles.footer}>
        <span className={styles.footerHeart}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </span>
        <span className={styles.footerDev}>CHARLE-X</span>
      </div>

      <div className={styles.cornerTL} />
      <div className={styles.cornerTR} />
      <div className={styles.cornerBL} />
      <div className={styles.cornerBR} />
    </div>
  )
}