import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from '../NavBar';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function End() {
  const navigate = useNavigate();

  const location = useLocation();
  const groupId = location.state?.groupId || 0;
  const quizId = location.state?.quizId || localStorage.getItem('quizId');

  const [selectedRating, setSelectedRating] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const ratings = [
    { label: 'Very Negative', color: 'bg-red-500', value: 1 },
    { label: 'Negative', color: 'bg-orange-500', value: 2 },
    { label: 'Neutral', color: 'bg-yellow-500', value: 3 },
    { label: 'Positive', color: 'bg-lime-500', value: 4 },
    { label: 'Very Positive', color: 'bg-green-500', value: 5 }
  ];

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
            You have successfully completed your mission
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
            How confident do you feel about algebra now that you have completed your mission?
          </p>
          
          <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '30px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              width: '80%',
              maxWidth: '500px'
            }}>
              <span style={{ color: '#9ca3af', marginRight: '10px' }}>−</span>
              <div style={{ 
                display: 'flex',
                flex: '1',
                height: '48px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '2px solid rgba(75, 85, 99, 0.4)'
              }}>
                {ratings.map((rating) => (
                  <button
                    key={rating.value}
                    onClick={() => handleRatingClick(rating.value)}
                    style={{ 
                      flex: '1',
                      border: 'none',
                      position: 'relative',
                      background: rating.color.replace('bg-', ''),
                      transition: 'all 0.2s ease',
                      outline: selectedRating === rating.value ? '2px solid #3b82f6' : 'none',
                      filter: selectedRating === rating.value ? 'brightness(1.1)' : 'brightness(1)'
                    }}
                    title={rating.label}
                  >
                    <div style={{
                      position: 'absolute',
                      inset: '0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{
                        fontWeight: 'bold',
                        fontSize: '18px',
                        textShadow: selectedRating === rating.value ? '0 0 8px rgba(255, 255, 255, 0.5)' : 'none'
                      }}>
                        {rating.value}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              <span style={{ color: '#9ca3af', marginLeft: '10px' }}>+</span>
            </div>
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
            Submit Rating
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
              Thank you for your feedback!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default End;