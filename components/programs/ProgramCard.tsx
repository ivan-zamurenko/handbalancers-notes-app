// Картка однієї програми
// Показує: назву, рівень складності, кількість тренувань, thumbnail
// Кнопка "Переглянути" → /programs/[id]
import type { Program } from '@/types'

export default function ProgramCard({ program }: { program: Program }) {
  return (
    <div>
      <h3>{program.title}</h3>
      <span>Рівень: {program.level}</span>
      {/* TODO: thumbnail, к-сть тренувань, статус (куплено/безкоштовне) */}
      <a href={`/programs/${program.id}`}>Переглянути</a>
    </div>
  )
}
