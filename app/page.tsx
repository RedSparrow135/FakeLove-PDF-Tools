'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  FilePlus,
  LayoutDashboard,
  FileSearch,
  RefreshCw,
  History,
  Settings,
  HardDrive,
  Cpu,
  Search,
  Globe,
  Bell,
  ChevronRight,
  X,
  Check,
  Clock,
  AlertCircle,
  Download,
  Trash2,
  ArrowRight,
  GitMerge,
  Scissors,
  Archive,
  Image,
  FileText,
  Table,
  Presentation,
  Monitor,
} from 'lucide-react'
import { useProcesses, operationLabels } from '@/lib/processContext'
import { useLanguage } from '@/lib/language'
import FileUploader from '@/components/FileUploader'
import styles from './page.module.scss'

type Category = 'dashboard' | 'pdf-tools' | 'convert' | 'history' | 'settings'

const operations = {
  'pdf-tools': [
    { key: 'merge', icon: GitMerge, title: 'MERGE', desc: 'Combine multiple documents', href: '/merge', color: '#dc2626', tag: 'PDF' },
    { key: 'split', icon: Scissors, title: 'SPLIT', desc: 'Extract specific pages', href: '/split', color: '#f43f5e', tag: 'PDF' },
    { key: 'compress', icon: Archive, title: 'COMPRESS', desc: 'Reduce file size', href: '/compress', color: '#a855f7', tag: 'OPT' },
    { key: 'imagetopdf', icon: Image, title: 'IMAGE PDF', desc: 'Convert images to PDF', href: '/imagetopdf', color: '#ec4899', tag: 'IMG' },
  ],
  convert: [
    { key: 'word', icon: FileText, title: 'WORD PDF', desc: 'DOC/DOCX to PDF', href: '/more-tools/word', color: '#3b82f6', tag: 'DOC' },
    { key: 'excel', icon: Table, title: 'EXCEL PDF', desc: 'XLS/XLSX to PDF', href: '/more-tools/excel', color: '#10b981', tag: 'SPR' },
    { key: 'pptx', icon: Presentation, title: 'PPTX PDF', desc: 'PPT/PPTX to PDF', href: '/more-tools/pptx', color: '#f59e0b', tag: 'SLD' },
    { key: 'jpg', icon: Monitor, title: 'JPG PDF', desc: 'JPG/PNG to PDF', href: '/more-tools/jpg', color: '#8b5cf6', tag: 'IMG' },
  ],
}

export default function DashboardPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [showLangMenu, setShowLangMenu] = useState(false)
  const { processes, removeProcess, clearCompleted, getActiveProcesses } = useProcesses()
  const { t, lang, setLang, isSpanish } = useLanguage()
  const [activeProcesses, setActiveProcesses] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    const active = getActiveProcesses()
    setActiveProcesses(active.length)
  }, [processes, getActiveProcesses])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check size={14} className={styles.statusIconCompleted} />
      case 'processing':
        return <Cpu size={14} className={styles.statusIconProcessing} />
      case 'queued':
        return <Clock size={14} className={styles.statusIconQueued} />
      case 'failed':
        return <AlertCircle size={14} className={styles.statusIconFailed} />
      default:
        return null
    }
  }

  const formatSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const formatTime = (timestamp: number): string => {
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return isSpanish ? 'Ahora' : 'Just now'
    if (minutes < 60) return `${minutes}${isSpanish ? 'm' : 'm'}`
    const hours = Math.floor(minutes / 60)
    return `${hours}${isSpanish ? 'h' : 'h'}`
  }

  const activeOps = getActiveProcesses()
  const currentProgress = activeOps.length > 0 ? activeOps[0].progress : 0

  const navItems: { key: Category; icon: any; labelKey: string }[] = [
    { key: 'dashboard', icon: LayoutDashboard, labelKey: 'nav.dashboard' },
    { key: 'pdf-tools', icon: FileSearch, labelKey: 'nav.pdfTools' },
    { key: 'convert', icon: RefreshCw, labelKey: 'nav.convert' },
    { key: 'history', icon: History, labelKey: 'nav.history' },
    { key: 'settings', icon: Settings, labelKey: 'nav.settings' },
  ]

  const recentProcesses = processes.slice(0, 20)

  return (
    <div className={styles.app}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <FilePlus size={20} strokeWidth={1.5} />
            </div>
            <div className={styles.logoText}>
              <span className={styles.logoTitle}>FAKE LOVE</span>
              <span className={styles.logoSubtitle}>PDF SUITE</span>
            </div>
          </div>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`${styles.navItem} ${activeCategory === item.key ? styles.active : ''}`}
              onClick={() => setActiveCategory(item.key)}
            >
              <item.icon size={18} strokeWidth={1.5} />
              <span>{t(item.labelKey)}</span>
              {item.key === 'history' && processes.length > 0 && (
                <span className={styles.badge}>{processes.length}</span>
              )}
              {activeCategory === item.key && <ChevronRight size={14} className={styles.navArrow} />}
            </button>
          ))}
        </nav>

        <div className={styles.systemStatus}>
          <div className={styles.statusHeader}>
            <Cpu size={14} strokeWidth={1.5} />
            <span>{t('system.processing')}</span>
          </div>
          <div className={styles.statusContent}>
            <div className={styles.statusRow}>
              <span>{t('system.activeTasks')}</span>
              <span className={styles.statusValue}>{activeProcesses}</span>
            </div>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${currentProgress}%` }}
              />
            </div>
            {activeOps.length > 0 && (
              <div className={styles.currentTask}>
                <span className={styles.taskName}>
                  {operationLabels[activeOps[0].operation as keyof typeof operationLabels] || activeOps[0].operation}
                </span>
                <span className={styles.taskProgress}>{activeOps[0].progress}%</span>
              </div>
            )}
          </div>
          <div className={styles.storageInfo}>
            <HardDrive size={14} strokeWidth={1.5} />
            <span>{t('system.storage')}: 2.4 / 5 GB</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Navbar */}
        <header className={styles.navbar}>
          <div className={styles.searchWrapper}>
            <Search size={16} strokeWidth={1.5} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search files or operations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.navbarRight}>
            <div className={styles.statusIndicator}>
              <span className={styles.statusDot} />
              <span className={styles.statusText}>System Online</span>
            </div>

            <div className={styles.notificationWrapper}>
              <button 
                className={styles.navbarBtn}
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={18} strokeWidth={1.5} />
                {activeProcesses > 0 && <span className={styles.notificationBadge}>{activeProcesses}</span>}
              </button>
              
              {showNotifications && (
                <div className={styles.notificationDropdown}>
                  <div className={styles.notificationHeader}>
                    <span>{t('notifications.title')}</span>
                    {activeProcesses > 0 && <span className={styles.notifCount}>{activeProcesses} active</span>}
                  </div>
                  <div className={styles.notificationList}>
                    {activeProcesses === 0 ? (
                      <div className={styles.notifEmpty}>{t('notifications.noActive')}</div>
                    ) : (
                      activeOps.slice(0, 5).map((p) => (
                        <div key={p.id} className={styles.notifItem}>
                          <Cpu size={14} className={styles.notifIcon} />
                          <div className={styles.notifContent}>
                            <span className={styles.notifTitle}>{p.operationLabel}</span>
                            <span className={styles.notifProgress}>{p.progress}%</span>
                          </div>
                          <div className={styles.notifProgressBar}>
                            <div className={styles.notifProgressFill} style={{ width: `${p.progress}%` }} />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className={styles.langWrapper}>
              <button 
                className={styles.navbarBtn}
                onClick={() => setShowLangMenu(!showLangMenu)}
              >
                <Globe size={18} strokeWidth={1.5} />
              </button>
              
              {showLangMenu && (
                <div className={styles.langDropdown}>
                  <button 
                    className={`${styles.langOption} ${lang === 'es' ? styles.active : ''}`}
                    onClick={() => { setLang('es'); setShowLangMenu(false); }}
                  >
                    <span className={styles.langFlag}>ES</span>
                    <span>Español</span>
                    {lang === 'es' && <Check size={14} />}
                  </button>
                  <button 
                    className={`${styles.langOption} ${lang === 'en' ? styles.active : ''}`}
                    onClick={() => { setLang('en'); setShowLangMenu(false); }}
                  >
                    <span className={styles.langFlag}>EN</span>
                    <span>English</span>
                    {lang === 'en' && <Check size={14} />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className={styles.content}>
          {/* Dashboard View */}
          {activeCategory === 'dashboard' && (
            <div className={styles.view}>
              <section className={styles.heroSection}>
                <div className={styles.heroContent}>
                  <h1 className={styles.heroTitle}>{t('dashboard.title')}</h1>
                  <p className={styles.heroSubtitle}>{t('dashboard.subtitle')}</p>
                  <div className={styles.heroLine} />
                  <p className={styles.heroDesc}>
                    {t('dashboard.moto')}
                  </p>
                </div>

                <div className={styles.metricsGrid}>
                  <div className={styles.metricCard}>
                    <span className={styles.metricValue}>{processes.length}</span>
                    <span className={styles.metricLabel}>{t('metrics.totalOperations')}</span>
                  </div>
                  <div className={styles.metricCard}>
                    <span className={styles.metricValue}>
                      {processes.filter(p => p.status === 'completed').length}
                    </span>
                    <span className={styles.metricLabel}>{t('metrics.completed')}</span>
                  </div>
                  <div className={styles.metricCard}>
                    <span className={styles.metricValue}>{activeProcesses}</span>
                    <span className={styles.metricLabel}>{t('metrics.processing')}</span>
                  </div>
                  <div className={styles.metricCard}>
                    <span className={styles.metricValue}>
                      {processes.filter(p => p.status === 'completed').length > 0 
                        ? Math.round((processes.filter(p => p.status === 'completed').length / processes.length) * 100)
                        : 0}%
                    </span>
                    <span className={styles.metricLabel}>{t('metrics.successRate')}</span>
                  </div>
                </div>
              </section>

              <section className={styles.quickActions}>
                <h2 className={styles.sectionTitle}>
                  <FileSearch size={16} strokeWidth={1.5} />
                  {t('quickaccess.title')}
                </h2>
                <div className={styles.toolsGrid}>
                  {operations['pdf-tools'].map((tool) => (
                    <Link
                      key={tool.key}
                      href={tool.href}
                      className={styles.toolCard}
                      style={{ '--accent': tool.color } as any}
                    >
                      <div className={styles.toolIcon}>
                        <tool.icon size={28} strokeWidth={1.5} />
                      </div>
                      <h3>{tool.title}</h3>
                      <p>{t(`tool.${tool.key}.desc` as any) || tool.desc}</p>
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* PDF Tools View */}
          {activeCategory === 'pdf-tools' && (
            <div className={styles.view}>
              <div className={styles.categoryHeader}>
                <h1>{t('pdftools.title')}</h1>
                <p>{t('pdftools.subtitle')}</p>
              </div>
              <div className={styles.toolsGrid}>
                {operations['pdf-tools'].map((tool) => (
                  <Link
                    key={tool.key}
                    href={tool.href}
                    className={styles.toolCard}
                    style={{ '--accent': tool.color } as any}
                  >
                    <div className={styles.toolIcon}>
                      <tool.icon size={32} strokeWidth={1.5} />
                    </div>
                    <h3>{tool.title}</h3>
                    <p>{t(`tool.${tool.key}.desc` as any) || tool.desc}</p>
                    <span className={styles.toolTag}>{tool.tag}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Convert View */}
          {activeCategory === 'convert' && (
            <div className={styles.view}>
              <div className={styles.categoryHeader}>
                <h1>{t('convert.title')}</h1>
                <p>{t('convert.subtitle')}</p>
              </div>
              <div className={styles.toolsGrid}>
                {operations.convert.map((tool) => (
                  <Link
                    key={tool.key}
                    href={tool.href}
                    className={styles.toolCard}
                    style={{ '--accent': tool.color } as any}
                  >
                    <div className={styles.toolIcon}>
                      <tool.icon size={32} strokeWidth={1.5} />
                    </div>
                    <h3>{tool.title}</h3>
                    <p>{t(`tool.${tool.key}.desc` as any) || tool.desc}</p>
                    <span className={styles.toolTag}>{tool.tag}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* History View */}
          {activeCategory === 'history' && (
            <div className={styles.view}>
              <div className={styles.historyHeader}>
                <div className={styles.categoryHeader}>
                  <h1>{t('history.title')}</h1>
                  <p>{t('history.subtitle')}</p>
                </div>
                {processes.length > 0 && (
                  <button className={styles.clearBtn} onClick={clearCompleted}>
                    <Trash2 size={14} />
                    {t('history.clear')}
                  </button>
                )}
              </div>

              {processes.length === 0 ? (
                <div className={styles.emptyState}>
                  <History size={48} strokeWidth={1} />
                  <h3>{t('history.empty')}</h3>
                  <p>{t('history.emptyDesc')}</p>
                </div>
              ) : (
                <div className={styles.activityTable}>
                  <div className={styles.tableHeader}>
                    <span>FILE</span>
                    <span>OPERATION</span>
                    <span>STATUS</span>
                    <span>TIME</span>
                    <span>SIZE</span>
                    <span>ACTIONS</span>
                  </div>
                  {recentProcesses.map((item, index) => (
                    <div key={item.id} className={styles.tableRow} style={{ '--index': index } as any}>
                      <span className={styles.fileName}>{item.fileName}</span>
                      <span className={styles.operation}>{item.operationLabel}</span>
                      <span className={`${styles.status} ${styles[item.status]}`}>
                        {getStatusIcon(item.status)}
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                      <span className={styles.time}>{formatTime(item.createdAt)}</span>
                      <span className={styles.size}>{formatSize(item.originalSize)}</span>
                      <div className={styles.actions}>
                        {item.status === 'completed' && item.resultUrl && (
                          <a 
                            href={item.resultUrl} 
                            download={item.resultName || 'result.pdf'}
                            className={styles.actionBtn}
                          >
                            <Download size={14} />
                          </a>
                        )}
                        <button 
                          className={styles.actionBtn}
                          onClick={() => removeProcess(item.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Settings View */}
          {activeCategory === 'settings' && (
            <div className={styles.view}>
              <div className={styles.categoryHeader}>
                <h1>{t('settings.title')}</h1>
                <p>{t('settings.subtitle')}</p>
              </div>
              <div className={styles.settingsGrid}>
                <div className={styles.settingCard}>
                  <h3>{t('settings.language')}</h3>
                  <p>{t('settings.languageDesc')}</p>
                  <div className={styles.settingValue}>
                    <button 
                      className={`${styles.langBtn} ${isSpanish ? styles.active : ''}`}
                      onClick={() => setLang('es')}
                    >
                      ES
                    </button>
                    <button 
                      className={`${styles.langBtn} ${!isSpanish ? styles.active : ''}`}
                      onClick={() => setLang('en')}
                    >
                      EN
                    </button>
                  </div>
                </div>
                <div className={styles.settingCard}>
                  <h3>{t('settings.theme')}</h3>
                  <p>{t('settings.themeDesc')}</p>
                  <div className={styles.settingValue}>Clinical Dark</div>
                </div>
                <div className={styles.settingCard}>
                  <h3>{t('settings.quality')}</h3>
                  <p>{t('settings.qualityDesc')}</p>
                  <div className={styles.settingValue}>Medium</div>
                </div>
              </div>
            </div>
          )}
        </div>

<footer className={styles.footer}>
          <div className={styles.footerBrandSection}>
            <span className={styles.footerBrand}>Fake Love</span>
            <span className={styles.footerSubtitle}>PDF Tools</span>
          </div>
          <span className={styles.footerDivider}>|</span>
          
          <div className={styles.footerBinary}>
            <span>01000110 01000001 01001011</span>
            <span>01000101 00100000 01001100</span>
          </div>
          
          <span className={styles.footerDivider}>|</span>
          
          <div className={styles.footerDev}>
            <img src="/heart.png" alt="heart" className={styles.footerHeart} />
            <div className={styles.footerDevText}>
              <span className={styles.footerDevName}>CHARLE-X</span>
              <span className={styles.footerDevTagline}>Hecho con odio</span>
            </div>
          </div>
        </footer>
      </main>

      {/* File Uploader FAB */}
      <FileUploader />
    </div>
  )
}