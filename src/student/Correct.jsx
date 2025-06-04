
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from '../NavBar';
import { useNavigate, useLocation } from 'react-router-dom';

function Correct() {
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
    <div className="space-y-6 font-handwriting text-2xl text-gray-800">
            <h1 className="text-3xl">Well Done!</h1>
            <p>Your Answer was correct!</p>
            <p>You have gained 10 points on this stage!</p>
            <p>The total points you have collected so far: 10</p>
          </div>

          <p className="text-center text-gray-600 mt-4">
            Waiting for your teacher to move on to the next question...
          </p>

          <button type="button" class="btn btn-info" onClick={handleSubmit}>
            Move to {question === 1 ? 'Group Question' : 'End of Quiz'} - Teachers will be doing this navigation from their side.
            </button>
          
          <div className="d-flex justify-content-center mt-12">
            <svg 
              width="120" 
              height="120" 
              viewBox="0 0 120 120" 
              className="text-green-500"
            >
              <path
                d="M20 60 L45 85 L100 30"
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
export default Correct;