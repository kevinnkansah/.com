import React, { useState, useRef } from 'react';
import { SkipBack, SkipForward, Volume2 } from 'lucide-react';

interface WindowsMediaPlayerProps {
  audioSrc: string;
}

const WindowsMediaPlayer: React.FC<WindowsMediaPlayerProps> = ({ audioSrc }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(75);
  const audioRef = useRef<HTMLAudioElement>(null);

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

  const containerStyle = {
    background: 'linear-gradient(180deg, #f0f6fc 0%, #e3edf7 48%, #d1e5f8 49%, #e3edf7 100%)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 3px rgba(0,0,0,0.2)',
    border: '1px solid #8abbe2'
  };

  const buttonStyle = {
    background: 'linear-gradient(180deg, #f7fbff 0%, #eaf4ff 48%, #d3e9ff 49%, #e4f1ff 100%)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 2px rgba(0,0,0,0.1)',
    border: '1px solid #8abbe2'
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  return (
    <div 
      className="w-96 h-10 rounded flex items-stretch p-0.5 select-none"
      style={containerStyle}
    >
      <audio ref={audioRef} src={audioSrc} />
      
      {/* Left Controls Group */}
      <div className="flex items-center gap-0.5 px-0.5">
        <button 
          className="h-7 w-7 rounded flex items-center justify-center hover:opacity-90"
          style={buttonStyle}
          onClick={() => {
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.pause();
              setIsPlaying(false);
            }
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" className="text-[#2c628b]">
            <path d="M2 2h8v8H2z" fill="currentColor"/>
          </svg>
        </button>
      </div>

      {/* Divider */}
      <div className="mx-1 my-1">
        <div className="w-px h-full bg-[#8abbe2]"></div>
      </div>

      {/* Playback Controls Group */}
      <div className="flex items-center gap-0.5">
        <button 
          className="h-7 w-7 rounded flex items-center justify-center hover:opacity-90"
          style={buttonStyle}
          onClick={() => audioRef.current && (audioRef.current.currentTime -= 5)}
        >
          <SkipBack className="w-3.5 h-3.5 text-[#2c628b]" />
        </button>

        <button 
          className="h-7 w-7 rounded flex items-center justify-center hover:opacity-90 relative"
          style={buttonStyle}
          onClick={togglePlay}
        >
          <img 
            src="/images/Default (1).svg"
            alt="Play/Pause"
            className="w-5 h-5"
            style={{ filter: isPlaying ? 'brightness(0.8)' : 'none' }}
          />
        </button>

        <button 
          className="h-7 w-7 rounded flex items-center justify-center hover:opacity-90"
          style={buttonStyle}
          onClick={() => audioRef.current && (audioRef.current.currentTime += 5)}
        >
          <SkipForward className="w-3.5 h-3.5 text-[#2c628b]" />
        </button>
      </div>

      {/* Volume Control Group */}
      <div className="flex items-center gap-2 ml-auto mr-2">
        <Volume2 className="w-3.5 h-3.5 text-[#2c628b]" />
        <div className="relative w-20 h-1.5">
          <div 
            className="absolute inset-0 rounded"
            style={{
              background: 'linear-gradient(180deg, #c5e2f9 0%, #abdaf9 100%)',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.15)'
            }}
          />
          <div 
            className="absolute h-full rounded"
            style={{
              width: `${volume}%`,
              background: 'linear-gradient(180deg, #2c628b 0%, #1d4d70 100%)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)'
            }}
          />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default WindowsMediaPlayer;
