import React, { useState } from 'react';
import './RobotQuestion1.css';

function RobotQuestion1({ isTeacherMode = false, roomCode, groupId }) {
  const [answer, setAnswer] = useState(['', '', '']);
  // Add state for fraction values
  const [fractions, setFractions] = useState({
    first: { num1: 1, den1: 2, num2: 1, den2: 2 },
    second: { num1: 1, den1: 4, num2: 1, den2: 2 },
    third: { num1: 3, den1: 10, num2: 1, den2: 10 }
  });

  const handleChange = (index, value) => {
    // Only allow single digit numbers (0-9)
    if (value === '' || /^[0-9]$/.test(value)) {
      const newAnswer = [...answer];
      newAnswer[index] = value;
      setAnswer(newAnswer);
      
      console.log("Input changed:", index, value, newAnswer);
      localStorage.setItem('robotAnswer', newAnswer.join(''));
    }
  };

  // Add regeneration function that will be called from the parent component
  const regenerateFractions = () => {
    // First fraction: a/b + c/d where b=d to keep it simple
    const den1 = Math.floor(Math.random() * 3) + 2; // 2-4
    const num1 = Math.floor(Math.random() * (den1 - 1)) + 1; // 1 to den1-1
    const num2 = Math.floor(Math.random() * (den1 - 1)) + 1; // 1 to den1-1
    
    // Second fraction: a/b ÷ c/d (simple values)
    const den2_1 = Math.floor(Math.random() * 3) + 2; // 2-4
    const num2_1 = 1; // keep numerator as 1 for simplicity
    const den2_2 = Math.floor(Math.random() * 3) + 2; // 2-4
    const num2_2 = 1; // keep numerator as 1 for simplicity
    
    // Third fraction: a/b - c/b (same denominator)
    const den3 = Math.floor(Math.random() * 5) + 6; // 6-10
    const num3_1 = Math.floor(Math.random() * (den3 - 2)) + 2; // 2 to den3-1
    const num3_2 = 1; // smaller number to subtract
    
    setFractions({
      first: { num1: num1, den1: den1, num2: num2, den2: den1 },
      second: { num1: num2_1, den1: den2_1, num2: num2_2, den2: den2_2 },
      third: { num1: num3_1, den1: den3, num2: num3_2, den2: den3 }
    });
    
    // Clear previous answers
    setAnswer(['', '', '']);
    localStorage.removeItem('robotAnswer');
  };

  // Expose the regenerateFractions function to parent components
  if (isTeacherMode) {
    window.regenerateRobotQ1 = regenerateFractions;
  }

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
          Solve the following individually. Remember to simplify your answers if necessary:
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
            <span className="num">{fractions.first.num1}</span>
            <span className="den">{fractions.first.den1}</span>
          </span>
          {' '}+{' '}
          <span className="fraction">
            <span className="num">{fractions.first.num2}</span>
            <span className="den">{fractions.first.den2}</span>
          </span>
        </li>
        <li>
          {'\u00A0\u00A0'}
          {'\u00A0\u00A0'}
          {'\u00A0\u00A0'}
          {'\u00A0\u00A0'}
          <span className="fraction">
            <span className="num">{fractions.second.num1}</span>
            <span className="den">{fractions.second.den1}</span>
          </span>
          {' '}÷{' '}
          <span className="fraction">
            <span className="num">{fractions.second.num2}</span>
            <span className="den">{fractions.second.den2}</span>
          </span>
        </li>
        <li>
          {'\u00A0\u00A0'}
          {'\u00A0\u00A0'}
          {'\u00A0\u00A0'}

          <span className="fraction">
            <span className="num">{fractions.third.num1}</span>
            <span className="den">{fractions.third.den1}</span>
          </span>
          {' '}−{' '}
          <span className="fraction">
            <span className="num">{fractions.third.num2}</span>
            <span className="den">{fractions.third.den2}</span>
          </span>
        </li>
      </ol>
      <p>The answer is the denominators in order...</p>
      
      {/* Number input section */}
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
      
      {/* Remove the duplicate spinoff button that was here */}
    </div>
    </div>
  );
}

export default RobotQuestion1;