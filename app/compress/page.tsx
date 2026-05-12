'use client'

import Link from 'next/link'
import styles from './page.module.scss'

export default function CompressPage() {
  return (
    <main className={styles.page}>
      <div className={styles.background}>
        <div className={styles.gridLines} />
        <div className={styles.glowOrb} />
      </div>

      <div className={styles.content}>
        <Link href="/" className={styles.backLink}>← Back</Link>
        
        <div className={styles.comingSoon}>
          <div className={styles.badge}>PRÓXIMAMENTE</div>
          <h1 className={styles.title}>Compress PDF</h1>
          <p className={styles.subtitle}>Reduce file size without losing quality</p>

          <div className={styles.placeholder}>
            <div className={styles.placeholderIcon}>
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <h2>Compresión de PDF</h2>
            <p>Requiere Ghostscript en servidor. No disponible en Vercel.</p>
          </div>

          <div className={styles.trialBanner}>
            <span className={styles.trialBadge}>TRIAL</span>
            <p><strong>Compresión profesional</strong> con servidor propio:</p>
            <a href="https://github.com/RedSparrow135/FakeLove-PDF-Tools" target="_blank" rel="noopener noreferrer" className={styles.repoButton}>
              <svg viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}