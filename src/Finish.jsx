import React from 'react'
import { Button } from 'react-bootstrap'
import NavBar from './NavBar'

const Finish = ({ onRestart }) => {
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