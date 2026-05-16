'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Accueil' },
  { href: '/matchs', label: 'Matchs' },
  { href: '/stats', label: 'Stats' },
  { href: '/paris', label: 'Paris' },
  { href: '/classement', label: 'Classement' },
  { href: '/profil', label: 'Profil' },
]

export default function Navbar() {
  const pathname = usePathname()
  return (
    <nav style={{ background: '#0A0A0A', borderBottom: '1px solid #222' }} className="sticky top-0 z-50">
      <div style={{ maxWidth: 1152, margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <span style={{ background: '#C8FF00', color: '#0A0A0A', fontWeight: 900, fontSize: 12, padding: '3px 10px', borderRadius: 20 }}>
            ★ LIVE
          </span>
          <span style={{ fontWeight: 900, fontSize: 18, letterSpacing: -1, color: '#fff' }}>
            WC26 <span style={{ color: '#C8FF00' }}>HUB</span>
          </span>
        </Link>
        <div style={{ display: 'flex', gap: 4 }}>
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                color: pathname === link.href ? '#C8FF00' : '#888',
                fontWeight: pathname === link.href ? 700 : 400,
                fontSize: 14,
                padding: '6px 12px',
                borderRadius: 8,
                background: pathname === link.href ? 'rgba(200,255,0,0.08)' : 'transparent',
                textDecoration: 'none',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
