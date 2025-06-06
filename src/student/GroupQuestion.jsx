import React from 'react'
import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom' 
import { canMoveToNextQuestion } from './TeacherLinking'

import NavBar from '../NavBar';

function GroupQuestion() {
  const navigate = useNavigate();
  const { roomCode } = useParams();
  const [answer, setAnswer] = useState('')
  const [q1Answer, setQ1Answer] = useState('7237') // Answer from Question 1
  const [rightAnswer, setRightAnswer] = useState('YRBY') // Correct answer to q
  const [question, setQuestion] = useState('');
  const [incorrect, setIncorrect] = useState(1);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');


  // New: read question aloud
  const readQuestion = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      // question is stored as a string (data.question_text)
      const text = question || ''
      const utterance = new SpeechSynthesisUtterance(text)
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answer === '') return

    if (answer == rightAnswer) {
      // → navigate into Correct.jsx, passing roomCode & questionNo
      navigate('/correct', {
        state: { roomCode, questionNo: 2 }
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
        state: { roomCode, questionNo: 2 }
      })
    }
  };

  const handleColorClick = (letter) => {
    setAnswer(prev => prev + letter);
  };

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
            <p>{question ? question : "Loading question"} </p>
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

export default GroupQuestion;