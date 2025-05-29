import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button } from 'react-bootstrap';

import './App.css'

function App() {
  const [answer, setAnswer] = useState('')
  const [isCorrect, setIsCorrect] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetch('https://drp-belgium.onrender.com/api/data/')
      .then(response => response.json())
      .then(data => {
        // Assuming the API returns an object with an 'email' field
        if (data && data.email) {
          setEmail(data.email);
        }
      })
      .catch(error => console.error('Error IOSADJIOASJDIOSAJDOIASJDIOASJ:', error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setIsCorrect(answer === '0');
  };

  return (
    <>
      <h1>{email ? email : "Loading question..."}</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="questionAnswerInput">
          <Form.Label>If 5x = 0. What is x = ?</Form.Label>
          <Form.Control 
            placeholder="(Shhh the ans is 0)"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </Form.Group>
        <Button type="submit" variant="primary" className="button-space">
          Submit
        </Button>
      </Form>

      {isSubmitted && (
        <div>
          {isCorrect ? (
            <h2 className="text-success">Correct!</h2>
          ) : (
            <h2 className="text-danger">Incorrect! The answer is 0.</h2>
          )}
        </div>
      )}
    </>
  )
}

export default App
