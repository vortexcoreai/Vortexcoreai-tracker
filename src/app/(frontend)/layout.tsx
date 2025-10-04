'use client'
import './styles.css'
import { ReactNode, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProviderWrapper } from '@/components/providers/SessionProviderWrapper'
import { ThemeProvider } from '@/components/themeProvider'

export default function RootLayout({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <SessionProviderWrapper>
            {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange> */}
            <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
              {children}
            </ThemeProvider>
          </SessionProviderWrapper>
        </QueryClientProvider>
      </body>
    </html>
  )
}
