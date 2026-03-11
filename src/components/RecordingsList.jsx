import { useState } from 'react'
import Icon from './Icon'
import { formatSize } from '../utils/formatters'
import styles from './RecordingsList.module.css'

export default function RecordingsList({ recordings, onRename, onDelete }) {
  const [renamingId, setRenamingId] = useState(null)
  const [renameVal, setRenameVal]   = useState('')

  const startRename = (rec) => {
    setRenamingId(rec.id)
    setRenameVal(rec.name.replace('.webm', ''))
  }

  const confirmRename = (id) => {
    if (renameVal.trim()) onRename(id, renameVal.trim())
    setRenamingId(null)
  }

  if (recordings.length === 0) return null

  return (
    <div className={styles.section}>
      <div className={styles.title}>
        Saved Recordings <span className={styles.count}>({recordings.length})</span>
      </div>

      {recordings.map((rec) => (
        <div className={styles.item} key={rec.id}>
          <Icon name="record" size={12} fill="#ff3c3c" stroke="none" />

          {renamingId === rec.id ? (
            <>
              <input
                className={styles.renameInput}
                value={renameVal}
                onChange={(e) => setRenameVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter')  confirmRename(rec.id)
                  if (e.key === 'Escape') setRenamingId(null)
                }}
                autoFocus
              />
              <span className={styles.ext}>.webm</span>
              <button className={`${styles.btn} ${styles.confirm}`} onClick={() => confirmRename(rec.id)} title="Save">
                <Icon name="check" size={13} />
              </button>
              <button className={styles.btn} onClick={() => setRenamingId(null)} title="Cancel">
                <Icon name="close" size={13} />
              </button>
            </>
          ) : (
            <>
              <span className={styles.name}>{rec.name}</span>
              <span className={styles.size}>{formatSize(rec.size)}</span>
              <button className={styles.btn} onClick={() => startRename(rec)} title="Rename">
                <Icon name="edit" size={13} />
              </button>
              <a href={rec.url} download={rec.name}>
                <button className={styles.btn} title="Download">
                  <Icon name="download" size={13} />
                </button>
              </a>
              <button className={`${styles.btn} ${styles.del}`} onClick={() => onDelete(rec.id)} title="Delete">
                <Icon name="trash" size={13} />
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
