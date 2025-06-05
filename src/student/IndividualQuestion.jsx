import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Form, Button, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom' 

import '../css/IndividualQuestion.css'
import NavBar from '../NavBar';
import axios from 'axios';

function IndividualQuestion() {
  const [answer, setAnswer] = useState('')
  const navigate = useNavigate();
  // const [rightAnswer, setRightAnswer] = useState('0') // Correct answer to q
  const [question, setQuestion] = useState('');
  const [incorrect, setIncorrect] = useState(1);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    console.log('Fetching question from API...');
    fetch('https://drp-belgium.onrender.com/api/questions/1/')
      // fetch('http://127.0.0.1:8000/api/questions/1/')
      .then(response => response.json())
      .then(data => {
        // API returns object with 'question' field
        if (data && data.question_text) {
          setQuestion(data);
          // setRightAnswer(data.answer || "0"); // Right answer from API
        }
        console.log('Question fetched:', data.question);
      })
      .catch(error => console.error('Error:', error));
  }, []);

  // const handleSubmit = async(e) => {
  //   console.log("SOME PATH")
    // e.preventDefault();
    // console.log("SOME PATH")
    // if (answer === '') {
    //   return;
    // }
    // if (answer == rightAnswer) {
    //   navigate('/correct');
    // } else {
    //   if (incorrect < 2) {
    //     setIncorrect(incorrect + 1);
    //     setAlertMessage('That was not correct, try again!');
    //     setShowAlert(true);
    //     return;
    //   }
    //   navigate('/incorrect');
    // }


  //   const res = await
  //   axios.post("https://drp-belgium.onrender.com/api/submit/", {
  //       group_id: 1, // Replace with real group ID if needed
  //       question_id: question.question_id,
  //       answer: answer
  //   })
  //     .then(res => res.json())
  //     .then(data => {
  //       if (data.correct == true) {
  //         console.log("CORRECT PATH")
  //         navigate('/correct');
  //       } else {
  //         console.log("INCORRECT PATH")
  //         if (incorrect < 2) {
  //           setIncorrect(incorrect + 1);
  //           setAlertMessage('That was not correct, try again!');
  //           setShowAlert(true);
  //           return;
  //         }
  //         navigate('/incorrect');
  //       }
  //     })
  //     .catch(err => {
  //       console.error('Submission error:', err);
  //     });
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    // Make POST request with Axios
    const response = await axios.post("https://drp-belgium.onrender.com/api/submit/", {
      group_id: 1, // Replace with real group ID if needed
      question_id: question.question_id,
      answer: answer
    });

    // Handle the response data
    const data = response.data; // Axios automatically parses the response

    if (data.correct === true) {
      console.log("CORRECT PATH");
      navigate('/correct');
    } else {
      console.log("INCORRECT PATH");
      if (incorrect < 2) {
        setIncorrect(incorrect + 1);
        setAlertMessage('That was not correct, try again!');
        setShowAlert(true);
        return;
      }
      navigate('/incorrect');
    }
  } catch (err) {
    // Catch any error that occurs during the request
    console.error('Submission error:', err);
    setAlertMessage('Something went wrong. Please try again later.');
    setShowAlert(true);
  }
};


  return (
    <>
      <NavBar />
      <div className="text-center mb-10">
        <h1>Quiz - Algebra</h1>
        <h2 className="text-muted text-xl leading-tight">Q1. Individual Round</h2>
        {/* <h4 className="text-muted text-base font-medium leading-none">This Question is worth 10 points.</h4> 
        */}
        <h4 className="text-muted text-base font-medium leading-none">
          This Question is worth {question ? question.points : '...'} points.
        </h4>

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
            <p>{question ? question.question_text : "Loading question"} </p>
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

export default IndividualQuestion