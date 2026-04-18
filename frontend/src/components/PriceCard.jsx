export default function PriceCard({ data }) {
  const verdictConfig = {
    'Fair Price'               : { color: '#4ADE80', bg: 'rgba(74,222,128,0.1)',  icon: '✓' },
    'Underpriced - Good Deal!' : { color: '#60A5FA', bg: 'rgba(96,165,250,0.1)',  icon: '↓' },
    'Overpriced - Negotiate!'  : { color: '#F87171', bg: 'rgba(248,113,113,0.1)', icon: '↑' },
  }
  const v = verdictConfig[data.verdict] ?? { color: '#C9A84C', bg: 'rgba(201,168,76,0.1)', icon: '~' }

  const barPct = Math.min(100, Math.max(0,
    ((data.predicted_price - data.price_min) / (data.price_max - data.price_min)) * 100
  ))

  return (
    <div className="fade-up" style={{
      background: 'var(--dark2)',
      border: '1px solid rgba(201,168,76,0.25)',
      borderRadius: 16, padding: 24, marginTop: 20,
    }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <p style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase',
            letterSpacing: '0.08em', marginBottom: 4 }}>AI Estimated Price</p>
          <p className="gold-text" style={{ fontSize: 42, fontWeight: 700,
            fontFamily: 'Playfair Display, serif', margin: 0, lineHeight: 1 }}>
            ₹{data.predicted_price}L
          </p>
        </div>
        <div style={{
          background: v.bg, color: v.color,
          border: `1px solid ${v.color}40`,
          borderRadius: 20, padding: '6px 14px',
          fontSize: 13, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 6
        }}>
          <span>{v.icon}</span> {data.verdict}
        </div>
      </div>

      {/* Price range bar */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>Low ₹{data.price_min}L</span>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>High ₹{data.price_max}L</span>
        </div>
        <div style={{ height: 6, background: 'var(--dark4)', borderRadius: 3, position: 'relative' }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, height: '100%', width: '100%',
            borderRadius: 3,
            background: 'linear-gradient(90deg, #1C2030, var(--gold), #1C2030)',
            opacity: 0.35
          }} />
          <div style={{
            position: 'absolute', left: `${barPct}%`, top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 14, height: 14, borderRadius: '50%',
            background: 'linear-gradient(135deg, #C9A84C, #E8C96A)',
            boxShadow: '0 0 8px rgba(201,168,76,0.6)',
          }} />
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
        {[
          { label: 'Min Estimate',  value: `₹${data.price_min}L`     },
          { label: 'Max Estimate',  value: `₹${data.price_max}L`     },
          { label: 'Rate / Sq Ft', value: `₹${data.price_per_sqft}` },
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--dark3)', borderRadius: 10, padding: '12px',
            textAlign: 'center', border: '1px solid rgba(201,168,76,0.1)'
          }}>
            <p style={{ fontSize: 11, color: 'var(--muted)', margin: '0 0 4px',
              textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</p>
            <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--gold)', margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Verdict explanation */}
      <div style={{
        background: `${v.bg}`, border: `1px solid ${v.color}20`,
        borderRadius: 10, padding: '10px 14px'
      }}>
        <p style={{ fontSize: 13, color: v.color, margin: 0, fontWeight: 500 }}>
          {data.verdict === 'Fair Price' &&
            'This property is fairly priced for the current market. Proceed with standard negotiation.'}
          {data.verdict === 'Underpriced - Good Deal!' &&
            'This property appears underpriced vs market average. Act fast — it could sell quickly.'}
          {data.verdict === 'Overpriced - Negotiate!' &&
            'This property is priced above market average. Use this data to negotiate a better deal.'}
        </p>
      </div>

      <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 14, marginBottom: 0, textAlign: 'center' }}>
        * Based on 2025 {data.city} market data. Actual price may vary ±10%.
      </p>
    </div>
  )
}
