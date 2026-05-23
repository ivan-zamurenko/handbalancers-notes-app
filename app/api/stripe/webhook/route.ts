// Stripe webhook — обробляє події від Stripe
// Підтверджує оплату, оновлює статус підписки в Supabase
// Перевіряє підпис через STRIPE_WEBHOOK_SECRET
import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { upsertSubscription, updateSubscriptionStatus } from '@/lib/db/subscriptions'
import type { SubscriptionStatus } from '@/types'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) return NextResponse.json({ error: 'No signature' }, { status: 400 })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Webhook signature failed' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.userId
    if (userId && session.subscription) {
      const sub = await stripe.subscriptions.retrieve(session.subscription as string)
      await upsertSubscription({
        user_id: userId,
        stripe_customer_id: sub.customer as string,
        stripe_subscription_id: sub.id,
        status: sub.status as SubscriptionStatus,
        current_period_end: new Date((sub.current_period_end as number) * 1000).toISOString(),
      })
    }
  }

  if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    await updateSubscriptionStatus(
      sub.id,
      sub.status as SubscriptionStatus,
      new Date((sub.current_period_end as number) * 1000).toISOString(),
    )
  }

  return NextResponse.json({ received: true })
}
