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
    const cycleLength = 100

    function draw() {
      if (!ctx) return

      const speed = isHovered ? 1.5 : 1

      const tCycle = (time % cycleLength) / cycleLength * 100
      const yVal = getY(tCycle)
      const newY = baseline + (yVal * amplitude / 30)

      const glowSize = isHovered ? 25 : 18

      ctx.beginPath()
      ctx.strokeStyle = '#ff0000'
      ctx.lineWidth = 4.5
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.shadowBlur = glowSize
      ctx.shadowColor = '#ff0000'
      ctx.moveTo(x === 0 ? 0 : x - speed, baseline)
      ctx.lineTo(x + speed, newY)
      ctx.stroke()

      ctx.beginPath()
      ctx.strokeStyle = '#ff3333'
      ctx.lineWidth = 3.5
      ctx.shadowBlur = glowSize * 0.7
      ctx.shadowColor = '#ff0000'
      ctx.moveTo(x === 0 ? 0 : x - speed, baseline)
      ctx.lineTo(x + speed, newY)
      ctx.stroke()

      ctx.beginPath()
      ctx.strokeStyle = '#ff6666'
      ctx.lineWidth = 2.5
      ctx.shadowBlur = glowSize * 0.4
      ctx.shadowColor = '#ff0000'
      ctx.moveTo(x === 0 ? 0 : x - speed, baseline)
      ctx.lineTo(x + speed, newY)
      ctx.stroke()

      ctx.beginPath()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 1.5
      ctx.shadowBlur = 0
      ctx.moveTo(x === 0 ? 0 : x - speed, baseline)
      ctx.lineTo(x + speed, newY)
      ctx.stroke()

      x += speed
      time += speed

      if (x > width) {
        ctx.clearRect(0, 0, 10, height)
        x = 0
      }

      if (x >= width - 10) {
        ctx.clearRect(width - 15, 0, 20, height)
        x = width - 15
      }

      requestAnimationFrame(draw)
    }

    ctx.fillStyle = 'transparent'
    ctx.clearRect(0, 0, width, height)

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