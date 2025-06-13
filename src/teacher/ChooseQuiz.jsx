import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TeacherButton from './TeacherButton';
import soundEffectsService from '../SoundEffectsService';
import '../css/Choosequiz.css';

function ChooseQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavourites, setShowFavourites] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [hoveredQuiz, setHoveredQuiz] = useState(null);

  // Clean title by removing difficulty indicators
  const cleanTitle = (title) => {
    return title
      .replace(/\s*\([^)]*\)\s*/g, ' ') // Remove anything in parentheses
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim(); // Remove leading/trailing spaces
  };

  // Filter quizzes based on search term
  const filteredQuizzes = quizzes.filter(quiz =>
    cleanTitle(quiz.title).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter favourites based on search term
  const filteredFavorites = quizzes.filter(quiz =>
    quiz.is_favorite && cleanTitle(quiz.title).toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      // const res = await axios.get('http://localhost:8000/api/quizzes/');
      const res = await axios.get('https://drp-belgium.onrender.com/api/quizzes/');
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

  const handlePreview = (quiz) => {
    soundEffectsService.playClick();

    console.log('Selected Quiz:', quiz.title);
    console.log('Quiz ID:', quiz.quiz_id);
    navigate('/teacher/allquestions', { 
      state: { 
        quizId: quiz.quiz_id, 
        quizTitle: quiz.title 
      } 
    });
  };

  const toggleFavorite = async (quiz) => {
    if (isTogglingFavorite) return; // Prevent multiple clicks

    setIsTogglingFavorite(true);

    try {
      // const res = await axios.post('http://localhost:8000/api/toggle-quiz-favourite/', {
      const res = await axios.post('https://drp-belgium.onrender.com/api/toggle-quiz-favourite/', {
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
      setError('Failed to update favourite status.');
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  // Determine which quizzes to show
  const quizzesToShow = showFavourites ? filteredFavorites : filteredQuizzes;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getDifficultyBg = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'rgba(16, 185, 129, 0.1)';
      case 'medium': return 'rgba(245, 158, 11, 0.1)';
      case 'hard': return 'rgba(239, 68, 68, 0.1)';
      default: return 'rgba(107, 114, 128, 0.1)';
    }
  };

  if (error) {
    return (
      <div style={{
        padding: '30px',
        textAlign: 'center',
        color: '#ef4444',
        fontSize: '18px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        background: 'rgba(239, 68, 68, 0.1)',
        borderRadius: '12px',
        margin: '20px auto',
        maxWidth: '600px'
      }}>
        ⚠️ {error}
      </div>
    );
  }

  if (!quizzes.length) {
    return (
      <div style={{
        padding: '60px 30px',
        textAlign: 'center',
        color: '#d1d5db',
        fontSize: '18px',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ marginBottom: '20px' }}>Loading missions...</div>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid rgba(209, 213, 219, 0.2)',
          borderTop: '4px solid #00d9ff',
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
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      minHeight: '100vh'
    }}>
      {/* Header with Back Button and Favourites Button */}
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '30px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TeacherButton
            onClick={() => navigate('/teacher')}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '600',
              borderRadius: '8px',
              border: '2px solid rgba(75, 85, 99, 0.4)',
              background: 'rgba(17, 24, 39, 0.8)',
              color: '#d1d5db',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(17, 24, 39, 0.9)';
              e.currentTarget.style.borderColor = 'rgba(75, 85, 99, 0.6)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(17, 24, 39, 0.8)';
              e.currentTarget.style.borderColor = 'rgba(75, 85, 99, 0.4)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            ← Back
          </TeacherButton>
        </div>

        <div style={{ 
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <h1 style={{ 
            fontSize: '32px',
            fontWeight: '700',
            color: '#00d9ff',
            marginBottom: '8px',
            textShadow: '0 0 20px rgba(0, 217, 255, 0.3)',
            letterSpacing: '2px',
            margin: '0'
          }}>
            Choose Mission
          </h1>
          <p style={{
            color: '#9ca3af',
            fontSize: '15px',
            margin: '4px 0 0 0'
          }}>
            Select a quiz to preview questions
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TeacherButton
            onClick={() => setShowFavourites(prev => !prev)}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '600',
              borderRadius: '8px',
              border: showFavourites ? '2px solid #fbbf24' : '2px solid rgba(75, 85, 99, 0.4)',
              background: showFavourites ? 'rgba(251, 191, 36, 0.15)' : 'rgba(17, 24, 39, 0.8)',
              color: showFavourites ? '#fbbf24' : '#d1d5db',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              minWidth: '180px', // Add fixed width to prevent layout shift
              textAlign: 'center'
            }}
            onMouseEnter={e => {
              if (!showFavourites) {
                e.currentTarget.style.background = 'rgba(17, 24, 39, 0.9)';
                e.currentTarget.style.borderColor = 'rgba(75, 85, 99, 0.6)';
              }
            }}
            onMouseLeave={e => {
              if (!showFavourites) {
                e.currentTarget.style.background = 'rgba(17, 24, 39, 0.8)';
                e.currentTarget.style.borderColor = 'rgba(75, 85, 99, 0.4)';
              }
            }}
          >
            {showFavourites ? '⭐ Favourites Active' : '☆ Show Favourites'}
          </TeacherButton>
        </div>
        
      </div>

      {/* Search Bar - Centered and Smaller Width */}
      <div style={{ 
        marginBottom: '40px',
        marginTop: '40px',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            width: '800px',
            maxWidth: '100%',
            padding: '16px 20px',
            fontSize: '15px',
            borderRadius: '12px',
            border: '2px solid rgba(75, 85, 99, 0.3)',
            background: 'rgba(17, 24, 39, 0.8)',
            color: '#f9fafb',
            outline: 'none',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
          }}
          onFocus={e => {
            e.currentTarget.style.borderColor = '#00d9ff';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 217, 255, 0.1)';
          }}
          onBlur={e => {
            e.currentTarget.style.borderColor = 'rgba(75, 85, 99, 0.3)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* Quiz Tiles Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '28px',
        marginBottom: '40px'
      }}>
        {quizzesToShow.map((quiz, index) => (
          <div
            key={quiz.quiz_id}
            style={{
              background: 'rgba(17, 24, 39, 0.8)',
              border: '2px solid rgba(75, 85, 99, 0.2)',
              borderRadius: '16px',
              padding: '24px',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              cursor: 'pointer'
            }}
            onMouseEnter={e => {
              setHoveredQuiz(quiz.quiz_id);
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(75, 85, 99, 0.4)';
            }}
            onMouseLeave={e => {
              setHoveredQuiz(null);
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'rgba(75, 85, 99, 0.2)';
            }}
            onClick={() => handlePreview(quiz)}
          >
            {/* Favorite Button */}
            <div
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await toggleFavorite(quiz);
              }}
              title={quiz.is_favorite ? 'Remove from favourites' : 'Add to favourites'}
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                cursor: isTogglingFavorite ? 'wait' : 'pointer',
                fontSize: '18px',
                padding: '6px',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                background: quiz.is_favorite ? 'rgba(251, 191, 36, 0.15)' : 'rgba(75, 85, 99, 0.1)',
                border: quiz.is_favorite ? '1px solid rgba(251, 191, 36, 0.3)' : '1px solid rgba(75, 85, 99, 0.2)',
                color: quiz.is_favorite ? '#fbbf24' : '#9ca3af',
                opacity: isTogglingFavorite ? 0.6 : 1,
              }}
              onMouseEnter={e => {
                if (!isTogglingFavorite) {
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.background = quiz.is_favorite ? 'rgba(251, 191, 36, 0.25)' : 'rgba(75, 85, 99, 0.2)';
                }
              }}
              onMouseLeave={e => {
                if (!isTogglingFavorite) {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.background = quiz.is_favorite ? 'rgba(251, 191, 36, 0.15)' : 'rgba(75, 85, 99, 0.1)';
                }
              }}
            >
              {quiz.is_favorite ? '⭐' : '☆'}
            </div>

            {/* Quiz Title */}
            <div style={{
              fontSize: '20px',
              color: '#f9fafb',
              fontWeight: '600',
              marginBottom: '40px',
              marginRight: '40px', // Space for favourite button
              lineHeight: '1.3',
              flex: '1'
            }}>
              {cleanTitle(quiz.title)}
            </div>

            {/* Quiz Details - Difficulty and Time stacked */}
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '12px',
              position: 'relative',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '16px',
                background: getDifficultyBg(quiz.difficulty),
                border: `1px solid ${getDifficultyColor(quiz.difficulty)}30`,
                alignSelf: 'flex-start'
              }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: getDifficultyColor(quiz.difficulty)
                }}></div>
                <span style={{
                  fontSize: '14px',
                  color: getDifficultyColor(quiz.difficulty),
                  fontWeight: '600',
                  textTransform: 'capitalize'
                }}>
                  {quiz.difficulty}
                </span>
              </div>
              
              <div style={{
                fontSize: '14px',
                display: 'inline-flex', // Change from 'flex'
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px', // Add this
                borderRadius: '16px', // Add this
                background: 'rgba(75, 85, 99, 0.1)', // Add this
                border: '1px solid rgba(75, 85, 99, 0.2)', // Add this
                color: '#9ca3af',
                alignSelf: 'flex-start' // Add this to match difficulty
              }}>
                <span>⏱️</span>
                <span style={{ color: '#d1d5db', fontWeight: '500' }}>
                  {quiz.total_time} min
                </span>
              </div>

              {/* Preview Arrow - Positioned absolutely to avoid layout shift */}
              <div style={{
                position: 'absolute',
                top: '90%',
                right: '-15px',
                transform: 'translateY(-50%)',
                opacity: hoveredQuiz === quiz.quiz_id ? 1 : 0,
                transition: 'all 0.3s ease',
                pointerEvents: 'none'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  background: 'rgba(0, 217, 255, 0.15)',
                  borderRadius: '50%',
                  border: '1px solid rgba(0, 217, 255, 0.3)',
                  color: '#00d9ff',
                  fontSize: '16px',
                  fontWeight: '600'
                }}>
                  →
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {quizzesToShow.length === 0 && (
        <div style={{ 
          color: '#6b7280', 
          fontSize: '16px', 
          textAlign: 'center',
          padding: '60px 20px',
          background: 'rgba(17, 24, 39, 0.6)',
          borderRadius: '16px',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>
            {showFavourites ? '⭐' : '🔍'}
          </div>
          {showFavourites 
            ? (searchTerm ? 'No favourite missions match your search.' : 'No favourite missions yet. Star some missions to see them here!')
            : 'No missions match your search. Try a different term.'
          }
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default ChooseQuiz;