'use client'

import { useEffect, useState, useCallback } from 'react'
import styles from './BitFireworks.module.scss'

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  char: string
  alpha: number
  color: string
  life: number
}

interface Firework {
  id: number
  particles: Particle[]
}

const BINARY_CHARS = ['0', '1']
const COLORS = ['#ff0080', '#00ffff', '#ffff00', '#ff00ff', '#00ff00']

const EASTER_EGGS = [
  { text: 'FAKE LOVE', binary: '01000110 01000001 01001011 01000101 00100000 01001100 01001111 01010110 01000101' },
  { text: 'PDF MASTER', binary: '01010000 01000100 01000110 00100000 01001101 01000001 01010011 01010100 01000101 01010010' },
  { text: 'NICE WORK', binary: '01001110 01001001 01000011 01000101 00100000 01010111 01001111 01010010 01001011' },
  { text: 'BINARY LOVE', binary: '01000010 01001001 01001110 01000001 01010010 01011001 00100000 01001100 01001111 01010110 01000101' },
  { text: 'LOL PDF', binary: '01001100 01001111 01001100 00100000 01010000 01000100 01000110' },
  { text: 'SUCCESS', binary: '01010011 01010101 01000011 01000011 01000101 01010011 01010011' },
  { text: 'HELLO WORLD', binary: '01001000 01000101 01001100 01001100 01001111 00100000 01010111 01001111 01010010 01001100 01000100' },
]

function textToBinary(text: string): string {
  return text.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ')
}

function getRandomEasterEgg(): string {
  const egg = EASTER_EGGS[Math.floor(Math.random() * EASTER_EGGS.length)]
  return egg.binary
}

function getEasterEggChars(count: number): string[] {
  const fullBinary = getRandomEasterEgg()
  const chars: string[] = []
  for (let i = 0; i < count; i++) {
    chars.push(fullBinary[i % fullBinary.length] || '0')
  }
  return chars
}

export default function BitFireworks({ active, onComplete }: { active: boolean; onComplete?: () => void }) {
  const [fireworks, setFireworks] = useState<Firework[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const createFirework = useCallback((startX: number, startY: number) => {
    const id = Date.now() + Math.random()
    const particleCount = 25 + Math.floor(Math.random() * 15)
    const color = COLORS[Math.floor(Math.random() * COLORS.length)]
    const binaryChars = getEasterEggChars(particleCount)
    const particles: Particle[] = []

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.3
      const speed = 1.5 + Math.random() * 3
      particles.push({
        id: Math.random(),
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 6 + Math.random() * 6,
        char: binaryChars[i],
        alpha: 1,
        color,
        life: 40 + Math.random() * 20,
      })
    }

    setFireworks(prev => [...prev, { id, particles }])
  }, [])

  useEffect(() => {
    if (fireworks.length === 0) return

    let frameId: number
    let lastTime = performance.now()

    const animate = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 16.67
      lastTime = currentTime

      setFireworks(prev => {
        const updated = prev.map(fw => ({
          ...fw,
          particles: fw.particles
            .map(p => ({
              ...p,
              x: p.x + p.vx * delta,
              y: p.y + p.vy * delta,
              vy: p.vy + 0.06 * delta,
              vx: p.vx * 0.98,
              alpha: p.alpha - 0.025 * delta,
              life: p.life - 1 * delta,
              size: p.size * 0.98,
            }))
            .filter(p => p.life > 0 && p.alpha > 0)
        })).filter(fw => fw.particles.length > 0)
        return updated
      })

      frameId = requestAnimationFrame(animate)
    }

    frameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameId)
  }, [fireworks.length])

  useEffect(() => {
    if (!mounted || !active) return

    let fireworkCount = 0
    const maxFireworks = 5
    
    const fireworkInterval = setInterval(() => {
      if (fireworkCount >= maxFireworks) {
        clearInterval(fireworkInterval)
        return
      }
      
      const x = 20 + Math.random() * 60
      const y = 20 + Math.random() * 40
      createFirework(x, y)
      fireworkCount++
    }, 150)

    setTimeout(() => {
      if (onComplete) onComplete()
    }, maxFireworks * 150 + 600)

    return () => clearInterval(fireworkInterval)
  }, [active, mounted, createFirework, onComplete])

  if (!mounted || !active) return null

  return (
    <div className={styles.container}>
      {fireworks.map(fw => (
        <div key={fw.id} className={styles.firework}>
          {fw.particles.map(p => (
            <span
              key={p.id}
              className={styles.particle}
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                fontSize: `${p.size}px`,
                color: p.color,
                opacity: p.alpha,
              }}
            >
              {p.char}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

export function BitConfetti({ count = 30 }: { count?: number }) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!mounted) return
    
    const binaryChars = getEasterEggChars(count)
    const newParticles: Particle[] = []
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: Math.random(),
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        vx: (Math.random() - 0.5) * 2,
        vy: 1.5 + Math.random() * 3,
        size: 8 + Math.random() * 6,
        char: binaryChars[i],
        alpha: 1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: 100 + Math.random() * 50,
      })
    }
    setParticles(newParticles)
  }, [mounted, count])

  useEffect(() => {
    if (particles.length === 0) return

    let frameId: number
    const animate = () => {
      setParticles(prev => prev.map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        vy: p.vy + 0.03,
        alpha: p.alpha - 0.003,
        life: p.life - 1,
      })).filter(p => p.life > 0 && p.alpha > 0 && p.y < 110))
      
      if (particles.length > 0) {
        frameId = requestAnimationFrame(animate)
      }
    }
    frameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameId)
  }, [particles.length])

  if (!mounted) return null

  return (
    <div className={styles.confetti}>
      {particles.map(p => (
        <span
          key={p.id}
          className={styles.confettiParticle}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}px`,
            color: p.color,
            opacity: p.alpha,
          }}
        >
          {p.char}
        </span>
      ))}
    </div>
  )
}