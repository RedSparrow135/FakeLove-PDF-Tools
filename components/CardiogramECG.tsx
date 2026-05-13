'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import styles from './CardiogramECG.module.scss'

interface CardiogramECGProps {
  className?: string
  speed?: number
  glowIntensity?: 'low' | 'medium' | 'high'
}

const ECG_TEMPLATES = {
  normal: [
    [0, 0], [8, 0], [12, -2], [16, 0], [18, 0],
    [20, 0], [22, 4], [26, -30], [30, 8],
    [34, 0], [38, 0], [42, 0], [46, -4], [52, 0], [60, 0], [100, 0]
  ],
  tachycardia: [
    [0, 0], [5, 0], [8, -2], [12, 0], [14, 0],
    [16, 0], [18, 4], [22, -25], [26, 6],
    [30, 0], [34, 0], [38, 0], [42, -4], [48, 0], [55, 0], [100, 0]
  ],
  bradycardia: [
    [0, 0], [10, 0], [15, -2], [20, 0], [24, 0],
    [28, 0], [30, 4], [35, -32], [40, 8],
    [44, 0], [52, 0], [58, 0], [62, -4], [70, 0], [80, 0], [100, 0]
  ],
}

function interpolate(t: number, template: number[][]): number {
  for (let i = 0; i < template.length - 1; i++) {
    const [t1, y1] = template[i]
    const [t2, y2] = template[i + 1]
    if (t >= t1 && t <= t2) {
      const progress = (t - t1) / (t2 - t1)
      return y1 + (y2 - y1) * progress
    }
  }
  return 0
}

export default function CardiogramECG({ 
  className = '', 
  speed = 3,
  glowIntensity = 'high'
}: CardiogramECGProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentPattern, setCurrentPattern] = useState<keyof typeof ECG_TEMPLATES>('normal')
  const [isHovered, setIsHovered] = useState(false)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
    }

    const width = rect.width
    const height = rect.height
    const baseline = height / 2
    const amplitude = height * 0.35

    ctx.clearRect(0, 0, width, height)

    const template = ECG_TEMPLATES[currentPattern]
    const effectiveSpeed = isHovered ? speed * 1.8 : speed

    if (!canvas.dataset.lastX) {
      canvas.dataset.lastX = '0'
      canvas.dataset.time = '0'
      canvas.dataset.prevY = baseline.toString()
    }

    let x = parseFloat(canvas.dataset.lastX || '0')
    let time = parseFloat(canvas.dataset.time || '0')
    let prevY = parseFloat(canvas.dataset.prevY || baseline.toString())

    const cycleLength = currentPattern === 'tachycardia' ? 60 : 
                       currentPattern === 'bradycardia' ? 140 : 100

    const tCycle = (time % cycleLength) / cycleLength * 100
    const yVal = interpolate(tCycle, template)
    const newY = baseline + (yVal * amplitude / 30)

    ctx.beginPath()
    ctx.strokeStyle = '#ff2e63'
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    
    const glowAmount = glowIntensity === 'high' ? 15 : glowIntensity === 'medium' ? 10 : 5
    ctx.shadowBlur = glowAmount
    ctx.shadowColor = '#ff2e63'
    
    ctx.moveTo(x === 0 ? 0 : x - effectiveSpeed, prevY)
    ctx.lineTo(x, newY)
    ctx.stroke()

    ctx.beginPath()
    ctx.strokeStyle = 'rgba(255, 46, 99, 0.5)'
    ctx.lineWidth = 6
    ctx.shadowBlur = glowAmount * 2
    ctx.moveTo(x === 0 ? 0 : x - effectiveSpeed, prevY)
    ctx.lineTo(x, newY)
    ctx.stroke()

    ctx.beginPath()
    ctx.strokeStyle = 'rgba(255, 150, 180, 0.3)'
    ctx.lineWidth = 12
    ctx.shadowBlur = glowAmount * 3
    ctx.moveTo(x === 0 ? 0 : x - effectiveSpeed, prevY)
    ctx.lineTo(x, newY)
    ctx.stroke()

    ctx.clearRect(x + effectiveSpeed + 1, 0, 50, height)

    canvas.dataset.lastX = (x + effectiveSpeed).toString()
    canvas.dataset.time = (time + 1).toString()
    canvas.dataset.prevY = newY.toString()

    if (x > width) {
      x = 0
      canvas.dataset.lastX = '0'
      ctx.clearRect(0, 0, 5, height)
    }

    requestAnimationFrame(draw)
  }, [currentPattern, speed, isHovered, glowIntensity])

  useEffect(() => {
    const animationId = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animationId)
  }, [draw])

  useEffect(() => {
    const interval = setInterval(() => {
      const patterns = Object.keys(ECG_TEMPLATES) as (keyof typeof ECG_TEMPLATES)[]
      const currentIndex = patterns.indexOf(currentPattern)
      const nextIndex = (currentIndex + 1) % patterns.length
      setCurrentPattern(patterns[nextIndex])
    }, 8000)

    return () => clearInterval(interval)
  }, [currentPattern])

  return (
    <div 
      className={`${styles.container} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.textOverlay}>
        <h1 className={styles.title}>
          <span className={styles.fake}>Fake</span>
          <span className={styles.love}>Love</span>
        </h1>
        <div className={styles.subtitle}>ECG MONITOR</div>
      </div>
      
      <div className={styles.screenWrapper}>
        <canvas ref={canvasRef} className={styles.canvas} />
        <div className={styles.gridOverlay} />
        <div className={styles.scanline} />
        <div className={styles.cornerMarks}>
          <span className={styles.cornerTL} />
          <span className={styles.cornerTR} />
          <span className={styles.cornerBL} />
          <span className={styles.cornerBR} />
        </div>
      </div>

      <div className={styles.monitorFrame}>
        <div className={styles.frameGlow} />
      </div>

      <div className={styles.vitals}>
        <div className={styles.vital}>
          <span className={styles.vitalLabel}>HEART RATE</span>
          <span className={styles.vitalValue}>
            {currentPattern === 'tachycardia' ? '142' : 
             currentPattern === 'bradycardia' ? '48' : '76'} <span className={styles.vitalUnit}>BPM</span>
          </span>
        </div>
        <div className={styles.vital}>
          <span className={styles.vitalLabel}>RHYTHM</span>
          <span className={styles.vitalValue}>
            {currentPattern === 'normal' ? 'SINUS' : 
             currentPattern === 'tachycardia' ? 'TACHY' : 'BRADY'}
          </span>
        </div>
        <div className={styles.vital}>
          <span className={styles.vitalLabel}>STATUS</span>
          <span className={`${styles.vitalValue} ${styles.statusActive}`}>
            <span className={styles.statusDot} />ALIVE
          </span>
        </div>
      </div>
    </div>
  )
}