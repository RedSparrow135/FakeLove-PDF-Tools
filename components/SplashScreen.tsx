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
  const [phase, setPhase] = useState(0)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 150)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    let currentProgress = 0
    
    const progressInterval = setInterval(() => {
      currentProgress += 1.1
      setProgress(Math.min(currentProgress, 100))
      
      if (currentProgress >= 100) {
        clearInterval(progressInterval)
        setTimeout(onComplete, 400)
      }
    }, minDuration / 90)

    return () => clearInterval(progressInterval)
  }, [minDuration, onComplete])

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(p => (p + 1) % 360)
    }, 25)
    return () => clearInterval(interval)
  }, [])

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
          {Array.from({ length: 40 }).map((_, i) => (
            <div 
              key={i} 
              className={styles.particle}
              style={{
                left: `${(i * 2.8) % 100}%`,
                animationDelay: `${(i * 0.15) % 4}s`,
                animationDuration: `${3 + (i % 4)}s`,
                width: i % 3 === 0 ? '3px' : '2px',
                height: i % 3 === 0 ? '3px' : '2px',
              }}
            />
          ))}
        </div>

        <div className={styles.dataStreams}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div 
              key={i} 
              className={styles.dataStream}
              style={{
                left: `${15 + i * 18}%`,
                animationDelay: `${i * 0.3}s`,
                opacity: 0.15 + (i % 3) * 0.05,
              }}
            />
          ))}
        </div>
      </div>

      <div className={`${styles.content} ${showContent ? styles.visible : ''}`}>
        <CardiogramECG glowIntensity="high" speed={4} />

        <div className={styles.progressSection}>
          <div className={styles.progressTrack}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${progress}%` }}
            />
            <div 
              className={styles.progressGlow}
              style={{ left: `calc(${progress}% - 8px)` }}
            />
          </div>
          <span className={styles.progressPercent}>{Math.round(progress)}%</span>
        </div>

        <div className={styles.statusSection}>
          <div className={styles.statusBar}>
            <span className={styles.statusDot} />
            <span className={styles.statusText}>{getStatusMessage()}</span>
          </div>
        </div>

        <div className={styles.metaSection}>
          <span className={styles.metaText}>FAKELOVE.SYS</span>
          <span className={styles.metaDivider}>◆</span>
          <span className={styles.metaText}>v1.0.0</span>
          <span className={styles.metaDivider}>◆</span>
          <span className={styles.metaText}>CARDIAC-MONITOR</span>
        </div>
      </div>

      <div className={styles.footer}>
        <span className={styles.footerHeart}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </span>
        <span className={styles.footerDev}>CHARLE-X</span>
        <span className={styles.footerCopyright}>2024</span>
      </div>

      <div className={styles.cornerDecorations}>
        <svg className={styles.cornerSVG} viewBox="0 0 100 100">
          <path d="M0,30 L0,0 L30,0" fill="none" stroke="#ff2e63" strokeWidth="2"/>
          <path d="M0,20 L0,0 L20,0" fill="none" stroke="#00ffcc" strokeWidth="1" opacity="0.5"/>
        </svg>
        <svg className={styles.cornerSVG} viewBox="0 0 100 100">
          <path d="M100,30 L100,0 L70,0" fill="none" stroke="#ff2e63" strokeWidth="2"/>
          <path d="M100,20 L100,0 L80,0" fill="none" stroke="#00ffcc" strokeWidth="1" opacity="0.5"/>
        </svg>
        <svg className={styles.cornerSVG} viewBox="0 0 100 100">
          <path d="M0,70 L0,100 L30,100" fill="none" stroke="#ff2e63" strokeWidth="2"/>
          <path d="M0,80 L0,100 L20,100" fill="none" stroke="#00ffcc" strokeWidth="1" opacity="0.5"/>
        </svg>
        <svg className={styles.cornerSVG} viewBox="0 0 100 100">
          <path d="M100,70 L100,100 L70,100" fill="none" stroke="#ff2e63" strokeWidth="2"/>
          <path d="M100,80 L100,100 L80,100" fill="none" stroke="#00ffcc" strokeWidth="1" opacity="0.5"/>
        </svg>
      </div>
    </div>
  )
}