// Оплата — підписки та покупка курсів
// Показує тарифні плани, статус поточної підписки
// Оплата через Stripe Checkout Session → webhook → оновлення Supabase
import PricingCard from '@/components/billing/PricingCard'
import SubscriptionStatus from '@/components/billing/SubscriptionStatus'

export default function BillingPage() {
  return (
    <main>
      <h1>Підписка та оплата</h1>
      <SubscriptionStatus />  {/* Поточний план, дата поновлення або закінчення */}
      <PricingCard />         {/* Тарифи: безкоштовний / місячний / річний */}
    </main>
  )
}
