'use client'

import DeveloperSignature from '@/components/DeveloperSignature'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <DeveloperSignature />
    </>
  )
}