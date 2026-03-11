import styles from './WebcamPip.module.css'

export default function WebcamPip({ videoRef }) {
  return (
    <div className={styles.pip}>
      <video ref={videoRef} autoPlay muted playsInline className={styles.video} />
      <div className={styles.label}>CAM</div>
    </div>
  )
}
