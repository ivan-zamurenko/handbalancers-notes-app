import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase-server'
import ProgressChart from '@/components/dashboard/ProgressChart'
import StatsCard from '@/components/dashboard/StatsCard'
import StreakBadge from '@/components/dashboard/StreakBadge'

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}/login`)

  const t = await getTranslations('dashboard')

  return (
    <main>
      <h1>{t('title')}</h1>
      <StreakBadge />
      <StatsCard />
      <ProgressChart />
    </main>
  )
}
