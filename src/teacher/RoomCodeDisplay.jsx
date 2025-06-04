import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import NavBar from '../NavBar';

function RoomCodeDisplay() {
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // generate a random 4-digit room code
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setRoomCode(code);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(roomCode);
  };

  const codeStyle = {
    fontSize: '6rem',
    fontWeight: 700,
    letterSpacing: '0.3em',
    color: '#0d6efd',
    textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
  };

  return (
    <>
      <NavBar />
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Card className="shadow-lg p-5 text-center">
          <Card.Body>
            <Card.Title className="mb-4 display-5">🎯 Your Mission Code</Card.Title>
            <div
              style={{ ...codeStyle, cursor: 'pointer' }}
              title="Click to copy code"
              onClick={handleCopy}
            >
              {roomCode}
            </div>
            <div className="mt-4 d-flex justify-content-center">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/teacher/displayquestion')}
              >
                Start
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default RoomCodeDisplay;