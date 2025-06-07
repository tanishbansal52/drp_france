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

  const handleViewPastMissions = () => {
    // Not implemented yet
    console.log('View past missions - not implemented');
  };

  return (
    <>
      {/* Division X Logo */}
      <div className="division-x-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        DIVISION X
      </div>

      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Row className="w-100 justify-content-center">
          <Col xl={10} lg={12}>
            <Row className="g-5">
              {/* Start New Mission Section */}
              <Col md={6}>
                <Card className="shadow-lg h-100" style={{ 
                  background: 'rgba(13, 202, 240, 0.1)', 
                  border: '2px solid #0dcaf0',
                  backdropFilter: 'blur(10px)'
                }}>
                  <Card.Body className="p-4 d-flex flex-column">
                    <div className="text-center mb-4 flex-grow-1">
                      <h2 className="fw-bold mb-4">START NEW MISSION</h2>
                      <p className="mb-5">
                        Start a mission by choosing a topic & difficulty level, and opening a room for your students.                      </p>
                    </div>
                    <div className="d-grid">
                      <TeacherButton 
                        variant="primary" 
                        size="lg" 
                        onClick={handleCreateMission}
                      >
                        CREATE MISSION
                      </TeacherButton>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              {/* Past Missions Section */}
              <Col md={6}>
                <Card className="shadow-lg h-100" style={{ 
                  background: 'rgba(13, 202, 240, 0.05)', 
                  border: '2px solid rgba(13, 202, 240, 0.5)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <Card.Body className="p-4 d-flex flex-column">
                    <div className="text-center mb-4 flex-grow-1">
                      <h2 className="fw-bold mb-4">SEE PAST MISSIONS</h2>
                      <p className="mb-5">
                        Review completed missions & analyse student performance.                      </p>
                    </div>
                    <div className="d-grid">
                      <TeacherButton 
                        variant="outline-primary" 
                        size="lg" 
                        onClick={handleViewPastMissions}
                      >
                        VIEW HISTORY
                      </TeacherButton>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default TeacherLanding;