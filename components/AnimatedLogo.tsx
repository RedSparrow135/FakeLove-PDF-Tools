'use client'

import { useState, useEffect } from 'react'
import styles from './AnimatedLogo.module.scss'

interface AnimatedLogoProps {
  size?: 'small' | 'medium' | 'large'
  animated?: boolean
}

export default function AnimatedLogo({ size = 'medium', animated = true }: AnimatedLogoProps) {
  const [phase, setPhase] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isGlitching, setIsGlitching] = useState(false)

  useEffect(() => {
    if (!animated) return
    
    const interval = setInterval(() => {
      setPhase(p => (p + 1) % 100)
    }, isHovered ? 20 : 40)
    
    return () => clearInterval(interval)
  }, [animated, isHovered])

  useEffect(() => {
    const handleClick = () => {
      setIsGlitching(true)
      setTimeout(() => setIsGlitching(false), 300)
    }
    
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [])

  const sizes = {
    small: { icon: 32, text: '0.9rem', cardio: 100 },
    medium: { icon: 48, text: '1.1rem', cardio: 120 },
    large: { icon: 64, text: '1.4rem', cardio: 150 },
  }

  const { icon, text, cardio } = sizes[size]

  const cardioPoints = [
    `M0,${cardio / 2}`,
    `L${cardio * 0.15},${cardio / 2}`,
    `L${cardio * 0.18},${cardio / 2}`,
    `L${cardio * 0.2},${cardio / 4}`,
    `L${cardio * 0.22},${cardio * 0.9}`,
    `L${cardio * 0.25},${cardio / 3}`,
    `L${cardio * 0.28},${cardio * 0.55}`,
    `L${cardio * 0.32},${cardio / 2}`,
    `L${cardio * 0.4},${cardio / 2}`,
    `L${cardio * 0.43},${cardio / 2}`,
    `L${cardio * 0.45},${cardio / 4}`,
    `L${cardio * 0.47},${cardio * 0.85}`,
    `L${cardio * 0.5},${cardio / 3}`,
    `L${cardio * 0.53},${cardio * 0.5}`,
    `L${cardio * 0.57},${cardio / 2}`,
    `L${cardio},${cardio / 2}`,
  ].join(' ')

  const pathLength = cardio * 1.5

  return (
    <div 
      className={`${styles.logo} ${isGlitching ? styles.glitching : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.iconContainer} style={{ width: icon, height: icon }}>
        <svg 
          viewBox={`0 0 ${cardio} ${cardio}`} 
          className={styles.cardioSvg}
          style={{ width: icon, height: icon }}
        >
          <defs>
            <linearGradient id={`cardioGrad-${size}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff2e63" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#ff0040" stopOpacity="1" />
              <stop offset="100%" stopColor="#ff2e63" stopOpacity="0.3" />
            </linearGradient>
            <filter id={`glow-${size}`}>
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id={`glitch-${size}`}>
              <feOffset in="SourceGraphic" dx="2" dy="0" result="red"/>
              <feOffset in="SourceGraphic" dx="-2" dy="0" result="blue"/>
              <feColorMatrix in="red" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="redOut"/>
              <feColorMatrix in="blue" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blueOut"/>
              <feMerge>
                <feMergeNode in="redOut"/>
                <feMergeNode in="blueOut"/>
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
            strokeLinejoin="round"
            filter={`url(#glow-${size})`}
            style={{
              strokeDasharray: pathLength,
              strokeDashoffset: animated ? (phase < 50 ? pathLength - (phase / 50) * pathLength : 0) : 0,
            }}
          />
          
          <path
            className={styles.cardioMain}
            d={cardioPoints}
            fill="none"
            stroke={`url(#cardioGrad-${size})`}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={isGlitching ? `url(#glitch-${size})` : undefined}
            style={{
              strokeDasharray: pathLength,
              strokeDashoffset: animated ? (phase < 50 ? pathLength - (phase / 50) * pathLength : 0) : 0,
            }}
          />
        </svg>
        
        <div className={styles.iconBackground} />
      </div>

      <div className={styles.textContainer}>
        <span className={styles.text} style={{ fontSize: text }}>
          <span className={styles.textFake}>Fake</span>
          <span className={styles.textLove}>Love</span>
        </span>
        <span className={styles.subtitle}>PDF TOOLS</span>
      </div>

      {animated && (
        <div className={styles.scanline} />
      )}
    </div>
  )
}