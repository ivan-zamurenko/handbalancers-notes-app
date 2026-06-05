type CheckoutInput = {
  priceId: string
  locale: string
}

type CheckoutResponse = {
  url?: string
  error?: string
}

const CHECKOUT_ENDPOINT = '/api/stripe/checkout'

// Pattern: Adapter
export async function createSubscriptionCheckoutSession(input: CheckoutInput): Promise<string> {
  const res = await fetch(CHECKOUT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  const data = (await res.json()) as CheckoutResponse
  if (!res.ok || !data.url) {
    throw new Error(data.error ?? 'Checkout session error')
  }

  return data.url
}