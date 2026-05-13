'use client'

import { useState, useEffect, useRef } from 'react'
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
    const amplitude = height * 0.4

    let x = 0
    let time = 0
    let prevY = baseline

    function getY(t: number): number {
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

    function draw() {
      if (!ctx) return

      const speed = isHovered ? 3.5 : 2.5

      ctx.clearRect(0, 0, width, height)

      const tCycle = (time % 100) / 100 * 100
      const yVal = getY(tCycle)
      const newY = baseline + (yVal * amplitude / 30)

      const glowSize = isHovered ? 20 : 14
      const lineW = isHovered ? 4 : 3.5

      ctx.beginPath()
      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = lineW
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.shadowBlur = glowSize
      ctx.shadowColor = '#dc2626'
      
      ctx.moveTo(x === 0 ? 0 : x - speed, prevY)
      ctx.lineTo(x, newY)
      ctx.stroke()

      ctx.beginPath()
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)'
      ctx.lineWidth = lineW + 4
      ctx.shadowBlur = glowSize * 1.5
      ctx.moveTo(x === 0 ? 0 : x - speed, prevY)
      ctx.lineTo(x, newY)
      ctx.stroke()

      ctx.beginPath()
      ctx.strokeStyle = 'rgba(248, 113, 113, 0.4)'
      ctx.lineWidth = lineW + 10
      ctx.shadowBlur = glowSize * 2.5
      ctx.moveTo(x === 0 ? 0 : x - speed, prevY)
      ctx.lineTo(x, newY)
      ctx.stroke()

      ctx.beginPath()
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)'
      ctx.lineWidth = 1.5
      ctx.shadowBlur = 0
      ctx.moveTo(x === 0 ? 0 : x - speed, prevY)
      ctx.lineTo(x, newY)
      ctx.stroke()

      ctx.clearRect(x + speed + 1, 0, 40, height)

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
    medium: { titleSize: '1.2rem', subtitleSize: '0.5rem', canvasHeight: '16px' },
    large: { titleSize: '1.6rem', subtitleSize: '0.6rem', canvasHeight: '20px' },
  }

  const { titleSize, subtitleSize, canvasHeight } = sizes[size]

  return (
    <div 
      className={`${styles.logo} ${isHovered ? styles.hovered : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.textRow}>
        <span className={styles.fake} style={{ fontSize: titleSize }}>Fake</span>
        <span className={styles.love} style={{ fontSize: titleSize }}>Love</span>
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