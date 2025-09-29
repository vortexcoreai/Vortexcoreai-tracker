import { ReactNode } from 'react'
import './styles.css'
import { SessionProviderWrapper } from '@/components/providers/SessionProviderWrapper'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  )
}
