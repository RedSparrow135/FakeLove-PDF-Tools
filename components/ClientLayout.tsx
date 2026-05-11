'use client'

import { LanguageProvider } from '@/lib/language'
import { ProcessProvider } from '@/lib/processContext'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LanguageProvider>
      <ProcessProvider>
        {children}
      </ProcessProvider>
    </LanguageProvider>
  )
}