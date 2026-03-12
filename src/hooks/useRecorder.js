import { useState, useRef, useCallback } from 'react'
import { generateFilename } from '../utils/formatters'

export function useRecorder({ audioEnabled, quality }) {
  const [status, setStatus]           = useState('idle')
  const [currentBlob, setCurrentBlob] = useState(null)
  const [fileSize, setFileSize]       = useState(0)
  const [recordings, setRecordings]   = useState([])

  const mediaRecorderRef = useRef(null)
  const chunksRef        = useRef([])
  const micStreamRef     = useRef(null)

  const qualityMap = {
    '1080p': { width: 1920, height: 1080 },
    '720p':  { width: 1280, height: 720  },
    '480p':  { width: 854,  height: 480  },
  }

  const startRecording = useCallback(async () => {
    try {
      const videoConstraints = qualityMap[quality] || qualityMap['1080p']

      // ✅ STEP 1 — Pehle mic lo (screen share se pehle)
      let micTracks = []
      if (audioEnabled) {
        try {
          const micStream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl:  true,
              sampleRate:       44100,
              channelCount:     1,
            }
          })
          micTracks = micStream.getAudioTracks()
          micStreamRef.current = micStream
        } catch (err) {
          console.warn('Mic permission denied:', err.message)
        }
      }

      // ✅ STEP 2 — Phir screen share lo
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: videoConstraints,
        audio: false,
      })

      // ✅ STEP 3 — Combine karo
      const combinedStream = new MediaStream([
        ...screenStream.getVideoTracks(),
        ...micTracks,
      ])

      // ✅ STEP 4 — Opus codec
      const mimeType =
        MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
          ? 'video/webm;codecs=vp9,opus'
          : MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')
          ? 'video/webm;codecs=vp8,opus'
          : MediaRecorder.isTypeSupported('video/webm')
          ? 'video/webm'
          : ''

      const recorder = new MediaRecorder(
        combinedStream,
        mimeType ? { mimeType } : {}
      )
      chunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' })
        setCurrentBlob(blob)
        setFileSize(blob.size)
        setStatus('preview')
        screenStream.getTracks().forEach((t) => t.stop())
        if (micStreamRef.current) {
          micStreamRef.current.getTracks().forEach((t) => t.stop())
          micStreamRef.current = null
        }
      }

      recorder.start(100)
      mediaRecorderRef.current = recorder
      setStatus('recording')

      screenStream.getVideoTracks()[0].onended = () => stopRecording()

    } catch (err) {
      // User ne cancel kiya — mic bhi cleanup karo
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((t) => t.stop())
        micStreamRef.current = null
      }
      console.error('Recording failed:', err)
      setStatus('idle')
    }
  }, [audioEnabled, quality])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
  }, [])

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

  const saveRecording = useCallback((customName) => {
    if (!currentBlob) return
    const url  = URL.createObjectURL(currentBlob)
    const name = customName || generateFilename()

    setRecordings((prev) => [
      { id: Date.now(), url, name, size: currentBlob.size, date: new Date() },
      ...prev,
    ])

    const a = document.createElement('a')
    a.href     = url
    a.download = name
    a.click()

    setCurrentBlob(null)
    setFileSize(0)
    setStatus('idle')
  }, [currentBlob])

  const discardRecording = useCallback(() => {
    setCurrentBlob(null)
    setFileSize(0)
    setStatus('idle')
  }, [])

  const renameRecording = useCallback((id, newName) => {
    setRecordings((prev) =>
      prev.map((r) => (r.id === id ? { ...r, name: newName + '.webm' } : r))
    )
  }, [])

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
