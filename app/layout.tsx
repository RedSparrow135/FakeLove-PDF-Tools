import ClientLayout from '@/components/ClientLayout'
import { LanguageProvider } from '@/lib/language'
import { ProcessProvider } from '@/lib/processContext'
import './globals.scss'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fake Love - We Pretend to Love Your PDFs',
  description: 'No limits. No feelings. Just processing.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <ProcessProvider>
            <ClientLayout>{children}</ClientLayout>
          </ProcessProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}