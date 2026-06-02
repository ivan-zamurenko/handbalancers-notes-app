import { LEGAL_PROFILE } from '@/lib/legal'

type Section = {
  title: string
  body: string[]
}

function getUaSections(): Section[] {
  return [
    {
      title: '1. Прийняття умов',
      body: [
        `Використовуючи ${LEGAL_PROFILE.tradingName}, ви погоджуєтесь з цими Умовами використання.`,
        'Якщо ви не погоджуєтесь з умовами, не використовуйте сервіс.',
      ],
    },
    {
      title: '2. Акаунт та безпека',
      body: [
        'Ви відповідаєте за точність даних акаунта та конфіденційність доступу до нього.',
        'Ви несете відповідальність за дії, виконані через ваш акаунт.',
      ],
    },
    {
      title: '3. Підписка та платежі',
      body: [
        'Підписка може поновлюватися автоматично відповідно до умов платіжного провайдера.',
        'Скасування діє з наступного розрахункового періоду, якщо інше не вказано у вашому платіжному плані.',
        'Оплата обробляється стороннім провайдером (Stripe). Ми не зберігаємо повні реквізити картки.',
        'Для цифрового контенту доступ може бути наданий одразу після оплати. Оформлюючи підписку, користувач погоджується на негайне надання доступу.',
      ],
    },
    {
      title: '4. Відмова/скасування та повернення коштів',
      body: [
        'Ви можете скасувати підписку у будь-який момент; скасування застосовується до наступного періоду.',
        'Повернення коштів розглядаються відповідно до застосовного споживчого законодавства та умов платіжного провайдера.',
        'Для запиту повернення звертайтесь: support@handbalancers.studio.',
      ],
    },
    {
      title: '5. Використання контенту',
      body: [
        'Тренувальні матеріали надаються для особистого некомерційного використання.',
        'Заборонено копіювати, перепродавати, публічно розповсюджувати або передавати доступ третім особам без письмового дозволу.',
      ],
    },
    {
      title: '6. Здоров\'я та безпека',
      body: [
        'Сервіс надає освітній фітнес-контент і не є медичною послугою чи медичною консультацією.',
        'Ви самостійно оцінюєте фізичну готовність до вправ та, за потреби, консультуєтесь з лікарем.',
      ],
    },
    {
      title: '7. Заборонена поведінка',
      body: [
        'Забороняється порушувати роботу сервісу, обходити технічні обмеження, використовувати сервіс для незаконних дій.',
      ],
    },
    {
      title: '8. Обмеження відповідальності',
      body: [
        'Сервіс надається «як є» в межах, дозволених застосовним правом.',
        'Ми не несемо відповідальності за непрямі або випадкові збитки, якщо інше прямо не вимагається законом.',
      ],
    },
    {
      title: '9. Припинення доступу',
      body: [
        'Ми можемо обмежити або припинити доступ у разі порушення цих Умов або вимог закону.',
      ],
    },
    {
      title: '10. Застосовне право',
      body: [
        `Ці Умови регулюються правом ${LEGAL_PROFILE.governingLaw}, якщо інше не передбачено обов'язковими нормами права споживача.`,
      ],
    },
    {
      title: '11. Реквізити та контакти',
      body: [
        `Оператор: ${LEGAL_PROFILE.legalEntityName}.`,
        `Адреса: ${LEGAL_PROFILE.operatorAddress}.`,
        `VAT: ${LEGAL_PROFILE.vatNumber}.`,
        `Питання щодо умов: ${LEGAL_PROFILE.supportEmail}.`,
      ],
    },
  ]
}

function getEnSections(): Section[] {
  return [
    {
      title: '1. Acceptance of terms',
      body: [
        `By using ${LEGAL_PROFILE.tradingName}, you agree to these Terms of Use.`,
        'If you do not agree, do not use the service.',
      ],
    },
    {
      title: '2. Account and security',
      body: [
        'You are responsible for accurate account information and for keeping your credentials secure.',
        'You are responsible for activity performed through your account.',
      ],
    },
    {
      title: '3. Membership and payments',
      body: [
        'Membership may renew automatically under your payment provider settings.',
        'Cancellation takes effect from the next billing cycle unless otherwise specified by your plan terms.',
        'Payments are processed by third-party provider (Stripe). We do not store full card details.',
        'For digital services, access may start immediately after purchase. By subscribing, you agree to immediate service start.',
      ],
    },
    {
      title: '4. Cancellation and refunds',
      body: [
        'You may cancel membership at any time; cancellation applies to the next billing period.',
        'Refund requests are handled under applicable consumer law and payment provider rules.',
        'For refund requests, contact: support@handbalancers.studio.',
      ],
    },
    {
      title: '5. Content license',
      body: [
        'Training content is licensed for personal, non-commercial use only.',
        'You may not copy, resell, publicly distribute, or share account access without written permission.',
      ],
    },
    {
      title: '6. Health disclaimer',
      body: [
        'The service provides educational fitness content and is not medical advice or medical treatment.',
        'You are responsible for evaluating your fitness condition and seeking professional medical guidance when necessary.',
      ],
    },
    {
      title: '7. Prohibited conduct',
      body: [
        'You may not disrupt the service, bypass technical protections, or use the service for unlawful activities.',
      ],
    },
    {
      title: '8. Limitation of liability',
      body: [
        'The service is provided on an "as is" basis to the maximum extent permitted by applicable law.',
        'We are not liable for indirect or incidental damages unless required by mandatory law.',
      ],
    },
    {
      title: '9. Suspension or termination',
      body: [
        'We may suspend or terminate access for violations of these Terms or applicable law.',
      ],
    },
    {
      title: '10. Governing law',
      body: [
        `These Terms are governed by the law of ${LEGAL_PROFILE.governingLaw}, subject to mandatory consumer protection rules.`,
      ],
    },
    {
      title: '11. Operator details and contact',
      body: [
        `Operator: ${LEGAL_PROFILE.legalEntityName}.`,
        `Address: ${LEGAL_PROFILE.operatorAddress}.`,
        `VAT: ${LEGAL_PROFILE.vatNumber}.`,
        `Questions about these Terms: ${LEGAL_PROFILE.supportEmail}.`,
      ],
    },
  ]
}

export default async function TermsPage({
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
        {isUa ? 'Умови використання' : 'Terms of Use'}
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
