'use client'

import { useState, useEffect } from 'react'
import styles from './DeveloperSignature.module.scss'

export default function DeveloperSignature() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div 
      className={styles.signature} 
      style={{ 
        opacity: visible ? 1 : 0, 
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.5s ease'
      }}
    >
      <div className={styles.brandSection}>
        <span className={styles.brandName}>FAKE LOVE</span>
        <span className={styles.brandTagline}>PDF Suite</span>
      </div>

      <div className={styles.divider} />

      <div className={styles.heartSection}>
        <svg className={styles.pixelHeart} viewBox="0 0 15 14">
          <rect x="1" y="1" width="2" height="2" />
          <rect x="4" y="0" width="2" height="2" />
          <rect x="7" y="0" width="2" height="2" />
          <rect x="10" y="1" width="2" height="2" />
          <rect x="0" y="3" width="2" height="2" />
          <rect x="3" y="3" width="2" height="2" />
          <rect x="6" y="3" width="2" height="2" />
          <rect x="9" y="3" width="2" height="2" />
          <rect x="12" y="3" width="2" height="2" />
          <rect x="1" y="5" width="2" height="2" />
          <rect x="4" y="5" width="2" height="2" />
          <rect x="6" y="5" width="4" height="2" />
          <rect x="11" y="5" width="2" height="2" />
          <rect x="3" y="7" width="2" height="2" />
          <rect x="6" y="7" width="2" height="2" />
          <rect x="9" y="7" width="2" height="2" />
          <rect x="5" y="9" width="2" height="2" />
          <rect x="8" y="9" width="2" height="2" />
          <rect x="6" y="11" width="2" height="2" />
        </svg>
      </div>

      <div className={styles.binarySection}>
        <span className={styles.binaryLine}>01000110 01000001</span>
        <span className={styles.binaryLine}>01001011 01000101</span>
      </div>

      <div className={styles.divider} />

      <div className={styles.devSection}>
        <span className={styles.devName}>Charle-X</span>
        <span className={styles.devTagline}>Hecho con odio</span>
      </div>
    </div>
  )
}