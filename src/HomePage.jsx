import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './css/Landing.css';


function HomePage() {
  const navigate = useNavigate();

  const handleTeacherClick = () => {
    navigate('/teacher');
  };

  const handleStudentClick = () => {
    navigate('/student');
  };

  return (
    <>
      {/* Division X Logo */}
      <div className="division-x-logo">
        DIVISION X
      </div>

      {/* Main Content */}
      <div className="homepage-container">
        {/* Teachers Section */}
        <div className="homepage-section">
          <Card className="homepage-card">
            <Card.Body>
              <h1>TEACHERS</h1>
              <p>Launch missions for your students</p>
              <Button 
                variant="primary" 
                size="lg" 
                onClick={handleTeacherClick}
              >
                CLICK HERE
              </Button>
            </Card.Body>
          </Card>
        </div>

        {/* Students Section */}
        <div className="homepage-section">
          <Card className="homepage-card">
            <Card.Body>
              <h1>STUDENTS</h1>
              <p>Join your class waiting room</p>
              <Button 
                variant="primary" 
                size="lg" 
                onClick={handleStudentClick}
              >
                CLICK HERE
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  );
}

export default HomePage;