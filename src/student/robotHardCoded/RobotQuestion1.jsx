import React from 'react';
import './RobotQuestion1.css';  // add this

function RobotQuestion1() {
  return (
    <div style={{ fontSize: '1.3rem' }}>
      <h2>Recharge Your Robot!</h2>
      <p>Solve the following arithmetic questions and simplify your answers:</p>
      <ol type="A">
        <li>
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
      <p>The answer is the denominators in order.</p>
    </div>
  );
}

export default RobotQuestion1;