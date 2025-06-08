import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import '../css/ProgressBar.css';

function MissionProgress() {
  const location = useLocation();
  const { roomCode } = useParams();
  const path = location.pathname;
  
  // Determine current mission stage
  const getCurrentStage = () => {
    if (path.includes('/waiting')) return { stage: 1, name: 'Waiting Room' };
    if (path.includes('/start')) return { stage: 2, name: 'Rules' };
    if (path.includes('/question1')) return { stage: 3, name: 'Question 1' };
    if (path.includes('/correct') || path.includes('/incorrect')) {
      // Check state from location to determine which question's result we're showing
      const questionNo = location.state?.questionNo || 1;
      return { 
        stage: questionNo === 1 ? 4 : 6, 
        name: `Q${questionNo} Result` 
      };
    }
    if (path.includes('/groupquestion')) return { stage: 5, name: 'Group Question' };
    if (path.includes('/end')) return { stage: 7, name: 'Reflection' };
    if (path.includes('/debrief')) return { stage: 8, name: 'Debrief' };
    if (path.includes('/teacher/finish')) return { stage: 9, name: 'Complete' };
    
    return { stage: 1, name: 'Waiting Room' }; // Default
  };
  
  const currentStage = getCurrentStage();
  const totalStages = 9;
  const progressPercent = ((currentStage.stage - 1) / (totalStages - 1)) * 100;

  return (
    <div className="mission-progress-container">
      <div className="mission-progress-title">Mission Progress</div>
      <div className="mission-progress-bar">
        <div 
          className="mission-progress-fill" 
          style={{ width: `${progressPercent}%` }}
        >
          <div className="mission-progress-pulse"></div>
        </div>
      </div>
      <div className="mission-details">
        <span>Current: {currentStage.name}</span>
        <span>{Math.round(progressPercent)}%</span>
      </div>
    </div>
  );
}

export default MissionProgress;