'use client'

import { useEffect, useRef } from 'react'
import styles from './EcgTitle.module.scss'

interface EcgTitleProps {
  children: string
}

export default function EcgTitle({ children }: EcgTitleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let offset = 0
    
    const drawECG = () => {
      const width = canvas.width
      const height = canvas.height
      const centerY = height / 2
      
      ctx.clearRect(0, 0, width, height)
      
      // Background grid
      ctx.strokeStyle = 'rgba(255, 45, 85, 0.1)'
      ctx.lineWidth = 0.5
      for (let y = 0; y < height; y += 10) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }
      
      // ECG line with glow
      ctx.shadowColor = '#ff2d55'
      ctx.shadowBlur = 15
      ctx.strokeStyle = '#ff2d55'
      ctx.lineWidth = 2.5
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      
      const speed = 2
      offset = (offset + speed) % (width + 40)
      
      ctx.beginPath()
      
      const points = [
        { x: 0, y: centerY },
        { x: 20, y: centerY },
        { x: 25, y: centerY },
        { x: 30, y: centerY - 15 },
        { x: 35, y: centerY + 15 },
        { x: 40, y: centerY - 10 },
        { x: 45, y: centerY },
        { x: 65, y: centerY },
        { x: 70, y: centerY },
        { x: 75, y: centerY + 15 },
        { x: 80, y: centerY - 15 },
        { x: 85, y: centerY },
        { x: 90, y: centerY },
        { x: 110, y: centerY },
        { x: 115, y: centerY },
        { x: 120, y: centerY - 20 },
        { x: 125, y: centerY + 20 },
        { x: 130, y: centerY - 5 },
        { x: 135, y: centerY },
        { x: 160, y: centerY },
      ]
      
      for (let i = 0; i < points.length; i++) {
        const px = (points[i].x - offset + width + 20) % (width + 20) - 10
        const py = points[i].y
        
        if (i === 0) {
          ctx.moveTo(px, py)
        } else {
          // Smooth curve between points
          const prev = points[i - 1]
          const prevX = (prev.x - offset + width + 20) % (width + 20) - 10
          const cpX = (prevX + px) / 2
          ctx.quadraticCurveTo(cpX, prev.y, px, py)
        }
      }
      
      ctx.stroke()
      
      // Reset glow for next frame
      ctx.shadowBlur = 0
      
      // Moving dot
      const dotX = (10 + (offset * 0.1)) % (width + 20) - 10
      const dotY = centerY
      
      ctx.beginPath()
      ctx.arc(dotX, dotY, 5, 0, Math.PI * 2)
      ctx.fillStyle = '#ff2d55'
      ctx.shadowColor = '#ff2d55'
      ctx.shadowBlur = 20
      ctx.fill()
      
      animationRef.current = requestAnimationFrame(drawECG)
    }

    drawECG()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {children}
      </h1>
      <canvas 
        ref={canvasRef} 
        className={styles.ecgCanvas}
        width={600}
        height={60}
      />
      <div className={styles.ecgLine} />
    </div>
  )
}