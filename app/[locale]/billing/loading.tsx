export default function BillingLoading() {
  return (
    <main style={{ padding: '2rem 1rem', maxWidth: '480px', margin: '0 auto' }}>
      <div className="skeleton" style={{ height: '32px', width: '160px', marginBottom: '2rem' }} />
      <div className="skeleton" style={{ height: '80px', borderRadius: '14px', marginBottom: '1rem' }} />
      <div className="skeleton" style={{ height: '60px', borderRadius: '14px', width: '60%' }} />
    </main>
  )
}
