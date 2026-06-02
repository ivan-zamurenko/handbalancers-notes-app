import { LEGAL_PROFILE } from '@/lib/legal'

type Section = {
  title: string
  body: string[]
}

function getUaSections(): Section[] {
  return [
    {
      title: '1. Хто ми',
      body: [
        `${LEGAL_PROFILE.tradingName} — це бізнес ${LEGAL_PROFILE.legalEntityName} (${LEGAL_PROFILE.operatorAddress}).`,
        `Оператор даних: ${LEGAL_PROFILE.legalEntityName}. Контакт для privacy-запитів: ${LEGAL_PROFILE.supportEmail}.`,
      ],
    },
    {
      title: '2. Які дані ми збираємо',
      body: [
        'Акаунт: ім\'я, email, технічний ідентифікатор користувача.',
        'Тренування: логи вправ, прогрес, нотатки, посилання на відео, обране.',
        'Платежі: статус підписки, період дії, технічні ідентифікатори платежів (без зберігання повних даних картки).',
        'Технічні дані: базові логи запитів, cookies сесії, параметри пристрою для безпечної авторизації.',
        `Податкові дані: за потреби, реквізити для бухгалтерського обліку та відповідності вимогам ${LEGAL_PROFILE.country}.`,
      ],
    },
    {
      title: '3. Для чого використовуються дані',
      body: [
        'Надання доступу до сервісу та персоналізація тренувань.',
        'Збереження і відображення прогресу.',
        'Обробка підписки, платежів і технічної підтримки.',
        'Захист сервісу від зловживань та виконання юридичних обов\'язків.',
      ],
    },
    {
      title: '4. Правові підстави обробки',
      body: [
        'Виконання договору (надання сервісу).',
        'Легітимний інтерес (безпека, стабільність, аналітика для покращення продукту).',
        'Згода (де це необхідно).',
        `Юридичний обов'язок (податковий, бухгалтерський та комплаєнс-облік у ${LEGAL_PROFILE.country}).`,
      ],
    },
    {
      title: '5. Кому можуть передаватися дані',
      body: [
        'Постачальники інфраструктури (хостинг/база даних), платіжний провайдер (Stripe), поштові сервіси та інші процесори, що діють за договором обробки даних.',
        'Дані можуть оброблятися поза ЄЕЗ лише за наявності належних гарантій (наприклад, Standard Contractual Clauses).',
        'Дані не продаються третім особам.',
      ],
    },
    {
      title: '6. Зберігання і видалення',
      body: [
        'Ми зберігаємо дані лише стільки, скільки це потрібно для роботи сервісу, виконання договору та юридичних вимог.',
        `Ви можете надіслати запит на видалення акаунта на ${LEGAL_PROFILE.supportEmail}.`,
      ],
    },
    {
      title: '7. Ваші права',
      body: [
        'Ви маєте право на доступ, виправлення, видалення, обмеження обробки, заперечення та перенесення даних відповідно до GDPR.',
        `Для реалізації прав звертайтесь: ${LEGAL_PROFILE.supportEmail}.`,
        'Якщо ви вважаєте, що ваші права порушені, ви можете подати скаргу до Irish Data Protection Commission (DPC).',
      ],
    },
    {
      title: '8. Безпека',
      body: [
        'Ми використовуємо технічні та організаційні заходи для захисту даних, але жоден метод передачі чи зберігання не гарантує абсолютної безпеки.',
      ],
    },
    {
      title: '9. Оновлення політики',
      body: [
        'Ми можемо періодично оновлювати цю Політику. Актуальна версія завжди доступна на цій сторінці.',
      ],
    },
    {
      title: '10. Реквізити оператора',
      body: [
        `Юридична форма: Sole Trader (${LEGAL_PROFILE.country}).`,
        `Оператор: ${LEGAL_PROFILE.legalEntityName}.`,
        `Адреса: ${LEGAL_PROFILE.operatorAddress}.`,
        ...(LEGAL_PROFILE.vatNumber ? [`VAT: ${LEGAL_PROFILE.vatNumber}.`] : []),
      ],
    },
  ]
}

function getEnSections(): Section[] {
  return [
    {
      title: '1. Who we are',
      body: [
        `${LEGAL_PROFILE.tradingName} is operated by ${LEGAL_PROFILE.legalEntityName} (${LEGAL_PROFILE.operatorAddress}).`,
        `Data controller: ${LEGAL_PROFILE.legalEntityName}. Privacy contact: ${LEGAL_PROFILE.supportEmail}.`,
      ],
    },
    {
      title: '2. Data we collect',
      body: [
        'Account data: name, email, and technical user identifier.',
        'Workout data: exercise logs, progress, notes, video links, favorites.',
        'Billing data: subscription status, billing period, payment-related technical IDs (we do not store full card details).',
        'Technical data: request logs, session cookies, and device/session metadata used for secure authentication.',
        `Tax/compliance data where required under ${LEGAL_PROFILE.country} law.`,
      ],
    },
    {
      title: '3. Why we use data',
      body: [
        'To provide service access and personalize training.',
        'To store and display progress.',
        'To process subscriptions, payments, and support requests.',
        'To protect the service and comply with legal obligations.',
      ],
    },
    {
      title: '4. Legal bases for processing',
      body: [
        'Performance of a contract (service delivery).',
        'Legitimate interests (security, reliability, product improvement).',
        'Consent where required.',
        `Compliance with legal obligations (including accounting/tax obligations in ${LEGAL_PROFILE.country}).`,
      ],
    },
    {
      title: '5. Sharing with third parties',
      body: [
        'We use service providers such as infrastructure/database vendors, payment processor (Stripe), email providers, and other contracted data processors.',
        'Data may be processed outside the EEA only with appropriate safeguards (e.g., Standard Contractual Clauses).',
        'We do not sell personal data.',
      ],
    },
    {
      title: '6. Retention and deletion',
      body: [
        'We retain data only as long as necessary to provide the service, fulfill contracts, and meet legal requirements.',
        'You may request account deletion via support@handbalancers.studio.',
      ],
    },
    {
      title: '7. Your rights',
      body: [
        'You may have rights of access, rectification, erasure, restriction, objection, and portability under GDPR.',
        `To exercise your rights, email ${LEGAL_PROFILE.supportEmail}.`,
        'If you believe your rights were violated, you may lodge a complaint with the Irish Data Protection Commission (DPC).',
      ],
    },
    {
      title: '8. Security',
      body: [
        'We implement technical and organizational safeguards, but no method of transmission or storage is absolutely secure.',
      ],
    },
    {
      title: '9. Policy updates',
      body: [
        'We may update this policy from time to time. The latest version is always available on this page.',
      ],
    },
    {
      title: '10. Operator details',
      body: [
        `Legal form: Sole Trader (${LEGAL_PROFILE.country}).`,
        `Operator: ${LEGAL_PROFILE.legalEntityName}.`,
        `Address: ${LEGAL_PROFILE.operatorAddress}.`,
        ...(LEGAL_PROFILE.vatNumber ? [`VAT: ${LEGAL_PROFILE.vatNumber}.`] : []),
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
  const sections = isUa ? getUaSections() : getEnSections()

  return (
    <main style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 1rem 4rem' }}>
      <h1 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 700, margin: '0 0 0.5rem' }}>
        {isUa ? 'Політика конфіденційності' : 'Privacy Policy'}
      </h1>
      <p style={{ color: '#666', fontSize: '0.82rem', margin: '0 0 1.5rem' }}>
        {isUa ? `Останнє оновлення: ${LEGAL_PROFILE.lastUpdatedIso}` : `Last updated: ${LEGAL_PROFILE.lastUpdatedIso}`}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {sections.map((section) => (
          <section key={section.title}>
            <h2 style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, margin: '0 0 0.55rem' }}>{section.title}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {section.body.map((line, idx) => (
                <p key={idx} style={{ color: '#888', lineHeight: 1.65, margin: 0 }}>{line}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
