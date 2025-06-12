import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Card, Spinner, Button } from 'react-bootstrap'
import NavBar from '../NavBar'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { incrementRoomsCurrentStatus } from './utils/api'
import TeacherButton from './TeacherButton';
import axios from 'axios';


function DisplayQuestion() {
  const location = useLocation();
  const quizId = location.state?.quizId 
  console.log('Quiz ID LAST:', quizId)
  const navigate = useNavigate()
  const { roomCode } = useParams()
  // instead of individual topic/question/answer, keep the full list
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [spinoffMode, setSpinoffMode] = useState(false)


  const [groupsFinished, setGroupsFinished] = useState([])
  const [totalGroups, setTotalGroups] = useState(0)
  const [groupsLoading, setGroupsLoading] = useState(false)
  const [groupsError, setGroupsError] = useState(null)

  const fetchGroupsFinished = async () => {
    // Fetches groups that have finished the current question
    // Updates state with finished groups and total count
    try {
      setGroupsError(null)
      const resp = await axios.get(`https://drp-belgium.onrender.com/api/groups-finished-question/${roomCode}/${currentIndex + 1}/`)
      if (resp.status !== 200) {
        throw new Error(`HTTP ${resp.status}`)
      }
      console.log('Groups finished response:', resp.data)

      setGroupsFinished(resp.data.finished_groups || [])
      setTotalGroups(resp.data.total_groups || 0)
    }
    catch (err) {
      console.error('Error fetching groups:', err)
      console.error(err.message)
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
      const apiEndpoint = `http://localhost:8000/api/questions-data/${quizId}/`
      // const apiEndpoint = `https://drp-belgium.onrender.com/api/questions-data/${quizId}/`
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
Whats the value of y?
Team Beta (2 students):
Use the same x in a different code line:
z = 5x - 6
Whats the value of z?
Once both teams have their answers, combine them:
Final Code for Level 2: y + z = ?`,
    answer: '35',
    points: 10
  }

  const toggleSpinoffMode = async (mode) => {
    setSpinoffMode(mode)
    try {
      const resp = await axios.post(`http://localhost:8000/api/toggle-spinoff/${roomCode}/`, {
      // const resp = await axios.post(`https://drp-belgium.onrender.com/api/toggle-spinoff/${roomCode}/`, {
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

  const isLast = currentIndex === questions.length - 1

  const handleNext = async () => {
    setShowAnswer(false)
    toggleSpinoffMode(false)
    setCurrentIndex(currentIndex + 1)
    await incrementRoomsCurrentStatus(roomCode, currentIndex + 2)
  }

  const handleFinish = async () => {
    await incrementRoomsCurrentStatus(roomCode, currentIndex + 2)
    navigate('/teacher/finish', {state: { roomCode }})
  }

  const handleSpinOff = async () => {
    setShowAnswer(false)
    toggleSpinoffMode(true)
  }

  return (
    <>
      <NavBar />
      <div className="bg-primary text-white text-center py-3 mb-4">
        <h1 className="m-0 display-5">{topic}</h1>
      </div>
      <Container className="d-flex justify-content-center align-items-center min-vh-80">
        <Card className="shadow-lg p-5 text-center w-100">
          <Card.Body>
            {loading && <Spinner animation="border" variant="light" />}
            {!loading && error && <p className="text-danger">{error}</p>}
            {!loading && !error && (
              <>

                <h5 style={{ fontSize: '2rem', lineHeight: 1.2, whiteSpace: 'pre-wrap' }}>
                  {question}
                </h5>


                {/* Finished Groups Display */}
                {groupsLoading ? (
                  <Spinner animation="border" variant="secondary" />
                ) : groupsError ? (
                  <p className="text-danger">{groupsError}</p>
                ) : (
                  <Card className="mt-3 p-3 text-start"> 
                  <h4 className="text-info mt-3">
                    {groupsFinished.length}/{totalGroups} groups finished
                  </h4>
                    <h5 className="mb-3">Groups that finished:</h5>
                    {groupsFinished.length === 0 ? (
                      <p className="text-light">No groups have submitted yet.</p>
                    ) : (
                      <ul className="list-unstyled">
                        {groupsFinished.map((group, idx) => (
                          <li key={idx} className="mb-2 text-light">
                            <strong>{group.group_name}</strong> ({group.student_names.join(', ')})
                          </li>
                        ))}
                      </ul>
                    )}
                  </Card>
                )}

                {showAnswer && (
                  <p
                    className="mt-3 text-success"
                    style={{ fontSize: '1.5rem', fontWeight: 500 }}
                  >
                    Answer: {answer}
                  </p>
                )}
                <div className="mt-4 d-flex justify-content-center gap-3">
                  <TeacherButton
                    variant="light"
                    onClick={() => setShowAnswer(v => !v)}
                  >
                    {showAnswer ? 'Hide Answer' : 'Show Answer'}
                  </TeacherButton>

                  <TeacherButton variant="light" onClick={handleSpinOff}>
                      SpinOff Question
                    </TeacherButton>
                  {isLast
                    ? <TeacherButton variant="light" onClick={handleFinish}>
                      Finish Quiz
                    </TeacherButton>
                    : <TeacherButton variant="light" onClick={handleNext}>
                      Next Question
                    </TeacherButton>
                  }
                </div>
              </>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  )
}

export default DisplayQuestion