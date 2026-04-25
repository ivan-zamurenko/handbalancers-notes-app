// Stripe webhook — обробляє події від Stripe
// Підтверджує оплату, оновлює статус підписки в Supabase
// Перевіряє підпис через STRIPE_WEBHOOK_SECRET
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  // TODO: stripe.webhooks.constructEvent(body, signature, secret)
  // TODO: обробити checkout.session.completed → записати в Supabase subscriptions
  return NextResponse.json({ received: true })
}
