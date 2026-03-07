import { useState, useEffect, useRef, useCallback } from 'react'

const SSE_TYPES = [
  'hello','keepalive','run_created','run_started',
  'method_started','partial','method_completed',
  'run_completed','run_failed','done',
]

export function useRunSSE(runId) {
  const [runStatus, setRunStatus]         = useState('queued')
  const [runSubtitle, setRunSubtitle]     = useState('Queued…')
  const [instancesById, setInstancesById] = useState({})
  const [statuses, setStatuses]           = useState({})
  const [seriesA, setSeriesA]             = useState({})
  const [seriesB, setSeriesB]             = useState({})
  const [metrics, setMetrics]             = useState({})
  const [runtimes, setRuntimes]           = useState({})

  const esRef       = useRef(null)
  const lastIdRef   = useRef(0)
  const bufferA     = useRef({})
  const bufferB     = useRef({})
  const flushTimer  = useRef(null)

  // Flush buffered partial data to state
  const flushBuffers = useCallback(() => {
    const a = { ...bufferA.current }
    const b = { ...bufferB.current }
    setSeriesA(prev => {
      const next = { ...prev }
      for (const [id, pts] of Object.entries(a)) next[id] = pts
      return next
    })
    setSeriesB(prev => {
      const next = { ...prev }
      for (const [id, pts] of Object.entries(b)) next[id] = pts
      return next
    })
  }, [])

  useEffect(() => {
    if (!runId) return
    const url = `/api/runs/${runId}/events?since=0`
    const es = new EventSource(url)
    esRef.current = es

    function handle(ev) {
      let d = {}
      try { d = JSON.parse(ev.data || '{}') } catch(e) {}
      if (typeof d._event_id === 'number') lastIdRef.current = d._event_id

      if (ev.type === 'run_started') {
        setRunStatus('running')
        setRunSubtitle('Running…')
      }

      if (ev.type === 'method_started') {
        setStatuses(p => ({ ...p, [d.method_id]: 'running' }))
        setInstancesById(p => ({
          ...p,
          [d.method_id]: p[d.method_id] || { name: d.name, label: d.label, params: d.params }
        }))
      }

      if (ev.type === 'partial') {
        const mid = d.method_id
        if (!bufferA.current[mid]) bufferA.current[mid] = []
        if (!bufferB.current[mid]) bufferB.current[mid] = []
        bufferA.current[mid] = [...bufferA.current[mid], { x: d.t, y: d.error_a }]
        if (d.error_b !== undefined) bufferB.current[mid] = [...bufferB.current[mid], { x: d.t, y: d.error_b }]

        clearTimeout(flushTimer.current)
        flushTimer.current = setTimeout(flushBuffers, 180)
      }

      if (ev.type === 'method_completed') {
        setStatuses(p => ({ ...p, [d.method_id]: 'completed' }))
        setMetrics(p => ({ ...p, [d.method_id]: d.metrics || {} }))
        setRuntimes(p => ({ ...p, [d.method_id]: d.runtime_sec }))
        flushBuffers()
      }

      if (ev.type === 'run_completed') {
        setRunStatus('completed')
        setRunSubtitle('Completed')
        flushBuffers()
        es.close()
      }

      if (ev.type === 'run_failed') {
        setRunStatus('failed')
        setRunSubtitle(`Failed: ${d.error || 'unknown'}`)
        es.close()
      }
    }

    SSE_TYPES.forEach(t => es.addEventListener(t, handle))
    es.onerror = () => {}

    return () => {
      clearTimeout(flushTimer.current)
      es.close()
    }
  }, [runId, flushBuffers])

  return { runStatus, runSubtitle, instancesById, statuses, seriesA, seriesB, metrics, runtimes }
}
