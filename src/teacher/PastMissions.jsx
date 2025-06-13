import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TeacherButton from './TeacherButton';

function PastMissions() {
  const [pastMissions, setPastMissions] = useState([]);
  const [error, setError] = useState('');
  const [hoveredMission, setHoveredMission] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Replace with your actual API call
    fetch('https://drp-belgium.onrender.com/api/past-missions/')
    // fetch('http://localhost:8000/api/past-missions/')
      .then(res => res.json())
      .then(data => {
        // Sort missions in reverse chronological order (newest first)
        const sortedMissions = data.missions.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );
        setPastMissions(sortedMissions);
        console.log(data);
      })
      .catch(err => {
        setError('Failed to fetch quizzes.');
        console.error(err);
      });
  }, []);

  const handleViewReport = (roomId) => {
    console.log('Selected mission:', roomId);
    navigate('/teacher/report', { state: { roomId: roomId } });
  };

  const handleRelaunchMission = (mission) => {
    console.log('Relaunching mission with quiz ID:', mission.quiz_id);
    // Navigate to the dashboard page with the quiz ID (not roomcode)
    navigate('/teacher/dashboard', {
      state: { quizId: mission.quiz_id }
    });
  };


  if (error) {
    return (
      <div style={{ 
        padding: '30px', 
        textAlign: 'center',
        color: '#ff4d4d',
        fontSize: '18px',
        fontFamily: 'sans-serif'
      }}>
        {error}
      </div>
    );
  }

  if (!pastMissions.length) {
    return (
      <div style={{ 
        padding: '30px', 
        textAlign: 'center',
        color: '#aefeff',
        fontSize: '18px',
        fontFamily: 'sans-serif'
      }}>
        <div style={{ marginBottom: '20px' }}>Loading past missions...</div>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid rgba(174, 254, 255, 0.3)',
          borderTop: '4px solid #00f0ff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto'
        }}></div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '40px', 
      maxWidth: '1400px',
      margin: '0 auto',
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {
        <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '60px',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TeacherButton
            onClick={() => navigate('/teacher')}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '600',
              borderRadius: '8px',
              border: '2px solid rgba(0, 240, 255, 0.4)',
              background: 'transparent',
              color: '#00f0ff',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            ← Back
          </TeacherButton>
        </div>

        <div style={{ 
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center'
        }}>
          <h1 style={{ 
            fontSize: '32px',
            color: '#00f0ff',
            fontWeight: '300',
            margin: '0 0 8px 0',
            letterSpacing: '2px'
          }}>
            Past Missions
          </h1>
          <p style={{
            fontSize: '16px',
            color: 'rgba(174, 254, 255, 0.7)',
            margin: '0',
            fontWeight: '400'
          }}>
            View reports for past missions, or relaunch
          </p>
        </div>
        
        {/* This empty div balances the layout */}
        <div style={{ visibility: 'hidden', width: '120px' }}></div>
      </div>
      }

      {/* Missions List */}
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        maxWidth: '700px',
        margin: '0 auto' 
      }}>
        {pastMissions.map((mission, index) => {
          // Clean up quiz title by removing bracketed content
          const cleanQuizTitle = mission.quiz_title.replace(/\s*\([^)]*\)/g, '').trim();
          
          // Format date and time
          const formattedDateTime = mission.created_at.split("T")
            .map((part, index) => {
              if (index === 0) {
                return part.split("-").reverse().join("-"); // Date part
              } else {
                return part.split(".")[0]; // Time part
              }
            })
            .join(", ");
          
          // Capitalize first letter of difficulty
          const capitalizedDifficulty = mission.quiz_difficulty.charAt(0).toUpperCase() + mission.quiz_difficulty.slice(1);
          
          return (
            <div
              key={index}
              style={{
                position: 'relative',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '20px 24px',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(10px)',
                overflow: 'hidden',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
              onMouseEnter={e => {
                setHoveredMission(mission.room_id);
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 24px rgba(0, 0, 0, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.3)';
              }}
              onMouseLeave={e => {
                setHoveredMission(null);
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              {/* Left Content */}
              <div style={{ flex: 1 }}>
                {/* Room Code and Date */}
                <div style={{ 
                  fontSize: '20px', 
                  color: '#00f0ff',
                  fontWeight: '600',
                  marginBottom: '8px',
                  letterSpacing: '0.5px',
                  textAlign: 'left'
                }}>
                  {mission.room_code} ({formattedDateTime})
                </div>
                
                {/* Mission Details in Variable: Value Format */}
                <div style={{ 
                  fontSize: '14px',
                  color: 'rgba(174, 254, 255, 0.7)',
                  lineHeight: '1.4',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '4px'
                }}>
                  <div>Topic: {mission.quiz_subject}</div>
                  <div>Difficulty: {capitalizedDifficulty}</div>
                  <div>Questions: {mission.total_questions}</div>
                  <div>Duration: {mission.total_time} Minutes</div>
                </div>
              </div>

              {/* Right Action Buttons - Only show on hover */}
              <div style={{
                opacity: hoveredMission === mission.room_id ? 1 : 0,
                transform: hoveredMission === mission.room_id ? 'translateX(0)' : 'translateX(20px)',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                minWidth: '160px',
                alignItems: 'stretch'
              }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewReport(mission.room_id);
                  }}
                  style={{
                    padding: '10px 16px',
                    fontSize: '13px',
                    fontWeight: '600',
                    borderRadius: '6px',
                    border: '2px solid #00f0ff',
                    background: '#00f0ff',
                    color: '#000',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#33f3ff';
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#00f0ff';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  View Report
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRelaunchMission(mission);
                  }}
                  style={{
                    padding: '10px 16px',
                    fontSize: '13px',
                    fontWeight: '600',
                    borderRadius: '6px',
                    border: '2px solid #ff6b35',
                    background: '#ff6b35',
                    color: '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#ff8c66';
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#ff6b35';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  Relaunch Mission
                </button>
              </div>

              {/* Hover Indicator */}
              <div style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                right: '0',
                height: '3px',
                background: hoveredMission === mission.room_id 
                  ? 'linear-gradient(90deg, #ff6b35, #00f0ff)' 
                  : 'transparent',
                transition: 'all 0.3s ease'
              }} />
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default PastMissions;