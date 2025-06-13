import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Form, Button, Alert } from 'react-bootstrap'
import '../css/IndividualQuestion.css'
import NavBar from '../NavBar';
import axios from 'axios';
import { canMoveToNextQuestion } from './TeacherLinking'
import { FaVolumeUp, FaArrowRight } from 'react-icons/fa'

function TextBasedQuestion() {
  const navigate = useNavigate()
  const { roomCode } = useParams()
  const location = useLocation()
  const [quizId, setQuizId] = useState();
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Store quizId in localStorage whenever it changes
  useEffect(() => {
    if (quizId !== undefined) {
      localStorage.setItem('quizId', quizId);
    }
  }, [quizId]);

  console.log("qNumber in TextBased Q:", location.state);
  const [indexOfQuestion, setQNumber] = useState(location.state?.questionNo ?? 1)
  localStorage.setItem('qNumber', indexOfQuestion);
  const [answer, setAnswer] = useState('')
  const [question, setQuestion] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const groupId = location.state?.groupId || 0;
  const [incorrect, setIncorrect] = useState(0);

  const [spinoffMode, setSpinoffMode] = useState(false);
  const spinoffQuestion = {
    quiz: 'Spinoff Question',
    question_text: `Split into two decoding teams. Each team has one half of a 2-part access code. Use your value of x from Level 1.\nTeam Alpha (2 students):
Plug x into the equation:
y = 3x + 2
Whats the value of y?
Team Beta (2 students):
Use the same x in a different code line:
z = 5x - 6
Whats the value of z?
Once both teams have their answers, combine them:
Final Code for Level 2: y + z = ?`,
    answer: '35',
    points: 10
  }

  // Polling for spinoff mode
  useEffect(() => {
    if (!roomCode) return;

    const checkSpinoffMode = async () => {
      try {
        const response = await fetch(`https://drp-belgium.onrender.com/api/get-room-spinoff/${roomCode}/`);
        const data = await response.json();

        if (data.spinoff_mode !== undefined) {
          setSpinoffMode(data.spinoff_mode);
        }
      } catch (error) {
        console.error('Error checking spinoff mode:', error);
      }
    };

    // Initial check
    checkSpinoffMode();

    // Set up polling every 2 seconds
    const pollInterval = setInterval(checkSpinoffMode, 2000);

    // Cleanup interval on component unmount
    return () => clearInterval(pollInterval);
  }, [roomCode]);

  console.log("groupId in Individual q:", groupId);

  // Fetch quizId...
  useEffect(() => {
    if (!roomCode) return;
    fetch(`https://drp-belgium.onrender.com/api/get-room-quiz-id/${roomCode}/`)
      .then(r => r.json())
      .then(d => d.quiz_id && setQuizId(d.quiz_id))
      .catch(console.error)
  }, [roomCode]);

  console.log('Quiz ID VIA ROOM CODE:', quizId);

  // read question aloud
  const readQuestion = () => {
    if ('speechSynthesis' in window) {
      if (window.speechSynthesis.speaking) {
        // If already speaking, cancel speech
        window.speechSynthesis.cancel()
        setIsSpeaking(false)
        return
      }
      
      // Otherwise start speech
      window.speechSynthesis.cancel() // Clear any previous instances first
      const utterance = new SpeechSynthesisUtterance(currentQuestion.question_text)
      utterance.lang = 'en-GB'
      
      utterance.onend = () => setIsSpeaking(false)
      setIsSpeaking(true)
      window.speechSynthesis.speak(utterance)
    } else {
      alert('Speech Synthesis not supported in this browser.')
    }
  }
  
  useEffect(() => {
    const onKeyDown = e => {
      if (e.key.toLowerCase() === 'r') {
        e.preventDefault()
        readQuestion()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [question])

  // Fetch question...
  useEffect(() => {
    if (!quizId && quizId !== 0) return;
    const fetchQuestion = async () => {
      try {
        const res = await fetch(
          `https://drp-belgium.onrender.com/api/questions/${indexOfQuestion}/${quizId}/`
        );
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        if (data?.question_text) {
          setQuestion(data);
        } else {
          throw new Error('No question text');
        }
      } catch (err) {
        console.error('Error fetching question:', err);
        console.log("No response from server must mean we're at the finish! ><")
        navigate('/end', {
          state: { roomCode, questionNo: indexOfQuestion, groupId, quizId }
        });
      }
    };

    fetchQuestion();
  }, [quizId, indexOfQuestion]);

  // Poll teacher to move on when stuck on an incorrect
  useEffect(() => {
    let cancelled = false
    const poll = async () => {
      if (cancelled) return
      // Only increment if indexOfQuestion < 2
      if (indexOfQuestion < 2) {
        const currentQuestion = indexOfQuestion + 1
        const ok = await canMoveToNextQuestion(roomCode, currentQuestion)
        console.log("In TEXT BASED Q can move to next question is:", ok, "for question number:", currentQuestion, "at index", indexOfQuestion);
        if (ok) {
          cancelled = true
          setShowAlert(false)
          setQNumber(prev => Math.min(prev + 1, 2)) // Prevent going above 2
        }
      }
    }
    const id = setInterval(poll, 3000)
    return () => { cancelled = true; clearInterval(id) }
  }, [roomCode, indexOfQuestion])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answer) return

    // If in spinoff mode, handle differently 
    if (spinoffMode) {
      // Handle spinoff question submission
      console.log('Spinoff answer submitted:', answer);
      navigate('/correct', {
          state: { roomCode, questionNo: indexOfQuestion, groupId }
        })
      return;
    }

    try {
      const { data } = await axios.post("https://drp-belgium.onrender.com/api/submit/", {
        group_id: groupId,
        question_id: question.question_id,
        answer: answer
      });

      if (data.correct) {
        navigate('/correct', {
          state: { roomCode, questionNo: indexOfQuestion, groupId }
        })
      } else {
        setAlertMessage('That was not correct, try again!')
        setShowAlert(true)
        setAnswer('')
      }
    } catch (err) {
      // Catch any error that occurs during the request
      console.error('Submission error:', err);
      setAlertMessage('Something went wrong. Please try again later.');
      setShowAlert(true);
    }
  };

  // Get the current question to display
  const currentQuestion = spinoffMode ? spinoffQuestion : question;

  useEffect(() => {
    if (indexOfQuestion === 3) {
      navigate('/end', {
        state: { roomCode, questionNo: indexOfQuestion, groupId, quizId }
      });
    }
  }, [indexOfQuestion, navigate, roomCode, groupId, quizId]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <NavBar />
      
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
            fontSize: '32px',
            fontWeight: '700',
            color: '#00d9ff',
            marginBottom: '0',
            textShadow: '0 0 20px rgba(0, 217, 255, 0.3)',
            letterSpacing: '2px'
          }}>
            Mission: Algebra
          </h1>
          <h2 style={{ 
            fontSize: '18px',
            fontWeight: '600',
            color: '#00d9ff',
            opacity: '0.8',
            marginTop: '8px'
          }}>
            {spinoffMode ? "SpinOff Question" : "Individual Round"}
          </h2>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="col-auto">
        <div className="position-fixed" style={{ bottom: '20px', right: '20px' }}>
          <div className="bg-dark border rounded p-2 d-flex align-items-center">
            <span className="me-2">Stage 1 of 2</span>
            <div className="progress" style={{ width: '100px', height: '8px' }}>
              <div
                className="progress-bar bg-primary"
                role="progressbar"
                style={{ width: '50%' }}
                aria-valuenow="50"
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </div>
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
          padding: '24px',
          maxWidth: '1000px',
          width: '100%',
          position: 'relative',
          border: '1px solid rgba(0, 217, 255, 0.3)',
          backdropFilter: 'blur(10px)'
        }}>
          {/* Question Header */}
          <div className="mb-3" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '16px' 
          }}>
            <span style={{
              background: 'rgba(0, 217, 255, 0.2)',
              color: '#00d9ff',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '16px',
              fontWeight: '600',
              border: '1px solid rgba(0, 217, 255, 0.3)'
            }}>
              Question {spinoffMode ? "SpinOff" : (indexOfQuestion || 1)}
            </span>
          </div>

          {/* Alert for incorrect answers */}
          {showAlert && (
            <Alert 
              variant="danger" 
              dismissible 
              onClose={() => setShowAlert(false)}
              style={{
                marginBottom: '20px',
                borderRadius: '8px',
                border: '1px solid rgba(220, 53, 69, 0.3)',
                backgroundColor: 'rgba(220, 53, 69, 0.1)',
                color: '#f8d7da',
                fontWeight: '500'
              }}
            >
              {alertMessage}
            </Alert>
          )}

          {/* Question Content with Read Aloud Button */}
          <div style={{ 
            fontSize: '20px', 
            lineHeight: '1.6', 
            marginBottom: '30px',
            marginTop: '20px',
            whiteSpace: 'pre-wrap',
            color: '#ffffff',
            textAlign: 'center',
            padding: '0 60px',
            position: 'relative',
            fontWeight: '500'
          }}>
            {currentQuestion ? currentQuestion.question_text : "Loading question"}
            <button 
              onClick={readQuestion}
              className="volume-button"
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                boxShadow: 'none',
                color: isSpeaking ? '#ff6b6b' : '#00d9ff',
                fontSize: '18px',
                padding: 0,
                cursor: 'pointer',
                display: 'inline-flex',
                verticalAlign: 'middle',
                marginLeft: '6px',
                position: 'relative',
                zIndex: '5'
              }}
              title={window.speechSynthesis?.speaking ? "Stop reading" : "Read question aloud"}
            >
              <FaVolumeUp style={{ pointerEvents: 'none' }} />
            </button>
          </div>

          {/* Answer Form */}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="questionAnswerInput" style={{ position: 'relative' }}>
              <Form.Control
                placeholder="Enter your answer here"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                style={{
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid rgba(0, 217, 255, 0.3)',
                  borderRadius: '8px',
                  color: 'white',
                  padding: '12px 16px',
                  paddingRight: '50px', // Add space for the arrow
                  fontSize: '18px',
                  marginBottom: '20px'
                }}
              />
              <Button 
                variant="link" 
                type="submit"
                style={{
                  position: 'absolute',
                  right: '-892px',
                  top: '-66.5px',
                  height: '100%',
                  color: '#00d9ff',
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  boxShadow: 'none',
                  fontSize: '20px',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: '5'
                }}
                aria-label="Submit answer"
              >
                <FaArrowRight />
              </Button>
            </Form.Group>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default TextBasedQuestion