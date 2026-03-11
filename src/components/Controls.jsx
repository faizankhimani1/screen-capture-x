import Icon from './Icon'
import styles from './Controls.module.css'

export default function Controls({
  status,
  audioEnabled, onAudioToggle,
  webcamEnabled, onWebcamToggle,
  annotating,   onAnnotateToggle,
  onScreenshot,                        // ✅ 1. Prop add kiya
  onStart, onStop, onTogglePause,
}) {
  const isActive  = status === 'recording' || status === 'paused'
  const isPreview = status === 'preview'

  return (
    <div className={styles.wrap}>
      {/* Option toggles */}
      <div className={styles.options}>
        <button
          className={`${styles.optBtn} ${audioEnabled ? styles.optActive : ''}`}
          onClick={onAudioToggle}
          disabled={isActive}
          title="Toggle microphone"
        >
          <Icon name={audioEnabled ? 'mic' : 'micOff'} size={14} />
          {audioEnabled ? 'MIC ON' : 'MIC OFF'}
        </button>

        <button
          className={`${styles.optBtn} ${webcamEnabled ? styles.optActive : ''}`}
          onClick={onWebcamToggle}
          disabled={isActive}
          title="Toggle webcam"
        >
          <Icon name={webcamEnabled ? 'camera' : 'cameraOff'} size={14} />
          {webcamEnabled ? 'CAM ON' : 'CAM OFF'}
        </button>

        <button
          className={`${styles.optBtn} ${annotating ? styles.optActive : ''}`}
          onClick={onAnnotateToggle}
          disabled={!isActive}
          title="Toggle annotation tools"
        >
          <Icon name="pen" size={14} />
          ANNOTATE
        </button>

        {/* ✅ 2. Screenshot button add kiya */}
        <button
          className={styles.optBtn}
          onClick={onScreenshot}
          title="Take Screenshot"
        >
          <Icon name="camera" size={14} />
          SCREENSHOT
        </button>
      </div>

      {/* Main controls */}
      {!isPreview && (
        <div className={styles.controls}>
          <button
            className={styles.recBtn}
            onClick={isActive ? onStop : onStart}
            aria-label={isActive ? 'Stop recording' : 'Start recording'}
          >
            <Icon name={isActive ? 'stop' : 'record'} size={18} fill={isActive ? 'currentColor' : 'none'} />
            {isActive ? 'STOP RECORDING' : 'START RECORDING'}
          </button>

          {isActive && (
            <button
              className={styles.ctrlBtn}
              onClick={onTogglePause}
              aria-label={status === 'paused' ? 'Resume' : 'Pause'}
            >
              <Icon name={status === 'paused' ? 'play' : 'pause'} size={16} />
              {status === 'paused' ? 'RESUME' : 'PAUSE'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}