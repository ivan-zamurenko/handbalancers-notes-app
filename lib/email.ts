// Pattern: Adapter — ізолює Resend від решти коду. Якщо міняємо провайдера → тільки цей файл.
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

/** Email адреса відправника (має бути верифікований домен в Resend). */
const FROM = process.env.RESEND_FROM ?? 'Handbalancers <hello@handbalancers.com>'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://handbalancers.com'

type WelcomeEmailParams = {
  email: string
  name: string
  locale: string
  /** Назва програми відповідно до локалі */
  programTitle: string
  /** Повний URL на День 1 програми (напр. /ua/programs/handstand-beginners/w1/d1) */
  day1Url: string
}

/** HTML-шаблон вітального листа після enrollment. */
function welcomeHtml({ name, locale, programTitle, day1Url }: WelcomeEmailParams): string {
  const isUa = locale === 'ua'

  const greeting = isUa ? `Привіт, ${name}!` : `Hey ${name}!`
  const body     = isUa
    ? `Ти обрав програму <strong style="color:#fff;">${programTitle}</strong>. День 1 вже чекає — все готово.`
    : `You've enrolled in <strong style="color:#fff;">${programTitle}</strong>. Day 1 is ready — let's go.`
  const cta      = isUa ? 'Розпочати День 1 →' : 'Start Day 1 →'
  const footer   = isUa
    ? 'Якщо ти не реєструвався — просто ігноруй цей лист.'
    : "If you didn't sign up, just ignore this email."

  return `<!DOCTYPE html>
<html lang="${isUa ? 'uk' : 'en'}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#0d0d0d;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d0d;padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#141414;border-radius:16px;border:1px solid #1e1e1e;overflow:hidden;max-width:560px;width:100%;">

        <tr><td style="padding:32px 40px 24px;border-bottom:1px solid #1e1e1e;">
          <p style="margin:0;font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.02em;">🤸 Handbalancers</p>
        </td></tr>

        <tr><td style="padding:32px 40px;">
          <h1 style="margin:0 0 16px;font-size:24px;font-weight:700;color:#fff;letter-spacing:-0.02em;">${greeting}</h1>
          <p style="margin:0 0 32px;font-size:16px;color:#888;line-height:1.6;">${body}</p>
          <a href="${APP_URL}${day1Url}"
             style="display:inline-block;background:#39e600;color:#000;font-weight:700;font-size:15px;padding:14px 32px;border-radius:10px;text-decoration:none;">
            ${cta}
          </a>
        </td></tr>

        <tr><td style="padding:24px 40px;border-top:1px solid #1e1e1e;">
          <p style="margin:0;font-size:12px;color:#444;">${footer}</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

/**
 * Відправляє вітальний email після enrollment на першу програму.
 * Ніколи не кидає — помилка логується але не блокує flow.
 */
export async function sendWelcomeEmail(params: WelcomeEmailParams): Promise<void> {
  const isUa = params.locale === 'ua'
  const subject = isUa
    ? `Твій шлях розпочався — ${params.programTitle} 🤸`
    : `Your journey begins — ${params.programTitle} 🤸`

  try {
    await resend.emails.send({
      from: FROM,
      to: params.email,
      subject,
      html: welcomeHtml(params),
    })
  } catch (err) {
    console.error('[email] sendWelcomeEmail failed:', err)
  }
}

