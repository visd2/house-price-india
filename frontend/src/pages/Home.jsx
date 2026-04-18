import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

const steps = [
  { n: '01', title: 'Enter Property Details', desc: 'Location, area, BHK — takes just 30 seconds' },
  { n: '02', title: 'AI Analyses the Market', desc: 'XGBoost model compares against 78,000+ real listings across 6 cities' },
  { n: '03', title: 'Get the Fair Price', desc: 'Receive a price range + verdict — if overpriced, negotiate confidently' },
]

const features = [
  { icon: '◎', title: 'Instant Prediction',   desc: 'Get results in under 1 second — no waiting, no signup' },
  { icon: '⊞', title: 'Compare Properties',   desc: 'Compare two homes side-by-side, even across cities' },
  { icon: '◈', title: 'Market Insights',       desc: 'Live price trends across Bangalore, Mumbai, Delhi and more' },
  { icon: '◉', title: 'Fair Value Verdict',    desc: 'Clear Underpriced / Fair / Overpriced badge on every result' },
  { icon: '⬡', title: 'Amenity Pricing',       desc: 'Gym, pool, parking — see how amenities affect the price' },
  { icon: '◷', title: '6 Major Cities',        desc: 'Bangalore · Mumbai · Delhi · Hyderabad · Chennai · Kolkata' },
]

const cities = [
  { name: 'Bangalore', avg: '₹85L', tag: 'IT Hub' },
  { name: 'Mumbai',    avg: '₹180L', tag: 'Financial Capital' },
  { name: 'Delhi',     avg: '₹120L', tag: 'NCR Region' },
  { name: 'Hyderabad', avg: '₹75L',  tag: 'Cyberabad' },
  { name: 'Chennai',   avg: '₹70L',  tag: 'South India' },
  { name: 'Kolkata',   avg: '₹55L',  tag: 'East India' },
]

export default function Home() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    axios.get(`${API}/insights/stats`)
      .then(r => setStats(r.data))
      .catch(() => {})
  }, [])

  return (
    <div className="grid-bg" style={{ minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px 60px', textAlign: 'center' }}>

        <div className="fade-up" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)',
          borderRadius: 20, padding: '6px 16px', marginBottom: 32,
          fontSize: 13, color: 'var(--gold)'
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ADE80',
            display: 'inline-block', animation: 'pulse-gold 2s infinite' }} />
          AI-Powered · 6 Indian Cities · 2025 Market Data
        </div>

        <h1 className="fade-up-1 font-display" style={{
          fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 700,
          lineHeight: 1.1, margin: '0 0 24px',
        }}>
          Know the fair price of a<br />
          <span className="gold-text">home before you buy</span>
        </h1>

        <p className="fade-up-2" style={{
          fontSize: 18, color: 'var(--muted)', maxWidth: 540,
          margin: '0 auto 40px', lineHeight: 1.7
        }}>
          Stop overpaying for real estate. Use AI to instantly check if a property is fairly priced — across India's top 6 cities.
        </p>

        <div className="fade-up-3" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/predict" style={{ textDecoration: 'none' }}>
            <button className="btn-gold" style={{ padding: '14px 32px', borderRadius: 12, fontSize: 16 }}>
              Check Price Now — Free →
            </button>
          </Link>
          <Link to="/market" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '14px 32px', borderRadius: 12, fontSize: 16,
              background: 'transparent', border: '1px solid rgba(201,168,76,0.3)',
              color: 'var(--gold)', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
              transition: 'all 0.2s'
            }}
              onMouseEnter={e => e.target.style.background = 'rgba(201,168,76,0.08)'}
              onMouseLeave={e => e.target.style.background = 'transparent'}>
              View Market Trends
            </button>
          </Link>
        </div>

        {/* Stats */}
        {stats && (
          <div className="fade-up-4" style={{
            display: 'flex', justifyContent: 'center',
            marginTop: 64, flexWrap: 'wrap',
            border: '1px solid rgba(201,168,76,0.1)',
            borderRadius: 16, overflow: 'hidden',
            background: 'var(--dark2)', maxWidth: 700, margin: '64px auto 0'
          }}>
            {[
              { label: 'Listings Analysed', value: '78,000+' },
              { label: 'Cities Covered',    value: '6'       },
              { label: 'Avg Accuracy',      value: '82%+'    },
              { label: 'Price Range',       value: '₹20L–₹800L' },
            ].map((s, i) => (
              <div key={s.label} style={{
                padding: '24px 32px', textAlign: 'center', flex: 1, minWidth: 140,
                borderRight: i < 3 ? '1px solid rgba(201,168,76,0.1)' : 'none',
              }}>
                <p style={{ fontSize: 26, fontWeight: 700, margin: '0 0 4px',
                  fontFamily: 'Playfair Display, serif' }} className="gold-text">
                  {s.value}
                </p>
                <p style={{ fontSize: 11, color: 'var(--muted)', margin: 0,
                  textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── How it works ── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px' }}>
        <p style={{ textAlign: 'center', color: 'var(--gold)', fontSize: 12,
          textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>How it works</p>
        <h2 className="font-display" style={{ fontSize: 36, textAlign: 'center', marginBottom: 8 }}>
          Three steps to the right price
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: 48 }}>
          No guesswork — just data-driven decisions
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {steps.map((s, i) => (
            <div key={i} className="card card-hover" style={{ padding: 28 }}>
              <div style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 600,
                letterSpacing: '0.1em', marginBottom: 16,
                fontFamily: 'Playfair Display, serif' }}>{s.n}</div>
              <h3 style={{ fontSize: 20, fontWeight: 600, margin: '0 0 10px' }}>{s.title}</h3>
              <p style={{ color: 'var(--muted)', margin: 0, lineHeight: 1.6, fontSize: 14 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Cities ── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 24px 60px' }}>
        <p style={{ textAlign: 'center', color: 'var(--gold)', fontSize: 12,
          textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>Coverage</p>
        <h2 className="font-display" style={{ fontSize: 36, textAlign: 'center', marginBottom: 8 }}>
          Cities we cover
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: 40 }}>
          Average property prices based on 2025 market data
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
          {cities.map((c, i) => (
            <Link key={i} to="/predict" style={{ textDecoration: 'none' }}>
              <div className="card card-hover" style={{ padding: '20px 16px', textAlign: 'center', cursor: 'pointer' }}>
                <p style={{ fontSize: 22, fontWeight: 700, margin: '0 0 4px',
                  fontFamily: 'Playfair Display, serif', color: 'var(--gold)' }}>{c.avg}</p>
                <p style={{ fontSize: 15, fontWeight: 600, margin: '0 0 4px' }}>{c.name}</p>
                <p style={{ fontSize: 11, color: 'var(--muted)', margin: 0 }}>{c.tag}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 24px 80px' }}>
        <p style={{ textAlign: 'center', color: 'var(--gold)', fontSize: 12,
          textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>Features</p>
        <h2 className="font-display" style={{ fontSize: 36, textAlign: 'center', marginBottom: 8 }}>
          Everything you need
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: 48 }}>
          Built for buyers, sellers, and real estate professionals
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {features.map((f, i) => (
            <div key={i} className="card card-hover" style={{ padding: 24 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'var(--gold-dim)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 20, color: 'var(--gold)', marginBottom: 16
              }}>{f.icon}</div>
              <h4 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 8px' }}>{f.title}</h4>
              <p style={{ color: 'var(--muted)', margin: 0, fontSize: 13, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.03))',
        borderTop: '1px solid rgba(201,168,76,0.15)',
        borderBottom: '1px solid rgba(201,168,76,0.15)',
        padding: '60px 24px', textAlign: 'center'
      }}>
        <h2 className="font-display" style={{ fontSize: 36, marginBottom: 12 }}>
          Ready to make a smarter decision?
        </h2>
        <p style={{ color: 'var(--muted)', marginBottom: 32 }}>
          Free to use · No signup required · Instant results
        </p>
        <Link to="/predict" style={{ textDecoration: 'none' }}>
          <button className="btn-gold" style={{ padding: '16px 40px', borderRadius: 12, fontSize: 18 }}>
            Check Property Price →
          </button>
        </Link>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '32px 24px',
        borderTop: '1px solid rgba(201,168,76,0.08)', color: 'var(--muted)', fontSize: 13 }}>
        <span className="gold-text" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600 }}>GharMol</span>
        &nbsp;· AI-powered real estate price intelligence · Built with XGBoost + FastAPI + React
      </div>
    </div>
  )
}
