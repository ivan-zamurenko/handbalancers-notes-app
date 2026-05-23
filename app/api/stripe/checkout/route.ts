// API маршрут — створює Stripe Checkout Session для підписки
// Тіло запиту: { priceId: string; locale?: string }
// Повертає: { url: string } — URL для редіректу на Stripe Checkout
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getUser } from '@/lib/db/auth'

export async function POST(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { priceId, locale } = (await req.json()) as { priceId: string; locale?: string }
  if (!priceId) return NextResponse.json({ error: 'priceId required' }, { status: 400 })

  const origin = req.headers.get('origin') ?? 'http://localhost:3000'
  const localePath = locale ?? 'ua'

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/${localePath}/billing?success=1`,
      cancel_url: `${origin}/${localePath}/billing?canceled=1`,
      client_reference_id: user.id,
      metadata: { userId: user.id },
    })
    return NextResponse.json({ url: session.url })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[stripe/checkout]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
