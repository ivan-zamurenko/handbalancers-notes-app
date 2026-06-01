// loading.tsx — показується миттєво при переході на сторінку програм

// Компонент однієї картки-скелетону
function ProgramCardSkeleton() {
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      {/* Назва + бейдж ціни */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <div className="skeleton" style={{ height: '20px', width: '55%' }} />
        <div className="skeleton" style={{ height: '20px', width: '20%', borderRadius: '99px' }} />
      </div>
      {/* Опис — два рядки */}
      <div className="skeleton" style={{ height: '14px', width: '90%', marginBottom: '0.4rem' }} />
      <div className="skeleton" style={{ height: '14px', width: '70%', marginBottom: '0.75rem' }} />
      {/* Рівень + кнопка */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className="skeleton" style={{ height: '24px', width: '80px', borderRadius: '99px' }} />
        <div className="skeleton" style={{ height: '24px', width: '100px', borderRadius: '99px' }} />
      </div>
    </div>
  )
}

export default function ProgramsLoading() {
  return (
    <main style={{ padding: '1rem', maxWidth: '480px', margin: '0 auto' }}>

      {/* Заголовок */}
      <div className="skeleton" style={{ height: '32px', width: '200px', marginBottom: '1.5rem' }} />

      {/* Секція 1 — категорія + 2 картки */}
      <div className="skeleton" style={{ height: '20px', width: '100px', marginBottom: '0.75rem' }} />
      <ProgramCardSkeleton />
      <ProgramCardSkeleton />

      {/* Секція 2 */}
      <div className="skeleton" style={{ height: '20px', width: '80px', marginBottom: '0.75rem', marginTop: '1rem' }} />
      <ProgramCardSkeleton />

    </main>
  )
}
