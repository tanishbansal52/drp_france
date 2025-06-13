import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import NavBar from '../NavBar'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useEffect } from 'react'

const Finish = ({ onRestart }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const roomCode = location.state?.roomCode;
  const [roomId, setRoomId] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const markComplete = async () => {
      try {
        setLoading(true);
        setError(null);
        const resp = await axios.post("https://drp-belgium.onrender.com/api/mark-mission-complete/", {
          room_code: roomCode
        });
        console.log("Response:", resp.data);
        setRoomId(resp.data.room_id);
      } catch (error) {
        console.error('Error marking mission complete:', error);
        setError('Failed to mark mission as complete. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    markComplete(); 
  }, []); 

  return (
    <div style={{ 
      minHeight: '100vh', 
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <NavBar/>
      
      {/* Header */}
      <div style={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginBottom: '60px',
        padding: '20px 30px 0 30px',
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
            Mission Complete
          </h1>
          <p style={{
            color: '#9ca3af',
            fontSize: '15px',
            margin: '4px 0 0 0'
          }}>
            All student teams have completed the mission
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '0 30px 20px 30px'
      }}>
        <div style={{
          background: 'rgba(30, 41, 59, 0.6)',
          borderRadius: '12px',
          padding: '30px',
          maxWidth: '800px',
          width: '100%',
          position: 'relative',
          border: '1px solid rgba(0, 217, 255, 0.3)',
          backdropFilter: 'blur(10px)',
          textAlign: 'center'
        }}>
          {loading && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              padding: '40px' 
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '4px solid rgba(0, 217, 255, 0.2)',
                borderTop: '4px solid #00d9ff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
            </div>
          )}
          
          {!loading && error && (
            <div style={{ 
              color: '#ef4444', 
              padding: '20px', 
              background: 'rgba(239, 68, 68, 0.1)', 
              borderRadius: '8px', 
              marginBottom: '20px',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}>
              {error}
            </div>
          )}
          
          {!loading && !error && (
            <>
              <p style={{ 
                fontSize: '18px', 
                lineHeight: '1.6', 
                marginBottom: '30px',
                color: '#f0f4f8' 
              }}>
                The mission has been successfully completed and all data has been recorded.
                You can now view the mission report or return to the dashboard.
              </p>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '20px',
                flexWrap: 'wrap' 
              }}>
                <Button 
                  variant="outline-light" 
                  onClick={() => navigate('/')}
                  style={{
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    borderRadius: '8px',
                    background: 'transparent',
                    color: '#d1d5db',
                    border: '2px solid rgba(75, 85, 99, 0.4)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    minWidth: '180px'
                  }}
                >
                  Return to Dashboard
                </Button>
                
                <Button 
                  variant="primary" 
                  onClick={() => navigate('/teacher/report/', {state: { roomId: roomId }})}
                  style={{
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    borderRadius: '8px',
                    background: 'rgba(0, 217, 255, 0.2)',
                    color: '#00d9ff',
                    border: '1px solid rgba(0, 217, 255, 0.5)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    minWidth: '180px'
                  }}
                >
                  View Mission Report
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default Finish