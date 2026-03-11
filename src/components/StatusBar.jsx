import { formatTime, formatSize } from '../utils/formatters'
import styles from './StatusBar.module.css'

const STATUS_LABEL = {
  idle:      'READY',
  recording: '● RECORDING',
  paused:    '⏸ PAUSED',
  preview:   '▶ PREVIEW',
}

export default function StatusBar({ status, elapsed, fileSize }) {
  return (
    <div className={`${styles.bar} ${status === 'recording' ? styles.isRecording : ''} ${status === 'paused' ? styles.isPaused : ''} ${status === 'preview' ? styles.isPreview : ''}`}>
      <div className={styles.dotWrap}>
        <div className={`${styles.dot} ${styles[status] || ''}`} aria-hidden="true" />
      </div>
      <div className={styles.timer} key={elapsed}>{formatTime(elapsed)}</div>
      {fileSize > 0 && (
        <div className={styles.size}>{formatSize(fileSize)}</div>
      )}
      <div className={styles.label}>{STATUS_LABEL[status] || 'READY'}</div>
    </div>
  )
}
