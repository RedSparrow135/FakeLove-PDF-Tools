'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import styles from './CardiogramECG.module.scss'

interface CardiogramECGProps {
  className?: string
  speed?: number
  showBpmBoost?: boolean
  progress?: number
}

export default function CardiogramECG({ 
  className = '', 
  speed = 4,
  showBpmBoost = false,
  progress = 0
}: CardiogramECGProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentPattern, setCurrentPattern] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const getBpm = (): number => {
    if (showBpmBoost && progress > 80) {
      const boost = Math.floor((progress - 80) * 3)
      return 76 + boost
    }
    return 76
  }

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
    const amplitude = height * 0.38

    const currentBpm = getBpm()
    const cycleLength = currentBpm > 100 ? 65 : currentBpm < 60 ? 140 : 100

    if (!canvas.dataset.lastX) {
      canvas.dataset.lastX = '0'
      canvas.dataset.time = '0'
      canvas.dataset.prevY = baseline.toString()
      canvas.dataset.prevX = '0'
    }

    let x = parseFloat(canvas.dataset.lastX || '0')
    let prevX = parseFloat(canvas.dataset.prevX || '0')
    let time = parseFloat(canvas.dataset.time || '0')
    let prevY = parseFloat(canvas.dataset.prevY || baseline.toString())

    const tCycle = (time % cycleLength) / cycleLength * 100

    const getY = (t: number): number => {
      if (t < 8) return 0
      if (t < 12) return -2
      if (t < 16) return 0
      if (t < 20) return 0
      if (t < 22) return 3
      if (t < 26) return -28
      if (t < 30) return 6
      if (t < 38) return 0
      if (t < 46) return -3
      if (t < 54) return 0
      return 0
    }

    const yVal = getY(tCycle)
    const newY = baseline + (yVal * amplitude / 30)

    const effectiveSpeed = isHovered ? speed * 1.8 : speed

    ctx.beginPath()
    ctx.strokeStyle = '#ff0000'
    ctx.lineWidth = 5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.shadowBlur = 25
    ctx.shadowColor = '#ff0000'
    
    ctx.moveTo(prevX, prevY)
    ctx.lineTo(x, newY)
    ctx.stroke()

    ctx.beginPath()
    ctx.strokeStyle = '#ff3333'
    ctx.lineWidth = 4
    ctx.shadowBlur = 20
    ctx.shadowColor = '#ff0000'
    ctx.moveTo(prevX, prevY)
    ctx.lineTo(x, newY)
    ctx.stroke()

    ctx.beginPath()
    ctx.strokeStyle = '#ff6666'
    ctx.lineWidth = 3
    ctx.shadowBlur = 15
    ctx.shadowColor = '#ff0000'
    ctx.moveTo(prevX, prevY)
    ctx.lineTo(x, newY)
    ctx.stroke()

    ctx.beginPath()
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 1.5
    ctx.shadowBlur = 0
    ctx.moveTo(prevX, prevY)
    ctx.lineTo(x, newY)
    ctx.stroke()

    ctx.fillStyle = '#050505'
    ctx.fillRect(x + effectiveSpeed, 0, 100, height)

    canvas.dataset.prevX = x.toString()
    canvas.dataset.lastX = (x + effectiveSpeed).toString()
    canvas.dataset.time = (time + 1).toString()
    canvas.dataset.prevY = newY.toString()

    if (x > width) {
      x = 0
      prevX = 0
      canvas.dataset.lastX = '0'
      canvas.dataset.prevX = '0'
      ctx.clearRect(0, 0, 5, height)
    }

    requestAnimationFrame(draw)
  }, [speed, isHovered, getBpm])

  useEffect(() => {
    const animationId = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animationId)
  }, [draw])

  const currentBpm = getBpm()
  const rhythmName = currentBpm > 100 ? 'TACHY' : currentBpm < 60 ? 'BRADY' : 'SINUS'

  return (
    <div 
      className={`${styles.container} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <span className={styles.fake}>Fake</span>
          <span className={styles.love}>Love</span>
        </div>
        <span className={styles.subtitle}>CARDIAC MONITOR</span>
      </div>
      
      <div className={styles.monitor}>
        <canvas ref={canvasRef} className={styles.canvas} />
        <div className={styles.grid} />
        <div className={styles.scanline} />
        <div className={styles.monitorBorder} />
        <div className={styles.cornerTL} />
        <div className={styles.cornerTR} />
        <div className={styles.cornerBL} />
        <div className={styles.cornerBR} />
      </div>

      <div className={styles.vitals}>
        <div className={styles.vital}>
          <span className={styles.vitalLabel}>BPM</span>
          <span className={`${styles.vitalValue} ${progress > 80 ? styles.boost : ''}`}>
            {currentBpm}
          </span>
        </div>
        <div className={styles.vital}>
          <span className={styles.vitalLabel}>RHYTHM</span>
          <span className={styles.vitalValue}>{rhythmName}</span>
        </div>
        <div className={styles.vital}>
          <span className={styles.vitalLabel}>DEV</span>
          <span className={`${styles.vitalValue} ${styles.dev}`}>CHARLES-X</span>
        </div>
      </div>
    </div>
  )
}