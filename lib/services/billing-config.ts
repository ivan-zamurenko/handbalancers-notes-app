// Pattern: Facade — єдине джерело ціни підписки (priceId + ярлик) залежно від локалі.
export type SubscriptionPrice = {
  priceId: string
  amountLabel: string
}

/** Повертає Stripe priceId і ярлик ціни для локалі. ua → 999 ₴, решта → €29.99. */
export function getSubscriptionPrice(locale: string): SubscriptionPrice {
  if (locale === 'ua') {
    const priceId = process.env.STRIPE_PRICE_ID_UAH
    if (!priceId) throw new Error('Missing STRIPE_PRICE_ID_UAH')
    return { priceId, amountLabel: '999 ₴' }
  }

  const priceId = process.env.STRIPE_PRICE_ID
  if (!priceId) throw new Error('Missing STRIPE_PRICE_ID')
  return { priceId, amountLabel: '€29.99' }
}