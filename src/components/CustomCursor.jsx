import { useEffect, useRef } from 'react'
import styles from './CustomCursor.module.css'

export default function CustomCursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mx = -200, my = -200   // exact mouse
    let rx = -200, ry = -200   // ring lerp
    let rot = 0
    let raf
 
    // Trail elements — raw DOM, no React
    const TRAIL_COUNT = 10
    const trails = Array.from({ length: TRAIL_COUNT }, (_, i) => {
      const el = document.createElement('div')
      const size = 6 * (1 - i / TRAIL_COUNT)
      el.style.cssText = `
        position:fixed;top:0;left:0;
        width:${size}px;height:${size}px;
        border-radius:50%;
        background:rgba(255,60,60,${0.55 * (1 - i / TRAIL_COUNT)});
        pointer-events:none;
        z-index:999990;
        will-change:transform;
        backface-visibility:hidden;
      `
      document.body.appendChild(el)
      return { el, x: -200, y: -200 }
    })

    // RAF loop — ONLY place DOM is touched
    const tick = () => {
      // Dot — zero lag, instant
      dot.style.transform = `translate(${mx - 3}px,${my - 3}px)`

      // Ring — lerp position only, rotate continuously
      rx += (mx - rx) * 0.09
      ry += (my - ry) * 0.09
      rot += 0.4
      ring.style.transform = `translate(${rx - 16}px,${ry - 16}px) rotate(${rot}deg)`

      // Trail — snake chain
      let px = mx, py = my
      for (let i = 0; i < TRAIL_COUNT; i++) {
        const t = trails[i]
        const spd = 0.38 - i * 0.025
        t.x += (px - t.x) * spd
        t.y += (py - t.y) * spd
        t.el.style.transform = `translate(${t.x - 3}px,${t.y - 3}px)`
        px = t.x
        py = t.y
      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    // Events
    const onMove = (e) => { mx = e.clientX; my = e.clientY }

    const onOver = (e) => {
      if (e.target.closest('button,a,input,select,textarea,label,[role=button]')) {
        ring.classList.add(styles.hover)
        dot.classList.add(styles.dotHover)
      }
    }
    const onOut = (e) => {
      if (e.target.closest('button,a,input,select,textarea,label,[role=button]')) {
        ring.classList.remove(styles.hover)
        dot.classList.remove(styles.dotHover)
      }
    }
    const onDown = () => {
      ring.classList.add(styles.click)
      dot.classList.add(styles.dotClick)
    }
    const onUp = () => {
      ring.classList.remove(styles.click)
      dot.classList.remove(styles.dotClick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup',   onUp)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout',  onOut)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup',   onUp)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout',  onOut)
      trails.forEach(t => t.el.parentNode?.removeChild(t.el))
    }
  }, [])

  return (
    <>
      <div ref={ringRef} className={styles.ring} />
      <div ref={dotRef}  className={styles.dot}  />
    </>
  )
}
