import React, { useState, useEffect } from 'react';
import soundEffectsService from '../SoundEffectsService';

function SoundEffectsToggle() {
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    // Check initial state
    setIsEnabled(soundEffectsService.isEnabled());
  }, []);

  const toggleSoundEffects = () => {
    const newState = soundEffectsService.toggle();
    setIsEnabled(newState);
  };

  const toggleButtonStyle = {
    position: 'fixed',
    top: '20px',
    left: '70px', // Position it next to audio toggle
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
      style={toggleButtonStyle}
      onClick={toggleSoundEffects}
      title={isEnabled ? "Mute Sound Effects" : "Enable Sound Effects"}
    >
      {isEnabled ? "🔊" : "🔇"}
    </div>
  );
}

export default SoundEffectsToggle;