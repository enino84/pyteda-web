import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Plotly from 'plotly.js-dist-min'
import { useRunSSE } from '../hooks/useRunSSE.js'
import { colorFor, hexToRgba, PLOTLY_DARK, PLOTLY_CONFIG } from '../lib/colors.js'
import { fmtNum, safeNum, clamp } from '../lib/utils.js'

function StatusPill({ status }) {
  const map = {
    queued:    { bg:'rgba(60,50,40,.06)',   border:'rgba(60,50,40,.15)',   color:'#9a8f84',  dot:'#c9bfb4' },
    running:   { bg:'rgba(251,191,36,.08)', border:'rgba(251,191,36,.3)', color:'#92600a',  dot:'#f59e0b', spin:true },
    completed: { bg:'rgba(16,185,129,.08)', border:'rgba(16,185,129,.3)', color:'#1a6645',  dot:'#10b981' },
    failed:    { bg:'rgba(239,68,68,.08)',  border:'rgba(239,68,68,.3)',  color:'#991b3a',  dot:'#ef4444' },
  }
  const s = map[status] || map.queued
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:6,
      padding:'4px 10px', borderRadius:999,
      border:`1px solid ${s.border}`, background:s.bg,
      color:s.color, fontWeight:700, fontSize:10,
      fontFamily:'var(--font-mono)', letterSpacing:'.06em', textTransform:'uppercase',
    }}>
      <span style={{
        width:6, height:6, borderRadius:'50%', background:s.dot, flexShrink:0,
        ...(s.spin ? { animation:'statusSpin 1.2s ease-in-out infinite' } : {}),
      }} />
      {status}
    </span>
  )
}

function ChipStatus({ label, status }) {
  const col = colorFor(label)
  const dotColor = status==='completed'?'var(--green)':status==='failed'?'var(--rose)':status==='running'?'var(--amber)':'var(--b3)'
  return (
    <div style={{
      display:'inline-flex', alignItems:'center', gap:6,
      padding:'4px 11px', borderRadius:999,
      border:'1px solid var(--b2)', background:'var(--s1)',
      color:'var(--text2)', fontSize:10, fontWeight:600,
      fontFamily:'var(--font-mono)', letterSpacing:'.04em',
    }}>
      <span style={{ width:7, height:7, borderRadius:'50%', background:col, flexShrink:0, boxShadow:`0 0 0 2px ${hexToRgba(col,.2)}` }} />
      {label}
      <span style={{
        marginLeft:2, width:6, height:6, borderRadius:'50%', background:dotColor, flexShrink:0,
        ...(status==='running' ? { animation:'pulse 1.5s ease-in-out infinite' } : {}),
      }} />
    </div>
  )
}

function SectionToggle({ title, badge, open, onToggle, accentColor, children }) {
  return (
    <div style={{
      marginTop:10,
      background:'var(--s1)',
      border:'1px solid var(--b2)',
      borderRadius:16,
      overflow:'hidden',
      boxShadow:'0 1px 3px rgba(60,50,40,.06), 0 4px 12px rgba(60,50,40,.04)',
    }}>
      {accentColor && <div style={{ height:2, background:accentColor }} />}
      <div onClick={onToggle} style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'12px 16px', cursor:'pointer',
        background: open ? 'rgba(30,58,95,.025)' : 'transparent',
        transition:'background .15s',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <strong style={{
            fontFamily:'var(--font-mono)', fontSize:10, fontWeight:700,
            letterSpacing:'.13em', textTransform:'uppercase', color:'var(--text2)',
          }}>{title}</strong>
          {badge && (
            <span style={{
              padding:'2px 8px', borderRadius:999, fontSize:9, fontWeight:700,
              background:'rgba(30,58,95,.08)', color:'var(--blue)',
              fontFamily:'var(--font-mono)', letterSpacing:'.06em',
            }}>{badge}</span>
          )}
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ color:'var(--text3)', fontSize:10, display:'block' }}
        >▼</motion.span>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height:0, opacity:0 }}
            animate={{ height:'auto', opacity:1 }}
            exit={{ height:0, opacity:0 }}
            transition={{ duration:0.22, ease:[0.22,1,0.36,1] }}
            style={{ overflow:'hidden' }}
          >
            <div style={{ borderTop:'1px solid var(--b2)', padding:14 }}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ChartBox({ id, minHeight=340, title, subtitle, gradient }) {
  return (
    <div style={{
      background: gradient || 'linear-gradient(145deg,var(--s2) 0%,rgba(247,244,239,.6) 100%)',
      border:'1px solid var(--b2)',
      borderRadius:14,
      padding:14,
      position:'relative',
      overflow:'hidden',
    }}>
      <div style={{
        position:'absolute', top:0, right:0,
        width:80, height:80,
        background:'radial-gradient(circle at 100% 0%,rgba(30,58,95,.04) 0%,transparent 70%)',
        pointerEvents:'none',
      }} />
      {title && (
        <div style={{ marginBottom:8 }}>
          <div style={{
            fontSize:10, fontFamily:'var(--font-mono)', color:'var(--text2)',
            textTransform:'uppercase', letterSpacing:'.1em', fontWeight:700,
          }}>{title}</div>
          {subtitle && <div style={{ fontSize:9, color:'var(--text3)', fontFamily:'var(--font-mono)', marginTop:2 }}>{subtitle}</div>}
        </div>
      )}
      <div id={id} style={{ width:'100%', minHeight }} />
    </div>
  )
}

function KpiCard({ label, value, sub, color, icon }) {
  return (
    <div style={{
      background:'var(--s1)',
      border:'1px solid var(--b2)',
      borderRadius:14,
      padding:'14px 16px',
      position:'relative',
      overflow:'hidden',
      boxShadow:'0 1px 4px rgba(60,50,40,.06)',
    }}>
      <div style={{
        position:'absolute', bottom:0, right:0,
        fontSize:42, opacity:.06, lineHeight:1,
        fontFamily:'var(--font-display)',
        color: color || 'var(--blue)',
      }}>{icon}</div>
      <div style={{ fontSize:9, fontFamily:'var(--font-mono)', color:'var(--text3)', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:6 }}>{label}</div>
      <div style={{ fontFamily:'var(--font-display)', fontSize:22, fontWeight:700, color: color || 'var(--blue)', lineHeight:1 }}>
        {value ?? '—'}
      </div>
      {sub && <div style={{ fontSize:9, color:'var(--text3)', fontFamily:'var(--font-mono)', marginTop:4 }}>{sub}</div>}
    </div>
  )
}

export default function RunCard({ runId, model, totalMethods }) {
  const [open, setOpen]               = useState(true)
  const [scaleMode, setScaleMode]     = useState('log')
  const [showBg, setShowBg]           = useState(false)
  const [showMetrics, setShowMetrics] = useState(false)
  const [showSpread, setShowSpread]   = useState(false)
  const [showConv, setShowConv]       = useState(false)

  const { runStatus, runSubtitle, instancesById, statuses, seriesA, seriesB, metrics, runtimes } = useRunSSE(runId)

  const plotInitA    = useRef(false)
  const plotInitBg   = useRef(false)
  const plotInitSpr  = useRef(false)
  const plotInitConv = useRef(false)

  const drawMainChart = useCallback(() => {
    const el = document.getElementById(`chart-${runId}`)
    if (!el) return
    const traces = Object.keys(seriesA).map(mid => {
      const pts=seriesA[mid]||[]; const meta=instancesById[mid]||{}; const label=meta.label||mid; const col=colorFor(label)
      return {
        x:pts.map(p=>p.x), y:pts.map(p=>p.y),
        type:'scatter', mode:'lines', name:label,
        line:{ color:col, width:2.5, shape:'spline' },
        fill:'tozeroy', fillcolor:hexToRgba(col,.04),
        hovertemplate:`<b>${label}</b><br>t=%{x:.3f}<br>error=%{y:.5f}<extra></extra>`,
      }
    })
    const layout = {
      ...PLOTLY_DARK,
      xaxis:{ ...PLOTLY_DARK.xaxis, title:{text:'time (t)'} },
      yaxis:{ ...PLOTLY_DARK.yaxis, type:scaleMode==='log'?'log':'linear', title:{text:'analysis error'} },
    }
    if (!plotInitA.current) { Plotly.newPlot(el,traces,layout,PLOTLY_CONFIG); plotInitA.current=true }
    else Plotly.react(el,traces,layout,PLOTLY_CONFIG)
  }, [seriesA, instancesById, scaleMode, runId])

  const drawBgChart = useCallback(() => {
    const el = document.getElementById(`bgChart-${runId}`)
    if (!el) return
    const traces = []
    for (const mid of Object.keys(instancesById)) {
      const meta=instancesById[mid]||{}; const label=meta.label||mid; const col=colorFor(label)
      const ptsa=seriesA[mid]||[], ptsb=seriesB[mid]||[]
      if (ptsa.length) traces.push({ x:ptsa.map(p=>p.x), y:ptsa.map(p=>p.y), type:'scatter', mode:'lines', name:`${label} (analysis)`, line:{color:col,width:2.5,shape:'spline'} })
      if (ptsb.length) traces.push({ x:ptsb.map(p=>p.x), y:ptsb.map(p=>p.y), type:'scatter', mode:'lines', name:`${label} (background)`, line:{color:col,width:1.5,dash:'dot',shape:'spline'}, opacity:0.45 })
    }
    const layout = {
      ...PLOTLY_DARK,
      xaxis:{...PLOTLY_DARK.xaxis,title:{text:'time (t)'}},
      yaxis:{...PLOTLY_DARK.yaxis,type:scaleMode==='log'?'log':'linear',title:{text:'RMSE'}},
    }
    if (!plotInitBg.current) { Plotly.newPlot(el,traces,layout,PLOTLY_CONFIG); plotInitBg.current=true }
    else Plotly.react(el,traces,layout,PLOTLY_CONFIG)
  }, [seriesA, seriesB, instancesById, scaleMode, runId])

  const drawSpreadChart = useCallback(() => {
    const el = document.getElementById(`spread-${runId}`)
    if (!el) return
    const ids = Object.keys(instancesById)
    if (!ids.length) return
    const traces = []
    for (const mid of ids) {
      const meta = instancesById[mid] || {}
      const label = meta.label || mid
      const col = colorFor(label)
      const pts = seriesA[mid] || []
      if (pts.length < 3) continue
      const xs = pts.map(p => p.x)
      const ys = pts.map(p => p.y)
      const winSize = 5
      const spread = ys.map((_, i) => {
        const win = ys.slice(Math.max(0, i - winSize + 1), i + 1)
        const mean = win.reduce((s, v) => s + v, 0) / win.length
        return Math.sqrt(win.reduce((s, v) => s + (v - mean) ** 2, 0) / win.length)
      })
      const upper = ys.map((v, i) => v + spread[i])
      const lower = ys.map((v, i) => Math.max(0, v - spread[i]))
      traces.push({
        x: [...xs, ...xs.slice().reverse()],
        y: [...upper, ...lower.slice().reverse()],
        type: 'scatter', fill: 'toself', mode: 'none', name: `${label} spread`,
        fillcolor: hexToRgba(col, .12),
        line: { color: 'transparent' },
        showlegend: false, hoverinfo: 'skip',
      })
      traces.push({
        x: xs, y: ys, type: 'scatter', mode: 'lines', name: label,
        line: { color: col, width: 2.5, shape: 'spline' },
        hovertemplate: `<b>${label}</b><br>t=%{x:.3f}<br>RMSE=%{y:.5f}<extra></extra>`,
      })
    }
    const layout = {
      ...PLOTLY_DARK,
      xaxis: { ...PLOTLY_DARK.xaxis, title: { text: 'time (t)' } },
      yaxis: { ...PLOTLY_DARK.yaxis, type: scaleMode === 'log' ? 'log' : 'linear', title: { text: 'analysis error ± local spread' } },
    }
    if (!plotInitSpr.current) { Plotly.newPlot(el, traces, layout, PLOTLY_CONFIG); plotInitSpr.current = true }
    else Plotly.react(el, traces, layout, PLOTLY_CONFIG)
  }, [seriesA, instancesById, scaleMode, runId])

  const drawConvergenceChart = useCallback(() => {
    const el = document.getElementById(`convergence-${runId}`)
    if (!el) return
    const ids = Object.keys(instancesById)
    if (!ids.length) return
    const traces = []
    for (const mid of ids) {
      const meta = instancesById[mid] || {}
      const label = meta.label || mid
      const col = colorFor(label)
      const pts = seriesA[mid] || []
      if (pts.length < 5) continue
      const ys = pts.map(p => p.y)
      traces.push({
        type: 'violin', y: ys, name: label,
        box: { visible: true }, meanline: { visible: true },
        fillcolor: hexToRgba(col, .35),
        line: { color: col, width: 1.5 },
        opacity: 0.85, points: 'outliers',
        marker: { color: col, size: 3, opacity: 0.6 },
        hovertemplate: `<b>${label}</b><br>value=%{y:.5f}<extra></extra>`,
      })
    }
    if (!traces.length) return
    const layout = {
      ...PLOTLY_DARK, violingap: 0.05, violinmode: 'overlay',
      xaxis: { ...PLOTLY_DARK.xaxis, title: { text: 'method' }, tickfont: { size: 9 } },
      yaxis: { ...PLOTLY_DARK.yaxis, type: scaleMode === 'log' ? 'log' : 'linear', title: { text: 'RMSE distribution' } },
    }
    if (!plotInitConv.current) { Plotly.newPlot(el, traces, layout, PLOTLY_CONFIG); plotInitConv.current = true }
    else Plotly.react(el, traces, layout, PLOTLY_CONFIG)
  }, [seriesA, instancesById, scaleMode, runId])

  const drawSummary = useCallback(() => {
    const ids=Object.keys(instancesById); const labels=[],rmseA=[],rmseB=[]
    for (const id of ids) {
      const meta=instancesById[id]||{}; const m=metrics[id]||{}
      const a=safeNum(m.rmse_a),b=safeNum(m.rmse_b)
      if(a==null&&b==null) continue
      labels.push(meta.label||meta.name||id.slice(0,8)); rmseA.push(a??0); rmseB.push(b??0)
    }
    if (!labels.length) return
    const radarEl = document.getElementById(`radar-${runId}`)
    if (radarEl) {
      Plotly.newPlot(radarEl,[
        { type:'scatterpolar',r:[...rmseB,rmseB[0]],theta:[...labels,labels[0]],fill:'toself',fillcolor:'rgba(176,90,47,.1)',line:{color:'var(--terra)',width:2},name:'Background' },
        { type:'scatterpolar',r:[...rmseA,rmseA[0]],theta:[...labels,labels[0]],fill:'toself',fillcolor:'rgba(30,58,95,.12)',line:{color:'var(--blue)',width:2},name:'Analysis' },
      ],{ paper_bgcolor:'rgba(0,0,0,0)', polar:{ bgcolor:'#f7f3ee', radialaxis:{gridcolor:'rgba(60,50,40,.08)',tickfont:{size:9,color:'#9a8f84'}}, angularaxis:{tickfont:{size:10,color:'#5a4f44'}} }, legend:{ bgcolor:'rgba(255,255,255,.92)',bordercolor:'rgba(60,50,40,.12)',borderwidth:1,font:{size:10} }, margin:{t:16,r:16,b:16,l:16}, font:{family:"'JetBrains Mono',monospace",color:'#5a4f44',size:10} },{...PLOTLY_CONFIG,displayModeBar:false})
    }
    const polarEl = document.getElementById(`polar-${runId}`)
    if (polarEl) {
      const maxA=Math.max(...rmseA.filter(v=>v!=null))
      const perc=rmseA.map((a,i)=>{ const b=rmseB[i]; if(a!=null&&b!=null&&b>0) return clamp((1-a/b)*100,0,100); if(a!=null&&maxA>0) return clamp((1-a/maxA)*100,0,100); return 0 })
      const cols=labels.map(l=>colorFor(l))
      Plotly.newPlot(polarEl,[{ type:'barpolar',r:perc,theta:labels, marker:{ color:cols.map(c=>hexToRgba(c,.7)),line:{color:cols,width:1.5} }, hovertemplate:'%{theta}: %{r:.1f}%<extra>improvement</extra>' }],{ paper_bgcolor:'rgba(0,0,0,0)', polar:{ bgcolor:'#f7f3ee', radialaxis:{range:[0,100],ticksuffix:'%',gridcolor:'rgba(60,50,40,.08)',tickfont:{size:9,color:'#9a8f84'}}, angularaxis:{tickfont:{size:10,color:'#5a4f44'}} }, showlegend:false, margin:{t:16,r:16,b:16,l:16}, font:{family:"'JetBrains Mono',monospace",color:'#5a4f44',size:10} },{...PLOTLY_CONFIG,displayModeBar:false})
    }
    const barEl=document.getElementById(`runtime-${runId}`)
    const rtIds=Object.keys(runtimes)
    if (barEl&&rtIds.length) {
      const bLabels=rtIds.map(id=>instancesById[id]?.label||id.slice(0,8))
      const bVals=rtIds.map(id=>safeNum(runtimes[id])??0)
      const bCols=bLabels.map(l=>colorFor(l))
      Plotly.newPlot(barEl,[{ type:'bar',x:bLabels,y:bVals,marker:{color:bCols.map(c=>hexToRgba(c,.75)),line:{color:bCols,width:1.5}},hovertemplate:'%{x}: %{y:.3f}s<extra></extra>' }], {...PLOTLY_DARK,margin:{t:12,r:16,b:60,l:56},yaxis:{...PLOTLY_DARK.yaxis,title:{text:'seconds'}},xaxis:{...PLOTLY_DARK.xaxis,tickangle:-20,tickfont:{size:10}}}, {...PLOTLY_CONFIG,displayModeBar:false})
    }
    const scatterEl=document.getElementById(`scatter-${runId}`)
    const scIds=Object.keys(metrics).filter(id=>metrics[id]?.rmse_a!=null&&runtimes[id]!=null)
    if (scatterEl&&scIds.length) {
      const sLabels=scIds.map(id=>instancesById[id]?.label||id.slice(0,8))
      const sX=scIds.map(id=>safeNum(runtimes[id])??0)
      const sY=scIds.map(id=>safeNum(metrics[id].rmse_a)??0)
      const sCols=sLabels.map(l=>colorFor(l))
      Plotly.newPlot(scatterEl,[{ type:'scatter',mode:'markers+text',x:sX,y:sY,text:sLabels,textposition:'top center', marker:{ color:sCols.map(c=>hexToRgba(c,.85)),size:14,line:{color:sCols,width:2} }, hovertemplate:'<b>%{text}</b><br>Runtime: %{x:.3f}s<br>RMSE: %{y:.5f}<extra></extra>', textfont:{size:9,color:'#5a4f44',family:"'JetBrains Mono',monospace"} }],{...PLOTLY_DARK,xaxis:{...PLOTLY_DARK.xaxis,title:{text:'runtime (s)'}},yaxis:{...PLOTLY_DARK.yaxis,title:{text:'RMSE analysis'}}}, {...PLOTLY_CONFIG,displayModeBar:false})
    }
  }, [instancesById, metrics, runtimes, runId])

  useEffect(() => { if (open)        drawMainChart()       }, [seriesA, scaleMode, open, drawMainChart])
  useEffect(() => { if (showBg)      drawBgChart()         }, [seriesA, seriesB, scaleMode, showBg, drawBgChart])
  useEffect(() => { if (showSpread)  drawSpreadChart()     }, [seriesA, scaleMode, showSpread, drawSpreadChart])
  useEffect(() => { if (showConv)    drawConvergenceChart()}, [seriesA, scaleMode, showConv, drawConvergenceChart])
  useEffect(() => { if (showMetrics) drawSummary()         }, [showMetrics, metrics, runtimes, drawSummary])

  const allIds    = Object.keys(instancesById)
  const total     = totalMethods ?? allIds.length   // fixed from the start
  const bestRmse  = Math.min(...allIds.map(id=>safeNum(metrics[id]?.rmse_a)??Infinity).filter(v=>v!==Infinity))
  const totalTime = allIds.reduce((s,id)=>(safeNum(runtimes[id])??0)+s, 0)
  const nDone     = allIds.filter(id=>statuses[id]==='completed').length

  return (
    <motion.div layout
      initial={{ opacity:0, y:20 }}
      animate={{ opacity:1, y:0 }}
      transition={{ duration:0.45, ease:[0.22,1,0.36,1] }}
      style={{
        background:'var(--s1)',
        border:'1px solid var(--b2)',
        borderRadius:22,
        overflow:'hidden',
        boxShadow:'0 2px 8px rgba(60,50,40,.07), 0 12px 40px rgba(60,50,40,.07)',
        position:'relative',
      }}
    >
      <div style={{ height:3, background:'linear-gradient(90deg,var(--blue) 0%,#2952a3 40%,var(--terra) 100%)' }} />

      <div
        onClick={() => setOpen(o=>!o)}
        style={{
          display:'flex', justifyContent:'space-between', alignItems:'center',
          padding:'16px 20px', cursor:'pointer', gap:14,
          background: open ? 'rgba(30,58,95,.025)' : 'transparent',
          borderBottom: open ? '1px solid var(--b2)' : 'none',
          transition:'background .2s',
        }}
      >
        <div style={{ minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
            <span style={{ fontFamily:'var(--font-display)', fontSize:15, fontWeight:700, color:'var(--blue)' }}>Run</span>
            <code style={{ fontFamily:'var(--font-mono)', fontSize:12, fontWeight:600, color:'var(--terra)', background:'rgba(176,90,47,.08)', padding:'2px 8px', borderRadius:6, letterSpacing:'.05em' }}>{runId.slice(0,8)}</code>
            <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--text3)', fontStyle:'italic' }}>· {model}</span>
          </div>
          <div style={{ fontSize:10, color:'var(--text3)', fontFamily:'var(--font-mono)', marginTop:3 }}>{runSubtitle}</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
          {nDone > 0 && (
            <span style={{ padding:'4px 10px', borderRadius:999, fontSize:10, fontWeight:700, background:'rgba(26,102,69,.08)', color:'var(--green)', fontFamily:'var(--font-mono)', border:'1px solid rgba(26,102,69,.2)' }}>{nDone}/{total} done</span>
          )}
          <a href={`/api/runs/${runId}/csv`} onClick={e=>e.stopPropagation()}
            style={{ border:'1px solid var(--b2)', background:'var(--s2)', color:'var(--text2)', padding:'5px 11px', borderRadius:9, fontSize:10, fontWeight:700, textDecoration:'none', fontFamily:'var(--font-mono)', letterSpacing:'.04em' }}>↓ CSV</a>
          <StatusPill status={runStatus} />
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration:0.25 }} style={{ color:'var(--text3)', fontSize:11, display:'block' }}>▼</motion.span>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }} transition={{ duration:0.28, ease:[0.22,1,0.36,1] }} style={{ overflow:'hidden' }}>
            <div style={{ padding:'16px 16px 20px', background:'var(--bg)' }}>

              {(bestRmse !== Infinity || totalTime > 0) && (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))', gap:10, marginBottom:14 }}>
                  <KpiCard label="Best RMSE (analysis)" value={bestRmse !== Infinity ? bestRmse.toExponential(3) : '—'} sub="analysis phase" color="var(--blue)" icon="◎" />
                  <KpiCard label="Total CPU time" value={totalTime > 0 ? `${totalTime.toFixed(2)}s` : '—'} sub="all methods" color="var(--terra)" icon="⏱" />
                  <KpiCard label="Methods" value={total} sub={`${nDone} completed`} color="var(--green)" icon="≡" />
                  {bestRmse !== Infinity && allIds.length > 1 && (() => {
                    const worst = Math.max(...allIds.map(id=>safeNum(metrics[id]?.rmse_a)??-Infinity).filter(v=>v!==-Infinity))
                    const gain = worst > 0 ? ((1 - bestRmse/worst)*100).toFixed(1) : null
                    return gain ? <KpiCard label="Best vs worst" value={`${gain}%`} sub="RMSE reduction" color="var(--amber)" icon="↑" /> : null
                  })()}
                </div>
              )}

              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, marginBottom:14, flexWrap:'wrap' }}>
                <div style={{ display:'flex', flexWrap:'wrap', gap:7, flex:1 }}>
                  {allIds.map(id => <ChipStatus key={id} label={instancesById[id]?.label||id.slice(0,8)} status={statuses[id]||'queued'} />)}
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:4, background:'var(--s2)', borderRadius:10, padding:3, border:'1px solid var(--b2)', flexShrink:0 }}>
                  <span style={{ color:'var(--text3)', fontSize:9, fontFamily:'var(--font-mono)', padding:'0 8px', textTransform:'uppercase', letterSpacing:'.07em' }}>Y</span>
                  {['linear','log'].map(m => (
                    <button key={m} onClick={() => setScaleMode(m)} style={{ border:'none', borderRadius:7, padding:'5px 12px', cursor:'pointer', fontSize:10, fontFamily:'var(--font-mono)', fontWeight:700, background: scaleMode===m ? 'var(--blue)' : 'transparent', color: scaleMode===m ? '#fff' : 'var(--text3)', transition:'all .15s', letterSpacing:'.04em' }}>{m}</button>
                  ))}
                </div>
              </div>

              <SectionToggle title="📈 Analysis Error Time Series" badge="streaming" accentColor="linear-gradient(90deg,var(--blue),var(--blue2))" open={true} onToggle={() => {}}>
                <ChartBox id={`chart-${runId}`} />
              </SectionToggle>

              <SectionToggle title="📉 Background vs Analysis RMSE" badge="solid=analysis · dotted=background" accentColor="linear-gradient(90deg,var(--terra),#d4865c)" open={showBg} onToggle={() => setShowBg(v=>!v)}>
                <ChartBox id={`bgChart-${runId}`} />
              </SectionToggle>

              <SectionToggle title="🌊 Ensemble Spread Evolution" badge="NEW · ±local variance band" accentColor="linear-gradient(90deg,#0f6680,#1a7a99)" open={showSpread} onToggle={() => setShowSpread(v=>!v)}>
                <ChartBox id={`spread-${runId}`} title="RMSE ± Rolling Spread" subtitle="Shaded band = local std deviation over a 5-step rolling window — wider = less stable" gradient="linear-gradient(145deg,rgba(15,102,128,.05) 0%,var(--s2) 100%)" />
              </SectionToggle>

              <SectionToggle title="🎻 RMSE Distribution Fingerprint" badge="NEW · violin plot" accentColor="linear-gradient(90deg,#6b3fa0,#8b5cf6)" open={showConv} onToggle={() => setShowConv(v=>!v)}>
                <ChartBox id={`convergence-${runId}`} title="Full RMSE Distribution per Method — Violin" subtitle="Box + mean line inside each violin. Outliers shown as dots. Narrower = more stable convergence." gradient="linear-gradient(145deg,rgba(107,63,160,.05) 0%,var(--s2) 100%)" />
              </SectionToggle>

              <SectionToggle title="📊 Summary Metrics & Pareto" badge="RMSE · improvement · runtime" accentColor="linear-gradient(90deg,var(--green),#22c55e)" open={showMetrics} onToggle={() => setShowMetrics(v=>!v)}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
                  <ChartBox id={`radar-${runId}`} minHeight={280} title="RMSE Radar — Background vs Analysis" />
                  <ChartBox id={`polar-${runId}`} minHeight={280} title="RMSE Improvement % — Polar" />
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
                  <ChartBox id={`runtime-${runId}`} minHeight={220} title="Runtime by Method (seconds)" />
                  <ChartBox id={`scatter-${runId}`} minHeight={220} title="RMSE vs Runtime — Pareto" />
                </div>
                <div style={{ borderRadius:14, overflow:'hidden', border:'1px solid var(--b2)', boxShadow:'0 1px 4px rgba(60,50,40,.05)' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse', fontSize:11, background:'var(--s1)', fontFamily:'var(--font-mono)' }}>
                    <thead>
                      <tr style={{ background:'linear-gradient(90deg,rgba(30,58,95,.04),rgba(176,90,47,.03))' }}>
                        {['Method','Status','RMSE (analysis)','RMSE (background)','Final','Mean','Min','Runtime (s)','Params'].map(h => (
                          <th key={h} style={{ borderBottom:'1px solid var(--b2)', padding:'10px 12px', textAlign:'left', color:'var(--text3)', fontWeight:700, fontSize:9, letterSpacing:'.1em', textTransform:'uppercase' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {allIds.map((id,i) => {
                        const meta=instancesById[id]||{}; const m=metrics[id]||{}; const rt=runtimes[id]
                        const col = colorFor(meta.label||meta.name||id)
                        return (
                          <tr key={id} style={{ borderBottom:'1px solid var(--b2)', background: i%2===0 ? 'var(--s1)' : 'var(--s2)' }}>
                            <td style={{ padding:'10px 12px' }}>
                              <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                                <span style={{ width:8,height:8,borderRadius:'50%',background:col,flexShrink:0 }} />
                                <strong style={{ color:'var(--blue)', fontSize:11 }}>{meta.label||meta.name||id.slice(0,8)}</strong>
                              </div>
                              <div style={{ fontSize:9,color:'var(--text3)',marginTop:2,paddingLeft:15 }}>{id.slice(0,12)}…</div>
                            </td>
                            <td style={{ padding:'10px 12px' }}><StatusPill status={statuses[id]||'queued'} /></td>
                            {[m.rmse_a,m.rmse_b,m.final,m.mean,m.min].map((v,j) => (
                              <td key={j} style={{ padding:'10px 12px', color:'var(--text)', fontVariantNumeric:'tabular-nums' }}>{fmtNum(v)}</td>
                            ))}
                            <td style={{ padding:'10px 12px', color:'var(--text)', fontVariantNumeric:'tabular-nums' }}>{rt!=null?Number(rt).toFixed(3):'—'}</td>
                            <td style={{ padding:'10px 12px', color:'var(--text3)', fontSize:9 }}>{JSON.stringify(meta.params||{})}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </SectionToggle>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes statusSpin { 0%,100% { transform:scale(1);opacity:1 } 50% { transform:scale(.4);opacity:.4 } }
        @keyframes pulse { 0%,100% { opacity:1;transform:scale(1) } 50% { opacity:.4;transform:scale(.7) } }
      `}</style>
    </motion.div>
  )
}
