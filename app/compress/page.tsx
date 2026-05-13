'use client'

import Link from 'next/link'
import styles from './page.module.scss'
import { useLanguage } from '@/lib/language'

export default function CompressPage() {
  const { t } = useLanguage()

  return (
    <main className={styles.page}>
      <div className={styles.background}>
        <div className={styles.gridLines} />
        <div className={styles.glowOrb} />
      </div>

      <div className={styles.content}>
        <Link href="/" className={styles.backLink}>{t('common.back')}</Link>
        
        <div className={styles.comingSoon}>
          <div className={styles.trialBanner}>
            <span className={styles.trialBadge}>{t('trial.label')}</span>
          </div>
          <h1 className={styles.title}>{t('compress.title')}</h1>
          <p className={styles.subtitle}>{t('compress.subtitle')}</p>
        </div>
      </div>
    </main>
  )
}