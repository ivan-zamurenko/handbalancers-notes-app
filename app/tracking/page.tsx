// Трекінг — історія та статистика по вправах
// Таблиця/список усіх записаних тренувань з фільтром по даті та вправі
// Показує: графік по вправі, середній hold/reps, регулярність
import TrackingHistory from '@/components/tracking/TrackingHistory'
import ExerciseStats from '@/components/tracking/ExerciseStats'

export default function TrackingPage() {
  return (
    <main>
      <h1>Трекінг прогресу</h1>
      <ExerciseStats />     {/* Статистика по кожній вправі: avg hold, max hold, reps */}
      <TrackingHistory />   {/* Список записів: дата, вправа, результат */}
    </main>
  )
}
