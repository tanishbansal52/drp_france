import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ChooseQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://drp-belgium.onrender.com/api/quizzes/')
    // axios.get('http://localhost:8000/api/quizzes/')
      .then(res => setQuizzes(res.data))
      .catch(err => {
        setError('Failed to fetch quizzes.');
        console.error(err);
      });
  }, []);

  const handleSubmit = () => {
    console.log('Selected quiz:', selected);
    navigate('/teacher/allquestions');
  };

  if (error) return <div style={{ color: '#ff4d4d' }}>{error}</div>;
  if (!quizzes.length) return <div style={{ color: 'white' }}>Loading quizzes...</div>;

  return (
    <div style={{ padding: '30px', color: '#aefeff', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#00f0ff', fontWeight: 'bold', fontSize: '28px', textAlign: 'left' }}>
        Choose Quest:
      </h2>

      {quizzes.map((quiz, index) => (
  <label
    key={index}
    style={{
      display: 'flex',
      alignItems: 'flex-start',
      marginBottom: '25px',
      background: 'rgba(255, 255, 255, 0.05)',
      padding: '15px',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'background 0.3s',
    }}
    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
  >
    <input
      type="radio"
      name="quiz-selection"
      checked={selected === quiz.title}
      onChange={() => setSelected(quiz.title)}
      style={{
        width: '20px',
        height: '20px',
        marginTop: '4px',
        accentColor: '#00f0ff',
        cursor: 'pointer',
      }}
    />
    <div
      style={{
        marginLeft: '20px',
        textAlign: 'left',
        flex: 1, // Ensures it uses full width for alignment
      }}
    >
      <strong style={{ fontSize: '20px', color: '#aefeff' }}>{quiz.title}</strong>
      <div style={{ fontSize: '15px', marginTop: '5px' }}>
        Difficulty = {quiz.difficulty}
      </div>
      <div style={{ fontSize: '15px' }}>
        Estimated time = {quiz.total_time} min
      </div>
      {quiz.description && (
        <div style={{
          fontStyle: 'italic',
          color: '#c7faff',
          marginTop: '5px',
          fontSize: '14px',
        }}>
          {quiz.description}
        </div>
      )}
    </div>
  </label>
))}


      <button
        onClick={handleSubmit}
        disabled={!selected}
        style={{
          marginTop: '20px',
          padding: '12px 25px',
          fontSize: '16px',
          fontWeight: 'bold',
          backgroundColor: 'transparent',
          color: selected ? '#00f0ff' : '#888',
          border: selected ? '2px solid #00f0ff' : '2px solid #555',
          borderRadius: '5px',
          cursor: selected ? 'pointer' : 'not-allowed',
          transition: 'all 0.3s',
        }}
      >
        SUBMIT SELECTED QUIZ
      </button>
    </div>
  );
}

export default ChooseQuiz;
