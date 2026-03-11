import { useEffect, useRef, useState } from 'react'

/**
 * useCursor — ultra-smooth custom cursor
 * - Inner dot: snaps to cursor instantly via CSS transform (no JS lag)
 * - Outer ring: smooth lerp via RAF
 * - Trail: lightweight particle system
 */
export function useCursor() {
  const [ring, setRing]         = useState({ x: -200, y: -200 })
  const [dot, setDot]           = useState({ x: -200, y: -200 })
  const [isHover, setIsHover]   = useState(false)
  const [isClick, setIsClick]   = useState(false)
  const [trail, setTrail]       = useState([])

  const mouseRef  = useRef({ x: -200, y: -200 })
  const ringRef   = useRef({ x: -200, y: -200 })
  const rafRef    = useRef(null)
  const trailsRef = useRef([])
  const frameRef  = useRef(0)

  useEffect(() => {
    // RAF loop — smooth lerp for ring, trail decay
    const loop = () => {
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      // Lerp ring toward mouse — 0.1 = smooth, 0.2 = slightly faster
      ringRef.current.x += (mx - ringRef.current.x) * 0.10
      ringRef.current.y += (my - ringRef.current.y) * 0.10

      setRing({ x: ringRef.current.x, y: ringRef.current.y })
      setDot({ x: mx, y: my })

      // Decay trail every 2 frames
      frameRef.current++
      if (frameRef.current % 2 === 0) {
        trailsRef.current = trailsRef.current
          .map((p) => ({ ...p, life: p.life - 0.12 }))
          .filter((p) => p.life > 0)
        setTrail([...trailsRef.current])
      }

      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }

      // Add trail particle
      trailsRef.current = [
        { id: Date.now() + Math.random(), x: e.clientX, y: e.clientY, life: 1 },
        ...trailsRef.current.slice(0, 14),
      ]
    }

    const onDown  = () => setIsClick(true)
    const onUp    = () => setIsClick(false)

    const onOver  = (e) => {
      if (e.target.closest('button, a, input, select, textarea, label, [role="button"]')) {
        setIsHover(true)
      }
    }
    const onOut   = (e) => {
      if (e.target.closest('button, a, input, select, textarea, label, [role="button"]')) {
        setIsHover(false)
      }
    }

    window.addEventListener('mousemove',  onMove,  { passive: true })
    window.addEventListener('mousedown',  onDown)
    window.addEventListener('mouseup',    onUp)
    document.addEventListener('mouseover',  onOver)
    document.addEventListener('mouseout',   onOut)

    return () => {
      window.removeEventListener('mousemove',  onMove)
      window.removeEventListener('mousedown',  onDown)
      window.removeEventListener('mouseup',    onUp)
      document.removeEventListener('mouseover',  onOver)
      document.removeEventListener('mouseout',   onOut)
    }
  }, [])

  return { ring, dot, isHover, isClick, trail }
}
