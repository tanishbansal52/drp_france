import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import TeacherButton from './TeacherButton';

function TeacherLanding() {
  const navigate = useNavigate();
  
  const handleCreateMission = () => {
    navigate('/teacher/choosequiz');
  };

  return (
    <>
      {/* Division X Logo */}
      <div className="division-x-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        DIVISION X
      </div>

      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Row className="w-100 justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow-lg">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <h1 className="fw-bold">MISSION CONTROL</h1>
                  <p className="mt-3">
                    Initiate a classified operation by creating a secure room code for your field agents.
                  </p>
                </div>
                <div className="d-grid">
                  <TeacherButton 
                    variant="primary" 
                    size="lg" 
                    onClick={handleCreateMission}
                  >
                    CLICK HERE
                  </TeacherButton>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default TeacherLanding;