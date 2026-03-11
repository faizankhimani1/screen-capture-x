import { useState } from 'react'
import Icon from './Icon'
import { formatSize } from '../utils/formatters'
import styles from './PreviewActions.module.css'

export default function PreviewActions({ fileSize, onSave, onDiscard }) {
  const [customName, setCustomName] = useState('')

  const handleSave = () => {
    onSave(customName.trim() ? customName.trim() + '.webm' : null)
    setCustomName('')
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.meta}>
        Preview ready — {formatSize(fileSize)}
      </div>

      {/* Optional custom name before save */}
      <div className={styles.nameRow}>
        <input
          className={styles.nameInput}
          placeholder="Custom filename (optional)"
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
        />
        <span className={styles.ext}>.webm</span>
      </div>

      <div className={styles.actions}>
        <button className={styles.saveBtn} onClick={handleSave}>
          <Icon name="download" size={18} stroke="#5dff5d" />
          SAVE & DOWNLOAD
        </button>
        <button className={`${styles.ctrlBtn} ${styles.danger}`} onClick={onDiscard}>
          <Icon name="trash" size={16} />
          DISCARD
        </button>
      </div>
    </div>
  )
}
