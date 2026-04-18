import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()

  const links = [
    { to: '/',        label: 'Home'    },
    { to: '/predict', label: 'Predict' },
    { to: '/market',  label: 'Market'  },
    { to: '/compare', label: 'Compare' },
  ]

  return (
    <nav style={{
      background: 'rgba(13,15,20,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(201,168,76,0.15)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto', padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64
      }}>

        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #C9A84C, #E8C96A)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 700, color: '#0D0F14'
          }}>G</div>
          <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700 }}
            className="gold-text">GharMol</span>
        </Link>

        <div style={{ display: 'flex', gap: 4 }}>
          {links.map(l => (
            <Link key={l.to} to={l.to} style={{
              textDecoration: 'none',
              padding: '6px 16px', borderRadius: 8,
              fontSize: 14, fontWeight: 500, transition: 'all 0.2s',
              background : pathname === l.to ? 'rgba(201,168,76,0.12)' : 'transparent',
              color      : pathname === l.to ? '#C9A84C' : '#8B8FA8',
              border     : pathname === l.to ? '1px solid rgba(201,168,76,0.3)' : '1px solid transparent',
            }}>
              {l.label}
            </Link>
          ))}
        </div>

        <Link to="/predict" style={{ textDecoration: 'none' }}>
          <button className="btn-gold" style={{ padding: '8px 20px', borderRadius: 10, fontSize: 14 }}>
            Check Price →
          </button>
        </Link>
      </div>
    </nav>
  )
}
