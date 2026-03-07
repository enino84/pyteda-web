export const PALETTE = [
  '#1e3a5f', '#b05a2f', '#1a6645', '#92600a',
  '#6b3fa0', '#0f6680', '#991b3a', '#3d6b2f',
  '#4a4580', '#7a3520', '#1a5c5c', '#5a3d6b',
]

const assigned = {}
let idx = 0

export function colorFor(label) {
  if (!assigned[label]) {
    assigned[label] = PALETTE[idx % PALETTE.length]
    idx++
  }
  return assigned[label]
}

export function hexToRgba(hex, a) {
  const r = parseInt(hex.slice(1,3), 16)
  const g = parseInt(hex.slice(3,5), 16)
  const b = parseInt(hex.slice(5,7), 16)
  return `rgba(${r},${g},${b},${a})`
}

export const PLOTLY_DARK = {
  paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor:  '#f7f3ee',
  font: { family: "'JetBrains Mono',monospace", color: '#5a4f44', size: 11 },
  margin: { t: 20, r: 16, b: 48, l: 58 },
  xaxis: {
    gridcolor: 'rgba(60,50,40,.08)',
    zerolinecolor: 'rgba(60,50,40,.15)',
    tickfont: { size: 10, color: '#9a8f84' },
    linecolor: 'rgba(60,50,40,.12)',
    title: { font: { size: 11, color: '#9a8f84' } },
  },
  yaxis: {
    gridcolor: 'rgba(60,50,40,.08)',
    zerolinecolor: 'rgba(60,50,40,.15)',
    tickfont: { size: 10, color: '#9a8f84' },
    linecolor: 'rgba(60,50,40,.12)',
    title: { font: { size: 11, color: '#9a8f84' } },
  },
  legend: {
    bgcolor: 'rgba(255,255,255,.92)',
    bordercolor: 'rgba(60,50,40,.12)',
    borderwidth: 1,
    font: { size: 10 },
  },
  hoverlabel: {
    bgcolor: '#ffffff',
    bordercolor: 'rgba(30,58,95,.3)',
    font: { family: "'JetBrains Mono',monospace", size: 11, color: '#1a1612' },
  },
}

export const PLOTLY_CONFIG = {
  responsive: true,
  displayModeBar: true,
  displaylogo: false,
  modeBarButtonsToRemove: ['select2d', 'lasso2d', 'autoScale2d'],
  toImageButtonOptions: { format: 'png', scale: 2 },
}
