'use client'

import { useState, useEffect } from 'react'
import BitFireworks, { BitConfetti } from './BitFireworks'
import styles from './ResultCard.module.scss'

interface ResultCardProps {
  title: string
  description: string
  downloadUrl: string
  fileName: string
  stats?: { label: string; value: string | number }[]
}

function textToBinary(text: string): string {
  return text.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join('')
}

const MESSAGES = [
  textToBinary('FAKE LOVE'),
  textToBinary('PDF MASTER'),
  textToBinary('NICE WORK'),
  textToBinary('BINARY LOVE'),
  textToBinary('LOL PDF'),
  textToBinary('SUCCESS'),
  textToBinary('HELLO WORLD'),
  textToBinary('BYTE ME'),
  textToBinary('0 AND 1'),
  textToBinary('NERD ALERT'),
  textToBinary('ASCII ART'),
  textToBinary('SYSTEM OK'),
]

function getRandomBinaryMessage(): string {
  return MESSAGES[Math.floor(Math.random() * MESSAGES.length)]
}

function AnimatedBinaryBadge() {
  const [displayBits, setDisplayBits] = useState<string[]>([])
  const [phase, setPhase] = useState<'typing' | 'coding' | 'disintegrating' | 'done'>('typing')
  const fullMessage = getRandomBinaryMessage()
  const allBits = fullMessage.split('')

  useEffect(() => {
    let currentIndex = 0
    
    const typingInterval = setInterval(() => {
      if (currentIndex < allBits.length) {
        setDisplayBits(prev => [...prev, allBits[currentIndex]])
        currentIndex++
      } else {
        clearInterval(typingInterval)
        setPhase('coding')
      }
    }, 50)

    return () => clearInterval(typingInterval)
  }, [allBits])

  useEffect(() => {
    if (phase !== 'coding') return

    const codingTimeout = setTimeout(() => {
      setPhase('disintegrating')
    }, 2000)

    const glitchInterval = setInterval(() => {
      setDisplayBits(prev => prev.map(bit => Math.random() > 0.7 ? (bit === '0' ? '1' : '0') : bit))
    }, 100)

    return () => {
      clearTimeout(codingTimeout)
      clearInterval(glitchInterval)
    }
  }, [phase])

  useEffect(() => {
    if (phase !== 'disintegrating') return

    let toRemove = Math.floor(allBits.length * 0.1)
    const disintegrateInterval = setInterval(() => {
      setDisplayBits(prev => {
        if (prev.length <= 2) {
          clearInterval(disintegrateInterval)
          setPhase('done')
          return []
        }
        const indices = prev.map((_, i) => i).filter(i => Math.random() > 0.6)
        return prev.filter((_, i) => !indices.includes(i) || i >= prev.length - toRemove)
      })
      toRemove = Math.min(toRemove + 2, allBits.length)
    }, 150)

    return () => clearInterval(disintegrateInterval)
  }, [phase, allBits.length])

  if (phase === 'done') return null

  return (
    <div className={`${styles.bits} ${styles[phase]}`}>
      {displayBits.map((bit, i) => (
        <span 
          key={`${phase}-${i}`} 
          className={`${styles.bit} ${phase === 'disintegrating' ? styles.disintegrating : ''}`}
          style={{ 
            animationDelay: `${Math.random() * 0.3}s`,
            opacity: phase === 'coding' ? (Math.random() > 0.8 ? 0.3 : 1) : undefined,
          }}
        >
          {bit}
        </span>
      ))}
    </div>
  )
}

export default function ResultCard({ title, description, downloadUrl, fileName, stats }: ResultCardProps) {
  const [showFireworks, setShowFireworks] = useState(true)
  const [showConfetti, setShowConfetti] = useState(true)

  return (
    <>
      {showFireworks && <BitFireworks active={true} onComplete={() => setShowFireworks(false)} />}
      {showConfetti && <BitConfetti count={40} />}
      
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <div className={styles.iconGlow} />
          <div className={styles.icon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
        </div>

        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>

        {stats && stats.length > 0 && (
          <div className={styles.stats}>
            {stats.map((stat, i) => (
              <div key={i} className={styles.statBox}>
                <span className={styles.statLabel}>{stat.label}</span>
                <span className={styles.statValue}>{stat.value}</span>
              </div>
            ))}
          </div>
        )}

        <a 
          href={downloadUrl} 
          download={fileName}
          className={styles.downloadBtn}
          onClick={() => {
            setShowFireworks(false)
            setShowConfetti(false)
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Download</span>
          <span className={styles.fileName}>{fileName}</span>
        </a>

        <AnimatedBinaryBadge />
      </div>
    </>
  )
}