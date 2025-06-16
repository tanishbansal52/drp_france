import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from '../NavBar';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function End() {
  const navigate = useNavigate();

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

const feelingLabels = [
  "Very Negative",
  "Negative", 
  "Neutral",
  "Positive",
  "Very Positive"
];

  const location = useLocation();
  const groupId = location.state?.groupId || 0;
  const quizId = location.state?.quizId || localStorage.getItem('quizId');
  const isRobotTheme = Number(quizId) === 16;
  const [selectedRating, setSelectedRating] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleRatingClick = async (value) => {
    setSelectedRating(value);
  };

  const handleRatingSubmit = async () => {
    console.log(`Rating selected: ${selectedRating}`);
    try {
      const resp = await axios.post("https://drp-belgium.onrender.com/api/update-after-rating/", {
      // const resp = await axios.post("http://localhost:8000/api/update-after-rating/", {
        after_rating: selectedRating,
        group_id: groupId
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  }

  return (
    <>
      <style>{noHoverStyle}</style>
    <div style={{ 
      minHeight: '100vh', 
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: isRobotTheme
        ? 'url(/public/robot-bg.svg) center/cover no-repeat'
        : undefined
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
            fontSize: '65px',
            fontWeight: '700',
            color: '#00d9ff',
            marginBottom: '8px',
            textShadow: '0 0 20px rgba(0, 217, 255, 0.3)',
            letterSpacing: '2px'
          }}>
            {isRobotTheme 
              ? 'Mission Complete' 
              : 'Mission Complete'}
          </h1>
          <p style={{
            color: '#9ca3af',
            fontSize: '20px',
            margin: '4px 0 0 0'
          }}>
            {isRobotTheme
              ? 'Well done! You have defeated Baron von Frogface.'
              : 'You have successfully completed your mission'}
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
          <p style={{ 
            fontSize: '18px', 
            lineHeight: '1.6', 
            marginBottom: '30px',
            color: '#f0f4f8' 
          }}>
            How confident do you feel about Fractions & Percentages now?
          </p>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '30px'
          }}>
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => handleRatingClick(rating)}
                className="rating-button-no-hover"
                style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '80px',
                  height: '80px',
                  background: selectedRating === rating ? '#00d4ff' : 'rgba(255, 255, 255, 0.1)',
                  border: selectedRating === rating ? '2px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  color: selectedRating === rating ? '#000' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  transform: selectedRating === rating ? 'scale(1.1)' : 'scale(1)',
                  boxShadow: selectedRating === rating ? '0 0 20px rgba(0, 217, 255, 0.7)' : 'none',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {selectedRating === rating && (
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

          <button
            onClick={handleRatingSubmit}
            disabled={selectedRating === null}
            style={{
              padding: '10px 25px',
              fontSize: '14px',
              fontWeight: '600',
              borderRadius: '8px',
              background: 'rgba(0, 217, 255, 0.2)',
              color: '#00d9ff',
              border: '1px solid rgba(0, 217, 255, 0.5)',
              cursor: selectedRating === null ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              opacity: selectedRating === null ? '0.6' : '1'
            }}
          >
            Submit
          </button>

          {submitted && (
            <div style={{
              marginTop: '20px',
              padding: '10px',
              borderRadius: '8px',
              background: 'rgba(0, 200, 83, 0.1)',
              color: '#00c853',
              border: '1px solid rgba(0, 200, 83, 0.3)'
            }}>
              Thank you for the feedback!
            </div>
          )}
        </div>

        {/* robot UI overlay */}
        {isRobotTheme && (
          <div className="robot-overlay" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none'
          }}>
          <img
            src="/r1_nobg.png"
            alt="Robot Q2"
            style={{
              position: 'absolute',
              top: '63%',
              left: '38%',
              width: '300px',
              opacity: 1,
              filter: 'brightness(1.5)'  
            }}/>
          </div>
        )}
      </div>
    </div>
  </>
  );
}

export default End;