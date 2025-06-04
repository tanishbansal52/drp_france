import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom' 

import './App.css'
import NavBar from '../NavBar';

function Question() {
  const [answer, setAnswer] = useState('')
  const navigate = useNavigate();
  const rightAnswer = '7237'; // Correct answer to q
  const [question, setQuestion] = useState('');
  const [incorrect, setIncorrect] = useState(1);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    console.log('Fetching question from API...');
    fetch('https://drp-belgium.onrender.com/api/data/')
      .then(response => response.json())
      .then(data => {
        // API returns object with 'question' field
        if (data && data.question) {
          setQuestion(data.question);
        }
        console.log('Question fetched:', data.question);
      })
      .catch(error => console.error('Error:', error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answer === '') {
      return;
    }
    if (answer == rightAnswer) {
      navigate('/correct');
    } else {
      if (incorrect < 2) {
        setIncorrect(incorrect + 1);
        setAlertMessage('That was not correct, try again!');
        setShowAlert(true);
        return;
      }
      navigate('/incorrect');
    }
  };

  return (
    <>
    <NavBar />
      <div className="text-center mb-10">
        <h1>Quiz - Algebra</h1>
        <h2 className="text-muted mb-5">Q1. Individual Round</h2>
      </div>
      <div className="col-auto">
            <div className="position-fixed" style={{ bottom: '20px', right: '20px' }}>
              <div className="bg-light border rounded p-2 d-flex align-items-center">
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

      {/* Fancy Bootstrap Alert */}
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
            💡 Hint: Make sure you're entering the numbers in the correct order.
          </p>
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="questionAnswerInput">
          <Form.Label>
            <p>{question ? question : "Fetching question from API..."} </p>
          </Form.Label>
          <Form.Control 
            placeholder="Enter your answer here"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </Form.Group>
        <Button variant='dark' type="submit" className="mt-3">
          Submit Answer
        </Button>
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

export default Question