import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Form, Button, Alert } from 'react-bootstrap'
import '../css/IndividualQuestion.css'
import NavBar from '../NavBar';
import axios from 'axios';
import { canMoveToNextQuestion } from './TeacherLinking'

function TextBasedQuestion() {
  const navigate = useNavigate()
  const { roomCode } = useParams()
  const location = useLocation()   
  const [quizId, setQuizId] = useState();
  localStorage.setItem('quizId', quizId);
  console.log("qNumber in TextBased Q:", location.state);
  const [indexOfQuestion, setQNumber] = useState(location.state?.questionNo ?? 1)
  localStorage.setItem('qNumber', indexOfQuestion);
  const [answer, setAnswer] = useState('')
  const [question, setQuestion] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const groupId = location.state?.groupId || 0;

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
        const response = await fetch(`http://127.0.0.1:8000/api/get-room-spinoff/${roomCode}/`);
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
    fetch(`http://127.0.0.1:8000/api/get-room-quiz-id/${roomCode}/`)
      .then(r => r.json())
      .then(d => d.quiz_id && setQuizId(d.quiz_id))
      .catch(console.error)
  }, [roomCode]);

  console.log('Quiz ID VIA ROOM CODE:', quizId);

  // read question aloud
  const readQuestion = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(question.question_text)
      utterance.lang = 'en-US'
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
          `http://127.0.0.1:8000/api/questions/${indexOfQuestion}/${quizId}/`
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
      const currentQuestion = indexOfQuestion + 1
      const ok = await canMoveToNextQuestion(roomCode, currentQuestion)
      console.log("In TEXT BASED Q can move to next question is:", ok, "for question number:", currentQuestion, "at index", indexOfQuestion);
      if (ok) {
        cancelled = true
        setShowAlert(false)
        setQNumber(prev => prev + 1)
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
      if (answer.toLowerCase() === spinoffQuestion.answer.toLowerCase()) {
        console.log("CORRECT ANSWER ENTERED PATH");
        setQNumber(qNumber + 1);
        navigate('/correct', {
          state: { roomCode, questionNo: 1, groupId }
        })
      } else {
        console.log("INCORRECT PATH");
        if (incorrect < 2) {
          setIncorrect(incorrect + 1);
          setAlertMessage('That was not correct, try again!');
          setShowAlert(true);
          return;
        }
        navigate('/incorrect', {
          state: { roomCode, questionNo: 1, groupId }
        })
      }
      return;
    }

    try {
      const {data} = await axios.post("https://drp-belgium.onrender.com/api/submit/", {
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

  return (
    <>
      <NavBar />
      <div className="text-center mb-10">
        <h1>Quiz - Algebra</h1>
        <h2 className="text-info text-xl leading-tight">{spinoffMode ? "SpinOff Question" : "Individual Round"}</h2>
        {/* <h4 className="text-muted text-base font-medium leading-none">This Question is worth 10 points.</h4> 
        */}
        <h4 className="text-info text-base font-medium leading-none">
          This Question is worth {currentQuestion ? currentQuestion.points : '...'} points.
        </h4>

      </div>
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

      {showAlert && (
        <Alert variant="danger" dismissible onClose={() => setShowAlert(false)}>
          {alertMessage}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="questionAnswerInput">
          <Form.Label>
            <div style={{ whiteSpace: 'pre-wrap' }}>
              <p className="h5">{currentQuestion ? currentQuestion.question_text : "Loading question"} </p>
            </div>
          </Form.Label>
          <Form.Control
            placeholder="Enter your answer here"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </Form.Group>
        <div className="d-flex justify-content-center gap-3 mt-3">
          <Button variant="secondary" size="lg" onClick={readQuestion}>
            Read Q Aloud
          </Button>
          <Button variant="dark" size="lg" type="submit">
            Submit
          </Button>
        </div>
      </Form>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  )
}

export default TextBasedQuestion