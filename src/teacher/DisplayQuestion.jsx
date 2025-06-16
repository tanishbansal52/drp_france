import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Card, Spinner, Button } from 'react-bootstrap'
import NavBar from '../NavBar'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { incrementRoomsCurrentStatus } from './utils/api'
import TeacherButton from './TeacherButton';
import axios from 'axios';
import RobotQuestion1 from '../student/robotHardCoded/RobotQuestion1'
import RobotQuestion2 from '../student/robotHardCoded/RobotQuestion2'

function DisplayQuestion() {
  const location = useLocation();
  const quizId = location.state?.quizId
  console.log('Quiz ID LAST:', quizId)
  const navigate = useNavigate()
  const { roomCode } = useParams()
  // instead of individual topic/question/answer, keep the full list
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  console.log('Current Index:', currentIndex)
  const isRobotQuestion1 = quizId == "16" && currentIndex === 0
  const isRobotQuestion2 = quizId == "16" && currentIndex === 1
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [spinoffMode, setSpinoffMode] = useState(false)
  const [spinoffUsed, setSpinoffUsed] = useState(false) 
  const [showEndQuizModal, setShowEndQuizModal] = useState(false)
    

  const [groupsFinished, setGroupsFinished] = useState([])
  const [totalGroups, setTotalGroups] = useState(0)
  const [groupsLoading, setGroupsLoading] = useState(false)
  const [groupsError, setGroupsError] = useState(null)

  

  const fetchGroupsFinished = async () => {
    // Fetches groups that have finished the current question
    // Updates state with finished groups and total count
    try {
      setGroupsError(null)

      const currentQuestionId = questions[currentIndex]?.question_id;
      console.log('Current Question ID:', currentQuestionId)
      if (!currentQuestionId) return;
      const resp = await axios.get(`https://drp-belgium.onrender.com/api/groups-finished-question/${roomCode}/${currentQuestionId}/`)

      if (resp.status !== 200) {
        throw new Error(`HTTP ${resp.status}`)
      }
      console.log('Groups finished response:', resp.data)

      setGroupsFinished(resp.data.finished_groups || [])
      setTotalGroups(resp.data.total_groups || 0)
    }
    catch (err) {
      console.error('Error fetching groups:', err)
      console.error(err.error)
      setGroupsError(err.message)
    }
    finally {
      setGroupsLoading(false)
    }
  }

  useEffect(() => {
    if (questions.length === 0) return

    fetchGroupsFinished() // Initial fetch
    const interval = setInterval(fetchGroupsFinished, 2000) // Poll every 2 seconds

    return () => clearInterval(interval) // Cleanup
  }, [roomCode, currentIndex, questions])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      setError(null)
      setShowAnswer(false)

      // const res = await fetch('https://drp-belgium.onrender.com/api/questions')
      // const apiEndpoint = `http://localhost:8000/api/questions-data/${quizId}/`
      const apiEndpoint = `https://drp-belgium.onrender.com/api/questions-data/${quizId}/`
      const res = await fetch(apiEndpoint)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()

      if (!Array.isArray(data)) {
        throw new Error('Invalid response format, expected an array')
      }

      setQuestions(data)
      setCurrentIndex(0)
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

  const spinoffQuestion = {
    quiz: 'Spinoff Question',
    question_text: `Split into two decoding teams. Each team has one half of a 2-part access code. Use your value of x from Level 1.
Team Alpha (2 students):
Plug x into the equation:
y = 3x + 2
What's the value of y?
Team Beta (2 students):
Use the same x in a different code line:
z = 5x - 6
What's the value of z?
Once both teams have their answers, combine them:
Final Code for Level 2: y + z = ?`,
    answer: '35',
    points: 10
  }

  const toggleSpinoffMode = async (mode) => {
    setSpinoffMode(mode)
    if (mode) {
      setSpinoffUsed(true)  // When enabling spinoff mode, mark it as used
    }
    try {
      const resp = await axios.post(`https://drp-belgium.onrender.com/api/toggle-spinoff/${roomCode}/`, {
        spinoff_mode: mode
      })
      console.log('Spinoff toggle response:', resp.data)
    }
    catch (err) {
      console.error('Error in spinoff toggle:', err)
      setError('Failed in spinoff toggle.')
    }
  }

  // grab the current question (or defaults)
  const current = spinoffMode ? spinoffQuestion : questions[currentIndex] || {}
  const topic = current.quiz || ''
  const question = current.question_text || ''
  const answer = current.answer || 'No answer available.'

  const MAX_INDEX = 1

  const isLast = currentIndex >= MAX_INDEX

  const handleNext = async () => {
    setShowAnswer(false)
    toggleSpinoffMode(false)
    if (currentIndex < MAX_INDEX) {
      setCurrentIndex(currentIndex + 1)
      await incrementRoomsCurrentStatus(roomCode, currentIndex + 2)
    }
  }

  const handleFinish = async () => {
    await incrementRoomsCurrentStatus(roomCode, currentIndex + 2)
    navigate('/teacher/finish', { state: { roomCode } })
  }

  const handleSpinOff = async () => {
    setShowAnswer(false)
    toggleSpinoffMode(true)
  }

  const handleEndQuiz = () => {
    navigate('/')
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <NavBar />
      
      {/* Header */}
      <div style={{ 
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        marginBottom: '60px',
        padding: '20px 30px 0 30px',
        position: 'relative'
      }}>

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
            letterSpacing: '2px',
            whiteSpace: 'nowrap'
          }}>
            Mission: {(topic || 'Error Loading Topic').replace(/\s*\([^)]*\)/g, '')}
          </h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          {/* Division X Logo */}
          <div 
            className="division-x-logo"
            onClick={() => setShowEndQuizModal(true)}
            style={{ cursor: 'pointer' }}
          >
            Division X
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '0 30px 20px 30px'
      }}>
        <div style={{
          background: 'rgba(30, 41, 59, 0.6)',
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '1200px',
          width: '100%',
          position: 'relative',
          border: '1px solid rgba(0, 217, 255, 0.3)',
          backdropFilter: 'blur(10px)'
        }}>
          {loading && (
            <div style={{ textAlign: 'center' }}>
              <Spinner animation="border" variant="info" />
            </div>
          )}
          
          {!loading && error && (
            <p style={{ color: '#ff4444', textAlign: 'center', fontSize: '1.2rem' }}>
              {error}
            </p>
          )}
          
          {!loading && !error && (
            <>
              {/* Show Answer Button in top right of question box */}
               <div style={{ 
              position: 'absolute', 
              top: '20px', 
              right: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              {showAnswer && (
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
                  <span style={{ fontSize: '14px', color: '#d1fae5', lineHeight: '1' }}>
                    {answer}
                  </span>
                </div>
              )}
              <TeacherButton
                onClick={() => setShowAnswer(v => !v)}
                style={{
                  background: showAnswer 
                    ? 'rgba(100, 116, 139, 0.3)' 
                    : 'rgba(0, 217, 255, 0.2)',
                  color: showAnswer ? '#94a3b8' : '#00d9ff',
                  border: `1px solid ${showAnswer 
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
                  if (!showAnswer) {
                    e.target.style.background = 'rgba(0, 217, 255, 0.3)'
                    e.target.style.boxShadow = '0 0 10px rgba(0, 217, 255, 0.2)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!showAnswer) {
                    e.target.style.background = 'rgba(0, 217, 255, 0.2)'
                    e.target.style.boxShadow = 'none'
                  }
                }}
              >
                {showAnswer ? "HIDE ANSWER" : "SHOW ANSWER"}
              </TeacherButton>
            </div>

              {/* Question Header - Added to match ShowAllQuestions */}
              <div className="mb-3" style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '16px' 
              }}>
                <span style={{
                  background: 'rgba(0, 217, 255, 0.2)',
                  color: '#00d9ff',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '16px',
                  fontWeight: '600',
                  border: '1px solid rgba(0, 217, 255, 0.3)'
                }}>
                  Question {currentIndex + 1}
                </span>
              </div>

              {/* Question Content */}
              {isRobotQuestion1 ? <RobotQuestion1/> : isRobotQuestion2? <RobotQuestion2/> : (<div style={{ 
                fontSize: '20px', 
                lineHeight: '1.6', 
                marginBottom: '30px',
                marginTop: '20px',
                whiteSpace: 'pre-wrap',
                color: '#f0f4f8',
                textAlign: 'center',
                padding: '0 60px',
                maxWidth: '1000px', 
                margin: '20px auto 30px',
                fontWeight: '500'
  
              }}>
                {question}
              </div>
              )}

              {/* Bottom Row with Groups Progress (left) and Buttons (right) */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', // Changed from flex-end to space-between
                alignItems: 'center',
                marginTop: '30px' // Added margin to separate from question content
              }}>
                {/* Groups Progress - Moved to bottom left */}
                <div style={{
                  background: 'rgba(0, 217, 255, 0.05)',
                  borderRadius: '10px',
                  padding: '12px 20px',
                  maxWidth: '500px',
                  minWidth: '350px',
                  width: '45%'
                }}>
                  <h4 style={{ 
                    color: '#00d9ff', 
                    marginBottom: '8px',
                    fontSize: '18px',
                    fontWeight: '600'
                  }}>
                    {groupsLoading ? (
                      <Spinner animation="border" size="sm" variant="info" />
                    ) : (
                      `${groupsFinished.length}/${totalGroups} groups finished`
                    )}
                  </h4>
                  
                  {groupsFinished.length === 0 ? (
                    <div style={{ color: '#6b7280', fontSize: '14px' }}>
                      No groups have submitted yet.
                    </div>
                  ) : (
                    <div style={{ 
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '10px',
                      fontSize: '15px'
                    }}>
                      {groupsFinished.map((group, idx) => (
                        <div key={idx} style={{ 
                          background: 'rgba(0, 217, 255, 0.1)',
                          padding: '8px 14px',
                          borderRadius: '5px',
                          border: '1px solid rgba(0, 217, 255, 0.2)',
                          color: '#00d9ff',
                          fontWeight: '500'
                        }}>
                          {group.group_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Right Buttons */}
                <div style={{ 
                  display: 'flex', 
                  gap: '15px',
                  alignItems: 'center'
                }}>
                  <TeacherButton
                    onClick={handleSpinOff}
                    disabled={spinoffUsed}
                    style={{
                      background: spinoffUsed 
                        ? 'rgba(100, 116, 139, 0.3)' 
                        : 'rgba(0, 217, 255, 0.2)',
                      color: spinoffUsed ? '#94a3b8' : '#00d9ff',
                      border: `1px solid ${spinoffUsed 
                        ? 'rgba(100, 116, 139, 0.5)' 
                        : 'rgba(0, 217, 255, 0.5)'}`,
                      padding: '10px 20px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: spinoffUsed ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!spinoffUsed) {
                        e.target.style.background = 'rgba(0, 217, 255, 0.3)'
                        e.target.style.boxShadow = '0 0 10px rgba(0, 217, 255, 0.2)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!spinoffUsed) {
                        e.target.style.background = 'rgba(0, 217, 255, 0.2)'
                        e.target.style.boxShadow = 'none'
                      }
                    }}
                  >
                    SPINOFF
                  </TeacherButton>

                  {!loading && !error && (
                      isLast ? (
                        <TeacherButton
                          onClick={handleFinish}
                          style={{
                            background: 'rgba(0, 217, 255, 0.2)',
                            color: '#00d9ff',
                            border: '1px solid rgba(0, 217, 255, 0.5)',
                            padding: '10px 20px',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          FINISH →
                        </TeacherButton>
                      ) : (
                        <TeacherButton
                          onClick={handleNext}
                          style={{
                            background: 'rgba(0, 217, 255, 0.2)',
                            color: '#00d9ff',
                            border: '1px solid rgba(0, 217, 255, 0.5)',
                            padding: '10px 20px',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          NEXT →
                        </TeacherButton>
                      )
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* End Quiz Modal */}
      {showEndQuizModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#1a1a2e',
            border: '2px solid #00ff88',
            borderRadius: '15px',
            padding: '30px',
            textAlign: 'center',
            minWidth: '300px'
          }}>
            <h3 style={{ color: '#00ff88', marginBottom: '20px' }}>
              Are you sure you want to end the quiz?
            </h3>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
              <TeacherButton
                onClick={handleEndQuiz}
                style={{
                  background: '#ff4444',
                  border: 'none',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                YES, END QUIZ
              </TeacherButton>
              <TeacherButton
                onClick={() => setShowEndQuizModal(false)}
                style={{
                  background: 'transparent',
                  border: '2px solid #00ff88',
                  color: '#00ff88',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                CANCEL
              </TeacherButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DisplayQuestion