// Build a before/after composition for LinkedIn. Run: node screenshots/compose.mjs
import sharp from 'sharp'

const GAP = 48
const PAD = 56
const HEADER = 130
const LABEL = 70
const BG = '#0d0d0d'
const ACCENT = '#39e600'

const beforeBuf = 'screenshots/dashboard-before.png'
const afterBuf = 'screenshots/dashboard-after.png'

// Normalize both panels to the same height
const PANEL_H = 1180
async function panel(path) {
  const img = sharp(path)
  const meta = await img.metadata()
  const w = Math.round((meta.width / meta.height) * PANEL_H)
  return { buffer: await img.resize({ height: PANEL_H }).toBuffer(), w }
}

const b = await panel(beforeBuf)
const a = await panel(afterBuf)

const contentW = b.w + GAP + a.w
const W = contentW + PAD * 2
const H = HEADER + LABEL + PANEL_H + PAD

const svg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${BG}"/>
  <text x="${W / 2}" y="64" font-family="Helvetica, Arial, sans-serif" font-size="40" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="-1">Я видалив половину дашборда — і продукт став дорожчим</text>
  <text x="${W / 2}" y="108" font-family="Helvetica, Arial, sans-serif" font-size="24" font-weight="500" fill="#888888" text-anchor="middle">Handbalancer's Studio · редизайн за один день</text>
  <text x="${PAD + b.w / 2}" y="${HEADER + 44}" font-family="Helvetica, Arial, sans-serif" font-size="30" font-weight="700" fill="#666666" text-anchor="middle">ДО</text>
  <text x="${PAD + b.w + GAP + a.w / 2}" y="${HEADER + 44}" font-family="Helvetica, Arial, sans-serif" font-size="30" font-weight="700" fill="${ACCENT}" text-anchor="middle">ПІСЛЯ</text>
</svg>`

await sharp(Buffer.from(svg))
  .composite([
    { input: b.buffer, top: HEADER + LABEL, left: PAD },
    { input: a.buffer, top: HEADER + LABEL, left: PAD + b.w + GAP },
  ])
  .png()
  .toFile('screenshots/dashboard-before-after.png')

console.log(`✅ Saved screenshots/dashboard-before-after.png (${W}x${H})`)
