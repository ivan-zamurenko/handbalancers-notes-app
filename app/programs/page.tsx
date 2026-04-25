// Список всіх доступних програм
// Відображає картки програм з рівнем складності (beginner → advanced)
// Програми завантажуються з таблиці Supabase `programs`
import ProgramList from '@/components/programs/ProgramList'

export default function ProgramsPage() {
  return (
    <main>
      <h1>Програми тренувань</h1>
      <ProgramList />  {/* Картки програм з фільтром по рівню */}
    </main>
  )
}
