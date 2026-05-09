'use client'

import { useState, useRef, ReactNode } from 'react'
import styles from './TrollButton.module.scss'

interface TrollButtonProps {
  children: ReactNode
  onClick?: () => void
  isEvil?: boolean
  humorText?: string
  disabled?: boolean
}

export default function TrollButton({
  children,
  onClick,
  isEvil = false,
  humorText = 'Nice try...',
  disabled = false,
}: TrollButtonProps) {
  const [isMoving, setIsMoving] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [showHint, setShowHint] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleMouseEnter = () => {
    if (isEvil && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const newX = (Math.random() - 0.5) * 100
      const newY = (Math.random() - 0.5) * 50
      setPosition({ x: newX, y: newY })
      setIsMoving(true)
      setShowHint(true)
    }
  }

  const handleClick = () => {
    if (!isEvil && onClick) {
      onClick()
    }
  }

  return (
    <button
      ref={buttonRef}
      className={`${styles.button} ${isEvil ? styles.evil : ''} ${isMoving ? styles.moving : ''}`}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      disabled={disabled}
      style={{
        transform: isMoving ? `translate(${position.x}px, ${position.y}px)` : undefined,
        opacity: disabled ? 0.5 : undefined,
        cursor: disabled ? 'not-allowed' : isEvil ? 'pointer' : undefined,
      }}
    >
      {children}
      {showHint && isEvil && (
        <span className={styles.hint}>{humorText}</span>
      )}
    </button>
  )
}