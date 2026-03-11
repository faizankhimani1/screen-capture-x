import styles from './SettingsPanel.module.css'

export default function SettingsPanel({ quality, onQualityChange, annotSize, onAnnotSizeChange, disabled }) {
  return (
    <div className={styles.panel}>
      <div className={styles.title}>Settings</div>

      <div className={styles.row}>
        <span className={styles.label}>RECORDING QUALITY</span>
        <select
          className={styles.select}
          value={quality}
          onChange={(e) => onQualityChange(e.target.value)}
          disabled={disabled}
        >
          <option value="1080p">1080p — Full HD</option>
          <option value="720p">720p — HD</option>
          <option value="480p">480p — SD</option>
        </select>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>ANNOTATION SIZE</span>
        <div className={styles.sliderWrap}>
          <input
            type="range" min="1" max="10"
            value={annotSize}
            onChange={(e) => onAnnotSizeChange(Number(e.target.value))}
            className={styles.slider}
          />
          <span className={styles.sliderVal}>{annotSize}</span>
        </div>
      </div>

      {disabled && (
        <p className={styles.note}>⚠ Stop recording to change quality</p>
      )}
    </div>
  )
}
