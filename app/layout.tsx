import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const archivo = localFont({
  src: [
    { path: '../public/fonts/archivo-900-latin.woff2', weight: '400 900', style: 'normal' },
  ],
  variable: '--font-archivo',
  display: 'swap',
})

const archivoBlack = localFont({
  src: [
    { path: '../public/fonts/archivo-black-400-latin.woff2', weight: '400', style: 'normal' },
  ],
  variable: '--font-archivo-black',
  display: 'swap',
})

const jetbrainsMono = localFont({
  src: [
    { path: '../public/fonts/jetbrains-mono-600-latin.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'WC26 HUB — Stats, analyses & paris communautaires',
  description: 'Stats, analyses et paris communautaires pour la Coupe du Monde 2026',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${archivo.variable} ${archivoBlack.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
