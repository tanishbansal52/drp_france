import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert } from 'react-bootstrap';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { canMoveToNextQuestion } from './TeacherLinking'

import '../css/IndividualQuestion.css'
import NavBar from '../NavBar';

function Start() {
  const navigate = useNavigate();
  const { roomCode } = useParams()
  const [message, setMessage] = useState('')

  const location = useLocation();
  const groupId = location.state?.groupId || 0;

  console.log("In start groupId:", groupId)
  
  const handleContinue = async () => {
    setMessage('')
    const ok = await canMoveToNextQuestion(roomCode, 0) 
    console.log("In start can move to next question:", ok)
    if (ok) {
      navigate(`/question1/${roomCode}`, {
        state: { groupId }
      })
    } else {
      setMessage('Wait for teacher to move to the first question')
    }
  }
  
  return (
    <>
    <NavBar />
      <div className="text-center mb-10">
        <h1>Mission Topic - Algebra</h1>
        <h2 className="text-info mb-5">Rules of the mission:</h2>
      </div>
      <p className="text-center"> No cheating! </p>
      <p className="text-center"> Answer questions faster for more points.</p>
      <p className="text-center"> You can try again If you get an answer wrong but you wont get as many points. </p>
      <p className="text-center mb-5"> Nominate a group leader to enter the answers.</p>
      <p className="text-center"> Good luck agents!</p>
      <div className="flex flex-col items-center justify-center">
        <button
          className="btn btn-warning btn-lg"
          onClick={handleContinue}
          type="button"
        >
          Continue
        </button>
        {message && (
          <Alert variant="warning" className="mt-3">
            {message}
          </Alert>
        )}
      </div>
    </>
  )
}

export default Start