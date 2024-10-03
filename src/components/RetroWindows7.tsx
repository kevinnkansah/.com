import React, { useState, useRef, useEffect } from 'react'
import { X, Minus, Square } from 'lucide-react'

const Window = ({ title, children, onClose, initialPos, zIndex, onFocus }) => {
  const [position, setPosition] = useState(initialPos)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const windowRef = useRef(null)

  const handleMouseDown = (e) => {
    if (e.target.closest('.window-content') || e.target.closest('.window-controls')) return
    setIsDragging(true)
    const rect = windowRef.current.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
    onFocus()
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    const newX = e.clientX - dragOffset.x
    const newY = e.clientY - dragOffset.y
    setPosition({ x: newX, y: newY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  return (
    <div
      ref={windowRef}
      className="window"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="window-header">
        <span className="window-title">{title}</span>
        <div className="window-controls">
          <button className="control-button minimize-button">
            <Minus size={16} />
          </button>
          <button className="control-button maximize-button">
            <Square size={16} />
          </button>
          <button onClick={onClose} className="control-button close-button">
            <X size={16} />
          </button>
        </div>
      </div>
      <div className="window-content">
        {children}
      </div>
    </div>
  )
}

const DummyContent = ({ title }) => (
  <div>
    <h2 className="content-title">{title}</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
  </div>
)

export default function RetroWindows7() {
  const [windows, setWindows] = useState([
    { id: 1, title: 'Document 1', content: <DummyContent title="Important Notes" />, pos: { x: 50, y: 50 }, zIndex: 1 },
    { id: 2, title: 'Image Viewer', content: <img src="/api/placeholder/300/200" alt="Placeholder" className="image-viewer" />, pos: { x: 500, y: 50 }, zIndex: 2 },
    { id: 3, title: 'Calculator', content: <DummyContent title="Calculator" />, pos: { x: 200, y: 200 }, zIndex: 3 },
    { id: 4, title: 'Music Player', content: <DummyContent title="Now Playing" />, pos: { x: 50, y: 350 }, zIndex: 4 },
    { id: 5, title: 'Email', content: <DummyContent title="New Message" />, pos: { x: 500, y: 350 }, zIndex: 5 },
  ])

  const closeWindow = (id) => {
    setWindows(windows.filter(w => w.id !== id))
  }

  const focusWindow = (id) => {
    const maxZ = Math.max(...windows.map(w => w.zIndex))
    setWindows(windows.map(w => w.id === id ? { ...w, zIndex: maxZ + 1 } : w))
  }

  return (
    <div className="desktop">
      {windows.map((window) => (
        <Window
          key={window.id}
          title={window.title}
          onClose={() => closeWindow(window.id)}
          initialPos={window.pos}
          zIndex={window.zIndex}
          onFocus={() => focusWindow(window.id)}
        >
          {window.content}
        </Window>
      ))}
    </div>
  )
}