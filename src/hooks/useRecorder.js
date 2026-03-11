import { useState, useRef, useCallback } from 'react'
import { generateFilename } from '../utils/formatters'

/**
 * Status values:
 *   idle       → not recording
 *   recording  → actively recording
 *   paused     → recording paused
 *   preview    → stopped, showing preview before save/discard
 */

export function useRecorder({ audioEnabled, quality }) {
  const [status, setStatus]         = useState('idle')
  const [currentBlob, setCurrentBlob] = useState(null)
  const [fileSize, setFileSize]     = useState(0)
  const [recordings, setRecordings] = useState([])

  const mediaRecorderRef = useRef(null)
  const chunksRef        = useRef([])
  const screenStreamRef  = useRef(null)

  // ── Quality map ──────────────────────────────────────────────────────────
  const qualityMap = {
    '1080p': { width: 1920, height: 1080 },
    '720p':  { width: 1280, height: 720  },
    '480p':  { width: 854,  height: 480  },
  }

  // ── Start ─────────────────────────────────────────────────────────────────
  const startRecording = useCallback(async () => {
    try {
      const videoConstraints = qualityMap[quality] || qualityMap['1080p']

      // Ask user to pick screen / window / tab
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: videoConstraints,
        audio: audioEnabled, // system audio if available
      })
      screenStreamRef.current = screenStream

      // Collect all tracks (screen video + system audio)
      const tracks = [...screenStream.getTracks()]

      // Also ask for microphone
      if (audioEnabled) {
        try {
          const micStream = await navigator.mediaDevices.getUserMedia({ audio: true })
          micStream.getAudioTracks().forEach((t) => tracks.push(t))
        } catch (_) {
          // Mic permission denied — continue without mic
        }
      }

      const combinedStream = new MediaStream(tracks)

      // Pick best supported codec
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm'

      const recorder = new MediaRecorder(combinedStream, { mimeType })
      chunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' })
        setCurrentBlob(blob)
        setFileSize(blob.size)
        setStatus('preview')
        // Stop screen stream tracks
        screenStream.getTracks().forEach((t) => t.stop())
      }

      recorder.start(100) // collect data every 100ms
      mediaRecorderRef.current = recorder
      setStatus('recording')

      // If user stops sharing via browser UI
      screenStream.getVideoTracks()[0].onended = () => {
        stopRecording()
      }
    } catch (err) {
      console.error('Recording failed:', err)
      setStatus('idle')
    }
  }, [audioEnabled, quality])

  // ── Stop ──────────────────────────────────────────────────────────────────
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
  }, [])

  // ── Pause / Resume ────────────────────────────────────────────────────────
  const togglePause = useCallback(() => {
    const rec = mediaRecorderRef.current
    if (!rec) return
    if (status === 'recording') {
      rec.pause()
      setStatus('paused')
    } else if (status === 'paused') {
      rec.resume()
      setStatus('recording')
    }
  }, [status])

  // ── Save (add to list + download) ─────────────────────────────────────────
  const saveRecording = useCallback((customName) => {
    if (!currentBlob) return
    const url  = URL.createObjectURL(currentBlob)
    const name = customName || generateFilename()

    setRecordings((prev) => [
      { id: Date.now(), url, name, size: currentBlob.size, date: new Date() },
      ...prev,
    ])

    // Trigger download
    const a = document.createElement('a')
    a.href     = url
    a.download = name
    a.click()

    // Reset
    setCurrentBlob(null)
    setFileSize(0)
    setStatus('idle')
  }, [currentBlob])

  // ── Discard ───────────────────────────────────────────────────────────────
  const discardRecording = useCallback(() => {
    setCurrentBlob(null)
    setFileSize(0)
    setStatus('idle')
  }, [])

  // ── Rename saved recording ────────────────────────────────────────────────
  const renameRecording = useCallback((id, newName) => {
    setRecordings((prev) =>
      prev.map((r) => (r.id === id ? { ...r, name: newName + '.webm' } : r))
    )
  }, [])

  // ── Delete saved recording ────────────────────────────────────────────────
  const deleteRecording = useCallback((id) => {
    setRecordings((prev) => prev.filter((r) => r.id !== id))
  }, [])

  return {
    status,
    currentBlob,
    fileSize,
    recordings,
    startRecording,
    stopRecording,
    togglePause,
    saveRecording,
    discardRecording,
    renameRecording,
    deleteRecording,
  }
}
