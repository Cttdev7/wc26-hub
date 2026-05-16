import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/ui/navbar'

export const metadata: Metadata = {
  title: 'WC26 HUB — Stats, analyses & paris communautaires',
  description: 'Stats, analyses et paris communautaires pour la Coupe du Monde 2026',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ background: '#0A0A0A', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ maxWidth: 1152, margin: '0 auto', padding: '40px 16px' }}>
          {children}
        </main>
      </body>
    </html>
  )
}
