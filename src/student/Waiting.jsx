import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/Waiting.css";

function WaitingArea() {
  const location = useLocation();
  const groupName = location.state?.groupName || "Default Group";
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const feelings = [
    { id: 1, emoji: "😡", label: "Angry" },
    { id: 2, emoji: "😟", label: "Sad" },
    { id: 3, emoji: "😐", label: "Neutral" },
    { id: 4, emoji: "🙂", label: "Happy" },
    { id: 5, emoji: "😁", label: "Excited" },
  ];

  return (
    <>
      {/* Division X Logo */}
      <div className="division-x-logo">
        DIVISION X
      </div>
    
      <div className="min-vh-100 p-5">
        <div className="rounded px-4 py-3">
          <h1 className="h4 fw-bold mb-2">
            You are now in the <span className="text-uppercase"><strong>waiting area</strong>!</span>
          </h1>
          <p className="mb-4">Wait for your teacher to start.</p>
          <p className="mb-4 fst-italic">Group: {groupName}</p>
          <div className="mb-4">
            <p className="fs-5">The mission your teacher has assigned you is <strong>Algebra</strong>!</p>
            <p className="fs-5">How do you feel about Algebra before beginning your mission?</p>
          </div>
          <div className="d-flex justify-content-center gap-3 mb-5">
            {feelings.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelected(f.id)}
                className={`d-flex flex-column align-items-center px-4 py-3 bg-white border rounded shadow-sm
                  ${selected === f.id ? "border-primary" : "border-2"}
                  `}
                style={{
                  outline: selected === f.id ? "2px solid #0d6efd" : "none"
                }}
              >
                <span style={{ fontSize: "2rem" }}>{f.emoji}</span>
                <span className="mt-1">{f.label}</span>
              </button>
            ))}
          </div>
          <Button variant="primary" onClick={() => navigate("/start")}>
            View Rules
          </Button>
        </div>
      </div>
    </>
  );
}

export default WaitingArea;
