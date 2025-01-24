import React, { useState, useEffect, useRef } from 'react';
import MediaPlayer from './MediaPlayer';
import WindowsMediaPlayer from './WindowsMediaPlayer';

interface WindowProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  initialPos: { x: number; y: number };
  zIndex: number;
  onFocus: () => void;
}

const Window: React.FC<WindowProps> = ({ title, children, onClose, initialPos, zIndex, onFocus }) => {
  const [position, setPosition] = useState(initialPos);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-content') || 
        (e.target as HTMLElement).closest('.window-controls')) return;
    setIsDragging(true);
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      onFocus();
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const controlsStyle: React.CSSProperties = {
    display: 'flex',
    background: 'rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(0, 0, 0, 0.3)',
    borderTop: 0,
    borderRadius: '0 0 5px 5px',
    boxShadow: '0 1px 0 rgba(255, 255, 255, 0.98), 1px 0 0 rgba(255, 255, 255, 0.98), -1px 0 0 rgba(255, 255, 255, 0.98)',
  };

  const buttonStyle = (isLast: boolean): React.CSSProperties => ({
    position: 'relative',
    minWidth: '29px',
    minHeight: '19px',
    padding: 0,
    border: 0,
    borderRight: isLast ? 0 : '1px solid rgba(0, 0, 0, 0.3)',
    borderRadius: isLast ? '0 0 5px 0' : 0,
    boxShadow: 'none',
    boxSizing: 'border-box',
    background: 'none',
    cursor: 'pointer',
  });

  const getButtonIcon = (name: string) => {
    switch (name) {
      case 'Minimize':
        return '−';
      case 'Maximize':
        return '□';
      case 'Close':
        return '×';
      default:
        return '';
    }
  };

  const buttonBeforeStyle = (name: string, isHovered: boolean): React.CSSProperties => {
    const isClose = name === 'Close';
    return {
      content: '""',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      borderRadius: 0,
      boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.33)',
      opacity: 1,
      background: isClose
        ? isHovered
          ? 'radial-gradient(circle at 50% 170%, #f4e676 10% 20%, transparent 60%), radial-gradient(circle at -60% 50%, rgba(0,0,0,0.67) 5% 10%, transparent 50%), radial-gradient(circle at 160% 50%, rgba(0,0,0,0.67) 5% 10%, transparent 50%), linear-gradient(#fb9d8b, #ee6d56 25% 50%, #d42809 50%)'
          : 'radial-gradient(circle at -60% 50%, rgba(0,0,0,0.47) 5% 10%, transparent 50%), radial-gradient(circle at 160% 50%, rgba(0,0,0,0.47) 5% 10%, transparent 50%), linear-gradient(#e0a197e5, #cf796a 25% 50%, #d54f36 50%)'
        : isHovered
          ? 'radial-gradient(circle at bottom, #2aceda, transparent 65%), linear-gradient(#b6d9ee 50%, #1a6ca1 50%)'
          : 'linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.3) 45%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1) 75%, rgba(255,255,255,0.5))',
      transition: 'opacity 0.3s linear',
    };
  };

  const iconStyle = (name: string): React.CSSProperties => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 'bold',
    fontFamily: 'Arial, sans-serif',
    lineHeight: 1,
    textShadow: '0 1px 1px rgba(0,0,0,0.5)',
    pointerEvents: 'none',
    zIndex: 2,
  });

  const actions = ['Minimize', 'Maximize', 'Close'];

  return (
    <div
      ref={windowRef}
      className="window"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex,
        transform: 'translate3d(0,0,0)'
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="window-header">
        <span className="window-title">{title}</span>
        <div style={controlsStyle}>
          {actions.map((action, index) => (
            <button
              key={action}
              style={buttonStyle(index === 2)}
              onClick={action === 'Close' ? onClose : undefined}
              onMouseEnter={() => setHoveredButton(action)}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <span style={buttonBeforeStyle(action, hoveredButton === action)} />
              <span style={iconStyle(action)}>{getButtonIcon(action)}</span>
            </button>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
};

interface DummyContentProps {
  title: string;
}

const DummyContent: React.FC<DummyContentProps> = ({ title }) => (
  <div className="window-content">
    <h2 className="content-title">{title}</h2>
    <p>This is some sample content for the {title.toLowerCase()} window.</p>
    {title === "Important Notes" && (
      <div style={{ marginTop: '1rem' }}>
        <p>• First important note</p>
        <p>• Second important note</p>
        <p>• Third important note</p>
      </div>
    )}
  </div>
);

const RetroWindows7: React.FC = () => {
  const [windows, setWindows] = useState([
    { id: 1, title: 'Document 1', content: <DummyContent title="Important Notes" />, pos: { x: 50, y: 50 }, zIndex: 1 },
    { id: 2, title: 'Image Viewer', content: (
      <div className="window-content">
        <div className="image-viewer">Image Placeholder</div>
      </div>
    ), pos: { x: 500, y: 50 }, zIndex: 2 },
    { id: 3, title: 'Calculator', content: <DummyContent title="Calculator" />, pos: { x: 200, y: 200 }, zIndex: 3 },
    { id: 4, title: 'Music Player', content: (
      <div className="window-content" style={{ padding: '10px' }}>
        <WindowsMediaPlayer audioSrc="/OsamaSon - popstar [Official Music Video].mp3" />
      </div>
    ), pos: { x: 50, y: 350 }, zIndex: 4 },
    { id: 5, title: 'Email', content: <DummyContent title="New Message" />, pos: { x: 500, y: 350 }, zIndex: 5 },
  ]);

  const closeWindow = (id: number) => {
    setWindows(windows.filter(w => w.id !== id));
  };

  const focusWindow = (id: number) => {
    const maxZ = Math.max(...windows.map(w => w.zIndex));
    setWindows(windows.map(w => w.id === id ? { ...w, zIndex: maxZ + 1 } : w));
  };

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
  );
};

export default RetroWindows7;