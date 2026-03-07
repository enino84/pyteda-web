import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Background from './components/Background.jsx'
import Topbar from './components/Topbar.jsx'
import Hero from './components/Hero.jsx'
import ConfigCard from './components/ConfigCard.jsx'
import RunCard from './components/RunCard.jsx'
import Modal from './components/Modal.jsx'
import ArchDiagram from './components/ArchDiagram.jsx'
import { useMethods } from './hooks/useMethods.js'

/* ── KaTeX equation renderer ─────────────────────────────────────────── */
import katex from 'katex'
import 'katex/dist/katex.min.css'

function KaTeX({ math, display = false }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    katex.render(math, ref.current, {
      throwOnError: false,
      displayMode: display,
    })
  }, [math, display])
  return <span ref={ref} />
}

/* ── Lorenz-96 modal content ─────────────────────────────────────────── */
function LorenzModalContent() {

  const variables = [
    {
      sym: 'X_i',
      name: 'State variable',
      color: 'var(--blue)',
      desc: 'Represents a generic atmospheric quantity (e.g. vorticity, temperature perturbation) at the i-th grid point along a latitude circle. The n variables are arranged in a ring.',
    },
    {
      sym: 'i',
      name: 'Grid index',
      color: 'var(--blue)',
      desc: 'Discrete spatial index from 1 to n, with periodic boundary conditions so that X_{i+n} = X_i. Models equally-spaced longitudes around the globe.',
    },
    {
      sym: '(X_{i+1} - X_{i-2})\\,X_{i-1}',
      name: 'Advection term',
      color: 'var(--terra)',
      desc: 'Quadratic nonlinear term that mimics the transport of energy between neighboring grid points — analogous to atmospheric advection. It is the source of chaotic behavior.',
    },
    {
      sym: '-X_i',
      name: 'Dissipation term',
      color: 'var(--rose)',
      desc: 'Linear damping that models internal friction or radiative cooling. Without it the energy would grow unbounded. Acts as a stabilizing sink.',
    },
    {
      sym: 'F',
      name: 'Forcing constant',
      color: 'var(--green)',
      desc: 'Constant external forcing analogous to solar heating or large-scale pressure gradients. F = 8 places the system in a strongly chaotic regime — the standard DA benchmark setting.',
    },
    {
      sym: 'n',
      name: 'State dimension',
      color: 'var(--violet)',
      desc: 'Number of variables (grid points) in the ring. TEDA uses n = 40, the canonical value proposed by Lorenz. Larger n increases complexity and tests localization schemes.',
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

      {/* ── Equation block ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30,58,95,.06) 0%, rgba(176,90,47,.04) 100%)',
        border: '1px solid var(--b2)', borderRadius: 18, padding: '24px 28px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 18 }}>
          Governing equation
        </div>

        {/* Display-mode KaTeX equation */}
        <div style={{
          fontSize: 20, color: 'var(--blue)',
          padding: '8px 0 14px',
          overflowX: 'auto',
        }}>
          <KaTeX display math="\frac{dX_i}{dt} = \underbrace{(X_{i+1} - X_{i-2})\,X_{i-1}}_{\text{advection}} \;-\; \underbrace{X_i}_{\text{dissipation}} \;+\; \underbrace{F}_{\text{forcing}}" />
        </div>

        <div style={{
          display: 'inline-flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center',
          marginTop: 4, padding: '8px 18px',
          background: 'rgba(60,50,40,.04)', borderRadius: 10,
          fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--font-mono)',
        }}>
          <span><KaTeX math="i = 1, \ldots, n" /> &nbsp; (periodic: <KaTeX math="X_{i+n} = X_i" />)</span>
          <span><KaTeX math="n = 40" />, &nbsp;<KaTeX math="F = 8" /></span>
        </div>
      </div>

      {/* ── Variable explanations ── */}
      <div>
        <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.13em', marginBottom: 12 }}>
          Variables &amp; terms explained
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {variables.map(({ sym, name, color, desc }) => (
            <div key={sym} style={{
              display: 'grid', gridTemplateColumns: '160px 1fr',
              gap: 14, alignItems: 'start',
              background: 'var(--s2)', border: '1px solid var(--b2)',
              borderRadius: 12, padding: '13px 16px',
            }}>
              <div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 15,
                  color, marginBottom: 4,
                  padding: '4px 0',
                }}>
                  <KaTeX math={sym} />
                </div>
                <div style={{
                  fontSize: 10, fontWeight: 700, color: 'var(--text3)',
                  textTransform: 'uppercase', letterSpacing: '.08em',
                  fontFamily: 'var(--font-mono)',
                }}>{name}</div>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.7, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Physical interpretation ── */}
      <div style={{ border: '1px solid var(--b2)', borderRadius: 14, padding: '16px 18px', background: 'var(--s1)' }}>
        <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 10 }}>Physical interpretation</div>
        <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.8, margin: 0 }}>
          Introduced by <strong style={{ color: 'var(--blue)' }}>Edward N. Lorenz in 1996</strong>, this system is a minimal
          model of the mid-latitude atmosphere. The <em>n</em> variables sit on a ring, each representing
          an atmospheric scalar at equally-spaced longitudes. Energy flows between neighbors via the
          quadratic advection term, is continuously dissipated, and replenished by the constant forcing F.
          At <KaTeX math="F = 8" /> the Lyapunov exponents are positive — the system is <strong style={{ color: 'var(--terra)' }}>strongly chaotic</strong> — making it
          the canonical testbed for ensemble data assimilation methods like <strong>LETKF</strong> and <strong>EnKF</strong>.
        </p>
      </div>

      {/* ── Why standard benchmark ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(26,102,69,.05) 0%, rgba(30,58,95,.04) 100%)',
        border: '1px solid rgba(26,102,69,.2)', borderRadius: 14, padding: '16px 18px',
      }}>
        <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 10 }}>
          Why it's the standard DA benchmark
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            ['🔁', 'Cyclic geometry', 'Periodic boundary conditions mirror the spherical globe naturally — no artificial boundary effects.'],
            ['📐', 'Scalable dimension', 'Same equations from n = 5 (toy problem) to n = 1000 (high-dimensional stress test for localization).'],
            ['🌪', 'Realistic chaos', 'Positive Lyapunov exponents mimic real atmospheric forecast error growth — filters must work hard.'],
            ['⚡', 'Computationally cheap', 'RK4 integration on n = 40 takes milliseconds, enabling thousands of assimilation cycles in seconds.'],
          ].map(([icon, title, text]) => (
            <div key={title} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{icon}</span>
              <div>
                <strong style={{ fontSize: 12, color: 'var(--text)', fontFamily: 'var(--font-body)' }}>{title} — </strong>
                <span style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.65 }}>{text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default function App() {
  const { meta, error } = useMethods()
  const [runs, setRuns]       = useState([])
  const [status, setStatus]   = useState('')
  const [showHelp, setShowHelp]         = useState(false)
  const [showCite, setShowCite]         = useState(false)
  const [showLorenz, setShowLorenz]     = useState(false)
  const [showArch, setShowArch]         = useState(false)

  async function handleRun(payload) {
    if (!payload.methods.length) { setStatus('Please add at least one method instance.'); return }
    setStatus('Creating run…')
    try {
      const res = await fetch('/api/runs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) { setStatus('Error: ' + (data.error || 'unknown')); return }
      setRuns(prev => [{ runId: data.run_id, model: payload.model, totalMethods: payload.methods.length }, ...prev])
      setStatus(`Run created: ${data.run_id.slice(0,8)}`)
    } catch (e) {
      setStatus('Network error: ' + e.message)
    }
  }

  return (
    <>
      <Background />

      <div style={{ position: 'relative', zIndex: 1, width: 'min(1720px,calc(100vw - 40px))', margin: '0 auto', padding: '24px 0 80px' }}>

        <Topbar
          onHelp={() => setShowHelp(true)}
          onCite={() => setShowCite(true)}
          onLorenz={() => setShowLorenz(true)}
          onArch={() => setShowArch(true)}
        />

        <Hero />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {error && (
            <div style={{ padding: '12px 16px', borderRadius: 14, background: 'rgba(251,113,133,.08)', border: '1px solid rgba(251,113,133,.25)', color: 'var(--rose)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
              Failed to load methods: {error}
            </div>
          )}

          {meta ? (
            <ConfigCard meta={meta} onRun={handleRun} status={status} />
          ) : !error ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '20px', color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
              <span style={{ width:14, height:14, borderRadius:'50%', border:'2px solid rgba(255,255,255,.1)', borderTopColor:'var(--blue)', display:'inline-block', animation:'spin .8s linear infinite' }} />
              Loading methods…
            </div>
          ) : null}

          <AnimatePresence>
            {runs.map(({ runId, model, totalMethods }) => (
              <RunCard key={runId} runId={runId} model={model} totalMethods={totalMethods} />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Lorenz-96 modal */}
      <Modal open={showLorenz} onClose={() => setShowLorenz(false)} title="🌀 The Lorenz-96 Model">
        <LorenzModalContent />
      </Modal>

      {/* Architecture modal */}
      <Modal open={showArch} onClose={() => setShowArch(false)} title="🗺 Component Architecture">
        <ArchDiagram />
      </Modal>

      {/* Help modal */}
      <Modal open={showHelp} onClose={() => setShowHelp(false)} title="❓ Method Help & Quick References">
        <div style={{ color: 'var(--text3)', fontSize: 12, marginBottom: 14, lineHeight: 1.55 }}>
          Short method descriptions. Intended as quick reminders — not full documentation.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {meta?.methods.map(name => (
            <div key={name} style={{ border: '1px solid var(--b2)', borderRadius: 14, padding: 14, background: 'var(--s1)' }}>
              <strong style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{name}</strong>
              <p style={{ margin: '8px 0 0', color: 'var(--text3)', fontSize: 12, lineHeight: 1.55 }}>
                {meta.help?.[name] || 'No help text available yet.'}
              </p>
            </div>
          ))}
        </div>
      </Modal>

      {/* Cite modal */}
      <Modal open={showCite} onClose={() => setShowCite(false)} title="❝ How to Reference This Tool">
        <p style={{ color: 'var(--text2)', fontSize: 13, lineHeight: 1.65, marginBottom: 14 }}>
          If you use this tool in your research or publication, please cite:
        </p>
        <ul style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 14, fontSize: 13, lineHeight: 1.65, color: 'var(--text2)' }}>
          <li>
            Niño-Ruiz, Elías D., and Sebastian Racedo Valbuena.{' '}
            <em>"TEDA: A Computational Toolbox for Teaching Ensemble Based Data Assimilation."</em>{' '}
            International Conference on Computational Science. Cham: Springer, 2022.{' '}
            — <a href="https://link.springer.com/chapter/10.1007/978-3-031-08760-8_60" target="_blank" rel="noopener" style={{ color: 'var(--blue)', fontWeight: 600 }}>Springer link</a>
          </li>
          <li>
            Niño-Ruiz, Elías D.{' '}
            <em>"TEDA: A lightweight Python framework for educational data assimilation."</em>{' '}
            SoftwareX 31 (2025): 102297.{' '}
            — <a href="https://doi.org/10.1016/j.softx.2025.102297" target="_blank" rel="noopener" style={{ color: 'var(--blue)', fontWeight: 600 }}>DOI</a>
          </li>
        </ul>
      </Modal>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </>
  )
}
