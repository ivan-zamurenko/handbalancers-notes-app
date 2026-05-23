// Stripe клієнт для серверних API маршрутів
// Використовується лише на сервері (route handlers)
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil' as never,
})
