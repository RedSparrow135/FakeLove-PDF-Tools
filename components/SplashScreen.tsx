'use client'

import { useState, useEffect } from 'react'
import styles from './SplashScreen.module.scss'

interface SplashScreenProps {
  onComplete: () => void
  minDuration?: number
}

export default function SplashScreen({ onComplete, minDuration = 3000 }: SplashScreenProps) {
  const [progress, setProgress] = useState(0)
  const [text, setText] = useState('')
  const fullText = 'FAKE LOVE PDF TOOLS'
  const [showCardiogram, setShowCardiogram] = useState(false)

  useEffect(() => {
    let currentProgress = 0
    let charIndex = 0
    
    const progressInterval = setInterval(() => {
      currentProgress += 2
      setProgress(Math.min(currentProgress, 100))
      
      if (currentProgress >= 30) {
        setShowCardiogram(true)
      }
      
      if (currentProgress >= 50 && charIndex < fullText.length) {
        setText(fullText.slice(0, charIndex + 1))
        charIndex++
      }
      
      if (currentProgress >= 100) {
        clearInterval(progressInterval)
        setTimeout(onComplete, 500)
      }
    }, minDuration / 50)

    return () => clearInterval(progressInterval)
  }, [minDuration, onComplete])

  return (
    <div className={styles.splash}>
      <div className={styles.background}>
        <div className={styles.gridLines} />
        <div className={styles.glowPulse} />
      </div>

      <div className={styles.content}>
        <div className={styles.logoContainer}>
          <div className={styles.logoIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          
          <div className={styles.logoText}>
            <span className={styles.titleText}>{text}</span>
            <span className={styles.cursor}>_</span>
          </div>
        </div>

        <div className={styles.cardiogramContainer}>
          <svg className={styles.cardiogram} viewBox="0 0 400 60" preserveAspectRatio="none">
            <defs>
              <linearGradient id="cardioGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#dc2626" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#dc2626" stopOpacity="1" />
                <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <path
              className={showCardiogram ? styles.cardioLine : styles.cardioLineHidden}
              d="M0,30 L80,30 L90,30 L95,10 L100,50 L105,20 L110,35 L115,30 L120,30 L400,30"
              stroke="url(#cardioGradient)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              className={showCardiogram ? styles.cardioGlow : styles.cardioLineHidden}
              d="M0,30 L80,30 L90,30 L95,10 L100,50 L105,20 L110,35 L115,30 L120,30 L400,30"
              stroke="#dc2626"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.3"
              filter="blur(4px)"
            />
          </svg>
        </div>

        <div className={styles.statusContainer}>
          <span className={styles.statusText}>
            {progress < 30 && 'Initializing system...'}
            {progress >= 30 && progress < 60 && 'Loading modules...'}
            {progress >= 60 && progress < 90 && 'Preparing interface...'}
            {progress >= 90 && 'Ready!'}
          </span>
        </div>

        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className={styles.progressPercent}>{progress}%</span>
        </div>
      </div>

      <div className={styles.footer}>
        <span className={styles.footerText}>CHARLE-X</span>
        <span className={styles.footerDivider}>|</span>
        <span className={styles.footerBinary}>
          {showCardiogram ? '♥' : '♡'}
        </span>
      </div>
    </div>
  )
}