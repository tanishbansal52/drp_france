import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom' 

import './Landing.css'

function Landing() {
  const [roomCode, setRoomCode] = useState('')
  const [groupName, setgroupName] = useState('')
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
          <Form.Label>Enter the mission code shown on your teacher's screen to continue!</Form.Label>
          <Form.Control 
            placeholder="Enter mission code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
          />
          <Form.Label>Pick a name for your group!</Form.Label>
          <Form.Control 
            placeholder="Enter group name"
            value={groupName}
            onChange={(e) => setgroupName(e.target.value)}
          />
        </Form.Group>
        <Button type="submit" variant="primary" className='button-space'>
          Submit
        </Button>
      </Form>
    </>
  )
}

export default Landing
