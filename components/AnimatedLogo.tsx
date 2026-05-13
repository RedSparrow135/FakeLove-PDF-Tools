'use client'

import { useState, useEffect, useRef } from 'react'
import styles from './AnimatedLogo.module.scss'

interface AnimatedLogoProps {
  size?: 'small' | 'medium' | 'large'
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
    
    if (rect.width === 0 || rect.height === 0) {
      return
    }

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const width = rect.width
    const height = rect.height
    const baseline = height / 2
    const amplitude = height * 0.38

    ctx.clearRect(0, 0, width, height)

    const points: [number, number][] = []
    const samples = 100

    for (let i = 0; i < samples; i++) {
      const t = (i / samples) * Math.PI * 6
      const yVal = cardiogramY(t)
      const xPos = (i / samples) * width
      const yPos = baseline - yVal * amplitude
      points.push([xPos, yPos])
    }

    const glowSize = isHovered ? 8 : 5

    ctx.beginPath()
    ctx.strokeStyle = '#ff0000'
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.shadowBlur = glowSize
    ctx.shadowColor = '#ff0000'
    ctx.moveTo(points[0][0], points[0][1])
    for (let j = 1; j < points.length; j++) {
      ctx.lineTo(points[j][0], points[j][1])
    }
    ctx.stroke()

    ctx.beginPath()
    ctx.strokeStyle = '#ff3333'
    ctx.lineWidth = 1.8
    ctx.shadowBlur = glowSize * 0.6
    ctx.shadowColor = '#ff0000'
    ctx.moveTo(points[0][0], points[0][1])
    for (let j = 1; j < points.length; j++) {
      ctx.lineTo(points[j][0], points[j][1])
    }
    ctx.stroke()

    ctx.beginPath()
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 0.8
    ctx.shadowBlur = 0
    ctx.moveTo(points[0][0], points[0][1])
    for (let j = 1; j < points.length; j++) {
      ctx.lineTo(points[j][0], points[j][1])
    }
    ctx.stroke()

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