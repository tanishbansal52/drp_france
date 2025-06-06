import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TeacherButton from './TeacherButton';

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

  const getDifficultyColor = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'easy': return '#4ade80';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#aefeff';
    }
  };

  if (error) {
    return (
      <div style={{ 
        padding: '30px', 
        textAlign: 'center',
        color: '#ff4d4d',
        fontSize: '18px',
        fontFamily: 'sans-serif'
      }}>
        {error}
      </div>
    );
  }

  if (!quizzes.length) {
    return (
      <div style={{ 
        padding: '30px', 
        textAlign: 'center',
        color: '#aefeff',
        fontSize: '18px',
        fontFamily: 'sans-serif'
      }}>
        <div style={{ marginBottom: '20px' }}>Loading quizzes...</div>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid rgba(174, 254, 255, 0.3)',
          borderTop: '4px solid #00f0ff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto'
        }}></div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '30px', 
      color: '#aefeff', 
      fontFamily: 'sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      minHeight: '100vh'
    }}>
      <h2 style={{ 
        color: '#00f0ff', 
        fontWeight: 'bold', 
        fontSize: '28px', 
        textAlign: 'left',
        marginBottom: '30px',
        textShadow: '0 0 10px rgba(0, 240, 255, 0.3)'
      }}>
        Choose Mission:
      </h2>

      <div style={{ marginBottom: '40px' }}>
        {quizzes.map((quiz, index) => (
          <label
            key={index}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              marginBottom: '20px',
              background: selected === quiz.title 
                ? 'rgba(0, 240, 255, 0.1)' 
                : 'rgba(255, 255, 255, 0.05)',
              padding: '20px',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: selected === quiz.title 
                ? '2px solid rgba(0, 240, 255, 0.5)' 
                : '2px solid transparent',
              boxShadow: selected === quiz.title 
                ? '0 0 20px rgba(0, 240, 255, 0.2)' 
                : '0 4px 6px rgba(0, 0, 0, 0.1)',
              transform: 'translateY(0)',
            }}
            onMouseEnter={e => {
              if (selected !== quiz.title) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
              }
            }}
            onMouseLeave={e => {
              if (selected !== quiz.title) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
              }
            }}
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
                transform: 'scale(1.2)',
              }}
            />
            <div style={{
              marginLeft: '20px',
              textAlign: 'left',
              flex: 1,
            }}>
              <div style={{ 
                fontSize: '20px', 
                color: '#aefeff',
                fontWeight: '600',
                marginBottom: '8px',
                letterSpacing: '0.5px'
              }}>
                {quiz.title}
              </div>
              <div style={{ 
                display: 'flex',
                gap: '20px',
                flexWrap: 'wrap'
              }}>
                <div style={{ 
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{ color: '#999' }}>Difficulty:</span>
                  <span style={{ 
                    color: getDifficultyColor(quiz.difficulty),
                    fontWeight: '500',
                    textTransform: 'capitalize'
                  }}>
                    {quiz.difficulty}
                  </span>
                </div>
                <div style={{ 
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{ color: '#999' }}>Time:</span>
                  <span style={{ color: '#aefeff', fontWeight: '500' }}>
                    {quiz.total_time} min
                  </span>
                </div>
              </div>
            </div>
          </label>
        ))}
      </div>

      <div style={{
        display: 'flex',
        gap: '15px',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => navigate('/teacher')}
          style={{
            padding: '14px 30px',
            fontSize: '16px',
            fontWeight: '600',
            borderRadius: '8px',
            border: '2px solid #666',
            background: 'transparent',
            color: '#aefeff',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            minWidth: '120px'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.borderColor = '#aefeff';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = '#666';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Back
        </button>
        
        <button
          onClick={handleSubmit}
          disabled={!selected}
          style={{
            padding: '14px 30px',
            fontSize: '16px',
            fontWeight: '600',
            borderRadius: '8px',
            border: selected ? '2px solid #00f0ff' : '2px solid #444',
            background: selected ? '#00f0ff' : '#333',
            color: selected ? '#000' : '#666',
            cursor: selected ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            minWidth: '180px',
            boxShadow: selected ? '0 0 20px rgba(0, 240, 255, 0.3)' : 'none',
            opacity: selected ? 1 : 0.6
          }}
          onMouseEnter={e => {
            if (selected) {
              e.currentTarget.style.background = '#33f3ff';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 240, 255, 0.4)';
            }
          }}
          onMouseLeave={e => {
            if (selected) {
              e.currentTarget.style.background = '#00f0ff';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 240, 255, 0.3)';
            }
          }}
        >
          Preview Questions
        </button>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default ChooseQuiz;