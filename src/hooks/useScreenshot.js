/**
 * useScreenshot — canvas se screenshot leta hai
 */
export function useScreenshot() {
  const takeScreenshot = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true, audio: false
      })
      const video = document.createElement('video')
      video.srcObject = stream
      await video.play()

      const canvas = document.createElement('canvas')
      canvas.width  = video.videoWidth
      canvas.height = video.videoHeight
      canvas.getContext('2d').drawImage(video, 0, 0)

      stream.getTracks().forEach(t => t.stop())

      // Download
      const a = document.createElement('a')
      a.href = canvas.toDataURL('image/png')
      a.download = `screenshot-${Date.now()}.png`
      a.click()
    } catch (err) {
      console.error('Screenshot failed:', err)
    }
  }

  return { takeScreenshot }
}