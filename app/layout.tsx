import ClientLayout from '@/components/ClientLayout'
import './globals.scss'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FakeLove PDF Tools - We Pretend to Love Your PDFs',
  description: 'No limits. No feelings. Just processing.',
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}