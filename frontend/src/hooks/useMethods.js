import { useState, useEffect } from 'react'

export function useMethods() {
  const [meta, setMeta] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/methods')
      .then(r => r.json())
      .then(setMeta)
      .catch(e => setError(e.message))
  }, [])

  return { meta, error }
}
