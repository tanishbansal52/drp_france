import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from '../NavBar';

function Challenge() {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const quizId = localStorage.getItem('quizId');

  useEffect(() => {
    const fetchBonusQuestion = async () => {
      try {
        setLoading(true);
        setError(null);
        // const apiEndpoint = `http://localhost:8000/api/bonus-question/${quizId}/`;
        const apiEndpoint = `https://drp-belgium.onrender.com/api/bonus-question/${quizId}/`;
        const res = await fetch(apiEndpoint);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setQuestion(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (quizId) {
      fetchBonusQuestion();
    }
  }, [quizId]);

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <NavBar />
        <h1 className="text-4xl font-bold mb-4 text-cyan-400">Bonus Question!</h1>
        {loading && (
          <p className="text-lg text-gray-700 mb-8">Loading...</p>
        )}
        {error && (
          <p className="text-lg text-red-600 mb-8">{error}</p>
        )}
        {!loading && !error && question && (
          <h2 className="text-2xl font-semibold mb-4 text-cyan-200" style={{ whiteSpace: 'pre-line', textAlign: 'center' }}>
            {question.question_text}
          </h2>
        )}
      </div>
    </>
  );
}

export default Challenge;