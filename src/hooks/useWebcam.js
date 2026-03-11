import { useState, useRef, useEffect, useCallback } from 'react'

/**
 * useWebcam — FIX:
 * 1. Callback ref so stream attaches whenever <video> mounts
 * 2. Ignore stale async results after cleanup
 * 3. Works with React StrictMode double-invoke
 */
export function useWebcam() {
  const [enabled, setEnabled]         = useState(false)
  const [hasPermission, setHasPermission] = useState(null)
  const streamRef    = useRef(null)
  const videoElRef   = useRef(null)
  const cancelledRef = useRef(false)

  // Callback ref — fires whenever <video> mounts/unmounts
  const videoRef = useCallback((node) => {
    videoElRef.current = node
    // If stream already ready, attach immediately
    if (node && streamRef.current) {
      node.srcObject = streamRef.current
      node.play().catch(() => {})
    }
  }, [])

  useEffect(() => {
    if (!enabled) {
      // Stop tracks + clear
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
        streamRef.current = null
      }
      if (videoElRef.current) {
        videoElRef.current.srcObject = null
      }
      return
    }

    cancelledRef.current = false

    navigator.mediaDevices
      .getUserMedia({
        video: {
          width:       { ideal: 320 },
          height:      { ideal: 240 },
          facingMode:  'user',
          frameRate:   { ideal: 30 },
        },
        audio: false,
      })
      .then((stream) => {
        // Ignore if user disabled webcam while permission was loading
        if (cancelledRef.current) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream
        setHasPermission(true)

        // Attach to video element if already mounted
        if (videoElRef.current) {
          videoElRef.current.srcObject = stream
          videoElRef.current.play().catch(() => {})
        }
      })
      .catch((err) => {
        if (cancelledRef.current) return
        console.warn('Webcam permission denied:', err.message)
        setHasPermission(false)
        setEnabled(false)
      })

    return () => {
      cancelledRef.current = true
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
        streamRef.current = null
      }
      if (videoElRef.current) {
        videoElRef.current.srcObject = null
      }
    }
  }, [enabled])

  const toggle = () => setEnabled((v) => !v)

  return { enabled, toggle, hasPermission, videoRef }
}

