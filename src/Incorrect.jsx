// import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './NavBar';
import { useNavigate, useLocation } from 'react-router-dom';

function Incorrect() {
  const navigate = useNavigate();
  const location = useLocation();
  const question = location.state?.questionNo || 1; // Default to question 1 if not provided

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question === 1) {
      navigate('/groupquestion'); // Navigate to the next question for group
    }
    else {
      navigate('/end'); // Navigate to the end of the quiz
    }
  };

  return (
    <>
      <NavBar />
      <div style={{ paddingTop: '70px' }} className="text-center">
        <div className="space-y-6 font-handwriting text-2xl text-gray-800">
            <h1 className="text-3xl">Oh Dear!</h1>
            <p>That was not the correct answer. Your teacher has</p>
            <p>ended this question. You do not have any points.</p>
            <p>The total points you have collected so far: 0</p>
          </div>

          <p className="text-center text-gray-600 mt-4">
            Waiting for your teacher to move on to the next question...
          </p>

          <button type="button" class="btn btn-info" onClick={handleSubmit}>
            Move to {question === 1 ? 'Group Question' : 'End of Quiz'} - Teachers will be doing this navigation from their side.</button>
          
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