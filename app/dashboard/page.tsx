// Головний дашборд користувача
// Показує: streak, середні показники, графік прогресу за обраний період, останні тренування
// Дані завантажуються з Supabase для поточного userId
import ProgressChart from '@/components/dashboard/ProgressChart'
import StatsCard from '@/components/dashboard/StatsCard'
import StreakBadge from '@/components/dashboard/StreakBadge'

export default function DashboardPage() {
  return (
    <main>
      <h1>Дашборд</h1>
      <StreakBadge />       {/* Поточна серія тренувань */}
      <StatsCard />         {/* Середні показники за тиждень / місяць / 3 місяці */}
      <ProgressChart />     {/* Графік Recharts з прогресом по вправах */}
    </main>
  )
}
