import React, { useState, useEffect } from 'react';
import HighContrastToggle from './HighContrastToggle';

function StudentLayout({ children }) {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    // Check if high contrast mode was previously enabled
    const savedMode = localStorage.getItem('highContrastMode');
    if (savedMode === 'true') {
      setIsHighContrast(true);
    }
  }, []);

  const toggleHighContrast = () => {
    const newState = !isHighContrast;
    setIsHighContrast(newState);
    
    // Save preference to localStorage
    localStorage.setItem('highContrastMode', newState);
  };

  return (
    <div className={`student-view ${isHighContrast ? 'high-contrast' : ''}`}>
      <HighContrastToggle isHighContrast={isHighContrast} toggleHighContrast={toggleHighContrast} />
      {children}
    </div>
  );
}

export default StudentLayout;