import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { canMoveToNextQuestion } from './TeacherLinking'
import '../css/IndividualQuestion.css'
import NavBar from '../NavBar';

function Start() {
  const navigate = useNavigate();
  const { roomCode } = useParams();
  const location = useLocation();
  const groupId = location.state?.groupId || 0;

  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      if (cancelled) return;
      try {
        const ok = await canMoveToNextQuestion(roomCode, 0);
        console.log("In start can move to next question:", ok);
        if (ok) {
          cancelled = true;
          navigate(`/textQs/${roomCode}`, {
            state: { groupId, questionNo: 0 }
        });
        }
      } catch (err) {
        console.error("Error checking start:", err);
      }
    };
    poll();
    const intervalId = setInterval(poll, 3000);
    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [roomCode, groupId, navigate]);


  return (
    <>
    <NavBar />
      <div className="text-center mb-10">
        <h1>Mission Topic - Algebra</h1>
        <h2 className="text-info mb-5">Rules of the mission:</h2>
      </div>
      <p className="text-center"> No cheating! </p>
      <p className="text-center"> You can keep trying again if you get an answer wrong </p>
      <p className="text-center mb-5"> Nominate a group leader to enter the answers.</p>
      <p className="text-center"> Good luck agents!</p>
    </>
  )
}

export default Start