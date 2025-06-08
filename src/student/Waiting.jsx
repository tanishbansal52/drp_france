import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import "../css/Waiting.css";
import axios from "axios";

function WaitingArea() {
  const location = useLocation();
  const groupName = location.state?.groupName || "Default Group";
  const groupId = location.state?.groupId || 0;
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const {roomCode} = useParams()

  console.log("Waiting area groupId:", groupId);

  const feelingLabels = [
    "Very Negative",
    "Negative", 
    "Neutral",
    "Positive",
    "Very Positive"
  ];

  const handleRatingSubmit = async () => {
    console.log(`Rating selected: ${selected}`);
    try {
      const resp = await axios.post("https://drp-belgium.onrender.com/api/update-before-rating/", {
      before_rating: selected,
      group_id: groupId
    });
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  }

  return (
    <>
      {/* Division X Logo */}
      <div className="division-x-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        DIVISION X
      </div>
    
      <div className="waiting-container">
        <div className="waiting-content">
          <div className="status-header">
            <h1 className="waiting-title">
              You are in the <span className="highlight">WAITING ROOM</span>
            </h1>
            <p className="waiting-subtitle">Wait for your teacher to start.</p>
          </div>

          <div className="group-info">
            <p className="group-label">Group: <span className="group-name">{groupName}</span></p>
          </div>

          <div className="mission-section">
            <p className="mission-text">
              The mission your teacher has assigned you is <strong>Algebra</strong>!
            </p>
            <p className="question-text">
              How confident do you feel about Algebra before the mission?
            </p>
          </div>

          <div className="feeling-selector">
            <div className="rating-scale">
  {[1, 2, 3, 4, 5].map((rating) => (
    <button
      key={rating}
      type="button"
      onClick={() => setSelected(rating)}
      className={`rating-button ${selected === rating ? 'selected' : ''}`}
    >
      <span className="rating-number">{rating}</span>
      <span className="rating-label">{feelingLabels[rating - 1]}</span>
    </button>
  ))}
  <button onClick={handleRatingSubmit} className="submit-rating-button">
    Submit Rating
  </button>
</div>

          </div>

          <div className="action-section">
            <Button 
              variant="primary" 
              onClick={() => navigate(`/start/${roomCode}`, {
        state: { groupName, groupId }
      })}
              className="view-rules-btn"
            >
              VIEW RULES
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default WaitingArea;
