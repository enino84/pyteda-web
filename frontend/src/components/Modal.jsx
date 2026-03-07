import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function Modal({ open, onClose, title, children }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={e => { if (e.target === e.currentTarget) onClose() }}
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(26,22,18,.45)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: .97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: .97 }}
            transition={{ duration: 0.28, ease: [0.22,1,0.36,1] }}
            style={{
              width: 'min(1100px,100%)',
              background: 'var(--s1)',
              border: '1px solid var(--b2)',
              borderRadius: 20,
              overflow: 'hidden',
              boxShadow: '0 8px 40px rgba(60,50,40,.18), 0 32px 80px rgba(60,50,40,.12)',
            }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 12, padding: '16px 22px',
              background: 'var(--s2)',
              borderBottom: '1px solid var(--b2)',
            }}>
              <strong style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--blue)' }}>{title}</strong>
              <button onClick={onClose} style={{
                border: '1px solid var(--b2)', background: 'var(--s1)', color: 'var(--text2)',
                padding: '6px 11px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700,
                transition: 'all .15s',
              }}>✕</button>
            </div>
            <div style={{ padding: 22, maxHeight: 'min(72vh,800px)', overflowY: 'auto' }}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
