import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function StudentLanding() {
  const [missionCode, setMissionCode] = useState('');
  const [groupName, setGroupName] = useState('');
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!missionCode.trim() || !groupName.trim()) {
      setShowError(true);
      return;
    }

    try {
      const res = await axios.post("https://drp-belgium.onrender.com/api/join-room/", {
        room_code: missionCode,
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
      setShowError(true);
      console.error("Error joining room:", error);
      return;
    }
  };

  return (
    <>
      {/* Division X Logo */}
      <div className="division-x-logo">
        DIVISION X
      </div>
      
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Card className="shadow-lg p-4 text-center" style={{ maxWidth: "450px", width: "100%" }}>
          <Card.Body>
            <Card.Title className="mb-4 display-5">MISSION LOGIN</Card.Title>
            
            {showError && (
              <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
                {error || 'Please enter both mission code and group name.'}
              </Alert>
            )}
            
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label>MISSION CODE</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Enter 4-digit code"
                  value={missionCode}
                  onChange={(e) => setMissionCode(e.target.value)}
                  className="text-center fs-4"
                  maxLength={4}
                />
              </Form.Group>
              
              <Form.Group className="mb-4">
                <Form.Label>GROUP NAME</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Enter your group name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="text-center"
                />
              </Form.Group>
              
              <Button 
                variant="primary" 
                type="submit" 
                size="lg"
                className="w-100 mt-3"
              >
                JOIN MISSION
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default StudentLanding;