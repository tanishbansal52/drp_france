import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import '../css/ProgressBar.css';

function MissionProgress() {
  const location = useLocation();
  const path = location.pathname;
  const [currentQNumber, setCurrentQNumber] = useState(localStorage.getItem('qNumber') || '0');
  
  // Add an effect to monitor localStorage changes
  useEffect(() => {
    const checkForChanges = () => {
      const newQNumber = localStorage.getItem('qNumber');
      if (newQNumber !== currentQNumber) {
        setCurrentQNumber(newQNumber);
        console.log('qNumber changed:', newQNumber);
      }
    };
    
    // Check immediately and set up interval
    checkForChanges();
    const intervalId = setInterval(checkForChanges, 1000);
    
    return () => clearInterval(intervalId);
  }, [currentQNumber]);
  
  const getProgress = () => {
    // Use the state variable instead of reading from localStorage again
    console.log('Progress debug:', { path, currentQNumber });
    
    // Start/Waiting: 0%
    if (path.includes('/waiting') || path.includes('/start')) {
      return { percent: 0, name: 'Starting Mission' };
    }
    
    // Robot Question 2 check - highest priority
    if (currentQNumber === '1') {
      return { percent: 100, name: 'Question 2' };
    }
    
    // If we're in the questions path but not on question 2
    if (path.includes('/textQs')) {
      return { percent: 50, name: 'Question 1' };
    }
    
    // Any state related to question 1 results
    if (path.includes('/correct') || path.includes('/incorrect')) {
      if (currentQNumber === '1') {
        return { percent: 100, name: 'Question 2' };
      }
      return { percent: 50, name: 'Question 1' };
    }
    
    // Final states
    if (path.includes('/groupquestion') || 
        path.includes('/end') || 
        path.includes('/debrief') || 
        path.includes('/teacher/finish')) {
      return { percent: 100, name: 'Question 2' };
    }
    
    // Default fallback
    return { percent: 0, name: 'Mission Progress' };
  };
  
  const progress = getProgress();

  return (
    <div className="mission-progress-container">
      <div className="mission-progress-title">Mission Progress</div>
      <div className="mission-progress-bar">
        <div 
          className="mission-progress-fill" 
          style={{ width: `${progress.percent}%` }}
        >
          <div className="mission-progress-pulse"></div>
        </div>
      </div>
      <div className="mission-details">
        <span>Current: {progress.name}</span>
        <span>{progress.percent}%</span>
      </div>
    </div>
  );
}

export default MissionProgress;