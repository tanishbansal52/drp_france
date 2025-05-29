// import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';

function Incorrect() {
  const navigate = useNavigate();
  return (
    <>
      <NavBar />
    <div className="space-y-6 font-handwriting text-2xl text-gray-800">
            <h1 className="text-3xl">Oh Dear!</h1>
            <p>That was not the correct answer. Your teacher has</p>
            <p>ended this question. You do not have any points.</p>
            <p>The total points you have collected so far: 0</p>
          </div>

          <p className="text-center text-gray-600 mt-4">
            Waiting for your teacher to move on to the next question...
          </p>

          <button type="button" class="btn btn-info" onClick={() => navigate('/end')}>
            Move to end of quiz - Teachers will be doing this navigation from their side.</button>
          
          <div className="d-flex justify-content-center mt-12">
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
        </>
  );
}
export default Incorrect;