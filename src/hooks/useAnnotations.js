import { useState, useRef, useCallback } from 'react'

/**
 * useAnnotations — SVG drawing tools over the screen area
 * Tools: pen | eraser | circle | arrow | text
 */
export function useAnnotations() {
  const [enabled, setEnabled]       = useState(false)
  const [tool, setTool]             = useState('pen')
  const [color, setColor]           = useState('#ff3c3c')
  const [size, setSize]             = useState(3)
  const [annotations, setAnnotations] = useState([])
  const [currentPath, setCurrentPath] = useState(null)
  const [undoStack, setUndoStack]   = useState([])
  const [isDrawing, setIsDrawing]   = useState(false)

  const svgRef      = useRef(null)
  const startPosRef = useRef(null)

  // ── Get position relative to SVG ─────────────────────────────────────────
  const getSVGPos = (e) => {
    const rect = svgRef.current.getBoundingClientRect()
    return {
      x: ((e.clientX - rect.left) / rect.width)  * 100, // percent
      y: ((e.clientY - rect.top)  / rect.height) * 100,
    }
  }

  // ── Mouse Down ────────────────────────────────────────────────────────────
  const onMouseDown = useCallback((e) => {
    if (!enabled) return
    setIsDrawing(true)
    const pos = getSVGPos(e)
    startPosRef.current = pos

    if (tool === 'pen' || tool === 'eraser') {
      setCurrentPath({
        type:   'path',
        d:      `M${pos.x},${pos.y}`,
        color:  tool === 'eraser' ? '#080808' : color,
        size:   tool === 'eraser' ? size * 4 : size,
      })
    } else if (tool === 'circle') {
      setCurrentPath({ type: 'circle', cx: pos.x, cy: pos.y, r: 0, color, size })
    } else if (tool === 'arrow') {
      setCurrentPath({ type: 'arrow', x1: pos.x, y1: pos.y, x2: pos.x, y2: pos.y, color, size })
    } else if (tool === 'text') {
      const text = prompt('Enter annotation text:')
      if (text?.trim()) {
        setUndoStack((u) => [...u, annotations])
        setAnnotations((a) => [...a, { type: 'text', x: pos.x, y: pos.y, text, color, size: size * 5 + 10 }])
      }
      setIsDrawing(false)
    }
  }, [enabled, tool, color, size, annotations])

  // ── Mouse Move ────────────────────────────────────────────────────────────
  const onMouseMove = useCallback((e) => {
    if (!isDrawing || !currentPath) return
    const pos = getSVGPos(e)

    if (currentPath.type === 'path') {
      setCurrentPath((p) => ({ ...p, d: p.d + ` L${pos.x},${pos.y}` }))
    } else if (currentPath.type === 'circle') {
      const r = Math.hypot(pos.x - startPosRef.current.x, pos.y - startPosRef.current.y)
      setCurrentPath((p) => ({ ...p, r }))
    } else if (currentPath.type === 'arrow') {
      setCurrentPath((p) => ({ ...p, x2: pos.x, y2: pos.y }))
    }
  }, [isDrawing, currentPath])

  // ── Mouse Up ──────────────────────────────────────────────────────────────
  const onMouseUp = useCallback(() => {
    if (!isDrawing) return
    if (currentPath) {
      setUndoStack((u) => [...u, annotations])
      setAnnotations((a) => [...a, currentPath])
      setCurrentPath(null)
    }
    setIsDrawing(false)
  }, [isDrawing, currentPath, annotations])

  // ── Undo ──────────────────────────────────────────────────────────────────
  const undo = useCallback(() => {
    if (undoStack.length === 0) return
    setAnnotations(undoStack[undoStack.length - 1])
    setUndoStack((u) => u.slice(0, -1))
  }, [undoStack])

  // ── Clear all ─────────────────────────────────────────────────────────────
  const clear = useCallback(() => {
    setUndoStack((u) => [...u, annotations])
    setAnnotations([])
  }, [annotations])

  // ── Toggle annotations on/off ─────────────────────────────────────────────
  const toggle = () => setEnabled((v) => !v)

  return {
    enabled, toggle,
    tool, setTool,
    color, setColor,
    size, setSize,
    annotations, currentPath,
    undoStack,
    svgRef,
    onMouseDown, onMouseMove, onMouseUp,
    undo, clear,
  }
}
