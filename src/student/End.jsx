import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from '../NavBar';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function End() {
  const navigate = useNavigate();

  const location = useLocation();
  const groupId = location.state?.groupId || 0;
  const quizId = location.state?.quizId || localStorage.getItem('quizId');

  const [selectedRating, setSelectedRating] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const ratings = [
    { label: 'Very Negative', color: 'bg-red-500', value: 1 },
    { label: 'Negative', color: 'bg-orange-500', value: 2 },
    { label: 'Neutral', color: 'bg-yellow-500', value: 3 },
    { label: 'Positive', color: 'bg-lime-500', value: 4 },
    { label: 'Very Positive', color: 'bg-green-500', value: 5 }
  ];

  const handleRatingClick = async (value) => {
    setSelectedRating(value);
  };

  const handleRatingSubmit = async () => {
    console.log(`Rating selected: ${selectedRating}`);
    try {
      const resp = await axios.post("https://drp-belgium.onrender.com/api/update-after-rating/", {
      // const resp = await axios.post("http://localhost:8000/api/update-after-rating/", {
        after_rating: selectedRating,
        group_id: groupId
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <NavBar />
        <h1 className="text-4xl font-bold mb-4">Well done agents!</h1>
        <p className="text-lg text-gray-700 mb-8">You have successfully completed your mission.</p>
        <p className="text-med text-gray-700 mb-8">How confident do you feel about algebra now that you have completed your mission?</p>
        <p className="text-med text-gray-700 mb-8">Did you finish early? Click on Bonus to attempt an exciting question!</p>
      </div>

      <div className="mb-8">
        <div className="flex justify-center mb-4">
          <div className="flex items-center w-80">
            <span className="text-gray-500 mr-2">−</span>
            <div className="flex flex-1 h-12 rounded-lg overflow-hidden border-2 border-gray-300">
              {ratings.map((rating) => (
                <button
                  key={rating.value}
                  onClick={() => handleRatingClick(rating.value)}
                  className={`flex-1 ${rating.color} transition-all duration-200 hover:brightness-110 relative ${selectedRating === rating.value ? 'ring-2 ring-blue-400 ring-inset brightness-110' : ''
                    }`}
                  title={rating.label}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`font-bold text-lg ${selectedRating === rating.value ? 'text-shadow-lg' : ''
                      }`}>
                      {rating.value}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <span className="text-gray-500 ml-2">+</span>
          </div>
          <div className="ml-4">
            <button
              onClick={handleRatingSubmit}
              className="btn btn-primary"
              disabled={selectedRating === null}
            >
              Submit Rating
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center flex-row gap-4">
        <button
          className="btn btn-warning btn-lg"
          onClick={() => navigate('/debrief')}
          disabled={!submitted}
        >
          Continue
        </button>
        <button
          className="btn btn-danger btn-lg"
          onClick={() => navigate('/challenge', { state: { quizId, groupId } })}
        >
          Bonus
        </button>
      </div>
    </>
  );
}

export default End;