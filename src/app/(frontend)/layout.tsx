'use client'
import './styles.css'
import { ReactNode, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProviderWrapper } from '@/components/providers/SessionProviderWrapper'

export default function RootLayout({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <SessionProviderWrapper>{children}</SessionProviderWrapper>
        </QueryClientProvider>
      </body>
    </html>
  )
}
