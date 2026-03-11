import { useCursor } from '../hooks/useCursor'
import styles from './CustomCursor.module.css'

export default function CustomCursor() {
  const { ring, dot, isHover, isClick, trail } = useCursor()

  return (
    <>
      {/* Trail particles — rendered behind everything */}
      {trail.map((p, i) => (
        <div
          key={p.id}
          className={styles.particle}
          style={{
            left:      p.x,
            top:       p.y,
            opacity:   p.life * 0.35,
            transform: `translate(-50%, -50%) scale(${p.life * 0.7})`,
            width:     `${p.life * 7}px`,
            height:    `${p.life * 7}px`,
          }}
        />
      ))}

      {/* Outer ring — smooth lerp lag */}
      <div
        className={`${styles.ring} ${isHover ? styles.ringHover : ''} ${isClick ? styles.ringClick : ''}`}
        style={{
          transform: `translate(${ring.x - 16}px, ${ring.y - 16}px)`,
        }}
      />

      {/* Inner dot — instant, exact position */}
      <div
        className={`${styles.dot} ${isHover ? styles.dotHover : ''} ${isClick ? styles.dotClick : ''}`}
        style={{
          transform: `translate(${dot.x - 3}px, ${dot.y - 3}px)`,
        }}
      />
    </>
  )
}
