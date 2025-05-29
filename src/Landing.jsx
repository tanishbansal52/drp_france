import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom' 

import './Landing.css'

function Landing() {
  const [roomCode, setRoomCode] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/question')
  };

  return (
    <>
      <h1>Pentagon(?)</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="landingPageForm">
          <Form.Label>Enter room code</Form.Label>
          <Form.Control 
            placeholder="(Enter anything hehe)"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
          />
        </Form.Group>
        <Button type="submit" variant="primary">
          Submit
        </Button>
      </Form>
    </>
  )
}

export default Landing
