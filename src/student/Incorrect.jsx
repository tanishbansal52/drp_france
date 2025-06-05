import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from '../NavBar';
import { useNavigate, useLocation } from 'react-router-dom';
import { canMoveToNextQuestion } from './TeacherLinking'

function Incorrect() {
  const navigate = useNavigate();
  const location = useLocation();
  const roomCode = location.state?.roomCode;
  const questionNo = location.state?.questionNo;
  const [canMove, setCanMove] = useState(false);

  useEffect(() => {
    if (!roomCode || questionNo == null) return
    let cancelled = false

    const poll = async () => {
      const ok = await canMoveToNextQuestion(roomCode, questionNo)
      if (!cancelled) setCanMove(ok)
    }

    poll()
    const interval = setInterval(poll, 3000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [roomCode, questionNo])

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextPath = questionNo === 1
      ? `/groupquestion/${roomCode}`
      : `/end`
    navigate(nextPath, {
      state: { roomCode, questionNo: questionNo + 1 }
    })
  }

  return (
    <>
      <NavBar />
      <div style={{ paddingTop: '70px' }} className="text-center">
        <div className="space-y-6 font-handwriting text-2xl text-gray-800">
            <h1 className="text-3xl">Oh Dear!</h1>
            <p>That was not the correct answer. You have exhausted</p>
            <p>all your attempts. You do not gain any points.</p>
            <p>The total points you have collected so far: 0</p>
          </div>

          <button
            className="btn btn-info mt-4"
            onClick={handleSubmit}
            disabled={!canMove}
          >
            Move to {questionNo === 1 ? 'Group Question' : 'End of Quiz'}
          </button>

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
              className="text-red-500"
            >
              <path
                d="M30 30 L90 90 M90 30 L30 90"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>
          <div className="d-flex justify-content-center">
            <img src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdDV3a2lkanQxajhkbTFoaG11dWZ5Z3o5ZHY3MGdpeDNqYW01ZmRyNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Y3AuOkzCGoPJ6VGyX2/giphy.gif" alt="Funny gif" />
          </div>
      </div>
    
        </>
  );
}
export default Incorrect;