import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function StudentLanding() {
  const [missionCode, setMissionCode] = useState('');
  const [groupName, setGroupName] = useState('');
  const [studentNames, setStudentNames] = useState(['']);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleNameChange = (index, value) => {
    const updatedNames = [...studentNames];
    updatedNames[index] = value;
    setStudentNames(updatedNames);
  };

  const handleAddNameField = () => {
    setStudentNames([...studentNames, '']);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedNames = studentNames.map(name => name.trim()).filter(name => name);

    if (!missionCode.trim() || !groupName.trim() || trimmedNames.length === 0) {
      setError('Please complete the required fields.');
      setShowError(true);
      return;
    }

    try {
      const res = await axios.post("https://drp-belgium.onrender.com/api/join-room/", {
        room_code: missionCode,
        group_name: groupName,
        student_names: trimmedNames // Send this to your Django backend
      });

      console.log("Joined:", res.data);
      navigate(`/waiting/${missionCode}`, {
        state: { groupName, groupId: res.data.group_id }
      });
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error);
      } else {
        setError("Something went wrong.");
      }
      setShowError(true);
    }
  };

  return (
    <>
      <div className="division-x-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        DIVISION X
      </div>

      <div className="d-flex justify-content-center align-items-center vh-100">
        <Card className="shadow-lg p-3 text-center" style={{ maxWidth: "450px", width: "100%" }}>    
          <Card.Body className="py-2" style={{ position: 'relative' }}>
            <Card.Title className="mb-4 display-6 text-light">JOIN MISSION</Card.Title>

            {showError && (
              <div 
                className="text-center text-danger mb-3"
                style={{ 
                  padding: '6px 10px',
                  backgroundColor: 'rgba(255, 220, 220, 0.9)',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  marginTop: '-10px'
                }}
              >
                {error || 'Please enter all required fields.'}
              </div>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>MISSION CODE</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter 4-digit code"
                  value={missionCode}
                  onChange={(e) => setMissionCode(e.target.value)}
                  className="text-center"
                  maxLength={4}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>GROUP NAME</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your group name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="text-center text-uppercase"
                  style={{ textTransform: 'uppercase' }}
                />
              </Form.Group>

              <Form.Label>STUDENTS</Form.Label>
              {studentNames.map((name, index) => (
                <Form.Control
                  key={index}
                  type="text"
                  placeholder={`Student ${index + 1}`}
                  value={name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  className="mb-2 text-center text-uppercase"
                  style={{ textTransform: 'uppercase' }}
                />
              ))}

              <Button
                variant="outline-info"
                className="mb-2"
                size="sm"
                onClick={handleAddNameField}
              >
                + student
              </Button>

              <Button variant="primary" type="submit" className="w-100 mt-2">
                JOIN MISSION
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

export default StudentLanding;
