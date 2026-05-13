'use client'

import { useState, useEffect, useRef } from 'react'
import styles from './AnimatedLogo.module.scss'

interface AnimatedLogoProps {
  size?: 'small' | 'medium' | 'large'
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

    const draw = () => {
      if (!ctx) return

      ctx.clearRect(0, 0, width, height)

      const speed = isHovered ? 2 : 1
      offset += speed

      const glowSize = isHovered ? 8 : 5

      ctx.beginPath()
      ctx.strokeStyle = '#ff0000'
      ctx.lineWidth = 2.5
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.shadowBlur = glowSize
      ctx.shadowColor = '#ff0000'

      const segments = 12
      const segmentWidth = width / segments

      for (let i = 0; i <= segments; i++) {
        let y = baseline
        const x = i * segmentWidth - (offset % segmentWidth)
        
        const phase = ((i + offset / segmentWidth) % 4)
        
        if (phase < 1) y = baseline
        else if (phase < 1.5) y = baseline - (phase - 1) * height * 0.4
        else if (phase < 2) y = baseline - (2 - phase) * height * 0.4
        else if (phase < 2.5) y = baseline + (phase - 2) * height * 0.15
        else if (phase < 3) y = baseline + (3 - phase) * height * 0.15
        else y = baseline

        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      ctx.beginPath()
      ctx.strokeStyle = '#ff3333'
      ctx.lineWidth = 1.8
      ctx.shadowBlur = glowSize * 0.6
      ctx.shadowColor = '#ff0000'

      for (let i = 0; i <= segments; i++) {
        let y = baseline
        const x = i * segmentWidth - (offset % segmentWidth)
        
        const phase = ((i + offset / segmentWidth) % 4)
        
        if (phase < 1) y = baseline
        else if (phase < 1.5) y = baseline - (phase - 1) * height * 0.4
        else if (phase < 2) y = baseline - (2 - phase) * height * 0.4
        else if (phase < 2.5) y = baseline + (phase - 2) * height * 0.15
        else if (phase < 3) y = baseline + (3 - phase) * height * 0.15
        else y = baseline

        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      ctx.beginPath()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 0.8
      ctx.shadowBlur = 0

      for (let i = 0; i <= segments; i++) {
        let y = baseline
        const x = i * segmentWidth - (offset % segmentWidth)
        
        const phase = ((i + offset / segmentWidth) % 4)
        
        if (phase < 1) y = baseline
        else if (phase < 1.5) y = baseline - (phase - 1) * height * 0.4
        else if (phase < 2) y = baseline - (2 - phase) * height * 0.4
        else if (phase < 2.5) y = baseline + (phase - 2) * height * 0.15
        else if (phase < 3) y = baseline + (3 - phase) * height * 0.15
        else y = baseline

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