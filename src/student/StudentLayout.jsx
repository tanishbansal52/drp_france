import React, { useState, useEffect } from 'react';
import HighContrastToggle from './HighContrastToggle';
import MissionProgress from './ProgressBar';
import { useLocation } from 'react-router-dom';

function StudentLayout({ children }) {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const location = useLocation();
  
  // Check if current page should display progress bar
  // We don't want to show it on the initial landing page
  const shouldShowProgress = !location.pathname.match(/^\/student\/?$/);

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
      {shouldShowProgress && <MissionProgress />}
      {children}
    </div>
  );
}

export default StudentLayout;