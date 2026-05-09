'use client'

import styles from './HeartbeatTitle.module.scss'

interface HeartbeatTitleProps {
  children: string
}

export default function HeartbeatTitle({ children }: HeartbeatTitleProps) {
  return (
    <h1 className={styles.heartbeatTitle} data-text={children}>
      {children}
      <span className={styles.ecgLine}>
        <span className={styles.pulse}></span>
        <span className={styles.pulse}></span>
        <span className={styles.pulse}></span>
        <span className={styles.pulse}></span>
        <span className={styles.pulse}></span>
        <span className={styles.pulse}></span>
      </span>
    </h1>
  )
}