'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import styles from './AnimatedLogo.module.scss'

interface AnimatedLogoProps {
  size?: 'small' | 'medium' | 'large'
}

export default function AnimatedLogo({ size = 'medium' }: AnimatedLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isHovered, setIsHovered] = useState(false)

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

    const template = [
      [0, 0], [8, 0], [12, -2], [16, 0], [18, 0],
      [20, 0], [22, 4], [26, -25], [30, 6],
      [34, 0], [38, 0], [42, 0], [46, -3], [52, 0], [60, 0], [100, 0]
    ]

    function interpolate(t: number): number {
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

    let x = 0
    let time = 0
    let prevY = baseline

    function draw() {
      if (!ctx) return
      
      const speed = isHovered ? 4 : 2.5

      ctx.clearRect(0, 0, width, height)

      const cycleLength = 100
      const tCycle = (time % cycleLength) / cycleLength * 100
      const yVal = interpolate(tCycle)
      const newY = baseline + (yVal * amplitude / 30)

      const glowAmount = isHovered ? 12 : 8
      const lineWidth = isHovered ? 2.5 : 2

      ctx.beginPath()
      ctx.strokeStyle = '#ff2e63'
      ctx.lineWidth = lineWidth
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.shadowBlur = glowAmount
      ctx.shadowColor = '#ff2e63'
      
      ctx.moveTo(x === 0 ? 0 : x - speed, prevY)
      ctx.lineTo(x, newY)
      ctx.stroke()

      ctx.beginPath()
      ctx.strokeStyle = 'rgba(255, 46, 99, 0.4)'
      ctx.lineWidth = lineWidth + 2
      ctx.shadowBlur = glowAmount * 2
      ctx.moveTo(x === 0 ? 0 : x - speed, prevY)
      ctx.lineTo(x, newY)
      ctx.stroke()

      ctx.clearRect(x + speed + 1, 0, 30, height)

      prevY = newY
      x += speed
      time += 1

      if (x > width) {
        x = 0
        ctx.clearRect(0, 0, 5, height)
      }

      requestAnimationFrame(draw)
    }

    const animationId = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animationId)
  }, [isHovered])

  const sizes = {
    small: { titleSize: '1rem', subtitleSize: '0.45rem', canvasHeight: '14px' },
    medium: { titleSize: '1.3rem', subtitleSize: '0.5rem', canvasHeight: '18px' },
    large: { titleSize: '1.8rem', subtitleSize: '0.6rem', canvasHeight: '24px' },
  }

  const { titleSize, subtitleSize, canvasHeight } = sizes[size]

  return (
    <div 
      className={`${styles.logo} ${isHovered ? styles.hovered : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.textRow}>
        <h1 className={styles.title}>
          <span className={styles.fake} style={{ fontSize: titleSize }}>Fake</span>
          <span className={styles.love} style={{ fontSize: titleSize }}>Love</span>
        </h1>
      </div>
      
      <div className={styles.ecgRow} style={{ height: canvasHeight }}>
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>
      
      <span className={styles.subtitle} style={{ fontSize: subtitleSize }}>
        PDF TOOLS
      </span>
    </div>
  )
}