import React, { useState } from 'react'
import { motion } from 'framer-motion'

function Chip({ href, onClick, children, accent }) {
  const [hov, setHov] = useState(false)
  const style = {
    display: 'inline-flex', alignItems: 'center', gap: 7,
    padding: '8px 16px', borderRadius: 999,
    border: `1px solid ${hov ? (accent ? 'var(--terra)' : 'var(--blue)') : 'var(--b2)'}`,
    background: hov ? (accent ? 'var(--terra-l)' : 'var(--blue-l)') : 'var(--s1)',
    color: hov ? (accent ? 'var(--terra)' : 'var(--blue)') : 'var(--text2)',
    fontSize: 12, fontWeight: 500, cursor: 'pointer',
    textDecoration: 'none', fontFamily: 'var(--font-body)',
    outline: 'none', transition: 'all .18s',
    boxShadow: hov ? '0 2px 12px rgba(30,58,95,.1)' : 'var(--shadow-sm)',
    transform: hov ? 'translateY(-1px)' : 'none',
  }
  if (href) return <a href={href} target="_blank" rel="noopener" style={style}
    onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>{children}</a>
  return <button style={style} onClick={onClick}
    onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>{children}</button>
}

export default function Topbar({ onCite, onHelp, onLorenz, onArch }) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 20px', gap: 8, flexWrap: 'wrap' }}
    >
      <Chip onClick={onLorenz} accent>🌀 Lorenz-96 Model</Chip>
      <Chip onClick={onArch}>🗺 Architecture</Chip>
      <Chip onClick={onCite}>❝ How to reference</Chip>
      <Chip onClick={onHelp}>❓ Help</Chip>
    </motion.nav>
  )
}
