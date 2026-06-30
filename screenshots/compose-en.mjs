// Annotated EN before/after for LinkedIn. Run: node screenshots/compose-en.mjs
import sharp from 'sharp'

const PW = 600                 // displayed panel width
const k = PW / 720             // CSS px (viewport 720) -> display px
const PAD = 48
const GAP = 150
const HEADER = 132
const LABEL = 58
const ACCENT = '#39e600'
const BG = '#0d0d0d'

async function panel(path) {
  const img = sharp(path)
  const m = await img.metadata()
  const h = Math.round(m.height * (PW / m.width))
  return { buffer: await img.resize({ width: PW }).toBuffer(), w: PW, h }
}

const before = await panel('screenshots/dashboard-before-en.png')
const after = await panel('screenshots/dashboard-after-en.png')

const bx = PAD, ax = PAD + PW + GAP, py = HEADER + LABEL
const panelMaxH = Math.max(before.h, after.h)
const legendY = py + panelMaxH + 44
const W = PAD + PW + GAP + PW + PAD
const H = legendY + 196

// element boxes in CSS px (measured on the page)
const B = {
  bar:    { x: 105, y: 294, w: 510, h: 16 },
  streak: { x: 559, y: 113, w: 81, h: 18 },
  radar:  { x: 80, y: 833, w: 560, h: 230 },
}
const A = {
  ring:   { x: 129, y: 209, w: 88, h: 88 },
  chip:   { x: 294, y: 266, w: 44, h: 22 },
}

// rounded highlight rect around a CSS box, placed in a panel at (ox,oy)
function hi(box, ox, oy) {
  const x = ox + (box.x - 6) * k, y = oy + (box.y - 6) * k
  const w = (box.w + 12) * k, h = (box.h + 12) * k
  return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="10" fill="none" stroke="${ACCENT}" stroke-width="3" opacity="0.9"/>`
}
// numbered badge centered on a CSS box
function badge(n, box, ox, oy) {
  const cx = ox + (box.x + box.w / 2) * k
  const cy = oy + (box.y + box.h / 2) * k
  return `
    <circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="20" fill="${ACCENT}" stroke="#0d0d0d" stroke-width="3"/>
    <text x="${cx.toFixed(1)}" y="${(cy + 7).toFixed(1)}" font-family="Helvetica, Arial, sans-serif" font-size="24" font-weight="800" fill="#0d0d0d" text-anchor="middle">${n}</text>`
}

const legend = [
  ['1', 'Thin progress bar', 'Bold progress ring (Apple-style)'],
  ['2', 'Streak hidden in the corner', 'Streak front &amp; center'],
  ['3', 'Fake-looking radar chart', 'Removed — focus on what matters'],
]
const legendSvg = legend.map(([n, b, a], i) => {
  const y = legendY + 18 + i * 56
  return `
    <circle cx="${PAD + 20}" cy="${y - 6}" r="18" fill="${ACCENT}"/>
    <text x="${PAD + 20}" y="${y + 1}" font-family="Helvetica, Arial, sans-serif" font-size="22" font-weight="800" fill="#0d0d0d" text-anchor="middle">${n}</text>
    <text x="${PAD + 52}" y="${y + 2}" font-family="Helvetica, Arial, sans-serif" font-size="23" font-weight="600" fill="#888888">${b}</text>
    <text x="${PAD + 52 + 360}" y="${y + 2}" font-family="Helvetica, Arial, sans-serif" font-size="23" font-weight="700" fill="#ffffff">→  ${a}</text>`
}).join('')

const overlay = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <text x="${W / 2}" y="58" font-family="Helvetica, Arial, sans-serif" font-size="40" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="-1">I deleted half my dashboard — and it felt more premium</text>
  <text x="${W / 2}" y="100" font-family="Helvetica, Arial, sans-serif" font-size="23" font-weight="500" fill="#888888" text-anchor="middle">Handbalancer's Studio · redesigned in a day</text>
  <text x="${bx + PW / 2}" y="${HEADER + 40}" font-family="Helvetica, Arial, sans-serif" font-size="28" font-weight="700" fill="#777777" text-anchor="middle">BEFORE</text>
  <text x="${ax + PW / 2}" y="${HEADER + 40}" font-family="Helvetica, Arial, sans-serif" font-size="28" font-weight="700" fill="${ACCENT}" text-anchor="middle">AFTER</text>
  ${hi(B.bar, bx, py)}${hi(B.streak, bx, py)}${hi(B.radar, bx, py)}
  ${hi(A.ring, ax, py)}${hi(A.chip, ax, py)}
  ${badge('1', B.bar, bx, py)}${badge('2', B.streak, bx, py)}${badge('3', B.radar, bx, py)}
  ${badge('1', A.ring, ax, py)}${badge('2', A.chip, ax, py)}
  ${legendSvg}
</svg>`

await sharp({ create: { width: W, height: H, channels: 4, background: BG } })
  .composite([
    { input: before.buffer, top: py, left: bx },
    { input: after.buffer, top: py, left: ax },
    { input: Buffer.from(overlay), top: 0, left: 0 },
  ])
  .png()
  .toFile('screenshots/dashboard-before-after-en.png')

console.log(`✅ Saved screenshots/dashboard-before-after-en.png (${W}x${H})`)
