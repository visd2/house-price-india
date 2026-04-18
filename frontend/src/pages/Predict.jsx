import { useState } from 'react'
import axios from 'axios'
import PriceCard from '../components/PriceCard'

const API = import.meta.env.VITE_API_URL

const CITY_LOCATIONS = {
  Mumbai    : ['Andheri', 'Bandra', 'Powai', 'Thane', 'Borivali', 'Kurla', 'Malad'],
  Delhi     : ['Dwarka', 'Rohini', 'Saket', 'Vasant Kunj', 'Lajpat Nagar', 'Janakpuri'],
  Bangalore : ['Whitefield', 'Koramangala', 'HSR Layout', 'Indiranagar', 'Electronic City', 'Bellandur', 'Marathahalli'],
  Hyderabad : ['Gachibowli', 'Madhapur', 'Kondapur', 'HITEC City', 'Kukatpally', 'Banjara Hills'],
  Chennai   : ['Anna Nagar', 'Velachery', 'OMR', 'Adyar', 'Porur', 'Tambaram'],
  Kolkata   : ['Salt Lake', 'New Town', 'Park Street', 'Ballygunge', 'Howrah'],
}

const AMENITIES = [
  { key: 'gymnasium',     label: 'Gymnasium'    },
  { key: 'swimming_pool', label: 'Swimming Pool' },
  { key: 'car_parking',   label: 'Car Parking'  },
  { key: 'lift_available',label: 'Lift'         },
  { key: 'power_backup',  label: 'Power Backup' },
  { key: 'security',      label: '24×7 Security'},
]

const TIPS = [
  'In Mumbai, a 2BHK typically ranges between ₹150L–₹200L',
  'If the verdict shows "Overpriced", you have room to negotiate',
  'Amenities like gym and pool can add 10–15% to the price',
  'Resale properties are usually 8–10% cheaper than new ones',
  'Delhi NCR: Dwarka is one of the most affordable planned areas',
  'Per sqft rate of ₹5,000–₹7,000 is fair for Bangalore',
]

export default function Predict() {
  const [form, setForm] = useState({
    city: '', location: '', total_sqft: '', bath: 2,
    balcony: 1, bhk: 2, gymnasium: 0, swimming_pool: 0,
    car_parking: 1, lift_available: 1, power_backup: 1,
    security: 1, resale: 0,
  })
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [tip] = useState(TIPS[Math.floor(Math.random() * TIPS.length)])

  const locations = CITY_LOCATIONS[form.city] || []

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError(''); setResult(null)
    try {
      const res = await axios.post(`${API}/predict`, {
        ...form,
        total_sqft : parseFloat(form.total_sqft),
        bath       : parseInt(form.bath),
        balcony    : parseInt(form.balcony),
        bhk        : parseInt(form.bhk),
      })
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Connection failed. Please check the backend.')
    } finally {
      setLoading(false)
    }
  }

  const toggleAmenity = (key) =>
    setForm(f => ({...f, [key]: f[key] === 1 ? 0 : 1}))

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', padding: '48px 24px' }}>
      <div style={{ maxWidth: 580, margin: '0 auto' }}>

        {/* Header */}
        <div className="fade-up" style={{ marginBottom: 28 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: 20, padding: '4px 14px', marginBottom: 14,
            fontSize: 12, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.08em'
          }}>AI Price Check · 6 Cities</div>
          <h1 className="font-display" style={{ fontSize: 34, fontWeight: 700, margin: '0 0 8px' }}>
            Find the fair value of any property
          </h1>
          <p style={{ color: 'var(--muted)', margin: 0, fontSize: 15 }}>
            Enter property details — our AI will tell you if the price is right
          </p>
        </div>

        {/* Tip */}
        <div className="fade-up-1" style={{
          background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)',
          borderRadius: 10, padding: '10px 14px', marginBottom: 20,
          display: 'flex', gap: 8, alignItems: 'flex-start'
        }}>
          <span style={{ color: 'var(--gold)', fontSize: 13, marginTop: 1 }}>💡</span>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{tip}</p>
        </div>

        <form onSubmit={handleSubmit} className="fade-up-2">
          <div className="card" style={{ padding: 28 }}>

            {/* City + Location */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 18 }}>
              <div>
                <label className="label">City</label>
                <select className="inp" required value={form.city}
                  onChange={e => setForm({...form, city: e.target.value, location: ''})}>
                  <option value="">-- Select City --</option>
                  {Object.keys(CITY_LOCATIONS).map(c =>
                    <option key={c} value={c}>{c}</option>
                  )}
                </select>
              </div>
              <div>
                <label className="label">Locality / Area</label>
                <select className="inp" required value={form.location}
                  onChange={e => setForm({...form, location: e.target.value})}
                  disabled={!form.city}>
                  <option value="">-- Select Area --</option>
                  {locations.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>

            {/* Sqft */}
            <div style={{ marginBottom: 18 }}>
              <label className="label">Total Area (sq ft)</label>
              <input className="inp" type="number" placeholder="e.g. 1200"
                required value={form.total_sqft}
                onChange={e => setForm({...form, total_sqft: e.target.value})} />
              {form.total_sqft && (
                <p style={{ fontSize: 12, color: 'var(--gold)', marginTop: 5, marginBottom: 0 }}>
                  ≈ {Math.round(form.total_sqft * 0.0929)} sq. meters
                </p>
              )}
            </div>

            {/* BHK Bath Balcony */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 18 }}>
              {[
                { key: 'bhk',     label: 'BHK',       opts: [1,2,3,4,5] },
                { key: 'bath',    label: 'Bathrooms',  opts: [1,2,3,4,5] },
                { key: 'balcony', label: 'Balcony',    opts: [0,1,2,3]   },
              ].map(f => (
                <div key={f.key}>
                  <label className="label">{f.label}</label>
                  <select className="inp" value={form[f.key]}
                    onChange={e => setForm({...form, [f.key]: e.target.value})}>
                    {f.opts.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              ))}
            </div>

            {/* Property Type */}
            <div style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
              <label className="label" style={{ margin: 0 }}>Property Type</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[{ v: 0, label: 'New' }, { v: 1, label: 'Resale' }].map(opt => (
                  <button key={opt.v} type="button"
                    onClick={() => setForm({...form, resale: opt.v})}
                    style={{
                      padding: '5px 16px', borderRadius: 20, fontSize: 13,
                      cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'DM Sans, sans-serif',
                      background : form.resale === opt.v ? 'rgba(201,168,76,0.15)' : 'var(--dark3)',
                      border     : form.resale === opt.v ? '1px solid rgba(201,168,76,0.5)' : '1px solid rgba(201,168,76,0.1)',
                      color      : form.resale === opt.v ? 'var(--gold)' : 'var(--muted)',
                    }}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div style={{ marginBottom: 22 }}>
              <label className="label">Amenities Available</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {AMENITIES.map(a => (
                  <button key={a.key} type="button" onClick={() => toggleAmenity(a.key)}
                    style={{
                      padding: '6px 14px', borderRadius: 20, fontSize: 12,
                      cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'DM Sans, sans-serif',
                      background : form[a.key] === 1 ? 'rgba(201,168,76,0.15)' : 'var(--dark3)',
                      border     : form[a.key] === 1 ? '1px solid rgba(201,168,76,0.5)' : '1px solid rgba(201,168,76,0.1)',
                      color      : form[a.key] === 1 ? 'var(--gold)' : 'var(--muted)',
                    }}>
                    {form[a.key] === 1 ? '✓ ' : ''}{a.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary pill */}
            {form.city && form.total_sqft && (
              <div style={{
                background: 'var(--dark3)', borderRadius: 10, padding: '10px 14px',
                marginBottom: 18, fontSize: 13, color: 'var(--muted)',
                border: '1px solid rgba(201,168,76,0.1)'
              }}>
                <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{form.city}</span>
                {form.location && <span> · {form.location}</span>}
                <span> · {form.bhk} BHK</span>
                <span> · {form.total_sqft} sq ft</span>
                <span> · {form.resale === 1 ? 'Resale' : 'New Build'}</span>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-gold"
              style={{ width: '100%', padding: '14px', borderRadius: 12, fontSize: 16 }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span style={{
                    width: 16, height: 16, border: '2px solid #0D0F14',
                    borderTopColor: 'transparent', borderRadius: '50%',
                    display: 'inline-block', animation: 'spin 0.7s linear infinite'
                  }} />
                  Analysing...
                </span>
              ) : 'Get Price Estimate →'}
            </button>

            {error && (
              <p style={{ color: '#F87171', fontSize: 13, marginTop: 12,
                marginBottom: 0, textAlign: 'center' }}>{error}</p>
            )}
          </div>
        </form>

        {result && <PriceCard data={result} />}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
