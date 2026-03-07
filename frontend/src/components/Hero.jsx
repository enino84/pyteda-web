import React from 'react'
import { motion } from 'framer-motion'

const amlLogo = '/aml-cs.png'

const fadeDown = (delay = 0) => ({
  initial: { opacity: 0, y: -14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
})

export default function Hero() {
  return (
    <header style={{ textAlign: 'center', padding: '20px 0 36px', position: 'relative' }}>

      {/* Thin rule top */}
      <motion.div {...fadeDown(0)} style={{
        width: 48, height: 2, background: 'var(--terra)', margin: '0 auto 20px', borderRadius: 2,
      }} />

      {/* Eyebrow */}
      <motion.div {...fadeDown(0.05)} style={{
        fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
        letterSpacing: '.18em', textTransform: 'uppercase',
        color: 'var(--terra)', marginBottom: 18,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
      }}>
        <span style={{ width: 24, height: 1, background: 'var(--terra)', display: 'inline-block', opacity: .5 }} />
        Real-time Benchmarking · Lorenz-96 · Ensemble DA
        <span style={{ width: 24, height: 1, background: 'var(--terra)', display: 'inline-block', opacity: .5 }} />
      </motion.div>

      {/* Logo */}
      <motion.div {...fadeDown(0.1)} style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
        <img src={amlLogo} alt="AML-CS" style={{
          width: 380, height: 152, objectFit: 'contain',
          borderRadius: 16, border: '1px solid var(--b2)',
          background: 'var(--s1)',
          boxShadow: '0 4px 24px rgba(60,50,40,.1), 0 1px 4px rgba(60,50,40,.08)',
        }} />
      </motion.div>

      {/* Title — serif display */}
      <motion.h1 {...fadeDown(0.15)} style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(24px, 4vw, 38px)',
        fontWeight: 700,
        letterSpacing: '-.01em',
        color: 'var(--blue)',
        lineHeight: 1.2,
        marginBottom: 14,
      }}>
        TEDA — Data Assimilation{' '}
        <em style={{ fontStyle: 'italic', color: 'var(--text)', fontWeight: 400 }}>Benchmarking</em>
      </motion.h1>

      {/* Subtitle */}
      <motion.p {...fadeDown(0.2)} style={{
        color: 'var(--text2)', fontSize: 14, maxWidth: 620,
        margin: '0 auto', lineHeight: 1.8, fontWeight: 300,
      }}>
        Real-time interactive benchmarking of ensemble-based data assimilation methods
        on the Lorenz-96 system using the TEDA educational framework.
      </motion.p>

      {/* Stat strip */}
      <motion.div {...fadeDown(0.25)} style={{
        display: 'inline-flex', alignItems: 'center',
        gap: 0, marginTop: 24,
        border: '1px solid var(--b2)', borderRadius: 10,
        background: 'var(--s1)', overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
      }}>
        {[
          ['n = 40', 'state variables'],
          ['F = 8', 'forcing'],
          ['Lorenz-96', 'model'],
          ['SSE', 'streaming'],
        ].map(([val, label], i) => (
          <div key={i} style={{
            padding: '10px 20px',
            borderRight: i < 3 ? '1px solid var(--b2)' : 'none',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
          }}>
            <strong style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: 'var(--blue)' }}>{val}</strong>
            <span style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: '.06em', textTransform: 'uppercase' }}>{label}</span>
          </div>
        ))}
      </motion.div>

      {/* Bottom rule */}
      <motion.div {...fadeDown(0.3)} style={{
        width: '100%', height: 1,
        background: 'linear-gradient(90deg,transparent,var(--b2),transparent)',
        marginTop: 32,
      }} />
    </header>
  )
}
