import { useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

const CITY_LOCATIONS = {
  Mumbai    : ['Andheri', 'Bandra', 'Powai', 'Thane', 'Borivali', 'Kurla', 'Malad'],
  Delhi     : ['Dwarka', 'Rohini', 'Saket', 'Vasant Kunj', 'Lajpat Nagar', 'Janakpuri'],
  Bangalore : ['Whitefield', 'Koramangala', 'HSR Layout', 'Indiranagar', 'Electronic City', 'Bellandur'],
  Hyderabad : ['Gachibowli', 'Madhapur', 'Kondapur', 'HITEC City', 'Kukatpally', 'Banjara Hills'],
  Chennai   : ['Anna Nagar', 'Velachery', 'OMR', 'Adyar', 'Porur', 'Tambaram'],
  Kolkata   : ['Salt Lake', 'New Town', 'Park Street', 'Ballygunge', 'Howrah'],
}

const emptyForm = {
  city: '', location: '', total_sqft: '', bath: 2, balcony: 1, bhk: 2,
  gymnasium: 0, swimming_pool: 0, car_parking: 1,
  lift_available: 1, power_backup: 1, security: 1, resale: 0,
}

const inp = {
  width: '100%', background: 'var(--dark3)',
  border: '1px solid rgba(201,168,76,0.2)', borderRadius: 10,
  padding: '10px 14px', fontSize: 14, color: 'var(--text)',
  fontFamily: 'DM Sans, sans-serif', outline: 'none', boxSizing: 'border-box',
}

function FormBlock({ title, form, setForm, result, winner }) {
  const locations = CITY_LOCATIONS[form.city] || []

  return (
    <div style={{
      background: 'var(--dark2)', flex: 1, minWidth: 280,
      border: `1px solid ${winner ? 'rgba(74,222,128,0.4)' : 'rgba(201,168,76,0.2)'}`,
      borderRadius: 16, padding: 24, position: 'relative',
      boxShadow: winner ? '0 0 24px rgba(74,222,128,0.08)' : 'none',
      transition: 'border-color 0.3s',
    }}>
      {winner && (
        <div style={{
          position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, #4ADE80, #22C55E)',
          color: '#0D0F14', fontSize: 11, fontWeight: 700,
          padding: '3px 14px', borderRadius: 20, whiteSpace: 'nowrap',
          textTransform: 'uppercase', letterSpacing: '0.06em'
        }}>Better Deal</div>
      )}

      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>{title}</h3>

      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase',
          letterSpacing: '0.08em', display: 'block', marginBottom: 5 }}>City</label>
        <select style={inp} value={form.city}
          onChange={e => setForm({...form, city: e.target.value, location: ''})}>
          <option value="">-- Select City --</option>
          {Object.keys(CITY_LOCATIONS).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase',
          letterSpacing: '0.08em', display: 'block', marginBottom: 5 }}>Locality / Area</label>
        <select style={inp} value={form.location} disabled={!form.city}
          onChange={e => setForm({...form, location: e.target.value})}>
          <option value="">-- Select Area --</option>
          {locations.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase',
          letterSpacing: '0.08em', display: 'block', marginBottom: 5 }}>Total Area (sq ft)</label>
        <input style={inp} placeholder="e.g. 1200" value={form.total_sqft}
          onChange={e => setForm({...form, total_sqft: e.target.value})} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
        {[
          { key: 'bhk',     label: 'BHK',     opts: [1,2,3,4,5] },
          { key: 'bath',    label: 'Bath',     opts: [1,2,3,4,5] },
          { key: 'balcony', label: 'Balcony',  opts: [0,1,2,3]   },
        ].map(f => (
          <div key={f.key}>
            <label style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase',
              letterSpacing: '0.06em', display: 'block', marginBottom: 5 }}>{f.label}</label>
            <select style={inp} value={form[f.key]}
              onChange={e => setForm({...form, [f.key]: e.target.value})}>
              {f.opts.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        ))}
      </div>

      {result && (
        <div style={{
          background: winner ? 'rgba(74,222,128,0.08)' : 'rgba(201,168,76,0.06)',
          border: `1px solid ${winner ? 'rgba(74,222,128,0.2)' : 'rgba(201,168,76,0.15)'}`,
          borderRadius: 12, padding: 16,
        }}>
          <p style={{ fontSize: 28, fontWeight: 700, margin: '0 0 8px',
            fontFamily: 'Playfair Display, serif',
            color: winner ? '#4ADE80' : 'var(--gold)' }}>
            ₹{result.predicted_price}L
          </p>
          <span style={{
            fontSize: 12, padding: '3px 10px', borderRadius: 20, fontWeight: 500,
            background: result.verdict.includes('Under') ? 'rgba(96,165,250,0.15)'
              : result.verdict.includes('Over') ? 'rgba(248,113,113,0.15)'
              : 'rgba(74,222,128,0.15)',
            color: result.verdict.includes('Under') ? '#60A5FA'
              : result.verdict.includes('Over') ? '#F87171' : '#4ADE80',
          }}>{result.verdict}</span>
          <div style={{ display: 'flex', gap: 14, marginTop: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>
              ₹{result.price_per_sqft}/sqft
            </span>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>
              Range: ₹{result.price_min}L – ₹{result.price_max}L
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Compare() {
  const [a, setA]             = useState(emptyForm)
  const [b, setB]             = useState(emptyForm)
  const [resA, setResA]       = useState(null)
  const [resB, setResB]       = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const predict = async (form) => {
    const r = await axios.post(`${API}/predict`, {
      ...form,
      total_sqft : parseFloat(form.total_sqft),
      bath       : parseInt(form.bath),
      balcony    : parseInt(form.balcony),
      bhk        : parseInt(form.bhk),
    })
    return r.data
  }

  const handleCompare = async () => {
    if (!a.city || !b.city)             { setError('Please select a city for both properties');    return }
    if (!a.location || !b.location)     { setError('Please select a locality for both properties'); return }
    if (!a.total_sqft || !b.total_sqft) { setError('Please enter the area for both properties');   return }
    setLoading(true); setError('')
    try {
      const [ra, rb] = await Promise.all([predict(a), predict(b)])
      setResA(ra); setResB(rb)
    } catch (err) {
      setError(err.response?.data?.detail || 'Connection failed. Please check the backend.')
    } finally {
      setLoading(false)
    }
  }

  const winnerA = resA && resB && resA.price_per_sqft < resB.price_per_sqft
  const winnerB = resA && resB && resB.price_per_sqft < resA.price_per_sqft

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', padding: '48px 24px' }}>
      <div style={{ maxWidth: 980, margin: '0 auto' }}>

        <div className="fade-up" style={{ marginBottom: 36 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: 20, padding: '4px 14px', marginBottom: 14,
            fontSize: 12, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.08em'
          }}>Side-by-Side Comparison</div>
          <h1 className="font-display" style={{ fontSize: 34, fontWeight: 700, margin: '0 0 8px' }}>
            Compare Two Properties
          </h1>
          <p style={{ color: 'var(--muted)', margin: 0 }}>
            Cross-city comparison supported — e.g. Mumbai vs Delhi
          </p>
        </div>

        <div className="fade-up-1" style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
          <FormBlock title="Property A" form={a} setForm={setA} result={resA} winner={winnerA} />
          <div style={{ display: 'flex', alignItems: 'center',
            color: 'var(--muted)', fontSize: 18, padding: '0 4px', alignSelf: 'center' }}>vs</div>
          <FormBlock title="Property B" form={b} setForm={setB} result={resB} winner={winnerB} />
        </div>

        {error && (
          <p style={{ color: '#F87171', fontSize: 13, marginBottom: 12, textAlign: 'center' }}>{error}</p>
        )}

        <button onClick={handleCompare} disabled={loading} className="btn-gold fade-up-2"
          style={{ width: '100%', padding: '14px', borderRadius: 12, fontSize: 16 }}>
          {loading ? 'Comparing...' : 'Compare Properties →'}
        </button>

        {resA && resB && (
          <div className="card fade-up" style={{ padding: 24, marginTop: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 16px' }}>
              Comparison Summary
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
              {[
                {
                  label : 'Price Difference',
                  value : `₹${Math.abs(resA.predicted_price - resB.predicted_price).toFixed(2)}L`,
                  sub   : winnerA ? 'Property A is cheaper' : winnerB ? 'Property B is cheaper' : 'Same price',
                },
                {
                  label : 'Better Value / Sqft',
                  value : winnerA ? 'Property A' : winnerB ? 'Property B' : 'Equal',
                  sub   : `A: ₹${resA.price_per_sqft} · B: ₹${resB.price_per_sqft} per sqft`,
                },
                {
                  label : 'Cities',
                  value : `${resA.city} vs ${resB.city}`,
                  sub   : resA.city === resB.city ? 'Same city comparison' : 'Cross-city comparison',
                },
              ].map(row => (
                <div key={row.label} style={{
                  background: 'var(--dark3)', borderRadius: 10, padding: 16,
                  border: '1px solid rgba(201,168,76,0.1)'
                }}>
                  <p style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase',
                    letterSpacing: '0.06em', margin: '0 0 6px' }}>{row.label}</p>
                  <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--gold)',
                    margin: '0 0 4px', fontFamily: 'Playfair Display, serif' }}>{row.value}</p>
                  <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>{row.sub}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
