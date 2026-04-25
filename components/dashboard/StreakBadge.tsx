// Бейдж поточного стріку (к-сть днів поспіль)
// Рахує кількість consecutive-днів де є хоча б одне тренування
// Дані: з таблиці Supabase `workout_logs` по userId
export default function StreakBadge() {
  // TODO: обчислити streak з масиву дат з Supabase
  const streak = 0 // placeholder

  return (
    <div>
      <span>🔥 {streak} днів поспіль</span>
    </div>
  )
}
