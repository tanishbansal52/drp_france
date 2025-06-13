import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { canMoveToNextQuestion } from './TeacherLinking';

const noHoverStyle = `
  button.rating-button-no-hover {
    background: rgba(255, 255, 255, 0.1) !important;
    border: 1px solid rgba(255, 255, 255, 0.3) !important;
    transition: none !important;
  }
  
  button.rating-button-no-hover:hover {
    background: rgba(255, 255, 255, 0.1) !important;
    transform: none !important;
    box-shadow: none !important;
    border: 1px solid rgba(255, 255, 255, 0.3) !important;
  }
  
  button.rating-button-no-hover:hover::before {
    display: none !important;
  }
  
  button.rating-button-no-hover::before {
    display: none !important;
  }
`;

function WaitingArea() {
  const location = useLocation();
  const groupName = location.state?.groupName || "Default Group";
  const groupId = location.state?.groupId || 0;
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  console.log(selected, "Selected rating in WaitingArea");
  const {roomCode} = useParams();
  const [submitted, setSubmitted] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const feelingLabels = [
    "Very Negative",
    "Negative", 
    "Neutral",
    "Positive",
    "Very Positive"
  ];

  // Add polling for teacher navigation
  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      if (cancelled) return;
      try {
        const ok = await canMoveToNextQuestion(roomCode, 0);
        console.log("In waiting room can move to next question:", ok);
        if (ok) {
          cancelled = true;
          navigate(`/textQs/${roomCode}`, {
            state: { groupId, questionNo: 0 }
          });
        }
      } catch (err) {
        console.error("Error checking navigation:", err);
      }
    };
    poll();
    const intervalId = setInterval(poll, 3000);
    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [roomCode, groupId, navigate]);

  const handleRatingSelection = async (rating) => {
    setSelected(rating);
    try {
      await axios.post("https://drp-belgium.onrender.com/api/update-before-rating/", {
        before_rating: rating,
        group_id: groupId
      });
      setSubmitted(true);
      console.log('Rating submitted:', rating);
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  }

  return (
    <>
      <style>{noHoverStyle}</style>
      {/* Division X Logo - positioned at top right */}
      <div 
        className="division-x-logo" 
        onClick={() => navigate('/')} 
        style={{ 
          cursor: 'pointer',
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 100
        }}
      >
        DIVISION X
      </div>
    
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: '60px 2rem 2rem 2rem', // Reduced to move title higher
        position: 'relative',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          maxWidth: '800px',
          width: '100%',
          textAlign: 'center',
          color: '#ffffff'
        }}>
          {/* Header - Exactly matching Finish.jsx styling */}
          <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            marginBottom: '40px',
            padding: '0px 30px 0 30px',
            position: 'relative'
          }}>
            <div style={{ 
              textAlign: 'center'
            }}>
              <h1 style={{ 
                fontSize: '32px',
                fontWeight: '700',
                color: '#00d9ff',
                marginBottom: '8px',
                textShadow: '0 0 20px rgba(0, 217, 255, 0.3)',
                letterSpacing: '2px'
              }}>
                WAITING ROOM
              </h1>
              <p style={{
                color: '#9ca3af',
                fontSize: '15px',
                margin: '4px 0 0 0'
              }}>
                Wait for your teacher to move to the next page.
              </p>
            </div>
          </div>

          {/* View Rules Button - Positioned absolutely in top right */}
          <div style={{
            position: 'absolute',
            top: '40px',
            right: '40px'
          }}>
            <button 
              onClick={() => setShowRules(true)}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.9rem',
                fontWeight: '500',
                borderRadius: '6px',
                border: '1px solid #00d4ff',
                background: 'transparent',
                color: '#00d4ff',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
            >
              VIEW RULES
            </button>
          </div>

          {/* Group Info Box */}
          <div style={{ 
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '2rem'
          }}>
            <p style={{
              fontSize: '1rem',
              color: '#b3b3b3',
              fontStyle: 'italic',
              margin: '0 0 20px 0'
            }}>
              Group: <span style={{ color: '#ffffff', fontWeight: '500' }}>{groupName}</span>
            </p>

            <p style={{
              fontSize: '1.3rem',
              marginBottom: '0',
              color: '#ffffff'
            }}>
              Topic: <strong>Algebra</strong>
            </p>
          </div>
        </div>
        
        {/* Confidence Rating Box - Moved to bottom center */}
        <div style={{
          width: '100%',
          maxWidth: '800px',
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '12px',
          padding: '25px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '2rem'
        }}>
          <p style={{
            fontSize: '1.1rem',
            color: '#b3b3b3',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            How confident do you feel about Algebra before the mission?
          </p>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => handleRatingSelection(rating)}
                className="rating-button-no-hover"
                style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '80px',
                  height: '80px',
                  background: selected === rating ? '#00d4ff' : 'rgba(255, 255, 255, 0.1)',
                  border: selected === rating ? '2px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  color: selected === rating ? '#000' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  transform: selected === rating ? 'scale(1.1)' : 'scale(1)',
                  boxShadow: selected === rating ? '0 0 20px rgba(0, 217, 255, 0.7)' : 'none',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {selected === rating && (
                  <div style={{
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    background: '#00a020',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottomLeftRadius: '8px'
                  }}>
                    <span style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>✓</span>
                  </div>
                )}
                <span style={{
                  fontSize: '1.4rem',
                  fontWeight: '700',
                  marginBottom: '0.2rem'
                }}>{rating}</span>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: '500',
                  textAlign: 'center',
                  lineHeight: '1.1'
                }}>{feelingLabels[rating - 1]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Rules Modal */}
      {showRules && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'rgba(16, 23, 42, 0.95)',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '600px',
            width: '90%',
            boxShadow: '0 4px 30px rgba(0, 217, 255, 0.3)',
            border: '1px solid rgba(0, 217, 255, 0.3)',
            color: 'white',
            position: 'relative'
          }}>
            
            <h2 style={{
              color: '#00d4ff',
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '20px',
              textAlign: 'center',
              letterSpacing: '1px'
            }}>
              MISSION RULES
            </h2>
            
            <ul style={{
              listStyleType: 'none',
              padding: '0',
              margin: '0'
            }}>
              <li style={{
                padding: '12px 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{
                  background: 'rgba(0, 217, 255, 0.2)',
                  color: '#00d4ff',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'inline-flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: '15px',
                  fontSize: '14px',
                  fontWeight: '700'
                }}>1</span>
                No cheating!
              </li>
              <li style={{
                padding: '12px 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{
                  background: 'rgba(0, 217, 255, 0.2)',
                  color: '#00d4ff',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'inline-flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: '15px',
                  fontSize: '14px',
                  fontWeight: '700'
                }}>2</span>
                You can keep trying again if you get an answer wrong.
              </li>
              <li style={{
                padding: '12px 0',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{
                  background: 'rgba(0, 217, 255, 0.2)',
                  color: '#00d4ff',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'inline-flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: '15px',
                  fontSize: '14px',
                  fontWeight: '700'
                }}>3</span>
                Nominate a group leader to enter the answers.
              </li>
            </ul>
            
            <div style={{
              textAlign: 'center',
              marginTop: '25px'
            }}>
              <button 
                onClick={() => setShowRules(false)}
                style={{
                  background: 'rgba(0, 217, 255, 0.2)',
                  color: '#00d4ff',
                  border: '1px solid rgba(0, 217, 255, 0.5)',
                  borderRadius: '6px',
                  padding: '10px 25px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default WaitingArea;