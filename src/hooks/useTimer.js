import { useState, useEffect, useRef } from 'react'

/**
 * useTimer — tracks elapsed seconds
 * FIX: reset karta hai jab status 'idle' se 'recording' hota hai
 */
export function useTimer(status) {
  const [elapsed, setElapsed] = useState(0)
  const intervalRef  = useRef(null)
  const prevStatus   = useRef(status)

  useEffect(() => {
    // Naya recording start — reset + start
    if (status === 'recording' && prevStatus.current !== 'recording' && prevStatus.current !== 'paused') {
      setElapsed(0)
    }
    prevStatus.current = status

    if (status === 'recording') {
      clearInterval(intervalRef.current)
      intervalRef.current = setInterval(() => setElapsed((e) => e + 1), 1000)
    } else {
      clearInterval(intervalRef.current)
    }

    // idle pe full reset
    if (status === 'idle') {
      setElapsed(0)
    }

    return () => clearInterval(intervalRef.current)
  }, [status])

  return { elapsed }
}
