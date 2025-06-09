import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from '../NavBar';
import { useNavigate, useLocation } from 'react-router-dom';
import {canMoveToNextQuestion} from './TeacherLinking';

function Correct() {
  const navigate = useNavigate();
  const location = useLocation();
  const roomCode = location.state?.roomCode;
  const groupId = location.state?.groupId || 0;  
  const questionNo = location.state?.questionNo;
  const [canMove, setCanMove] = useState(true);

  console.log("groupId in Correct:", groupId);
  
  useEffect(() => {
    if (!roomCode || questionNo == null) return;
    let cancelled = false;

    const poll = async () => {
      console.log(`Polling for roomCode: ${roomCode}, questionNo: ${questionNo}`);
      const ok = await canMoveToNextQuestion(roomCode, questionNo);
      console.log(`Can move to next question: ${ok}`);
      if (!cancelled) setCanMove(ok);
    };

    poll(); 
    const handle = setInterval(poll, 3000);

    return () => {
      cancelled = true;
      clearInterval(handle);
    };
  }, [roomCode, questionNo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // decide next path
    const nextPath = questionNo === 1
      ? `/groupquestion/${roomCode}`
      : `/end`;
    navigate(nextPath, {
      state: { roomCode, questionNo: questionNo + 1, groupId }
    });
  };

  return (
    <>
    <NavBar />
    <div style={{ paddingTop: '70px' }} className="text-center">
      <div className="space-y-6 font-handwriting text-2xl text-gray-800">
            <h1 className="text-3xl">Well Done!</h1>
            <p>Your Answer was correct!</p>
            <p>You have gained 10 points on this stage!</p>
            <p>The total points you have collected so far: 10</p>
          </div>

          {/* always show Next, just toggle disabled */}
        <button
          className="btn btn-info mt-4"
          onClick={handleSubmit}
          disabled={!canMove}
        >
          Next
        </button>

        {/* optionally still show waiting message */}
        {!canMove && (
          <p className="text-center text-gray-600 mt-2">
            Waiting for your teacher to move to next question...
          </p>
        )}
          
          <div className="d-flex justify-content-center mt-3">
            <svg 
              width="120" 
              height="120" 
              viewBox="0 0 120 120" 
              className="text-green-500"
            >
              <path
                d="M20 60 L45 85 L100 30"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>

        <div className="d-flex justify-content-center">
          <img src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExY25pZXBzNWtxcTZibGEzcjNjcGdsazhmZW51b3hrOTZibG85eXk0aiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ely3apij36BJhoZ234/giphy.gif" alt="Funny gif" />
        </div>
      </div>
    </>
  );
}
export default Correct;