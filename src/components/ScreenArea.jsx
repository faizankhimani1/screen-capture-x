import { useEffect, useRef } from 'react'
import WebcamPip from './WebcamPip'
import styles from './ScreenArea.module.css'

// Render a single SVG annotation shape
function AnnotShape({ ann, id }) {
  if (ann.type === 'path') {
    return (
      <path
        d={ann.d}
        stroke={ann.color}
        strokeWidth={ann.size * 0.8}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    )
  }
  if (ann.type === 'circle') {
    return (
      <circle
        cx={ann.cx} cy={ann.cy} r={ann.r}
        stroke={ann.color} strokeWidth={ann.size * 0.8}
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
    )
  }
  if (ann.type === 'arrow') {
    const angle = Math.atan2(ann.y2 - ann.y1, ann.x2 - ann.x1)
    const len = 3
    return (
      <g>
        <line
          x1={ann.x1} y1={ann.y1} x2={ann.x2} y2={ann.y2}
          stroke={ann.color} strokeWidth={ann.size * 0.8}
          vectorEffect="non-scaling-stroke"
        />
        <polygon
          points={`
            ${ann.x2},${ann.y2}
            ${ann.x2 - len * Math.cos(angle - 0.45)},${ann.y2 - len * Math.sin(angle - 0.45)}
            ${ann.x2 - len * Math.cos(angle + 0.45)},${ann.y2 - len * Math.sin(angle + 0.45)}
          `}
          fill={ann.color}
        />
      </g>
    )
  }
  if (ann.type === 'text') {
    return (
      <text
        x={ann.x} y={ann.y}
        fill={ann.color}
        fontSize={ann.size * 0.4}
        fontFamily="'DM Mono', monospace"
      >
        {ann.text}
      </text>
    )
  }
  return null
}

export default function ScreenArea({
  status,
  currentBlob,
  webcamEnabled,
  webcamVideoRef,
  annotating,
  annotations,
  currentPath,
  svgRef,
  onMouseDown,
  onMouseMove,
  onMouseUp,
}) {
  const previewVideoRef = useRef(null)

  // Load blob into preview video
  useEffect(() => {
    if (status === 'preview' && previewVideoRef.current && currentBlob) {
      previewVideoRef.current.src = URL.createObjectURL(currentBlob)
    }
  }, [status, currentBlob])

  return (
    <div className={styles.area}>
      {/* IDLE */}
      {status === 'idle' && (
        <div className={styles.idle}>
          <div className={styles.idleBig}>REC</div>
          <p className={styles.idleHint}>Click START RECORDING to begin</p>
          <p className={styles.idleSub}>Screen · Webcam · Audio · Annotations</p>
        </div>
      )}

      {/* RECORDING / PAUSED */}
      {(status === 'recording' || status === 'paused') && (
        <>
          <div className={styles.liveBadge}>● LIVE</div>
          <div className={styles.pulseBorder} />
          <div className={styles.recPlaceholder}>
            <div className={styles.recText}>
              {status === 'paused' ? 'PAUSED' : 'RECORDING'}
            </div>
            <div className={styles.recSub}>Screen capture active in background</div>
          </div>

          {/* SVG Annotation Layer */}
          <svg
            ref={svgRef}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className={styles.annotSvg}
            style={{ cursor: annotating ? 'crosshair' : 'default', pointerEvents: annotating ? 'all' : 'none' }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            {annotations.map((ann, i) => <AnnotShape key={i} ann={ann} />)}
            {currentPath && <AnnotShape ann={currentPath} id="current" />}
          </svg>
        </>
      )}

      {/* PREVIEW */}
      {status === 'preview' && (
        <video
          ref={previewVideoRef}
          controls
          className={styles.previewVideo}
        />
      )}

      {/* Webcam PiP */}
      {webcamEnabled && <WebcamPip videoRef={webcamVideoRef} />}
    </div>
  )
}
