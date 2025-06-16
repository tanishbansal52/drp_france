import React from 'react'
import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams, useLocation } from 'react-router-dom' 
import { canMoveToNextQuestion } from './TeacherLinking'
import axios from 'axios';

import NavBar from '../NavBar';

function ButtonBasedQuestion() {
  const navigate = useNavigate();
  const { roomCode } = useParams();
  const [answer, setAnswer] = useState('')
  const [q1Answer, setQ1Answer] = useState('7237') // Answer from Question 1
  const [rightAnswer, setRightAnswer] = useState('YRBY') // Correct answer to q
  const [question, setQuestion] = useState('');
  const [incorrect, setIncorrect] = useState(1);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const location = useLocation();
  const groupId = location.state?.groupId || 0;

  const [spinoffMode, setSpinoffMode] = useState(false);
  const spinoffQuestion = {
    quiz: 'Spinoff Question',
    question_text: `Split into two decoding teams. Each team has one half of a 2-part access code. Use your value of x from Level 1.
Team Alpha (2 students):
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
    
    let cancelled = false;
    const poll = async () => {
      if (cancelled) return;
      
      const ok = await canMoveToNextQuestion(roomCode, 3); // For the final question
      console.log("In BUTTON BASED Q can move to next question is:", ok);
      
      if (ok) {
        cancelled = true;
        navigate('/end', {
          state: { roomCode, questionNo: 2, groupId, quizId }
        });
      }
    };
    
    const intervalId = setInterval(poll, 3000);
    return () => { 
      cancelled = true; 
      clearInterval(intervalId); 
    };
  }, [roomCode, groupId]);

  // New: read question aloud
  const readQuestion = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      // question is stored as a string (data.question_text)
      const text = question || ''
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-GB'
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
  }, [readQuestion])

  useEffect(() => {
    console.log('Fetching question from API...');
    fetch('https://drp-belgium.onrender.com/api/questions/2/')
      .then(response => response.json())
      .then(data => {
        // API returns object with 'question' field
        if (data && data.question_text) {
          setQuestion(data.question_text);
          setRightAnswer(data.answer || "0"); // Right answer from API
        }
        console.log('Question fetched:', data.question);
      })
      .catch(error => console.error('Error:', error));

    console.log('Fetching answer to question 1...');
    fetch('https://drp-belgium.onrender.com/questions/1/')
    .then(response => response.json())
    .then(data => {
      if (data && data.answer) {
        setQ1Answer(data.answer);
      }
    })
    .catch(error => console.error('Error fetching Q1:', error));

  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (answer === '') return

    // If in spinoff mode, handle differently 
    if (spinoffMode) {
      // Handle spinoff question submission
      console.log('Spinoff answer submitted:', answer);
      if (answer.toLowerCase() === spinoffQuestion.answer.toLowerCase()) {
      // → navigate into Correct.jsx, passing roomCode & questionNo
      navigate('/correct', {
        state: { roomCode, questionNo: 2, groupId }
      })
    } else {
      if (incorrect < 2) {
        setIncorrect(incorrect + 1);
        setAlertMessage('That was not correct, try again!');
        setShowAlert(true);
        setAnswer(''); // Clear the answer input
        return;
      }
      navigate('/incorrect', {
        state: { roomCode, questionNo: 2, groupId }
      })
    }
      return;
    }

    try {
    // Make POST request with Axios
    console.log('Submitting answer:', answer);
    console.log('Group ID:', groupId);
    console.log('Question ID:', question.question_id);
    const response = await axios.post("https://drp-belgium.onrender.com/api/submit/", {
      group_id: groupId,
      question_id: 3,
      answer: answer
    });

    // Handle the response data
    const data = response.data; // Axios automatically parses the response

    if (answer == rightAnswer) {
      // → navigate into Correct.jsx, passing roomCode & questionNo
      navigate('/correct', {
        state: { roomCode, questionNo: 2, groupId }
      })
    } else {
      if (incorrect < 2) {
        setIncorrect(incorrect + 1);
        setAlertMessage('That was not correct, try again!');
        setShowAlert(true);
        setAnswer(''); // Clear the answer input
        return;
      }
      navigate('/incorrect', {
        state: { roomCode, questionNo: 2, groupId }
      })
    }
  }
  catch (err) {
    // Catch any error that occurs during the request
    console.error('Submission error:', err.error);
    setAlertMessage('Something went wrong. Please try again later.');
    setShowAlert(true);
  }
  };

  const handleColorClick = (letter) => {
    setAnswer(prev => prev + letter);
  };

  // Get the current question to display
  const currentQuestion = spinoffMode ? spinoffQuestion : question;

  return (
    <>
    <NavBar />
      <div className="text-center mb-10">
        <h1>Quiz - Algebra</h1>
        <h2 className="mb-5">Q2. Group Round</h2>
      </div>

      {showAlert && (
        <Alert 
          variant="danger" 
          dismissible 
          onClose={() => setShowAlert(false)}
          className="mx-3 mb-3 alert-animated"
          style={{
            animation: 'slideDown 0.3s ease-out',
            boxShadow: '0 4px 12px rgba(220, 53, 69, 0.3)',
            border: '2px solid #dc3545'
          }}
        >
          <Alert.Heading>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Oops!  {alertMessage}
          </Alert.Heading>
      
          <hr />
          <p className="mb-0" style={{ fontSize: '0.9em', color: '#721c24' }}>
            💡 Hint: Use the answer to Question 1 here.
          </p>
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="questionAnswerInput">
          <Form.Label>
            <p>{currentQuestion ? currentQuestion : "Loading question"} </p>
          </Form.Label>
          <Alert variant="info" className="my-2">
        💡 Hint: Answer to question1 = {q1Answer}
      </Alert>
        </Form.Group>

        <div className="d-flex justify-content-between my-3">
    <Button variant="danger" onClick={() => handleColorClick('R')}>RED</Button>
    <Button variant="primary" onClick={() => handleColorClick('B')}>BLUE</Button>
    <Button variant="success" onClick={() => handleColorClick('G')}>GREEN</Button>
    <Button variant="warning" onClick={() => handleColorClick('Y')}>YELLOW</Button>
  </div>
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

export default ButtonBasedQuestion;