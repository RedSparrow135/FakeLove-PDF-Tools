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
            <p><strong>Compresión profesional</strong> con servidor propio: <a href="https://github.com/RedSparrow135/FakeLove-PDF-Tools" target="_blank" rel="noopener noreferrer" className={styles.repoButton}>GitHub</a></p>
          </div>
        </div>
      </div>
    </main>
  )
}
