'use client'

import { useLanguage } from '@/lib/language'
import styles from './LanguageSwitcher.module.scss'

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()

  return (
    <div className={styles.switcher}>
      <button
        className={`${styles.btn} ${lang === 'es' ? styles.active : ''}`}
        onClick={() => setLang('es')}
      >
        🇪🇸 ES
      </button>
      <button
        className={`${styles.btn} ${lang === 'en' ? styles.active : ''}`}
        onClick={() => setLang('en')}
      >
        🇬🇧 EN
      </button>
    </div>
  )
}