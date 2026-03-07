import React from 'react'

export default function Background() {
  return (
    <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {/* Subtle dot grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle, rgba(60,50,40,.18) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        opacity: 0.6,
      }} />
      {/* Warm top-left wash */}
      <div style={{
        position: 'absolute', top: '-20%', left: '-10%',
        width: '60%', height: '60%',
        background: 'radial-gradient(ellipse, rgba(176,90,47,.06) 0%, transparent 70%)',
        animation: 'wash1 18s ease-in-out infinite',
      }} />
      {/* Cool blue bottom-right */}
      <div style={{
        position: 'absolute', bottom: '-15%', right: '-10%',
        width: '55%', height: '55%',
        background: 'radial-gradient(ellipse, rgba(30,58,95,.07) 0%, transparent 70%)',
        animation: 'wash2 22s ease-in-out infinite',
      }} />
      {/* Paper texture overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
        opacity: 0.4,
      }} />
      <style>{`
        @keyframes wash1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(4%,3%) scale(1.07)} }
        @keyframes wash2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-3%,-4%) scale(1.05)} }
      `}</style>
    </div>
  )
}
