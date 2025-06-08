import React from 'react'
import { Button } from 'react-bootstrap'
import NavBar from '../NavBar'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import { useEffect } from 'react'

const Finish = ({ onRestart }) => {
  const location = useLocation();
  const roomCode = location.state?.roomCode;

  useEffect(() => {
    const markComplete = async () => {
      try {
        const resp = await axios.post("https://drp-belgium.onrender.com/api/mark-mission-complete/", {
          room_code: roomCode
        });
        console.log("Response:", resp.data);
      } catch (error) {
        console.error('Error submitting rating:', error);
      }
    };

    markComplete(); 
  }, []); 

  return (
    <>
      <NavBar/>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1>🎉 Mission Complete 🎉</h1>
        <p>Great work, Agent! The mission is a success.</p>
        {onRestart && (
          <Button variant="primary" onClick={onRestart}>
            Restart Mission
          </Button>
        )}
      </div>
    </>
  )
}

export default Finish