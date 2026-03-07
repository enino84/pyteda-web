import React, { useEffect, useRef } from 'react'

/* Self-contained SVG architecture diagram — no external deps */
export default function ArchDiagram() {
  const svgRef = useRef(null)
  const tooltip = useRef(null)

  useEffect(() => {
    const tip  = tooltip.current
    const nodes = svgRef.current?.querySelectorAll('.node') || []

    const enter = e => {
      const n = e.currentTarget
      tip.querySelector('.tip-name').textContent = n.dataset.name
      tip.querySelector('.tip-desc').textContent = n.dataset.desc
      tip.querySelector('.tip-file').textContent = '📄 ' + n.dataset.file
      tip.style.opacity = '1'
      tip.style.transform = 'translateY(0)'
    }
    const move = e => {
      const x = e.clientX + 16, y = e.clientY + 16
      const tw = 260, th = 130
      tip.style.left = (x + tw > window.innerWidth  ? e.clientX - tw - 8 : x) + 'px'
      tip.style.top  = (y + th > window.innerHeight ? e.clientY - th - 8 : y) + 'px'
    }
    const leave = () => {
      tip.style.opacity = '0'
      tip.style.transform = 'translateY(6px)'
    }

    nodes.forEach(n => {
      n.addEventListener('mouseenter', enter)
      n.addEventListener('mousemove', move)
      n.addEventListener('mouseleave', leave)
    })
    return () => nodes.forEach(n => {
      n.removeEventListener('mouseenter', enter)
      n.removeEventListener('mousemove', move)
      n.removeEventListener('mouseleave', leave)
    })
  }, [])

  const NODE_STYLES = `
    .node { cursor: pointer; }
    .node:hover .node-glow { opacity: 1 !important; }
    .node:hover .node-body { filter: brightness(1.15); }
    @keyframes flowAnim { 0%,100%{opacity:0} 40%,60%{opacity:1} }
    .flow-dot { animation: flowAnim 2.5s ease-in-out infinite; }
  `

  return (
    <div style={{ position: 'relative', background: '#0d0f14', borderRadius: 16, overflow: 'hidden', minHeight: 600 }}>

      {/* Grid bg */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      {/* Glow orbs */}
      {[
        { w:380, h:380, bg:'#4f8eff', t:'-80px', l:'-80px' },
        { w:300, h:300, bg:'#a78bfa', b:'-60px', r:'-60px' },
        { w:220, h:220, bg:'#f0814a', t:'40%',   l:'40%'   },
      ].map((o,i) => (
        <div key={i} style={{
          position:'absolute', borderRadius:'50%',
          width:o.w, height:o.h, background:o.bg,
          top:o.t, left:o.l, bottom:o.b, right:o.r,
          filter:'blur(80px)', opacity:.12, pointerEvents:'none',
        }} />
      ))}

      {/* Legend */}
      <div style={{
        position:'relative', zIndex:1,
        display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center',
        padding:'20px 20px 8px',
      }}>
        {[
          ['#4f8eff','Pages / Root'],
          ['#f0814a','UI Components'],
          ['#3dd68c','Hooks'],
          ['#a78bfa','Modals'],
          ['#22d3ee','Libraries'],
        ].map(([c,l]) => (
          <div key={l} style={{
            display:'flex', alignItems:'center', gap:6,
            padding:'4px 12px', borderRadius:999,
            border:'1px solid rgba(255,255,255,.08)',
            background:'rgba(255,255,255,.03)',
            fontFamily:"'JetBrains Mono',monospace",
            fontSize:9, fontWeight:600, letterSpacing:'.07em',
            textTransform:'uppercase', color:'#8892a4',
          }}>
            <div style={{ width:7, height:7, borderRadius:'50%', background:c }} />
            {l}
          </div>
        ))}
      </div>

      {/* SVG */}
      <div style={{ position:'relative', zIndex:1, padding:'8px 16px 24px', overflowX:'auto' }}>
        <svg ref={svgRef} viewBox="0 0 1040 920" style={{ width:'100%', minWidth:700, height:'auto', overflow:'visible' }}>
          <defs>
            <style>{NODE_STYLES}</style>
            <linearGradient id="ad-gBlue"   x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#1e3a6e"/><stop offset="100%" stopColor="#0f2247"/></linearGradient>
            <linearGradient id="ad-gTerra"  x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#5a2a10"/><stop offset="100%" stopColor="#3d1c09"/></linearGradient>
            <linearGradient id="ad-gGreen"  x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#0d3d22"/><stop offset="100%" stopColor="#072918"/></linearGradient>
            <linearGradient id="ad-gViolet" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#3b2260"/><stop offset="100%" stopColor="#271648"/></linearGradient>
            <linearGradient id="ad-gCyan"   x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#0a3040"/><stop offset="100%" stopColor="#061e2a"/></linearGradient>
            <marker id="ad-ab" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#4f8eff" opacity=".6"/></marker>
            <marker id="ad-at" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#f0814a" opacity=".6"/></marker>
            <marker id="ad-ag" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#3dd68c" opacity=".6"/></marker>
            <marker id="ad-ac" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#22d3ee" opacity=".6"/></marker>
            <marker id="ad-av" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#a78bfa" opacity=".6"/></marker>
          </defs>

          {/* ── Layer separators ── */}
          {[140,330,430,580,730,840].map(y => (
            <line key={y} x1="55" y1={y} x2="1020" y2={y} stroke="rgba(255,255,255,.05)" strokeWidth="1"/>
          ))}

          {/* ── Layer labels ── */}
          {[
            [28,100,'ROOT'],
            [28,280,'COMPONENTS'],
            [28,480,'HOOKS / LIBS'],
            [28,628,'API'],
            [28,790,'BACKEND'],
            [28,888,'PYTHON'],
          ].map(([x,y,label]) => (
            <text key={label} x={x} y={y} fontFamily="'JetBrains Mono',monospace" fontSize="9" fill="#4a5368"
              letterSpacing=".15em" textAnchor="middle" transform={`rotate(-90,${x},${y})`}>{label}</text>
          ))}

          {/* ── Connectors ── */}
          <path d="M 520,118 L 200,178" stroke="#4f8eff" strokeWidth="1.5" strokeDasharray="5,3" opacity=".4" markerEnd="url(#ad-ab)"/>
          <path d="M 520,118 L 520,178" stroke="#4f8eff" strokeWidth="1.5" strokeDasharray="5,3" opacity=".4" markerEnd="url(#ad-ab)"/>
          <path d="M 480,118 L 300,248" stroke="#4f8eff" strokeWidth="1.5" strokeDasharray="5,3" opacity=".4" markerEnd="url(#ad-ab)"/>
          <path d="M 560,118 L 760,248" stroke="#4f8eff" strokeWidth="1.5" strokeDasharray="5,3" opacity=".4" markerEnd="url(#ad-ab)"/>
          <path d="M 460,118 L 140,338" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="4,4" opacity=".35" markerEnd="url(#ad-av)"/>
          <path d="M 520,118 L 520,338" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="4,4" opacity=".35" markerEnd="url(#ad-av)"/>
          <path d="M 580,118 L 900,338" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="4,4" opacity=".35" markerEnd="url(#ad-av)"/>
          <path d="M 300,308 L 200,448" stroke="#3dd68c" strokeWidth="1.5" strokeDasharray="5,3" opacity=".45" markerEnd="url(#ad-ag)"/>
          <path d="M 360,308 L 360,448" stroke="#f0814a" strokeWidth="1.5" strokeDasharray="5,3" opacity=".4" markerEnd="url(#ad-at)"/>
          <path d="M 760,308 L 640,448" stroke="#3dd68c" strokeWidth="1.5" strokeDasharray="5,3" opacity=".45" markerEnd="url(#ad-ag)"/>
          <path d="M 840,308 L 880,448" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="5,3" opacity=".4" markerEnd="url(#ad-ac)"/>
          <path d="M 200,508 L 200,598" stroke="#3dd68c" strokeWidth="1.5" strokeDasharray="4,4" opacity=".4" markerEnd="url(#ad-ag)"/>
          <path d="M 640,508 L 520,598" stroke="#3dd68c" strokeWidth="1.5" strokeDasharray="4,4" opacity=".4" markerEnd="url(#ad-ag)"/>
          <path d="M 800,308 L 700,598" stroke="#4f8eff" strokeWidth="1.5" strokeDasharray="4,4" opacity=".3" markerEnd="url(#ad-ab)"/>
          <path d="M 880,508 L 840,308" stroke="#22d3ee" strokeWidth="1" strokeDasharray="3,5" opacity=".2" markerEnd="url(#ad-ac)"/>
          <path d="M 570,658 L 570,748" stroke="#4f8eff" strokeWidth="1.5" strokeDasharray="5,3" opacity=".4" markerEnd="url(#ad-ab)"/>
          <path d="M 520,658 L 360,748" stroke="#f0814a" strokeWidth="1.5" strokeDasharray="5,3" opacity=".4" markerEnd="url(#ad-at)"/>
          <path d="M 380,808 L 380,858" stroke="#f0814a" strokeWidth="1.5" strokeDasharray="4,4" opacity=".4" markerEnd="url(#ad-at)"/>
          <path d="M 590,808 L 490,858" stroke="#4f8eff" strokeWidth="1" strokeDasharray="3,5" opacity=".2"/>

          {/* ── Nodes ── */}

          {/* App.jsx */}
          <g className="node" data-name="App.jsx" data-file="src/App.jsx" data-desc="Root component. Owns modal state, runs array, and handleRun(). Renders Topbar, Hero, ConfigCard, RunCards and all Modals.">
            <rect className="node-glow" x="420" y="52" width="200" height="66" rx="14" fill="#4f8eff" opacity=".08"/>
            <rect className="node-body" x="424" y="56" width="192" height="58" rx="12" fill="url(#ad-gBlue)" stroke="#4f8eff" strokeWidth="1.5" strokeOpacity=".6"/>
            <text x="520" y="80" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="13" fontWeight="700" fill="#4f8eff">App.jsx</text>
            <text x="520" y="97" textAnchor="middle" fontFamily="'Figtree',sans-serif" fontSize="10" fill="#8892a4">Root · State · Routing</text>
            <circle cx="445" cy="67" r="4" fill="#4f8eff" opacity=".7"/>
          </g>

          {/* Topbar */}
          <g className="node" data-name="Topbar" data-file="src/components/Topbar.jsx" data-desc="Navigation bar with 4 chip buttons: Lorenz-96, Architecture, How to reference, Help. Supports accent color for special chips.">
            <rect className="node-glow" x="100" y="172" width="160" height="56" rx="12" fill="#f0814a" opacity=".08"/>
            <rect className="node-body" x="104" y="176" width="152" height="48" rx="10" fill="url(#ad-gTerra)" stroke="#f0814a" strokeWidth="1.2" strokeOpacity=".55"/>
            <text x="180" y="197" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="11" fontWeight="700" fill="#f0814a">Topbar</text>
            <text x="180" y="212" textAnchor="middle" fontFamily="'Figtree',sans-serif" fontSize="9.5" fill="#8892a4">4 chip nav buttons</text>
          </g>

          {/* Hero */}
          <g className="node" data-name="Hero" data-file="src/components/Hero.jsx" data-desc="Animated hero header with AML-CS logo, TEDA title in Playfair Display, subtitle, and stat strip (n=40, F=8, Lorenz-96, SSE). Staggered framer-motion animations.">
            <rect className="node-glow" x="440" y="172" width="160" height="56" rx="12" fill="#f0814a" opacity=".08"/>
            <rect className="node-body" x="444" y="176" width="152" height="48" rx="10" fill="url(#ad-gTerra)" stroke="#f0814a" strokeWidth="1.2" strokeOpacity=".55"/>
            <text x="520" y="197" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="11" fontWeight="700" fill="#f0814a">Hero</text>
            <text x="520" y="212" textAnchor="middle" fontFamily="'Figtree',sans-serif" fontSize="9.5" fill="#8892a4">Logo · Title · Stat strip</text>
          </g>

          {/* ConfigCard */}
          <g className="node" data-name="ConfigCard" data-file="src/components/ConfigCard.jsx" data-desc="Main configuration panel. Sets ensemble size, obs params, end time. Shows MethodChip buttons and MethodTablet cards to configure each method instance. Calls onRun() on submit.">
            <rect className="node-glow" x="210" y="242" width="180" height="64" rx="12" fill="#f0814a" opacity=".08"/>
            <rect className="node-body" x="214" y="246" width="172" height="56" rx="10" fill="url(#ad-gTerra)" stroke="#f0814a" strokeWidth="1.5" strokeOpacity=".6"/>
            <text x="300" y="269" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="11" fontWeight="700" fill="#f0814a">ConfigCard</text>
            <text x="300" y="285" textAnchor="middle" fontFamily="'Figtree',sans-serif" fontSize="9.5" fill="#8892a4">Config · Methods · Run btn</text>
            <circle cx="232" cy="257" r="3.5" fill="#f0814a" opacity=".6"/>
          </g>

          {/* RunCard */}
          <g className="node" data-name="RunCard" data-file="src/components/RunCard.jsx" data-desc="Results card per run. 5 collapsible sections: Analysis Error, Background vs Analysis, Ensemble Spread (NEW), RMSE Violin (NEW), Summary Metrics. KPI strip. Plotly charts + data table.">
            <rect className="node-glow" x="670" y="242" width="190" height="64" rx="12" fill="#f0814a" opacity=".1"/>
            <rect className="node-body" x="674" y="246" width="182" height="56" rx="10" fill="url(#ad-gTerra)" stroke="#f0814a" strokeWidth="1.8" strokeOpacity=".7"/>
            <text x="765" y="268" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="11" fontWeight="700" fill="#f0814a">RunCard</text>
            <text x="765" y="284" textAnchor="middle" fontFamily="'Figtree',sans-serif" fontSize="9.5" fill="#8892a4">6 charts · KPI strip · Table</text>
            <circle cx="693" cy="257" r="3.5" fill="#f0814a" opacity=".6"/>
            <rect x="820" y="250" width="26" height="14" rx="4" fill="#f0814a" opacity=".18"/>
            <text x="833" y="261" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="8" fontWeight="700" fill="#f0814a">NEW</text>
          </g>

          {/* Modal: Lorenz */}
          <g className="node" data-name="Modal: Lorenz-96" data-file="src/App.jsx" data-desc="Explains Lorenz-96. Renders governing equation with KaTeX (npm), variable breakdown table, physical interpretation, and why it's the standard DA benchmark.">
            <rect className="node-glow" x="55" y="332" width="170" height="56" rx="12" fill="#a78bfa" opacity=".08"/>
            <rect className="node-body" x="59" y="336" width="162" height="48" rx="10" fill="url(#ad-gViolet)" stroke="#a78bfa" strokeWidth="1.2" strokeOpacity=".55"/>
            <text x="140" y="357" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="10" fontWeight="700" fill="#a78bfa">Modal: Lorenz-96</text>
            <text x="140" y="372" textAnchor="middle" fontFamily="'Figtree',sans-serif" fontSize="9.5" fill="#8892a4">KaTeX · Variables</text>
          </g>

          {/* Modal: Cite */}
          <g className="node" data-name="Modal: Cite" data-file="src/App.jsx" data-desc="Shows the two academic references for TEDA: ICCS 2022 Springer paper and SoftwareX 2025 article. Includes DOI links.">
            <rect className="node-glow" x="435" y="332" width="170" height="56" rx="12" fill="#a78bfa" opacity=".08"/>
            <rect className="node-body" x="439" y="336" width="162" height="48" rx="10" fill="url(#ad-gViolet)" stroke="#a78bfa" strokeWidth="1.2" strokeOpacity=".55"/>
            <text x="520" y="357" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="10" fontWeight="700" fill="#a78bfa">Modal: Cite</text>
            <text x="520" y="372" textAnchor="middle" fontFamily="'Figtree',sans-serif" fontSize="9.5" fill="#8892a4">2 refs · DOI links</text>
          </g>

          {/* Modal: Help */}
          <g className="node" data-name="Modal: Help" data-file="src/App.jsx" data-desc="Displays per-method help text from /api/methods (meta.help). 2-column grid, one card per available method.">
            <rect className="node-glow" x="815" y="332" width="170" height="56" rx="12" fill="#a78bfa" opacity=".08"/>
            <rect className="node-body" x="819" y="336" width="162" height="48" rx="10" fill="url(#ad-gViolet)" stroke="#a78bfa" strokeWidth="1.2" strokeOpacity=".55"/>
            <text x="900" y="357" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="10" fontWeight="700" fill="#a78bfa">Modal: Help</text>
            <text x="900" y="372" textAnchor="middle" fontFamily="'Figtree',sans-serif" fontSize="9.5" fill="#8892a4">Method descriptions</text>
          </g>

          {/* MethodTablet */}
          <g className="node" data-name="MethodTablet" data-file="src/components/ConfigCard.jsx" data-desc="Sub-component inside ConfigCard. Shows method label, color dot, reorder arrows, and collapsible param form. Params auto-generate labels via humanLabel().">
            <rect className="node-glow" x="280" y="442" width="164" height="56" rx="10" fill="#f0814a" opacity=".07"/>
            <rect className="node-body" x="284" y="446" width="156" height="48" rx="9" fill="url(#ad-gTerra)" stroke="#f0814a" strokeWidth="1" strokeOpacity=".4"/>
            <text x="362" y="467" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="10" fontWeight="600" fill="#f0814a">MethodTablet</text>
            <text x="362" y="482" textAnchor="middle" fontFamily="'Figtree',sans-serif" fontSize="9" fill="#8892a4">Param form · Reorder</text>
          </g>

          {/* useMethods */}
          <g className="node" data-name="useMethods" data-file="src/hooks/useMethods.js" data-desc="Custom hook. Fetches GET /api/methods, returns { meta, error }. Meta has method names, defaults, JSON schema per method, and help text.">
            <rect className="node-glow" x="112" y="442" width="164" height="56" rx="10" fill="#3dd68c" opacity=".08"/>
            <rect className="node-body" x="116" y="446" width="156" height="48" rx="9" fill="url(#ad-gGreen)" stroke="#3dd68c" strokeWidth="1.2" strokeOpacity=".55"/>
            <text x="194" y="467" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="10" fontWeight="600" fill="#3dd68c">useMethods</text>
            <text x="194" y="482" textAnchor="middle" fontFamily="'Figtree',sans-serif" fontSize="9" fill="#8892a4">GET /api/methods</text>
          </g>

          {/* useRunSSE */}
          <g className="node" data-name="useRunSSE" data-file="src/hooks/useRunSSE.js" data-desc="Custom hook. Opens SSE connection to /api/runs/{id}/stream. Parses series_a, series_b, metric, runtime, status events. Feeds RunCard charts in real time.">
            <rect className="node-glow" x="556" y="442" width="164" height="56" rx="10" fill="#3dd68c" opacity=".08"/>
            <rect className="node-body" x="560" y="446" width="156" height="48" rx="9" fill="url(#ad-gGreen)" stroke="#3dd68c" strokeWidth="1.2" strokeOpacity=".55"/>
            <text x="638" y="467" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="10" fontWeight="600" fill="#3dd68c">useRunSSE</text>
            <text x="638" y="482" textAnchor="middle" fontFamily="'Figtree',sans-serif" fontSize="9" fill="#8892a4">SSE stream · Real-time</text>
          </g>

          {/* Plotly */}
          <g className="node" data-name="Plotly.js" data-file="plotly.js-dist-min (npm)" data-desc="Renders all 6 charts: Analysis Error, Background vs Analysis, Ensemble Spread (band), RMSE Violin, Runtime bar, RMSE scatter. Also radar, polar in Summary.">
            <rect className="node-glow" x="796" y="442" width="164" height="56" rx="10" fill="#22d3ee" opacity=".08"/>
            <rect className="node-body" x="800" y="446" width="156" height="48" rx="9" fill="url(#ad-gCyan)" stroke="#22d3ee" strokeWidth="1.2" strokeOpacity=".5"/>
            <text x="878" y="467" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="10" fontWeight="600" fill="#22d3ee">Plotly.js</text>
            <text x="878" y="482" textAnchor="middle" fontFamily="'Figtree',sans-serif" fontSize="9" fill="#8892a4">6 chart types</text>
          </g>

          {/* colors.js */}
          <g className="node" data-name="colors.js" data-file="src/lib/colors.js" data-desc="Assigns consistent color per method label. Exports hexToRgba(), PLOTLY_DARK theme, PLOTLY_CONFIG.">
            <rect className="node-glow" x="796" y="512" width="120" height="44" rx="9" fill="#22d3ee" opacity=".06"/>
            <rect className="node-body" x="800" y="516" width="112" height="36" rx="8" fill="url(#ad-gCyan)" stroke="#22d3ee" strokeWidth="1" strokeOpacity=".4"/>
            <text x="856" y="537" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="9.5" fontWeight="600" fill="#22d3ee">colors.js</text>
            <text x="856" y="549" textAnchor="middle" fontFamily="'Figtree',sans-serif" fontSize="8.5" fill="#8892a4">Palette · Theme</text>
          </g>

          {/* utils.js */}
          <g className="node" data-name="utils.js" data-file="src/lib/utils.js" data-desc="Helpers: fmtNum(), safeNum(), clamp(), uuidShort(), humanLabel(). Used across ConfigCard and RunCard.">
            <rect className="node-glow" x="680" y="512" width="108" height="44" rx="9" fill="#22d3ee" opacity=".06"/>
            <rect className="node-body" x="684" y="516" width="100" height="36" rx="8" fill="url(#ad-gCyan)" stroke="#22d3ee" strokeWidth="1" strokeOpacity=".4"/>
            <text x="734" y="537" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="9.5" fontWeight="600" fill="#22d3ee">utils.js</text>
            <text x="734" y="549" textAnchor="middle" fontFamily="'Figtree',sans-serif" fontSize="8.5" fill="#8892a4">fmtNum · clamp · uuid</text>
          </g>

          {/* Background */}
          <g className="node" data-name="Background" data-file="src/components/Background.jsx" data-desc="Full-screen decorative background. Fixed position, z-index 0, pointer-events none. Animated SVG texture behind all content.">
            <rect className="node-glow" x="440" y="512" width="130" height="44" rx="9" fill="#f0814a" opacity=".06"/>
            <rect className="node-body" x="444" y="516" width="122" height="36" rx="8" fill="url(#ad-gTerra)" stroke="#f0814a" strokeWidth="1" strokeOpacity=".35"/>
            <text x="505" y="537" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="9.5" fontWeight="600" fill="#f0814a">Background</text>
            <text x="505" y="549" textAnchor="middle" fontFamily="'Figtree',sans-serif" fontSize="8.5" fill="#8892a4">Animated canvas</text>
          </g>

          {/* Modal.jsx */}
          <g className="node" data-name="Modal.jsx" data-file="src/components/Modal.jsx" data-desc="Reusable modal shell. AnimatePresence + motion.div for backdrop blur and slide-in. Accepts open, onClose, title, children. Max height 72vh with scroll.">
            <rect className="node-glow" x="296" y="512" width="130" height="44" rx="9" fill="#a78bfa" opacity=".07"/>
            <rect className="node-body" x="300" y="516" width="122" height="36" rx="8" fill="url(#ad-gViolet)" stroke="#a78bfa" strokeWidth="1" strokeOpacity=".4"/>
            <text x="361" y="537" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="9.5" fontWeight="600" fill="#a78bfa">Modal.jsx</text>
            <text x="361" y="549" textAnchor="middle" fontFamily="'Figtree',sans-serif" fontSize="8.5" fill="#8892a4">Shell · backdrop blur</text>
          </g>

          {/* KaTeX */}
          <g className="node" data-name="KaTeX" data-file="katex (npm)" data-desc="Math typesetting via npm import. Renders Lorenz-96 equation in display mode with underbrace labels. Also inline symbols in the variable table.">
            <rect className="node-glow" x="120" y="512" width="120" height="44" rx="9" fill="#22d3ee" opacity=".06"/>
            <rect className="node-body" x="124" y="516" width="112" height="36" rx="8" fill="url(#ad-gCyan)" stroke="#22d3ee" strokeWidth="1" strokeOpacity=".4"/>
            <text x="180" y="537" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="9.5" fontWeight="600" fill="#22d3ee">KaTeX</text>
            <text x="180" y="549" textAnchor="middle" fontFamily="'Figtree',sans-serif" fontSize="8.5" fill="#8892a4">LaTeX equations</text>
          </g>

          {/* FastAPI */}
          <g className="node" data-name="FastAPI Backend" data-file="app/main.py" data-desc="Python FastAPI. Exposes: GET /api/methods, POST /api/runs, GET /api/runs/{id}/stream (SSE), GET /api/runs/{id}/csv.">
            <rect className="node-glow" x="400" y="592" width="220" height="64" rx="12" fill="#4f8eff" opacity=".08"/>
            <rect className="node-body" x="404" y="596" width="212" height="56" rx="10" fill="url(#ad-gBlue)" stroke="#4f8eff" strokeWidth="1.5" strokeOpacity=".6"/>
            <text x="510" y="620" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="11" fontWeight="700" fill="#4f8eff">FastAPI Backend</text>
            <text x="510" y="636" textAnchor="middle" fontFamily="'Figtree',sans-serif" fontSize="9.5" fill="#8892a4">/methods · /runs · SSE · /csv</text>
            <circle cx="422" cy="607" r="3.5" fill="#4f8eff" opacity=".6"/>
          </g>

          {/* run_service */}
          <g className="node" data-name="run_service.py" data-file="app/services/run_service.py" data-desc="Orchestrates benchmark runs. Calls TEDA for each method, streams partial results via SSE (series_a, series_b, metric, runtime, status). Writes finals to Postgres.">
            <rect className="node-glow" x="270" y="742" width="200" height="58" rx="12" fill="#f0814a" opacity=".08"/>
            <rect className="node-body" x="274" y="746" width="192" height="50" rx="10" fill="url(#ad-gTerra)" stroke="#f0814a" strokeWidth="1.3" strokeOpacity=".55"/>
            <text x="370" y="768" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="10.5" fontWeight="700" fill="#f0814a">run_service.py</text>
            <text x="370" y="783" textAnchor="middle" fontFamily="'Figtree',sans-serif" fontSize="9" fill="#8892a4">Orchestrates · SSE emitter</text>
          </g>

          {/* PostgreSQL */}
          <g className="node" data-name="PostgreSQL" data-file="app/persistence/postgres.py" data-desc="Stores run metadata and per-instance results (RMSE, runtime, series). Schema in persistence/schema.sql. Async via asyncpg.">
            <rect className="node-glow" x="490" y="742" width="190" height="58" rx="12" fill="#4f8eff" opacity=".07"/>
            <rect className="node-body" x="494" y="746" width="182" height="50" rx="10" fill="url(#ad-gBlue)" stroke="#4f8eff" strokeWidth="1.2" strokeOpacity=".5"/>
            <text x="585" y="768" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="10.5" fontWeight="700" fill="#4f8eff">PostgreSQL</text>
            <text x="585" y="783" textAnchor="middle" fontFamily="'Figtree',sans-serif" fontSize="9" fill="#8892a4">Runs · Results · Schema</text>
          </g>

          {/* TEDA Python */}
          <g className="node" data-name="TEDA Python Library" data-file="requirements.txt (teda)" data-desc="Core DA library. Implements LETKF, EnKF and variants. Integrates Lorenz-96 via RK4. Computes RMSE stats. Called by run_service per method instance.">
            <rect className="node-glow" x="300" y="852" width="260" height="58" rx="14" fill="#f0814a" opacity=".1"/>
            <rect className="node-body" x="304" y="856" width="252" height="50" rx="12" fill="url(#ad-gTerra)" stroke="#f0814a" strokeWidth="1.8" strokeOpacity=".7"/>
            <text x="430" y="878" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="11" fontWeight="700" fill="#f0814a">TEDA Python Library</text>
            <text x="430" y="893" textAnchor="middle" fontFamily="'Figtree',sans-serif" fontSize="9.5" fill="#8892a4">LETKF · EnKF · Lorenz-96 · RK4</text>
            <circle cx="324" cy="867" r="4" fill="#f0814a" opacity=".6"/>
          </g>

          {/* Animated flow dots */}
          <circle r="3.5" fill="#4f8eff" className="flow-dot">
            <animateMotion dur="2.5s" repeatCount="indefinite">
              <mpath href="#ad-path1"/>
            </animateMotion>
          </circle>
          <circle r="3" fill="#3dd68c" className="flow-dot" style={{animationDelay:'.8s'}}>
            <animateMotion dur="2.5s" repeatCount="indefinite" begin="0.8s">
              <mpath href="#ad-path2"/>
            </animateMotion>
          </circle>
          <path id="ad-path1" d="M 560,118 L 760,248" fill="none" visibility="hidden"/>
          <path id="ad-path2" d="M 640,508 L 520,598" fill="none" visibility="hidden"/>
        </svg>
      </div>

      {/* Tooltip */}
      <div ref={tooltip} style={{
        position:'fixed', background:'#1a1e2a',
        border:'1px solid rgba(255,255,255,.1)',
        borderRadius:12, padding:'12px 16px',
        maxWidth:260, fontSize:12, lineHeight:1.6,
        color:'#8892a4', pointerEvents:'none',
        opacity:0, transform:'translateY(6px)',
        transition:'opacity .2s, transform .2s',
        zIndex:9999,
        boxShadow:'0 8px 32px rgba(0,0,0,.5)',
        fontFamily:"'Figtree',sans-serif",
      }}>
        <div className="tip-name" style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, fontWeight:700, color:'#e8eaf0', marginBottom:4 }}/>
        <div className="tip-desc"/>
        <div className="tip-file" style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:'#4a5368', marginTop:6, paddingTop:6, borderTop:'1px solid rgba(255,255,255,.07)' }}/>
      </div>
    </div>
  )
}
