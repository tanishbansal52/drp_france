import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function TeacherLanding() {
  const navigate = useNavigate();
  const handleCreateMission = () => {
    // TODO: implement actual mission creation
    navigate('/teacher/dashboard');
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-200">
        <Col md={{ span: 8, offset: 1 }}>
          <Card className="shadow-lg p-4">
            <Card.Body>
              <div className="text-center mb-4">
                <h1 className="fw-bold">For Teachers</h1>
                <p>
                  Start having fun with your students by creating a mission code that they can use to join your room.
                </p>
              </div>
              <div className="d-grid">
                <Button variant="primary" size="lg" onClick={handleCreateMission}>
                  Create Room Code
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default TeacherLanding;