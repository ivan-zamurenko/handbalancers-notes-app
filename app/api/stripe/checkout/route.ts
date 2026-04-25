// API маршрут — створює Stripe Checkout Session для підписки/курсу
// Тіло запиту: { priceId: string }
// Повертає: { url: string } — URL для редіректу на Stripe Checkout
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  // TODO: зчитати priceId з body
  // TODO: stripe.checkout.sessions.create({ mode: 'subscription', ... })
  // TODO: повернути { url: session.url }
  return NextResponse.json({ url: '' })
}
