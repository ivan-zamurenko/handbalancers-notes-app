// Тарифна картка (один план)
// Показує: назву, ціну, список переваг, кнопку "Підписатись"
// Кліk → POST /api/stripe/checkout → redirect на Stripe Checkout URL
import type { Plan } from '@/types'

export default function PricingCard({ plan }: { plan?: Plan }) {
  // TODO: handleSubscribe → fetch('/api/stripe/checkout', { priceId }) → redirect

  return (
    <div>
      <h3>{plan?.name ?? 'Pro'}</h3>
      <p>{plan?.price ?? '—'} / міс</p>
      {/* TODO: список переваг, кнопка з redirect на Stripe */}
      <button>Підписатись</button>
    </div>
  )
}
