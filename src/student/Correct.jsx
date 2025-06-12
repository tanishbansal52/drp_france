import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from '../NavBar';
import { useNavigate, useLocation } from 'react-router-dom';
import {canMoveToNextQuestion} from './TeacherLinking';
import GreenCheckMark from '../assets/GreenCheckMark';

function Correct() {
  const navigate = useNavigate();
  const location = useLocation();
  const quizId = location.state?.quizId || localStorage.getItem('quizId');
  const roomCode = location.state?.roomCode;
  const groupId = location.state?.groupId || 0;  
  const currentQuestionIndex = location.state?.questionNo;
  console.log("IN CORRECT the currentQuestionIndex is", currentQuestionIndex);

  console.log("groupId in Correct:", groupId);
  
// helper to fetch next-question type & navigate
  const navigateNext = async () => {
    let res
    try {
      res  = await fetch(
        `http://127.0.0.1:8000/api/question-type/${(currentQuestionIndex + 1)}/${quizId}/`
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log("Received data:", data);
      const nextPath =
        data.q_type === "text"
          ? `/textQs/${roomCode}`
          : `/groupquestion/${roomCode}`;
      
      console.log("Next path:", nextPath, "Quiz ID:", quizId, "Question No:", (currentQuestionIndex + 1));
      navigate(nextPath, {
        state: { roomCode, questionNo: currentQuestionIndex + 1, groupId, quizId }
      });
    } catch (err) {
      console.error('Error fetching question type:', err);
      console.log("No response from server must mean we're at the finish! ><")
      navigate(`/end`, {
        state: { roomCode, questionNo: currentQuestionIndex + 1, groupId, quizId }
      });
    }
  };

  useEffect(() => {
    if (!roomCode || currentQuestionIndex == null) return;
    let cancelled = false;

    const poll = async () => {
      console.log("Current Q:", currentQuestionIndex);
      const ok = await canMoveToNextQuestion(roomCode, currentQuestionIndex + 1);
      console.log("IN CORRECT at question number", currentQuestionIndex, "can move to next question:", ok);
      if (cancelled) return;
      if (ok) {
        cancelled = true;           // stop future polls
        await navigateNext();       // auto‐advance
      }
    };

    poll(); 
    const intervalId = setInterval(poll, 3000);
    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [roomCode, currentQuestionIndex]);

  return (
    <>
    <NavBar />
    <div style={{ paddingTop: '70px' }} className="text-center">
      <h1 className="text-3xl">Your answer was correct! Well Done!</h1>
        <p></p>
        { (
          <p className="text-gray-600 mt-2">
            ⏳ Waiting for teacher to move to next question...
          </p>
        )}
        <GreenCheckMark/>
        {/* Gif */}
        <div className="d-flex justify-content-center">
          <img src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExY25pZXBzNWtxcTZibGEzcjNjcGdsazhmZW51b3hrOTZibG85eXk0aiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ely3apij36BJhoZ234/giphy.gif" alt="Funny gif" />
        </div>
      </div>
    </>
  );
}
export default Correct;