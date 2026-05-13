'use client'

import { useState, useEffect } from 'react'
import styles from './SplashScreen.module.scss'
import AnimatedLogo from './AnimatedLogo'

interface SplashScreenProps {
  onComplete: () => void
  minDuration?: number
}

export default function SplashScreen({ onComplete, minDuration = 3000 }: SplashScreenProps) {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    let currentProgress = 0
    
    const progressInterval = setInterval(() => {
      currentProgress += 1.5
      setProgress(Math.min(currentProgress, 100))
      
      if (currentProgress >= 100) {
        clearInterval(progressInterval)
        setTimeout(onComplete, 400)
      }
    }, minDuration / 70)

    return () => clearInterval(progressInterval)
  }, [minDuration, onComplete])

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(p => (p + 1) % 100)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  const statusMessages = [
    'Initializing system...',
    'Loading core modules...',
    'Calibrating cardiogram...',
    'Establishing neural link...',
    'Decrypting emotions...',
    'Ready.'
  ]

  const getStatusMessage = () => {
    const index = Math.min(Math.floor((progress / 100) * statusMessages.length), statusMessages.length - 1)
    return statusMessages[index]
  }

  const cardioPoints = [
    `M0,30 L20,30 L25,30 L30,15 L35,45 L40,20 L45,35 L50,30 L70,30`,
    `L75,30 L80,30 L85,15 L90,45 L95,20 L100,35 L105,30`,
  ].join(' ')

  return (
    <div className={styles.splash}>
      <div className={styles.background}>
        <div className={styles.gridLines} />
        <div className={styles.glowPulse} />
        <div className={styles.particles}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i} 
              className={styles.particle}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className={styles.content}>
        <AnimatedLogo size="large" animated={true} />

        <div className={styles.cardiogramContainer}>
          <svg className={styles.cardiogram} viewBox="0 0 200 60" preserveAspectRatio="none">
            <defs>
              <linearGradient id="splashCardioGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff2e63" stopOpacity="0.1" />
                <stop offset="30%" stopColor="#ff2e63" stopOpacity="1" />
                <stop offset="70%" stopColor="#ff0040" stopOpacity="1" />
                <stop offset="100%" stopColor="#ff2e63" stopOpacity="0.1" />
              </linearGradient>
              <filter id="splashGlow">
                <feGaussianBlur stdDeviation="2" result="blur"/>
                <feMerge>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            <path
              className={styles.cardioGlow}
              d={cardioPoints}
              fill="none"
              stroke="#ff2e63"
              strokeWidth="4"
              strokeLinecap="round"
              filter="url(#splashGlow)"
            />
            
            <path
              className={styles.cardioLine}
              d={cardioPoints}
              fill="none"
              stroke="url(#splashCardioGrad)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            
            <circle 
              className={styles.heartDot}
              cx={100 + Math.sin(phase / 10) * 2}
              cy={30 + Math.cos(phase / 10) * 2}
              r="3"
              fill="#ff2e63"
              filter="url(#splashGlow)"
            />
          </svg>
        </div>

        <div className={styles.statusContainer}>
          <span className={styles.statusText}>{getStatusMessage()}</span>
        </div>

        <div className={styles.progressContainer}>
          <div className={styles.progressTrack}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${progress}%` }}
            />
            <div 
              className={styles.progressGlow}
              style={{ left: `${progress}%` }}
            />
          </div>
          <span className={styles.progressPercent}>{Math.round(progress)}%</span>
        </div>

        <div className={styles.barcodeContainer}>
          <span className={styles.barcodeLine} />
          <span className={styles.barcodeText}>SYS.OK</span>
          <span className={styles.barcodeLine} />
        </div>
      </div>

      <div className={styles.footer}>
        <span className={styles.footerBrand}>FAKELOVE</span>
        <span className={styles.footerVersion}>v1.0.0</span>
        <span className={styles.footerHeart}>
          <svg viewBox="0 0 24 24" fill="#ff2e63" width="14" height="14">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </span>
        <span className={styles.footerDev}>CHARLE-X</span>
      </div>
    </div>
  )
}