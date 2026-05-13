'use client'

import { useState, useEffect } from 'react'
import styles from './AnimatedLogo.module.scss'

interface AnimatedLogoProps {
  size?: 'small' | 'medium' | 'large'
  animated?: boolean
}

export default function AnimatedLogo({ size = 'medium', animated = true }: AnimatedLogoProps) {
  const [isHovered, setIsHovered] = useState(false)

  const sizes = {
    small: { height: '16px', fontSize: '0.75rem', fontSizeSub: '0.45rem' },
    medium: { height: '22px', fontSize: '1rem', fontSizeSub: '0.55rem' },
    large: { height: '32px', fontSize: '1.4rem', fontSizeSub: '0.65rem' },
  }

  const { height, fontSize, fontSizeSub } = sizes[size]

  const cardioPaths = [
    'M0,50 L40,50 L48,50 L52,20 L56,80 L60,30 L64,45 L68,50 L120,50 L128,50 L132,20 L136,80 L140,30 L144,45 L148,50 L200,50 L208,50 L212,20 L216,80 L220,30 L224,45 L228,50 L280,50 L288,50 L292,20 L296,80 L300,30 L304,45 L308,50 L360,50 L368,50 L372,20 L376,80 L380,30 L384,45 L388,50',
  ].join(' ')

  return (
    <div 
      className={`${styles.logo} ${isHovered ? styles.hovered : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.textWrapper}>
        <span className={styles.fake} style={{ fontSize }}>Fake</span>
        <span className={styles.love} style={{ fontSize }}>Love</span>
      </div>
      
      <div className={styles.cardiogramWrapper} style={{ height }}>
        <svg 
          className={styles.cardiogramSvg}
          viewBox="0 0 400 100" 
          preserveAspectRatio="none"
          style={{ height }}
        >
          <defs>
            <linearGradient id="cardioGradLogo" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff2e63" stopOpacity="0" />
              <stop offset="20%" stopColor="#ff2e63" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#ff0040" stopOpacity="1" />
              <stop offset="80%" stopColor="#ff2e63" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ff2e63" stopOpacity="0" />
            </linearGradient>
            <filter id="cardioGlowLogo" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <path
            className={styles.cardioPath}
            d={cardioPaths}
            fill="none"
            stroke="url(#cardioGradLogo)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#cardioGlowLogo)"
            style={{
              animationDuration: isHovered ? '1.5s' : '2.5s',
            }}
          />
        </svg>
      </div>

      <span className={styles.subtitle} style={{ fontSize: fontSizeSub }}>
        PDF TOOLS
      </span>
    </div>
  )
}