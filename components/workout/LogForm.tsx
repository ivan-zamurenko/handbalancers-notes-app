// Форма збереження результату після вправи / тренування
// Поля: achieved_hold (сек), reps, note
// Записує в Supabase `workout_logs` разом із userId, exerciseId, date
'use client'

export default function LogForm({ exerciseId }: { exerciseId?: string }) {
  // TODO: стан (hold, reps, note)
  // TODO: handleSubmit → supabase.from('workout_logs').insert(...)
  return (
    <form>
      <input type="number" placeholder="Hold (сек)" />
      <input type="number" placeholder="Повторення" />
      <textarea placeholder="Нотатка..." />
      <button type="submit">Зберегти результат</button>
    </form>
  )
}
