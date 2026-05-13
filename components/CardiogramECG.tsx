'use client'

import { useEffect, useRef } from 'react'
import styles from './CardiogramECG.module.scss'

interface CardiogramECGProps {
  className?: string
  speed?: number
  showBpmBoost?: boolean
  progress?: number
}

function gaussian(x: number, mean: number, sigma: number): number {
  return Math.exp(-Math.pow(x - mean, 2) / (2 * sigma * sigma))
}

function cardiogramY(x: number): number {
  const p = 0.6 * Math.sin(x) * gaussian(x, 3, 0.3)
  const q = -1.5 * gaussian(x, 3.2, 0.15)
  const r = 2 * gaussian(x, 3.3, 0.08)
  const s = -1 * gaussian(x, 3.4, 0.15)
  const t = 0.5 * gaussian(x, 4, 0.3)
  return -(p + q + r + s + t)
}

export default function CardiogramECG({ 
  className = '', 
  speed = 5,
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
    const amplitude = height * 0.35

    const getBpm = (): number => {
      if (showBpmBoost && progress > 80) {
        return 76 + Math.floor((progress - 80) * 3)
      }
      return 76
    }

    const getCycleLength = (): number => {
      const bpm = getBpm()
      return Math.round(60000 / bpm / 12)
    }

    let phase = 0
    let cycleLength = getCycleLength()

    const draw = () => {
      const currentBpm = getBpm()
      cycleLength = getCycleLength()

      ctx.fillStyle = '#050505'
      ctx.fillRect(0, 0, width, height)

      const points: [number, number][] = []
      const samples = 120

      for (let i = 0; i < samples; i++) {
        const t = ((phase + i) % cycleLength) / cycleLength * Math.PI * 6
        const yVal = cardiogramY(t)
        const xPos = (i / samples) * width
        const yPos = baseline - yVal * amplitude
        points.push([xPos, yPos])
      }

      const gradient = ctx.createLinearGradient(0, 0, width, 0)
      gradient.addColorStop(0, 'rgba(255, 0, 0, 0)')
      gradient.addColorStop(0.1, 'rgba(255, 0, 0, 0.3)')
      gradient.addColorStop(0.5, 'rgba(255, 0, 0, 0.8)')
      gradient.addColorStop(0.9, 'rgba(255, 0, 0, 0.3)')
      gradient.addColorStop(1, 'rgba(255, 0, 0, 0)')

      for (let w = 5; w >= 1; w--) {
        ctx.beginPath()
        ctx.strokeStyle = w === 5 ? '#ff0000' : w === 4 ? '#ff3333' : w === 3 ? '#ff6666' : w === 2 ? '#ff9999' : '#ffffff'
        ctx.lineWidth = w
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        
        if (w <= 5) {
          ctx.shadowBlur = 25 - (5 - w) * 4
          ctx.shadowColor = '#ff0000'
        } else {
          ctx.shadowBlur = 0
        }

        ctx.moveTo(points[0][0], points[0][1])
        for (let j = 1; j < points.length; j++) {
          ctx.lineTo(points[j][0], points[j][1])
        }
        ctx.stroke()
      }

      const sweepX = (phase / cycleLength) * width * 6
      const sweepGradient = ctx.createLinearGradient(sweepX - 50, 0, sweepX, 0)
      sweepGradient.addColorStop(0, 'rgba(255, 0, 0, 0)')
      sweepGradient.addColorStop(1, 'rgba(255, 0, 0, 0.15)')
      ctx.fillStyle = sweepGradient
      ctx.fillRect(sweepX - 50, 0, 50, height)

      phase += speed
      if (phase >= cycleLength) {
        phase = 0
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