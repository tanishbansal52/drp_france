import React, { useState, useEffect } from 'react';
import audioService from '../AudioService';

function AudioToggle() {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Check initial audio state
    setIsPlaying(audioService.isPlaying);
  }, []);

  const toggleAudio = () => {
    if (isPlaying) {
      audioService.stop();
    } else {
      audioService.init('/background.mp3');
      audioService.play();
    }
    setIsPlaying(!isPlaying);
  };

  const audioButtonStyle = {
    position: 'fixed',
    top: '20px',
    left: '20px',
    zIndex: 1000,
    background: 'rgba(0, 20, 40, 0.8)',
    color: '#00ffff',
    border: '1px solid #00ffff',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)',
    fontSize: '18px'
  };

  return (
    <div 
      style={audioButtonStyle}
      onClick={toggleAudio}
      title={isPlaying ? "Mute Background" : "Play Background"}
    >
      {isPlaying ? "♪" : "▶"}
    </div>
  );
}

export default AudioToggle;