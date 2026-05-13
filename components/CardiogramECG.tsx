'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import styles from './CardiogramECG.module.scss'

interface CardiogramECGProps {
  className?: string
  speed?: number
  lineColor?: string
  glowColor?: string
}

export default function CardiogramECG({ 
  className = '', 
  speed = 3.5,
  lineColor = '#dc2626',
  glowColor = '#f43f5e'
}: CardiogramECGProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentPattern, setCurrentPattern] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const patterns = [
    { name: 'SINUS', bpm: 76, cycle: 100 },
    { name: 'TACHY', bpm: 120, cycle: 65 },
    { name: 'BRADY', bpm: 45, cycle: 150 },
  ]

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

    ctx.clearRect(0, 0, width, height)

    const current = patterns[currentPattern]
    const effectiveSpeed = isHovered ? speed * 1.6 : speed

    if (!canvas.dataset.lastX) {
      canvas.dataset.lastX = '0'
      canvas.dataset.time = '0'
      canvas.dataset.prevY = baseline.toString()
    }

    let x = parseFloat(canvas.dataset.lastX || '0')
    let time = parseFloat(canvas.dataset.time || '0')
    let prevY = parseFloat(canvas.dataset.prevY || baseline.toString())

    const tCycle = (time % current.cycle) / current.cycle * 100

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

    const glowSize = isHovered ? 20 : 14
    const lineW = isHovered ? 3.5 : 3

    ctx.beginPath()
    ctx.strokeStyle = lineColor
    ctx.lineWidth = lineW
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.shadowBlur = glowSize
    ctx.shadowColor = glowColor
    
    ctx.moveTo(x === 0 ? 0 : x - effectiveSpeed, prevY)
    ctx.lineTo(x, newY)
    ctx.stroke()

    ctx.beginPath()
    ctx.strokeStyle = `rgba(220, 38, 38, 0.6)`
    ctx.lineWidth = lineW + 3
    ctx.shadowBlur = glowSize * 1.5
    ctx.moveTo(x === 0 ? 0 : x - effectiveSpeed, prevY)
    ctx.lineTo(x, newY)
    ctx.stroke()

    ctx.beginPath()
    ctx.strokeStyle = `rgba(244, 63, 94, 0.4)`
    ctx.lineWidth = lineW + 8
    ctx.shadowBlur = glowSize * 2.5
    ctx.moveTo(x === 0 ? 0 : x - effectiveSpeed, prevY)
    ctx.lineTo(x, newY)
    ctx.stroke()

    ctx.clearRect(x + effectiveSpeed + 1, 0, 60, height)

    canvas.dataset.lastX = (x + effectiveSpeed).toString()
    canvas.dataset.time = (time + 1).toString()
    canvas.dataset.prevY = newY.toString()

    if (x > width) {
      x = 0
      canvas.dataset.lastX = '0'
      ctx.clearRect(0, 0, 5, height)
    }

    requestAnimationFrame(draw)
  }, [currentPattern, speed, isHovered, lineColor, glowColor])

  useEffect(() => {
    const animationId = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animationId)
  }, [draw])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPattern(p => (p + 1) % patterns.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const current = patterns[currentPattern]

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
          <span className={styles.vitalValue}>{current.bpm}</span>
        </div>
        <div className={styles.vital}>
          <span className={styles.vitalLabel}>RHYTHM</span>
          <span className={styles.vitalValue}>{current.name}</span>
        </div>
        <div className={styles.vital}>
          <span className={styles.vitalLabel}>STATUS</span>
          <span className={`${styles.vitalValue} ${styles.active}`}>
            <span className={styles.dot} />LIVE
          </span>
        </div>
      </div>
    </div>
  )
}