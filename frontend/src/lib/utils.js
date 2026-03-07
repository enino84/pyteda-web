export function escHtml(s) {
  return String(s)
    .replaceAll('&','&amp;').replaceAll('<','&lt;')
    .replaceAll('>','&gt;').replaceAll('"','&quot;')
}

export function uuidShort(prefix = 'm') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`
}

export function humanLabel(name, params) {
  const keys = Object.keys(params||{}).filter(k =>
    params[k] !== '' && params[k] != null && !Number.isNaN(params[k])
  )
  if (!keys.length) return name
  return `${name} · ${keys.map(k=>`${k}=${params[k]}`).join(', ')}`
}

export function fmtNum(x, d = 6) {
  if (x === null || x === undefined) return '—'
  const n = Number(x)
  return Number.isFinite(n) ? n.toFixed(d) : '—'
}

export function safeNum(x) {
  const n = Number(x)
  return Number.isFinite(n) ? n : null
}

export function clamp(x, a, b) { return Math.max(a, Math.min(b, x)) }
