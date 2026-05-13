'use client'

import { useEffect, useRef } from 'react'
import styles from './CardiogramECG.module.scss'

interface CardiogramECGProps {
  className?: string
  speed?: number
  showBpmBoost?: boolean
  progress?: number
}

export default function CardiogramECG({ 
  className = '', 
  speed = 3,
  showBpmBoost = false,
  progress = 0
}: CardiogramECGProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
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
    const amplitude = height * 0.4

    const getBpm = (): number => {
      if (showBpmBoost && progress > 80) {
        return 76 + Math.floor((progress - 80) * 3)
      }
      return 76
    }

    const cycleLength = (): number => {
      const bpm = getBpm()
      return Math.round(60000 / bpm / 16.67)
    }

    const getY = (t: number): number => {
      if (t < 5) return 0
      if (t < 10) return -1
      if (t < 15) return 0
      if (t < 20) return 0
      if (t < 25) return 2
      if (t < 30) return -30
      if (t < 35) return 8
      if (t < 45) return 0
      if (t < 55) return -4
      if (t < 65) return 0
      return 0
    }

    let x = 0
    let time = 0
    let lastCycleLength = cycleLength()

    const draw = () => {
      const bpm = getBpm()
      const currentCycleLength = cycleLength()

      if (currentCycleLength !== lastCycleLength) {
        lastCycleLength = currentCycleLength
      }

      const tCycle = (time % currentCycleLength) / currentCycleLength * 100
      const yVal = getY(tCycle)
      const newY = baseline + (yVal * amplitude / 30)

      ctx.beginPath()
      ctx.strokeStyle = '#ff0000'
      ctx.lineWidth = 5
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.shadowBlur = 28
      ctx.shadowColor = '#ff0000'
      ctx.moveTo(x, baseline)
      ctx.lineTo(x + speed, newY)
      ctx.stroke()

      ctx.beginPath()
      ctx.strokeStyle = '#ff3333'
      ctx.lineWidth = 4
      ctx.shadowBlur = 22
      ctx.shadowColor = '#ff0000'
      ctx.moveTo(x, baseline)
      ctx.lineTo(x + speed, newY)
      ctx.stroke()

      ctx.beginPath()
      ctx.strokeStyle = '#ff6666'
      ctx.lineWidth = 3
      ctx.shadowBlur = 16
      ctx.shadowColor = '#ff0000'
      ctx.moveTo(x, baseline)
      ctx.lineTo(x + speed, newY)
      ctx.stroke()

      ctx.beginPath()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.shadowBlur = 0
      ctx.moveTo(x, baseline)
      ctx.lineTo(x + speed, newY)
      ctx.stroke()

      x += speed
      time += speed

      if (x > width) {
        ctx.clearRect(0, 0, 10, height)
      }

      if (x >= width - 20) {
        ctx.fillStyle = '#050505'
        ctx.fillRect(width - 15, 0, 20, height)
        x = width - 20
      }

      requestAnimationFrame(draw)
    }

    ctx.fillStyle = '#050505'
    ctx.fillRect(0, 0, width, height)

    const animationId = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animationId)
  }, [speed, showBpmBoost, progress])

  const getBpm = (): number => {
    if (showBpmBoost && progress > 80) {
      return 76 + Math.floor((progress - 80) * 3)
    }
    return 76
  }

  const currentBpm = getBpm()
  const rhythmName = currentBpm > 100 ? 'TACHY' : currentBpm < 60 ? 'BRADY' : 'SINUS'

  return (
    <div className={`${styles.container} ${className}`}>
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
          <span className={styles.vitalValue}>{progress > 80 ? '↑↑↑' : '→→→'}</span>
        </div>
      </div>
    </div>
  )
}