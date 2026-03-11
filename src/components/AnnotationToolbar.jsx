import Icon from './Icon'
import styles from './AnnotationToolbar.module.css'

const TOOLS = [
  { key: 'pen',    icon: 'pen',    label: 'Pen' },
  { key: 'eraser', icon: 'eraser', label: 'Eraser' },
  { key: 'circle', icon: 'circle', label: 'Circle' },
  { key: 'arrow',  icon: 'arrow',  label: 'Arrow' },
  { key: 'text',   icon: 'text',   label: 'Text' },
]

const COLORS = ['#ff3c3c','#ff9900','#ffe500','#00ff88','#00cfff','#bf5fff','#ffffff']

export default function AnnotationToolbar({ tool, setTool, color, setColor, size, setSize, onUndo, onClear, canUndo }) {
  return (
    <div className={styles.toolbar}>
      {/* Tools */}
      <div className={styles.group}>
        {TOOLS.map((t) => (
          <button
            key={t.key}
            className={`${styles.toolBtn} ${tool === t.key ? styles.active : ''}`}
            onClick={() => setTool(t.key)}
            title={t.label}
            aria-label={t.label}
          >
            <Icon name={t.icon} size={14} />
          </button>
        ))}
      </div>

      <div className={styles.divider} />

      {/* Colors */}
      <div className={styles.group}>
        {COLORS.map((c) => (
          <button
            key={c}
            className={`${styles.colorDot} ${color === c ? styles.colorActive : ''}`}
            style={{ background: c }}
            onClick={() => setColor(c)}
            aria-label={`Color ${c}`}
          />
        ))}
      </div>

      <div className={styles.divider} />

      {/* Size */}
      <input
        type="range" min="1" max="10" value={size}
        onChange={(e) => setSize(Number(e.target.value))}
        className={styles.sizeSlider}
        title="Brush size"
        aria-label="Brush size"
      />

      <div className={styles.divider} />

      {/* Undo / Clear */}
      <button
        className={styles.toolBtn}
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo"
        aria-label="Undo"
      >
        <Icon name="undo" size={14} />
      </button>
      <button
        className={`${styles.toolBtn} ${styles.danger}`}
        onClick={onClear}
        title="Clear all annotations"
        aria-label="Clear annotations"
      >
        <Icon name="trash" size={14} />
      </button>
    </div>
  )
}
