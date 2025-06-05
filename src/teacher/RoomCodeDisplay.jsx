import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function RoomCodeDisplay() {
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // generate a random 4-digit room code
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setRoomCode(code);

    // Send POST request to create the room
    fetch('https://drp-belgium.onrender.com/api/add-room/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ room_code: code }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then(err => { throw err });
        }
        return response.json();
      })
      .then((data) => {
        console.log('Room created:', data);
      })
      .catch((err) => {
        console.error('Error creating room:', err);
        alert(err.error || 'Failed to create room.');
      });
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(roomCode);
  };

  const codeStyle = {
    fontSize: '6rem',
    fontWeight: 700,
    letterSpacing: '0.3em',
    color: '#00ffff',
    textShadow: '0 0 15px rgba(0, 255, 255, 0.5)'
  };

  return (
    <>
      {/* Division X Logo */}
      <div className="division-x-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        DIVISION X
      </div>
      
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Card className="shadow-lg p-5 text-center">
          <Card.Body>
            <Card.Title className="mb-4 display-5">YOUR MISSION CODE</Card.Title>
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
                START MISSION
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default RoomCodeDisplay;