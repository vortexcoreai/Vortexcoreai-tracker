import './styles.css'
import { SessionProviderWrapper } from '@/components/providers/SessionProviderWrapper'

export const metadata = {
  description: 'Vortex core ai',
  title: 'VortexTracker',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  )
}
