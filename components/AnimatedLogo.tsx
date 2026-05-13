'use client'

import { useState, useEffect, useRef } from 'react'
import styles from './AnimatedLogo.module.scss'

interface AnimatedLogoProps {
  size?: 'small' | 'medium' | 'large'
}

function getHeartbeatY(phase: number, height: number, baseline: number): number {
  if (phase < 1) return baseline
  if (phase < 1.5) return baseline - (phase - 1) * height * 0.4
  if (phase < 2) return baseline - (2 - phase) * height * 0.4
  if (phase < 2.5) return baseline + (phase - 2) * height * 0.15
  if (phase < 3) return baseline + (3 - phase) * height * 0.15
  return baseline
}

export default function AnimatedLogo({ size = 'medium' }: AnimatedLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    
    if (rect.width === 0 || rect.height === 0) {
      return
    }

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const width = rect.width
    const height = rect.height
    const baseline = height / 2

    let offset = 0
    const pulseWidth = width * 0.25

    const draw = () => {
      if (!ctx) return

      ctx.clearRect(0, 0, width, height)

      const speed = isHovered ? 2.5 : 1.2
      offset += speed

      const glowSize = isHovered ? 10 : 6

      ctx.beginPath()
      ctx.strokeStyle = '#ff0000'
      ctx.lineWidth = 2.5
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.shadowBlur = glowSize
      ctx.shadowColor = '#ff0000'

      const numPoints = 60
      const step = width / numPoints

      for (let i = 0; i <= numPoints; i++) {
        const x = i * step
        const relativeX = (x + offset) % (pulseWidth * 4)
        const phase = (relativeX / pulseWidth) * 4
        const y = getHeartbeatY(phase, height, baseline)

        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      ctx.beginPath()
      ctx.strokeStyle = '#ff3333'
      ctx.lineWidth = 1.8
      ctx.shadowBlur = glowSize * 0.6
      ctx.shadowColor = '#ff0000'

      for (let i = 0; i <= numPoints; i++) {
        const x = i * step
        const relativeX = (x + offset) % (pulseWidth * 4)
        const phase = (relativeX / pulseWidth) * 4
        const y = getHeartbeatY(phase, height, baseline)

        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      ctx.beginPath()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 0.8
      ctx.shadowBlur = 0

      for (let i = 0; i <= numPoints; i++) {
        const x = i * step
        const relativeX = (x + offset) % (pulseWidth * 4)
        const phase = (relativeX / pulseWidth) * 4
        const y = getHeartbeatY(phase, height, baseline)

        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      animationRef.current = requestAnimationFrame(draw)
    }

    animationRef.current = requestAnimationFrame(draw)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isHovered])

  const sizes = {
    small: { titleSize: '1rem', subtitleSize: '0.45rem', canvasHeight: '12px' },
    medium: { titleSize: '1.2rem', subtitleSize: '0.5rem', canvasHeight: '14px' },
    large: { titleSize: '1.6rem', subtitleSize: '0.6rem', canvasHeight: '18px' },
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