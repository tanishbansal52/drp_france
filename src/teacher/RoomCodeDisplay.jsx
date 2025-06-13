import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { incrementRoomsCurrentStatus } from './utils/api'
import TeacherButton from './TeacherButton';

function RoomCodeDisplay() {
  const location = useLocation();
  const quizId = location.state?.quizId
  console.log('Quiz ID penultimate:', quizId);
  localStorage.setItem('quizId', quizId);
  const [roomCode, setRoomCode] = useState('');
  const [groups, setGroups] = useState([]);
  const [showMembers, setShowMembers] = useState(false);
  const navigate = useNavigate();

  // const location = useLocation()
  // const quizTitle = location.state?.quizTitle || 'Quiz'
  // const quizId = location.state?.quizId || null

  useEffect(() => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setRoomCode(code);

    fetch('https://drp-belgium.onrender.com/api/add-room/', {
    // fetch('http://localhost:8000/api/add-room/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ room_code: code, quiz_id: quizId }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then(err => { throw err });
        }
        return response.json();
      })
      .then((data) => console.log('Room created:', data))
      .catch((err) => {
        console.error('Error creating room:', err);
        alert(err.error || 'Failed to create room.');
      });
  }, []);

  // Polling for group updates
  useEffect(() => {
    if (!roomCode) return;

    const interval = setInterval(() => {
      fetch(`https://drp-belgium.onrender.com/api/get-room-groups/${roomCode}`)
      // fetch(`http://localhost:8000/api/get-room-groups/${roomCode}`)
        .then((res) => res.json())
        .then((data) => {
          setGroups(Array.isArray(data) ? data : []);
        })
        .catch((err) => console.error('Failed to fetch groups:', err));
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [roomCode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(roomCode);
  };

  const styles = {
    missionCodeBox: {
      background: 'rgba(0, 255, 255, 0.05)',
      border: '2px solid rgba(0, 255, 255, 0.3)',
      borderRadius: '15px',
      padding: '3rem 2rem',
      textAlign: 'center',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 8px 32px rgba(0, 255, 255, 0.1)',
      position: 'relative',
      overflow: 'hidden',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    },
    missionTitle: {
      fontSize: '2rem',
      fontWeight: '300',
      color: '#ffffff',
      marginBottom: '1.5rem',
      letterSpacing: '0.1em',
      textTransform: 'uppercase'
    },
    codeDisplay: {
      fontSize: '4.5rem',
      fontWeight: '700',
      letterSpacing: '0.4em',
      color: '#00ffff',
      textShadow: '0 0 20px rgba(0, 255, 255, 0.6), 0 0 40px rgba(0, 255, 255, 0.3)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginBottom: '2rem',
      fontFamily: 'monospace'
    },
    startButton: {
      background: 'linear-gradient(45deg, #00ffff, #0080ff)',
      border: 'none',
      padding: '15px 40px',
      fontSize: '1.1rem',
      fontWeight: '600',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      borderRadius: '6px',
      boxShadow: '0 4px 15px rgba(0, 255, 255, 0.3)',
      transition: 'all 0.3s ease'
    },
    groupsBox: {
      background: 'rgba(0, 255, 255, 0.05)',
      border: '2px solid rgba(0, 255, 255, 0.3)',
      borderRadius: '15px',
      padding: '3rem 2rem',
      textAlign: 'center',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 8px 32px rgba(0, 255, 255, 0.1)',
      position: 'relative',
      overflow: 'hidden',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    groupsSection: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column'
    },
    groupsTitle: {
      fontSize: '1.8rem',
      fontWeight: '300',
      color: '#ffffff',
      marginBottom: '1.5rem',
      letterSpacing: '0.1em',
      textTransform: 'uppercase'
    },
    groupsContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      overflowY: 'auto',
      maxHeight: '400px'
    },
    groupItem: {
      width: '100%',
      marginBottom: '15px',
      textAlign: 'center'
    },
    groupName: {
      background: 'linear-gradient(45deg, rgba(0, 255, 255, 0.15), rgba(0, 128, 255, 0.2))',
      border: '1px solid rgba(0, 255, 255, 0.4)',
      color: '#00ffff',
      padding: '12px 20px',
      margin: '6px',
      borderRadius: '20px',
      fontSize: '1.1rem', // Made slightly bigger
      fontWeight: '600',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 15px rgba(0, 255, 255, 0.15)',
      transition: 'all 0.3s ease',
      display: 'inline-block'
    },
    membersList: {
      marginTop: '8px',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '6px'
    },
    memberBadge: {
      background: 'rgba(0, 255, 255, 0.08)',
      border: '1px solid rgba(0, 255, 255, 0.25)',
      color: 'rgba(255, 255, 255, 0.8)',
      padding: '6px 12px',
      borderRadius: '12px',
      fontSize: '0.85rem', // Normal size for members
      fontWeight: '400',
      backdropFilter: 'blur(5px)',
      boxShadow: '0 2px 8px rgba(0, 255, 255, 0.1)'
    },
    waitingText: {
      color: 'rgba(255, 255, 255, 0.6)',
      fontSize: '1rem',
      fontStyle: 'italic'
    },
    toggleButton: {
      background: 'linear-gradient(45deg, rgba(0, 255, 255, 0.2), rgba(0, 128, 255, 0.3))',
      border: '1px solid rgba(0, 255, 255, 0.4)',
      color: '#00ffff',
      padding: '10px 20px',
      fontSize: '0.9rem',
      fontWeight: '500',
      borderRadius: '8px',
      transition: 'all 0.3s ease',
      marginTop: '15px'
    },
    boxGlow: {
      position: 'absolute',
      top: '-2px',
      left: '-2px',
      right: '-2px',
      bottom: '-2px',
      background: 'linear-gradient(45deg, transparent, rgba(0, 255, 255, 0.1), transparent)',
      borderRadius: '15px',
      zIndex: -1,
      opacity: 0,
      transition: 'opacity 0.3s ease'
    }
  };

  return (
    <>
      <div className="division-x-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        DIVISION X
      </div>

      <Container fluid className="vh-100 d-flex align-items-center">
        <Row className="w-100 h-75">
          {/* Left side: Mission Code */}
          <Col lg={6} className="px-4">
            <div 
              style={styles.missionCodeBox}
              onMouseEnter={(e) => {
                const glow = e.currentTarget.querySelector('.box-glow');
                if (glow) glow.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                const glow = e.currentTarget.querySelector('.box-glow');
                if (glow) glow.style.opacity = '0';
              }}
            >
              <div className="box-glow" style={styles.boxGlow}></div>
              <h1 style={styles.missionTitle}>Mission Code</h1>
              <div 
                style={styles.codeDisplay}
                title="Click to copy code"
                onClick={handleCopy}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.textShadow = '0 0 30px rgba(0, 255, 255, 0.8), 0 0 60px rgba(0, 255, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.textShadow = '0 0 20px rgba(0, 255, 255, 0.6), 0 0 40px rgba(0, 255, 255, 0.3)';
                }}
              >
                {roomCode}
              </div>
              <TeacherButton
                style={styles.startButton}
                size="lg"
                onClick={async () => {
                  // Going to question 1
                  await incrementRoomsCurrentStatus(roomCode, 1)
                  navigate(`/teacher/displayquestion/${roomCode}`, { state: { quizId } })
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(0, 255, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(0, 255, 255, 0.3)';
                }}
              >
                Start
              </TeacherButton>
            </div>
          </Col>

          {/* Right side: Joined Groups */}
          <Col lg={6} className="px-4">
            <div 
              style={styles.groupsBox}
              onMouseEnter={(e) => {
                const glow = e.currentTarget.querySelector('.box-glow');
                if (glow) glow.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                const glow = e.currentTarget.querySelector('.box-glow');
                if (glow) glow.style.opacity = '0';
              }}
            >
              <div className="box-glow" style={styles.boxGlow}></div>
              <div style={styles.groupsSection}>
                <h2 style={styles.groupsTitle}>Joined Groups</h2>
                <div style={styles.groupsContainer}>
                  {groups.length > 0 ? (
                    <div className="w-100">
                      {groups.map((group, idx) => (
                        <div 
                          key={idx} 
                          style={styles.groupItem}
                        >
                          <div 
                            style={styles.groupName}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'translateY(-2px) scale(1.05)';
                              e.target.style.boxShadow = '0 6px 20px rgba(0, 255, 255, 0.25)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'translateY(0) scale(1)';
                              e.target.style.boxShadow = '0 4px 15px rgba(0, 255, 255, 0.15)';
                            }}
                          >
                            {group.name}
                          </div>
                          {console.log(group.members)}
                          {showMembers && group.members && (
                            <div style={styles.membersList}>
                              {group.members.map((member, memberIdx) => (
                                <div 
                                  key={memberIdx} 
                                  style={styles.memberBadge}
                                >
                                  {member}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={styles.waitingText}>Waiting for groups to join...</p>
                  )}
                </div>
                <button 
                  style={styles.toggleButton}
                  onClick={() => setShowMembers(!showMembers)}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 15px rgba(0, 255, 255, 0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {showMembers ? 'Hide group members' : 'See group members'}
                </button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default RoomCodeDisplay;