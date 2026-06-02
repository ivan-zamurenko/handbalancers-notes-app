import { LEGAL_PROFILE } from '@/lib/legal'

type Section = {
  title: string
  points: string[]
}

function getUaSections(): Section[] {
  return [
    {
      title: '1. Які дані ми збираємо',
      points: [
        "Дані акаунта: ім'я, email, технічний ідентифікатор користувача.",
        'Дані тренувань: логи вправ, прогрес, нотатки, посилання на відео, обране.',
        'Дані підписки: статус, період, технічні ідентифікатори платежів (без повних реквізитів картки).',
        'Технічні дані: cookies сесії, базові логи запитів, параметри пристрою для безпечної авторизації.',
      ],
    },
    {
      title: '2. Для чого та на якій підставі',
      points: [
        'Надавати доступ до сервісу та персоналізувати тренування (виконання договору).',
        'Вести трекінг прогресу та показувати історію тренувань (виконання договору).',
        'Забезпечувати безпеку, стабільність і підтримку сервісу (легітимний інтерес).',
        "Виконувати податкові та бухгалтерські обов'язки у юрисдикції Ірландії (юридичний обов'язок).",
      ],
    },
    {
      title: '3. Передача даних третім сторонам',
      points: [
        'Ми використовуємо процесорів даних: інфраструктура/база, Stripe, поштові сервіси.',
        'Ми не продаємо персональні дані.',
        'Передача даних поза ЄЕЗ можлива лише з належними гарантіями (наприклад, Standard Contractual Clauses).',
      ],
    },
    {
      title: '4. Термін зберігання і видалення',
      points: [
        'Дані зберігаються лише стільки, скільки потрібно для надання сервісу та виконання законних обов’язків.',
        `Запит на видалення акаунта: ${LEGAL_PROFILE.supportEmail}.`,
      ],
    },
    {
      title: '5. Ваші права (GDPR)',
      points: [
        'Ви маєте право на доступ, виправлення, видалення, обмеження обробки, заперечення та перенесення даних.',
        `Для реалізації прав: ${LEGAL_PROFILE.supportEmail}.`,
        'Скарга може бути подана до Irish Data Protection Commission (DPC).',
      ],
    },
    {
      title: '6. Безпека і оновлення',
      points: [
        'Ми використовуємо технічні та організаційні заходи для захисту даних, але жоден метод передачі чи зберігання не гарантує абсолютної безпеки.',
        'Ми можемо оновлювати цю Політику; актуальна версія завжди доступна на цій сторінці.',
      ],
    },
  ]
}

function getEnSections(): Section[] {
  return [
    {
      title: '1. Data we collect',
      points: [
        'Account data: name, email, and technical user identifier.',
        'Workout data: exercise logs, progress, notes, video links, and favorites.',
        'Membership data: status, period, and payment-related technical IDs (no full card details stored).',
        'Technical data: session cookies, request logs, and device/session metadata for secure authentication.',
      ],
    },
    {
      title: '2. Why and legal basis',
      points: [
        'To provide service access and personalized training (contract performance).',
        'To store and display progress history (contract performance).',
        'To keep the service secure and reliable (legitimate interest).',
        `To comply with accounting and tax obligations under ${LEGAL_PROFILE.country} law (legal obligation).`,
      ],
    },
    {
      title: '3. Sharing with third parties',
      points: [
        'We use data processors such as infrastructure/database providers, Stripe, and email services.',
        'We do not sell personal data.',
        'Cross-border processing outside the EEA is only used with appropriate safeguards (e.g., Standard Contractual Clauses).',
      ],
    },
    {
      title: '4. Retention and deletion',
      points: [
        'We keep data only as long as required to provide the service and meet legal obligations.',
        `Account deletion requests: ${LEGAL_PROFILE.supportEmail}.`,
      ],
    },
    {
      title: '5. Your rights (GDPR)',
      points: [
        'You may have rights of access, rectification, erasure, restriction, objection, and portability.',
        `To exercise your rights, email ${LEGAL_PROFILE.supportEmail}.`,
        'You may lodge a complaint with the Irish Data Protection Commission (DPC).',
      ],
    },
    {
      title: '6. Security and updates',
      points: [
        'We implement technical and organizational safeguards, but no method of transmission or storage is absolutely secure.',
        'We may update this policy from time to time. The latest version is always available on this page.',
      ],
    },
  ]
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const isUa = locale === 'ua'
  const countryLabel = isUa ? 'Ірландія' : 'Ireland'
  const sections = isUa ? getUaSections() : getEnSections()

  return (
    <main style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 1rem 4rem' }}>
      <h1 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 700, margin: '0 0 0.5rem' }}>
        {isUa ? 'Політика конфіденційності' : 'Privacy Policy'}
      </h1>
      <p style={{ color: '#666', fontSize: '0.82rem', margin: '0 0 1.5rem' }}>
        {isUa ? `Останнє оновлення: ${LEGAL_PROFILE.lastUpdatedIso}` : `Last updated: ${LEGAL_PROFILE.lastUpdatedIso}`}
      </p>

      <section style={{
        marginBottom: '1.4rem',
        padding: '0.95rem 1rem',
        background: '#141414',
        border: '1px solid #1f1f1f',
        borderRadius: '12px',
        display: 'grid',
        gap: '0.45rem',
      }}>
        <p style={{ margin: 0, color: '#9a9a9a', lineHeight: 1.55 }}>
          {isUa ? 'Оператор даних' : 'Data controller'}: {LEGAL_PROFILE.legalEntityName}
        </p>
        <p style={{ margin: 0, color: '#9a9a9a', lineHeight: 1.55 }}>
          {isUa ? 'Адреса' : 'Address'}: {LEGAL_PROFILE.operatorAddress}
        </p>
        <p style={{ margin: 0, color: '#9a9a9a', lineHeight: 1.55 }}>
          {isUa ? 'Контакт' : 'Contact'}: {LEGAL_PROFILE.supportEmail}
        </p>
        <p style={{ margin: 0, color: '#9a9a9a', lineHeight: 1.55 }}>
          {isUa ? 'Юрисдикція' : 'Jurisdiction'}: {countryLabel}
        </p>
      </section>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {sections.map((section) => (
          <section key={section.title}>
            <h2 style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, margin: '0 0 0.55rem' }}>{section.title}</h2>
            <ul style={{ margin: 0, paddingLeft: '1.1rem', display: 'grid', gap: '0.35rem' }}>
              {section.points.map((line, idx) => (
                <li key={idx} style={{ color: '#8e8e8e', lineHeight: 1.62 }}>{line}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  )
}
