'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { createSubscriptionCheckoutSession } from '@/lib/services/billing-client'

type Props = { priceId: string; amountLabel: string; locale: string }

export default function PricingCard({ priceId, amountLabel, locale }: Props) {
  const t = useTranslations('billing')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubscribe() {
    setLoading(true)
    setError(null)
    try {
      const url = await createSubscriptionCheckoutSession({ priceId, locale })
      window.location.href = url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
      setLoading(false)
    }
  }

  return (
    <div style={{
      background: '#141414',
      border: '1px solid #1e1e1e',
      borderRadius: '16px',
      padding: '2rem',
      maxWidth: '420px',
    }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem', color: '#fff' }}>
        {t('proName')}
      </h3>
      <p style={{ color: '#888', fontSize: '0.9rem', margin: '0 0 0.9rem' }}>{t('valueSub')}</p>
      <p style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>
        {amountLabel}
        <span style={{ fontSize: '1rem', fontWeight: 400, color: '#888' }}> {t('perMonth')}</span>
      </p>

      <ul style={{ margin: '1rem 0 1.1rem', padding: 0, listStyle: 'none', color: '#aaa', display: 'grid', gap: '0.55rem' }}>
        {(t.raw('featuresList') as string[]).map((f: string) => (
          <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            <span style={{ color: '#39e600', fontWeight: 700, flexShrink: 0 }}>✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '1.2rem' }}>
        {[t('cancelAnytime'), t('renewalInfo'), t('refundInfo')].map(item => (
          <span key={item} style={{ fontSize: '0.72rem', color: '#777', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '0.32rem 0.52rem' }}>
            {item}
          </span>
        ))}
      </div>

      {error && (
        <p style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{error}</p>
      )}

      <button
        onClick={handleSubscribe}
        disabled={loading}
        style={{
          width: '100%',
          padding: '0.875rem',
          background: loading ? '#2a2a2a' : '#39e600',
          color: loading ? '#555' : '#000',
          border: 'none',
          borderRadius: '10px',
          fontWeight: 700,
          fontSize: '1rem',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? t('loading') : t('subscribe')}
      </button>
    </div>
  )
}
