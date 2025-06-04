import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom' 
import axios from 'axios';

import './Landing.css'
import NavBar from './NavBar';

function Landing() {
  const [roomCode, setRoomCode] = useState('');
  const [groupName, setGroupName] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomCode || !groupName) {
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/api/join-room/", {
        room_code: roomCode,
        group_name: groupName,
      });

      console.log("Joined:", res.data);
      // Navigate to waiting room or store info
      navigate('/waiting', {
      state: { groupName }
    });
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error);
      } else {
        setError("Something went wrong.");
      }
    }

    if (error) {
      alert(error);
      setError('');
      setRoomCode('');
      setGroupName('');
      return;
    }
  };

  return (
    <>
    <NavBar />
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-200">
        <Col md={{ span: 6, offset: 3 }}>
          <Card className="shadow-lg p-4">
            <Card.Body>
              <div className="text-center mb-4">
                <h1 className="fw-bold">Welcome Jamie and Tom!</h1>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="roomCode">
                  <Form.Label>
                    Enter the mission code shown on your teacher's screen to continue!
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter mission code"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="groupName">
                  <Form.Label>Pick a name for your group!</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter group name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                </Form.Group>
                <p>
                  All done? Press here if you're ready for your mission!
                </p>
                <div className="d-grid">
                  <Button type="submit" variant='dark' size="lg">
                    Click Here!
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    </>
  );
}

export default Landing
