import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Card, Spinner, Button } from 'react-bootstrap'
import NavBar from '../NavBar'
import { useNavigate, useParams} from 'react-router-dom'  
import { incrementRoomsCurrentStatus } from './utils/api'
import TeacherButton from './TeacherButton';


function DisplayQuestion() {
  const navigate = useNavigate()          
  const { roomCode } = useParams()
  // instead of individual topic/question/answer, keep the full list
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAnswer, setShowAnswer] = useState(false)
  
  const fetchQuestions = async () => {
    try {
      setLoading(true)
      setError(null)
      setShowAnswer(false)

      const res = await fetch('https://drp-belgium.onrender.com/api/questions')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()

      if (!Array.isArray(data)) {
        throw new Error('Invalid response format, expected an array')
      }

      setQuestions(data)
      setCurrentIndex(1)
    } catch (err) {
      console.error('Error fetching questions:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuestions()
  }, [])


  // grab the current question (or defaults)
  const current = questions[currentIndex] || {}
  const topic    = current.quiz || ''
  const question = current.question_text || ''
  const answer   = current.answer || 'No answer available.'

  const isLast = currentIndex === questions.length - 1
  
  const handleNext = async () => {
    setShowAnswer(false)
    setCurrentIndex(prev =>
      questions.length ? (prev + 1) % questions.length : 0
    )
    await incrementRoomsCurrentStatus(roomCode, currentIndex + 1)
  }

  const handleFinish = async () => {
    await incrementRoomsCurrentStatus(roomCode, currentIndex + 1)
    navigate('/finish')
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
                <h2 style={{ fontSize: '3rem', lineHeight: 1.2 }}>
                  {question}
                </h2>
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