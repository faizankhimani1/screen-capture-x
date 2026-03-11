import { useState } from 'react'

// Hooks
import { useRecorder }     from './hooks/useRecorder'
import { useWebcam }       from './hooks/useWebcam'
import { useAnnotations }  from './hooks/useAnnotations'
import { useTimer }        from './hooks/useTimer'
import { useScreenshot }   from './hooks/useScreenshot'

// Components
import Header            from './components/Header'
import StatusBar         from './components/StatusBar'
import SettingsPanel     from './components/SettingsPanel'
import Controls          from './components/Controls'
import AnnotationToolbar from './components/AnnotationToolbar'
import ScreenArea        from './components/ScreenArea'
import PreviewActions    from './components/PreviewActions'
import RecordingsList    from './components/RecordingsList'
import Footer            from './components/Footer'
import CustomCursor      from './components/CustomCursor'

import styles from './App.module.css'

export default function App() {
  // Settings state
  const [quality, setQuality]           = useState('1080p')
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [showSettings, setShowSettings] = useState(false)

  // Hooks
  const webcam   = useWebcam()
  const annot    = useAnnotations()
  const recorder = useRecorder({ audioEnabled, quality })
  const { elapsed }        = useTimer(recorder.status)
  const { takeScreenshot } = useScreenshot()

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleStart = async () => {
    await recorder.startRecording()
  }

  const handleStop = () => {
    recorder.stopRecording()
    if (annot.enabled) annot.toggle()
  }

  const handleAnnotateToggle = () => {
    if (recorder.status === 'recording' || recorder.status === 'paused') {
      annot.toggle()
    }
  }

  const isActive = recorder.status === 'recording' || recorder.status === 'paused'

  return (
    <div className={styles.root}>
      <CustomCursor />
      <div className={styles.card}>

        <Header onSettingsClick={() => setShowSettings((v) => !v)} />

        <StatusBar
          status={recorder.status}
          elapsed={elapsed}
          fileSize={recorder.fileSize}
        />

        <main className={styles.body}>

          {showSettings && (
            <SettingsPanel
              quality={quality}
              onQualityChange={setQuality}
              annotSize={annot.size}
              onAnnotSizeChange={annot.setSize}
              disabled={isActive}
            />
          )}

          <Controls
            status={recorder.status}
            audioEnabled={audioEnabled}
            onAudioToggle={() => setAudioEnabled((v) => !v)}
            webcamEnabled={webcam.enabled}
            onWebcamToggle={webcam.toggle}
            annotating={annot.enabled}
            onAnnotateToggle={handleAnnotateToggle}
            onScreenshot={takeScreenshot}             
            onStart={handleStart}
            onStop={handleStop}
            onTogglePause={recorder.togglePause}
          />

          {annot.enabled && isActive && (
            <AnnotationToolbar
              tool={annot.tool}       setTool={annot.setTool}
              color={annot.color}     setColor={annot.setColor}
              size={annot.size}       setSize={annot.setSize}
              onUndo={annot.undo}     onClear={annot.clear}
              canUndo={annot.undoStack.length > 0}
            />
          )}

          <ScreenArea
            status={recorder.status}
            currentBlob={recorder.currentBlob}
            webcamEnabled={webcam.enabled}
            webcamVideoRef={webcam.videoRef}
            annotating={annot.enabled}
            annotations={annot.annotations}
            currentPath={annot.currentPath}
            svgRef={annot.svgRef}
            onMouseDown={annot.onMouseDown}
            onMouseMove={annot.onMouseMove}
            onMouseUp={annot.onMouseUp}
          />

          {recorder.status === 'preview' && (
            <PreviewActions
              fileSize={recorder.fileSize}
              onSave={recorder.saveRecording}
              onDiscard={recorder.discardRecording}
            />
          )}

          <RecordingsList
            recordings={recorder.recordings}
            onRename={recorder.renameRecording}
            onDelete={recorder.deleteRecording}
          />

        </main>
      </div>

      <Footer />
    </div>
  )
}