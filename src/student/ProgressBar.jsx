import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import '../css/ProgressBar.css';

function MissionProgress() {
  const location = useLocation();
  const path = location.pathname;
  
  // Simplified progress calculation
  const getProgress = () => {
    // Start/Waiting: 0%
    if (path.includes('/waiting') || path.includes('/start')) {
      return { percent: 0, name: 'Starting Mission' };
    }
    
    // Question 1: 50%
    if (path.includes('/textQs') && (!location.state?.questionNo || location.state?.questionNo === 0)) {
      return { percent: 50, name: 'Question 1' };
    }
    
    // Any state related to question 1 results
    if ((path.includes('/correct') || path.includes('/incorrect')) && 
        location.state?.questionNo === 0) {
      return { percent: 50, name: 'Question 1' };
    }
    
    // Question 2 or any later stage: 100%
    if (path.includes('/textQs') || path.includes('/groupquestion') || 
        path.includes('/end') || path.includes('/debrief') || 
        path.includes('/teacher/finish') ||
        (path.includes('/correct') || path.includes('/incorrect'))) {
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