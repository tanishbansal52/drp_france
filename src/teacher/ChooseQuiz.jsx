import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TeacherButton from './TeacherButton';
import '../css/Choosequiz.css';

function ChooseQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavourites, setShowFavourites] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  // Filter quizzes based on search term
  const filteredQuizzes = quizzes.filter(quiz =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter favorites based on search term
  const filteredFavorites = quizzes.filter(quiz =>
    quiz.is_favorite && quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/quizzes/');
      // Ensure each quiz has is_favorite property
      const quizzesWithFavorites = res.data.map(quiz => ({
        ...quiz,
        is_favorite: quiz.is_favorite || false
      }));
      setQuizzes(quizzesWithFavorites);
    } catch (err) {
      setError('Failed to fetch quizzes.');
      console.error(err);
    }
  };

  const handleSubmit = () => {
    const selectedQuiz = quizzes.find(q => q.title === selected);
    if (selectedQuiz) {
      console.log('Selected Quiz:', selectedQuiz.title);
      console.log('Quiz ID:', selectedQuiz.quiz_id);
      navigate('/teacher/allquestions', { 
        state: { 
          quizId: selectedQuiz.quiz_id, 
          quizTitle: selectedQuiz.title 
        } 
      });
    }
  };

  const toggleFavorite = async (quiz) => {
    if (isTogglingFavorite) return; // Prevent multiple clicks
    
    setIsTogglingFavorite(true);
    
    try {
      const res = await axios.post('http://localhost:8000/api/toggle-quiz-favourite/', {
        quiz_id: quiz.quiz_id
      });
      
      // Update the quiz in the local state immediately for better UX
      setQuizzes(prevQuizzes => 
        prevQuizzes.map(q => 
          q.quiz_id === quiz.quiz_id 
            ? { ...q, is_favorite: !q.is_favorite }
            : q
        )
      );
      
    } catch (err) {
      console.error('Error toggling favourite:', err);
      setError('Failed to update favorite status.');
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  // Determine which quizzes to show
  const quizzesToShow = showFavourites ? filteredFavorites : filteredQuizzes;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
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
        marginBottom: '30px',
      }}>
        Choose Mission:
      </h2>

      <input
        type="text"
        placeholder="Search by title..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{
          width: '100%',
          padding: '12px 16px',
          marginBottom: '20px',
          fontSize: '16px',
          borderRadius: '8px',
          border: '1px solid #ccc',
          background: '#111',
          color: '#aefeff',
          outline: 'none',
          boxShadow: 'inset 0 0 5px rgba(0, 240, 255, 0.2)'
        }}
      />

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px' 
      }}>
        <button
          onClick={() => setShowFavourites(prev => !prev)}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            borderRadius: '6px',
            border: showFavourites ? '2px solid #ffd700' : '1px solid #00f0ff',
            background: showFavourites ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
            color: showFavourites ? '#ffd700' : '#aefeff',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          {showFavourites ? '⭐ Showing Favorites' : 'Show Favorites'}
        </button>
        
        {showFavourites && (
          <div style={{ 
            fontSize: '14px', 
            color: '#999',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <span>⭐</span>
            <span>{filteredFavorites.length} favorite{filteredFavorites.length !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '40px' }}>
        {quizzesToShow.map((quiz, index) => (
          <label
            key={index}
            className='quiz-option'
            style={{
              background: selected === quiz.title 
                ? 'rgba(0, 240, 255, 0.1)' 
                : 'rgba(255, 255, 255, 0.05)',
              border: selected === quiz.title 
                ? '2px solid rgba(0, 240, 255, 0.5)' 
                : '2px solid transparent',
              boxShadow: selected === quiz.title
                ? '0 0 20px rgba(0, 240, 255, 0.2)'
                : '0 4px 6px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              padding: '20px',
              marginBottom: '15px',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative'
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
              onChange={() => {setSelected(quiz.title)}}
              style={{
                width: '20px',
                height: '20px',
                marginRight: '20px',
                accentColor: '#00f0ff',
                cursor: 'pointer',
                transform: 'scale(1.2)',
              }}
            />
            
            <div style={{
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

            <div
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await toggleFavorite(quiz);
              }}
              title={quiz.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
              style={{
                cursor: isTogglingFavorite ? 'wait' : 'pointer',
                marginLeft: '15px',
                fontSize: '24px',
                padding: '8px',
                borderRadius: '50%',
                transition: 'all 0.3s ease',
                background: quiz.is_favorite ? 'rgba(255, 215, 0, 0.1)' : 'rgba(174, 254, 255, 0.1)',
                border: quiz.is_favorite ? '2px solid rgba(255, 215, 0, 0.3)' : '2px solid rgba(174, 254, 255, 0.2)',
                color: quiz.is_favorite ? '#ffd700' : '#aefeff',
                textShadow: quiz.is_favorite ? '0 0 10px rgba(255, 215, 0, 0.5)' : '0 0 5px rgba(174, 254, 255, 0.3)',
                opacity: isTogglingFavorite ? 0.6 : 1,
                transform: quiz.is_favorite ? 'scale(1.1)' : 'scale(1)',
              }}
              onMouseEnter={e => {
                if (!isTogglingFavorite) {
                  e.currentTarget.style.transform = quiz.is_favorite ? 'scale(1.2)' : 'scale(1.1)';
                  e.currentTarget.style.background = quiz.is_favorite ? 'rgba(255, 215, 0, 0.2)' : 'rgba(174, 254, 255, 0.2)';
                  e.currentTarget.style.borderColor = quiz.is_favorite ? 'rgba(255, 215, 0, 0.5)' : 'rgba(174, 254, 255, 0.4)';
                }
              }}
              onMouseLeave={e => {
                if (!isTogglingFavorite) {
                  e.currentTarget.style.transform = quiz.is_favorite ? 'scale(1.1)' : 'scale(1)';
                  e.currentTarget.style.background = quiz.is_favorite ? 'rgba(255, 215, 0, 0.1)' : 'rgba(174, 254, 255, 0.1)';
                  e.currentTarget.style.borderColor = quiz.is_favorite ? 'rgba(255, 215, 0, 0.3)' : 'rgba(174, 254, 255, 0.2)';
                }
              }}
            >
              {quiz.is_favorite ? '⭐' : '☆'}
            </div>
          </label>
        ))}
        
        {quizzesToShow.length === 0 && (
          <div style={{ 
            color: '#888', 
            fontSize: '16px', 
            textAlign: 'center',
            padding: '40px 0'
          }}>
            {showFavourites 
              ? (searchTerm ? 'No favorite quizzes match your search.' : 'No favorite quizzes yet.')
              : 'No quizzes match your search.'
            }
          </div>
        )}        
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