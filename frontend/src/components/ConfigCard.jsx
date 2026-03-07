import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { uuidShort, humanLabel } from '../lib/utils.js'
import { colorFor } from '../lib/colors.js'

function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
      letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text3)',
      marginBottom: 14, marginTop: 8,
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      {children}
      <div style={{ flex: 1, height: 1, background: 'var(--b2)' }} />
    </div>
  )
}

function FieldLabel({ children }) {
  return (
    <label style={{
      display: 'block', fontSize: 10, fontWeight: 600,
      color: 'var(--text3)', letterSpacing: '.08em',
      textTransform: 'uppercase', marginBottom: 6,
      fontFamily: 'var(--font-mono)',
    }}>{children}</label>
  )
}

function Input({ type='text', value, onChange, step, min, disabled }) {
  const [focused, setFocused] = useState(false)
  return (
    <input type={type} value={value} onChange={onChange} step={step} min={min} disabled={disabled}
      style={{
        width: '100%', padding: '9px 12px', borderRadius: 10,
        border: `1px solid ${focused ? 'var(--blue)' : 'var(--b2)'}`,
        outline: 'none', background: disabled ? 'var(--s3)' : 'var(--s1)',
        color: disabled ? 'var(--text3)' : 'var(--text)',
        fontFamily: 'var(--font-mono)', fontSize: 13,
        boxShadow: focused ? '0 0 0 3px rgba(30,58,95,.08)' : 'var(--shadow-sm)',
        transition: 'all .2s', cursor: disabled ? 'not-allowed' : 'auto',
      }}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    />
  )
}

function MethodChip({ name, count, onClick }) {
  const [hov, setHov] = useState(false)
  const selected = count > 0
  return (
    <motion.div whileHover={{ y: -1 }} whileTap={{ scale: .97 }}
      onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '7px 14px', borderRadius: 999, cursor: 'pointer',
        border: `1px solid ${selected ? 'var(--blue)' : hov ? 'var(--b3)' : 'var(--b2)'}`,
        background: selected ? 'var(--blue-l)' : hov ? 'var(--s2)' : 'var(--s1)',
        color: selected ? 'var(--blue)' : 'var(--text2)',
        fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
        boxShadow: selected ? '0 2px 12px rgba(30,58,95,.1)' : 'var(--shadow-sm)',
        transition: 'all .18s', userSelect: 'none',
      }}
    >
      <span style={{
        width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
        background: selected ? 'var(--blue)' : 'var(--b3)',
        transition: 'background .2s',
      }} />
      {name}
      <span style={{
        padding: '1px 7px', borderRadius: 999, fontSize: 10, fontWeight: 700,
        background: selected ? 'rgba(30,58,95,.12)' : 'var(--s3)',
        color: selected ? 'var(--blue)' : 'var(--text3)',
      }}>{count}</span>
    </motion.div>
  )
}

function MethodTablet({ inst, schema, onRemove, onMoveUp, onMoveDown, isFirst, isLast, onUpdate }) {
  const [open, setOpen] = useState(false)
  const col = colorFor(inst.label)
  const paramKeys = Object.keys(schema || {})

  return (
    <motion.div layout
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
      style={{
        background: 'var(--s1)', border: '1px solid var(--b2)',
        borderRadius: 14, overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)', transition: 'box-shadow .2s',
      }}
    >
      <div onClick={() => setOpen(o => !o)} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 12, padding: '11px 16px', cursor: 'pointer',
        background: open ? 'var(--s2)' : 'var(--s1)',
        borderBottom: open ? '1px solid var(--b2)' : 'none',
        transition: 'background .2s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <div style={{
            width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
            background: col, boxShadow: `0 0 0 3px ${col}22`,
          }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {inst.label}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>
              {inst.id.slice(0,16)}… · {inst.name}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          {[['↑', !isFirst, () => onMoveUp()], ['↓', !isLast, () => onMoveDown()]].map(([lbl, en, fn]) => (
            <button key={lbl} disabled={!en} onClick={e => { e.stopPropagation(); fn() }} style={{
              border: '1px solid var(--b2)', background: 'var(--s2)', color: 'var(--text2)',
              padding: '4px 8px', borderRadius: 6, cursor: en ? 'pointer' : 'not-allowed',
              fontSize: 11, fontWeight: 600, opacity: en ? 1 : .3, transition: 'all .15s',
            }}>{lbl}</button>
          ))}
          <button onClick={e => { e.stopPropagation(); onRemove() }} style={{
            border: '1px solid var(--b2)', background: 'var(--s2)', color: 'var(--text2)',
            padding: '4px 9px', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontWeight: 600,
          }}>Remove</button>
          <span style={{ color: 'var(--text3)', fontSize: 11, marginLeft: 2 }}>{open ? '▲' : '▼'}</span>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} style={{ overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', background: 'var(--s2)' }}>
              {paramKeys.length === 0
                ? <div style={{ color: 'var(--text3)', fontSize: 12 }}>No tunable parameters.</div>
                : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {paramKeys.map(k => {
                      const spec = schema[k] || { type: 'str', label: k }
                      return (
                        <div key={k}>
                          <FieldLabel>{spec.label || k}</FieldLabel>
                          {spec.type === 'bool'
                            ? <select value={String(!!inst.params[k])} onChange={e => onUpdate(k, e.target.value === 'true')} style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '1px solid var(--b2)', background: 'var(--s1)', color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: 13, outline: 'none' }}>
                                <option value="true">true</option><option value="false">false</option>
                              </select>
                            : <Input type={spec.type === 'int' || spec.type === 'float' ? 'number' : 'text'}
                                step={spec.type === 'float' ? (spec.step ?? 0.01) : spec.type === 'int' ? 1 : undefined}
                                min={spec.min} value={inst.params[k] ?? ''}
                                onChange={e => {
                                  const raw = e.target.value
                                  let val = raw
                                  if (spec.type === 'int') val = raw === '' ? '' : parseInt(raw, 10)
                                  else if (spec.type === 'float') val = raw === '' ? '' : parseFloat(raw)
                                  onUpdate(k, val)
                                }} />
                          }
                        </div>
                      )
                    })}
                  </div>
                )
              }
              <div style={{ marginTop: 8, color: 'var(--text3)', fontSize: 11 }}>Label updates automatically with parameters.</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function ConfigCard({ meta, onRun, status }) {
  const [config, setConfig] = useState({ ensemble_size: 20, m: 32, std_obs: 0.01, inf_fact: 1.04, obs_freq: 0.1, end_time: 10 })
  const [instances, setInstances] = useState([])

  React.useEffect(() => {
    if (!meta || instances.length > 0) return
    if (meta.methods.includes('letkf')) {
      const make = r => { const params = { ...(meta.defaults?.letkf || {}), r }; return { id: uuidShort('mid'), name: 'letkf', params, label: humanLabel('letkf', params) } }
      setInstances([make(1), make(2)])
    } else if (meta.methods.length) {
      const name = meta.methods[0]; const params = { ...(meta.defaults?.[name] || {}) }
      setInstances([{ id: uuidShort('mid'), name, params, label: humanLabel(name, params) }])
    }
  }, [meta])

  const countByMethod = () => { const m = {}; instances.forEach(i => { m[i.name] = (m[i.name]||0)+1 }); return m }
  const addInstance = name => { const params = { ...(meta.defaults?.[name] || {}) }; setInstances(p => [...p, { id: uuidShort('mid'), name, params, label: humanLabel(name, params) }]) }
  const removeInstance = id => setInstances(p => p.filter(x => x.id !== id))
  const moveInstance = (id, dir) => setInstances(prev => { const next=[...prev]; const i=next.findIndex(x=>x.id===id); const j=i+dir; if(j<0||j>=next.length) return prev; [next[i],next[j]]=[next[j],next[i]]; return next })
  const updateParam = (id, key, val) => setInstances(prev => prev.map(inst => { if(inst.id!==id) return inst; const params={...inst.params,[key]:val}; return {...inst,params,label:humanLabel(inst.name,params)} }))

  const counts = countByMethod()
  const fields = [
    { id:'ensemble_size', label:'Ensemble size',    min:2,     step:1    },
    { id:'m',             label:'m (observations)', min:1,     step:1    },
    { id:'std_obs',       label:'std_obs (σ)',       min:0,     step:0.001},
    { id:'inf_fact',      label:'Inflation factor',  min:0,     step:0.01 },
    { id:'obs_freq',      label:'obs_freq',           min:0.001, step:0.01 },
    { id:'end_time',      label:'end_time',           min:0.1,   step:0.1  },
  ]

  const handleRun = () => {
    const methods = instances.map(inst => {
      const cleaned = {}
      for (const k of Object.keys(inst.params||{})) { const v=inst.params[k]; if(v===''||v===null||Number.isNaN(v)) continue; cleaned[k]=v }
      return { id:inst.id, name:inst.name, label:inst.label, params:cleaned }
    })
    onRun({ ...config, model:'lorenz96', methods })
  }

  return (
    <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.1 }}
      style={{
        background: 'var(--s1)', border: '1px solid var(--b2)',
        borderRadius: 20, padding: 24,
        boxShadow: 'var(--shadow)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Top accent */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:'linear-gradient(90deg,var(--blue),var(--terra))', borderRadius:'20px 20px 0 0' }} />

      <div style={{ marginTop: 8 }}>
        <SectionLabel>Benchmark Configuration</SectionLabel>
      </div>

      <FieldLabel>Model</FieldLabel>
      <input disabled value="Lorenz-96 (n=40, F=8)" style={{ width:'100%', padding:'9px 12px', borderRadius:10, border:'1px solid var(--b2)', background:'var(--s3)', color:'var(--text3)', fontFamily:'var(--font-mono)', fontSize:13, cursor:'not-allowed' }} />
      <div style={{ color:'var(--text3)', fontSize:11, marginTop:5 }}>Fixed to standard benchmark (<strong style={{color:'var(--text2)'}}>n=40</strong>, <strong style={{color:'var(--text2)'}}>F=8</strong>).</div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:10, marginTop:12 }}>
        {fields.map(f => (
          <div key={f.id}>
            <FieldLabel>{f.label}</FieldLabel>
            <Input type="number" min={f.min} step={f.step} value={config[f.id]}
              onChange={e => setConfig(p => ({...p,[f.id]:parseFloat(e.target.value)}))} />
          </div>
        ))}
      </div>

      <div style={{ marginTop: 22 }}>
        <SectionLabel>Method Instances</SectionLabel>
      </div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
        {meta?.methods.map(name => <MethodChip key={name} name={name} count={counts[name]||0} onClick={() => addInstance(name)} />)}
      </div>

      {/* Hint */}
      <div style={{
        marginTop:12, padding:'11px 14px', borderRadius:10,
        border:'1px dashed var(--b3)', background:'var(--s2)',
        color:'var(--text2)', fontSize:12, lineHeight:1.6,
        display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, flexWrap:'wrap',
      }}>
        <div style={{ flex:'1 1 360px' }}>
          Click a chip to add an instance. Same method can run multiple times with different params —
          e.g., <strong>LETKF r=1</strong> vs <strong>r=2</strong>.
        </div>
        <div style={{
          display:'inline-flex', alignItems:'center', gap:8,
          padding:'7px 14px', borderRadius:999,
          background:'var(--blue)', color:'#fff',
          fontWeight:700, fontSize:12, fontFamily:'var(--font-mono)',
          boxShadow:'0 4px 16px rgba(30,58,95,.25)',
        }}>{instances.length} selected</div>
      </div>

      <div style={{ marginTop:14, display:'flex', flexDirection:'column', gap:8 }}>
        <AnimatePresence>
          {instances.length === 0
            ? <motion.div initial={{opacity:0}} animate={{opacity:1}} style={{ color:'var(--text3)', fontSize:12, marginTop:4 }}>No methods selected. Add one using the chips above.</motion.div>
            : instances.map((inst,idx) => (
              <MethodTablet key={inst.id} inst={inst} schema={meta?.schema?.[inst.name]||{}}
                isFirst={idx===0} isLast={idx===instances.length-1}
                onRemove={() => removeInstance(inst.id)}
                onMoveUp={() => moveInstance(inst.id,-1)} onMoveDown={() => moveInstance(inst.id,+1)}
                onUpdate={(key,val) => updateParam(inst.id,key,val)} />
            ))
          }
        </AnimatePresence>
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:20, flexWrap:'wrap' }}>
        <motion.button whileHover={{ y:-1, boxShadow:'0 8px 32px rgba(30,58,95,.3)' }} whileTap={{ y:0 }}
          onClick={handleRun}
          style={{
            flex:'1 1 180px', padding:'13px 22px', borderRadius:12, border:0,
            cursor:'pointer', background:'var(--blue)',
            color:'#fff', fontFamily:'var(--font-display)', fontWeight:600, fontSize:15,
            letterSpacing:'.01em', boxShadow:'0 4px 20px rgba(30,58,95,.25)',
          }}>
          ▶ Run Benchmark
        </motion.button>
        <motion.button whileHover={{ y:-1 }} whileTap={{ y:0 }}
          onClick={() => setInstances([])}
          style={{
            padding:'12px 18px', borderRadius:12, border:'1px solid var(--b2)',
            background:'var(--s2)', color:'var(--text2)', cursor:'pointer', fontWeight:600, fontSize:13,
            boxShadow:'var(--shadow-sm)',
          }}>
          Clear methods
        </motion.button>
      </div>

      {status && <div style={{ marginTop:10, color:'var(--text3)', fontFamily:'var(--font-mono)', fontSize:12 }}>{status}</div>}
      <div style={{ marginTop:10, color:'var(--text3)', fontSize:11, lineHeight:1.55 }}>Tip: A CSV is generated per run for offline plotting and paper-ready figures.</div>
    </motion.div>
  )
}
