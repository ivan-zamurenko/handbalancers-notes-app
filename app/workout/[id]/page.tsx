// Активне тренування (сесія)
// Показує вправи по черзі: таймер для hold-вправ, лічильник для повторень
// Після фіналу → форма збереження результату → запис у Supabase `workout_logs`
// params.id = id тренування з програми
import Timer from '@/components/workout/Timer'
import ExerciseCard from '@/components/workout/ExerciseCard'
import LogForm from '@/components/workout/LogForm'

export default function WorkoutSessionPage({ params }: { params: { id: string } }) {
  return (
    <main>
      <h1>Тренування #{params.id}</h1>
      <Timer />         {/* Таймер для hold-вправ (наприклад: handstand hold) */}
      <ExerciseCard />  {/* Поточна вправа: назва, опис, ціль */}
      <LogForm />       {/* Форма запису результату: час / повторення / нотатка */}
    </main>
  )
}
