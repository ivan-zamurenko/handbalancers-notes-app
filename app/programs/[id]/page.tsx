// Деталі однієї програми
// Показує: опис, список тренувань у програмі, рівень, прогрес проходження
// Якщо програма платна і не куплена → кнопка "Придбати" → /billing
// params.id = id програми з Supabase

export default function ProgramDetailPage({ params }: { params: { id: string } }) {
  return (
    <main>
      <h1>Програма #{params.id}</h1>
      {/* TODO: опис програми, список сесій, кнопка "Почати тренування" */}
    </main>
  )
}
