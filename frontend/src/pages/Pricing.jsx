import { useNavigate } from 'react-router-dom'

const plans = [
  {
    name     : 'Free',
    price    : '₹0',
    period   : 'forever',
    features : [
      '5 predictions / day',
      '6 major cities',
      'Basic price verdict',
      'Market overview',
    ],
    cta      : 'Get Started',
    ctaLink  : '/predict',
  },
  {
    name      : 'Basic',
    price     : '₹99',
    period    : '/ month',
    highlight : true,
    features  : [
      'Unlimited predictions',
      'Full investment insight',
      'Amenity price breakdown',
      'Prediction history',
      'Email support',
    ],
    cta     : 'Upgrade — ₹99/mo',
    ctaLink : '/predict',
  },
  {
    name     : 'Pro',
    price    : '₹299',
    period   : '/ month',
    features : [
      'Everything in Basic',
      'API access (5,000 calls/mo)',
      'PDF report export',
      'Bulk property check',
      'Priority support',
    ],
    cta     : 'Go Pro',
    ctaLink : '/predict',
  },
  {
    name     : 'Agency',
    price    : '₹999',
    period   : '/ month',
    features : [
      'White-label branding',
      'Multiple team users',
      'Custom domain support',
      'API (50,000 calls/mo)',
      'Dedicated support',
    ],
    cta     : 'Contact Us',
    ctaLink : '/predict',
  },
]

export default function Pricing() {
  const navigate = useNavigate()

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', padding: '48px 24px' }}>
      <div style={{ maxWidth: 1040, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div style={{
            display        : 'inline-flex',
            alignItems     : 'center',
            gap            : 8,
            background     : 'rgba(201,168,76,0.1)',
            border         : '1px solid rgba(201,168,76,0.2)',
            borderRadius   : 20,
            padding        : '4px 14px',
            marginBottom   : 16,
            fontSize       : 12,
            color          : 'var(--gold)',
            textTransform  : 'uppercase',
            letterSpacing  : '0.08em',
          }}>Simple Pricing</div>

          <h1 className="font-display" style={{ fontSize: 36, margin: '0 0 12px' }}>
            Choose your plan
          </h1>
          <p style={{ color: 'var(--muted)', margin: 0, fontSize: 16 }}>
            Start free — upgrade when you need more power
          </p>
        </div>

        {/* Plans */}
        <div style={{
          display              : 'grid',
          gridTemplateColumns  : 'repeat(auto-fit, minmax(220px, 1fr))',
          gap                  : 20,
          marginBottom         : 48,
        }}>
          {plans.map((plan, i) => (
            <div key={i} style={{
              background   : 'var(--dark2)',
              border       : plan.highlight
                ? '2px solid rgba(201,168,76,0.6)'
                : '1px solid rgba(201,168,76,0.2)',
              borderRadius : 16,
              padding      : 24,
              position     : 'relative',
              transition   : 'transform 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {plan.highlight && (
                <div style={{
                  position      : 'absolute',
                  top           : -13,
                  left          : '50%',
                  transform     : 'translateX(-50%)',
                  background    : 'linear-gradient(135deg, #C9A84C, #E8C96A)',
                  color         : '#0D0F14',
                  fontSize      : 11,
                  fontWeight    : 700,
                  padding       : '3px 16px',
                  borderRadius  : 20,
                  whiteSpace    : 'nowrap',
                  textTransform : 'uppercase',
                  letterSpacing : '0.06em',
                }}>Most Popular</div>
              )}

              <h3 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 12px' }}>
                {plan.name}
              </h3>

              <div style={{ marginBottom: 24 }}>
                <span className="gold-text" style={{
                  fontSize   : 34,
                  fontWeight : 700,
                  fontFamily : 'Playfair Display, serif',
                }}>{plan.price}</span>
                <span style={{ color: 'var(--muted)', fontSize: 14 }}>
                  {' '}{plan.period}
                </span>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px' }}>
                {plan.features.map((f, j) => (
                  <li key={j} style={{
                    fontSize    : 13,
                    color       : 'var(--muted)',
                    padding     : '5px 0',
                    display     : 'flex',
                    gap         : 8,
                    alignItems  : 'flex-start',
                    borderBottom: j < plan.features.length - 1
                      ? '1px solid rgba(201,168,76,0.06)' : 'none',
                  }}>
                    <span style={{ color: 'var(--gold)', marginTop: 1 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate(plan.ctaLink)}
                className={plan.highlight ? 'btn-gold' : ''}
                style={{
                  width        : '100%',
                  padding      : '11px',
                  borderRadius : 10,
                  fontSize     : 14,
                  cursor       : 'pointer',
                  fontFamily   : 'DM Sans, sans-serif',
                  fontWeight   : 500,
                  transition   : 'all 0.2s',
                  ...(plan.highlight ? {} : {
                    background : 'transparent',
                    border     : '1px solid rgba(201,168,76,0.3)',
                    color      : 'var(--gold)',
                  }),
                }}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div style={{
          background   : 'var(--dark2)',
          border       : '1px solid rgba(201,168,76,0.15)',
          borderRadius : 16,
          padding      : '32px',
        }}>
          <h2 className="font-display" style={{ fontSize: 24, marginBottom: 24, textAlign: 'center' }}>
            Frequently Asked Questions
          </h2>
          <div style={{
            display             : 'grid',
            gridTemplateColumns : 'repeat(auto-fit, minmax(280px, 1fr))',
            gap                 : 24,
          }}>
            {[
              {
                q : 'How accurate are the predictions?',
                a : 'Our model achieves 82%+ accuracy based on 78,000+ real listings. Results may vary ±10%.',
              },
              {
                q : 'Which cities are supported?',
                a : 'Mumbai, Delhi, Bangalore, Hyderabad, Chennai, and Kolkata. More cities coming soon.',
              },
              {
                q : 'Can I cancel anytime?',
                a : 'Yes — no contracts, no lock-ins. Cancel from your dashboard anytime.',
              },
              {
                q : 'Is the data real-time?',
                a : 'Predictions are based on 2025 market research + AI model trained on 78,000+ listings.',
              },
            ].map((faq, i) => (
              <div key={i}>
                <p style={{ fontWeight: 600, margin: '0 0 6px', fontSize: 14 }}>{faq.q}</p>
                <p style={{ color: 'var(--muted)', fontSize: 13, margin: 0, lineHeight: 1.6 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
