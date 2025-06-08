import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
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
    console.log("Trimmed Names:", trimmedNames);

    if (!missionCode.trim() || !groupName.trim() || trimmedNames.length === 0) {
      setError('Please fill all fields including at least one student name.');
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

      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Card className="shadow-lg p-4 text-center" style={{ maxWidth: "500px", width: "100%" }}>
          <Card.Body>
            <Card.Title className="mb-4 display-5 text-light">MISSION LOGIN</Card.Title>

            {showError && (
              <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
                {error || 'Please enter all required fields.'}
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

              <Form.Label>STUDENT NAMES</Form.Label>
              {studentNames.map((name, index) => (
                <Form.Control
                  key={index}
                  type="text"
                  placeholder={`Student ${index + 1}`}
                  value={name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  className="mb-2 text-center"
                />
              ))}

              <Button
                variant="outline-info"
                className="mb-3"
                onClick={handleAddNameField}
              >
                + Add another student
              </Button>

              <Button variant="primary" type="submit" size="lg" className="w-100 mt-3">
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
