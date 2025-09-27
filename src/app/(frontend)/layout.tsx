import './styles.css'
import './polyfills'
import { SessionProviderWrapper } from '@/components/providers/SessionProviderWrapper'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  )
}
