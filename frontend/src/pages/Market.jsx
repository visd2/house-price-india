import { useEffect, useState } from 'react'
import axios from 'axios'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, ArcElement, Tooltip, Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

const API = import.meta.env.VITE_API_URL

const CITY_STATS = [
  { city: 'Mumbai',    avg: 180, min: 60,  max: 800, pps: 12000, tag: 'Most Expensive' },
  { city: 'Delhi',     avg: 120, min: 40,  max: 600, pps: 9000,  tag: 'High Demand'    },
  { city: 'Bangalore', avg: 85,  min: 30,  max: 400, pps: 6000,  tag: 'IT Corridor'    },
  { city: 'Hyderabad', avg: 75,  min: 25,  max: 350, pps: 5000,  tag: 'Growing Fast'   },
  { city: 'Chennai',   avg: 70,  min: 25,  max: 300, pps: 4800,  tag: 'Steady Market'  },
  { city: 'Kolkata',   avg: 55,  min: 20,  max: 250, pps: 4200,  tag: 'Best Value'     },
]

const INSIGHTS = [
  { label: 'Best Time to Buy',      value: 'Jan – Mar',   sub: 'Off-season discounts available' },
  { label: 'Fastest Growing City',  value: 'Hyderabad',   sub: '18% YoY price appreciation'     },
  { label: 'Best Value BHK',        value: '2 BHK',       sub: 'Best resale & rental yield'      },
  { label: 'Avg Deal Closing Time', value: '45 Days',     sub: 'Including negotiation time'      },
  { label: 'Most Affordable City',  value: 'Kolkata',     sub: 'Avg ₹55L with good amenities'   },
  { label: 'Highest Per Sqft',      value: 'Mumbai',      sub: '₹12,000+ in premium zones'      },
]

const chartOpts = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1C2030', titleColor: '#C9A84C',
      bodyColor: '#F0EDE6', borderColor: 'rgba(201,168,76,0.3)',
      borderWidth: 1, padding: 12,
    }
  },
  scales: {
    x: { grid: { color: 'rgba(201,168,76,0.05)' }, ticks: { color: '#8B8FA8' } },
    y: { grid: { color: 'rgba(201,168,76,0.05)' }, ticks: { color: '#8B8FA8' },
      title: { display: true, text: 'Avg Price (Lakhs)', color: '#8B8FA8' } }
  }
}

const donutOpts = {
  responsive: true,
  plugins: {
    legend: { position: 'bottom', labels: { color: '#8B8FA8', padding: 16, font: { size: 13 } } },
    tooltip: {
      backgroundColor: '#1C2030', titleColor: '#C9A84C',
      bodyColor: '#F0EDE6', borderColor: 'rgba(201,168,76,0.3)', borderWidth: 1,
    }
  }
}

export default function Market() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    axios.get(`${API}/insights/stats`).then(r => setStats(r.data)).catch(() => {})
  }, [])

  const barData = {
    labels: CITY_STATS.map(c => c.city),
    datasets: [{
      label: 'Avg Price (Lakhs)',
      data: CITY_STATS.map(c => c.avg),
      backgroundColor: CITY_STATS.map((_, i) =>
        `rgba(201,168,76,${0.3 + i * 0.12})`),
      borderColor: '#C9A84C',
      borderWidth: 1,
      borderRadius: 8,
    }]
  }

  const donutData = {
    labels: ['2 BHK', '3 BHK', '1 BHK', '4+ BHK'],
    datasets: [{
      data: [42, 31, 16, 11],
      backgroundColor: [
        'rgba(201,168,76,0.9)', 'rgba(201,168,76,0.55)',
        'rgba(201,168,76,0.3)', 'rgba(201,168,76,0.1)'
      ],
      borderColor: '#13161E', borderWidth: 2,
    }]
  }

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', padding: '48px 24px' }}>
      <div style={{ maxWidth: 1060, margin: '0 auto' }}>

        {/* Header */}
        <div className="fade-up" style={{ marginBottom: 40 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: 20, padding: '4px 14px', marginBottom: 14,
            fontSize: 12, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.08em'
          }}>Live Market Data · 2025</div>
          <h1 className="font-display" style={{ fontSize: 36, fontWeight: 700, margin: '0 0 8px' }}>
            India Real Estate Market Overview
          </h1>
          <p style={{ color: 'var(--muted)', margin: 0 }}>
            Price intelligence across India's 6 major cities — updated 2025
          </p>
        </div>

        {/* City stat cards */}
        <div className="fade-up-1" style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 14, marginBottom: 36
        }}>
          {CITY_STATS.map(c => (
            <div key={c.city} className="card card-hover" style={{ padding: '18px 20px' }}>
              <p style={{ fontSize: 11, color: 'var(--gold)', textTransform: 'uppercase',
                letterSpacing: '0.08em', margin: '0 0 4px' }}>{c.tag}</p>
              <p style={{ fontSize: 22, fontWeight: 700, margin: '0 0 2px',
                fontFamily: 'Playfair Display, serif', color: 'var(--text)' }}>
                ₹{c.avg}L
              </p>
              <p style={{ fontSize: 14, fontWeight: 600, margin: '0 0 4px', color: 'var(--gold)' }}>{c.city}</p>
              <p style={{ fontSize: 11, color: 'var(--muted)', margin: 0 }}>
                ₹{c.pps.toLocaleString()}/sqft avg
              </p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="fade-up-2" style={{
          display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 36
        }}>
          <div className="card" style={{ padding: 28 }}>
            <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 600 }}>
              Average Price by City
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: 13, margin: '0 0 20px' }}>
              Lakhs · Based on 2025 market data
            </p>
            <Bar data={barData} options={chartOpts} />
          </div>

          <div className="card" style={{ padding: 28 }}>
            <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 600 }}>
              BHK Distribution
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: 13, margin: '0 0 20px' }}>
              Share of listings by type
            </p>
            <Doughnut data={donutData} options={donutOpts} />
          </div>
        </div>

        {/* Per sqft table */}
        <div className="card fade-up-3" style={{ padding: 28, marginBottom: 36 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 20px' }}>
            Price Per Sq Ft — City Comparison
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
                  {['City', 'Avg/sqft', 'Min Price', 'Avg Price', 'Max Price', 'Market'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left',
                      fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase',
                      letterSpacing: '0.06em', fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CITY_STATS.map((c, i) => (
                  <tr key={c.city} style={{
                    borderBottom: i < CITY_STATS.length - 1
                      ? '1px solid rgba(201,168,76,0.07)' : 'none'
                  }}>
                    <td style={{ padding: '12px', fontWeight: 600 }}>{c.city}</td>
                    <td style={{ padding: '12px', color: 'var(--gold)' }}>₹{c.pps.toLocaleString()}</td>
                    <td style={{ padding: '12px', color: 'var(--muted)' }}>₹{c.min}L</td>
                    <td style={{ padding: '12px', fontWeight: 600 }}>₹{c.avg}L</td>
                    <td style={{ padding: '12px', color: 'var(--muted)' }}>₹{c.max}L</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        fontSize: 11, padding: '3px 10px', borderRadius: 20,
                        background: 'rgba(201,168,76,0.1)', color: 'var(--gold)'
                      }}>{c.tag}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insights grid */}
        <div className="fade-up-4">
          <h2 className="font-display" style={{ fontSize: 28, marginBottom: 20 }}>
            Market Intelligence
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {INSIGHTS.map((ins, i) => (
              <div key={i} className="card card-hover" style={{ padding: 20 }}>
                <p style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase',
                  letterSpacing: '0.08em', margin: '0 0 8px' }}>{ins.label}</p>
                <p style={{ fontSize: 22, fontWeight: 700, margin: '0 0 6px',
                  fontFamily: 'Playfair Display, serif', color: 'var(--gold)' }}>{ins.value}</p>
                <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>{ins.sub}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
