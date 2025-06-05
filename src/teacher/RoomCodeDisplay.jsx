import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { incrementRoomsCurrentStatus } from './utils/api'

function RoomCodeDisplay() {
  const [roomCode, setRoomCode] = useState('');
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setRoomCode(code);

    fetch('https://drp-belgium.onrender.com/api/add-room/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ room_code: code }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then(err => { throw err });
        }
        return response.json();
      })
      .then((data) => console.log('Room created:', data))
      .catch((err) => {
        console.error('Error creating room:', err);
        alert(err.error || 'Failed to create room.');
      });
  }, []);

  // Polling for group updates
  useEffect(() => {
    if (!roomCode) return;

    const interval = setInterval(() => {
      fetch(`https://drp-belgium.onrender.com/api/get-room-groups/${roomCode}`)
        .then((res) => res.json())
        .then((data) => {
          setGroups(Array.isArray(data) ? data : []);
        })
        .catch((err) => console.error('Failed to fetch groups:', err));
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [roomCode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(roomCode);
  };

  const codeStyle = {
    fontSize: '5rem',
    fontWeight: 700,
    letterSpacing: '0.3em',
    color: '#00ffff',
    textShadow: '0 0 15px rgba(0, 255, 255, 0.5)',
    cursor: 'pointer',
  };

  return (
    <>
      <div className="division-x-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        DIVISION X
      </div>

      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Row className="w-100">
          {/* Left side: Room code */}
          <Col md={6} className="d-flex align-items-center justify-content-center">
            <Card className="shadow-lg p-5 text-center w-100">
              <Card.Body>
                <Card.Title className="text-light mb-4 display-5">YOUR MISSION CODE</Card.Title>
                <div style={codeStyle} title="Click to copy code" onClick={handleCopy}>
                  {roomCode}
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  className="mt-4"
                  onClick={async () => {
                    await incrementRoomsCurrentStatus(roomCode, 0)
                    navigate(`/teacher/displayquestion/${roomCode}`)
                  }
                }
                >
                  START MISSION
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Right side: Groups */}
          <Col md={6}>
            <Card className="shadow-lg p-4 text-center w-100">
              <Card.Title className="mb-3 text-light display-6">JOINED GROUPS</Card.Title>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                {groups.length > 0 ? (
                  groups.map((group, idx) => (
                    <div key={idx} className="bg-info text-white px-4 py-2 rounded shadow-sm">
                      {group.name}
                    </div>
                  ))
                ) : (
                  <p className="text-light">Waiting for groups to join...</p>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default RoomCodeDisplay;
