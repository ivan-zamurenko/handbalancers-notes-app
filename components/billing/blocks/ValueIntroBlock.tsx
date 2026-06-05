type Props = {
  headline: string
  description: string
}

// Pattern: Module / LEGO
export default function ValueIntroBlock({ headline, description }: Props) {
  return (
    <section style={{ marginBottom: '1rem' }}>
      <p style={{ fontSize: '1.1rem', fontWeight: 650, color: '#fff', margin: '0 0 0.35rem' }}>{headline}</p>
      <p style={{ color: '#888', fontSize: '0.9rem', margin: 0 }}>{description}</p>
    </section>
  )
}