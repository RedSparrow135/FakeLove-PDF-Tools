'use client'

import { useState, useEffect } from 'react'
import styles from './SplashScreen.module.scss'

interface SplashScreenProps {
  onComplete: () => void
  minDuration?: number
}

export default function SplashScreen({ onComplete, minDuration = 3000 }: SplashScreenProps) {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState(0)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    let currentProgress = 0
    
    const progressInterval = setInterval(() => {
      currentProgress += 1.2
      setProgress(Math.min(currentProgress, 100))
      
      if (currentProgress >= 100) {
        clearInterval(progressInterval)
        setTimeout(onComplete, 300)
      }
    }, minDuration / 85)

    return () => clearInterval(progressInterval)
  }, [minDuration, onComplete])

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(p => (p + 1) % 360)
    }, 30)
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

  const cardioPoints = `
    M0,50 L30,50 L35,50 L40,50 L45,50 L50,50
    L55,50 L60,50 L65,50 L70,50 L75,50 L80,50
    L85,50 L90,50 L95,20 L100,85 L105,25 L110,50
    L115,50 L120,50 L125,50 L130,50 L135,50 L140,50
    L145,50 L150,50 L155,50 L160,50 L165,50 L170,20
    L175,85 L180,25 L185,50 L190,50 L195,50 L200,50
    L205,50 L210,50 L215,50 L220,50 L225,50 L230,20
    L235,85 L240,25 L245,50 L250,50 L255,50 L260,50
    L265,50 L270,50 L275,50 L280,50 L285,50 L290,20
    L295,85 L300,25 L305,50 L310,50 L315,50 L320,50
    L325,50 L330,50 L335,50 L340,50 L345,50 L350,20
    L355,85 L360,25 L365,50 L370,50 L375,50 L380,50
    L385,50 L390,50 L395,50 L400,50
  `

  return (
    <div className={styles.splash}>
      <div className={styles.background}>
        <div className={styles.gridLines} />
        <div className={styles.glowCenter} />
        <div className={styles.scanlines} />
        
        <div className={styles.particles}>
          {Array.from({ length: 30 }).map((_, i) => (
            <div 
              key={i} 
              className={styles.particle}
              style={{
                left: `${(i * 3.7) % 100}%`,
                animationDelay: `${(i * 0.3) % 5}s`,
                animationDuration: `${4 + (i % 3)}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className={`${styles.content} ${showContent ? styles.visible : ''}`}>
        <div className={styles.logoSection}>
          <h1 className={styles.mainTitle}>
            <span className={styles.titleFake}>Fake</span>
            <span className={styles.titleLove}>Love</span>
          </h1>
          
          <div className={styles.cardiogramContainer}>
            <svg 
              className={styles.cardiogram} 
              viewBox="0 0 400 100" 
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="splashGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ff2e63" stopOpacity="0" />
                  <stop offset="15%" stopColor="#ff2e63" stopOpacity="0.4" />
                  <stop offset="35%" stopColor="#ff0040" stopOpacity="1" />
                  <stop offset="50%" stopColor="#ff0040" stopOpacity="1" />
                  <stop offset="65%" stopColor="#ff2e63" stopOpacity="0.4" />
                  <stop offset="85%" stopColor="#ff2e63" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#ff2e63" stopOpacity="0" />
                </linearGradient>
                <filter id="splashGlow">
                  <feGaussianBlur stdDeviation="3" result="blur"/>
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
                strokeWidth="6"
                strokeLinecap="round"
                filter="url(#splashGlow)"
              />
              
              <path
                className={styles.cardioLine}
                d={cardioPoints}
                fill="none"
                stroke="url(#splashGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              
              <circle 
                className={styles.pulseDot}
                cx={180 + Math.sin(phase * 0.05) * 5}
                cy={50 + Math.cos(phase * 0.05) * 3}
                r="4"
                fill="#ff2e63"
              />
            </svg>
          </div>

          <span className={styles.subtitle}>PDF TOOLS</span>
        </div>

        <div className={styles.statusSection}>
          <span className={styles.statusText}>{getStatusMessage()}</span>
        </div>

        <div className={styles.progressSection}>
          <div className={styles.progressTrack}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${progress}%` }}
            />
            <div className={styles.progressPulse} />
          </div>
          <span className={styles.progressPercent}>{Math.round(progress)}%</span>
        </div>

        <div className={styles.metaSection}>
          <span className={styles.metaLine} />
          <span className={styles.metaText}>SYS.INIT.COMPLETE</span>
          <span className={styles.metaDot} />
          <span className={styles.metaText}>v1.0.0</span>
          <span className={styles.metaLine} />
        </div>
      </div>

      <div className={styles.footer}>
        <span className={styles.footerBrand}>FAKELOVE</span>
        <span className={styles.footerHeart}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </span>
        <span className={styles.footerDev}>CHARLE-X</span>
      </div>
    </div>
  )
}