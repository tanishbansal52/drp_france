import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from '../NavBar';
import { useNavigate, useLocation } from 'react-router-dom';
import {canMoveToNextQuestion} from './TeacherLinking';
import GreenCheckMark from '../assets/GreenCheckMark';

function Correct() {
  const navigate = useNavigate();
  const location = useLocation();
  const quizId = location.state?.quizId || localStorage.getItem('quizId');
  const roomCode = location.state?.roomCode;
  const groupId = location.state?.groupId || 0;  
  const currentQuestionIndex = location.state?.questionNo;
  
  // Add state for bonus question modal
  const [showBonusOption, setShowBonusOption] = useState(false);
  const [bonusQuestion, setBonusQuestion] = useState(null);
  const [bonusLoading, setBonusLoading] = useState(false);
  const [bonusError, setBonusError] = useState(null);
  const [showFullBonusQuestion, setShowFullBonusQuestion] = useState(false);
  
  // helper to fetch next-question type & navigate
  const navigateNext = async () => {
      try {
        // Use (currentQuestionIndex + 1) to get the type of the next question
        const res = await fetch(
          `https://drp-belgium.onrender.com/api/question-type/${currentQuestionIndex + 1}/${quizId}/`
        );
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("Received data:", data);
        
        // Determine path based on question type
        const nextPath = data.q_type === "text"
          ? `/textQs/${roomCode}`
          : `/groupquestion/${roomCode}`;
        
        // Navigate with the correct next question index
        navigate(nextPath, {
          state: { 
            roomCode, 
            questionNo: currentQuestionIndex + 1, 
            groupId, 
            quizId 
          }
        });
      } catch (err) {
        console.error('Error fetching question type:', err);
        console.log("No response from server must mean we're at the finish! ><");
        navigate(`/end`, {
          state: { 
            roomCode, 
            questionNo: currentQuestionIndex + 1, 
            groupId, 
            quizId 
          }
        });
      }
    };

  // Function to fetch bonus question
  const fetchBonusQuestion = async () => {
    try {
      setBonusLoading(true);
      setBonusError(null);
      
      const apiEndpoint = `https://drp-belgium.onrender.com/api/bonus-question/${quizId}/`;
      const res = await fetch(apiEndpoint);
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const data = await res.json();
      setBonusQuestion(data);
      setShowFullBonusQuestion(true);
    } catch (err) {
      setBonusError(err.message);
    } finally {
      setBonusLoading(false);
    }
  };

  useEffect(() => {
    if (!roomCode || currentQuestionIndex == null) return;
    let cancelled = false;

    // Show bonus option if this is the first question (index 0)
    if (currentQuestionIndex === 0) {
      setShowBonusOption(true);
    }

    const poll = async () => {
      console.log("Current Q:", currentQuestionIndex);
      const ok = await canMoveToNextQuestion(roomCode, currentQuestionIndex + 1);
      console.log("IN CORRECT at question number", currentQuestionIndex, "can move to next question:", ok);
      if (cancelled) return;
      if (ok) {
        cancelled = true;           // stop future polls
        await navigateNext();       // auto‐advance
      }
    };

    poll(); 
    const intervalId = setInterval(poll, 3000);
    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [roomCode, currentQuestionIndex]);

  return (
    <>
    <NavBar />
    <div style={{ paddingTop: '120px', position: 'relative', width: '100%' }} className="text-center">

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '40px',
        position: 'relative' // Add this to establish positioning context
      }}>
        <h1 style={{ 
          fontSize: '32px',
          fontWeight: '700',
          color: '#00d9ff',
          marginBottom: '8px',
          textShadow: '0 0 20px rgba(0, 217, 255, 0.3)',
          letterSpacing: '2px',
          margin: '0'
        }}>
          Correct!
        </h1>
        <p style={{
          color: '#9ca3af',
          fontSize: '15px',
          margin: '4px 0 0 0'
        }}>
          Waiting for teacher to move to next question...
        </p>
      {/* Bonus Question Button placed here instead */}
      {showBonusOption && !showFullBonusQuestion && (
        <button
          onClick={fetchBonusQuestion}
          style={{
            background: 'rgba(0, 217, 255, 0.2)',
            border: '1px solid rgba(0, 217, 255, 0.5)',
            color: '#00d9ff',
            fontWeight: '600',
            padding: '10px 15px',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '25px',
            marginBottom: '15px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(8px)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <span style={{ fontSize: '18px' }}></span>
          BONUS Q
        </button>
      )}
    </div>
      

              
        {/* Full Bonus Question Pop-up */}
        {showFullBonusQuestion && (
          <>
            {/* Gray overlay for the background */}
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              zIndex: 999
            }} />
            
            <div style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(16, 23, 42, 0.95)',
              borderRadius: '12px',
              border: '1px solid rgba(0, 217, 255, 0.5)',
              padding: '25px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backdropFilter: 'blur(12px)',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}>
              <h2 style={{ 
                color: '#00d9ff', 
                fontSize: '24px', 
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                Bonus Question
              </h2>
              
              {bonusLoading && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <div className="spinner-border text-info" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
              
              {bonusError && (
                <div style={{ 
                  color: '#ff4444', 
                  textAlign: 'center', 
                  padding: '20px' 
                }}>
                  Error loading bonus question: {bonusError}
                </div>
              )}
              
              {!bonusLoading && !bonusError && bonusQuestion && (
                <div style={{ textAlign: 'center' }}>
                  <p style={{ 
                    fontSize: '18px', 
                    lineHeight: '1.6', 
                    color: 'white',
                    marginBottom: '20px',
                    whiteSpace: 'pre-line'
                  }}>
                    {bonusQuestion.question_text}
                  </p>
                </div>
              )}
              
              {/* Close button moved below the question */}
              <button 
                onClick={() => {
                  setShowFullBonusQuestion(false);
                  setShowBonusOption(true);
                }}
                style={{
                  background: 'rgba(0, 217, 255, 0.2)',
                  border: '1px solid rgba(0, 217, 255, 0.5)',
                  color: '#00d9ff',
                  fontWeight: '600',
                  padding: '10px 25px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginTop: '20px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  backdropFilter: 'blur(8px)',
                  fontSize: '16px'
                }}
              >
                Close
              </button>
            </div>
          </>
        )}
        
        {/* Gif */}
        <div className="d-flex justify-content-center">
          <img src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExY25pZXBzNWtxcTZibGEzcjNjcGdsazhmZW51b3hrOTZibG85eXk0aiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ely3apij36BJhoZ234/giphy.gif" alt="Funny gif" />
        </div>
      </div>
    </>
  );
}
export default Correct;