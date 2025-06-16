import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import NavBar from '../NavBar';
import TeacherButton from './TeacherButton';
import { incrementRoomsCurrentStatus } from './utils/api';

function MissionIntro() {
  const navigate = useNavigate();
  const { roomCode } = useParams();
  const location = useLocation();
  const quizId = location.state?.quizId;

  const handleStartMission = async () => {
    // Move students from waiting room to first question
    await incrementRoomsCurrentStatus(roomCode, 1);
    // Navigate teacher to first question
    navigate(`/teacher/displayquestion/${roomCode}`, { state: { quizId } });
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: 'url(/public/robot-bg.svg) center/cover no-repeat',
      position: 'relative',
      overflow: 'visible'
    }}>
      {/* Circuit contrails - top left */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: -150,
        zIndex: 0,
      }}>
        <img src="/contrails down.png" alt="Circuit contrails down" style={{ maxHeight: '50vh' }} />
      </div>

      {/* Circuit contrails - bottom right */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        right: -100,
        zIndex: 0
      }}>
        <img src="/contrails up.png" alt="Circuit contrails up" style={{ maxHeight: '50vh' }} />
      </div>
      
      {/* Header */}
      <div style={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginBottom: '30px',
        padding: '20px 30px 0 30px',
        position: 'relative'
      }}>
        <div style={{ 
          textAlign: 'center'
        }}>
          <h1 style={{ 
            fontSize: '42px',
            fontWeight: '700',
            color: '#00d9ff',
            marginBottom: '8px',
            textShadow: '0 0 20px rgba(0, 217, 255, 0.3)',
            letterSpacing: '2px'
          }}>
            MISSION BRIEFING
          </h1>
        </div>
      </div>

      {/* Mission Content */}
      <div style={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '0 30px 20px 30px'
      }}>
        <div style={{
          background: 'rgba(30, 41, 59, 0.8)',
          borderRadius: '12px',
          padding: '30px',
          maxWidth: '900px',
          width: '100%',
          position: 'relative',
          border: '1px solid rgba(0, 217, 255, 0.3)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-250px',
            width: '200px'
          }}>
            <img src="/Frog 1 no background.png" alt="Robot" style={{ width: '100%', filter: 'brightness(1.5)' }} />
          </div>
          
          <div style={{ 
            fontSize: '18px', 
            lineHeight: '1.7', 
            marginBottom: '30px',
            color: '#ffffff',
            fontWeight: '400'
          }}>
            <p>Your task: Defeat Baron von Frogface, the evil frog and his empire.<br /></p>
            <p></p>
            
            <ol style={{ 
                paddingLeft: '25px', 
                marginTop: '45px',
                maxWidth: '70%',    // Make the list narrower
                margin: '45px auto 0'  // Center the list with auto left/right margins
                }}>
                <li style={{ 
                    marginBottom: '15px', 
                    fontSize: '17px', 
                    paddingBottom: '30px',
                    borderBottom: '1px solid rgba(0, 217, 255, 0.3)'
                }}>
                    <strong style={{ color: '#00d9ff' }}>Recharge your Robot</strong> - Your robot is exhausted from previous battles. Use your knowledge of fraction arithmetic to recharge it.
                </li>
                <li>
                    <strong style={{ color: '#00d9ff' }}>Calculate Attack Strategy</strong> - Use your knowledge of percentages to determine how much energy is needed for an attack!
                </li>
                </ol>
        
            
            <div style={{ 
              background: 'rgba(0, 217, 255, 0.1)', 
              padding: '15px', 
              borderRadius: '8px',
              borderLeft: '4px solid #00d9ff',
              marginTop: '45px'
            }}>
              <p style={{ margin: 0, fontStyle: 'italic', fontSize: '16px' }}>
                <strong>Tip:</strong> Split Individual qs between you, and work on Group qs together.
              </p>
            </div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            marginTop: '30px'
          }}>
            <TeacherButton
              onClick={handleStartMission}
              style={{
                background: 'rgba(0, 217, 255, 0.2)',
                color: '#00d9ff',
                border: '1px solid rgba(0, 217, 255, 0.5)',
                padding: '12px 30px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              BEGIN MISSION
            </TeacherButton>
          </div>
        </div>
      </div>

      {/* Robot image for atmosphere */}
      <div style={{
        position: 'absolute',
        bottom: '30px',
        left: '-120px',
        width: '350px',
        opacity: '0.8',
        zIndex: '-1'
      }}>
        <img src="/r3_nobg.png" alt="Robot 2" style={{ width: '100%', filter: 'brightness(1.5)' }} />
      </div>
    </div>
  );
}

export default MissionIntro;
