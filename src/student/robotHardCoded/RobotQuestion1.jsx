import React, { useState } from 'react';
import './RobotQuestion1.css';

function RobotQuestion1({ isTeacherMode = false, roomCode, groupId }) {
  const [answer, setAnswer] = useState(['', '', '']);

  const handleChange = (index, value) => {
    // Remove regex test temporarily to debug
    const newAnswer = [...answer];
    newAnswer[index] = value;
    setAnswer(newAnswer);
    
    console.log("Input changed:", index, value, newAnswer);
    localStorage.setItem('robotAnswer', newAnswer.join(''));
  };

  return (
    <div style={{ 
      minHeight: '-50vh', 
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: 'url(/public/robot-bg.svg) center/cover no-repeat',
      position: 'relative',
      overflow: 'visible'
    }}>
      {/* Circuit contrails - bottom right */}
      {!isTeacherMode && (
        <div style={{
          position: 'absolute',
          bottom: -250,
          left: -240,
          zIndex: 0,
        }}>
          <img src="/contrails up.png" alt="Circuit contrails up" style={{ maxHeight: '40vh' }} />
        </div>
      )}

    <div style={{ fontSize: '1.3rem' }}>
      <h2>Recharge Your Robot!</h2>
      <p style={{ 
          maxWidth: '800px',  
          margin: '0 auto',   
          textAlign: 'center', 
          marginBottom: '20px' 
        }}>
          Solve the following individually. Remember to simplify your answer if necessary:
        </p>
      <ol style={{ 
        listStyleType: 'lower-roman',
        listStylePosition: 'inside',
        textAlign: 'center',
        paddingLeft: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '15px'
        }}>
        <li>
          {'\u00A0\u00A0'}
          {'\u00A0\u00A0'}
          {'\u00A0\u00A0'}
          {'\u00A0\u00A0'}
          <span className="fraction">
            <span className="num">1</span>
            <span className="den">2</span>
          </span>
          {' '}+{' '}
          <span className="fraction">
            <span className="num">1</span>
            <span className="den">2</span>
          </span>
        </li>
        <li>
          {'\u00A0\u00A0'}
          {'\u00A0\u00A0'}
          {'\u00A0\u00A0'}
          {'\u00A0\u00A0'}
          <span className="fraction">
            <span className="num">1</span>
            <span className="den">4</span>
          </span>
          {' '}÷{' '}
          <span className="fraction">
            <span className="num">1</span>
            <span className="den">2</span>
          </span>
        </li>
        <li>
          {'\u00A0\u00A0'}
          {'\u00A0\u00A0'}
          {'\u00A0\u00A0'}

          <span className="fraction">
            <span className="num">3</span>
            <span className="den">10</span>
          </span>
          {' '}−{' '}
          <span className="fraction">
            <span className="num">1</span>
            <span className="den">10</span>
          </span>
        </li>
      </ol>
      <p>The answer is the denominators in order...</p>
      
      {/* New number input section */}
      <div className="number-input-container">
        <div className="number-inputs">
          {[0, 1, 2].map((index) => (
            <input
              key={index}
              type="text"
              value={answer[index]}
              onChange={(e) => handleChange(index, e.target.value)}
              className="number-input"
              maxLength="2"
              placeholder="#"
              style={{position: 'relative', zIndex: 50}}
            />
          ))}
        </div>
      </div>
    </div>
    </div>
  );
}

export default RobotQuestion1;