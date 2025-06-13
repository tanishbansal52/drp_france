import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Card, Spinner, Button } from 'react-bootstrap'
import NavBar from '../NavBar'
import { useNavigate, useLocation } from 'react-router-dom'
import TeacherButton from './TeacherButton';

function ShowAllQuestions() {
  const navigate = useNavigate()
  const location = useLocation()
  const quizId = location.state?.quizId
  const quizTitle = location.state?.quizTitle
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAnswers, setShowAnswers] = useState({})

  console.log('Quiz ID:', quizId)
  localStorage.setItem('quizId', quizId);

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      setError(null)

      const apiEndpoint = `https://drp-belgium.onrender.com/api/questions-data/${quizId}/`
      const res = await fetch(apiEndpoint)
      
      if (res.status === 404) {
        setQuestions([])
        setLoading(false)
        return
      }
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()

      if (!Array.isArray(data)) throw new Error('Invalid response format, expected an array')

      setQuestions(data)
    } catch (err) {
      console.error('Error fetching questions:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (quizId) {
      fetchQuestions()
    }
  }, [quizId])

  const toggleAnswer = (index) => {
    setShowAnswers(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const cleanQuizTitle = (title) => {
    if (!title) return 'Quiz Questions'
    return title.replace(/\s*\([^)]*\)\s*/g, '').trim()
  }

  const EmptyState = () => (
    <div className="text-center py-5">
      <h4 style={{ color: '#9ca3af' }}>No questions available yet</h4>
      <p style={{ color: '#6b7280' }}>Questions will appear here once added.</p>
    </div>
  )

  const QuestionCard = ({ question, index }) => (
    <div style={{
      background: 'rgba(30, 41, 59, 0.6)',
      border: '1px solid rgba(0, 217, 255, 0.3)',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '20px',
      backdropFilter: 'blur(10px)'
    }}>
      <div className="mb-3" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          background: 'rgba(0, 217, 255, 0.2)',
          color: '#00d9ff',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '16px',
          fontWeight: '600',
          border: '1px solid rgba(0, 217, 255, 0.3)'
        }}>
          Question {index + 1}
        </span>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minHeight: '36px' }}>
          {showAnswers[index] && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '8px',
              padding: '4px 10px',
              borderLeft: '4px solid #10b981',
              maxWidth: '300px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: 'flex', 
              alignItems: 'center',
              height: '32px'
            }}>
              <span style={{ fontSize: '14px', color: '#d1fae5', lineHeight: '1'  }}>
                {question.answer || 'No answer available.'}
              </span>
            </div>
          )}
          
          <button
            onClick={() => toggleAnswer(index)}
            style={{
              background: showAnswers[index] 
                ? 'rgba(100, 116, 139, 0.3)' 
                : 'rgba(0, 217, 255, 0.2)',
              color: showAnswers[index] ? '#94a3b8' : '#00d9ff',
              border: `1px solid ${showAnswers[index] 
                ? 'rgba(100, 116, 139, 0.5)' 
                : 'rgba(0, 217, 255, 0.5)'}`,
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (!showAnswers[index]) {
                e.target.style.background = 'rgba(0, 217, 255, 0.3)'
                e.target.style.boxShadow = '0 0 10px rgba(0, 217, 255, 0.2)'
              }
            }}
            onMouseLeave={(e) => {
              if (!showAnswers[index]) {
                e.target.style.background = 'rgba(0, 217, 255, 0.2)'
                e.target.style.boxShadow = 'none'
              }
            }}
          >
            {showAnswers[index] ? "HIDE ANSWER" : "SHOW ANSWER"}
          </button>
        </div>
      </div>
      
      <div className="mb-4" style={{ 
        fontSize: '16px', 
        lineHeight: '1.6', 
        whiteSpace: 'pre-wrap',
        color: '#e2e8f0'
      }}>
        {question.question_text}
      </div>
      
    </div>
  )

  return (
    <>
      <NavBar />
      
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '40px',
        padding: '30px 30px 0 30px'
      }}>
        <TeacherButton
          variant="outline-secondary"
          onClick={() => navigate('/teacher/choosequiz', { state: { quizId, quizTitle } })}
        >
          ← Back
        </TeacherButton>

        <div style={{ 
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center'
        }}>
          <h1 style={{ 
            fontSize: '32px',
            fontWeight: '700',
            color: '#00d9ff',
            marginBottom: '0',
            textShadow: '0 0 20px rgba(0, 217, 255, 0.3)',
            letterSpacing: '2px'
          }}>
            Mission: {cleanQuizTitle(quizTitle)}
          </h1>
          <p style={{
            color: '#9ca3af',
            fontSize: '15px',
            margin: '4px 0 0 0'
          }}>
            Review questions before starting the mission
          </p>
        </div>

        {questions.length > 0 && (
          <TeacherButton 
            variant="primary"
            onClick={() => navigate('/teacher/dashboard', { state: { quizTitle, quizId } })}
          >
            Continue →
          </TeacherButton>
        )}
      </div>
      
      {/* Question count moved to a better position */}
      {!loading && !error && questions.length > 0 && (
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '30px',
          padding: '0 30px'
        }}>
          <div style={{
            background: 'rgba(0, 217, 255, 0.1)',
            border: '1px solid rgba(0, 217, 255, 0.3)',
            borderRadius: '8px',
            padding: '8px 16px',
            display: 'inline-block'
          }}>
            <span style={{ 
              color: '#00d9ff',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {questions.length} questions
            </span>
          </div>
        </div>
      )}
      
      <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '1rem 0' }}>
        {loading && (
          <div className="text-center py-5">
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(0, 217, 255, 0.3)',
              borderTop: '3px solid #00d9ff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            <p style={{ color: '#9ca3af' }}>Loading questions...</p>
            <style>
              {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
          </div>
        )}

        {!loading && error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center',
            color: '#fca5a5'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {questions.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                {questions.map((question, index) => (
                  <QuestionCard key={index} question={question} index={index} />
                ))}
              </>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default ShowAllQuestions