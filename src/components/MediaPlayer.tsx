import React, { useState, useRef, useEffect } from 'react';
import { SkipBack, SkipForward, Volume2 } from 'lucide-react';

interface MediaPlayerProps {
  audioSrc: string;
}

const MediaPlayer: React.FC<MediaPlayerProps> = ({ audioSrc }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', updateProgress);
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0);
      });
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', updateProgress);
      }
    };
  }, []);

  const updateProgress = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const progressBar = e.currentTarget;
      const clickPosition = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
      const newTime = clickPosition * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const playerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '400px',
    margin: '0 auto',
    background: 'linear-gradient(to bottom, #f2f2f2 45%, #ebebeb 45%, #cfcfcf)',
    padding: '10px',
    borderRadius: '5px',
    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.98), 0 1px 2px rgba(0,0,0,0.1)',
  };

  const artworkContainerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    paddingBottom: '100%',
    marginBottom: '10px',
    cursor: 'pointer',
  };

  const artworkStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    borderRadius: '5px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  };

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: isHovered ? 'rgba(0,0,0,0.3)' : 'transparent',
    transition: 'background 0.2s ease',
    borderRadius: '5px',
  };

  const controlsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  };

  const progressBarStyle: React.CSSProperties = {
    width: '100%',
    height: '4px',
    background: '#ddd',
    cursor: 'pointer',
    borderRadius: '2px',
    position: 'relative',
  };

  const progressStyle: React.CSSProperties = {
    width: `${(currentTime / duration) * 100}%`,
    height: '100%',
    background: 'linear-gradient(to right, #4580c4, #6aa1e2)',
    borderRadius: '2px',
    transition: 'width 0.1s linear',
  };

  return (
    <div style={playerStyle} className="media-player">
      <audio ref={audioRef} src={audioSrc} />
      
      <div 
        style={artworkContainerStyle}
        onClick={togglePlay}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img 
          src="/images/Default (1).svg" 
          alt="Play/Pause Button"
          style={artworkStyle}
        />
        <div style={overlayStyle}>
          {isHovered && (
            <div style={{
              width: '60px',
              height: '60px',
              background: 'rgba(255,255,255,0.9)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            }}>
              <div style={{
                width: '0',
                height: '0',
                borderStyle: 'solid',
                borderWidth: isPlaying ? '0 8px 0 8px' : '15px 0 15px 25px',
                borderColor: isPlaying 
                  ? 'transparent #333 transparent #333'
                  : 'transparent transparent transparent #333',
                transform: isPlaying ? 'translateX(4px)' : 'translateX(4px)',
                marginLeft: isPlaying ? '8px' : '4px',
              }} />
            </div>
          )}
        </div>
      </div>

      <div style={progressBarStyle} onClick={handleProgressClick}>
        <div style={progressStyle} />
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', marginBottom: '10px' }}>
        <span style={{ fontSize: '12px', color: '#666' }}>{formatTime(currentTime)}</span>
        <span style={{ fontSize: '12px', color: '#666' }}>{formatTime(duration)}</span>
      </div>

      <div style={controlsStyle}>
        <button style={{
          width: '24px',
          height: '24px',
          border: '1px solid #8e8f8f',
          borderRadius: '3px',
          background: 'linear-gradient(to bottom, #f2f2f2 45%, #ebebeb 45%, #cfcfcf)',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.98), 0 1px 2px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}>
          <Volume2 size={14} color="#333" />
        </button>
        <input 
          type="range" 
          min="0" 
          max="100" 
          defaultValue="100"
          style={{
            flex: 1,
            height: '4px',
            WebkitAppearance: 'none',
            background: '#ddd',
            borderRadius: '2px',
            cursor: 'pointer',
          }}
        />
      </div>
    </div>
  );
};

export default MediaPlayer;
