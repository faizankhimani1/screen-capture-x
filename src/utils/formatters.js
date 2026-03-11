/**
 * Format seconds → "MM:SS"
 * @param {number} seconds
 * @returns {string}
 */
export const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/**
 * Format bytes → "X.X MB" or "X KB"
 * @param {number} bytes
 * @returns {string}
 */
export const formatSize = (bytes) => {
  if (bytes === 0) return '0 KB'
  if (bytes > 1_048_576) return `${(bytes / 1_048_576).toFixed(1)} MB`
  return `${(bytes / 1024).toFixed(0)} KB`
}

/**
 * Generate default recording filename with timestamp
 * @returns {string}
 */
export const generateFilename = () => {
  const now = new Date()
  const ts = now.toISOString().slice(0, 19).replace(/:/g, '-')
  return `recording-${ts}.webm`
}
