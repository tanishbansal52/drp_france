import React, { useState, useEffect } from 'react';

function HighContrastToggle() {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    // Check if high contrast mode was previously enabled
    const savedMode = localStorage.getItem('highContrastMode');
    if (savedMode === 'true') {
      setIsHighContrast(true);
      document.documentElement.classList.add('high-contrast');
    }
  }, []);

  const toggleHighContrast = () => {
    const newState = !isHighContrast;
    setIsHighContrast(newState);
    
    if (newState) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    // Save preference to localStorage
    localStorage.setItem('highContrastMode', newState);
  };

  const toggleButtonStyle = {
    position: 'fixed',
    top: '20px',
    left: '20px',
    zIndex: 1050,
    background: isHighContrast ? '#ffffff' : 'rgba(0, 20, 40, 0.8)',
    color: isHighContrast ? '#000000' : '#ffffff',
    border: `1px solid ${isHighContrast ? '#000000' : '#ffffff'}`,
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: isHighContrast ? 'none' : '0 0 10px rgba(255, 255, 255, 0.3)',
    fontSize: '18px',
    transition: 'all 0.2s ease'
  };

  return (
    <div 
      style={toggleButtonStyle}
      onClick={toggleHighContrast}
      className={isHighContrast ? "high-contrast-icon" : ""}
      title={isHighContrast ? "Disable High Contrast" : "Enable High Contrast"}
      aria-label={isHighContrast ? "Disable High Contrast" : "Enable High Contrast"}
    >
      {isHighContrast ? "◐" : "◑"}
    </div>
  );
}

export default HighContrastToggle;